---
name: SA-3d-slider
version: 1.0.0
updated: 2026-05-19
description: >
  Cinematic 3D perspective slider and carousel animation system for Space Age websites.
  Generates CSS 3D transform carousels, portfolio showcases, testimonial sliders, and
  service card decks with depth, perspective tilt, and VL-01 glassmorphism styling.
  Zero-dependency — pure CSS + vanilla JS. Triggers on: "3D slider", "carousel",
  "3D carousel", "portfolio slider", "card deck", "perspective slider",
  "coverflow", "rotating showcase", "testimonial slider".
allowed-tools: Read, Write, Bash
---

# SA-3D-Slider — Cinematic 3D Perspective Slider Animation Skill
**Version:** 1.0.0 | **Prefix:** SA- | **Layer:** Site Build (post-HTML, pre-deploy)

---

## TRIGGER CONDITIONS

Load this skill IMMEDIATELY when any of the following occur:

- User says "add a 3D slider", "3D carousel", "coverflow effect"
- User wants to showcase portfolio pieces, service cards, or testimonials with depth
- User references "perspective", "3D card flip", "rotating cards", "card tilt"
- cinematic-website-builder output needs an interactive showcase section
- User says "make it more dynamic", "add a card deck animation", "showcase slider"
- Any Space Age site needs an immersive gallery or services carousel

---

## WHAT THIS SKILL DOES

SA-3D-Slider injects a full 3D perspective carousel into any Space Age HTML page. It produces:

- **Coverflow Carousel** — CSS 3D rotateY with depth falloff (the signature slider)
- **Card Tilt on Hover** — mouse-tracking perspective tilt per card (gyroscope effect)
- **Infinite Loop** — seamless auto-advance with configurable interval
- **Glassmorphism Cards** — each slide uses VL-01 surface-glass tokens with specular edge highlight
- **Keyboard + Touch** — arrow keys, swipe, and click navigation
- **Depth Fog** — far cards darken + blur to reinforce 3D depth

### Pipeline Position

```
cinematic-website-builder / shopify-cinematic-builder
              ↓
   SA-Immersive-Reveal (motion base layer)
              ↓
      SA-3D-Slider  ←── YOU ARE HERE
              ↓
         Vercel Deploy
```

---

## VL-01 3D MOTION TOKENS

```css
:root {
  /* 3D Perspective */
  --slider-perspective:    1200px;
  --slider-card-width:     340px;
  --slider-card-height:    420px;
  --slider-gap:             40px;
  --slider-depth-offset:  -180px;
  --slider-rotation-step:  28deg;
  --slider-scale-active:   1.08;
  --slider-scale-side:     0.88;
  --slider-opacity-far:    0.45;
  --slider-blur-far:       3px;

  /* Glass card */
  --slider-card-bg:        rgba(255, 255, 255, 0.06);
  --slider-card-bg-active: rgba(255, 255, 255, 0.12);
  --slider-card-border:    rgba(255, 255, 255, 0.10);
  --slider-card-shadow:    0 24px 64px rgba(0, 0, 0, 0.6),
                           0 1px 0 rgba(255, 255, 255, 0.12) inset;
  --slider-glow-active:    0 0 48px rgba(41, 121, 255, 0.25);

  /* Timing */
  --slider-transition:     600ms cubic-bezier(0.16, 1, 0.3, 1);
  --slider-auto-interval:  4000ms;
  --slider-tilt-max:       14deg;
}
```

---

## HTML MARKUP

```html
<!-- SA-3D-Slider — drop anywhere in page -->
<div class="sa-slider" id="saSlider" aria-label="3D Carousel" role="region">
  <div class="sa-slider__track" id="saSliderTrack">

    <!-- Repeat .sa-slider__item for each slide -->
    <div class="sa-slider__item" data-index="0">
      <div class="sa-slider__card sa-tilt-card">
        <div class="sa-slider__card-img">
          <img src="/assets/slide-1.jpg" alt="Project 1" loading="lazy">
        </div>
        <div class="sa-slider__card-body">
          <span class="sa-slider__card-tag">Branding</span>
          <h3 class="sa-slider__card-title">Project Name</h3>
          <p class="sa-slider__card-desc">Short description of the work.</p>
          <a href="#" class="sa-slider__card-cta">View Project →</a>
        </div>
        <!-- Specular highlight overlay -->
        <div class="sa-slider__specular" aria-hidden="true"></div>
      </div>
    </div>
    <!-- /repeat -->

  </div>

  <!-- Navigation -->
  <button class="sa-slider__btn sa-slider__btn--prev" aria-label="Previous slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <button class="sa-slider__btn sa-slider__btn--next" aria-label="Next slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <!-- Dot indicators -->
  <div class="sa-slider__dots" id="saSliderDots" aria-label="Slide indicators"></div>
</div>
```

---

## CSS — FULL IMPLEMENTATION

