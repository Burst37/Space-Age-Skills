---
name: lenis-smooth-scroll
description: Add, configure, debug and review Lenis smooth scrolling (darkroom.engineering/lenis, v1.3.x) in vanilla JS, React (`lenis/react`), Vue/Nuxt (`lenis/vue`) and Next.js, including the GSAP ScrollTrigger sync, scroll snapping (`lenis/snap`), anchors, nested scroll containers, modals, horizontal/infinite scroll, WebGL scroll sync and reduced-motion handling. Use when the user asks for smooth scroll, "buttery" scroll, inertia scroll, scroll hijack that still keeps native scroll, scroll-synced WebGL/parallax, or when a Lenis setup is janky, breaks position:sticky/ScrollTrigger pins, traps scrolling in modals, or ignores anchor links.
license: MIT
---

# lenis-smooth-scroll

Space Age skill built from the `darkroomengineering/lenis` repo (MIT © darkroom.engineering; `LICENSE.upstream`), version 1.3.26 at clone time. Lenis ("smooth" in Latin) is a tiny, dependency-free smooth-scroll library that **runs on native scroll** — it interpolates the scroll position instead of replacing the scrollbar, so `position: sticky`, anchors, find-in-page and accessibility keep working.

Origin story worth knowing (MANIFESTO): it was built to keep **WebGL and DOM in sync** while scrolling. Smoothness was the happy accident. When the job is "sync a canvas/GSAP/parallax to scroll from one loop", Lenis is the right tool; when the job is "page should feel nicer", ask whether native scroll is already enough.

## 0. Decide first: should this page use Lenis at all?

House rule from `cinematic-website-builder`: **native scroll by default; Lenis only with a documented reason.** Valid reasons: scroll-synced WebGL, scrubbed pin sequences that must share one loop with GSAP, deliberate inertia as part of the brand. Invalid: "everyone does it".

| Situation | Use Lenis? |
|---|---|
| Marketing/cinematic site with scrubbed ScrollTrigger + WebGL | Yes (+ the GSAP sync below) |
| App UI, dashboards, docs, forms, long reading pages | No — native scroll |
| Touch-first audience, iOS < 16 concerns | Desktop-only smoothing (default); leave `syncTouch` off |
| Page full of iframes/maps users scroll through | Careful — smooth scroll stops over iframes |
| User has `prefers-reduced-motion: reduce` | Lenis already degrades (see §6); never override |
| Alternative needed with pinning/parallax effects built in | GSAP `ScrollSmoother` (see `gsap-plugins`) — **don't run both** |

## 1. Install

```bash
npm i lenis            # then:  import Lenis from 'lenis'  +  import 'lenis/dist/lenis.css'
```

CDN (pin the version):

```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.26/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"></script>
```

Always include the recommended CSS — it is the #1 cause of "Lenis feels broken". It sets `html.lenis { height:auto }`, `overflow: clip` while stopped, `overscroll-behavior: contain` on `data-lenis-prevent*` nodes, disables iframe pointer-events while smoothing, and powers `autoToggle`. Full text: `references/lenis-css.md`.

## 2. Minimal setups

```js
// A. Simplest — Lenis runs its own rAF loop
const lenis = new Lenis({ autoRaf: true })
lenis.on('scroll', (e) => { /* e.scroll, e.velocity, e.direction, e.progress */ })

// B. Custom rAF loop (required when something else owns the frame, e.g. GSAP)
const lenis = new Lenis()
function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
requestAnimationFrame(raf)
```

**No-code / "make it just work" preset** (what the README ships for site builders):

```html
<script>new Lenis({ autoRaf: true, autoToggle: true, anchors: true,
  allowNestedScroll: true, naiveDimensions: true, stopInertiaOnNavigate: true })</script>
```

Covers compatibility with other packages, modals, smooth anchors, and scroll reset on navigation. `naiveDimensions` and `allowNestedScroll` carry a perf cost (see §7).

## 3. GSAP ScrollTrigger sync (the canonical recipe)

One loop, one source of truth. Lenis must be driven by GSAP's ticker, and ScrollTrigger must be told when Lenis scrolls:

