#!/usr/bin/env python3
"""
fetch_logo.py — auto-fetch a brand logo from Wikipedia into the shared
`assets/logos/` library.

Usage:
  python3 scripts/fetch_logo.py "Stripe" "Notion" "Cursor"

For each brand:
  1. If `assets/logos/<slug>.png` already exists, skip (no-op).
  2. Otherwise, hit the Wikipedia API to find the brand's article and
     download its infobox image to `<slug>.png`.

Slugging rule: lowercase, non-alphanumeric → underscore. So "X (Twitter)"
becomes `x_twitter`, "7-Eleven" becomes `7_eleven`, etc.

This script is the "we can get logos on the spot" half of rule 4bm — the
plan author calls it before referencing a new logo; render.sh will also
call it lazily for any tool_logo_burst image_path that resolves to a
missing file (see render.sh asset staging).

Wikipedia infobox quirks the hard way:
  - The thumb URL Wikipedia returns has a specific size (250/330/500/...);
    arbitrary sizes return HTTP 400 "Use thumbnail size".
  - Wikimedia's upload server requires an informative User-Agent or it
    returns a Wikimedia error page (looks like a PNG by extension but is
    HTML). We send a real browser UA for the image fetch.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional

LOGOS_DIR = Path(__file__).resolve().parent.parent / "assets" / "logos"
API_UA = "VideoEditSkill/1.0 (luuk@alleman.nl) Python"
IMG_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
          "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15")


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def _api_get(params: dict) -> dict:
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": API_UA})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def _resolve_image_thumb(filename: str, size: int = 500) -> Optional[str]:
    """Given a Commons filename like 'File:Stripe_logo.svg', resolve to a
    thumbnail URL we can actually download."""
    try:
        data = _api_get({
            "action": "query", "format": "json",
            "prop": "imageinfo",
            "iiprop": "url",
            "iiurlwidth": str(size),
            "titles": filename,
        })
    except Exception:
        return None
    pages = (data.get("query") or {}).get("pages") or {}
    if not pages:
        return None
    page = next(iter(pages.values()))
    ii = (page.get("imageinfo") or [{}])[0]
    return ii.get("thumburl") or ii.get("url")


def _page_logo_image(title: str) -> Optional[str]:
    """Find the file on a Wikipedia page that's most likely the LOGO.

    Strategy: list every image on the page, score each filename by how
    'logo-y' it looks (contains 'logo' / 'wordmark' / 'mark' / 'symbol',
    references the brand name, isn't a photo). Return the best match's
    thumbnail URL. Falls back to the page's main pageimages thumbnail if
    no logo file is found.
    """
    # First check the page exists and isn't a disambiguation page
    try:
        data = _api_get({
            "action": "query", "format": "json",
            "prop": "images|pageprops", "imlimit": "60",
            "titles": title, "redirects": "1",
        })
    except Exception:
        return None
    pages = (data.get("query") or {}).get("pages") or {}
    if not pages:
        return None
    page = next(iter(pages.values()))
    if str(page.get("pageid", "-1")) == "-1":
        return None
    # Disambig pages have no real logo — bail so the caller tries the next
    # candidate (e.g. "Tesla" disambig → fall through to "Tesla, Inc.").
    if "disambiguation" in (page.get("pageprops") or {}):
        return None
    images = page.get("images") or []
    if not images:
        return None
    brand_tokens = set(re.findall(r"[a-z0-9]+", title.lower()))
    def score(filename: str) -> int:
        # Wikipedia returns titles like "File:Symbol category class.svg" with
        # SPACES — normalize to underscores so our chrome-match strings hit.
        f = filename.lower().replace(" ", "_")
        s = 0
        # Strong positive — likely a logo file
        if "logo" in f: s += 100
        if "wordmark" in f: s += 80
        if "_mark" in f or " mark" in f or "symbol" in f: s += 40
        if "icon" in f: s += 10  # weak — many UI icons have "icon" in name
        # SVG > PNG > JPEG (logos are usually SVG/PNG)
        if f.endswith(".svg"): s += 30
        elif f.endswith(".png"): s += 15
        elif f.endswith((".jpg",".jpeg")): s -= 30  # usually photos
        # Brand-name match in filename
        for tok in brand_tokens:
            if len(tok) >= 3 and tok in f:
                s += 25
        # Negative — exclude photos / portraits / buildings
        for bad in ("headquarters","office","portrait","ceo","founder",
                    "ek_","field_","building","exterior","interior",
                    "speaking","conference","event","summit","disrupt"):
            if bad in f: s -= 80
        # Wikipedia / Wikimedia chrome — these appear as references on
        # nearly every page and contain "logo" in the filename, so they'd
        # otherwise win our scoring. Block hard.
        for chrome in ("commons-logo", "wikidata-logo", "wiki-logo",
                       "wiktionary", "wikipedia-logo", "wikisource",
                       "wikivoyage", "wikibooks", "wikiquote", "wikinews",
                       "question_book", "ambox", "padlock", "nuvola",
                       "p_vip.svg", "wmf_logo", "info_circle",
                       "disambig", "disambiguation", "text_document",
                       "office-book", "edit-find", "speakerlink",
                       "oojs", "ooui", "ui_icon", "ui-icon", "edit-ltr",
                       "magnify-clip", "external_link", "yes_check",
                       "x_mark", "cross_mark", "pd-icon", "pd_icon"):
            if chrome in f: s -= 500
        # Wikipedia category/portal/list class icons: Symbol_*_class.svg
        if re.match(r"^file:symbol_\w+_(class|sub-class)\b", f):
            s -= 500
        return s
    ranked = sorted(images, key=lambda im: -score(im["title"]))
    best = ranked[0]
    # Require a HIGH score so we don't pick up generic icons that happen
    # to have a positive feature ('logo' or '.svg') — a real brand logo
    # typically scores 100+ (the word 'logo' in the filename + the brand
    # name token match). Anything under 60 is suspect.
    if score(best["title"]) < 60:
        return None
    return _resolve_image_thumb(best["title"])


def _pageimages_thumbnail(title: str) -> Optional[str]:
    """Try to fetch a logo for a specific page title. First scans the
    page's image list for the actual logo file (filenames containing 'logo'
    / 'wordmark' / etc.); only falls back to the generic pageimages thumb
    if no logo file is found AND that thumb isn't a JPEG (which is
    typically a photo, not a logo)."""
    logo = _page_logo_image(title)
    if logo:
        return logo
    # Fallback to pageimages thumbnail, but only if it's not a JPEG.
    try:
        data = _api_get({
            "action": "query", "format": "json",
            "prop": "pageimages", "piprop": "thumbnail",
            "pithumbsize": "500", "titles": title, "redirects": "1",
        })
    except Exception:
        return None
    pages = (data.get("query") or {}).get("pages") or {}
    if not pages:
        return None
    page = next(iter(pages.values()))
    if str(page.get("pageid", "-1")) == "-1":
        return None
    thumb = (page.get("thumbnail") or {}).get("source")
    if thumb and not thumb.lower().endswith((".jpg", ".jpeg")):
        return thumb
    return None


def wikipedia_pageimage(brand: str) -> Optional[str]:
    """Find the best Wikipedia page for `brand` and return its infobox image
    URL. Strategy:
      1. Try the brand name directly.
      2. Try a few common company disambiguators ("(company)", "(software)",
         ", Inc.") because plain "Stripe" or "Tesla" hits the wrong page.
      3. Fall back to search API.

    Disambiguation matters: a naive lookup of "Tesla" gets Nikola Tesla's
    photo (1890 portrait), not the company logo. "Bolt" → Usain Bolt.
    """
    candidates = [
        brand,
        f"{brand} (company)",
        f"{brand} (software)",
        f"{brand} (service)",
        f"{brand} (application)",
        f"{brand} (chatbot)",
        f"{brand} Inc.",
        f"{brand}, Inc.",
    ]
    for title in candidates:
        thumb = _pageimages_thumbnail(title)
        if thumb:
            return thumb
    # Last resort: search for "<brand> company" so we bias to corporate pages,
    # try pageimages on the top hits (filtering out obvious people / events).
    params = {
        "action": "query", "format": "json", "list": "search",
        "srsearch": f"{brand} company", "srlimit": "5",
    }
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": API_UA})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
    except Exception as e:
        print(f"  [api error] {brand}: {e}", file=sys.stderr)
        return None
    for hit in (data.get("query") or {}).get("search") or []:
        title = hit.get("title", "")
        # skip obvious non-company pages
        if any(kw in title.lower() for kw in ("list of", "history of",
                                              "wikipedia", "category:")):
            continue
        thumb = _pageimages_thumbnail(title)
        if thumb:
            return thumb
    return None


def download(url: str, out_path: Path) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": IMG_UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
    except Exception as e:
        print(f"  [dl error] {url}: {e}", file=sys.stderr)
        return False
    # Sanity: a real PNG starts with 89 50 4E 47; a JPG with FF D8 FF; anything
    # else (HTML error page) we reject.
    if not (data.startswith(b"\x89PNG") or data.startswith(b"\xff\xd8\xff")):
        print(f"  [bad image] {url} returned {len(data)}B non-image content",
              file=sys.stderr)
        return False
    out_path.write_bytes(data)
    return True


def fetch_one(brand: str) -> Optional[str]:
    """Returns the slug if logo is now available (existing or just fetched),
    None on failure."""
    s = slug(brand)
    out = LOGOS_DIR / f"{s}.png"
    if out.exists() and out.stat().st_size > 0:
        print(f"  [cached] {s}.png")
        return s
    url = wikipedia_pageimage(brand)
    if not url:
        print(f"  [no-image] no Wikipedia page/infobox for {brand!r}",
              file=sys.stderr)
        return None
    LOGOS_DIR.mkdir(parents=True, exist_ok=True)
    if not download(url, out):
        return None
    print(f"  [fetched] {s}.png  {out.stat().st_size}B  ({url})")
    return s


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: fetch_logo.py <brand> [<brand> ...]", file=sys.stderr)
        return 2
    failures = 0
    for brand in sys.argv[1:]:
        if not fetch_one(brand):
            failures += 1
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