```css
/* ── SA-3D-Slider Core ── */
.sa-slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 60px 0 80px;
  perspective: var(--slider-perspective);
  perspective-origin: 50% 50%;
}

.sa-slider__track {
  position: relative;
  width: var(--slider-card-width);
  height: var(--slider-card-height);
  margin: 0 auto;
  transform-style: preserve-3d;
  transition: transform var(--slider-transition);
}

/* Cards: positioned via JS-applied custom properties */
.sa-slider__item {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition:
    transform var(--slider-transition),
    opacity var(--slider-transition),
    filter var(--slider-transition);
  cursor: pointer;
  will-change: transform, opacity, filter;
}

.sa-slider__item[data-pos="0"] {
  transform: translateZ(0) rotateY(0deg) scale(var(--slider-scale-active));
  opacity: 1;
  filter: blur(0);
  z-index: 10;
  pointer-events: auto;
}
.sa-slider__item[data-pos="1"],
.sa-slider__item[data-pos="-1"] {
  transform:
    translateX(calc(sign(var(--pos)) * (var(--slider-card-width) + var(--slider-gap))))
    translateZ(var(--slider-depth-offset))
    rotateY(calc(sign(var(--pos)) * calc(-1 * var(--slider-rotation-step))))
    scale(var(--slider-scale-side));
  opacity: 0.75;
  filter: blur(0px);
  z-index: 5;
}
.sa-slider__item[data-pos="2"],
.sa-slider__item[data-pos="-2"] {
  transform:
    translateX(calc(sign(var(--pos)) * (var(--slider-card-width) * 1.9 + var(--slider-gap) * 2)))
    translateZ(calc(var(--slider-depth-offset) * 2))
    rotateY(calc(sign(var(--pos)) * calc(-1 * var(--slider-rotation-step) * 1.8)))
    scale(0.72);
  opacity: var(--slider-opacity-far);
  filter: blur(var(--slider-blur-far));
  z-index: 1;
}
.sa-slider__item[data-pos="far"] {
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

/* Glass Card */
.sa-slider__card {
  width: var(--slider-card-width);
  height: var(--slider-card-height);
  background: var(--slider-card-bg);
  border: 1px solid var(--slider-card-border);
  border-radius: 20px;
  box-shadow: var(--slider-card-shadow);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  overflow: hidden;
  position: relative;
  transition: background var(--slider-transition), box-shadow var(--slider-transition);
}

.sa-slider__item[data-pos="0"] .sa-slider__card {
  background: var(--slider-card-bg-active);
  box-shadow: var(--slider-card-shadow), var(--slider-glow-active);
}

.sa-slider__card-img {
  width: 100%;
  height: 55%;
  overflow: hidden;
}
.sa-slider__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
}
.sa-slider__item[data-pos="0"] .sa-slider__card-img img {
  transform: scale(1.04);
}

.sa-slider__card-body {
  padding: 20px 24px;
}
.sa-slider__card-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2979FF;
  display: block;
  margin-bottom: 8px;
}
.sa-slider__card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 8px;
  line-height: 1.3;
}
.sa-slider__card-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  color: #A0A0B0;
  margin: 0 0 16px;
  line-height: 1.6;
}
.sa-slider__card-cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #2979FF;
  text-decoration: none;
  transition: color 200ms ease;
}
.sa-slider__card-cta:hover { color: #FFFFFF; }

/* Specular edge highlight */
.sa-slider__specular {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.10) 0%,
    transparent 40%,
    transparent 60%,
    rgba(255,255,255,0.04) 100%
  );
  pointer-events: none;
}

/* Navigation Buttons */
.sa-slider__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 200ms ease, transform 200ms ease;
  z-index: 20;
}
.sa-slider__btn:hover {
  background: rgba(255,255,255,0.14);
  transform: translateY(-50%) scale(1.08);
}
.sa-slider__btn--prev { left: 16px; }
.sa-slider__btn--next { right: 16px; }

/* Dots */
.sa-slider__dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 20;
}
.sa-slider__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  border: none;
  cursor: pointer;
  transition: background 300ms ease, transform 300ms ease, width 300ms ease;
}
.sa-slider__dot.is-active {
  background: #2979FF;
  width: 20px;
  border-radius: 3px;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  :root {
    --slider-card-width:  280px;
    --slider-card-height: 360px;
    --slider-rotation-step: 20deg;
    --slider-depth-offset: -120px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sa-slider__item,
  .sa-slider__card,
  .sa-slider__card-img img {
    transition: none !important;
  }
}
```

---

## JAVASCRIPT ENGINE

