---
name: design-motion-principles
description: >
  Space Age motion OS. Enforces GSAP + Lenis production standards, scroll choreography,
  reduced-motion fallbacks, and anti-slop motion audit. Load before any animation spec,
  GSAP implementation, or frontend motion review. Based on Emil/Jakub/Jhey motion framework
  and VL-01 motion layer.
---

# Design Motion Principles OS

## VL-01 Motion Layer (Default)

```javascript
// Canonical GSAP + Lenis bootstrap — every Space Age site
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

## Motion Philosophy (Emil/Jakub/Jhey Framework)

**Three principles:**
1. Motion reveals structure — animation shows hierarchy, not decoration
2. Entry > idle > exit — every element has a lifecycle
3. Scroll-driven > time-driven — tie motion to user intent

## Motion Hierarchy

| Layer | What It Controls | GSAP Tool |
|---|---|---|
| Macro | Page-level camera, parallax depth | ScrollTrigger scrub |
| Section | Reveal choreography, stagger entrance | ScrollTrigger start/end |
| Component | Individual element lifecycle | gsap.from/to/fromTo |
| Micro | Hover, click, focus feedback | gsap.to with short duration |

## Motion Vocabulary

| Motion | GSAP Pattern | Duration | Ease |
|---|---|---|---|
| Hero entrance | gsap.from(el, {y:60, opacity:0}) | 0.8s | power3.out |
| Stagger reveal | gsap.from(els, {y:40, opacity:0, stagger:0.12}) | 0.6s | power2.out |
| Parallax depth | gsap.to(el, {y: "-20%", ease:"none", scrollTrigger:{scrub:true}}) | scrub | none |
| Pinned section | ScrollTrigger pin:true, scrub:1 | scrub | none |
| Kinetic type | SplitText + gsap.from(chars, {y:100, stagger:0.02}) | 0.5s | expo.out |
| Section exit | gsap.to(el, {opacity:0, y:-30}) | 0.4s | power2.in |

## Canonical ScrollTrigger Patterns

```javascript
// Reveal on scroll — standard
gsap.from('.reveal', {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.reveal',
    start: 'top 85%',
    end: 'top 40%',
    toggleActions: 'play none none reverse'
  }
});

// Pinned horizontal scroll
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.gallery',
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => `+=${document.querySelector('.gallery-track').scrollWidth}`
  }
});

// Parallax depth
gsap.utils.toArray('.parallax').forEach(el => {
  gsap.to(el, {
    y: () => el.getAttribute('data-speed') * -100,
    ease: 'none',
    scrollTrigger: { trigger: el, scrub: true }
  });
});

// Cleanup (CRITICAL — prevent memory leaks)
// In React/Next.js:
useEffect(() => {
  const ctx = gsap.context(() => { /* animations here */ });
  return () => ctx.revert();
}, []);
```

## Reduced Motion Law (Non-Negotiable)

```javascript
// Always implement this check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Full animation
  gsap.from('.hero-text', { y: 80, opacity: 0, duration: 1, ease: 'power3.out' });
} else {
  // Instant reveal fallback
  gsap.set('.hero-text', { opacity: 1 });
}
```

## Lenis + GSAP Integration Rules

- Always call `lenis.raf()` inside `gsap.ticker.add()` — not in a separate `requestAnimationFrame`
- `gsap.ticker.lagSmoothing(0)` prevents jank on background tabs
- For Next.js App Router: initialize Lenis in a client component with `'use client'`
- Destroy Lenis on cleanup: `lenis.destroy()` in useEffect return
- Do NOT use both Lenis and native `scroll-behavior: smooth` — they conflict

## Motion Spec Table Template

```markdown
| Section | Element | Motion | Trigger | Duration | Ease |
|---|---|---|---|---|---|
| Hero | Headline | Slide up + fade | Page load | 0.8s | power3.out |
| Hero | Subhead | Slide up + fade | +0.15s delay | 0.7s | power3.out |
| Hero | CTA | Fade in | +0.3s delay | 0.6s | power2.out |
| Section 2 | Cards | Stagger reveal | Scroll 85% | 0.6s×0.12 | power2.out |
| Gallery | Track | Horizontal scroll | Pin scrub | scrub:1 | none |
```

## Forbidden Motion Patterns

- `transition: all 0.3s ease` — too generic, causes layout thrash
- CSS `@keyframes` for scroll-tied animation — use GSAP ScrollTrigger
- `setInterval` for animation — use GSAP ticker
- Infinite rotation/pulse on body content — only for decorative BG elements
- `transform: translateZ(0)` everywhere — only on actually animated elements
- GSAP without cleanup in React — always use `gsap.context().revert()`

## Anti-Slop Motion Audit

Run this check before calling any motion work complete:

- [ ] All animations have reduced-motion fallback
- [ ] No `transition: all` in component CSS
- [ ] GSAP context cleanup present in all React components
- [ ] ScrollTrigger `toggleActions` specified (not default)
- [ ] Lenis initialized once at app root, not per-component
- [ ] Hero entrance total time < 1.2s
- [ ] No animation serves only decoration — each has conversion/storytelling purpose
- [ ] Mobile animations are lighter (reduce stagger, reduce distance)
- [ ] LCP element (hero image/headline) not delayed by animation
- [ ] `will-change` only on elements with active transforms
