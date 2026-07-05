#!/usr/bin/env python3
"""
Pin every list-overlay item to the moment the speaker actually says it.

Reads <workdir>/broll_plan.json and <workdir>/words.json. For each list beat,
walks the items in order and, for each item, finds the first transcript token
inside the beat's time window that "matches" a keyword from the item text.
Sets `appear_sec` on each item so the comp can reveal rows in sync with speech
instead of front-loading the whole list (which spoils the punchline).

If an item's keyword can't be found, falls back to evenly distributing items
across the list's duration starting from `start_sec`.

Idempotent: items that already have `appear_sec` set are left untouched.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for",
    "is", "are", "was", "were", "be", "been", "being", "do", "does", "did",
    "have", "has", "had", "this", "that", "these", "those", "it", "its",
    "i", "you", "he", "she", "we", "they", "my", "your", "their", "our",
    "what", "when", "where", "who", "why", "how", "with", "without",
    "as", "at", "by", "from", "into", "onto", "than", "then", "so",
    "no", "not", "yes", "if", "while", "during",
}

PUNCT_RE = re.compile(r"[^\w\s'-]")
WORD_RE = re.compile(r"\w+")


def normalize(s: str) -> str:
    return s.lower().strip().strip(",.!?;:\"'")


def keywords(item_text: str) -> list[str]:
    """Return content words from an item, in order, lowercased."""
    cleaned = PUNCT_RE.sub(" ", item_text.lower())
    out: list[str] = []
    for tok in WORD_RE.findall(cleaned):
        if tok in STOPWORDS:
            continue
        if len(tok) <= 1:
            continue
        out.append(tok)
    return out


def find_appear_sec(
    words: list[dict],
    item_keywords: list[str],
    win_start: float,
    win_end: float,
    after_sec: float,
) -> float | None:
    """Find the first word in words.json within [win_start, win_end] and after
    `after_sec` that matches any of `item_keywords`. Returns its `start`."""
    for w in words:
        ws = float(w.get("start", 0))
        if ws < max(win_start, after_sec):
            continue
        if ws > win_end:
            break
        tok = normalize(w.get("word", ""))
        if not tok:
            continue
        if tok in item_keywords:
            return ws
        # Also accept keyword as a substring of the spoken token (handles
        # "credentials" matching "credential's", contractions, etc.).
        for kw in item_keywords:
            if kw in tok and len(kw) >= 4:
                return ws
    return None


MIN_LAST_ITEM_DWELL = 1.5  # seconds the last item must remain on-screen


def sync(plan_path: Path, words_path: Path) -> int:
    if not plan_path.exists():
        print(f"plan not found: {plan_path}", file=sys.stderr)
        return 2
    if not words_path.exists():
        print(f"words.json not found: {words_path}", file=sys.stderr)
        return 2

    plan = json.loads(plan_path.read_text())
    words = json.loads(words_path.read_text())
    changed = 0
    extended = 0

    for b in plan:
        if b.get("kind") != "list":
            continue
        items = b.get("items", [])
        if not items:
            continue
        win_start = float(b["start_sec"])
        win_end = float(b["end_sec"])
        last_pinned = win_start
        new_items = []
        for idx, it in enumerate(items):
            if isinstance(it, dict) and "appear_sec" in it:
                # Already pinned; respect it.
                new_items.append(it)
                last_pinned = float(it["appear_sec"])
                continue
            text = it["text"] if isinstance(it, dict) else str(it)
            kws = keywords(text)
            found = find_appear_sec(words, kws, win_start, win_end, last_pinned)
            if found is None:
                # Even fallback: distribute remaining items across remaining time.
                remaining = len(items) - idx
                slot = (win_end - last_pinned) / max(1, remaining + 1)
                appear = round(last_pinned + slot, 2)
            else:
                appear = round(max(found - 0.10, last_pinned + 0.05), 2)
            new_items.append({"text": text, "appear_sec": appear})
            last_pinned = appear
            changed += 1
        b["items"] = new_items

        # Enforce minimum dwell time for the last item, AND ensure end_sec
        # reaches past every item's appear_sec. Previously this capped the
        # extension at +2s, which caused list end to be SHORTER than a
        # later item's appear_sec — items 2/3 never rendered because the
        # Sequence already ended. Now we extend to whatever's needed,
        # then defer to the next beat's start_sec only when there's a
        # collision (which close_gaps.py will then resolve).
        if new_items:
            last_appear = float(new_items[-1]["appear_sec"])
            current_end = float(b["end_sec"])
            needed_end = last_appear + MIN_LAST_ITEM_DWELL
            if needed_end > current_end:
                b["end_sec"] = round(needed_end, 2)
                extended += 1

    plan_path.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"pinned {changed} list items in {plan_path}" + (f" (+{extended} list end_sec extended for dwell)" if extended else ""))
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: sync_list_items.py <broll_plan.json> [<words.json>]", file=sys.stderr)
        return 2
    plan = Path(sys.argv[1]).expanduser().resolve()
    if len(sys.argv) > 2:
        words = Path(sys.argv[2]).expanduser().resolve()
    else:
        words = plan.parent / "words.json"
    return sync(plan, words)


if __name__ == "__main__":
    sys.exit(main())
