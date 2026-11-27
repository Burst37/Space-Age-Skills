"""The Japanese courtyard house, the film: it opens on a pen sketch lying on the desk, seen straight down, and the
camera spirals down out of the photo while the house assembles on the paper from ~2,700 parts in white clay, each
system flashing its own colour as it lands. Then a wave runs out from the maple: the paper becomes the hillside, the
clay becomes cedar, paper, tatami and stone, the sky drops to blue hour, the rooms light up, the forest and the ridges
rise out of the mist. Last, a dive over the roof into the court and in through the open glass of the tatami room,
turning round to the maple.

It runs build.py in film mode, adds the sketch, wraps every material (clay -> real by the wave), keys the parts,
the camera, the lights and the sky, renders frames and writes timeline.json for the sound and the counter overlay.

Run:
  blender -b --factory-startup -P houses/courtyard/film.py -- --res 1920x1080 --samples 64
      [--from 0 --to 24.4] [--step 3] [--out blueprint-out/courtyard/film] [--stills 0,5,12] [--no-render]
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
G = {"__file__": BUILD, "__name__": "courtyard_build"}
exec(compile(open(BUILD, encoding="utf-8").read(), BUILD, "exec"), G)
K = G["K"]
scene, OPTS, M = G["scene"], G["OPTS"], G["M"]
t_start = time.time()

FPS = 30
T_END = 24.0
NF = int(round(T_END * FPS))
OUTDIR = str(OPTS.get("out", os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "courtyard", "film")))
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


def look(loc, tgt, up=Vector((0, 0, 1)), roll=0.0):
    f = (tgt - loc).normalized()
    r = f.cross(up)
    if r.length < 1e-6:
        r = f.cross(Vector((0, 1, 0)))
    r.normalize()
    u = r.cross(f).normalized()
    q = Matrix((r, u, -f)).transposed().to_quaternion()
    if roll:
        q = q @ Quaternion((0, 0, 1), roll)
    return q


# ---------------------------------------------------------------- the timeline
T_HOLD = 0.8  # the sketch, still
T_DESC = 3.6  # the spiral down ends
T_ORBIT = 13.0  # the build orbit ends on the hero view
T_WAVE = 13.4  # the wave leaves the maple
T_LIGHTS = 14.2
T_DIVE, T_IN, T_TURN_END = 17.0, 20.2, 23.2
T_TURN0, T_TURN1 = T_IN - 0.8, T_IN + 0.7  # the view swings round to the garden in the opening, then pulls back into the room
WINDOWS = {  # stage: (first launch, last launch)
    "foundation": (1.2, 2.5), "frame": (2.2, 4.3), "floor": (3.5, 5.3), "engawa": (4.5, 5.5), "walls": (4.5, 7.1),
    "shoji": (6.3, 8.4), "ceiling": (7.3, 8.1), "furniture": (7.7, 9.3), "roof_frame": (8.7, 10.1), "roof": (9.7, 11.7),
    "garden": (10.5, 12.2), "lights": (7.6, 11.6),
}
COLORS = {  # the flash each system lands in (the counter overlay uses the same)
    "foundation": (0.45, 0.55, 0.7), "frame": (1.0, 0.55, 0.12), "roof_frame": (1.0, 0.55, 0.12), "floor": (1.0, 0.82, 0.18),
    "engawa": (1.0, 0.82, 0.18), "walls": (0.25, 0.85, 0.5), "ceiling": (0.25, 0.85, 0.5), "shoji": (1.0, 0.36, 0.55),
    "furniture": (0.62, 0.42, 1.0), "roof": (0.2, 0.5, 1.0), "garden": (0.35, 0.9, 0.3), "lights": (1.0, 0.9, 0.5), "misc": (0.8, 0.8, 0.8),
}
CLAY = (0.78, 0.77, 0.74)
CEN = Vector((7.0, 7.0, 0.8))
MAPLE = Vector((G["MAPLE"][0], G["MAPLE"][1], 1.0))

# ---------------------------------------------------------------- the sketch on the desk: the photo mapped so its plan is the real 14 x 14 m
SKETCH = os.path.join(HERE, "sketch.png")
IMW, IMH = 1672, 941
PX0, PX1, PY0, PY1 = 465.0, 1210.0, 108.0, 778.0  # the plan's outer wall lines in the photo (14.0 m both ways)
SX, SY = 14.0 / (PX1 - PX0), 14.0 / (PY1 - PY0)


def px2w(px, py):
    return (px - PX0) * SX, (PY1 - py) * SY


X0, Y1 = px2w(0, 0)
X1, Y0 = px2w(IMW, IMH)
PHOTO_C = Vector(((X0 + X1) / 2, (Y0 + Y1) / 2, 0.0))
Z_PAPER = 0.004


def sketch_mat():
    m, N, L, b = K.new_mat("sketch")
    tex = N.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(SKETCH, check_existing=True)
    uv = N.new("ShaderNodeTexCoord")
    L.new(uv.outputs["UV"], tex.inputs["Vector"])
    L.new(tex.outputs["Color"], b.inputs["Base Color"])
    K.inp(b, "Roughness", 0.95)
    K.inp(b, ["Specular IOR Level", "Specular"], 0.0)
    return m


def desk_mat():
    m = K.textured("desk", "oak_veneer_01", 5.0, value=1.12, sat=0.7, tint=(1.0, 0.9, 0.8), rough=(0.4, 0.4))
    b = m.node_tree.nodes["Principled BSDF"]
    K.inp(b, ["Specular IOR Level", "Specular"], 0.2)
    return m


me = bpy.data.meshes.new("sketch")
me.from_pydata([(X0, Y0, Z_PAPER), (X1, Y0, Z_PAPER), (X1, Y1, Z_PAPER), (X0, Y1, Z_PAPER)], [], [(0, 1, 2, 3)])
uvl = me.uv_layers.new(name="UVMap")
for li, (u, v) in zip(range(4), ((0, 0), (1, 0), (1, 1), (0, 1))):
    uvl.data[li].uv = (u, v)
me.materials.append(sketch_mat())
SK = bpy.data.objects.new("sketch", me)
scene.collection.objects.link(SK)
DESK = K.box("desk_ext", PHOTO_C.x - 1500, PHOTO_C.x + 1500, PHOTO_C.y - 1500, PHOTO_C.y + 1500, Z_PAPER - 0.006, Z_PAPER - 0.002, desk_mat(), bevel=0)
K.PARTS.pop()  # the desk is not a part
print(f"sketch plane {X1 - X0:.2f} x {Y1 - Y0:.2f} m centred {PHOTO_C.x:.2f}, {PHOTO_C.y:.2f}")

# ---------------------------------------------------------------- the wave: one node group every material reads
WG = bpy.data.node_groups.new("wave", "ShaderNodeTree")
WG.interface.new_socket("alive", in_out="OUTPUT", socket_type="NodeSocketFloat")
WG.interface.new_socket("edge", in_out="OUTPUT", socket_type="NodeSocketFloat")
gn, gl = WG.nodes, WG.links
g_out = gn.new("NodeGroupOutput")
geo = gn.new("ShaderNodeNewGeometry")
dist = gn.new("ShaderNodeVectorMath")
dist.operation = "DISTANCE"
gl.new(geo.outputs["Position"], dist.inputs[0])
dist.inputs[1].default_value = MAPLE
R = gn.new("ShaderNodeValue")
R.name = "R"
R.outputs[0].default_value = -10.0
BAND = gn.new("ShaderNodeValue")
BAND.name = "BAND"
BAND.outputs[0].default_value = 1.6
d_r = K.math_node(gn, gl, "SUBTRACT", R.outputs[0], dist.outputs["Value"])  # > 0 inside
alive = K.math_node(gn, gl, "DIVIDE", d_r, BAND.outputs[0])
alive_c = gn.new("ShaderNodeMapRange")
alive_c.interpolation_type = "SMOOTHERSTEP"
gl.new(alive, alive_c.inputs["Value"])
gl.new(alive_c.outputs[0], g_out.inputs["alive"])
edge = gn.new("ShaderNodeMapRange")
edge.inputs["From Min"].default_value = 0.0
edge.inputs["From Max"].default_value = 0.35
edge.inputs["To Min"].default_value = 1.0
edge.inputs["To Max"].default_value = 0.0
gl.new(K.math_node(gn, gl, "ABSOLUTE", K.math_node(gn, gl, "DIVIDE", d_r, BAND.outputs[0])), edge.inputs["Value"])
gl.new(edge.outputs[0], g_out.inputs["edge"])


WAVE_KEYS = [(T_WAVE, -2.0), (T_WAVE + 0.6, 4.0), (T_WAVE + 1.6, 16.0), (T_WAVE + 2.6, 60.0), (T_WAVE + 4.0, 1400.0)]


def R_at(t):
    """the wave front's distance from the maple: eased out of the tree, then spreading geometrically to the ridges"""
    ks = WAVE_KEYS
    if t <= ks[0][0]:
        return ks[0][1]
    if t >= ks[-1][0]:
        return ks[-1][1]
    i = max(j for j in range(len(ks) - 1) if ks[j][0] <= t)
    u = (t - ks[i][0]) / (ks[i + 1][0] - ks[i][0])
    a, b = ks[i][1], ks[i + 1][1]
    if i == 0:
        return a + (b - a) * smoother(u)
    return a * (b / a) ** u


