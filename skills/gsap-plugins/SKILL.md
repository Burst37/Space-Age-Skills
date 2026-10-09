---
name: gsap-plugins
description: Official GSAP 3.15 plugin guide — registration, imports (ESM / UMD / CDN) and working patterns for every plugin now free in GSAP — SplitText, MorphSVG, DrawSVG, Flip, Draggable, InertiaPlugin, Observer, MotionPath (+Helper), ScrambleText, TextPlugin, ScrollTo, ScrollSmoother, CustomEase / CustomBounce / CustomWiggle, EasePack, Physics2D / PhysicsProps, GSDevTools, PixiPlugin, EaselPlugin, CSSRulePlugin. Use when the user asks for text splitting / reveals, SVG morph or line-drawing, layout (FLIP) transitions, drag & throw, gesture/wheel/touch detection, animation along a path, scramble/typewriter text, smooth-scroll with parallax effects, custom or bounce/wiggle eases, particle physics, or says "which GSAP plugin does X". Companion to gsap-core, gsap-timeline, gsap-scrolltrigger and gsap-supercharged.
license: MIT
---

# gsap-plugins

Space Age skill built from the `greensock/GSAP` repository (**v3.15.0**, `src/`, `esm/`, `dist/`, `types/`). GSAP's standard "no charge" license applies (https://gsap.com/standard-license). **Since the Webflow acquisition every plugin is free, including commercial use** — SplitText, MorphSVG, DrawSVG, InertiaPlugin, ScrollSmoother, GSDevTools, ScrambleText, CustomBounce/Wiggle, Physics2D/PhysicsProps, MotionPathHelper all ship in the public `gsap` npm package. No `gsap-trial`, no private registry, no Club token. (Old tutorials that say "Club GreenSock only" are out of date.)

This is the *plugin* layer. Pair it with: `gsap-core` (tweens, eases, matchMedia), `gsap-timeline`, `gsap-scrolltrigger`, `gsap-supercharged` (long-form recipes). Smooth-scroll alternatives: `lenis-smooth-scroll`.

## 1. Always: import + register

Plugins are **not** auto-registered. An unregistered plugin fails silently (the property is ignored; the console says "Invalid property … Missing plugin? gsap.registerPlugin()").

```js
// ESM / bundlers (Vite, Next, Nuxt, Astro…)
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
gsap.registerPlugin(ScrollTrigger, SplitText, Flip)   // once, at module scope

// or everything from the barrel (tree-shaking still works, "sideEffects": false)
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin)
```

```html
<!-- CDN (pin the version; load core first, plugins after) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js"></script>
<script>gsap.registerPlugin(SplitText)</script>
```

- Package `exports` map: ESM → `gsap/<Name>`, UMD → `gsap/dist/<Name>`. Both resolve (`"./*"`). TypeScript types ship in `gsap/types/*`.
- React: use `@gsap/react` → `useGSAP()` (auto cleanup, scoped selectors); register plugins at module scope, not inside the hook.
- Next.js App Router: plugin code touches `window` → use inside client components / effects only.
- `SplitText` ships as TypeScript source (`src/SplitText.ts`) plus compiled `esm`/`dist`.

Registration, import path and CDN URL for all 24 modules: `references/plugin-matrix.md`.

## 2. Pick the plugin (decision table)

| I want to… | Plugin | Notes |
|---|---|---|
| Animate letters / words / lines | **SplitText** | Mask reveals, responsive re-split, a11y built in |
| Morph one SVG shape into another | **MorphSVG** | Handles different point counts, `shapeIndex`, `map` |
| "Draw" a stroke on/off | **DrawSVG** | `drawSVG: "0% 100%"`; strokes only (no fills) |
| Animate layout changes (grid reorder, expand card, reparent) | **Flip** | Record → change DOM → `Flip.from(state)` |
| Draggable element / spinner / slider / throw | **Draggable** (+ **Inertia**) | `type: 'x,y' \| 'rotation' \| 'scroll'`, bounds, snap |
| Momentum after release, velocity-based tween to rest | **InertiaPlugin** | `inertia: { x: 'auto' }`; powers Draggable throw |
| Normalise wheel / touch / pointer / scroll intent | **Observer** | Fullpage-slider logic without scrolling the page |
| Move along an SVG path | **MotionPath** (+ **MotionPathHelper**) | `motionPath: { path, align, autoRotate }` |
| Scramble / decode text effect | **ScrambleText** | `scrambleText: { text, chars, speed }` |
| Typewriter / swap text content | **TextPlugin** | `text: "new content"` |
| Smooth-scroll to a position/element | **ScrollTo** | `scrollTo: { y: '#id', offsetY: 80 }` |
| Smooth scrolling + `data-speed`/`data-lag` parallax | **ScrollSmoother** | Requires ScrollTrigger; don't pair with Lenis |
| Custom ease from SVG path / curve | **CustomEase** | `CustomEase.create('hop', 'M0,0 C…')` |
| Bouncy/wiggly eases | **CustomBounce**, **CustomWiggle** | Need CustomEase registered |
| Extra eases (`rough`, `slow`, `expoScale`) | **EasePack** | |
| Gravity/velocity/angle particles | **Physics2D**, **PhysicsProps** | |
| Visual scrubber for timelines while building | **GSDevTools** | Dev only — never ship |
| Animate PixiJS / EaselJS display objects | **PixiPlugin**, **EaselPlugin** | |
| Animate pseudo-elements via stylesheet rules | **CSSRulePlugin** | `::before/::after` |
| Scroll-linked anything | **ScrollTrigger** | Own skill: `gsap-scrolltrigger` |

