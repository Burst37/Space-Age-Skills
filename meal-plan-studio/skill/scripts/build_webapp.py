#!/usr/bin/env python3
"""Build the mobile-first plan web app (one self-contained HTML file) from plan.json + db.json.

Usage:
  python build_webapp.py --plan plan_out/plan.json --db plan_out/db.json --client "Santhosh" \
      --start 2026-10-12 --out plan.html [--images DIR] [--hero hero.jpg] [--poster poster.jpg] [--video intro.mp4]

--images DIR holds one JPG per recipe key (B1.jpg, MF1.jpg, MN1.jpg, S1.jpg ...). Missing photos are fine:
the meal card simply shows no picture. --start must be a Monday because the carb cycle is written Mon..Sun.
"""
import argparse, base64, datetime, io, json, os, sys
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('--plan', required=True); ap.add_argument('--db', required=True)
ap.add_argument('--client', default='Client'); ap.add_argument('--start', required=True)
ap.add_argument('--out', required=True); ap.add_argument('--images'); ap.add_argument('--hero')
ap.add_argument('--poster'); ap.add_argument('--video')
ap.add_argument('--profile', default=None, help='profile JSON (default: assets/profiles/gout.json)')
a = ap.parse_args()

start = datetime.date.fromisoformat(a.start)
if start.weekday() != 0:
    sys.exit('--start must be a Monday (the carb cycle starts on Monday).')
end = start + datetime.timedelta(days=29)

def img_b64(path, width, q=74):
    im = Image.open(path).convert('RGB'); s = width / im.size[0]
    if s < 1: im = im.resize((width, round(im.size[1] * s)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PROFILE = json.load(open(a.profile or os.path.join(ROOT, 'assets', 'profiles', 'gout.json')))
P = json.load(open(a.plan)); DB = json.load(open(a.db))
days = []
for d in P['days']:
    meals = []
    for m in d['meals']:
        meals.append(dict(slot=m['slot'], time=m['time'], key=m['key'], name=m['name'],
                          items=[[k, q] for k, q in m['items']], nadd=len(m.get('adds', []))))
    days.append(dict(day=d['day'], tier=d['tier'], ct=d['ctarget'], fast=d.get('fast'), window=d.get('window'), dtype=d.get('dtype'), kcal=d['kcal'], p=d['p'], c=d['c'],
                     f=d['f'], fib=d['fib'], check=d['check'], meals=meals))
data = dict(days=days, weeks=[dict(week=w['week'], days=w['days'], avg=w['avg'], groc=w['groc']) for w in P['weeks']],
            avg=P['avg'], pbs=P['protein_by_source'])
imgs = {}
if a.images:
    for k in sorted({m['key'] for d in days for m in d['meals']}):
        for ext in ('jpg', 'jpeg', 'png'):
            p = os.path.join(a.images, f'{k}.{ext}')
            if os.path.exists(p): imgs[k] = img_b64(p, 560); break
poster = img_b64(a.poster, 1280, 72) if a.poster else ''
hero = img_b64(a.hero, 1100, 60) if a.hero else ''
video = base64.b64encode(open(a.video, 'rb').read()).decode() if a.video else ''

fmt = lambda d, f: d.strftime(f).replace(' 0', ' ')
t = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'webapp_template.html')).read()
rep = {
 '__DATA__': json.dumps(data, ensure_ascii=False), '__PROFILE__': json.dumps(PROFILE, ensure_ascii=False), '__IMGS__': json.dumps(imgs), '__DB__': json.dumps(DB, ensure_ascii=False),
 '__POSTER__': poster, '__HERO__': hero, '__VID__': video, '__CLIENT__': a.client,
 '__STARTLABEL__': fmt(start, 'Mon, %b %d, %Y'), '__RANGELABEL__': f"{fmt(start, '%B %d')} – {fmt(end, '%B %d, %Y')}",
 '__STARTUTC__': f'{start.year},{start.month - 1},{start.day}',
}
for k, v in rep.items(): t = t.replace(k, v)
open(a.out, 'w').write(t)
print(f'wrote {a.out} ({len(t)/1e6:.1f} MB), photos: {len(imgs)}, video: {"yes" if video else "no"}')
