# Module Catalog — CWB v3

Code lives in `runtime/cwb-modules.js` + `runtime/cwb-modules.css` (one `@module` block per
module). This file is the **contract**: what each module is for, what it costs, the markup it
expects, and how it degrades. Activate a module with `data-cwb="name"` on its root element
(space-separate to stack: `data-cwb="magnetic burst"`). `scripts/assemble.mjs` ships only the
blocks and GSAP plugins a page uses.

Legend — **Cost**: motion-budget points (SKILL.md §4). **Fine**: needs a mouse/trackpad; on touch it
stays inert and the content still works. **RM**: what reduced-motion users get.

## Index

| ID | Name | Category | Cost | Fine only | RM result | Plugins |
|---|---|---|---|---|---|---|
| 00 | `reveal` (+ `[data-reveal]`) | Scroll | 2 | — | visible | ScrollTrigger |
| 33 | native reveal `[data-nreveal]`, `.scroll-progress` | Scroll · CSS-only | 0 | — | visible | none |
| 01 | `text-fill` | Scroll | 3 | — | full-color text | SplitText |
| 31 | `line-reveal` | Scroll / load | 3 | — | static text | SplitText |
| 02 | `sticky-narrative` | Scroll | 8 | — | instant state swaps | ScrollTrigger |
| 03 | `parallax` | Scroll | 5 | — | static | ScrollTrigger |
| 04 | `horizontal-pan` | Scroll · pin | 10 | — | native swipe row | ScrollTrigger |
| 05 | `card-stack` | Scroll | 4 | — | sticky stack, no scale | ScrollTrigger |
| 06 | `svg-draw` | Scroll | 3 | — | fully drawn | DrawSVGPlugin |
| 07 | `curtain` | Scroll | 5 | — | no curtain | ScrollTrigger |
| 08 | `split-scroll` | Scroll · pin | 8 | — | stacked columns | ScrollTrigger |
| 09 | `color-shift` | Scroll | 3 | — | instant swaps | ScrollTrigger |
| 32 | `frame-scrub` | Scroll · pin | 20 | — | poster image | ScrollTrigger |
| 34 | `velocity-skew` | Scroll accent | 3 | — | none | ScrollTrigger |
| 10 | `cursor` | Pointer | 5 | ✔ | native cursor | — |
| 10b | `magnetic` | Pointer | 1 | ✔ | static | — |
| 11 | `accordion-gallery` | Pointer / click | 3 | — | works (instant) | — |
| 12 | `compare` | Pointer / keys | 2 | — | works | — |
| 13 | `image-trail` | Pointer | 5 | ✔ | none | — |
| 14 | `flip-card` | Click (+hover opt-in) | 2 | — | cross-fade | — |
| 15 | `repel-grid` | Pointer | 4 | ✔ | static | — |
| 16 | `spotlight` | Pointer | 2 | ✔ | static border | — |
| 17 | `drag-canvas` | Drag / keys | 6 | — | no inertia | Draggable, InertiaPlugin |
| 18 | `morph-expand` | Click | 4 | — | plain dialog | — |
| 19 | `burst` | Click | 2 | — | none | — |
| 20 | `counter` | Scroll-in | 2 | — | final value | ScrollTrigger |
| 21 | `coverflow` | Swipe / click | 4 | — | flat snap carousel | — |
| 22 | `island-nav` | Nav | 3 | — | works (instant) | ScrollTrigger |
| 23 | `dock` | Nav | 3 | ✔ (hidden < 900px) | static | — |
| 24 | `scramble` | Ambient | 2 | — | real text | ScrambleTextPlugin |
| 25 | `marquee` | Ambient | 4 | — | static wrapped list | ScrollTrigger |
| 26 | `mesh-gradient` | Ambient | 3 | — | static gradient | — |
| 27 | `orbit-text` | Ambient | 1 | — | static ring | — |
| 28 | `glitch` | Ambient (one-shot) | 2 | — | none | ScrollTrigger |
| 29 | `typewriter` | Ambient | 2 | — | first phrase | — |
| 30 | `stroke-text` | Ambient | 1 | — | static outline | — |
| 35 | `intro-gate` | Load | 3 | — | skipped | — |
| 36 | page transition (`--with page-transition`) | Nav · CSS-only | 0 | — | off | none |

