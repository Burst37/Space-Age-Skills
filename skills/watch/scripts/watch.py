#!/usr/bin/env python3
"""/watch entry point v3: download, extract frames, transcript, pacing, hook,
highlights, sentiment arc, chapter analysis, storyboard, compare.

All new flags are optional and default to off so existing /watch usage is unchanged.
"""
from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(SCRIPT_DIR))

from download import download, is_url  # noqa: E402
from frames import (  # noqa: E402
    MAX_FPS, auto_fps, auto_fps_focus, extract, extract_scene_change,
    format_time, get_metadata, parse_time, select_hero_frames,
)
from hook import analyse_hook  # noqa: E402
from pacing import compute_pacing  # noqa: E402
from report import write_report  # noqa: E402
from transcribe import filter_range, format_transcript, parse_vtt  # noqa: E402
from whisper import load_api_key, transcribe_video  # noqa: E402


def _build_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(
        prog="watch",
        description="Download a video, extract frames, transcript, and rich analysis.",
    )
    ap.add_argument("source", help="Video URL or local file path")
    ap.add_argument("--max-frames", type=int, default=80)
    ap.add_argument("--resolution", type=int, default=512)
    ap.add_argument("--fps", type=float, default=None)
    ap.add_argument("--start", type=str, default=None)
    ap.add_argument("--end", type=str, default=None)
    ap.add_argument("--out-dir", type=str, default=None)
    ap.add_argument("--no-whisper", action="store_true")
    ap.add_argument("--whisper", choices=["groq", "openai"], default=None)
    ap.add_argument("--intent", type=str, default="")
    ap.add_argument("--no-scene-change", action="store_true")
    ap.add_argument("--no-hook-microscope", action="store_true")
    # New in v3
    ap.add_argument("--compare", type=str, default=None,
                    metavar="SOURCE_B", help="Compare with a second video")
    ap.add_argument("--chapters", action="store_true",
                    help="Chapter-aware scanning (uses YouTube chapters if available)")
    ap.add_argument("--highlights", type=int, default=0, metavar="N",
                    help="Auto-detect top N highlight moments (default: 0 = off)")
    ap.add_argument("--storyboard", action="store_true",
                    help="Generate an HTML storyboard contact sheet")
    ap.add_argument("--output-format", choices=["markdown", "json"], default="markdown")
    return ap.parse_args()


