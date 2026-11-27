"""Read the floor plan into metres: the wall mask, its rectangles, the floor footprint and the scale.

The listing draws walls as a grey fill with a black outline, so the walls are the pixels of that grey and black
that survive an opening wide enough to drop text, furniture outlines and hatching. Every wall here is
axis-aligned, so the mask splits into rectangles exactly (row runs merged down the page). The scale bar under
the plans gives pixels per metre. The floor is everything the walls enclose once the doors and windows read off
the plan (plan.json) are closed.

Writes walls.json next to this file and a debug image to blueprint-out/apartment/. The plan image is BLUEPRINT_PLAN or plan.png here.
Run: python houses/apartment/extract_walls.py
"""
import json
import os

import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get("BLUEPRINT_PLAN", os.path.join(HERE, "plan.png"))
DBG = os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "apartment")
os.makedirs(DBG, exist_ok=True)

im = cv2.imread(SRC)  # BGR, 2x the listing
lum = im.mean(axis=2)
sat = im.max(axis=2).astype(int) - im.min(axis=2).astype(int)

# ---------------------------------------------------------------- scale: the black bar from 0 to 5 m
bar = lum[2900:2960] < 60
cols = np.nonzero(bar.any(axis=0))[0]
PX_PER_M = (cols.max() - cols.min() + 1) / 5.0
print("scale bar", cols.min(), cols.max(), "px/m", round(PX_PER_M, 2))

# ---------------------------------------------------------------- the furnished plan only (the top one)
CROP = (430, 890, 1840, 1890)  # x0, y0, x1, y1 in the 2x image
cx0, cy0, cx1, cy1 = CROP
sub_l = lum[cy0:cy1, cx0:cx1]
sub_s = sat[cy0:cy1, cx0:cx1]
mask = ((sub_l < 150) & (sub_s < 14)).astype(np.uint8)  # the grey fill and its black outline
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
keep = np.zeros_like(mask)
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] >= 120:
        keep[lab == i] = 1
mask = keep


def to_rects(m, min_side=3):
    """Exact rectangle cover of a binary mask: runs per row, merged down while the same run repeats."""
    out = []
    live = {}
    for y in range(m.shape[0] + 1):
        runs = set()
        if y < m.shape[0]:
            xs = np.nonzero(m[y])[0]
            if len(xs):
                br = np.nonzero(np.diff(xs) > 1)[0]
                starts = np.r_[xs[0], xs[br + 1]]
                ends = np.r_[xs[br] + 1, xs[-1] + 1]
                runs = set(zip(starts.tolist(), ends.tolist()))
        for r in list(live):
            if r not in runs:
                out.append((r[0], live.pop(r), r[1], y))
        for r in runs:
            live.setdefault(r, y)
    return [r for r in out if r[2] - r[0] >= min_side and r[3] - r[1] >= min_side]


def to_m(px, py):
    return (round((px + cx0) / PX_PER_M, 4), round((py + cy0) / PX_PER_M, 4))


def to_px(x, y):
    return int(round(x * PX_PER_M - cx0)), int(round(y * PX_PER_M - cy0))


rects = to_rects(mask)
print("wall rects", len(rects))

# ---------------------------------------------------------------- the floor: closed by the plan's openings, outside flood-filled
plan = json.load(open(os.path.join(HERE, "plan.json")))
solid = mask.copy()
for o in plan["openings"]:
    a, b = to_px(o["x0"], o["y0"]), to_px(o["x1"], o["y1"])
    ex, ey = (14, 3) if b[0] - a[0] >= b[1] - a[1] else (3, 14)  # run into the walls at both ends
    solid[a[1] - ey:b[1] + ey, a[0] - ex:b[0] + ex] = 1
ff = (1 - solid).astype(np.uint8)
cv2.floodFill(ff, np.zeros((ff.shape[0] + 2, ff.shape[1] + 2), np.uint8), (0, 0), 2)
footprint = (ff != 2).astype(np.uint8)
floor = to_rects(footprint, 2)
print("floor rects", len(floor), "area m2", round(footprint.sum() / PX_PER_M ** 2, 2))


def rm(r):
    a, b = to_m(r[0], r[1]), to_m(r[2], r[3])
    return {"x0": a[0], "y0": a[1], "x1": b[0], "y1": b[1]}


json.dump({"px_per_m": PX_PER_M, "crop": CROP, "image": "plan_en.png (2x)", "walls": [rm(r) for r in rects], "floor": [rm(r) for r in floor]},
          open(os.path.join(HERE, "walls.json"), "w"), indent=1)

dbg = im[cy0:cy1, cx0:cx1].copy()
ov = dbg.copy()
ov[footprint == 1] = (ov[footprint == 1] * 0.5 + np.array([120, 200, 120]) * 0.5).astype(np.uint8)
for x0, y0, x1, y1 in rects:
    cv2.rectangle(ov, (x0, y0), (x1 - 1, y1 - 1), (40, 40, 220), -1)
for o in plan["openings"]:
    a, b = to_px(o["x0"], o["y0"]), to_px(o["x1"], o["y1"])
    cv2.rectangle(ov, a, b, (230, 140, 30) if o["kind"] in ("window", "glazing") else (0, 160, 255), -1)
dbg = cv2.addWeighted(ov, 0.65, dbg, 0.35, 0)
cv2.imwrite(os.path.join(DBG, "walls_dbg.png"), cv2.resize(dbg, None, fx=0.6, fy=0.6, interpolation=cv2.INTER_AREA))
