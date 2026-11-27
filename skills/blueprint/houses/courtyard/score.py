"""Action sounds for the Japanese courtyard house film (houses/courtyard/film.py). Every time comes from timeline.json,
written off the film's own clock: each part's launch and landing by stage, the wave, each light, the dive, the entry.

Paper settling under the sketch; a dull stone knock per footing; a hollow wooden tock per post, beam and rafter; a
lighter tap per floor board; a soft rice-paper tick per kumiko strip and a hush for each sheet of washi; a thin metal
tink per roof strip; soft thumps for furniture; a pebble click for the garden stones; a rustle as the maple grows. Then
the wave: a deep swell and a shimmer, rain arriving on the metal roof, the lights' chime, water from the bamboo spout
as the camera passes the basin, the room's quiet inside. music_fx.py lays these under the track.

    python tools/motion/run_sfx.py houses/courtyard/score.py --out <wav>
"""

import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", ".."))

from sfx.score_kit import airy, env_fade, hz  # noqa: E402
from sfx.synth import SR, blip, chime, click, pop, riser, whoosh  # noqa: E402


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
SEED = 2411


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


def tock(f, dur=0.12):
    """hollow wood: a knock with a second resonance a fifth up, longer ring"""
    n = int(dur * SR)
    return [(math.sin(2 * math.pi * f * k / SR) + 0.45 * math.sin(2 * math.pi * f * 1.5 * k / SR)) * math.exp(-k / SR / 0.03)
            + random.uniform(-1, 1) * math.exp(-k / SR / 0.0015) * 0.3 for k in range(n)]


def hush(dur=0.18, lo=0.2):
    """paper: a breath of filtered noise"""
    n = int(dur * SR)
    out, lp = [], 0.0
    for k in range(n):
        lp += lo * (random.uniform(-1, 1) - lp)
        out.append(lp * math.sin(math.pi * k / n))
    return out


def rustle(dur=0.5):
    n = int(dur * SR)
    out, lp = [], 0.0
    for k in range(n):
        t = k / SR
        lp += 0.35 * (random.uniform(-1, 1) - lp)
        g = 0.5 + 0.5 * math.sin(2 * math.pi * 23 * t + random.uniform(-0.3, 0.3))
        out.append(lp * g * math.sin(math.pi * t / dur))
    return out


def rain(dur, density=900, bright=0.5):
    """rain on a metal roof and on wet stone: many tiny ticks over a hiss"""
    n = int(dur * SR)
    out = [0.0] * n
    lp = 0.0
    for k in range(n):
        lp += 0.12 * (random.uniform(-1, 1) - lp)
        out[k] = lp * 0.6
    for _ in range(int(density * dur)):
        at = random.randrange(n)
        f = random.uniform(2500, 6000)
        a = random.uniform(0.1, 0.5) * bright
        for j in range(min(160, n - at)):
            out[at + j] += a * math.sin(2 * math.pi * f * j / SR) * math.exp(-j / SR / 0.0015)
    return out


def trickle(dur):
    """water from the bamboo spout into the basin: a bubbling burble"""
    n = int(dur * SR)
    out, lp = [], 0.0
    ph = 0.0
    for k in range(n):
        t = k / SR
        lp += 0.25 * (random.uniform(-1, 1) - lp)
        f = 380 + 220 * math.sin(2 * math.pi * 3.1 * t) * math.sin(2 * math.pi * 0.7 * t)
        ph += 2 * math.pi * f / SR
        out.append(lp * 0.7 + 0.2 * math.sin(ph) * max(0.0, math.sin(2 * math.pi * 6.3 * t)))
    return out


