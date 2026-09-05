#!/usr/bin/env python3
"""Transcript sentiment arc.

Maps sentiment across the video timeline using keyword-based scoring.
No external dependencies. Returns a timeline of {time, score, label} buckets.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from frames import format_time  # noqa: E402


_POS = re.compile(
    r"\b(good|great|excellent|amazing|awesome|wonderful|fantastic|brilliant|"
    r"love|like|enjoy|helpful|useful|benefit|improve|success|win|achieve|"
    r"best|perfect|beautiful|positive|happy|exciting|powerful|effective|"
    r"easy|simple|clear|right|yes|true|agree|definitely|absolutely|sure|"
    r"recommend|valuable|interesting|grow|better|gain|incredible|innovative|"
    r"solution|solve|works|working|solved|fixed|yes|perfect|ideal)\b",
    re.IGNORECASE,
)

_NEG = re.compile(
    r"\b(bad|terrible|awful|horrible|wrong|fail|error|mistake|problem|issue|"
    r"difficult|hard|confusing|broken|hate|dislike|boring|useless|waste|"
    r"worse|worst|negative|sad|frustrating|annoying|disappointing|misleading|"
    r"never|not|don't|shouldn't|can't|won't|avoid|stop|quit|lose|lost|"
    r"concerned|worry|danger|risk|threat|fear|slow|expensive|complicated|"
    r"broken|crash|bug|failure|error|exception|warning|deprecated)\b",
    re.IGNORECASE,
)

_INTENSIFIERS = re.compile(
    r"\b(very|extremely|incredibly|absolutely|completely|totally|really|so|"
    r"super|ultra|massively|deeply|profoundly|highly)\b",
    re.IGNORECASE,
)


def score_segment(text: str) -> float:
    words = text.split()
    if not words:
        return 0.0
    pos_hits = len(_POS.findall(text))
    neg_hits = len(_NEG.findall(text))
    intensifier_hits = len(_INTENSIFIERS.findall(text))
    boost = 1.0 + (0.2 * intensifier_hits)
    raw = (pos_hits - neg_hits) * boost
    normalized = raw / max(1.0, len(words) ** 0.5)
    return round(max(-1.0, min(1.0, normalized)), 3)


def compute_sentiment_arc(
    segments: list[dict],
    bucket_seconds: float = 60.0,
) -> list[dict]:
    """Aggregate sentiment into time buckets."""
    if not segments:
        return []
    max_time = max(s["end"] for s in segments)
    buckets: list[dict] = []
    t = 0.0
    while t < max_time:
        bucket_segs = [s for s in segments if s["start"] >= t and s["start"] < t + bucket_seconds]
        if bucket_segs:
            avg = sum(score_segment(s["text"]) for s in bucket_segs) / len(bucket_segs)
        else:
            avg = 0.0
        label = "positive" if avg > 0.15 else ("negative" if avg < -0.15 else "neutral")
        buckets.append({
            "time": round(t, 1),
            "time_label": format_time(t),
            "score": round(avg, 3),
            "label": label,
            "segment_count": len(bucket_segs),
        })
        t += bucket_seconds
    return buckets


def find_peaks(arc: list[dict], top_n: int = 3) -> dict:
    if not arc:
        return {"peaks": [], "valleys": []}
    sorted_arc = sorted(arc, key=lambda b: b["score"])
    return {"peaks": sorted_arc[-top_n:][::-1], "valleys": sorted_arc[:top_n]}
