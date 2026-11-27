"""Apartment No.61, the film: the listing sheet, the flat built from small parts flying in from every side, a dive into
the living room under a closing ceiling, then a walk through the flat at eye height with a walking head.

It runs build.py in film mode (walls as blocks, floor as tiles, the sheet as ground), keys every part's flight
and the camera, and renders frames. It also writes timeline.json (landings, dive, footsteps) for the sound.

Run:
  blender -b --factory-startup -P houses/apartment/film.py -- --res 1920x1080 --samples 96 [--step 2] [--from 0 --to 27]
      [--out blueprint-out/apartment/film] [--blend] [--no-render]
"""
import json
import math
import os
import random
import sys
import time

import bpy
from mathutils import Matrix, Quaternion, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build.py")
if "--" not in sys.argv:
    sys.argv.append("--")
if "--film" not in sys.argv:
    sys.argv.append("--film")
G = {"__file__": BUILD, "__name__": "plan3d_build"}
exec(compile(open(BUILD, encoding="utf-8").read(), BUILD, "exec"), G)
scene, P, OPTS, H, M = G["scene"], G["P"], G["OPTS"], G["H"], G["M"]
t_start = time.time()

FPS = 30
T_END = 24.6
NF = int(round(T_END * FPS))
OUTDIR = str(OPTS.get("out", os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "apartment", "film")))
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


def bez(p0, p1, p2, p3, u):
    v = 1 - u
    return p0 * v ** 3 + p1 * 3 * v * v * u + p2 * 3 * v * u * u + p3 * u ** 3


def V3(x, y, z):
    p = P(x, y)
    return Vector((p.x, p.y, z))


# ---------------------------------------------------------------- the camera
T_PLAN, T_TILT, T_ORBIT, T_DIVE, T_SETTLE, T_WALK_END = 1.8, 7.0, 12.4, 15.4, 15.8, 23.5


def hermite(keys, t):
    """keys: [(t, value)], smooth through every key, zero speed at both ends."""
    ts = [k[0] for k in keys]
    vs = [k[1] for k in keys]
    if t <= ts[0]:
        return vs[0]
    if t >= ts[-1]:
        return vs[-1]
    i = max(j for j in range(len(ts) - 1) if ts[j] <= t)
    m = []
    for j in range(len(ts)):
        if j == 0 or j == len(ts) - 1:
            m.append(0.0)
        else:
            m.append((vs[j + 1] - vs[j - 1]) / (ts[j + 1] - ts[j - 1]))
    h = ts[i + 1] - ts[i]
    s = (t - ts[i]) / h
    h00, h10, h01, h11 = 2 * s ** 3 - 3 * s ** 2 + 1, s ** 3 - 2 * s ** 2 + s, -2 * s ** 3 + 3 * s ** 2, s ** 3 - s ** 2
    return h00 * vs[i] + h10 * h * m[i] + h01 * vs[i + 1] + h11 * h * m[i + 1]


ORBIT = {  # elevation, azimuth (deg), distance, target x/y on the plan, lens
    "el": [(0, 90.0), (T_PLAN, 90.0), (T_TILT, 56.0), (T_ORBIT, 50.0)],
    "az": [(0, 270.0), (T_PLAN, 270.0), (T_TILT, 257.0), (T_ORBIT, 240.0)],
    "dist": [(0, 31.0), (T_PLAN, 29.0), (T_TILT, 35.0), (T_ORBIT, 33.5)],
    "tx": [(0, 13.2), (T_PLAN, 13.25), (T_TILT, 13.3), (T_ORBIT, 12.9)],
    "ty": [(0, 14.4), (T_PLAN, 14.9), (T_TILT, 15.9), (T_ORBIT, 16.3)],
    "lens": [(0, 40.0), (T_PLAN, 40.0), (T_TILT, 46.0), (T_ORBIT, 46.0)],
}


def look(loc, tgt, roll=0.0):
    f = (tgt - loc).normalized()
    hz = Vector((f.x, f.y, 0))
    up = Vector((0, 0, 1)) + (hz.normalized() * 0.05 if hz.length > 1e-6 else Vector((0, 0.05, 0)))
    r = f.cross(up).normalized()
    u = r.cross(f).normalized()
    m = Matrix((r, u, -f)).transposed()
    q = m.to_quaternion()
    if roll:
        q = q @ Quaternion((0, 0, 1), roll)
    return q


def orbit(t):
    el = math.radians(min(hermite(ORBIT["el"], t), 89.99))  # the spline overshoots 90 on the way in: never tip over the top
    az = math.radians(hermite(ORBIT["az"], t))
    dist = hermite(ORBIT["dist"], t)
    tgt = V3(hermite(ORBIT["tx"], t), hermite(ORBIT["ty"], t), 0.0)
    off = Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))) * dist
    return tgt + off, tgt, hermite(ORBIT["lens"], t)


