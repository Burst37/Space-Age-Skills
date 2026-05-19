---
name: SA-immersive-reveal
version: 1.0.0
updated: 2026-05-19
description: >
  Cinematic immersive reveal animation system for Space Age websites. Generates
  scroll-triggered section entrances, hero unveil sequences, and parallax depth
  layers using CSS custom properties, IntersectionObserver, and GSAP-compatible
  keyframes — all tuned to the VL-01 Dark Glassmorphism system. Triggers on:
  "reveal animation", "scroll reveal", "section entrance", "immersive reveal",
  "cinematic entrance", "unveil", "appear on scroll", "fade in sections".
allowed-tools: Read, Write, Bash
---

# SA-Immersive-Reveal — Cinematic Scroll Reveal Animation Skill
**Version:** 1.0.0 | **Prefix:** SA- | **Layer:** Site Build (post-HTML, pre-deploy)

---

## TRIGGER CONDITIONS

Load this skill IMMEDIATELY when any of the following occur:

- User says "add reveal animations", "scroll reveal", "immersive entrance", "cinematic reveal"
- User wants sections to animate into view on scroll
- User wants a hero section to unveil with a dramatic cinematic sequence
- User references "parallax", "depth layers", "parallax scroll"
- cinematic-website-builder output needs motion polish before deploy
- User says "make it feel more immersive", "animate the sections in"
- Any Space Age site needs the VL-01 motion layer applied

---

## WHAT THIS SKILL DOES

SA-Immersive-Reveal injects a complete scroll-driven reveal system into any Space Age HTML page. It produces:

- **Hero Unveil Sequence** — staggered entrance: background → headline → subtext → CTA
- **Section Reveals** — each `<section>` slides/fades in as it enters the viewport
- **Parallax Depth Layers** — background images and glass cards move at different scroll rates
- **Text Scramble Effect** — headings "decode" from random chars into final text on reveal
- **Threshold Gating** — elements only trigger once, no re-animation on scroll-back jank

### Pipeline Position

```
brand-extractor → sa-design-md
              ↓
       ui-ux-designer  (Design Brief YAML — section architecture, motion system)
              ↓
     Google Stitch 2.0  (UI prototype → reviewed layout)
              ↓
cinematic-website-builder / shopify-cinematic-builder  (HTML shell)
              ↓
   SA-Immersive-Reveal  ←── YOU ARE HERE
              ↓
      SA-3D-Slider / SA-Explode-To-Menu (optional additional layer)
              ↓
     SA-higgsfield-operator (hero image + video assets)
              ↓
         Vercel Deploy
```

---

## VL-01 MOTION TOKENS

All timing values derive from the VL-01 motion token set. Inject into `:root` before any animation CSS.

```css
:root {
  /* Duration */
  --motion-instant:   80ms;
  --motion-fast:     160ms;
  --motion-normal:   320ms;
  --motion-slow:     560ms;
  --motion-cinematic: 900ms;
  --motion-epic:    1400ms;

  /* Easing */
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Reveal Defaults */
  --reveal-distance-y: 48px;
  --reveal-distance-x: 32px;
  --reveal-blur:       12px;
  --reveal-scale-from: 0.94;
  --parallax-factor:   0.35;
}
```

---

## ANIMATION VARIANTS

