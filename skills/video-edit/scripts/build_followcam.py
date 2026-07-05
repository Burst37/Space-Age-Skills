#!/usr/bin/env python3
"""
build_followcam.py — derive a "camera follows the speaker" motion track.

Produces a smooth per-frame pan + zoom that DRIFTS with the speaker — the
dynamic, slightly-handheld "the camera is alive" look.

TWO input modes:

  --video <path>   FAST PATH (default for follow-cam). Samples ~every Nth
                   frame, runs rembg at low res just to get the person's
                   bounding box, and interpolates between samples. Follow-cam
                   only needs the speaker's ROUGH position — which is heavily
                   smoothed anyway — so a full per-frame 720p matte is massive
                   overkill. This is ~15-20s vs ~6min for the full matte.

  <cutout_dir>     LEGACY PATH. Reads a pre-built speaker-cutout PNG sequence
                   (from segment_speaker.py). Only used when behind_subject
                   beats already forced a full matte to exist.

Method (both modes):
  1. person centroid (cx, cy), normalized 0..1, per sampled frame
  2. linear-interpolate to a per-frame track, then heavily smooth it
  3. per frame: constant base zoom + a pan easing the speaker toward centre
     at `follow` strength (partial — a hard lock reads robotic)
  4. clamp the pan so the scaled layer never exposes a black edge

Output: followcam_plan.json — [{ "scale", "tx", "ty" }, ...] one per frame.
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def _centroid(alpha: np.ndarray) -> tuple[float, float] | None:
    """Normalized (cx, cy) of the silhouette, or None if too small."""
    ys, xs = np.where(alpha > 40)
    if len(xs) < 50:
        return None
    h, w = alpha.shape
    return float(xs.mean()) / w, float(ys.mean()) / h


def centroids_from_video(video: Path, every: int, seg_w: int, model: str):
    """FAST PATH — sparse-sample the video, rembg each sample for the bbox.

    Returns (fps, total_frames, cx[], cy[]) where cx/cy are per-frame
    (linearly interpolated between the sparse samples)."""
    import av
    from rembg import new_session, remove

    sess = new_session(model)
    container = av.open(str(video))
    vstream = container.streams.video[0]
    fps = float(vstream.average_rate or 30)
    src_w = vstream.width or 1080
    src_h = vstream.height or 1920
    seg_h = int(round(seg_w * src_h / src_w))
    seg_w -= seg_w % 2
    seg_h -= seg_h % 2

    sample_idx: list[int] = []
    sample_cx: list[float] = []
    sample_cy: list[float] = []
    last = (0.5, 0.55)
    n = 0
    for frame in container.decode(vstream):
        if n % every == 0:
            img = frame.to_image().convert("RGB").resize((seg_w, seg_h))
            cut = remove(img, session=sess)
            a = np.asarray(cut.convert("RGBA"))[:, :, 3]
            c = _centroid(a) or last
            last = c
            sample_idx.append(n)
            sample_cx.append(c[0])
            sample_cy.append(c[1])
        n += 1
    container.close()
    total = n

    # linear-interpolate the sparse samples up to a per-frame track
    if len(sample_idx) < 2:
        cx = np.full(total, sample_cx[0] if sample_cx else 0.5)
        cy = np.full(total, sample_cy[0] if sample_cy else 0.55)
    else:
        allf = np.arange(total)
        cx = np.interp(allf, sample_idx, sample_cx)
        cy = np.interp(allf, sample_idx, sample_cy)
    print(f"[followcam] sampled {len(sample_idx)} of {total} frames "
          f"(every {every}, {seg_w}x{seg_h})", flush=True)
    return fps, total, cx, cy


def centroids_from_cutouts(cutout_dir: Path):
    """LEGACY PATH — read the full PNG cutout sequence."""
    frames = sorted(cutout_dir.glob("frame_*.png"))
    cx, cy = [], []
    last = (0.5, 0.55)
    for f in frames:
        a = np.asarray(Image.open(f).convert("RGBA"))[:, :, 3]
        c = _centroid(a) or last
        last = c
        cx.append(c[0]); cy.append(c[1])
    return np.array(cx), np.array(cy)


def smooth(sig: np.ndarray, win: int) -> np.ndarray:
    if win < 3 or len(sig) < win:
        return sig
    k = np.ones(win) / win
    pad = win // 2
    return np.convolve(np.pad(sig, pad, mode="edge"), k, mode="valid")[: len(sig)]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("out_json")
    ap.add_argument("--video", help="FAST PATH — derive the track straight "
                                    "from the video by sparse sampling")
    ap.add_argument("--cutout-dir", help="LEGACY — read a PNG cutout sequence")
    ap.add_argument("--every", type=int, default=6,
                    help="fast path: sample 1 in every N frames (the centroid "
                         "is heavily smoothed so sparse is plenty)")
    ap.add_argument("--seg-width", type=int, default=384,
                    help="fast path: rembg resolution — a bbox needs no more")
    ap.add_argument("--model", default="u2netp",
                    help="rembg model — u2netp (light) is plenty for a bbox")
    ap.add_argument("--scale", type=float, default=1.1,
                    help="base zoom — crop room to pan into")
    ap.add_argument("--follow", type=float, default=0.7,
                    help="0=no follow (locked wide), 1=hard centre-lock")
    ap.add_argument("--head-room", type=float, default=0.0,
                    help="vertical framing bias in PERCENT. The follow term "
                         "chases the body centroid (which sits low, incl. the "
                         "torso) and pans the frame UP — cropping the top of "
                         "the head/hair. A POSITIVE head-room pans the frame "
                         "back DOWN, revealing more of the top (headroom). "
                         "Added before the no-black-edge clamp, so it is always "
                         "safe. Default 0 = unchanged.")
    ap.add_argument("--smooth", type=int, default=21,
                    help="moving-average window (frames)")
    args = ap.parse_args()

    if args.video:
        fps, total, cx, cy = centroids_from_video(
            Path(args.video).expanduser().resolve(),
            args.every, args.seg_width, args.model,
        )
    elif args.cutout_dir:
        cx, cy = centroids_from_cutouts(Path(args.cutout_dir).expanduser().resolve())
        total = len(cx)
        if total == 0:
            print("no cutout frames", file=sys.stderr)
            return 2
    else:
        print("need --video or --cutout-dir", file=sys.stderr)
        return 2

    # heavy double-smoothing — floaty, never jittery
    scx = smooth(smooth(cx, args.smooth), args.smooth)
    scy = smooth(smooth(cy, args.smooth), args.smooth)

    S = args.scale
    max_pan = (S - 1.0) / 2.0 * 100.0
    plan = []
    for i in range(total):
        tx = (0.5 - scx[i]) * args.follow * 100.0
        ty = (0.5 - scy[i]) * args.follow * 100.0 * 0.6 + args.head_room
        tx = max(-max_pan, min(max_pan, tx))
        ty = max(-max_pan, min(max_pan, ty))
        plan.append({"scale": round(S, 4), "tx": round(tx, 3), "ty": round(ty, 3)})

    Path(args.out_json).write_text(json.dumps(plan))
    print(f"==> Wrote followcam plan: {args.out_json} ({len(plan)} frames, "
          f"scale={S}, follow={args.follow})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
