---
name: scrollreveal-advanced
description: Advanced ScrollReveal patterns — orchestrating multi-element sequences, custom easing, viewport offset tuning, dynamic content sync, and combining with CSS custom properties for hybrid scroll animations. Use when base scrollreveal-core patterns are not sufficient for complex page choreography.
license: MIT
---

# ScrollReveal Advanced

## When to Use This Skill

Apply when coordinating multiple reveal groups, animating in precise sequences, using ScrollReveal alongside CSS animations, or when you need fine control over viewport detection. For per-pixel scrubbed animation, switch to GSAP ScrollTrigger.

**Related skills:** `scrollreveal-core` for fundamentals.

## Orchestrating Sequences

Chain multiple `reveal()` calls for a cinematic page entrance:

```javascript
const sr = ScrollReveal({ duration: 700, easing: 'ease-out', distance: '30px' });

// Hero: stagger headline + sub + CTA from different origins
sr.reveal('.hero-title',   { origin: 'left',   delay: 0 });
sr.reveal('.hero-subtitle',{ origin: 'bottom', delay: 150 });
sr.reveal('.hero-cta',     { origin: 'bottom', delay: 300, scale: 0.9 });

// Feature grid: stagger cards with increasing delays
sr.reveal('.feature-card', { origin: 'bottom', interval: 100 });

// Split layout: image left, text right simultaneously
sr.reveal('.split-image',  { origin: 'left',  distance: '60px' });
sr.reveal('.split-text',   { origin: 'right', distance: '60px' });
```

## Viewport Offset Tuning

`viewOffset` trims the logical viewport, making elements animate earlier or later:

```javascript
// Animate when element is 100px above the bottom of the viewport (earlier trigger)
sr.reveal('.early-reveal', { viewOffset: { bottom: 100 } });

// Only animate when element is entirely in a narrow central band
sr.reveal('.center-reveal', { viewOffset: { top: 200, bottom: 200 } });
```

## Custom Cubic-Bezier Easing

Pass any CSS `cubic-bezier()` string:

```javascript
// Spring-like overshoot
sr.reveal('.spring-card', { easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', distance: '40px' });

// Sharp deceleration
sr.reveal('.decel', { easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)', duration: 900 });
```

## Combine with CSS Custom Properties

Use `afterReveal` to set a CSS variable that drives a follow-up CSS animation:

```javascript
sr.reveal('.chart-bar', {
  duration: 600,
  afterReveal(el) {
    el.style.setProperty('--bar-fill', el.dataset.value + '%');
    el.classList.add('animate-bar');
  }
});
```

```css
.chart-bar { --bar-fill: 0%; }
.chart-bar.animate-bar { transition: width 1s ease-out; width: var(--bar-fill); }
```

## Dynamic Content (Infinite Scroll / SPA Navigation)

```javascript
const sr = ScrollReveal({ origin: 'bottom', distance: '20px', duration: 500 });
sr.reveal('.feed-item');

// When new posts load:
async function loadMorePosts() {
  const html = await fetchPosts();
  container.insertAdjacentHTML('beforeend', html);
  sr.sync(); // picks up new .feed-item elements
}
```

In a Next.js App Router project, re-run `reveal()` after route changes using `usePathname`:

```javascript
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RevealOnRoute() {
  const path = usePathname();
  useEffect(() => {
    let sr;
    import('scrollreveal').then(({ default: ScrollReveal }) => {
      sr = ScrollReveal({ origin: 'bottom', distance: '30px', duration: 600 });
      sr.reveal('[data-reveal]');
    });
    return () => sr?.destroy();
  }, [path]);
  return null;
}
```

## Parallel Track Choreography

Reveal elements on two parallel tracks for a split-screen effect:

```javascript
const leftTrack  = { origin: 'left',  distance: '80px', duration: 900, easing: 'ease-out' };
const rightTrack = { origin: 'right', distance: '80px', duration: 900, easing: 'ease-out' };

document.querySelectorAll('.row').forEach((row, i) => {
  sr.reveal(row.querySelector('.col-text'),  i % 2 === 0 ? leftTrack : rightTrack);
  sr.reveal(row.querySelector('.col-image'), i % 2 === 0 ? rightTrack : leftTrack);
});
```

## Combining ScrollReveal with GSAP

Use ScrollReveal for element entrances; use GSAP for interactive or timeline animations after entry:

```javascript
sr.reveal('.animated-counter', {
  afterReveal(el) {
    // Fire a GSAP counter animation after reveal
    gsap.to({ val: 0 }, {
      val: parseInt(el.dataset.target),
      duration: 2,
      ease: 'power2.out',
      onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); }
    });
  }
});
```

## Reduced Motion Utility

Centralized guard for accessible reveals:

```javascript
const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sr = ScrollReveal();

function revealIfMotion(targets, options = {}) {
  if (motion) {
    sr.reveal(targets, options);
  }
  // else elements remain visible at full opacity immediately
}

revealIfMotion('.hero-title', { origin: 'bottom', distance: '40px' });
```

## Performance Notes

- ScrollReveal uses `IntersectionObserver` internally — low CPU overhead vs. scroll-event listeners.
- Avoid `reset: true` on many elements simultaneously; toggling visibility on dozens of elements per scroll direction change can cause layout thrash.
- Set `viewFactor: 0.1` (10% visible) as a minimum so elements don't pop in at the viewport edge on slow connections.
- Group elements by identical config into one `reveal()` call — one observer per selector is more efficient than many `reveal()` calls for individual elements.
