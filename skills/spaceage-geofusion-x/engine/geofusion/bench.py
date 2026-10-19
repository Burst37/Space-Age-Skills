"""Measured benchmarks for a finished job: completeness, duplicates, verification mix, audit coverage, latency, cost."""
import json
import re
from collections import Counter


def digits(s): return re.sub(r'\D', '', s or '')[-10:]


def benchmark(store, job_id, reference=None):
    recs = list(store.records()); n = len(recs)
    obs = store.stats()['observations']
    fields = ('name', 'phone', 'address', 'website', 'rating', 'review_count', 'category', 'latitude', 'source_id', 'source_url')
    completeness = {f: round(100 * sum(1 for r in recs if r.get(f)) / n, 1) for f in fields} if n else {}
    scores = [s for s in (store.audit(r['id'], 'scores') for r in recs) if s]
    audits = [a for a in (store.audit(r['id'], 'website') for r in recs) if a]
    st = Counter((s['website_status']['maps_website'], s['website_status'].get('verified')) for s in scores)
    lh = Counter('measured' if 'scores' in a['lighthouse'].get(p, {}) else 'not_measured' for a in audits for p in ('mobile', 'desktop'))
    modes = Counter(pg.get('mode', 'error') for a in audits for pg in a['pages'])
    meta = json.loads(store.db.execute('SELECT metadata FROM jobs WHERE id=?', (job_id,)).fetchone()['metadata'])
    tiles = store.checkpoints(job_id, 'maps')  # original tile work, not resume receipts
    out = {'unique_businesses': n, 'observations': obs, 'duplicate_observation_rate_pct': round(100 * (obs - n) / obs, 1) if obs else None,
           'field_completeness_pct': completeness, 'enriched': len(scores), 'enrich_status': Counter(c['status'] for c in store.checkpoints(job_id, 'enrich')),
           'website_status_mix': {f'{a}/{b}': c for (a, b), c in st.items()}, 'sites_audited': len(audits),
           'site_fetch_modes': dict(modes), 'lighthouse_runs': dict(lh),
           'in_target_city': sum(1 for s in scores if s['website_status']['in_target_area']),
           'maps_tiles': Counter(t['status'] for t in tiles), 'maps_seconds_total': round(sum(t.get('seconds', 0) for t in tiles), 1),
           'job_seconds': meta.get('seconds'), 'external_cost_usd': meta.get('external_cost_usd', 0.0), 'cost_per_record_usd': 0.0,
           'judge_mode': meta.get('judge_mode'), 'judgments': meta.get('judgments'), 'escalations': meta.get('escalations')}
    if reference:  # [{'name','phone','website'}] prior research rows: overlap by phone, website agreement
        by_phone = {digits(r.get('phone')): r for r in recs if r.get('phone')}
        hits = [(ref, by_phone[digits(ref['phone'])]) for ref in reference if digits(ref.get('phone')) in by_phone]
        agree = sum(1 for ref, r in hits if bool(ref.get('website')) == bool(r.get('website')))
        out['reference'] = {'reference_rows': len(reference), 'found_by_phone': len(hits), 'recall_pct': round(100 * len(hits) / len(reference), 1),
                            'website_presence_agreement': f'{agree}/{len(hits)}', 'missing': [ref['name'] for ref in reference if digits(ref.get('phone')) not in by_phone]}
    return out
