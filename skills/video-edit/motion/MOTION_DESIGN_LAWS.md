# BuildLoop Motion Design Laws

The non-negotiable rules for every BuildLoop motion graphic. These are **craft
rules, not preferences** — most exist because the alternative is wrong from a
motion-designer's perspective, not just off-taste. Load this before building or
auto-directing any visualization. Treat it like the design skill's Cardinal Sins:
a render that breaks one of these is not "done."

> Source: distilled from real review feedback on the motion kit (2026-06) plus
> motion-design craft. Update this file when new feedback teaches a new rule —
> BEFORE re-rendering (feedback → rule → output, never the reverse).

---

## Pre-render checklist (run on every viz)
- [ ] Right move for the viz **type** (see the camera table) — not a default.
- [ ] If it's a **comparison / data table**: ALL elements stay framed, NO zoom into one part.
- [ ] Any **headline counter** is monotonic (running peak), never ticks backward.
- [ ] A real camera move on single-object vizzes (push / pull / orbit) + motion blur + parallax/DOF bg. Never a bare `scale()`.
- [ ] Easing is the brand ease `cubic-bezier(.2,.8,.2,1)` or a spring — never linear.
- [ ] Reveals are staggered and land where the camera is looking (nothing reveals off-screen).
- [ ] Palette = raisin / silver / lime ONLY. One lime accent per frame.
- [ ] Radius: surfaces (cards) 12px, ink (buttons/badges/bars/blocks) 0px sharp.
- [ ] Type: UPPERCASE Space Grotesk headlines, italic-900 stats, Playfair-italic counterpoint. NO floating corner mono-tag label — context lives inside the composition.
- [ ] Restraint: one strong visual per concept. Not every line gets a graphic.
- [ ] Text is never sitting under motion blur *at rest* (blur only during the move).

---

## The Cardinal Sins (never)

1. **Static scale faking a camera.** A gentle `scale()` + a slow spin on a single
   object reads as a flat infographic. Single objects need a real camera move.
2. **Zooming a comparison.** Zooming/whipping into one side of a side-by-side (or
   one bar of a chart) destroys the comparison — the whole point is seeing both at
   once. Comparisons stay framed.
3. **Counters that tick backward.** A headline number that follows a wiggly line
   counts down on dips and reads as a bug. Headlines only climb.
4. **Off-palette color.** Anything but raisin / silver / lime. No violet glows, no
   navy, no cream, no chrome gradients.
5. **Glossy 3D / moody gradients.** The brand is flat Swiss/print. No octane-render
   chrome objects, no glassmorphism, no soft dark "tech SaaS" gradients.
6. **Decorating every line.** Visual slop. One strong visual per real concept;
   silence (no visual) is allowed and often correct.
7. **Wrong radius.** Rounded buttons/badges/bars or sharp-cornered cards. Surfaces
   round (12), ink sharp (0).
8. **Linear motion.** Constant-speed moves with dead stops. Everything eases.
9. **Reveal/camera mismatch.** Content that animates in where the camera isn't, or
   off the visible frame. The reveal must happen where the eye is.
10. **Text smeared at rest.** Motion blur is for the *move*. If a label is blurry
    when the shot has settled, the blur is wrong.
11. **Floating corner label tags.** The little mono "■ 7 DAYS OF THE SYSTEM RUNNING"
    eyebrow pinned top-left (or any corner mono-tag / caption) is a print-layout tic,
    not cinema — it reads cheap and it's the first thing that dates a shot (Luuk,
    2026-07-01: "all of that gone"). The context belongs **inside** the composition:
    the number's own subtitle ("15,380 AGENT RUNS · 7 DAYS"), a chart's integrated
    title, a stat badge on the image, a newspaper masthead. Or nothing — the spoken
    narration carries the thesis while the shot shows the proof. No corner tags, ever.
12. **The single-crossfade slideshow.** Every scene entering and leaving on the
    same 12-frame dissolve is a slideshow, not a film — the #1 "rendered, not
    edited" tell. Cuts must be **motivated and varied**: push-through (kinetic
    default), lime-wipe at section breaks, blur-dissolve on tonal/light changes.
    Scenes **overlap** by the transition length so a push actually pushes the old
    frame off and a wipe covers a real seam (Plan.tsx `SEG`). (Luuk, 2026-07-01:
    "bold & kinetic.")
