#!/usr/bin/env python3
"""Build the visual food swap guide (one HTML page) and a printable PDF from a foods JSON file.

Usage: python build_swap_guide.py --foods assets/foods/vegan_hypothyroid_foods.json --client Swapna --out swap_guide.html [--pdf swap_guide.pdf]
Each food: n, cat (protein|carb|veg|fat), grp, amt, u (unit), g (grams in the serving), kcal, p, c, fib, sug, f, sat, tags, note.
Values are USDA-based estimates, the same reference data FatSecret uses for generic foods. Verify brand products on the label.
"""
import argparse, json, os, subprocess
ap = argparse.ArgumentParser()
ap.add_argument('--foods', required=True); ap.add_argument('--client', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--pdf'); ap.add_argument('--intro'); ap.add_argument('--footer')
a = ap.parse_args()
foods = json.load(open(a.foods))
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
intro = a.intro or "Choose any food in a category to replace another in the same category. Protein is swapped on grams of protein, carbs on grams of carbohydrate, fat on grams of fat, and vegetables cup for cup. Never swap across categories."
footer = a.footer or "Nutrition values are standard USDA-based estimates for plain, unbranded foods, the same reference data FatSecret lists for generic foods. Brand products differ, so check the label. Review soy, gluten and legume portions with the treating dietitian."
t = open(os.path.join(root, 'assets', 'swap_guide_template.html')).read()
for k, v in {'__FOODS__': json.dumps(foods, ensure_ascii=False), '__NOTES__': '{}', '__CLIENT__': a.client, '__INTRO__': intro, '__FOOTER__': footer}.items():
    t = t.replace(k, v)
open(a.out, 'w').write(t)
print('wrote', a.out)
if a.pdf:
    esc = lambda s: str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    CAT = [('protein', 'Proteins', 'Swap on grams of protein. Equal amount = 25 g of protein.', 'p', 25), ('carb', 'Carbohydrates', 'Swap on grams of carbohydrate. Equal amount = 20 g of carbs.', 'c', 20),
           ('veg', 'Vegetables', 'Swap cup for cup.', None, 1), ('fat', 'Healthy fats', 'Swap on grams of fat. Equal amount = 10 g of fat.', 'f', 10)]
    def num(q):
        q = round(q * 8) / 8; w = int(q + 1e-9); f = round(q - w, 3)
        fr = {.125: '⅛', .25: '¼', .375: '⅜', .5: '½', .625: '⅝', .75: '¾', .875: '⅞'}.get(f, '')
        return ((str(w) if w else '') + fr) or '0'
    def unit(f, amt):
        u = f['u']
        if u == 'large': return f"{num(amt)} large {'egg' if amt <= 1 else 'eggs'}"
        if u == 'medium': return f"{num(amt)} medium"
        if u in ('cup', 'slice', 'scoop'): return f"{num(amt)} {u}{'' if amt <= 1 else 's'}"
        return f"{num(amt)} {u}"
    css = '''@page{size:Letter;margin:0}*{box-sizing:border-box}body{margin:0;font-family:"Helvetica Neue",Arial,sans-serif;color:#0F2A20}
.page{width:8.5in;height:11in;padding:.42in .45in;page-break-after:always;position:relative;overflow:hidden}
h1{font-family:Georgia,serif;font-size:22pt;margin:0}.sub{font-size:9pt;color:#587065;margin:3px 0 10px}.eb{font-size:8pt;letter-spacing:.2em;color:#1B9A60;font-weight:700;text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.c{border:1px solid #D2E0D8;border-radius:9px;padding:7px 8px;height:1.78in;overflow:hidden}
.c h3{font-size:9pt;margin:0;line-height:1.15}.c .sv{font-size:7pt;color:#587065}.k{display:flex;justify-content:space-between;align-items:baseline;margin:3px 0}.k b{font-family:Georgia,serif;font-size:15pt}.k span{font-size:6.5pt;color:#587065;letter-spacing:.1em}
.sp{display:flex;height:6px;border-radius:9px;overflow:hidden;margin-bottom:3px}.sp i{display:block}
.r{display:flex;justify-content:space-between;font-size:7.3pt;padding:1.3px 0;border-bottom:1px solid #E6EFE9}.r.s{color:#587065;font-size:6.6pt}.r em{font-style:normal;color:#587065;font-size:6.6pt}
.eq{background:#E4EEE8;border-radius:6px;padding:3px 5px;margin-top:4px;font-size:7pt}.eq b{color:#1B7A50}.tg{font-size:6pt;font-weight:700;color:#B35C00;margin-top:2px}
.f{position:absolute;left:.45in;right:.45in;bottom:.25in;font-size:6.5pt;color:#587065}'''
    pages = []
    for k, title, sub, ix, tg in CAT:
        cards = ''
        for f in [x for x in foods if x['cat'] == k]:
            m = f['f'] * 9 + f['c'] * 4 + f['p'] * 4 or 1
            pp, cp = round(f['p'] * 4 / m * 100), round(f['c'] * 4 / m * 100); fp = max(0, 100 - pp - cp)
            if k == 'veg': eq = '1 cup'
            else:
                v = f[ix]; eq = unit(f, f['amt'] * tg / v) if v >= .3 else 'n/a'
                if f['u'] == 'large': eq += ' (daily max 2)'
            tags = ' · '.join(t.upper() for t in f.get('tags', []))
            cards += f'''<div class="c"><h3>{esc(f['n'])}</h3><div class="sv">{esc(unit(f, f['amt']))} · {f['g']:g} g</div><div class="k"><b>{round(f['kcal'])}</b><span>CALORIES</span></div>
<div class="sp"><i style="width:{pp}%;background:#2FAE6E"></i><i style="width:{cp}%;background:#E08A1E"></i><i style="width:{fp}%;background:#2B9BC2"></i></div>
<div class="r"><b>Total Fat</b><span>{f['f']:g} g <em>(sat {f['sat']:g})</em></span></div>
<div class="r"><b>Total Carbs</b><span>{f['c']:g} g</span></div><div class="r s"><span>Fiber {f['fib']:g} g · Sugars {f['sug']:g} g · Net {max(0, f['c'] - f['fib']):.1f} g</span></div>
<div class="r"><b>Protein</b><span>{f['p']:g} g</span></div><div class="eq">Swap amount: <b>{esc(eq)}</b></div>{f'<div class="tg">{tags}</div>' if tags else ''}</div>'''
        pages.append(f'<section class="page"><div class="eb">{esc(a.client)} · Food swap guide</div><h1>{title}</h1><div class="sub">{sub} Calorie bar: green protein, orange carbs, blue fat.</div><div class="grid">{cards}</div><div class="f">{esc(footer)}</div></section>')
    hp = os.path.splitext(a.pdf)[0] + '.print.html'
    open(hp, 'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(pages)}</body></html>')
    subprocess.run(['node', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'print_pdf.js'), hp, a.pdf], check=True)
    print('wrote', a.pdf)
