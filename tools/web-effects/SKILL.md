---
name: web-effects
description: Master index for web animation and scroll effects — covers GSAP (tweens, timelines, ScrollTrigger, plugins), ScrollReveal (viewport entrance animations), Trigger.js (CSS-variable scroll binding), WOW.js (Animate.css on scroll), and React Reveal (declarative React scroll components). Use this skill to choose the right library and get directed to the relevant sub-skill.
license: MIT
---

# Web Effects — Library Selector

## Choosing the Right Library

| Need | Recommended Library |
|------|---------------------|
| Complex timelines, sequencing, runtime control (pause/reverse) | **GSAP** |
| Scroll-driven animation tied to exact scroll position (scrub) | **GSAP + ScrollTrigger** |
| Cinematic pinned sections, parallax, SVG morphing | **GSAP** (supercharged) |
| React components with clean JSX animation API | **React Reveal** or **GSAP (gsap-react)** |
| Simple scroll-in entrances, fade/slide/scale, CSS keyframes | **ScrollReveal** or **WOW.js** |
| CSS-variable-driven scroll effects, zero JavaScript animation code | **Trigger.js** |
| Project already uses Animate.css | **WOW.js** |
| Need full programmatic control in React | **GSAP + gsap-react skill** |

## Quick Decision Tree

```
Scroll animation needed?
├── Yes, tied to exact scroll position (scrub/progress) → GSAP ScrollTrigger
├── Yes, complex timeline (multiple steps, pin, snap) → GSAP ScrollTrigger + Timeline
├── Yes, simple entrance (fade/slide on enter) →
│   ├── In React (JSX component API) → React Reveal
│   ├── Has Animate.css → WOW.js
│   └── Plain JS/vanilla → ScrollReveal
├── Yes, CSS-only (no animation code) → Trigger.js
└── No, just UI animation (hover, transition, interactive) → GSAP Core
```

## Sub-Skills Reference

### GSAP
- `gsap-core` — Tweens, easing, stagger, transforms, matchMedia
- `gsap-timeline` — Sequencing, labels, position parameter
- `gsap-scrolltrigger` — Scroll-linked animation, scrub, pin, snap, batch
- `gsap-plugins` — Flip, Draggable, MorphSVG, SplitText, DrawSVG, Physics2D
- `gsap-react` — useGSAP hook, gsap.context(), cleanup
- `gsap-performance` — will-change, GPU compositing, ticker, profiling
- `gsap-utils` — gsap.utils (mapRange, clamp, wrap, distribute, etc.)
- `gsap-supercharged` — Scroll storytelling, text reveals, shape morphing, page transitions

### ScrollReveal
- `scrollreveal-core` — reveal(), sync(), clean(), all config options
- `scrollreveal-advanced` — Sequences, dynamic content, Next.js patterns

### Trigger.js
- `triggerjs-core` — tg-* attributes, CSS variable binding, value mapping

### WOW.js
- `wow-core` — init(), data-wow-* attributes, Animate.css v4 compat, React usage

### React Reveal
- `react-reveal-core` — All components, props, cascade, SSR, Next.js App Router

## Library Comparison Matrix

| Feature | GSAP | ScrollReveal | Trigger.js | WOW.js | React Reveal |
|---------|------|-------------|-----------|--------|-------------|
| Scrubbed scroll | ✅ | ❌ | ✅ (CSS) | ❌ | ❌ |
| Timeline/sequencing | ✅ | ❌ | ❌ | ❌ | Limited |
| Pinned sections | ✅ | ❌ | ❌ | ❌ | ❌ |
| React component API | ✅ (hook) | Wrapper needed | ❌ | Wrapper | ✅ Native |
| No-JS animation | ❌ | ❌ | ✅ | ❌ | ❌ |
| SVG animation | ✅ | ❌ | ❌ | ❌ | ❌ |
| Built-in stagger | ✅ | ✅ (interval) | ❌ | Manual | ✅ (cascade) |
| Bundle size | ~70kb | ~12kb | ~8kb | ~5kb | ~30kb |
| Prefers-reduced-motion | ✅ (matchMedia) | Manual | Manual | Manual | Manual |
| SSR safe | ✅ | Guard needed | ❌ | ❌ | ✅ |

## Stack Recommendations for Space Age Agent OS (Next.js)

**Best combos for this project:**

1. **GSAP + ScrollTrigger + SplitText** — cinematic hero sections, dashboard reveals, text choreography
2. **GSAP + Flip** — layout transitions between views (MissionControl ↔ detail pages)
3. **React Reveal** — card/panel entrances in agent views (fast to implement)
4. **Trigger.js** — CSS progress bars, scroll-linked data visualizations without animation overhead
5. **GSAP ScrollSmoother** — smooth the entire page scroll for the glassmorphism aesthetic

## Common Animation Recipes

### Hero text stagger (GSAP + SplitText)
→ See `gsap-supercharged` skill, section 2

### Cards fade-in grid (React Reveal)
→ `<Fade bottom cascade>` wrapping a card grid

### Scroll progress indicator (Trigger.js)
→ `tg-name="prog" tg-from="0" tg-to="100"` + `width: calc(var(--prog) * 1%)`

### Scroll-triggered section reveals (ScrollReveal)
→ `sr.reveal('.section', { origin: 'bottom', distance: '40px', interval: 100 })`

### Pinned parallax storytelling (GSAP)
→ See `gsap-supercharged` skill, section 1
