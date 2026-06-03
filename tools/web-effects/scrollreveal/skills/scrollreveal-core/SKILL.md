---
name: scrollreveal-core
description: ScrollReveal skill — animate elements into view on scroll using IntersectionObserver. Use when animating elements as they enter/leave the viewport, creating scroll-reveal entrances, or when GSAP is not desired and CSS animation control is sufficient. Covers reveal(), sync(), clean(), destroy() and all config options.
license: MIT
---

# ScrollReveal Core

## When to Use This Skill

Apply when the user wants elements to animate in as they scroll into view without the overhead of GSAP. ScrollReveal is ideal for **entrance animations** (fade, slide, scale) that fire once or on each scroll pass. When the user needs **scrubbed scroll-linked** animation tied to exact scroll position, recommend GSAP ScrollTrigger instead.

**Related skills:** `scrollreveal-advanced` for orchestration and sequences; GSAP ScrollTrigger for scrubbed or complex scroll-driven animation.

## Installation

```bash
npm install scrollreveal
```

```javascript
// ES module
import ScrollReveal from 'scrollreveal';

// CDN
// <script src="https://unpkg.com/scrollreveal"></script>
```

## Core API

### Initialize

```javascript
const sr = ScrollReveal();
// With global defaults:
const sr = ScrollReveal({ reset: true, duration: 800, delay: 200 });
```

### reveal(targets, options?)

```javascript
sr.reveal('.hero-title', { origin: 'top', distance: '50px', duration: 1000 });
sr.reveal('.card', { interval: 100 }); // stagger each .card by 100ms
```

- **targets** — CSS selector string, element, NodeList, or array
- **options** — config object (see below); overrides global defaults for this call

### sync()

Call after dynamically adding elements to the DOM that match a previously-revealed selector:

```javascript
sr.reveal('.card');
// Later, after adding new cards to the DOM:
sr.sync();
```

### clean(targets)

Remove reveal config from targets (they snap to their final revealed state):

```javascript
sr.clean('.card');
```

### destroy()

Remove all ScrollReveal listeners and reset all elements:

```javascript
sr.destroy();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `origin` | String | `'bottom'` | Where the animation starts: `'top'`, `'bottom'`, `'left'`, `'right'` |
| `distance` | String | `'0px'` | How far elements travel. `'20px'`, `'5%'`, `'100px'` |
| `duration` | Number | `600` | Animation duration in ms |
| `delay` | Number | `0` | Delay before animation in ms |
| `interval` | Number | `0` | Stagger delay between multiple matched elements |
| `opacity` | Number | `0` | Starting opacity (0 = invisible → 1) |
| `scale` | Number | `1` | Starting scale. `0.85` creates a subtle grow-in effect |
| `rotate` | Object | `{x:0,y:0,z:0}` | Starting rotation in degrees per axis |
| `easing` | String | `'cubic-bezier(0.5, 0, 0, 1)'` | CSS easing string |
| `reset` | Boolean | `false` | Re-animate when element leaves AND re-enters viewport |
| `useDelay` | String | `'always'` | `'always'`, `'once'`, `'onload'` — when delay is applied |
| `viewFactor` | Number | `0.0` | 0–1: what fraction of element must be in viewport to trigger. `0.2` = 20% visible |
| `viewOffset` | Object | `{top:0,right:0,bottom:0,left:0}` | Shrink or expand the effective viewport area |
| `afterReveal` | Function | `undefined` | Callback after reveal animation completes |
| `afterReset` | Function | `undefined` | Callback after reset animation completes (only used with `reset: true`) |

## Common Patterns

### Fade up (entrance from below)

```javascript
sr.reveal('.section', {
  origin: 'bottom',
  distance: '40px',
  duration: 700,
  opacity: 0,
  easing: 'ease-out',
});
```

### Staggered cards

```javascript
sr.reveal('.card', {
  origin: 'bottom',
  distance: '30px',
  interval: 120,
  duration: 600,
});
```

### Slide in from left

```javascript
sr.reveal('.feature-text', { origin: 'left', distance: '60px', duration: 800 });
sr.reveal('.feature-image', { origin: 'right', distance: '60px', duration: 800 });
```

### Scale in

```javascript
sr.reveal('.badge', { scale: 0.75, duration: 500, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
```

### Trigger after 20% visible

```javascript
sr.reveal('.chart', { viewFactor: 0.2 });
```

### Reset on every pass

```javascript
sr.reveal('.ping-pong', { reset: true, origin: 'bottom', distance: '20px' });
```

## React Usage

Wrap reveals in `useEffect` and clean up on unmount:

```javascript
import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';

export function AnimatedSection() {
  useEffect(() => {
    const sr = ScrollReveal();
    sr.reveal('.reveal-item', { origin: 'bottom', distance: '30px', interval: 100 });
    return () => sr.destroy();
  }, []);

  return (
    <section>
      <h2 className="reveal-item">Title</h2>
      <p className="reveal-item">Paragraph</p>
    </section>
  );
}
```

## Next.js Usage

Avoid running ScrollReveal during SSR — check `typeof window`:

```javascript
'use client';
import { useEffect } from 'react';

export function Reveal({ children, className, options = {} }) {
  useEffect(() => {
    let sr;
    import('scrollreveal').then(({ default: ScrollReveal }) => {
      sr = ScrollReveal();
      sr.reveal(`.${className}`, options);
    });
    return () => sr?.destroy();
  }, []);

  return <div className={className}>{children}</div>;
}
```

## Accessibility

ScrollReveal does not automatically respect `prefers-reduced-motion`. Add this guard:

```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  sr.reveal('.animate-in', { origin: 'bottom', distance: '30px' });
}
```

## Official Best Practices

- ✅ Set global defaults on the `ScrollReveal()` constructor; per-element calls override them.
- ✅ Call `sr.sync()` after dynamically inserting elements that match a revealed selector.
- ✅ Use `interval` for stagger; it staggers the **delay**, not the duration.
- ✅ Destroy on component unmount in React/Next.js to prevent memory leaks.
- ✅ Guard with `prefers-reduced-motion` — ScrollReveal does not do this automatically.

## Do Not

- ❌ Run ScrollReveal on the server (SSR). Always guard with `typeof window !== 'undefined'` or in `useEffect`.
- ❌ Reveal elements that are already visible on page load (above the fold) unless you want an unnatural pop-in.
- ❌ Use `reset: true` on elements that contain forms or interactive content — resetting hides them again if the user scrolls away.
- ❌ Forget `sr.destroy()` in React cleanup — stale observers will fire on unmounted elements.
