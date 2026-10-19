"""`geofusion scrape <source> "<what>" ["<where>"] [--sheet]` — one command, eight sources, one row schema.

Routing follows build-partner/references/jev-routing.md. Code decides what it can: the source is the user's, URL vs query,
capability health/auth/budget gates (router.route), geocoding, parsing. Jev answers only what code cannot:
  intent      Choice — which record kind the user wants from that source (code keyword baseline first; Jev on ambiguity)
  source_fit  Noul   — is that source likely to hold it publicly (advisory hint only; never switches the source)
No TYPESAFE_API_KEY -> code baseline + per-source default, every decision logged to judgments.jsonl.

Token discipline (caveman Mode B): raw collector output and all rows stay on disk; stdout is one compact summary.
"""
import json
import math
import os
import re
import shutil
import subprocess
import time
from pathlib import Path
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from . import maps, social, web
from .core import Store, domain, now
from .router import QUESTIONS, Judge, registry, route

SOURCES = ('maps', 'web', 'instagram', 'reddit', 'facebook', 'x', 'linkedin', 'youtube')
# Choice options per source (first = default when code and Jev both cannot decide).
INTENTS = {
    'maps': {'businesses': 'Local business listings'},
    'web': {'search': 'Pages matching a search query', 'page': 'Content of one URL'},
    'instagram': {'profiles': 'Accounts, creators or businesses', 'posts': 'Recent posts from one account (what = username)'},
    'reddit': {'posts': 'Posts and discussions', 'communities': 'Subreddits where the topic is discussed'},
    'facebook': {'pages': 'Pages, profiles or businesses', 'posts': 'Posts'},
    'x': {'posts': 'Posts/tweets', 'profiles': 'Accounts that post about it'},
    'linkedin': {'people': 'People', 'companies': 'One company profile (what = company name)', 'jobs': 'Job listings'},
    'youtube': {'videos': 'Videos', 'channels': 'Channels'},
}
KEYWORDS = [  # (pattern, intents it can mean, first one present for the source wins)
    (r'\b(jobs?|hiring|openings?|vacanc\w*|roles?)\b', ('jobs',)),
    (r'\b(subreddits?|communit\w*|forums?)\b', ('communities',)),
    (r'\bchannels?\b', ('channels',)),
    (r'\b(videos?|tutorials?|vlogs?|shorts)\b', ('videos',)),
    (r'\b(posts?|tweets?|threads?|discussions?|mentions?|complaints?|opinions?|reviews?|recommendations?|questions?)\b', ('posts',)),
    (r'\b(accounts?|profiles?|influencers?|creators?|handles?|users?|bloggers?)\b', ('profiles', 'people', 'pages', 'channels')),
    (r'\b(people|founders?|engineers?|managers?|ceos?|recruiters?|directors?|owners?)\b', ('people', 'profiles')),
    (r'\b(companies|company|brands?|businesses|shops?|pages?)\b', ('companies', 'pages', 'profiles', 'businesses')),
]
ROW = ('source', 'kind', 'title', 'url', 'author', 'text', 'location', 'phone', 'website', 'rating', 'reviews', 'published', 'metric', 'collector', 'retrieved_at')
UA = 'GeoFusionX/0.6 (research; contact via repo Burst37/Space-Age-Skills)'
TEXT_MAX = 500  # per-row text on disk; summary rows are cut further


def is_url(s): return bool(re.match(r'^https?://\S+$', (s or '').strip()))


def intent_baseline(source, what):
    """Code decides when exactly one intent is signalled; None (ambiguous or no signal) goes to Jev."""
    opts = INTENTS[source]
    if len(opts) == 1: return next(iter(opts))
    if source == 'web': return 'page' if is_url(what) else 'search'
    hits = {next((i for i in cands if i in opts), None) for pat, cands in KEYWORDS if re.search(pat, what, re.I)} - {None}
    return hits.pop() if len(hits) == 1 else None


