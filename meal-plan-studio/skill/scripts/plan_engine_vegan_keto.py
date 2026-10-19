#!/usr/bin/env python3
"""Plan engine: vegan plus eggs, hypothyroid (levothyroxine), ketogenic-centric, NO SOY, NO cruciferous vegetables.
Intermittent fasting by day type: workout days 16:8 (3 meals, 12-8 PM), rest days 19:5 (2 meals, 3-8 PM).
Usage: python engine.py --out plan_out [--config client.json]
Writes plan.json and db.json (same shape as plan_engine_vegan.py so the build scripts work).
Carb tiers use NET carbs (total carbs minus fiber): KETO <= 30 g, MED ("refeed") about 55 g.
"""
import json, itertools, sys, os, copy, math
CFG = {'week': ['STR', 'HIIT', 'REST', 'STR', 'HIIT', 'STR', 'REST'],            # Mon..Sun
       'tier': {'STR': 'KETO', 'HIIT': 'KETO', 'REST': 'KETO'}, 'refeed_dow': 5,   # Saturday strength day = thyroid refeed
       'kcal': {'KETO_W': 1400, 'KETO_R': 1300, 'MED': 1450}, 'min_protein': {'W': 135, 'R': 125},
       'net_cap': 30, 'refeed_net': 55, 'egg_week_max': 8, 'seitan_max_oz': 8, 'pea_max': 3}
OUT_DIR = '.'
for i, a in enumerate(sys.argv):
    if a == '--config': CFG.update(json.load(open(sys.argv[i + 1])))
    if a == '--out': OUT_DIR = sys.argv[i + 1]
os.makedirs(OUT_DIR, exist_ok=True)

