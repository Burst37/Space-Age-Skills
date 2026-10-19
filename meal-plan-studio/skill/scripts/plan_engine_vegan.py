#!/usr/bin/env python3
"""Plan engine: vegan plus eggs, hypothyroid-friendly (no cruciferous vegetables), 3 meals a day.

Usage: python plan_engine_vegan.py [--config client.json] --out plan_out
Config keys (defaults in CFG): cycle [[tier, carb target] x7, Mon..Sun], kcal {tier: kcal}, min_protein.
Writes plan.json and db.json (same shape as plan_engine.py, so build_webapp.py works unchanged).
"""
import json, itertools, sys, os, copy, math
CFG = {'cycle': [['MED', 82], ['LOW', 72], ['HIGH', 90], ['LOW', 72], ['MED', 82], ['LOW', 72], ['LOW', 72]],
       'kcal': {'LOW': 1330, 'MED': 1360, 'HIGH': 1400}, 'min_protein': 139, 'egg_week_max': 8}
OUT_DIR = '.'
for i, a in enumerate(sys.argv):
    if a == '--config': CFG.update(json.load(open(sys.argv[i + 1])))
    if a == '--out': OUT_DIR = sys.argv[i + 1]
os.makedirs(OUT_DIR, exist_ok=True)

# per unit: kcal, P, C, F, fiber (USDA-based estimates)
DB = {
 'egg':   dict(u='', n1='large egg', n='large eggs', m=(72, 6.3, .4, 4.8, 0), cat='protein', grp='Eggs'),
 'white': dict(u='cup', n='egg whites', m=(126, 26.5, 1.8, .2, 0), cat='protein', grp='Eggs'),
 'tofu':  dict(u='oz', n='tofu, firm', m=(25, 2.8, .7, 1.3, .3), cat='protein', grp='Soy'),
 'tempeh':dict(u='oz', n='tempeh', m=(54, 5.4, 2.5, 3.1, 1.1), cat='protein', grp='Soy'),
 'edamame':dict(u='cup', n='shelled edamame', m=(188, 18.5, 13.8, 8, 8), cat='protein', grp='Soy'),
 'seitan':dict(u='oz', n='seitan', m=(30, 6.3, 1.5, .5, .2), cat='protein', grp='Plant protein'),
 'pea':   dict(u='scoop', n='plant protein powder (pea)', m=(120, 22, 3, 2, 1), cat='protein', grp='Plant protein'),
 'nooch': dict(u='tbsp', n='nutritional yeast', m=(20, 3, 2, 0, 1), cat='protein', grp='Plant protein'),
 'lentil':dict(u='cup', n='cooked lentils', m=(230, 18, 40, .8, 15.6), cat='protein', grp='Legumes'),
 'chick': dict(u='cup', n='cooked chickpeas', m=(269, 14.5, 45, 4.2, 12.5), cat='protein', grp='Legumes'),
 'bbean': dict(u='cup', n='cooked black beans', m=(227, 15, 41, .9, 15), cat='protein', grp='Legumes'),
 'oats':  dict(u='cup', n='oats (dry)', m=(300, 10.4, 54, 5.2, 8), cat='carb', grp='Grains & starch'),
 'quinoa':dict(u='cup', n='cooked quinoa', m=(222, 8.2, 39.4, 3.6, 5.2), cat='carb', grp='Grains & starch'),
 'brice': dict(u='cup', n='cooked brown rice', m=(216, 5, 44.8, 1.8, 3.6), cat='carb', grp='Grains & starch'),
 'sweetp':dict(u='oz', n='baked sweet potato', m=(25.5, .6, 5.9, 0, .9), cat='carb', grp='Grains & starch'),
 'bread': dict(u='slice', n='sprouted whole-grain bread', m=(81, 4, 13.8, 1.1, 1.9), cat='carb', grp='Grains & starch'),
 'blueb': dict(u='cup', n='blueberries', m=(84, 1.1, 21.4, .5, 3.6), cat='carb', grp='Fruit'),
 'rasp':  dict(u='cup', n='raspberries', m=(64, 1.5, 14.7, .8, 8), cat='carb', grp='Fruit'),
 'apple': dict(u='', n1='medium apple', n='medium apples', m=(95, .5, 25, .3, 4.4), cat='carb', grp='Fruit'),
 'banana':dict(u='', n1='medium banana', n='medium bananas', m=(105, 1.3, 27, .4, 3.1), cat='carb', grp='Fruit'),
 'orange':dict(u='', n1='medium orange', n='medium oranges', m=(62, 1.2, 15.4, .2, 3.1), cat='carb', grp='Fruit'),
 'spinach':dict(u='cup', n='spinach (raw)', m=(7, .9, 1.1, .1, .7), cat='veg'),
 'pepper':dict(u='cup', n='bell peppers', m=(46, 1.5, 9, .4, 3.1), cat='veg'),
 'zuc':   dict(u='cup', n='zucchini, sautéed', m=(30, 2, 6, .6, 2), cat='veg'),
 'mush':  dict(u='cup', n='sliced mushrooms', m=(15, 2.2, 2.3, .2, .7), cat='veg'),
 'tomato':dict(u='', n1='medium tomato', n='medium tomatoes', m=(22, 1.1, 4.8, .2, 1.5), cat='veg'),
 'gbean': dict(u='cup', n='green beans, steamed', m=(44, 2.4, 9.9, .4, 4), cat='veg'),
 'carrot':dict(u='cup', n='shredded carrots', m=(52, 1.2, 12.2, .3, 3.6), cat='veg'),
 'aspar': dict(u='cup', n='asparagus', m=(27, 3, 5.2, .2, 2.8), cat='veg'),
 'cuke':  dict(u='cup', n='cucumber', m=(16, .7, 3.8, .1, .5), cat='veg'),
 'lettuce':dict(u='cup', n='lettuce', m=(8, .6, 1.5, .1, 1), cat='veg'),
 'eggplant':dict(u='cup', n='eggplant, cubed', m=(20, .8, 4.8, .2, 2.5), cat='veg'),
 'celery':dict(u='cup', n='celery', m=(16, .7, 3, .2, 1.6), cat='veg'),
 'oil':   dict(u='tsp', n='olive oil', m=(40, 0, 0, 4.5, 0), cat='fat'),
 'avo':   dict(u='', n1='¼ medium avocado', n='¼ medium avocado', m=(80, 1, 4.3, 7.3, 3.4), cat='fat'),
 'almond':dict(u='oz', n='almonds', m=(164, 6, 6.1, 14.2, 3.5), cat='fat'),
 'walnut':dict(u='oz', n='walnuts', m=(185, 4.3, 3.9, 18.5, 1.9), cat='fat'),
 'chia':  dict(u='tbsp', n='chia seeds', m=(58, 2, 5.1, 3.7, 4.1), cat='fat'),
 'flax':  dict(u='tbsp', n='ground flaxseed', m=(37, 1.3, 2, 2.9, 1.9), cat='fat'),
 'hemp':  dict(u='tbsp', n='hemp seeds', m=(55, 3.2, .9, 4.9, .4), cat='fat'),
 'tahini':dict(u='tbsp', n='tahini', m=(89, 2.6, 3.2, 8, 1.4), cat='fat'),
 'pumpk': dict(u='oz', n='pumpkin seeds', m=(158, 8.6, 3, 14, 1.7), cat='fat'),
}
FR = {.25: '¼', .5: '½', .75: '¾', 1/3: '⅓', 2/3: '⅔'}
def q2s(q):
    w = int(q); f = q - w; fs = ''
    for k, v in FR.items():
        if abs(f - k) < 1e-6: fs = v
    if f and not fs: return str(round(q, 2))
    return ((str(w) if w else '') + fs) if (w or fs) else '0'
