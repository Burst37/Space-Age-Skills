"""Download the CC0 assets the cliff villa uses from Poly Haven into ~/.blueprint/polyhaven/<id>/ and merge them into
~/.blueprint/polyhaven/assets.json (the apartment's assets stay; anything already on disk is skipped).

Models come as glTF 2k with their textures, textures as 2k jpg maps (diffuse, GL normal, roughness), skies as 2k HDR.
Run: python houses/villa/fetch_assets.py
"""
import json
import os
import urllib.request

ROOT = os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven"))
UA = {"User-Agent": "villa-asset-fetch"}
MODELS = ["island_tree_01", "island_tree_02", "island_tree_03", "shrub_01", "shrub_03", "shrub_04", "fern_02", "rock_face_01",
          "rock_face_02", "coast_rocks_01", "coast_rocks_02", "boulder_01", "planter_box_01", "planter_pot_clay", "sofa_02", "sofa_03",
          "vintage_day_bed", "bar_chair_round_01", "crystalline_iceplant", "grass_medium_01"]
TEXTURES = ["rock_boulder_dry", "teak_veneer", "cliff_side", "coast_land_rocks_01", "aerial_grass_rock", "clay_plaster", "brushed_concrete", "concrete_wall_008",
            "mixed_stone_tiles", "large_sandstone_blocks_01", "coast_sand_01", "concrete_tiles"]
HDRI = ["qwantani_sunset_puresky", "qwantani_dusk_2_puresky"]


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
for i in HDRI:
    u = api("files", i)["hdri"]["2k"]["hdr"]["url"]
    p = os.path.join(ROOT, i, os.path.basename(u))
    get(u, p)
    meta[i] = p
    print("hdri", i)
json.dump(meta, open(path, "w"), indent=1)
print("done")
