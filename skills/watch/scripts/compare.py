#!/usr/bin/env python3
"""Side-by-side video comparison.

Runs the full extraction pipeline on two videos and produces a comparison
report with metrics diff, interleaved frames, and transcript contrast.
"""
from __future__ import annotations

import sys
import tempfile
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from download import download  # noqa: E402
from frames import auto_fps, extract_scene_change, format_time, get_metadata  # noqa: E402
from pacing import compute_pacing  # noqa: E402
from transcribe import format_transcript, parse_vtt  # noqa: E402
from whisper import load_api_key, transcribe_video  # noqa: E402


def analyse_video(
    source: str,
    work_dir: Path,
    whisper_backend: str | None = None,
    no_whisper: bool = False,
    resolution: int = 512,
    max_frames: int = 50,
) -> dict:
    """Full pipeline on one video. Returns analysis dict."""
    dl = download(source, work_dir / "download")
    video_path = dl["video_path"]
    meta = get_metadata(video_path)
    full_duration = meta["duration_seconds"]

    frames = extract_scene_change(
        video_path, work_dir / "frames",
        scene_threshold=0.3, resolution=resolution,
        max_frames=max_frames, uniform_fallback_min=8,
    )

    scene_times = [f["timestamp_seconds"] for f in frames if f.get("source") == "scene-change"]
    pacing = compute_pacing(scene_times=scene_times, video_duration=full_duration)

    transcript_segments: list[dict] = []
    transcript_source = None
    if dl.get("subtitle_path"):
        try:
            transcript_segments = parse_vtt(dl["subtitle_path"])
            transcript_source = "captions"
        except Exception:
            pass

    if not transcript_segments and not no_whisper:
        backend, api_key = load_api_key(whisper_backend)
        if backend and api_key:
            try:
                transcript_segments, used = transcribe_video(
                    video_path, work_dir / "audio.mp3",
                    backend=backend, api_key=api_key,
                )
                transcript_source = f"whisper ({used})"
            except SystemExit:
                pass

    info = dl.get("info") or {}
    return {
        "source": source,
        "title": info.get("title") or Path(source).stem,
        "uploader": info.get("uploader"),
        "duration": full_duration,
        "meta": meta,
        "frames": frames,
        "pacing": pacing,
        "transcript_segments": transcript_segments,
        "transcript_source": transcript_source,
        "work_dir": str(work_dir),
    }


def print_comparison(a: dict, b: dict) -> None:
    print("# /watch compare: side-by-side video analysis")
    print()
    print("## Metadata")
    print()
    print("| Metric | Video A | Video B |")
    print("|--------|---------|---------|")
    print(f"| Title | {(a['title'] or '')[:45]} | {(b['title'] or '')[:45]} |")
    if a.get("uploader") or b.get("uploader"):
        print(f"| Uploader | {a.get('uploader') or '—'} | {b.get('uploader') or '—'} |")
    print(f"| Duration | {format_time(a['duration'])} ({a['duration']:.1f}s) | {format_time(b['duration'])} ({b['duration']:.1f}s) |")
    print(f"| Resolution | {a['meta'].get('width')}x{a['meta'].get('height')} | {b['meta'].get('width')}x{b['meta'].get('height')} |")
    print(f"| Frames extracted | {len(a['frames'])} | {len(b['frames'])} |")
    print(f"| Transcript segments | {len(a['transcript_segments'])} | {len(b['transcript_segments'])} |")

    ap, bp = a["pacing"], b["pacing"]
    if ap["shot_count"] > 0 or bp["shot_count"] > 0:
        print()
        print("## Editorial Pacing")
        print()
        print("| Metric | Video A | Video B | Delta |")
        print("|--------|---------|---------|-------|")
        if ap["shot_count"] > 0 and bp["shot_count"] > 0:
            delta_cpm = round(ap["cuts_per_minute"] - bp["cuts_per_minute"], 2)
            delta_mean = round(ap["mean_shot_length"] - bp["mean_shot_length"], 2)
            print(f"| Shots | {ap['shot_count']} | {bp['shot_count']} | {ap['shot_count'] - bp['shot_count']:+d} |")
            print(f"| Cuts/min | {ap['cuts_per_minute']} | {bp['cuts_per_minute']} | {delta_cpm:+.2f} |")
            print(f"| Mean shot length | {ap['mean_shot_length']}s | {bp['mean_shot_length']}s | {delta_mean:+.2f}s |")
            print(f"| Median shot length | {ap['median_shot_length']}s | {bp['median_shot_length']}s | — |")
            print()
            faster = "A" if ap["cuts_per_minute"] > bp["cuts_per_minute"] else "B"
            print(f"> **Verdict:** Video {faster} has a faster edit pace ({max(ap['cuts_per_minute'], bp['cuts_per_minute'])} vs {min(ap['cuts_per_minute'], bp['cuts_per_minute'])} cuts/min).")

    for label, v in (("A", a), ("B", b)):
        print()
        print(f"## Video {label} Frames")
        print(f"_Source: {v['source']}_")
        print()
        for f in v["frames"]:
            print(f"- `{f['path']}` (t={format_time(f['timestamp_seconds'])})")

    for label, v in (("A", a), ("B", b)):
        print()
        print(f"## Video {label} Transcript")
        print()
        if v["transcript_segments"]:
            print(f"_Source: {v['transcript_source']}_")
            print()
            print("```")
            print(format_transcript(v["transcript_segments"]))
            print("```")
        else:
            print("_No transcript available._")


def main() -> int:
    import argparse
    ap = argparse.ArgumentParser(prog="compare", description="Compare two videos side-by-side.")
    ap.add_argument("source_a", help="First video URL or local path")
    ap.add_argument("source_b", help="Second video URL or local path")
    ap.add_argument("--max-frames", type=int, default=50)
    ap.add_argument("--resolution", type=int, default=512)
    ap.add_argument("--no-whisper", action="store_true")
    ap.add_argument("--whisper", choices=["groq", "openai"], default=None)
    ap.add_argument("--out-dir", type=str, default=None)
    args = ap.parse_args()

    if args.out_dir:
        base = Path(args.out_dir).expanduser().resolve()
    else:
        base = Path(tempfile.mkdtemp(prefix="watch-compare-"))
    base.mkdir(parents=True, exist_ok=True)

    print(f"[compare] working dir: {base}", file=sys.stderr)
    print(f"[compare] analysing Video A: {args.source_a}", file=sys.stderr)
    a = analyse_video(args.source_a, base / "a", whisper_backend=args.whisper,
                      no_whisper=args.no_whisper, resolution=args.resolution,
                      max_frames=args.max_frames)

    print(f"[compare] analysing Video B: {args.source_b}", file=sys.stderr)
    b = analyse_video(args.source_b, base / "b", whisper_backend=args.whisper,
                      no_whisper=args.no_whisper, resolution=args.resolution,
                      max_frames=args.max_frames)

    print_comparison(a, b)
    print()
    print("---")
    print(f"_Work dir: `{base}` — delete when done._")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
