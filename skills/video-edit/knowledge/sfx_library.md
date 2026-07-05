# SFX library

Timed sound effects mixed in by [scripts/score.sh](../scripts/score.sh) on top of the voice + music. Built into a single master track by [scripts/build_sfx_track.py](../scripts/build_sfx_track.py) which reads `broll_plan.json` + `captions_plan.json` and emits a WAV with all events at correct timestamps.

## Available SFX

All in `~/.claude/skills/video-edit/sfx/`:

| File | Sound | When it fires | Volume in track |
|---|---|---|---|
| `flare-hit.mp3` | Sharp transient — the original hook flare | Cold-open at t=0.10s | 0.55 |
| `hook-whoosh.wav` | Brown-noise whoosh, mid-low filtered, ~0.55s decay | Cold-open at t=0.05s; also on inset-mode `static` beats (when a screenshot lands) | 0.45–0.55 |
| `card-pop.wav` | Two-tone sine pop (720+1440 Hz), ~0.10s | Each `appear_sec` on `horizontal_timeline` / `vertical_timeline` / `list` items; entrance on `stat_punch` and `callout` | 0.55–0.65 |
| `caption-tick.wav` | Light two-tone tick (1100+2200 Hz), ~0.06s | (Currently superseded by `caption-write.wav` for emphasis lines) | 0.45 |
| `caption-write.wav` | Pink-noise pen-scratch, 3000–5500 Hz band, ~0.20s | Each emphasis caption's underline wipe (at `start_sec + 0.18s`) — **EXCEPT the last emphasis line** (closer suppression rule) | 0.50 |
| `timeline-rise.wav` | Soft pink-noise swell, lowpassed ~850 Hz, slow fade in/out, ~4.6s | Once under a `horizontal_timeline` / `vertical_timeline` rail-draw — starts at the first item's `appear_sec`. The "line is moving" texture. | 0.42 |
| `hook-boom.wav` | Deep sub-sine (52+104 Hz), exp decay, ~0.9s | Cold-open at t=0.06s, layered under the whoosh + flare — gives the hook real weight | 0.62 |

**Typewriter:** `quote_pull` beats place a run of soft `caption-tick.wav` events every 0.15s across the type-out span (`len(quote_text) / chars_per_second`) at vol 0.30 — the text-being-typed sound. `word_pop` items each get a very soft `card-pop.wav` (0.28) as they pop in.

**Subscribe click:** the `subscribe` beat fires `click.wav` (crisp two-layer UI click — noise transient + 1.5 kHz tonal body, ~0.07s) at `beat_start + 1.10s` — the exact frame `SubscribeButton.tsx`'s cursor hits the button (`clickF = F(1.1)`) — plus a soft `card-pop` at +1.28s as the button morphs to SUBSCRIBED. Keep the 1.10s offset in sync with the component's `clickF` if it ever changes.

Globally, the SFX track mixes in at `weight=0.7` after each individual event's volume — see [score.sh](../scripts/score.sh) `amix` line.

## Synthesis recipes

All current SFX are synthesized by ffmpeg (no external assets). Recipe pattern:

```bash
# Two-tone sine "card pop"
ffmpeg -y -f lavfi -i "sine=f=720:d=0.10" -f lavfi -i "sine=f=1440:d=0.08" \
  -filter_complex "
    [0:a]volume=0.55,afade=t=in:st=0:d=0.002,afade=t=out:st=0.018:d=0.080[lo];
    [1:a]volume=0.30,afade=t=in:st=0:d=0.001,afade=t=out:st=0.012:d=0.060[hi];
    [lo][hi]amix=inputs=2:duration=first:weights=1 1[mix];
    [mix]highpass=f=300,lowpass=f=4000,acompressor=threshold=0.4:ratio=3:attack=2:release=80,volume=0.85
  " card-pop.wav
```

Pattern: **noise/sine → highpass+lowpass band → fast attack envelope → fast decay → optional compressor → final volume**. Keep total length ≤300ms for "subtle UI" register.

## Closer rule

The LAST emphasis caption's SFX is auto-suppressed in [build_sfx_track.py](../scripts/build_sfx_track.py):

```python
emph_lines = [ln for ln in caps if ln.get("emphasis")]
for ln in emph_lines[:-1]:  # skip the closer
    events.append((..., "caption-write.wav", 0.50))
```

Reason: the final emphasis is almost always a CTA closer ("let's dive in", "let's go", "subscribe") and the brain wants silence/closure on the closer, not "more writing happening". A pen-scratch SFX at that moment reads as annoying.

The TYPOGRAPHIC pop still fires (the lime underline still draws in) — only the audio sting is silenced.

## Adding new SFX

1. Synthesize via ffmpeg following the pattern above; save as `.wav` to `sfx/`.
2. Add it to `build_sfx_track.py` in the appropriate event-collection branch (logo flash, callout entrance, etc.).
3. Set its volume conservatively (0.4–0.6) — the global track is already at 0.7 weight.

## Hard rules

1. **Subtle by default.** SFX should support the visual, never call attention to itself. If you can hum the SFX after watching, it's too loud.
2. **No transition swooshes longer than 0.6s.** Drag-out transition SFX fight the speaker. EXCEPTION: a soft *swell* tied to a sustained on-screen animation (e.g. `timeline-rise.wav` under a rail-draw) may run as long as that animation — it's a texture bed, not a transition hit, and sits low (≤0.45 vol).
3. **No reverb tails.** They smear across the next beat.
4. **Match the visual semantics:**
   - Whoosh → motion/transition (logo flash, screenshot land)
   - Pop → discrete element appearing (card, item, stat)
   - Scratch → writing/drawing (caption underline, lime fill animation)
   - Click/tick → small UI confirmation (don't overuse)
5. **Closers get NO sting** (per closer rule).
