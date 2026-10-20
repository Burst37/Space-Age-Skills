#!/usr/bin/env python3
"""Build a printable PDF (US Letter, portrait) of the plan: cover, targets and rules, month calendar,
weekly shopping lists and one page per day with photos and macros.

Usage: python build_pdf.py --plan plan.json --db db.json --profile profile.json --client Name --start YYYY-MM-DD
                           --out plan.pdf [--images DIR] [--hero hero.jpg]
Needs Node with Playwright (node scripts/print_pdf.js is called to render the HTML).
"""
import argparse, base64, datetime, io, json, math, os, subprocess, sys
from PIL import Image

ap = argparse.ArgumentParser()
for k in ('plan', 'db', 'profile', 'client', 'start', 'out'): ap.add_argument('--' + k, required=True)
ap.add_argument('--images'); ap.add_argument('--hero')
a = ap.parse_args()
P = json.load(open(a.plan)); DB = json.load(open(a.db)); PR = json.load(open(a.profile))
start = datetime.date.fromisoformat(a.start)
dt = lambda n: start + datetime.timedelta(days=n - 1)
fmt = lambda d, f: d.strftime(f).replace(' 0', ' ')
TCOL = {'KETO': '#6A4C93', 'LOW': '#2B9BC2', 'MED': '#2FAE6E', 'HIGH': '#E08A1E'}
TNAME = {'KETO': 'Keto', 'LOW': 'Low carb', 'MED': 'Medium carb', 'HIGH': 'High carb'}; TNAME.update(PR.get('tierNames', {}))
TRANGE = {'KETO': '< 25 g', 'LOW': '~40 g', 'MED': '~60 g', 'HIGH': '80–100 g'}; TRANGE.update(PR.get('tierRanges', {}))
esc = lambda s: str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def b64(path, w, q=78):
    im = Image.open(path).convert('RGB'); s = w / im.size[0]
    if s < 1: im = im.resize((w, round(im.size[1] * s)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
imgs = {}
if a.images:
    for k in {m['key'] for d in P['days'] for m in d['meals']}:
        for ext in ('jpg', 'jpeg', 'png'):
            p = os.path.join(a.images, f'{k}.{ext}')
            if os.path.exists(p): imgs[k] = b64(p, 700); break
hero = b64(a.hero, 1400, 66) if a.hero else ''

FR = {.25: '¼', .5: '½', .75: '¾', 1/3: '⅓', 2/3: '⅔', .125: '⅛'}
def q2s(q):
    q = round(q * 8) / 8; w = int(q + 1e-9); f = round(q - w, 3); fs = FR.get(f, '')
    if f and not fs: return str(round(q, 2))
    return ((str(w) if w else '') + fs) if (w or fs) else '0'
def disp(k, q):
    d = DB[k]
    if k == 'avo': return d['n1'] if q == 1 else f'{q2s(q)} × ¼ avocado'
    if d['u'] == '': return f"{q2s(q)} {d['n1'] if q <= 1 else d['n']}"
    u = d['u'] + ('s' if d['u'] != 'oz' and q > 1 else '')
    return f"{q2s(q)} {u} {d['n']}"

def groc(days):
    tot = {}
    for d in days:
        for m in d['meals']:
            for k, q in m['items']: tot[k] = tot.get(k, 0) + q
    names = {'protein': 'Proteins', 'veg': 'Vegetables', 'carb': 'Carbs & fruit', 'fat': 'Healthy fats & pantry'}
    cat = {k: [] for k in names}
    c = math.ceil
    for k, q in tot.items():
        d = DB[k]
        if d.get('lbf'): lb = q * d['lbf'] / 16; t = (f"{lb:.1f} lb" if lb >= 1 else f"{q * d['lbf']:g} oz") + (' raw' if d.get('raw') else '')
        elif d.get('dry'): t = f"{q / d['dry']:.1f} cups dry"
        elif k == 'avo': t = str(c(q / 4 - 1e-9))
        elif d['u'] == '': t = str(c(q - 1e-9))
        elif d['u'] == 'cup': t = q2s(c(q * 4 - 1e-9) / 4) + (' cup' if q <= 1 else ' cups')
        elif d['u'] == 'oz': t = f'{round(q * 2) / 2:g} oz'
        elif d['u'] == 'slice': t = f'{c(q - 1e-9)} slices'
        elif d['u'] == 'scoop': t = q2s(c(q * 2 - 1e-9) / 2) + ' scoops'
        else: t = f"{c(q - 1e-9)} {d['u']}"
        nm = (d['n1'] if d['u'] == '' else d['n']); nm = nm[0].upper() + nm[1:]
        cat[d['cat']].append((nm, t))
    return [(names[k], sorted(v)) for k, v in cat.items() if v]

CSS = '''
@page{size:Letter;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:"Helvetica Neue",Arial,sans-serif;color:#0F2A20;font-size:11pt}
.page{width:8.5in;height:11in;padding:.5in .55in;page-break-after:always;position:relative;overflow:hidden}
h1,h2,h3{margin:0;font-family:Georgia,"Times New Roman",serif}
.eyebrow{font-size:8.5pt;letter-spacing:.22em;font-weight:700;color:#1B9A60;text-transform:uppercase}
.cover{background:#0E3B2C;color:#EAF6EF;padding:0}
.cover .bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.35}
.cover .in{position:absolute;left:.7in;right:.7in;bottom:1.1in}
.cover h1{font-size:46pt;line-height:1.02;margin-top:10px}.cover h1 em{color:#46D38A;font-style:normal}
.cover p{font-size:14pt;color:#CFE5D9;margin:14px 0 0}
.stats{display:flex;gap:12px;margin-top:26px}.stats div{border:1px solid rgba(255,255,255,.3);border-radius:12px;padding:12px 16px;min-width:1.4in}
.stats b{display:block;font-size:24pt;font-family:Georgia,serif}.stats span{font-size:8pt;letter-spacing:.16em;color:#A7C7B6}
.pg-title{font-size:22pt;margin-bottom:14px}
.card{border:1px solid #D2E0D8;border-radius:12px;padding:14px 16px;margin-bottom:12px;break-inside:avoid}
.card h3{font-size:13pt;margin-bottom:6px}.card ul{margin:0;padding-left:18px;font-size:10pt}.card li{margin:2px 0}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.cycle{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:8px 0 12px}.cycle div{border-radius:8px;color:#fff;text-align:center;padding:8px 2px}
.cycle small{display:block;font-size:7.5pt;letter-spacing:.1em;font-weight:700}.cycle b{font-size:10pt}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.cal .dow{font-size:8pt;font-weight:700;color:#587065;text-align:center}
.cell{border:1px solid #D2E0D8;border-top:5px solid var(--tc);border-radius:8px;padding:5px 4px;text-align:center;min-height:.95in}
.cell small{font-size:7pt;color:#587065;font-weight:700}.cell b{display:block;font-size:13pt;font-family:Georgia,serif}.cell span{display:block;font-size:8pt}
.key{display:flex;gap:16px;margin-top:12px;font-size:9pt}.key i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px}
.glist{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.gcat h3{font-size:12pt}.gcat div{display:flex;justify-content:space-between;border-bottom:1px solid #E1ECE5;padding:3px 0;font-size:10pt}
.glist.sm{grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}.glist.sm .card{padding:8px 10px;margin:0}.glist.sm h3{font-size:10.5pt}.glist.sm div div{font-size:8pt;padding:2px 0;gap:4px}
.dayhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.dayhead h2{font-size:26pt}.tier{color:#fff;border-radius:99px;padding:5px 13px;font-size:8.5pt;font-weight:700;letter-spacing:.1em}
.sumrow{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr 1fr;gap:8px;margin-bottom:12px}
.sumrow div{border:1px solid #D2E0D8;border-radius:10px;padding:8px 10px;text-align:center}.sumrow b{display:block;font-family:Georgia,serif;font-size:17pt}.sumrow span{font-size:7.5pt;letter-spacing:.14em;color:#587065;font-weight:700}
.meal{display:grid;grid-template-columns:2.35in 1fr;gap:14px;border:1px solid #D2E0D8;border-radius:12px;overflow:hidden;margin-bottom:11px;height:2.7in}
.meal .ph{background:#E4EEE8 center/cover no-repeat}.meal .tx{padding:11px 14px 8px 0}
.slot{font-size:8pt;letter-spacing:.14em;font-weight:700;color:#587065;text-transform:uppercase}.meal h3{font-size:14pt;margin:3px 0}
.mc{display:flex;gap:6px;margin:6px 0 7px}.mc span{border-radius:8px;padding:3px 8px;font-size:9pt;font-weight:700;background:var(--k);color:#0F2A20}
.meal ul{margin:0;padding:0;list-style:none;font-size:9.5pt;line-height:1.38}.meal li.add{font-weight:700;color:#1B7A50}
.days{padding-top:.4in}.day{border:1px solid #D2E0D8;border-radius:12px;padding:9px 11px 6px;margin-top:.06in;height:3.26in;overflow:hidden;break-inside:avoid}
.dh{display:flex;align-items:center;gap:10px;margin-bottom:7px}.dh h2{font-size:15pt;white-space:nowrap}.dd{font-size:8.5pt;color:#587065;font-weight:700}
.dh .tier{padding:3px 10px;font-size:7.5pt}.tot{white-space:nowrap;margin-left:auto;font-size:7.4pt;color:#0F2A20}.tot b{font-family:Georgia,serif;font-size:10.5pt}
.dms{display:grid;gap:9px}.dm{border:1px solid #E1ECE5;border-radius:9px;overflow:hidden;height:2.68in}.dm .ph{height:.7in;background:#E4EEE8 center/cover no-repeat}
.dm .tx{padding:5px 8px}.dm h3{font-size:8.7pt;line-height:1.15;margin:2px 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dm .slot{font-size:6.5pt}
.dm .mc{gap:3px;margin:0 0 3px}.dm .mc span{padding:1px 5px;font-size:7.3pt;border-radius:6px}.dm ul{font-size:7.4pt;line-height:1.24;margin:0;padding:0;list-style:none}.dm li.add{font-weight:700;color:#1B7A50}
.chk{font-size:7.3pt;color:#587065;margin:4px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.foot{position:absolute;left:.55in;right:.55in;bottom:.3in;font-size:7.5pt;color:#587065;display:flex;justify-content:space-between}
'''
def foot(n): return f'<div class="foot"><span>{esc(a.client)} · 30-Day Plan</span><span>{esc(PR.get("footerShort","Macros are estimates (±5–10%)."))} · {n}</span></div>'
pages = []; n = 0
A = P['avg']; tot = A['p'] * 4 + A['c'] * 4 + A['f'] * 9
n += 1
pages.append(f'''<section class="page cover"><div class="bg" style="background-image:url({hero})"></div><div class="in">
<div class="eyebrow" style="color:#46D38A">Personalized nutrition plan</div><h1>{PR.get("title", "30-Day <em>Lean Protein</em> Reset")}</h1>
<p>{esc(a.client)} · {esc(PR['sub'])}</p><div class="stats"><div><b>{A['kcal']:,}</b><span>KCAL / DAY</span></div><div><b>{A['p']} g</b><span>PROTEIN</span></div><div><b>{A['net'] if PR.get('netCarbs') else A['c']} g</b><span>{'AVG NET CARBS' if PR.get('netCarbs') else 'AVG CARBS'}</span></div><div><b>{A['f']} g</b><span>FAT</span></div></div>
<p style="font-size:10pt;margin-top:22px">Starts {fmt(start, "%A, %B %d, %Y")} · {" · ".join(esc(c) for c in PR['chips'])}</p></div></section>''')
n += 1
tiers = [t for t in ('KETO', 'LOW', 'MED', 'HIGH') if any(d['tier'] == t for d in P['days'])]
dn = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
cyc = ''.join(f'<div style="background:{TCOL[t]}"><small>{dn[i]}</small><b>{esc(TRANGE[t].replace(" g",""))}</b></div>' for i, t in enumerate(PR['cycle']))
tt = ''.join(f'<p style="margin:5px 0;font-size:10pt"><b style="color:{TCOL[t]}">{TNAME[t].upper()}</b> {esc(PR.get("tierText", {}).get(t, ""))}</p>' for t in tiers)
rules = ''.join(f'<div class="card"><h3>{esc(h)}</h3><ul>{"".join(f"<li>{esc(x)}</li>" for x in l)}</ul></div>' for h, _c, l in PR['rules'])
mon = ''.join(f'<div class="card"><h3>{esc(h)}</h3><p style="margin:0;font-size:10pt">{esc(t)}</p></div>' for h, t in PR['monitoring'])
pages.append(f'<section class="page"><div class="eyebrow">Strategy</div><h2 class="pg-title">Targets, carb cycle and food rules</h2><div class="card"><h3>Weekly carb cycle (Monday first)</h3><div class="cycle">{cyc}</div>{esc(PR["cycleNote"])}{tt}</div><h3 style="margin:10px 0 8px;font-size:15pt">{esc(PR["rulesTitle"])}</h3>{rules}{foot(n)}</section>')
n += 1
pages.append(f'<section class="page"><div class="eyebrow">Monitoring and swaps</div><h2 class="pg-title">Tracking, timing and food swaps</h2>{mon}<div class="card"><h3>Swapping foods</h3><ul><li>Swap only within a category: protein for protein, carbs for carbs, vegetables for vegetables, healthy fat for fat.</li><li>Protein is matched on grams of protein, carbs on grams of carbohydrate, fat on grams of fat, and vegetables cup for cup.</li><li>{esc(PR["swapLimits"])}</li><li>The interactive page does the math and the limit check. This PDF shows the plan as written.</li></ul></div><div class="card"><h3>Not used in this plan</h3><ul>{"".join(f"<li>{esc(x)}</li>" for x in PR["never"])}</ul></div>{foot(n)}</section>')
n += 1
cal = ''.join(f'<div class="dow">{x}</div>' for x in dn)
for d in P['days']:
    cal += f'<div class="cell" style="--tc:{TCOL[d["tier"]]}"><small>{fmt(dt(d["day"]), "%b").upper()}</small><b>{dt(d["day"]).day}</b><span>{d["kcal"]:,} kcal</span><span>P{d["p"]} {"N" + str(d["net"]) if PR.get("netCarbs") else "C" + str(d["c"])} F{d["f"]}</span></div>'
key = ''.join(f'<span><i style="background:{TCOL[t]}"></i>{TNAME[t]} {esc(TRANGE[t])}</span>' for t in tiers)
pages.append(f'<section class="page"><div class="eyebrow">Month at a glance</div><h2 class="pg-title">{fmt(start, "%B %d")} – {fmt(dt(30), "%B %d, %Y")}</h2><div class="cal">{cal}</div><div class="key">{key}</div>{foot(n)}</section>')
# 2 weeks of shopping per page
def wk(w):
    days = [P['days'][i - 1] for i in w['days']]
    lists = ''.join(f'<div class="card gcat"><h3>{esc(h)}</h3>{"".join(f"<div><span>{esc(x)}</span><b>{esc(y)}</b></div>" for x, y in items)}</div>' for h, items in groc(days))
    return f'<h2 class="pg-title" style="font-size:16pt;margin:4px 0 8px">Week {w["week"]}: {fmt(dt(w["days"][0]), "%b %d")} – {fmt(dt(w["days"][-1]), "%b %d")}</h2><div class="glist sm">{lists}</div>'
for g in range(0, len(P['weeks']), 2):
    n += 1
    pages.append(f'<section class="page"><div class="eyebrow">Shopping list</div>{"".join(wk(w) for w in P["weeks"][g:g + 2])}<p style="font-size:8.5pt;color:#587065;margin-top:6px">{esc(PR["groceryNote"])}</p>{foot(n)}</section>')
# 3 days per page: each day is a band, its meals side by side with small photos (keeps a 30-day plan near 19 pages, not 39)
DPP = 3
def dayband(d):
    meals = ''
    for m in d['meals']:
        na = len(m.get('adds', [])); its = m['items']
        lis = ''.join(f'<li class="{"add" if i >= len(its) - na else ""}">{"+ " if i >= len(its) - na else ""}{esc(disp(k, q))}</li>' for i, (k, q) in enumerate(its))
        ph = f'style="background-image:url({imgs[m["key"]]})"' if m['key'] in imgs else ''
        meals += f'<div class="dm"><div class="ph" {ph}></div><div class="tx"><div class="slot">{esc(m["slot"])} · {esc(m["time"])}</div><h3>{esc(m["name"])}</h3><div class="mc"><span style="--k:#E4EEE8">{m["kcal"]} kcal</span><span style="--k:#BFE8D2">P {m["p"]}</span><span style="--k:#F8D9A8">{"N " + str(m["net"]) if PR.get("netCarbs") else "C " + str(m["c"])}</span><span style="--k:#BFE0EE">F {m["f"]}</span></div><ul>{lis}</ul></div></div>'
    return f'''<div class="day"><div class="dh"><h2>Day {d["day"]}</h2><span class="dd" style="white-space:nowrap">{fmt(dt(d["day"]), "%a, %b %d")} · Wk {(d["day"] - 1) // 7 + 1}{" · " + {"STR": "Strength", "HIIT": "HIIT", "REST": "Rest"}.get(d.get("dtype"), "") + " · " + d["fast"] if d.get("fast") else ""}</span><span class="tier" style="background:{TCOL[d["tier"]]}">{TNAME[d["tier"]].upper()}</span><span class="tot"><b>{d["kcal"]:,}</b> kcal · <b>{d["p"]}</b>P · <b>{d["net"] if PR.get("netCarbs") else d["c"]}</b>{"N" if PR.get("netCarbs") else "C"} · <b>{d["f"]}</b>F · <b>{d["fib"]}</b> fiber</span></div>
<div class="dms" style="grid-template-columns:repeat({len(d["meals"])},1fr)">{meals}</div><p class="chk">{esc(PR.get("checkLabel","Check"))}: {esc(d["check"])}{esc(PR.get("checkSuffix",""))}</p></div>'''
for g in range(0, len(P['days']), DPP):
    n += 1; grp = P['days'][g:g + DPP]
    pages.append(f'<section class="page days"><div class="eyebrow">Daily menus · Days {grp[0]["day"]}–{grp[-1]["day"]} · grams: P protein, {"N net carbs" if PR.get("netCarbs") else "C carbs"}, F fat</div>{"".join(dayband(d) for d in grp)}{foot(n)}</section>')
html = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'
hp = os.path.splitext(a.out)[0] + '.print.html'
open(hp, 'w').write(html)
subprocess.run(['node', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'print_pdf.js'), hp, a.out], check=True)
print('wrote', a.out, len(pages), 'pages')
