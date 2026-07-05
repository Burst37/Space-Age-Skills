#!/usr/bin/env python3
"""
Build a cut plan from word-level timestamps.

Reads:  <video>.workdir/words.json
Writes: <video>.workdir/cut_plan.json with:
  - keeps:           [[src_start, src_end], ...]   source-time segments to keep
  - cuts:            [[src_start, src_end], ...]   source-time segments removed
  - remapped_words:  [{word, start, end}, ...]     words on the new (post-cut) timeline
  - new_duration_sec
  - source_duration_sec
  - cover_points:    [{at_sec, source_cut: [s,e]}] new-timeline times where a cut joined two segments
"""
import json
import os
import sys
import subprocess
from pathlib import Path


HARD_FILLERS = {"um", "uh", "uhm", "uhh", "ah", "ahh", "er", "erm", "hmm", "mm", "mhm"}
WEAK_FILLERS = {"like", "basically", "actually", "literally", "honestly"}

DEFAULT_MAX_SILENCE = float(os.environ.get("MAX_SILENCE", "0.25"))
DEFAULT_SILENCE_PAD = float(os.environ.get("SILENCE_PAD", "0.05"))
DEFAULT_WORD_PAD = float(os.environ.get("WORD_PAD", "0.02"))
DEFAULT_HEAD_PAD = float(os.environ.get("HEAD_PAD", "0.05"))
DEFAULT_TAIL_PAD = float(os.environ.get("TAIL_PAD", "0.12"))


def workdir_for(video_path: Path) -> Path:
    import hashlib
    digest = hashlib.sha1(str(video_path.resolve()).encode()).hexdigest()[:12]
    return Path.home() / ".cache" / "video-edit" / f"{video_path.stem[:40]}_{digest}"


def probe_duration(video_path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(video_path),
    ]).decode().strip()
    return float(out)


def normalize(word: str) -> str:
    return word.strip().lower().strip(".,!?;:'\"")


def is_hard_filler(word: str) -> bool:
    return normalize(word) in HARD_FILLERS


def is_weak_filler_with_pause(words: list[dict], i: int, pause_threshold: float = 0.25) -> bool:
    w = words[i]
    if normalize(w["word"]) not in WEAK_FILLERS:
        return False
    pre_gap = w["start"] - words[i - 1]["end"] if i > 0 else 1.0
    post_gap = words[i + 1]["start"] - w["end"] if i < len(words) - 1 else 1.0
    return pre_gap > pause_threshold or post_gap > pause_threshold