def disp(key, q):
    d = DB[key]
    if key == 'avo': return d['n1'] if q == 1 else f"{q2s(q)} × ¼ avocado"
    if d['u'] == '': return f"{q2s(q)} {d['n1'] if q <= 1 else d['n']}"
    u = d['u']
    if u != 'oz' and q > 1: u += 's'
    return f"{q2s(q)} {u} {d['n']}"
def calc(items):
    t = [0] * 5
    for k, q in items:
        for i in range(5): t[i] += DB[k]['m'][i] * q
    return t
def meal(name, items, tags=()):
    t = calc(items)
    return dict(name=name, items=[(k, q) for k, q in items], lines=[disp(k, q) for k, q in items], adds=[],
                kcal=round(t[0]), p=round(t[1]), c=round(t[2]), f=round(t[3]), fib=round(t[4]), tags=list(tags))
def extend(m, adds):
    its = list(m['items']) + list(adds); t = calc(its)
    n = dict(m); n['items'] = its; n['adds'] = [disp(k, q) for k, q in adds] if adds else list(m.get('adds', []))
    if m.get('adds') and adds: n['adds'] = list(m['adds']) + [disp(k, q) for k, q in adds]
    n['kcal'], n['p'], n['c'], n['f'], n['fib'] = round(t[0]), round(t[1]), round(t[2]), round(t[3]), round(t[4])
    return n

