"""Apartment No.61 in Blender, built from the listing plan.

Walls are traced off the plan (walls.json); doors, windows, floors and furniture are read off it (plan.json).
Materials and the decor models are CC0 from Poly Haven (fetch_assets.py); sofa, beds, kitchen, wardrobes, tables
and bathroom fittings are modelled here. Daylight is a sky HDRI plus a low south-west sun through the windows.

Run:
  blender -b --factory-startup -P houses/apartment/build.py -- dollhouse living --samples 256 --res 1920x1080
Stills land in blueprint-out/apartment/render_<shot>.png; --blend also saves the scene there.
"""
import json
import math
import os
import sys
import time

import bmesh
import bpy
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = json.load(open(os.path.join(HERE, "plan.json")))
WALLS = json.load(open(os.path.join(HERE, "walls.json")))
ASSETS = json.load(open(os.path.join(os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven")), "assets.json")))
OUT = os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "apartment")
os.makedirs(OUT, exist_ok=True)

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SHOTS, OPTS = [], {}
i = 0
while i < len(argv):
    if argv[i].startswith("--"):
        if i + 1 < len(argv) and not argv[i + 1].startswith("--"):
            OPTS[argv[i][2:]] = argv[i + 1]
            i += 2
        else:
            OPTS[argv[i][2:]] = True
            i += 1
    else:
        SHOTS.append(argv[i])
        i += 1
SHOTS = SHOTS or ["dollhouse", "living"]
SAMPLES = int(OPTS.get("samples", 256))
RES = tuple(map(int, str(OPTS.get("res", "1920x1080")).split("x")))
FILM = bool(OPTS.get("film"))  # film.py: walls in blocks, floor in tiles, the plan sheet as ground, no stills

H = PLAN["height"]
DOOR = PLAN["door_head"]
WIN = PLAN["window_head"]
CX, CY = 13.2, 16.3
BALC_Z = -0.05 if FILM else -0.12
t0 = time.time()


def P(x, y):
    return Vector((x - CX, CY - y))


# ---------------------------------------------------------------- scene, GPU
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
scene = bpy.context.scene
prefs = bpy.context.preferences
cp = prefs.addons["cycles"].preferences
cp.compute_device_type = "OPTIX"
cp.get_devices()
for d in cp.devices:
    d.use = d.type == "OPTIX"
scene.render.engine = "CYCLES"
scene.cycles.device = "GPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_adaptive_sampling = True
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPTIX"
scene.cycles.max_bounces = 10
scene.cycles.diffuse_bounces = 5
scene.cycles.glossy_bounces = 4
scene.cycles.transmission_bounces = 8
scene.cycles.transparent_max_bounces = 16
scene.render.resolution_x, scene.render.resolution_y = RES
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
    try:
        scene.view_settings.look = look
        break
    except TypeError:
        pass

ROOT = scene.collection
INTERIOR = bpy.data.collections.new("interior_only")  # ceiling, pendant: off in the dollhouse
ROOT.children.link(INTERIOR)


STAGE = ["misc"]  # which build wave an object lands in (film.py reads PARTS)
PARTS = []


def link(o, coll=None):
    (coll or ROOT).objects.link(o)
    PARTS.append((o, STAGE[0]))
    return o


def inp(node, names, value):
    for n in names if isinstance(names, (list, tuple)) else [names]:
        if n in node.inputs:
            node.inputs[n].default_value = value
            return
    raise KeyError(names)


# ---------------------------------------------------------------- materials
def principled(name, color, rough=0.5, metal=0.0, emission=None, estr=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    inp(b, "Base Color", (*color, 1))
    inp(b, "Roughness", rough)
    inp(b, "Metallic", metal)
    if emission:
        inp(b, ["Emission Color", "Emission"], (*emission, 1))
        inp(b, "Emission Strength", estr)
    return m


def textured(name, tex, size, box=True, rot=0.0, value=1.0, sat=1.0, tint=None, rough=(1.0, 0.0), normal=1.0, coord="Object"):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size, 1 / size, 1 / size)
    mp.inputs["Rotation"].default_value = (0, 0, rot)
    L.new(tc.outputs[coord], mp.inputs["Vector"])
    A = ASSETS[tex]

    def img(path, color):
        n = N.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(path, check_existing=True)
        if not color:
            n.image.colorspace_settings.name = "Non-Color"
        if box:
            n.projection = "BOX"
            n.projection_blend = 0.25
        L.new(mp.outputs["Vector"], n.inputs["Vector"])
        return n

    col = img(A["diff"], True).outputs["Color"]
    if value != 1.0 or sat != 1.0:
        hs = N.new("ShaderNodeHueSaturation")
        hs.inputs["Saturation"].default_value = sat
        hs.inputs["Value"].default_value = value
        L.new(col, hs.inputs["Color"])
        col = hs.outputs["Color"]
    if tint:
        vm = N.new("ShaderNodeVectorMath")
        vm.operation = "MULTIPLY"
        vm.inputs[1].default_value = tint
        L.new(col, vm.inputs[0])
        col = vm.outputs["Vector"]
    L.new(col, b.inputs["Base Color"])
    if "rough" in A:
        ma = N.new("ShaderNodeMath")
        ma.operation = "MULTIPLY_ADD"
        ma.inputs[1].default_value = rough[0]
        ma.inputs[2].default_value = rough[1]
        L.new(img(A["rough"], False).outputs["Color"], ma.inputs[0])
        L.new(ma.outputs["Value"], b.inputs["Roughness"])
    if "nor" in A and normal > 0:
        nm = N.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal
        L.new(img(A["nor"], False).outputs["Color"], nm.inputs["Color"])
        L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def glass(name, tint=(0.95, 0.97, 0.97)):
    """Thin architectural glass: see-through with a fresnel reflection, no refraction, so the sun and the camera pass."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    N.remove(N["Principled BSDF"])
    tr = N.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (*tint, 1)
    gl = N.new("ShaderNodeBsdfGlossy")
    gl.inputs["Roughness"].default_value = 0.0
    fr = N.new("ShaderNodeFresnel")
    fr.inputs["IOR"].default_value = 1.5
    # no reflection off the inner face: Fresnel there turns into total internal reflection past 42 deg, a hard mirror disc
    geo = N.new("ShaderNodeNewGeometry")
    front = N.new("ShaderNodeMath")
    front.operation = "SUBTRACT"
    front.inputs[0].default_value = 1.0
    L.new(geo.outputs["Backfacing"], front.inputs[1])
    k = N.new("ShaderNodeMath")
    k.operation = "MULTIPLY"
    L.new(fr.outputs[0], k.inputs[0])
    L.new(front.outputs[0], k.inputs[1])
    mix = N.new("ShaderNodeMixShader")
    L.new(k.outputs[0], mix.inputs[0])
    L.new(tr.outputs[0], mix.inputs[1])
    L.new(gl.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], N["Material Output"].inputs["Surface"])
    return m


def fabric(name, color, rough=0.92, bump=0.45, size=0.35):
    """Plain upholstery: a flat colour with the boucle's normal map for the pile, and a little sheen."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    inp(b, "Base Color", (*color, 1))
    inp(b, "Roughness", rough)
    try:
        inp(b, ["Sheen Weight", "Sheen"], 0.35)
    except KeyError:
        pass
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size,) * 3
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    n = N.new("ShaderNodeTexImage")
    n.image = bpy.data.images.load(ASSETS["wool_boucle"]["nor"], check_existing=True)
    n.image.colorspace_settings.name = "Non-Color"
    n.projection = "BOX"
    n.projection_blend = 0.3
    L.new(mp.outputs["Vector"], n.inputs["Vector"])
    nm = N.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = bump
    L.new(n.outputs["Color"], nm.inputs["Color"])
    L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m

M = {
    "wall": principled("wall", (0.86, 0.855, 0.84), 0.85),
    "cap": principled("wall_cap", (0.075, 0.075, 0.08), 0.7),
    "slab": principled("slab", (0.42, 0.42, 0.41), 0.9),
    "parquet": textured("parquet", "herringbone_parquet", 3.4, box=False, value=1.12, sat=0.78, rough=(0.85, 0.05)),
    "parquet_uv": textured("parquet_uv", "herringbone_parquet", 3.4, box=False, value=1.12, sat=0.78, rough=(0.85, 0.05), coord="UV"),
    "marble": textured("marble", "marble_01", 1.5, rough=(0.6, 0.0)),
    "downlight": principled("downlight", (1.0, 0.95, 0.88), 0.3, emission=(1.0, 0.86, 0.68), estr=6.0),
    "deck": textured("deck", "wood_floor_deck", 1.8, box=False, rot=math.pi / 2, value=0.95, sat=0.45, rough=(1.0, 0.05)),
    "oak": textured("oak", "oak_veneer_01", 1.83, value=1.05, sat=0.85, rough=(0.8, 0.1)),
    "boucle": fabric("boucle", (0.74, 0.7, 0.63)),
    "upholstery": fabric("upholstery", (0.42, 0.4, 0.37)),
    "linen": textured("linen", "rough_linen", 0.27, value=1.15, sat=0.5, rough=(1.0, 0.1), normal=0.5),
    "linen_greige": textured("linen_greige", "rough_linen", 0.27, value=0.85, rough=(1.0, 0.1), normal=0.5),
    "throw": textured("throw", "rough_linen", 0.27, tint=(0.85, 0.5, 0.36), value=0.9, rough=(1.0, 0.1), normal=0.6),
    "teddy": textured("teddy", "curly_teddy_natural", 0.33, value=1.0, rough=(1.0, 0.1), normal=0.8),
    "rug": fabric("rug", (0.6, 0.57, 0.52), bump=0.8, size=0.5),
    "white": principled("white_matte", (0.83, 0.83, 0.81), 0.55),
    "sage": principled("sage_matte", (0.38, 0.43, 0.38), 0.6),
    "black": principled("black_metal", (0.025, 0.025, 0.027), 0.35, 0.8),
    "steel": principled("steel", (0.78, 0.78, 0.78), 0.22, 1.0),
    "ceramic": principled("ceramic", (0.9, 0.9, 0.89), 0.06),
    "tv": principled("tv_glass", (0.006, 0.006, 0.007), 0.12),
    "hob": principled("hob_glass", (0.01, 0.01, 0.012), 0.08),
    "mirror": principled("mirror", (0.92, 0.92, 0.92), 0.02, 1.0),
    "frame": principled("window_frame", (0.11, 0.11, 0.12), 0.45, 0.4),
    "door": principled("door_leaf", (0.88, 0.875, 0.86), 0.45),
    "entrance": principled("entrance_door", (0.16, 0.16, 0.17), 0.5, 0.3),
    "glass": glass("glass"),
    "shower_glass": glass("shower_glass", (0.9, 0.95, 0.95)),
    "art": principled("art_print", (0.62, 0.44, 0.33), 0.8),
    "art2": principled("art_print_2", (0.18, 0.22, 0.24), 0.8),
    "shade": principled("lamp_shade", (0.95, 0.92, 0.86), 0.8, emission=(1.0, 0.78, 0.52), estr=0.0),
}


# ---------------------------------------------------------------- geometry helpers (plan coordinates in, metres)
def _obj(name, bm, mats, coll=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    return link(bpy.data.objects.new(name, me), coll)


def _finish(o, bevel, seg, smooth=True):
    if bevel > 0:
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = seg
        mod.limit_method = "ANGLE"
        mod.harden_normals = True
        mod.use_clamp_overlap = True
    if smooth and bevel > 0:  # smooth shading needs the bevel's hardened normals, or flat faces bulge
        for p in o.data.polygons:
            p.use_smooth = True
    return o


def box(name, x0, x1, y0, y1, z0, z1, mat, bevel=0.004, seg=2, cap=None, coll=None):
    a, b = P(min(x0, x1), min(y0, y1)), P(max(x0, x1), max(y0, y1))
    sx, sy, sz = abs(b.x - a.x), abs(b.y - a.y), abs(z1 - z0)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    if cap is not None:
        for f in bm.faces:
            f.normal_update()
            if f.normal.z > 0.5:
                f.material_index = 1
    o = _obj(name, bm, [mat] + ([cap] if cap is not None else []), coll)
    o.location = ((a.x + b.x) / 2, (a.y + b.y) / 2, (z0 + z1) / 2)
    return _finish(o, min(bevel, 0.45 * min(sx, sy, sz)), seg)


def cyl(name, x, y, r, z0, z1, mat, verts=64, bevel=0.004, seg=2, coll=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=z1 - z0)
    o = _obj(name, bm, [mat], coll)
    p = P(x, y)
    o.location = (p.x, p.y, (z0 + z1) / 2)
    return _finish(o, min(bevel, 0.45 * min(r, z1 - z0)), seg)


def extrude_rects(name, rects, z0, z1, top, side, coll=None):
    """Rectangles welded into one region and extruded: one clean solid, top faces on material 0."""
    bm = bmesh.new()
    for r in rects:
        a, b = P(r["x0"], r["y0"]), P(r["x1"], r["y1"])
        vs = [bm.verts.new((a.x, a.y, z0)), bm.verts.new((b.x, a.y, z0)), bm.verts.new((b.x, b.y, z0)), bm.verts.new((a.x, b.y, z0))]
        bm.faces.new(vs)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.003)
    bm.normal_update()
    for f in bm.faces:
        if f.normal.z < 0:
            f.normal_flip()
    base = list(bm.faces)
    ret = bmesh.ops.extrude_face_region(bm, geom=base)
    nv = [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, z1 - z0), verts=nv)
    bm.normal_update()
    for f in bm.faces:
        if f in base:
            continue
        f.material_index = 0 if f.normal.z > 0.5 else 1
    for f in base:
        if f.is_valid:
            f.normal_flip()
            f.material_index = 1
    return _obj(name, bm, [top, side], coll)


