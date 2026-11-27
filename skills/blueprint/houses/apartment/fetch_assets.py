"""Download the CC0 assets the apartment scene uses from Poly Haven into ~/.blueprint/polyhaven/<id>/ (skips what is there).

Models come as glTF 2k with their textures, textures as 2k jpg maps (diffuse, GL normal, roughness), the sky as a 2k HDR.
Run: python houses/apartment/fetch_assets.py
"""
import json
import os
import urllib.request

ROOT = os.environ.get("BLUEPRINT_ASSETS", os.path.join(os.path.expanduser("~"), ".blueprint", "polyhaven"))
UA = {"User-Agent": "plan3d-asset-fetch"}
MODELS = ["modern_arm_chair_01", "mid_century_lounge_chair", "modern_wooden_cabinet", "coffee_table_round_01",
          "modern_ceiling_lamp_01", "potted_plant_01", "potted_plant_02", "potted_plant_04", "ceramic_vase_01",
          "decorative_book_set_01", "exterior_aircon_unit", "outdoor_table_chair_set_01", "hanging_picture_frame_02"]
TEXTURES = ["herringbone_parquet", "marble_01", "wood_floor_deck", "oak_veneer_01", "wool_boucle", "rough_linen",
            "curly_teddy_natural", "long_white_tiles"]
HDRI = ["kloofendal_48d_partly_cloudy_puresky"]


def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()
    open(path, "wb").write(data)


def files(i):
    return json.loads(urllib.request.urlopen(urllib.request.Request(f"https://api.polyhaven.com/files/{i}", headers=UA), timeout=60).read())


meta = {}
for i in MODELS:
    f = files(i).get("gltf", {}).get("2k", {}).get("gltf")
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
    f = files(i)
    d = os.path.join(ROOT, i)
    out = {}
    for key, name in [("Diffuse", "diff"), ("nor_gl", "nor"), ("Rough", "rough")]:
        if key in f:
            u = f[key]["2k"]["jpg"]["url"]
            p = os.path.join(d, f"{name}.jpg")
            get(u, p)
            out[name] = p
    info = json.loads(urllib.request.urlopen(urllib.request.Request(f"https://api.polyhaven.com/info/{i}", headers=UA), timeout=60).read())
    out["dims_mm"] = info.get("dimensions")
    meta[i] = out
    print("texture", i, out.get("dims_mm"))
for i in HDRI:
    u = files(i)["hdri"]["2k"]["hdr"]["url"]
    p = os.path.join(ROOT, i, os.path.basename(u))
    get(u, p)
    meta[i] = p
    print("hdri", i)
json.dump(meta, open(os.path.join(ROOT, "assets.json"), "w"), indent=1)
print("done")
