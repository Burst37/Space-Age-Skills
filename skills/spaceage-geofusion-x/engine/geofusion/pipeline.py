"""Durable end-to-end job: Maps -> filter -> website verification -> audit -> social -> scores -> exports.

Each stage writes a checkpoint per item, so re-running the same job id resumes instead of repeating work.
"""
import json
import re
import socket
import time
from pathlib import Path
from . import maps, scoring, social, web
from .core import Store, domain, now
from .router import Judge, category_relevance, registry, route

DIRECTORY_HOSTS = ('yelp.com', 'facebook.com', 'nextdoor.com', 'bbb.org', 'yellowpages.com', 'mapquest.com', 'angi.com', 'homeadvisor.com', 'thumbtack.com',
                   'porch.com', 'manta.com', 'chamberofcommerce.com', 'buildzoom.com', 'lawnstarter.com', 'instagram.com', 'linkedin.com', 'google.com',
                   'bing.com', 'apple.com', 'youtube.com', 'tiktok.com', 'pinterest.com', 'x.com', 'twitter.com', 'alignable.com', 'birdeye.com', 'n49.com',
                   'cylex.us.com', 'hotfrog.com', 'superpages.com', 'citysearch.com', 'dexknows.com', 'merchantcircle.com', 'local.com', 'brownbook.net',
                   'ezlocal.com', 'yahoo.com', 'groupon.com', 'networx.com', 'expertise.com', 'threebestrated.com', 'bizapedia.com', 'opencorporates.com',
                   'mapcarta.com', 'waze.com', 'trustpilot.com', 'houzz.com', 'greenpal.com', 'taskrabbit.com', 'craigslist.org', 'squareup.com')


def street_of(address): return (address or '').split(',')[0].strip()


GENERIC = {'lawn', 'lawns', 'care', 'landscaping', 'landscape', 'landscapes', 'services', 'service', 'general', 'home', 'yard', 'tx', 'texas',
           'the', 'llc', 'inc', 'and', 'company', 'pros', 'pro', 'tree', 'trees', 'garden', 'gardens', 'maintenance', 'mowing', 'property', 'dallas', 'mesquite'}


def owned_by(url, name):
    """An owned site's domain carries a distinctive name token; listings/directories host many businesses and do not."""
    label = domain(url).rsplit('.', 1)[0].replace('-', '').replace('.', '')
    tokens = [t for t in social.norm_name(name) if len(t) >= 4 and t not in GENERIC]
    return bool(tokens) and any(t in label for t in tokens)


def is_directory(url): return any(domain(url) == h or domain(url).endswith('.' + h) for h in DIRECTORY_HOSTS)


def domain_guesses(name):
    base = ''.join(t for t in re.sub(r"[^a-z0-9 ]", '', (name or '').lower().replace("'", '')).split())
    return [f'{base}{suffix}' for suffix in ('.com', '.net', 'tx.com')] if base else []


def verify_no_website(biz, city, state, search=social.exa_search, fetcher=web.fetch_static):
    """For Maps listings without a website: domain guesses + Agent Reach Exa search. Returns state + evidence.
    States: website_exists | verified_no_owned_domain_found | uncertain."""
    phone, evidence = web.digits(biz.get('phone')), []
    for host in domain_guesses(biz.get('name')):
        try:
            socket.getaddrinfo(host, 443)
            r = fetcher('https://' + host)
            if phone and phone in re.sub(r'\D', '', r['html']): return {'verified': 'website_exists', 'url': r['final_url'], 'evidence': f'domain guess {host} shows Maps phone'}
            evidence.append(f'{host} resolves but Maps phone absent')
        except Exception: evidence.append(f'{host}: no site')
    try:
        res = search(f'"{biz.get("name")}" {city} {state}', 8)
    except Exception as e:
        return {'verified': 'uncertain', 'url': '', 'evidence': '; '.join(evidence + [f'search unavailable: {str(e)[:120]}'])}
    about_biz = [h for h in res['results'] if phone and phone in re.sub(r'\D', '', h['text'])]
    for h in res['results']:
        if not is_directory(h['url']) and owned_by(h['url'], biz.get('name')) and phone and phone in re.sub(r'\D', '', h['text']):
            return {'verified': 'website_exists', 'url': h['url'], 'evidence': f'search result {domain(h["url"])} shows Maps phone'}
    if about_biz:
        return {'verified': 'verified_no_owned_domain_found', 'url': '', 'evidence': '; '.join(evidence + [f'search found {len(about_biz)} listing(s) with Maps phone, all third-party listings (no domain carries the business name): ' + ', '.join(sorted({domain(h["url"]) for h in about_biz}))])}
    return {'verified': 'uncertain', 'url': '', 'evidence': '; '.join(evidence + [f'search returned {len(res["results"])} results, none tied to the Maps phone'])}