def decide(judge, source, what, where):
    state = {'what': what, 'where': where or ''}
    opts = INTENTS[source]
    rec = judge.choice('intent', {'source': source, **state}, QUESTIONS['intent'](source, opts), intent_baseline(source, what))
    kind = rec['answer'] if rec['answer'] in opts else next(iter(opts))
    out = {'intent': kind, 'intent_by': rec['by'] if rec['answer'] in opts else f"default ({rec['by']})"}
    if judge.mode == 'jev' and source != 'web':  # pure semantic question: no code baseline, so only asked when Jev is on
        fit = judge.choice('source_fit', state, QUESTIONS['source_fit'](source), None)
        if isinstance(fit['answer'], (int, float)) and fit['answer'] < 0.5:
            out['hint'] = f'Jev: {source} unlikely to hold this (p={fit["answer"]:.2f}); kept your source — try maps or web too'
    return out


def geocode(where, opener=urlopen):
    """Nominatim area -> bbox [minLat, minLon, maxLat, maxLon]. One polite request (usage policy: UA, <=1 req/s)."""
    url = 'https://nominatim.openstreetmap.org/search?' + urlencode({'q': where, 'format': 'json', 'limit': 1})
    with opener(Request(url, headers={'User-Agent': UA}), timeout=20) as r: hits = json.loads(r.read())
    if not hits: raise ValueError(f'could not geocode "{where}"')
    s, n, w, e = map(float, hits[0]['boundingbox'])
    return [s, w, n, e], hits[0].get('display_name', where)


def grid(bbox, tile_deg=0.08, cap=6):
    """Rows/cols so each tile stays small enough for GoSom fast mode (~20 results per query per tile)."""
    return (max(1, min(cap, math.ceil((bbox[2] - bbox[0]) / tile_deg))), max(1, min(cap, math.ceil((bbox[3] - bbox[1]) / tile_deg))))


def pick(d, *keys):
    for k in keys:
        v = d.get(k) if isinstance(d, dict) else None
        if isinstance(v, dict): v = v.get('name') or v.get('username') or v.get('screen_name')
        if v not in (None, '', [], {}): return v
    return ''


def row(source, kind, collector, **f):
    r = {k: '' for k in ROW}
    r.update({k: v for k, v in f.items() if k in r and v is not None}, source=source, kind=kind, collector=collector, retrieved_at=now())
    r['text'] = re.sub(r'\s+', ' ', str(r['text']))[:TEXT_MAX]
    return r


def from_items(data, source, kind, collector):
    """Map any CLI JSON (list or {items|data|results|posts|users: [...]}) onto ROW. Tolerant of upstream schema drift."""
    items = data if isinstance(data, list) else next((data[k] for k in ('items', 'data', 'results', 'posts', 'users', 'tweets') if isinstance(data, dict) and isinstance(data.get(k), list)), [data] if isinstance(data, dict) else [])
    return [row(source, kind, collector,
                title=pick(i, 'title', 'name', 'full_name', 'text', 'username'), url=pick(i, 'url', 'link', 'permalink', 'profile_url', 'href'),
                author=pick(i, 'author', 'username', 'user', 'screen_name', 'channel', 'subreddit'), text=pick(i, 'text', 'content', 'selftext', 'description', 'bio', 'caption', 'snippet'),
                location=pick(i, 'location', 'city'), published=pick(i, 'created_at', 'date', 'time', 'published', 'timestamp'),
                metric=pick(i, 'score', 'upvotes', 'likes', 'followers', 'followers_count', 'views', 'retweets'))
            for i in items if isinstance(i, dict)]


def run_cli(cmd, raw_dir, label, runner=subprocess.run, timeout=180):
    """Run a collector CLI; raw output always lands on disk (evidence), never in the agent context."""
    if not shutil.which(cmd[0]): raise social.SocialUnavailable(label, 'configuration_missing', f'{cmd[0]} not installed — see skills/agent-reach/SKILL.md')
    r = runner(cmd, capture_output=True, text=True, timeout=timeout)
    (raw_dir / f'{label}.txt').write_text(f'$ {" ".join(cmd)}\n{r.stdout}\n--- stderr ---\n{r.stderr}', encoding='utf-8')
    if r.returncode:
        auth = re.search(r'login|log(ged)? ?in|auth|cookie|401|403|session', r.stderr + r.stdout, re.I)
        raise social.SocialUnavailable(label, 'requires_auth' if auth else 'broken', (r.stderr or r.stdout)[-300:])
    return r.stdout


