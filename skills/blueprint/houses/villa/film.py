"""The cliff villa, the film: a drone run in over the sea to a bare headland at sunset, the villa built from small parts
flying in while the drone circles it, the lights coming on, a dive low over the pool and in through the open glass,
and a turn round inside to the sun on the sea from the sofa.

It runs build.py in film mode (slabs as tiles, walls as blocks), keys every part, the camera, the lights and the
sun, and renders frames. It also writes timeline.json (landings, the fill, the lights, the dive) for the sound.

Run:
  blender -b --factory-startup -P houses/villa/film.py -- --res 1920x1080 --samples 64 [--step 2]
      [--from 0 --to 22.6] [--out blueprint-out/villa/film] [--stills 1,6,12] [--no-render]
"""
import json
import math
import os
import random
import sys
import time

import bpy
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build.py")
if "--" not in sys.argv:
    sys.argv.append("--")
if "--film" not in sys.argv:
    sys.argv.append("--film")
G = {"__file__": BUILD, "__name__": "villa_build"}
exec(compile(open(BUILD, encoding="utf-8").read(), BUILD, "exec"), G)
scene, OPTS, M = G["scene"], G["OPTS"], G["M"]
t_start = time.time()

FPS = 30
T_END = 22.6
NF = int(round(T_END * FPS))
OUTDIR = str(OPTS.get("out", os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "villa", "film")))
os.makedirs(OUTDIR, exist_ok=True)


def F(t):
    return 1 + int(round(t * FPS))


def T(f):
    return (f - 1) / FPS


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def smoother(x):
    x = clamp(x)
    return x * x * x * (x * (6 * x - 15) + 10)


def hermite(keys, t):
    """keys: [(t, value)], smooth through every key, zero speed at both ends."""
    ts = [k[0] for k in keys]
    vs = [k[1] for k in keys]
    if t <= ts[0]:
        return vs[0]
    if t >= ts[-1]:
        return vs[-1]
    i = max(j for j in range(len(ts) - 1) if ts[j] <= t)
    m = [0.0 if j in (0, len(ts) - 1) else (vs[j + 1] - vs[j - 1]) / (ts[j + 1] - ts[j - 1]) for j in range(len(ts))]
    h = ts[i + 1] - ts[i]
    s = (t - ts[i]) / h
    h00, h10, h01, h11 = 2 * s ** 3 - 3 * s ** 2 + 1, s ** 3 - 2 * s ** 2 + s, -2 * s ** 3 + 3 * s ** 2, s ** 3 - s ** 2
    return h00 * vs[i] + h10 * h * m[i] + h01 * vs[i + 1] + h11 * h * m[i + 1]


def look(loc, tgt, roll=0.0):
    f = (tgt - loc).normalized()
    up = Vector((0, 0, 1))
    r = f.cross(up).normalized()
    u = r.cross(f).normalized()
    q = Matrix((r, u, -f)).transposed().to_quaternion()
    if roll:
        from mathutils import Quaternion
        q = q @ Quaternion((0, 0, 1), roll)
    return q


# ---------------------------------------------------------------- the timeline
T_BUILD0, T_FILL, T_LIGHTS, T_SETTLE, T_DIVE, T_IN, T_TURN_END = 1.0, 10.2, 11.6, 12.6, 13.3, 16.3, 21.6