```js
gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis()                         // NOT autoRaf
lenis.on('scroll', ScrollTrigger.update)          // keep triggers in sync
gsap.ticker.add((time) => lenis.raf(time * 1000)) // GSAP time is seconds → Lenis wants ms
gsap.ticker.lagSmoothing(0)                       // no catch-up jumps
```

Rules that prevent the usual bugs:
- `autoRaf: false` (default) whenever you drive `raf` yourself — two loops = double-stepping, jitter.
- Multiply by `1000`. Forgetting it makes the scroll nearly frozen.
- Don't also create `ScrollSmoother` (two smoothers fight).
- After async layout changes (images, fonts, accordion, route change) call `lenis.resize()` (if `autoResize:false`) and `ScrollTrigger.refresh()`.
- Cleanup (SPA/React): `gsap.ticker.remove(fn)`, `lenis.destroy()`, kill triggers.
- Pinned sections: ScrollTrigger pins work on Lenis' native scroll; `position: sticky` also works. If pin-spacer jumps appear, check you didn't double-drive `raf`.

Ready-to-use files: `templates/vanilla-gsap.html`, `templates/react-gsap.tsx`. Framework variants (React/Vue/Nuxt/Motion/Framer Motion): `references/framework-adapters.md`.

## 4. Programmatic control

```js
lenis.scrollTo('#section', { offset: -80, duration: 1.4, lock: true, onComplete: () => {} })
lenis.scrollTo(0, { immediate: true })     // jump, e.g. on route change
lenis.scrollTo('bottom'); lenis.scrollTo(element)
lenis.stop()   // modal open / loader running
lenis.start()  // resume
lenis.destroy()
```

`scrollTo` options: `offset`, `lerp`, `duration`, `easing`, `immediate`, `lock` (block user scroll until target reached), `force` (scroll even while stopped), `onComplete`, `userData` (forwarded through `scroll` events). Targets: number (px), CSS selector or keyword (`top|left|start|bottom|right|end`), or element.

Anchor links are **blocked while scrolling by default** — set `anchors: true` (or `anchors: { offset: 100, onComplete }`).

Read state: `lenis.scroll`, `animatedScroll`, `targetScroll`, `actualScroll`, `velocity`, `lastVelocity`, `direction` (`1` = down, `-1` = up, `0` = idle — it is `Math.sign(velocity)` in `lenis.ts`; the upstream README states it the other way round, which is wrong), `progress` (0–1), `limit`, `isScrolling` (`'smooth' | 'native' | false`), `isStopped`, `prefersReducedMotion`. All options/properties/methods/events: `references/api.md`.

## 5. Nested scroll, modals, widgets

Pick one, in order of preference:

1. `data-lenis-prevent` on the scrollable node (cheapest, explicit). Variants: `-wheel`, `-touch`, `-vertical`, `-horizontal`.
2. `prevent: (node) => node.id === 'modal'` option (JS predicate).
3. `allowNestedScroll: true` (simplest, but checks the DOM tree on **every** scroll event — avoid on heavy pages).

