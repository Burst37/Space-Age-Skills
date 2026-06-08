---
name: SA-immersive-reveal
version: 1.0.0
updated: 2026-05-19
description: >
  Cinematic immersive reveal animation system for Space Age websites. Scroll-triggered
  section entrances, hero unveil sequences, and parallax depth layers using CSS custom
  properties, IntersectionObserver, and GSAP-compatible keyframes tuned to VL-01.
  Triggers on: "reveal animation", "scroll reveal", "section entrance", "immersive reveal".
allowed-tools: Read, Write, Bash
---

# SA-Immersive-Reveal — Cinematic Scroll Reveal Animation
**Version:** 1.0.0 | **space_age_default:** true

## TRIGGER CONDITIONS

- User says "add reveal animations", "scroll reveal", "cinematic reveal"
- Sections should animate into view on scroll
- Hero section needs dramatic unveil sequence
- Any Space Age site needing VL-01 motion layer

## WHAT THIS SKILL DOES

- Hero Unveil Sequence — staggered: background → headline → subtext → CTA
- Section Reveals — slides/fades in as it enters viewport
- Parallax Depth Layers — background/midground/foreground at different scroll rates
- Text Scramble — headings decode from random chars on reveal
- Threshold Gating — fires once only, no re-animation jank

## PIPELINE POSITION

```
cinematic-website-builder (HTML shell)
        ↓
SA-Immersive-Reveal  ←── YOU ARE HERE (apply first)
        ↓
SA-3D-Slider / SA-Explode-To-Menu (optional additional layer)
        ↓
Vercel Deploy
```

## VL-01 MOTION TOKENS

```css
:root {
  --motion-fast:      160ms;
  --motion-normal:    320ms;
  --motion-slow:      560ms;
  --motion-cinematic: 900ms;
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);
  --reveal-distance-y: 48px;
  --reveal-blur:       12px;
}
```

## ANIMATION VARIANTS

- **Variant A — Fade + Rise**: `.sa-reveal` (default for sections)
- **Variant B — Blur + Scale**: `.sa-reveal-hero` (hero headlines)
- **Variant C — Slide Left/Right**: `.sa-reveal-left`, `.sa-reveal-right`
- **Variant D — Staggered Children**: `.sa-stagger-parent` + `.sa-stagger-child`

## SCRIPTS INJECTED

1. IntersectionObserver engine (`saReveal()`) — fires once per element
2. Parallax rAF loop (`saParallax()`) — dirty-check, no scroll listeners
3. SATextScramble class + wiring
4. `data-delay` applier (CSS transition-delay from HTML attribute)

## REDUCED MOTION

```css
@media (prefers-reduced-motion: reduce) {
  .sa-reveal, .sa-reveal-hero, .sa-reveal-left,
  .sa-reveal-right, .sa-stagger-child {
    opacity: 1 !important; transform: none !important;
    filter: none !important; transition: none !important;
  }
}
```

## SKILL METADATA

```yaml
skill_id: SA-IMMERSIVE-REVEAL
version: 1.0.0
category: animation
space_age_default: true
browser_support: Chrome 58+, Firefox 55+, Safari 12.1+, Edge 16+
performance: no external deps, IntersectionObserver fires once, rAF dirty-check
```
