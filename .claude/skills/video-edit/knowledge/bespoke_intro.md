# Bespoke Intro — the method for hero 16:9 intros

**This REPLACES the template path (`intro_recipe.md`) for any hero intro.** A hero intro is a hand-written
Remotion composition designed for THIS script — a one-off piece of motion design worth $5k. Template plans
were rejected twice ("super boring"); so was over-reusing a previous comp's look. **The deliverable of this
doc is a METHOD, not a style.** Every new video gets its own concept; only the principles below carry over.

---

## Part 1 — Principles (style-agnostic; these never change)

### Concept
1. **Concept before code.** Read the transcript yourself and find the 4–7 semantic beats. Then invent ONE
   environment or visual thesis that can hold the entire intro — derived from what THIS script is about,
   not recycled from the last video. (A video about editing became an editor's note-canvas; a video about
   design became the speaker's own footage as the stage. The next one should surprise us.)
2. **Every visual must MEAN the sentence.** Per beat, write one line: what appears and why it means exactly
   this spoken moment. If the answer is decoration or vibes, cut it. "Boring" feedback almost always means
   "this visual doesn't mean anything," not "add more motion."
3. **Receipts beat graphics.** Real artifacts (real thumbnails, real metrics, real file paths, real product UI)
   are always stronger than invented illustrations. When claiming proof, show the actual thing.
   **This includes brand marks: the moment a company/product is named in the script, fetch its REAL logo
   unprompted** (apple-touch-icon, /icon.svg, docs press assets — verify by viewing, and tight-crop padded
   icons so they read at small sizes). A drawn stand-in glyph for a real brand is a polish gap the user
   will catch every time.

### Structure
4. **Anchor everything to speech.** Every visual event lands on an exact word-start from words.json.
   Nothing is timed by feel.
5. **The first 2 seconds are the most important shot in the video.** Give the hook a deliberate, crafted
   entrance (the register of a film title: focus, settle, an element that draws on, a title moment) —
   whatever form fits the concept. Never open on an untreated frame.
6. **One persistent element ties the whole runtime together.** Something (a frame, a thread, a mark) that
   survives every scene change, so the intro reads as one designed object instead of a sequence of effects.
7. **The speaker is the show.** Everything else supports him. Maintain a contrast hierarchy where the eye
   goes to him first; visuals may take over the frame only briefly and for a reason.
8. **Rhythm needs breaks — and breaks need content.** A mid-intro register change (e.g. environment →
   fullscreen → environment) keeps 25s alive, but the break must carry its own meaningful content, styled
   in the intro's own language — never floating stock chrome/boxes that "don't match the vibe."

### Motion
9. **Clean > aggressive.** Fades and settles, not slams, pops, shakes, or explosions. At most one hard
   transition (e.g. a flash-out) at the very end.
9b. **Connector arrows are STRAIGHT lines with attached heads.** Wavy/squiggle arrows were rejected across
    multiple videos ("ugly", "weird curves"). A connector = straight stroke, round caps, arrowhead fading in
    as the line arrives. Decorative curved paths (dotted flight arcs, threads) are fine — but anything with
    an arrowHEAD is straight.
10. **The camera is a narrator, not an effect.** It never fully rests (micro-drift on holds) and never makes
    two moves where one continuous move works. Each camera intention = exactly one move.
11. **Sound follows visual physics.** Cues fire when things LAND, not when they start moving. Counting/serial
    visuals get soft per-item ticks. Few, quiet, purposeful — sound design is felt, not noticed.

### Process
12. **Iterate: preview render → stills you personally view → hand to the user → STOP.** Never auto-final.
    Final render only on explicit approval.
13. **Every scripted patch must assert it changed the file.** Silent no-op edits have shipped unchanged
    renders twice.
14. **Re-pacing = remap, don't eyeball.** When a tighter cut of the same script arrives: re-transcribe, build
    a piecewise-linear old→new map from word boundaries, push every time constant through it, update the comp
    duration. The whole design re-lands on the new pacing automatically.
15. **Feedback names a symptom; find the violated principle.** "More quality" → the hook isn't crafted (P5).
    "Doesn't match the vibe" → foreign chrome in the intro's language (P8). "Looks off" (camera) → two moves
    where one belongs (P10). "Too aggressive" → P9. "Boring" → P2. Fix the principle, not just the pixel.

---

## Part 2 — Current execution kit (one style; may be superseded per video)

The current BuildLoop System v1 skin and plumbing. Use as the default skin, but a new video's concept may
legitimately demand a different world — Part 1 always wins over Part 2.

- **Shipped references**: `remotion/src/HiggsIntro.tsx` (footage-led) and `remotion/src/VideoEditIntro.tsx`
  (world-canvas: stations on an ink path, world camera `[frame,x,y,zoom]` + screen-space speaker card with own
  keyframes, `Easing.bezier(0.45,0,0.18,1)`, `useIn()` reveals). Read one before starting.
- **Brand tokens**: RAISIN #0F121A / SILVER_BG #E9ECED / LIME #CFFF05; Space Grotesk 700 / JetBrains Mono /
  Playfair italic. Current contrast recipe: light environment, white cards, speaker footage as the dark focal
  element, one dark accent moment near the close.
- **Music**: `music/bg-brand-minimal-genA.mp3` (MusicGen local). Mux post-render:
  `ffmpeg -i render.mp4 -i genA.mp3 -filter_complex "[1:a]volume=0.8,atrim=0:<dur>,afade=t=in:d=0.8,afade=t=out:st=<dur-2.2>:d=2.1[mus];[0:a]asplit=2[voice][sc];[mus][sc]sidechaincompress=threshold=0.03:ratio=6:attack=25:release=350[ducked];[voice][ducked]amix=inputs=2:weights=1 0.16:normalize=0[out]" -map 0:v -map "[out]" -c:v copy -c:a aac -b:a 320k out.mp4`
- **SFX**: synthesized clean UI cues in `remotion/public/vedit/sfx/` (tick/tick_soft/tap/slide, numpy-made —
  downloaded packs read cartoonish). Volumes ~0.24–0.48.
- **Renders**: preview `--scale=0.5 --concurrency=4 --timeout=120000`; final native 4K `--crf=16`; archive to
  `~/Movies/BuildLoop/<date>_<name>/6_EXPORTS/` + `~/Downloads/`.
- **Voice QA**: ffprobe the source bitrate; if 128k, request a 320k Descript re-export (Normalize OFF) — it
  swaps in later via remux, no re-render.
- **Gotchas**: purge `node_modules/.cache/webpack` after every src edit; horizontal SVG lines have zero-height
  bboxes (filters clip them — use layered strokes); width:0 world container needs explicit widths +
  `whiteSpace:nowrap` on text; connectors render before cards in JSX (underneath).

## Part 3 — World-canvas register (locked 2026-07-02, applies to shorts AND intros)

Luuk rejected the overlay-on-footage register for bespoke pieces ("I miss a sense of greatness. Everything
is quite small, nothing is full screen. Move me to a smaller section, use the rest to show things at scale").
The world-canvas register is now the DEFAULT for hero pieces in both 16:9 and 9:16:

1. **Full-frame designed canvas** (silver + faded raisin draftsman grid, or dark raisin variant), world camera
   `[frame, x, y, zoom]`, parallaxed grid. Shipped references: `VideoEditIntro.tsx` (16:9 4K),
   `shorts/WaveIntro.tsx` (9:16), `shorts/BillShowcase.tsx` (9:16, the richest — invoice world, scatter→lock arc).
2. **Open near-fullscreen**: speaker video large with 12px rounded corners and a sliver of canvas at the
   edges. This exact state is a locked preference. Defocus-to-focus + settle on the first 16 frames.
3. **Choreograph the speaker card** — one position per beat, not one static corner. Beat-motivated moves
   (top-left tilted −2° watching a reveal, top-right while a table reads, grow to half-frame for the honest
   beat), slight rotation (±1.5–2°) gives it life. 6–8 moves over 45s reads "interactive", each eased, EASE
   bezier(0.45,0,0.18,1).
4. **Set pieces at world scale.** A number that bleeds the frame edges, a document taller than the viewport,
   a full-frame takeover for THE moment (`better = ▮`). If a visual could be called an "overlay", it's too small.
5. **Real things must look like the real thing.** A US field of businesses = actual US border geometry with
   point-in-polygon marks (precompute from GeoJSON, never a random scatter — "it's so random, it doesn't make
   sense"). An invoice = a real bill layout: header + doc number, SERVICE/USAGE/AMOUNT table, underlined
   TOTAL DUE row, terms footer ("the invoice looks vague" = the format wasn't literal enough). Receipts logic
   extends to layout formats, not just data.
6. **Captions on light canvas**: raisin ink, current word raisin-on-lime block (lime-on-light legibility rule);
   flip non-current words to white+shadow only while a dark register dim is active. Screen space, ~87% height,
   repositioned per beat if a set piece needs the lane.
7. **Arc props.** The strongest structure plants objects in act one that the ending redeems (keys scattered
   across the canvas → collected into a lock). One prop system, two meanings.

## Part 4 — The Fish-series baseline (locked 2026-07-03; START HERE, don't re-learn)

Three shipped intros (FishIntro / FishIntro2 / FishIntro3) accumulated a feedback cycle Luuk does not want
to repeat. Every rule below was a correction — treat them as defaults for ALL future bespoke pieces:

**Openings**
1. **Never open on an empty canvas.** The first frame shows a human (the speaker). A white/designed-only
   cold open reads as "nothing is happening" and got rejected.
2. **A "his own footage + foreign audio" dub illusion FAILS** — mouth movement visibly mismatches ("so fake
   it doesn't hit"). The working pattern: **generate real lip-synced clips via the avatar pipeline**
   (Fish s2.1-pro voice in the target language → HeyGen Avatar V, `~/.claude/skills/avatar-video`, 16:9 4K
   — the avatar wears the same studio, so it cuts seamlessly into the real A-roll). Have the clone say a
   natural line ("Welcome to this video…"), not repurposed content audio.
3. If a cold open plays media (podcast/clips), cut points sit in the SILENCE after a word ends (check
   word-end timestamps), never mid-word, and never fade during a word tail.

**Scale (the #1 recurring note)**
4. **Fill the frame.** Station content should occupy ~70%+ of frame height at its hold. Zooms of 0.9–1.1
   are almost always too timid — shipped values ended at 1.16–1.40. When in doubt, push in.
5. Full-frame breaks/finales: zoom the camera into the money element (the 1→4 fan ended at 1.32–1.40 with
   the summary line as the frame anchor).

**Craft corrections (each cost a round)**
6. **Arrows are straight lines with attached heads** that fade in as the line arrives. NO wavy/squiggle
   connectors ("ugly, weird curves") and NEVER animate a connector's geometry per frame (the arrowhead
   detaches; it reads broken). Dotted flight-path arcs (no heads) are fine as passive threads.
7. **Animated bars/objects must not strobe**: oscillation ≤ ~2 cycles/sec (`sin(frame/7)`), amplitude ≤ ~0.26.
   Fast per-frame jitter reads as glitch ("vibration in the moving element").
8. **Elements that live inside a camera-transformed world render IN the world DOM** — never as screen-space
   overlays re-projected per frame (borders wobble against the zoom). Dock overlays by animating to the
   target rect once, then swap to an in-DOM element.
9. **CSS paddings/margins need units in strings** (`"0 36px"`, not `"0 36"` — silently ignored, chrome hugs
   edges). Audit every card for breathing room; check text vs card width (no overflow), and summary lines
   vs neighboring cards (no overlap).
10. **Real brand logos fetched proactively** (see P3), **flag emoji for languages/countries** (🇪🇸 🇨🇳 render
    natively) — visual receipts beat text codes.
11. **Same-series videos share palette + persistent violet frame + pill/caption language, but each gets a
    FRESH environment metaphor** (listening test / departures board / production session). Copying the
    previous video's environment got rejected even within the series.

**Process**
12. Renders flake (compositor ECONNRESET / fonts delayRender): retry once at `--concurrency=1`; exit 137 =
    killed, just retry. Verify EVERY delivery against stills at each station before handing off.
