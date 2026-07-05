#!/usr/bin/env python3
"""
Fetch REAL stock b-roll from Pexels (free API) — videos first, photo fallback.

Real footage beats AI-generated stills for any real-world concept (a person at
a desk, an ocean wave, a city street). AI images read as "fake"; stock reads as
credible. Use this for those beats; reserve gpt_image_2 for abstract metaphors.

Setup (one-time, free):
  1. Create a free key at https://www.pexels.com/api/  (instant)
  2. export PEXELS_API_KEY="<your key>"   (or add to the skill's .env)

Usage:
  python3 fetch_stock.py "<search query>" <out_dir> [--photo] [--portrait]
      "<query>"   e.g. "person desk papers working late focus"
      <out_dir>   where to save (e.g. <workdir>/broll)
      --photo     fetch a still photo instead of a video clip
      --portrait  prefer portrait orientation (for shorts); default landscape

Prints the saved file path on success. Picks the highest-res file that is
<= 1920 on the long edge (no point pulling 4K for a 1080p comp).
"""
from __future__ import annotations
import os, sys, json, urllib.request, urllib.parse, hashlib
from pathlib import Path

API = os.environ.get("PEXELS_API_KEY", "").strip()
TIMEOUT = 30


def _get(url: str) -> dict:
    req = urllib.request.Request(url, headers={"Authorization": API})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return json.loads(r.read().decode())


def _download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "video-edit/1.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r, open(dest, "wb") as f:
        f.write(r.read())


def fetch_video(query: str, out_dir: Path, portrait: bool) -> Path | None:
    orient = "portrait" if portrait else "landscape"
    q = urllib.parse.quote(query)
    data = _get(f"https://api.pexels.com/videos/search?query={q}"
                f"&orientation={orient}&size=medium&per_page=8")
    vids = data.get("videos", [])
    if not vids:
        return None
    # pick the first video; choose its best <=1920 long-edge mp4 file
    best = None
    for v in vids:
        files = [f for f in v.get("video_files", []) if f.get("file_type") == "video/mp4"]
        # prefer the largest width <= 1920, else the smallest available
        under = [f for f in files if (f.get("width") or 0) <= 1920]
        pick = max(under or files, key=lambda f: f.get("width") or 0, default=None)
        if pick:
            best = (v, pick); break
    if not best:
        return None
    v, pick = best
    slug = hashlib.sha1((query + str(v.get("id"))).encode()).hexdigest()[:8]
    dest = out_dir / f"stock_{slug}.mp4"
    _download(pick["link"], dest)
    print(f"[pexels:video] '{query}' -> {dest}  ({pick.get('width')}x{pick.get('height')}, by {v.get('user',{}).get('name','?')})")
    return dest


def fetch_photo(query: str, out_dir: Path, portrait: bool) -> Path | None:
    orient = "portrait" if portrait else "landscape"
    q = urllib.parse.quote(query)
    data = _get(f"https://api.pexels.com/v1/search?query={q}"
                f"&orientation={orient}&per_page=8")
    photos = data.get("photos", [])
    if not photos:
        return None
    p = photos[0]
    slug = hashlib.sha1((query + str(p.get("id"))).encode()).hexdigest()[:8]
    dest = out_dir / f"stock_{slug}.jpg"
    _download(p["src"]["large2x"], dest)
    print(f"[pexels:photo] '{query}' -> {dest}  (by {p.get('photographer','?')})")
    return dest


def main() -> int:
    if not API:
        print("ERROR: PEXELS_API_KEY not set. Get a free key at "
              "https://www.pexels.com/api/ and `export PEXELS_API_KEY=...`",
              file=sys.stderr)
        return 3
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = {a for a in sys.argv[1:] if a.startswith("--")}
    if len(args) < 2:
        print("usage: fetch_stock.py \"<query>\" <out_dir> [--photo] [--portrait]", file=sys.stderr)
        return 2
    query, out_dir = args[0], Path(args[1]).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    portrait = "--portrait" in flags
    try:
        res = (fetch_photo if "--photo" in flags else fetch_video)(query, out_dir, portrait)
        if res is None and "--photo" not in flags:
            print("[fallback] no video, trying photo")
            res = fetch_photo(query, out_dir, portrait)
        if res is None:
            print(f"no stock result for '{query}'", file=sys.stderr); return 1
        print(str(res))
        return 0
    except Exception as e:
        print(f"fetch failed: {e}", file=sys.stderr); return 1


if __name__ == "__main__":
    sys.exit(main())
