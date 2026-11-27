"""Shared Blender helpers for the architecture scenes (every house in houses/): Cycles + OptiX setup, node helpers,
CC0 Poly Haven materials and models, box/cylinder primitives, lights, cameras.

Usage inside a scene script run by Blender:
    sys.path.insert(0, <skill>/kit); import bkit as K
    OPTS, SHOTS = K.args(); K.setup(OPTS)
    K.STAGE[0] = "frame"; K.box("post", ...)

Every object made through link() is recorded in K.PARTS with the build stage current at that moment, so a film can
fly the parts in by stage. Units are metres, z up.
"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector, noise

ASSET_DIR = os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven"))
ASSETS = json.load(open(os.path.join(ASSET_DIR, "assets.json"))) if os.path.exists(os.path.join(ASSET_DIR, "assets.json")) else {}
OPTS = {}
ROOT = None
STAGE = ["misc"]
PARTS = []
FILM = False


def args(default_shots=("hero",)):
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    shots, opts = [], {}
    i = 0
    while i < len(argv):
        if argv[i].startswith("--"):
            if i + 1 < len(argv) and not argv[i + 1].startswith("--"):
                opts[argv[i][2:]] = argv[i + 1]
                i += 2
            else:
                opts[argv[i][2:]] = True
                i += 1
        else:
            shots.append(argv[i])
            i += 1
    return opts, shots or list(default_shots)


def setup(opts, samples=256, res="1920x1080"):
    """Empty scene, Cycles on the OptiX GPU, Khronos PBR Neutral (AgX turns warm light beige)."""
    global OPTS, ROOT, FILM
    OPTS = opts
    FILM = bool(opts.get("film"))
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
    scene.cycles.samples = int(opts.get("samples", samples))
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPTIX"
    scene.cycles.max_bounces = 10
    scene.cycles.diffuse_bounces = 4
    scene.cycles.glossy_bounces = 4
    scene.cycles.transmission_bounces = 8
    scene.cycles.transparent_max_bounces = 24
    scene.cycles.volume_bounces = 1
    scene.cycles.caustics_reflective = False
    scene.cycles.blur_glossy = 1.0
    rx, ry = map(int, str(opts.get("res", res)).split("x"))
    scene.render.resolution_x, scene.render.resolution_y = rx, ry
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = opts.get("vt", "Khronos PBR Neutral")
    try:
        scene.view_settings.look = "None"
    except TypeError:
        pass
    scene.view_settings.exposure = float(opts.get("exposure", 0.0))
    ROOT = scene.collection
    random.seed(int(opts.get("seed", 7)))
    return scene


def link(o, coll=None):
    (coll or ROOT).objects.link(o)
    PARTS.append((o, STAGE[0]))
    return o


# ---------------------------------------------------------------- node helpers
def inp(node, names, value):
    for n in names if isinstance(names, (list, tuple)) else [names]:
        if n in node.inputs:
            node.inputs[n].default_value = value
            return
    raise KeyError(names)


def sock(node, ident, out=False):
    for s in (node.outputs if out else node.inputs):
        if s.identifier == ident:
            return s
    raise KeyError(ident)


def mix_rgb(N, L, fac, a, b, blend="MIX"):
    m = N.new("ShaderNodeMix")
    m.data_type = "RGBA"
    m.blend_type = blend
    m.clamp_factor = blend == "MIX"
    if isinstance(fac, (int, float)):
        m.inputs[0].default_value = fac
    else:
        L.new(fac, m.inputs[0])
    for s, v in ((sock(m, "A_Color"), a), (sock(m, "B_Color"), b)):
        if isinstance(v, tuple):
            s.default_value = (*v, 1) if len(v) == 3 else v
        else:
            L.new(v, s)
    return sock(m, "Result_Color", out=True)


def mix_f(N, L, fac, a, b):
    m = N.new("ShaderNodeMix")
    m.data_type = "FLOAT"
    for s, v in ((m.inputs[0], fac), (sock(m, "A_Float"), a), (sock(m, "B_Float"), b)):
        if isinstance(v, (int, float)):
            s.default_value = v
        else:
            L.new(v, s)
    return sock(m, "Result_Float", out=True)


def math_node(N, L, op, a, b=None, c=None):
    m = N.new("ShaderNodeMath")
    m.operation = op
    for k, v in enumerate((a, b, c)):
        if v is None:
            continue
        if isinstance(v, (int, float)):
            m.inputs[k].default_value = v
        else:
            L.new(v, m.inputs[k])
    return m.outputs[0]


def ramp(N, L, fac, stops, interp="LINEAR"):
    r = N.new("ShaderNodeValToRGB")
    cr = r.color_ramp
    cr.interpolation = interp
    cr.elements[0].position, cr.elements[0].color = stops[0][0], (*stops[0][1], 1)
    cr.elements[1].position, cr.elements[1].color = stops[-1][0], (*stops[-1][1], 1)
    for p, c in stops[1:-1]:
        e = cr.elements.new(p)
        e.color = (*c, 1)
    L.new(fac, r.inputs["Fac"])
    return r.outputs["Color"]


def noise_tex(N, L, vec, scale, detail=4.0, rough=0.55):
    n = N.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    n.inputs["Roughness"].default_value = rough
    if vec is not None:
        L.new(vec, n.inputs["Vector"])
    return n.outputs["Fac"]


def ocoord(N, L, tc=None):
    """Object coordinates plus the object's 'rest' location (a film sets it): a part keeps its texture in flight and
    parts cut from one slab stay continuous. Without 'rest' it is plain Object coordinates."""
    tc = tc or N.new("ShaderNodeTexCoord")
    at = N.new("ShaderNodeAttribute")
    at.attribute_type = "OBJECT"
    at.attribute_name = "rest"
    add = N.new("ShaderNodeVectorMath")
    add.operation = "ADD"
    L.new(tc.outputs["Object"], add.inputs[0])
    L.new(at.outputs["Vector"], add.inputs[1])
    return add.outputs["Vector"]


def bump_into(N, L, b, height, strength, dist=0.003):
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = dist
    L.new(height, bump.inputs["Height"])
    if b.inputs["Normal"].links:
        L.new(b.inputs["Normal"].links[0].from_socket, bump.inputs["Normal"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])


# ---------------------------------------------------------------- materials
def new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links, m.node_tree.nodes["Principled BSDF"]


def principled(name, color, rough=0.5, metal=0.0, emission=None, estr=0.0):
    m, N, L, b = new_mat(name)
    inp(b, "Base Color", (*color, 1))
    inp(b, "Roughness", rough)
    inp(b, "Metallic", metal)
    if emission:
        inp(b, ["Emission Color", "Emission"], (*emission, 1))
        inp(b, "Emission Strength", estr)
    return m


def tex_maps(N, L, tex, size, coord_out, rot=0.0, box=True, blend=0.25, stretch=(1.0, 1.0, 1.0)):
    """The image maps of one Poly Haven texture: (colour, roughness, normal colour or None)."""
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (stretch[0] / size, stretch[1] / size, stretch[2] / size)
    mp.inputs["Rotation"].default_value = (0, 0, rot)
    L.new(coord_out, mp.inputs["Vector"])
    A = ASSETS[tex]

    def img(path, color):
        n = N.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(path, check_existing=True)
        if not color:
            n.image.colorspace_settings.name = "Non-Color"
        if box:
            n.projection = "BOX"
            n.projection_blend = blend
        L.new(mp.outputs["Vector"], n.inputs["Vector"])
        return n

    col = img(A["diff"], True).outputs["Color"]
    rough = img(A["rough"], False).outputs["Color"] if "rough" in A else None
    nor = img(A["nor"], False).outputs["Color"] if "nor" in A else None
    return col, rough, nor


def textured(name, tex, size, rot=0.0, value=1.0, sat=1.0, hue=0.5, tint=None, rough=(1.0, 0.0), normal=1.0, coord="Object", box=True, stretch=(1, 1, 1)):
    m, N, L, b = new_mat(name)
    tc = N.new("ShaderNodeTexCoord")
    col, ro, nor = tex_maps(N, L, tex, size, ocoord(N, L, tc) if coord == "Object" else tc.outputs[coord], rot, box, stretch=stretch)
    if value != 1.0 or sat != 1.0 or hue != 0.5:
        hs = N.new("ShaderNodeHueSaturation")
        hs.inputs["Hue"].default_value = hue
        hs.inputs["Saturation"].default_value = sat
        hs.inputs["Value"].default_value = value
        L.new(col, hs.inputs["Color"])
        col = hs.outputs["Color"]
    if tint:
        col = mix_rgb(N, L, 1.0, col, tint, "MULTIPLY")
    L.new(col, b.inputs["Base Color"])
    if ro is not None:
        L.new(math_node(N, L, "MULTIPLY_ADD", ro, rough[0], rough[1]), b.inputs["Roughness"])
    else:
        inp(b, "Roughness", rough[1] + 0.5 * rough[0])
    if nor is not None and normal > 0:
        nm = N.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal
        L.new(nor, nm.inputs["Color"])
        L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def boards(m, width, length=2.4, offset=0.37, seam=(0.08, 0.05, 0.03), axis="x", shade=0.8):
    """Lay a textured material in boards: each board its own shade and a dark seam (object coords, the run along axis)."""
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    v = ocoord(N, L, tc)
    if axis == "y":
        sep = N.new("ShaderNodeSeparateXYZ")
        L.new(v, sep.inputs[0])
        cb = N.new("ShaderNodeCombineXYZ")
        L.new(sep.outputs[1], cb.inputs[0])
        L.new(sep.outputs[0], cb.inputs[1])
        L.new(sep.outputs[2], cb.inputs[2])
        v = cb.outputs[0]
    elif axis == "z":
        sep = N.new("ShaderNodeSeparateXYZ")
        L.new(v, sep.inputs[0])
        cb = N.new("ShaderNodeCombineXYZ")
        L.new(sep.outputs[2], cb.inputs[0])
        L.new(math_node(N, L, "ADD", sep.outputs[0], sep.outputs[1]), cb.inputs[1])
        v = cb.outputs[0]
    br = N.new("ShaderNodeTexBrick")
    br.offset = offset
    br.inputs["Scale"].default_value = 1.0
    br.inputs["Brick Width"].default_value = length
    br.inputs["Row Height"].default_value = width
    br.inputs["Mortar Size"].default_value = 0.003
    br.inputs["Color1"].default_value = (1, 1, 1, 1)
    br.inputs["Color2"].default_value = (shade, shade * 0.98, shade * 0.96, 1)
    br.inputs["Mortar"].default_value = (*seam, 1)
    L.new(v, br.inputs["Vector"])
    base = b.inputs["Base Color"].links[0].from_socket
    L.new(mix_rgb(N, L, 1.0, base, br.outputs["Color"], "MULTIPLY"), b.inputs["Base Color"])
    bump_into(N, L, b, br.outputs["Fac"], 0.3, 0.002)
    return m


def glass(name, tint=(0.95, 0.97, 0.97)):
    """Thin glass: see-through with a fresnel reflection, no refraction."""
    m, N, L, b = new_mat(name)
    N.remove(b)
    tr = N.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (*tint, 1)
    gl = N.new("ShaderNodeBsdfGlossy")
    gl.inputs["Roughness"].default_value = 0.0
    fr = N.new("ShaderNodeFresnel")
    fr.inputs["IOR"].default_value = 1.5
    geo = N.new("ShaderNodeNewGeometry")
    front = math_node(N, L, "SUBTRACT", 1.0, geo.outputs["Backfacing"])
    k = math_node(N, L, "MULTIPLY", fr.outputs[0], front)
    mix = N.new("ShaderNodeMixShader")
    L.new(k, mix.inputs[0])
    L.new(tr.outputs[0], mix.inputs[1])
    L.new(gl.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], N["Material Output"].inputs["Surface"])
    return m


def fabric(name, color, rough=0.92, bump=0.45, size=0.35, nmap="rough_linen"):
    m, N, L, b = new_mat(name)
    inp(b, "Base Color", (*color, 1))
    inp(b, "Roughness", rough)
    try:
        inp(b, ["Sheen Weight", "Sheen"], 0.4)
    except KeyError:
        pass
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size,) * 3
    L.new(ocoord(N, L, tc), mp.inputs["Vector"])
    n = N.new("ShaderNodeTexImage")
    n.image = bpy.data.images.load(ASSETS[nmap]["nor"], check_existing=True)
    n.image.colorspace_settings.name = "Non-Color"
    n.projection = "BOX"
    n.projection_blend = 0.3
    L.new(mp.outputs["Vector"], n.inputs["Vector"])
    nm = N.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = bump
    L.new(n.outputs["Color"], nm.inputs["Color"])
    L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def emissive(name, color, strength):
    m, N, L, b = new_mat(name)
    N.remove(b)
    e = N.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    L.new(e.outputs[0], N["Material Output"].inputs["Surface"])
    return m


def paper(name, color=(0.93, 0.9, 0.84), glow=(1.0, 0.72, 0.42), strength=0.0, translucent=0.6):
    """Shoji / lantern paper: a diffuse face that lets the light behind it through, plus an optional own glow so a lit
    room reads warm from outside even at low samples."""
    m, N, L, b = new_mat(name)
    N.remove(b)
    d = N.new("ShaderNodeBsdfDiffuse")
    d.inputs["Color"].default_value = (*color, 1)
    t = N.new("ShaderNodeBsdfTranslucent")
    t.inputs["Color"].default_value = (*color, 1)
    mx = N.new("ShaderNodeMixShader")
    mx.inputs[0].default_value = translucent
    L.new(d.outputs[0], mx.inputs[1])
    L.new(t.outputs[0], mx.inputs[2])
    out = mx.outputs[0]
    if strength > 0:
        e = N.new("ShaderNodeEmission")
        e.inputs["Color"].default_value = (*glow, 1)
        e.inputs["Strength"].default_value = strength
        ad = N.new("ShaderNodeAddShader")
        L.new(out, ad.inputs[0])
        L.new(e.outputs[0], ad.inputs[1])
        out = ad.outputs[0]
    L.new(out, N["Material Output"].inputs["Surface"])
    return m


# ---------------------------------------------------------------- geometry
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
    if smooth and bevel > 0:
        for p in o.data.polygons:
            p.use_smooth = True
    return o


def box(name, x0, x1, y0, y1, z0, z1, mat, bevel=0.004, seg=2, coll=None, mats=None):
    x0, x1 = min(x0, x1), max(x0, x1)
    y0, y1 = min(y0, y1), max(y0, y1)
    z0, z1 = min(z0, z1), max(z0, z1)
    sx, sy, sz = x1 - x0, y1 - y0, z1 - z0
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    if mats:  # (top, sides, bottom)
        for f in bm.faces:
            f.normal_update()
            f.material_index = 0 if f.normal.z > 0.5 else 2 if f.normal.z < -0.5 else 1
    o = _obj(name, bm, mats or [mat], coll)
    o.location = ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    return _finish(o, min(bevel, 0.45 * min(sx, sy, sz)), seg)


def obox(name, c, size, rot, mat, bevel=0.004, seg=2):
    """A box of size (sx, sy, sz) centred at c, turned by the euler rot (radians)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    o = _obj(name, bm, [mat])
    o.location = c
    o.rotation_euler = rot
    return _finish(o, min(bevel, 0.45 * min(size)), seg)


