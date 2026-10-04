# Motion Craft — Easings, Durations, Patterns, Code

> The motion module says *what to decide*. This says *what the values are* and how to
> build it. Load whenever motion score ≥ 1.

## 1. Easing table

```css
:root {
  /* Standard — entering elements, most UI */
  --ease-out-quad:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic:   cubic-bezier(0.33, 1, 0.68, 1);
  --ease-out-quart:   cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);   /* the premium default */

  /* Exiting */
  --ease-in-cubic:    cubic-bezier(0.32, 0, 0.67, 0);
  --ease-in-quart:    cubic-bezier(0.5, 0, 0.75, 0);

  /* Both ends — position changes, morphs, shared-element transitions */
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);

  /* Character */
  --ease-back:        cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight overshoot */
  --ease-spring:      linear(0, 0.24 4%, 0.66 12%, 1.02 22%, 0.99 32%, 1);
  --ease-linear:      linear;                              /* scrub only */
}
```

**Selection:**
- `--ease-out-expo` — the workhorse for premium reveals. Fast start, long luxurious settle.
- `--ease-out-quart` — reveals that need to feel quick and confident.
- `--ease-in-out-quart` — anything moving from A to B on screen.
- `--ease-back` — playful products only. Never on a luxury or regulated brand.
- `linear` — **required** for scroll-scrubbed animation. Any other curve makes the
  animation lag the finger and feels broken.

## 2. Duration ladder

| Interaction | Duration |
|---|---|
| Hover / focus state | 120–200ms |
| Button press feedback | 80–120ms |
| Tooltip, small popover | 150–250ms |
| Dropdown, menu | 200–300ms |
| Modal, drawer, sheet | 300–450ms |
| Section reveal on scroll | 500–800ms |
| Hero entrance | 800–1400ms |
| Page transition | 400–700ms |
| Signature cinematic moment | 1000–2000ms |
| Ambient / looping | 4000ms+ |

**Distance scales duration.** An element moving 20px and one moving 400px should not share
a duration. Rough guide: `duration ≈ 200ms + (distance_px × 0.6)`, capped at the ladder.

**Exit is faster than enter** — usually 60–80% of the entrance duration. Users have
already decided; don't make them wait to leave.

## 3. Stagger math

```js
// Good: total sequence stays under ~1s even with many items.
gsap.from(".item", {
  y: 24, opacity: 0, duration: 0.6,
  ease: "expo.out",
  stagger: { each: 0.06, from: "start" }   // 0.04–0.08 for lists
});
```

| Item count | Stagger each |
|---|---|
| 2–4 | 0.08–0.12s |
| 5–8 | 0.05–0.08s |
| 9–15 | 0.03–0.05s |
| 16+ | use `stagger: { amount: 0.6 }` — fix the total, not the interval |

A stagger whose total exceeds ~1.2s reads as slow, not as choreographed.

## 4. Distance and amplitude

| Element | Travel |
|---|---|
| Body text, small UI | 8–16px |
| Cards, list items | 16–32px |
| Section blocks | 24–48px |
| Hero elements | 40–80px |
| Full-viewport reveal | mask/clip, not travel |

Scale: reveals from `0.94–0.98`, never from `0`. An element scaling from 0 reads as a
cartoon. Opacity: `0 → 1`, but pair it with *something* — opacity alone is the most
generic reveal in existence and is what "fade-up on everything" means.

**Parallax depth:** bound it. Foreground `0.9–1.0`, mid `0.75–0.9`, background
`0.5–0.75` of scroll speed. Anything below 0.5 detaches and reads as a bug.

## 5. GSAP ScrollTrigger patterns

Register once, and always clean up in React.

```js
gsap.registerPlugin(ScrollTrigger);
```

### Reveal on enter (the 90% case)
```js
gsap.utils.toArray("[data-reveal]").forEach((el) => {
  gsap.from(el, {
    y: 32, opacity: 0, duration: 0.8, ease: "expo.out",
    scrollTrigger: { trigger: el, start: "top 85%", once: true }
  });
});
```
`once: true` matters — re-animating on scroll-back is a tell of unconsidered work.

### Scrubbed scroll (linear, always)
```js
gsap.to(".panel-img", {
  scale: 1.15, ease: "none",
  scrollTrigger: {
    trigger: ".panel", start: "top bottom", end: "bottom top",
    scrub: 0.6                    // 0.5–1 smooths without lag; `true` is rigid
  }
});
```