# per unit: kcal, P, C(total), F, fiber (USDA-based estimates). No soy foods and no cruciferous vegetables in this table.
DB = {
 'egg':   dict(u='', n1='large egg', n='large eggs', m=(72, 6.3, .4, 4.8, 0), cat='protein', grp='Eggs'),
 'white': dict(u='cup', n='egg whites', m=(126, 26.5, 1.8, .2, 0), cat='protein', grp='Eggs'),
 'seitan':dict(u='oz', n='seitan', m=(30, 6.3, 1.5, .5, .2), cat='protein', grp='Plant protein'),
 'pea':   dict(u='scoop', n='plant protein powder (pea)', m=(120, 22, 3, 2, 1), cat='protein', grp='Plant protein'),
 'nooch': dict(u='tbsp', n='nutritional yeast', m=(20, 3, 2, 0, 1), cat='protein', grp='Plant protein'),
 'lentil':dict(u='cup', n='cooked lentils', m=(230, 18, 40, .8, 15.6), cat='protein', grp='Legumes'),
 'sweetp':dict(u='oz', n='baked sweet potato', m=(25.5, .6, 5.9, 0, .9), cat='carb', grp='Starch'),
 'quinoa':dict(u='cup', n='cooked quinoa', m=(222, 8.2, 39.4, 3.6, 5.2), cat='carb', grp='Starch'),
 'blueb': dict(u='cup', n='blueberries', m=(84, 1.1, 21.4, .5, 3.6), cat='carb', grp='Fruit'),
 'rasp':  dict(u='cup', n='raspberries', m=(64, 1.5, 14.7, .8, 8), cat='carb', grp='Fruit'),
 'apple': dict(u='', n1='medium apple', n='medium apples', m=(95, .5, 25, .3, 4.4), cat='carb', grp='Fruit'),
 'orange':dict(u='', n1='medium orange', n='medium oranges', m=(62, 1.2, 15.4, .2, 3.1), cat='carb', grp='Fruit'),
 'banana':dict(u='', n1='medium banana', n='medium bananas', m=(105, 1.3, 27, .4, 3.1), cat='carb', grp='Fruit'),
 'spinach':dict(u='cup', n='spinach, wilted in the pan (measured raw)', m=(7, .9, 1.1, .1, .7), cat='veg'),
 'pepper':dict(u='cup', n='bell peppers', m=(46, 1.5, 9, .4, 3.1), cat='veg'),
 'zuc':   dict(u='cup', n='zucchini, sautéed', m=(30, 2, 6, .6, 2), cat='veg'),
 'mush':  dict(u='cup', n='sliced mushrooms', m=(15, 2.2, 2.3, .2, .7), cat='veg'),
 'tomato':dict(u='', n1='medium tomato', n='medium tomatoes', m=(22, 1.1, 4.8, .2, 1.5), cat='veg'),
 'gbean': dict(u='cup', n='green beans, steamed', m=(44, 2.4, 9.9, .4, 4), cat='veg'),
 'carrot':dict(u='cup', n='shredded carrots', m=(52, 1.2, 12.2, .3, 3.6), cat='veg'),
 'aspar': dict(u='cup', n='asparagus', m=(27, 3, 5.2, .2, 2.8), cat='veg'),
 'cuke':  dict(u='cup', n='cucumber', m=(16, .7, 3.8, .1, .5), cat='veg'),
 'lettuce':dict(u='cup', n='romaine lettuce', m=(8, .6, 1.5, .1, 1), cat='veg'),
 'celery':dict(u='cup', n='celery', m=(16, .7, 3, .2, 1.6), cat='veg'),
 'oil':   dict(u='tsp', n='olive oil', m=(40, 0, 0, 4.5, 0), cat='fat'),
 'coil':  dict(u='tsp', n='coconut oil', m=(40, 0, 0, 4.5, 0), cat='fat'),
 'cmilk': dict(u='cup', n='full-fat coconut milk (canned)', m=(445, 4.6, 6.4, 48.2, 5.3), cat='fat'),
 'avo':   dict(u='', n1='¼ medium avocado', n='¼ medium avocado', m=(80, 1, 4.3, 7.3, 3.4), cat='fat'),
 'olive': dict(u='oz', n='black olives', m=(33, .2, 1.8, 3, .9), cat='fat'),
 'almond':dict(u='oz', n='almonds', m=(164, 6, 6.1, 14.2, 3.5), cat='fat'),
 'walnut':dict(u='oz', n='walnuts', m=(185, 4.3, 3.9, 18.5, 1.9), cat='fat'),
 'mac':   dict(u='oz', n='macadamia nuts', m=(204, 2.2, 3.9, 21.5, 2.4), cat='fat'),
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
def fin(m, items, adds):
    t = calc(items)
    m = dict(m); m.update(items=list(items), lines=[disp(k, q) for k, q in items[:len(items) - len(adds)]], adds=adds, kcal=round(t[0]), p=round(t[1]), c=round(t[2]), f=round(t[3]), fib=round(t[4]), net=round(t[2] - t[4]))
    return m
def meal(name, items): return fin(dict(name=name), items, [])
def extend(m, add):
    items = list(m['items']); k, q = add
    for j, (k2, q2) in enumerate(items):          # same ingredient already in the meal: merge, so no duplicate lines
        if k2 == k: items[j] = (k, q2 + q); return fin(m, items, list(m['adds']))
    return fin(m, items + [add], list(m['adds']) + [disp(k, q)])

# Workout-day meals: Meal 1 (12:00 PM, after training), Meal 2 (3:30 PM), Meal 3 (7:30 PM)
B = {
 'B1': meal('Veggie Omelette', [('egg', 2), ('white', .5), ('spinach', 1), ('pepper', .5), ('mush', .5), ('oil', 1), ('avo', 1)]),
 'B2': meal('Egg-White Mushroom Scramble', [('white', 1.25), ('egg', 1), ('mush', 1), ('pepper', .25), ('oil', 1), ('avo', 1)]),
 'B3': meal('Coconut Chia Protein Pudding', [('pea', 1.5), ('cmilk', .25), ('chia', 1), ('rasp', .25), ('hemp', 2), ('almond', .5)]),
 'B5': meal('Asparagus & Egg-White Plate', [('white', 1.5), ('egg', 1), ('aspar', 1), ('avo', 1), ('oil', 1), ('hemp', 1)]),
 'B7': meal('Warm Chia-Flax Protein Porridge', [('pea', 1), ('chia', 1.5), ('flax', 2), ('hemp', 2), ('cmilk', .25), ('rasp', .25)]),
 'B6': meal('Berry Hemp Protein Smoothie Bowl', [('pea', 1.5), ('cmilk', .25), ('rasp', .25), ('hemp', 2), ('flax', 1), ('almond', .5)]),
}
# Meal 2 (3:30 PM on workout days; Meal 1 at 3:00 PM on rest days)
L = {
 'L1': meal('Seitan Veggie Stir-Fry', [('seitan', 4), ('white', .5), ('zuc', 1), ('pepper', .5), ('mush', 1), ('oil', 1.5)]),
 'L2': meal('Avocado Egg Salad Bowl', [('egg', 1), ('white', 1), ('avo', 2), ('celery', .5), ('cuke', 1), ('hemp', 1), ('oil', 1)]),
 'L3': meal('Coconut Egg & Tomato Curry', [('egg', 2), ('tomato', 1.5), ('spinach', 2), ('cmilk', .25), ('nooch', 1), ('seitan', 2), ('coil', 1)]),
 'L4': meal('Seitan & Tahini Lettuce Wraps', [('seitan', 5), ('lettuce', 2), ('cuke', .5), ('tahini', 1), ('hemp', 1), ('avo', 1)]),
 'L5': meal('Creamy Mushroom Zoodles', [('seitan', 4), ('zuc', 1.5), ('mush', 1), ('cmilk', .25), ('nooch', 1), ('oil', 1)]),
 'L7': meal('Chilled Avocado-Cucumber Soup', [('cuke', 1.5), ('avo', 1.5), ('pea', 1), ('hemp', 2), ('cmilk', .25), ('pumpk', .5), ('oil', 1)]),
 'L6': meal('Pumpkin-Seed Pesto Zoodle Bowl', [('seitan', 3), ('white', .5), ('zuc', 1.5), ('tomato', .5), ('pumpk', 1), ('oil', 1), ('nooch', 1)]),
}
# Last meal (7:30 PM on workout days, 7:00 PM on rest days)
D = {
 'D1': meal('Seitan & Roasted Veggie Plate', [('seitan', 5), ('zuc', 1), ('tomato', 1), ('walnut', .5), ('oil', .5)]),
 'D2': meal('Egg-White Veggie Frittata', [('white', 1.75), ('egg', 1), ('mush', 1), ('spinach', 1), ('pepper', .5), ('oil', 1)]),
 'D3': meal('Garlic Mushroom & Asparagus Skillet', [('seitan', 4), ('mush', 1.5), ('aspar', 1), ('oil', 1.5), ('hemp', 1)]),
 'D4': meal('Coconut Spinach & Mushroom Curry', [('seitan', 3), ('spinach', 3), ('mush', 1), ('cmilk', .25), ('tomato', .5), ('nooch', 1), ('coil', .5)]),
 'D5': meal('Seitan Fajita Skillet', [('seitan', 4), ('white', .5), ('pepper', .75), ('zuc', .5), ('avo', 1), ('oil', 1)]),
 'D7': meal('Creamy Mushroom & Spinach Soup', [('mush', 2), ('spinach', 3), ('cmilk', .25), ('pea', 1), ('nooch', 2), ('pumpk', 1), ('oil', .5)]),
 'D6': meal('Olive & Herb Egg-White Bake', [('white', 1.5), ('egg', 1), ('olive', 1), ('tomato', .5), ('spinach', 1), ('mush', .5), ('oil', 1)]),
}
for _D in (B, L, D):
    for _k, _v in _D.items(): _v['key'] = _k
def qty(m, key): return sum(q for k, q in m['items'] if k == key)

ADD = [None, ('rasp', .5), ('blueb', .5), ('apple', 1), ('banana', .5), ('orange', 1), ('sweetp', 2), ('sweetp', 3), ('quinoa', .25), ('quinoa', .5), ('lentil', .25), ('carrot', .5)]
FATTOP = [('oil', 1), ('oil', 2), ('coil', 1), ('coil', 2), ('mac', .5), ('mac', 1), ('avo', 1), ('walnut', .5), ('pumpk', .5), ('tahini', 1), ('olive', 1), ('cmilk', .25)]
WORKOUT = {'STR': 'Strength', 'HIIT': 'HIIT'}

def assemble(ms, tier, kind, tcarb):
    """Top up protein (pea), carbs (refeed adds) and calories (fats); return the meals or None if a rule breaks."""
    ms = [copy.deepcopy(m) for m in ms]
    minp = CFG['min_protein'][kind]; P = sum(m['p'] for m in ms)
    if P < minp - 1:
        q = next((x for x in [.5, 1, 1.5, 2, 2.5, 3] if x * 22 >= minp - P - 1), 99)
        if q > CFG['pea_max']: return None
        for _ in range(int(q * 2)):                                 # half-scoop steps, at most 2 scoops of powder in any one meal
            c = [j for j in range(len(ms)) if qty(ms[j], 'pea') < 2]
            if not c: return None
            j = min(c, key=lambda j: (qty(ms[j], 'pea'), ms[j]['p'])); ms[j] = extend(ms[j], ('pea', .5))
    if sum(qty(m, 'pea') for m in ms) > CFG['pea_max']: return None
    if tier == 'MED':
        need = CFG['refeed_net'] - sum(m['net'] for m in ms); best = None
        for a in itertools.product(ADD, ADD):
            if a[0] and a[0] == a[1]: continue
            net = sum(calc([x])[2] - calc([x])[4] for x in a if x)
            sc = abs(net - need) + 0.5 * sum(1 for x in a if x)
            if best is None or sc < best[0]: best = (sc, a)
        for x, i in zip(best[1], (len(ms) - 2, len(ms) - 1)):
            if x: ms[i] = extend(ms[i], x)
    tk = CFG['kcal']['MED' if tier == 'MED' else ('KETO_R' if kind == 'R' else 'KETO_W')]
    gap = tk - sum(m['kcal'] for m in ms)
    for _ in range(3):
        if gap >= 35:
            i = min(range(len(ms)), key=lambda j: ms[j]['kcal']); have = {k for k, _q in ms[i]['items']}   # fill the lightest meal
            t1 = min((t for t in FATTOP if t[0] not in have), key=lambda t: abs(calc([t])[0] - gap)); ms[i] = extend(ms[i], t1); gap -= calc([t1])[0]
    net = sum(m['net'] for m in ms)
    if tier == 'KETO' and net > CFG['net_cap']: return None
    if tier == 'MED' and abs(net - CFG['refeed_net']) > 8: return None
    return ms

last = {}; days = []; egg_week = {}; uses = {}
for i in range(30):
    dow = i % 7; kind0 = CFG['week'][dow]; kind = 'R' if kind0 == 'REST' else 'W'; wk = i // 7
    tier = 'MED' if dow == CFG['refeed_dow'] else 'KETO'
    pools = [B, L, D] if kind == 'W' else [{**B, **L}, {**L, **D}]
    best = None
    for mingap in (3, 2, 1):
      if best: break
      for combo in itertools.product(*[list(p) for p in pools]):
          if len(set(combo)) < len(combo): continue
          if kind == 'R' and (combo[0] in D or combo[1] in B): continue
          ms0 = [pools[j][k] for j, k in enumerate(combo)]
          eggs = sum(qty(m, 'egg') for m in ms0)
          if eggs > 2 or egg_week.get(wk, 0) + eggs > min(CFG['egg_week_max'], math.ceil(CFG['egg_week_max'] * (dow + 1) / 7) + 1): continue   # pace whole eggs through the week
          if sum(qty(m, 'seitan') for m in ms0) > CFG['seitan_max_oz']: continue
          gap_days = [i - last.get(x, -99) for x in combo]
          if min(gap_days) < mingap: continue
          ms = assemble(ms0, tier, kind, 0)
          if ms is None: continue
          sc = -sum(min(g, 9) for g in gap_days) + 0.02 * abs(sum(m['kcal'] for m in ms) - 1400) + 1.5 * eggs + 0.9 * sum(uses.get(x, 0) for x in combo)
          if best is None or sc < best[0]: best = (sc, combo, ms, eggs)
    if best is None: raise SystemExit(f'no valid day {i + 1}')
    _, combo, ms, eggs = best
    for x in combo: last[x] = i; uses[x] = uses.get(x, 0) + 1
    egg_week[wk] = egg_week.get(wk, 0) + eggs
    if kind == 'W': slots = [('Meal 1 · Break fast', '12:00 PM'), ('Meal 2 · Power lunch', '3:30 PM'), ('Meal 3 · Last call', '7:30 PM')]
    else: slots = [('Meal 1 · Fast-breaker', '3:00 PM'), ('Meal 2 · Last call', '7:00 PM')]
    tot = [sum(m[k] for m in ms) for k in ('kcal', 'p', 'c', 'f', 'fib', 'net')]
    days.append(dict(day=i + 1, tier=tier, ctarget=CFG['refeed_net'] if tier == 'MED' else CFG['net_cap'], dtype=kind0, kind=kind,
                     window='12:00–8:00 PM' if kind == 'W' else '3:00–8:00 PM', fast='16:8' if kind == 'W' else '19:5',
                     meals=[dict(slot=a, time=t, **m) for (a, t), m in zip(slots, ms)],
                     kcal=tot[0], p=tot[1], c=tot[2], f=tot[3], fib=tot[4], net=tot[5]))
for d in days:
    eg = sum(q for m in d['meals'] for k, q in m['items'] if k == 'egg')
    d['check'] = (f"whole eggs {q2s(eg)}/2" if eg else 'no whole eggs') + f" · net carbs {d['net']} g"
    d['week'] = (d['day'] - 1) // 7 + 1
weeks = []
for w in range(5):
    dl = days[w * 7:(w + 1) * 7]
    weeks.append(dict(week=w + 1, days=[d['day'] for d in dl], avg={k: round(sum(d[k] for d in dl) / len(dl)) for k in ('kcal', 'p', 'c', 'f', 'fib', 'net')}, groc={}))
avg = {k: round(sum(d[k] for d in days) / 30) for k in ('kcal', 'p', 'c', 'f', 'fib', 'net')}
json.dump(dict(days=days, weeks=weeks, avg=avg, protein_by_source={}, slot_avg={},
               minmax=dict(kmin=min(d['kcal'] for d in days), kmax=max(d['kcal'] for d in days), pmin=min(d['p'] for d in days), pmax=max(d['p'] for d in days), cmin=min(d['c'] for d in days), cmax=max(d['c'] for d in days), nmin=min(d['net'] for d in days), nmax=max(d['net'] for d in days))),
          open(os.path.join(OUT_DIR, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
_step = {'cup': .25, 'oz': .5, 'tsp': .5, 'tbsp': .5, 'scoop': .5, 'slice': 1, '': .5}
db = {}
for k, v in DB.items():
    e = dict(n=v['n'], n1=v.get('n1', v['n']), u=v['u'], cat=v['cat'], m=list(v['m']), step=_step.get(v['u'], .5))
    if k in ('egg', 'avo'): e['step'] = 1
    if k in ('walnut', 'almond', 'pumpk', 'mac'): e['step'] = .25
    if k == 'tomato': e['vol'] = .75
    if k == 'quinoa': e['dry'] = 3
    if k == 'sweetp': e['lbf'] = 1.0
    db[k] = e
db['egg']['cap'] = 2
json.dump(db, open(os.path.join(OUT_DIR, 'db.json'), 'w'), ensure_ascii=False)
if __name__ == '__main__':
    for d in days: print(d['day'], d['dtype'], d['tier'], d['kcal'], 'P', d['p'], 'C', d['c'], 'net', d['net'], 'F', d['f'], 'fib', d['fib'], [m['key'] for m in d['meals']], [sum(1 for _ in m['adds']) for m in d['meals']])
    print('avg', avg, 'minP', min(d['p'] for d in days), 'net', min(d['net'] for d in days), max(d['net'] for d in days))