def run(config, workdir, job_id, gosom_runner=None, lighthouse=True, log=print):
    """config keys: queries, bbox, rows, cols, city, state, category, max_records, max_minutes, social_platforms."""
    wd = Path(workdir); wd.mkdir(parents=True, exist_ok=True)
    store = Store(wd / 'geofusion.db'); started = time.monotonic(); deadline = started + 60 * config.get('max_minutes', 60)
    store.job(job_id, 'running', {'config': config, 'started_at': now()})
    judge = Judge(log_path=wd / 'judgments.jsonl')
    social_ready = social.readiness(config.get('social_platforms', ['youtube']))
    caps = registry(social_ready=social_ready, gosom_ok=True)
    decisions = [route({'platform': 'google_maps', 'operation': 'tile'}, caps), route({'platform': 'websites', 'operation': 'audit'}, caps),
                 *[route({'platform': p, 'operation': 'profile'}, caps, authorized=config.get('authorized_social', False)) for p in config.get('social_platforms', [])]]
    (wd / 'router_decisions.json').write_text(json.dumps(decisions, indent=2))

    kw = {'runner': gosom_runner} if gosom_runner else {}
    receipts = maps.collect(store, job_id, config['queries'], config['bbox'], config['rows'], config['cols'], wd / 'raw', config.get('zoom', 14), **kw)
    log(f"maps: {sum(r.get('places', 0) for r in receipts)} places from {len(receipts)} tiles; unique={store.stats()['unique_businesses']}")

    yt = social.YouTube() if social_ready.get('youtube', {}).get('status') == 'supported' else None
    city, state = config['city'], config['state']
    target = f'{city}, {state}'.lower()
    for i, biz in enumerate(list(store.records(job_id))):
        bid = biz['id']
        if store.checkpoint(job_id, 'enrich', bid)[0] == 'done': continue
        if time.monotonic() > deadline or i >= config.get('max_records', 500):
            store.checkpoint(job_id, 'enrich', bid, 'budget_exhausted', {}); continue
        try:
            in_area = target in (biz.get('address') or '').lower()
            rel = category_relevance(judge, config['category'], biz.get('name'), biz.get('category'))
            status = {'maps_website': 'linked' if biz.get('website') else 'none_linked', 'in_target_area': in_area, 'relevance': rel['answer']}
            audit = None
            if not in_area or rel['answer'] == 'unrelated':  # spend audit budget only on the target set
                scores = {'website_status': {**status, 'verified': 'not_checked', 'skipped': 'outside target city or unrelated category'},
                          'social': {'readiness': {p: v['status'] for p, v in social_ready.items()}}, 'website_quality': None,
                          'social_presence': scoring.social_presence(None, {}), 'opportunity': scoring.opportunity(biz, {'maps_website': 'skipped'}, None, 'unrelated')}
                store.save_audit(bid, 'scores', scores, job_id); store.checkpoint(job_id, 'enrich', bid, 'done', {'name': biz.get('name'), 'skipped': True})
                log(f"{biz.get('name')}: skipped (in_area={in_area}, relevance={rel['answer']}) opp=0"); continue
            if biz.get('website'):
                status['site_kind'] = web.site_kind(biz['website'])
                try:
                    audit = web.audit_site(biz['website'], biz.get('phone'), city, street_of(biz.get('address')), run_lighthouse=lighthouse)
                    status['reachable'] = True; status['site_kind'] = audit['site_kind']; status['verified'] = 'website_exists'
                except Exception as e:
                    status.update(reachable=False, verified='uncertain', error=str(e)[:200])
            else:
                status.update(verify_no_website(biz, city, state))
                if status['verified'] == 'website_exists' and status.get('url'):
                    try: audit = web.audit_site(status['url'], biz.get('phone'), city, street_of(biz.get('address')), run_lighthouse=lighthouse); status['site_kind'] = audit['site_kind']
                    except Exception as e: status['audit_error'] = str(e)[:200]
            soc = {'readiness': {p: v['status'] for p, v in social_ready.items()}}
            if yt:
                try:
                    match, hits = social.youtube_match(yt, biz.get('name'), city)
                    soc['youtube_match'] = match; soc['youtube_candidates'] = len(hits)
                except social.SocialUnavailable as e: soc['youtube_error'] = str(e)[:200]
            soc['engagement_reason'] = 'linked platforms (facebook/instagram/x) are requires_auth in this runtime; no authorized session configured'
            scores = {'website_status': status, 'social': soc}
            if audit:
                q = scoring.website_quality(audit)
                scores.update(website_quality=q, technical_seo=scoring.technical_seo(audit), local_seo=scoring.local_seo(audit, biz), ai_search=scoring.ai_search(audit))
            else:
                scores['website_quality'] = None
            scores['social_presence'] = scoring.social_presence(audit, soc)
            scores['opportunity'] = scoring.opportunity(biz, status, scores['website_quality'], rel['answer'])
            if audit: store.save_audit(bid, 'website', audit, job_id)
            store.save_audit(bid, 'scores', scores, job_id)
            store.checkpoint(job_id, 'enrich', bid, 'done', {'name': biz.get('name')})
            log(f"{biz.get('name')}: {status['maps_website']}/{status.get('verified')} opp={scores['opportunity']['opportunity']}")
        except Exception as e:  # one bad business never kills the run
            store.checkpoint(job_id, 'enrich', bid, 'failed', {'name': biz.get('name'), 'error': str(e)[:300]})
            log(f"{biz.get('name')}: FAILED {e}")
    meta = {'finished_at': now(), 'seconds': round(time.monotonic() - started, 1), 'maps_receipts': receipts, 'stats': store.stats(),
            'judge_mode': judge.mode, 'judgments': len(judge.log), 'escalations': sum(1 for j in judge.log if j.get('escalate')),
            'social_readiness': social_ready, 'external_cost_usd': 0.0}
    store.job(job_id, 'done', meta)
    return store, meta
