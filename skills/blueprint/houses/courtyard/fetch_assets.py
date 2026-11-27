"""Download the CC0 assets the Japanese courtyard house uses from Poly Haven into ~/.blueprint/polyhaven/<id>/ and merge them
into ~/.blueprint/polyhaven/assets.json (the apartment's and the villa's entries stay; anything already on disk is skipped).

Models come as glTF 2k with their textures, textures as 2k jpg maps (diffuse, GL normal, roughness).
Run: python houses/courtyard/fetch_assets.py
"""
import json
import os
import urllib.request

ROOT = os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven"))
UA = {"User-Agent": "japan-asset-fetch"}
# the maple is tree_small_02 with its leaves turned red in the shader; pines ring the site; moss, rocks and ferns fill the court
MODELS = ["tree_small_02", "pine_tree_01", "pine_sapling_medium", "fir_tree_01", "moss_01", "rock_moss_set_01", "rock_moss_set_02",
          "rock_07", "rock_09", "stone_01", "fern_02", "shrub_01", "shrub_02", "shrub_04", "boulder_01"]
TEXTURES = ["tatami_mat", "japanese_cedar_planks", "smoked_walnut_veneer", "american_walnut_veneer", "white_plaster_02", "white_stucco",
            "forest_leaves_02", "mossy_rock", "lichen_rock", "leaf_scattered_gravel", "japanese_stone_wall", "sakura_bark", "oak_veneer_01",
            "rough_linen", "concrete_wall_008"]


def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180).read()
    open(path, "wb").write(data)


def api(kind, i):
    return json.loads(urllib.request.urlopen(urllib.request.Request(f"https://api.polyhaven.com/{kind}/{i}", headers=UA), timeout=60).read())


path = os.path.join(ROOT, "assets.json")
meta = json.load(open(path)) if os.path.exists(path) else {}
for i in MODELS:
    if i in meta and os.path.exists(meta[i]):
        continue
    f = api("files", i).get("gltf", {}).get("2k", {}).get("gltf")
    if not f:
        print("model", i, "has no glTF, skipped")
        continue
    d = os.path.join(ROOT, i)
    get(f["url"], os.path.join(d, os.path.basename(f["url"])))
    for rel, inc in f.get("include", {}).items():
        get(inc["url"], os.path.join(d, rel))
    meta[i] = os.path.join(d, os.path.basename(f["url"]))
    print("model", i)
for i in TEXTURES:
    if i in meta and isinstance(meta[i], dict) and "diff" in meta[i]:
        continue
    f = api("files", i)
    d = os.path.join(ROOT, i)
    out = {}
    for key, name in [("Diffuse", "diff"), ("nor_gl", "nor"), ("Rough", "rough"), ("Displacement", "disp")]:
        if key in f and "2k" in f[key]:
            u = f[key]["2k"]["jpg"]["url"] if "jpg" in f[key]["2k"] else f[key]["2k"]["png"]["url"]
            p = os.path.join(d, f"{name}{os.path.splitext(u)[1]}")
            get(u, p)
            out[name] = p
    out["dims_mm"] = api("info", i).get("dimensions")
    meta[i] = out
    print("texture", i, out.get("dims_mm"))
json.dump(meta, open(path, "w"), indent=1)
print("done")
