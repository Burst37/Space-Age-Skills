#!/usr/bin/env python3
"""
segment_speaker.py — produce an alpha "cutout" PNG sequence of the speaker.

Each output PNG is one source frame with the background made transparent
(alpha = person silhouette). EditedVideo.tsx renders the matching PNG ON TOP
of the text layer during `behind_subject` beats, so text overlays sit
visually BEHIND the speaker — the premium "text-behind-subject" look — while
the speaker is never covered.

Why a PNG sequence and not an alpha video: ffmpeg's libvpx (VP8/VP9) on this
machine silently drops the alpha channel (encodes yuv420p, not yuva420p), so
a webm cutout renders opaque-black and covers everything. RGBA PNGs carry
alpha losslessly and Remotion's <Img> renders PNG transparency natively — no
codec roulette.

Pipeline:
  source video --PyAV decode--> per-frame RGB
               --rembg (u2net_human_seg)--> per-frame RGBA (bg transparent)
               --> <out_dir>/frame_00000.png, frame_00001.png, ...

Output: a directory of frame_NNNNN.png (5-digit, zero-padded, absolute frame
index). Frame-aligned to the source so EditedVideo can look up frame N
directly.

Cached: the caller (render.sh) keeps the dir in the workdir and only re-runs
when the source is newer. Segmentation is the slow step (~0.3s/frame at 720p).

Usage:
  segment_speaker.py <source_video> <out_dir> [--width W] [--height H]
                     [--model u2net_human_seg]
"""
import argparse
import sys
from pathlib import Path

import av
from rembg import new_session, remove


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("out_dir")
    ap.add_argument("--width", type=int, default=720)
    ap.add_argument("--height", type=int, default=1280)
    ap.add_argument("--model", default="u2net_human_seg")
    args = ap.parse_args()

    src = Path(args.source).expanduser().resolve()
    out_dir = Path(args.out_dir).expanduser().resolve()
    if not src.exists():
        print(f"source not found: {src}", file=sys.stderr)
        return 2

    # Cap the matte resolution — rembg cost scales with pixels and a 1080p
    # matte upscaled 2x for a 4K final still has clean enough edges.
    W = min(args.width, 1080)
    H = min(args.height, 1920)
    W -= W % 2
    H -= H % 2

    out_dir.mkdir(parents=True, exist_ok=True)
    # Clear any stale frames so a resolution change can't leave mismatched PNGs.
    for old in out_dir.glob("frame_*.png"):
        old.unlink()

    container = av.open(str(src))
    vstream = container.streams.video[0]
    total = vstream.frames or 0

    print(f"==> Segmenting speaker: {src.name} @ {W}x{H}, model={args.model}")
    sess = new_session(args.model)

    n = 0
    for frame in container.decode(vstream):
        img = frame.to_image().convert("RGB")
        if img.size != (W, H):
            img = img.resize((W, H))
        cut = remove(img, session=sess)  # RGBA, bg transparent
        if cut.mode != "RGBA":
            cut = cut.convert("RGBA")
        cut.save(out_dir / f"frame_{n:05d}.png")
        n += 1
        if n % 30 == 0:
            pct = f"{100*n/total:.0f}%" if total else f"{n}"
            print(f"  segmented {n} frames ({pct})")

    container.close()
    # Write a tiny manifest so the caller / comp can sanity-check frame count.
    (out_dir / "manifest.txt").write_text(f"frames={n}\nwidth={W}\nheight={H}\n")
    print(f"==> Wrote speaker cutout sequence: {out_dir} ({n} frames)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