# Meal 1 (12:00 PM) -- starts the eating window, after thyroid medication has been taken at least 4 hours earlier
B = {
 'B1': meal('Veggie Omelette', [('egg', 2), ('white', .5), ('spinach', 1), ('pepper', .5), ('mush', .5), ('oil', 1)]),
 'B2': meal('Egg-White Mushroom Scramble', [('white', 1.25), ('egg', 1), ('mush', 1), ('pepper', .5), ('oil', 1), ('avo', 1)]),
 'B3': meal('Tofu Veggie Scramble', [('tofu', 5), ('spinach', 1), ('mush', .5), ('pepper', .5), ('nooch', 1), ('oil', 1), ('avo', 1)]),
 'B4': meal('Protein Oat Bowl', [('oats', 1/3), ('pea', 1), ('chia', 1), ('blueb', .5), ('walnut', .5)]),
 'B5': meal('Berry Protein Smoothie Bowl', [('pea', 1.5), ('rasp', .5), ('chia', 1), ('hemp', 2), ('almond', .5)]),
 'B6': meal('Zucchini Egg Frittata Cups', [('egg', 2), ('white', .75), ('zuc', .75), ('tomato', .5), ('nooch', 1), ('oil', 1)]),
}
# Meal 2 (3:30 PM)
L = {
 'L1': meal('Tempeh Veggie Bowl', [('tempeh', 4), ('gbean', 1), ('carrot', .5), ('oil', 1), ('quinoa', .25)]),
 'L2': meal('Lentil Spinach Dal', [('lentil', .75), ('spinach', 2), ('tomato', .5), ('nooch', 1), ('oil', 1)]),
 'L3': meal('Seitan Veggie Stir-Fry', [('seitan', 5), ('zuc', 1), ('pepper', 1), ('mush', 1), ('oil', 1.5)]),
 'L4': meal('Tofu Buddha Bowl', [('tofu', 5), ('gbean', 1), ('carrot', .5), ('quinoa', .25), ('tahini', 1)]),
 'L5': meal('Chickpea Spinach Salad', [('chick', .5), ('spinach', 2), ('cuke', 1), ('avo', 1), ('oil', 1), ('hemp', 1)]),
 'L6': meal('Black Bean Veggie Bowl', [('bbean', .5), ('zuc', 1), ('pepper', .5), ('avo', 1), ('white', .5)]),
 'L7': meal('Egg & Tomato Curry', [('egg', 2), ('tomato', 1.5), ('spinach', 1), ('nooch', 1), ('oil', 1), ('seitan', 2)]),
}
# Meal 3 (7:30 PM)
D = {
 'D1': meal('Tofu Mushroom Stir-Fry', [('tofu', 6), ('mush', 1), ('gbean', 1), ('oil', 1.25)]),
 'D2': meal('Tempeh & Asparagus Plate', [('tempeh', 4), ('aspar', 1), ('carrot', .5), ('oil', 1)]),
 'D3': meal('Seitan & Roasted Veggie Plate', [('seitan', 5), ('zuc', 1), ('tomato', 1), ('walnut', .5), ('oil', .5)]),
 'D4': meal('Lentil Veggie Curry', [('lentil', .5), ('spinach', 2), ('tomato', 1), ('tofu', 3), ('oil', 1)]),
 'D5': meal('Egg-White Veggie Frittata', [('white', 1.75), ('egg', 1), ('mush', 1), ('spinach', 1), ('pepper', .5), ('oil', 1)]),
 'D6': meal('Edamame Quinoa Bowl', [('edamame', .5), ('quinoa', .25), ('cuke', 1), ('avo', 1), ('seitan', 2), ('oil', .5)]),
}
for _D in (B, L, D):
    for _k, _v in _D.items(): _v['key'] = _k
