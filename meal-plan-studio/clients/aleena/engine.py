#!/usr/bin/env python3
"""Plan engine: halal omnivore (NO pork, no alcohol/gelatin ingredients), high protein, low carb, moderate fat, carb-cycled to training days.
Usage: python engine.py --out out [--config client.json]
Writes plan.json and db.json (same shape as the other engines, so the deck/PDF/app builders work).
Tiers: HIGH = training day (Mon/Tue/Thu, carbs <= 100 g), LOW = KETO day (Wed/Fri/Sat/Sun, net carbs <= 22 g, fat-forward recipes, 16:8 window 12-8 PM). Meals: 3 a day.
"""
import json, itertools, sys, os, copy, math
CFG = {'cycle': [['HIGH', 90], ['HIGH', 90], ['KETO', 25], ['HIGH', 90], ['LOW', 40], ['KETO', 25], ['LOW', 40]],   # Mon..Sun
       'kcal': {'LOW': 1380, 'KETO': 1400, 'HIGH': 1550}, 'min_protein': 140, 'keto_min_protein': 120, 'keto_net_cap': 22, 'egg_day_max': 3, 'keto_egg_day_max': 4, 'whey_max': 2}
OUT_DIR = '.'
for i, a in enumerate(sys.argv):
    if a == '--config': CFG.update(json.load(open(sys.argv[i + 1])))
    if a == '--out': OUT_DIR = sys.argv[i + 1]
os.makedirs(OUT_DIR, exist_ok=True)