# ---------------------------------------------------------------- the camera: in over the sea, round the villa, down to the hero view
C = Vector((1.0, -7.0, 0.0))
HERO_L, HERO_T = Vector(G["SHOT"]["hero"]["loc"]), Vector(G["SHOT"]["hero"]["target"])
h_off = HERO_L - C
HERO_AZ, HERO_D = math.degrees(math.atan2(h_off.y, h_off.x)), Vector((h_off.x, h_off.y)).length
ORBIT = {
    "az": [(0, 34.0), (2.6, 44.0), (6.5, 78.0), (10.5, 118.0), (T_SETTLE, HERO_AZ)],
    "d": [(0, 170.0), (2.6, 62.0), (6.5, 46.0), (10.5, 36.0), (T_SETTLE, HERO_D)],
    "z": [(0, 8.0), (2.6, 17.0), (6.5, 19.0), (10.5, 11.0), (T_SETTLE, HERO_L.z)],
    "tx": [(0, 1.0), (2.6, 1.0), (6.5, 1.5), (T_SETTLE, HERO_T.x)],
    "ty": [(0, -6.0), (2.6, -7.0), (6.5, -7.5), (T_SETTLE, HERO_T.y)],
    "tz": [(0, 0.0), (2.6, 0.6), (6.5, 1.2), (T_SETTLE, HERO_T.z)],
    "lens": [(0, 38.0), (2.6, 30.0), (6.5, 28.0), (T_SETTLE, G["SHOT"]["hero"]["lens"])],
}


def orbit(t):
    az = math.radians(hermite(ORBIT["az"], t))
    d = hermite(ORBIT["d"], t)
    loc = Vector((C.x + d * math.cos(az), C.y + d * math.sin(az), hermite(ORBIT["z"], t)))
    tgt = Vector((hermite(ORBIT["tx"], t), hermite(ORBIT["ty"], t), hermite(ORBIT["tz"], t)))
    return loc, tgt, hermite(ORBIT["lens"], t)


def catmull(pts, n=40):
    """centripetal Catmull-Rom through the points, densely sampled"""
    P_ = [Vector(p) for p in pts]
    P_ = [P_[0] * 2 - P_[1]] + P_ + [P_[-1] * 2 - P_[-2]]
    out = []
    for i in range(1, len(P_) - 2):
        p0, p1, p2, p3 = P_[i - 1], P_[i], P_[i + 1], P_[i + 2]
        t0 = 0.0
        t1 = t0 + max((p1 - p0).length ** 0.5, 1e-4)
        t2 = t1 + max((p2 - p1).length ** 0.5, 1e-4)
        t3 = t2 + max((p3 - p2).length ** 0.5, 1e-4)
        for k in range(n):
            t = t1 + (t2 - t1) * k / n
            a1 = p0 * ((t1 - t) / (t1 - t0)) + p1 * ((t - t0) / (t1 - t0))
            a2 = p1 * ((t2 - t) / (t2 - t1)) + p2 * ((t - t1) / (t2 - t1))
            a3 = p2 * ((t3 - t) / (t3 - t2)) + p3 * ((t - t2) / (t3 - t2))
            b1 = a1 * ((t2 - t) / (t2 - t0)) + a2 * ((t - t0) / (t2 - t0))
            b2 = a2 * ((t3 - t) / (t3 - t1)) + a3 * ((t - t1) / (t3 - t1))
            out.append(b1 * ((t2 - t) / (t2 - t1)) + b2 * ((t - t1) / (t2 - t1)))
    out.append(P_[-2])
    return out


class Path:
    def __init__(self, pts):
        self.p = catmull(pts)
        self.c = [0.0]
        for a, b in zip(self.p, self.p[1:]):
            self.c.append(self.c[-1] + (b - a).length)
        self.L = self.c[-1]

    def at(self, s):
        s = clamp(s, 0.0, self.L)
        lo, hi = 0, len(self.c) - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if self.c[mid] <= s:
                lo = mid
            else:
                hi = mid
        seg = self.c[hi] - self.c[lo]
        return self.p[lo].lerp(self.p[hi], (s - self.c[lo]) / seg if seg > 0 else 0.0)


# the dive: down off the hero view to skim the water, between 2 loungers, in through the open glass
DIVE = Path([HERO_L, (-13.0, 2.6, 1.3), (-5.0, 0.7, 0.72), (1.2, -0.9, 0.8), (3.0, -4.6, 1.15), (2.8, -7.0, 1.3), (2.3, -10.4, 1.25)])
# inside: on past the sofa to the kitchen side while the view turns round to the sea
INSIDE = Path([(2.3, -10.4, 1.25), (2.5, -12.4, 1.18), (2.6, -14.0, 1.1), Vector(G["SHOT"]["lounge"]["loc"])])
END_T = Vector(G["SHOT"]["lounge"]["target"])


