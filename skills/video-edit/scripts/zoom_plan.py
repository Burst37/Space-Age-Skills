#!/usr/bin/env python3
"""
Smart zoom-punch plan based on transcript emphasis cues.

Heuristic: zoom on moments where the speaker is making a point. Not random
N-second intervals.

We score each word by how "punchy" it is, then pick the top-N moments and
build 2.5s zoom windows around them, while keeping a minimum gap between
zooms so they don't pile up.

Punchy signals (each adds to score):
  - Numbers / dollar amounts / percentages
  - Named tools / brands (Claude, Hacker News, Stripe…)
  - Pivot words ("but", "wait", "actually", "here's why")
  - Strong end-of-sentence words after a punctuation mark in the previous one
  - Words preceded by long pauses (the speaker's "loaded" pause before a punch)

The zoom curve itself is ease-in-ease-out — that's handled in EditedVideo.tsx.
"""
import json
import os
import re
import sys
from pathlib import Path


def workdir_for(video_path: Path) -> Path:
    import hashlib
    digest = hashlib.sha1(str(video_path.resolve()).encode()).hexdigest()[:12]
    return Path.home() / ".cache" / "video-edit" / f"{video_path.stem[:40]}_{digest}"


# --- Punchiness heuristics ---

NAMED_BRANDS = {
    "claude", "anthropic", "hacker", "openai", "gpt", "stripe", "supabase",
    "lovable", "cursor", "vercel", "github", "linear", "notion", "shopify",
    "remotion", "ffmpeg", "whisper",
}

PIVOT_WORDS = {
    "but", "wait", "actually", "however", "instead", "really",
    "look", "listen", "here's",
}

NUMBER_PAT = re.compile(r"^[\$£€]?[\d.,]+[%kKmMbB]?$|^\d{1,3}([,.]?\d{3})+$")


def is_number(w: str) -> bool:
    cleaned = w.strip(".,!?;:'\"")
    return bool(NUMBER_PAT.match(cleaned))


def is_named_brand(w: str) -> bool:
    return w.strip(".,!?;:'\"").lower() in NAMED_BRANDS


def is_pivot(w: str) -> bool:
    return w.strip(".,!?;:'\"").lower() in PIVOT_WORDS


def score_word(words: list[dict], i: int) -> float:
    w = words[i]["word"]
    score = 0.0
    if is_number(w):                     score += 3.0
    if is_named_brand(w):                score += 2.5
    if is_pivot(w):                      score += 2.0
    # Loaded pause: previous word ended >0.5s before this one
    if i > 0:
        gap = words[i]["start"] - words[i - 1]["end"]
        if gap > 0.5:                    score += 1.2
        if gap > 1.0:                    score += 0.6
    # First word after a sentence end
    if i > 0 and re.search(r"[.!?]$", words[i - 1]["word"]):
        score += 1.0
    return score


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: zoom_plan.py <video_path>", file=sys.stderr)
        return 2

    video_path = Path(sys.argv[1]).expanduser().resolve()
    wd = workdir_for(video_path)
    words_json = wd / "words.json"
    if not words_json.exists():
        print(f"missing {words_json} — run transcribe.py first", file=sys.stderr)
        return 1
    words = json.loads(words_json.read_text())
    if not words:
        print("empty transcript", file=sys.stderr); return 1

    duration = words[-1]["end"]
    target_count = max(3, int(duration / 6.5))   # ~one zoom every 6.5s on average
    min_gap = float(os.environ.get("ZOOM_MIN_GAP", "3.5"))

    scale_default = float(os.environ.get("ZOOM_PUNCH_INTENSITY", "1.06"))
    window_dur = float(os.environ.get("ZOOM_WINDOW_DUR", "2.4"))
    pre_pad = float(os.environ.get("ZOOM_PRE_PAD", "0.15"))

    # Score every word, sort desc by score
    scored = []
    for i, w in enumerate(words):
        s = score_word(words, i)
        if s > 0:
            scored.append((s, i, w["start"]))
    scored.sort(reverse=True)

    # Greedy pick top-scoring with min_gap enforced
    picks: list[tuple[float, str]] = []
    chosen_times: list[float] = []
    for s, i, t in scored:
        if any(abs(t - ct) < min_gap for ct in chosen_times):
            continue
        picks.append((t, words[i]["word"]))
        chosen_times.append(t)
        if len(picks) >= target_count:
            break

    picks.sort()
    plan = []
    for t, label in picks:
        # Slightly stronger scale on numbers/brands
        scale = scale_default + (0.02 if is_number(label) or is_named_brand(label) else 0)
        plan.append({
            "start_sec": round(max(0.0, t - pre_pad), 3),
            "end_sec": round(t + window_dur, 3),
            "scale": round(scale, 3),
            "trigger": label.strip(".,!?;:'\""),
        })

    out_path = wd / "zoom_plan.json"
    out_path.write_text(json.dumps(plan, indent=2))
    print(f"transcript: {len(words)} words, {duration:.1f}s")
    print(f"target zooms: {target_count}, picked: {len(plan)}")
    for z in plan:
        print(f"  {z['start_sec']:5.1f} -> {z['end_sec']:5.1f}   scale {z['scale']}   on '{z['trigger']}'")
    print(f"wrote -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
