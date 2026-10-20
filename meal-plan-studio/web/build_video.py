#!/usr/bin/env python3
"""Render the two motion-graphic videos for a client: the intro and the "how your week works" explainer.
HTML scenes -> Playwright frames -> ffmpeg -> 1280x720 H.264 High, yuv420p, faststart (plays inline on iOS, Android, desktop).
Usage: python build_video.py <client> [--theme K] [--only intro|explainer] [--out dir]"""
import argparse, glob, json, os, shutil, subprocess, sys, tempfile
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(H); sys.path.insert(0, ROOT)
def mix(a, b, t):
    a, b = [int(a[i:i + 2], 16) for i in (0, 2, 4)], [int(b[i:i + 2], 16) for i in (0, 2, 4)]
    return ''.join('%02x' % round(x + (y - x) * t) for x, y in zip(a, b))
def theme(key): return next(t for t in json.load(open(os.path.join(ROOT, 'themes', 'themes.json')))['themes'] if t['key'] == key)
def font_css(t, fonts_dir=None):
    fd = fonts_dir or os.path.join(H, 'fonts'); w = t['web']
    css = f"@font-face{{font-family:'D';src:url('file://{fd}/{w['displayFile']}') format('woff2');font-weight:100 900}}@font-face{{font-family:'B';src:url('file://{fd}/{w['bodyFile']}') format('woff2');font-weight:100 900}}"
    return css
def tokens(t):
    c = t['colors']; bg = mix(c['dk2'], '000000', .55)
    return f"--bg:#{bg};--a1:#{c['accent1']};--a2:#{c['accent2']};--a4:#{c['accent4']};--soft:#{mix(c['accent6'], 'ffffff', .35)};--hl:#{mix(c['accent2'], 'ffffff', .25)};--display:'D';--body:'B'"
def frames(html, out, node_env):
    os.makedirs(out, exist_ok=True)
    r = subprocess.run(['node', os.path.join(ROOT, 'tools', 'render_intro.js'), html, out], env=node_env, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-1500:])
def encode(frames_dir, mp4, fps=30):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(frames_dir, 'f%04d.jpg'), '-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0',
                    '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow', '-movflags', '+faststart', '-an', mp4], check=True)
def explainer_data(c, plan, t):
    tiers = {}; tc = t['tiers']
    lab = {'HIGH': ('TRAINING DAYS', 'Carbs up to about %d g, never above 100 g. Fuel for the lifts.'), 'LOW': ('LOW-CARB DAYS', 'About %d g of carbs. Steady fat loss.'), 'KETO': ('KETO DAYS', 'Net carbs 20 g or less. 16:8 window, 12 to 8 PM.')}
    for k in ('HIGH', 'LOW', 'KETO'):
        ds = [d for d in plan['days'] if d['tier'] == k]
        if not ds: continue
        carbs = round(sum(d['c'] for d in ds) / len(ds)); net = max(d['c'] - d['fib'] for d in ds)
        tiers[k] = dict(carbs=carbs, color='#' + tc[k], head=lab[k][0], sub=lab[k][1].replace('%d', str(carbs)), netNote=f'{net} g net max' if k == 'KETO' else '')
    avg = plan['avg']; order = [k for k in ('HIGH', 'KETO', 'LOW') if k in tiers]; steps = []; s = 3.6
    for k in order: steps.append(dict(tier=k, start=s, end=s + (2.5 if k == 'HIGH' else 2.2), head=tiers[k]['head'], sub=tiers[k]['sub'])); s = steps[-1]['end']
    return dict(eyebrow=f"{c['name']}  ·  your week", line1='Carbs follow', line2='your workouts.', dow=['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], week=c['week'], tiers=tiers, steps=steps,
                chips=[f"{avg['p']} g protein every day", f"{avg['kcal']:,} kcal average", '3 meals a day'], chipStart=s + .2, dur=12.6)
def build(slug, theme_key=None, only=None, out=None):
    cd = os.path.join(ROOT, 'clients', slug); c = json.load(open(os.path.join(cd, 'client.json'))); t = theme(theme_key or c['theme'])
    plan = json.load(open(os.path.join(cd, 'out', 'plan.json'))); out = out or os.path.join(cd, 'dist', 'web', 'media'); os.makedirs(out, exist_ok=True)
    work = tempfile.mkdtemp(prefix='vid-'); env = dict(os.environ, NODE_PATH=os.pathsep.join(p for p in [os.environ.get('STUDIO_NODE_PATH', ''), '/opt/node22/lib/node_modules'] if p))
    if only in (None, 'explainer'):
        d = explainer_data(c, plan, t); html = open(os.path.join(H, 'video', 'explainer.html')).read()
        html = html.replace('/*FONTS*/', font_css(t)).replace('/*TOKENS*/', tokens(t)).replace('/*DATA*/null', json.dumps(d))
        hp = os.path.join(work, 'explainer.html'); open(hp, 'w').write(html); fr = os.path.join(work, 'ex'); frames(hp, fr, env)
        n = len(glob.glob(fr + '/f*.jpg'))
        encode(fr, os.path.join(out, 'explainer.mp4')); shutil.copy(os.path.join(fr, 'f%04d.jpg' % (n - 40)), os.path.join(work, 'ex_poster.jpg'))
        from PIL import Image; Image.open(os.path.join(work, 'ex_poster.jpg')).resize((1280, 720)).save(os.path.join(out, 'explainer-poster.jpg'), quality=82)
    if only in (None, 'intro'):
        sys.path.insert(0, os.path.join(ROOT, 'themes')); import intro_theme
        src = os.path.join(cd, 'intro', 'intro_data.html'); themed = os.path.join(cd, 'intro', '_themed_video.html')
        open(themed, 'w').write(intro_theme.recolor(open(src).read(), t['key'])); fr = os.path.join(work, 'in'); frames(themed, fr, env); os.remove(themed)
        n = len(glob.glob(fr + '/f*.jpg')); encode(fr, os.path.join(out, 'intro.mp4'))
        from PIL import Image; Image.open(os.path.join(fr, 'f%04d.jpg' % (n - 1))).resize((1280, 720)).save(os.path.join(out, 'intro-poster.jpg'), quality=82)
    shutil.rmtree(work, ignore_errors=True); print('videos ->', out)
if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('client'); ap.add_argument('--theme'); ap.add_argument('--only'); ap.add_argument('--out'); a = ap.parse_args(); build(a.client, a.theme, a.only, a.out)
