#!/usr/bin/env python3
"""
Build a single master SFX track timed to events from broll_plan + captions_plan.

Events:
  - Hook whoosh at t=0 (cold-open zoom + flare)
  - Card pop at every horizontal_timeline / vertical_timeline / list item's
    `appear_sec` (relative to its beat → absolute source time)
  - Caption tick at every emphasis caption line's `start_sec`

Output: a single WAV at the source's full duration, with each SFX placed at
its absolute timestamp. Designed to be passed to score.sh as the final SFX
track on top of voice + music.

Usage:
  build_sfx_track.py <broll_plan.json> <captions_plan.json> <duration_sec> <out.wav>
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
SFX_DIR = SKILL_DIR / "sfx"


def collect_events(broll_path: str, captions_path: str) -> list[tuple[float, str, float]]:
    """Return a list of (absolute_time_sec, sfx_filename, volume) events."""
    events: list[tuple[float, str, float]] = []

    # Hook stack at t=0 — whoosh + flare + a deep sub-boom. The boom gives
    # the cold open real weight ("make the hook much better").
    if (SFX_DIR / "hook-whoosh.wav").exists():
        events.append((0.05, "hook-whoosh.wav", 0.62))
    if (SFX_DIR / "flare-hit.mp3").exists():
        events.append((0.10, "flare-hit.mp3", 0.50))
    if (SFX_DIR / "hook-boom.wav").exists():
        events.append((0.06, "hook-boom.wav", 0.62))

    # Card pops from broll_plan
    if os.path.exists(broll_path):
        plan = json.load(open(broll_path))
        for beat in plan:
            kind = beat.get("kind", "")
            beat_start = float(beat.get("start_sec", 0.0))
            beat_end = float(beat.get("end_sec", beat_start))
            steps = beat.get("steps") or beat.get("items") or []
            if kind in ("horizontal_timeline", "vertical_timeline", "list"):
                # appear_sec on these items is ABSOLUTE source time.
                appears = [
                    float(s["appear_sec"]) for s in steps
                    if isinstance(s, dict)
                    and isinstance(s.get("appear_sec"), (int, float))
                ]
                # Smooth swell under the whole rail-draw — the line "moving".
                if appears and (SFX_DIR / "timeline-rise.wav").exists():
                    events.append((min(appears), "timeline-rise.wav", 0.42))
                # Soft pop as each dot lands at the rail head.
                for t in appears:
                    events.append((t, "card-pop.wav", 0.40))
            elif kind == "stat_punch":
                events.append((beat_start + 0.20, "card-pop.wav", 0.65))
            elif kind == "quote_pull":
                # Typewriter — soft ticks across the type-out span. The quote
                # types at chars_per_second from the beat start.
                txt = str(beat.get("quote_text", ""))
                cps = float(beat.get("chars_per_second", 18.0)) or 18.0
                type_dur = min(len(txt) / cps, beat_end - beat_start)
                if (SFX_DIR / "caption-tick.wav").exists() and type_dur > 0.3:
                    t = beat_start + 0.10
                    stop = beat_start + type_dur
                    while t < stop:
                        events.append((t, "caption-tick.wav", 0.30))
                        t += 0.15
                # Payoff hit — a soft sub-boom the instant the line lands,
                # reinforcing the music swell into the climax.
                if (SFX_DIR / "hook-boom.wav").exists():
                    events.append((beat_start + type_dur + 0.05, "hook-boom.wav", 0.42))
            elif kind == "word_pop":
                # Soft tick as each word pops in — keeps the cut feeling
                # scored without competing with the voice.
                for s in steps:
                    if isinstance(s, dict) and isinstance(s.get("appear_sec"), (int, float)):
                        events.append((float(s["appear_sec"]), "card-pop.wav", 0.28))
            elif kind == "hook_title":
                # Hook lockup lands with the t=0 hook stack; no extra pop.
                pass
            elif kind == "subscribe":
                # Crisp mouse-click the instant the cursor hits the button.
                # SubscribeButton.tsx clicks at beat_start + 1.10s (its
                # internal clickF = F(1.1)). Keep this offset in sync if the
                # component's click timing ever changes.
                if (SFX_DIR / "click.wav").exists():
                    events.append((beat_start + 1.10, "click.wav", 0.7))
                # soft confirmation pop as the button morphs to SUBSCRIBED
                events.append((beat_start + 1.28, "card-pop.wav", 0.34))
            elif kind == "callout":
                events.append((beat_start + 0.40, "card-pop.wav", 0.70))
            elif kind == "command_deck":
                # Soft swell as the OS panel boots, then a subtle digital
                # "online" tick the instant each department tile activates —
                # i.e. when the lime scan-sweep passes over it. CommandDeck
                # flips a tile to ACTIVE at its appear_sec + 0.42s; keep this
                # offset in sync with that component.
                tiles = beat.get("tiles") or []
                if tiles and (SFX_DIR / "timeline-rise.wav").exists():
                    events.append((beat_start + 0.05, "timeline-rise.wav", 0.34))
                for tile in tiles:
                    if isinstance(tile, dict) and isinstance(tile.get("appear_sec"), (int, float)):
                        events.append((float(tile["appear_sec"]) + 0.42, "caption-tick.wav", 0.46))
            elif kind == "kinetic_statement":
                # Whisper-soft tick as each word lifts in; emphasis (lime) words
                # land with a slightly firmer pop so the key beats read. This is
                # the "text appearing / highlighting" sound the owner asked for.
                for w in (beat.get("words") or []):
                    if not isinstance(w, dict):
                        continue
                    at = w.get("appear_sec")
                    if not isinstance(at, (int, float)):
                        continue
                    if w.get("emphasis"):
                        events.append((float(at), "card-pop.wav", 0.50))
                    else:
                        events.append((float(at), "caption-tick.wav", 0.38))
            elif kind == "layer_stack":
                # Each slab settles with a soft pop, bottom→top; the top
                # (accent) slab — the payoff — lands a touch firmer.
                layers = beat.get("layers") or []
                ln = max(1, len(layers))
                build_span = (beat_end - beat_start) * 0.62
                per = build_span / ln
                for i in range(ln):
                    land = beat_start + 0.30 + i * per + 0.20
                    is_accent = bool(layers[i].get("accent")) if isinstance(layers[i], dict) else False
                    is_top = i == ln - 1
                    vol = 0.70 if (is_accent or is_top) else 0.52
                    events.append((land, "card-pop.wav", vol))
            elif kind == "calendar_months":
                # One soft swell as the months begin filling — not a tick per
                # month (too busy at 9), plus a gentle landing pop.
                if (SFX_DIR / "timeline-rise.wav").exists():
                    events.append((beat_start + 0.15, "timeline-rise.wav", 0.40))
                events.append((beat_start + 0.20, "card-pop.wav", 0.55))
            elif kind == "network_spread":
                # Soft whoosh as the spokes radiate out from the hub.
                if (SFX_DIR / "hook-whoosh.wav").exists():
                    events.append((beat_start + 0.10, "hook-whoosh.wav", 0.50))
            elif kind == "static" and beat.get("inset", 0) > 0:
                # Inset screenshot lands harder — give it the hook whoosh.
                if (SFX_DIR / "hook-whoosh.wav").exists():
                    events.append((beat_start + 0.05, "hook-whoosh.wav", 0.45))
            elif kind == "broll_picker":
                # Soft swell as the b-roll grid appears, a few quick scan ticks
                # as the highlight hops, then a firm CLICK + pop when Claude
                # LOCKS onto the pick (BrollPicker lockAt = 0.48 of the beat).
                d = max(0.01, beat_end - beat_start)
                if (SFX_DIR / "timeline-rise.wav").exists():
                    events.append((beat_start + 0.04, "timeline-rise.wav", 0.40))
                for k in range(4):
                    events.append((beat_start + (0.18 + 0.055 * k) * d, "caption-tick.wav", 0.30))
                lock_t = beat_start + 0.48 * d
                if (SFX_DIR / "click.wav").exists():
                    events.append((lock_t, "click.wav", 0.62))
                events.append((lock_t + 0.02, "card-pop.wav", 0.55))
            elif kind == "password_type":
                # Soft key clicks as each dot types in (window 0.18..0.60 of the
                # beat), then a deep LOCK thunk when the field accepts/locks
                # (PasswordType accept at 0.66 of the beat).
                d = max(0.01, beat_end - beat_start)
                n = max(1, len(str(beat.get("password") or "")))
                for i in range(n):
                    frac = 0.18 + 0.42 * (i / max(1, n - 1)) if n > 1 else 0.30
                    if (SFX_DIR / "click.wav").exists():
                        events.append((beat_start + frac * d, "click.wav", 0.26))
                lock_t = beat_start + 0.66 * d
                if (SFX_DIR / "hook-boom.wav").exists():
                    events.append((lock_t, "hook-boom.wav", 0.46))
                events.append((lock_t + 0.02, "card-pop.wav", 0.46))

    # Caption emphasis: pen-scratch sound matching the lime underline wipe
    # (which animates 0.18s → 0.55s after caption start).
    #
    # Skip the FINAL emphasis line on purpose — it's almost always the CTA
    # closer ("let's dive in", "let's go", "subscribe") and the brain wants
    # silence/closure on the closer, not "more writing happening." Adding
    # SFX there reads as annoying.
    if os.path.exists(captions_path):
        caps = json.load(open(captions_path))
        emph_lines = [ln for ln in caps if ln.get("emphasis")]
        for ln in emph_lines[:-1]:  # skip the closer
            events.append((float(ln["start_sec"]) + 0.18, "caption-write.wav", 0.62))

    # De-dupe events that fall within 0.05s of each other (prevents double-pops
    # when, e.g., a callout starts the same moment a caption ticks).
    events.sort(key=lambda e: e[0])
    deduped: list[tuple[float, str, float]] = []
    for t, fn, vol in events:
        if deduped and abs(deduped[-1][0] - t) < 0.05 and deduped[-1][1] == fn:
            continue
        deduped.append((t, fn, vol))
    return deduped


def build_track(events: list[tuple[float, str, float]], duration_sec: float, out_path: str) -> None:
    if not events:
        # Empty silent track at the right duration.
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo:d={duration_sec}",
            out_path,
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return

    # Build a filter graph: each event becomes a delayed/amped audio stream,
    # all amix'd together, padded to duration.
    inputs: list[str] = []
    for _t, fn, _vol in events:
        inputs += ["-i", str(SFX_DIR / fn)]

    parts: list[str] = []
    labels: list[str] = []
    for i, (t, _fn, vol) in enumerate(events):
        delay_ms = int(round(t * 1000))
        # adelay accepts per-channel delays; "delay|delay" handles stereo.
        parts.append(f"[{i}:a]volume={vol},aresample=44100,aformat=channel_layouts=stereo,adelay={delay_ms}|{delay_ms}[s{i}]")
        labels.append(f"[s{i}]")

    parts.append(f"{''.join(labels)}amix=inputs={len(events)}:duration=longest:dropout_transition=0,apad=whole_dur={duration_sec}[out]")
    filter_complex = ";".join(parts)

    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-ar", "44100", "-ac", "2",
        out_path,
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main():
    if len(sys.argv) != 5:
        print("usage: build_sfx_track.py <broll_plan> <captions_plan> <duration_sec> <out.wav>", file=sys.stderr)
        sys.exit(2)
    broll_path, captions_path, duration_str, out_path = sys.argv[1:]
    duration = float(duration_str)

    events = collect_events(broll_path, captions_path)

    # Tail guard — no SFX may land in the final stretch of the video. A click
    # or pop (e.g. the subscribe CTA's click at beat_start+1.10) that falls
    # right at the cutoff reads as a glitch/error rather than a beat. Owner
    # feedback 2026-06-05: "weird sound at the end, needs to be removed" — it
    # was the subscribe click landing ~0.5s before the end. Drop anything in
    # the last 0.7s so the piece always ends clean.
    TAIL_GUARD_SEC = 0.7
    cutoff = duration - TAIL_GUARD_SEC
    before = len(events)
    events = [(t, fn, vol) for (t, fn, vol) in events if t <= cutoff]
    dropped = before - len(events)
    if dropped:
        print(f"[sfx] tail-guard dropped {dropped} event(s) within {TAIL_GUARD_SEC}s of the end ({cutoff:.2f}s)")

    print(f"[sfx] {len(events)} events:")
    for t, fn, vol in events:
        print(f"  {t:6.2f}s  {fn}  vol={vol}")

    build_track(events, duration, out_path)
    print(f"[sfx] wrote -> {out_path}")


if __name__ == "__main__":
    main()
