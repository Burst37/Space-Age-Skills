"""Action sounds for the cliff villa film (houses/villa/film.py). Every time comes from timeline.json, which the film
writes off its own clock: each part's launch and landing, the pool filling, each light coming on, the dive, the entry.

Sea air under the approach; a stone knock per travertine tile (thinned, there are hundreds); a dull thud per wall and
cladding block; a glass tink per pane and rail; a wooden knock per deck board; soft thumps for furniture; a rustle as
each olive grows; water swelling into the pool; a warm chord as the lights come on; a riser and a long whoosh down over
the pool; the room's air inside. music_fx.py lays these under the track.

    python tools/motion/run_sfx.py houses/villa/score.py --out <wav>
"""

import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", ".."))

from sfx.score_kit import airy, env_fade, hz  # noqa: E402
from sfx.synth import SR, blip, chime, click, impact, pop, riser, whoosh  # noqa: E402


def thump():
    """a heavy part settling: a low knock that sinks in pitch"""
    n = int(0.5 * SR)
    out = [0.0] * n
    ph = 0.0
    for k in range(n):
        u = k / SR
        ph += 2 * math.pi * (70 - 30 * u) / SR
        out[k] = math.sin(ph) * math.exp(-u / 0.12)
    return out

TIMELINE = "timeline.json"
TARGET_LUFS = -14.0
SEED = 2311


def knock(f, dur=0.07, tau=0.018, grit=0.35):
    """a hard part seating: a short pitched knock with a noisy front"""
    n = int(dur * SR)
    out = []
    for k in range(n):
        t = k / SR
        s = math.sin(2 * math.pi * f * t) * math.exp(-t / tau)
        s += 0.5 * math.sin(2 * math.pi * f * 2.3 * t) * math.exp(-t / (tau * 0.5))
        s += random.uniform(-1, 1) * math.exp(-t / 0.002) * grit
        out.append(s)
    return out


def rustle(dur=0.5):
    """leaves: band-limited noise in short grains"""
    n = int(dur * SR)
    out, lp = [], 0.0
    for k in range(n):
        t = k / SR
        lp += 0.35 * (random.uniform(-1, 1) - lp)
        g = 0.5 + 0.5 * math.sin(2 * math.pi * 23 * t + random.uniform(-0.3, 0.3))
        out.append(lp * g * math.sin(math.pi * t / dur))
    return out


def score(mix, tl):
    random.seed(SEED)
    T = tl["T"]
    dur = tl["duration"]

    # ---------------------------------------------------------------- the sea and the wind on the approach
    mix.put(0.0, env_fade(airy(3.4, 250, 1400, 0.7), 0.5, 1.4), 0.016)
    mix.put(0.0, env_fade(airy(2.6, 1500, 4200, 0.4), 0.3, 1.2), 0.006, pan=0.3)
    mix.put(0.6, riser(1.0, 280, 2400), 0.01)
    mix.put(1.2, env_fade(airy(9.0, 400, 2200, 0.7), 1.0, 1.6), 0.014, pan=-0.2)

    # ---------------------------------------------------------------- the parts land, each in its own material
    n_tile = n_block = 0
    for e in tl["parts"]:
        t, st, name, launch = e["t"], e["stage"], e["name"], e["launch"]
        p = random.uniform(-0.6, 0.6)
        if st in ("terrace", "roof_terrace", "pool_floor", "ceiling", "roof", "upper_roof"):
            n_tile += 1
            if n_tile % 3:
                continue
            f0 = random.uniform(320, 440) if st not in ("roof", "upper_roof") else random.uniform(240, 320)
            mix.put(t, knock(f0, 0.08, 0.02, 0.45), 0.01, pan=p)
        elif st in ("walls", "upper_walls", "pool_walls"):
            n_block += 1
            if n_block % 2:
                continue
            mix.put(t, knock(random.uniform(160, 230), 0.1, 0.03, 0.5), 0.01, pan=p)
        elif st == "deck":
            mix.put(t, knock(random.uniform(420, 560), 0.07, 0.016, 0.3), 0.009, pan=p)
        elif st in ("glass", "upper_glass", "rail"):
            if "pane" in name or "rail" in name:
                mix.put(t, blip(random.uniform(2800, 3600), 0.2, 0.05), 0.007, pan=p)
            mix.put(t, click(random.uniform(1800, 2600), 0.025), 0.008, pan=p)
        elif st in ("furniture", "builtin", "outdoor", "roof_furniture", "pool_trim"):
            if e["size"] > 0.8:
                mix.put(t - 0.02, thump(), 0.01, pan=p * 0.5)
            mix.put(t, knock(random.uniform(380, 560), 0.08, 0.02, 0.25), 0.009, pan=p)
        elif st == "decor":
            mix.put(t, pop(random.uniform(500, 700), random.uniform(900, 1200), 0.1), 0.009, pan=p)
        elif st == "plants":
            mix.put(launch, rustle(random.uniform(0.4, 0.7)), 0.02, pan=p)
        if e["size"] > 1.5 and random.random() < 0.2:
            mix.put(launch, whoosh(max(0.3, t - launch), 500, 2400, 0.3), 0.005, pan=p)

    # ---------------------------------------------------------------- the pool fills, then the lights come on
    mix.put(T["fill"], env_fade(airy(1.6, 200, 1200, 0.85), 0.5, 0.6), 0.03)
    mix.put(T["fill"] + 0.2, env_fade(airy(1.3, 900, 3200, 0.6), 0.4, 0.6), 0.01, pan=0.15)
    for k, t in enumerate(tl.get("lights", [])[:8]):
        mix.put(t, click(random.uniform(900, 1300), 0.02), 0.006, pan=random.uniform(-0.5, 0.5))
    mix.put(T["lights"], chime([hz("D4"), hz("A4"), hz("F#5"), hz("A5")], 2.4, 0.6), 0.014)

    # ---------------------------------------------------------------- the dive and the entry
    d, ins = T["dive"], T["inside"]
    mix.put(d - 0.8, riser(1.0, 240, 3600), 0.014)
    mix.put(d, whoosh(ins - d + 0.2, 300, 1800, 0.6), 0.03, pan=-0.1)
    mix.put(ins - 0.25, whoosh(0.5, 900, 3000, 0.5), 0.012, pan=0.2)
    mix.put(ins - 0.05, thump(), 0.016)
    # inside: the room's still air, the sea beyond the open glass
    mix.put(ins, env_fade(airy(dur - ins, 220, 700, 0.8), 0.8, 1.0), 0.008)
    mix.put(ins + 1.5, env_fade(airy(dur - ins - 1.5, 500, 2200, 0.6), 1.5, 1.0), 0.009, pan=0.2)