EYE = 1.62
LAND = V3(9.95, 19.35, EYE)
D_P0, D_T0, _ = orbit(T_ORBIT)
D_P1, D_P2 = V3(9.1, 24.5, 11.0), V3(9.95, 19.8, 3.4)
D_T1, D_T2, D_T3 = V3(9.4, 18.5, 0.0), V3(9.95, 17.4, 0.7), V3(9.97, 15.2, 1.45)

# up past the coffee table and the dining table to the kitchen, then a turn round to the room
WALK = [(9.95, 19.35), (10.05, 18.2), (10.06, 17.2), (10.2, 16.4), (10.45, 15.45)]
END_LOOK = V3(7.0, 19.9, 1.2)  # turned round at the kitchen: the table, the sofa and the sunlit corner window


def catmull(pts, n=24):
    """centripetal Catmull-Rom through the points, densely sampled."""
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


PATH = [V3(x, y, EYE) for x, y in [(p.x, p.y) for p in catmull(WALK)]]
CUM = [0.0]
for a_, b_ in zip(PATH, PATH[1:]):
    CUM.append(CUM[-1] + (b_ - a_).length)
L_WALK = CUM[-1]


def at_s(s):
    s = clamp(s, 0, L_WALK)
    i = max(0, min(len(CUM) - 2, next((k for k in range(len(CUM) - 1) if CUM[k + 1] >= s), len(CUM) - 2)))
    seg = CUM[i + 1] - CUM[i]
    return PATH[i].lerp(PATH[i + 1], (s - CUM[i]) / seg if seg > 0 else 0)


def prof(x, a=0.13, b=0.22):
    """trapezoid speed: speed up, walk, slow down; returns (distance fraction, speed fraction)."""
    x = clamp(x)
    vmax = 1 / (1 - a / 2 - b / 2)
    if x < a:
        return vmax * x * x / (2 * a), x / a
    if x < 1 - b:
        return vmax * (a / 2 + (x - a)), 1.0
    y = 1 - x
    return 1 - vmax * y * y / (2 * b), y / b


STEP = 0.6


def cam_at(t):
    """location, rotation, lens at time t"""
    if t <= T_ORBIT:
        loc, tgt, lens = orbit(t)
        return loc, look(loc, tgt), lens, 0.0
    if t <= T_DIVE:
        u = smoother((t - T_ORBIT) / (T_DIVE - T_ORBIT))
        loc = bez(D_P0, D_P1, D_P2, LAND, u)
        tgt = bez(D_T0, D_T1, D_T2, D_T3, u)
        lens = 46 + (20 - 46) * smoother(u * 1.15 - 0.1)
        return loc, look(loc, tgt), lens, 0.0
    if t <= T_SETTLE:
        return LAND, look(LAND, D_T3), 20.0, 0.0
    x = (t - T_SETTLE) / (T_WALK_END - T_SETTLE)
    frac, sp = prof(x)
    s = frac * L_WALK
    pos = at_s(s)
    ahead = at_s(s + 1.1) if s + 1.1 <= L_WALK else at_s(L_WALK) + (at_s(L_WALK) - at_s(L_WALK - 0.3)).normalized() * (s + 1.1 - L_WALK)
    d = (ahead - pos)
    d.z = 0
    d = d.normalized()
    # a glance left at the dining table and the kitchen window on the way up
    tw = t - T_SETTLE
    yaw = math.radians(28) * math.exp(-((tw - 1.6) / 0.8) ** 2)
    d = Matrix.Rotation(yaw, 3, "Z") @ d
    # from the dive's last look into the walk
    k0 = smoother(tw / 0.7)
    d0 = (D_T3 - LAND)
    d0.z = 0
    d = d0.normalized().lerp(d, k0).normalized()
    # at the kitchen, turn left round to the room: the yaw swings counter-clockwise through the dining table to the sofa
    k1 = smoother((t - (T_WALK_END - 4.0)) / 4.4)
    yaw_f = math.atan2(d.y, d.x)
    e = END_LOOK - pos
    yaw_e = math.atan2(e.y, e.x)
    while yaw_e < yaw_f:
        yaw_e += 2 * math.pi
    while yaw_e - yaw_f > 2 * math.pi:
        yaw_e -= 2 * math.pi
    yw = yaw_f + (yaw_e - yaw_f) * k1
    pitch = -0.087 + ((END_LOOK.z - pos.z) / max(0.1, Vector((e.x, e.y)).length) + 0.087) * k1
    d = Vector((math.cos(yw), math.sin(yw), 0))
    tgt = pos + Vector((d.x, d.y, pitch)) * 3.0
    # the head of someone walking: up and down once a step, sideways once a stride
    ph = s / STEP
    r = d.cross(Vector((0, 0, 1))).normalized()
    pos = pos + Vector((0, 0, 0.013 * math.sin(2 * math.pi * ph) * sp)) + r * (0.009 * math.sin(math.pi * ph) * sp)
    roll = math.radians(0.45) * math.sin(math.pi * ph) * sp
    return pos, look(pos, tgt, roll), 20.0, s