def parse_json(text):
    try: return json.loads(text)
    except ValueError:
        m = re.search(r'(\[.*\]|\{.*\})', text, re.S)  # some CLIs print a banner before the JSON
        if m:
            try: return json.loads(m.group(1))
            except ValueError: pass
    return None


def social_cmd(source, kind, q, what, where, n, backend=''):
    """The command Agent Reach documents for the backend its doctor reports (skills/agent-reach/references/social.md, career.md)."""
    b = (backend or '').lower()
    if source == 'instagram':
        return ['opencli', 'instagram', 'user', what.lstrip('@'), '--limit', str(n), '-f', 'json'] if kind == 'posts' else ['opencli', 'instagram', 'search', q, '-f', 'json']
    if source == 'facebook': return ['opencli', 'facebook', 'search', q, '-f', 'json']
    if source == 'reddit': return ['rdt', 'search', q, '--limit', str(n), '--json'] if 'rdt' in b else ['opencli', 'reddit', 'search', q, '-f', 'json']
    if source == 'x': return ['opencli', 'twitter', 'search', q, '-f', 'json'] if 'opencli' in b else ['twitter', 'search', q, '-n', str(n), '--json']
    if source == 'linkedin':
        loc = [f'location={where}'] if where else []
        return {'people': ['mcporter', 'call', 'linkedin.search_people', f'keywords={what}', *loc],
                'companies': ['mcporter', 'call', 'linkedin.get_company_profile', f'company_name={what}'],
                'jobs': ['mcporter', 'call', 'linkedin.search_jobs', f'keywords={what}', *loc, 'max_pages=1']}[kind]
    raise ValueError(source)


def collect_social(source, kind, what, where, n, raw_dir, backend='', runner=subprocess.run):
    cmd = social_cmd(source, kind, f'{what} {where}'.strip(), what, where, n, backend)
    try: out = run_cli(cmd, raw_dir, source, runner)
    except social.SocialUnavailable as e: return [], [f'{cmd[0]}: {e.status} {e.detail[:120]}']
    data = parse_json(out)
    rows = from_items(data, source, kind, cmd[0]) if data is not None else [row(source, kind, cmd[0], title=f'{source} result (unparsed)', text=out)] if out.strip() else []
    if kind in ('communities', 'profiles') and source in ('reddit', 'x'):  # add-on: Agent Reach only searches posts; derive one row per subreddit/author
        seen = {}
        for r in rows:
            key = r['author'] or r['title']
            if key and key not in seen:
                seen[key] = row(source, kind, r['collector'], title=key, url=f'https://reddit.com/r/{key}' if source == 'reddit' else f'https://x.com/{key}', text=r['title'], metric=1)
            elif key: seen[key]['metric'] += 1
        rows = list(seen.values())
    return rows[:n], ([] if rows else [f'{cmd[0]}: ran but returned no items'])


def collect_youtube(kind, what, where, n, yt=None):
    yt = yt or social.YouTube()
    hits = yt.search(f'{what} {where}'.strip(), n)
    if kind == 'channels':
        seen = {}
        for h in hits:
            if h.get('channel_id') and h['channel_id'] not in seen:
                seen[h['channel_id']] = row('youtube', kind, 'agent-reach:yt-dlp', title=h.get('channel'), url=f"https://www.youtube.com/channel/{h['channel_id']}", text=h.get('title'))
        return list(seen.values())
    return [row('youtube', kind, 'agent-reach:yt-dlp', title=h.get('title'), url=h.get('url'), author=h.get('channel'), published=h.get('published')) for h in hits]


# Pages that need more than a clean read go to the owning skill; the engine says which one instead of wrapping it.
ESCALATE = {'js_or_spa': 'firecrawl-mcp or browserbase-scraper', 'bot_protected': 'stealth-browser-automation (camofox) or scrapling',
            'structured_fields': 'scrapegraph-ai (LLM extraction guided by <where>)'}


def page_defuddle(url, runner=subprocess.run):
    """skills/defuddle: clean markdown, fewest tokens."""
    r = runner(['defuddle', 'parse', web.safe_url(url), '--md'], capture_output=True, text=True, timeout=90)
    if r.returncode or not r.stdout.strip(): raise RuntimeError((r.stderr or 'empty')[-200:])
    m = re.search(r'^#\s+(.+)$', r.stdout, re.M)
    return (m.group(1) if m else domain(url)), r.stdout