## 3. Patterns that work (verified against 3.15.0)

Every snippet below runs in `templates/plugin-gallery.html` (headless-tested: 0 errors).

### SplitText — reveal with masks (v3.13+ API)

```js
gsap.registerPlugin(SplitText, ScrollTrigger)
document.fonts.ready.then(() => {                       // split AFTER fonts load or lines wrap wrong
  SplitText.create('.headline', {
    type: 'lines, words',
    mask: 'lines',                                       // overflow-clip each line for the slide-up reveal
    autoSplit: true,                                     // re-split on resize / font change
    aria: 'auto',                                        // aria-label on parent, split pieces hidden
    onSplit(self) {
      return gsap.from(self.lines, {                     // RETURN the animation so autoSplit can revert+replay it
        yPercent: 110, stagger: 0.08, duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: self.elements[0], start: 'top 85%' }
      })
    }
  })
})
```

Key `Vars`: `type` (`'chars'|'words'|'lines'` comma list), `mask`, `autoSplit`, `onSplit(self)`, `onRevert`, `aria` (`auto|hidden|none`), `linesClass/wordsClass/charsClass` (use `"line++"` style indexed classes), `wordDelimiter`, `tag`, `propIndex` (adds `--char:1` CSS vars), `smartWrap`, `deepSlice`, `specialChars`, `reduceWhiteSpace`, `ignore`, `prepareText`. Instance: `.chars .words .lines .masks .elements .isSplit`, `revert()`, `split(vars)`.
Rules: never animate `lines` of text still waiting on webfonts; revert (`self.revert()`) before reading layout; for `chars` on long paragraphs prefer `words` (DOM weight); keep emoji/ligatures via `specialChars`.

### Flip — layout transitions

```js
gsap.registerPlugin(Flip)
const state = Flip.getState('.card')                    // 1. FIRST: record
container.classList.toggle('is-list')                   // 2. change the DOM/CSS however you like
Flip.from(state, {                                      // 3. LAST+INVERT+PLAY
  duration: 0.7, ease: 'power2.inOut', absolute: true, stagger: 0.04,
  onEnter: el => gsap.fromTo(el, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }),
  onLeave: el => gsap.to(el, { opacity: 0, scale: 0 })
})
```

Also: `Flip.to`, `Flip.fit(from, to, vars)`, `Flip.batch(id)`, `Flip.makeAbsolute`, `Flip.isFlipping`, `Flip.killFlipsOf`, `Flip.getByTarget`, `Flip.convertCoordinates`. State vars: `props` (extra CSS props to track), `simple`. Use `data-flip-id` to match elements that are re-created.

### DrawSVG + MotionPath + MorphSVG

```js
gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin)
gsap.from('#line', { drawSVG: 0, duration: 1.2, ease: 'power2.out' })           // "0% 100%" syntax also works
gsap.to('#dot',  { motionPath: { path: '#route', align: '#route', alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 4, ease: 'none' })
gsap.to('#blob', { morphSVG: { shape: '#star', shapeIndex: 'auto', map: 'complexity' }, duration: 1 })
```

MorphSVG vars: `shape`, `type` (`'linear'|'rotational'`), `origin`, `shapeIndex` (number | `'auto'` | array), `map` (`size|position|complexity`), `precompile`, `render`, `updateTarget`. Utilities: `MorphSVGPlugin.convertToPath`, `normalizeStrings`, `stringToRawPath`, `rawPathToString`. MotionPath vars: `path`, `align`, `alignOrigin`, `autoRotate`, `curviness`, `start`, `end`, `offsetX/Y`, `relative`, `resolution`, `type: 'cubic'`.

### Draggable + Inertia, Observer

```js
gsap.registerPlugin(Draggable, InertiaPlugin, Observer)
Draggable.create('.knob', { type: 'rotation', inertia: true, snap: v => Math.round(v / 45) * 45 })
Draggable.create('.card',  { type: 'x,y', bounds: '.board', edgeResistance: 0.8, inertia: true })

Observer.create({                                       // slide controller without touching native scroll
  target: window, type: 'wheel,touch,pointer', tolerance: 12, preventDefault: true,
  onUp: () => go(+1), onDown: () => go(-1)
})
```

Draggable options worth knowing: `bounds`, `inertia`, `snap` / `liveSnap`, `edgeResistance`, `dragResistance`, `lockAxis`, `trigger`, `allowNativeTouchScrolling`, `autoScroll`, `zIndexBoost`, `minimumMovement`, `cursor/activeCursor`, callbacks `onPress/onDragStart/onDrag/onDragEnd/onRelease/onThrowUpdate/onThrowComplete/onClick`. Observer: `type`, `tolerance`, `wheelSpeed`, `dragMinimum`, `lockAxis`, `ignore`, `allowClicks`, `debounce`, `onChangeX/Y`, `onUp/Down/Left/Right`, `onToggleX/Y`, `onStop` + `onStopDelay`. `Observer.getAll()`, `Observer.getById()`, `.kill()`, `.disable()/.enable()`.

