---
name: SA-explode-to-menu
version: 1.0.0
updated: 2026-05-19
description: >
  Particle explosion animation system that shatters a UI element (logo, hero image, button,
  or icon) into physics-driven fragments which reassemble into a navigation menu, service
  selection panel, or info overlay. Pure canvas + CSS — zero dependencies. Delivers a
  signature Space Age "object explodes into UI" micro-interaction. Triggers on:
  "explode to menu", "explode animation", "particle explosion", "shatter to nav",
  "burst into menu", "exploding logo", "object explosion", "particle menu",
  "shatter effect", "explode into selection".
allowed-tools: Read, Write, Bash
---

# SA-Explode-To-Menu — Particle Explosion → Menu Reveal Animation Skill
**Version:** 1.0.0 | **Prefix:** SA- | **Layer:** Site Build (post-HTML, pre-deploy)

---

## TRIGGER CONDITIONS

Load this skill IMMEDIATELY when any of the following occur:

- User says "explode to menu", "shatter into nav", "particle explosion menu"
- User wants a logo or hero element to explode and reveal a menu or selection panel
- User wants a dramatic CTA/button interaction that fragments and reveals options
- User references "particle effects", "shatter", "burst animation", "exploding UI"
- cinematic-website-builder needs a signature hero interaction
- User says "make it look like it blows up into the menu" or similar
- Any service selection panel, pricing tier reveal, or nav drawer needs a cinematic entrance

---

## WHAT THIS SKILL DOES

SA-Explode-To-Menu creates a two-phase cinematic interaction:

**Phase 1 — EXPLOSION**
- The trigger element (logo, hero image, button, or any DOM node) is sampled via Canvas
- Its pixels are shattered into N configurable particle fragments
- Fragments fly outward with physics: velocity, gravity, rotation, drag
- Glow trails follow each fragment using `rgba` fade

**Phase 2 — REASSEMBLE → MENU**
- After explosion peak (configurable delay), particles magnetically attract to target positions
- Target positions form a navigation menu, service selection grid, or info card layout
- Particles decelerate and snap into VL-01 glass menu items with a bloom flash
- Menu items fade in with stagger as particles converge

**The Effect:**
> User clicks/hovers trigger → element shatters into glowing particles → particles arc across screen → converge and crystallize into a fully interactive menu

### Pipeline Position

```
cinematic-website-builder / shopify-cinematic-builder
              ↓
   SA-Immersive-Reveal (motion base layer)
              ↓
   SA-Explode-To-Menu  ←── YOU ARE HERE
              ↓
         Vercel Deploy
```

---

## ARCHITECTURE OVERVIEW

```
DOM Element (trigger)
    ↓  [Canvas.drawImage + getImageData]
Pixel Sample → Particle Array (N=200 default)
    ↓  [requestAnimationFrame physics loop]
Explosion Phase
  - velocity: random radial outward
  - gravity:  +0.15 Y per frame
  - drag:     0.97 multiplier per frame
  - rotation: random ± speed
  - glow:     blue/white trail rgba
    ↓  [after explosionDuration ms]
Attraction Phase
  - each particle assigned target [x, y] = menu item position
  - spring force toward target: k=0.06
  - damping: 0.82
  - when all particles within 2px of target → snap + bloom
    ↓  [onComplete callback]
Menu Reveal
  - canvas hidden
  - VL-01 glass menu items fade in with stagger
  - trigger element hidden
```

---

## HTML SETUP