def score(mix, tl):
    random.seed(SEED)
    T = tl["T"]
    dur = tl["duration"]

    # ---------------------------------------------------------------- the desk: a room tone, the paper settling
    mix.put(0.0, env_fade(airy(T["wave"], 200, 900, 0.6), 0.6, 1.2), 0.008)
    mix.put(0.25, hush(0.5, 0.15), 0.02, pan=-0.2)
    mix.put(T["hold"] - 0.1, riser(T["descent"] - T["hold"], 180, 1600), 0.008)
    mix.put(T["hold"], whoosh(T["descent"] - T["hold"] + 0.4, 200, 1400, 0.5), 0.012)

    # ---------------------------------------------------------------- the parts land, each in its own material
    cnt = {}
    for e in tl["parts"]:
        t, st, name, launch = e["t"], e["stage"], e["name"], e["launch"]
        cnt[st] = cnt.get(st, 0) + 1
        p = random.uniform(-0.6, 0.6)
        c = cnt[st]
        if st == "foundation":
            mix.put(t, knock(random.uniform(110, 160), 0.12, 0.035, 0.6), 0.016, pan=p)
        elif st in ("frame", "roof_frame"):
            if c % 2:
                continue
            mix.put(t, tock(random.uniform(260, 360)), 0.011, pan=p)
        elif st in ("floor", "engawa", "ceiling"):
            if c % 4:
                continue
            mix.put(t, tock(random.uniform(420, 560), 0.07), 0.008, pan=p)
        elif st == "walls":
            if c % 3:
                continue
            mix.put(t, knock(random.uniform(220, 300), 0.08, 0.022, 0.4), 0.009, pan=p)
        elif st == "shoji":
            if name == "washi":
                mix.put(t - 0.05, hush(0.16, 0.3), 0.012, pan=p)
            elif "glass" in name:
                mix.put(t, blip(random.uniform(2900, 3600), 0.18, 0.05), 0.006, pan=p)
            elif c % 3 == 0:
                mix.put(t, click(random.uniform(2200, 3200), 0.018), 0.006, pan=p)
        elif st == "roof":
            if c % 2:
                continue
            mix.put(t, blip(random.uniform(1700, 2300), 0.12, 0.03), 0.006, pan=p)
            mix.put(t, knock(random.uniform(500, 650), 0.05, 0.012, 0.2), 0.006, pan=p)
        elif st == "furniture":
            if e["size"] > 0.8:
                mix.put(t - 0.02, thump(), 0.01, pan=p * 0.5)
            mix.put(t, tock(random.uniform(300, 420), 0.09), 0.008, pan=p)
        elif st == "garden":
            if name.startswith("tree") or name in ("fern_02", "shrub_02"):
                mix.put(launch, rustle(random.uniform(0.5, 0.9) if name.startswith("tree") else 0.35), 0.022 if name.startswith("tree") else 0.012, pan=p)
            else:
                mix.put(t, knock(random.uniform(700, 950), 0.05, 0.01, 0.5), 0.008, pan=p)
        elif st == "lights":
            mix.put(t, pop(random.uniform(500, 700), random.uniform(900, 1200), 0.08), 0.006, pan=p)
        if e["size"] > 2.0 and random.random() < 0.15:
            mix.put(launch, whoosh(max(0.3, t - launch), 500, 2400, 0.3), 0.004, pan=p)

    # ---------------------------------------------------------------- the wave: a swell, a shimmer, the rain arrives, the lights
    w = T["wave"]
    mix.put(w - 0.6, riser(0.7, 200, 2600), 0.012)
    mix.put(w, env_fade(airy(2.6, 90, 500, 0.9), 0.3, 1.6), 0.04)
    mix.put(w + 0.1, chime([hz("A3"), hz("E4"), hz("B4"), hz("C#5"), hz("E5")], 3.2, 0.5), 0.012)
    mix.put(w + 0.6, env_fade(rain(dur - w - 0.6, 700, 0.5), 2.0, 0.8), 0.012, pan=0.1)
    for t in tl.get("lights", [])[:10]:
        mix.put(t, click(random.uniform(900, 1300), 0.02), 0.004, pan=random.uniform(-0.5, 0.5))
    mix.put(T["lights"] + 0.3, chime([hz("E4"), hz("B4"), hz("F#5")], 2.0, 0.6), 0.008)

    # ---------------------------------------------------------------- the dive over the roof, past the basin, into the tatami room
    d, ins = T["dive"], T["inside"]
    mix.put(d - 0.5, riser(0.8, 240, 2400), 0.01)
    mix.put(d, whoosh(ins - d + 0.2, 300, 1800, 0.5), 0.022, pan=-0.1)
    mix.put(d + (ins - d) * 0.45, env_fade(trickle(1.6), 0.4, 0.8), 0.03, pan=-0.35)
    mix.put(ins - 0.1, thump(), 0.01)
    mix.put(ins, env_fade(airy(dur - ins, 180, 600, 0.8), 0.8, 1.0), 0.007)