def beam(name, a, b, w, h, mat, up=(0, 0, 1), bevel=0.004):
    """A rectangular member from point a to point b, w wide and h tall (h along 'up' as far as the run allows)."""
    a, b = Vector(a), Vector(b)
    d = b - a
    ln = d.length
    x = d.normalized()
    z = Vector(up)
    z = (z - x * z.dot(x)).normalized() if abs(z.dot(x)) < 0.999 else x.orthogonal().normalized()
    y = z.cross(x)
    R = Matrix((x, y, z)).transposed()
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= ln
        v.co.y *= w
        v.co.z *= h
    o = _obj(name, bm, [mat])
    o.location = (a + b) / 2
    o.rotation_euler = R.to_euler()
    return _finish(o, min(bevel, 0.45 * min(w, h)), 1)


def prism(name, poly, z_of, thick, mat, mats=None):
    """A slab over a 2D polygon [(x, y), ...] whose top follows z_of(x, y), thick below it (vertical)."""
    bm = bmesh.new()
    top = [bm.verts.new((x, y, z_of(x, y))) for x, y in poly]
    bot = [bm.verts.new((x, y, z_of(x, y) - thick)) for x, y in poly]
    ft = bm.faces.new(top)
    fb = bm.faces.new(list(reversed(bot)))
    n = len(poly)
    sides = [bm.faces.new((top[i], top[(i + 1) % n], bot[(i + 1) % n], bot[i])) for i in range(n)]
    bm.normal_update()
    if ft.normal.z < 0:
        bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
    if mats:
        ft.material_index, fb.material_index = 0, 2
        for f in sides:
            f.material_index = 1
    return _obj(name, bm, mats or [mat])


