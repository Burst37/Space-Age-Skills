"""Tabbed deliverable: CSV per tab, JSONL, XLSX (first tab = ranked leads), native Google Sheets, read-back verification."""
import csv
import json
import os
import subprocess
from pathlib import Path
from urllib.request import Request, urlopen

TAB_ORDER = ('Ranked Leads', 'All Businesses', 'No Website Linked', 'Website Status Unverified', 'Weak Websites', 'Website Scores',
             'SEO + AI Audit', 'Social Intelligence', 'Sources', 'Failed - Needs Review', 'Run Metadata')
NM = 'not measured'


def cell(c):
    """Score cell: number, or 'not measured: <reason>' — never a silent zero."""
    if c is None: return 'N/A - no website'
    return c['score'] if c.get('score') is not None else f"{NM}: {c.get('not_measured_reason', '')}"[:200]


def tabs(store, job_id):
    rows = {t: [] for t in TAB_ORDER}
    meta = json.loads(store.db.execute('SELECT metadata FROM jobs WHERE id=?', (job_id,)).fetchone()['metadata'])
    for b in store.records():
        s = store.audit(b['id'], 'scores')
        prov = b.get('provenance', {})
        base = {'Business': b.get('name'), 'Address': b.get('address'), 'Phone': b.get('phone'), 'Category': b.get('category'),
                'Google rating': b.get('rating') or NM, 'Review count': b.get('review_count') or NM, 'Maps source URL': b.get('source_url'),
                'Provider ID': b.get('source_id'), 'Retrieved at': prov.get('retrieved_at') or b.get('collected_at')}
        rows['Sources'].append({**base, 'Collector': prov.get('collector'), 'Tile': ','.join(map(str, prov.get('tile', []))),
                                'Queries': '; '.join(prov.get('queries', [])), 'Raw file': prov.get('raw_file'), 'Raw sha256': prov.get('raw_sha256')})
        if not s:
            status, err = store.checkpoint(job_id, 'enrich', b['id'])
            rows['Failed - Needs Review'].append({**base, 'Reason': f"enrichment {status or 'not run'}: {(err or {}).get('error', '')}"}); continue
        st, opp, q, soc = s['website_status'], s['opportunity'], s.get('website_quality'), s['social']
        site = b.get('website') or st.get('url') or ''
        web_state = 'website exists' if st.get('verified') == 'website_exists' else {'verified_no_owned_domain_found': 'no owned domain found (verified)', 'uncertain': 'uncertain'}.get(st.get('verified'), '')
        all_row = {**base, 'Website (Maps)': b.get('website') or 'none linked on Maps', 'Website verification': web_state, 'Website found off-Maps': '' if b.get('website') else site,
                   'Site type': st.get('site_kind', ''), 'In target city': st['in_target_area'], 'Category relevance': st.get('relevance') or 'needs review',
                   'Website Quality /100': (q['score'] if q and q['score'] is not None else f"partial {q['measured_points']}/{q['measured_max']} ({q['coverage']})") if q else ('not measured: linked site unreachable' if st.get('reachable') is False else 'N/A - no website'),
                   'Opportunity /100 (high = needs work)': opp['opportunity'], 'Opportunity basis': opp['opportunity_basis'], 'Contactability': opp['contactability'],
                   'Outreach priority': opp['outreach_priority'], 'Score version': opp['version']}
        rows['All Businesses'].append(all_row)
        if not st['in_target_area'] or st.get('relevance') in (None, 'unrelated'):
            rows['Failed - Needs Review'].append({**base, 'Reason': ('outside target city; ' if not st['in_target_area'] else '') + f"category relevance={st.get('relevance') or 'undecided'}"})
            continue
        rows['Ranked Leads'].append(all_row)
        if st['maps_website'] == 'none_linked':
            rows['No Website Linked'].append({**base, 'Maps website': 'none linked', 'Verification': web_state, 'Evidence': st.get('evidence', ''), 'Found site': st.get('url', '')})
        if st.get('verified') == 'uncertain':
            rows['Website Status Unverified'].append({**base, 'Website': site, 'Why unverified': st.get('evidence') or st.get('error', '')})
        weak = []
        if st.get('site_kind') == 'builder_subdomain': weak.append('free builder subdomain')
        if st.get('site_kind') == 'third_party_page': weak.append('Maps links to third-party page, not an owned site')
        if st.get('reachable') is False: weak.append('site unreachable')
        if q and q['measured_pct'] is not None and q['measured_pct'] < 60: weak.append(f"measured quality {q['measured_pct']}% (<60%)")
        if weak: rows['Weak Websites'].append({**base, 'Website': site, 'Weaknesses': '; '.join(weak), 'Quality measured': q['measured_pct'] if q else 'N/A'})
        if q:
            c = q['criteria']
            rows['Website Scores'].append({**base, 'Website': site, 'Total /100': q['score'] if q['score'] is not None else 'incomplete', 'Measured points': q['measured_points'],
                                           'Measured max': q['measured_max'], 'Coverage': q['coverage'], **{f"{k} /{v['max']}": cell(v) for k, v in c.items()},
                                           'Evidence': ' | '.join(f"{k}: {v['evidence']}" for k, v in c.items() if v['evidence'])[:1500],
                                           'Verified at': max(v['verified_at'] for v in c.values() if v['verified_at']), 'Version': q['version']})
            t, l, a = s['technical_seo'], s['local_seo'], s['ai_search']
            rows['SEO + AI Audit'].append({**base, 'Website': site, 'Technical SEO /100': t['score'], 'Tech SEO gaps': t['evidence'], 'Lighthouse SEO (mobile)': t['lighthouse_seo_mobile'],
                                           'Local SEO /100': l['score'], 'Local SEO gaps': l['evidence'], 'AI Search Readiness /100': a['score'], 'AI gaps': a['evidence'],
                                           'Method': a['method'], 'Verified at': a['verified_at']})
        sp = s['social_presence']
        yt = soc.get('youtube_match')
        rows['Social Intelligence'].append({**base, 'Profiles linked from official site': sp['criteria']['linked_profiles']['evidence'], 'Social presence (measured)': sp['measured_points'],
                                            'Social measured max': sp['measured_max'], 'YouTube channel match': f"{yt['channel']} ({yt['channel_id']})" if yt else 'no channel matched (name-token rule)',
                                            'Engagement': cell(sp['criteria']['engagement'])})  # per-platform readiness lives in Run Metadata
    rows['Ranked Leads'].sort(key=lambda r: -r['Outreach priority'])
    for i, r in enumerate(rows['Ranked Leads'], 1): r['Rank'] = i
    rows['Run Metadata'] = [{'Key': k, 'Value': json.dumps(v, ensure_ascii=False)[:3000] if not isinstance(v, (str, int, float)) else v} for k, v in meta.items()]
    return rows


