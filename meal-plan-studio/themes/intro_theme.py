#!/usr/bin/env python3
"""Recolor a client's intro poster HTML (written in the original green palette) to a theme.
Usage: python intro_theme.py <theme-key> <in.html> <out.html>"""
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
def rgb(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def hx(c): return '#%02x%02x%02x' % tuple(max(0, min(255, round(v))) for v in c)
def mix(a, b, t): a, b = rgb(a), rgb(b); return hx([x + (y - x) * t for x, y in zip(a, b)])
def theme(key):
    ts = json.load(open(os.path.join(H, 'themes.json')))['themes']
    return next((t for t in ts if t['key'] == key), ts[0])
def recolor(html, key):
    t = theme(key); c = t['colors']; W, K = '#ffffff', '#000000'; dk2, a1, a2, a4, a6 = c['dk2'], c['accent1'], c['accent2'], c['accent4'], c['accent6']
    keto = t['tiers']['KETO']
    m = {'#0E3B2C': dk2, '#115039': mix(dk2, W, .10), '#0a2f23': mix(dk2, K, .2), '#10231b': mix(dk2, K, .55), '#05150f': mix(dk2, K, .8), '#04130d': mix(dk2, K, .85),
         '#3FBF7F': a1, '#46d38a': mix(a1, W, .2), '#8be8b5': mix(a1, W, .5), '#7fd8a8': mix(a1, W, .4), '#9af0c4': mix(a1, W, .55),
         '#a9c9b9': mix(a6, dk2, .15), '#cfe5d9': mix(a6, W, .45), '#e4f1ea': mix(a6, W, .75), '#d6e8de': mix(a6, W, .6), '#c7d9cf': mix(a6, W, .3), '#e6f3ec': mix(a6, W, .8),
         '#8fb7a2': mix(a6, dk2, .35), '#3e5a4c': mix(a6, dk2, .7), '#F2A93B': a2, '#F7BC5A': mix(a2, W, .2), '#3AA7C9': a4, '#5CC1E0': mix(a4, W, .25), '#B58CE6': mix(keto, W, .35)}
    for old, new in m.items(): html = re.sub(re.escape(old), new, html, flags=re.I)
    d = rgb(mix(dk2, K, .85)); html = re.sub(r'rgba\(4,19,13,', 'rgba(%d,%d,%d,' % tuple(d), html)
    tr = lambda k: ','.join(str(v) for v in rgb(t['tiers'][k]))
    html = re.sub(r"TC=\{[^}]*\}", "TC={KETO:'%s',LOW:'%s',MED:'%s',HIGH:'%s'}" % (tr('KETO'), tr('LOW'), tr('MED'), tr('HIGH')), html)
    return html
if __name__ == '__main__':
    k, i, o = sys.argv[1:4]; open(o, 'w').write(recolor(open(i).read(), k))
