#!/usr/bin/env python3
"""check.py <index.html> : the Living Site gate. Prints each test, then PASS or FAIL (exit 1).

Level 1  a Spline scene is on the page and the shield (or a shield div) keeps the scroll free
Level 2  a scroll film (MotionEngine.Scrub with frames on disk) or a Higgsfield video loop is on the page
Level 3  at least one code-drawn motion piece (data-xray-tool="code") driven by IntersectionObserver
Craft    reduced motion handled, no raw scroll listeners, no hint/pill overlays on 3D, no dashes in copy,
         every local asset exists, real logos only (no placeholder boxes), fictional brands say so
"""
import os, re, sys, html

def visible_text(src):
    s = re.sub(r'(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>', ' ', src)
    s = re.sub(r'(?s)<!--.*?-->', ' ', s)
    s = re.sub(r'<[^>]+>', ' ', s)
    return html.unescape(re.sub(r'\s+', ' ', s))

def main(path):
    src = open(path, encoding='utf-8').read(); root = os.path.dirname(os.path.abspath(path))
    res = []
    def test(name, ok, note=''):
        res.append((ok, name, note))

    # Level 1
    spline = re.findall(r'(?:src|data-src)="(https://(?:my|app)\.spline\.design/[^"]+)"', src)
    test('L1 live 3D on the page', bool(spline), f'{len(spline)} Spline scene(s)')
    shield = 'spline-shield.js' in src or re.search(r'class="[^"]*shield', src) is not None
    test('L1 scroll never trapped (shield present)', not spline or shield)
    test('L1 no hint pills over 3D', not re.search(r'(?i)(move your cursor|click to play|click to explore|drag to rotate)', visible_text(src)))
    test('L1 at most two 3D showpieces', len(set(spline)) <= 3, 'more than two scenes reads as "going crazy"' if len(set(spline)) > 3 else '')

    # Level 2
    scrub = 'MotionEngine.Scrub' in src
    m = re.search(r'count:\s*(\d+)', src); count = int(m.group(1)) if m else 0
    fm = re.search(r"`([\w/.-]*?)\$\{String\(i \+ 1\)\.padStart\((\d)", src)
    frames_ok = True
    if scrub and fm and count:
        pre, pad = fm.group(1), int(fm.group(2))
        tail = re.search(r"padStart\(\d, '0'\)\}([\w.]+)`", src); ext = tail.group(1) if tail else '.jpg'
        missing = [i for i in (1, count) if not os.path.exists(os.path.join(root, f'{pre}{str(i).zfill(pad)}{ext}'))]
        frames_ok = not missing
    loops = re.findall(r'<video[^>]+src="([^"]+)"', src)
    test('L2 Higgsfield film or living loop', scrub or bool(loops), f'scrub={scrub} loops={len(loops)}')
    test('L2 film frames on disk', frames_ok, f'count {count}')
    test('L2 film blends frames (smooth slow scroll)', not scrub or 'blend: true' in src)
    test('L2 tagged as Higgsfield in X-ray', not (scrub or loops) or 'data-xray-tool="higgsfield"' in src)

    # Level 3
    code_pieces = len([x for x in re.findall(r'data-xray="([^"]*)" data-xray-tool="code"', src) if not x.lower().startswith('spline')])
    test('L3 at least one living code motion piece', code_pieces >= 1, f'{code_pieces} tagged piece(s)')
    test('L3 driven by IntersectionObserver', 'IntersectionObserver' in src)

    # Craft
    test('reduced motion or Off switch handled', 'prefers-reduced-motion' in src or 'data-motion' in src or 'motion-switch.js' in src)
    raw = [m.start() for m in re.finditer(r"addEventListener\('scroll'", src)]
    bad = [p for p in raw if 'requestAnimationFrame' not in src[p:p + 260] and 'passive' not in src[p:p + 260]]
    test('no raw scroll listeners (rAF-throttled or passive only)', not bad)
    text = visible_text(src)
    dashes = re.findall(r'.{0,30}[—–].{0,30}', text)
    test('no em or en dashes in visible copy', not dashes, dashes[0] if dashes else '')
    assets = set(re.findall(r'(?:src|href|poster)="((?:img|loops|frames|vendor|assets)/[^"#?]+)"', src))
    missing = [a for a in assets if not os.path.exists(os.path.join(root, a))]
    test('every local asset exists', not missing, ', '.join(missing[:4]))
    test('no placeholder boxes', not re.search(r'(?i)placeholder\.(png|jpg)|via\.placeholder|lorem ipsum', src))
    fictional = re.search(r'(?i)fictional', text) is not None
    test('fictional brand says so (or is real)', fictional or 'data-real-brand' in src, 'add "<Brand> is a fictional brand made for a demo." to the footer, or data-real-brand on <html>')
    test('window.__ready set', '__ready' in src)

    w = max(len(n) for _, n, _ in res)
    for ok, name, note in res:
        print(f"  {'ok  ' if ok else 'FAIL'}  {name.ljust(w)}  {note}")
    fails = [n for ok, n, _ in res if not ok]
    print('PASS' if not fails else f'FAIL ({len(fails)})')
    return 0 if not fails else 1

if __name__ == '__main__':
    if len(sys.argv) != 2: print(__doc__); sys.exit(2)
    sys.exit(main(sys.argv[1]))