def wave_keys():
    for f in range(1, NF + 1):
        if f == 1 or F(T_WAVE - 0.2) <= f <= F(T_WAVE + 4.2) or f == NF:
            R.outputs[0].default_value = R_at(T(f))
            R.outputs[0].keyframe_insert("default_value", frame=f)
    BAND.outputs[0].default_value = 1.6
    BAND.outputs[0].keyframe_insert("default_value", frame=F(T_WAVE + 1.6))
    BAND.outputs[0].default_value = 20.0
    BAND.outputs[0].keyframe_insert("default_value", frame=F(T_WAVE + 3.4))


def reach(dist_m):
    """when the wave front reaches a distance from the maple"""
    f = F(T_WAVE)
    while R_at(T(f)) < dist_m and f < NF:
        f += 1
    return T(f)


SITE_MATS = {M["ground"].name, M["gravel_site"].name, M["crawl"].name, "mist_0"} | {f"ridge_{i}" for i in range(4)}
PAPER_MATS = {"sketch", "desk"}


def output_src(m):
    out = next((n for n in m.node_tree.nodes if n.type == "OUTPUT_MATERIAL" and n.is_active_output), None) or next(
        (n for n in m.node_tree.nodes if n.type == "OUTPUT_MATERIAL"), None)
    if not out or not out.inputs["Surface"].links:
        return None, None
    return out, out.inputs["Surface"].links[0].from_socket