13. **Frozen exits and dead holds.** Two halves of the same sin: (a) elements that
    animate IN but then die in a flat opacity fade — every takeover must LEAVE with
    intent (blur + drift + slight scale, `exitStyle` / `cineReveal` exit); (b) holds
    that freeze stone-dead for seconds — every hold must BREATHE (a slow sine, but
    ONLY on glows / blurred bg / DOF, NEVER on text geometry, or it reintroduces the
    jitter of Sin #10). And the big beat must **PUNCH**: a counter locking, a stamp
    landing, a price hitting $0 gets a 1-frame scale-`impact()` + a lime `Flash`,
    not a polite arrival.

**Micro-overshoot on every settle.** Camera moves and hero pops don't glide to a
dead stop — they reach ~near-final by ~42% of the shot, kiss *slightly* past the
target, and settle by ~58% (then HOLD). The tiny overshoot is the "expensive" snap;
a pure ease-to-stop reads a touch lifeless. (Overshoot lives in `presetKeyframes`
and the `overshoot()` helper — it never breaks settle-and-hold, because it still
locks constant after ~58%.)

---

## Camera law by viz type

The camera move is chosen by **what the viz is**, not by default. The hard split:
single-focus vizzes get immersive moves; multi-element comparisons stay framed.

| Viz type | Comparison? | Allowed camera | Counter |
|----------|-------------|----------------|---------|
| Title / hero | no | push-in, parallax | — |
| Agent network / node graph | no | zoom-OUT reveal from the hub, slow drift | — |
| Line / area chart | no* | push-in / pan that tracks the line **but keeps the whole line visible at rest** | monotonic (running peak) |
| 3D layer stack | no | orbit-up / pull-back | — |
| Stat blocks | partly | gentle push that keeps ALL stats framed | each counts up |
| Bar chart | **YES** | gentle dolly only; every bar visible; no zoom into one | each counts up |
| Comparison / split | **YES** | **none** — static framing; motion = wipe + reveals | each side counts up |
| Process / flow steps | partly | light drift; keep all steps framed | — |

\* A line chart isn't a side-by-side, but the *trend* is the point, so the full
line must be readable when the shot settles.

**Every allowed camera move** pairs with: motion blur derived from camera velocity,
and a blurred parallax background (depth-of-field). A move without those reads cheap.

---

## Rendering gotchas (headless Chromium)

- **Label/axis text must be HTML, never SVG `<text>`, when it sits under a camera
  move.** SVG text inside nested 3D transforms (`Tilt`) + a toggling blur filter
  (the camera's motion blur) gets *dropped frame-to-frame* in headless Chromium —
  the text "glitches away" during movement (the 2026-06-19 month-labels bug). Draw
  chart axis labels, ticks, and captions as positioned HTML in the card's normal
  flow (the card header and HTML labels render reliably). SVG is fine for the
  shapes (lines, areas, paths, dots) — just not the text.
- **Keep small text out of heavy motion blur.** The blur cap is low (≤6px) on
  purpose; aggressive zoom/pan over small text smears it.
- **🚫 NEVER apply a continuously-animating `scale()` OR `rotate()` to a layer
  containing text.** This is the real, final cause of "text jitters / moves up and
  down / looks cheap" (the 2026-06-19 processFlow + chart bug). A camera push-in,
  a dolly, OR an animated 3D `Tilt` re-rasterizes the text at slightly different
  sub-pixel positions every frame → visible wobble. SVG-vs-HTML doesn't matter; the
  *animated transform on text* is the problem. The cures, both enforced in code:
  1. **Text-bearing vizzes use `SingleObjectStage stable`** — the foreground is
     never scaled/rotated by a camera (renders at the identical transform every
     frame = pixel-stable). Depth/life comes from a gentle BACKGROUND parallax
     (no text on it) + each element's own entrance animation. Use a **FIXED** tilt
     angle, never an interpolated one.
  2. **Object/atmosphere scenes** (network reveal, 3D stack) MAY use a camera move,
     but the presets **settle-and-hold**: reach the final scale by ~50% then hold
     dead-constant, so even those are stable for the readable/held portion.
  Verify stability objectively: PSNR a text-region crop across two held frames —
  >50 dB = pixel-stable. (The intro's processFlow measured 55 dB after the fix.)

---

## How these become truly built-in (enforcement layers)

1. **Spec (this file).** Loaded for every motion task and by the auto-director.
2. **Component API (when the kit is parametrized).** Make sins impossible, not just
   discouraged:
   - `ComparisonStage` — has no zoom/camera prop at all; always frames both sides.
   - `SingleObjectStage` — the camera rig (push/pull/orbit) lives only here.
   - `MonotonicCounter` — takes the data series, emits the running peak internally;
     it physically cannot count backward.
   - Palette/radius/type come from locked tokens; off-palette values aren't exported.
3. **Director validator.** The visual-director's plan is checked before render:
   a `comparison` viz with a camera move, or a counter without a monotonic source,
   is rejected and regenerated.
4. **Pre-render motion-review gate** (analog of the design-review gate): sample
   frames, check against the Cardinal Sins, return PASS or a fix list.