SOY = ('tofu', 'tempeh', 'edamame')
def cups(m, key): return sum(q for k, q in m['items'] if k == key)
def has(m, ks): return any(k in ks for k, _ in m['items'])

CYCLE = [tuple(c) for c in CFG['cycle']]; KCAL = CFG['kcal']
ADD_B = [None, ('blueb', .5), ('rasp', .5), ('apple', 1), ('banana', .5), ('bread', 1), ('oats', 1/3)]
ADD_L = [None, ('carrot', .5), ('sweetp', 2), ('sweetp', 3), ('quinoa', .25), ('quinoa', .5), ('brice', .5), ('orange', 1), ('apple', 1)]
FATTOP = [('oil', 1), ('oil', 2), ('avo', 1), ('walnut', .5), ('almond', .5), ('tahini', 1), ('pumpk', .5), ('walnut', 1)]
last = {}; days = []; egg_week = {}
for i in range(30):
    tier, tc = CYCLE[i % 7]; wk = i // 7
    best = None
    for b, l, d in itertools.product(B, L, D):
        if l == d: continue
        ms = [B[b], L[l], D[d]]
        eggs = sum(cups(m, 'egg') for m in ms)
        if eggs > 2: continue
        if egg_week.get(wk, 0) + eggs > CFG['egg_week_max']: continue
        if sum(1 for m in ms if has(m, SOY)) > 2: continue
        age = sum(min(i - last.get(x, -99), 9) for x in (b, l, d))
        if any(i - last.get(x, -99) < 3 for x in (b, l, d)): continue
        base_c = sum(m['c'] for m in ms)
        short = max(0, CFG['min_protein'] - sum(m['p'] for m in ms) - 3)
        if base_c + 3 * math.ceil(short / 22 * 2) / 2 > tc - 3: continue
        sc = -age + abs(tc - 18 - base_c) * 0.08
        if best is None or sc < best[0]: best = (sc, b, l, d, eggs)
    if best is None:
        for b, l, d in itertools.product(B, L, D):
            if l == d: continue
            ms = [B[b], L[l], D[d]]
            if sum(cups(m, 'egg') for m in ms) > 2 or sum(1 for m in ms if has(m, SOY)) > 2: continue
            if egg_week.get(wk, 0) + sum(cups(m, 'egg') for m in ms) > CFG['egg_week_max']: continue
            age = sum(min(i - last.get(x, -99), 9) for x in (b, l, d))
            sc = -age * 0.3 + max(0, sum(m['c'] for m in ms) - (tc - 8)) * 1.0
            if best is None or sc < best[0]: best = (sc, b, l, d, sum(cups(m, 'egg') for m in ms))
    _, b, l, d, eggs = best
    for x in (b, l, d): last[x] = i
    egg_week[wk] = egg_week.get(wk, 0) + eggs
    m1, m2, m3 = copy.deepcopy(B[b]), copy.deepcopy(L[l]), copy.deepcopy(D[d])
    P = m1['p'] + m2['p'] + m3['p']
    if P < CFG['min_protein']:
        q = next((x for x in [.5, 1, 1.5, 2, 2.5, 3] if x * 22 >= CFG['min_protein'] - P - 3), 3)
        m2 = extend(m2, [('pea', q)])
    base_c = m1['c'] + m2['c'] + m3['c']
    need = tc - base_c; pick = None
    for ab, al, ad in itertools.product(ADD_B, ADD_L, ADD_L):
        if al and ad and al == ad: continue
        adds = [ab, al, ad]; c = sum(calc([a])[2] for a in adds if a)
        rep = sum(1 for a in adds if a and last.get(('add',) + a, -99) >= i - 2)
        sc = abs(c - need) + rep * 3 + sum(1 for a in adds if a) * 0.6
        if pick is None or sc < pick[0]: pick = (sc, adds)
    adds = pick[1]
    for a in adds:
        if a: last[('add',) + a] = i
    if adds[0]: m1 = extend(m1, [adds[0]])
    if adds[1]: m2 = extend(m2, [adds[1]])
    if adds[2]: m3 = extend(m3, [adds[2]])
    kc = m1['kcal'] + m2['kcal'] + m3['kcal']; gap = KCAL[tier] - kc
    for _ in range(2):
        if gap >= 35:
            have = [k for k, _q in m3['items']]
            cand = [t for t in FATTOP if t[0] not in have or t[0] == 'oil']
            t1 = min(cand, key=lambda t: abs(calc([t])[0] - gap))
            m3 = extend(m3, [t1]); gap -= calc([t1])[0]
    meals = [('Meal 1 · Break fast', '12:00 PM', m1), ('Meal 2 · Power lunch', '3:30 PM', m2), ('Meal 3 · Last call', '7:30 PM', m3)]
    tot = [sum(m[k] for _, _, m in meals) for k in ('kcal', 'p', 'c', 'f', 'fib')]
    days.append(dict(day=i + 1, tier=tier, ctarget=tc, meals=[dict(slot=a, time=t, **m) for a, t, m in meals],
                     kcal=tot[0], p=tot[1], c=tot[2], f=tot[3], fib=tot[4]))