def poly_slab(name, pts, z0, z1, top, side):
    bm = bmesh.new()
    vs = [bm.verts.new((P(x, y).x, P(x, y).y, z0)) for x, y in pts]
    f = bm.faces.new(vs)
    bm.normal_update()
    if f.normal.z < 0:
        f.normal_flip()
    ret = bmesh.ops.extrude_face_region(bm, geom=[f])
    nv = [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, z1 - z0), verts=nv)
    bm.normal_update()
    for g in bm.faces:
        g.material_index = 0 if (g.normal.z > 0.5 and abs(g.calc_center_median().z - z1) < 1e-4) else 1
    return _finish(_obj(name, bm, [top, side]), 0.01, 2)


# ---------------------------------------------------------------- Poly Haven models, imported once and instanced
_models = {}


def model_src(mid):
    if mid in _models:
        return _models[mid]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=ASSETS[mid])
    new = [o for o in bpy.data.objects if o not in before]
    coll = bpy.data.collections.new("src_" + mid)
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        coll.objects.link(o)
    pts = [o.matrix_world @ Vector(c) for o in new if o.type == "MESH" for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    _models[mid] = (coll, mn, mx)
    return _models[mid]


def place(mid, x, y, z=0.0, yaw=0.0, scale=1.0, height=None, coll=None):
    src, mn, mx = model_src(mid)
    s = height / (mx.z - mn.z) if height else scale
    e = bpy.data.objects.new(mid, None)
    e.instance_type = "COLLECTION"
    e.instance_collection = src
    R = Matrix.Rotation(math.radians(yaw), 3, "Z")
    off = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z)) * s
    p = P(x, y)
    e.location = Vector((p.x, p.y, z)) - R @ off
    e.rotation_euler = (0, 0, math.radians(yaw))
    e.scale = (s, s, s)
    return link(e, coll)


