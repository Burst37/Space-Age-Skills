# GSAP 3.15.0 plugin matrix

All 24 plugin modules from the repo, verified against `esm/*.js` (each header reads `3.15.0`). `gsap/all` re-exports every one of them (no members-only exclusions any more).

| Plugin | Named import (ESM) | UMD global | CDN (jsDelivr) | What it is |
|---|---|---|---|---|
| ScrollTrigger | `import { ScrollTrigger } from 'gsap/ScrollTrigger'` | `ScrollTrigger` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js` | Scroll-linked animation, pin, scrub, snap |
| ScrollSmoother | `import { ScrollSmoother } from 'gsap/ScrollSmoother'` | `ScrollSmoother` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollSmoother.min.js` | Smooth scroll + data-speed/data-lag effects (needs ScrollTrigger) |
| ScrollToPlugin | `import { ScrollToPlugin } from 'gsap/ScrollToPlugin'` | `ScrollToPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollToPlugin.min.js` | Tween scroll position; `ScrollToPlugin.max/offset/config` |
| Observer | `import { Observer } from 'gsap/Observer'` | `Observer` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Observer.min.js` | Unified wheel/touch/pointer/scroll intent |
| SplitText | `import { SplitText } from 'gsap/SplitText'` | `SplitText` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js` | chars / words / lines + masks, autoSplit, aria |
| TextPlugin | `import { TextPlugin } from 'gsap/TextPlugin'` | `TextPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/TextPlugin.min.js` | Replace/typewriter text |
| ScrambleTextPlugin | `import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'` | `ScrambleTextPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrambleTextPlugin.min.js` | Scramble/decode text |
| DrawSVGPlugin | `import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'` | `DrawSVGPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/DrawSVGPlugin.min.js` | Animate stroke length (`drawSVG`) |
| MorphSVGPlugin | `import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'` | `MorphSVGPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/MorphSVGPlugin.min.js` | Shape morph (`morphSVG`) + path utilities |
| MotionPathPlugin | `import { MotionPathPlugin } from 'gsap/MotionPathPlugin'` | `MotionPathPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/MotionPathPlugin.min.js` | Animate along a path (`motionPath`), coordinate conversion |
| MotionPathHelper | `import { MotionPathHelper } from 'gsap/MotionPathHelper'` | `MotionPathHelper` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/MotionPathHelper.min.js` | Interactive path editor (dev) |
| Flip | `import { Flip } from 'gsap/Flip'` | `Flip` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Flip.min.js` | FLIP layout transitions |
| Draggable | `import { Draggable } from 'gsap/Draggable'` | `Draggable` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Draggable.min.js` | Drag/rotate/scroll-drag, bounds, snap |
| InertiaPlugin | `import { InertiaPlugin } from 'gsap/InertiaPlugin'` | `InertiaPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/InertiaPlugin.min.js` | Momentum/throw; also exports `VelocityTracker` |
| CustomEase | `import { CustomEase } from 'gsap/CustomEase'` | `CustomEase` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/CustomEase.min.js` | Ease from SVG path/bezier data |
| CustomBounce | `import { CustomBounce } from 'gsap/CustomBounce'` | `CustomBounce` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/CustomBounce.min.js` | Bounce ease with squash (needs CustomEase) |
| CustomWiggle | `import { CustomWiggle } from 'gsap/CustomWiggle'` | `CustomWiggle` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/CustomWiggle.min.js` | Wiggle/shake ease (needs CustomEase) |
| EasePack | `import { EasePack } from 'gsap/EasePack'` | `EasePack` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/EasePack.min.js` | `rough`, `slow`, `expoScale` eases |
| Physics2DPlugin | `import { Physics2DPlugin } from 'gsap/Physics2DPlugin'` | `Physics2DPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Physics2DPlugin.min.js` | `physics2D` velocity/angle/gravity |
| PhysicsPropsPlugin | `import { PhysicsPropsPlugin } from 'gsap/PhysicsPropsPlugin'` | `PhysicsPropsPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/PhysicsPropsPlugin.min.js` | `physicsProps` per-property velocity/accel |
| GSDevTools | `import { GSDevTools } from 'gsap/GSDevTools'` | `GSDevTools` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/GSDevTools.min.js` | Timeline scrubber UI (dev only) |
| PixiPlugin | `import { PixiPlugin } from 'gsap/PixiPlugin'` | `PixiPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/PixiPlugin.min.js` | Animate PixiJS objects/filters |
| EaselPlugin | `import { EaselPlugin } from 'gsap/EaselPlugin'` | `EaselPlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/EaselPlugin.min.js` | Animate EaselJS objects |
| CSSRulePlugin | `import { CSSRulePlugin } from 'gsap/CSSRulePlugin'` | `CSSRulePlugin` | `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/CSSRulePlugin.min.js` | Animate stylesheet rules / pseudo-elements |

Notes:
- Core: `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js` (includes CSSPlugin, utils, most eases). `dist/all.js` bundles the lot; prefer per-plugin files in production.
- Default exports exist for every module (`import ScrollTrigger from 'gsap/ScrollTrigger'` also works), and `GSDevTools`/`SplitText` additionally have named exports.
- `gsap.registerPlugin(...)` takes any number of plugins; call it once at module scope. `CustomBounce`/`CustomWiggle` need `CustomEase` registered too: `gsap.registerPlugin(CustomEase, CustomBounce, CustomWiggle)`.
- Utilities in core (no plugin): `gsap.utils.{clamp,mapRange,interpolate,snap,wrap,wrapYoyo,random,shuffle,pipe,distribute,toArray,selector,normalize}` — see `gsap-core`.
- React: `@gsap/react` → `useGSAP()` (separate package, v2.x).
- Package: `"sideEffects": false`, `module: esm/index.js`, `main: dist/gsap.js`, `types: types/index.d.ts`.
- Bug reports/security: info@greensock.com (SECURITY.md; 72h response) or https://gsap.com/community.

## Property names each plugin adds to tweens

`drawSVG` · `morphSVG` · `motionPath` · `scrambleText` · `text` · `scrollTo` · `physics2D` · `physicsProps` · `inertia` · `pixi` · `easel` · `cssRule` (via CSSRulePlugin.getRule) · Draggable/Observer/Flip/SplitText/ScrollSmoother/ScrollTrigger use their own `create()` / static APIs.
