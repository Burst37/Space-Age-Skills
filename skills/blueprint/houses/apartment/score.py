"""Action sounds for the Apartment No.61 film (houses/apartment/film.py). Every time comes from timeline.json, which film.py
writes off the film's own clock: each part's launch and landing, the dive, the moment the ceiling closes, the steps.

Paper air over the sheet; a wooden knock per floor tile; a dull plaster thud per wall block (thinned, there are
1,700 of them); a glass tink per pane and frame; a cabinet knock per fitted unit; a soft thump per piece of
furniture; a pop per plant and decor piece; air swelling with the swarm; a riser and a long whoosh into the dive; the
ceiling closing; soft footsteps on the parquet; open air on the balcony. music_fx.py lays these under the track.

    python tools/motion/run_sfx.py houses/apartment/score.py --out <wav>
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
SEED = 6123


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


def step(f=95, dur=0.16):
    """a soft step on parquet: a low thud and a short scuff"""
    n = int(dur * SR)
    out = []
    for k in range(n):
        t = k / SR
        s = math.sin(2 * math.pi * f * t) * math.exp(-t / 0.035)
        s += 0.35 * math.sin(2 * math.pi * f * 3.1 * t) * math.exp(-t / 0.012)
        s += random.uniform(-1, 1) * 0.25 * math.exp(-((t - 0.03) / 0.02) ** 2)
        out.append(s)
    return out


def score(mix, tl):
    random.seed(SEED)
    T = tl["T"]
    dur = tl["duration"]

    # ---------------------------------------------------------------- the sheet, then the swarm's air
    mix.put(0.0, env_fade(airy(2.2, 1800, 4200, 0.4), 0.4, 0.8), 0.006)
    mix.put(0.6, riser(1.2, 300, 2600), 0.012)
    mix.put(1.4, env_fade(airy(9.5, 400, 2200, 0.7), 1.2, 1.5), 0.02, pan=-0.2)
    mix.put(2.4, env_fade(airy(8.0, 900, 3600, 0.5), 1.0, 1.5), 0.012, pan=0.25)

    # ---------------------------------------------------------------- the parts land, each in its own material
    walls = 0
    for e in tl["parts"]:
        t, st, name, launch = e["t"], e["stage"], e["name"], e["launch"]
        p = random.uniform(-0.6, 0.6)
        if st == "floor":
            mix.put(t, knock(random.uniform(330, 460), 0.08, 0.02, 0.4), 0.011, pan=p)
        elif st == "walls":
            walls += 1
            if walls % 3:
                continue
            mix.put(t, knock(random.uniform(170, 240), 0.1, 0.03, 0.5), 0.009, pan=p)
        elif st == "openings":
            if "glass" in name:
                mix.put(t, blip(random.uniform(2800, 3600), 0.18, 0.05), 0.007, pan=p)
            mix.put(t, click(random.uniform(1800, 2600), 0.025), 0.01, pan=p)
        elif st in ("builtin", "balcony"):
            mix.put(t, knock(random.uniform(480, 640), 0.09, 0.022, 0.35), 0.013, pan=p)
        elif st in ("furniture", "rug"):
            if e["size"] > 0.6:
                mix.put(t - 0.02, thump(), 0.012, pan=p * 0.5)
            mix.put(t, knock(random.uniform(380, 560), 0.08, 0.02, 0.25), 0.01, pan=p)
        elif st == "decor":
            mix.put(t, pop(random.uniform(500, 700), random.uniform(900, 1200), 0.1), 0.01, pan=p)
        if e["size"] > 1.2 and random.random() < 0.25:
            mix.put(launch, whoosh(max(0.3, t - launch), 500, 2400, 0.3), 0.006, pan=p)
    mix.put(10.2, chime([hz("A4"), hz("E5"), hz("A5")], 1.8, 0.6), 0.012)

    # ---------------------------------------------------------------- the dive and the ceiling closing above
    o, d, ins = T["orbit"], T["dive"], T["inside"]
    mix.put(o - 0.9, riser(1.2, 260, 3800), 0.016)
    mix.put(o, whoosh(d - o + 0.3, 300, 1800, 0.6), 0.03, pan=-0.1)
    mix.put(ins - 0.1, thump(), 0.02)
    mix.put(ins, impact(1.0), 0.01)
    mix.put(ins, env_fade(airy(dur - ins, 250, 700, 0.8), 0.6, 1.0), 0.008)

    # ---------------------------------------------------------------- footsteps on the parquet, then the balcony's open air
    for i, t in enumerate(tl["steps"]):
        mix.put(t, step(random.uniform(85, 105)), 0.022, pan=-0.12 if i % 2 else 0.12)
    mix.put(T["walk_end"] - 3.2, env_fade(airy(dur - T["walk_end"] + 3.2, 600, 2600, 0.6), 1.4, 0.8), 0.014, pan=0.15)
