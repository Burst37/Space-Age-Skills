#!/usr/bin/env python3
"""meal-plan-studio CLI.
  python studio.py list                          clients, themes, last build
  python studio.py build <client> [--theme K] [--lite] [--no-engine]
  python studio.py qa <client>                   plan caps, forbidden foods, photos, PDF
  python studio.py gallery [<client>]            render the client's deck in all themes -> themes/gallery.jpg
  python studio.py new <slug> --from <client> [--theme K]
Needs: python3 + Pillow, node (pptxgenjs, jszip, sharp, react, react-dom, react-icons, playwright), LibreOffice (soffice), poppler (pdftoppm).
Set STUDIO_NODE_PATH if the node modules live somewhere unusual."""
import argparse, glob, json, os, re, shutil, subprocess, sys, tempfile
ROOT = os.path.dirname(os.path.abspath(__file__)); CL = os.path.join(ROOT, 'clients'); TH = os.path.join(ROOT, 'themes')
def themes(): return json.load(open(os.path.join(TH, 'themes.json')))['themes']
def client(slug):
    d = os.path.join(CL, slug)
    if not os.path.isdir(d): sys.exit(f'no client "{slug}". Clients: {", ".join(sorted(os.listdir(CL)))}')
    return d, json.load(open(os.path.join(d, 'client.json')))
