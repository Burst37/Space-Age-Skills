# Forensic Audit — cinematic-website-builder v2 → v3

Audited 2026-09-26. Subjects:
- **v2-synced** — the copy installed in claude.ai (`anthropic-skills:cinematic-website-builder`, 1,709 lines)
- **v2-web-agent** — `Burst37/web-agent:skills/cinematic-website-builder` (1,351 lines)
- The canonical skills repo (`Burst37/Space-Age-Skills`) had **no copy at all**.

Method: line-by-line read of both copies; cross-check of every referenced skill against both
repos and the synced skill set; module code composed onto one page and run in Chromium at
three viewports, reduced motion and CDN-blocked (see `proof/`). Severity: **S1** breaks the
page or excludes users · **S2** visible defect or wrong output · **S3** drift/debt.

---

## A. Systemic defects

| # | Sev | Finding | Evidence | v3 fix |
|---|---|---|---|---|
| A1 | S1 | **Modules can't be combined.** They declare top-level `const track`, `const el`, `let x`, `const wrap`, `const items`, `let current`… Classic scripts share one global lexical scope, so M04 + M25 on one page throws `SyntaxError: Identifier 'track' has already been declared` and **every later script dies**. This breaks the skill's core promise: compose 6–8 modules into one file. | M04 L385, M25 L1260 | Runtime kernel: every module is `CWB.define(name, {init})`, runs in its own closure and `gsap.matchMedia` context. Gallery composes all modules on one page: 0 errors. |
| A2 | S1 | **Invisible content for reduced-motion users and on script failure.** Hidden pre-states live in plain CSS (`.feature-card{opacity:0}`, `.ai-word img{opacity:0}`); the reduced-motion rule only skips the GSAP call, so those users (and anyone whose CDN request fails) get a blank section. | M02 L295, AI-font L1547, Output Std #8 | Pre-states only under `.cwb-js` **and** `prefers-reduced-motion: no-preference`; watchdog removes `.cwb-js` if boot fails. `verify.mjs` asserts 0 invisible text in the reduced and CDN-blocked passes. |
| A3 | S1 | **Global `* { cursor: none }`** with no pointer detection — touch/hybrid users and text fields lose the cursor. | M10 L583 | Cursor only under `(hover:hover) and (pointer:fine)` + motion; inputs keep their native cursor; verify asserts it. |
| A4 | S1 | **Hover-only / mouse-only interaction** — accordion (M11), flip (M14), before/after (M12), drag grid (M17: mouse events only, no touch), dock items are `div`s, island toggle has no `aria-expanded`, M18 uses `onclick` on `div`. Keyboard and touch users are locked out. | M11–M23 | Every interactive module is built on a native control: `<button aria-expanded>`, `<input type=range>`, `<dialog>`, Draggable (pointer events) + arrow keys, `inert` on hidden faces. |
| A5 | S1 | **M18 View Transition is broken by design**: `view-transition-name: card` is on every card *and* the overlay. Duplicate names abort the transition. The close button's click also bubbles to the overlay → two transitions. | M18 L927–L937 | Name assigned to exactly one element at a time, at click time; native `<dialog>` with Esc; `stopPropagation` on close; focus returned to the card. |
| A6 | S2 | **`html { scroll-behavior: smooth }` mandated** in Output Standards — fights ScrollTrigger pins/`scrollTo` and conflicts with Lenis (which `design-motion-principles` itself forbids combining). | Output Std #7 | Removed. Native scroll default; Lenis opt-in via `data-cwb-smooth` with a documented reason, never on touch or reduced motion. |
| A7 | S2 | **No `ScrollTrigger.refresh()` after fonts/images** — web-font swap shifts every trigger. No `invalidateOnRefresh` on function-based values (M04). | M04 | Kernel refreshes after `document.fonts.ready` + `load`; pinned modules use function values + `invalidateOnRefresh` + `anticipatePin`. |
| A8 | S2 | **Unbounded rAF loops and tween spam.** Cursor, marquee, momentum each run their own `requestAnimationFrame` forever (offscreen, hidden tab); M10/M15 create a new `gsap.to` on every `mousemove`; M13 appends a new `<img>` per move. | M10, M13, M15, M17, M25 | `quickTo` everywhere; `api.loop()` runs on `gsap.ticker` only while on screen; M13 uses a fixed image pool. |
| A9 | S2 | **LCP sabotage patterns recommended as defaults**: Curtain (M07) on the hero covers the LCP element; Scramble (M24) mutates the H1 into garbage glyphs (bad LCP text, bad screen-reader output, bad crawl); Counter starts at `0` in HTML so crawlers index `0`. | Composition Rules "Hero: 07 + 24" | M07 banned from the first viewport; scramble keeps real text in an `sr-only` twin and paints real text first; counters ship the real value in HTML. |
| A10 | S2 | **Brand leakage into client builds.** Module examples hard-code `#FF6B00` and SA/LoyaltyBot copy ("LoyaltyBot", "524 Brands Enrolled", "Your Bot Works While You Sleep"). Copy-paste builds ship another brand's colors and claims — and it violates the anti-forgetting rule *LoyaltyBot has zero connection to the website pipeline*. | M19, M20, M22, M25, M27, M29 | All modules read tokens only (`--c-accent` …); no product names or metrics anywhere in module code. |
| A11 | S2 | **Seven dangling skill references** — `playwright-browser-automation`, `asset-automation`, `animated-website-pipeline`, `ai-typography-font-builder`, `universal-build-handoff`, `sa-anti-slop-writer`, `SpaceAge_Figma_Design_Director_OS_v3` exist in neither repo nor the synced set. The QA step depends on one of them. | web-agent L1270ff | Routing table points only at skills verified to exist; QA ships inside this skill (`scripts/verify.mjs`). |
| A12 | S2 | **Two divergent copies with contradictory law**: synced says "Bunny Fonts, never Google"; web-agent says "All fonts from Google Fonts". Synced says generate assets *during* build; web-agent says assets *before* build. The AI-font pairing table recommends Inter, Poppins, Lato — all on `design-taste-frontend`'s banned list. | Output Std #4 both copies | One canonical copy in `Space-Age-Skills`, mirrored to `web-agent`. Precedence table in SKILL.md resolves every conflict. |
| A13 | S2 | **Module × Asset matrix mis-numbered** — "12 Video Reveal", "21 Scroll Scrub" don't exist (12 is Before/After, 21 is Coverflow). | web-agent Asset Matrix | Matrix rebuilt from the actual catalog (`references/asset-pipeline.md`). |
| A14 | S2 | **Stale stack.** GSAP pinned to 3.12.5. Since 3.13 every plugin is free (SplitText, ScrambleText, DrawSVG, Flip, Inertia, ScrollSmoother) — v2 hand-rolls weaker versions (scramble, SVG draw, "odometer" count-up). No native-first primitives (`animation-timeline: view()`, View Transitions, `@property`, `interpolate-size`, scroll-snap). | Tech Stack | GSAP 3.15.0 + plugins loaded per module; native CSS first (stack router in SKILL.md). |
| A15 | S2 | **Hard-coded Higgsfield model IDs** (`gpt-image-1-high`, `nano_banana_2`, `hailuo_2`) and a manual "strip audio in CapCut" step. IDs drift; hard-coding them produces failed calls. | Asset routing table | Route by *capability*, resolve the model at run time with `models_explore(action:'recommend')`; strip audio with `ffmpeg -an`. |
| A16 | S3 | **QA is a self-graded checklist** — no evidence, no numbers, no reduced-motion or failure-mode pass. | Quality Check | `verify.mjs`: 5 passes, blocking checks, screenshots, JSON + Markdown report. |
| A17 | S3 | **No SEO/head contract** in Output Standards (synced copy): no meta description, canonical, OG, JSON-LD, single-H1 rule. | Output Std | Starter head + static checks (JSON-LD parses, single H1, no `{{placeholders}}`, no presigned URLs). |
| A18 | S3 | **No motion budget.** "6–8 modules" counts modules, not cost — a frame-scrub and a typewriter aren't equal. | Direction Phase | Per-module cost in the catalog; tier budgets; `assemble.mjs` reports total cost. |
| A19 | S3 | Commercial font-pack sales strategy (Etsy/ui8 pricing) inside a build skill. | L1668–L1673 | Removed; build-relevant AI-font guidance kept in `references/ai-font-packs.md`. |