def page_jina(url, opener=urlopen):
    """skills/agent-reach zero-config web read (r.jina.ai)."""
    with opener(Request('https://r.jina.ai/' + web.safe_url(url), headers={'User-Agent': UA}), timeout=60) as r: md = r.read().decode('utf-8', 'replace')
    m = re.search(r'^Title:\s*(.+)$', md, re.M)
    return (m.group(1).strip() if m else domain(url)), md


PAGE = {'defuddle': page_defuddle, 'agent-reach:jina': page_jina}


def scrape(source, what, where='', n=20, workdir='runs', authorized=False, judge=None, gosom_runner=None, social_ready=None):
    """Returns (rows, meta). rows follow ROW; meta is the compact, agent-facing record of what happened and why."""
    if source not in SOURCES: raise ValueError(f'source must be one of {", ".join(SOURCES)}')
    if not (what or '').strip(): raise ValueError('<what> is required')
    slug = re.sub(r'[^a-z0-9]+', '-', f'{source} {what} {where}'.lower()).strip('-')[:60]
    wd = Path(workdir) / f'scrape-{slug}-{time.strftime("%Y%m%d-%H%M%S")}'; raw = wd / 'raw'; raw.mkdir(parents=True, exist_ok=True)
    judge = judge or Judge(log_path=wd / 'judgments.jsonl')
    d = decide(judge, source, what, where)
    meta = {'source': source, 'what': what, 'where': where, **d, 'judge_mode': judge.mode, 'workdir': str(wd), 'errors': []}
    rows = []
    if source == 'maps':
        if not where: raise ValueError('maps needs "<where>" (city, area or address)')
        bbox, place = geocode(where)
        r_, c_ = grid(bbox)
        meta.update(area=place, bbox=bbox, tiles=r_ * c_)
        try: maps.gosom_command(); gosom_ok = True
        except RuntimeError as e: gosom_ok = bool(gosom_runner); meta['errors'].append(str(e)[:200])
        dec = route({'platform': 'google_maps', 'operation': 'tile'}, registry(gosom_ok=gosom_ok))
        meta['route'] = dec['selected_capability'] or dec['rationale']
        if dec['selected_capability']:
            store = Store(wd / 'geofusion.db')
            kw = {'runner': gosom_runner} if gosom_runner else {}
            receipts = maps.collect(store, 'scrape', [what], bbox, r_, c_, raw, **kw)
            meta['tiles_failed'] = sum(1 for x in receipts if x['status'] in ('failed', 'blocked'))
            meta['errors'] += sorted({x['error'][:160] for x in receipts if x.get('error')})
            rows = [row('maps', 'businesses', 'gosom', title=b.get('name'), url=b.get('source_url'), text=b.get('category'), location=b.get('address'),
                        phone=b.get('phone'), website=b.get('website'), rating=b.get('rating'), reviews=b.get('review_count')) for b in store.records()][:n if n else None]
    elif source == 'web':
        name, errs = None, []
        if d['intent'] == 'page':
            for name, f in PAGE.items():
                try: title, text = f(what)
                except Exception as e: errs.append(f'{name}: {str(e)[:120]}'); continue
                if text.strip():
                    (raw / 'page.md').write_text(text, encoding='utf-8')
                    rows = [row('web', 'page', name, title=title, url=what, website=domain(what), text=text)]; break
            else: name, meta['next'] = None, ESCALATE
        else:
            name = 'agent-reach:exa'
            try: hits = social.exa_search(f'{what} {where}'.strip(), n)['results']
            except Exception as e: hits, errs = [], [f'{name}: {str(e)[:160]}']
            (raw / 'search.json').write_text(json.dumps(hits, ensure_ascii=False, default=str), encoding='utf-8')
            rows = [row('web', 'search', name, title=h.get('title'), url=h.get('url'), website=domain(h.get('url', '')), text=h.get('text')) for h in hits[:n]]
        meta.update(route=name if rows else 'none'); meta['errors'] += errs
    else:
        ready = social_ready if social_ready is not None else social.readiness([source])
        caps = registry(social_ready=ready)
        dec = route({'platform': source, 'operation': 'search'}, caps, authorized=authorized)
        meta['route'] = dec['selected_capability'] or dec['rationale']
        meta['readiness'] = ready.get(source, {}).get('status')
        if not dec['selected_capability']:
            st = ready.get(source, {})
            hint = ' — rerun with --authorized if this is your own logged-in session' if 'requires_authorization' in dec['rationale'] else f" — {st.get('detail', '')[:160]}"
            meta['errors'].append(f"{source}: {st.get('status', 'unavailable')}{hint}")
        elif source == 'youtube':
            try: rows = collect_youtube(d['intent'], what, where, n)
            except social.SocialUnavailable as e: meta['errors'].append(f'youtube: {e.status} {e.detail[:120]}')
        else:
            rows, errs = collect_social(source, d['intent'], what, where, n, raw, ready.get(source, {}).get('backend') or '')
            meta['errors'] += errs
    (wd / 'rows.jsonl').write_text(''.join(json.dumps(r, ensure_ascii=False, default=str) + '\n' for r in rows), encoding='utf-8')
    meta.update(rows=len(rows), judgments=len(judge.log), escalations=sum(1 for j in judge.log if j.get('escalate')), finished_at=now())
    (wd / 'meta.json').write_text(json.dumps(meta, indent=1, default=str))
    return rows, meta