def wrap(m):
    """clay (or nothing) outside the wave, the real material inside; the sketch and the desk the other way round."""
    if not m or not m.use_nodes or m.get("wrapped"):
        return
    out, src = output_src(m)
    if src is None:
        return
    N, L = m.node_tree.nodes, m.node_tree.links
    g = N.new("ShaderNodeGroup")
    g.node_tree = WG
    mix = N.new("ShaderNodeMixShader")
    L.new(g.outputs["alive"], mix.inputs[0])
    tr = N.new("ShaderNodeBsdfTransparent")
    if m.name in PAPER_MATS:
        L.new(src, mix.inputs[1])
        L.new(tr.outputs[0], mix.inputs[2])
    elif m.name in SITE_MATS:
        L.new(tr.outputs[0], mix.inputs[1])
        L.new(src, mix.inputs[2])
    else:
        clay = N.new("ShaderNodeBsdfPrincipled")
        K.inp(clay, "Roughness", 0.55)
        fl = N.new("ShaderNodeAttribute")
        fl.attribute_type = "OBJECT"
        fl.attribute_name = "flash"
        tn = N.new("ShaderNodeAttribute")
        tn.attribute_type = "OBJECT"
        tn.attribute_name = "tint"
        col = K.mix_rgb(N, L, fl.outputs["Fac"], CLAY, tn.outputs["Vector"])
        L.new(col, clay.inputs["Base Color"])
        em = K.math_node(N, L, "MULTIPLY", fl.outputs["Fac"], 1.6)
        L.new(tn.outputs["Vector"], clay.inputs["Emission Color"])
        L.new(em, clay.inputs["Emission Strength"])
        c_out = clay.outputs[0]
        # keep the leaf cards' cut-outs: clay only where the real material is opaque
        pb = next((n for n in N if n.type == "BSDF_PRINCIPLED" and n is not clay and n.inputs["Alpha"].links), None)
        if pb is not None:
            am = N.new("ShaderNodeMixShader")
            L.new(pb.inputs["Alpha"].links[0].from_socket, am.inputs[0])
            L.new(N.new("ShaderNodeBsdfTransparent").outputs[0], am.inputs[1])
            L.new(c_out, am.inputs[2])
            c_out = am.outputs[0]
        L.new(c_out, mix.inputs[1])
        L.new(src, mix.inputs[2])
        # a warm line where the wave passes
        ed = N.new("ShaderNodeEmission")
        ed.inputs["Color"].default_value = (1.0, 0.62, 0.32, 1)
        L.new(K.math_node(N, L, "MULTIPLY", g.outputs["edge"], float(OPTS.get("edge", 1.5))), ed.inputs["Strength"])
        add = N.new("ShaderNodeAddShader")
        L.new(mix.outputs[0], add.inputs[0])
        L.new(ed.outputs[0], add.inputs[1])
        L.new(add.outputs[0], out.inputs["Surface"])
        m["wrapped"] = True
        return
    L.new(mix.outputs[0], out.inputs["Surface"])
    m["wrapped"] = True


for m in list(bpy.data.materials):
    wrap(m)
wave_keys()
print("materials wrapped")

