#!/usr/bin/env python3
"""
Close micro-gaps between adjacent b-roll beats.

When two beats are within MAX_GAP seconds of each other, the human eye reads
the empty stretch in between as a "flicker" — the speaker layer flashes
through for a fraction of a second. Solution: extend the earlier beat's
`end_sec` to meet the next beat's `start_sec` so the cuts feel back-to-back.

Anything > MAX_GAP is left alone (intentional breathing room).

Idempotent.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

MAX_GAP = 1.5  # seconds. Owner directive 2026-05-29: a visual that pops off,
               # shows the speaker for ~0.5-1s, then another visual pops on
               # reads as "trippy" — the eye never settles. The rule: visuals
               # should be EITHER back-to-back OR separated by a real breathing
               # beat (>1.5s of speaker). So we bridge every sub-1.5s gap to
               # the next beat (back-to-back); anything larger is intentional
               # speaker breathing and is left alone. (Was 0.6 — that left the
               # 0.6-1.5s "trippy zone" untouched.)
MAX_BRIDGED_DUR = 6.0  # but never extend a beat past this many seconds total.
               # Bridging is to kill flicker, not to turn a visual into a
               # setpiece. If closing the gap would make the earlier beat
               # longer than this, leave the gap (it becomes a breather).

# Partial overlays render on their OWN layer and leave the speaker visible, so
# two of them are ALLOWED to overlap (e.g. an accumulating row of icons, each
# popping in as it's named and STAYING). Never shorten/bridge between two of
# these — overlap is intentional, and there's no speaker-flicker to fix.
PARTIAL_KINDS = {
    "icon", "word_pop", "hook_title", "subscribe", "bar_overlay", "tool_logo_burst",
    "portrait_burst", "agent_avatar_burst", "ratio_dots", "inline_chart",
    "claude_code_terminal", "dashboard_card", "image_card", "headline_card",
}


def close(plan_path: Path) -> int:
    if not plan_path.exists():
        print(f"plan not found: {plan_path}", file=sys.stderr)
        return 2
    plan = json.loads(plan_path.read_text())
    if len(plan) < 2:
        print("nothing to do (less than 2 beats)")
        return 0

    closed = 0
    fixed_overlap = 0
    plan_sorted = sorted(range(len(plan)), key=lambda i: float(plan[i]["start_sec"]))
    for k in range(len(plan_sorted) - 1):
        a = plan[plan_sorted[k]]
        b = plan[plan_sorted[k + 1]]
        end_a = float(a["end_sec"])
        start_b = float(b["start_sec"])
        gap = start_b - end_a
        if a.get("kind", "static") in PARTIAL_KINDS or b.get("kind", "static") in PARTIAL_KINDS:
            # At least one beat is a layer-composited partial overlay. Partials
            # render on their OWN layer above whatever's beneath, so:
            #   - partial + partial → overlap is intentional (accumulating row)
            #   - partial + takeover → the partial is text/graphic ON the b-roll
            #     (e.g. a word_pop label over a full-screen `video`/`static`).
            # In neither case should we shorten/bridge: the partial must keep its
            # speech-aligned span, and the takeover beneath keeps its own. Only
            # genuine takeover-on-takeover overlap (both non-partial, from tails)
            # is a real flicker to fix.
            continue
        if gap < 0:
            # OVERLAP: shorten earlier beat to end just before next starts.
            # Caused by aggressive tails (align_to_speech TAIL_SEC=1.5)
            # bumping the earlier beat past the next beat's start.
            new_end = round(start_b - 0.02, 2)
            if new_end > float(a["start_sec"]):
                a["end_sec"] = new_end
                fixed_overlap += 1
                print(f"  fixed {-gap:.2f}s overlap: beat at {a['start_sec']}s now ends at {new_end}s")
        elif 0 < gap <= MAX_GAP:
            new_end = round(start_b, 2)
            bridged_dur = new_end - float(a["start_sec"])
            if bridged_dur > MAX_BRIDGED_DUR:
                # Closing the gap would turn this beat into a setpiece. Leave
                # the gap — it becomes an intentional breather instead.
                print(f"  left {gap:.2f}s gap: bridging beat at {a['start_sec']}s would exceed {MAX_BRIDGED_DUR}s ({bridged_dur:.2f}s)")
                continue
            a["end_sec"] = new_end
            closed += 1
            print(f"  closed {gap:.2f}s gap: beat at {a['start_sec']}s now ends at {start_b}s")

    plan_path.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"closed {closed} micro-gap(s) in {plan_path}")
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: close_gaps.py <broll_plan.json>", file=sys.stderr)
        return 2
    return close(Path(sys.argv[1]).expanduser().resolve())


if __name__ == "__main__":
    sys.exit(main())
