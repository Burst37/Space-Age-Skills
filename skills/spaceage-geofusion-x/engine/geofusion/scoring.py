"""Versioned, evidence-carrying scores. Unmeasured criteria are never zero: they carry not_measured_reason.

Website Quality uses the Space Age 100-point rubric (visual 20, mobile 15, SEO 15, trust 15, conversion 15, speed 10,
automation 10). Source: GeoFusion master handoff §6 and the existing Mesquite sheet headers; the Cinematic Website
Builder skill (Drive 1wtTxcDO…) defines a 0–5 build-QA rubric, not this prospect score. Visual design needs a human or
frontier visual review, so the engine reports it as not measured rather than guessing from text.
"""
from datetime import datetime, timezone
from .core import now

VERSION = 'geofusion-score-1.0'


def crit(score, max_, evidence, method, at, confidence='high'):
    return {'score': round(min(max(score, 0), max_), 1), 'max': max_, 'evidence': evidence, 'method': method, 'verified_at': at,
            'confidence': confidence, 'not_measured_reason': ''}


def nm(max_, reason):
    return {'score': None, 'max': max_, 'evidence': '', 'method': '', 'verified_at': '', 'confidence': '', 'not_measured_reason': reason}


def total(criteria):
    measured = [c for c in criteria.values() if c['score'] is not None]
    got, mx = sum(c['score'] for c in measured), sum(c['max'] for c in measured)
    full = sum(c['max'] for c in criteria.values())
    return {'score': round(got, 1) if len(measured) == len(criteria) else None, 'measured_points': round(got, 1), 'measured_max': mx,
            'max': full, 'measured_pct': round(100 * got / mx, 1) if mx else None, 'coverage': f'{len(measured)}/{len(criteria)} criteria measured'}


def checklist(items, at, method):
    """items: [(label, weight, passed_bool)] -> crit over the weights, evidence lists failures."""
    mx = sum(w for _, w, _ in items); got = sum(w for _, w, ok in items if ok)
    failed = [l for l, _, ok in items if not ok]
    return crit(got, mx, ('missing: ' + ', '.join(failed)) if failed else 'all checks passed', method, at)


def website_quality(audit):
    s, f, lh, at = audit['signals'], audit['files'], audit['lighthouse'], audit['audited_at']
    m, dsk = lh.get('mobile', {}), lh.get('desktop', {})
    html = 'HTML parse of sampled pages'
    this_year = datetime.now(timezone.utc).year
    c = {'visual_design': nm(20, 'requires human or frontier visual review of rendered screenshots; not inferred from text')}
    if 'scores' in m:
        ms = m['scores']
        c['mobile_experience'] = crit(3 * s['viewport'] + 6 * (ms.get('accessibility') or 0) + 6 * (ms.get('performance') or 0), 15,
                                      f"viewport={s['viewport']}, LH mobile a11y={ms.get('accessibility')}, perf={ms.get('performance')}", 'Lighthouse mobile + viewport meta', m['fetched_at'])
        c['speed'] = crit(10 * (ms.get('performance') or 0), 10, f"LH mobile perf={ms.get('performance')}, LCP={m['metrics'].get('largest-contentful-paint')}ms", 'Lighthouse mobile performance', m['fetched_at'])
    else:
        c['mobile_experience'] = nm(15, m.get('not_measured_reason', 'lighthouse mobile not run'))
        c['speed'] = nm(10, m.get('not_measured_reason', 'lighthouse mobile not run'))
    c['seo'] = checklist([('title', 2, bool(s['title'])), ('meta description', 2, bool(s['meta_description'])), ('single H1', 2, s['h1_count'] == 1),
                          ('canonical', 1, s['canonical']), ('LocalBusiness schema', 3, any('Business' in t or t in ('Organization', 'HomeAndConstructionBusiness', 'LandscapingBusiness') for t in s['schema_types'])),
                          ('city mentioned', 2, s['city_mentioned']), ('sitemap.xml', 1, f.get('sitemap.xml', False)), ('robots.txt', 1, f.get('robots.txt', False)), ('https', 1, s['https'])], at, html)
    c['trust'] = checklist([('https', 3, s['https']), ('phone visible', 2, s['tel_links'] > 0 or s['phone_on_page']), ('phone matches Maps', 3, s['phone_on_page']),
                            ('city on page', 2, s['city_mentioned']), ('testimonials/reviews', 2, s['testimonials']),
                            ('copyright within 2 years', 1, bool(s['copyright_years']) and max(s['copyright_years']) >= this_year - 2), ('about page', 2, s['about_page'])], at, html)
    c['conversion'] = checklist([('click-to-call', 3, s['tel_links'] > 0), ('contact form', 4, s['forms'] > 0), ('quote/estimate CTA', 4, bool(s['cta_phrases'])),
                                 ('online booking', 2, s['booking_widget']), ('email link', 2, s['mailto_links'] > 0)], at, html)
    c['automation_ai'] = checklist([('chat widget', 3, s['chat_widget']), ('online booking', 3, s['booking_widget']), ('form capture', 2, s['forms'] > 0),
                                    ('structured data', 2, bool(s['schema_types']))], at, html)
    order = ('visual_design', 'mobile_experience', 'seo', 'trust', 'conversion', 'speed', 'automation_ai')
    c = {k: c[k] for k in order}
    return {'version': VERSION, 'criteria': c, **total(c)}