def compact(rows, meta, top=5, cut=90):
    """Caveman Mode B: what the agent reads. Status + counts + paths + a few trimmed rows; full evidence stays on disk."""
    keep = ('title', 'url', 'author', 'location', 'phone', 'website', 'rating', 'metric')
    out = {k: v for k, v in meta.items() if v not in ('', [], None) and k not in ('finished_at',)}
    out['status'] = 'done' if rows else 'blocked' if meta.get('errors') else 'empty'
    out['top'] = [{k: str(r[k])[:cut] for k in keep if r.get(k) not in ('', None)} for r in rows[:top]]
    return out


def compare(cases, judge=None, log_path='jev_compare.jsonl'):
    """Live test: ask Jev every intent case (even ones code decides) and compare with the code baseline.
    Reports agreement where both answer, how often Jev rescues a case code could not decide, escalation rate, latency."""
    judge = judge or Judge(log_path=log_path, mode='jev' if os.environ.get('TYPESAFE_API_KEY') else 'baseline')
    if judge.mode != 'jev': return {'status': 'blocked', 'reason': 'TYPESAFE_API_KEY not set; nothing to compare against the code baseline'}
    out = []
    for c in cases:
        src, what, where = c['source'], c['what'], c.get('where', '')
        base = intent_baseline(src, what)
        rec = judge.choice('intent', {'source': src, 'what': what, 'where': where}, QUESTIONS['intent'](src, INTENTS[src]), None)
        out.append({**c, 'baseline': base, 'jev': rec['answer'], 'by': rec['by'], 'confidence': rec.get('confidence'), 'escalate': bool(rec.get('escalate')),
                    'ms': rec.get('ms'), 'expected': c.get('expected')})
    both = [o for o in out if o['baseline'] and o['by'] == 'jev']
    exp = [o for o in out if o.get('expected')]
    ms = [o['ms'] for o in out if o['ms']]
    return {'status': 'done', 'model': next((j.get('model') for j in judge.log if j.get('model')), None), 'cases': len(out),
            'code_decided': sum(1 for o in out if o['baseline']), 'agreement_when_both': round(sum(o['baseline'] == o['jev'] for o in both) / len(both), 3) if both else None,
            'jev_rescued': sum(1 for o in out if not o['baseline'] and o['by'] == 'jev' and not o['escalate']),
            'escalation_rate': round(sum(o['escalate'] for o in out) / len(out), 3) if out else None,
            'accuracy_vs_expected': {'code': round(sum(o['baseline'] == o['expected'] for o in exp) / len(exp), 3), 'jev': round(sum(o['jev'] == o['expected'] for o in exp) / len(exp), 3)} if exp else None,
            'ms_median': sorted(ms)[len(ms) // 2] if ms else None, 'rows': out}