### Variant A — Fade + Rise (default for sections)
```css
.sa-reveal {
  opacity: 0;
  transform: translateY(var(--reveal-distance-y));
  transition:
    opacity var(--motion-slow) var(--ease-out-expo),
    transform var(--motion-slow) var(--ease-out-expo);
}
.sa-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Variant B — Blur + Scale Reveal (hero headline)
```css
.sa-reveal-hero {
  opacity: 0;
  transform: scale(var(--reveal-scale-from)) translateY(24px);
  filter: blur(var(--reveal-blur));
  transition:
    opacity var(--motion-cinematic) var(--ease-out-quart),
    transform var(--motion-cinematic) var(--ease-out-quart),
    filter var(--motion-cinematic) var(--ease-out-quart);
}
.sa-reveal-hero.is-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0);
}
```

### Variant C — Slide from Left / Right (alternating sections)
```css
.sa-reveal-left {
  opacity: 0;
  transform: translateX(calc(-1 * var(--reveal-distance-x)));
  transition:
    opacity var(--motion-slow) var(--ease-out-expo),
    transform var(--motion-slow) var(--ease-out-expo);
}
.sa-reveal-right {
  opacity: 0;
  transform: translateX(var(--reveal-distance-x));
  transition:
    opacity var(--motion-slow) var(--ease-out-expo),
    transform var(--motion-slow) var(--ease-out-expo);
}
.sa-reveal-left.is-visible,
.sa-reveal-right.is-visible {
  opacity: 1;
  transform: translateX(0);
}
```

### Variant D — Staggered Children (card grids, feature lists)
```css
.sa-stagger-parent.is-visible .sa-stagger-child:nth-child(1) { transition-delay: 0ms; }
.sa-stagger-parent.is-visible .sa-stagger-child:nth-child(2) { transition-delay: 80ms; }
.sa-stagger-parent.is-visible .sa-stagger-child:nth-child(3) { transition-delay: 160ms; }
.sa-stagger-parent.is-visible .sa-stagger-child:nth-child(4) { transition-delay: 240ms; }
.sa-stagger-parent.is-visible .sa-stagger-child:nth-child(5) { transition-delay: 320ms; }
.sa-stagger-parent.is-visible .sa-stagger-child:nth-child(6) { transition-delay: 400ms; }

.sa-stagger-child {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity var(--motion-slow) var(--ease-out-expo),
    transform var(--motion-slow) var(--ease-out-expo);
}
.sa-stagger-parent.is-visible .sa-stagger-child {
  opacity: 1;
  transform: translateY(0);
}
```

---

## INTERSECTION OBSERVER ENGINE

```javascript
// SA-Immersive-Reveal — IntersectionObserver engine
// Drop this script at end of <body> in every Space Age site