if __name__ == '__main__':
    for d in days: print(d['day'], d['tier'], d['kcal'], d['p'], d['c'], d['f'], d['fib'], [m['key'] for m in d['meals']])
for d in days:
    tot = {}
    for m in d['meals']:
        for k, q in m['items']: tot[k] = tot.get(k, 0) + q
    parts = [f"{n} {q2s(tot[k])}{u}" for k, n, u in (('egg', 'whole eggs', '/2'), ('tofu', 'tofu', ' oz'), ('tempeh', 'tempeh', ' oz'), ('edamame', 'edamame', ' cup')) if tot.get(k)]
    d['check'] = ' · '.join(parts) or 'no eggs or soy'
    d['week'] = (d['day'] - 1) // 7 + 1
weeks = []
for w in range(5):
    dl = days[w * 7:(w + 1) * 7]
    weeks.append(dict(week=w + 1, days=[d['day'] for d in dl], avg={k: round(sum(d[k] for d in dl) / len(dl)) for k in ('kcal', 'p', 'c', 'f', 'fib')}, groc={}))
avg = {k: round(sum(d[k] for d in days) / 30) for k in ('kcal', 'p', 'c', 'f', 'fib')}
json.dump(dict(days=days, weeks=weeks, avg=avg, protein_by_source={}, slot_avg={},
               minmax=dict(kmin=min(d['kcal'] for d in days), kmax=max(d['kcal'] for d in days), pmin=min(d['p'] for d in days), pmax=max(d['p'] for d in days), cmin=min(d['c'] for d in days), cmax=max(d['c'] for d in days))),
          open(os.path.join(OUT_DIR, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
# swap database
_step = {'cup': .25, 'oz': .5, 'tsp': .5, 'tbsp': .5, 'scoop': .5, 'slice': 1, '': .5}
db = {}
for k, v in DB.items():
    e = dict(n=v['n'], n1=v.get('n1', v['n']), u=v['u'], cat=v['cat'], m=list(v['m']), step=_step.get(v['u'], .5))
    if k in ('egg', 'avo'): e['step'] = 1
    if k in ('walnut', 'almond', 'pumpk'): e['step'] = .25
    if k == 'tomato': e['vol'] = .75
    if k in ('quinoa', 'brice'): e['dry'] = 3
    if k == 'sweetp': e['lbf'] = 1.0
    db[k] = e
db['egg']['cap'] = 2
for k in ('tofu', 'tempeh'): db[k]['cap'] = 8
json.dump(db, open(os.path.join(OUT_DIR, 'db.json'), 'w'), ensure_ascii=False)
print('avg', avg, 'minP', min(d['p'] for d in days), 'carbs', min(d['c'] for d in days), max(d['c'] for d in days), 'kcal', min(d['kcal'] for d in days), max(d['kcal'] for d in days))