```javascript
// SA-3D-Slider — Full engine
(function saSlider() {
  const track   = document.getElementById('saSliderTrack');
  const dotsEl  = document.getElementById('saSliderDots');
  const prevBtn = document.querySelector('.sa-slider__btn--prev');
  const nextBtn = document.querySelector('.sa-slider__btn--next');
  if (!track) return;

  const items     = Array.from(track.querySelectorAll('.sa-slider__item'));
  const total     = items.length;
  let   current   = 0;
  let   autoTimer = null;

  // ── Build dots ──────────────────────────────────────────────────────
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'sa-slider__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  // ── Position calculation ─────────────────────────────────────────────
  function getPos(index) {
    let pos = index - current;
    // Wrap for infinite loop
    if (pos > Math.floor(total / 2))  pos -= total;
    if (pos < -Math.floor(total / 2)) pos += total;
    return pos;
  }

  // ── Render ───────────────────────────────────────────────────────────
  function render() {
    items.forEach((el, i) => {
      const pos = getPos(i);
      const absPos = Math.abs(pos);
      el.dataset.pos = absPos > 2 ? 'far' : String(pos);
      el.style.setProperty('--pos', String(pos));
      el.setAttribute('aria-hidden', pos !== 0 ? 'true' : 'false');
    });
    dotsEl.querySelectorAll('.sa-slider__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  }

  // ── Navigation ───────────────────────────────────────────────────────
  function goTo(index) {
    current = ((index % total) + total) % total;
    render();
    resetAuto();
  }

  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // ── Auto-advance ─────────────────────────────────────────────────────
  function startAuto() {
    autoTimer = setInterval(next, parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--slider-auto-interval') || '4000'
    ));
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Pause on hover
  track.closest('.sa-slider').addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.closest('.sa-slider').addEventListener('mouseleave', startAuto);

  // ── Touch / Swipe ────────────────────────────────────────────────────
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
  });

  // ── Keyboard ─────────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // ── Card Tilt (mouse-tracking 3D tilt per active card) ───────────────
  function applyTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    const max  = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--slider-tilt-max') || '14'
    );
    card.style.transform = `rotateY(${dx * max}deg) rotateX(${-dy * max}deg) scale(1.03)`;
  }

  function resetTilt(card) {
    card.style.transform = '';
  }

  document.querySelectorAll('.sa-tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => applyTilt(card, e));
    card.addEventListener('mouseleave', () => resetTilt(card));
  });

  // ── Click side cards to navigate ─────────────────────────────────────
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      if (i !== current) goTo(i);
    });
  });

  // ── Init ─────────────────────────────────────────────────────────────
  render();
  startAuto();
})();
```

---

## SLIDER VARIANTS

### Variant — Testimonial Slider
Replace card image section with a large quote block:
```html
<div class="sa-slider__card">
  <div class="sa-slider__card-body" style="padding: 32px; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
    <p class="sa-slider__quote">"This is a testimonial quote that describes the client experience."</p>
    <div class="sa-slider__author">
      <img src="/assets/avatar.jpg" class="sa-slider__avatar" alt="">
      <div>
        <strong class="sa-slider__author-name">Client Name</strong>
        <span class="sa-slider__author-role">CEO, Company</span>
      </div>
    </div>
  </div>
</div>
```

### Variant — Service Cards (no image)
Set `--slider-card-height: 320px` and replace image block with an icon/badge.

### Variant — Full-Bleed Image Showcase
Set `--slider-card-height: 520px`, remove `.sa-slider__card-body`, overlay text with absolute positioning and gradient scrim.

---

## EXECUTION WORKFLOW

### Step 1 — Identify content
- Determine what the slider will showcase: portfolio, services, testimonials, or products
- Count slides (optimal: 5–9 items; minimum: 3)

### Step 2 — Generate HTML
- Build `.sa-slider` container with the correct number of `.sa-slider__item` children
- Choose appropriate variant (image card, testimonial, service, full-bleed)
- Ensure each card has `.sa-tilt-card` class for mouse-tracking tilt

### Step 3 — Inject CSS
- Inject VL-01 3D motion tokens into `:root`
- Append full slider CSS block before `</style>`

### Step 4 — Inject JS
- Append `saSlider()` engine before `</body>`

### Step 5 — Verify
- Confirm `id="saSlider"`, `id="saSliderTrack"`, `id="saSliderDots"` are present
- Confirm prev/next buttons have correct class names
- Test auto-advance pause on hover

---

## SKILL METADATA

```yaml
skill_id: SA-3D-SLIDER
version: 1.0.0
category: animation
dependencies:
  - cinematic-website-builder (upstream HTML source)
  - sa-design-md (VL-01 glass tokens)
downstream:
  - Vercel Deploy
outputs:
  - 3D carousel HTML block
  - CSS perspective slider system
  - JS slider engine with auto-advance, touch, keyboard, tilt
performance:
  - Zero external dependencies
  - will-change: transform on animated items only
  - Auto-advance pauses on hover (no janky scroll interference)
  - Touch-friendly (swipe navigation)
browser_support: Chrome 36+, Firefox 16+, Safari 9+, Edge 12+ (CSS 3D transforms)
space_age_default: false
combines_with:
  - SA-Immersive-Reveal (wrap slider section in sa-reveal)
  - SA-Explode-To-Menu (use explode on CTA within active card)
```
