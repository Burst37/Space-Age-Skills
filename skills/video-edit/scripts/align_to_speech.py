#!/usr/bin/env python3
"""
Snap each beat's start_sec / end_sec to the actual spoken-word boundaries.

Plans authored by hand have approximate timings. The eye is unforgiving
about the visual being half a second early or late. This script reads each
beat's `speech_anchor` (the exact phrase the speaker says when the visual
should be on screen) and looks it up in words.json:

  start_sec = first matched word's `start` − LEAD_SEC
  end_sec   = last  matched word's `end`   + TAIL_SEC

For `quote_pull` beats it ALSO sets `chars_per_second` so the typewriter
finishes around the same moment the speaker finishes the quote (within ±5%).

If a beat lacks `speech_anchor`, it's left alone.

Idempotent. Run after sync_list_items.py and before close_gaps.py.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

LEAD_SEC = 0.10  # how early the visual lands relative to first spoken word
TAIL_SEC = 0.80  # how long the visual lingers past the last spoken word.
                 # Was 1.50 — reduced May 21 2026 after the $400M stat_punch
                 # dwelled for 4.4s ("way too long, viewers got bored"). 0.80s
                 # is enough to register the visual's punctuation without it
                 # becoming a setpiece. Pair with close_gaps MAX_GAP=0.60 so
                 # intentional 0.8-1.5s breathing room is preserved.
                  # 0.60 was too short — visuals snapped off right as the
                  # phrase ended. 1.5s lets the eye absorb + the speaker
                  # transition into the next sentence with the visual still
                  # present. close_gaps.py then bridges any remaining
                  # sub-1.5s gap to the next beat.
HOOK_FACE_TIME_SEC = 1.5  # the speaker MUST be visible for at least this many
                          # seconds before any takeover beat can land. Without
                          # this floor, alignment can snap the first beat to
                          # a word that starts at 0.0–0.5s and the viewer
                          # never sees the speaker before a visual covers
                          # them. Aligning to actual speech is right; covering
                          # the cold-open before the viewer has locked onto
                          # the speaker isn't.
MAX_BEAT_SEC = 5.0  # hard ceiling on any beat's on-screen time. The speaker
                    # carries the show; visuals are punctuation, not setpieces.
                    # Anything beyond ~5s reads as boring even with motion. If
                    # the natural anchor span + tail produces a longer beat,
                    # we clamp end_sec down so the visual disappears and the
                    # speaker comes through. If the next beat starts within
                    # 1.5s of the new end, close_gaps.py bridges (no flicker).
                    # Otherwise the gap is intentional breathing room.

# Kinds that cycle through multiple sub-items (each on screen <2s) — the
# beat is a CONTAINER, not a single static visual, so the 5s ceiling does
# not apply. Without this exemption a word_pop spanning 6s of enumeration
# would be clamped to 5s, silently dropping the last item.
SEQUENCE_KINDS = {
    "word_pop", "list", "keyword_chips", "progress_steps",
    "horizontal_timeline", "vertical_timeline", "chat_message",
    "ticker_feed", "annotated_screenshot",
    "side_panel",
    # bar_overlay enumerates too — bars stagger in by index as the speaker
    # counts ("1, 10, 20…"). Added May 22 2026 after scene-7's 6.2s bar
    # was clamped to 5s and disappeared mid-count.
    "bar_overlay",
    # bullet_burst — summed-up bullets that accumulate across the speaker's
    # rapid-fire enumeration. Spans the whole list, not just the anchor.
    "bullet_burst",
    # portrait_burst — small portraits of people, each appearing at its
    # own appear_sec as they're named. Spans the whole reference range.
    "portrait_burst",
    # tool_logo_burst — same shape as portrait_burst, for brand/tool logos.
    "tool_logo_burst",
    # agent_avatar_burst — robot avatars accumulating across the cull pattern.
    "agent_avatar_burst",
    # org_diagram — 12-node org chart with per-node appear_sec / dim_at.
    "org_diagram",
    # claude_code_terminal — multi-line typewriter, each line at own appear_sec.
    "claude_code_terminal",
    # ratio_dots — X-of-Y dots with delayed mark_at flip (long-duration normal).
    "ratio_dots",
    # kinetic_statement — words reveal across the spoken line; per-word
    # appear_sec is absolute, so the beat must keep its authored span.
    "kinetic_statement",
    # concept_build — elements/connectors carry absolute appear_sec across the
    # explanation, so the beat must keep its authored span.
    "concept_build",
    # network_spread — the hub radiates spokes then $ tokens flow for the rest
    # of the beat; the whole authored span is the choreography, not one anchor.
    "network_spread",
    # command_deck — department tiles boot up one-by-one across the spoken line;
    # each tile's appear_sec is absolute, so the beat keeps its authored span.
    "command_deck",
    # calendar_months — N mini-calendars fill lime in sequence across the whole
    # beat; the authored span IS the fill choreography, not one anchor.
    "calendar_months",
    # layer_stack — architecture slabs build bottom→top across the spoken
    # enumeration; the whole authored span is the build.
    "layer_stack",
}

PUNCT_RE = re.compile(r"[^\w\s'-]")


def normalize(s: str) -> str:
    return PUNCT_RE.sub("", s.lower()).strip()


def tokens(s: str) -> list[str]:
    return [t for t in normalize(s).split() if t]


def find_phrase(words: list[dict], phrase: str) -> tuple[float, float] | None:
    """Find the contiguous span in `words` that matches `phrase`. Returns the
    (first_word.start, last_word.end) or None if no match.

    Robust to: capitalization, punctuation, contractions ("can't" / "cant"),
    minor word substitutions (matches if 70%+ of phrase tokens align in order).
    """
    target = tokens(phrase)
    if not target:
        return None
    spoken = [normalize(w.get("word", "")) for w in words]
    n = len(target)

    # Try exact contiguous match first
    for i in range(len(spoken) - n + 1):
        window = spoken[i:i + n]
        if window == target:
            return float(words[i]["start"]), float(words[i + n - 1]["end"])

    # Loose: ≥70% of target tokens appear in order within an n+3 window
    threshold = max(2, int(n * 0.70))
    for i in range(len(spoken) - n + 1):
        for window_size in (n, n + 1, n + 2, n + 3):
            window = spoken[i:i + window_size]
            if len(window) < threshold:
                continue
            # Greedy in-order match
            ti = 0
            matched_starts: list[int] = []
            for k, w in enumerate(window):
                if ti < len(target) and (w == target[ti] or (len(target[ti]) >= 4 and target[ti] in w)):
                    matched_starts.append(i + k)
                    ti += 1
            if len(matched_starts) >= threshold:
                return (
                    float(words[matched_starts[0]]["start"]),
                    float(words[matched_starts[-1]]["end"]),
                )
    return None


def align(plan_path: Path, words_path: Path) -> int:
    if not plan_path.exists():
        print(f"plan not found: {plan_path}", file=sys.stderr)
        return 2
    if not words_path.exists():
        print(f"words.json not found: {words_path}", file=sys.stderr)
        return 2

    plan = json.loads(plan_path.read_text())
    words = json.loads(words_path.read_text())
    moved = 0

    # Identify the earliest beat by current start_sec — that's the cold-open
    # hook visual. Apply a HOOK_FACE_TIME_SEC floor to its start so the
    # speaker has at least 1.5s of face-time before any takeover lands.
    sorted_idx = sorted(range(len(plan)), key=lambda i: float(plan[i]["start_sec"]))
    hook_idx = sorted_idx[0] if sorted_idx else None

    for i, b in enumerate(plan):
        anchor = b.get("speech_anchor")
        if not anchor:
            continue
        match = find_phrase(words, anchor)
        if not match:
            print(f"  [warn] could not locate speech_anchor in transcript: {anchor!r}", file=sys.stderr)
            continue
        first_start, last_end = match
        new_start = round(max(0.0, first_start - LEAD_SEC), 2)
        new_end = round(last_end + TAIL_SEC, 2)
        # NEVER shorten below the author's chosen end_sec — universal, every
        # kind. The `speech_anchor` is a START marker; the author decided how
        # long the visual lingers. Anchor-derived `last_end + TAIL` is only
        # the FLOOR. This used to apply only to SEQUENCE_KINDS — but scene-7's
        # `bar_overlay` (a non-sequence kind whose bars stagger as the speaker
        # counts "1, 10, 20") proved every kind needs the same protection.
        # Caught May 22 2026: a 6.2s bar got clobbered to ~5s and disappeared
        # while the speaker was still on the second bar.
        authored_end = float(b["end_sec"])
        authored_extended = authored_end > new_end
        if authored_extended:
            new_end = authored_end
        # Cold-open floor: hook visual must NEVER cover the speaker before
        # 1.5s of face-time. If alignment would put the hook earlier, push
        # it forward and shift end_sec by the same delta to preserve duration.
        if i == hook_idx and new_start < HOOK_FACE_TIME_SEC:
            shift = HOOK_FACE_TIME_SEC - new_start
            new_start = HOOK_FACE_TIME_SEC
            new_end = round(new_end + shift, 2)
            print(f"  [hook-floor] pushed first beat to {HOOK_FACE_TIME_SEC}s "
                  f"(speaker needs face-time before any visual)")
        # Cap beat duration at MAX_BEAT_SEC. Visuals beyond ~5s read as boring
        # static frames when the anchor accidentally extends them — but if the
        # AUTHOR deliberately set a long end_sec (and lint's 8s hard ceiling
        # let it through), respect it. Clamp ONLY anchor-driven extensions on
        # non-sequence kinds.
        if (not authored_extended
                and (new_end - new_start) > MAX_BEAT_SEC
                and b.get("kind") not in SEQUENCE_KINDS):
            old_dur = new_end - new_start
            new_end = round(new_start + MAX_BEAT_SEC, 2)
            print(f"  [max-dur] clamped {b.get('kind','?')} from {old_dur:.2f}s → "
                  f"{MAX_BEAT_SEC}s ({anchor[:40]!r})")
        old_start, old_end = float(b["start_sec"]), float(b["end_sec"])
        if abs(new_start - old_start) >= 0.05 or abs(new_end - old_end) >= 0.05:
            b["start_sec"] = new_start
            b["end_sec"] = new_end
            moved += 1
            print(f"  aligned [{b.get('kind', '?')}] {old_start}-{old_end} → {new_start}-{new_end} "
                  f"({anchor[:40]!r})")

        # quote_pull: adjust typewriter cadence so typing finishes around
        # when the speaker finishes the quote, AND ensure the beat lingers
        # past the typewriter so the viewer can actually READ the full quote.
        if b.get("kind") == "quote_pull":
            text = b.get("quote_text", "")
            if text:
                spoken_dur = last_end - first_start
                # Reserve the first ~0.30s of the beat for the lime quote glyph
                # entrance before the typewriter starts (matches QuotePull.tsx
                # default typeStart). Then aim to finish 0.05s before speaker.
                effective = max(0.5, spoken_dur - 0.30 + LEAD_SEC - 0.05)
                cps = round(len(text) / effective, 1)
                cps = max(8.0, min(40.0, cps))  # readable range
                b["chars_per_second"] = cps
                # Minimum DWELL after typing finishes — the quote needs to
                # linger so the viewer can read the whole thing. Without
                # this, a quote anchored to a short spoken phrase (anchor
                # "that is not your bottleneck" ~1s spoken) collapsed to
                # ~1s of dwell and felt rushed (scene-6, May 23 2026).
                typing_finish = new_start + 0.30 + len(text) / cps
                # 2.0s dwell: 1.5s wasn't enough on scene-10 — the quote
                # was already fading at second 36 of a 40s clip and the
                # viewer didn't have time to read the line (May 23 2026).
                QUOTE_DWELL_MIN = 2.0
                min_end = round(typing_finish + QUOTE_DWELL_MIN, 2)
                if new_end < min_end:
                    print(f"    quote_pull dwell extended: end {new_end} -> "
                          f"{min_end} (typing finishes at {typing_finish:.2f}s, "
                          f"+{QUOTE_DWELL_MIN}s dwell)")
                    new_end = min_end
                    b["end_sec"] = new_end
                print(f"    quote_pull cadence: {cps} chars/sec (text {len(text)} chars over ~{effective:.2f}s)")

    plan_path.write_text(json.dumps(plan, indent=2) + "\n")
    print(f"aligned {moved} beat(s) to speech in {plan_path}")
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: align_to_speech.py <broll_plan.json> [<words.json>]", file=sys.stderr)
        return 2
    plan = Path(sys.argv[1]).expanduser().resolve()
    if len(sys.argv) > 2:
        words = Path(sys.argv[2]).expanduser().resolve()
    else:
        words = plan.parent / "words.json"
    return align(plan, words)


if __name__ == "__main__":
    sys.exit(main())