def cyl(name, x, y, r, z0, z1, mat, verts=48, bevel=0.004, seg=2, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=z1 - z0)
    o = _obj(name, bm, [mat])
    o.location = (x, y, (z0 + z1) / 2)
    return _finish(o, min(bevel, 0.45 * min(r, z1 - z0)), seg)


def tube(name, a, b, r, mat, verts=24):
    """A cylinder from point a to point b."""
    a, b = Vector(a), Vector(b)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=(b - a).length)
    o = _obj(name, bm, [mat])
    o.location = (a + b) / 2
    o.rotation_euler = (b - a).to_track_quat("Z", "Y").to_euler()
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def sphere(name, x, y, z, r, mat, squash=1.0, seg=32):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r)
    for v in bm.verts:
        v.co.z *= squash
    o = _obj(name, bm, [mat])
    o.location = (x, y, z)
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def light(name, kind, loc, energy, color=(1.0, 0.72, 0.45), size=0.1, rot=(0, 0, 0), spot=None, size_y=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = color
    if kind == "AREA":
        ld.shape = "RECTANGLE" if size_y else "SQUARE"
        ld.size = size
        if size_y:
            ld.size_y = size_y
    else:
        ld.shadow_soft_size = size
    if kind == "SPOT" and spot:
        ld.spot_size = math.radians(spot[0])
        ld.spot_blend = spot[1]
    o = link(bpy.data.objects.new(name, ld))
    o.location = loc
    o.rotation_euler = rot
    return o


def aim(o, target):
    o.rotation_euler = (Vector(target) - Vector(o.location)).to_track_quat("-Z", "Y").to_euler()
    return o


# ---------------------------------------------------------------- Poly Haven models, imported once and instanced
_models = {}
_variants = {}


def _import(mid):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=ASSETS[mid])
    return [o for o in bpy.data.objects if o not in before]


