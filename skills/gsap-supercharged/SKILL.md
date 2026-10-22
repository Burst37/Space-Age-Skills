---
name: gsap-supercharged
description: Advanced GSAP patterns beyond the basics — scroll storytelling, SplitText text reveals, MorphSVG shape transitions, Flip layout animation, Draggable, Physics2D, custom easing with CustomEase, data-driven animations, parallax rigs, stagger choreography, and multi-scene pinned sequences. Use when the user needs cinematic, production-grade web effects that go beyond simple tweens and ScrollTrigger basics.
license: MIT
---

# GSAP Supercharged

## When to Use This Skill

Apply when basic `gsap.to()` and ScrollTrigger are not sufficient. This skill covers advanced animation patterns, premium plugin usage, and production-grade choreography techniques used in award-winning websites.

**Prerequisites:** `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`.

## 1. Cinematic Scroll Storytelling (Pinned Multi-Scene)

Pin a full-viewport wrapper and sequence scenes through it as the user scrolls:

```javascript
gsap.registerPlugin(ScrollTrigger);

const scenes = gsap.utils.toArray('.scene');
const wrapper = document.querySelector('.story-wrapper');

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: wrapper,
    start: 'top top',
    end: () => `+=${scenes.length * window.innerHeight * 1.5}`,
    pin: true,
    scrub: 1,
    snap: { snapTo: 1 / (scenes.length - 1), duration: 0.5, ease: 'power2.inOut' }
  }
});

scenes.forEach((scene, i) => {
  if (i > 0) tl.fromTo(scene, { autoAlpha: 0, y: '100%' }, { autoAlpha: 1, y: '0%', duration: 1 }, i);
});
```

## 2. SplitText Character/Word/Line Reveals

```javascript
gsap.registerPlugin(SplitText);

const split = new SplitText('.headline', { type: 'chars,words,lines' });

// Characters stagger from blur to sharp
gsap.from(split.chars, {
  duration: 0.8,
  opacity: 0,
  y: '120%',
  rotationX: -90,
  stagger: { amount: 0.5, from: 'random' },
  ease: 'back.out(1.7)',
  scrollTrigger: { trigger: '.headline', start: 'top 80%' }
});

// Cleanup when done (restores original HTML)
// split.revert();
```

**Line mask reveal (clean newspaper style):**

```javascript
const split = new SplitText('.tagline', { type: 'lines', linesClass: 'line-wrapper' });

// Wrap each line in an overflow:hidden container
document.querySelectorAll('.line-wrapper').forEach(line => {
  line.style.overflow = 'hidden';
});

gsap.from(split.lines, {
  y: '100%',
  duration: 1,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.tagline', start: 'top 75%' }
});
```

## 3. MorphSVG — Shape Morphing

```javascript
gsap.registerPlugin(MorphSVGPlugin);

// Morph between two SVG paths on hover
const morph = gsap.to('#shape', {
  morphSVG: '#target-shape',
  duration: 0.8,
  ease: 'power2.inOut',
  paused: true
});

document.querySelector('#shape').addEventListener('mouseenter', () => morph.play());
document.querySelector('#shape').addEventListener('mouseleave', () => morph.reverse());
```

**SVG icon transitions (hamburger → X):**

```javascript
const openTl = gsap.timeline({ paused: true });
openTl
  .to('#bar-top',    { morphSVG: '#close-top', duration: 0.4 })
  .to('#bar-middle', { autoAlpha: 0, duration: 0.2 }, '<')
  .to('#bar-bottom', { morphSVG: '#close-bottom', duration: 0.4 }, '<');
```

## 4. Flip — Layout Transition Animation

```javascript
gsap.registerPlugin(Flip);

// Capture current state before DOM change
const state = Flip.getState('.cards .card');

// Change layout (e.g. filter, reorder)
container.classList.toggle('grid');

// Animate from old positions to new
Flip.from(state, {
  duration: 0.7,
  ease: 'power1.inOut',
  stagger: 0.05,
  absolute: true,     // elements become absolute during transition
  onLeave: els => gsap.to(els, { autoAlpha: 0, duration: 0.2 }),
  onEnter: els => gsap.from(els, { autoAlpha: 0, duration: 0.3 })
});
```

**Expanding card to full-screen modal:**

```javascript
const card = document.querySelector('.card.selected');
const modal = document.querySelector('.modal');

const state = Flip.getState([card, modal]);
modal.appendChild(card);
modal.classList.add('open');

Flip.from(state, {
  duration: 0.6,
  ease: 'power2.inOut',
  nested: true,
  prune: true
});
```

## 5. CustomEase — Signature Motion Curves

