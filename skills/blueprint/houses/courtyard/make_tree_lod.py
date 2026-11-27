"""Light copies of the Poly Haven conifers for the film: their branch tubes run to 2-7 million polygons each, which with
motion blur peaks the 8 GB card. Each model is decimated (collapse) and saved as <id>_lod.glb beside the original, and
assets.json gets an '<id>_lod' entry. The stills keep the full trees.

  blender -b --factory-startup -P houses/courtyard/make_tree_lod.py -- 0.12
"""
import json
import os
import sys

import bpy

RATIO = float(sys.argv[sys.argv.index("--") + 1]) if "--" in sys.argv and len(sys.argv) > sys.argv.index("--") + 1 else 0.12
PATH = os.path.join(os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven")), "assets.json")
A = json.load(open(PATH))
for mid in ("pine_tree_01", "fir_tree_01", "pine_sapling_medium"):
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.import_scene.gltf(filepath=A[mid])
    before = after = 0
    for o in bpy.data.objects:
        if o.type != "MESH":
            continue
        n = len(o.data.polygons)
        before += n
        if n > 20000:
            m = o.modifiers.new("lod", "DECIMATE")
            m.ratio = RATIO
            bpy.context.view_layer.objects.active = o
            with bpy.context.temp_override(object=o, active_object=o):
                bpy.ops.object.modifier_apply(modifier="lod")
        after += len(o.data.polygons)
    out = os.path.join(os.path.dirname(A[mid]), f"{mid}_lod.glb")
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_selection=False)
    A[mid + "_lod"] = out
    print(f"LOD {mid}: {before} -> {after} polygons -> {out}", flush=True)
json.dump(A, open(PATH, "w"), indent=1)