# ---------------------------------------------------------------- world: a bright studio while it is built, blue hour once it is alive
WN, WL = scene.world.node_tree.nodes, scene.world.node_tree.links
bg = WN["Background"]
sky_src = bg.inputs["Color"].links[0].from_socket
wmix = WN.new("ShaderNodeMix")
wmix.data_type = "RGBA"
WL.new(sky_src, K.sock(wmix, "B_Color"))
K.sock(wmix, "A_Color").default_value = (0.78, 0.79, 0.82, 1)
WL.new(K.sock(wmix, "Result_Color", out=True), bg.inputs["Color"])
sky_strength = bg.inputs["Strength"].default_value
SUN = K.light("studio_sun", "SUN", (0, 0, 30), 3.2, (1.0, 0.96, 0.9), size=0.0)
SUN.data.angle = math.radians(4)
SUN.rotation_euler = (math.radians(38), 0, math.radians(-35))
K.PARTS.pop()


DAY_SUN = G.get("DAY_SUN")
DAY_E = DAY_SUN.data.energy if DAY_SUN else 0.0


def key_world():
    if DAY_SUN:  # the day's sun rises with the wave (off while the house is built on the desk)
        for f in (1, F(T_WAVE), F(T_WAVE + 0.8), F(T_WAVE + 1.8), NF):
            DAY_SUN.data.energy = DAY_E * smoother((T(f) - T_WAVE) / 1.8)
            DAY_SUN.data.keyframe_insert("energy", frame=f)
    for f in (1, F(T_WAVE + 0.2), F(T_WAVE + 2.4), NF):
        t = T(f)
        k = smoother((t - (T_WAVE + 0.2)) / 2.2)
        wmix.inputs[0].default_value = k
        wmix.inputs[0].keyframe_insert("default_value", frame=f)
        bg.inputs["Strength"].default_value = 1.0 + (sky_strength - 1.0) * k
        bg.inputs["Strength"].keyframe_insert("default_value", frame=f)
        SUN.data.energy = 3.2 * (1 - smoother((t - T_WAVE) / 1.6))
        SUN.data.keyframe_insert("energy", frame=f)
    for f in range(1, NF + 1, 3):
        t = T(f)
        k = smoother((t - (T_WAVE + 0.2)) / 2.2)
        scene.view_settings.exposure = float(OPTS.get('build_ev', -0.66)) * (1 - k) + EV_LATE(t) * k
        scene.view_settings.keyframe_insert("exposure", frame=f)


def EV_LATE(t):
    """the hero view's exposure outside, the tatami's once inside"""
    k = smoother((t - (T_IN - 0.8)) / 1.4)
    return G["SHOT"]["aerial"]["ev"] * (1 - k) + G["SHOT"]["tatami"]["ev"] * k


# ---------------------------------------------------------------- the camera
HERO_L, HERO_T = Vector(G["SHOT"]["aerial"]["loc"]), Vector(G["SHOT"]["aerial"]["target"])
HERO_LENS = G["SHOT"]["aerial"]["lens"]
TAT_L, TAT_T = Vector(G["SHOT"]["tatami"]["loc"]), Vector(G["SHOT"]["tatami"]["target"])
TAT_LENS = G["SHOT"]["tatami"]["lens"]
LENS0 = 200.0
H0 = (X1 - X0) / 2 * LENS0 / 18.0  # the photo's width fills the frame
h_off = HERO_L - HERO_T
HERO_AZ = math.degrees(math.atan2(h_off.y, h_off.x)) % 360
HERO_D = h_off.length
HERO_EL = math.degrees(math.asin(h_off.z / HERO_D))
def pchip(keys, t):
    """monotone cubic through the keys: no overshoot, flat at both ends"""
    ts = [k[0] for k in keys]
    vs = [k[1] for k in keys]
    if t <= ts[0]:
        return vs[0]
    if t >= ts[-1]:
        return vs[-1]
    n = len(ts)
    d = [(vs[j + 1] - vs[j]) / (ts[j + 1] - ts[j]) for j in range(n - 1)]
    m = [0.0] * n
    for j in range(1, n - 1):
        if d[j - 1] * d[j] > 0:
            w1 = 2 * (ts[j + 1] - ts[j]) + (ts[j] - ts[j - 1])
            w2 = (ts[j + 1] - ts[j]) + 2 * (ts[j] - ts[j - 1])
            m[j] = (w1 + w2) / (w1 / d[j - 1] + w2 / d[j])
    i = max(j for j in range(n - 1) if ts[j] <= t)
    h = ts[i + 1] - ts[i]
    s = (t - ts[i]) / h
    h00, h10, h01, h11 = 2 * s ** 3 - 3 * s ** 2 + 1, s ** 3 - 2 * s ** 2 + s, -2 * s ** 3 + 3 * s ** 2, s ** 3 - s ** 2
    return h00 * vs[i] + h10 * h * m[i] + h01 * vs[i + 1] + h11 * h * m[i + 1]


