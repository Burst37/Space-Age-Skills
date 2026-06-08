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

## TRIGGER CONDITIONS

Load this skill IMMEDIATELY when any of the following occur:

- User says "add a 3D slider", "3D carousel", "coverflow effect"
- User wants to showcase portfolio pieces, service cards, or testimonials with depth
- User references "perspective", "3D card flip", "rotating cards", "card tilt"
- cinematic-website-builder output needs an interactive showcase section
- Any Space Age site needs an immersive gallery or services carousel

## WHAT THIS SKILL DOES

SA-3D-Slider injects a full 3D perspective carousel into any Space Age HTML page:
- Coverflow Carousel — CSS 3D rotateY with depth falloff
- Card Tilt on Hover — mouse-tracking perspective tilt per card
- Infinite Loop — seamless auto-advance
- Glassmorphism Cards — VL-01 surface-glass tokens
- Keyboard + Touch navigation
- Depth Fog — far cards darken + blur

## PIPELINE POSITION

```
cinematic-website-builder / shopify-cinematic-builder (HTML shell)
        ↓
SA-Immersive-Reveal (motion base layer — apply first)
        ↓
SA-3D-Slider  ←── YOU ARE HERE
        ↓
Vercel Deploy
```

## IMPLEMENTATION

This skill delivers: CSS 3D motion tokens (:root variables), full glass card CSS, JavaScript coverflow engine with auto-advance + touch + keyboard + tilt, and HTML markup template.

Key CSS tokens:
```css
:root {
  --slider-perspective:    1200px;
  --slider-card-width:     340px;
  --slider-card-height:    420px;
  --slider-transition:     600ms cubic-bezier(0.16, 1, 0.3, 1);
  --slider-auto-interval:  4000ms;
  --slider-tilt-max:       14deg;
}
```

For full implementation code (CSS + JS engine + HTML markup), see source at `user/SA-3d-slider/SKILL.md` on `claude/add-animation-skills-B17Z5` branch.

## SKILL METADATA

```yaml
skill_id: SA-3D-SLIDER
version: 1.0.0
category: animation
dependencies: [sa-design-md, ui-ux-designer, SA-immersive-reveal]
downstream: [Vercel Deploy]
performance: zero-dependencies, will-change:transform, touch-friendly
browser_support: Chrome 36+, Firefox 16+, Safari 9+, Edge 12+
combines_with: [SA-Immersive-Reveal, SA-Explode-To-Menu]
```