## B. Per-module defects (v2)

| Mod | Sev | Defect |
|---|---|---|
| 01 Text Mask | S2 | Two copies of the headline; clip-path fills the whole block box at once, not line by line; dim color hard-coded. → v3: SplitText words, scrubbed opacity, real text once. |
| 02 Sticky Stack | S1 | `1fr 1fr` grid on phones; cards hidden in CSS (A2); `scrub:false` + no `toggleActions`. → v3: stacked mobile layout, class-driven states that also work under reduced motion. |
| 03 Parallax | S3 | Same amplitude on phones; no reduced-motion path. |
| 04 Horizontal | S1 | Global `track` (A1); no mobile path (pins on phones); no `invalidateOnRefresh`; child triggers can't fire without `containerAnimation`; focus disappears inside the pin. |
| 05 Card Stack | S3 | Inline colors; offsets hard-coded per card. |
| 06 SVG Draw | S3 | Hand-rolled dashoffset (DrawSVG is free); one path only. |
| 07 Curtain | S2 | Recommended on the hero (A9); panels visible without JS, permanently covering content if the script fails. |
| 08 Split Screen | S1 | Right column `yPercent: 50` pushes content *out* of the clipped box (blank half); no pin, so the effect barely reads. |
| 09 Color Shift | S2 | `onEnterBack` doesn't restore text color; CSS `transition` fights the GSAP tween; GSAP can't tween OKLCH. → v3: registered `@property` colors interpolated by CSS. |
| 10 Cursor | S1 | A3; per-event tweens; ring centered with CSS `transform` that GSAP overwrites. |
| 11 Accordion | S1 | Hover-only; `filter` transitions on large images (expensive). |
| 12 Before/After | S1 | Mouse-only; no keyboard or touch; `clip-path` recomputed with string concat per event. |
| 13 Image Trail | S2 | Unbounded DOM creation; runs on touch. |
| 14 Flip Cards | S1 | Hover-only; back face content unreachable by keyboard; no reduced-motion variant. |
| 15 Repel Grid | S2 | 36 `getBoundingClientRect` + 36 new tweens per `mousemove`. |
| 16 Spotlight | S2 | Outer `padding: 2rem` turns the "border" into a 2rem glow band. → v3: masked 1px border. |
| 17 Drag Grid | S1 | Mouse-only; unbounded; a second momentum loop starts on each release. |
| 18 View Transition | S1 | A5. |
| 19 Particle Button | S3 | Particles clipped by ancestors with `overflow:hidden`; keyboard clicks burst from (0,0). |
| 20 "Odometer" | S2 | Is a count-up, not an odometer; crawlers index `0`. → v3: both styles, real value in HTML. |
| 21 Coverflow | S1 | `update()` never called initially; inline transforms never cleared (the active card keeps a stale tilt); prev/next buttons promised but absent; global arrow-key hijack. → v3: scroll-snap + CSS `view(inline)` timeline, JS fallback, real buttons. |
| 22 Island Nav | S2 | `width:0 → auto` can't animate; hidden links stay in tab order. → v3: `grid-template-columns 0fr→1fr`, `inert`, Esc. |
| 23 Dock | S2 | `div` items, emoji icons (AI tell), per-event layout reads. |
| 24 Scramble | S2 | A9; `innerText` collapses whitespace. → v3: ScrambleTextPlugin + sr-only twin. |
| 25 Marquee | S1 | Global `track`/`x` (A1); width measured before fonts load (loop seam jumps); no pause — WCAG 2.2.2. |
| 26 Mesh Gradient | S2 | `filter: blur(60px)` + `mix-blend-mode` on large animated layers — GPU heavy, battery drain on phones. → v3: soft radial gradients (no filter), paused offscreen, lite mode on save-data. |
| 27 Circular Text | S3 | `text-transform` isn't an SVG attribute; text doesn't fit the circle; spins for reduced motion. |
| 28 Glitch | S2 | Continuous flashing forever — WCAG 2.3.1 risk; pseudo-element text read twice by some screen readers. → v3: one-shot, ≤2 flashes, `content: attr() / ""`. |
| 29 Typewriter | S2 | Screen readers announce every keystroke; width changes each frame (CLS). → v3: sr-only phrase list, ghost stack reserves width. |
| 30 Gradient Stroke | S2 | CSS block unused and self-contradictory; SVG `<stop>` offsets animated to values >1 (clamped → the animation does nothing); SVG text inaccessible. → v3: real text, CSS stroke + masked sweep. |
| AI Font PNG | S2 | Per-letter `alt="A"` plus `aria-label` on the H1 → double announcement; hidden by CSS (A2). |

## C. Bugs found while rebuilding (caught by `verify.mjs`, fixed before ship)

1. `String.prototype.replace` treats `$'` in the replacement as "text after the match" — inlining JS that contains `api.$('…')` silently corrupted every module. Fixed with a function replacer. (This class of bug also hits any hand-rolled template inliner.)
2. `api.on(el, 'keydown', fn, false)` fell through to `{passive:true}`, making `preventDefault()` a no-op for arrow keys and `<dialog>` cancel. Fixed.
3. Mobile island nav: padding on a `0fr` grid item prevents collapse; toggle wrapped to its own row.
4. Dock rendered on touch phones.
5. Screenshot timing captured the intro gate mid-flight; harness now waits for the gate.

## D. Measured result (module gallery, every module on one page)

See `proof/REPORT.md`. 0 JS errors · 0 failed requests · 0px overflow · 0 invisible text
across desktop / tablet / mobile / reduced-motion / CDN-blocked. Load-phase CLS 0.