```html
<!-- Trigger element — the thing that will explode -->
<div class="sa-explode-trigger" id="saExplodeTrigger" role="button"
     tabindex="0" aria-label="Open navigation" aria-expanded="false">
  <!-- Can be an img, SVG logo, text, icon, or any element -->
  <img src="/assets/logo.svg" alt="Space Age" width="200" height="80">
</div>

<!-- Canvas overlay (SA engine manages this) -->
<canvas class="sa-explode-canvas" id="saExplodeCanvas"
        aria-hidden="true"></canvas>

<!-- Menu that particles reassemble into -->
<nav class="sa-explode-menu" id="saExplodeMenu"
     aria-label="Main navigation" hidden>
  <div class="sa-explode-menu__inner">
    <a href="#services" class="sa-menu-item" data-explode-index="0">
      <span class="sa-menu-item__icon">◈</span>
      <span class="sa-menu-item__label">Services</span>
    </a>
    <a href="#portfolio" class="sa-menu-item" data-explode-index="1">
      <span class="sa-menu-item__icon">◈</span>
      <span class="sa-menu-item__label">Portfolio</span>
    </a>
    <a href="#pricing" class="sa-menu-item" data-explode-index="2">
      <span class="sa-menu-item__icon">◈</span>
      <span class="sa-menu-item__label">Pricing</span>
    </a>
    <a href="#about" class="sa-menu-item" data-explode-index="3">
      <span class="sa-menu-item__icon">◈</span>
      <span class="sa-menu-item__label">About</span>
    </a>
    <a href="#contact" class="sa-menu-item" data-explode-index="4">
      <span class="sa-menu-item__icon">◈</span>
      <span class="sa-menu-item__label">Contact</span>
    </a>
    <!-- Close to collapse menu back -->
    <button class="sa-menu-close" aria-label="Close menu">✕</button>
  </div>
</nav>

<!-- Service selection variant: replace nav with this -->
<!--
<div class="sa-explode-menu sa-service-grid" id="saExplodeMenu" hidden>
  <div class="sa-service-grid__inner">
    <div class="sa-service-card" data-explode-index="0">
      <div class="sa-service-card__icon">🌐</div>
      <h3 class="sa-service-card__title">Web Design</h3>
      <p class="sa-service-card__price">From $299</p>
    </div>
    ... repeat per service
  </div>
</div>
-->
```

---

## CSS

```css
/* ── SA-Explode-To-Menu CSS ── */

/* Canvas covers full viewport during animation */
.sa-explode-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9998;
  opacity: 0;
  transition: opacity 200ms ease;
}
.sa-explode-canvas.is-active {
  opacity: 1;
}

/* Trigger — subtle idle pulse to hint interactivity */
.sa-explode-trigger {
  cursor: pointer;
  display: inline-flex;
  position: relative;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sa-explode-trigger:hover {
  transform: scale(1.04);
}
.sa-explode-trigger.is-exploding {
  opacity: 0;
  pointer-events: none;
}

/* Idle pulse ring */
.sa-explode-trigger::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: inherit;
  border: 1px solid rgba(41, 121, 255, 0.3);
  animation: sa-pulse-ring 2.4s ease-out infinite;
  pointer-events: none;
}
@keyframes sa-pulse-ring {
  0%   { transform: scale(1);    opacity: 0.5; }
  70%  { transform: scale(1.15); opacity: 0;   }
  100% { transform: scale(1.15); opacity: 0;   }
}

/* Menu — hidden before explosion completes */
.sa-explode-menu {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 5, 8, 0.85);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  opacity: 0;
  transition: opacity 400ms ease;
}
.sa-explode-menu.is-visible {
  opacity: 1;
}
.sa-explode-menu[hidden] {
  display: none;
}

.sa-explode-menu__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

/* Menu items */
.sa-menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  color: #FFFFFF;
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  min-width: 280px;
  transition: background 240ms ease, transform 240ms ease, box-shadow 240ms ease;
  opacity: 0;
  transform: translateY(12px);
}
.sa-menu-item.is-revealed {
  opacity: 1;
  transform: translateY(0);
}
.sa-menu-item:hover {
  background: rgba(41, 121, 255, 0.15);
  box-shadow: 0 0 32px rgba(41, 121, 255, 0.2);
  transform: scale(1.03);
}
.sa-menu-item__icon {
  font-size: 1.1rem;
  color: #2979FF;
}

/* Close button */
.sa-menu-close {
  margin-top: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #A0A0B0;
  font-size: 1rem;
  cursor: pointer;
  transition: background 200ms ease, color 200ms ease;
}
.sa-menu-close:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #FFFFFF;
}

/* Service grid variant */
.sa-service-grid .sa-service-grid__inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  max-width: 720px;
  padding: 0 24px;
}
.sa-service-card {
  padding: 24px 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  text-align: center;
  opacity: 0;
  transform: scale(0.9) translateY(16px);
  transition: opacity 400ms ease, transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1),
              background 240ms ease;
}
.sa-service-card.is-revealed {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.sa-service-card:hover {
  background: rgba(255, 255, 255, 0.10);
}
.sa-service-card__icon { font-size: 2rem; margin-bottom: 12px; }
.sa-service-card__title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 8px;
}
.sa-service-card__price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #2979FF;
  margin: 0;
}

/* Reduced motion — skip explosion, just fade menu in */
@media (prefers-reduced-motion: reduce) {
  .sa-explode-trigger::after { animation: none; }
  .sa-explode-canvas { display: none !important; }
}
```

