#!/usr/bin/env python3
"""Chapter-aware video scanning.

Extracts YouTube chapters from yt-dlp info.json and processes each chapter
separately with dedicated frame extraction. Falls back to auto-segmentation
when no chapters are available.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from frames import auto_fps_focus, extract, format_time  # noqa: E402
from transcribe import filter_range  # noqa: E402


def load_chapters_from_download(dl_result: dict) -> list[dict]:
    """Extract chapters from a download() result (includes chapters from info.json)."""
    return dl_result.get("chapters") or []


def auto_segment(duration: float, target_segments: int = 5) -> list[dict]:
    """Split video into equal segments when no chapters exist."""
    if duration <= 0 or target_segments <= 0:
        return []
    seg_duration = duration / target_segments
    return [
        {
            "title": f"Segment {i+1}/{target_segments}",
            "start": round(i * seg_duration, 2),
            "end": round(min((i + 1) * seg_duration, duration), 2),
        }
        for i in range(target_segments)
    ]


def process_chapters(
    video_path: str,
    work_dir: Path,
    chapters: list[dict],
    transcript_segments: list[dict],
    resolution: int = 512,
    max_frames_per_chapter: int = 15,
) -> list[dict]:
    """Extract frames for each chapter. Returns augmented chapter dicts."""
    results = []
    for i, ch in enumerate(chapters):
        ch_dir = work_dir / f"chapter_{i:02d}"
        ch_duration = ch["end"] - ch["start"]
        if ch_duration <= 0:
            continue

        fps, _ = auto_fps_focus(ch_duration, max_frames=max_frames_per_chapter)
        frames = extract(
            video_path, ch_dir,
            fps=fps, resolution=resolution,
            max_frames=max_frames_per_chapter,
            start_seconds=ch["start"],
            end_seconds=ch["end"],
        )

        ch_transcript = filter_range(transcript_segments, ch["start"], ch["end"])

        results.append({
            "index": i,
            "title": ch["title"],
            "start": ch["start"],
            "end": ch["end"],
            "duration": ch_duration,
            "frames": frames,
            "transcript_segments": ch_transcript,
        })
        print(
            f"[chapters] {i+1}/{len(chapters)}: '{ch['title']}' "
            f"({format_time(ch['start'])} → {format_time(ch['end'])}) — "
            f"{len(frames)} frames, {len(ch_transcript)} transcript segs",
            file=sys.stderr,
        )

    return results


def print_chapter_report(chapter_results: list[dict]) -> None:
    print("## Chapter Analysis")
    print()
    for ch in chapter_results:
        dur = ch["end"] - ch["start"]
        print(f"### Chapter {ch['index']+1}: {ch['title']}")
        print(f"_{format_time(ch['start'])} → {format_time(ch['end'])} ({dur:.1f}s) — {len(ch['frames'])} frames_")
        print()
        for f in ch["frames"]:
            print(f"- `{f['path']}` (t={format_time(f['timestamp_seconds'])})")
        if ch.get("transcript_segments"):
            segs = ch["transcript_segments"]
            sample = " ".join(s["text"] for s in segs[:2])
            if len(sample) > 100:
                sample = sample[:100] + "…"
            print(f"  > {sample}")
        print()