def in_balcony(x, y):
    pts = PLAN["balcony"]["poly"]
    inside = False
    j = len(pts) - 1
    for k in range(len(pts)):
        xi, yi = pts[k]
        xj, yj = pts[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = k
    return inside


# ---------------------------------------------------------------- shell: slab, walls, openings
def floor_tiles(step=1.0, z0=-0.06, z1=0.0):
    """The floor as 1 m tiles that fly in; UVs carry the resting position, so the parquet lines up once they land."""
    for r in WALLS["floor"]:
        for gx in range(math.floor(r["x0"] / step), math.ceil(r["x1"] / step)):
            for gy in range(math.floor(r["y0"] / step), math.ceil(r["y1"] / step)):
                x0, x1 = max(r["x0"], gx * step), min(r["x1"], (gx + 1) * step)
                y0, y1 = max(r["y0"], gy * step), min(r["y1"], (gy + 1) * step)
                if x1 - x0 < 0.005 or y1 - y0 < 0.005:
                    continue
                o = box("floor_tile", x0, x1, y0, y1, z0, z1, M["parquet_uv"], bevel=0.0)
                me = o.data
                uv = me.uv_layers.new(name="UVMap")
                for lp_ in me.loops:
                    v = me.vertices[lp_.vertex_index].co
                    uv.data[lp_.index].uv = (v.x + o.location.x, v.y + o.location.y)


def wall_blocks(seg=0.6, courses=6):
    """The walls as blocks about 0.6 m long, in 6 courses; the top course carries the dark cut."""
    hs = [H * k / courses for k in range(courses + 1)]
    for r in WALLS["walls"]:
        dx, dy = r["x1"] - r["x0"], r["y1"] - r["y0"]
        along_x = dx >= dy
        n = max(1, round((dx if along_x else dy) / seg))
        for k in range(n):
            if along_x:
                x0, x1, y0, y1 = r["x0"] + dx * k / n, r["x0"] + dx * (k + 1) / n, r["y0"], r["y1"]
            else:
                x0, x1, y0, y1 = r["x0"], r["x1"], r["y0"] + dy * k / n, r["y0"] + dy * (k + 1) / n
            for c in range(courses):
                o = box("wall_block", x0, x1, y0, y1, hs[c], hs[c + 1], M["wall"], bevel=0.0, cap=M["cap"] if c == courses - 1 else None)
                o["course"] = c


STAGE[0] = "floor"
if FILM:
    floor_tiles()
else:
    extrude_rects("floor", WALLS["floor"], -0.3, 0.0, M["parquet"], M["slab"])
STAGE[0] = "ceiling"
ceiling = extrude_rects("ceiling", WALLS["floor"], H, H + 0.2, M["wall"], M["wall"], INTERIOR)
STAGE[0] = "walls"
if FILM:
    wall_blocks()
else:
    extrude_rects("walls", WALLS["walls"], 0.0, H, M["cap"], M["wall"])
STAGE[0] = "floor"
for f in PLAN["floors"]:
    box("floor_" + f["name"], f["x0"], f["x1"], f["y0"], f["y1"], 0.0, 0.006, M[f["material"]], bevel=0.001)


def snap(o):
    """Fit an opening to the wall gap it sits in: its ends to the wall ends, its band to the wall's thickness."""
    ax = o.get("axis") or ("x" if o["x1"] - o["x0"] >= o["y1"] - o["y0"] else "y")
    lo, hi = ("x0", "x1") if ax == "x" else ("y0", "y1")
    b0, b1 = ("y0", "y1") if ax == "x" else ("x0", "x1")
    left, right, bands = [], [], []
    for w in WALLS["walls"]:
        ov = min(w[b1], o[b1]) - max(w[b0], o[b0])
        if ov < 0.5 * (o[b1] - o[b0]) or w[b1] - w[b0] > 0.75:
            continue
        if abs(w[hi] - o[lo]) < 0.2:
            left.append(w)
        if abs(w[lo] - o[hi]) < 0.2:
            right.append(w)
    r = dict(o, axis=ax)
    if left:
        r[lo] = max(w[hi] for w in left)
    if right:
        r[hi] = min(w[lo] for w in right)
    for w in left + right:
        bands.append((w[b0], w[b1]))
    if bands:
        bands.sort(key=lambda t: t[1] - t[0])
        r[b0], r[b1] = bands[len(bands) // 2]
    return r


def frame_member(ax, a0, a1, c, z0, z1, d=0.06, depth=0.07):
    """A window frame bar: along the wall from a0 to a1 at band centre c, from z0 to z1."""
    if ax == "x":
        return box("frame", a0, a1, c - depth / 2, c + depth / 2, z0, z1, M["frame"], bevel=0.003)
    return box("frame", c - depth / 2, c + depth / 2, a0, a1, z0, z1, M["frame"], bevel=0.003)


STAGE[0] = "openings"
for o in map(snap, PLAN["openings"]):
    x0, x1, y0, y1, ax = o["x0"], o["x1"], o["y0"], o["y1"], o["axis"]
    kind = o["kind"]
    head = DOOR if kind in ("door", "entrance") else WIN
    box("lintel", x0, x1, y0, y1, head, H, M["wall"], bevel=0.002, cap=M["cap"])
    if kind == "entrance":
        cyc = (y0 + y1) / 2
        box("entrance_door", x0 + 0.02, x1 - 0.02, cyc - 0.03, cyc + 0.03, 0.0, head - 0.01, M["entrance"], bevel=0.004)
        continue
    if kind == "door":
        lf = o.get("leaf")
        if lf:
            (hx, hy), (tx, ty) = lf["hinge"], lf["to"]
            if abs(tx - hx) > abs(ty - hy):
                box("door_leaf", min(hx, tx), max(hx, tx), hy - 0.02, hy + 0.02, 0.01, head - 0.01, M["door"], bevel=0.004)
            else:
                box("door_leaf", hx - 0.02, hx + 0.02, min(hy, ty), max(hy, ty), 0.01, head - 0.01, M["door"], bevel=0.004)
        continue
    sill = o.get("sill", 0.0)
    if sill > 0:
        box("sill", x0, x1, y0, y1, 0.0, sill, M["wall"], bevel=0.002, cap=M["marble"])
    a0, a1 = (x0, x1) if ax == "x" else (y0, y1)
    c = (y0 + y1) / 2 if ax == "x" else (x0 + x1) / 2
    zb = max(sill, 0.0)
    spans = [(a0, a1)]
    if o.get("door"):  # the balcony slider stands open, parked inside the fixed pane beside it
        d0, d1 = o["door"]
        spans = [(a0, d0), (d1, a1), (d0 - (d1 - d0) + 0.06, d0 + 0.06, -0.055)]
    for sp_ in spans:
        g0, g1 = sp_[0], sp_[1]
        cc = c + (sp_[2] if len(sp_) > 2 else 0.0)
        if ax == "x":
            box("glass", g0, g1, cc - 0.006, cc + 0.006, zb, head, M["glass"], bevel=0.0)
        else:
            box("glass", cc - 0.006, cc + 0.006, g0, g1, zb, head, M["glass"], bevel=0.0)
        if len(sp_) > 2:
            for e_ in (g0, g1):
                frame_member(ax, e_ - 0.025, e_ + 0.025, cc, zb, head, depth=0.04)
    frame_member(ax, a0, a1, c, zb, zb + 0.06)
    frame_member(ax, a0, a1, c, head - 0.06, head)
    cuts = [a0, a1] + list(o.get("door", []))
    n = max(1, round((a1 - a0) / 1.3))
    cuts += [a0 + (a1 - a0) * k / n for k in range(1, n) if all(abs(a0 + (a1 - a0) * k / n - dd) > 0.3 for dd in o.get("door", []))]
    for cc in sorted(set(round(v, 3) for v in cuts)):
        frame_member(ax, cc - 0.03 if cc > a0 else cc, cc + 0.03 if cc < a1 else cc, c, zb, head)

# ---------------------------------------------------------------- balcony: a step down, deck, glass rail
STAGE[0] = "balcony"
B = PLAN["balcony"]
poly_slab("balcony", B["poly"], BALC_Z - 0.25, BALC_Z, M["deck"], M["slab"])
rail = B["rail"]
for (ax0, ay0), (ax1, ay1) in zip(rail, rail[1:]):
    if abs(ax1 - ax0) > abs(ay1 - ay0):
        yy = ay0 + (0.04 if ay0 < 18 else -0.04)
        box("rail_glass", min(ax0, ax1), max(ax0, ax1), yy - 0.008, yy + 0.008, BALC_Z, BALC_Z + 1.0, M["glass"], bevel=0.0)
        box("rail_top", min(ax0, ax1), max(ax0, ax1), yy - 0.025, yy + 0.025, BALC_Z + 1.0, BALC_Z + 1.04, M["black"], bevel=0.004)
    else:
        xx = ax0 + (0.04 if ax0 < 8 else -0.04)
        box("rail_glass", xx - 0.008, xx + 0.008, min(ay0, ay1), max(ay0, ay1), BALC_Z, BALC_Z + 1.0, M["glass"], bevel=0.0)
        box("rail_top", xx - 0.025, xx + 0.025, min(ay0, ay1), max(ay0, ay1), BALC_Z + 1.0, BALC_Z + 1.04, M["black"], bevel=0.004)

# ---------------------------------------------------------------- kitchen
STAGE[0] = "builtin"
K = PLAN["kitchen"]
kx0, kx1, ky0, ky1 = K["run"]
fx0, fx1 = K["fridge"]
box("fridge_column", fx0, fx1, ky0, ky1, 0.0, 2.3, M["oak"], bevel=0.004)
box("plinth", fx1, kx1, ky0, ky1 - 0.06, 0.0, 0.1, M["black"], bevel=0.002)
box("base_units", fx1, kx1, ky0, ky1 - 0.03, 0.1, 0.86, M["sage"], bevel=0.004)
for k in range(1, int((kx1 - fx1) / 0.6) + 1):
    xx = fx1 + k * (kx1 - fx1) / (int((kx1 - fx1) / 0.6) + 1)
    box("unit_seam", xx - 0.002, xx + 0.002, ky1 - 0.032, ky1 - 0.028, 0.12, 0.84, M["black"], bevel=0.0)
box("worktop", fx1, kx1, ky0, ky1, 0.86, 0.9, M["marble"], bevel=0.004)
box("splashback", fx1, kx1, ky0, ky0 + 0.02, 0.9, 1.48, M["marble"], bevel=0.002)
box("wall_units", fx1, kx1, ky0, ky0 + 0.35, 1.48, 2.3, M["white"], bevel=0.004)
box("wall_units_shelf", fx1, kx1, ky0, ky0 + 0.36, 1.47, 1.49, M["oak"], bevel=0.002)
sx = K["sink"]
box("sink", sx - 0.25, sx + 0.25, ky0 + 0.12, ky0 + 0.52, 0.86, 0.905, M["steel"], bevel=0.01)
box("sink_bowl", sx - 0.22, sx + 0.22, ky0 + 0.15, ky0 + 0.49, 0.75, 0.906, M["black"], bevel=0.0)
cyl("tap", sx, ky0 + 0.08, 0.018, 0.9, 1.22, M["black"])
box("tap_spout", sx - 0.012, sx + 0.012, ky0 + 0.08, ky0 + 0.3, 1.2, 1.225, M["black"], bevel=0.005)
hx = K["hob"]
box("hob", hx - 0.3, hx + 0.3, ky0 + 0.08, ky0 + 0.6, 0.9, 0.906, M["hob"], bevel=0.002)


# ---------------------------------------------------------------- furniture
DIRS = {"+x": Vector((1, 0)), "-x": Vector((-1, 0)), "+y": Vector((0, 1)), "-y": Vector((0, -1))}


def local_box(name, at, d, lx0, lx1, ly0, ly1, z0, z1, mat, **kw):
    """A box in a frame that faces d (plan vector): lx forward, ly sideways."""
    p = Vector((-d.y, d.x))
    cs = [Vector(at) + d * lx + p * ly for lx in (lx0, lx1) for ly in (ly0, ly1)]
    return box(name, min(c.x for c in cs), max(c.x for c in cs), min(c.y for c in cs), max(c.y for c in cs), z0, z1, mat, **kw)


def rect_frame(f):
    """Centre, facing vector, depth (along facing) and length (across) of a rect that faces f['face']."""
    d = DIRS[f["face"]]
    c = Vector(((f["x0"] + f["x1"]) / 2, (f["y0"] + f["y1"]) / 2))
    w, h = f["x1"] - f["x0"], f["y1"] - f["y0"]
    return c, d, (w if d.x else h), (h if d.x else w)


def chair(f):
    at, d = f["at"], DIRS[f["face"]]
    for sx_ in (-1, 1):
        for sy_ in (-1, 1):
            local_box("chair_leg", at, d, sx_ * 0.18 - 0.017, sx_ * 0.18 + 0.017, sy_ * 0.19 - 0.017, sy_ * 0.19 + 0.017, 0.0, 0.43, M["oak"], bevel=0.006)
    local_box("chair_seat", at, d, -0.22, 0.22, -0.225, 0.225, 0.42, 0.49, M["boucle"], bevel=0.025, seg=4)
    for sy_ in (-1, 1):
        local_box("chair_post", at, d, -0.235, -0.2, sy_ * 0.19 - 0.017, sy_ * 0.19 + 0.017, 0.43, 0.84, M["oak"], bevel=0.006)
    local_box("chair_back", at, d, -0.245, -0.205, -0.21, 0.21, 0.62, 0.84, M["oak"], bevel=0.012, seg=3)


def sofa(f):
    c, d, D, Lg = rect_frame(f)
    at = (c.x, c.y)
    fr, bk = D / 2, -D / 2
    for sx_ in (bk + 0.06, fr - 0.06):
        for sy_ in (-Lg / 2 + 0.08, Lg / 2 - 0.08):
            local_box("sofa_foot", at, d, sx_ - 0.025, sx_ + 0.025, sy_ - 0.025, sy_ + 0.025, 0.0, 0.08, M["black"], bevel=0.004)
    local_box("sofa_base", at, d, bk, fr, -Lg / 2, Lg / 2, 0.08, 0.36, M["boucle"], bevel=0.035, seg=4)
    local_box("sofa_back", at, d, bk, bk + 0.2, -Lg / 2, Lg / 2, 0.36, 0.76, M["boucle"], bevel=0.06, seg=5)
    for s_ in (-1, 1):
        local_box("sofa_arm", at, d, bk, fr, s_ * Lg / 2 - (0.2 if s_ > 0 else 0), s_ * Lg / 2 + (0.2 if s_ < 0 else 0), 0.36, 0.6, M["boucle"], bevel=0.06, seg=5)
    inner0, inner1 = -Lg / 2 + 0.2, Lg / 2 - 0.2
    n = 2
    for k in range(n):
        a0 = inner0 + (inner1 - inner0) * k / n + 0.008
        a1 = inner0 + (inner1 - inner0) * (k + 1) / n - 0.008
        local_box("sofa_seat", at, d, bk + 0.2, fr - 0.01, a0, a1, 0.36, 0.52, M["boucle"], bevel=0.07, seg=6)
        local_box("sofa_cushion", at, d, bk + 0.18, bk + 0.42, a0, a1, 0.5, 0.88, M["boucle"], bevel=0.09, seg=6)
    for a0, mat in ((inner0 + 0.06, M["throw"]), (inner1 - 0.5, M["linen_greige"])):
        local_box("sofa_pillow", at, d, bk + 0.38, bk + 0.52, a0, a0 + 0.44, 0.52, 0.94, mat, bevel=0.06, seg=5)


def bed(f):
    head = f["head"]
    d = DIRS[head]  # points at the headboard
    c = Vector(((f["x0"] + f["x1"]) / 2, (f["y0"] + f["y1"]) / 2))
    Lb = (f["x1"] - f["x0"]) if d.x else (f["y1"] - f["y0"])
    Wb = (f["y1"] - f["y0"]) if d.x else (f["x1"] - f["x0"])
    at = (c.x, c.y)
    hd, ft = Lb / 2, -Lb / 2
    local_box("bed_frame", at, d, ft, hd - 0.08, -Wb / 2, Wb / 2, 0.08, 0.34, M["upholstery"], bevel=0.03, seg=4)
    local_box("bed_plinth", at, d, ft + 0.08, hd - 0.16, -Wb / 2 + 0.08, Wb / 2 - 0.08, 0.0, 0.09, M["black"], bevel=0.004)
    local_box("headboard", at, d, hd - 0.1, hd, -Wb / 2 - 0.04, Wb / 2 + 0.04, 0.08, 1.15, M["upholstery"], bevel=0.05, seg=5)
    local_box("mattress", at, d, ft + 0.03, hd - 0.12, -Wb / 2 + 0.03, Wb / 2 - 0.03, 0.34, 0.58, M["linen"], bevel=0.05, seg=5)
    local_box("duvet", at, d, ft - 0.02, hd - 0.68, -Wb / 2 - 0.02, Wb / 2 + 0.02, 0.3, 0.64, M["linen"], bevel=0.06, seg=6)
    local_box("duvet_fold", at, d, hd - 0.82, hd - 0.62, -Wb / 2 - 0.02, Wb / 2 + 0.02, 0.6, 0.67, M["linen"], bevel=0.035, seg=5)
    local_box("throw", at, d, ft + 0.12, ft + 0.62, -Wb / 2 - 0.035, Wb / 2 + 0.035, 0.62, 0.66, M["throw"], bevel=0.02, seg=4)
    gap = 0.04
    pw = (Wb - 0.16 - gap) / 2
    for s_ in (-1, 1):
        a0 = (gap / 2) if s_ > 0 else -(gap / 2) - pw
        local_box("pillow", at, d, hd - 0.58, hd - 0.14, a0, a0 + pw, 0.58, 0.76, M["linen"], bevel=0.07, seg=6)
    local_box("pillow_front", at, d, hd - 0.66, hd - 0.46, -0.32, 0.32, 0.58, 0.9, M["linen_greige"], bevel=0.07, seg=6)


def nightstand(f, interior=False):
    x, y = f["at"]
    box("nightstand", x - 0.22, x + 0.22, y - 0.2, y + 0.2, 0.16, 0.52, M["oak"], bevel=0.006)
    box("nightstand_seam", x - 0.2, x + 0.2, y - 0.205, y + 0.205, 0.34, 0.343, M["black"], bevel=0.0)
    cyl("lamp_base", x, y, 0.07, 0.52, 0.7, M["ceramic"], bevel=0.02, seg=4)
    cyl("lamp_shade", x, y, 0.15, 0.68, 0.9, M["shade"], bevel=0.004)


def wardrobe(f):
    box("wardrobe", f["x0"], f["x1"], f["y0"], f["y1"], 0.0, 2.4, M["white"], bevel=0.004)
    long_x = f["x1"] - f["x0"] >= f["y1"] - f["y0"]
    a0, a1 = (f["x0"], f["x1"]) if long_x else (f["y0"], f["y1"])
    n = max(1, round((a1 - a0) / 0.5))
    for k in range(1, n):
        a = a0 + (a1 - a0) * k / n
        if long_x:
            box("wardrobe_seam", a - 0.002, a + 0.002, f["y0"] - 0.002, f["y1"] + 0.002, 0.02, 2.38, M["black"], bevel=0.0)
        else:
            box("wardrobe_seam", f["x0"] - 0.002, f["x1"] + 0.002, a - 0.002, a + 0.002, 0.02, 2.38, M["black"], bevel=0.0)


def tv_console(f):
    c, d, D, Lg = rect_frame(f)
    at = (c.x, c.y)
    local_box("tv_console", at, d, -D / 2, D / 2, -Lg / 2, Lg / 2, 0.18, 0.5, M["oak"], bevel=0.006)
    for k in (-1, 0, 1):
        local_box("console_seam", at, d, D / 2 - 0.004, D / 2 + 0.002, k * Lg / 3 - 0.002, k * Lg / 3 + 0.002, 0.2, 0.48, M["black"], bevel=0.0)
    if f.get("tv"):
        w = min(1.45, Lg - 0.2)
        local_box("tv", at, d, -D / 2 - 0.0, -D / 2 + 0.035, -w / 2, w / 2, 1.0, 1.0 + w * 0.5625, M["tv"], bevel=0.004)


def rug(f):
    box("rug", f["x0"], f["x1"], f["y0"], f["y1"], 0.006, 0.02, M[f.get("material", "rug")], bevel=0.006, seg=2)


def coffee_table(f, top="marble"):
    x, y = f["at"]
    cyl("table_top", x, y, f["r"], f["h"] - 0.035, f["h"], M[top], bevel=0.008, seg=3)
    cyl("table_base", x, y, f["r"] * 0.62, 0.0, f["h"] - 0.035, M["oak"], bevel=0.006)


def side_table(f):
    x, y = f["at"]
    cyl("side_top", x, y, f["r"], f["h"] - 0.025, f["h"], M["oak"], bevel=0.006)
    cyl("side_stem", x, y, 0.02, 0.012, f["h"] - 0.025, M["black"], bevel=0.0)
    cyl("side_foot", x, y, f["r"] * 0.6, 0.0, 0.014, M["black"], bevel=0.003)


def dining_table(f):
    box("dining_top", f["x0"], f["x1"], f["y0"], f["y1"], 0.72, 0.76, M["oak"], bevel=0.008, seg=3)
    for x in (f["x0"] + 0.1, f["x1"] - 0.1):
        for y in (f["y0"] + 0.1, f["y1"] - 0.1):
            box("dining_leg", x - 0.02, x + 0.02, y - 0.02, y + 0.02, 0.0, 0.72, M["black"], bevel=0.004)


def console(f):
    box("console", f["x0"], f["x1"], f["y0"], f["y1"], 0.0, f.get("h", 0.75), M["oak"], bevel=0.006)


def shower(f):
    box("shower_tray", f["x0"], f["x1"], f["y0"], f["y1"], 0.0, 0.035, M["ceramic"], bevel=0.006)
    g = f["glass"]
    if g in ("y0", "y1"):
        y = f[g]
        box("shower_glass", f["x0"], f["x1"], y - 0.005, y + 0.005, 0.035, 2.0, M["shower_glass"], bevel=0.0)
    else:
        x = f[g]
        box("shower_glass", x - 0.005, x + 0.005, f["y0"], f["y1"], 0.035, 2.0, M["shower_glass"], bevel=0.0)
    cyl("shower_head", (f["x0"] + f["x1"]) / 2, (f["y0"] + f["y1"]) / 2, 0.11, 2.05, 2.07, M["steel"], bevel=0.003)


def toilet(f):
    at, d = f["at"], DIRS[f["face"]]
    local_box("toilet", at, d, -0.22, 0.32, -0.185, 0.185, 0.3, 0.42, M["ceramic"], bevel=0.07, seg=5)
    local_box("toilet_seat", at, d, -0.2, 0.3, -0.18, 0.18, 0.42, 0.44, M["ceramic"], bevel=0.015, seg=3)
    local_box("flush_plate", at, d, -0.26, -0.245, -0.12, 0.12, 0.98, 1.14, M["steel"], bevel=0.003)


def vanity(f):
    c, d, D, Lg = rect_frame(f)
    at = (c.x, c.y)
    local_box("vanity", at, d, -D / 2, D / 2, -Lg / 2, Lg / 2, 0.32, 0.82, M["oak"], bevel=0.005)
    local_box("vanity_top", at, d, -D / 2, D / 2 + 0.01, -Lg / 2, Lg / 2, 0.82, 0.85, M["marble"], bevel=0.003)
    local_box("basin", at, d, -D / 2 + 0.17, D / 2 - 0.08, -0.2, 0.2, 0.85, 0.98, M["ceramic"], bevel=0.04, seg=4)
    local_box("mirror", at, d, -D / 2 - 0.01, -D / 2 + 0.005, -Lg / 2 + 0.03, Lg / 2 - 0.03, 1.05, 1.9, M["mirror"], bevel=0.002)


def bathtub(f):
    x0, x1, y0, y1 = f["x0"], f["x1"], f["y0"], f["y1"]
    t = 0.08
    box("tub_bottom", x0, x1, y0, y1, 0.0, 0.14, M["ceramic"], bevel=0.02)
    for a in ((x0, x0 + t, y0, y1), (x1 - t, x1, y0, y1), (x0, x1, y0, y0 + t), (x0, x1, y1 - t, y1)):
        box("tub_rim", *a, 0.0, 0.56, M["ceramic"], bevel=0.025, seg=3)


def washer(f):
    x, y = f["at"]
    box("washer", x - 0.3, x + 0.3, y - 0.3, y + 0.3, 0.0, 0.85, M["ceramic"], bevel=0.02, seg=3)
    door = cyl("washer_door", x, y + 0.3, 0.2, -0.015, 0.015, M["tv"], bevel=0.006)
    door.rotation_euler = (math.pi / 2, 0, 0)
    door.location.z = 0.45


def pendant(f):
    x, y = f["at"]
    src, mn, mx = model_src("modern_ceiling_lamp_01")
    hgt = mx.z - mn.z
    place("modern_ceiling_lamp_01", x, y, z=1.62, coll=INTERIOR)
    cyl("pendant_cord", x, y, 0.004, 1.62 + hgt, H, M["black"], bevel=0.0, coll=INTERIOR)
    ld = bpy.data.lights.new("pendant_light", "POINT")
    ld.energy = 35
    ld.color = (1.0, 0.8, 0.58)
    ld.shadow_soft_size = 0.08
    lo = link(bpy.data.objects.new("pendant_light", ld), INTERIOR)
    p = P(x, y)
    lo.location = (p.x, p.y, 1.62 + 0.08)


BUILD = {"chair": chair, "sofa": sofa, "bed": bed, "nightstand": nightstand, "wardrobe": wardrobe, "tv_console": tv_console,
         "rug": rug, "coffee_table": coffee_table, "side_table": side_table, "dining_table": dining_table, "console": console,
         "shower": shower, "toilet": toilet, "vanity": vanity, "bathtub": bathtub, "washer": washer, "pendant": pendant}
STAGE_OF = {"wardrobe": "builtin", "shower": "builtin", "toilet": "builtin", "vanity": "builtin", "bathtub": "builtin",
            "washer": "builtin", "tv_console": "builtin", "console": "builtin", "rug": "rug", "pendant": "ceiling",
            "plant": "decor", "model": "decor", "armchair": "decor"}
for f in PLAN["furniture"]:
    t = f["type"]
    STAGE[0] = STAGE_OF.get(t, "furniture")
    if t in BUILD:
        BUILD[t](f)
    elif t in ("plant", "model", "armchair"):
        x, y = f["at"]
        z = BALC_Z if in_balcony(x, y) else 0.0
        if t == "plant":
            place(f["model"], x, y, z=z, yaw=f.get("yaw", (x * 37 + y * 53) % 360), height=f["size"])
        else:
            place(f["model"], x, y, z=z, yaw=f.get("yaw", 0), scale=f.get("size", 1.0))
# ---------------------------------------------------------------- soft furnishings: sheer curtains, art, a vase
STAGE[0] = "decor"
def sheer_mat():
    m = bpy.data.materials.new("sheer")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    inp(b, "Base Color", (0.9, 0.88, 0.84, 1))
    inp(b, "Roughness", 0.95)
    tl = N.new("ShaderNodeBsdfTranslucent")
    tl.inputs["Color"].default_value = (0.95, 0.9, 0.82, 1)
    mix = N.new("ShaderNodeMixShader")
    mix.inputs[0].default_value = 0.6
    L.new(b.outputs[0], mix.inputs[1])
    L.new(tl.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], N["Material Output"].inputs["Surface"])
    return m


SHEER = sheer_mat()


def curtain(ax, a0, a1, c, amp=0.045, period=0.16, z0=0.02, z1=2.72):
    """A gathered sheer panel along the wall (ax = 'x' or 'y') from a0 to a1, hanging at c off the glass."""
    bm = bmesh.new()
    n = max(8, int((a1 - a0) / period * 8))
    rows = []
    for zz in (z0, z1):
        row = []
        for k in range(n + 1):
            a = a0 + (a1 - a0) * k / n
            w = c + amp * math.sin(2 * math.pi * (a - a0) / period)
            p = P(a, w) if ax == "x" else P(w, a)
            row.append(bm.verts.new((p.x, p.y, zz)))
        rows.append(row)
    for k in range(n):
        bm.faces.new((rows[0][k], rows[0][k + 1], rows[1][k + 1], rows[1][k]))
    o = _obj("curtain", bm, [SHEER])
    sol = o.modifiers.new("thick", "SOLIDIFY")
    sol.thickness = 0.004
    for p in o.data.polygons:
        p.use_smooth = True
    return o


CURTAINS = [("y", 14.75, 15.2, 7.16), ("y", 16.35, 16.8, 7.16), ("y", 18.85, 19.3, 7.1), ("x", 8.95, 9.4, 19.98),
            ("x", 11.65, 12.0, 20.08), ("x", 12.95, 13.3, 20.08), ("x", 15.4, 15.75, 18.2), ("x", 16.75, 17.1, 18.2),
            ("x", 18.35, 18.7, 18.2), ("x", 19.65, 20.0, 18.2)]
for ax_, a0_, a1_, c_ in CURTAINS:
    curtain(ax_, a0_, a1_, c_)

# a two-block print over the sofa, on the pillar's inner face
box("art_frame", 7.08, 7.115, 17.75, 19.05, 1.3, 2.12, M["black"], bevel=0.004)
box("art_print", 7.115, 7.12, 17.79, 18.42, 1.34, 2.08, M["art"], bevel=0.0)
box("art_print_2", 7.115, 7.12, 18.42, 19.01, 1.34, 2.08, M["art2"], bevel=0.0)
place("ceramic_vase_01", 8.95, 16.07, z=0.76, height=0.26)
place("potted_plant_04", 10.45, 14.5, z=0.9, height=0.28)

# recessed downlights: living room, kitchen, the hall and the master bedroom (interior shots only)
STAGE[0] = "ceiling"
DOWN = ((7.9, 15.2), (9.6, 15.2), (8.0, 17.6), (9.6, 17.6), (8.0, 19.3), (9.6, 19.3), (12.3, 14.45), (13.9, 13.85),
        (15.5, 13.85), (17.0, 13.85), (18.35, 13.95), (18.25, 16.0), (18.25, 17.6))
for dx, dy in DOWN:
    cyl("downlight_trim", dx, dy, 0.055, H - 0.012, H - 0.002, M["white"], bevel=0.002, coll=INTERIOR)
    cyl("downlight", dx, dy, 0.038, H - 0.014, H - 0.011, M["downlight"], bevel=0.0, coll=INTERIOR)
    sl = bpy.data.lights.new("downlight_spot", "SPOT")
    sl.energy = 22
    sl.color = (1.0, 0.84, 0.64)
    sl.spot_size = math.radians(110)
    sl.spot_blend = 0.7
    sl.shadow_soft_size = 0.04
    so_ = link(bpy.data.objects.new("downlight_spot", sl), INTERIOR)
    pp = P(dx, dy)
    so_.location = (pp.x, pp.y, H - 0.03)
STAGE[0] = "decor"

# books and a vase on the living-room console
for k, (h_, mat) in enumerate(((0.035, M["art"]), (0.03, M["linen_greige"]), (0.04, M["art2"]))):
    z_ = 0.5 + sum(v for v, _ in ((0.035, 0), (0.03, 0), (0.04, 0))[:k])
    box("book", 10.45, 10.68, 18.75 - 0.01 * k, 19.05 + 0.01 * k, z_, z_ + h_, mat, bevel=0.003)
place("ceramic_vase_01", 10.56, 17.75, z=0.5, height=0.34)

STAGE[0] = "ground"
if FILM:
    # the listing sheet itself is the ground: the building grows out of its own drawing
    IMW, IMH, PXM = 2262, 3200, 86.0
    bm = bmesh.new()
    corners = [(-30, -30), (60, -30), (60, 70), (-30, 70)]
    vs = [bm.verts.new((P(x, y).x, P(x, y).y, -0.062)) for x, y in corners]
    face = bm.faces.new(vs)
    bm.normal_update()
    if face.normal.z < 0:
        face.normal_flip()
    uvl = bm.loops.layers.uv.new("UVMap")
    for lp_ in face.loops:
        x, y = lp_.vert.co.x + CX, CY - lp_.vert.co.y
        lp_[uvl].uv = (x * PXM / IMW, 1 - y * PXM / IMH)
    pm = bpy.data.materials.new("plan_sheet")
    pm.use_nodes = True
    PN, PL = pm.node_tree.nodes, pm.node_tree.links
    pb = PN["Principled BSDF"]
    inp(pb, "Roughness", 0.8)
    ptc = PN.new("ShaderNodeTexCoord")
    pim = PN.new("ShaderNodeTexImage")
    PLAN_IMG = os.environ.get("BLUEPRINT_PLAN", os.path.join(HERE, "plan.png"))
    pim.image = bpy.data.images.load(PLAN_IMG) if os.path.exists(PLAN_IMG) else bpy.data.images.new("plan_blank", 8, 8)
    pim.extension = "CLIP"
    pim.interpolation = "Cubic"
    PL.new(ptc.outputs["UV"], pim.inputs["Vector"])
    sub = PN.new("ShaderNodeVectorMath")
    sub.operation = "SUBTRACT"
    PL.new(pim.outputs["Color"], sub.inputs[0])
    sub.inputs[1].default_value = (1, 1, 1)
    scl = PN.new("ShaderNodeVectorMath")
    scl.operation = "SCALE"
    PL.new(sub.outputs[0], scl.inputs[0])
    PL.new(pim.outputs["Alpha"], scl.inputs["Scale"])
    add = PN.new("ShaderNodeVectorMath")
    add.operation = "ADD"
    PL.new(scl.outputs[0], add.inputs[0])
    add.inputs[1].default_value = (1, 1, 1)
    dim = PN.new("ShaderNodeVectorMath")
    dim.operation = "SCALE"
    PL.new(add.outputs[0], dim.inputs[0])
    dim.inputs["Scale"].default_value = 0.9
    PL.new(dim.outputs[0], pb.inputs["Base Color"])
    ground = _obj("plan_sheet", bm, [pm])
else:
    # the dollhouse stands on an invisible floor that only catches its shadow
    gp = P(13.2, 16.3)
    bpy.ops.mesh.primitive_plane_add(size=80, location=(gp.x, gp.y, -0.42))
    ground = bpy.context.active_object
    ground.name = "shadow_catcher"
    ground.is_shadow_catcher = True
STAGE[0] = "light"
print(f"built in {time.time() - t0:.1f} s, {len(bpy.data.objects)} objects")

# ---------------------------------------------------------------- light: sky HDRI, low south-west sun
world = bpy.data.worlds.new("sky")
scene.world = world
world.use_nodes = True
WN, WL = world.node_tree.nodes, world.node_tree.links
bg = WN["Background"]
env = WN.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(ASSETS["kloofendal_48d_partly_cloudy_puresky"])
wtc = WN.new("ShaderNodeTexCoord")
wmp = WN.new("ShaderNodeMapping")
wmp.inputs["Rotation"].default_value = (0, 0, math.radians(110))
# no vector input: the sky is looked up by ray direction alone, so it cannot shift with the camera
WL.new(env.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.7
studio = WN.new("ShaderNodeBackground")
studio.inputs["Color"].default_value = (0.84, 0.83, 0.81, 1)
lp = WN.new("ShaderNodeLightPath")
cam_mix = WN.new("ShaderNodeMixShader")
WL.new(bg.outputs[0], cam_mix.inputs[1])
WL.new(studio.outputs[0], cam_mix.inputs[2])
WL.new(cam_mix.outputs[0], WN["World Output"].inputs["Surface"])


def backdrop(studio_bg):
    """The dollhouse floats on a plain warm grey; from inside, the windows look out at the sky."""
    for lk in list(cam_mix.inputs[0].links):
        WL.remove(lk)
    if studio_bg:  # the camera and the glass reflections both see the backdrop
        mx_ = WN.new("ShaderNodeMath")
        mx_.operation = "MAXIMUM"
        WL.new(lp.outputs["Is Camera Ray"], mx_.inputs[0])
        WL.new(lp.outputs["Is Glossy Ray"], mx_.inputs[1])
        WL.new(mx_.outputs[0], cam_mix.inputs[0])
    else:
        cam_mix.inputs[0].default_value = 0.0

sun = bpy.data.lights.new("sun", "SUN")
sun.energy = 3.6
sun.angle = math.radians(1.2)
sun.color = (1.0, 0.9, 0.78)
so = link(bpy.data.objects.new("sun", sun))


def aim_sun(az_deg, el_deg):
    az, el = math.radians(az_deg), math.radians(el_deg)
    to_sun = Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el)))
    so.rotation_euler = (-to_sun).to_track_quat("-Z", "Y").to_euler()


