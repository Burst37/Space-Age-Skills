---
name: video-edit
description: One-shot edit a pre-cut video — adds captions, on-brand template overlays (timeline, callout, vs-split, stat-punch, screenshot card, logo flash, etc.), zoom punch-ins, and a full audio score (calm-but-energetic music bed + timed SFX). Three modes — Shorts (9:16, captions already burned in), Intro (16:9, ≤30s, full template-rich edit), Longform (16:9, multi-minute, chapter-by-chapter pass). TRIGGER when the user gives a pre-cut video and wants it edited end-to-end, or explicitly asks for b-roll, zooms, captions, music, sound effects, or 'cinematic text pop-ups'. Phrases: 'edit this intro', 'edit this video', 'add b-roll', 'add captions', 'one-shot this', 'edit my YT longform', 'caption this intro', 'enhance this video', 'add some energy'.
---

# Video Edit — End-to-End Edit Pass

This skill takes a **pre-cut** video and produces a fully-edited render:
1. **Captions (16:9 only)** — phrase-level lower-third + cinematic emphasis pop-ups
2. **⭐ Cinematic motion viz (`kind:"viz"`)** — the DEFAULT for any concept/data/stat/comparison/process moment: 29 brand-locked, camera-driven devices from the motion library (see §4motion + `motion/catalog.json`). This is the high-quality register; the flat template overlays below are legacy.
2b. **Legacy template overlays** — `horizontal_timeline`, `callout`, `vs_split`, `stat_punch`, `quote_pull`, `keyword_chips`, `progress_steps`, `title_card`, `chapter_bar`, plus `static` screenshot cards and `icon` logo flashes. Prefer a `viz` device when one fits.
3. **AI-generated b-roll images** at concept beats (numbers, tools, metaphors) — only when no real asset exists
4. **Speaker zoom punch-ins** at high-energy moments
5. **Audio score** — calm-but-energetic music bed (sidechain-ducked under voice) + timed SFX (hook whoosh, card pops, caption write-strokes)

It does NOT cut, transcribe-for-burned-captions, or change the underlying voice track.

## Three modes

| | Shorts (9:16) | YT Intro (16:9, ≤30s) | YT Longform (16:9, multi-min) |
|---|---|---|---|
| Captions | Skill generates them (`CAPTIONS=1`, default on) — `CAPTIONS=0` only if already burned in | Skill generates them | Skill generates them |
| Auto-detect | `width < height` | `width > height` AND duration ≤ 30s | `width > height` AND duration > 30s |
| Beats | 3–6, hand-authored | 3–5, recipe-driven (see below) | 1 every 25–60s, per-chapter |
| Music | Calm classical, deterministic pick | `bg-feelgood-builder.mp3` default | Same — vary per video w/ `MUSIC_TRACK=` |
| Output | `<input>.enhanced.mp4` (Remotion) → `.scored.mp4` if you run score.sh | `<input>.enhanced.mp4` (already includes audio score) | Same as intro |

`render.sh` chains video render → SFX-track build → music+SFX scoring automatically. Disable with `SCORE=0`.

## ⚡ Three render speeds — pick the right one for the iteration loop

| Tier | Command | Time (15s 4K source) | What you get | Use when |
|---|---|---|---|---|
| **stills** | `bash scripts/extract_stills.sh <input>` | **~1s** | One PNG per beat at its midpoint, dropped in `<input>.stills/` | After a preview render: scrubbing visual choices at-a-glance. Free contact sheet. |
| **preview** *(default)* | `bash scripts/render.sh <input>` | **~17s** | 720p MP4 (`<input>.preview.mp4`), no audio score | Iterating on plan timing, transitions, captions. The default for active editing. `SCORE=1` env to add music for an audio-QA preview. |
| **final** | `QUALITY=final bash scripts/render.sh <input>` | **~30-60s** | 1080p MP4 (`<input>.enhanced.mp4`), full audio score | Ship-ready output. Only run when visuals + timing are confirmed. |

**Why preview is fast:** the comp renders at 720p AND a downscaled source proxy lives at `<workdir>/source_720p.mp4` (one-time pre-pass with ffmpeg, cached). The 4K source decode-per-frame was the dominant cost; the proxy eliminates it. Audio score (music bed + SFX) is skipped in preview to save ~10-30s per render — final renders always include it. Override per-render with `SCORE=1 bash scripts/render.sh <input>` when you want an audio-QA preview.

**The pipeline is INCREMENTAL — every stage is a cached "loose part" (May 22 2026).** A re-render never redoes work whose inputs didn't change. Each stage is keyed on exactly its own dependencies:

| Stage | Cache file | Key (rebuilds when this changes) |
|---|---|---|
| Transcribe | `words.json` | source video (runs outside render.sh, once) |
| Polish | `.polished` marker | runs once ever; manual `words.json` fixes then stick |
| 720p proxy | `source_720p.mp4` | source video mtime |
| Speaker matte | `speaker_cutout/` | source video (only if a `behind_subject` beat exists) |
| **Follow-cam track** | `followcam_plan.json` + `.followcam.key` | source mtime + `FOLLOW_SCALE` + `FOLLOW_STRENGTH` |
| **Remotion render** | `<out>.mp4` + `.render.fp.*` | `props.json` (all plan/timing/asset data) + every `remotion/src` template file + source mtime + quality settings |

So: edit one template → only the Remotion render re-runs (follow-cam, transcribe, proxy all cache-hit). Edit a beat's timing → same. Re-run an already-done scene in a batch → **everything skips, instant exit.** A crash-resumed batch skips the scenes that already finished. The render fingerprint is written ONLY after a fully successful render, so a crash never produces a false cache hit. Force a full rebuild with `FORCE_RENDER=1` (render) or by deleting `.followcam.key` (camera track). This is what makes 20+ clip batches and tight iteration loops viable — never "do it all from scratch every time".

**Iteration loop — preview only, NEVER auto-final:**

```bash
# 1. First pass — see the whole plan as a video
bash scripts/render.sh "<input>"
open "<input>.preview.mp4"

# 2. Tweak a beat, re-render preview (still ~17s)
bash scripts/render.sh "<input>"

# 3. When visuals feel right, get a beat-by-beat contact sheet to QA
bash scripts/extract_stills.sh "<input>"
open "<input>.stills/"

# 4. Ship it — ONLY after the user explicitly says they like the preview
QUALITY=final bash scripts/render.sh "<input>"
open "<input>.enhanced.mp4"
```

🚨 **Workflow rule — final render requires explicit user approval.** Codified May 21 2026 after the agent auto-ran `QUALITY=final` on the first pass before the user had reviewed the preview. Final mode burns ~6× more time per render AND lays down the audio score (which the user often wants to re-tune). The agent must:

1. **Always render at preview tier first.** Default `bash scripts/render.sh` is correct — do NOT pass `QUALITY=final` on the first or any subsequent iteration unless the user has said "I like it" / "ship it" / "go final" / "render final" or equivalent.
2. **After each preview render, hand off to the user.** Show the file path, optionally extract stills for inspection, then STOP and wait for feedback. Don't auto-extract → auto-final → report done in one tool chain.
3. **Re-renders after feedback also stay at preview tier.** Multiple preview iterations are cheap and expected; final is a one-time ship step.

If the user has already said "I like the preview" or "render the final" in the current conversation, that authorization stands — re-rendering final after a tiny tweak is fine. Authorization is per-edit-session, not per-render.

Why we don't use Remotion Studio (`npx remotion studio`) for this: it's great for component development (live HMR on template TSX), but it doesn't include the source video's voice track or the audio score, so you can't QA the actual edit in it. The preview render is the right tool for edit-in-progress feedback.

## ⚡ One-shot procedure (intro & longform)

When the user says "edit this intro" / "edit this video" / "one-shot this", follow this order — every step automated by the pipeline below:

```
1. Probe        ffprobe to get aspect + duration  → decide mode
2. Transcribe   scripts/transcribe.py <input>     → words.json
3. Polish       scripts/polish_transcript.py      → fixes mishearings (Anthropic API)
4. Author plan  Write broll_plan.json by hand following the recipe for the mode
                (see knowledge/intro_recipe.md or knowledge/longform_workflow.md)
5. Decide       Pick CAPTION_EMPHASIS phrases (1–3 for intro, ~1/min for longform)
6. Render       CAPTION_EMPHASIS="..." bash scripts/render.sh <input>
                ↳ build captions plan from words.json
                ↳ align beats to speech, close gaps, lint
                ↳ Remotion render → <input>.enhanced.mp4
                ↳ build SFX track from beats + emphasis lines
                ↳ score.sh: voice + music + SFX → final overwrite
```

Default music: `bg-feelgood-builder.mp3` for 16:9; deterministic auto-pick for 9:16. Override per-render with `MUSIC_TRACK=<filename>` and tempo with `MUSIC_SPEED=1.15` (1.0 = original).

