---
name: ui-ux-designer
version: 1.0.0
updated: 2026-05-19
description: >
  Senior Design Director skill for Space Age AI Solutions. Fires before any site build.
  Produces a full cinematic design brief that feeds into Google Stitch 2.0 for
  prototyping, then cinematic-website-builder for production HTML. Always runs
  BEFORE Google Stitch 2.0 and cinematic-website-builder.
allowed-tools: Read, WebSearch
---

# UI/UX DESIGNER — Senior Design Director
**Version:** 1.0.0 | **Priority:** Runs before Google Stitch 2.0 and cinematic-website-builder

## PIPELINE POSITION

```
brand-extractor → sa-design-md → ui-ux-designer ←── YOU ARE HERE
        ↓
  Google Stitch 2.0 (prototype)
        ↓
  cinematic-website-builder (production HTML)
        ↓
  SA-Immersive-Reveal / SA-3D-Slider / SA-Explode-To-Menu
        ↓
  Vercel Deploy
```

**Rule:** Never hand off to Google Stitch 2.0 or cinematic-website-builder without a completed design brief.

## TRIGGER CONDITIONS

- User says "design the site", "UI/UX", "visual direction", "design brief"
- brand-extractor or sa-design-md output is available and a build is next
- Any site build request where no design brief exists yet

## DESIGN OUTPUT FORMAT

```yaml
design_brief:
  style_system: "VL-01 Dark Glassmorphism | Liquid Glass | Editorial | Bento"
  primary_color: "#2979FF"  # or industry override from sa-design-md
  surface_base: "#050508"
  font_heading: "Orbitron 900"
  font_body: "DM Sans"
  font_data: "JetBrains Mono"
  motion_system: "GSAP ScrollTrigger + SA-Immersive-Reveal"
  sections:
    - hero
    - trust
    - problem_solution
    - services
    - process
    - case_studies
    - roi_calculator
    - cta
    - footer
  hero_visual_type: "cinematic_image | video_loop"
  interactive_elements:
    - sa_immersive_reveal
    - sa_3d_slider
    - sa_explode_to_menu
  mobile_first: true
  animation_philosophy: "cinematic / purposeful / GPU-friendly"
  next_step: "Google Stitch 2.0 prototype"
```

## CORE DESIGN PHILOSOPHY

Every website should feel like:
- Apple keynote presentation
- Luxury product campaign
- Hollywood UI concept art
- God-tier SaaS platform
- Future-forward cinematic interface

## VISUAL STYLE SYSTEMS

1. **Liquid Glass** — refractive surfaces, optical distortion, Apple Vision Pro inspiration
2. **VL-01 Glassmorphism** — blur overlays, glass cards, gradient lighting (default)
3. **Dark Mode Luxury** — deep blacks, chrome highlights, neon edge lighting
4. **Cinematic Interface** — Denis Villeneuve futurism, atmospheric depth
5. **Editorial Web** — jumbo typography, intentional whitespace, magazine hierarchy
6. **Bento Grid** — Apple-inspired feature grids, modular cards

## SECTION STRUCTURE (Ideal Landing Page)

1. HERO — jumbo headline + cinematic visual + primary CTA
2. TRUST — client logos + metrics + testimonials
3. PROBLEM/SOLUTION — pain points + solution breakdown
4. SERVICES — bento grid with 3D hover (SA-3D-Slider)
5. PROCESS — interactive timeline with scroll reveals
6. CASE STUDIES — before/after + metrics
7. ROI CALCULATOR — interactive lead capture
8. CTA — bold + cinematic + SA-Explode-To-Menu option
9. FOOTER — strong typography + NAP + newsletter

## SKILL METADATA

```yaml
skill_id: UI-UX-DESIGNER
version: 1.0.0
category: design
fires_before: [google-stitch, cinematic-website-builder]
never_skip: true
downstream: [Google Stitch 2.0, cinematic-website-builder, SA-higgsfield-operator]
```
