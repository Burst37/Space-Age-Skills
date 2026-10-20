import json, os, math
from collections import defaultdict
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(S, '..', 'out', 'plan.json'))); DB = json.load(open(os.path.join(S, '..', 'out', 'db.json')))
# ---------- images ----------
src = os.path.join(S, '..', 'jpg')
for d in ['imgj', 'imgsq', 'imgj_lite', 'imgsq_lite']: os.makedirs(os.path.join(S, d), exist_ok=True)
for f in os.listdir(src):
    if not f.endswith('.jpg'): continue
    im = Image.open(os.path.join(src, f)).convert('RGB'); k = f[:-4]
    for d, w, q in [('imgj', 1920 if k == 'HERO' else 1600, 84), ('imgj_lite', 1280 if k == 'HERO' else 900, 76)]:
        im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(S, d, f), quality=q, optimize=True, progressive=True)
    s = min(im.size); x0 = (im.width - s) // 2; y0 = (im.height - s) // 2
    sq = im.crop((x0, y0, x0 + s, y0 + s))
    for d, w, q in [('imgsq', 1200, 84), ('imgsq_lite', 640, 76)]:
        sq.resize((w, w), Image.LANCZOS).save(os.path.join(S, d, f), quality=q, optimize=True, progressive=True)
# ---------- derived data ----------
def macros(k, q):
    m = DB[k]['m']; return [v * q for v in m]
GRP = {'egg': 'Eggs', 'white': 'Egg whites', 'seitan': 'Seitan', 'pea': 'Pea protein', 'nooch': 'Seeds, nuts & yeast', 'lentil': 'Refeed carbs & fruit'}
pbs = defaultdict(float); slot = {'W': defaultdict(lambda: [0, 0, 0, 0, 0]), 'R': defaultdict(lambda: [0, 0, 0, 0, 0])}; n = len(P['days'])
kn = {k: sum(1 for d in P['days'] if d['kind'] == k) for k in 'WR'}
for d in P['days']:
    for i, m in enumerate(d['meals']):
        for k, q in m['items']:
            c = DB[k]['cat']
            g = GRP.get(k) or {'carb': 'Refeed carbs & fruit', 'veg': 'Vegetables', 'fat': 'Seeds, nuts & yeast'}[c]
            pbs[g] += macros(k, q)[1]
        for j, f in enumerate(['kcal', 'p', 'c', 'f', 'net']): slot[d['kind']][i][j] += m[f]
P['protein_by_source'] = {k: round(v / n) for k, v in pbs.items()}
P['slot_avg'] = {k: {str(i): [round(v / kn[k]) for v in a] for i, a in slot[k].items()} for k in 'WR'}
FR = {0.25: '¼', 0.5: '½', 0.75: '¾', 0.33: '⅓', 0.67: '⅔'}
def qty(x):
    w = int(x); r = round(x - w, 2)
    if r < 0.13: r = 0
    elif r > 0.87: w += 1; r = 0
    else: r = min(FR, key=lambda f: abs(f - r))
    s = (str(w) if w else '') + (FR[r] if r else '')
    return s or '¼'
def fmtq(k, q):
    v = DB[k]; u = v['u']; name = v['n']
    if v.get('dry'): q = q / v['dry']; name = name.replace('cooked ', '') + ' (dry)'
    if k == 'sweetp': return 'sweet potato', f"{max(1, math.ceil(q / 16 * 10) / 10):g} lb".replace('lb', 'lb')
    if u == 'oz' and q >= 16: return name, f"{q / 16:.1f} lb".replace('.0 ', ' ')
    if u == 'tsp' and q >= 6: return name, f"{qty(q / 48)} cup" if q >= 24 else f"{qty(q / 3)} tbsp"
    if u == 'cup' and v['cat'] == 'veg' and q >= 1: return name, f"{qty(q)} cups"
    if k in ('egg',): return 'eggs, large', f"{round(q)}"
    if k == 'avo': return 'avocados', f"{math.ceil(q / 4)}"
    if k == 'tomato': return 'tomatoes, medium', f"{math.ceil(q)}"
    if u == '': return name.replace('medium ', ''), f"{math.ceil(q)}"
    if u == 'scoop': return name, f"{qty(q)} scoops"
    if u == 'slice': return name, f"{math.ceil(q)} slices"
    return name, f"{qty(q)} {u}{'s' if u == 'cup' and q > 1 else ''}"
COL = {'protein': 'Protein', 'veg': 'Vegetables', 'carb': 'Refeed carbs & fruit', 'fat': 'Fats, nuts & seeds'}
for wk in P['weeks']:
    tot = defaultdict(float)
    for d in P['days']:
        if d['day'] in wk['days']:
            for m in d['meals']:
                for k, q in m['items']: tot[k] += q
    g = {c: [] for c in COL.values()}
    for k, q in sorted(tot.items(), key=lambda kv: -kv[1] * DB[kv[0]]['m'][0]):
        nm_, qq = fmtq(k, q)
        nm_ = {'plant protein powder (pea)': 'pea protein powder', 'green beans, steamed': 'green beans', 'zucchini, sautéed': 'zucchini', 'spinach, wilted in the pan (measured raw)': 'spinach', 'cooked lentils': 'lentils, cooked', 'medium tomatoes': 'tomatoes', 'full-fat coconut milk (canned)': 'coconut milk, full-fat', 'cooked quinoa': 'quinoa, cooked', 'romaine lettuce': 'romaine lettuce'}.get(nm_, nm_)
        qq = qq.replace('1 cups', '1 cup')
        g[COL[DB[k]['cat']]].append([nm_[0].upper() + nm_[1:], qq])
    wk['groc'] = g
for d in P['days']:
    for m in d['meals']:
        m['slotShort'] = m['slot'].split('·')[0].strip().upper()
        m['slotName'] = m['slot'].split('·')[1].strip().replace('Break fast', 'Break-fast')
json.dump(P, open(os.path.join(S, 'plan.json'), 'w'), ensure_ascii=False)
print(P['protein_by_source'], P['slot_avg']); print(json.dumps(P['weeks'][0]['groc'], ensure_ascii=False))
print(max(len(v) for w in P['weeks'] for v in w['groc'].values()))
# ---------- aspect crops ----------
def crop(im, ratio, w, out, q=82, fy=0.5):
    W_, H_ = im.size
    if W_ / H_ > ratio: nw = round(H_ * ratio); box = ((W_ - nw) // 2, 0, (W_ - nw) // 2 + nw, H_)
    else: nh = round(W_ / ratio); y0 = round((H_ - nh) * fy); box = (0, y0, W_, y0 + nh)
    im.crop(box).resize((w, round(w / ratio)), Image.LANCZOS).save(out, quality=q, optimize=True, progressive=True)
for d in ['imgthumb', 'imgstrip', 'imgtall', 'imgwide']: os.makedirs(os.path.join(S, d), exist_ok=True)
for f in os.listdir(src):
    if not f.endswith('.jpg'): continue
    im = Image.open(os.path.join(src, f)).convert('RGB')
    crop(im, 1.72 / 0.46, 560, os.path.join(S, 'imgthumb', f), 78)
    crop(im, 2.9 / 1.0, 1100, os.path.join(S, 'imgstrip', f), 80)
    crop(im, 3.0 / 5.45, 820, os.path.join(S, 'imgtall', f), 80)
    crop(im, 3.94 / 2.85, 1300, os.path.join(S, 'imgwide', f), 82)