def ease_io(x, a=0.3, b=0.35):
    """speed up over a, cruise, slow down over b: distance fraction"""
    x = clamp(x)
    vmax = 1 / (1 - a / 2 - b / 2)
    if x < a:
        return vmax * x * x / (2 * a)
    if x < 1 - b:
        return vmax * (a / 2 + (x - a))
    y = 1 - x
    return 1 - vmax * y * y / (2 * b)


def cam_at(t):
    if t <= T_SETTLE:
        loc, tgt, lens = orbit(t)
        return loc, look(loc, tgt), lens
    if t <= T_DIVE:
        return HERO_L, look(HERO_L, HERO_T), G["SHOT"]["hero"]["lens"]
    if t <= T_IN:
        x = (t - T_DIVE) / (T_IN - T_DIVE)
        s = ease_io(x, 0.35, 0.25) * DIVE.L
        loc = DIVE.at(s)
        ahead = DIVE.at(s + 4.0) if s + 4.0 <= DIVE.L else DIVE.at(DIVE.L) + (DIVE.at(DIVE.L) - DIVE.at(DIVE.L - 0.5)).normalized() * (s + 4.0 - DIVE.L)
        ahead.z -= 0.35
        k = smoother(x / 0.3)
        tgt = HERO_T.lerp(ahead, k)
        lens = G["SHOT"]["hero"]["lens"] + (20.0 - G["SHOT"]["hero"]["lens"]) * smoother(x * 1.3)
        roll = math.radians(-6.0) * math.sin(math.pi * clamp(x / 0.7)) * (1 - x)  # a banked turn as it swings to the house
        return loc, look(loc, tgt, roll), lens
    # inside: drift on to the lounge spot, the view turning clockwise from the back wall round to the sea
    x = clamp((t - T_IN) / (T_TURN_END - T_IN))
    loc = INSIDE.at(ease_io(x, 0.15, 0.45) * INSIDE.L)
    d0 = DIVE.at(DIVE.L) - DIVE.at(DIVE.L - 0.5)
    yaw0 = math.atan2(d0.y, d0.x)
    e = END_T - loc
    yaw1 = math.atan2(e.y, e.x)
    while yaw1 > yaw0:  # clockwise: past the fire wall and the sofa, then the opening
        yaw1 -= 2 * math.pi
    k = smoother(clamp(x / 0.55))  # the turn is done by 55%: the back wall only flashes past
    yw = yaw0 + (yaw1 - yaw0) * k
    pitch = -0.1 + ((END_T.z - loc.z) / max(0.1, Vector((e.x, e.y)).length) + 0.1) * k
    tgt = loc + Vector((math.cos(yw), math.sin(yw), pitch)) * 3.0
    return loc, look(loc, tgt), 20.0 + (G["SHOT"]["lounge"]["lens"] - 20.0) * k


cd = bpy.data.cameras.new("film_cam")
cd.sensor_width = 36
cd.clip_start = 0.04
cd.clip_end = 30000
cam = bpy.data.objects.new("film_cam", cd)
scene.collection.objects.link(cam)
cam.rotation_mode = "QUATERNION"
scene.camera = cam
CAM = [cam_at(T(f)) for f in range(1, NF + 1)]
prev = None
for f, (loc, q, lens) in zip(range(1, NF + 1), CAM):
    if prev is not None and prev.dot(q) < 0:
        q = -q
    prev = q
    cam.location = loc
    cam.rotation_quaternion = q
    cd.lens = lens
    cam.keyframe_insert("location", frame=f)
    cam.keyframe_insert("rotation_quaternion", frame=f)
    cd.keyframe_insert("lens", frame=f)