def technical_seo(audit):
    s, f, at = audit['signals'], audit['files'], audit['audited_at']
    alt_ok = s['images'] == 0 or s['images_missing_alt'] / s['images'] <= 0.2
    ok = any(p.get('status') == 200 for p in audit['pages'])
    r = checklist([('https', 10, s['https']), ('title', 10, bool(s['title'])), ('meta description', 10, bool(s['meta_description'])), ('single H1', 10, s['h1_count'] == 1),
                   ('canonical', 5, s['canonical']), ('viewport', 10, s['viewport']), ('indexable', 10, not s['robots_noindex']), ('sitemap.xml', 10, f.get('sitemap.xml', False)),
                   ('robots.txt', 5, f.get('robots.txt', False)), ('image alt >=80%', 10, alt_ok), ('html lang', 5, bool(s['lang'])), ('HTTP 200', 5, ok)], at, 'HTML + site files checklist')
    lh = audit['lighthouse'].get('mobile', {})
    r['lighthouse_seo_mobile'] = lh.get('scores', {}).get('seo') if 'scores' in lh else lh.get('not_measured_reason')
    return {'version': VERSION, **r}


def local_seo(audit, biz):
    s, at = audit['signals'], audit['audited_at']
    reviews = int(float(biz.get('review_count') or 0))
    return {'version': VERSION, **checklist([('LocalBusiness schema', 25, any('Business' in t for t in s['schema_types'])), ('phone matches Maps (NAP)', 20, s['phone_on_page']),
                                             ('city mentioned', 15, s['city_mentioned']), ('street address on page', 15, s['address_on_page']),
                                             ('service-area/location page', 10, s['service_area_page']), ('>=10 Maps reviews', 15, reviews >= 10)], at, 'HTML parse + Maps listing')}


def ai_search(audit):
    s, f, at = audit['signals'], audit['files'], audit['audited_at']
    return {'version': VERSION, **checklist([('structured data', 20, bool(s['schema_types'])), ('FAQ content', 20, s['faq']),
                                             ('entity clarity (title+H1+sameAs/social)', 15, bool(s['title']) and s['h1_count'] >= 1 and bool(s['social_links'])),
                                             ('crawlable text >=300 words', 15, s['word_count'] >= 300), ('AI crawlers allowed', 15, f.get('robots.txt', False) and not f.get('ai_crawlers_blocked')),
                                             ('llms.txt', 5, f.get('llms.txt', False)), ('>=3 services named', 10, len(s['services_mentioned']) >= 3)], at, 'HTML parse + robots.txt/llms.txt')}


def social_presence(audit, social):
    """Profiles linked from the business's own site are attributed; engagement needs authorized reads, else not measured."""
    links = audit['signals']['social_links'] if audit else []
    at = audit['audited_at'] if audit else now()
    profiles = crit(min(60, 20 * len({l.split('/')[2] for l in links})), 60, '; '.join(links) or 'no profile links on site', 'links on official site', at) if audit else nm(60, 'no website to source profile links')
    eng = social.get('engagement') if social else None
    engagement = eng if eng else nm(40, (social or {}).get('engagement_reason', 'authorized social reads not configured for linked platforms'))
    c = {'linked_profiles': profiles, 'engagement': engagement}
    return {'version': VERSION, 'criteria': c, **total(c)}


def opportunity(biz, status, quality, relevance):
    """High = more need for website/SEO work. Not a measure of good performance."""
    if status['maps_website'] == 'skipped': base, basis = 0, 'not assessed: outside target set'
    elif status['maps_website'] == 'none_linked':
        base = {'verified_no_owned_domain_found': 90, 'uncertain': 80, 'website_exists': 55}[status['verified']]
        basis = f"no website on Maps; verification={status['verified']}"
    elif status.get('site_kind') == 'third_party_page': base, basis = 80, 'Maps links to a third-party page, not an owned site'
    elif not status.get('reachable', True): base, basis = 85, 'linked website unreachable'
    elif status.get('site_kind') == 'builder_subdomain': base, basis = 70, 'free builder subdomain'
    elif quality and quality.get('measured_pct') is not None: base, basis = round(max(10, min(90, 100 - quality['measured_pct'])), 1), f"100 - measured website quality ({quality['measured_pct']}%)"
    else: base, basis = 50, 'website quality not measured'
    contact = 50 * bool(biz.get('phone')) + 25 * bool(biz.get('address')) + 25 * bool(quality and quality['criteria']['conversion']['score'])
    fit = {'relevant': 100, 'adjacent': 50, 'unrelated': 0}.get(relevance, 50)
    priority = round(0.6 * base + 0.25 * contact + 0.15 * fit) if fit else 0
    return {'version': VERSION, 'opportunity': base, 'opportunity_basis': basis, 'contactability': contact, 'business_fit': fit, 'outreach_priority': priority}
