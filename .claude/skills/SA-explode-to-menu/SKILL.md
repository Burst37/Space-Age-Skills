---
name: SA-explode-to-menu
version: 1.0.0
updated: 2026-05-19
description: >
  Particle explosion animation system that shatters a UI element into physics-driven
  fragments which reassemble into a navigation menu, service selection panel, or info
  overlay. Pure canvas + CSS — zero dependencies. Triggers on: "explode to menu",
  "explode animation", "particle explosion", "shatter to nav", "burst into menu".
allowed-tools: Read, Write, Bash
---

# SA-Explode-To-Menu — Particle Explosion → Menu Reveal
**Version:** 1.0.0 | **Prefix:** SA- | **Layer:** Site Build (post-HTML, pre-deploy)

## TRIGGER CONDITIONS

- User says "explode to menu", "shatter into nav", "particle explosion menu"
- Logo or hero element should explode to reveal menu or selection panel
- CTA/button fragments and reveals options
- User references "particle effects", "shatter", "burst animation"

## WHAT THIS SKILL DOES

Two-phase cinematic interaction:

**Phase 1 — EXPLOSION**: Trigger element pixels shattered into N physics-driven fragments. Fragments fly outward with velocity, gravity, rotation, drag. Glow trails.

**Phase 2 — REASSEMBLE → MENU**: Particles magnetically attract to target positions forming a nav menu, service grid, or info cards. Particles snap into VL-01 glass menu items with bloom flash.

## ARCHITECTURE

```
DOM Element (trigger)
    ↓  [Canvas.drawImage + getImageData]
Pixel Sample → Particle Array
    ↓  [requestAnimationFrame physics loop]
Explosion Phase (velocity, gravity, drag, glow)
    ↓  [after explosionDuration ms]
Attraction Phase (spring force toward target)
    ↓  [onComplete]
Menu Reveal (VL-01 glass items fade in with stagger)
```

## CONFIGURATION

```javascript
new SAExplodeToMenu({
  triggerId: 'saExplodeTrigger',
  canvasId: 'saExplodeCanvas',
  menuId: 'saExplodeMenu',
  particleCount: 240,
  explosionDuration: 650,
  attractionDelay: 850,
  glowColor: '41, 121, 255',  // RGB of VL-01 primary
  gravity: 0.18,
  drag: 0.96,
  springK: 0.07,
  damping: 0.80,
});
```

## USE CASES
- Use Case A: Logo → full navigation (default)
- Use Case B: CTA Button → service selection panel
- Use Case C: Hero Icon → info cards
- Use Case D: Mobile Hamburger → full-screen nav

## SKILL METADATA

```yaml
skill_id: SA-EXPLODE-TO-MENU
version: 1.0.0
category: animation
dependencies: [sa-design-md, ui-ux-designer, SA-immersive-reveal]
downstream: [Vercel Deploy]
performance: Canvas particle renderer (not DOM), rAF loop, reduced-motion path
browser_support: Chrome 39+, Firefox 31+, Safari 9+, Edge 17+
combines_with: [SA-Immersive-Reveal, SA-3D-Slider]
```
