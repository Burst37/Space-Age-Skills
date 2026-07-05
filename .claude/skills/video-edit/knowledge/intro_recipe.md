> 🚨 **STOP — is this a HERO intro?** (sponsored video, masterclass open, anything the user would pay an editor for.)
> Then this file is the wrong register. Use [bespoke_intro.md](bespoke_intro.md) and hand-write a Remotion comp.
> This recipe survives only for quick, low-stakes intros on the explicit fast path.

# Intro recipe — proven structure for 16:9 YT longform openers (≤30s)

This is the exact recipe that landed in the May 2026 sessions for Luuk's BuildLoop intros. Follow the order; don't improvise structure. Copy → fill in → render.

## Anatomy of a 15s intro

A typical intro has 4 narrative slots. Each gets exactly one beat (or zero if context doesn't warrant it).

| Slot | Speaker is saying… | Beat | Param defaults |
|---|---|---|---|
| 1. **Hook claim** | The audacious opener ("X is doing Y for me") | `icon` (bare logo flash) — only when speaker mentions a brand by name | top-center, size 0.34, bare:true, ~1.5s |
| 1b. **Hook proof** | …same line, after the brand mention lands | `static` with `inset: 0.10` — a real screenshot that proves the claim | 2.5–3.0s, contain, on dark grid |
| 2. **Promise** | "This is a full walk through" / "I'll prove it" | `callout` with prefix + lime highlight | ~1.8–2.0s, NO speech_anchor |
| 3. **Roadmap** | "What you'll learn" / "Everything before you start" | `horizontal_timeline` — 3–5 chapters | 5.0–5.5s, items 1s apart |
| 4. **Closer** | "Let's dive in" / "Let's go" | NO beat — emphasis caption pop alone | n/a |

Plus captions: **2–3 emphasis phrases** in `CAPTION_EMPHASIS`, including the closer (the closer's underline-write SFX is auto-suppressed, but the typographic pop still fires — that's good).

## Step-by-step

### 1. Probe + transcribe

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 <input.mp4>
python3 scripts/transcribe.py <input.mp4>
python3 scripts/polish_transcript.py "<workdir>/words.json"
```

`<workdir>` is `~/.cache/video-edit/<basename_truncated>_<sha1[:12]>/`. The path prints from `transcribe.py`'s last line.

### 2. Read the transcript and identify the 4 slots

Open `<workdir>/words.json` and scan word-by-word with timing. Mark in your head:

- Which phrase is the **hook claim**? (almost always the first 1–2s)
- Which words contain a **brand name** worth flashing as a logo?
- Where does the speaker say something like "this is a / I'll show you / full walkthrough"? — that's the **promise**.
- Where does "what you'll learn / everything you need to know / I'll cover" land? — that's the **roadmap**.
- What's the **closer** word/phrase? ("let's go", "let's dive in", "let me show you")

### 3. Author the b-roll plan

Drop into `<workdir>/broll_plan.json`. Use the proven template below verbatim, then swap the texts:

```json
[
  {
    "kind": "icon",
    "start_sec": 0.55,
    "end_sec": 2.10,
    "image_path": "broll/<brand-logo>.png",
    "bare": true,
    "anchor": "top-center",
    "size": 0.34,
    "aspect": <image_width / image_height>,
    "reason": "Brand mention — flash <brand> logo while speaker says it. Bare overlay (no card) keeps the speaker visible."
  },
  {
    "kind": "static",
    "start_sec": 2.10,
    "end_sec": 4.80,
    "image_path": "broll/<proof-asset>.png",
    "fit": "contain",
    "inset": 0.10,
    "source": "real-screenshot",
    "reason": "Proof for the hook claim. Inset 10% on branded grid — full image visible, no cropping."
  },
  {
    "kind": "callout",
    "start_sec": <when speaker hits "this is a">,
    "end_sec":   <~0.30s after speaker finishes the highlight word>,
    "callout_prefix": "This is a",
    "callout_highlight": "FULL WALK THROUGH",
    "reason": "The promise as a graphic. Hand-author timing — no speech_anchor (we want it to exit faster than the default tail)."
  },
  {
    "kind": "horizontal_timeline",
    "start_sec": <when 'what you'll learn' starts>,
    "end_sec":   <~0.10s before the closer>,
    "title": "WHAT YOU'LL LEARN",
    "steps": [
      { "heading": "<chapter 1>", "description": "<one sentence>", "appear_sec": 0.30 },
      { "heading": "<chapter 2>", "description": "<one sentence>", "appear_sec": 1.30 },
      { "heading": "<chapter 3>", "description": "<one sentence>", "appear_sec": 2.30 },
      { "heading": "<chapter 4>", "description": "<one sentence>", "appear_sec": 3.30 }
    ],
    "reason": "Static 4-card strip preview. Cards reveal sequentially, then stay locked — never pan."
  }
]
```

Critical rules baked into this template (don't break them):

- **`speech_anchor` is omitted** for `callout` so my hand-authored end time sticks. With `speech_anchor`, `align_to_speech.py` would re-extend the callout to `last_word_end + 0.60s` and overshoot.
- **`appear_sec` on timeline steps is RELATIVE to the beat's start** (0.20–3.20s for a 4.45s beat). NOT absolute source-video time. `HorizontalTimeline.tsx` reads it that way (matching `VerticalTimeline.tsx`'s convention).
- **Items spaced 1.0s apart, last item holds 1.5–2.0s** before timeline exits. Anything tighter and viewers can't read; anything looser and the timeline outstays the speaker.
- **Logo `aspect` matches the image's pixel ratio.** A 840×414 logo → `aspect: 2.03`. Without this the icon box letterboxes the logo.
- **Logo size 0.34** at top-center is the sweet spot — readable but doesn't crowd the speaker's face.
- **Static `inset: 0.10`** keeps the dashboard full-bleed minus 10% padding on each side, on the dark grid. Larger inset (0.15–0.18) makes the screenshot too small; smaller (0.05) starts looking like full-takeover and loses the "card" effect.

### 4. Pick caption emphasis phrases

Pick the 2–3 phrases from the transcript that ARE the hook. Format: `"phrase 1|phrase 2|phrase 3"`. Examples that worked:

- `"running my entire business|prove that to you|let's dive in"` (this IS the recipe)

The matching is fuzzy (case-insensitive, punctuation-stripped). Don't worry about exact word boundaries — the captions plan generator finds them.

### 5. Render — preview first, final when confirmed

**First render (preview, ~17s):**

```bash
CAPTION_EMPHASIS="<phrase 1>|<phrase 2>|<phrase 3>" \
  bash scripts/render.sh "<input.mp4>"
```

That command:
1. Pre-downscales source to 720p once (cached at `<workdir>/source_720p.mp4`)
2. Runs the captions plan generator
3. Runs `align_to_speech.py` for beats with `speech_anchor`
4. Runs `close_gaps.py` (closes <0.5s gaps; set gap >0.5s if you want a breath)
5. Lints the plan (`icon` / `chapter_bar` / `notification_toast` exempt from 1.5s floor)
6. Renders Remotion at 720p → `<input>.preview.mp4` (CRF 26, fast preset, no audio score)

**Iterate on this preview file. ~17s per re-render.** Open it in QuickTime, give feedback, tweak the plan, re-run. The pre-downscaled proxy stays cached so subsequent renders skip the ffmpeg pass.

**Final render (when visuals + timing are confirmed, ~99s):**

```bash
QUALITY=final \
CAPTION_EMPHASIS="<phrase 1>|<phrase 2>|<phrase 3>" \
  bash scripts/render.sh "<input.mp4>"
```

Adds:
7. Renders Remotion at source resolution → `<input>.enhanced.mp4` (CRF 20, medium preset)
8. Builds the SFX track (hook whoosh on screenshot, card-pops on timeline, pen-scratches on caption emphasis except the closer)
9. Scores: voice + music (`bg-feelgood-builder.mp3` default, weight 0.30, sidechain-ducked under voice) + SFX
10. Overwrites `.enhanced.mp4` with the scored final

**Bonus: extract_stills (~1s)** — after any preview render, get a contact sheet of every beat:

```bash
bash scripts/extract_stills.sh "<input.mp4>"
open "<input>.stills/"
```

### 6. Open & QA

```bash
open "<input.enhanced.mp4>"
```

Acceptance gates (any of these failing → iterate):

- Logo flashes during the brand mention, exits before the speaker has moved to the next phrase
- Screenshot shows the FULL dashboard, no edge cropping (verify by checking corners/sidebar)
- Cards on the timeline don't pan; they appear in place and stay
- No mid-word hyphenation (e.g., `actual-ly` is a hard fail)
- Music is present but you don't notice it
- The closer ("let's dive in") plays clean — no SFX clutter, just the typographic pop

## Common edits & their fixes

| Symptom | Fix |
|---|---|
| Music too quiet / loud | Tweak weight in `score.sh` line `[voice][ducked][sfx]amix=...:weights=1 0.30 0.7`. 0.30 is the locked sweet spot; nudge ±0.05. |
| Music feels girly / kids-show | Override with `MUSIC_TRACK=bg-feelgood-builder.mp3` (default for 16:9). The Carefree track was rejected for that reason. |
| Music too slow | Raise `MUSIC_SPEED=1.15` etc. Use atempo, no pitch shift. Builder track at 1.0 = right energy. |
| Card text overflows / hyphenates | Already prevented in [HorizontalTimeline.tsx](../remotion/src/templates/HorizontalTimeline.tsx) — `hyphens: manual`, 2-line clamp on heading, 3 on description. If you see overflow, the heading is genuinely too long — shorten it. |
| Caption visible while screenshot is on | Already filtered — see `filteredCaptions` in `EditedVideo.tsx`. If a caption sneaks through, the run/caption windows aren't intersecting in the filter — check that your beat's `kind` is in `TAKEOVER_KINDS`. |
| Closer SFX too prominent | Already auto-suppressed — see `emph_lines[:-1]` in [build_sfx_track.py](../scripts/build_sfx_track.py). |

## Asset asks (when you don't have the files)

If the recipe needs assets the user hasn't shared, ASK before improvising:

- **Brand logo** — for the icon flash. PNG with transparent or branded background, ideally 2:1 or wider. User saves to `~/Downloads/<name>.png`, then copy into `<workdir>/broll/<name>.png`.
- **Hero proof screenshot** — dashboard, terminal, app screen showing the claim is real. 16:9 ish (1.7–1.9 ratio works cleanly with `inset: 0.10`).

If the user asks for a stronger cold open and we don't have an asset, do NOT generate AI imagery for "the speaker's actual business" — it's a credibility failure. Either ask for the screenshot, or fall back to typographic-only treatment.
