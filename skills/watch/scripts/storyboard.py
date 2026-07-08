#!/usr/bin/env python3
"""HTML storyboard generator.

Generates a self-contained dark-theme HTML storyboard from extracted frames.
All images are base64-embedded so the file is portable with no external refs.
"""
from __future__ import annotations

import base64
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from frames import format_time  # noqa: E402


_HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — /watch storyboard</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: #0d0d0d; color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 13px; line-height: 1.4; padding: 24px;
  }}
  h1 {{ font-size: 20px; font-weight: 600; margin-bottom: 4px; color: #fff; }}
  .meta {{ color: #888; margin-bottom: 24px; font-size: 12px; }}
  .grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }}
  .frame {{ background: #1a1a1a; border-radius: 6px; overflow: hidden; border: 1px solid #2a2a2a; }}
  .hero {{ border-color: #4af; box-shadow: 0 0 0 1px #4af; }}
  .frame img {{ width: 100%; display: block; }}
  .frame-info {{ padding: 8px 10px; }}
  .timestamp {{ font-family: monospace; font-size: 11px; color: #4af; font-weight: bold; }}
  .hero-badge {{ display: inline-block; background: #4af; color: #000; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle; }}
  .snippet {{ margin-top: 4px; color: #aaa; font-size: 11px; line-height: 1.3; }}
  .highlight-badge {{ background: #fa0; color: #000; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle; }}
</style>
</head>
<body>
<h1>{title}</h1>
<p class="meta">{meta}</p>
<div class="grid">
{frames_html}
</div>
</body>
</html>"""


def _embed_image(path: str) -> str:
    try:
        data = Path(path).read_bytes()
        b64 = base64.b64encode(data).decode("ascii")
        return f"data:image/jpeg;base64,{b64}"
    except OSError:
        return ""


def _find_snippet(segments: list[dict], timestamp: float, window: float = 5.0) -> str:
    nearby = [s for s in segments if abs(s["start"] - timestamp) <= window]
    text = " ".join(s["text"] for s in nearby[:2])
    return (text[:80] + "…") if len(text) > 80 else text


def generate_storyboard(
    frames: list[dict],
    title: str,
    duration: float,
    transcript_segments: list[dict] | None = None,
    hero_paths: set[str] | None = None,
    highlight_times: set[float] | None = None,
    out_path: Path | None = None,
) -> str:
    hero_paths = hero_paths or set()
    highlight_times = highlight_times or set()
    transcript_segments = transcript_segments or []

    frame_items = []
    for f in frames:
        ts = f["timestamp_seconds"]
        path = f["path"]
        img_src = _embed_image(path)
        if not img_src:
            continue

        is_hero = path in hero_paths
        is_highlight = any(abs(ts - ht) <= 15 for ht in highlight_times)

        css_class = "frame" + (" hero" if is_hero else "")
        badges = ""
        if is_hero:
            badges += '<span class="hero-badge">HERO</span>'
        if is_highlight:
            badges += '<span class="highlight-badge">★</span>'

        snippet = _find_snippet(transcript_segments, ts)
        snippet_html = f'<div class="snippet">{snippet}</div>' if snippet else ""

        frame_items.append(
            f'  <div class="{css_class}">'
            f'<img src="{img_src}" alt="t={format_time(ts)}" loading="lazy">'
            f'<div class="frame-info">'
            f'<span class="timestamp">{format_time(ts)}</span>{badges}'
            f'{snippet_html}</div></div>'
        )

    meta = f"{format_time(duration)} · {len(frames)} frames · storyboard"
    html = _HTML_TEMPLATE.format(
        title=title, meta=meta,
        frames_html="\n".join(frame_items),
    )

    if out_path:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(html, encoding="utf-8")

    return html


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Generate HTML storyboard from frame manifest JSON.")
    ap.add_argument("manifest_json")
    ap.add_argument("--out", default="storyboard.html")
    args = ap.parse_args()
    data = json.loads(Path(args.manifest_json).read_text())
    generate_storyboard(
        frames=data["frames"], title=data.get("title", "Untitled"),
        duration=data.get("duration", 0),
        transcript_segments=data.get("transcript_segments"),
        out_path=Path(args.out),
    )
    print(f"Storyboard written to {args.out}")
