"""A cliff villa at sunset in Blender, built from a text brief and 4 reference images (none of them traced).

The site: a limestone headland, the villa on its tip, the sea on three sides, the sun on the horizon. The house: a long
glass pavilion under a thin cream roof slab, an upper bedroom volume set back on the roof with a glass rail, a travertine
terrace, a teak deck with 4 loungers, an infinity pool as one travertine box cantilevered over the cliff edge.
Travertine is procedural (no CC0 scan of it exists), everything else is CC0 from Poly Haven (fetch_assets.py): the
limestone, the teak, the olive trees, shrubs, grass and boulders. The furniture is modelled here.

Run:
  blender -b --factory-startup -P houses/villa/build.py -- hero lounge --samples 256 --res 1920x1080
Stills land in blueprint-out/villa/render_<shot>.png; --blend also saves the scene there.
"""
import json
import math
import os
import random
import sys
import time

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

ASSETS = json.load(open(os.path.join(os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven")), "assets.json")))
OUT = os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "villa")
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
SHOTS = SHOTS or ["hero", "lounge"]
SAMPLES = int(OPTS.get("samples", 256))
RES = tuple(map(int, str(OPTS.get("res", "1920x1080")).split("x")))
FILM = bool(OPTS.get("film"))  # film.py: slabs cut into tiles, walls into blocks, no stills
t0 = time.time()
random.seed(7)

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
scene.cycles.diffuse_bounces = 4
scene.cycles.glossy_bounces = 4
scene.cycles.transmission_bounces = 8
scene.cycles.transparent_max_bounces = 16
scene.cycles.volume_bounces = 1
scene.cycles.caustics_reflective = False
scene.cycles.blur_glossy = 1.0
scene.render.resolution_x, scene.render.resolution_y = RES
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = OPTS.get("vt", "Khronos PBR Neutral")
for look in (((OPTS["look"],) if "look" in OPTS else ()) + ("AgX - Punchy", "Punchy", "AgX - Medium High Contrast")) if scene.view_settings.view_transform == "AgX" else ("None",):
    try:
        scene.view_settings.look = look
        break
    except TypeError:
        pass
scene.view_settings.exposure = float(OPTS.get("exposure", 0.0))

ROOT = scene.collection
STAGE = ["misc"]  # which build wave an object lands in (a film reads PARTS)
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


def sock(node, ident, out=False):
    for s in (node.outputs if out else node.inputs):
        if s.identifier == ident:
            return s
    raise KeyError(ident)


def mix_rgb(N, L, fac, a, b, blend="MIX"):
    m = N.new("ShaderNodeMix")
    m.data_type = "RGBA"
    m.blend_type = blend
    m.clamp_factor = blend == "MIX"  # an ADD with a factor over 1 is how the sun's disc and halo go past white
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


def ocoord(N, L, tc=None):
    """Object coordinates plus the object's 'rest' location (the film sets it): a part's texture is where it lands, the
    same in flight, and continuous across the tiles a slab is cut into. Stills have no 'rest', so it is plain Object."""
    tc = tc or N.new("ShaderNodeTexCoord")
    at = N.new("ShaderNodeAttribute")
    at.attribute_type = "OBJECT"
    at.attribute_name = "rest"
    add = N.new("ShaderNodeVectorMath")
    add.operation = "ADD"
    L.new(tc.outputs["Object"], add.inputs[0])
    L.new(at.outputs["Vector"], add.inputs[1])
    return add.outputs["Vector"]


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


def tex_maps(N, L, tex, size, coord_out, rot=0.0, box=True, blend=0.25):
    """The image maps of one Poly Haven texture on a box projection: (colour, roughness, normal map node or None)."""
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size, 1 / size, 1 / size)
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


def textured(name, tex, size, rot=0.0, value=1.0, sat=1.0, tint=None, rough=(1.0, 0.0), normal=1.0, coord="Object", box=True):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    col, ro, nor = tex_maps(N, L, tex, size, ocoord(N, L, tc) if coord == "Object" else tc.outputs[coord], rot, box)
    if value != 1.0 or sat != 1.0:
        hs = N.new("ShaderNodeHueSaturation")
        hs.inputs["Saturation"].default_value = sat
        hs.inputs["Value"].default_value = value
        L.new(col, hs.inputs["Color"])
        col = hs.outputs["Color"]
    if tint:
        col = mix_rgb(N, L, 1.0, col, tint, "MULTIPLY")
    L.new(col, b.inputs["Base Color"])
    if ro is not None:
        L.new(math_node(N, L, "MULTIPLY_ADD", ro, rough[0], rough[1]), b.inputs["Roughness"])
    if nor is not None and normal > 0:
        nm = N.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal
        L.new(nor, nm.inputs["Color"])
        L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def travertine(name, joints=None, axes="xy", light=1.0, polish=0.38, vein=0.6, wavy=7.0):
    """Cream travertine: soft bands of the bedding, open pores, and optional panel joints.

    joints (w, h) lays rectangular panels in the face's plane; axes 'xy' tiles a floor, 'wall' tiles a wall by its
    run (x + y) and height (z), 'none' leaves a seamless slab. Object coordinates, so nothing needs UVs."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    pos = ocoord(N, L, tc)
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(pos, sep.inputs[0])
    comb = N.new("ShaderNodeCombineXYZ")
    if axes == "wall":
        L.new(math_node(N, L, "ADD", sep.outputs[0], sep.outputs[1]), comb.inputs[0])
        L.new(sep.outputs[2], comb.inputs[1])
    else:
        L.new(sep.outputs[0], comb.inputs[0])
        L.new(sep.outputs[1], comb.inputs[1])
    L.new(sep.outputs[2] if axes != "wall" else sep.outputs[1], comb.inputs[2])
    uv = comb.outputs[0]
    # the bedding: long soft bands along the run, warped
    stretch = N.new("ShaderNodeMapping")
    stretch.inputs["Scale"].default_value = (0.35, 3.2, 3.2)
    L.new(uv, stretch.inputs["Vector"])
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.6
    nz.inputs["Detail"].default_value = 9.0
    nz.inputs["Roughness"].default_value = 0.62
    L.new(stretch.outputs["Vector"], nz.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.3
    ramp.color_ramp.elements[0].color = (0.66 * light, 0.55 * light, 0.42 * light, 1)
    ramp.color_ramp.elements[1].position = 0.72
    ramp.color_ramp.elements[1].color = (0.84 * light, 0.75 * light, 0.62 * light, 1)
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    col = ramp.outputs["Color"]
    # veins: thin wavy lines running along the slab
    wv = N.new("ShaderNodeTexWave")
    wv.wave_type = "BANDS"
    wv.bands_direction = "Y"
    wv.inputs["Scale"].default_value = 0.9
    wv.inputs["Distortion"].default_value = wavy
    wv.inputs["Detail"].default_value = 6.0
    wv.inputs["Detail Scale"].default_value = 1.4
    L.new(stretch.outputs["Vector"], wv.inputs["Vector"])
    vr = N.new("ShaderNodeValToRGB")
    vr.color_ramp.elements[0].position = 0.0
    vr.color_ramp.elements[0].color = (1, 1, 1, 1)
    vr.color_ramp.elements[1].position = 0.16
    vr.color_ramp.elements[1].color = (0, 0, 0, 1)
    L.new(wv.outputs["Fac"], vr.inputs["Fac"])
    col = mix_rgb(N, L, math_node(N, L, "MULTIPLY", vr.outputs["Color"], vein), col, (0.52 * light, 0.41 * light, 0.28 * light))
    # pores: small dark pits
    vo = N.new("ShaderNodeTexVoronoi")
    vo.feature = "F1"
    vo.inputs["Scale"].default_value = 38.0
    L.new(stretch.outputs["Vector"], vo.inputs["Vector"])
    pit = N.new("ShaderNodeMapRange")
    pit.inputs["From Min"].default_value = 0.0
    pit.inputs["From Max"].default_value = 0.09
    pit.inputs["To Min"].default_value = 1.0
    pit.inputs["To Max"].default_value = 0.0
    L.new(vo.outputs["Distance"], pit.inputs["Value"])
    col = mix_rgb(N, L, math_node(N, L, "MULTIPLY", pit.outputs[0], 0.55), col, (0.5 * light, 0.43 * light, 0.33 * light))
    height = math_node(N, L, "MULTIPLY", pit.outputs[0], -1.0)
    if joints:
        br = N.new("ShaderNodeTexBrick")
        br.offset = 0.5
        br.inputs["Scale"].default_value = 1.0
        br.inputs["Mortar Size"].default_value = 0.0035
        br.inputs["Mortar Smooth"].default_value = 0.2
        br.inputs["Brick Width"].default_value = joints[0]
        br.inputs["Row Height"].default_value = joints[1]
        br.inputs["Color1"].default_value = (1, 1, 1, 1)
        br.inputs["Color2"].default_value = (0.86, 0.84, 0.82, 1)
        br.inputs["Bias"].default_value = 0.0
        br.inputs["Mortar"].default_value = (0, 0, 0, 1)
        L.new(uv, br.inputs["Vector"])
        # each panel its own shade (Color1/Color2 alternate per brick), the joint a fine dark line
        col = mix_rgb(N, L, 1.0, col, br.outputs["Color"], "MULTIPLY")
        jt = math_node(N, L, "SUBTRACT", 1.0, br.outputs["Fac"])
        col = mix_rgb(N, L, math_node(N, L, "MULTIPLY", jt, 0.45), col, (0.5 * light, 0.42 * light, 0.32 * light))
        height = math_node(N, L, "ADD", height, math_node(N, L, "MULTIPLY", jt, -2.0))
    L.new(col, b.inputs["Base Color"])
    rn = math_node(N, L, "MULTIPLY_ADD", nz.outputs["Fac"], 0.18, polish)
    L.new(rn, b.inputs["Roughness"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    bump.inputs["Distance"].default_value = 0.002
    L.new(height, bump.inputs["Height"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])
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
    geo = N.new("ShaderNodeNewGeometry")
    front = math_node(N, L, "SUBTRACT", 1.0, geo.outputs["Backfacing"])
    k = math_node(N, L, "MULTIPLY", fr.outputs[0], front)
    mix = N.new("ShaderNodeMixShader")
    L.new(k, mix.inputs[0])
    L.new(tr.outputs[0], mix.inputs[1])
    L.new(gl.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], N["Material Output"].inputs["Surface"])
    return m


def planks(name):
    """A teak ceiling: the veneer in boards 14 cm wide with a dark seam between them, a satin finish."""
    m = textured(name, "teak_veneer", 0.9, value=0.5, sat=1.15, rough=(0.35, 0.12))
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    br = N.new("ShaderNodeTexBrick")
    br.offset = 0.37
    br.inputs["Scale"].default_value = 1.0
    br.inputs["Brick Width"].default_value = 2.4
    br.inputs["Row Height"].default_value = 0.14
    br.inputs["Mortar Size"].default_value = 0.004
    br.inputs["Color1"].default_value = (1, 1, 1, 1)
    br.inputs["Color2"].default_value = (0.8, 0.78, 0.76, 1)
    br.inputs["Mortar"].default_value = (0.08, 0.05, 0.03, 1)
    L.new(ocoord(N, L, tc), br.inputs["Vector"])
    base = b.inputs["Base Color"].links[0].from_socket
    L.new(mix_rgb(N, L, 1.0, base, br.outputs["Color"], "MULTIPLY"), b.inputs["Base Color"])
    return m


def fabric(name, color, rough=0.92, bump=0.45, size=0.35, nmap="wool_boucle"):
    """Upholstery: a flat colour with a CC0 weave's normal map for the pile, and a little sheen."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
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


def loops(m, scale, strength, weave=False):
    """Procedural pile on top of a fabric: boucle loops (voronoi cells) or a jute weave (crossed bands)."""
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    oc = ocoord(N, L, tc)
    if weave:
        w1 = N.new("ShaderNodeTexWave")
        w1.bands_direction = "X"
        w1.inputs["Scale"].default_value = scale
        w2 = N.new("ShaderNodeTexWave")
        w2.bands_direction = "Y"
        w2.inputs["Scale"].default_value = scale
        L.new(oc, w1.inputs["Vector"])
        L.new(oc, w2.inputs["Vector"])
        h = math_node(N, L, "MAXIMUM", w1.outputs["Fac"], w2.outputs["Fac"])
    else:
        vo = N.new("ShaderNodeTexVoronoi")
        vo.inputs["Scale"].default_value = scale
        L.new(oc, vo.inputs["Vector"])
        h = math_node(N, L, "SUBTRACT", 1.0, vo.outputs["Distance"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = 0.004
    L.new(h, bump.inputs["Height"])
    old = b.inputs["Normal"].links[0].from_socket if b.inputs["Normal"].links else None
    if old is not None:
        L.new(old, bump.inputs["Normal"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])
    col = b.inputs["Base Color"].default_value[:3]
    L.new(mix_rgb(N, L, math_node(N, L, "MULTIPLY", h, 0.35), tuple(c * 0.78 for c in col), tuple(col)), b.inputs["Base Color"])
    return m


def pool_water():
    """Pool water: clear surface with fine ripples, an aqua body that deepens with depth."""
    m = bpy.data.materials.new("pool_water")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    inp(b, "Base Color", (1, 1, 1, 1))
    inp(b, "Roughness", 0.0)
    inp(b, "IOR", 1.333)
    inp(b, ["Transmission Weight", "Transmission"], 1.0)
    tc = N.new("ShaderNodeTexCoord")
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.4
    nz.inputs["Detail"].default_value = 6.0
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.05
    L.new(nz.outputs["Fac"], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])
    va = N.new("ShaderNodeVolumeAbsorption")
    va.inputs["Color"].default_value = (0.12, 0.84, 0.78, 1)
    va.inputs["Density"].default_value = 0.22
    L.new(va.outputs[0], N["Material Output"].inputs["Volume"])
    return m


def pool_tiles():
    """Small aqua glass mosaic for the pool's inside."""
    m = bpy.data.materials.new("pool_tiles")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(ocoord(N, L, tc), sep.inputs[0])
    comb = N.new("ShaderNodeCombineXYZ")
    L.new(math_node(N, L, "ADD", sep.outputs[0], sep.outputs[1]), comb.inputs[0])
    L.new(math_node(N, L, "ADD", sep.outputs[2], sep.outputs[1]), comb.inputs[1])
    br = N.new("ShaderNodeTexBrick")
    br.inputs["Scale"].default_value = 1.0
    br.inputs["Brick Width"].default_value = 0.05
    br.inputs["Row Height"].default_value = 0.05
    br.inputs["Mortar Size"].default_value = 0.0025
    br.inputs["Color1"].default_value = (0.5, 0.88, 0.85, 1)
    br.inputs["Color2"].default_value = (0.42, 0.82, 0.82, 1)
    br.inputs["Mortar"].default_value = (0.78, 0.85, 0.84, 1)
    br.offset = 0.0
    L.new(comb.outputs[0], br.inputs["Vector"])
    L.new(br.outputs["Color"], b.inputs["Base Color"])
    inp(b, "Roughness", 0.12)
    inp(b, ["Emission Color", "Emission"], (0.3, 0.95, 0.86, 1))
    inp(b, "Emission Strength", float(OPTS.get("pool_glow", 0.7)))
    return m


def ocean_mat():
    m = bpy.data.materials.new("ocean")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    inp(b, "Base Color", (0.015, 0.03, 0.045, 1))
    inp(b, "Roughness", 0.1)
    inp(b, "IOR", 1.2)
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.09, 0.22, 0.2)
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    n1 = N.new("ShaderNodeTexNoise")
    n1.inputs["Scale"].default_value = 1.0
    n1.inputs["Detail"].default_value = 8.0
    n1.inputs["Roughness"].default_value = 0.6
    L.new(mp.outputs["Vector"], n1.inputs["Vector"])
    mp2 = N.new("ShaderNodeMapping")
    mp2.inputs["Scale"].default_value = (0.8, 1.6, 1.0)
    L.new(tc.outputs["Object"], mp2.inputs["Vector"])
    n2 = N.new("ShaderNodeTexNoise")
    n2.inputs["Scale"].default_value = 1.0
    n2.inputs["Detail"].default_value = 4.0
    L.new(mp2.outputs["Vector"], n2.inputs["Vector"])
    h = math_node(N, L, "ADD", n1.outputs["Fac"], math_node(N, L, "MULTIPLY", n2.outputs["Fac"], 0.35))
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.5
    bump.inputs["Distance"].default_value = 0.6
    L.new(h, bump.inputs["Height"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def terrain_mat():
    """Limestone on the steep faces, dry scrub ground on the flats, blended by slope with a ragged edge."""
    m = bpy.data.materials.new("terrain")
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    b = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord")
    rc, rr, rn = tex_maps(N, L, "rock_boulder_dry", 3.2, tc.outputs["Object"], blend=0.35)
    gc, gr, gn = tex_maps(N, L, "aerial_grass_rock", 9.0, tc.outputs["Object"], blend=0.2)
    rc = mix_rgb(N, L, 1.0, rc, (1.0, 0.9, 0.74), "MULTIPLY")
    gc = mix_rgb(N, L, 1.0, gc, (0.92, 0.86, 0.72), "MULTIPLY")
    gc = mix_rgb(N, L, 0.55, gc, rc)
    geo = N.new("ShaderNodeNewGeometry")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(geo.outputs["Normal"], sep.inputs[0])
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 0.6
    nz.inputs["Detail"].default_value = 5.0
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    nzv = math_node(N, L, "MULTIPLY_ADD", nz.outputs["Fac"], 0.3, -0.15)
    flat = N.new("ShaderNodeMapRange")
    flat.inputs["From Min"].default_value = 0.72
    flat.inputs["From Max"].default_value = 0.86
    L.new(math_node(N, L, "ADD", sep.outputs[2], nzv), flat.inputs["Value"])
    k = flat.outputs[0]
    L.new(mix_rgb(N, L, k, rc, gc), b.inputs["Base Color"])
    ro = N.new("ShaderNodeMix")
    ro.data_type = "FLOAT"
    L.new(k, ro.inputs[0])
    L.new(rr, sock(ro, "A_Float"))
    L.new(gr, sock(ro, "B_Float"))
    L.new(sock(ro, "Result_Float", out=True), b.inputs["Roughness"])
    nmix = mix_rgb(N, L, k, rn, gn)
    nm = N.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = 1.4
    L.new(nmix, nm.inputs["Color"])
    L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def emissive(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    N.remove(N["Principled BSDF"])
    e = N.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    L.new(e.outputs[0], N["Material Output"].inputs["Surface"])
    return m


def shade_mat(name, color, glow, strength):
    """A lamp shade: lit fabric seen from outside, the bulb's glow showing through."""
    m = principled(name, color, 0.8)
    b = m.node_tree.nodes["Principled BSDF"]
    inp(b, ["Emission Color", "Emission"], (*glow, 1))
    inp(b, "Emission Strength", strength)
    return m


M = {
    "trav_floor": travertine("trav_floor", joints=None if FILM else (1.2, 0.6), axes="xy", polish=0.2),
    "trav_wall": travertine("trav_wall", joints=None if FILM else (1.8, 0.9), axes="wall", vein=0.3, wavy=2.5),
    "trav_slab": travertine("trav_slab", joints=None, axes="wall", light=1.07, polish=0.5, vein=0.2, wavy=2.0),
    "trav_soffit": travertine("trav_soffit", joints=None if FILM else (2.4, 1.2), axes="xy", light=1.04, polish=0.55, vein=0.2, wavy=2.0),
    "trav_furn": travertine("trav_furn", joints=None, axes="wall", light=0.98, polish=0.3, vein=0.45, wavy=3.0),
    "teak": textured("teak", "teak_veneer", 1.0, value=0.72, sat=1.05, rough=(0.6, 0.12)),
    "teak_ceiling": planks("teak_ceiling"),
    "deck": textured("deck", "wood_floor_deck", 1.8, rot=math.pi / 2, value=0.75, sat=0.9, rough=(1.0, 0.05)),
    "boucle": loops(fabric("boucle", (0.66, 0.56, 0.43), bump=1.2, size=0.13), 90.0, 0.7),
    "cushion": fabric("cushion", (0.86, 0.84, 0.8), bump=0.35, nmap="rough_linen", size=0.3),
    "jute": loops(fabric("jute", (0.46, 0.34, 0.2), rough=1.0, bump=1.2, size=0.12, nmap="rough_linen"), 55.0, 0.9, weave=True),
    "throw": fabric("throw", (0.36, 0.22, 0.14), bump=0.6, nmap="rough_linen", size=0.25),
    "black": principled("black_metal", (0.02, 0.02, 0.022), 0.35, 0.8),
    "frame": principled("window_frame", (0.035, 0.033, 0.03), 0.4, 0.5),
    "ceramic": principled("ceramic", (0.78, 0.7, 0.58), 0.55),
    "dark_ceramic": principled("dark_ceramic", (0.12, 0.08, 0.06), 0.45),
    "planter": textured("planter", "brushed_concrete", 1.2, value=0.8, sat=0.5, tint=(0.95, 0.9, 0.84), rough=(1.0, 0.0)),
    "art": principled("art", (0.55, 0.42, 0.26), 0.9),
    "glass": glass("glass"),
    "rail_glass": glass("rail_glass", (0.9, 0.96, 0.95)),
    "water": pool_water(),
    "pool_tiles": pool_tiles(),
    "ocean": ocean_mat(),
    "terrain": terrain_mat(),
    "fire": emissive("fire", (1.0, 0.45, 0.12), 25.0),
    "fire_box": principled("fire_box", (0.01, 0.01, 0.01), 0.6),
    "cove": emissive("cove", (1.0, 0.72, 0.45), 18.0),
    "downlight": emissive("downlight", (1.0, 0.82, 0.6), 30.0),
    "drum": shade_mat("drum_shade", (0.92, 0.86, 0.76), (1.0, 0.74, 0.46), 3.5),
    "lamp": shade_mat("lamp_shade", (0.9, 0.82, 0.7), (1.0, 0.7, 0.42), 6.0),
    "lantern": shade_mat("lantern", (0.95, 0.9, 0.82), (1.0, 0.72, 0.42), 9.0),
    "linen": fabric("linen", (0.86, 0.84, 0.8), bump=0.4, nmap="rough_linen", size=0.27),
}


# ---------------------------------------------------------------- geometry helpers (world metres, z up, the sea at +y)
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
    sx, sy, sz = abs(x1 - x0), abs(y1 - y0), abs(z1 - z0)
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


def slab(name, x0, x1, y0, y1, z0, z1, mat, tile=None, bevel=0.004, seg=2, mats=None, gap=0.003):
    """A slab: one box in the stills; in the film, cut into tiles (tw x th) that fly in one by one."""
    if not FILM or not tile:
        return box(name, x0, x1, y0, y1, z0, z1, mat, bevel=bevel, seg=seg, mats=mats)
    tw, th = tile
    nx, ny = max(1, round((x1 - x0) / tw)), max(1, round((y1 - y0) / th))
    out = []
    for i in range(nx):
        for j in range(ny):
            a0, a1 = x0 + (x1 - x0) * i / nx, x0 + (x1 - x0) * (i + 1) / nx
            b0, b1 = y0 + (y1 - y0) * j / ny, y0 + (y1 - y0) * (j + 1) / ny
            o = box(f"{name}_t", a0 + gap / 2, a1 - gap / 2, b0 + gap / 2, b1 - gap / 2, z0, z1, mat, bevel=min(bevel, 0.004), seg=1, mats=mats)
            o["ij"] = (i, j)
            out.append(o)
    return out


def wall(name, x0, x1, y0, y1, z0, z1, mat, seg=1.2, course=0.55, bevel=0.006):
    """A wall: one box in the stills; in the film, laid in running-bond blocks course by course."""
    if not FILM:
        return box(name, x0, x1, y0, y1, z0, z1, mat, bevel=bevel)
    along_x = (x1 - x0) >= (y1 - y0)
    a0, a1 = (x0, x1) if along_x else (y0, y1)
    nseg, nc = max(1, round((a1 - a0) / seg)), max(1, round((z1 - z0) / course))
    out = []
    for c in range(nc):
        za, zb = z0 + (z1 - z0) * c / nc, z0 + (z1 - z0) * (c + 1) / nc
        off = 0.5 if c % 2 else 0.0
        cuts = sorted({a0, a1} | {a0 + (a1 - a0) * (k + off) / nseg for k in range(1, nseg + 1) if a0 + 1e-6 < a0 + (a1 - a0) * (k + off) / nseg < a1 - 1e-6})
        for p_, q_ in zip(cuts, cuts[1:]):
            if along_x:
                o = box(f"{name}_b", p_ + 0.0015, q_ - 0.0015, y0, y1, za + 0.0015, zb - 0.0015, mat, bevel=0.003, seg=1)
            else:
                o = box(f"{name}_b", x0, x1, p_ + 0.0015, q_ - 0.0015, za + 0.0015, zb - 0.0015, mat, bevel=0.003, seg=1)
            o["course"] = c
            out.append(o)
    return out


def cyl(name, x, y, r, z0, z1, mat, verts=64, bevel=0.004, seg=2, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=z1 - z0)
    o = _obj(name, bm, [mat])
    o.location = (x, y, (z0 + z1) / 2)
    return _finish(o, min(bevel, 0.45 * min(r, z1 - z0)), seg)


def sphere(name, x, y, z, r, mat, squash=1.0):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=16, radius=r)
    for v in bm.verts:
        v.co.z *= squash
    o = _obj(name, bm, [mat])
    o.location = (x, y, z)
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def light(name, kind, loc, energy, color=(1.0, 0.78, 0.55), size=0.1, rot=(0, 0, 0), spot=None, size_y=None):
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


_variants = {}


def _ancestors(o):
    while o.parent:
        o = o.parent
        yield o


def model_variants(mid):
    """A Poly Haven 'set' file (a row of shrubs, grass clumps) split into its single plants, each its own source."""
    if mid in _variants:
        return _variants[mid]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=ASSETS[mid])
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    if len(roots) == 1 and len(roots[0].children) > 1:
        roots = list(roots[0].children)
    out = []
    used = set()
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
        pts = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
        mn = Vector((min(q.x for q in pts), min(q.y for q in pts), min(q.z for q in pts)))
        mx = Vector((max(q.x for q in pts), max(q.y for q in pts), max(q.z for q in pts)))
        out.append((coll, mn, mx))
    rest = bpy.data.collections.new(f"src_{mid}_rest")
    for o in new:
        if o.name not in used:
            for c in list(o.users_collection):
                c.objects.unlink(o)
            rest.objects.link(o)
    _variants[mid] = out
    return out


def place_variant(mid, x, y, z=0.0, yaw=0.0, height=None, k=None):
    vs = model_variants(mid)
    src, mn, mx = vs[random.randrange(len(vs)) if k is None else k % len(vs)]
    s = height / (mx.z - mn.z) if height else 1.0
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


def place_rot(mid, centre, euler, scale):
    """A model centred (by its bounds) at centre, turned by a full euler: rock chunks."""
    from mathutils import Euler
    src, mn, mx = model_src(mid)
    e = bpy.data.objects.new(mid, None)
    e.instance_type = "COLLECTION"
    e.instance_collection = src
    R = Euler(euler).to_matrix()
    off = (mn + mx) / 2 * scale
    e.location = Vector(centre) - R @ off
    e.rotation_euler = euler
    e.scale = (scale,) * 3
    return link(e)


def place(mid, x, y, z=0.0, yaw=0.0, scale=1.0, height=None):
    src, mn, mx = model_src(mid)
    s = height / (mx.z - mn.z) if height else scale
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


# ---------------------------------------------------------------- the headland
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


SEA = -34.0  # the sea's surface; the deck is at 0


def edge_y(x):
    """The cliff's top edge: straight-ish under the villa, the headland's flanks receding on both sides."""
    y = -0.35 + 0.5 * fbm(x, 3.0, 0.12, 3, 11.0)
    if x > 22:
        y -= 0.011 * (x - 22) ** 2
    if x < -30:
        y -= 0.0065 * (-30 - x) ** 2
    far = sstep(25, 90, abs(x - 0))
    return y + far * 9.0 * fbm(x, 0.0, 0.02, 3, 5.0)


def height(x, y):
    ye = edge_y(x)
    villa = sstep(-46, -32, x) * (1 - sstep(26, 40, x)) * sstep(-40, -28, y)
    top = -0.15 + (1 - villa) * (0.9 * fbm(x, y, 0.035, 4, 2.0) + 0.35 * fbm(x, y, 0.16, 3, 4.0) + 0.6)
    top += 16.0 * sstep(-60, -280, y) * (0.65 + 0.35 * fbm(x, y, 0.008, 3, 9.0))
    top += 3.0 * sstep(-30, -70, y) * (0.5 + 0.5 * fbm(x, y, 0.05, 3, 6.0))
    d = y - ye
    if d <= 0:
        return top
    warp = d + 1.6 * fbm(x, y, 0.11, 4, 21.0) + 0.6 * fbm(x, y, 0.45, 3, 23.0)
    k = max(0.0, min(1.0, warp / 8.0)) ** 0.62  # a crisp lip, then the face
    base = SEA - 4.0 + 3.0 * fbm(x, y, 0.05, 3, 25.0)
    z = top + (base - top) * k
    # crag ledges: steps in the face
    z += 1.2 * k * (1 - k) * 4 * fbm(x * 0.9, y + 40, 0.3, 3, 27.0)
    return z - 6.0 * sstep(10.0, 26.0, d)


def axis(a0, a1, step_at):
    v = [a0]
    while v[-1] < a1:
        v.append(min(a1, v[-1] + step_at(v[-1])))
    return v


def terrain():
    xs = axis(-420, 520, lambda x: 0.45 if -45 < x < 45 else min(8.0, 0.45 + (abs(x) - 45) * 0.025))
    ys = axis(-650, 140, lambda y: 0.38 if -4 < y < 16 else 0.9 if -45 < y <= -4 else min(6.0, 0.38 + (y - 16) * 0.15) if y >= 16 else min(10.0, 0.9 + (-45 - y) * 0.025))
    nx, ny = len(xs), len(ys)
    verts = [(x, y, height(x, y)) for y in ys for x in xs]
    faces = [(j * nx + i, j * nx + i + 1, (j + 1) * nx + i + 1, (j + 1) * nx + i) for j in range(ny - 1) for i in range(nx - 1)]
    me = bpy.data.meshes.new("headland")
    me.from_pydata(verts, [], faces)
    me.materials.append(M["terrain"])
    me.shade_smooth()
    print(f"terrain {nx} x {ny} = {nx * ny} verts")
    return link(bpy.data.objects.new("headland", me))


STAGE[0] = "site"
terrain()
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=60000)
sea = _obj("sea", bm, [M["ocean"]])
sea.location = (0, 0, SEA)

# ---------------------------------------------------------------- the villa: layout (x along the coast, the sea at +y)
PX0, PX1, PY0, PY1 = -11.0, 7.5, -1.6, 2.9   # the pool box, outside faces
PT = 0.32                                      # its wall thickness
PB = -1.85                                     # its underside
GX0, GX1, GY0, GY1 = -8.0, 14.0, -17.0, -7.0   # the pavilion: glass front at GY1
H1 = 3.3                                       # pavilion ceiling
R1 = (-13.5, 16.5, -18.0, -3.6, 3.3, 3.78)     # its roof slab
UX0, UX1, UY0, UY1 = 1.0, 15.0, -19.0, -11.2   # the upper volume: glass front at UY1
H2 = 3.78 + 3.0
R2 = (0.0, 16.6, -20.0, -9.4, H2, H2 + 0.4)

# the terrace and the floor inside are one travertine slab
STAGE[0] = "terrace"
slab("terrace", -26.0, 18.5, -22.0, PY0, -0.55, 0.0, M["trav_floor"], tile=(1.2, 1.2), bevel=0.01)
STAGE[0] = "deck"
slab("deck", 0.4, 13.6, -6.3, -2.4, 0.0, 0.035, M["deck"], tile=(13.2, 0.15), bevel=0.004)

# the pool: a travertine box, its inside in mosaic, the sea-side wall a hair under the water line
STAGE[0] = "pool_floor"
slab("pool_floor", PX0, PX1, PY0, PY1, PB, PB + 0.3, M["trav_wall"], tile=(2.3, 1.5), bevel=0.008)
STAGE[0] = "pool_walls"
for nm, a in (("pool_back", (PX0, PX1, PY0, PY0 + PT, 0.0)), ("pool_front", (PX0, PX1, PY1 - PT, PY1, -0.03)),
              ("pool_end_l", (PX0, PX0 + PT, PY0, PY1, 0.0)), ("pool_end_r", (PX1 - PT, PX1, PY0, PY1, 0.0))):
    wall(nm, a[0], a[1], a[2], a[3], PB + 0.3, a[4], M["trav_wall"], seg=1.85, course=0.52)
ix0, ix1, iy0, iy1 = PX0 + PT, PX1 - PT, PY0 + PT, PY1 - PT
STAGE[0] = "pool_trim"
box("pool_lining_floor", ix0, ix1, iy0, iy1, PB + 0.3, PB + 0.32, M["pool_tiles"], bevel=0.0)
for a in ((ix0, ix1, iy0, iy0 + 0.02), (ix0, ix1, iy1 - 0.02, iy1), (ix0, ix0 + 0.02, iy0, iy1), (ix1 - 0.02, ix1, iy0, iy1)):
    box("pool_lining", *a, PB + 0.32, -0.04 if a[3] == iy1 else -0.02, M["pool_tiles"], bevel=0.0)
box("pool_coping", PX0, PX1, PY0, PY0 + PT, -0.02, 0.0, M["trav_slab"], bevel=0.004)
STAGE[0] = "water"
WATER = box("pool_water", ix0 + 0.02, ix1 - 0.02, iy0 + 0.02, PY1 - 0.005, PB + 0.32, -0.025, M["water"], bevel=0.0)
STAGE[0] = "lights"
for k in range(7):
    x = ix0 + (ix1 - ix0) * (k + 0.5) / 7
    light("pool_light", "AREA", (x, iy0 + 0.06, -0.62), float(OPTS.get("pool", 220)), (0.55, 1.0, 0.9), 0.18, rot=(math.pi / 2, 0, 0))
# warm uplights on the cliff face under the box
for x in (-9.0, -3.5, 2.0, 6.0):
    light("cliff_up", "SPOT", (x, PY1 + 0.6, PB - 2.5), 220, (1.0, 0.7, 0.42), 0.15, rot=(math.radians(-150), 0, 0), spot=(70, 0.6))

# the pavilion: glass on the sea side, a travertine wall at each end and at the back
STAGE[0] = "walls"
wall("wall_back", GX0 - 0.4, GX1 + 0.4, GY0 - 0.4, GY0, 0.0, H1, M["trav_wall"])
wall("wall_left", GX0 - 0.4, GX0, GY0 - 0.4, GY1 + 0.25, 0.0, H1, M["trav_wall"])
wall("wall_right", GX1, GX1 + 0.4, GY0 - 0.4, GY1 + 0.6, 0.0, H1, M["trav_wall"])
STAGE[0] = "ceiling"
slab("ceiling_teak", GX0, GX1, GY0, GY1, H1 - 0.03, H1 - 0.001, M["teak_ceiling"], tile=(2.5, 1.25), bevel=0.0)
STAGE[0] = "roof"
slab("roof", R1[0], R1[1], R1[2], R1[3], R1[4], R1[5], M["trav_slab"], tile=(2.5, 1.2), bevel=0.01, mats=[M["trav_slab"], M["trav_slab"], M["trav_soffit"]])
# the upper volume and its roof
STAGE[0] = "roof_terrace"
slab("roof_terrace", UX0 - 0.35, R1[1] - 0.1, UY1, R1[3] - 0.1, R1[5], R1[5] + 0.03, M["trav_floor"], tile=(1.2, 1.2), bevel=0.0)
STAGE[0] = "upper_walls"
wall("up_back", UX0, UX1, UY0 - 0.35, UY0, R1[5], H2, M["trav_wall"])
wall("up_left", UX0 - 0.35, UX0, UY0 - 0.35, UY1 + 0.2, R1[5], H2, M["trav_wall"])
wall("up_right", UX1, UX1 + 0.35, UY0 - 0.35, UY1 + 0.2, R1[5], H2, M["trav_wall"])
STAGE[0] = "upper_roof"
slab("up_ceiling", UX0, UX1, UY0, UY1, H2 - 0.03, H2 - 0.001, M["teak_ceiling"], tile=(2.5, 1.25), bevel=0.0)
slab("up_roof", R2[0], R2[1], R2[2], R2[3], R2[4], R2[5], M["trav_slab"], tile=(2.5, 1.2), bevel=0.01, mats=[M["trav_slab"], M["trav_slab"], M["trav_soffit"]])


def glazing(name, x0, x1, y, z0, z1, n, open_=(), stage="glass"):
    """A run of floor-to-ceiling sliding panels with slim black frames; panels in open_ are slid behind their neighbour."""
    STAGE[0] = stage
    w = (x1 - x0) / n
    opened = {k for k, _, _ in open_}
    for k in range(n + 1):
        if k in opened and (k - 1) in opened:
            continue
        x = x0 + k * w
        box(f"{name}_mullion", x - 0.03, x + 0.03, y - 0.07, y + 0.07, z0, z1, M["frame"], bevel=0.003)
    box(f"{name}_sill", x0, x1, y - 0.08, y + 0.08, z0 - 0.01, z0 + 0.035, M["frame"], bevel=0.003)
    box(f"{name}_head", x0, x1, y - 0.08, y + 0.08, z1 - 0.06, z1, M["frame"], bevel=0.003)
    slide = {k: (to, track) for k, to, track in open_}
    for k in range(n):
        a = x0 + k * w
        if k in slide:  # slid onto panel slot `to`, on inner track 1 or 2
            to, track = slide[k]
            a, dy = x0 + to * w + 0.04 * track, -0.11 * track
        else:
            dy = 0.0
        box(f"{name}_pane", a + 0.03, a + w - 0.03, y + dy - 0.006, y + dy + 0.006, z0 + 0.035, z1 - 0.06, M["glass"], bevel=0.0)
        if k in slide:
            for xx in (a + 0.03, a + w - 0.03):
                box(f"{name}_stile", xx - 0.025, xx + 0.025, y + dy - 0.03, y + dy + 0.03, z0 + 0.035, z1 - 0.06, M["frame"], bevel=0.002)


glazing("front", GX0, GX1, GY1, 0.0, H1 - 0.03, 7, open_=((1, 0, 1), (2, 0, 2), (3, 5, 1), (4, 5, 2)))
glazing("upper", UX0, UX1, UY1, R1[5], H2 - 0.03, 5, stage="upper_glass")
# the roof terrace's glass rail
STAGE[0] = "rail"
for (x0, x1, y0, y1) in ((UX0 - 0.35, R1[1] - 0.12, R1[3] - 0.13, R1[3] - 0.11), (R1[1] - 0.13, R1[1] - 0.11, UY1, R1[3] - 0.11)):
    box("rail", x0, x1, y0, y1, R1[5] + 0.03, R1[5] + 1.05, M["rail_glass"], bevel=0.0)
    box("rail_shoe", x0, x1, y0 - 0.03, y1 + 0.03, R1[5] + 0.03, R1[5] + 0.09, M["frame"], bevel=0.003)

# ---------------------------------------------------------------- light: soffit downlights, coves, the interior glow
STAGE[0] = "lights"
for k in range(10):
    x = R1[0] + 1.6 + k * (R1[1] - R1[0] - 3.2) / 9
    cyl("soffit_light", x, -5.0, 0.05, R1[4] - 0.005, R1[4] + 0.002, M["downlight"], bevel=0.0)
    light("soffit_spot", "SPOT", (x, -5.0, R1[4] - 0.02), 45, (1.0, 0.76, 0.5), 0.04, spot=(80, 0.7))
box("cove_back", GX0 + 0.2, GX1 - 0.2, GY0 + 0.02, GY0 + 0.06, H1 - 0.12, H1 - 0.08, M["cove"], bevel=0.0)
box("cove_up", UX0 + 0.2, UX1 - 0.2, UY0 + 0.02, UY0 + 0.06, H2 - 0.12, H2 - 0.08, M["cove"], bevel=0.0)
FILL = []
for x in (-4.0, 1.5, 7.5, 11.5):
    FILL += [None]
    FILL[-1] = light("room_fill", "AREA", (x, -12.0, H1 - 0.06), float(OPTS.get("room", 650)), (1.0, 0.74, 0.48), 1.6, size_y=3.0)
for x in (4.5, 11.0):
    light("bedroom_fill", "AREA", (x, -15.0, H2 - 0.06), float(OPTS.get("room", 650)) * 0.8, (1.0, 0.72, 0.46), 1.6, size_y=3.0)

# ---------------------------------------------------------------- the living room (ref: a modular boucle sofa facing the sea)
STAGE[0] = "furniture"
box("rug", -5.1, 1.3, -13.4, -9.1, 0.0, 0.016, M["jute"], bevel=0.006)
SY0, SY1 = -13.0, -11.9  # the sofa run, its back at SY0
box("sofa_seat", -4.6, 0.2, SY0, SY1, 0.06, 0.44, M["boucle"], bevel=0.14, seg=6)
box("sofa_back", -4.6, 0.2, SY0, SY0 + 0.36, 0.44, 0.8, M["boucle"], bevel=0.15, seg=6)
box("sofa_chaise", -4.6, -3.45, SY1 - 0.02, SY1 + 1.25, 0.06, 0.44, M["boucle"], bevel=0.14, seg=6)
box("sofa_arm", -4.6, -4.25, SY0, SY1, 0.44, 0.66, M["boucle"], bevel=0.14, seg=6)
for x0 in (-3.95, -2.55, -1.15):
    box("sofa_cushion", x0, x0 + 1.3, SY0 + 0.26, SY0 + 0.52, 0.44, 0.92, M["boucle"], bevel=0.13, seg=6)
obox("sofa_throw", (-2.2, SY1 - 0.35, 0.47), (0.9, 0.8, 0.045), (0, 0, 0.12), M["throw"], bevel=0.02, seg=3)
box("ottoman", 0.6, 1.8, -11.4, -10.5, 0.06, 0.44, M["boucle"], bevel=0.14, seg=6)
cyl("pouf", 2.0, -9.4, 0.38, 0.0, 0.42, M["boucle"], bevel=0.15, seg=6)
cyl("coffee_drum", -1.6, -10.3, 0.72, 0.0, 0.36, M["trav_furn"], bevel=0.02, seg=3)
STAGE[0] = "decor"
place("ceramic_vase_01", -1.75, -10.25, z=0.36, height=0.42)
cyl("bowl", -1.2, -10.55, 0.16, 0.36, 0.43, M["dark_ceramic"], r2=0.2, bevel=0.01)
box("books", -2.2, -1.75, -10.25, -9.95, 0.36, 0.42, M["linen"], bevel=0.004)
# the end wall: a linear fire and a lit niche (ref: travertine wall, fire low, a mushroom lamp)
STAGE[0] = "builtin"
box("fire_recess", GX0, GX0 + 0.06, -12.9, -11.1, 0.28, 0.72, M["fire_box"], bevel=0.0)
box("fire", GX0 + 0.04, GX0 + 0.07, -12.7, -11.3, 0.32, 0.4, M["fire"], bevel=0.0)
light("fire_glow", "AREA", (GX0 + 0.3, -12.0, 0.45), 60, (1.0, 0.5, 0.2), 0.6, rot=(0, -math.pi / 2, 0))
box("niche_shelf", GX0, GX0 + 0.42, -9.8, -8.4, 0.95, 1.0, M["trav_furn"], bevel=0.004)
cyl("lamp_base", GX0 + 0.22, -9.0, 0.05, 1.0, 1.32, M["ceramic"], bevel=0.01)
sphere("lamp_shade", GX0 + 0.22, -9.0, 1.36, 0.17, M["lamp"], squash=0.55)
light("lamp_light", "POINT", (GX0 + 0.3, -9.0, 1.3), 25, (1.0, 0.7, 0.42), 0.08)
box("art", -5.5, -2.5, GY0 + 0.0, GY0 + 0.04, 1.2, 2.7, M["art"], bevel=0.004)
# dining: a teak table under a drum pendant, boucle chairs
STAGE[0] = "furniture"
box("dining_top", 5.4, 9.4, -12.6, -11.0, 0.72, 0.78, M["teak"], bevel=0.01, seg=3)
for x in (5.8, 9.0):
    box("dining_leg", x - 0.1, x + 0.1, -12.2, -11.4, 0.0, 0.72, M["teak"], bevel=0.006)
for x in (6.0, 7.4, 8.8):
    for y, s in ((-13.1, 1), (-10.5, -1)):
        box("chair_seat", x - 0.25, x + 0.25, y - 0.24, y + 0.24, 0.42, 0.5, M["boucle"], bevel=0.05, seg=4)
        box("chair_back", x - 0.25, x + 0.25, y - s * 0.24 - 0.04 * s, y - s * 0.24 + 0.03 * s, 0.5, 0.86, M["boucle"], bevel=0.035, seg=4)
        for dx in (-0.2, 0.2):
            for dy in (-0.19, 0.19):
                box("chair_leg", x + dx - 0.018, x + dx + 0.018, y + dy - 0.018, y + dy + 0.018, 0.0, 0.42, M["teak"], bevel=0.004)
STAGE[0] = "decor"
cyl("drum_pendant", 7.4, -11.8, 0.6, 1.85, 2.15, M["drum"], bevel=0.01)
cyl("pendant_cord", 7.4, -11.8, 0.006, 2.15, H1 - 0.03, M["black"], bevel=0.0)
light("drum_light", "POINT", (7.4, -11.8, 1.95), 90, (1.0, 0.74, 0.46), 0.3)
# the kitchen: a travertine island and a teak wall of tall units
STAGE[0] = "builtin"
box("island", 5.0, 9.8, -15.4, -14.4, 0.0, 0.92, M["trav_furn"], bevel=0.008)
box("units", 3.6, 13.4, GY0, GY0 + 0.62, 0.0, 2.6, M["teak"], bevel=0.004)
for k in range(1, 8):
    x = 3.6 + k * (13.4 - 3.6) / 8
    box("unit_seam", x - 0.003, x + 0.003, GY0 + 0.6, GY0 + 0.625, 0.02, 2.58, M["black"], bevel=0.0)
# the bedroom upstairs: a low bed facing the sea, 2 lamps
STAGE[0] = "furniture"
z2 = R1[5]
box("bed_plinth", 5.4, 7.6, UY0 + 0.12, -16.2, z2, z2 + 0.18, M["teak"], bevel=0.008)
box("mattress", 5.5, 7.5, UY0 + 0.16, -16.3, z2 + 0.18, z2 + 0.42, M["linen"], bevel=0.05, seg=4)
box("headboard", 5.1, 7.9, UY0, UY0 + 0.12, z2, z2 + 1.15, M["boucle"], bevel=0.05, seg=4)
for x in (4.6, 8.4):
    cyl("bed_lamp_base", x, -18.4, 0.06, z2 + 0.5, z2 + 0.85, M["ceramic"], bevel=0.01)
    sphere("bed_lamp", x, -18.4, z2 + 0.92, 0.16, M["lamp"], squash=0.7)
    light("bed_lamp_light", "POINT", (x, -18.2, z2 + 0.9), 18, (1.0, 0.68, 0.4), 0.06)
    box("bed_side", x - 0.25, x + 0.25, -18.7, -18.1, z2, z2 + 0.5, M["trav_furn"], bevel=0.006)
# the roof terrace: 2 lounge chairs round a low table
STAGE[0] = "roof_furniture"
for x, yaw in ((6.0, 0.2), (8.4, -0.2)):
    obox("roof_chair", (x, -6.2, z2 + 0.22), (0.8, 0.85, 0.36), (0, 0, yaw), M["cushion"], bevel=0.08, seg=4)
    obox("roof_chair_back", (x + 0.0, -6.62, z2 + 0.55), (0.8, 0.2, 0.5), (0.15, 0, yaw), M["cushion"], bevel=0.08, seg=4)
cyl("roof_table", 7.2, -5.2, 0.4, z2, z2 + 0.32, M["trav_furn"], bevel=0.02)


# ---------------------------------------------------------------- the deck: 4 loungers on teak bases, side drums with lanterns
def lounger(x, y0):
    """Head at y0 (by the house), foot toward the pool."""
    STAGE[0] = "outdoor"
    L_, W_ = 2.05, 0.86
    box("lounger_base", x - W_ / 2, x + W_ / 2, y0, y0 + L_, 0.035, 0.27, M["teak"], bevel=0.012, seg=3)
    box("lounger_mat", x - W_ / 2 + 0.03, x + W_ / 2 - 0.03, y0 + 0.62, y0 + L_ - 0.03, 0.27, 0.42, M["cushion"], bevel=0.05, seg=4)
    a = -math.radians(32)  # the head end raised
    cy, cz = y0 + 0.36, 0.6
    obox("lounger_back", (x, cy, cz), (W_ - 0.06, 0.72, 0.15), (a, 0, 0), M["cushion"], bevel=0.05, seg=4)
    obox("lounger_frame", (x, cy - 0.04, cz - 0.1), (W_ - 0.1, 0.66, 0.05), (a, 0, 0), M["teak"], bevel=0.008)
    bol = cyl("bolster", x, y0 + 0.72, 0.09, -0.32, 0.32, M["cushion"], bevel=0.05, seg=4)
    bol.rotation_euler = (0, math.pi / 2, 0)
    bol.location = (x, y0 + 0.3, 0.88)


for k, x in enumerate((1.6, 4.4, 7.2, 10.0)):
    lounger(x, -6.0)
    if k < 3:
        STAGE[0] = "outdoor"
        cyl("side_drum", x + 1.4, -5.4, 0.22, 0.035, 0.42, M["trav_furn"], bevel=0.02)
        sphere("lantern", x + 1.4, -5.4, 0.53, 0.11, M["lantern"], squash=0.9)
        light("lantern_light", "POINT", (x + 1.4, -5.4, 0.55), 6, (1.0, 0.7, 0.4), 0.05)

# the outdoor table at the far end, by the edge
STAGE[0] = "outdoor"
box("out_table", -22.6, -18.6, -6.2, -4.8, 0.72, 0.77, M["teak"], bevel=0.01)
for x in (-22.2, -19.0):
    box("out_table_leg", x - 0.08, x + 0.08, -5.9, -5.1, 0.0, 0.72, M["teak"], bevel=0.005)
for x in (-22.0, -20.6, -19.2):
    for y in (-6.75, -4.25):
        box("out_chair", x - 0.26, x + 0.26, y - 0.25, y + 0.25, 0.0, 0.46, M["teak"], bevel=0.02)
        box("out_chair_pad", x - 0.24, x + 0.24, y - 0.23, y + 0.23, 0.46, 0.52, M["cushion"], bevel=0.02)

# ---------------------------------------------------------------- planting: olive trees, grasses, boulders, scrub
STAGE[0] = "plants"
box("bed_planting", PX1 + 0.6, 15.0, PY0 - 0.2, -0.75, -0.55, 0.12, M["trav_slab"], bevel=0.01)
cyl("olive_planter", 15.6, -3.0, 0.75, 0.0, 0.9, M["planter"], bevel=0.03, seg=3)
place("island_tree_02", 15.6, -3.0, z=0.85, yaw=40, height=4.6)
place("island_tree_01", 11.2, -1.2, z=0.1, yaw=200, height=5.2)
place("island_tree_03", -16.5, -14.0, z=0.0, yaw=120, height=5.0)
place("island_tree_02", 19.5, -17.0, z=0.0, yaw=300, height=5.8)
place("island_tree_01", -24.0, -20.0, z=0.0, yaw=10, height=6.0)
for (x, y, s, yaw) in ((9.0, -1.0, 0.9, 30), (12.8, -1.5, 0.7, 140), (13.9, -0.9, 0.55, 260)):
    place("boulder_01", x, y, z=0.05, yaw=yaw, height=s)
for k in range(46):
    place_variant("grass_medium_01", random.uniform(PX1 + 0.8, 14.8), random.uniform(PY0 - 0.1, -0.85), z=0.1, yaw=random.uniform(0, 360), height=random.uniform(0.55, 0.95))
cyl("inside_planter", GX1 - 1.0, GY1 - 1.0, 0.45, 0.0, 0.62, M["planter"], bevel=0.03)
place("island_tree_03", GX1 - 1.0, GY1 - 1.0, z=0.6, yaw=70, height=2.2)
# scrub on the plateau and on the cliff's ledges, kept off the build
STAGE[0] = "site"
SHRUBS = ("shrub_01", "shrub_03", "shrub_04", "fern_02", "crystalline_iceplant")
n = 0
for k in range(9000):
    x, y = (random.uniform(-160, 200), random.uniform(-140, 30)) if k % 4 else (random.uniform(-40, 40), random.uniform(-3.0, 4.0))
    if -30 < x < 24 and -26 < y < PY0 + 0.2:
        continue
    if PX0 - 1.0 < x < PX1 + 1.0 and y < PY1 + 1.0:
        continue
    z = height(x, y)
    if z < SEA + 1.5:
        continue
    gx = (height(x + 0.5, y) - height(x - 0.5, y))
    gy = (height(x, y + 0.5) - height(x, y - 0.5))
    slope = math.hypot(gx, gy)
    ye = edge_y(x)
    ledge = y > ye - 0.5
    if slope > (2.2 if ledge else 0.9):
        continue
    if not ledge and random.random() < 0.45:
        continue
    near = -45 < x < 45 and y > -4
    if near:  # by the house: low scrub only, nothing leggy in front of the pool box
        mid = random.choice(("shrub_04", "crystalline_iceplant", "grass_medium_01", "fern_02"))
        hgt = random.uniform(0.25, 0.6)
    else:
        mid = random.choice(SHRUBS[:3]) if ledge else random.choice(SHRUBS)
        hgt = random.uniform(0.6, 1.6) * (1.0 if mid.startswith("shrub") else 0.5)
    place_variant(mid, x, y, z=z - 0.08, yaw=random.uniform(0, 360), height=hgt)
    n += 1
for k in range(60):
    x, y = random.uniform(-120, 160), random.uniform(-160, -26)
    if -30 < x < 24 and y > -26:
        continue
    place(random.choice(("island_tree_01", "island_tree_02", "island_tree_03")), x, y, z=height(x, y) - 0.2, yaw=random.uniform(0, 360), height=random.uniform(4.0, 7.5))
print(f"scrub {n}")

from mathutils import Euler
_vcache = {}


def _verts(mid):
    """every 8th vertex of a model, in its import space (for the turned-top check)"""
    if mid not in _vcache:
        src, _, _ = model_src(mid)
        vs = []
        for o in src.all_objects:
            if o.type == "MESH":
                mw = o.matrix_world
                vs += [mw @ o.data.vertices[i].co for i in range(0, len(o.data.vertices), 8)]
        _vcache[mid] = vs
    return _vcache[mid]


# the cliff dressed in scanned limestone: chunks set into the face in 3 rows, kept under the deck near the house
STAGE[0] = "site"
rr = random.Random(3)
chunks = 0
x = -95.0
while x < 95.0:
    for zc, sc in ((-5.5, (2.2, 3.0)), (-15.0, (3.2, 4.6)), (-26.0, (3.6, 5.2))):
        xx = x + rr.uniform(-2.0, 2.0)
        mid = rr.choice(("rock_face_01", "rock_face_01", "rock_face_02"))
        s_ = rr.uniform(*sc) * (1.0 if mid == "rock_face_01" else 1.75)
        _, mn, mx = model_src(mid)
        zz = zc + rr.uniform(-2.0, 2.0)
        # the scans face -y and up (rock_face_01 at 45 deg, _02 at 34): tilt the face upright, then turn it to the
        # coast's outward normal so the open back goes into the cliff
        tilt = math.radians(45.0 if mid == "rock_face_01" else 34.0)
        slope = (edge_y(xx + 1.0) - edge_y(xx - 1.0)) / 2.0
        yaw = math.atan2(1.0, -slope) - math.pi / 2 + math.pi
        amt = rr.uniform(0.1, 1.5)
        eul = (tilt + rr.uniform(-0.15, 0.15), rr.uniform(-0.12, 0.12), yaw + rr.uniform(-0.3, 0.3))
        # the turned scan's real top (its vertices, not its upright bounds) stays under the deck, and well under the
        # pool box: an upright-bounds check let tilted chunks poke up through the pool's floor
        R = Euler(eul).to_matrix()
        c0 = (mn + mx) / 2
        top = max((R @ ((v - c0) * s_)).z for v in _verts(mid))
        cap = -2.6 if -15.0 < xx < 11.0 else -0.9
        if zz + top > cap:
            zz = cap - top
        ye = edge_y(xx)
        y = ye
        while y < ye + 25 and height(xx, y) > zz:
            y += 0.25
        # the scan is a sheet through its own centre: set it on the face, standing proud by up to 1.5 m
        out = Vector((-slope, 1.0, 0.0)).normalized() * amt
        place_rot(mid, (xx + out.x, y + out.y, zz), eul, s_)
        chunks += 1
    x += rr.uniform(6.0, 9.0)
for xx, rot in ((-58.0, 0.3), (-8.0, 2.1), (44.0, 4.0)):
    ye = edge_y(xx)
    place_rot("coast_rocks_01" if xx < 0 else "coast_rocks_02", (xx, ye + 16.0, SEA - 0.8), (0, 0, rot), 1.0)
print(f"cliff chunks {chunks}")


# ---------------------------------------------------------------- sky and sun: the HDRI's own sun found and turned to where the shot wants it
def hdri_sun(path):
    import numpy as np
    im = bpy.data.images.load(path, check_existing=True)
    w, h = im.size
    px = np.empty(w * h * 4, dtype=np.float32)
    im.pixels.foreach_get(px)
    lum = px.reshape(h, w, 4)[..., :3].sum(axis=2)
    r, c = np.unravel_index(int(lum.argmax()), lum.shape)
    u, v = (c + 0.5) / w, (r + 0.5) / h
    az = (u - 0.5) * 2 * math.pi  # Blender's equirect: u = atan2(d.y, -d.x) / 2pi + 0.5
    el = (v - 0.5) * math.pi
    return im, az, el


SUN_EL = math.radians(float(OPTS.get("sun_el", 2.2)))
world = bpy.data.worlds.new("sky")
scene.world = world
world.use_nodes = True
WN, WL = world.node_tree.nodes, world.node_tree.links
tc = WN.new("ShaderNodeTexCoord")
dirv = WN.new("ShaderNodeVectorMath")
dirv.operation = "NORMALIZE"
WL.new(tc.outputs["Generated"], dirv.inputs[0])
sepw = WN.new("ShaderNodeSeparateXYZ")
WL.new(dirv.outputs["Vector"], sepw.inputs[0])
# the gradient: burnt orange at the horizon, peach, a dusty rose high up (refs 1-4)
grad = WN.new("ShaderNodeMapRange")
grad.inputs["From Min"].default_value = -0.02
grad.inputs["From Max"].default_value = 0.8
WL.new(sepw.outputs[2], grad.inputs["Value"])
ramp = WN.new("ShaderNodeValToRGB")
cr = ramp.color_ramp
cr.interpolation = "EASE"
cr.elements[0].position = 0.0
cr.elements[0].color = (1.0, 0.26, 0.02, 1)
cr.elements[1].position = 1.0
cr.elements[1].color = (0.36, 0.42, 0.62, 1)
for pos, col in ((0.08, (1.0, 0.36, 0.05, 1)), (0.22, (1.0, 0.5, 0.18, 1)), (0.4, (0.98, 0.62, 0.42, 1)), (0.6, (0.78, 0.6, 0.62, 1)), (0.8, (0.52, 0.5, 0.66, 1))):
    e = cr.elements.new(pos)
    e.color = col
WL.new(grad.outputs[0], ramp.inputs["Fac"])
# the sun: a wide glow, a tight halo and the disc
sundot = WN.new("ShaderNodeVectorMath")
sundot.operation = "DOT_PRODUCT"
WL.new(dirv.outputs["Vector"], sundot.inputs[0])
SUNV = sundot.inputs[1]
dpos = math_node(WN, WL, "MAXIMUM", sundot.outputs["Value"], 0.0)
glow = math_node(WN, WL, "MULTIPLY", math_node(WN, WL, "POWER", dpos, 5.0), 0.55)
halo = math_node(WN, WL, "MULTIPLY", math_node(WN, WL, "POWER", dpos, 260.0), 2.2)
disc_r = math.cos(math.radians(0.85))
disc = math_node(WN, WL, "MULTIPLY", math_node(WN, WL, "GREATER_THAN", sundot.outputs["Value"], disc_r), 40.0)
sky_col = mix_rgb(WN, WL, glow, ramp.outputs["Color"], (1.0, 0.5, 0.16), "ADD")
sky_col = mix_rgb(WN, WL, halo, sky_col, (1.0, 0.62, 0.3), "ADD")
sky_col = mix_rgb(WN, WL, disc, sky_col, (1.0, 0.78, 0.5), "ADD")
# cloud streaks: noise on the dome projected flat, stretched along the horizon, lit warm underneath
proj = WN.new("ShaderNodeCombineXYZ")
inv = math_node(WN, WL, "DIVIDE", 1.0, math_node(WN, WL, "MAXIMUM", sepw.outputs[2], 0.02))
WL.new(math_node(WN, WL, "MULTIPLY", sepw.outputs[0], inv), proj.inputs[0])
WL.new(math_node(WN, WL, "MULTIPLY", sepw.outputs[1], inv), proj.inputs[1])
cmap = WN.new("ShaderNodeMapping")
cmap.inputs["Scale"].default_value = (0.2, 0.2, 1.0)
WL.new(proj.outputs[0], cmap.inputs["Vector"])
cn = WN.new("ShaderNodeTexNoise")
cn.inputs["Scale"].default_value = 1.2
cn.inputs["Detail"].default_value = 6.0
cn.inputs["Roughness"].default_value = 0.6
WL.new(cmap.outputs["Vector"], cn.inputs["Vector"])
cth = WN.new("ShaderNodeMapRange")
cth.inputs["From Min"].default_value = 0.55
cth.inputs["From Max"].default_value = 0.72
WL.new(cn.outputs["Fac"], cth.inputs["Value"])
band = WN.new("ShaderNodeMapRange")
band.inputs["From Min"].default_value = 0.02
band.inputs["From Max"].default_value = 0.09
WL.new(sepw.outputs[2], band.inputs["Value"])
band2 = WN.new("ShaderNodeMapRange")
band2.inputs["From Min"].default_value = 0.42
band2.inputs["From Max"].default_value = 0.2
WL.new(sepw.outputs[2], band2.inputs["Value"])
cl = math_node(WN, WL, "MULTIPLY", math_node(WN, WL, "MULTIPLY", cth.outputs[0], band.outputs[0]), band2.outputs[0])
cl = math_node(WN, WL, "MULTIPLY", cl, float(OPTS.get("clouds", 0.75)))
sky_col = mix_rgb(WN, WL, cl, sky_col, (1.0, 0.5, 0.3))
# under the horizon: the sea's own haze colour (only reflections and the far edge see it)
below = math_node(WN, WL, "LESS_THAN", sepw.outputs[2], 0.0)
sky_col = mix_rgb(WN, WL, below, sky_col, (0.62, 0.22, 0.06))
WL.new(sky_col, WN["Background"].inputs["Color"])
WN["Background"].inputs["Strength"].default_value = float(OPTS.get("sky", 0.7))
sun_d = bpy.data.lights.new("sun", "SUN")
sun_d.energy = float(OPTS.get("sun", 4.5))
sun_d.color = (1.0, 0.52, 0.24)
sun_d.angle = math.radians(1.0)
sun = bpy.data.objects.new("sun", sun_d)
ROOT.objects.link(sun)


def aim_sun(az_deg):
    """The sun (the sky's disc and glow, and the sun lamp) at azimuth az_deg (0 = +x, 90 = +y), SUN_EL up."""
    az = math.radians(az_deg)
    d = Vector((math.cos(az) * math.cos(SUN_EL), math.sin(az) * math.cos(SUN_EL), math.sin(SUN_EL)))
    SUNV.default_value = d
    sun.rotation_euler = d.to_track_quat("Z", "Y").to_euler()


# ---------------------------------------------------------------- shots
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


SHOT = {
    # ref 1: over the void at the pool's far end, the pool box and the house beyond, the sun low on the left
    "hero": dict(loc=vec("hero_loc", (-19.5, 7.6, 2.7)), target=vec("hero_at", (3.0, -4.5, 0.3)), lens=float(OPTS.get("hero_lens", 26)), shift_y=float(OPTS.get("hero_shift", -0.04)), sun=float(OPTS.get("hero_sun", -6))),
    # ref 2: from behind the sofa through the open panels to the pool and the sea, the sun right of centre
    "lounge": dict(loc=vec("lounge_loc", (2.6, -15.2, 1.05)), target=vec("lounge_at", (-3.2, -3.0, 0.75)), lens=float(OPTS.get("lounge_lens", 22)), shift_y=0.0, sun=float(OPTS.get("lounge_sun", 104)), ev=-0.6, room=140),
    # ref 3: down the deck, loungers right, pool left, the sun ahead-left
    "deck": dict(loc=vec("deck_loc", (-1.2, -4.9, 1.45)), target=vec("deck_at", (16.0, -1.6, 0.3)), lens=24, shift_y=0.0, sun=float(OPTS.get("deck_sun", 28))),
    # ref 4: wide side view, the whole house on its cliff
    "side": dict(loc=vec("side_loc", (34.0, 30.0, 2.0)), target=vec("side_at", (-2.0, -8.0, 0.0)), lens=30, shift_y=0.06, sun=float(OPTS.get("side_sun", 160))),
}
print(f"built in {time.time() - t0:.1f} s, {len(PARTS)} parts")
if OPTS.get("blend"):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "villa.blend"))
if OPTS.get("skyonly"):
    for o in scene.objects:
        o.hide_render = o.type not in ("CAMERA",) and o.name != "sun"
for s in ([] if FILM else SHOTS):
    c = SHOT[s]
    scene.camera = camera(s, c["loc"], c["target"], c["lens"], c["shift_y"])
    scene.view_settings.exposure = float(OPTS.get(f"{s}_ev", c.get("ev", 0.0)))
    for f in FILL:
        f.data.energy = float(OPTS.get(f"{s}_room", c.get("room", OPTS.get("room", 650))))
    aim_sun(c["sun"])
    scene.render.filepath = os.path.join(OUT, f"render_{s}{OPTS.get('tag', '')}.png")
    t1 = time.time()
    bpy.ops.render.render(write_still=True)
    print(f"{s}: rendered in {time.time() - t1:.1f} s")