HERO_AZ = HERO_AZ if HERO_AZ > 90 else HERO_AZ + 360
ORB = {
    "az": [(T_HOLD + 0.5, -90.0), (T_DESC, 10.0), (7.5, 100.0), (10.5, 165.0), (T_ORBIT, HERO_AZ)],
    "el": [(T_HOLD + 0.3, 90.0), (T_DESC, 50.0), (7.0, 50.0), (10.5, 38.0), (T_ORBIT, HERO_EL)],
    "logd": [(T_HOLD, math.log(H0)), (T_DESC, math.log(27.0)), (7.5, math.log(23.0)), (10.5, math.log(23.0)), (T_ORBIT, math.log(HERO_D))],
    "loglens": [(T_HOLD, math.log(LENS0)), (T_DESC, math.log(27.0)), (7.5, math.log(24.0)), (T_ORBIT, math.log(HERO_LENS))],
}


def orbit(t):
    if t <= T_DESC:
        tgt = PHOTO_C.lerp(CEN, smoother((t - T_HOLD) / (T_DESC - T_HOLD)))
    else:
        tgt = CEN.lerp(HERO_T, smoother((t - T_DESC) / (T_ORBIT - T_DESC)))
    d, lens = math.exp(pchip(ORB["logd"], t)), math.exp(pchip(ORB["loglens"], t))
    el, az = pchip(ORB["el"], t), pchip(ORB["az"], t)
    if el > 89.95:
        return Vector((tgt.x, tgt.y, tgt.z + d)), Quaternion((1, 0, 0, 0)), lens
    a, e = math.radians(az), math.radians(el)
    loc = tgt + Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e))) * d
    # the up hint swings from north (the photo's top) to the zenith as the view tilts
    up = Vector((0, 1, 0)).lerp(Vector((0, 0, 1)), smoother(clamp((90.0 - el) / 25.0)))
    return loc, look(loc, tgt, up), lens


def catmull(pts, n=40):
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


def ease_io(x, a=0.3, b=0.35):
    x = clamp(x)
    vmax = 1 / (1 - a / 2 - b / 2)
    if x < a:
        return vmax * x * x / (2 * a)
    if x < 1 - b:
        return vmax * (a / 2 + (x - a))
    y = 1 - x
    return 1 - vmax * y * y / (2 * b)


# the hold drifts in a little while the wave runs; the dive goes over the south roof, down the east side of the court
# past the basin, and swings in through the open glass of the tatami room
DRIFT_L = HERO_L + (HERO_T - HERO_L).normalized() * 2.2
DIVE = Path([DRIFT_L, (4.6, 0.2, 6.2), (8.4, 3.6, 3.9), (9.0, 6.3, 1.9), (8.85, 8.4, 1.42), (8.2, 9.75, 1.3), (7.35, 10.5, 1.24), (7.05, 11.0, 1.22)])
INSIDE = Path([(7.05, 11.0, 1.22), (7.02, 12.3, 1.2), TAT_L])


def dive_view(t):
    x = (t - T_DIVE) / (T_IN - T_DIVE)
    s_ = ease_io(x, 0.35, 0.2) * DIVE.L
    loc = DIVE.at(s_)
    ahead = DIVE.at(s_ + 3.5) if s_ + 3.5 <= DIVE.L else DIVE.at(DIVE.L) + Vector((0, 1, 0)) * (s_ + 3.5 - DIVE.L)
    ahead.z -= 0.25
    kk = smoother(x / 0.35)
    tgt = HERO_T.lerp(ahead, kk)
    lens = HERO_LENS + (17.0 - HERO_LENS) * smoother(x * 1.4)
    roll = math.radians(5.0) * math.sin(math.pi * clamp((x - 0.35) / 0.5))  # banks as it turns in to the glass
    return loc, tgt, lens, roll


def place_at(t):
    """where the camera is: down the dive path, then on to the seat at the back"""
    if t <= T_IN:
        return dive_view(t)[0]
    x = clamp((t - T_IN) / (T_TURN_END - T_IN))
    return INSIDE.at(ease_io(x, 0.3, 0.45) * INSIDE.L)


_l0, _t0, _, _ = dive_view(T_TURN0)
_d0 = _t0 - _l0
YAW0 = math.atan2(_d0.y, _d0.x)
PITCH0 = _d0.z / max(0.1, Vector((_d0.x, _d0.y)).length)
_e = TAT_T - TAT_L
YAW1 = math.atan2(_e.y, _e.x)
while YAW1 > YAW0:  # clockwise: past the lantern and the east closet's lit shoji, round to the garden
    YAW1 -= 2 * math.pi
PITCH1 = _e.z / max(0.1, Vector((_e.x, _e.y)).length)