def _bounds(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == "MESH" for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx


def model_src(mid, hook=None):
    """A model as a hidden source collection: (collection, min, max). hook(objects) may change its materials."""
    if mid in _models:
        return _models[mid]
    new = _import(mid)
    coll = bpy.data.collections.new("src_" + mid)
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        coll.objects.link(o)
    if hook:
        hook(new)
    mn, mx = _bounds(new)
    _models[mid] = (coll, mn, mx)
    return _models[mid]


def _ancestors(o):
    while o.parent:
        o = o.parent
        yield o


def model_variants(mid, hook=None):
    """A Poly Haven 'set' file (a row of plants, a heap of rocks) split into its single pieces, each its own source."""
    if mid in _variants:
        return _variants[mid]
    new = _import(mid)
    if hook:
        hook(new)
    roots = [o for o in new if o.parent is None]
    if len(roots) == 1 and len(roots[0].children) > 1:
        roots = list(roots[0].children)
    out, used = [], set()
    for r in roots:
        members = [r] + [o for o in new if o is not r and r in _ancestors(o)]
        meshes = [o for o in members if o.type == "MESH"]
        if not meshes:
            continue
        coll = bpy.data.collections.new(f"src_{mid}_{len(out)}")
        for o in members:
            for c in list(o.users_collection):
                c.objects.unlink(o)
            coll.objects.link(o)
            used.add(o.name)
        mn, mx = _bounds(meshes)
        out.append((coll, mn, mx))
    rest = bpy.data.collections.new(f"src_{mid}_rest")
    for o in new:
        if o.name not in used:
            for c in list(o.users_collection):
                c.objects.unlink(o)
            rest.objects.link(o)
    _variants[mid] = out
    return out


def _instance(mid, src, mn, mx, x, y, z, yaw, s):
    e = bpy.data.objects.new(mid, None)
    e.instance_type = "COLLECTION"
    e.instance_collection = src
    R = Matrix.Rotation(math.radians(yaw), 3, "Z")
    off = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z)) * s
    e.location = Vector((x, y, z)) - R @ off
    e.rotation_euler = (0, 0, math.radians(yaw))
    e.scale = (s, s, s)
    e["base"] = (x, y, z)  # where it stands: a film grows it from here
    return link(e)


