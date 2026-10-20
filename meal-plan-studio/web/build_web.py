#!/usr/bin/env python3
"""Build the interactive web experience for a client.
  python build_web.py <client> [--theme K] [--no-video]
Outputs in clients/<client>/dist/web/: index.html (hosted: media/ next to it, installable PWA) and
<Name>_Experience_Offline.html in dist/ (one file: fonts, photos, posters and videos inlined; opens from email or files)."""
import argparse, base64, json, os, re, shutil, sys
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(H)
def mix(a, b, t):
    a, b = [int(a[i:i + 2], 16) for i in (0, 2, 4)], [int(b[i:i + 2], 16) for i in (0, 2, 4)]
    return ''.join('%02x' % round(x + (y - x) * t) for x, y in zip(a, b))
def b64(path, mime): return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()
def parse_t(s):
    m = re.match(r'(\d+)(?::(\d+))? (AM|PM)', s); hh = int(m.group(1)) % 12 + (12 if m.group(3) == 'PM' else 0); return hh * 60 + int(m.group(2) or 0)
def build(slug, theme_key=None, video=True):
    cd = os.path.join(ROOT, 'clients', slug); c = json.load(open(os.path.join(cd, 'client.json'))); copy = json.load(open(os.path.join(cd, 'copy.json')))
    themes = json.load(open(os.path.join(ROOT, 'themes', 'themes.json')))['themes']; t = next(x for x in themes if x['key'] == (theme_key or c['theme'])); col = t['colors']
    plan_p = os.path.join(cd, 'deck', 'plan.json')
    if not os.path.exists(plan_p): sys.exit('run `python studio.py build %s` (or deck/prep.py) first: deck/plan.json is missing' % slug)
    plan = json.load(open(plan_p)); foods = json.load(open(os.path.join(cd, 'foods.json')))
    out = os.path.join(cd, 'dist', 'web'); media = os.path.join(out, 'media'); imgd = os.path.join(media, 'img'); os.makedirs(imgd, exist_ok=True)
    # ---- images
    keys = sorted({m['key'] for d in plan['days'] for m in d['meals']})
    for k in keys:
        src = os.path.join(cd, 'photos', k + '.jpg'); im = Image.open(src).convert('RGB')
        for w, q in ((160, 70), (480, 76), (960, 80)):
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(imgd, f'{k}-{w}.webp'), 'WEBP', quality=q, method=6)
    # ---- data
    tiers = {}; present = [k for k in ('HIGH', 'LOW', 'KETO') if any(d['tier'] == k for d in plan['days'])]
    for k in present:
        ds = [d for d in plan['days'] if d['tier'] == k]; carbs = round(sum(d['c'] for d in ds) / len(ds)); net = max(d['c'] - d['fib'] for d in ds)
        ct = copy['tiers'][k]; tiers[k] = dict(label=ct['label'], short=ct['short'], daynote=ct['daynote'], color='#' + t['tiers'][k], carbs=carbs, range=(f'about {carbs} g carbs' if k != 'KETO' else f'net {net} g or less'), n=len(ds))
    def compact(m): return dict(slot=m['slot'].split('·')[1].strip(), time=m['time'], name=m['name'], key=m['key'], kcal=m['kcal'], p=round(m['p']), c=round(m['c']), f=round(m['f']), lines=m['lines'], adds=m['adds'])
    days = [dict(day=d['day'], tier=d['tier'], kcal=d['kcal'], p=d['p'], c=d['c'], f=d['f'], fib=d['fib'], meals=[compact(m) for m in d['meals']]) for d in plan['days']]
    dishes = {}
    for d in days:
        for m in d['meals']:
            e = dishes.setdefault(m['key'], dict(key=m['key'], name=m['name'], slotName=m['slot'], time=m['time'], kcal=m['kcal'], p=m['p'], c=m['c'], f=m['f'], tiers=[], days=[], sample=m, alt='Photo of ' + m['name']))
            if d['tier'] not in e['tiers']: e['tiers'].append(d['tier'])
            e['days'].append(d['day'])
    start = c['start']; import datetime as dt; sd = dt.date.fromisoformat(start)
    groc = [dict(week=w['week'], range=f"{(sd + dt.timedelta(days=w['days'][0] - 1)).strftime('%b %-d')}–{(sd + dt.timedelta(days=w['days'][-1] - 1)).strftime('%b %-d')}", groups=w['groc']) for w in plan['weeks']]
    clock = {}
    for k in present:
        d = next(d for d in plan['days'] if d['tier'] == k); ms = [dict(slot=m['slot'].split('·')[1].strip(), min=parse_t(m['time'])) for m in d['meals']]
        clock[k] = dict(start=ms[0]['min'], end=ms[-1]['min'] + 30, meals=ms)
    if 'LOW' in clock and 'KETO' in clock: clock['LOW']['alt'] = dict(clock['KETO']); clock['LOW']['altNote'] = copy['clock'].get('altNote', {}).get('LOW')
    pr = c['profile']; goal = dict(**{'from': pr['weight_lb'], 'to': pr['goal_lb']}, weeks=round(pr['months'] * 4.345, 1), months=pr['months'])
    n = len(dishes); cp = json.loads(json.dumps(copy).replace('{dishes}', str(n)))
    data = dict(client=dict(slug=slug, name=c['name'], start=start, title=c['title']), tiers=tiers, week=c['week'], avg=plan['avg'], goal=goal, days=days, dishes=list(dishes.values()), groc=groc, foods=foods, clock=clock, copy=cp, base='media/', pwa=True)
    # ---- tokens, fonts
    bg0 = mix(col['dk2'], '000000', .58); w = t['web']
    tokens = f"--bg0:#{bg0};--ink:#{mix('ffffff', col['accent6'], .06)};--soft:#{mix(col['accent6'], 'ffffff', .35)};--hl:#{mix(col['accent2'], 'ffffff', .22)};--a1:#{col['accent1']};--a2:#{col['accent2']};--a3:#{col['accent3']};--a4:#{col['accent4']};--display:'D';--body:'B';--dw:{600 if w['displayVariable'] else 400};--em:{'italic' if w['displayItalicFile'] else 'normal'}"
    def face(fam, file, weight, style='normal', inline=False):
        src = b64(os.path.join(H, 'fonts', file), 'font/woff2') if inline else f'fonts/{file}'
        return f"@font-face{{font-family:'{fam}';src:url({src}) format('woff2');font-weight:{weight};font-style:{style};font-display:swap}}"
    def fontcss(inline):
        css = face('D', w['displayFile'], '100 900' if w['displayVariable'] else '400', inline=inline) + face('B', w['bodyFile'], '100 900', inline=inline)
        if w['displayItalicFile']: css += face('D', w['displayItalicFile'], '100 900' if w['displayVariable'] else '400', 'italic', inline=inline)
        return css
    vendor = open(os.path.join(H, 'vendor', 'gsap.min.js')).read() + '\n' + open(os.path.join(H, 'vendor', 'ScrollTrigger.min.js')).read()
    css = open(os.path.join(H, 'experience.css')).read(); js = open(os.path.join(H, 'experience.js')).read(); tpl = open(os.path.join(H, 'template.html')).read()
    desc = f"{c['name']}'s {c['title']}: {len(days)} days, {len(days) * 3} meals, macros, shopping lists and a weight tracker."
    def page(d, inline, head):
        html = tpl
        for k, v in dict(TITLE=f"{c['name']} · {c['title']}", DESC=desc, THEMECOLOR='#' + bg0, HEADLINKS=head, FONTCSS=fontcss(inline), TOKENS=tokens, CSS=css, VENDOR_JS=vendor.replace('</script', '<\\/script'), APP_JS=js.replace('</script', '<\\/script'), DATA=json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')).items(): html = html.replace('{{%s}}' % k, v)
        return html
    # hosted
    shutil.copytree(os.path.join(H, 'fonts'), os.path.join(out, 'fonts'), dirs_exist_ok=True, ignore=lambda d, fs: [f for f in fs if f not in (w['displayFile'], w['bodyFile'], w['displayItalicFile'])])
    def icon(sz):
        im = Image.new('RGB', (sz, sz), '#' + bg0); dr = ImageDraw.Draw(im)
        for i in range(sz):  # diagonal glow
            tt = i / sz; dr.line([(0, i), (sz, i)], fill=tuple(int(x) for x in [int(mix(bg0, col['accent1'], .55 * (1 - tt))[j:j + 2], 16) for j in (0, 2, 4)]))
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', int(sz * .56)); dr.text((sz / 2, sz / 2), c['name'][0].upper(), font=f, anchor='mm', fill='#' + mix('ffffff', col['accent2'], .3)); return im
    for sz in (180, 192, 512): icon(sz).save(os.path.join(out, f'icon-{sz}.png'))
    json.dump(dict(name=f"{c['name']} · {c['title']}", short_name=c['name'], start_url='./', display='standalone', background_color='#' + bg0, theme_color='#' + bg0, icons=[dict(src='icon-192.png', sizes='192x192', type='image/png'), dict(src='icon-512.png', sizes='512x512', type='image/png', purpose='any maskable')]), open(os.path.join(out, 'manifest.webmanifest'), 'w'))
    ver = str(abs(hash(json.dumps(data, sort_keys=True))) % 10 ** 8)
    open(os.path.join(out, 'sw.js'), 'w').write(f"const V='mps-{slug}-{ver}';const SHELL=['./','index.html','manifest.webmanifest','icon-192.png'];self.addEventListener('install',e=>{{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))}});self.addEventListener('activate',e=>{{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))}});self.addEventListener('fetch',e=>{{const r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{{if(res.ok&&new URL(r.url).origin===location.origin){{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}}return res}}).catch(()=>caches.match('index.html'))))}});")
    head = '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-180.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="%s">' % c['name']
    open(os.path.join(out, 'index.html'), 'w').write(page(data, False, head))
    # offline single file
    inline = {}
    for k in keys:
        for sz in (160, 480): inline[f'{k}-{sz}'] = b64(os.path.join(imgd, f'{k}-{sz}.webp'), 'image/webp')
        inline[f'{k}-960'] = inline[f'{k}-480']
    for v in ('intro', 'explainer'):
        pp = os.path.join(media, v + '-poster.jpg')
        if os.path.exists(pp): inline[v + '-poster'] = b64(pp, 'image/jpeg')
        vp = os.path.join(media, v + '.mp4')
        if video and os.path.exists(vp): inline[v + '-video'] = b64(vp, 'video/mp4')
    d2 = dict(data, inline=inline, pwa=False); off = os.path.join(cd, 'dist', f"{re.sub(r'[^A-Za-z0-9]+', '_', c['name'])}_Experience_Offline.html")
    open(off, 'w').write(page(d2, True, '')); print('hosted:', os.path.join(out, 'index.html'), '\noffline:', off, f'({os.path.getsize(off) / 1e6:.1f} MB)')
if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('client'); ap.add_argument('--theme'); ap.add_argument('--no-video', action='store_true'); a = ap.parse_args(); build(a.client, a.theme, not a.no_video)