print(f"dive {DIVE.L:.1f} m, inside {INSIDE.L:.1f} m")

# ---------------------------------------------------------------- the build
rng = random.Random(23)
WAVES = {"terrace": (1.0, 3.4), "pool_floor": (2.3, 3.0), "deck": (3.0, 3.9), "pool_walls": (2.7, 4.4), "pool_trim": (4.3, 4.8),
         "walls": (3.6, 5.8), "glass": (5.6, 6.9), "ceiling": (6.0, 6.7), "roof": (6.4, 7.7), "builtin": (6.8, 8.0),
         "roof_terrace": (7.3, 8.0), "upper_walls": (7.5, 8.7), "furniture": (7.6, 9.2), "outdoor": (8.3, 9.6),
         "upper_glass": (8.4, 9.0), "upper_roof": (8.7, 9.5), "rail": (9.1, 9.5), "decor": (9.0, 9.9), "roof_furniture": (9.3, 9.8)}
PARTS = [(o, st) for o, st in G["PARTS"] if o.type != "LIGHT"]
for o, st in PARTS:
    o["rest"] = tuple(o.location)
groups = {}
for o, st in PARTS:
    groups.setdefault(st, []).append(o)
sched = []
for st, objs in groups.items():
    if st not in WAVES:
        continue
    a, b = WAVES[st]
    if st in ("walls", "upper_walls", "pool_walls"):
        nc = 1 + max(o.get("course", 0) for o in objs)
        for o in objs:
            c = o.get("course", 0)
            u = (c + rng.random() * 0.8) / nc
            sched.append((o, st, a + (b - a) * u, 0.75 + rng.random() * 0.35))
        continue
    if st in ("terrace", "roof_terrace", "ceiling", "roof", "upper_roof", "pool_floor"):
        # tiles sweep out from the corner by the pool
        key = lambda o: (Vector((o.location.x, o.location.y)) - Vector((-11.0, -2.0))).length + rng.uniform(-1.2, 1.2)
    else:
        key = lambda o: o.location.x + rng.uniform(-2.0, 2.0)
    objs = sorted(objs, key=key)
    for i, o in enumerate(objs):
        u = i / max(1, len(objs) - 1)
        tiles = st in ("terrace", "roof_terrace", "ceiling", "roof", "upper_roof", "pool_floor", "deck")
        sched.append((o, st, a + (b - a) * u + rng.uniform(-0.08, 0.08), (0.65 + rng.random() * 0.3) if tiles else (0.9 + rng.random() * 0.45)))


def back(u, s=1.2):
    return 1 + (s + 1) * (u - 1) ** 3 + s * (u - 1) ** 2


events = []
t_key = time.time()
for o, st, ts, dur in sched:
    ts = max(0.4, ts)
    rest_l, rest_r, rest_s = o.location.copy(), o.rotation_euler.copy(), o.scale.copy()
    land = ts + dur
    cam_pos = CAM[min(NF, F(land)) - 1][0]
    if rng.random() < 0.1 and st not in ("terrace", "roof", "upper_roof"):
        off = (cam_pos - rest_l) * rng.uniform(0.35, 0.6)
    else:
        az = rng.uniform(0, 2 * math.pi)
        el = rng.uniform(0.15, 1.0)
        off = Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))) * rng.uniform(8, 20)
    lift = Vector((0, 0, rng.uniform(1.0, 3.0)))
    axis = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
    spin = axis * rng.uniform(0.5, 1.3)
    f0, f1 = F(ts), F(land)
    o.scale = (0, 0, 0)
    o.location = rest_l + off
    o.keyframe_insert("scale", frame=f0 - 1)
    o.keyframe_insert("location", frame=f0 - 1)
    for f in range(f0, f1 + 1):
        u = clamp((T(f) - ts) / dur)
        w = 1 - back(u)
        o.location = rest_l + off * (w * w) + lift * (2 * w * (1 - w))
        o.rotation_euler = (rest_r.x + spin.x * w, rest_r.y + spin.y * w, rest_r.z + spin.z * w)
        k = 0.55 + 0.45 * (1 - w)
        o.scale = (rest_s.x * k, rest_s.y * k, rest_s.z * k)
        o.keyframe_insert("location", frame=f)
        o.keyframe_insert("rotation_euler", frame=f)
        o.keyframe_insert("scale", frame=f)
    o.location, o.rotation_euler, o.scale = rest_l, rest_r, rest_s
    events.append({"t": round(land, 3), "launch": round(ts, 3), "stage": st, "name": o.name.split(".")[0],
                   "size": round(max(o.dimensions) if o.type == "MESH" else 0.8, 3)})