def write_files(rows, outdir, order=TAB_ORDER):
    out = Path(outdir); out.mkdir(parents=True, exist_ok=True)
    for name, data in rows.items():
        if not data: continue
        with (out / f"{name.replace(' ', '_').replace('+', 'and')}.csv").open('w', newline='', encoding='utf-8') as f:
            w = csv.DictWriter(f, fieldnames=list(dict.fromkeys(k for r in data for k in r))); w.writeheader(); w.writerows(data)
    (out / 'all_tabs.jsonl').write_text(''.join(json.dumps({'tab': n, **r}, ensure_ascii=False, default=str) + '\n' for n, d in rows.items() for r in d))
    return xlsx(rows, out / 'geofusion_report.xlsx', order)


def xlsx(rows, path, order=TAB_ORDER):
    from openpyxl import Workbook
    wb = Workbook(); wb.remove(wb.active)
    for name in order:
        data = rows.get(name) or [{'Status': 'no rows for this run'}]
        ws = wb.create_sheet(name[:31]); hdr = list(dict.fromkeys(k for r in data for k in r)); ws.append(hdr)
        for r in data: ws.append([v if isinstance(v, (int, float)) or v is None else str(v) for v in (r.get(h) for h in hdr)])
        ws.freeze_panes = 'A2'
    wb.active = 0; wb.save(path)
    return str(path)


def verify(rows, readback):
    """readback: {tab: [header_row, *rows]} read from the destination after writing. Every populated tab must match."""
    report = {}
    for name, data in rows.items():
        if not data: continue
        got = readback.get(name) or readback.get(name[:31])
        hdr = list(dict.fromkeys(k for r in data for k in r))
        report[name] = {'expected_rows': len(data), 'read_rows': len(got) - 1 if got else 0, 'header_ok': bool(got) and [str(h) for h in got[0][:len(hdr)]] == hdr,
                        'ok': bool(got) and len(got) - 1 >= 1 and [str(h) for h in got[0][:len(hdr)]] == hdr}
    return {'all_ok': all(v['ok'] for v in report.values()), 'tabs': report}


def google_token():
    tok = os.environ.get('GOOGLE_OAUTH_ACCESS_TOKEN')
    if tok: return tok
    r = subprocess.run(['gcloud', 'auth', 'print-access-token'], capture_output=True, text=True, timeout=30)
    if r.returncode: raise RuntimeError('No Google credentials: set GOOGLE_OAUTH_ACCESS_TOKEN (Sheets scope) or run gcloud auth login')
    return r.stdout.strip()


def _api(method, url, token, body=None):
    req = Request(url, data=json.dumps(body).encode() if body is not None else None, method=method, headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})
    with urlopen(req, timeout=60) as r: return json.loads(r.read())


def google_sheet(rows, title, token=None, order=TAB_ORDER):
    """Create a native Google Sheet (first tab = Ranked Leads), write all tabs, read every tab back and verify."""
    token = token or google_token(); api = 'https://sheets.googleapis.com/v4/spreadsheets'
    names = [n for n in order if rows.get(n)]
    ss = _api('POST', api, token, {'properties': {'title': title}, 'sheets': [{'properties': {'title': n[:31], 'index': i}} for i, n in enumerate(names)]})
    data = []
    for n in names:
        hdr = list(dict.fromkeys(k for r in rows[n] for k in r))
        data.append({'range': f"'{n[:31]}'!A1", 'values': [hdr] + [[str(r.get(h, '')) for h in hdr] for r in rows[n]]})
    _api('POST', f"{api}/{ss['spreadsheetId']}/values:batchUpdate", token, {'valueInputOption': 'RAW', 'data': data})
    q = '&'.join(f"ranges='{n[:31]}'" for n in names)
    back = _api('GET', f"{api}/{ss['spreadsheetId']}/values:batchGet?{q}".replace(' ', '%20'), token)
    readback = {n: vr.get('values', []) for n, vr in zip(names, back['valueRanges'])}
    return {'url': ss['spreadsheetUrl'], 'id': ss['spreadsheetId'], 'verification': verify({n: rows[n] for n in names}, readback)}