(function saReveal() {
  const SELECTORS = [
    '.sa-reveal',
    '.sa-reveal-hero',
    '.sa-reveal-left',
    '.sa-reveal-right',
    '.sa-stagger-parent',
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once only
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  const targets = document.querySelectorAll(SELECTORS.join(','));
  targets.forEach((el) => observer.observe(el));
})();
```

---

## HERO UNVEIL SEQUENCE

Full cinematic hero entrance — background, headline, subtext, CTA reveal in sequence.

```html
<!-- Hero section markup -->
<section class="sa-hero">
  <div class="sa-hero__bg sa-parallax-bg"></div>
  <div class="sa-hero__content">
    <p class="sa-hero__eyebrow sa-reveal" data-delay="0">Space Age AI Solutions</p>
    <h1 class="sa-hero__headline sa-reveal-hero sa-text-scramble" data-delay="120"
        data-final="Your Headline Here">
      Your Headline Here
    </h1>
    <p class="sa-hero__sub sa-reveal" data-delay="280">Supporting copy goes here.</p>
    <div class="sa-hero__cta sa-reveal" data-delay="440">
      <a href="#" class="btn-primary">Get Started</a>
    </div>
  </div>
</section>
```

```css
/* Hero entrance base */
.sa-hero {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Apply data-delay as transition-delay */
[data-delay] {
  transition-delay: attr(data-delay ms); /* fallback: use JS below */
}
```

```javascript
// Apply data-delay values as transition-delay (attr() not fully supported)
document.querySelectorAll('[data-delay]').forEach((el) => {
  el.style.transitionDelay = el.dataset.delay + 'ms';
});
```

---

## PARALLAX DEPTH SYSTEM

```javascript
// SA Parallax — lightweight rAF-based scroll parallax
(function saParallax() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  let lastY = window.scrollY;

  function update() {
    const y = window.scrollY;
    if (y === lastY) { requestAnimationFrame(update); return; }
    lastY = y;

    layers.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || 0.35;
      el.style.transform = `translateY(${y * factor}px)`;
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();
```

```html
<!-- Usage: attach data-parallax factor to any layer -->
<div class="sa-hero__bg" data-parallax="0.35"></div>
<div class="sa-midground" data-parallax="0.15"></div>
<div class="sa-foreground" data-parallax="-0.08"></div>
```

---

## TEXT SCRAMBLE ENGINE

```javascript
// SA Text Scramble — decodes heading from random chars on reveal
class SATextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\/[]{}—=+*^?#@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const promise = new Promise((res) => (this.resolve = res));
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 16);
      const end = start + Math.floor(Math.random() * 16);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="sa-scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Wire up to IntersectionObserver
document.querySelectorAll('.sa-text-scramble').forEach((el) => {
  const finalText = el.dataset.final || el.innerText;
  const scrambler = new SATextScramble(el);
  el.innerText = '';

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => scrambler.setText(finalText), delay);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );
  obs.observe(el);
});
```

```css
.sa-scramble-char {
  color: var(--color-primary, #2979FF);
  opacity: 0.7;
}
```

---

## EXECUTION WORKFLOW

### Step 1 — Classify the page
- Identify all `<section>` and hero elements in the HTML
- Determine which animation variant fits each: hero = Variant B, grids = Variant D, alternating sections = C

### Step 2 — Inject CSS
- Add VL-01 motion tokens to `:root`
- Add all required variant CSS classes
- Add `.sa-scramble-char` color rule

### Step 3 — Apply classes to HTML
- Hero headline → `sa-reveal-hero sa-text-scramble` + `data-final` + `data-delay`
- Hero supporting elements → `sa-reveal` + `data-delay` (staggered)
- Card grids → parent gets `sa-stagger-parent`, children get `sa-stagger-child`
- Alternating content sections → `sa-reveal-left` / `sa-reveal-right`
- Parallax layers → `data-parallax="0.35"` on background divs

### Step 4 — Inject scripts
- `data-delay` applier (inline)
- `saReveal()` IntersectionObserver engine
- `saParallax()` rAF loop
- `SATextScramble` class + wiring

### Step 5 — Accessibility guard
```css
@media (prefers-reduced-motion: reduce) {
  .sa-reveal,
  .sa-reveal-hero,
  .sa-reveal-left,
  .sa-reveal-right,
  .sa-stagger-child {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
```

---

## INTEGRATION WITH CINEMATIC-WEBSITE-BUILDER

When cinematic-website-builder produces HTML output, apply SA-Immersive-Reveal as the default motion layer:

1. Locate `<section>` tags in generated HTML
2. Apply `sa-reveal` to every section's inner content wrapper
3. Apply `sa-stagger-parent` / `sa-stagger-child` to any card grid (`.grid`, `.features`, `.services`)
4. Apply hero variants to the first `<section>` or `.hero` element
5. Append CSS and JS blocks before `</body>`

---

## SKILL METADATA

```yaml
skill_id: SA-IMMERSIVE-REVEAL
version: 1.0.0
category: animation
dependencies:
  - brand-extractor (upstream brand tokens)
  - sa-design-md (VL-01 design system + motion tokens)
  - ui-ux-designer (design brief + section architecture + motion system spec)
  - google-stitch (UI prototype → reviewed HTML structure)
  - cinematic-website-builder (upstream HTML source)
downstream:
  - SA-3D-Slider (optional additional layer)
  - SA-Explode-To-Menu (optional additional layer)
  - SA-higgsfield-operator (hero image + video assets)
  - Vercel Deploy
outputs:
  - Animated HTML page (motion layer injected)
  - CSS motion token block
  - JS IntersectionObserver engine
  - JS Parallax engine
  - JS TextScramble engine
performance:
  - No external deps (zero npm, no GSAP required)
  - IntersectionObserver fires once per element
  - Parallax uses rAF with dirty-check (no scroll event listeners)
  - Reduced-motion safe
browser_support: Chrome 58+, Firefox 55+, Safari 12.1+, Edge 16+
space_age_default: true
```
