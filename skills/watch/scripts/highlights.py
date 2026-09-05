#!/usr/bin/env python3
"""Auto-highlight detection.

Scores video windows by combining transcript density, pacing intensity,
and engagement keyword signals. Returns the top N non-overlapping moments.
No external dependencies.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from frames import format_time  # noqa: E402


_HOOK_PATTERNS = re.compile(
    r"\b(secret|actually|never|always|most|best|worst|tip|hack|mistake|surprising|"
    r"shocking|revealed|finally|truth|real|stop|start|don't|do this|try this|"
    r"you need|important|critical|key|main|biggest|huge|powerful|game.changer|"
    r"everything|nothing|anyone|everyone|nobody|change|different|wrong|"
    r"right|exactly|here's|let me|watch|look|first|last|only|wait|but|"
    r"actually|in fact|the thing is|the truth|what if|imagine|consider)\b",
    re.IGNORECASE,
)


def score_window(
    segments: list[dict],
    start: float,
    end: float,
    scene_times: list[float],
) -> float:
    """Score [start, end] for highlight potential on [0, 1]."""
    duration = max(1.0, end - start)
    window_segs = [s for s in segments if s["start"] >= start and s["end"] <= end]
    text = " ".join(s["text"] for s in window_segs)
    word_count = len(text.split())

    density_score = min(1.0, word_count / (duration * 3))
    cuts = sum(1 for t in scene_times if start <= t <= end)
    pacing_score = min(1.0, cuts / max(1.0, duration * 0.3))
    kw_matches = len(_HOOK_PATTERNS.findall(text))
    keyword_score = min(1.0, kw_matches / max(1, word_count / 10))

    return round(0.4 * density_score + 0.3 * pacing_score + 0.3 * keyword_score, 3)


def find_highlights(
    transcript_segments: list[dict],
    frames: list[dict],
    pacing: dict,
    video_duration: float,
    top_n: int = 5,
    window_seconds: float = 30.0,
    step_seconds: float = 15.0,
) -> list[dict]:
    """Slide a window and rank segments by composite score."""
    if video_duration <= 0:
        return []

    scene_times = [s["start_seconds"] for s in (pacing.get("shots") or [])]

    windows = []
    t = 0.0
    while t < video_duration:
        end = min(t + window_seconds, video_duration)
        score = score_window(transcript_segments, t, end, scene_times)

        window_frames = [f for f in frames if t <= f["timestamp_seconds"] <= end][:3]
        window_segs = [s for s in transcript_segments if s["start"] >= t and s["end"] <= end]
        snippet = " ".join(s["text"] for s in window_segs[:3])
        if len(snippet) > 120:
            snippet = snippet[:120] + "…"

        windows.append({
            "start": round(t, 1),
            "end": round(end, 1),
            "score": score,
            "frames": window_frames,
            "snippet": snippet,
        })
        t += step_seconds

    windows.sort(key=lambda w: w["score"], reverse=True)
    selected = []
    for w in windows:
        overlap = any(
            not (w["end"] <= s["start"] or w["start"] >= s["end"])
            for s in selected
        )
        if not overlap:
            selected.append(w)
        if len(selected) >= top_n:
            break

    return sorted(selected, key=lambda w: w["start"])


def print_highlights(highlights: list[dict]) -> None:
    if not highlights:
        print("_No highlights detected (insufficient transcript or frame data)._")
        return
    print("## Auto-Highlights")
    print()
    for i, h in enumerate(highlights, 1):
        print(f"### Highlight {i} — {format_time(h['start'])} → {format_time(h['end'])} (score: {h['score']})")
        print()
        if h["snippet"]:
            print(f"> {h['snippet']}")
            print()
        for f in h["frames"]:
            print(f"- `{f['path']}` (t={format_time(f['timestamp_seconds'])})")
        print()
