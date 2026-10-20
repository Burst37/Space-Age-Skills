import json, os, math
from collections import defaultdict
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(S, '..', 'out', 'plan.json'))); DB = json.load(open(os.path.join(S, '..', 'out', 'db.json')))
src = os.path.join(S, '..', 'photos')
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
def macros(k, q): return [v * q for v in DB[k]['m']]
CATG = {'veg': 'Vegetables', 'carb': 'Carbs & fruit', 'fat': 'Fats, nuts & seeds'}
GMAP = {'Legumes': 'Lentils & chickpeas', 'Grains & starch': 'Carbs & fruit', 'Fruit': 'Carbs & fruit'}
pbs = defaultdict(float); slot = defaultdict(lambda: [0, 0, 0, 0]); n = len(P['days'])
for d in P['days']:
    for i, m in enumerate(d['meals']):
        for k, q in m['items']:
            c = DB[k]['cat']; g = DB[k]['grp'] if c == 'protein' else CATG[c]
            pbs[GMAP.get(g, g)] += macros(k, q)[1]
        for j, f in enumerate(['kcal', 'p', 'c', 'f']): slot[i][j] += m[f]
P['protein_by_source'] = {k: round(v / n) for k, v in sorted(pbs.items(), key=lambda kv: -kv[1]) if round(v / n) >= 1}
P['slot_avg'] = {str(i): [round(v / n) for v in a] for i, a in slot.items()}
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
    if k == 'sweetp': return 'sweet potato', f"{max(1, math.ceil(q / 16 * 10) / 10):g} lb"
    if u == 'oz' and q >= 16: return name, f"{q / 16:.1f} lb".replace('.0 ', ' ')
    if u == 'tsp' and q >= 6: return name, f"{qty(q / 48)} cup" if q >= 24 else f"{qty(q / 3)} tbsp"
    if u == 'cup' and v['cat'] == 'veg' and q >= 1: return name, f"{qty(q)} cups"
    if k == 'egg': return 'eggs, large', f"{round(q)}"
    if k == 'avo': return 'avocados', f"{math.ceil(q / 4)}"
    if k == 'tomato': return 'tomatoes, medium', f"{math.ceil(q)}"
    if u == '': return name.replace('medium ', ''), f"{math.ceil(q)}"
    if u == 'scoop': return name, f"{qty(q)} scoops"
    if u == 'slice': return name, f"{math.ceil(q)} slices"
    return name, f"{qty(q)} {u}{'s' if u == 'cup' and q > 1 else ''}"
COL = {'protein': 'Protein', 'veg': 'Vegetables', 'carb': 'Grains & fruit', 'fat': 'Fats, nuts & seeds'}
REN = {'whey isolate (halal-certified)': 'whey isolate (halal)', 'green beans, steamed': 'green beans', 'zucchini, sautéed': 'zucchini', 'spinach (raw)': 'spinach', 'lean ground turkey, cooked': 'ground turkey', 'lean ground beef (95%), cooked': 'ground beef, 95% lean', 'chicken breast, cooked': 'chicken breast', 'chicken thigh, skinless, cooked': 'chicken thighs', 'sirloin steak, trimmed, cooked': 'sirloin steak', 'lean lamb leg, cooked': 'lamb leg', 'salmon, cooked': 'salmon', 'cod, cooked': 'cod', 'shrimp, cooked': 'shrimp', 'cooked lentils': 'lentils, cooked', 'cooked chickpeas': 'chickpeas, cooked', 'tuna in water, drained': 'tuna in water', 'plain nonfat Greek yogurt': 'Greek yogurt, plain nonfat', 'rolled oats (dry)': 'rolled oats'}
for wk in P['weeks']:
    tot = defaultdict(float)
    for d in P['days']:
        if d['day'] in wk['days']:
            for m in d['meals']:
                for k, q in m['items']: tot[k] += q
    g = {c: [] for c in COL.values()}
    for k, q in sorted(tot.items(), key=lambda kv: -kv[1] * DB[kv[0]]['m'][0]):
        nm_, qq = fmtq(k, q); nm_ = REN.get(nm_, nm_); qq = qq.replace('1 cups', '1 cup')
        g[COL[DB[k]['cat']]].append([nm_[0].upper() + nm_[1:], qq])
    wk['groc'] = g
for d in P['days']:
    for m in d['meals']:
        m['slotShort'] = m['slot'].split('·')[0].strip().upper()
        m['slotName'] = m['slot'].split('·')[1].strip().replace('Break fast', 'Break-fast')
json.dump(P, open(os.path.join(S, 'plan.json'), 'w'), ensure_ascii=False)
print(P['protein_by_source'], P['slot_avg']); print(max(len(v) for w in P['weeks'] for v in w['groc'].values()), [len(v) for v in P['weeks'][0]['groc'].values()])
def crop(im, ratio, w, out, q=82, fy=0.5):
    W_, H_ = im.size
    if W_ / H_ > ratio: nw = round(H_ * ratio); box = ((W_ - nw) // 2, 0, (W_ - nw) // 2 + nw, H_)
    else: nh = round(W_ / ratio); y0 = round((H_ - nh) * fy); box = (0, y0, W_, y0 + nh)
    im.crop(box).resize((w, round(w / ratio)), Image.LANCZOS).save(out, quality=q, optimize=True, progressive=True)
for d in ['imgthumb', 'imgstrip', 'imgtall']: os.makedirs(os.path.join(S, d), exist_ok=True)
for f in os.listdir(src):
    if not f.endswith('.jpg'): continue
    im = Image.open(os.path.join(src, f)).convert('RGB')
    crop(im, 1.72 / 0.46, 560, os.path.join(S, 'imgthumb', f), 78)
    crop(im, 2.9 / 1.0, 1100, os.path.join(S, 'imgstrip', f), 80)
    crop(im, 3.0 / 5.45, 820, os.path.join(S, 'imgtall', f), 80)
