#!/usr/bin/env python3
"""
Build a captions plan from words.json.

Output: <workdir>/captions_plan.json — list of phrase-level lines,
each with constituent words and absolute (source-video) timestamps.

Usage:
  captions_plan.py <words.json> <out.json> [--emphasis "phrase1|phrase2|..."]

Phrase grouping rules:
  - Break on sentence-end punctuation in the word's `word` field (".", "!", "?")
  - Break on a long pause (gap to next word > BREAK_PAUSE)
  - Break when the running phrase reaches MAX_WORDS_PER_LINE
  - Break early when the running phrase reaches MAX_DUR_PER_LINE

Emphasis matching:
  - Each emphasis pattern is fuzzy-matched against the joined-word transcript:
    case-insensitive, punctuation-stripped, whitespace-normalized.
  - When a match is found, the line(s) covering that span are flagged
    `emphasis=True` and merged into a single emphasis line if they're
    adjacent. The render-time component renders these big-center.
  - The emphasis phrase wins over the regular grouping rules — i.e. an
  - emphasis span will not be split by a pause or sentence boundary.

Why this lives in render-time, not at planning-time: the upstream Claude
beat-planner reasons over content. Caption phrasing is a deterministic
text-grouping problem; doing it in code keeps the plan small and the
logic auditable.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

# Tuneables
MAX_WORDS_PER_LINE = 6        # caption legibility cap
MIN_WORDS_PER_LINE = 2        # don't strand single words on a line
MAX_DUR_PER_LINE = 2.4        # seconds; longer feels stale
BREAK_PAUSE = 0.42            # seconds; gap between words triggers a new line
SENTENCE_END = re.compile(r"[\.\!\?]\s*$")


def _norm(s: str) -> str:
    """Normalize a string for fuzzy phrase-matching."""
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def group_words_to_lines(words: list[dict], forced_breaks: set[int] | None = None) -> list[dict]:
    """Group words into phrase-level lines for caption display.

    `forced_breaks` is a set of word indices BEFORE which we MUST start a new
    line (used by emphasis: we force a break right before an emphasis span
    and right after, so the emphasis phrase becomes its own clean line).
    """
    forced_breaks = forced_breaks or set()
    lines: list[dict] = []
    current: list[dict] = []
    current_start_idx = 0
    for i, w in enumerate(words):
        # Forced break: if this word is the start of a new emphasis chunk, flush
        # whatever's accumulated first (unless it's empty).
        if i in forced_breaks and current:
            lines.append({
                "start_sec": current[0].get("start", 0.0),
                "end_sec": current[-1].get("end", 0.0),
                "_word_idx_start": current_start_idx,
                "_word_idx_end": i - 1,
                "words": [
                    {
                        "text": _strip_punct(c.get("word", "")),
                        "start_sec": c.get("start", 0.0),
                        "end_sec": c.get("end", 0.0),
                    }
                    for c in current
                ],
                "emphasis": False,
            })
            current = []
            current_start_idx = i
        if not current:
            current_start_idx = i
        current.append(w)
        # Compute conditions for breaking AFTER this word.
        text = w.get("word", "")
        ends_sentence = bool(SENTENCE_END.search(text))
        is_last = i == len(words) - 1
        gap_to_next = 0.0
        if not is_last:
            gap_to_next = max(0.0, words[i + 1].get("start", 0.0) - w.get("end", 0.0))
        cur_dur = current[-1].get("end", 0.0) - current[0].get("start", 0.0)
        word_count = len(current)

        too_many = word_count >= MAX_WORDS_PER_LINE
        too_long = cur_dur >= MAX_DUR_PER_LINE
        long_pause = gap_to_next >= BREAK_PAUSE
        # Avoid orphan singletons unless we're at the end of input.
        small_enough_to_extend = word_count < MIN_WORDS_PER_LINE and not is_last
        next_is_forced = (i + 1) in forced_breaks

        should_break = (
            is_last
            or next_is_forced
            or ((ends_sentence or long_pause or too_many or too_long) and not small_enough_to_extend)
        )
        if should_break:
            lines.append({
                "start_sec": current[0].get("start", 0.0),
                "end_sec": current[-1].get("end", 0.0),
                "_word_idx_start": current_start_idx,
                "_word_idx_end": i,
                "words": [
                    {
                        "text": _strip_punct(c.get("word", "")),
                        "start_sec": c.get("start", 0.0),
                        "end_sec": c.get("end", 0.0),
                    }
                    for c in current
                ],
                "emphasis": False,
            })
            current = []
            current_start_idx = i + 1
    # Hold each line ~0.18s past the last word so eyes have time to land.
    for i, ln in enumerate(lines):
        # Don't bleed past the next line's start, though.
        next_start = lines[i + 1]["start_sec"] if i + 1 < len(lines) else None
        target = ln["end_sec"] + 0.18
        if next_start is not None:
            target = min(target, next_start - 0.02)
        ln["end_sec"] = max(ln["end_sec"], target)
    return lines


def _strip_punct(s: str) -> str:
    """Keep punctuation OFF the rendered caption (looks cleaner) but preserve apostrophes."""
    s = s.strip()
    s = re.sub(r"^[\.,!\?;:\"\(]+|[\.,!\?;:\"\)]+$", "", s)
    return s


def find_emphasis_word_ranges(words: list[dict], patterns: list[str]) -> list[tuple[int, int]]:
    """Locate each emphasis pattern in the word stream.

    Returns a list of (first_word_idx, last_word_idx) pairs (inclusive),
    indexed against the ORIGINAL `words` array (not a filtered subset).
    """
    if not patterns:
        return []
    # Build a flat normalized-word stream and per-word char-offsets.
    word_spans: list[tuple[int, int, int]] = []  # (orig_idx, start, end)
    cursor = 0
    parts: list[str] = []
    for orig_idx, w in enumerate(words):
        norm = _norm(w.get("word", ""))
        if not norm:
            continue
        start = cursor
        end = start + len(norm)
        word_spans.append((orig_idx, start, end))
        parts.append(norm)
        cursor = end + 1
    flat = " ".join(parts)

    out: list[tuple[int, int]] = []
    for pat in patterns:
        np = _norm(pat)
        if not np:
            continue
        rx = re.compile(r"\b" + r"\s+".join(re.escape(t) for t in np.split()) + r"\b")
        for m in rx.finditer(flat):
            ms, me = m.start(), m.end()
            first_orig = next((oi for (oi, _a, b) in word_spans if b > ms), None)
            last_orig = None
            for (oi, a, _b) in reversed(word_spans):
                if a < me:
                    last_orig = oi
                    break
            if first_orig is not None and last_orig is not None and last_orig >= first_orig:
                out.append((first_orig, last_orig))
    return out


def mark_emphasis_lines(
    lines: list[dict],
    emph_ranges: list[tuple[int, int]],
    emph_styles: list[str] | None = None,
) -> list[dict]:
    """Flip `emphasis=True` on any line whose word-index range falls fully
    inside one of the emphasis spans. Because grouping was forced to break at
    span boundaries, this is now an exact match — emphasis lines contain
    ONLY the emphasized words, never adjacent context words.

    `emph_styles[i]` (optional) gives the per-pattern style to apply to lines
    matched by emphasis pattern i ("underline" or "block")."""
    emph_styles = emph_styles or []
    for ln in lines:
        s, e = ln.get("_word_idx_start", -1), ln.get("_word_idx_end", -1)
        for idx, (fs, fe) in enumerate(emph_ranges):
            # Line is fully inside the emphasis span
            if s >= fs and e <= fe:
                ln["emphasis"] = True
                if idx < len(emph_styles) and emph_styles[idx]:
                    ln["style"] = emph_styles[idx]
                break
    # Strip the bookkeeping fields so the JSON stays clean.
    for ln in lines:
        ln.pop("_word_idx_start", None)
        ln.pop("_word_idx_end", None)
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("words_json")
    ap.add_argument("out_json")
    ap.add_argument("--emphasis", default="", help="Pipe-separated phrases to render large-center")
    ap.add_argument("--max-words", type=int, default=0,
                    help="Override MAX_WORDS_PER_LINE. Shorts use 3 for the "
                         "cinematic word-punch caption cadence; 0 = keep default.")
    args = ap.parse_args()

    if args.max_words and args.max_words >= 2:
        global MAX_WORDS_PER_LINE
        MAX_WORDS_PER_LINE = args.max_words

    words = json.load(open(args.words_json))
    if not isinstance(words, list) or not words:
        Path(args.out_json).write_text("[]")
        print(f"[captions] empty words.json — wrote []")
        return

    # Parse `phrase` or `phrase:style` per emphasis entry. Style defaults
    # to "underline" if not specified. Valid styles: underline | block.
    patterns: list[str] = []
    styles: list[str] = []
    for raw in args.emphasis.split("|"):
        raw = raw.strip()
        if not raw:
            continue
        if ":" in raw and raw.rsplit(":", 1)[1] in ("underline", "block"):
            phrase, style = raw.rsplit(":", 1)
            patterns.append(phrase.strip())
            styles.append(style)
        else:
            patterns.append(raw)
            styles.append("")  # default — uses "underline" at render

    emph_ranges = find_emphasis_word_ranges(words, patterns)
    # Force a line break before the start AND after the end of every emphasis
    # span. That way the emphasis phrase becomes a clean line on its own —
    # no adjacent context words leaking in.
    forced: set[int] = set()
    for fs, fe in emph_ranges:
        forced.add(fs)
        forced.add(fe + 1)
    lines = group_words_to_lines(words, forced_breaks=forced)
    lines = mark_emphasis_lines(lines, emph_ranges, emph_styles=styles)

    Path(args.out_json).write_text(json.dumps(lines, indent=2))
    n_emph = sum(1 for ln in lines if ln.get("emphasis"))
    print(f"[captions] wrote {len(lines)} lines ({n_emph} emphasis) -> {args.out_json}")


if __name__ == "__main__":
    main()