def pop(o, t0, dur, base=None):
    """scale up from nothing at its base (plants grow, lamps appear)"""
    rest_l, rest_s = o.location.copy(), o.scale.copy()
    b = Vector(base) if base is not None else rest_l
    off = rest_l - b
    o.scale = (0, 0, 0)
    o.location = b
    o.keyframe_insert("scale", frame=F(t0) - 1)
    o.keyframe_insert("location", frame=F(t0) - 1)
    for f in range(F(t0), F(t0 + dur) + 1):
        k = back(clamp((T(f) - t0) / dur), 0.9)
        o.scale = (rest_s.x * k, rest_s.y * k, rest_s.z * k)
        o.location = b + off * k
        o.keyframe_insert("scale", frame=f)
        o.keyframe_insert("location", frame=f)
    o.location, o.scale = rest_l, rest_s


grow = sorted(groups.get("plants", []), key=lambda o: o.location.x)
for i, o in enumerate(grow):
    t0 = 8.8 + 1.2 * i / max(1, len(grow) - 1) + rng.uniform(-0.1, 0.1)
    pop(o, t0, 0.9 if o.type == "EMPTY" else 0.6, o.get("base"))
    events.append({"t": round(t0 + 0.5, 3), "launch": round(t0, 3), "stage": "plants", "name": o.name.split(".")[0], "size": 1.0})
for o in groups.get("lights", []):  # soffit discs and coves arrive with the roof
    pop(o, 7.5 + rng.uniform(0, 0.4), 0.3)
print(f"keyed {len(sched)} parts + {len(grow)} plants in {time.time() - t_key:.1f} s")

# ---------------------------------------------------------------- the pool fills
W = G["WATER"]
w_l, w_s = W.location.copy(), W.scale.copy()
h_w = W.dimensions.z
bottom = w_l.z - h_w / 2
for f in range(1, NF + 1):
    k = smoother((T(f) - T_FILL) / 1.4)
    W.scale = (w_s.x, w_s.y, max(1e-4, k))
    W.location = (w_l.x, w_l.y, bottom + h_w * k / 2)
    W.keyframe_insert("scale", frame=f)
    W.keyframe_insert("location", frame=f)

# ---------------------------------------------------------------- the lights come on, staggered, the interior first and the pool last
LIGHTS = [o for o, st in G["PARTS"] if o.type == "LIGHT"]
ON = {k: v + (T_LIGHTS - 10.6) for k, v in {"room_fill": 10.6, "bedroom_fill": 10.7, "fire_glow": 10.8, "lamp_light": 10.9, "bed_lamp_light": 10.95,
      "drum_light": 10.85, "soffit_spot": 11.0, "lantern_light": 11.2, "pool_light": 11.25, "cliff_up": 11.5}.items()}
for o in LIGHTS:
    base_name = o.name.split(".")[0]
    t_on = ON.get(base_name, T_LIGHTS + 0.4) + (rng.uniform(0, 0.25) if base_name in ("soffit_spot", "pool_light") else 0.0)
    e = o.data.energy
    o.data.energy = 0.0
    o.data.keyframe_insert("energy", frame=F(t_on) - 1)
    o.data.energy = e
    o.data.keyframe_insert("energy", frame=F(t_on + 0.35))
    o["on_at"] = t_on