cd = bpy.data.cameras.new("film_cam")
cd.sensor_width = 36
cd.clip_start = 0.04
cd.clip_end = 300
cam = bpy.data.objects.new("film_cam", cd)
scene.collection.objects.link(cam)
cam.rotation_mode = "QUATERNION"
scene.camera = cam
CAM = [cam_at(T(f)) for f in range(1, NF + 1)]
prev = None
for f, (loc, q, lens, _) in zip(range(1, NF + 1), CAM):
    if prev is not None and prev.dot(q) < 0:
        q = -q
    prev = q
    cam.location = loc
    cam.rotation_quaternion = q
    cd.lens = lens
    cam.keyframe_insert("location", frame=f)
    cam.keyframe_insert("rotation_quaternion", frame=f)
    cd.keyframe_insert("lens", frame=f)
cam_z = [c[0].z for c in CAM]
f_inside = next(f for f in range(1, NF + 1) if T(f) > T_ORBIT and cam_z[f - 1] < 2.6)
print(f"walk {L_WALK:.1f} m in {T_WALK_END - T_SETTLE:.1f} s, inside at {T(f_inside):.2f} s")

# ---------------------------------------------------------------- the build: every part flies in from somewhere around
rng = random.Random(61)
WAVES = {"floor": (1.0, 2.8), "balcony": (3.0, 6.2), "openings": (5.9, 7.5), "rug": (6.4, 7.1), "builtin": (6.6, 8.5),
         "furniture": (7.3, 9.4), "decor": (8.7, 10.1)}
parts = [(o, st) for o, st in G["PARTS"] if st in WAVES or st == "walls"]
groups = {}
for o, st in parts:
    groups.setdefault(st, []).append(o)
sched = []
for st, objs in groups.items():
    if st == "walls":
        for o in objs:
            c = o.get("course", 0)
            ts = 2.1 + c * 0.66 + (o.location.x + 9) / 18 * 0.55 + rng.random() * 0.35
            sched.append((o, st, ts, 0.8 + rng.random() * 0.45))
        continue
    a, b = WAVES[st]
    objs = sorted(objs, key=lambda o: o.location.x + rng.uniform(-1.5, 1.5) + (0 if o.name.startswith("balcony") else 3))
    for i, o in enumerate(objs):
        ts = a + (b - a) * (i / max(1, len(objs) - 1)) + rng.uniform(-0.12, 0.12)
        dur = (0.7 + rng.random() * 0.35) if st == "floor" else (0.9 + rng.random() * 0.5)
        sched.append((o, st, max(0.6, ts), dur))


def back(u, s=1.15):
    return 1 + (s + 1) * (u - 1) ** 3 + s * (u - 1) ** 2


events = []
t_key = time.time()
for o, st, ts, dur in sched:
    rest_l, rest_r, rest_s = o.location.copy(), o.rotation_euler.copy(), o.scale.copy()
    land = ts + dur
    cam_pos = CAM[min(NF, F(land)) - 1][0]
    heavy = o.type == "EMPTY" or st == "balcony"
    if rng.random() < 0.12 and not heavy:
        off = (cam_pos - rest_l) * rng.uniform(0.45, 0.75)
    else:
        az = rng.uniform(0, 2 * math.pi)
        el = rng.uniform(0.1, 1.1)
        off = Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))) * rng.uniform(9, 24)
    lift = Vector((0, 0, rng.uniform(1.2, 3.5)))
    axis = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
    spin = axis * rng.uniform(0.6, 1.4)
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
print(f"keyed {len(sched)} parts in {time.time() - t_key:.1f} s")

# ---------------------------------------------------------------- the ceiling closes over the camera as it drops in
ceil = G["ceiling"]
for o, st in G["PARTS"]:
    if st == "ceiling" and o is not ceil and o.parent is None:
        o.parent = ceil
        o.matrix_parent_inverse = ceil.matrix_world.inverted()
for f in range(1, NF + 1):
    t = T(f)
    z = cam_z[f - 1]
    show = t > T_ORBIT and z < 7.5
    ceil.location = (0, 0, max(0.0, z - H + 0.45) if show else 30.0)
    ceil.scale = (1, 1, 1) if show else (0, 0, 0)
    ceil.keyframe_insert("location", frame=f)
    ceil.keyframe_insert("scale", frame=f)