**External modules — route, don't reimplement:**

| ID | Effect | Skill |
|---|---|---|
| X1 | WebGL shader planes / full-canvas scrollytelling | `sa-scroll-cinematics` (Architecture A/B) |
| X2 | Scroll-scrubbed "fly through the world" film | `scroll-world` / `scroll-film-studio` |
| X3 | Real 3D, liquid glass material, Framer physics | `sa-figma-framer-spline` (Premium path) |
| X4 | Hand-tracking / gesture cursor | `add-hand-tracking` (extends module 10) |
| X5 | Apple-grade material/carousel/transition lab | `spaceage-apple-immersive-web-design` |

---

## Markup contracts

Only the structure the module needs. Everything else (copy, extra classes) is free.

### 00 reveal · 33 native reveal
```html
<body data-cwb="reveal"> …  <p data-reveal>Batched fade-up on enter</p>
<h2 data-nreveal>CSS view() timeline — zero JS, preferred for simple reveals</h2>
<div class="scroll-progress" aria-hidden="true"></div>
```
Prefer **33** for plain reveals (no JS, compositor-only). Use **00** where you need stagger batching
or Safari/Firefox parity today.

### 01 text-fill
```html
<h2 data-cwb="text-fill">Statement heading that brightens word by word.</h2>
```
One per page, for the manifesto line. Never on body paragraphs.

### 31 line-reveal
```html
<h1 data-cwb="line-reveal" data-trigger="load">Outcome headline</h1>   <!-- hero -->
<h2 data-cwb="line-reveal">Section title</h2>                            <!-- on scroll -->
```
Masked line rise via SplitText (`mask:'lines'`, `autoSplit` re-splits on resize/font load, `aria:'auto'`).
Hero variant starts ≤ 50 ms after boot (after the intro gate if present) and finishes < 1.2 s — LCP stays in budget.

### 02 sticky-narrative
```html
<div class="sn" data-cwb="sticky-narrative">
  <div class="sn__visual">
    <figure class="sn__frame is-active"><img …></figure>  <figure class="sn__frame"><img …></figure>
  </div>
  <div class="sn__steps">
    <article class="sn__step"><h3>…</h3><p>…</p></article>  <article class="sn__step">…</article>
  </div>
</div>
```
Same number of frames and steps. Desktop: two columns, sticky visual. Phone: visual sticks to the top 44vh, steps scroll beneath (CSS sticky, no pin).

### 03 parallax
```html
<section class="parallax" data-cwb="parallax">
  <div data-depth="1"><img … alt=""></div>  <div data-depth="0.4">…</div>
  <div class="parallax__content">…</div>
</section>
```
Desktop amplitude 12% × depth; phones 30% of that; RM none.

### 04 horizontal-pan
```html
<section class="hpan" data-cwb="horizontal-pan" aria-label="…">
  <div class="hpan__track">
    <article class="hpan__panel"><h3 data-hreveal>…</h3></article> …
  </div>
</section>
```
Pinned only at ≥ 900px with motion. Phones/RM: native scroll-snap row. `[data-hreveal]` children reveal with `containerAnimation`. Tabbing into a panel scrolls the page to it.

### 05 card-stack
```html
<div class="stack" data-cwb="card-stack">
  <article class="stack__card" style="--i:0">…</article> <article class="stack__card" style="--i:1">…</article>
</div>
```
Pure CSS sticky stack; JS only sets `--i` (write it inline for no-JS parity) and adds scale-back depth.

### 06 svg-draw
```html
<svg data-cwb="svg-draw" viewBox="0 0 800 200" aria-hidden="true"><path data-draw d="…"/></svg>
```

### 07 curtain
```html
<section class="curtain" data-cwb="curtain">
  <div class="curtain__content">…</div>
  <div class="curtain__panel curtain__panel--l" aria-hidden="true"></div>
  <div class="curtain__panel curtain__panel--r" aria-hidden="true"></div>
</section>
```
**Never in the first viewport.** Panels only exist once JS arms them.