🚨 **For a HERO INTRO (a 16:9 intro the user cares about — sponsored videos, masterclass opens, anything he'd pay an editor for): the template pipeline is the WRONG register. Skip the plan file entirely and hand-write a bespoke Remotion composition following [knowledge/bespoke_intro.md](knowledge/bespoke_intro.md)** — read ALL FOUR parts before writing a line of code, and treat **Part 4 (the locked baseline)** as the floor: every rule in it was once user feedback and repeating any of them costs a wasted round. Non-negotiables from the baseline: a human in frame one (no empty-canvas cold opens), station zooms 1.16–1.40 (fill the frame), straight arrows only, ≤2Hz element animation, world elements in-DOM, real logos/flags fetched proactively, fresh environment metaphor per video. For foreign-language or clone speech material, generate REAL lip-synced clips via the `avatar-video` skill (Fish s2.1-pro → HeyGen Avatar V) — never lay foreign audio over mismatched footage. References: `remotion/src/HiggsIntro.tsx`, `VideoEditIntro.tsx`, `FishIntro.tsx`/`FishIntro2.tsx`/`FishIntro3.tsx` (the Fish series — three fresh environments on one shared palette). The recipe in [knowledge/intro_recipe.md](knowledge/intro_recipe.md) remains only for quick/low-stakes intros where the user explicitly wants the fast path. For longform, the per-chapter pass in [knowledge/longform_workflow.md](knowledge/longform_workflow.md) walks the transcript and emits beats by content-type heuristics.

### Caption emphasis — when to mark a phrase

Mark phrases via `CAPTION_EMPHASIS="phrase1|phrase2|..."` (pipe-separated). Per-mode:
- **Intro**: 2–3 phrases — the hook claim, the promise/transition, the CTA closer.
- **Longform**: ~1 per minute — the line that IS the section. Don't carpet-bomb.

Pattern matching is fuzzy (case-insensitive, punctuation-stripped, whitespace-flexible). The matched span MUST exist in the transcript or it silently no-ops. The LAST emphasis line in the file gets its underline-write SFX auto-suppressed (see [scripts/build_sfx_track.py](scripts/build_sfx_track.py)) — closers want silence.

## Hard rules

1. **Every visual must mean something specific.** Before adding any b-roll, write down in one sentence WHY it appears at this exact moment and what the viewer should understand from it. If the answer is "general vibes" or "the speaker is talking about software" — DON'T add it. Random abstract illustrations are worse than no b-roll. The `reason` field on every plan entry is mandatory and is the gate.

§4motion. **⭐ THE MOTION LIBRARY IS THE DEFAULT FOR EVERY CONCEPT / DATA / STAT MOMENT — reach for a `viz` beat BEFORE any flat template.** The skill ships a locked, brand-cinematic motion engine (`remotion/src/motion/` — 29 bespoke devices, camera moves, micro-overshoot settles, impact frames, motion-blur transitions; see [[project_buildloop_motion_kit]]). It is the same quality as the standalone `motion` skill, composited inline. Any time the speaker states a **number, a comparison, a process, a list of things, a count, a network, a price, a "X is dead → Y"** — the visual is a `viz` beat, NOT the old flat template. **The old flat kinds (`stat_punch`, `vs_split`, `horizontal_timeline`, `progress_steps`, `keyword_chips`, `bar_chart`, `network_diagram`, `metric_reveal`, `layer_stack`, `stat_grid`…) are the LEGACY register and read cheaper — do not reach for them when a motion device fits.** Map the moment to a device:

   | The speaker is… | Use viz device |
   |---|---|
   | landing a stat / cost / price ($X → $0) | `priceDrop`, `kpiStats`, `heatmap` (volume), `scanResolve`/`grindClock` (count-up) |
   | comparing two things / before-after | `comparison` |
   | walking a process / steps / pipeline | `processFlow`, `assemblyLine`, `stepRoadmap` |
   | listing things being replaced / crossed off | `strikeList` |
   | describing agents / orchestration / a network | `orchestra`, `network`, `streamsToOne` |
   | "X is dead → Y" / a reframe | `automationDead` |
   | a headline / masthead / "the internet said…" | `sourceHeadline` |
   | a title / thesis / section open | `hero` |
   | a trend over time (two lines) | `dualLine` |
   | a build-up of context/layers | `brainBuild`, `layerStack` |

   **READ `motion/catalog.json` before authoring** — every device lists `useWhen`, whether it's a full-screen takeover or an over-footage `overlay`, its `required` props, and a worked `example`. Copy the example shape.

   **Schema:** `{ "kind": "viz", "viz": "<device>", "props": { … }, "start_sec": …, "end_sec": …, "speech_anchor": "<exact words>", "reason": "…" }`. The `props` object is passed verbatim to the device (validate keys against the catalog `example`). Takeover devices own the frame (voice continues under them, like a `static`); the 5 overlay devices (`strikeOverlay`, `statBadge`, `lowerThird`, `keywordPop`, `cornerCounter`) are transparent and sit over the speaker — set `"overlay": true` on those beats. A viz beat auto-times to its duration and, like every beat, needs a `speech_anchor`. Lint rejects an unknown device name, so a typo fails loudly instead of rendering blank.

2. **Source real assets first, generate as fallback.** Visual sourcing priority (try in order):
   1. **Real product screenshots / UI** — if the speaker names a real tool ("Claude Code", "Stripe Dashboard", "Cursor", "Linear"), find the actual interface. Use `WebSearch` + `WebFetch` to locate official press kits, product pages, or screenshots, then `curl -L` to download. Save under `<workdir>/broll/<index>.<ext>`.
   2. **Stock photo / illustration libraries** — for generic concepts ("a team meeting", "a busy laptop"). Use Unsplash (`https://source.unsplash.com/1920x1080/?<query>` for direct download) or Pexels (`https://api.pexels.com` with the user's `PEXELS_API_KEY` env var if set). Real photos read way better than AI illustrations for "real-world" concepts.
   3. **Generated illustration via `gpt_image_2`** — last resort, only for abstract concepts that have no real-world referent (metaphors, "the funnel", "guardrails"). Always Higgsfield's `gpt_image_2` (per global memory rule). Tool: `mcp__eb9d9e8e-947c-4f03-b626-a2f45fe617e9__generate_image`.
3. **Default placement = center, full-screen.** The speaker is the show; an icon-card in the corner makes the b-roll feel like a sticker on someone else's video. Use full-screen `static` takeovers as the default — they read clearly and look intentional. Only use `icon` overlays for very brief callouts (≤1.5s) and even then, prefer `anchor: "center"`.

3b. **Generated b-roll images are ALWAYS 1:1 (square).** Codified May 21 2026 ("the images we generate, make them 1:1 from now on"). On shorts, b-roll images render inside `image_card` glass cards (rule 4aj) — a squarish frame in the bottom half — and a 1:1 source fills that cleanly. Always request `aspect_ratio: "1:1"` from `gpt_image_2`. This applies regardless of the source video's aspect ratio — the image is NOT a full-frame element anymore, it's a card. For 16:9 intro/longform work where an image genuinely IS a full takeover (`ai_image_on_grid`), match the source aspect (`16:9`); but for any short, 1:1.

3c. **`fit` defaults to `contain`, never `cover`.** The Remotion comp letterboxes onto a raisin-black backdrop so the whole image is always visible. `fit: "cover"` is opt-in only, and only valid when the asset was authored at the source's exact aspect ratio. This rule prevents the "we can only see the middle 30% of the screenshot" failure mode.
4. **Use the `list` kind whenever the speaker enumerates.** If the script says "three reasons", "first… second… third…", "five steps", etc., render a programmatic numbered list overlay across that whole span. Don't reach for a stock image of "a list." See Stage 2 for the schema.

4ag. **Every short gets the channel subscribe-bug composited in once, after the midpoint.** Owner-mandated May 22 2026. Asset: [assets/subscribe-bug.mp4](assets/subscribe-bug.mp4) — a 5s clip of Luuk's branded card with a cursor clicking **Subscribe → Subscribed** (lime-circle avatar, "Luuk Alleman", "17K subscribers"). It rides in as a small **`video` overlay, NOT a takeover**: ~25–30% of frame width, anchored `top-right` or `bottom-right`, kept inside the **middle-70% safe zone** — never the top 10% or bottom 20% platform-UI strips. **Window: exactly once, between 60–80% of total runtime** — after the middle, before the final CTA beat (rule §5 end CTA), never overlapping it. Motion: slide in, hold ~4–5s so the full click animation plays through, slide out — don't freeze on a still. Audio: mute the clip's own click-pop, or keep it **≤10%** under the voice — it must never spike over the speaker. This is a **deliberate exception** to rule 3 / rule 4ad's "no corner stickers": those ban *generic template chrome*; this is the channel's own on-brand subscribe asset and is purely additive — the speaker stays the show, so don't pause b-roll, kill a zoom, or cut away for it. Subtle and ambient on purpose: a soft mid-video reminder, not a hard interrupt.

4c. **First b-roll lands at 1.5–3.5s — NEVER before 1.5s.** Two failure modes are equally bad: (1) no visual until ≥5s — the cold-open feels flat and viewers drop. (2) visual at 0.0–1.4s — the speaker hasn't had any face-time yet, so the viewer sees a takeover before they've locked onto the person. Both kill retention. The window is 1.5–3.5s, layered with the lime flash + speaker punch-in. [scripts/align_to_speech.py](scripts/align_to_speech.py) enforces a 1.5s floor on the cold-open beat (pushes start_sec + shifts end_sec by the same delta to preserve duration). [scripts/lint_plan.py](scripts/lint_plan.py) errors hard if any beat starts before 1.5s.

4d. **Hook intro is a zoom-IN (1.0 → 1.06 → 1.0), not a zoom-out.** The speaker layer punches in fast, peaks at ~25% through the hook duration, then settles. Combined with the lime flash on top this is the "yellow flare + zoom in" attention grab. Going below 1.0× would expose black bars around the speaker, so the curve stays ≥1.0 throughout.

4b. **List items must teach, not label.** Each item is a complete idea the viewer can absorb in 2 seconds without already knowing the punchline. Bad: `"Process bug — credentials handed off"` / `"Model bug — what it wasn't"` (cryptic, restates the title). Good: `"A human gave the AI live prod credentials"` / `"The AI ran exactly what it was told to"` / `"Fix the workflow, not the model"`. The test: a viewer who muted the audio should still understand the lesson from the list alone. Three items reads better than two for a contrast — three lets you spell out cause / consequence / takeaway.

4p. **Every beat needs a `speech_anchor` — the EXACT phrase the speaker says when the visual should be on screen.** The render pipeline runs [scripts/align_to_speech.py](scripts/align_to_speech.py) before lint, which finds that phrase in `words.json` and snaps `start_sec` / `end_sec` to the actual word boundaries (with 0.10s lead, 0.60s tail). For `quote_pull` it ALSO derives `chars_per_second` so the typewriter finishes around the same moment the speaker finishes the quote. Without `speech_anchor` the beat keeps its hand-authored timing — which is almost always slightly wrong. Authoring rule: every beat in `broll_plan.json` should include a `speech_anchor` field. Format example:

```json
{
  "kind": "quote_pull",
  "start_sec": 13.5,
  "end_sec": 16.8,
  "speech_anchor": "this is why you can't trust AI with real systems",
  "quote_text": "This is why you can't trust AI with real systems",
  "attribution": "developers on Hacker News"
}
```

The script matches loosely (capitalization-insensitive, punctuation-insensitive, ≥70% token overlap in order) so minor transcription glitches don't break alignment.

4o. **Density cap: ≤4 beats inside any 12-second rolling window.** Visual density above this threshold feels frantic — the viewer can't absorb a beat before the next one lands. When over, drop the lowest-priority beat in that stretch. Priority order, highest first: `vs_split` / `quote_pull` / `stat_punch` (templates that argue or land a number) → `static` real screenshot of a tool the speaker named → `ai_image_on_grid` for a literal noun → `ai_image_on_grid` for an abstract metaphor. Templates that re-state the argument visually outrank pure-visual metaphors. Lint warns when density exceeds the cap.

4m. **No flicker frames between beats — close micro-gaps under 0.5s.** When two beats are 0.1–0.5s apart, the speaker layer flashes through in between for a fraction of a second and reads as a glitch. Either bridge them back-to-back or leave a clear ≥1s pause; never the in-between. Run [scripts/close_gaps.py](scripts/close_gaps.py) on the plan after you write it; it walks adjacent beats sorted by start_sec and extends the earlier `end_sec` to meet the next beat's `start_sec` whenever the gap is ≤0.5s. Render.sh wires this in automatically alongside the other syncs.

4r. **"Cloud" → "Claude" — automatic, no exceptions.** Whisper consistently mishears "Claude" as "Cloud" on this channel's audio. Every video processed by this skill is about Claude / Claude Code, so [scripts/transcribe.py](scripts/transcribe.py) substitutes `cloud → claude` (capitalization-preserving) in `words.json` before downstream tools read it. This means: speech_anchor matching uses "claude", list-item keyword matching uses "claude", and any rendered captions/quotes/labels you author MUST use "Claude" not "Cloud". When auditing existing plans, grep for "cloud" and fix every reference (anchor, value, caption, callout_*, list items, vs_split items, top/bottom_label, quote_text). The substitution rule lives in `_normalize_brand_terms()` in transcribe.py — extend that function if a new branded term ever needs the same treatment.

4s. **Hero text auto-fits the frame — no overflow, ever.** `stat_punch.value` strings like `"6 MONTHS"`, `"$1.5K"`, or `"40 MIN"` exceed the frame at the static `width * 0.32` font size. [StatPunch.tsx](remotion/src/templates/StatPunch.tsx) splits the value on whitespace, computes the longest word, and shrinks the hero font size to fit `width * 0.88` (88% of frame). Words wrap onto separate lines via `whiteSpace: pre-line`. **Never hand-author a value with a line of more than ~6 characters and expect it to render at full hero size** — even with auto-fit, longer words shrink visibly. Prefer concise tokens (`"10×"` over `"TEN TIMES"`, `"$18K"` over `"EIGHTEEN GRAND"`). Multi-line values are fine — the auto-fit handles them. Same principle applies to any other template that renders large text: the longest token must fit inside 88% of the frame at the chosen size.

4t. **List `end_sec` MUST cover the last item's `appear_sec` + 1.5s dwell, no cap.** [scripts/sync_list_items.py](scripts/sync_list_items.py) extends `end_sec` automatically. Previously it capped extension at +2s, which silently dropped items 2/3 from any list whose original `speech_anchor` only covered the intro phrase ("the skill was three pages") while items kept being spoken for 10+ more seconds. The cap is removed — extensions are unbounded; close_gaps.py resolves any overlap with the next beat. Authoring tip: make `speech_anchor` cover the LAST item's content keyword, not just the intro, so the initial `end_sec` is roughly correct.

4x. **Per-kind required-fields contract — lint errors hard if violated.** Plan agents repeatedly authored beats with the right `kind` but forgot the specific content fields each template needs, producing blank renders (e.g. a giant "25" with no caption, an empty callout box, a vs_split with only labels). The fix is a strict per-kind required-field check in [scripts/lint_plan.py](scripts/lint_plan.py). The contract:

| `kind` | Required fields | Renders blank without it |
|---|---|---|
| `stat_punch` | `value`, `caption` | Lone giant number with no context line |
| `callout` | `callout_prefix`, `callout_highlight` | Empty box on raisin grid |
| `quote_pull` | `quote_text` | Empty typewriter |
| `vs_split` | `top_label`, `bottom_label`, `top_items` (≥1), `bottom_items` (≥1) | Two labels with no body |
| `list` | `items` (≥1) | Empty card |
| `title_card` | `number`, `title` | Empty card |
| `chapter_bar` | `chapter_number`, `chapter_title` | Empty bar |
| `ai_image_on_grid`, `static`, `video` | `image_path` (file exists on disk) | Black frame |
| `keyword_chips` | `chips` (≥1) | Empty card |
| `progress_steps` | `progress` (≥1) | Empty card |
| `vertical_timeline` | `steps` (≥1) | Empty card |
| `word_pop` | `items` (≥1, each with `text` + `appear_sec`) | Empty frame |

Authoring rule: **whenever you write `"kind": "<X>"`, also write every field in that row of the table.** When in doubt, look at `remotion/src/StyleShowcase.tsx` for a working example of every kind. Lint will refuse to render a plan that violates this.

4v. **Hard ceiling: any single beat ≤5 seconds on screen.** Visuals beyond ~5s read as boring static frames — the speaker carries the show, not the b-roll. [scripts/align_to_speech.py](scripts/align_to_speech.py) auto-clamps `end_sec` to `start_sec + 5.0s` after computing the anchor span + 1.5s tail; [scripts/lint_plan.py](scripts/lint_plan.py) warns on hand-authored beats >5s and errors on >8s. The natural failure mode this rule prevents: a hook AI image lands at 1.7s, the next beat is at 8.4s (gap >1.5s so close_gaps doesn't bridge), and the AI image stays on screen for ~6.7s. The image is gorgeous but the viewer is bored. With the cap, the visual disappears at 6.7s and the speaker comes through — exactly the right pacing.

4w. **`vs_split` MUST have non-empty `top_items` AND `bottom_items`.** Without items, the template renders only the two labels (e.g., "A YEAR AGO" / "TODAY") with empty body — a blank stretch with no content. [scripts/lint_plan.py](scripts/lint_plan.py) errors hard if either array is missing or empty. Each side needs 1-3 short bullet items (3-7 words each). Authoring example:
```json
{
  "kind": "vs_split",
  "top_label": "OLD WAY",
  "top_items": ["Hire a VA at $1,500/mo", "Train for 4 weeks", "Manage daily"],
  "bottom_label": "NEW WAY",
  "bottom_items": ["One Claude routine", "40 lines of Markdown", "Runs forever"],
  "winner": "bottom"
}
```
The labels are the contrast frame; the items are the substance. Both required.

4y. **`word_pop` is the default for typographic emphasis. NEVER use `list` for shorts.** Rejected May 21 2026: the boxed numbered-list card ("01 / 02 / 03" on a raisin-black border-lime panel) reads as a cheap template — "looks awful, stop using it." The replacement is the cardless [WordPop](remotion/src/templates/WordPop.tsx) template, kind `word_pop`. It renders one phrase at a time in bold uppercase typography (white, optional lime accent) DIRECTLY OVER the speaker — no card, no border, no fill — with a 7-frame fade-in + 0.92→1.0 scale on each item and a soft cross-fade to the next. Use it for:

- The "stack" enumeration ("ChatGPT, Claude, Grok") — one item per word, timed to the speaker.
- Single-phrase emphasis lines ("NOBODY SEES THIS", "NOT BECAUSE OF AI", "FIND YOUR WAVE FIRST") — one item with `appear_sec = start_sec`.
- Anywhere you'd previously have reached for a `keyword_chips` card on a short — chips have backgrounds, `word_pop` doesn't.

Schema (each item is required to carry an absolute `appear_sec` so it lands on the speaker's word, same convention as `list` / `keyword_chips`):
```json
{
  "kind": "word_pop",
  "start_sec": 5.8,
  "end_sec": 12.2,
  "speech_anchor": "they used chatgpt claude and grok",
  "vertical": 0.72,
  "items": [
    { "text": "ChatGPT",                       "appear_sec": 6.2 },
    { "text": "{Claude}",                       "appear_sec": 7.0 },
    { "text": "Grok",                          "appear_sec": 7.8 },
    { "text": "AI customer {service}",         "appear_sec": 10.6 }
  ]
}
```

**Placement — lower third by default.** `vertical` is a 0–1 anchor (0 = top, 1 = bottom). Default 0.72 puts the text in the lower third, above where burned-in shorts captions usually sit, below the speaker's face and hands. Locked May 21 2026 after centered placement covered the speaker's face. Bump to 0.55 only for landscape edits where there are no burned captions.

**Mixed-font syntax — curly braces for "written" emphasis.** Wrap any sub-span in `{...}` to render it in a script (handwritten) font instead of bold Space Grotesk:

- `"FUTURE OF {solo business}"` → "FUTURE OF" in block sans, "solo business" in italic script (lime)
- `"{find your wave} first"` → "find your wave" in script, "first" in block
- `"NOT BECAUSE {OF AI}"` → frame in block, the emotional payload in script

The braces themselves are stripped at render. Script spans automatically get the lime accent color (they ARE the emphasis), so don't set `accent: true` if you're using script — it would just turn the block portion lime too. Use the mix to lean into emotion / softness on key nouns while the framing words stay sharp. Don't put the WHOLE item in braces — mixing IS the point; full-script items lose contrast.

Font stack: `Caveat 700` (Google Font, injected once per page load) → `Bradley Hand` (macOS native) → `Brush Script MT` → `Snell Roundhand` → `cursive`. Rendering machine should have at least one of these. The Google Font load is fire-and-forget; first frame may use fallback but the 7-frame fade-in hides it.

The `list` kind is still in the kind union (longform pieces sometimes still want a boxed sidebar list), but lint warns and a shorts-mode plan that uses `list` should be rejected in review. WordPop is also exempt from the 1.5s first-takeover floor — it's an overlay, not a takeover, so the speaker stays visible underneath.

4z. **No two image takeovers back-to-back. Speaker breathing room between any pair of `static` / `ai_image_on_grid` / `video` beats — minimum 1.5s of just the speaker.** When two images run head-to-head (e.g. Ozempic pen 22.9→26.5s, wave 26.5→29.5s with the coverage underlay bridging them), the cut reads as "and then another picture, and then another picture" — it feels random, like a slideshow. The speaker reappearing for 1.5s+ between images resets the narrative thread so each image lands as a new beat instead of part of a parade. Same goes for image → quote_pull → image or image → vs_split → image. Allowed exceptions: (a) a `word_pop` overlay sitting ON TOP of an image takeover — speaker doesn't need to come back for that, the overlay is the breath; (b) a deliberate before/after pair where both images speak the same beat. Default = enforce the gap. Authoring fix: split a "wave of images" into pairs separated by speaker; if you need three images for a section, interleave them with `word_pop` lines pulled from the script.

4ah. **`hook_title` flank layout — two text blocks straddling the speaker's face.** `align: "flank"` renders `left_text` in the clear-left column and `right_text` in the clear-right column, both at head height, both behind_subject (inner edges tuck behind the head). The single most readable behind-subject hook layout for a centered talking head — the face IS the gap between the two blocks. Schema: `{ "kind": "hook_title", "align": "flank", "left_text": "TWO\nPEOPLE", "right_text": "$400\nMILLION", "vertical": 0.17, "behind_subject": true }`. Both blocks support `\n`; the component sizes them to a common font so they read balanced. Use for hooks that split naturally into two halves (subject | number, before | after, problem | payoff).

4ap. **Cinematic hook motion — the cold open is never a static frame.** [EditedVideo.tsx](remotion/src/EditedVideo.tsx) `useHookScale` opens the video punched IN at 1.16× and eases OUT to 1.0 over the hook duration with a cubic ease-out (fast release, long settle) — one clean directional "settle into the shot", the way a film opens. NOT a pulse or bounce. Pairs with the whoosh+boom+flare audio stack so the first second has motion + impact, never a still talking head.

4ar. **⭐ CINEMATIC HOOK (`style:"cinematic"` on a `hook_title`) — the premium cold-open (locked 2026-06-12, after Luuk: "the hooks are boring — make it cinematic, not cheap remotion editing").** [CinematicHook.tsx](remotion/src/templates/CinematicHook.tsx) replaces the flat kicker+rule+pop with a graded-title treatment: atmosphere (bottom scrim + vignette + fine film grain) + crafted kinetic type. Set `style:"cinematic"` + `hook_font:"serif"` (Fraunces — Luuk's pick over Archivo-Black grotesk) on a `hook_title` beat; `title` supports `\n` + one `{accent}` span (the payoff word, rendered in lime **italic serif** with a drawing underline + soft bloom). Words reveal with a fluid fade+rise+scale+motion-blur on a long QUINT_OUT tail (NOT a mask-wipe — that reads stiff), with overlapping stagger. Mixed-case hero (all-caps reads dated per 2026 research). **Hard-won gotchas (all from this session, do not relearn):** (1) **SETTLE, don't drift** — the lockup rises and locks into place by ~1.3s then HOLDS rock-steady; a continuous drift/zoom through 2–3s reads as "a floating template", not a film title (the footage `useHookScale` push-in carries the motion). (2) **Glow must be a RADIAL gradient behind the word, never a `text-shadow`** — text-shadow glow rasterizes to the element's box → a hard rectangular halo. (3) **Keep the glowing accent OFF the frame edges** — a bloom on a word near the left/bottom edge runs off-frame and the comp's clip turns it into a hard line; ~10% side padding + a lower-third anchor ~0.40 + a tightened bloom keeps it fully inside. (4) **Exit fades are duration-relative** (`durSec - 0.4`…) so short hooks (A5 ≈1.6s) and long (A4 ≈3.8s) all dissolve, never hard-cut. (5) **ATMOSPHERE MUST RAMP, never hard-cut (locked 2026-06-12, Luuk: "the color grading is very different between seconds 4 and 5 — these quick changes can't happen").** The hook's scrim + vignette + grain sit ON TOP of the comp ColorGrade; if they vanish instantly at the hook's end the frame "pops" brighter/flatter into the body and reads amateur. A single `atmo` ramp (`interpolate(t,[0,0.4,durSec-0.6,durSec-0.02],[0,1,1,0])`) multiplies ALL three atmosphere layers' opacity so they fade in at the open and ease OUT over the last ~0.6s — by the cut the extra atmosphere is already at 0, so the hook→body seam is invisible. Whenever a beat/template adds its OWN grade/darkening on top of the global ColorGrade, it must ramp out, not cut. Kicker case in data is irrelevant (component uppercases it); only the `title` needs mixed-case + the `{accent}` brace. Plain `HookTitle` (no `style`) remains for non-cinematic uses.

4aq. **Color grade — the whole comp is graded as one film.** [ColorGrade.tsx](remotion/src/templates/ColorGrade.tsx) lays a restrained cinematic grade over EVERYTHING (speaker + b-roll alike) so cutaways never look pasted on: a `GRADE_FILTER` (contrast 1.07 / saturate 1.10 / brightness 1.012) on the comp root, plus a duotone soft-light wash (warm highlights, cool shadows) and a soft vignette. Tuned to be felt not seen — if you can point at "the filter", it's too strong.

4ar. **Music arc — the bed swells into the payoff, never runs flat.** `render.sh` finds the climax beat (the `quote_pull`, else the last full-screen takeover) and passes its time as `MUSIC_SWELL_AT`; [score.sh](scripts/score.sh) then rides a trapezoid volume envelope on the music — rise 6s, hold 2s through the payoff, fall 3s, +55% at peak — applied to the audible branch (not the sidechain detector). A soft `hook-boom` payoff-hit also lands the instant the climax line finishes (build_sfx_track.py). The locked calm-bed rule still holds for the baseline; the arc is the *shape*, not a louder bed.

4as. **Cinematic word-punch captions.** Shorts caption lines cap at **3 words** (`captions_plan.py --max-words 3`, passed automatically for portrait) — fast word-punch cadence. The entrance is cinematic: fade + small rise + a blur that burns off (defocus→focus), NO scale-bounce/pulse (the cheap look is explicitly banned). The current-word lights neo-lime as a teleprompter follow.

4at. **Source REAL assets via web search — generated images are the fallback, not the default.** For anything with a real-world referent (a named product, company, person, tool), `WebSearch` + `WebFetch` to find a real photo (Unsplash direct CDN URLs work well — `images.unsplash.com/photo-…?w=1100&h=1100&fit=crop&q=80` for a 1:1 crop) and `curl` it down. A real semaglutide pen / a real ocean wave reads as credible; an AI illustration reads as stock. `gpt_image_2` is for abstract metaphors with no real referent only. Research the actual story too — it grounds captions/labels in fact.

4am. **Captions and on-screen beats are MUTUALLY EXCLUSIVE — one or the other, never both.** Codified May 21 2026 ("when we already have text on screen the captions are annoying — those texts are representative enough"). `render.sh` generates `captions_plan.json` from `words.json` whenever `CAPTIONS=1` (default — set `CAPTIONS=0` only if the source already has burned-in captions). [Captions.tsx](remotion/src/templates/Captions.tsx) renders them; on shorts they're **cardless** — bold uppercase + heavy shadow, no background box — anchored at the very bottom (`bottomOffset` 0.11). [EditedVideo.tsx](remotion/src/EditedVideo.tsx)'s `captionBlackout` covers **EVERY beat's time range** — captions show ONLY in the pure-speaker gaps where nothing else is on screen. When any beat is up (takeover, `image_card`, `word_pop`, `hook_title`, `subscribe`…), its own text/visual carries the moment and the caption is suppressed. Captions are the connective tissue between beats, not a layer on top of them.

4an. **Grid backgrounds are cloudy, not uniform.** Codified May 21 2026 ("the grid shouldn't always be visible — cloudy, some lines degraded / gradient out"). [Backgrounds.tsx](remotion/src/templates/Backgrounds.tsx) masks every grid with `CLOUD_MASK` — layered soft radial blobs so the grid is crisp in patches and fades to nothing between them. It reads as a drifting texture under the content, never as graph paper. Any new gridded background must carry the same mask.

4ao. **`vertical_timeline` — the rail DRIVES the dots.** Codified May 21 2026 ("the line should be the core; a point appears from the end of the line when the line reaches it"). [VerticalTimeline.tsx](remotion/src/templates/VerticalTimeline.tsx) uses fixed-height rows so every dot's Y is deterministic, then keyframes the rail head to pass EXACTLY through `(appearFrame[i], dotY[i])` for every item — so the line reaches a dot at the precise frame that dot is due, and the dot pops from the rail head. Line speed and dot cadence are locked; the rail never races ahead or lags. Any timeline-style template (horizontal_timeline, progress_steps) should follow the same head-drives-the-reveal principle.

4al. **Text NEVER overlays the speaker's head or face. All text overlays sit in the LOWER THIRD.** Hard rule, codified May 21 2026 ("place lower, as a rule, never let text overlay my head"). Every `word_pop` and `hook_title` beat must have `vertical` ≥ 0.60 — `0.66`–`0.74` is the working band for a centered 9:16 talking head (below the chin, above the very bottom edge). Defaults: `hook_title` `vertical` defaults to 0.66, `word_pop` to 0.72 — both safe. NEVER place text at the top (`vertical` 0.10–0.30) — the head is there. NEVER place text mid-frame over the face. [scripts/lint_plan.py](scripts/lint_plan.py) errors hard on any `word_pop`/`hook_title` with `vertical` < 0.58. This SUPERSEDES any earlier rule that suggested top placement for variety — variety comes from font mix and content, not from putting text on the face.

4aj. **`image_card` — b-roll images go in a glassy bottom-half card, NOT full-screen.** Codified May 21 2026 ("I don't want images full screen — put them bottom half with a glassy background so I'm still visible"). The [ImageCard](remotion/src/templates/ImageCard.tsx) kind renders the image inside a frosted dark-glass rounded card (neo-lime glow border, backdrop-blur) occupying the bottom ~half of the frame — the speaker stays fully visible above. Optional `caption` strip along the bottom. Schema: `{ "kind": "image_card", "start_sec": ..., "end_sec": ..., "image_path": "broll/x.png", "caption": "..." }`.

**For shorts, `image_card` is the default for b-roll images** — use it instead of `ai_image_on_grid` / `static` full takeovers. `ai_image_on_grid` (full-screen) stays for intro/longform 16:9 work. The image inside the card is `object-fit: cover`, so source images can be any aspect — they fill the card cleanly.

4ax. **Open-loop overlays POSE the question — they never state the conclusion.** Codified May 22 2026 ("the whole retention thinking is just not working"). The early/open-loop `word_pop` (the beat ~3-6s in) exists to hold a curiosity gap OPEN — so it must be a QUESTION or a tease, never the answer. A scene about "I tested 10 tools, 2 worked" must NOT flash "8 were just tryouts" at second 5 — that prints the conclusion and there's nothing left to stay for. It poses "why did 8 make nothing?" instead; the payoff ("they each owned one daily task") lands LATER as its own beat, when the speaker delivers it. Rule of thumb for any overlay in the first third: if it could be the video's *answer*, it's wrong there — rewrite it as the *question*. Conclusions are for the back half.

4av. **`bar_overlay` — visualize a change (costs cut, revenue up) as a chart OVERLAY, not a takeover.** When the speaker describes a quantitative shift — "cut their costs", "10×'d revenue", "from 4 weeks to 4 minutes" — show it. [BarOverlay.tsx](remotion/src/templates/BarOverlay.tsx) (kind `bar_overlay`) is a compact, cardless bar chart in the lower third: solid bars animate up to height (relative to the set's max, so descending values render as visibly descending bars), staggered, last bar lime. Speaker stays visible (partial overlay, like `word_pop`). Schema: `{ "kind": "bar_overlay", "title": "Cost to run the company", "bars": [ {"label":"Hire a team","value":100}, {"label":"2 people + AI","value":15,"highlight":true} ] }`. A 2-bar set auto-shows a lime `−84%` delta chip — BUT only when the bars carry `display` strings (real numbers). No `display` = no chip; never fabricate a precise % from made-up bar heights — the height difference alone carries the message. This is the model for chart overlays generally: small, cardless, lower-third, speaker visible — not a full-screen `bar_chart` takeover. **Value labels render INSIDE each bar** (not floating above). **Overlap is structurally impossible** — BarOverlay was rewritten May 22 2026 with a RIGID fixed-box layout: one absolute box of pre-computed height, split into stacked regions (TITLE / PLOT / LABELS / DELTA) with hard-coded `top`s. Bars are absolutely positioned inside the PLOT region, anchored to its floor, height HARD-clamped to `plotH`, and the spring `grow` is clamped to `[0,1]` so a spring overshoot can't grow a bar past the ceiling. There is no flexbox flow that can overflow into a neighbour. If you ever change BarOverlay, keep this property: every region must have a fixed `top`+`height`, and bar height must be `Math.min(plotH, …)`.

4aw. **Transcription auto-correct — known mishearings are patched deterministically.** Whisper mishears predictably. [transcribe.py](scripts/transcribe.py) has TWO correction layers, both run before any downstream tool reads `words.json`: `_normalize_brand_terms` (single-word, e.g. cloud→claude) and `_apply_corrections` / `PHRASE_CORRECTIONS` (contextual — where the wrong word is itself a real word and only the surrounding phrase disambiguates it, e.g. "caught their costs" → "cut their costs", while "caught the wave" stays correct). When a mistranscription surfaces in a render, DON'T just hand-fix the one caption — add the phrase to `PHRASE_CORRECTIONS` (or `BRAND_WORDS` for single words) so it's fixed for every future video. It's the channel's correction memory; transcription is never perfect and this is the deterministic patch layer. Examples added May 22 2026: `gemini agent → Hermes Agent`, `vault → bolt` (the channel's own tool names; Whisper can't know them). May 23 2026: `other aid → other eight`, `aid didn't → eight didn't` (Whisper hears the /eɪt/ syllable as "aid" — scene-2 caption "AID DIDN'T" instead of "EIGHT DIDN'T"). Number-word mishearings are now ALSO caught by the script-match aligner: `_NUMBER_WORDS` ("one"..."twelve", "hundred", "thousand"…) is treated as factual-and-adoptable in `is_brandlike`, so when the canonical script says "Eight" at a position Whisper heard a common word, the script wins regardless of sentence-initial casing.

**`polish_transcript.py` runs ONCE per workdir, not every render.** It re-corrects the transcript against the AUDIO, so it is NOT idempotent — it will silently REVERT any manual fix a human makes to `words.json`. `render.sh` guards the polish call with a `.polished` marker file: first render polishes + touches the marker; later renders skip it. So a manual `words.json` edit STICKS. If you genuinely need to re-polish (e.g. you changed polish logic), `rm <workdir>/.polished`. When you hand-fix `words.json`, the proper durable fix is still to add the correction to `transcribe.py` so future videos never need the hand-fix.

4ay. **🎬 PRODUCTION-PIPELINE STEP — every short is matched to its canonical script in the content DB. This is MANDATORY, not optional.** Codified May 22 2026 ("every time we want shorts edited, those shorts are in the production pipeline — match the transcription with the actual script so we know for a fact what the correct words are, reducing guesswork"). Every BuildLoop short was written before it was filmed; the script lives in the content database (`content_pieces.script`). Whisper can never know the channel's own brand names (`Hermes Agent`, `Bolt`, `OpenClaw`, `Lovable`, `v0`) — but the script states them for a fact. So **before authoring the plan for any short, fetch its canonical script.** Procedure:

1. **Transcribe first** (`transcribe.py` → `words.json`) so you have the rough spoken text.
2. **Find the content-DB row.** The shorts live in `content_pieces` with `content_type='short_form'`, titled like `S60 · 3 AI tools that paid. 8 that didn't.`. The mp4 filename (e.g. `…-scene-2.mp4`) does NOT carry the row id — match by CONTENT. Read the first ~2 sentences of `words.json`, then query via the content MCP:
   `SELECT id, title, script FROM content_pieces WHERE content_type='short_form' AND script ILIKE '%<a distinctive phrase from the hook>%'`
   Confirm the hook/proof text in the returned `script` genuinely matches the transcript. If unsure, pull a few candidates and compare.
3. **Write the script to the workdir.** Save the row's raw `script` field verbatim to `<workdir>/script.txt` (workdir = `~/.cache/video-edit/<stem>_<hash>/` — the same dir as `words.json`).
4. **render.sh aligns it automatically.** On the next render, [scripts/align_transcript_to_script.py](scripts/align_transcript_to_script.py) diffs the transcript against `script.txt` and corrects misheard **brand names only** — the audio stays the source of truth for everything else (an ad-libbed "ten" is NOT forced to the script's "eleven"; the speaker is allowed to re-phrase and skip lines). It prints a `[REVIEW]` list of brand disagreements it wasn't confident enough to auto-fix — **read that list and hand-reconcile those in `words.json`**, you now have the real script to check against. Runs once, re-runs whenever `script.txt` changes (`.script_matched` marker).
5. **Use the script for the PLAN too.** The canonical script tells you the real core message, the hook formula, the intended structure (HOOK/PROMISE/PROOF/PAYOFF/LOOP) and the correct business names — author `broll_plan.json` informed by it instead of guessing intent from a rough transcript. This is the bigger half of the rule: "use it to know for a fact what the script is really about."

The old `PHRASE_CORRECTIONS`/`BRAND_WORDS` tables (rule 4aw) remain as a fallback for videos with no DB script, but for any short that IS in the pipeline, `script.txt` is the authoritative source — no more per-brand guess entries needed.

4az. **🚨 RENDER BATCHES RUN STRICTLY SEQUENTIALLY — ONE render at a time, ONE batch, ONE loop.** Codified May 22 2026 after a multi-clip job pegged the machine to load-average 85 and stalled for ~30 min — two 4K renders were running at once. Renders are the single most expensive, most fragile step; treat them with discipline:

- **A 4K `QUALITY=final` render is heavy.** TWO of them at once thrashes the disk and the whole box grinds (load 80+, everything crawls, nothing finishes). Even preview renders shouldn't double up.
- **NEVER launch one background task per clip. NEVER launch two render batches.** To render N clips, write ONE shell loop in ONE background `Bash` call — `for spec in 1:final 2:final … 6:preview …; do QUALITY=$q bash render.sh "$clip"; done`. A single loop is inherently one-render-at-a-time. Spawning a task per clip, or a "finals" batch plus a "previews" batch, runs them concurrently — that is the exact mistake that caused the stall.
- **Before starting any render, check nothing is already rendering:** `ps ax | grep '[r]emotion render'`. If a render is live, wait for it — do not start another.
- **The render lock is a backstop, not the pacing mechanism.** `render.sh` serializes on `/tmp/video-edit-render.lock` (machine-global — it used to key off `$TMPDIR`, which is per-process on macOS, so two shells got different lock files and never blocked each other; fixed May 22 2026). Rely on the single-loop discipline; the lock only catches accidents.
- **Recovering from a render pileup:** `pkill -9 -f "video-edit/scripts/render.sh"`, `pkill -9 -f "remotion render"`, then `rm -rf /tmp/video-edit-render.lock*`. Note macOS "Helper (Renderer)" processes are the USER'S Chrome browser — leave those alone; Remotion's own workers live under the skill's `remotion/node_modules`. After cleanup, relaunch as ONE sequential loop.
- **Time budget:** preview ≈ 17s/clip; 4K final ≈ 2–6 min/clip. A 12-clip mixed batch is ~30–40 min — that is normal and correct. It only "takes too long / doesn't work" when renders are accidentally fighting each other. Sequential is faster than concurrent here, because concurrent thrashes.

4ba. **🎬 The author's `end_sec` is the truth — `align_to_speech` may EXTEND a beat, never SHORTEN it. And every enumerated step needs its own `appear_sec`.** Codified May 22 2026 after scene-6's `vertical_timeline` (18s, six moves) collapsed to ~2s on screen with all six items popping at once, and scene-7's `bar_overlay` (6.2s, three ascending bars timed to "Message 1, 10, 20") was clamped to 5s and disappeared mid-count. The rule has two halves:

1. **`end_sec` is NEVER shortened — universally, every kind.** A `speech_anchor` only marks the START of when the visual should appear; the author's hand-set `end_sec` is when it should leave. [scripts/align_to_speech.py](scripts/align_to_speech.py) used to overwrite `end_sec` with `anchor_last_word + 0.8s` regardless of kind — so an 18s timeline anchored to its first item ("the first one, model routing") collapsed to 2.3s. Fixed: `new_end = max(authored_end, anchor_last_end + TAIL)`. The `MAX_BEAT_SEC=5s` clamp now only fires when the anchor extends past authored AND the kind is not in `SEQUENCE_KINDS`; an author who deliberately set 6.2s (and got past lint's 8s hard ceiling) is respected. `SEQUENCE_KINDS` was also extended to include `bar_overlay` (bars stagger in by index — it enumerates like a list).
2. **Every item / step in a multi-item sequence component MUST have its own `appear_sec`** (absolute source-video seconds — same convention as rule 4ac). This applies equally to `vertical_timeline.steps[]`, `list.items[]`, `word_pop.items[]`, `side_panel`, **and `bar_overlay.bars[]`** (added May 23 2026 after scene-7's three bars "Message 1 / 10 / 20" all popped in the first second, spoiling the count). Without `appear_sec`, the template auto-staggers across the first 60% of the beat — so all six moves of the "6 free moves" timeline appeared in the first ~10s while the speaker was still on move #3. Set `appear_sec` to the moment the speaker says each item (grep `words.json` for the first content word of each step / bar). For an enumerated bar chart this is REQUIRED; for a 2-bar comparison (both bars belong together) you can omit and let the stagger run synchronously, but enumerated counts must time per-bar. Example, scene-6 timeline:

```json
{"heading":"Model routing","description":"...","appear_sec":12.9},
{"heading":"/compact at 60%","description":"...","appear_sec":16.3},
{"heading":"CLAUDE.md < 1k tokens","description":"...","appear_sec":20.0},
{"heading":"Web search off","description":"...","appear_sec":23.5},
{"heading":"Post-compact hook","description":"...","appear_sec":25.6},
{"heading":"2-hour timer","description":"...","appear_sec":27.5}
```

The two rules go together: a `vertical_timeline` whose `end_sec` correctly covers the full 18s enumeration is useless if every dot pops in the first 10s. Author `end_sec` to the last item's spoken end + ~0.5s tail, and set every step's `appear_sec` to when that step is actually named. The rail then draws progressively, dots pop AS the speaker calls each one, and the component stays on screen for the whole enumeration.

4bx. **📊 `dashboard_card` — mock SaaS dashboard for "the dashboard / the metrics / everything was green" moments.** Codified May 23 2026 ("since we already have a terminal visual, a dashboard visual would also be nice"). [DashboardCard.tsx](remotion/src/templates/DashboardCard.tsx) kind `dashboard_card`. Sibling of `claude_code_terminal` — same Mac-window frame, but renders 4 stat tiles in a 2×2 grid (label + big number + optional trend pill) plus a pulsing "LIVE" indicator and optional sparkline. Numbers count up on entrance via spring interpolation so the dashboard feels alive. Schema: `{kind:"dashboard_card", title:"AGENT OPS · LIVE", stats:[{label:"AGENTS",value:"12",trend:"+3"}, ...], sparkline?:[40,45,50,...]}`. Use it for any moment the speaker references metrics, monitoring, dashboards, KPIs, or "looks impressive on paper" setups that the rest of the video undercuts.

4by. **🟦 Captions stay ON during PARTIAL visual overlays — only suppress them during full-screen / text-heavy beats.** Codified May 23 2026 ("for people watching the short without their volume on, they need the captions"). The previous `captionBlackout` covered every beat — but partial overlays like a `bar_overlay`, the `subscribe` animation, a `portrait_burst`, or `tool_logo_burst` don't compete with captions: the visuals sit mid-frame, captions sit at the very bottom, both readable. The new rule classifies kinds into two buckets via `CAPTION_FRIENDLY_KINDS` in [EditedVideo.tsx](remotion/src/EditedVideo.tsx):

**Caption-friendly** (captions render straight through):
- `bar_overlay` · `subscribe` · `portrait_burst` · `tool_logo_burst` · `agent_avatar_burst` · `ratio_dots` · `image_card` · `icon` · `static`

**Caption-suppressing** (full-screen takeovers + their own text):
- `hook_title` · `word_pop` · `bullet_burst` · `headline_card` · `vertical_timeline` · `vs_split` · `cinematic_title` · `stat_punch` · `quote_pull` · `org_diagram` · `claude_code_terminal` · `dashboard_card` · `inline_chart`

This supersedes the original mutually-exclusive caption rule (was: "every beat suppresses captions"). The semantic word-overlap pad check is also skipped for caption-friendly kinds. When you add a new kind, decide which bucket it belongs to and add it to `CAPTION_FRIENDLY_KINDS` if it's a partial/ambient overlay.

4bq. **📈 `inline_chart` — small line-graph overlay for continuous-trend data.** Codified May 23 2026. Different from `bar_overlay` (discrete enumeration). For moments where the speaker describes a TREND or DISTRIBUTION — "tokens re-read per message grows linearly", "solo founders cluster between $200K-$500K". [InlineChart.tsx](remotion/src/templates/InlineChart.tsx) kind `inline_chart`. Dark-glass card in the lower-mid area (speaker visible), title on top, polyline plot animates left-to-right with a lime leading-edge dot, optional x-axis labels. Schema: `{kind:"inline_chart", title, data: [n,...], labels?: [...], vertical?, draw_duration?: 1.2}`. Pair the `draw_duration` with the spoken explanation length so the line finishes drawing as the speaker finishes the point.

4bp. **💻 `claude_code_terminal` — tiny Mac-style terminal frame with typewriter lines, themed for Claude Code.** Codified May 23 2026 ("we don't really do that much in the terminal ourselves, but claude code lives there"). For moments referencing the CLI tool — `/compact`, `/clear`, `CLAUDE.md`, MCP config — show a small terminal window with the relevant `claude>` prompts + Claude responses typing in. [ClaudeCodeTerminal.tsx](remotion/src/templates/ClaudeCodeTerminal.tsx) kind `claude_code_terminal`. Partial overlay (speaker stays visible). `lines: [{type, text, appear_sec, cps?}]` — `type` is `user` (lime `claude>` prompt), `claude` (white output), or `system` (subdued info `#`). Use it instead of raw code or a screenshot when the message is "this is what happens INSIDE Claude Code."

4bo. **🧩 `org_diagram` — 12-box "AI team" chart with progressive reveal + dim pattern.** Codified May 23 2026 — specifically built for scene-11's "12 boxes and pretty arrows" line: the literal diagram appears as the speaker describes it, then 9 of the 12 boxes dim + show a red X to reveal "the other nine are theater." [OrgDiagram.tsx](remotion/src/templates/OrgDiagram.tsx) kind `org_diagram`. Parent box at top (e.g. "AI TEAM"), N children in a 4×3 grid with bezier-connected arrows. Each node has `appear_sec` + optional `dim_at` (when to fade/X-out) + optional `kept: true` (lime survivor). Schema: `{kind:"org_diagram", title, parent_label, nodes: [{label, appear_sec, dim_at?, kept?}, ...]}`. Use sparingly — it's a hero takeover for the one moment that explicitly describes a diagram.

4bn. **🤖 `agent_avatar_burst` — small robot-face avatars for the "AI agent" cull pattern.** Codified May 23 2026. For moments referencing N AI agents/routines where MOST of them get killed/dropped — show robot avatars accumulating, then dim+X-out the unkept ones with the kept survivors staying lime. [AgentAvatarBurst.tsx](remotion/src/templates/AgentAvatarBurst.tsx) kind `agent_avatar_burst`. Inline SVG robot icon — no external asset. `items: [{label?, appear_sec, dim_at?, kept?}]`. Best for scene-5 (killed 9 of 12 routines), scene-13 (the agent zoo), scene-6's Opus-plans-Sonnet-executes pairing. Pairs well with `dim_at` set to the speaker's "killed/dropped/cut" moment.

4bu. **🪪 `hook_title` supports a `logo_path` — when the hook names a real company, show its logo from frame zero.** Codified May 23 2026 ("we say Klarna fired 700 people for AI. We should directly show the Klarna logo in there, as it is a hook and logos work in a hook"). The hook is the cold-open scroll-decision window; if the kicker names a brand ("KLARNA FIRED 700 PEOPLE FOR AI"), put the logo ABOVE the kicker so the viewer sees the actual brand from frame 0. [HookTitle.tsx](remotion/src/templates/HookTitle.tsx) renders `logo_path` as a small rounded-square white tile with a lime hairline ring (~14% of frame width) directly above the kicker, fading in with it. Schema: add `"logo_path": "klarna.png"` to any `hook_title` beat. Resolved through the same asset-search path as other broll, so `assets/logos/` is auto-included. Applies whenever the hook names a specific company — pair with rule 4bm (always show logos when businesses are named) and rule 4br (Claude always gets Anthropic).

4bv. **⚫️ For ANY "X out of Y" comparison — use `ratio_dots`.** Codified May 23 2026 ("when we make an out-of comparison… show 12 dots and highlight 9 of them depending on whether it's positive or negative"). Y dots in a grid, X of them flip color at `mark_at`. Polarity controls the read:

- **`polarity: "negative"`** — start LIME, marked dots fade to gray + show a red X. Use when X is the BAD number ("9 of 12 KILLED", "8 of 11 cancelled", "9 fired once"). Viewer sees the cull happen literally.
- **`polarity: "positive"`** — start gray, marked dots LIGHT UP to lime. Use when X is the GOOD number ("3 of 12 STILL RUNNING", "3 of 11 made me money", "65 of 100 prefer X").

Schema: `{kind:"ratio_dots", start_sec, end_sec, total: 12, marked: 9, polarity:"negative", mark_at: 16.5, caption:"ROUTINES"}`. The dots appear in a squarish grid (auto-sized cols/rows), each pops in with a small stagger, then at `mark_at` the marked subset transitions. Caption renders above in uppercase block type.

When to author: any spoken ratio in the form "X of Y" / "X out of Y" / "N percent of M". Common cases on this channel:
- "I killed 9 of my 12 routines" → total 12, marked 9, polarity negative
- "3 made me money, 8 didn't" → total 11, marked 3, polarity positive
- "65% of devs prefer Codex" → total 100, marked 65, polarity positive (caption "DEV PREFERENCE")

Beats the older `agent_avatar_burst` for ABSTRACT counts — dots are cleaner than robot faces when the items aren't literally "AI agents." Reserve `agent_avatar_burst` for moments specifically about AI agents/routines as characters.

4bt. **📉 Use `inline_chart` with DESCENDING data for "tanked / dropped / crashed" moments.** Codified May 23 2026 (scene-3 "customer satisfaction tanked"). When the speaker describes a metric going DOWN, set `data` to a smooth descending sequence ([95, 92, 88, 70, 45, 22] for "tanked", or a gentler [80, 75, 65, 55] for "declined"). The leading-edge lime dot rides the descending line. Same component as the ascending-cost graph in scene-7 — direction is just a function of the data. Labels can be `["before", "", "", "", "after"]` to bracket the trajectory without cluttering. For any "satisfaction tanked / NPS dropped / revenue fell / engagement crashed" line, default to this rather than a `word_pop` of text — a downward line communicates the trajectory in 1.8s of motion that text can't.

4bs. **🧠 Every visual must be LOGICAL — it must depict what the speaker is actually saying AT THAT MOMENT, not a related-but-different idea.** Codified May 23 2026 after scene-10 placed Sam Altman + Dario Amodei portraits at the "500 developers got surveyed" line — Sam and Dario aren't the devs being surveyed; the portrait is just a vaguely-related "OpenAI/Anthropic people" thought. The viewer's brain has to fill in the gap and the visual undermines the line instead of supporting it. Before locking any beat, ask:

> "If the viewer paused the frame and read only what's on screen, would it match the EXACT sentence the speaker is on?"

If the answer is no — even slightly — pick a different visual. Concrete checks:
- A `portrait_burst` of CEOs belongs at moments where the SPEAKER is talking about those CEOs (e.g. "the CEOs predicting a solo unicorn — they sell compute"). Not at moments about developers, products, or unrelated topics that involve their companies.
- A `tool_logo_burst` belongs when the speaker is naming the product/company. Not when the speaker is talking about its CEO or its users.
- A `stat_punch` of "500" belongs at "500 developers surveyed" — not the "$2M" mentioned 10s later.
- A `bullet_burst` of items belongs only over the span the speaker is actually enumerating those items, not before they start or after they've moved on.

Auditing rule: every existing beat should pass the pause-and-read test. When in doubt, remove the beat and let the speaker carry the moment — empty is better than wrong.

4br. **🟧 When the speaker says "Claude" — ALWAYS show the Anthropic logo.** Codified May 23 2026 ("a lot of videos don't show Claude's logo!"). Claude is the channel's most-mentioned brand; if a video says "Claude" and you can't see Anthropic anywhere on screen, the visual is incomplete. Rule:

- **Every scene that names Claude must show `anthropic.png` somewhere on screen** — usually as a `tool_logo_burst` item at or near the FIRST `"claude"` word in `words.json`. Equivalent visuals also satisfy the rule: a `portrait_burst` of Dario Amodei (he IS Anthropic), or a `claude_code_terminal` (the title literally reads "claude code").
- When inserting, find the first 1.5s+ gap near the first "claude" word and put a single-item `tool_logo_burst` with `image_path: "anthropic.png"`, `label: "CLAUDE"`, `accent: true` (lime ring). If no clean gap exists, *augment* an adjacent `tool_logo_burst` to include the Claude logo, or `accent` the existing Claude reference.
- This extends rule 4bm's "always when a real business is named" with a Claude-specific priority — Anthropic is the channel's house brand.

4bm. **🏷️ `tool_logo_burst` — small brand/tool logos in scattered slots, always when a real business is named.** Codified May 23 2026 ("if we mention any businesses, add their logos always"). Sibling of `portrait_burst` but for product/company logos. Rounded-square tiles with lime-or-white hairline ring, white background for logo readability. [ToolLogoBurst.tsx](remotion/src/templates/ToolLogoBurst.tsx) kind `tool_logo_burst`. `items: [{image_path, label?, appear_sec, accent?}]`. **Shared logo library**: [assets/logos/](assets/logos/) holds the brand library; `render.sh` includes it in the asset search path, so plans reference `"image_path": "anthropic.png"` (no per-scene copy needed).

**Text-only tile fallback**: when a tool/brand has no public logo (channel's own products like "Hermes Agent", very new tools, anything without a Wikipedia page), OMIT `image_path` and just set `label` — the tile renders as a raisin-black card with the brand name in lime-or-white type. Use this so an enumeration like "Hermes, Codex, Cursor, OpenClaw, ElevenLabs, Bolt, Replit, v0" can show ALL 8 even when only some have logos. Don't skip the missing ones — that leaves visual holes mid-enumeration. Codified May 23 2026 ("make sure to show all the logos. Right now it looks super messy. Hermes agent doesn't show the logo. 11 laps doesn't show the logo.").

**Auto-fetch new logos on the spot** via [scripts/fetch_logo.py](scripts/fetch_logo.py):

```
python3 scripts/fetch_logo.py "Stripe" "Notion" "Hugging Face"
```

The script hits the Wikipedia `pageimages`/`images` API, scans every image on the page, **scores filenames by logo-likelihood** (contains 'logo'/'wordmark', filename mentions the brand, SVG > PNG > JPEG, hard-block on Wiki chrome like `Disambig`/`Commons-logo`/`Symbol_*_class`/`PD-icon`/`OOjs` UI icons), tries multiple title candidates (`Brand`, `Brand (company)`, `Brand, Inc.`, etc.), skips disambig pages, and only downloads if the score is high enough that it's actually the brand logo (not a photo of the CEO or the headquarters building — both of which Wikipedia's plain `pageimages` returns). Files saved as `<slug>.png` (lowercase, non-alphanumeric → underscore: `Stripe` → `stripe.png`, `X (Twitter)` → `x_twitter.png`). Idempotent — re-running with an existing brand is a no-op cache hit. **Always call it before authoring a `tool_logo_burst`** that references a logo not already in the library. Currently in the library (37 brands): airbnb, anthropic, apple_inc, asana, atlassian, bolt_new, cursor, discord, dunkin, figma, github, gmail, grok, hugging_face, klarna, linkedin, mcdonalds, microsoft, n8n, notion, nvidia, openai, postman, replit, salesforce, seven_eleven, shopify, spotify, stripe, subway, tesla, uber, vercel, vercel_v0, webflow, x_twitter, zoom.

4bi. **🧑‍💼 `portrait_burst` — small circular face thumbs for moments where the speaker names real people.** Codified May 23 2026 after scene-12's "the CEOs predicting a solo unicorn this year — they sell compute" floated abstractly. The speaker is referencing real CEOs (Sam Altman, Dario Amodei). [PortraitBurst.tsx](remotion/src/templates/PortraitBurst.tsx) (kind `portrait_burst`) drops their actual faces in — small circular portraits with a lime hairline ring + optional name label, each landing at its own `appear_sec` in a deterministic scattered slot (top-left, mid-right, etc.). The viewer attaches the claim to a real human. Schema:

```json
{"kind":"portrait_burst","start_sec":5.9,"end_sec":9.0,
 "speech_anchor":"the CEOs predicting a solo",
 "items":[
   {"image_path":"broll/sam_altman.jpg","label":"Sam Altman","appear_sec":6.1},
   {"image_path":"broll/dario_amodei.jpg","label":"Dario Amodei","appear_sec":7.3}]}
```

Source images via `WebFetch` of Wikipedia infobox photos (`upload.wikimedia.org/...250px-... .jpg` — fetch the `500px-` size for quality), drop into `<workdir>/broll/`. `render.sh` stages them through the asset pipeline like any other broll image. Use it for: founder/CEO references, customer logos, public-figure callouts. 1-2 portraits per beat reads best; 3+ starts to crowd the speaker.

4bf. **📋 `bullet_burst` — summed-up bullets accumulating during a rapid-fire enumeration.** Codified May 23 2026 when scene-9's speaker rapid-fires "three sellers per niche, same playbook, same course, same cold email three times a day" — a `word_pop` (one phrase replacing the next) couldn't capture the accumulating list, and a card-backed list is banned (rule 4ad). [BulletBurst.tsx](remotion/src/templates/BulletBurst.tsx) kind `bullet_burst` is the answer: cardless, chunky uppercase bullets in DETERMINISTIC-RANDOM positions (alternating left/center/right alignment, ±2° rotation jitter keyed on item index — scrapbook collage layout, never overlapping). Items accumulate (don't replace), each pops in at its own `appear_sec` with spring scale + tiny rotation. Last item can be `accent: true` for a lime punchline. Schema:

```json
{"kind":"bullet_burst","start_sec":7.8,"end_sec":14.4,
 "speech_anchor":"Three sellers per niche",
 "items":[
   {"text":"3 sellers per niche","appear_sec":7.8},
   {"text":"same playbook","appear_sec":9.1},
   {"text":"same cold email","appear_sec":12.7},
   {"text":"3x a day","appear_sec":13.7,"accent":true}]}
```

Use it for any moment where the speaker is summing up / listing 3-5 short phrases in tight succession (≤8s span). NOT for a slow vertical_timeline-style breakdown (that's the timeline). NOT a replacement for word_pop's single hero phrase. `bullet_burst` is in `SEQUENCE_KINDS` — `end_sec` is preserved, span the full list.

4be. **🎯 `speech_anchor` must match the FIRST spoken words of the overlay's content — NOT a later phrase that happens to be related.** Codified May 23 2026 after scene-9's open-loop word_pop "ALREADY COOKED. {nobody says it}" was anchored to `"saying it out loud yet"` (~5.5s spoken) instead of `"They are already cooked"` (2.7s spoken) — the overlay landed 2 seconds AFTER the line it was echoing, killing the punchline. align_to_speech places the beat at the anchor's word boundaries, so the anchor IS the placement. Rule: pick the speech_anchor by reading the overlay's TEXT and finding the FIRST spoken phrase in `words.json` that contains those words. If the overlay says "X / Y", anchor on the spoken phrase containing X (not Y). Two related-but-distinct moments → two separate beats, each anchored to its own line. Visual must land WITH the speaker, not after.

4bd. **⏱️ `quote_pull` ALWAYS dwells ≥2.0s past the typewriter finish.** Codified May 23 2026 after scene-6's takeaway quote ("The plan was never the bottleneck. The setup was.") felt rushed — typing finished and the beat ended ~1s later, before the viewer could read the full quote. Bumped from 1.5s → 2.0s after scene-10's "The smart builders don't choose. They route." was still fading at second 36 of a 40s clip. Fixed in [scripts/align_to_speech.py](scripts/align_to_speech.py): after deriving `chars_per_second` from the spoken duration, compute `typing_finish = start_sec + 0.30 (glyph entrance) + len(text)/cps` and EXTEND `end_sec` to at least `typing_finish + QUOTE_DWELL_MIN (2.0s)`. The quote stays on screen long enough to actually read — that's the entire point of a hero quote pull. If this pushes into the next beat, that's the right trade-off (the takeaway line is the show; close_gaps / Sequence overlap will handle the boundary). No author action needed — applied universally.

4bw. **📏 `hook_title` font is now char-count-aware — long titles auto-scale down.** Codified May 23 2026 after scene-8's `"ZERO HAVE AN\nAGENT LAYER"` wrapped to 3 visible lines at the old fixed font size. [HookTitle.tsx](remotion/src/templates/HookTitle.tsx) now scales the hero font by a tiered rule on the LONGEST line's char count:

| Longest line | Scale | Example |
|---|---|---|
| ≤10 chars | 1.00× | `"FAKE"`, `"$400M"` (full hero) |
| ≤14 chars | 0.92× | `"ARE THEATER"`, `"ADD A ZERO"` |
| ≤18 chars | 0.82× | `"ZERO HAVE AN"`, `"BOTH TRUE."` |
| ≤22 chars | 0.72× | `"AGENT LAYER"`-class longer titles |
| >22 chars | 0.62× | very long — should usually be split with `\n` |

Plus a width-based clamp using a 0.65 char-width multiplier (was 0.55 — too narrow, predicted bigger fonts than would actually fit at Space Grotesk Black). The smaller of the two scales wins, so titles always fit within the cap (86% of frame width for centered, 58% for left/flank). Rule 4bk's "keep title short" still applies — this just makes the rendering robust when the title runs slightly long. No author action needed; the title sizes itself.

4bk. **🪧 `hook_title.title` MUST be short (≤16 chars / 1-2 lines). Stats and details go in the KICKER.** Codified May 23 2026 after scene-10's hook used `title="67% RATE CLAUDE CLEANER"` (22 chars) which the auto-sized hook font wrapped to 3 dominant lines that swallowed the whole frame. The `title` is the hero word — it should be a SHORT punchline (3-16 chars, 1-2 lines max at 9:16). The `kicker` is the smaller line where supporting stats/context live. Examples:
- ✅ `kicker:"65% CODEX · 67% CLAUDE", title:"BOTH TRUE."` — stats in kicker, conclusion in title
- ✅ `kicker:"I PAY $200/MO FOR CLAUDE CODE", title:"I NEVER HIT\nTHE LIMIT"` — long context kicker, short punchline title
- ❌ `kicker:"65% PREFER CODEX", title:"67% RATE CLAUDE CLEANER"` — title too long, wraps to 3 lines

Authoring rule: keep `title` under 16 characters where possible, hard-cap at 2 lines. Anything longer belongs in the kicker. The auto-sizing in [HookTitle.tsx](remotion/src/templates/HookTitle.tsx) makes long titles ENORMOUS to fill the frame — not what you want; you want a punchline you can take in at a glance.

4bj. **📐 READING-TIME RULE — text-heavy takeovers are sized by character count, not by feel.** Codified May 23 2026 after scene-10's vs_split flipped from "too short" (7.7s) to "too long" (9.7s) — neither was the right answer; the right answer is computed. For any text takeover (`vs_split`, `cinematic_title`, `stat_punch`, `quote_pull`, `headline_card`):

```
ideal_duration = max(3.5s, char_count / 12.0 + 1.5s dwell)
```

- `12 chars/sec` is the comfortable on-screen reading speed for big typography (slower than body text — viewers SCAN, not read linearly).
- `+1.5s dwell` after reading completes so the line settles before the cut.
- `3.5s floor` — even very short text needs minimum face time.
- For `vs_split` (parallel columns): `char_count = max(top_total, bottom_total)` — viewers read both columns in parallel, not sequentially.

[lint_plan.py](scripts/lint_plan.py) WARNS when authored duration is < 70% of ideal (viewer can't finish reading) or > 1.8× ideal (text lingers and feels dead). The author can override — these are warnings, not errors — because storytelling sometimes needs longer (a landing-quote pause, a beat-with-the-speaker moment). Default to the computed value unless you have a specific reason. Examples: vs_split with 54 chars per side → ideal 6.0s, range 4.2-10.8s; quote_pull "It's never the model. It's the math." (38 chars) → ideal 4.7s, range 3.3-8.5s; word_pop "Claude hedges. picks wrong first" (30 chars) → ideal 4.0s, range 2.8-7.2s. Extended to `word_pop` May 23 2026 after scene-17's "Claude hedges" landed at 2.9s and felt rushed — same reading-math applies to any text-bearing kind.

4bg. **🔍 NO settle-zoom on `vs_split`. Static comparison panels read cleaner.** Codified May 23 2026 after scene-10's CODEX/CLAUDE comparison had a slow 1.0→1.025 zoom on each half that read as the text creeping out of frame — distracting, undermined the side-by-side comparison. `useSettleZoom` was meant to "keep the frame alive" but on a comparison component it's the opposite: the viewer is trying to read both sides; any motion pulls focus. Fixed in [VsSplit.tsx](remotion/src/templates/VsSplit.tsx): `topZoom = bottomZoom = 1.0` always. Winners can still be emphasized via the lime accent — no scale needed. **And `vs_split` now allowed up to ~12s in lint** (added to `MULTI_ITEM_KINDS`) because reading 3 items on EACH side genuinely takes 8-10s; the old 8s hard ceiling clamped it too aggressively.

4ca. **🚫 `vs_split` is BANNED — never author it again, any mode (shorts or 16:9).** Codified 2026-06-01 ("remove this component please, I don't ever want to use this anymore"). The top/bottom split-panel comparison reads as a generic slide-template — it kills the premium feel even when the content is good. Do NOT plan a `vs_split` beat under any circumstance. For a contrast/pivot moment, either: (a) let the SPEAKER carry it (face time beats a chart for a personal point), (b) use a single cardless `word_pop` framing the shift, or (c) show the two things as real artifacts (two `image_card`s / a `video` overlay). The kind remains in the union for backward-compat with old plans, but authoring a NEW one is a hard no. Supersedes 4bg (which tuned a component we no longer use).

4cc. **🪝 16:9 intros/longform MUST open with a `hook_title` too — and it now renders on landscape.** Codified 2026-06-01 ("the hook / start of the video should be super catchy"). Rule 4ae's "every short opens with a hook_title" extends to landscape intros: a bold text claim at frame 0 (e.g. kicker `I DIDN'T EDIT THIS VIDEO` + title `AI DID.`) is the retention hook that keeps a viewer past the first second. **Bug fixed same day:** [HookTitle.tsx](remotion/src/templates/HookTitle.tsx) positioned the centered lockup with `paddingTop: <pct>%` — but CSS percentage padding resolves against the container's WIDTH, so on a landscape frame (w>h) `60%` = 60% of the wide axis and shot the text clean off the bottom edge (hook rendered invisibly). Fix: on landscape, position by height-relative pixels (`vertical * height`); portrait keeps the %-of-width path so shorts are unchanged. `vertical ~0.60` puts the landscape hook in the lower third, clear of a centered talking head's face.

4cb. **🎞️ `video` example clips DEFAULT to OVERLAY cards, NOT full-screen takeovers.** Codified 2026-06-01 ("videos should be overlay, not full screen — should look way better and cleaner"). When showing a clip as an EXAMPLE/exhibit (e.g. our own shorts inside an intro), set `"overlay": true` on the `video` beat. [VideoOverlay](remotion/src/EditedVideo.tsx) then renders it as a floating phone-card (default right side, ~9:16, muted via `volume={0}`, dimmed via `brightness(0.72)` + raisin gradient, lime hairline + soft shadow) with the SPEAKER fully visible — never a frame-filling takeover. Knobs: `anchor` (`top-right`/`*-left` → which side), `size` (card height as fraction of frame, default 0.30 → tall portrait card). Build portrait source assets (9:16, muted, trimmed ~5s) so the card fills cleanly with `object-fit: cover`. A full-screen `video` takeover (no `overlay`) is now reserved for when the clip genuinely IS the whole moment (rare) — for "here's an example of X" always overlay. Overlay video beats are exempt from the coverage-underlay (speaker stays lit) and from the no-two-takeovers-back-to-back rule (the card just swaps content). **When an overlay card is up, the speaker is dimmed ~30% (a full-frame raisin scrim behind the card) so the spotlight shifts to the short — a bit darker, not hidden** (locked 2026-06-01, "dim the original video so the spotlight is more on the short, not too much"). And overlay cards may start at frame 0 — lead the cold-open with the example short, it's the catch.

4cd. **🎥 Follow-cam keeps HEADROOM by default — `FOLLOW_VBIAS=7` in render.sh.** Codified 2026-06-01 ("the camera is too low, the top of my head isn't visible — always position so it's not too low or too high"). The follow term chases the body centroid (which sits low, at the torso) and pans the frame UP, cropping the top of the head. `build_followcam.py --head-room` (env `FOLLOW_VBIAS`) shifts the framing back DOWN to reveal the top of the head; the default was 0 (no correction) and is now **7** so every follow-cam render frames the head with proper headroom. Override per-render with `FOLLOW_VBIAS=` if a source is framed unusually high/low.

4bc. **🧊 The authored `broll_plan.json` is a FROZEN source-of-truth. Every render restores from `broll_plan.source.json` before mutating.** Codified May 22 2026 after scene-6's 18s `vertical_timeline` collapsed to 1.5s — not because the alignment logic was wrong (rule 4ba had already been fixed), but because `align_to_speech.py`, `sync_list_items.py`, and `close_gaps.py` all REWRITE `broll_plan.json` IN PLACE. The mutated 1.5s `end_sec` from the first render became the "authored intent" read by the second render. The preservation rule 4ba was right but came too late — the source was already corrupted on disk. Fix in [scripts/render.sh](scripts/render.sh):

1. On first render (or whenever `broll_plan.json` content differs from `broll_plan.source.json`), freeze a copy → `broll_plan.source.json`.
2. **At the start of every render, restore `broll_plan.json` from the frozen source** — so mutations from the previous render can never leak.
3. After a successful render, restore once more so the next render's "did the author edit this?" diff check sees the pristine source instead of mutation residue.

The freeze is invisible to authoring — you edit `broll_plan.json` as before. The content-diff check re-freezes whenever you change it. If you need to force a re-freeze, delete `broll_plan.source.json`. **If you write a new script that mutates `broll_plan.json`, you do NOT need to coordinate** — the next render's restore wipes it out. But never write tooling that EXPECTS the mutated values to persist; the source is the only durable record.

4bh. **🗣️ On-screen TEXT in a hook_title / word_pop must use the SPEAKER's actual wording — not the canonical script's paraphrase.** Codified May 23 2026 after scene-11's hook displayed `"ARE THEATER"` (from the script S24's "Most 12-agent AI team videos are theater") while the speaker actually said `"are fake"`. The hook word and the caption word then sit on screen ~30ms apart as two different words for the same idea — visually redundant and confusing ("which is the real word?"). The canonical script is the source of truth for BRAND NAMES (rule 4ay) and the core MESSAGE, but for the literal words on the hook/word_pop overlay, match the audio. So: when authoring a hook or word_pop, grep `words.json` for the speaker's actual phrasing of the moment and use THAT in the title/text. If the script says "theater" and the speaker said "fake", the hook is "ARE FAKE". This complements rule 4bb (caption pad prevents word echoes) — together they keep on-screen text in sync with what's being heard.

4bb. **🚫 NEVER show the same word in two layers back-to-back — captions get a 0.8s SEMANTIC lead/tail pad around every beat.** Codified May 22 2026 after scene-8 played the caption `"flow, real"` at ~21.9s immediately followed by the word_pop `"real pain / zero solution"` at 22.0s — the viewer read "real" twice, once tiny and white, once big and centered. That's exactly the kind of layered-text noise rule 4am (captions ↔ beats mutually exclusive) was meant to prevent, but the original `captionBlackout` in [EditedVideo.tsx](remotion/src/EditedVideo.tsx) only covered each beat's literal `[start_sec, end_sec]` window — so a caption chunk ending ~100ms before the beat was still allowed through, and it almost always echoed a word the beat was about to highlight (because the speaker says that word, the chunk catches it, then the word_pop appears right after with the same word). Fixed in two stages: (1) `captionBlackout` extends 0.8s past each beat on each side. (2) **Within the pad zones, captions are dropped ONLY if their meaningful words overlap with the beat's text** — stopwords filtered (the, a, you, it…). Inside the literal beat range, captions are always dropped. The semantic pad keeps echoes suppressed ("they sell compute" caption dies next to a wp about "they sell compute") while letting unrelated captions through ("The reason you" survives next to a wp about "the conversation" — scene-18, May 23 2026 — even though it falls inside the tail-pad time window, the words don't overlap so it stays). The beat-text extractor walks `title / kicker / subtitle / quote_text / caption / value / pre_label / headline / dek / top_label / bottom_label / items[].text / items[].label / steps[].heading / steps[].description / bars[].label / bars[].display` so any text-bearing kind is covered. If you add a new text-bearing kind, extend the extractor in `EditedVideo.tsx`'s `beatTextOf()`.

4au. **`headline_card` — show a real reported fact, not a metaphor.** When a beat's point is "this is a real, happening thing" (a market boom, a trend, an event), do NOT reach for a metaphor image (a literal ocean wave for "the ozempic wave" was rejected May 22 2026 as "stupid"). Use [HeadlineCard.tsx](remotion/src/templates/HeadlineCard.tsx) — kind `headline_card` — a news-clipping styled card in the bottom-half glass frame (same family as `image_card`): a lime masthead row (`kicker`), a big left-aligned `headline` (supports `\n` + one `{lime}` span), a thin rule, an optional muted `dek`. Populate it with a REAL headline + REAL numbers from `WebSearch` research — a real stat reads as evidence. Schema: `{ "kind": "headline_card", "kicker": "THE GLP-1 BOOM", "headline": "Weight-loss drugs became\na {$62B} market", "dek": "…" }`. Metaphor AI images are still fine for genuinely abstract concepts with no reportable referent — but if there's a real headline, use it.

4ak. **Opening rhythm: beat 1 = text, beat 2 = a full-screen component.** Codified May 21 2026 ("start the video with showing some text, then the thing after that should be a full-screen component"). The cold open is: `hook_title` (text, from frame 0) → then the SECOND beat is a full-screen component (`vertical_timeline`, `cinematic_title`, `stat_punch`, `vs_split`, etc.) — a strong full-frame moment right after the hook. Full-screen TEXT components (cinematic_title, quote_pull, stat_punch) are fine full-frame; only IMAGES move to `image_card` (rule 4aj).

4ai. **`subscribe` — animated subscribe-CTA button.** The [SubscribeButton](remotion/src/templates/SubscribeButton.tsx) kind drops an on-brand subscribe animation: a lime pill pops in, a cursor slides in and clicks, the button morphs to a raisin "SUBSCRIBED" state with a wiggling bell, plus a lime spark-ring on click. Partial overlay (speaker stays visible), lower third by default (`vertical` ~0.80). Self-contained — no required fields. Place it on the CTA / closing line of the video (or as a mid-roll pattern-interrupt). Schema: `{ "kind": "subscribe", "start_sec": 39.4, "end_sec": 42.2, "vertical": 0.8 }`. Roughly 2.5–3s reads best — long enough for pop-in → click → morph. Every BuildLoop short should include one near the CTA.

4ag. **Follow-cam is the DEFAULT camera. `CAMERA=zoom` opts back to punch-ins.** Locked May 21 2026 ("follow zoom all the time — the normal zoom we don't need anymore"). Every render applies the motion-tracked pan+zoom that drifts with the speaker; the discrete zoom punch-ins are retired as the default. `CAMERA=zoom` is a legacy fallback.

**FAST PATH (May 22 2026 — batch-speed fix).** Follow-cam needs only the speaker's rough per-frame *position*, which is heavily smoothed anyway — so [build_followcam.py](scripts/build_followcam.py) `--video` mode samples ~1 in 6 frames at 384px, gets the bbox, and interpolates. ~15-20s vs the ~6min full-matte pass. The full per-frame matte (`segment_speaker.py`) now runs ONLY when a `behind_subject` beat actually needs it — never just for follow-cam. This took a 5-clip batch from ~50min to ~6min; it's the difference that makes 20+ clip batches viable. The render lock is also PID-aware/self-healing — a SIGKILL'd batch render no longer strands the lock for every future render. Built May 21 2026 ("a constantly changing camera angle based on the person's movement"). Instead of discrete zoom punches, the speaker layer pans + zooms every frame to drift with the speaker — the dynamic, slightly-handheld social look. Pipeline:

1. The speaker matte (from `segment_speaker.py`) already encodes the per-frame person silhouette — [scripts/build_followcam.py](scripts/build_followcam.py) reads it, takes the per-frame centroid, heavily smooths it (double moving-average), and emits `followcam_plan.json` — one `{scale, tx, ty}` per frame.
2. `render.sh` with `CAMERA=follow` forces segmentation, builds the track, passes it. Knobs: `FOLLOW_SCALE` (base zoom / crop room, default 1.1), `FOLLOW_STRENGTH` (0=locked wide, 1=hard centre-lock, default 0.7).
3. `EditedVideo.tsx` applies `translate(tx%,ty%) scale(S)` per frame to the speaker AND cutout layers (kept registered). When `followCam` is present it REPLACES the zoom timeline.

The follow is intentionally PARTIAL (strength 0.7) and heavily smoothed — a hard centre-lock reads robotic; a soft lagging drift reads alive. Pan is clamped to the safe crop window so the scaled layer never exposes a black edge. Default render stays on zoom punch-ins; `CAMERA=follow` is opt-in per render.

4af. **Text-behind-subject — OFF BY DEFAULT. Text overlays render ON TOP. Do not set `behind_subject` on shorts.** Built then retired-by-default May 21 2026. The capability works mechanically (alpha-matte cutout, text composited behind the speaker) but on a tight talking-head short — where the speaker fills most of the frame — it reads as chopped, broken text: words get bitten in half by the head ("PEOP[LE]", "[$]400"). After several iterations the verdict was: "the layering is just not really working, keep that out." So:

- **Default: all `word_pop` / `hook_title` text renders ON TOP**, fully visible, placed in zones clear of the face (lower-third, top strip). This is the only supported path for shorts.
- `behind_subject` and the `hook_title` `flank` layout remain in the codebase as dormant capabilities — they are viable ONLY for wide shots with generous clear space around the subject (not the typical BuildLoop desk shot). Do NOT reach for them on a standard talking-head short.
- The segmentation pipeline below still runs for **follow-cam** (rule 4ag) — that uses the matte for motion tracking, not for compositing text. Follow-cam is unaffected by this rule.

Mechanics, kept for reference / wide-shot use:

1. [scripts/segment_speaker.py](scripts/segment_speaker.py) runs `rembg` (`u2net_human_seg` model) over the source, producing `speaker_cutout.webm` — the speaker with a transparent background (alpha matte). Slow (~0.3s/frame at 720p) but **cached** in the workdir keyed on the source; runs ONCE.
2. [render.sh](scripts/render.sh) auto-detects any `behind_subject` beat, runs segmentation if the cutout is stale/missing, and stages it.
3. [EditedVideo.tsx](remotion/src/EditedVideo.tsx) paints the cutout — wrapped in the IDENTICAL zoom transform as the speaker base layer — ON TOP of the text, but only during `behind_subject` beat ranges. Net z-order: background → text → speaker. The speaker is never covered; the text peeks out around their head and shoulders.

**Placement is everything — `behind_subject` text must live in the speaker's CLEAR ZONES.** Hard-won May 21 2026 ("it's not visible, looks awful"). A behind_subject overlay is invisible wherever the speaker's silhouette covers it — so the readable content MUST sit in genuinely clear pixels, with only a non-essential edge tucking behind. Before placing a behind_subject hook, inspect the matte: load a cutout frame and measure speaker coverage per horizontal band (`np.where(alpha>40)` per 10% band). For a typical centered 9:16 talking head:

- **y 0–10%** — fully clear (top strip). Put the kicker here.
- **y 10–30%** — speaker is just the HEAD (~x 0.35–0.72). The left column (x<0.35) and right column (x>0.72) are clear — put the hero line here, left- or right-aligned into the clear column.
- **y 40–90%** — speaker fills the FULL width. NEVER place readable text here as behind_subject — it vanishes completely.

So the working hook layout for a tight shot: kicker in the top strip, hero left-aligned in the head-height band's clear-left column. ~95% of the text reads in the clear; only the last glyph kisses behind the head. That's "visible for the viewer" + a real depth cue. Don't place a behind_subject hook by eyeball — derive the clear zone from the matte.

**Behind-subject ONLY works for WIDE text.** A behind_subject overlay is only visible where it extends PAST the speaker's silhouette. Tested May 21 2026: the hook number `$400,000,000` is wide enough to peek out past both shoulders → looks great behind the subject. But short word_pop lines (`ChatGPT`, `Grok`, `{nobody sees this}`) fit entirely INSIDE the torso/head silhouette → they vanish completely. So:

- **`hook_title`** → `behind_subject: true`. The hero line is wide; place it centrally (`vertical` ~0.40–0.50) and it threads behind the head, peeking out each side. Premium.
- **`word_pop`** → `behind_subject` usually OFF. Word_pops are narrow; they render in FRONT, in the safe zones (`vertical` 0.72 lower-third — below the face — or 0.18 top). Only set `behind_subject: true` on a word_pop if its line is genuinely full-width (rare).

Rule of thumb: behind_subject is for text WIDER than the speaker. If the text fits inside their body outline, keep it in front.

**Caveats:** the matte is computed at the render resolution (capped at 1080×1920) — preview (720p) is exact, a 4K final upscales the matte 2× so edges soften slightly. Segmentation only triggers when a `behind_subject` beat exists, so plans that don't use it pay zero cost.

4ae. **Every short MUST open with a `hook_title` beat visible inside the first ~0.5s.** Codified May 21 2026: "the first second we should have some text already, even better looking than the other text — this is the hook." The cold-open scroll-decision window is roughly half a second — a bare talking head loses viewers who'd have stayed for a composed promise. The `hook_title` kind ([HookTitle.tsx](remotion/src/templates/HookTitle.tsx)) is the dedicated premium treatment for this:

- **It is NOT `word_pop`.** word_pop is bare bold type that pops mid-video. hook_title is a composed lockup: a small lime letter-spaced **kicker**, a thin lime **accent rule** that draws outward, and a huge **hero line**. Hierarchical, cinematic entrance (kicker settles → rule draws → hero un-blurs in → slow settle-drift).
- **Cardless** — same aesthetic rule as word_pop (rule 4ad). No fill, no box; legibility via a heavy multi-layer drop shadow.
- **Schema:** `{ "kind": "hook_title", "start_sec": 0.0, "end_sec": ~3.5–4.0, "kicker": "...", "title": "...", "vertical": 0.44 }`. The hero `title` supports the `{...}` script-font syntax and `\n`. Authoring rules:
  - `start_sec` MUST be `0.0` (or ≤0.5). NO `speech_anchor` — alignment would push it off frame 0.
  - The `kicker` is the setup / framing; the `title` is the payoff (the number, the claim, the stakes). e.g. kicker `"TWO PEOPLE · WITH AI"` + title `"$400,000,000"`.
  - It replaces a separate opening `stat_punch` — don't run both; the hook_title carries the hero number itself.
- **Lint enforces it:** [scripts/lint_plan.py](scripts/lint_plan.py) warns if a plan has no `hook_title` or if the hook_title starts after 0.6s.

4ad. **Shorts must NEVER use a partial-overlay template that has a colored card / pill / bar / block behind text.** Rejected May 21 2026: `lower_third` with its raisin card + lime block highlight read as "SUPER ugly, stickers from someone else's video." The rejection is aesthetic and final — for shorts (9:16 with the speaker as the show), the only acceptable text-bearing partial overlay is **`word_pop`**, which is cardless. Banned partial-overlay kinds on shorts:

| Kind | Why banned |
|---|---|
| `lower_third` | Raisin card + lime block highlight = "TV chyron sticker" |
| `chapter_bar` | Bottom raisin bar + lime number block — same sticker feel |
| `keyword_chips` | Pill backgrounds — feels like a stock template |
| `list` / `bulleted_list` | Raisin-bordered list card — rejected earlier (rule 4y) |
| `side_panel` | Right/left raisin panel with lime border — eats 40% of frame in chrome |
| `corner_stat` | Small raisin card in corner — sticker feel |
| `notification_toast` | Toast card — reads as branded UI screenshot, not edit choice |
| `callout` (when used as overlay only) | Lime block highlight — same as lower_third |

Variety for shorts MUST come from `word_pop` knobs, not template swaps:

- **Vertical placement** — `vertical: 0.18` (top), `0.40` (mid), `0.50` (center), `0.72` (lower-third, default). Vary across beats so the eye gets visual rhythm without chrome.
- **Font mix** — `{...}` braces switch to italic-script-lime. Use pure-block, mixed, or pure-script depending on emotional weight.
- **Item count** — single phrase vs multi-item cycling (e.g. the AI stack as four sequential WordPop items).
- **Size** — `size: 0.085` for long phrases, `0.115` default, `0.14` for two-word punchlines.
- **Accent flag** — `accent: true` paints the block portion lime instead of white.

Full TAKEOVERS that fully replace the frame (`stat_punch`, `quote_pull`, `ai_image_on_grid`, `static`, `video`, `vs_split`, `title_card`) are fine — they ARE the frame, not chrome on the speaker. The ban applies only to partial overlays on shorts. Longform / landscape work where the speaker isn't the whole show can still use the boxed templates.

This supersedes rule 4ab's "more variety, use the partial-overlay templates" — the templates exist but for shorts they're aesthetic non-starters.

4ac. **`appear_sec` is ALWAYS absolute source-video seconds — never relative-to-beat.** All multi-item templates that support progressive item reveal — `list`, `word_pop`, `keyword_chips`, `progress_steps`, `side_panel` — read `appear_sec` in absolute source-video time and convert to within-Sequence offset by subtracting `beat_start_sec`. This is the SAME convention you read out of `words.json` directly, which means you can copy a word's timestamp straight into an `appear_sec` field without doing arithmetic. Codified May 21 2026 after `SidePanel` was the lone holdout treating `appear_sec` as relative — every item with appear_sec > beat_duration silently never appeared. If you add a new multi-item template, mirror the `WordPop` / `ListOverlay` pattern: take a `beat_start_sec` prop, do `frame_offset = (item.appear_sec - beat_start_sec) * fps` inside the component.

4ab. **Density target for shorts: 7–9 BEATS for 30–45s, with a deliberate mix of hero types AND cardless word_pops.** Codified May 21 2026 after iterating through both extremes — 10 beats / 8 heroes was "WAY too many overlays," 6 beats / 4 heroes was "no actual overlays again." The right balance gives the viewer rhythm without overwhelming the speaker.

| Duration | Total beats | HERO mix (variety required) | Cardless `word_pop` overlays |
|---|---|---|---|
| 15–25s | 4–6 | 2–3 heroes, 2+ distinct kinds | 2–3 |
| 25–45s | 7–9 | 4–5 heroes, 3+ distinct kinds | 2–3 |
| 45–60s | 9–12 | 5–7 heroes, 4+ distinct kinds | 3–4 |

**The "3+ distinct hero kinds" rule** prevents the failure mode where 4 of the 5 heroes are all `ai_image_on_grid`. Cycle through: `stat_punch`, `cinematic_title`, `quote_pull`, `vs_split`, `vertical_timeline`, `metric_reveal`, `ai_image_on_grid` — pick the ones that actually fit the script, but you must use **at least 3 different hero kinds** in any 7+ beat plan. Variety in heroes makes the cut feel produced.

**Beat-placement test:** for each candidate beat, ask "is the speaker carrying this moment, or is the visual?" The visual earns its place when:
- The line is a NAMED THING (number, product, person, tool) — visual lands what the words can't.
- The line is a PIVOT / CONTRAST — vs_split, cinematic_title, or cardless word_pop frames the shift.
- The line is the TAKEAWAY or CTA — quote_pull / word_pop lock it in.

Don't add a beat just for "more variety" or to fill a speaker stretch. Variety is the tiebreaker when you've already decided a beat belongs there.

When choosing whether to add a beat, ask: **"is the speaker carrying this moment or is the visual?"** If the speaker's words are doing the work, DON'T add a beat — let the face read. Beats earn their place at:
- Hero numbers ("$400M") → `stat_punch`
- Enumerations of 3+ things → `word_pop` multi-item or `vertical_timeline`
- Pivots / contrasts (where the visual IS the argument) → `vs_split` or a single cardless `word_pop`
- Concept images for named products / metaphors → `ai_image_on_grid`
- The one-line takeaway → `quote_pull`
- The CTA close → cardless `word_pop`

When variety is needed within that ceiling, rotate kinds — but **the ceiling comes first**. A 10-beat plan with 8 distinct kinds is still wrong; a 6-beat plan with 4 distinct kinds is correct.

Banned approaches:
- Carpet-bombing every line with an overlay (every short ends up being 10+ beats, which all blur together)
- Defaulting to one tool (e.g. 5 word_pops in a row, or 8 takeovers in a row)
- Mid-stretch chrome with no semantic reason (decoration ≠ punctuation)

Old "variety mandate" intent (rotating through kinds) is preserved — but FIRST decide how many beats earn placement, THEN pick the kind. Variety is the tiebreaker, not the goal.

**Full-takeover catalog (use sparingly at hero moments):**

- **Full takeovers (default — aim for 70–80% of beats):**
  - `stat_punch` — the hero number on a grid
  - `vertical_timeline` — numbered steps with descriptions (great for enumerations: "they used X, Y, Z")
  - `horizontal_timeline` — same, horizontal (better for landscape)
  - `cinematic_title` — chapter + bold title + subtitle (replaces the rejected `lower_third` for category-defining moments)
  - `title_card` — number + title (lighter than cinematic_title)
  - `vs_split` — top/bottom contrast labels + items (perfect for "everyone sees / nobody sees" pivots)
  - `metric_reveal` — animated counter rolling to a target number ($, %, k)
  - `stat_grid` — 2×2 / 2×3 grid of mini-stats
  - `quote_pull` — typewriter quote (the takeaway line)
  - `ai_image_on_grid` / `static` / `video` — the concept image
  - `flow_diagram`, `bar_chart`, `chat_message`, `annotated_screenshot` — niche full takeovers
- **Partial cardless overlays (1–3 beats max, only `word_pop`):**
  - `word_pop` — cardless typography over speaker. Use for: counter-claim reactions (viewer needs to see the human respond) + the closing CTA. Don't carpet-bomb with these.
- **Banned for shorts (rule 4ad):** every card-backed partial overlay — `lower_third`, `chapter_bar`, `keyword_chips`, `list`, `side_panel`, `corner_stat`, `notification_toast`. These look like stickers from someone else's video.

**Authoring rule for shorts:** when sketching a plan, label each beat HERO (takeover) or CONNECTIVE (`word_pop`). The default ratio is **6–8 HEROES + 1–3 CONNECTIVES**. If you have more than 3 word_pops, you've defaulted to one tool — rotate through `vertical_timeline`, `vs_split`, `cinematic_title`, `metric_reveal`, `stat_grid`, etc.

The full kind catalog with examples lives in [knowledge/template_library.md](knowledge/template_library.md); the partial-overlay set (leaves the speaker visible) is the variety lever:

- **Partial overlays — prefer these for the middle stretches:**
  - `side_panel` — right/left vertical panel with progressively-revealing bullets. Replaces `list` for enumerations on shorts (speaker stays visible alongside).
  - `lower_third` — TV-chyron banner with a lime-block-highlighted phrase + optional kicker. Best for "this is the category" / labeling moments.
  - `chapter_bar` — bottom-third bar with chapter number + title. Use for structural breaks ("Here's the twist…") to give the short doc-like sections.
  - `notification_toast` — corner notification with app_name + title + body. Best for news/trend framing while the speaker keeps talking.
  - `corner_stat` — small corner stat box (value + caption + optional delta). Use for ambient context numbers that don't deserve a full takeover.
  - `icon` — small floating card with image. Brief brand/logo flashes.
  - `word_pop` — cardless typography (the rule 4y workhorse). Mixed-font emphasis lines.
- **Full takeovers — reserve for hero moments, not transitions:**
  - `stat_punch` — the hero number
  - `quote_pull` — the takeaway line
  - `callout` — claim with a single highlighted phrase
  - `ai_image_on_grid` / `static` / `video` — the concept image
  - `vs_split` — the two-side contrast
  - `cinematic_title`, `title_card` — section openers in longform

Authoring rule: when sketching a plan, label each beat as **HERO** (takeover) or **CONNECTIVE** (partial overlay). The default ratio for a 30–45s short is **2–4 heroes + 4–6 connectives**. If your plan has more heroes than connectives, you're packing in too many "big moments" and the viewer can't breathe. If you have all word_pops, you've defaulted to one tool — rotate through `side_panel`, `lower_third`, `chapter_bar`, `notification_toast` to give the cut texture.

4aa. **Visual tail dwell is 0.8s, gap-bridging caps at 0.6s.** Updated May 21 2026 after the $400M stat_punch dwelled for 4.4s ("stuff is staying too long"). The pipeline was double-extending every beat: align_to_speech.py's `TAIL_SEC` was 1.5s (visual lingers 1.5s past the last spoken word), AND close_gaps.py's `MAX_GAP` was 1.5s (any next-beat-gap ≤1.5s gets bridged). Stacking those two meant a 1.5s spoken phrase produced a 4.4s on-screen visual. Locked values now: `TAIL_SEC=0.80` (enough to register the beat as punctuation, not enough to bore), `MAX_GAP=0.60` (matches `COVERAGE_MERGE_GAP_SEC` — anything larger is intentional speaker breathing and must NOT be bridged). If a future request asks for "longer dwells" or "more pause before the next visual", first verify the symptom — usually the fix is a better speech_anchor (covering more of the relevant phrase) rather than turning the tail back up.

4u. **Music = ONE signature track, baked in, mixed to be FELT.** Rewritten May 22 2026 (superseding the old "near-invisible calm-classical" lock, which the channel owner rejected outright — "the music is just boring"). The decision, for this channel's voice-driven talking-head shorts:

- **Signature track, not rotation.** Every short uses the SAME track — `vibehorn-background-music-496933.mp3` (owner-picked May 22 2026; `bg-feelgood-builder` before it was rejected as "cartoonish/funky") — so the channel has a sonic identity. A rotating/random bed is not branding; one consistent track is. Locked in [render.sh](scripts/render.sh) (`MUSIC_TRACK=` overrides only for one-offs). **Track selection is a taste call — the owner picks it; never swap the signature track blind.**
- **Royalty-free, never chart songs.** Do NOT bake copyrighted/popular music into the render. Not for monetization (the owner doesn't care) — for REACH: labels configure Content ID to geo-block, and a Short blocked in the US/EU loses audience + algorithmic push. A royalty-free signature track is banned in zero countries. Trending audio belongs in YouTube's in-app Shorts picker (post-upload), not baked into the file — and for a voice-driven explainer it isn't even worth it (the song is a bed, not the star).
- **Felt, not invisible.** Mixed at **-26 LUFS, weight 0.42** in [score.sh](scripts/score.sh) — a real soundtrack with energy in the gaps, ducked under speech, lifted at the climax by the `MUSIC_SWELL_AT` arc (rule 4ar). The old -38 LUFS / 0.22 made it inaudible; that was the "boring".
- **Still not corny.** The 2024 rejection ("too loud, electric, annoying") was about a *bad track played loud*, not about loudness itself. A good track at -26 is energy; a corny track at any level is corny. The test stays: no cheesy "inspirational tech build-up". But "more energy" is now a valid request — answered by track quality + the swell arc, not by muting the bed.

4q. **Speaker must NEVER be visible during a run of takeover beats — coverage underlay is non-negotiable.** Closing the gap in the plan isn't enough on its own: each takeover component (`static`, `video`, `ai_image_on_grid`, all template kinds) has its own entrance/exit fade or slide-in, and during those ~6–10 transition frames neither beat is fully opaque, so the speaker flashes through. The fix is a single solid raisin-black underlay rendered in [remotion/src/EditedVideo.tsx](remotion/src/EditedVideo.tsx) for every "coverage run" (consecutive takeover beats with gap ≤ 0.6s), spanning `run.start − 0.10s` to `run.end + 0.10s`. The underlay sits BETWEEN the speaker and the b-roll components, so per-template animations no longer expose the speaker. Templates that intentionally overlay the speaker (`icon`, `list`, `chapter_bar`) are excluded from the underlay set. **Two invariants must be preserved in any new takeover component**: (1) the component's own backdrop never fades or transforms — only the foreground content animates; (2) the component's `kind` is added to `TAKEOVER_KINDS` in EditedVideo.tsx. Without both, head-to-head visuals will flicker the speaker through again.

4n. **AI-generated subjects must be universal symbols, not specialty items.** A "key card" is ambiguous (RFID, hotel key, gym pass — viewer doesn't know which). A classic teeth-and-shaft KEY is universal — exists in every emoji set, every iconography library. Prefer subjects that pass the emoji test: 🔑 🔒 🔍 ⏳ 📊 📁 ⚙️ 🛡️ 🚧. Avoid generic "device," "panel," "card" — too abstract for the model to render distinctively.

4h. **Visual timing must align with the speaker's words, not a later punchline.** A common failure: the hook visual at 1.5–4s metaphorizes a phrase the speaker actually says at 8s — by the time the line lands, the visual is gone. Before locking a beat, grep `words.json` for the keyword(s) the visual is illustrating; if the first occurrence is past the beat's `end_sec`, the visual is mistimed. Either move the beat to overlap the line, or pick a different subject that matches what the speaker is saying inside the beat's actual window.

4i. **Beats must end before the speaker pivots topics.** If `end_sec` lands inside a new sentence about a different concept, the previous visual lingers as semantic noise. Prefer to end a beat 0.2–0.4s before a sentence boundary that opens new content. The lint flags any beat whose `end_sec` falls more than 0.5s after the matching keyword's last occurrence — extend or shorten as needed.

4j. **Recognizable concrete subjects beat clever metaphors.** A muted viewer should know what the image is in <0.5s. Good subjects pass the four-word test: "a calendar," "a server rack," "a lock," "a key," "a chart going up," "a stopwatch," "a mailbox." Bad subjects fail it: "a lone app icon dwarfed by an interconnected systems landscape," "a fractured machine," "a constellation of cloud-task nodes." Elaborate metaphors read as decoration; concrete objects read as meaning. **Per-beat lint:** if the `prompt` field has more than one comma-separated subject clause OR more than 12 words OR contains words like "vast / dwarfed / abstract / metaphor / suggesting," rethink it.

4k. **One generation style across the entire video — locked, not improvised.** All `gpt_image_2` images share the SAME visual style: same composition convention, same texture, same level of abstraction. Mixing flat illustration with 3D matte with photographic lookalikes makes the cuts feel like a stock-asset stew. Pick one style at the start of a project, save the exact prompt template under `<workdir>/style.txt`, and reuse it verbatim for every generated beat. The locked style for this skill is documented in [knowledge/image_style.md](knowledge/image_style.md).

4f. **Brand colors — locked source of truth.** Every backdrop, card, accent, and prompt prefix must use these exact hexes. Mismatches (e.g. the old purple-tinted `#1A0F1A`) read as off-brand and "stock template" instead of premium.

| Role      | Name          | Hex       | RGB              | Usage                               |
|-----------|---------------|-----------|------------------|-------------------------------------|
| Primary   | Raisin Black  | `#0F121A` | 15, 18, 26       | Default backdrop, list card fill, letterbox bars |
| Primary 2 | Raisin Deep   | `#1E2434` | 30, 36, 52       | Secondary surfaces, card variants   |
| Primary 3 | Raisin Steel  | `#343E5B` | 52, 62, 91       | Tertiary surfaces, dividers         |
| Secondary | Silver        | `#B5BFC2` | 181, 191, 194    | Body text on dark, mid-tone fills   |
| Secondary | Silver Light  | `#D2D8DA` | 210, 216, 218    | Subtle surfaces                     |
| Secondary | Silver Pale   | `#E9ECED` | 233, 236, 237    | Highlight/wash                      |
| Accent    | Neo Lime      | `#CFFF05` | 207, 255, 5      | Single accent — list numbers, current-word, flash, generated-image highlights |

The accent is monogamous: one neo-lime element per frame max. Two lime accents in the same frame fight for attention.

4g. **Minimum dwell time on the last list item: 1.5s.** A list whose final row appears 0.6s before the card vanishes feels like a flash card, not a teaching moment. The auto-sync script (`sync_list_items.py`) extends `end_sec` automatically up to +2s if the last item would have less than 1.5s of visibility. When hand-pinning, leave at least 1.5s between the last item's `appear_sec` and the list's `end_sec`. Lint will warn if you don't.

4e. **Each list item appears EXACTLY when the speaker says it — never sooner.** Items spoiler the punchline if they all show at once. Use the object form with `appear_sec` for every item, with timestamps grounded in the words.json transcript:

```json
{
  "kind": "list",
  "start_sec": 25.1,
  "end_sec": 32.4,
  "title": "Process bug, not a model bug",
  "items": [
    { "text": "A human gave the AI live prod credentials",  "appear_sec": 25.4 },
    { "text": "The AI ran exactly what it was told to",     "appear_sec": 28.7 },
    { "text": "Fix the workflow, not the model",            "appear_sec": 30.9 }
  ]
}
```

The plain-string form (`items: ["a", "b", "c"]`) auto-staggers across the first 60% of the list duration and is only acceptable when the speaker says all the items in tight succession (≤1.5s apart total). When in doubt, use the object form. Find each item's `appear_sec` by grepping `words.json` for the first content word of the item — that's when the speaker starts saying it.
5. **Don't touch the audio** — base video plays untouched. Output duration MUST equal input duration (verify checks this).
6. **Don't add captions** — the input already has them burned in.
7. **Brand-styled generated b-roll** — when (and only when) you fall through to `gpt_image_2`, prefix every prompt with: *"Editorial illustration, raisin black background (#0F121A), accent strokes in neo lime (#CFFF05), restrained palette, no text, no logos, clean composition, premium magazine aesthetic. Subject: …"*
8. **Workdir under `~/.cache/video-edit/`** — never put intermediates in Downloads/Documents (macOS TCC).

## Pipeline

### Stage 1 — Transcribe (for placement intel)

```bash
python3 scripts/transcribe.py <video_path>
```

Writes `<workdir>/words.json`. We need this to know *when* concepts are spoken so b-roll lands on the right beat.

### Stage 2 — Plan b-roll (Claude does this)

Read `words.json`. Pick **3–6 b-roll beats**. Every entry MUST have a `reason` and a `kind`:

- A beat is a span of 2.5–4.5 seconds where a concept is being explained that benefits from a *specific* visual
- **Anchor on concrete things**: numbers ("$1,500"), named tools ("Stripe", "Claude Code"), metaphors ("guardrails", "the funnel"), enumerated lists
- **Don't fight existing visuals**: if the speaker says "as you can see…" they're already showing something
- **Vary the rhythm**: don't dump 4 b-rolls in the first 30s and none in the last 2 minutes
- **Don't compete with captions**: place b-roll where the caption is on a single concept word
- **No filler visuals**: if you can't write a one-line `reason` that names a specific noun/claim from the transcript, drop the beat

For each beat, choose a `kind`:

- **`"viz"` — ⭐ the cinematic motion library. THE DEFAULT for any concept / data / stat / comparison / process / list-of-things / count / network / price moment.** Read `motion/catalog.json`, pick the device whose `useWhen` matches, copy its `example` prop shape. See §4motion for the moment→device map. Reach for this FIRST — before `stat_punch`, `vs_split`, `list`, `horizontal_timeline`, etc.
- `"static"` — full-screen image takeover. Use for real product screenshots, stock photos, and generated illustrations (a literal thing the speaker names). Not for concepts/data — that's `viz`.
- `"video"` — full-screen MP4 takeover (e.g. Seedance clip, or a graded Drive b-roll clip).
- `"icon"` — small floating card. Use sparingly. Default `anchor` is `"center"`.
- (Legacy flat templates like `stat_punch` / `vs_split` / `list` still exist but a `viz` device almost always beats them — see §4motion.)

Write to `<workdir>/broll_plan.json`:

```json
[
  {
    "start_sec": 8.2,
    "end_sec": 11.5,
    "kind": "static",
    "reason": "Speaker names 'Claude Code' — show the actual terminal interface so viewers see what we're talking about",
    "source": "real-screenshot",
    "image_path": "broll/1-claude-code.png",
    "search_query": "Claude Code CLI terminal screenshot site:anthropic.com"
  },
  {
    "start_sec": 22.0,
    "end_sec": 30.0,
    "kind": "list",
    "reason": "Speaker enumerates the three reasons indie devs ship faster — reinforce structure visually",
    "title": "Three Reasons",
    "items": ["Smaller surface area", "Direct user feedback", "No legacy guardrails"]
  },
  {
    "start_sec": 41.6,
    "end_sec": 45.0,
    "kind": "static",
    "reason": "Metaphor 'angry HN thread' — abstract editorial, no real referent exists",
    "source": "generated",
    "image_path": "broll/3-hn.png",
    "prompt": "abstract editorial: angry orange Hacker News thread, comments piling up"
  }
]
```

### Stage 3 — Acquire b-roll images

For each `static` or `icon` beat, follow the **sourcing priority** (see Hard rule #2):

1. **Real screenshot / product UI** — `WebSearch` for the official source, `WebFetch` to confirm the URL, `curl -L -o <workdir>/broll/<i>.<ext> <url>` to download. Set `source: "real-screenshot"`. Verify the file is a real image (not an HTML error page) with `file <workdir>/broll/<i>.png`.
2. **Stock library** — for generic concepts. Easiest: `curl -L -o <workdir>/broll/<i>.jpg "https://source.unsplash.com/1920x1080/?<comma,sep,query>"`. Set `source: "stock"`.
3. **Generated** — only for abstract metaphors. Call `mcp__eb9d9e8e-947c-4f03-b626-a2f45fe617e9__generate_image` with `model: "gpt_image_2"`, `prompt: <brand-prefix> + <subject>`, `aspect_ratio: "1:1"` for shorts (rule 3b — images go in `image_card` glass cards). Save under `<workdir>/broll/<i>.png`. Set `source: "generated"`.

`list` and `video` beats skip this stage.

Update `broll_plan.json` so every `static`/`icon` entry has a final `image_path` pointing to a file that exists.

### Stage 4 — Plan zoom punch-ins

```bash
python3 scripts/zoom_plan.py <video_path>
```

Writes `<workdir>/zoom_plan.json` — a list of punch-in windows where the speaker layer scales up to ~1.06× for emphasis. Default heuristic: every ~7s on sentence-starts, each window 2–3s. You can hand-edit this file before render to tune.

Format:
```json
[
  { "start_sec": 4.5, "end_sec": 7.5, "scale": 1.06 },
  { "start_sec": 18.2, "end_sec": 21.5, "scale": 1.08 },
  ...
]
```

### Stage 4.5 — Lint the plan

`render.sh` auto-runs this, but you can lint early:

```bash
python3 scripts/lint_plan.py <workdir>/broll_plan.json
```

It blocks render if any beat is missing a `reason`, references a missing file, has overlapping timing, or sets a `list` kind without `items`. Override with `SKIP_LINT=1` only if you know what you're doing.

### Stage 5 — Render

```bash
bash scripts/render.sh <video_path>
```

The composition has two stacked layers:
- **Speaker layer** (gets zoomed): `<OffthreadVideo>` of the source video, wrapped in a scale transform driven by `zoom_plan`. This is the punch-in.
- **B-roll layer** (above the zoom, never cropped): each `broll_plan` entry is a `<Sequence>` rendered at the top `AbsoluteFill` level, so overlays always show full-frame regardless of the speaker punch-in beneath them.

Why this layering: an earlier version put b-roll inside the zoom wrapper, which silently cropped overlays whenever a punch-in coincided with a beat. If you ever want b-roll to inherit speaker zoom (for a stylized effect), move the overlays back inside the inner AbsoluteFill — but don't, by default.

Output: `<input>.enhanced.mp4` next to the source.

### Stage 6 — Verify

```bash
python3 scripts/verify.py <video_path>
```

Auto-runs after render. Checks:
- Output duration matches input duration (within 0.2s)
- Audio is bit-identical to input (we don't touch it)
- All b-roll image_paths in plan exist on disk

## Self-check before reporting done

- [ ] `<input>.enhanced.mp4` exists
- [ ] `verify.py` passes (duration + audio match)
- [ ] `lint_plan.py` passes (every beat has a `reason`, list beats have items)
- [ ] Every enumerative span in the script is covered by a `list` kind, not a stock image
- [ ] Real-screenshot/stock outweigh generated images for any non-metaphor concept
- [ ] No icon overlay is anchored to a corner unless explicitly justified
- [ ] Subscribe-bug (`assets/subscribe-bug.mp4`) composited once, 60–80% runtime, small corner `video` overlay (rule 4ag)
- [ ] Number of b-roll inserts matches `broll_plan.json` length
- [ ] Number of zoom moments matches `zoom_plan.json` length

## Style overrides (env vars to render.sh)

- `KEN_BURNS_INTENSITY=1.15` (default) — b-roll zoom range
- `ZOOM_PUNCH_INTENSITY=1.06` (default) — speaker punch-in scale
- `ZOOM_EASE_FRAMES=8` (default) — frames to fade zoom in/out

## When NOT to use this skill

- Source needs cutting / silence removal / take dedup → **legacy mode** removed; use a different tool
- Source has no captions yet → caption it first (Descript, CapCut, etc.)

## Legacy files (kept but inactive)

`cutplan.py`, `selector.py`, `sentences.py`, `Captions.tsx` are kept in the repo for reference but are NOT part of the v3 pipeline. The new flow only needs: `transcribe.py` → b-roll planning (Claude) → image gen → `zoom_plan.py` → `render.sh` → `verify.py`.

4ce. **🖼️ Landscape b-roll on shorts = SUBJECT-CENTERED 9:16 crop, never letterbox.** Codified 2026-06-10 ("we should be able to crop them to go more full screen! but preferably intelligent cropping!"). A 16:9 library clip letterboxed inside a 9:16 short reads as a thin TV-band and wastes 60% of the frame. Instead, pre-crop every landscape b-roll asset to a full-frame 9:16 proxy with the crop window centered on the SUBJECT (the hands, the dog, the person — known from the media-library catalog/frame review, expressed as a cx fraction of source width):
`ffmpeg -ss <in> -i src -t <dur> -vf "crop=ih*9/16:ih:max(0\,min(iw-ih*9/16\,CX*iw-ih*9/32)):0,scale=1080:1920" -an out.mp4`
Pick CX per clip by looking at where the action lives (catalog descriptions + a frame grab) — NOT a blind center crop. 4K sources survive the 1.78× effective upscale fine on phone screens. If the action crosses the frame horizontally, pick CX for the END of the move (where the action lands) or choose a different clip.

4cf. **🚫 NO subscribe-bug in ADS.** Codified 2026-06-10 ("no subscribe buttons in ads! does not make sense!"). Rule 4ag (subscribe-bug once per short) applies ONLY to organic channel shorts. Paid ads (webinar funnels, product ads — anything whose CTA is a link/landing page, or filenames/folders containing "ad"/"ads") must NEVER contain the subscribe animation: the viewer isn't on the channel and the only CTA is the ad's own. Before planning, ask: is this an ad? If yes, skip rule 4ag entirely.

4cg. **📣 ADS follow [knowledge/ads_recipe.md](knowledge/ads_recipe.md).** Codified 2026-06-10 after direct-response research. For any ad edit: PAS-mirrored visuals (pain=dark, payoff=freedom), hook text = key benefit at frame 0, **visual change every ~2s in seconds 5-15** (the hold-rate window — audit gaps >2.5s), b-roll literalizes the spoken line, all key claims readable sound-off, single CTA text at the end, no subscribe (4cf). Hook is the #1 test variable — keep VAR_ hook swaps in mind.

4ch. **⬇️ Tight-framed speakers (podcast/ad close-ups): ALL text at vertical ≥0.78.** Codified 2026-06-10 ("texts on my face is annoying! lower would be better, as a rule"). Rule 4al's 0.58 floor assumed a waist-up framing; on a tight chest-up shot (Rode-mic ad setup) the face occupies 0.25-0.70 of frame height, so vertical 0.66 lands ON the face. For any close-framed talking head: hook_title vertical = 0.80, word_pop = 0.78. Check the framing before authoring — if the chin sits below 0.55 of frame height, use the tight-framing band.

4ci. **📷 Run `scripts/steady_section.py` on EVERY b-roll clip before choosing its in-point.** Codified 2026-06-10 after two ad b-roll picks landed on camera-relocation moments (the typing macro 0-3.4s and the dark-studio 2-5s — both visibly drifting). Handheld/settling movement is invisible in still frames; the motion profile makes it objective. Procedure: `python3 scripts/steady_section.py <library-clip> --min-window 3` → use the reported steadiest window as the proxy's `-ss`. Anything with per-second motion >2.0 is a relocating camera — never cut from it.

4cj. **📱 B-roll orientation must match the edit orientation.** Codified 2026-06-11. Every select in `Media/_catalog/broll_catalog.json` carries `orientation: vertical|horizontal` (vertical clips are also marked **📱 VERTICAL** in the MD mirror, filenames start `iphone_`). HARD RULE: **never place a vertical clip as b-roll in a 16:9 horizontal edit** — cropping 9:16 down to 16:9 leaves a useless center sliver, and pillarboxing reads as amateur. Direction matters: horizontal → 9:16 is fine (subject-centered crop per 4ce); vertical → 16:9 is never fine. When assembling a b-roll plan, filter the catalog on orientation FIRST, before content matching.

4cm. **🖼️ Editorial card b-roll (`card: true` on `kind:"video"`).** Locked 2026-06-11 (Luuk's reference: lifestyle-creator b-roll = clip in a rounded card on black with an elegant serif caption). Set `card: true` + `caption: "two short\nlines"` on a video beat: the clip plays inside a rounded 16:9 card centered on pure black (full 16:9 footage breathes — NO crop, unlike the 9:16-fill default), with `caption` rendered in Playfair Display serif (lowercase, white, soft scrim for legibility over bright shots) over the card. Caption placement is PER-CLIP (locked 2026-06-11, "text shouldn't always be in the same location"): `caption_x` + `caption_y` (0..1 within the CARD) + `caption_align` (`left`/`center`/`right`) drop the words into each shot's negative space. **NEVER place text over the subject (locked 2026-06-11, "don't put text upon the subject — place it nicely around it"): `caption_x` is an ANCHOR point and `align` is the growth DIRECTION** — for a subject on the right, right-align the text so it grows LEFT into the empty side (and vice-versa); read each clip's subject position first (a quick gridded frame-grab) and anchor every fragment into the clear zone. **ONE POINT PER CLIP (locked 2026-06-11, "'you can't quit' should be one clip and 'you can't call in sick' another"):** each spoken point/phrase gets its OWN card with its OWN clip and a SINGLE caption — never stack multiple phrases/fragments on one clip. A multi-clause line (e.g. "you can't quit, you can't call in sick") becomes two back-to-back cards with two different clips. Rapid clip changes ARE the cinematic energy; accumulating fragments on one card is retired. **TEXT NEVER OVERFLOWS THE CARD (locked same day):** the caption layer is clipped to the card rect with an inner margin (~6% x / 9% y) and each caption's maxWidth is bounded so it wraps inside the card — it can never spill onto the black border. Keep captions to ≤2 short lines so they sit cleanly inside.

**KINETIC mode (locked 2026-06-11, "cut up the text and place it randomly but cinematically, one word in lime"):** instead of one static `caption`, give the beat `caption_segments: [{text, appear_sec, x, y, align}, …]` — each fragment pops in (fade+rise) at its `appear_sec` (set to the word's start from words.json so it lands as spoken), at its own scattered x/y, and they ACCUMULATE then fade out together at the cut. Wrap ONE payoff word per beat in `{braces}` to draw it in neo-lime `#CFFF05` (same brace convention as WordPop) — e.g. `"take the"` then `"{afternoon}"`. This is the preferred caption style for card b-roll; plain `caption` is the static fallback. The caption has a local soft scrim (legible anywhere) and a slow drift (never static). **⭐ FINAL LAYOUT (locked 2026-06-12 after Luuk saw both rendered): CENTERED card + kinetic fragments INSIDE the video.** The card stays vertically CENTERED in the 9:16 frame ("place the clip in the middle") and the kinetic caption fragments render INSIDE the card over the footage ("the text should always be inside of the video") — NOT in the black margins. Author each beat with multiple `caption_segments` (split the phrase on its `\n` lines → one fragment per line), one `{lime}` word, staggered in time so each line pops as spoken. **SCATTER, don't stack (locked 2026-06-12, "spread the text over the video — nice positions, not on the main object, around it or on two different sides; do not stack a column on the object"):** place the fragments FAR APART in the clip's CLEAR zone — typically one near the TOP and one near the BOTTOM (and/or opposite horizontal sides), framing the subject, never a tight column on top of it. Read each clip's subject side first (a quick gridded contact sheet of every card beat) and choose: subject RIGHT → text column LEFT (e.g. frag0 `(0.06,0.12,left)`, frag1 `(0.06,0.66,left)`); subject LEFT → text RIGHT (`(0.94,0.12,right)`,`(0.94,0.66,right)`); centered/closeup → diagonal (`(0.06,0.12,left)` + `(0.94,0.68,right)`). **⚠ WRAP-COLLISION BUG (fixed 2026-06-12):** inside-card fragments MUST render `whiteSpace:"nowrap"` — if a fragment ("you can't take") wraps, the wrapped word ("take") lands on top of the next stacked fragment ("the…") and reads as DUPLICATED text. Keep fragments to ≤3 words and never rely on wrapping; the renderer now forces nowrap for inside-card (negative-space text may still wrap on the black). The inside-card bottom-clamp uses a 1.4× (not 2.4×) line-height allowance so a low fragment (y≈0.66) actually sits low instead of being pulled to mid. **⚠ CARD CLIPS MUST BE HORIZONTAL 16:9 (locked 2026-06-12, "feels like a weird crop — the content is horizontal already, why don't we see full frame?"). The card is 16:9 and uses `objectFit:"cover"`, so a HORIZONTAL (1920×1080) clip fills it edge-to-edge with NO crop. A VERTICAL/portrait source (1080×1920) gets center-cropped to a thin horizontal slice (looks zoomed/wrong). Before carding, ffprobe every clip's `width,height`; if `w<h` it's vertical — swap it for a horizontal clip of the same moment (do NOT crop a vertical clip to 16:9; it has no horizontal info). This bit the A1 short-cutdown, which reused the original full-screen 9:16 clips — fixed by repointing to the A1-full horizontal card clips. Audit: a one-liner ffprobe loop over every card beat's `image_path` flags any `w<h`.** Inside-card text is bumped to ~6.8% of width with a HEAVY dark halo textShadow (4-layer, up to 64px) so it stays legible over bright footage. **History/caveat:** a `caption_space:"negative"` mode also exists in the renderer (card pinned top + big text in the black field below, ~8.6% width, weight 600) — it was tried 2026-06-12 and REJECTED by Luuk in favor of centered+inside; do NOT use `caption_space:"negative"` for these ads unless he asks for it again. **Why the kinetic part got missed once (2026-06-12 post-mortem): the kinetic system existed in the renderer but every ad's PLAN only carried ONE static segment per beat — specced-but-not-authored. Lesson: a feature isn't "done" until the actual broll_plan.json data uses it; audit `segLens` (segments-per-beat) across all plans, never assume the renderer capability implies the plans use it.** Video beats are takeovers so the karaoke captions auto-blackout — the serif caption carries the spoken words. **Card clips must be reasonably lit — and this is a MEASURED gate now, not an eyeball call (SECOND dark-clip rejection 2026-06-12: `grind_late-desk-frustration_C5421` in the Fire Yourself ad; first was a too-dark desk clip 2026-06-11). Before locking any card asset, measure mean luma: `ffprobe -v error -f lavfi -i "movie=<clip>,signalstats" -show_entries frame_tags=lavfi.signalstats.YAVG -of csv=p=0 | awk '{s+=$1;n++} END {print s/n}'` — average YAVG < 40 (0-255) = too dark for the card field, swap for a brighter take of the same idea. The contact-sheet check misses this: dark clips read fine at thumbnail size on a bright editing monitor but die at phone brightness. 'Pain = darker visuals' (ads recipe) means muted/cool grade, NOT underexposed — at most ONE genuinely dim clip per ad, and even it should clear ~40.** ⚠ **End-pause gotcha (2026-06-11):** assembled ad variations (hook+body+closer spliced together) can clip the FINAL word — the closer gets cut with no breathing pause, so the last word ("…for free") reads as cut off even though it's essentially complete. Diagnose: the transcript's last word ends within ~0.45s of the cut's total duration (and may even MISS the final word if it's quiet). Fix: extend the SOURCE cut with a held frame + silence — `ffmpeg -i cut -vf tpad=stop_mode=clone:stop_duration=0.7 -af apad=pad_dur=0.7 …` — then re-render. NOTE: the music arc resolves at the original voice length, so the appended tail is quiet (a clean "button" on silence — acceptable; if you need the bed to ring out, that's a score.sh change). ⚠ **Held-frame gotcha (2026-06-11):** `close_gaps.py` bridges sub-1.5s gaps by extending the earlier beat's `end_sec` to the next beat's start (so the speaker doesn't flash for <1.5s — that reads "trippy"). If a card beat gets bridged LONGER than its clip, the clip FREEZES on its last frame (reads as a glitch). Fix: cut card assets long enough to cover the bridged window (authored length + up to ~1.5s), and after rendering verify each card beat's duration ≤ its clip duration. `loop` is NOT a valid `<OffthreadVideo>` prop in Remotion 4.0.453 (don't reach for it). ⚠ **Batch-render gotcha (2026-06-11):** `render.sh` ABORTS on a lint failure and the density cap (>4 beats in any 12s window) trips on enumeration/montage-heavy ads — leaving a STALE preview that silently shows the OLD edit. When an ad's cards bunch early (A5: quit+3-montage+… = 5 beats in 8s), render with `SKIP_LINT=1` and confirm the preview actually regenerated (don't trust "Done" in a loop — check a card frame). Cut the card asset as the FULL 16:9 clip (don't pre-crop to vertical). Two pipeline gotchas when adding ANY new broll field: (1) the props builder in `render.sh` has a per-kind allowlist — a new field that isn't copied there arrives `undefined` in Remotion (silent: the beat falls to its default branch). Add the field to the `kind == "video"` (or relevant) block. (2) `render.sh` fingerprints plan+assets but NOT the Remotion `src/` — after editing a template you MUST `rm -rf remotion/node_modules/.cache/webpack` AND run with `FORCE_RENDER=1`, or it serves the stale render/bundle.

4cl. **🤚 Shake is measurable, and stabilize ONLY when it improves the number.** Codified 2026-06-11 (Luuk: "is shake something you can detect, and does fixing it actually look better?"). Detect: phase-correlation residual-jitter scorer (`shake.py` — per-frame `cv2.phaseCorrelate` global motion minus the smoothed/intended camera path, mean+p95 px at 480px width). jitter>5 = visibly shaky, >10 = very. Fix: two-pass vidstab on the already-graded library file (no LUT re-apply): `vidstabdetect=shakiness=8:accuracy=15` → `vidstabtransform=smoothing=14:optzoom=1:interpol=bicubic:crop=keep,unsharp=5:5:0.6:3:3:0.3,format=yuv420p`. **HARD GATE: re-score after stabilizing and keep the result ONLY if jitter dropped.** vidstab helps locked/handheld-static shots but FIGHTS deliberate camera moves (walk-and-follow, pan, push-in) — there the residual jitter goes UP and the footage "swims," which a single still frame can't reveal (only the before/after number catches it). Of 8 candidates, 5 dropped (kept) and 3 rose (left original). Tag kept clips `stabilized:true` in the catalog. OPERATIONAL: ffmpeg/ffprobe inside a bash `for` loop must get `</dev/null` or every iteration after the first writes a 0-byte file silently (`-nostdin` does not fix it).

4ck. **🎞️ Spoken enumerations of activities get ONE CLIP PER ITEM — a montage, never a single clip for the whole list.** Codified 2026-06-11 after A7 ("while I sleep, work out, have fun" showed one gym clip — "we say 3 things and don't show 3, but 1! very weird"). When the speaker lists N concrete, visualizable activities/things, cut N matching clips, one per item, each cut landing exactly ON its item's first spoken word (read the boundaries from `words.json`). Montage mechanics: clips run back-to-back for the duration of the enumeration — a deliberate exception to rule 4z's breathing rule, which governs UNRELATED takeovers (the coverage underlay handles the run with no speaker flash); each cut is ~0.8–1.5s, punchy; **NO `speech_anchor` on montage beats** — align_to_speech's tail extension (+0.6s past the anchor) would overlap the next cut, so hand-set `start_sec`/`end_sec` on the word boundaries instead. If one item has no honest matching clip in the library, cut back to the SPEAKER for that item rather than showing a wrong visual (rule 4bs beats completeness). Word-pop enumerations (rule 4y) remain correct for ABSTRACT lists; this rule is for enumerated VISUALIZABLE activities.

4cn. **🪧 A single hero/sponsor logo (`tool_logo_burst`) = LOGO ONLY, placed LOW, no lime border. Never let it overlay background shelves/decor.** Codified 2026-06-12 (Luuk on a sponsored Convex intro/outro: "only show the logo — no text underneath, no yellow border" + "place the logo lower so it's not overlaying the icons; make this a rule"). When a `tool_logo_burst` is used as ONE hero/sponsor logo flash (not a multi-tool enumeration), the default `SLOTS` (item 0 at y≈0.30) land it in the UPPER third — directly over the busy shelf/decor backdrop of a talking-head set, which reads cluttered. Three locked defaults for the single-logo case:
  - **Logo only.** OMIT `label` — the caption (or the logo wordmark itself) carries the brand name; an UPPERCASE label under the tile duplicates the on-screen caption and looks like a chyron sticker.
  - **No lime border.** OMIT `accent` (the lime emphasis ring). On a white logo card the lime ring reads as a loud "yellow border"; a plain card (white hairline that blends into the card) is cleaner. Reserve `accent:true` for the one "winner/kept" tool in a multi-tool comparison, never for a lone sponsor logo.
  - **Placed LOW + smaller.** Use the per-item placement overrides `x`/`y`/`size` (0..1 frame-relative CENTER anchor; `size` = tile width ÷ frame width) to drop the tile into the CLEAR lower-corner zone, BELOW the shelves. Working values for a centered 16:9 talking head: `x≈0.16, y≈0.66, size≈0.16` (lower-left, clear of the shelf unit and the speaker). Inspect a source frame first — put the logo where the backdrop is darkest/emptiest, never over decor objects or the face. The default 0.22-of-width tile is also too big on landscape; ~0.16 reads as a tasteful corner mark. The SLOTS still drive multi-logo enumerations (rule 4bm) — this rule is specifically the single hero/sponsor logo.