def node_env(extra=None):
    cands = [os.environ.get('STUDIO_NODE_PATH', ''), os.path.join(ROOT, 'node_modules'), os.path.join(ROOT, '..', 'node_modules'), '/opt/node22/lib/node_modules']
    try: cands.append(subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    except Exception: pass
    env = dict(os.environ, NODE_PATH=os.pathsep.join(c for c in cands if c and os.path.isdir(c)))
    env.update(extra or {}); return env
def run(cmd, cwd=None, env=None):
    r = subprocess.run(cmd, cwd=cwd, env=env or node_env(), capture_output=True, text=True)
    if r.returncode: sys.exit(f'FAILED: {" ".join(cmd)}\n{r.stdout[-1500:]}\n{r.stderr[-1500:]}')
    return r.stdout
def safe(s): return re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_')

def build(slug, theme=None, lite=False, engine=True, work=None, quiet=False):
    d, c = client(slug); theme = theme or c['theme']
    assert theme in [t['key'] for t in themes()], f'unknown theme {theme}'
    work = work or os.path.join(d, 'dist', '_work'); os.makedirs(work, exist_ok=True)
    tag = f'{theme}{"_lite" if lite else ""}'
    if engine and os.path.exists(os.path.join(d, 'engine.py')): run([sys.executable, 'engine.py', '--out', 'out'], cwd=d)
    if not glob.glob(os.path.join(d, 'deck', 'imgj', '*.jpg')) or engine: run([sys.executable, os.path.join('deck', 'prep.py')], cwd=d)
    # intro poster in the theme's colours
    themed = os.path.join(d, 'intro', f'_themed_{theme}.html'); poster = os.path.join(work, f'poster_{theme}.jpg')
    run([sys.executable, os.path.join(TH, 'intro_theme.py'), theme, os.path.join(d, 'intro', 'intro_data.html'), themed])
    run(['node', os.path.join(ROOT, 'tools', 'render_intro.js'), themed, os.path.join(work, f'still_{theme}'), '9.0'])
    from PIL import Image
    Image.open(os.path.join(work, f'still_{theme}', 'still_9.0.png')).convert('RGB').resize((1920, 1080)).save(poster, quality=90); os.remove(themed)
    env = node_env({'THEME': theme, 'POSTER': '1', 'POSTER_FILE': poster, 'META': os.path.join(d, 'deck', 'meta.json'), **({'LITE': '1'} if lite else {})})
    raw, a, safe_p = (os.path.join(work, f'{tag}_{n}.pptx') for n in ('raw', 'a', 'safe'))
    run(['node', os.path.join(d, 'deck', 'build.js'), raw], env=env)
    run(['node', os.path.join(ROOT, 'tools', 'post.js'), raw, a], env=dict(env, SAFE='1'))
    run([sys.executable, os.path.join(ROOT, 'tools', 'repack.py'), a, safe_p])
    lo = tempfile.mkdtemp(prefix='studio-lo-')
    run(['soffice', f'-env:UserInstallation=file://{lo}', '--headless', '--convert-to', 'pdf', '--outdir', work, safe_p])
    out = os.path.join(d, 'dist'); stem = f'{safe(c["name"])}_Deck_Slides{"_Lite" if lite else ""}'
    pdf = os.path.join(out, stem + '.pdf'); shutil.copy(os.path.join(work, f'{tag}_safe.pdf'), pdf)
    if not lite: shutil.copy(safe_p, os.path.join(out, f'{safe(c["name"])}_Deck_NoAnimations.pptx'))
    if not quiet: print(f'built {pdf}  ({os.path.getsize(pdf) / 1e6:.1f} MB, theme {theme})')
    return pdf

def qa(slug):
    d, c = client(slug); q = c.get('qa', {}); fails = []; ok = []
    plan = json.load(open(os.path.join(d, 'out', 'plan.json')))
    forb = re.compile(r'\b(' + '|'.join(map(re.escape, q.get('forbidden', ['x-none-x']))) + r')\b', re.I)
    for day in plan['days']:
        t = day['tier']; cap = q.get('caps', {}).get(t, {}); net = day.get('net', day['c'] - day['fib'])
        if 'carb_max' in cap and day['c'] > cap['carb_max']: fails.append(f'day {day["day"]} {t} carbs {day["c"]} > {cap["carb_max"]}')
        if 'net_max' in cap and net > cap['net_max']: fails.append(f'day {day["day"]} {t} net carbs {net} > {cap["net_max"]}')
        if 'protein_min' in cap and day['p'] < cap['protein_min']: fails.append(f'day {day["day"]} {t} protein {day["p"]} < {cap["protein_min"]}')
        if 'kcal' in q and not q['kcal'][0] <= day['kcal'] <= q['kcal'][1]: fails.append(f'day {day["day"]} kcal {day["kcal"]} outside {q["kcal"]}')
        for m in day['meals']:
            text = ' '.join([m['name']] + m.get('lines', []) + m.get('adds', []))
            hit = forb.search(text)
            if hit: fails.append(f'day {day["day"]} {m["key"]}: forbidden "{hit.group(0)}" in "{text[:60]}"')
            if not os.path.exists(os.path.join(d, 'photos', m['key'] + '.jpg')) and os.path.isdir(os.path.join(d, 'photos')): fails.append(f'missing photo {m["key"]}.jpg')
    ok.append(f'{len(plan["days"])} days checked: caps, protein floors, kcal range, forbidden foods, photos')
    for pdf in glob.glob(os.path.join(d, 'dist', '*_Slides.pdf')):
        n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
        if q.get('deck_slides') and n != q['deck_slides']: fails.append(f'{os.path.basename(pdf)} has {n} pages, expected {q["deck_slides"]}')
        else: ok.append(f'{os.path.basename(pdf)}: {n} pages, {os.path.getsize(pdf) / 1e6:.1f} MB')
        txt = ' '.join(subprocess.run(['pdftotext', pdf, '-'], capture_output=True, text=True).stdout.split())
        for hit in forb.finditer(txt):   # a forbidden word is fine inside a "no pork / avoid / check labels" style warning
            ctx = txt[max(0, hit.start() - 90): hit.end() + 90]
            if not re.search(r"\b(no|not|never|without|avoid|often|check|labels?|non|isn't|aren't)\b", ctx, re.I): fails.append(f'forbidden word in PDF text: ...{ctx.strip()}...')
    for m in ok: print('PASS', m)
    for m in fails: print('FAIL', m)
    print(f'{slug}: {"OK" if not fails else str(len(fails)) + " problem(s)"}'); return not fails

def gallery(slug):
    from PIL import Image, ImageDraw, ImageFont
    d, c = client(slug); tl = themes(); work = tempfile.mkdtemp(prefix='gallery-')
    run([sys.executable, 'engine.py', '--out', 'out'], cwd=d) if os.path.exists(os.path.join(d, 'engine.py')) else None
    run([sys.executable, os.path.join('deck', 'prep.py')], cwd=d)
    procs = []
    for t in tl:   # sequential: every build writes the same deck/meta.json
        wd = os.path.join(work, t['key']); build(slug, t['key'], lite=True, engine=False, work=wd, quiet=True)
        procs.append((t, os.path.join(wd, f'{t["key"]}_lite_safe.pdf')))   # per-theme PDF (dist/ holds only the last one)
    pages = [2, 10, 12, 16]; TW, TH_ = 440, 248; font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    sheet = Image.new('RGB', (2 * (TW * len(pages) + 20), 4 * (TH_ + 64)), 'white'); dr = ImageDraw.Draw(sheet)
    for i, (t, pdf) in enumerate(procs):
        x0, y0 = (i % 2) * (TW * len(pages) + 20), (i // 2) * (TH_ + 64)
        dr.rectangle([x0, y0, x0 + TW * len(pages), y0 + 40], fill='#' + t['colors']['dk2'])
        dr.text((x0 + 12, y0 + 7), f'{t["name"]}  ·  {t["fonts"]["head"]} / {t["fonts"]["body"]}  ·  title {t["layout"]}', fill='white', font=font)
        for j, p in enumerate(pages):
            png = os.path.join(work, f'{t["key"]}_{p}'); subprocess.run(['pdftoppm', '-r', '40', '-f', str(p), '-l', str(p), '-png', '-singlefile', pdf, png], check=True)
            sheet.paste(Image.open(png + '.png').convert('RGB').resize((TW, TH_)), (x0 + j * TW, y0 + 44))
    out = os.path.join(TH, 'gallery.jpg'); sheet.save(out, quality=80); print('wrote', out)

def new(slug, src, theme):
    s, c = client(src); t = os.path.join(CL, slug)
    if os.path.exists(t): sys.exit(f'{slug} already exists')
    shutil.copytree(s, t, ignore=shutil.ignore_patterns('dist', 'out', 'photos', 'img*', 'plan.json', 'meta.json', '_themed*', 'poster*', 'frames', '*.mp4'))
    c.update(slug=slug, name=slug.capitalize(), theme=theme or c['theme']); c['footer'] = f'{c["name"]}  ·  {c["title"]}'; json.dump(c, open(os.path.join(t, 'client.json'), 'w'), indent=2)
    print(f'created {t}. Next: edit client.json + engine.py (recipes, caps), intro/intro_data.html text, deck/build.js copy; add photos/<KEY>.jpg; then: python studio.py build {slug}')

def lst():
    print('THEMES'); [print(f'  {t["key"]:16} {t["name"]:18} {t["fonts"]["head"]}/{t["fonts"]["body"]:16} title:{t["layout"]:7} {t["mood"]}') for t in themes()]
    print('CLIENTS')
    for s in sorted(os.listdir(CL)):
        f = os.path.join(CL, s, 'client.json')
        if os.path.exists(f):
            c = json.load(open(f)); pdfs = glob.glob(os.path.join(CL, s, 'dist', '*.pdf')); print(f'  {s:10} theme {c["theme"]:16} start {c["start"]}  dist: {len(pdfs)} pdf')
if __name__ == '__main__':
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    b = sp.add_parser('build'); b.add_argument('client'); b.add_argument('--theme'); b.add_argument('--lite', action='store_true'); b.add_argument('--no-engine', action='store_true')
    sp.add_parser('qa').add_argument('client'); sp.add_parser('list'); sp.add_parser('gallery').add_argument('client', nargs='?', default='aleena')
    n = sp.add_parser('new'); n.add_argument('slug'); n.add_argument('--from', dest='src', default='aleena'); n.add_argument('--theme')
    a = ap.parse_args()
    if a.cmd == 'build': build(a.client, a.theme, a.lite, not a.no_engine); sys.exit(0 if qa(a.client) else 1)
    elif a.cmd == 'qa': sys.exit(0 if qa(a.client) else 1)
    elif a.cmd == 'gallery': gallery(a.client)
    elif a.cmd == 'new': new(a.slug, a.src, a.theme)
    else: lst()