def place(mid, x, y, z=0.0, yaw=0.0, scale=1.0, height=None, hook=None):
    src, mn, mx = model_src(mid, hook)
    s = height / (mx.z - mn.z) if height else scale
    return _instance(mid, src, mn, mx, x, y, z, yaw, s)


def place_variant(mid, x, y, z=0.0, yaw=0.0, height=None, k=None, scale=1.0, hook=None):
    vs = model_variants(mid, hook)
    src, mn, mx = vs[random.randrange(len(vs)) if k is None else k % len(vs)]
    s = height / (mx.z - mn.z) if height else scale
    return _instance(mid, src, mn, mx, x, y, z, yaw, s)


def recolor_leaves(objs, hue=0.0, sat=1.4, value=1.0, match=("leaf", "leaves", "foliage", "twig")):
    """Shift the hue of every leaf material in a model (green -> red maple): a Hue/Saturation node after the colour map."""
    done = set()
    for o in objs:
        if o.type != "MESH":
            continue
        for slot in o.material_slots:
            m = slot.material
            if not m or m.name in done or not any(k in m.name.lower() for k in match):
                continue
            done.add(m.name)
            N, L = m.node_tree.nodes, m.node_tree.links
            b = next((n for n in N if n.type == "BSDF_PRINCIPLED"), None)
            if not b or not b.inputs["Base Color"].links:
                continue
            src = b.inputs["Base Color"].links[0].from_socket
            hs = N.new("ShaderNodeHueSaturation")
            hs.inputs["Hue"].default_value = hue
            hs.inputs["Saturation"].default_value = sat
            hs.inputs["Value"].default_value = value
            L.new(src, hs.inputs["Color"])
            L.new(hs.outputs["Color"], b.inputs["Base Color"])
    return done


# ---------------------------------------------------------------- noise and cameras
def sstep(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def fbm(x, y, f, octaves=4, seed=0.0):
    a = s = 0.0
    amp = 1.0
    for o in range(octaves):
        a += amp * noise.noise(Vector((x * f, y * f, seed + o * 7.31)))
        s += amp
        amp *= 0.5
        f *= 2.03
    return a / s


def camera(name, loc, target, lens, shift_y=0.0, shift_x=0.0):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.shift_y = shift_y
    cd.shift_x = shift_x
    cd.clip_start = 0.05
    cd.clip_end = 20000
    co = bpy.data.objects.new(name, cd)
    ROOT.objects.link(co)
    co.location = loc
    co.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return co


def vec(s, default):
    return tuple(map(float, str(OPTS[s]).split(","))) if s in OPTS else default


def clip_poly(poly, a, b, c):
    """Sutherland-Hodgman: keep the part of poly where a*x + b*y <= c."""
    out = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        fp, fq = a * p[0] + b * p[1] - c, a * q[0] + b * q[1] - c
        if fp <= 0:
            out.append(p)
        if (fp < 0 < fq) or (fq < 0 < fp):
            t = fp / (fp - fq)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out