# ---------------------------------------------------------------- cameras and shots
def camera(name, loc, target, lens, shift_y=0.0):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = 36
    cd.shift_y = shift_y
    cd.clip_start = 0.05
    cd.clip_end = 200
    o = link(bpy.data.objects.new(name, cd))
    o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o


def dollhouse():
    tgt = Vector((0.7, 0.9, 0.0))
    az_, el_, dist = math.radians(252), math.radians(55), 33.0
    loc = tgt + dist * Vector((math.cos(el_) * math.cos(az_), math.cos(el_) * math.sin(az_), math.sin(el_)))
    INTERIOR.hide_render = True
    backdrop(True)
    scene.render.film_transparent = True
    ground.hide_render = False
    scene.view_settings.exposure = 0.0
    sun.energy = 4.6
    aim_sun(228, 47)
    bg.inputs["Strength"].default_value = 0.55
    return camera("cam_dollhouse", loc, tgt, 46)


def interior(p0, p1, lens, shift_y=0.0, eye=1.32):
    a, b = P(*p0), P(*p1)
    INTERIOR.hide_render = False
    backdrop(False)
    scene.render.film_transparent = False
    ground.hide_render = True
    scene.view_settings.exposure = 1.0
    sun.energy = 5.0
    aim_sun(238, 19)
    bg.inputs["Strength"].default_value = 0.85
    return camera("cam_interior", (a.x, a.y, eye), (b.x, b.y, eye), lens, shift_y=shift_y)


def living():
    return interior((10.12, 19.72), (7.45, 15.1), 19, -0.04)


def living_b():
    return interior((10.62, 15.02), (7.0, 19.9), 18, -0.03)

SHOT = {"dollhouse": dollhouse, "living": living, "living_b": living_b}
if OPTS.get("blend"):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "apartment.blend"))
for s in ([] if FILM else SHOTS):
    cam = SHOT[s]()
    scene.camera = cam
    scene.render.filepath = os.path.join(OUT, f"render_{s}.png")
    t1 = time.time()
    bpy.ops.render.render(write_still=True)
    print(f"rendered {s} in {time.time() - t1:.1f} s -> {scene.render.filepath}")
