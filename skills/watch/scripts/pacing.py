#!/usr/bin/env python3
"""Editorial pacing metrics: cuts/min, shot length distribution."""
from __future__ import annotations

import json
import statistics
import sys


def compute_pacing(
    scene_times: list[float],
    video_duration: float,
    motion_scores: list[float] | None = None,
) -> dict:
    if not scene_times or video_duration <= 0:
        return {
            "shot_count": 0,
            "cuts_per_minute": 0.0,
            "mean_shot_length": 0.0,
            "median_shot_length": 0.0,
            "shots": [],
        }

    times = sorted(scene_times)
    if times[0] > 0.01:
        times = [0.0] + times

    shots: list[dict] = []
    for i, start in enumerate(times):
        end = times[i + 1] if i + 1 < len(times) else video_duration
        duration = max(0.0, end - start)
        shot = {
            "start_seconds": round(start, 2),
            "duration_seconds": round(duration, 2),
            "motion_score": None,
        }
        if motion_scores is not None and i < len(motion_scores):
            shot["motion_score"] = round(float(motion_scores[i]), 3)
        shots.append(shot)

    durations = [s["duration_seconds"] for s in shots]
    return {
        "shot_count": len(shots),
        "cuts_per_minute": round(len(shots) / (video_duration / 60.0), 2),
        "mean_shot_length": round(statistics.mean(durations), 2),
        "median_shot_length": round(statistics.median(durations), 2),
        "shots": shots,
    }


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: pacing.py <duration-seconds> <scene-time-1> [...]", file=sys.stderr)
        raise SystemExit(2)
    duration = float(sys.argv[1])
    times = [float(x) for x in sys.argv[2:]]
    print(json.dumps(compute_pacing(times, duration), indent=2))