### 08 split-scroll
```html
<section class="split" data-cwb="split-scroll" aria-label="…">
  <div class="split__col split__col--a">…</div>  <div class="split__col split__col--b">…</div>
</section>
```
Column A travels up, B travels down (B's content should be authored bottom-to-top). Desktop + motion only.

### 09 color-shift
```html
<div data-cwb="color-shift">
  <section data-scene-bg="oklch(0.14 0.01 260)" data-scene-fg="oklch(0.97 0 0)">…</section>
  <section data-scene-bg="var(--c-accent)" data-scene-fg="var(--c-on-accent)">…</section>
</div>
```
Colors transition through registered `@property` — any CSS color incl. OKLCH and `var()`. Check contrast for **every** scene pair.

### 10 cursor · 10b magnetic
```html
<body data-cwb="reveal cursor">
<a class="btn" data-cwb="magnetic" data-strength="0.3" data-cursor="View">…</a>
```
`data-cursor="Label"` on any element shows a label inside the ring. One magnetic element per viewport, max.

### 11 accordion-gallery
```html
<div class="accg" data-cwb="accordion-gallery">
  <button class="accg__item" aria-expanded="false"><img alt="" …>
    <span class="accg__label">Title</span><span class="accg__body">One line</span></button> …
</div>
```
3–6 items. Hover opens on fine pointers; click/tap/Enter everywhere.

### 12 compare
```html
<div class="compare" data-cwb="compare">
  <img class="compare__after" alt="After: …"> <img class="compare__before" alt="Before: …">
  <input class="compare__range" type="range" min="0" max="100" value="50" aria-label="Compare before and after">
  <span class="compare__handle" aria-hidden="true"></span>
</div>
```

### 13 image-trail
```html
<section class="trail" data-cwb="image-trail" data-images="a.avif,b.avif,c.avif" data-gap="90">…</section>
```
Pooled `<img>`s (≤10). Images ≤ 60 KB each — they're thumbnails.

### 14 flip-card
```html
<article class="flip" data-cwb="flip-card" data-hover>
  <div class="flip__inner">
    <div class="flip__front">… <button class="flip__toggle" aria-expanded="false">Details</button></div>
    <div class="flip__back">…  <button class="flip__toggle" aria-expanded="false">Back</button></div>
  </div>
</article>
```
Hidden face is `inert`. `data-hover` adds hover-to-flip on fine pointers only.

### 15 repel-grid · 16 spotlight
```html
<div class="repel" data-cwb="repel-grid" data-radius="140" data-force="28"><span class="repel__tile">…</span>…</div>
<div class="spot" data-cwb="spotlight"><article class="spot__card">…</article>…</div>
```

### 17 drag-canvas
```html
<div class="canvas" data-cwb="drag-canvas" tabindex="0" role="region" aria-label="Project canvas — drag or use arrow keys">
  <div class="canvas__plane">…items…</div>
</div>
```
Fine pointer: free x/y with inertia. Touch: horizontal only, vertical page scroll preserved. Arrow keys pan.

### 18 morph-expand
```html
<div class="morph" data-cwb="morph-expand">
  <button class="morph__card" data-morph-target="case-1"><img alt="" …><span>Title</span></button>
  <dialog class="morph__dialog" id="case-1" aria-label="…"> … <button class="btn morph__close">Close</button></dialog>
</div>
```

### 19 burst · 20 counter
```html
<button class="btn" data-cwb="magnetic burst">Book now</button>
<span data-cwb="counter">1,280+</span>   <span data-cwb="counter" data-style="odometer">98%</span>
```
Counters: **write the real, verified value in the HTML.** No invented metrics — if the client has no number, cut the stat row.

### 21 coverflow
```html
<section class="cf" data-cwb="coverflow" aria-roledescription="carousel" aria-label="…">
  <div class="cf__track" tabindex="0"><article class="cf__item" aria-roledescription="slide" aria-label="1 of 5">…</article>…</div>
  <div class="cf__controls"><button data-cf="-1" aria-label="Previous slide">←</button><button data-cf="1" aria-label="Next slide">→</button></div>
</section>
```
CSS `animation-timeline: view(inline)` drives the tilt where supported; JS fallback otherwise. Never autoplay.

### 22 island-nav · 23 dock
See `templates/starter.html` for the island. Dock:
```html
<nav class="dock" data-cwb="dock" aria-label="Quick links">
  <a class="dock__item" href="#work" aria-label="Work"><svg aria-hidden="true">…</svg><span class="dock__tip" aria-hidden="true">Work</span></a>
</nav>
```
SVG icons only — emoji icons are an AI tell.

### 24 scramble · 28 glitch · 29 typewriter · 30 stroke-text · 27 orbit-text
```html
<span data-cwb="scramble" data-chars="upperCase">Section label</span>
<span class="glitch" data-cwb="glitch">Signal</span>
<span data-cwb="typewriter" data-phrases='["cinematic sites","scroll films"]'>cinematic sites</span>
<h2 class="stroke" data-cwb="stroke-text">OUTLINE</h2>
<div class="orbit" data-cwb="orbit-text" data-text="Available · Est. 2026 · " role="img" aria-label="Available, est. 2026"></div>
```
Scramble: labels and eyebrows, not paragraphs. Glitch: one-shot on enter/hover — never continuous.

### 25 marquee · 26 mesh-gradient
```html
<div class="marquee" data-cwb="marquee" data-speed="60" data-direction="left">
  <div class="marquee__inner"><ul class="marquee__track"><li>…</li></ul></div>
</div>
<div class="mesh" data-cwb="mesh-gradient" aria-hidden="true"><span class="mesh__blob"></span>×4</div>
```
Marquee pauses on hover/focus and offscreen, speeds up with scroll velocity, eases back. Mesh sits inside a `position:relative; isolation:isolate` parent.

### 32 frame-scrub
```html
<section class="scrub" data-cwb="frame-scrub" data-src="/assets/seq/hero_{i}.webp" data-count="120" data-pad="3" data-scroll="300" data-mobile-step="2">
  <canvas class="scrub__canvas" aria-hidden="true"></canvas>
  <img class="scrub__poster" src="/assets/seq/hero_001.webp" alt="…" width="1920" height="1080">
  <div class="scrub__copy">…</div>
</section>
```
Progressive frame fill (every 8th frame first) so scrubbing works before the set finishes. Poster for RM / save-data. Budgets in `asset-pipeline.md`.

### 35 intro-gate
```html
<div class="gate" data-cwb="intro-gate" data-max="1800" aria-hidden="true"><span class="gate__mark">Brand</span><span class="gate__bar"></span></div>
```
First element in `<body>`. Hard cap (default 1.8 s), once per session, skipped for RM. **Flagship tier only.**

---

## Composition recipes

Page-type starting points. Counts are motion cost; stay inside the tier budget.

| Page | Hero | Body | Proof | CTA | Cost |
|---|---|---|---|---|---|
| Local service (Factory) | 31 load + 33 | 33 reveals, 16 spotlight services | 20 counter (real numbers) + 25 marquee (real reviews) | 10b magnetic | ~14 |
| SaaS launch (Enhanced) | 31 + 26 mesh | 02 sticky-narrative product story, 16 | 20 + 21 coverflow | 10b + 19 | ~29 |
| Restaurant / nightlife (Cinematic) | video hero (T2) + 31 | 03 parallax, 11 accordion menu, 09 color-shift day→night | 25 marquee press | 10b | ~27 |
| Portfolio / studio (Cinematic) | 31 + 10 cursor | 04 horizontal-pan work, 13 trail, 18 morph case studies | 24 labels | 19 | ~39 |
| Product film (Flagship) | 35 gate + 32 frame-scrub | 02 + 08 split + 06 draw | 20 odometer | 10b + 19 | ~60 |

**Signature-moment rule:** name the one effect people will describe to a friend, spend budget there, keep everything around it quiet.