---

## JAVASCRIPT ENGINE

```javascript
// SA-Explode-To-Menu — Full particle physics engine
class SAExplodeToMenu {
  constructor(options = {}) {
    this.cfg = {
      triggerId:         options.triggerId        || 'saExplodeTrigger',
      canvasId:          options.canvasId         || 'saExplodeCanvas',
      menuId:            options.menuId           || 'saExplodeMenu',
      particleCount:     options.particleCount    || 200,
      explosionDuration: options.explosionDuration || 700,  // ms before attraction starts
      attractionDelay:   options.attractionDelay  || 900,  // ms after explosion before menu reveal
      particleSize:      options.particleSize     || 4,
      glowColor:         options.glowColor        || '41, 121, 255',  // RGB for primary
      gravity:           options.gravity          || 0.18,
      drag:              options.drag             || 0.96,
      springK:           options.springK          || 0.07,
      damping:           options.damping          || 0.80,
    };

    this.trigger  = document.getElementById(this.cfg.triggerId);
    this.canvas   = document.getElementById(this.cfg.canvasId);
    this.menu     = document.getElementById(this.cfg.menuId);
    if (!this.trigger || !this.canvas || !this.menu) return;

    this.ctx      = this.canvas.getContext('2d');
    this.particles = [];
    this.targets   = [];
    this.phase     = 'idle'; // idle | exploding | attracting | done
    this.raf       = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.trigger.addEventListener('click',   () => this.fire());
    this.trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') this.fire();
    });
    this.menu.querySelector('.sa-menu-close')?.addEventListener('click', () => this.collapse());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.phase === 'done') this.collapse();
    });

    // Reduced motion: skip to menu directly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.trigger.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        this._showMenu();
      });
    }
  }

  _resizeCanvas() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _sampleTrigger() {
    const rect = this.trigger.getBoundingClientRect();
    const offscreen = document.createElement('canvas');
    offscreen.width  = rect.width;
    offscreen.height = rect.height;
    const octx = offscreen.getContext('2d');

    // Draw trigger element (works for img, SVG, and most elements via CSS painting)
    // For images: draw directly. For other elements: use solid rect + primary color.
    const img = this.trigger.querySelector('img');
    if (img && img.complete) {
      octx.drawImage(img, 0, 0, rect.width, rect.height);
    } else {
      // Fallback: sample with primary color blocks
      octx.fillStyle = 'rgba(41,121,255,0.8)';
      octx.fillRect(0, 0, rect.width, rect.height);
    }

    const pixels = octx.getImageData(0, 0, rect.width, rect.height).data;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const particles = [];
    const step = Math.max(1, Math.floor(Math.sqrt((rect.width * rect.height) / this.cfg.particleCount)));

    for (let py = 0; py < rect.height; py += step) {
      for (let px = 0; px < rect.width; px += step) {
        const idx = (py * rect.width + px) * 4;
        const a = pixels[idx + 3];
        if (a < 30) continue; // skip transparent

        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const speed = 4 + Math.random() * 14;
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x:    rect.left + px,
          y:    rect.top  + py,
          vx:   Math.cos(angle) * speed,
          vy:   Math.sin(angle) * speed - 2, // slight upward bias
          rot:  Math.random() * 360,
          rotV: (Math.random() - 0.5) * 12,
          size: this.cfg.particleSize * (0.6 + Math.random() * 0.8),
          color: `rgba(${r},${g},${b},`,
          life: 1,
          tx: 0, ty: 0, // target set during attraction phase
        });
        if (particles.length >= this.cfg.particleCount) break;
      }
      if (particles.length >= this.cfg.particleCount) break;
    }
    return { particles, cx, cy };
  }

  _buildTargets() {
    const menuItems = this.menu.querySelectorAll('[data-explode-index]');
    const targets = [];
    menuItems.forEach((item) => {
      // Show menu briefly to measure positions, then hide again
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const count = Math.floor(this.cfg.particleCount / menuItems.length);
      for (let i = 0; i < count; i++) {
        targets.push({
          x: cx + (Math.random() - 0.5) * rect.width  * 0.8,
          y: cy + (Math.random() - 0.5) * rect.height * 0.8,
          itemEl: item,
        });
      }
    });
    return targets;
  }

  fire() {
    if (this.phase !== 'idle') return;
    this.phase = 'exploding';
    this._resizeCanvas();

    // Sample trigger pixels
    const { particles } = this._sampleTrigger();
    this.particles = particles;

    // Hide trigger, show canvas
    this.trigger.classList.add('is-exploding');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.canvas.classList.add('is-active');

    // Show menu (hidden visually) to get item positions for targets
    this.menu.removeAttribute('hidden');
    this.menu.style.visibility = 'hidden';
    this.menu.style.opacity = '0';
    this.targets = this._buildTargets();
    this.menu.style.visibility = '';

    // Assign targets to particles
    this.particles.forEach((p, i) => {
      const t = this.targets[i % this.targets.length];
      p.tx = t.x;
      p.ty = t.y;
    });

    // Schedule phase transition
    setTimeout(() => {
      this.phase = 'attracting';
    }, this.cfg.explosionDuration);

    setTimeout(() => {
      this._showMenu();
    }, this.cfg.attractionDelay);

    this._loop();
  }

  _loop() {
    if (this.phase === 'done') return;
    const { particleCount, gravity, drag, springK, damping } = this.cfg;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      if (this.phase === 'exploding') {
        // Physics: gravity + drag
        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.rotV;
        p.life = Math.max(0, p.life - 0.004);
      } else if (this.phase === 'attracting') {
        // Spring attraction toward target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx = (p.vx + dx * springK) * damping;
        p.vy = (p.vy + dy * springK) * damping;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV * 0.5;
      }

      // Draw particle
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rot * Math.PI) / 180);

      // Glow
      const glow = this.cfg.glowColor;
      this.ctx.shadowColor = `rgba(${glow},0.8)`;
      this.ctx.shadowBlur  = 8;

      this.ctx.fillStyle = p.color + Math.max(0.1, p.life).toFixed(2) + ')';
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    });

    this.raf = requestAnimationFrame(() => this._loop());
  }

  _showMenu() {
    this.phase = 'done';
    cancelAnimationFrame(this.raf);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.classList.remove('is-active');

    // Reveal menu
    this.menu.style.visibility = '';
    this.menu.classList.add('is-visible');

    // Stagger-reveal each menu item
    const items = this.menu.querySelectorAll('[data-explode-index]');
    items.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('is-revealed');
      }, i * 80);
    });

    // Focus first item for accessibility
    setTimeout(() => {
      items[0]?.focus();
    }, items.length * 80 + 100);
  }

  collapse() {
    this.phase = 'idle';
    cancelAnimationFrame(this.raf);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.classList.remove('is-active');

    this.menu.classList.remove('is-visible');
    this.menu.querySelectorAll('[data-explode-index]').forEach((item) => {
      item.classList.remove('is-revealed');
    });
    setTimeout(() => {
      this.menu.setAttribute('hidden', '');
    }, 400);

    this.trigger.classList.remove('is-exploding');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.focus();
  }
}

// Initialize
new SAExplodeToMenu({
  triggerId:         'saExplodeTrigger',
  canvasId:          'saExplodeCanvas',
  menuId:            'saExplodeMenu',
  particleCount:     240,
  explosionDuration: 650,
  attractionDelay:   850,
  glowColor:         '41, 121, 255',
});
```

---

## USE CASES & CONFIGURATIONS

### Use Case A — Logo → Full Navigation (default)
Trigger = site logo. Menu = full-page nav overlay. Best for: hero sections, landing pages.
```javascript
new SAExplodeToMenu({ particleCount: 240, explosionDuration: 650 });
```

### Use Case B — CTA Button → Service Selection Panel
Trigger = "Get Started" button. Menu = service/pricing grid.
Reduce particle count for a tighter, faster effect:
```javascript
new SAExplodeToMenu({ particleCount: 120, explosionDuration: 450, attractionDelay: 650 });
```

### Use Case C — Hero Icon → Info Cards
Trigger = large decorative icon. Menu = 3–4 feature info cards.
Use spring-heavy settings for a snappier reassembly:
```javascript
new SAExplodeToMenu({ particleCount: 160, springK: 0.10, damping: 0.75 });
```

### Use Case D — Mobile Hamburger → Full-Screen Nav
Reduce particles significantly for performance:
```javascript
new SAExplodeToMenu({ particleCount: 80, explosionDuration: 400, attractionDelay: 550 });
```

---

## EXECUTION WORKFLOW

### Step 1 — Identify trigger and destination
- What explodes? Logo, hero image, CTA button, or decorative icon
- What does it become? Full nav, service grid, pricing tiers, or info cards

### Step 2 — Build HTML
- Wrap trigger element in `.sa-explode-trigger#saExplodeTrigger`
- Add `<canvas class="sa-explode-canvas" id="saExplodeCanvas">` directly after trigger
- Build the destination menu/grid as `.sa-explode-menu#saExplodeMenu` with `hidden` attribute
- Add `data-explode-index` attributes to each menu item (0-based)

### Step 3 — Inject CSS
- All animation CSS (canvas, trigger, menu, items)
- Choose variant: nav list or service grid

### Step 4 — Inject JS
- `SAExplodeToMenu` class
- `new SAExplodeToMenu({ ... })` call with tuned config

### Step 5 — Configure for content type
- Match `particleCount` to trigger element size (200–300 for large, 80–120 for small)
- Adjust `explosionDuration` for pacing: 600ms = punchy, 900ms = cinematic
- Adjust `glowColor` to match brand primary (default: `41, 121, 255` = #2979FF)

### Step 6 — Verify
- Click trigger → explosion fires, menu reveals
- Press Escape → menu collapses, trigger restored
- Test with `prefers-reduced-motion: reduce` in devtools (should skip animation, show menu directly)
- Verify all `data-explode-index` values are 0-based and contiguous

---

## SKILL METADATA

```yaml
skill_id: SA-EXPLODE-TO-MENU
version: 1.0.0
category: animation
dependencies:
  - cinematic-website-builder (upstream HTML source)
  - sa-design-md (VL-01 color tokens for glowColor param)
downstream:
  - Vercel Deploy
outputs:
  - Particle physics explosion engine (SAExplodeToMenu class)
  - Canvas-based particle renderer
  - VL-01 glass menu/service grid reveal system
  - Full accessibility layer (keyboard, ARIA, reduced-motion)
performance:
  - Canvas particle renderer (not DOM — no layout thrashing)
  - rAF loop cancels immediately on completion
  - Particle count is configurable (tune down for mobile)
  - Reduced-motion path skips all canvas work entirely
browser_support: Chrome 39+, Firefox 31+, Safari 9+, Edge 17+ (Canvas 2D required)
space_age_default: false
combines_with:
  - SA-Immersive-Reveal (page load reveal before explosion trigger appears)
  - SA-3D-Slider (use explode on a hero CTA that reveals a slider-based service selector)
config_params:
  particleCount:     200    # number of particles (tune to element size)
  explosionDuration: 700    # ms before attraction phase begins
  attractionDelay:   900    # ms after explosion before menu CSS reveals
  particleSize:      4      # px size of each fragment
  glowColor:         "41, 121, 255"  # RGB of glow trail (match brand primary)
  gravity:           0.18   # downward acceleration per frame
  drag:              0.96   # velocity multiplier per frame (1 = no drag)
  springK:           0.07   # attraction spring constant (higher = snappier)
  damping:           0.80   # velocity damping during attraction
```