# per unit: kcal, P, C, F, fiber (USDA-based estimates). No pork or pork-derived items in this table.
DB = {
 'chicken': dict(u='oz', n='chicken breast, cooked', m=(46.8, 8.8, 0, 1.0, 0), cat='protein', grp='Poultry'),
 'thigh':   dict(u='oz', n='chicken thigh, skinless, cooked', m=(50.7, 7.0, 0, 2.3, 0), cat='protein', grp='Poultry'),
 'turkey':  dict(u='oz', n='lean ground turkey, cooked', m=(60, 7.7, 0, 3.1, 0), cat='protein', grp='Poultry'),
 'beef':    dict(u='oz', n='lean ground beef (95%), cooked', m=(48.5, 7.4, 0, 1.8, 0), cat='protein', grp='Beef & lamb'),
 'steak':   dict(u='oz', n='sirloin steak, trimmed, cooked', m=(52, 8.2, 0, 2.0, 0), cat='protein', grp='Beef & lamb'),
 'lamb':    dict(u='oz', n='lean lamb leg, cooked', m=(54, 8.1, 0, 2.3, 0), cat='protein', grp='Beef & lamb'),
 'salmon':  dict(u='oz', n='salmon, cooked', m=(58, 6.3, 0, 3.5, 0), cat='protein', grp='Fish & seafood'),
 'cod':     dict(u='oz', n='cod, cooked', m=(30, 6.5, 0, .3, 0), cat='protein', grp='Fish & seafood'),
 'shrimp':  dict(u='oz', n='shrimp, cooked', m=(28, 6.8, .1, .1, 0), cat='protein', grp='Fish & seafood'),
 'tuna':    dict(u='oz', n='tuna in water, drained', m=(33, 7.2, 0, .2, 0), cat='protein', grp='Fish & seafood'),
 'egg':     dict(u='', n1='large egg', n='large eggs', m=(72, 6.3, .4, 4.8, 0), cat='protein', grp='Eggs'),
 'white':   dict(u='cup', n='egg whites', m=(126, 26.5, 1.8, .2, 0), cat='protein', grp='Eggs'),
 'greek':   dict(u='cup', n='plain nonfat Greek yogurt', m=(145, 25, 8.8, 1.0, 0), cat='protein', grp='Dairy & whey'),
 'cottage': dict(u='cup', n='cottage cheese, 2%', m=(183, 24, 9.8, 5.1, 0), cat='protein', grp='Dairy & whey'),
 'whey':    dict(u='scoop', n='whey isolate (halal-certified)', m=(110, 25, 1, .5, 0), cat='protein', grp='Dairy & whey'),
 'lentil':  dict(u='cup', n='cooked lentils', m=(230, 18, 40, .8, 15.6), cat='protein', grp='Legumes'),
 'chick':   dict(u='cup', n='cooked chickpeas', m=(269, 14.5, 45, 4.2, 12.5), cat='protein', grp='Legumes'),
 'oats':    dict(u='cup', n='rolled oats (dry)', m=(300, 10.4, 54, 5.2, 8), cat='carb', grp='Grains & starch'),
 'rice':    dict(u='cup', n='cooked basmati rice', m=(205, 4.3, 45, .4, .6), cat='carb', grp='Grains & starch'),
 'brice':   dict(u='cup', n='cooked brown rice', m=(216, 5, 44.8, 1.8, 3.6), cat='carb', grp='Grains & starch'),
 'quinoa':  dict(u='cup', n='cooked quinoa', m=(222, 8.2, 39.4, 3.6, 5.2), cat='carb', grp='Grains & starch'),
 'sweetp':  dict(u='oz', n='baked sweet potato', m=(25.5, .6, 5.9, 0, .9), cat='carb', grp='Grains & starch'),
 'pita':    dict(u='', n1='small whole-wheat pita', n='small whole-wheat pitas', m=(170, 6, 35, 1.7, 4.7), cat='carb', grp='Grains & starch'),
 'bread':   dict(u='slice', n='sprouted whole-grain bread', m=(81, 4, 13.8, 1.1, 1.9), cat='carb', grp='Grains & starch'),
 'blueb':   dict(u='cup', n='blueberries', m=(84, 1.1, 21.4, .5, 3.6), cat='carb', grp='Fruit'),
 'rasp':    dict(u='cup', n='raspberries', m=(64, 1.5, 14.7, .8, 8), cat='carb', grp='Fruit'),
 'straw':   dict(u='cup', n='strawberries', m=(49, 1, 11.7, .5, 3), cat='carb', grp='Fruit'),
 'apple':   dict(u='', n1='medium apple', n='medium apples', m=(95, .5, 25, .3, 4.4), cat='carb', grp='Fruit'),
 'banana':  dict(u='', n1='medium banana', n='medium bananas', m=(105, 1.3, 27, .4, 3.1), cat='carb', grp='Fruit'),
 'orange':  dict(u='', n1='medium orange', n='medium oranges', m=(62, 1.2, 15.4, .2, 3.1), cat='carb', grp='Fruit'),
 'spinach': dict(u='cup', n='spinach (raw)', m=(7, .9, 1.1, .1, .7), cat='veg'),
 'pepper':  dict(u='cup', n='bell peppers', m=(46, 1.5, 9, .4, 3.1), cat='veg'),
 'zuc':     dict(u='cup', n='zucchini, sautéed', m=(30, 2, 6, .6, 2), cat='veg'),
 'mush':    dict(u='cup', n='sliced mushrooms', m=(15, 2.2, 2.3, .2, .7), cat='veg'),
 'tomato':  dict(u='', n1='medium tomato', n='medium tomatoes', m=(22, 1.1, 4.8, .2, 1.5), cat='veg'),
 'gbean':   dict(u='cup', n='green beans, steamed', m=(44, 2.4, 9.9, .4, 4), cat='veg'),
 'carrot':  dict(u='cup', n='shredded carrots', m=(52, 1.2, 12.2, .3, 3.6), cat='veg'),
 'aspar':   dict(u='cup', n='asparagus', m=(27, 3, 5.2, .2, 2.8), cat='veg'),
 'cuke':    dict(u='cup', n='cucumber', m=(16, .7, 3.8, .1, .5), cat='veg'),
 'lettuce': dict(u='cup', n='romaine lettuce', m=(8, .6, 1.5, .1, 1), cat='veg'),
 'broc':    dict(u='cup', n='broccoli florets', m=(31, 2.6, 6, .3, 2.4), cat='veg'),
 'cauli':   dict(u='cup', n='cauliflower', m=(27, 2, 5.3, .3, 2.1), cat='veg'),
 'celery':  dict(u='cup', n='celery', m=(16, .7, 3, .2, 1.6), cat='veg'),
 'oil':     dict(u='tsp', n='olive oil', m=(40, 0, 0, 4.5, 0), cat='fat'),
 'avo':     dict(u='', n1='¼ medium avocado', n='¼ medium avocado', m=(80, 1, 4.3, 7.3, 3.4), cat='fat'),
 'olive':   dict(u='oz', n='black olives', m=(33, .2, 1.8, 3, .9), cat='fat'),
 'almond':  dict(u='oz', n='almonds', m=(164, 6, 6.1, 14.2, 3.5), cat='fat'),
 'walnut':  dict(u='oz', n='walnuts', m=(185, 4.3, 3.9, 18.5, 1.9), cat='fat'),
 'chia':    dict(u='tbsp', n='chia seeds', m=(58, 2, 5.1, 3.7, 4.1), cat='fat'),
 'flax':    dict(u='tbsp', n='ground flaxseed', m=(37, 1.3, 2, 2.9, 1.9), cat='fat'),
 'tahini':  dict(u='tbsp', n='tahini', m=(89, 2.6, 3.2, 8, 1.4), cat='fat'),
 'pumpk':   dict(u='oz', n='pumpkin seeds', m=(158, 8.6, 3, 14, 1.7), cat='fat'),
 'ribeye':  dict(u='oz', n='ribeye steak, cooked', m=(82.5, 6.8, 0, 6.0, 0), cat='protein', grp='Beef & lamb'),
 'greekf':  dict(u='cup', n='full-fat plain Greek yogurt', m=(270, 25, 10, 14, 0), cat='protein', grp='Dairy & whey'),
 'cmilk':   dict(u='cup', n='full-fat coconut milk (canned)', m=(445, 4.6, 6.4, 48.2, 5.3), cat='fat'),
 'mac':     dict(u='oz', n='macadamia nuts', m=(204, 2.2, 3.9, 21.5, 2.4), cat='fat'),
 'pbut':    dict(u='tbsp', n='natural peanut butter', m=(94, 3.6, 3.2, 8, 1), cat='fat'),
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
    m = dict(m); m.update(items=list(items), lines=[disp(k, q) for k, q in items[:len(items) - len(adds)]], adds=adds, kcal=round(t[0]), p=round(t[1]), c=round(t[2]), f=round(t[3]), fib=round(t[4]))
    return m
def meal(name, items): return fin(dict(name=name), items, [])
def extend(m, add):
    items = list(m['items']); k, q = add
    for j, (k2, q2) in enumerate(items):          # same ingredient already in the meal: merge, so no duplicate lines
        if k2 == k: items[j] = (k, q2 + q); return fin(m, items, list(m['adds']))
    return fin(m, items + [add], list(m['adds']) + [disp(k, q)])

# Meal 1 (8:00 AM)
B = {
 'B1': meal('Veggie Egg-White Omelette', [('egg', 2), ('white', .75), ('spinach', 1), ('pepper', .5), ('mush', .5), ('oil', 1)]),
 'B2': meal('Greek Yogurt Berry Protein Bowl', [('greek', 1.25), ('rasp', .5), ('chia', 1), ('almond', .5), ('whey', .5)]),
 'B3': meal('Turkey & Spinach Scramble', [('turkey', 3), ('egg', 1), ('white', .5), ('spinach', 2), ('tomato', .5), ('oil', .5)]),
 'B4': meal('Shakshuka with Egg Whites', [('egg', 2), ('white', .5), ('tomato', 2), ('pepper', .75), ('spinach', 1), ('oil', 1)]),
 'B5': meal('Cottage Cheese Mezze Plate', [('cottage', 1), ('cuke', 1), ('tomato', 1), ('olive', .5), ('tuna', 2), ('flax', 1)]),
 'B6': meal('Protein Oat Bowl', [('oats', 1/3), ('whey', 1), ('chia', 1), ('blueb', .25), ('walnut', .5)]),
 'B7': meal('Chicken Veggie Frittata Cups', [('egg', 2), ('white', .75), ('chicken', 2), ('zuc', .75), ('tomato', .5), ('oil', .5)]),
 'B8': meal('Berry Whey Smoothie Bowl', [('whey', 1.5), ('greek', .5), ('straw', .5), ('chia', 1), ('almond', .5), ('flax', 1)]),
}
# Meal 2 (12:30 PM)
L = {
 'L1': meal('Chicken Tikka Bowl', [('chicken', 5), ('greek', .25), ('cuke', 1), ('tomato', .5), ('lettuce', 1), ('oil', 1)]),
 'L2': meal('Tuna-Avocado Salad', [('tuna', 5), ('avo', 1), ('cuke', 1), ('celery', .5), ('tomato', .5), ('oil', 1)]),
 'L3': meal('Beef Kofta Lettuce Wraps', [('beef', 5), ('lettuce', 2), ('cuke', .5), ('tahini', 1), ('tomato', .5), ('greek', .25)]),
 'L4': meal('Grilled Shrimp & Zucchini Bowl', [('shrimp', 6), ('zuc', 1.5), ('pepper', .5), ('oil', 1.5), ('tomato', .5)]),
 'L5': meal('Chicken & Lentil Soup', [('chicken', 3), ('lentil', .5), ('spinach', 2), ('carrot', .5), ('tomato', .5), ('oil', .5)]),
 'L6': meal('Salmon Avocado Bowl', [('salmon', 4), ('avo', 1), ('cuke', 1), ('lettuce', 1), ('oil', .5)]),
 'L7': meal('Chicken & Chickpea Greek-Style Salad', [('chicken', 4), ('chick', .25), ('cuke', 1), ('tomato', 1), ('olive', 1), ('oil', 1)]),
 'L8': meal('Egg Salad Plate with Yogurt Dressing', [('egg', 2), ('white', .5), ('greek', .25), ('cuke', 1), ('celery', .5), ('lettuce', 2), ('turkey', 2)]),
}
# Meal 3 (6:30 PM)
D = {
 'D1': meal('Baked Salmon & Asparagus', [('salmon', 5), ('aspar', 1.5), ('oil', .5), ('tomato', .5)]),
 'D2': meal('Sirloin & Roasted Veg Plate', [('steak', 5), ('zuc', 1), ('pepper', .5), ('mush', 1), ('oil', 1)]),
 'D3': meal('Turkey Meatballs & Zoodles', [('turkey', 5), ('zuc', 2), ('tomato', 1.5), ('oil', 1), ('spinach', 1)]),
 'D4': meal('Garlic Chicken & Broccoli Stir-Fry', [('chicken', 5), ('broc', 1.5), ('mush', .5), ('pepper', .5), ('oil', 1.5)]),
 'D5': meal('Cod in Tomato-Herb Sauce', [('cod', 7), ('tomato', 2), ('spinach', 2), ('olive', 1), ('oil', 1)]),
 'D6': meal('Lamb Kebab & Yogurt Salad', [('lamb', 4), ('cuke', 1), ('tomato', 1), ('greek', .25), ('lettuce', 1), ('oil', .5)]),
 'D7': meal('Chicken Curry with Cauliflower', [('thigh', 5), ('cauli', 1.5), ('tomato', 1), ('spinach', 1), ('oil', 1.5)]),
 'D8': meal('Shrimp & Veggie Skillet', [('shrimp', 6), ('pepper', .75), ('zuc', 1), ('mush', .5), ('oil', 1.5)]),
}
# KETO days: fat-forward, net carbs <= 22 g a day. Meal 1 12:00 PM, Meal 2 3:30 PM, Meal 3 7:30 PM (16:8 window)
KB = {
 'KB1': meal('Avocado & Egg Skillet', [('egg', 3), ('white', .5), ('avo', 2), ('spinach', 1), ('oil', 1)]),
 'KB2': meal('Coconut Chia Yogurt Bowl', [('greekf', 1), ('whey', .5), ('chia', 1.5), ('mac', .5), ('rasp', .25)]),
 'KB3': meal('Turkey & Avocado Scramble', [('egg', 2), ('turkey', 3), ('avo', 1.5), ('spinach', 1), ('oil', 1)]),
 'KB4': meal('Salmon & Egg Plate', [('salmon', 3), ('egg', 2), ('white', .25), ('avo', 1), ('cuke', .5), ('oil', 1)]),
 'KB5': meal('Mushroom Spinach Omelette in Olive Oil', [('egg', 3), ('white', .5), ('mush', 1), ('spinach', 1.5), ('oil', 1.5), ('avo', 1)]),
}
KL = {
 'KL1': meal('Chicken Thigh Avocado Salad', [('thigh', 5), ('avo', 1.5), ('lettuce', 2), ('cuke', .5), ('oil', 1.5), ('olive', .5)]),
 'KL2': meal('Tuna-Avocado Boats', [('tuna', 5), ('avo', 2), ('celery', .5), ('cuke', .5), ('oil', 1.5), ('mac', .25)]),
 'KL3': meal('Beef Kofta with Tahini', [('beef', 5), ('lettuce', 2), ('tahini', 2), ('cuke', .5), ('oil', .5)]),
 'KL4': meal('Garlic Shrimp Zoodles', [('shrimp', 6), ('zuc', 1.5), ('oil', 2), ('almond', .5), ('white', .25)]),
}
KD = {
 'KD1': meal('Ribeye with Garlic Mushrooms', [('ribeye', 5), ('mush', 1.5), ('aspar', 1), ('oil', 1.5)]),
 'KD2': meal('Salmon in Creamy Coconut Spinach', [('salmon', 6), ('spinach', 3), ('cmilk', .25), ('oil', .5)]),
 'KD3': meal('Lamb Kebabs & Cucumber Salad', [('lamb', 5), ('cuke', 1), ('lettuce', 1), ('tahini', 1), ('oil', 1), ('olive', 1)]),
 'KD4': meal('Coconut Chicken Curry with Cauliflower', [('thigh', 5), ('cauli', 1), ('cmilk', .25), ('spinach', 1), ('oil', .5)]),
}
for _D in (B, L, D, KB, KL, KD):
    for _k, _v in _D.items(): _v['key'] = _k
def qty(m, key): return sum(q for k, q in m['items'] if k == key)
PROT = ['chicken', 'thigh', 'turkey', 'beef', 'steak', 'lamb', 'salmon', 'cod', 'shrimp', 'tuna']
FISH = ('salmon', 'cod', 'shrimp', 'tuna')
def mainp(m):
    for k, _ in sorted(m['items'], key=lambda t: -DB[t[0]]['m'][1] * t[1]):
        if k in PROT: return k
    return None

CYCLE = [tuple(c) for c in CFG['cycle']]; KCAL = CFG['kcal']; MINP = CFG['min_protein']
ADD_B = [None, ('blueb', .5), ('straw', 1), ('apple', 1), ('banana', 1), ('bread', 1), ('oats', 1/3), ('oats', .5)]
ADD_L = [None, ('carrot', .5), ('sweetp', 4), ('sweetp', 6), ('rice', .5), ('rice', 1), ('quinoa', .5), ('brice', .75), ('pita', 1), ('orange', 1), ('apple', 1), ('banana', 1), ('chick', .25)]
FATK = [('oil', 1), ('oil', 2), ('avo', 1), ('mac', .5), ('mac', 1), ('tahini', 1), ('olive', 1), ('cmilk', .25), ('almond', .5), ('walnut', .5)]
FATTOP = [('oil', 1), ('oil', 2), ('avo', 1), ('walnut', .5), ('almond', .5), ('tahini', 1), ('pumpk', .5), ('pbut', 1), ('olive', 1), ('almond', 1)]

def assemble(ms, tc, tier, i, last):
    ms = [copy.deepcopy(m) for m in ms]
    P = sum(m['p'] for m in ms); MINP = CFG['keto_min_protein'] if tier == 'KETO' else CFG['min_protein']
    if P < MINP - 1:                                               # whey top-up in half-scoop steps, spread across meals
        n = math.ceil((MINP - P - 1) / 12.5)
        if n > CFG['whey_max'] * 2: return None
        for _ in range(n):
            j = min(range(3), key=lambda j: (qty(ms[j], 'whey'), ms[j]['p'])); ms[j] = extend(ms[j], ('whey', .5))
    need = tc - sum(m['c'] for m in ms); best = None
    if tier == 'KETO': best = (0, [None, None, None])         # keto days: no carb sides
    for ab, al, ad in (itertools.product(ADD_B, ADD_L, ADD_L) if tier != 'KETO' else []):
        if al and ad and al == ad: continue
        adds = [ab, al, ad]; c = sum(calc([a])[2] for a in adds if a)
        rep = sum(1 for a in adds if a and last.get(('add',) + a, -99) >= i - 2)
        sc = abs(c - need) + rep * 3 + sum(1 for a in adds if a) * 0.6
        if best is None or sc < best[0]: best = (sc, adds)
    for a, j in zip(best[1], range(3)):
        if a: ms[j] = extend(ms[j], a)
    gap = KCAL[tier] - sum(m['kcal'] for m in ms)
    for _ in range(3):
        if gap >= 35:
            j = min(range(3), key=lambda j: ms[j]['kcal']); have = {k for k, _q in ms[j]['items']}
            t1 = min((t for t in (FATK if tier == 'KETO' else FATTOP) if t[0] not in have or t[0] == 'oil'), key=lambda t: abs(calc([t])[0] - gap)); ms[j] = extend(ms[j], t1); gap -= calc([t1])[0]
    return ms, best[1]

last = {}; days = []; fish_wk = {}; uses = {}; triples = set(); uses = {}; triples = set()
for i in range(30):
    tier, tc = CYCLE[i % 7]; wk = i // 7
    cands = []
    for mingap in (3, 2, 1):
        if cands: break
        PB, PL, PD = (KB, KL, KD) if tier == 'KETO' else (B, L, D)
        for b, l, d in itertools.product(PB, PL, PD):
            ms0 = [PB[b], PL[l], PD[d]]
            if sum(qty(m, 'egg') for m in ms0) > (CFG['keto_egg_day_max'] if tier == 'KETO' else CFG['egg_day_max']): continue
            gaps = [i - last.get(x, -99) for x in (b, l, d)]
            if min(gaps) < mingap: continue
            pl, pd = mainp(PL[l]), mainp(PD[d])
            if pl and pl == pd: continue
            base_c = sum(m['c'] for m in ms0)
            if tier == 'KETO' and sum(m['c'] - m['fib'] for m in ms0) > CFG['keto_net_cap']: continue
            if tier == 'LOW' and sum(m['c'] for m in ms0) > tc - 2: continue
            fish = sum(1 for m in ms0 if mainp(m) in FISH)
            sc = -sum(min(g, 9) for g in gaps) + 0.5 * sum(uses.get(x, 0) for x in (b, l, d)) + (8 if (b, l, d) in triples else 0) - (2.5 if (fish and fish_wk.get(wk, 0) < 3) else 0) + abs(tc - 30 - base_c) * 0.04
            cands.append((sc, b, l, d, fish))
    cands.sort(key=lambda t: t[0]); res = None
    PB, PL, PD = (KB, KL, KD) if tier == 'KETO' else (B, L, D)
    MINP = CFG['keto_min_protein'] if tier == 'KETO' else CFG['min_protein']
    for sc0, b, l, d, fish in cands[:30]:
        out = assemble([PB[b], PL[l], PD[d]], tc, tier, i, last)
        if out is None: continue
        ms, adds = out
        if tier == 'KETO' and sum(m['c'] - m['fib'] for m in ms) > CFG['keto_net_cap']: continue
        c = sum(m['c'] for m in ms)
        if tier == 'HIGH' and c > 98: continue                  # hard cap: training-day carbs never above ~100 g
        p = sum(m['p'] for m in ms); k = sum(m['kcal'] for m in ms)
        sc = sc0 + (abs(c - tc) * 0.5 if tier != 'KETO' else 0) + abs(k - KCAL[tier]) * 0.03 + max(0, MINP - p) * 2
        if res is None or sc < res[0]: res = (sc, b, l, d, ms, adds, fish)
    if res is None: raise SystemExit(f'no valid day {i + 1}')
    _, b, l, d, ms, adds, fish = res
    for x in (b, l, d): last[x] = i; uses[x] = uses.get(x, 0) + 1
    triples.add((b, l, d))
    for a in adds:
        if a: last[('add',) + a] = i
    fish_wk[wk] = fish_wk.get(wk, 0) + fish
    slots = ([('Meal 1 · Fast-breaker', '12:00 PM'), ('Meal 2 · Power lunch', '3:30 PM'), ('Meal 3 · Dinner', '7:30 PM')] if tier == 'KETO' else
             [('Meal 1 · Break fast', '8:00 AM'), ('Meal 2 · Power lunch', '12:30 PM'), ('Meal 3 · Dinner', '6:30 PM')])
    tot = [sum(m[k] for m in ms) for k in ('kcal', 'p', 'c', 'f', 'fib')]
    days.append(dict(day=i + 1, tier=tier, ctarget=tc, dtype={'HIGH': 'TRAIN', 'LOW': 'LOWCARB', 'KETO': 'KETO'}[tier], fast='16:8' if tier == 'KETO' else '', window='12:00–8:00 PM' if tier == 'KETO' else '', meals=[dict(slot=a, time=t, **m) for (a, t), m in zip(slots, ms)],
                     kcal=tot[0], p=tot[1], c=tot[2], f=tot[3], fib=tot[4]))
for d in days:
    eg = sum(q for m in d['meals'] for k, q in m['items'] if k == 'egg')
    d['check'] = (f"whole eggs {q2s(eg)}" if eg else 'no whole eggs') + ' · halal · no pork' + (f" · net carbs {d['c'] - d['fib']} g" if d['tier'] == 'KETO' else '')
    d['week'] = (d['day'] - 1) // 7 + 1
weeks = []
for w in range(5):
    dl = days[w * 7:(w + 1) * 7]
    weeks.append(dict(week=w + 1, days=[d['day'] for d in dl], avg={k: round(sum(d[k] for d in dl) / len(dl)) for k in ('kcal', 'p', 'c', 'f', 'fib')}, groc={}))
avg = {k: round(sum(d[k] for d in days) / 30) for k in ('kcal', 'p', 'c', 'f', 'fib')}
json.dump(dict(days=days, weeks=weeks, avg=avg, protein_by_source={}, slot_avg={},
               minmax=dict(kmin=min(d['kcal'] for d in days), kmax=max(d['kcal'] for d in days), pmin=min(d['p'] for d in days), pmax=max(d['p'] for d in days), cmin=min(d['c'] for d in days), cmax=max(d['c'] for d in days))),
          open(os.path.join(OUT_DIR, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
_step = {'cup': .25, 'oz': .5, 'tsp': .5, 'tbsp': .5, 'scoop': .5, 'slice': 1, '': .5}
db = {}
for k, v in DB.items():
    e = dict(n=v['n'], n1=v.get('n1', v['n']), u=v['u'], cat=v['cat'], grp=v.get('grp', ''), m=list(v['m']), step=_step.get(v['u'], .5))
    if k in ('egg', 'avo', 'pita'): e['step'] = 1
    if k in ('walnut', 'almond', 'pumpk'): e['step'] = .25
    if k == 'tomato': e['vol'] = .75
    if k in ('quinoa', 'rice', 'brice'): e['dry'] = 3
    if k == 'sweetp': e['lbf'] = 1.0
    db[k] = e
db['egg']['cap'] = 3
json.dump(db, open(os.path.join(OUT_DIR, 'db.json'), 'w'), ensure_ascii=False)
if __name__ == '__main__':
    for d in days: print(d['day'], d['tier'], d['kcal'], 'P', d['p'], 'C', d['c'], 'F', d['f'], 'fib', d['fib'], [m['key'] for m in d['meals']], [len(m['adds']) for m in d['meals']])
    print('avg', avg, 'minP', min(d['p'] for d in days), 'C', min(d['c'] for d in days), max(d['c'] for d in days), 'kcal', min(d['kcal'] for d in days), max(d['kcal'] for d in days))