def emission_socket(m):
    n = m.node_tree.nodes
    for node in n:
        if node.type == "EMISSION":
            return node.inputs["Strength"]
    return n["Principled BSDF"].inputs["Emission Strength"]


for key, t_on in ((k, v + (T_LIGHTS - 10.6)) for k, v in (("cove", 10.65), ("downlight", 11.0), ("drum", 10.85), ("lamp", 10.9), ("lantern", 11.2), ("fire", 10.8), ("pool_tiles", 11.3))):
    sk = emission_socket(M[key])
    e = sk.default_value
    sk.default_value = 0.0
    sk.keyframe_insert("default_value", frame=F(t_on) - 1)
    sk.default_value = e
    sk.keyframe_insert("default_value", frame=F(t_on + 0.4))

# ---------------------------------------------------------------- the sun: low on the left over the orbit, swung round to the sofa's view through the dive
aim_sun = G["aim_sun"]
SUNV, sun = G["SUNV"], G["sun"]
FILL = G["FILL"]
hero_sun, lounge_sun = G["SHOT"]["hero"]["sun"], G["SHOT"]["lounge"]["sun"]
for f in range(1, NF + 1):
    t = T(f)
    k = smoother((t - (T_DIVE + 0.6)) / 2.6)
    aim_sun(hero_sun + (lounge_sun - hero_sun) * k)
    SUNV.keyframe_insert("default_value", frame=f)
    sun.keyframe_insert("rotation_euler", frame=f)
    ki = smoother((t - (T_IN - 1.1)) / 1.3)
    scene.view_settings.exposure = G["SHOT"]["lounge"].get("ev", 0.0) * ki
    scene.view_settings.keyframe_insert("exposure", frame=f)
for o in FILL:  # the fill dims to the lounge's level once inside (after its switch-on keys)
    e = o.data.energy
    o.data.keyframe_insert("energy", frame=F(T_IN - 1.3))
    o.data.energy = G["SHOT"]["lounge"].get("room", e)
    o.data.keyframe_insert("energy", frame=F(T_IN + 0.2))

# ---------------------------------------------------------------- timeline for the sound
TL = {"duration": T_END, "fps": FPS,
      "T": {"build": T_BUILD0, "fill": T_FILL, "lights": T_LIGHTS, "settle": T_SETTLE, "dive": T_DIVE, "inside": T_IN, "turn_end": T_TURN_END},
      "parts": sorted(events, key=lambda e: e["t"]),
      "lights": sorted({round(o["on_at"], 3) for o in LIGHTS})}
json.dump(TL, open(os.path.join(HERE, "timeline.json"), "w"), indent=0)
print(f"timeline: {len(events)} landings")

# ---------------------------------------------------------------- render
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = NF
if "from" in OPTS:
    scene.frame_start = F(float(OPTS["from"]))
if "to" in OPTS:
    scene.frame_end = min(NF, F(float(OPTS["to"])))
scene.frame_step = int(OPTS.get("step", 1))
scene.render.use_motion_blur = True
scene.render.motion_blur_shutter = 0.5
scene.render.use_persistent_data = True
scene.render.filepath = os.path.join(OUTDIR, "f_")
scene.render.image_settings.file_format = "PNG"
print(f"set up in {time.time() - t_start:.1f} s; frames {scene.frame_start}-{scene.frame_end} step {scene.frame_step}", flush=True)
if OPTS.get("blend"):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "villa"), "film.blend"))
if OPTS.get("stills"):
    for tt in str(OPTS["stills"]).split(","):
        scene.frame_set(F(float(tt)))
        scene.render.filepath = os.path.join(OUTDIR, f"still_{float(tt):05.2f}.png")
        bpy.ops.render.render(write_still=True)
    print(f"stills in {time.time() - t_start:.1f} s")
elif not OPTS.get("no-render"):
    bpy.ops.render.render(animation=True)
    print(f"rendered in {time.time() - t_start:.1f} s")