### Text, ScrambleText, ScrollTo, CustomEase

```js
gsap.registerPlugin(TextPlugin, ScrambleTextPlugin, ScrollToPlugin, CustomEase)
gsap.to('.type',   { text: { value: 'Built for the Space Age', delimiter: '' }, duration: 2, ease: 'none' })
gsap.to('.decode', { scrambleText: { text: 'ACCESS GRANTED', chars: 'upperCase', speed: 0.6, revealDelay: 0.3 }, duration: 2 })
gsap.to(window,    { scrollTo: { y: '#pricing', offsetY: 80, autoKill: true }, duration: 1, ease: 'power2.inOut' })
CustomEase.create('hop', 'M0,0 C0.2,0 0.1,1 0.5,1.1 0.8,1.2 0.7,1 1,1')
gsap.to('.logo', { y: -40, ease: 'hop' })
```

ScrollTo: if Lenis/ScrollSmoother is active, scroll through *that* (`lenis.scrollTo`, `smoother.scrollTo`) so the smoother and the page agree.

### ScrollSmoother (needs ScrollTrigger)

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.2, effects: true, normalizeScroll: true })
// markup: <img data-speed="0.8"> (parallax) · <div data-lag="0.4"> (trailing)
```

Vars: `wrapper`, `content`, `smooth` (s), `smoothTouch`, `speed`, `effects` (`true` or selector/element), `effectsPrefix`, `effectsPadding`, `normalizeScroll`, `ignoreMobileResize`, `autoResize`, `ease`, `onUpdate/onStop/onFocusIn`. Statics: `ScrollSmoother.get()`, `.refresh()`. **One smoother only** — it is mutually exclusive with Lenis.

### GSDevTools (development only)

```js
GSDevTools.create({ animation: tl })  // remove before shipping — see "Ship checklist"
```

## 4. Reduced motion & responsive (non-negotiable)

Wrap plugin animations in `gsap.matchMedia()`:

```js
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => { /* SplitText reveals, Flip, scrambles, motion paths */ })
mm.add('(prefers-reduced-motion: reduce)', () => { gsap.set('.headline, .card', { clearProps: 'all' }) /* content visible, static */ })
```

Content must be **visible and readable without JS / when the CDN fails** — set the "hidden" start state from JS (`gsap.set` / `gsap.from`) rather than in CSS. Draggable/Observer need keyboard alternatives for anything functional. SplitText `aria: 'auto'` keeps screen readers on the original string.

## 5. Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Property does nothing / console warns the plugin is missing | Not registered (or imported after first use) | `gsap.registerPlugin(...)` at module scope |
| `ReferenceError: SplitText is not defined` via CDN | Plugin `<script>` before core or typo in path | Core first; exact `dist/<Name>.min.js` |
| Lines wrong / jump after load | Split before fonts loaded or on resize | `document.fonts.ready` + `autoSplit: true` + return tween from `onSplit` |
| Flip jumps / elements collapse | Absolute positioning side effects | `absolute: true`, set `data-flip-id`, keep `props` list tight |
| Draggable throw does nothing | InertiaPlugin not registered | Register `InertiaPlugin`, `inertia: true` |
| Scroll jitter / double smoothing | ScrollSmoother + Lenis, or two rAF loops | Pick one smoother |
| Pins offset after font/image load | Layout changed post-measure | `ScrollTrigger.refresh()` / `ScrollSmoother.refresh()` |
| React: animations stack on re-render | No cleanup | `useGSAP(() => {…}, { scope })`; revert SplitText in cleanup |
| Morph looks twisted | Point-count/start-point mismatch | Try `shapeIndex: 'auto'`, `map: 'position'`, `type: 'rotational'` |

## 6. Ship checklist

- [ ] Every plugin used is registered; none unused is imported (bundle size).
- [ ] `GSDevTools`, `MotionPathHelper`, ScrollTrigger `markers` removed.
- [ ] Reduced-motion branch present; no content hidden when JS/CDN fails.
- [ ] `ScrollTrigger.refresh()` after fonts/images/route change; kill/revert on unmount.
- [ ] Only transforms/opacity animated for scroll-linked work; `will-change` limited.
- [ ] CDN version pinned (`gsap@3.15.0`), not `@latest`.

## Space Age integration

- `cinematic-website-builder` v3 modules are built on GSAP 3.15 — use this skill when authoring or extending a module that needs SplitText/Flip/DrawSVG/Observer.
- `design-motion-principles` — restraint rules decide *whether* an effect belongs; this skill decides *how* to build it.
- `animation-vocabulary` — if the user only describes the motion ("the letters slide up from a mask"), name it first, then pick the plugin from §2.
- `lenis-smooth-scroll` — smooth scroll + ScrollTrigger recipe; do not combine with ScrollSmoother.