```javascript
gsap.registerPlugin(CustomEase);

// Create reusable brand eases
CustomEase.create('brand-enter', 'M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,0.963 0.362,1 0.37,1.037 0.414,1.099 0.468,1.099 0.522,1.099 0.564,1.033 0.572,1 0.582,0.965 0.616,0.906 0.625,0.906 0.638,0.906 0.648,0.956 0.65,1 0.651,1.022 0.671,1.041 0.689,1.041 0.703,1.041 0.726,1.013 0.736,1 0.771,0.948 0.806,0.913 0.818,0.913 0.836,0.913 0.855,0.95 0.861,1 0.868,1.053 0.896,1.019 0.907,1 0.947,0.93 1,1 1,1');

gsap.to('.hero-card', {
  y: 0, autoAlpha: 1, duration: 1.4, ease: 'brand-enter'
});
```

## 6. Parallax Rig (Multiple Layers)

```javascript
const layers = [
  { el: '.layer-bg',   speed: 0.2 },
  { el: '.layer-mid',  speed: 0.5 },
  { el: '.layer-fg',   speed: 0.8 },
  { el: '.layer-text', speed: 1.2 },
];

layers.forEach(({ el, speed }) => {
  gsap.to(el, {
    yPercent: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
});
```

## 7. Stagger Choreography (Grid Wave)

```javascript
const items = gsap.utils.toArray('.grid-item');

// Wave from center outward
gsap.from(items, {
  duration: 0.8,
  scale: 0,
  autoAlpha: 0,
  stagger: {
    amount: 1.2,
    grid: 'auto',
    from: 'center',
    ease: 'power2.inOut'
  },
  ease: 'back.out(1.7)',
  scrollTrigger: { trigger: '.grid', start: 'top 70%' }
});
```

## 8. Magnetic Hover Effect

```javascript
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.3;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.3;
    gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  });
});
```

## 9. Scroll-Linked Number Counter

```javascript
const counters = gsap.utils.toArray('[data-count]');

counters.forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const obj = { value: 0 };

  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = Math.round(obj.value).toLocaleString();
    },
    scrollTrigger: { trigger: el, start: 'top 80%', once: true }
  });
});
```

## 10. Page Transition (SPA / Next.js)

```javascript
// Transition out on navigate
export async function pageTransitionOut() {
  return gsap.timeline()
    .to('.page-overlay', { scaleY: 1, transformOrigin: 'bottom', duration: 0.5, ease: 'power4.inOut' })
    .set('.page-content', { autoAlpha: 0 });
}

// Transition in after new page mounts
export function pageTransitionIn() {
  return gsap.timeline()
    .set('.page-overlay', { transformOrigin: 'top' })
    .set('.page-content', { autoAlpha: 1 })
    .to('.page-overlay', { scaleY: 0, duration: 0.5, ease: 'power4.inOut' })
    .from('.page-content > *', { y: 30, autoAlpha: 0, stagger: 0.08, ease: 'power3.out' }, '-=0.2');
}
```

## 11. SVG Path Drawing (DrawSVGPlugin)

```javascript
gsap.registerPlugin(DrawSVGPlugin);

// Draw SVG path from 0% to 100% on scroll
gsap.from('.svg-path', {
  drawSVG: '0%',
  duration: 2,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '.svg-container',
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: 1
  }
});

// Animate a specific segment
gsap.to('.svg-path', { drawSVG: '25% 75%', duration: 1.5 });
```

## 12. Physics2D — Particle/Confetti

```javascript
gsap.registerPlugin(Physics2DPlugin);

function burst(x, y) {
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('div');
    dot.className = 'particle';
    document.body.appendChild(dot);
    gsap.set(dot, { x, y });
    gsap.to(dot, {
      physics2D: {
        velocity: Math.random() * 500 + 200,
        angle: Math.random() * 360,
        gravity: 1000,
        friction: 0.1
      },
      duration: Math.random() * 1.5 + 0.8,
      autoAlpha: 0,
      ease: 'none',
      onComplete: () => dot.remove()
    });
  }
}

document.querySelector('.btn').addEventListener('click', (e) => burst(e.clientX, e.clientY));
```

## 13. ScrollSmoother Integration

```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.5,       // seconds to "catch up" to native scroll
  effects: true,     // enable data-speed and data-lag on child elements
  normalizeScroll: true  // prevent mobile address bar from triggering resize
});

// Parallax via data-speed attribute (HTML side)
// <img data-speed="0.5"> — slower scroll
// <img data-speed="1.5"> — faster scroll
// <div data-lag="0.3">  — lag behind scroll by 300ms
```

## Performance Checklist for Complex Animations

- ✅ Animate `transform` and `opacity` only (GPU-composited); never `width`, `height`, `top`, `left`
- ✅ Use `will-change: transform` sparingly — only on elements with active heavy animations
- ✅ Kill ScrollTrigger instances when navigating away in SPAs
- ✅ Use `gsap.matchMedia()` to disable/reduce animations at small viewports and `prefers-reduced-motion`
- ✅ Batch DOM reads/writes — GSAP batches internally but avoid forcing layout between animations
- ✅ Use `gsap.ticker.lagSmoothing(500, 33)` to handle tab refocus lag spikes gracefully
- ✅ For 100+ element staggers, use `gsap.context()` for easy cleanup
- ✅ In React, always use `useGSAP()` hook (from `@gsap/react`) or `gsap.context()` with cleanup