def cam_at(t):
    if t <= T_ORBIT:
        return orbit(t)
    if t <= T_DIVE:
        k = smoother((t - T_ORBIT) / (T_DIVE - T_ORBIT))
        loc = HERO_L.lerp(DRIFT_L, k)
        return loc, look(loc, HERO_T), HERO_LENS
    if t <= T_TURN0:
        loc, tgt, lens, roll = dive_view(t)
        return loc, look(loc, tgt, roll=roll), lens
    loc = place_at(t)
    k = smoother((t - T_TURN0) / (T_TURN1 - T_TURN0))
    yw = YAW0 + (YAW1 - YAW0) * k
    pitch = PITCH0 + (PITCH1 - PITCH0) * k
    tgt = loc + Vector((math.cos(yw), math.sin(yw), pitch)) * 3.0
    _, _, lens0, roll0 = dive_view(min(t, T_IN))
    lens = lens0 + (TAT_LENS - lens0) * k if t <= T_IN else 17.0 + (TAT_LENS - 17.0) * k
    return loc, look(loc, tgt, roll=roll0 * (1 - k) if t <= T_IN else 0.0), lens


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
print(f"camera: photo height {H0:.1f} m, dive {DIVE.L:.1f} m, hero az {HERO_AZ:.0f}")

# ---------------------------------------------------------------- the build
rng = random.Random(24)
PARTS = [(o, st) for o, st in K.PARTS if o.type != "LIGHT" and o.name in bpy.data.objects]
# bake the bevels into the meshes: with a modifier on, Cycles treats a flying part as deforming and stores every
# vertex per motion-blur step, which runs the 8 GB card out of memory
t_bake = time.time()
dg = bpy.context.evaluated_depsgraph_get()
n_baked = 0
for o, st in PARTS:
    if o.type == "MESH" and o.modifiers:
        me_new = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
        old = o.data
        o.modifiers.clear()
        o.data = me_new
        if old.users == 0:
            bpy.data.meshes.remove(old)
        n_baked += 1
print(f"baked {n_baked} bevels in {time.time() - t_bake:.1f} s")
for o, st in PARTS:
    o["rest"] = tuple(o.location)
    o["tint"] = COLORS.get(st, COLORS["misc"])
    o["flash"] = 0.0
groups = {}
for o, st in PARTS:
    groups.setdefault(st, []).append(o)
print({k: len(v) for k, v in groups.items()})


def ang(o):
    return math.atan2(o.location.y - 7.0, o.location.x - 7.0)


def order_key(st):
    if st == "foundation":
        return lambda o: ang(o) + rng.uniform(-0.3, 0.3)
    if st in ("frame", "roof_frame"):
        return lambda o: o.location.z * 0.9 + (ang(o) + math.pi) * 0.35 + rng.uniform(-0.25, 0.25)
    if st in ("roof", "engawa"):
        return lambda o: (ang(o) + math.pi) + rng.uniform(-0.25, 0.25)
    if st == "walls":
        return lambda o: o.location.z * 0.7 + (ang(o) + math.pi) * 0.3 + rng.uniform(-0.3, 0.3)
    if st == "floor":
        return lambda o: (Vector((o.location.x, o.location.y)) - Vector((0.0, 0.0))).length + rng.uniform(-1.2, 1.2)
    if st == "shoji":
        # panel by panel: everything within 0.5 m together, its strips in quick order
        return lambda o: (round(o.location.x * 2) / 2, round(o.location.y * 2) / 2, o.location.z)
    return lambda o: o.location.x + o.location.y + rng.uniform(-2.0, 2.0)


def offset_for(st, o):
    if st == "foundation":
        return Vector((0, 0, -2.5)) + Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), 0)) * 0.6, 0.15
    if st in ("frame", "roof_frame", "roof", "floor", "engawa", "ceiling", "furniture", "garden", "lights"):
        h = rng.uniform(6, 11) if st != "roof" else rng.uniform(5, 9)
        side = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), 0)) * rng.uniform(0.5, 2.5)
        return Vector((0, 0, h)) + side, (0.25 if st in ("furniture", "garden") else 0.08)
    if st == "walls":
        r = Vector((o.location.x - 7.0, o.location.y - 7.0, 0))
        r = r.normalized() if r.length > 0.1 else Vector((1, 0, 0))
        return r * rng.uniform(5, 10) + Vector((0, 0, rng.uniform(2, 5))), 0.12
    if st == "shoji":
        r = Vector((7.0 - o.location.x, 7.0 - o.location.y, 0))
        r = r.normalized() if r.length > 0.1 else Vector((1, 0, 0))
        return -r * rng.uniform(1.5, 3.5) + Vector((0, 0, rng.uniform(1.5, 3.0))), 0.05
    return Vector((0, 0, 8)), 0.1


