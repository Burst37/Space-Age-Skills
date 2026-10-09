# Lenis 1.3.26 — API reference

## Options (`new Lenis(options)`)

| Option | Type | Default | Notes |
|---|---|---|---|
| `wrapper` | HTMLElement \| Window | `window` | Scroll container |
| `content` | HTMLElement | `document.documentElement` | Usually wrapper's direct child |
| `eventsTarget` | HTMLElement \| Window | `wrapper` | Where wheel/touch are listened |
| `autoRaf` | boolean | `false` | Run own rAF loop |
| `autoResize` | boolean | `true` | ResizeObserver; if false call `.resize()` |
| `autoToggle` | boolean | `false` | Start/stop by wrapper `overflow` (needs CSS) |
| `anchors` | boolean \| ScrollToOptions | `false` | Smooth anchor links |
| `allowNestedScroll` | boolean | `false` | Auto-detect nested scrollers (DOM walk per event) |
| `prevent` | (node) => boolean | – | Predicate: true → don't smooth for that node |
| `virtualScroll` | (e) => boolean \| void | – | Mutate/veto events before use; `false` skips smoothing |
| `stopInertiaOnNavigate` | boolean | `false` | Stop inertia on internal link click |
| `naiveDimensions` | boolean | `false` | Naive size calc (perf cost) |
| `orientation` | 'vertical' \| 'horizontal' | `vertical` | Scroll axis |
| `gestureOrientation` | 'vertical' \| 'horizontal' \| 'both' | `vertical` | Input axis |
| `lerp` | number 0–1 | `0.1` | Smoothing intensity. Overrides duration/easing |
| `duration` | number (s) | `1.2` | Ignored if `lerp` set |
| `easing` | (t) => number | `Math.min(1, 1.001 - Math.pow(2, -10 * t))` | Ignored if `lerp` set |
| `smoothWheel` | boolean | `true` | Smooth wheel input |
| `wheelMultiplier` | number | `1` | |
| `syncTouch` | boolean | `false` | Smooth touch (unstable iOS < 16) |
| `syncTouchLerp` | number | `0.075` | |
| `touchInertiaExponent` | number | `1.7` | |
| `touchMultiplier` | number | `1` | |
| `infinite` | boolean | `false` | Needs `syncTouch` on touch |
| `overscroll` | boolean | `true` | Like CSS `overscroll-behavior` |
| `respectReducedMotion` | boolean | `true` | Keep true |

## Properties

`actualScroll` (browser value) · `animatedScroll` (current) · `targetScroll` · `scroll` (getter; handles infinite) · `velocity` · `lastVelocity` · `direction` (`1` down / `-1` up / `0` idle) · `progress` (0–1) · `limit` · `isScrolling` (`'smooth' | 'native' | false`) · `isStopped` · `isHorizontal` · `prefersReducedMotion` · `rootElement` · `className` · `dimensions` · `options` · `time`.

## Methods

| Method | Purpose |
|---|---|
| `raf(time)` | Advance one frame; `time` in **ms** |
| `scrollTo(target, opts)` | target: px \| selector \| `top/left/start/bottom/right/end` \| element. opts: `offset, lerp, duration, easing, immediate, lock, force, onComplete, userData` |
| `start()` / `stop()` | Resume / pause user scroll |
| `resize()` | Recompute sizes (needed if `autoResize:false`) |
| `on(event, fn)` | Subscribe; returns an unsubscribe function |
| `destroy()` | Remove everything |

## Events

- `scroll` → callback receives the Lenis instance
- `virtual-scroll` → `{ deltaX, deltaY, event }`

## HTML attributes

`data-lenis-prevent` · `data-lenis-prevent-wheel` · `data-lenis-prevent-touch` · `data-lenis-prevent-vertical` · `data-lenis-prevent-horizontal`
