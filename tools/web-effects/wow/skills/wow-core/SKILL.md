---
name: wow-core
description: WOW.js skill — trigger Animate.css classes when elements scroll into view. Zero-configuration scroll reveal using data attributes and Animate.css. Use when the project already uses Animate.css or when CSS keyframe animations on scroll are needed with minimal setup. For complex timelines or scrubbed animation, use GSAP.
license: MIT
---

# WOW.js Core

## When to Use This Skill

Apply when the user wants scroll-triggered CSS animations using Animate.css classes with minimal setup. WOW.js adds the `animated` class + a named animation class to elements when they enter the viewport. Use GSAP ScrollTrigger for timelines, scrubbed animation, or JavaScript-controlled effects.

## Installation

**Requires Animate.css:**

```bash
npm install wowjs animate.css
```

```html
<!-- CDN -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>
```

## Initialize

```javascript
import WOW from 'wowjs';

new WOW().init();

// Or with options:
new WOW({
  boxClass:     'wow',        // Triggered class (default: 'wow')
  animateClass: 'animated',   // Applied animation class (default: 'animated')
  offset:       100,          // Distance from bottom of viewport to trigger (px)
  mobile:       true,         // Animate on mobile
  live:         true,         // Watch DOM for new elements (MutationObserver)
  scrollContainer: null,      // Custom scroll container selector
}).init();
```

## HTML Markup

Add class `wow` + an Animate.css animation name to any element:

```html
<!-- Basic -->
<div class="wow fadeInUp">Fades in from below</div>

<!-- With delay and duration overrides -->
<div class="wow slideInLeft" data-wow-duration="1.5s" data-wow-delay="0.3s">Slides in</div>

<!-- With repeat and offset -->
<div class="wow bounceIn" data-wow-iteration="3" data-wow-offset="150">Bounces 3 times</div>
```

## data-wow-* Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-wow-duration` | Override animation duration | `"1s"`, `"500ms"` |
| `data-wow-delay` | Delay before animation starts | `"0.5s"`, `"200ms"` |
| `data-wow-offset` | px from bottom of viewport to trigger | `"200"` (triggers earlier) |
| `data-wow-iteration` | Number of animation repeats | `"2"`, `"infinite"` |

## Available Animate.css v4 Classes

### Attention Seekers
`bounce`, `flash`, `pulse`, `rubberBand`, `shakeX`, `shakeY`, `headShake`, `swing`, `tada`, `wobble`, `jello`, `heartBeat`

### Back Entrances
`backInDown`, `backInLeft`, `backInRight`, `backInUp`

### Bouncing Entrances
`bounceIn`, `bounceInDown`, `bounceInLeft`, `bounceInRight`, `bounceInUp`

### Fading Entrances
`fadeIn`, `fadeInDown`, `fadeInDownBig`, `fadeInLeft`, `fadeInLeftBig`, `fadeInRight`, `fadeInRightBig`, `fadeInUp`, `fadeInUpBig`, `fadeInTopLeft`, `fadeInTopRight`, `fadeInBottomLeft`, `fadeInBottomRight`

### Flippers
`flip`, `flipInX`, `flipInY`

### Lightspeed
`lightSpeedInRight`, `lightSpeedInLeft`

### Rotating Entrances
`rotateIn`, `rotateInDownLeft`, `rotateInDownRight`, `rotateInUpLeft`, `rotateInUpRight`

### Specials
`jackInTheBox`, `rollIn`

### Zoom Entrances
`zoomIn`, `zoomInDown`, `zoomInLeft`, `zoomInRight`, `zoomInUp`

## Stagger Using data-wow-delay

WOW.js doesn't have built-in stagger, but data attributes achieve the same effect:

```html
<div class="wow fadeInUp" data-wow-delay="0s">First</div>
<div class="wow fadeInUp" data-wow-delay="0.15s">Second</div>
<div class="wow fadeInUp" data-wow-delay="0.3s">Third</div>
<div class="wow fadeInUp" data-wow-delay="0.45s">Fourth</div>
```

Or generate delays dynamically:

```javascript
document.querySelectorAll('.card').forEach((el, i) => {
  el.classList.add('wow', 'fadeInUp');
  el.dataset.wowDelay = `${i * 0.1}s`;
});
new WOW().init();
```

## React / Next.js Usage

WOW.js requires the browser; always initialize client-side:

```javascript
'use client';
import { useEffect } from 'react';
import 'animate.css';

export function WowProvider({ children }) {
  useEffect(() => {
    import('wowjs').then(({ default: WOW }) => {
      new WOW({ live: false }).init();
    });
  }, []);
  return <>{children}</>;
}
```

Then annotate elements:

```jsx
<div className="wow fadeInLeft" data-wow-duration="0.8s">
  Content
</div>
```

## Custom Animate.css v4 Compatibility

Animate.css v4 dropped the `animated` prefix requirement. WOW.js defaults to the old `animated` class. For v4, configure:

```javascript
new WOW({ animateClass: 'animate__animated' }).init();
```

And use `animate__` prefixed class names:

```html
<div class="wow animate__fadeInUp">...</div>
```

## Accessibility

WOW.js does not respect `prefers-reduced-motion`. Add this guard:

```javascript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  new WOW().init();
}
```

Or disable per-element via CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .wow { animation: none !important; }
}
```

## Best Practices

- ✅ Initialize WOW.js after the DOM is ready (`DOMContentLoaded` or `useEffect`).
- ✅ Set `live: false` in React/Next.js SPAs — MutationObserver causes issues with unmounted nodes.
- ✅ Use `data-wow-offset` to trigger earlier for above-the-fold elements.
- ✅ Guard with `prefers-reduced-motion` for accessibility.
- ✅ For Animate.css v4, set `animateClass: 'animate__animated'` and use `animate__` prefixed class names.

## Do Not

- ❌ Initialize WOW.js on the server — it requires `window` and `document`.
- ❌ Use entrance animations (`fadeIn`, `bounceIn`) without adding the `wow` class — elements won't animate.
- ❌ Combine WOW.js with GSAP animations on the same element — class toggling will conflict with GSAP's transform state.
- ❌ Use `data-wow-iteration="infinite"` on many elements — it creates continuous animation loops and harms performance.