def back(u, s=1.2):
    return 1 + (s + 1) * (u - 1) ** 3 + s * (u - 1) ** 2


def pop(o, t0, dur, base=None):
    """scale up from nothing at its base (trees grow, stones appear)"""
    rest_l, rest_s = o.location.copy(), o.scale.copy()
    b = Vector(base) if base is not None else rest_l
    off = rest_l - b
    o.scale = (0, 0, 0)
    o.location = b
    o.keyframe_insert("scale", frame=max(1, F(t0) - 1))
    o.keyframe_insert("location", frame=max(1, F(t0) - 1))
    for f in range(F(t0), F(t0 + dur) + 1):
        k = back(clamp((T(f) - t0) / dur), 0.9)
        o.scale = (rest_s.x * k, rest_s.y * k, rest_s.z * k)
        o.location = b + off * k
        o.keyframe_insert("scale", frame=f)
        o.keyframe_insert("location", frame=f)
    o.location, o.scale = rest_l, rest_s


def key_flash(o, t_land):
    o["flash"] = 0.0
    o.keyframe_insert('["flash"]', frame=1)
    o["flash"] = 1.0
    o.keyframe_insert('["flash"]', frame=max(2, F(t_land - 0.25)))
    o.keyframe_insert('["flash"]', frame=F(t_land + 0.05))
    o["flash"] = 0.0
    o.keyframe_insert('["flash"]', frame=F(t_land + 0.75))


events = []
t_key = time.time()
for st, objs in groups.items():
    if st == "site" or st not in WINDOWS:
        continue
    a, b = WINDOWS[st]
    flyers = [o for o in objs if o.type == "MESH" and o.name.split(".")[0] not in ("moss",)]
    growers = [o for o in objs if o not in flyers]
    flyers.sort(key=order_key(st))
    n = len(flyers)
    for i, o in enumerate(flyers):
        ts = a + (b - a) * i / max(1, n - 1) + rng.uniform(-0.05, 0.05)
        small = max(o.dimensions) < 0.4
        dur = (0.45 if small else 0.7) + rng.random() * 0.25
        off, tumble = offset_for(st, o)
        rest_l, rest_r, rest_s = o.location.copy(), o.rotation_euler.copy(), o.scale.copy()
        land = ts + dur
        axis = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        spin = axis * tumble * rng.uniform(1.0, 6.0)
        f0, f1 = F(ts), F(land)
        o.scale = (0, 0, 0)
        o.location = rest_l + off
        o.keyframe_insert("scale", frame=max(1, f0 - 1))
        o.keyframe_insert("location", frame=max(1, f0 - 1))
        for f in range(f0, f1 + 1):
            u = clamp((T(f) - ts) / dur)
            w = 1 - back(u, 0.9)
            o.location = rest_l + off * w
            o.rotation_euler = (rest_r.x + spin.x * w, rest_r.y + spin.y * w, rest_r.z + spin.z * w)
            k = 0.4 + 0.6 * clamp(u * 3)
            o.scale = (rest_s.x * k, rest_s.y * k, rest_s.z * k)
            o.keyframe_insert("location", frame=f)
            o.keyframe_insert("rotation_euler", frame=f)
            o.keyframe_insert("scale", frame=f)
        o.location, o.rotation_euler, o.scale = rest_l, rest_r, rest_s
        key_flash(o, land)
        events.append({"t": round(land, 3), "launch": round(ts, 3), "stage": st, "name": o.name.split(".")[0], "size": round(max(o.dimensions), 3)})
    for j, o in enumerate(growers):
        t0 = a + (b - a) * (j + 0.5) / max(1, len(growers)) + rng.uniform(-0.1, 0.1)
        if o.name.startswith("tree_small_02"):
            t0, dur = 10.9 + 0.3 * j, 1.3
        else:
            dur = 0.7
        if o.type == "MESH":  # the moss: rises from the gravel
            rest_l, rest_s = o.location.copy(), o.scale.copy()
            for f in range(max(1, F(t0) - 1), F(t0 + dur) + 1):
                k = smoother((T(f) - t0) / dur)
                o.scale = (rest_s.x, rest_s.y, max(1e-3, k))
                o.keyframe_insert("scale", frame=f)
            o.scale = rest_s
        else:
            pop(o, t0, dur, o.get("base"))
        events.append({"t": round(t0 + dur * 0.6, 3), "launch": round(t0, 3), "stage": st, "name": o.name.split(".")[0], "size": 1.0})
print(f"keyed {len(events)} parts in {time.time() - t_key:.1f} s")