### Pinned narrative
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".chapter", start: "top top",
    end: () => "+=" + (window.innerHeight * 2),   // function = recalculates on resize
    pin: true, scrub: 1, anticipatePin: 1,
    invalidateOnRefresh: true
  }
});
tl.to(".layer-a", { yPercent: -40, ease: "none" })
  .to(".layer-b", { opacity: 0, ease: "none" }, "<");
```
Pin rules: `anticipatePin: 1` prevents the jump on fast scroll · always
`invalidateOnRefresh` when using function-based values · never pin on mobile without
re-testing — pinned sections plus mobile URL-bar resize is the #1 source of scroll jank ·
call `ScrollTrigger.refresh()` after fonts load and after any late-loading media.

### Horizontal chapters
```js
const track = document.querySelector(".track");
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".h-section", start: "top top",
    end: () => "+=" + (track.scrollWidth - window.innerWidth),
    pin: true, scrub: 1, invalidateOnRefresh: true
  }
});
```
Always give horizontal sections a visible progress affordance. Users need to know the
scroll will end.

### Mask reveal (better than fade-up, same cost)
```css
.mask-line { display: block; overflow: hidden; }
.mask-line > span { display: block; transform: translateY(100%); }
```
```js
gsap.to(".mask-line > span", {
  y: 0, duration: 1, ease: "expo.out", stagger: 0.08,
  scrollTrigger: { trigger: ".mask-line", start: "top 85%", once: true }
});
```

### React cleanup — non-negotiable
```js
useGSAP(() => { /* animations */ }, { scope: containerRef });
// or:
useEffect(() => {
  const ctx = gsap.context(() => { /* ... */ }, containerRef);
  return () => ctx.revert();
}, []);
```

## 6. Lenis smooth scroll

Use only when the choreography genuinely benefits. It costs a dependency, it fights some
native behaviors, and on many sites it makes scrolling feel *worse*.

```js
const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
`duration` above ~1.4 feels like walking through syrup. Disable Lenis entirely under
`prefers-reduced-motion` and on touch devices where native momentum is better.

## 7. Reduced motion — the pattern

Not optional, and not "turn everything off." Preserve the *information*, remove the *movement*.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
```js
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function build() {
  ScrollTrigger.getAll().forEach(t => t.kill());
  gsap.set("[data-reveal]", { clearProps: "all" });
  if (reduced.matches) return;       // content is already visible in its final state
  /* build animations */
}
build();
reduced.addEventListener("change", build);
```

**Author the static state first.** If your CSS starts elements at `opacity: 0` and JS
reveals them, a reduced-motion user or a JS failure gets a blank page. Start visible;
animate *from* a state set in JS. This single rule prevents the most common catastrophic
motion bug.

## 8. Performance rules

- Animate `transform` and `opacity`. Anything else per-frame is a defect.
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow`,
  `filter: blur()` on scroll. For shadows animate a pseudo-element's opacity instead.
- `will-change` on at most 2–3 elements at a time; remove it after. It is not free.
- One GPU-heavy effect per viewport. Blur, backdrop-filter, large scale, and WebGL all count.
- `backdrop-filter` is expensive on mid-range Android. Cap the blurred area and test on a real device.
- Batch DOM reads before writes. GSAP does this; hand-rolled `scroll` listeners usually don't.
- If you hand-roll scroll, use `IntersectionObserver` or a `requestAnimationFrame`-throttled
  passive listener. Never an unthrottled `scroll` handler.
- Target sustained 60fps under scroll on a mid-tier device. Verify with a 4× CPU throttle
  in DevTools, not on your laptop.

## 9. Motion QA checklist
- [ ] Slow, fast, and reverse scroll all stable
- [ ] Resize mid-animation does not break layout (`invalidateOnRefresh`)
- [ ] Every scrub uses `ease: "none"`
- [ ] Static state authored in CSS; nothing invisible if JS fails
- [ ] `prefers-reduced-motion` verified in the browser, not assumed
- [ ] Mobile decision recorded per effect: keep / simplify / replace / remove
- [ ] No CLS caused by animation
- [ ] 60fps sustained at 4× CPU throttle
- [ ] Pinned sections re-tested after fonts and media load
- [ ] ≤ 3 signature moments, exactly 1 per viewport