# ---------------------------------------------------------------- light: from the dollhouse's high sun to the low afternoon sun inside
ground, aim_sun, sun, bg = G["ground"], G["aim_sun"], G["sun"], G["bg"]
M["shade"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 3.0
for f in range(1, NF + 1):
    t = T(f)
    k = smoother((6.0 - cam_z[f - 1]) / 4.2) if t > T_ORBIT else 0.0
    aim_sun(228 + 10 * k, 47 - 28 * k)
    G["so"].keyframe_insert("rotation_euler", frame=f)
    sun.energy = 4.6 + 0.4 * k
    sun.keyframe_insert("energy", frame=f)
    bg.inputs["Strength"].default_value = 0.55 + 0.3 * k
    bg.inputs["Strength"].keyframe_insert("default_value", frame=f)
    # out on the balcony the eye adjusts back to daylight
    out_ = smoother((-CAM[f - 1][0].y - (20.15 - G["CY"])) / 0.9) if t > T_SETTLE else 0.0
    scene.view_settings.exposure = 1.0 * k - 0.8 * out_
    scene.view_settings.keyframe_insert("exposure", frame=f)
ground.hide_render = False
ground.keyframe_insert("hide_render", frame=1)
ground.hide_render = True
ground.keyframe_insert("hide_render", frame=f_inside)

# ---------------------------------------------------------------- timeline for the sound
steps = []
last = 0
for f in range(1, NF + 1):
    s = CAM[f - 1][3]
    n = int(s / STEP)
    if n > last:
        steps.append(round(T(f), 3))
        last = n
TL = {"duration": T_END, "fps": FPS, "T": {"plan": T_PLAN, "tilt": T_TILT, "orbit": T_ORBIT, "dive": T_DIVE, "settle": T_SETTLE,
                                          "walk_end": T_WALK_END, "inside": round(T(f_inside), 3)},
      "parts": sorted(events, key=lambda e: e["t"]), "steps": steps}
json.dump(TL, open(os.path.join(HERE, "timeline.json"), "w"), indent=0)
print(f"timeline: {len(events)} landings, {len(steps)} steps")

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
scene.render.film_transparent = False
scene.render.filepath = os.path.join(OUTDIR, "f_")
scene.render.image_settings.file_format = "PNG"
print(f"set up in {time.time() - t_start:.1f} s; frames {scene.frame_start}-{scene.frame_end} step {scene.frame_step}")
if OPTS.get("blend"):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "apartment"), "film.blend"))
if OPTS.get("debug-cam"):
    for tt in (0.3, 1.0, 2.6, 4.0):
        scene.frame_set(F(tt))
        mw = cam.matrix_world
        print("cam", tt, "loc", tuple(round(v, 2) for v in mw.translation), "up", tuple(round(v, 3) for v in mw.to_3x3() @ Vector((0, 1, 0))),
              "fwd", tuple(round(v, 3) for v in mw.to_3x3() @ Vector((0, 0, -1))))
if OPTS.get("no-ground"):
    bpy.data.objects.remove(ground, do_unlink=True)
if OPTS.get("debug-ray"):
    # what sits under a pixel: --debug-ray "t:u:v,t:u:v" with u, v in 0..1 from the top-left
    dg = bpy.context.evaluated_depsgraph_get()
    for spec in str(OPTS["debug-ray"]).split(","):
        tt, uu, vv = map(float, spec.split(":"))
        scene.frame_set(F(tt))
        dg = bpy.context.evaluated_depsgraph_get()
        mw = cam.matrix_world
        fr = [mw @ c for c in cam.data.view_frame(scene=scene)]  # top-right, bottom-right, bottom-left, top-left
        top = fr[3].lerp(fr[0], uu)
        bot = fr[2].lerp(fr[1], uu)
        tgt_ = top.lerp(bot, vv)
        org = mw.translation
        dirv = (tgt_ - org).normalized()
        chain = []
        for _ in range(6):  # step through glass to the first opaque thing
            hit, loc_, nor_, idx_, ob_, _ = scene.ray_cast(dg, org, dirv)
            if not hit:
                chain.append("sky")
                break
            chain.append(f"{ob_.name}@{tuple(round(v, 2) for v in loc_)}")
            if "glass" not in ob_.name:
                break
            org = loc_ + dirv * 0.002
        print("ray", spec, " -> ".join(chain))
if OPTS.get("stills"):
    for tt in str(OPTS["stills"]).split(","):
        scene.frame_set(F(float(tt)))
        scene.render.filepath = os.path.join(OUTDIR, f"still_{float(tt):05.2f}.png")
        bpy.ops.render.render(write_still=True)
    print(f"stills in {time.time() - t_start:.1f} s")
elif not OPTS.get("no-render"):
    bpy.ops.render.render(animation=True)
    print(f"rendered in {time.time() - t_start:.1f} s")