# the site's trees, rocks, stones and grass grow as the wave reaches them
n_site = 0
for o in groups.get("site", []):
    if o.type == "EMPTY":
        b = Vector(o.get("base", tuple(o.location)))
        t0 = reach((b - MAPLE).length) + rng.uniform(0.0, 0.25)
        pop(o, t0, 0.9 if "tree" in o.name or "pine" in o.name else 0.5, b)
        n_site += 1
    elif o.name.startswith("tobiishi"):
        t0 = reach((o.location - MAPLE).length)
        pop(o, t0, 0.4, (o.location.x, o.location.y, o.location.z - 0.2))
        n_site += 1
print(f"site pieces timed to the wave: {n_site}")

# ---------------------------------------------------------------- lights: off while it is built, on just behind the wave
LIGHTS = [o for o, st in K.PARTS if o.type == "LIGHT" and o is not SUN and o.name in bpy.data.objects]
light_on = []
for o in LIGHTS:
    d = (o.location - MAPLE).length
    t_on = max(T_LIGHTS, reach(d) + 0.15) + rng.uniform(0.0, 0.3)
    if o.name.startswith("room_"):
        t_on = T_LIGHTS + 0.2 + 0.12 * list(G["ROOMS"]).index(o.name[5:].split(".")[0])
    e = o.data.energy
    o.data.energy = 0.0
    o.data.keyframe_insert("energy", frame=1)
    o.data.keyframe_insert("energy", frame=F(t_on) - 1)
    o.data.energy = e
    o.data.keyframe_insert("energy", frame=F(t_on + 0.4))
    light_on.append(round(t_on, 3))


def emission_socket(m):
    for node in m.node_tree.nodes:
        if node.type == "EMISSION" and not node.inputs["Strength"].is_linked and node.inputs["Strength"].default_value > 0.0:
            return node.inputs["Strength"]
    for node in m.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED" and node.inputs["Emission Strength"].default_value > 0.0 and not node.inputs["Emission Strength"].is_linked:
            return node.inputs["Emission Strength"]
    return None


for key in ("downlight", "lantern", "lantern_sm", "andon", "shoji", "closet_shoji"):
    sk = emission_socket(M[key])
    if sk is None:
        continue
    e = sk.default_value
    sk.default_value = 0.0
    sk.keyframe_insert("default_value", frame=1)
    sk.keyframe_insert("default_value", frame=F(T_LIGHTS + 0.1))
    sk.default_value = e
    sk.keyframe_insert("default_value", frame=F(T_LIGHTS + 0.9))
key_world()

# ---------------------------------------------------------------- timeline for the sound and the counter
STAGE_ROWS = [("foundation", ["foundation"]), ("timber frame", ["frame", "roof_frame"]), ("floors & tatami", ["floor", "engawa"]),
              ("walls & cladding", ["walls", "ceiling"]), ("shoji & glass", ["shoji"]), ("interior", ["furniture", "lights"]),
              ("roof", ["roof"]), ("garden", ["garden"])]
TL = {"duration": T_END, "fps": FPS,
      "T": {"hold": T_HOLD, "descent": T_DESC, "orbit_end": T_ORBIT, "wave": T_WAVE, "lights": T_LIGHTS, "dive": T_DIVE, "inside": T_IN, "turn_end": T_TURN_END},
      "rows": [{"label": lab, "stages": sts, "color": COLORS[sts[0]]} for lab, sts in STAGE_ROWS],
      "parts": sorted(events, key=lambda e: e["t"]),
      "lights": sorted(set(light_on))}
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
scene.render.use_motion_blur = not OPTS.get("noblur")
scene.render.motion_blur_shutter = 0.5
scene.render.use_persistent_data = True
scene.cycles.adaptive_threshold = float(OPTS.get("adaptive", 0.03))  # the denoiser cleans what this leaves
# resumable: frames already on disk are skipped, a frame being rendered leaves a placeholder (render_film.ps1 clears the
# empty ones a crash leaves behind before it starts Blender again)
scene.render.use_overwrite = bool(OPTS.get("overwrite"))
scene.render.use_placeholder = not OPTS.get("overwrite")
scene.render.filepath = os.path.join(OUTDIR, "f_")
scene.render.image_settings.file_format = "PNG"
print(f"set up in {time.time() - t_start:.1f} s; frames {scene.frame_start}-{scene.frame_end} step {scene.frame_step}", flush=True)
if OPTS.get("blend"):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "courtyard"), "film.blend"))
if OPTS.get("stills"):
    for tt in str(OPTS["stills"]).split(","):
        scene.frame_set(F(float(tt)))
        scene.render.filepath = os.path.join(OUTDIR, f"still_{float(tt):05.2f}.png")
        bpy.ops.render.render(write_still=True)
    print(f"stills in {time.time() - t_start:.1f} s")
elif not OPTS.get("no-render"):
    bpy.ops.render.render(animation=True)
    print(f"rendered in {time.time() - t_start:.1f} s")