def main() -> int:
    args = _build_args()
    max_frames = min(args.max_frames, 100)

    # --- Compare mode ---
    if args.compare:
        from compare import analyse_video, print_comparison  # noqa: E402
        if args.out_dir:
            base = Path(args.out_dir).expanduser().resolve()
        else:
            base = Path(tempfile.mkdtemp(prefix="watch-compare-"))
        base.mkdir(parents=True, exist_ok=True)
        print(f"[watch] compare mode: {args.source} vs {args.compare}", file=sys.stderr)
        a = analyse_video(args.source, base / "a", whisper_backend=args.whisper,
                          no_whisper=args.no_whisper, resolution=args.resolution,
                          max_frames=max_frames // 2)
        b = analyse_video(args.compare, base / "b", whisper_backend=args.whisper,
                          no_whisper=args.no_whisper, resolution=args.resolution,
                          max_frames=max_frames // 2)
        print_comparison(a, b)
        print(f"\n---\n_Work dir: `{base}` — delete when done._")
        return 0

    # --- Standard / single-video mode ---
    if args.out_dir:
        work = Path(args.out_dir).expanduser().resolve()
    else:
        work = Path(tempfile.mkdtemp(prefix="watch-"))
    work.mkdir(parents=True, exist_ok=True)
    print(f"[watch] working dir: {work}", file=sys.stderr)

    print(
        "[watch] downloading via yt-dlp…" if is_url(args.source) else "[watch] using local file…",
        file=sys.stderr,
    )
    dl = download(args.source, work / "download")
    video_path = dl["video_path"]

    meta = get_metadata(video_path)
    full_duration = meta["duration_seconds"]

    start_sec = parse_time(args.start)
    end_sec = parse_time(args.end)

    if start_sec is not None and start_sec < 0:
        raise SystemExit("--start must be non-negative")
    if end_sec is not None and start_sec is not None and end_sec <= start_sec:
        raise SystemExit("--end must be greater than --start")
    if full_duration > 0 and start_sec is not None and start_sec >= full_duration:
        raise SystemExit(f"--start {start_sec:.1f}s is past end ({full_duration:.1f}s)")

    effective_start = start_sec if start_sec is not None else 0.0
    effective_end = end_sec if end_sec is not None else full_duration
    effective_duration = max(0.0, effective_end - effective_start)
    focused = start_sec is not None or end_sec is not None

    if focused:
        fps, target = auto_fps_focus(effective_duration, max_frames=max_frames)
    else:
        fps, target = auto_fps(effective_duration, max_frames=max_frames)
    if args.fps is not None:
        fps = min(args.fps, MAX_FPS)
        target = max(1, int(round(fps * effective_duration)))

    scope = (
        f"{format_time(effective_start)}-{format_time(effective_end)} ({effective_duration:.1f}s)"
        if focused else f"full {effective_duration:.1f}s"
    )
    print(f"[watch] extracting ~{target} frames at {fps:.3f} fps over {scope}…", file=sys.stderr)

    use_scene = (not args.no_scene_change) and not focused and args.fps is None
    if use_scene:
        print("[watch] extracting scene-change frames…", file=sys.stderr)
        frames = extract_scene_change(
            video_path, work / "frames",
            scene_threshold=0.3, resolution=args.resolution,
            max_frames=max_frames, uniform_fallback_min=10,
            start_seconds=start_sec, end_seconds=end_sec,
        )
        sampling_mode = (
            "scene-change" if frames and frames[0].get("source") == "scene-change"
            else "uniform-fallback"
        )
    else:
        frames = extract(
            video_path, work / "frames",
            fps=fps, resolution=args.resolution,
            max_frames=max_frames, start_seconds=start_sec, end_seconds=end_sec,
        )
        sampling_mode = "uniform"

    scene_times = [f["timestamp_seconds"] for f in frames] if sampling_mode == "scene-change" else []
    pacing = compute_pacing(scene_times=scene_times, video_duration=effective_duration)

    # Hook microscope
    if (not args.no_hook_microscope) and (not focused) and full_duration >= 30.0:
        print("[watch] running hook microscope on first 10s…", file=sys.stderr)
        hook_backend, hook_key = (None, None)
        if not args.no_whisper:
            hook_backend, hook_key = load_api_key(args.whisper)
        hook_result = analyse_hook(
            video_path, work,
            backend=hook_backend, api_key=hook_key,
            full_video_duration=full_duration,
        )
    else:
        hook_result = {"frames": [], "words": [], "segments": [], "ran": False,
                       "skipped_reason": "focused mode or short video or disabled"}

    # Transcript
    transcript_segments: list[dict] = []
    transcript_text: str | None = None
    transcript_source: str | None = None
    if dl.get("subtitle_path"):
        try:
            all_segments = parse_vtt(dl["subtitle_path"])
            transcript_segments = filter_range(all_segments, start_sec, end_sec) if focused else all_segments
            transcript_text = format_transcript(transcript_segments)
            transcript_source = "captions"
        except Exception as exc:
            print(f"[watch] subtitle parse failed: {exc}", file=sys.stderr)

    if not transcript_segments and not args.no_whisper:
        backend, api_key = load_api_key(args.whisper)
        if backend and api_key:
            try:
                all_segments, used_backend = transcribe_video(
                    video_path, work / "audio.mp3",
                    backend=backend, api_key=api_key,
                )
                transcript_segments = filter_range(all_segments, start_sec, end_sec) if focused else all_segments
                transcript_text = format_transcript(transcript_segments)
                transcript_source = f"whisper ({used_backend})"
            except SystemExit as exc:
                print(f"[watch] whisper fallback failed: {exc}", file=sys.stderr)
        else:
            setup_py = SCRIPT_DIR / "setup.py"
            print(
                f"[watch] no subtitles and no Whisper key — "
                f"run `python3 {setup_py}` to enable Whisper",
                file=sys.stderr,
            )

    info = dl.get("info") or {}
    hero_frames = select_hero_frames(frames, pacing=pacing)

    # --- Chapter analysis (new in v3) ---
    chapter_results: list[dict] | None = None
    if args.chapters:
        from chapters import load_chapters_from_download, auto_segment, process_chapters  # noqa: E402
        chapters = load_chapters_from_download(dl)
        if not chapters:
            print("[watch] no chapters found in info.json — auto-segmenting", file=sys.stderr)
            chapters = auto_segment(full_duration, target_segments=5)
        if chapters:
            print(f"[watch] processing {len(chapters)} chapters…", file=sys.stderr)
            chapter_results = process_chapters(
                video_path, work / "chapters", chapters,
                transcript_segments=transcript_segments,
                resolution=args.resolution, max_frames_per_chapter=15,
            )

    # --- Highlights (new in v3) ---
    highlights: list[dict] | None = None
    if args.highlights > 0:
        from highlights import find_highlights  # noqa: E402
        print(f"[watch] detecting top {args.highlights} highlights…", file=sys.stderr)
        highlights = find_highlights(
            transcript_segments, frames, pacing,
            video_duration=effective_duration,
            top_n=args.highlights,
        )
        print(f"[watch] found {len(highlights)} highlights", file=sys.stderr)

    # --- Sentiment arc (new in v3) ---
    sentiment_arc: list[dict] | None = None
    if transcript_segments:
        from sentiment import compute_sentiment_arc  # noqa: E402
        bucket = min(60.0, effective_duration / 5) if effective_duration > 60 else effective_duration
        sentiment_arc = compute_sentiment_arc(transcript_segments, bucket_seconds=max(30.0, bucket))

    # Build report.md
    report_path = write_report(
        out_path=work / "report.md",
        source=args.source,
        title=info.get("title") or Path(args.source).stem,
        duration_seconds=full_duration,
        intent=args.intent,
        transcript_segments=transcript_segments,
        transcript_source=transcript_source,
        all_frames=frames,
        hero_frames=hero_frames,
        pacing=pacing,
        hook=hook_result,
        sentiment_arc=sentiment_arc,
        highlights=highlights,
        chapters=chapter_results,
    )

    # --- JSON output mode ---
    if args.output_format == "json":
        output = {
            "source": args.source,
            "title": info.get("title") or Path(args.source).stem,
            "uploader": info.get("uploader"),
            "duration_seconds": full_duration,
            "frames": frames,
            "transcript_segments": transcript_segments,
            "transcript_source": transcript_source,
            "pacing": pacing,
            "hook": {k: v for k, v in hook_result.items() if k != "frames"},
            "highlights": highlights or [],
            "sentiment_arc": sentiment_arc or [],
            "chapters": chapter_results or [],
            "report_path": str(report_path),
            "work_dir": str(work),
        }
        print(json.dumps(output, indent=2))
        return 0

    # --- Storyboard (new in v3) ---
    storyboard_path: Path | None = None
    if args.storyboard:
        from storyboard import generate_storyboard  # noqa: E402
        storyboard_path = work / "storyboard.html"
        highlight_times: set[float] = set()
        if highlights:
            for h in highlights:
                highlight_times.add(h["start"])
        generate_storyboard(
            frames=frames,
            title=info.get("title") or Path(args.source).stem,
            duration=full_duration,
            transcript_segments=transcript_segments,
            hero_paths={f["path"] for f in hero_frames},
            highlight_times=highlight_times,
            out_path=storyboard_path,
        )
        print(f"[watch] storyboard: {storyboard_path}", file=sys.stderr)

    # --- Markdown output (standard) ---
    print()
    print("# watch: video report")
    print()
    print(f"- **Source:** {args.source}")
    if info.get("title"):
        print(f"- **Title:** {info['title']}")
    if info.get("uploader"):
        print(f"- **Uploader:** {info['uploader']}")
    print(f"- **Duration:** {format_time(full_duration)} ({full_duration:.1f}s)")
    if focused:
        print(
            f"- **Focus range:** {format_time(effective_start)} → {format_time(effective_end)} "
            f"({effective_duration:.1f}s)"
        )
    if meta.get("width") and meta.get("height"):
        print(f"- **Resolution:** {meta['width']}x{meta['height']} ({meta.get('codec') or 'unknown'})")
    mode = "focused" if focused else "full"
    print(f"- **Frames:** {len(frames)} @ {fps:.3f} fps, {mode} mode (sampling: {sampling_mode})")
    print(f"- **Frame size:** {args.resolution}px wide")
    if transcript_segments:
        print(f"- **Transcript:** {len(transcript_segments)} segments (via {transcript_source or 'captions'})")
    else:
        print("- **Transcript:** none available")
    if pacing.get("shot_count", 0) > 0:
        print(f"- **Pacing:** {pacing['cuts_per_minute']} cuts/min, {pacing['mean_shot_length']}s mean shot")
    if storyboard_path:
        print(f"- **Storyboard:** `{storyboard_path}`")

    if not focused and full_duration > 600:
        mins = int(full_duration // 60)
        print()
        print(
            f"> **Warning:** This is a {mins}-minute video. Frame coverage is sparse. "
            "Re-run with `--start HH:MM:SS --end HH:MM:SS` to focus on a section."
        )

    print()
    print("## Frames")
    print()
    print(f"Frames live at: `{work / 'frames'}`")
    print()
    print(
        "**Read each frame path below with the Read tool.** "
        "Frames are chronological; `t=MM:SS` is the absolute timestamp."
    )
    print()
    for frame in frames:
        print(f"- `{frame['path']}` (t={format_time(frame['timestamp_seconds'])})")

    if highlights:
        print()
        print("## Auto-Highlights")
        print()
        from highlights import print_highlights  # noqa: E402
        print_highlights(highlights)

    if chapter_results:
        print()
        from chapters import print_chapter_report  # noqa: E402
        print_chapter_report(chapter_results)

    if sentiment_arc and len(sentiment_arc) > 1:
        print()
        print("## Sentiment Arc")
        print()
        print("| Time | Score | Mood |")
        print("|------|-------|------|")
        for b in sentiment_arc:
            bar = "▓" * int(abs(b["score"]) * 8)
            sign = "+" if b["score"] > 0 else ("-" if b["score"] < 0 else " ")
            print(f"| {b['time_label']} | {sign}{abs(b['score']):.2f} {bar} | {b['label']} |")

    print()
    print("## Transcript")
    print()
    if transcript_text:
        label = transcript_source or "captions"
        if focused:
            print(f"_Source: {label}. Filtered to {format_time(effective_start)} → {format_time(effective_end)}:_")
        else:
            print(f"_Source: {label}._")
        print()
        print("```")
        print(transcript_text)
        print("```")
    else:
        setup_py = SCRIPT_DIR / "setup.py"
        print(
            "_No transcript — frames only. "
            f"Run `python3 {setup_py}` to enable Whisper, then re-run._"
        )

    print()
    print("---")
    print(f"_Report: `{report_path}`_")
    print(f"_Work dir: `{work}` — delete when done._")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