Modal pattern: `lenis.stop()` on open (CSS keeps `overflow: clip` so the page doesn't shift), `lenis.start()` on close; or `data-lenis-prevent` on the modal body.

## 6. Reduced motion

`respectReducedMotion` defaults to **true**. With `prefers-reduced-motion: reduce`: smoothing is disabled (`lerp` forced to `1`, 1:1 with the input device), programmatic scrolls and anchors jump instantly, but Lenis keeps running so WebGL/DOM sync stays intact; the preference is picked up live. Read `lenis.prefersReducedMotion` to tone down your *own* animations too. Do not set `respectReducedMotion: false` (README: not recommended; fails our accessibility gate).

## 7. Options that matter (cheat sheet)

| Goal | Option |
|---|---|
| Heavier/lighter feel | `lerp` (default 0.1; lower = floatier) **or** `duration` (1.2s) + `easing` — `duration`/`easing` are ignored if `lerp` is defined |
| Horizontal site | `orientation: 'horizontal'`, `gestureOrientation: 'both'` (so a vertical wheel drives it) |
| Scroll a container, not the page | `wrapper: el`, `content: el.firstElementChild` |
| Scroll smoothing on touch too | `syncTouch: true` (+ `syncTouchLerp: 0.075`, `touchInertiaExponent: 1.7`) — can be unstable on iOS < 16 |
| Infinite loop | `infinite: true` (needs `syncTouch: true` on touch; don't call on html/body without testing iOS flicker) |
| Faster/slower wheel | `wheelMultiplier`, `touchMultiplier` |
| Intercept input | `virtualScroll: (e) => { e.deltaY /= 2 }` or return `false` to skip smoothing (e.g. `({event}) => !event.shiftKey`) |
| Auto on/off by CSS overflow | `autoToggle: true` (requires the CSS; Safari > 17.3, Chrome > 116, Firefox > 128) |
| Layout changes without ResizeObserver | `autoResize: false` + manual `lenis.resize()` |
| Stop inertia on internal link click | `stopInertiaOnNavigate: true` |
| Where events are listened | `eventsTarget` (default `wrapper`) |

Performance notes: `naiveDimensions` and `allowNestedScroll` have measurable cost; scrolling is capped at 60fps on Safari and 30fps in iOS low-power mode; `position: fixed` can lag on pre-M1 macOS Safari.

## 8. Scroll snapping — `lenis/snap`

CSS `scroll-snap` is **not supported** with Lenis; use the snap package:

```js
import Snap from 'lenis/snap'
const snap = new Snap(lenis, { type: 'proximity' /* | 'mandatory' | 'lock' */, distanceThreshold: '50%', debounce: 500 })
snap.add(500)
snap.addElements(document.querySelectorAll('.section'), { align: ['start', 'end'] })
// slideshow feel:
// new Snap(lenis, { type: 'lock', distanceThreshold: '100%', debounce: 0 })
```

Methods: `add`, `addElement`, `addElements`, `next`, `previous`, `goTo(i)`, `start`, `stop`, `resize`. Callbacks: `onSnapStart`, `onSnapComplete`. Call `snap.resize()` after layout changes.

## 9. Debug checklist (in this order)

1. Latest Lenis version? Recommended CSS imported?
2. Is `raf` actually being called — `autoRaf: true` **or** a single manual loop (never both)?
3. Does the page scroll without Lenis? (Remove it and test — `height:100%`/`overflow` on html/body is a common culprit.)
4. ScrollTrigger present? Apply the §3 recipe exactly (`scroll` → `ScrollTrigger.update`, ticker × 1000, `lagSmoothing(0)`).
5. Inner element won't scroll → §5 (`data-lenis-prevent`).
6. Anchor links dead → `anchors: true`.
7. Layout shifted after load → `lenis.resize()` / `ScrollTrigger.refresh()`.
8. Smooth scroll dies over an embed → iframes don't forward wheel events (known limitation).
9. Jitter on `position: fixed` / WebGL → render from the `scroll` event or the same GSAP tick, not a second rAF.

## 10. Known limitations (from upstream)

No CSS scroll-snap (use `lenis/snap`); Safari 60fps cap (30fps low-power); iframes swallow wheel events; fixed-position lag on pre-M1 Safari; `syncTouch` risky on iOS < 16; nested scrollers need explicit config.

## 11. v2 heads-up (roadmap, not released as of clone)

`V2-ROADMAP.md` flips defaults to "bulletproof": `autoRaf`, `autoToggle`, `anchors`, `allowNestedScroll`, `stopInertiaOnNavigate`, `naiveDimensions` → `true`; groups options into `wheel: {smooth, lerp, multiplier}` and `touch: {smooth, lerp, multiplier, inertia}`; renames `isScrolling` into `isWheelScrolling | isTouchScrolling | isProgrammaticScrolling`; adds CSS auto-injection and multi-axis. **Pin `lenis@1.3.x` and write v1 options today**; re-read the roadmap before upgrading.

## Space Age integration

- `cinematic-website-builder` — module registry treats Lenis as an opt-in; this skill is the "documented reason" implementation. Prefer its `gsap.ticker` sync (single loop).
- `gsap-scrolltrigger` / `gsap-plugins` — ScrollTrigger recipe lives here in §3; `ScrollSmoother` is the mutually exclusive alternative.
- `design-motion-principles` (Lenis rules) — tune `lerp`/`duration` for feel; keep default easing unless there's a brand reason.
- Always test: desktop wheel, trackpad, touch, keyboard (Space/PageDown/Home/End), reduced-motion on, and with the CDN script blocked (page must still scroll natively).