def merge_ranges(ranges: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if not ranges:
        return []
    ranges = sorted(ranges)
    merged = [list(ranges[0])]
    for s, e in ranges[1:]:
        if s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return [(s, e) for s, e in merged]


def invert_to_keeps(cuts: list[tuple[float, float]], duration: float) -> list[tuple[float, float]]:
    keeps: list[tuple[float, float]] = []
    cursor = 0.0
    for s, e in cuts:
        if s > cursor:
            keeps.append((cursor, s))
        cursor = max(cursor, e)
    if cursor < duration:
        keeps.append((cursor, duration))
    return keeps


def remap_words(words: list[dict], keeps: list[tuple[float, float]]) -> list[dict]:
    out: list[dict] = []
    offset = 0.0
    for ks, ke in keeps:
        for w in words:
            if w["start"] >= ks and w["end"] <= ke:
                out.append({
                    "word": w["word"],
                    "start": offset + (w["start"] - ks),
                    "end": offset + (w["end"] - ks),
                })
        offset += (ke - ks)
    return out


def cover_points_from_keeps(keeps: list[tuple[float, float]], cuts: list[tuple[float, float]]) -> list[dict]:
    points: list[dict] = []
    cumulative = 0.0
    for i, (ks, ke) in enumerate(keeps[:-1]):
        cumulative += (ke - ks)
        for cs, ce in cuts:
            if abs(cs - ke) < 0.05 or (cs >= ke - 0.05 and ce <= keeps[i + 1][0] + 0.05):
                points.append({
                    "at_sec": round(cumulative, 4),
                    "source_cut": [round(cs, 4), round(ce, 4)],
                })
                break
    return points


def build_cut_ranges(words: list[dict], duration: float) -> list[tuple[float, float]]:
    cuts: list[tuple[float, float]] = []

    # Pre-roll silence
    if words and words[0]["start"] > DEFAULT_HEAD_PAD * 2:
        cuts.append((0.0, words[0]["start"] - DEFAULT_HEAD_PAD))

    # Filler words
    for i, w in enumerate(words):
        if is_hard_filler(w["word"]) or is_weak_filler_with_pause(words, i):
            cuts.append((
                max(0.0, w["start"] - DEFAULT_WORD_PAD),
                min(duration, w["end"] + DEFAULT_WORD_PAD),
            ))

    # Long inter-word silences -> compress to SILENCE_PAD on each side
    for i in range(len(words) - 1):
        gap_start = words[i]["end"]
        gap_end = words[i + 1]["start"]
        gap = gap_end - gap_start
        if gap > DEFAULT_MAX_SILENCE:
            cuts.append((gap_start + DEFAULT_SILENCE_PAD, gap_end - DEFAULT_SILENCE_PAD))

    # Post-roll silence
    if words and duration - words[-1]["end"] > DEFAULT_TAIL_PAD * 2:
        cuts.append((words[-1]["end"] + DEFAULT_TAIL_PAD, duration))

    return merge_ranges(cuts)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: cutplan.py <video_path>", file=sys.stderr)
        return 2

    video_path = Path(sys.argv[1]).expanduser().resolve()
    if not video_path.exists():
        print(f"video not found: {video_path}", file=sys.stderr)
        return 1

    wd = workdir_for(video_path)
    words_json = wd / "words.json"
    if not words_json.exists():
        print(f"missing {words_json} — run transcribe.py first", file=sys.stderr)
        return 1

    out_path = wd / "cut_plan.json"
    if out_path.exists() and os.environ.get("FORCE") != "1":
        print(f"cut_plan.json exists, skipping: {out_path}")
        return 0

    words = json.loads(words_json.read_text())
    duration = probe_duration(video_path)

    cuts = build_cut_ranges(words, duration)
    keeps = invert_to_keeps(cuts, duration)
    new_duration = sum(e - s for s, e in keeps)
    remapped = remap_words(words, keeps)
    cover_points = cover_points_from_keeps(keeps, cuts)

    plan = {
        "source": str(video_path),
        "source_duration_sec": round(duration, 4),
        "new_duration_sec": round(new_duration, 4),
        "compression_ratio": round(new_duration / duration, 3) if duration else 0,
        "keeps": [[round(s, 4), round(e, 4)] for s, e in keeps],
        "cuts": [[round(s, 4), round(e, 4)] for s, e in cuts],
        "cover_points": cover_points,
        "remapped_words": [
            {"word": w["word"], "start": round(w["start"], 4), "end": round(w["end"], 4)}
            for w in remapped
        ],
        "params": {
            "max_silence": DEFAULT_MAX_SILENCE,
            "silence_pad": DEFAULT_SILENCE_PAD,
            "word_pad": DEFAULT_WORD_PAD,
            "head_pad": DEFAULT_HEAD_PAD,
            "tail_pad": DEFAULT_TAIL_PAD,
        },
    }
    out_path.write_text(json.dumps(plan, indent=2))

    print(f"Source:  {duration:.2f}s")
    print(f"Edited:  {new_duration:.2f}s ({plan['compression_ratio']*100:.0f}% of original)")
    print(f"Cuts:    {len(cuts)}  ({len(cover_points)} cover points)")
    print(f"Words:   {len(remapped)} on new timeline")
    print(f"Wrote -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
