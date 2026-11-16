<!-- Previous library SKILL.md (distilled/thin), replaced 2026-10-03 by the fuller PR #73 version. Kept for reference. -->
---
name: Cinematic website builder
description: >-
  Use when building a premium single-file HTML marketing/portfolio/product site
  from a locked design direction — GSAP CDN plus a curated set of cinematic
  scroll/cursor/ambient modules (not all 30 at once).
---
# Cinematic website builder

Production layer for premium single-file HTML sites: GSAP + ScrollTrigger CDN, composed from a **30-module** effect library. Receives direction from SAVO / design-taste-pro / moodboard — does not invent taste from scratch.

**Pairs with:** spaceage-savo-creative-director-os · design-taste-pro · design-reference-moodboard · gsap-scroll-animation · gsap-scrolltrigger · scroll-film-studio (when the hero is a true scroll-film) · page-upgrade (existing sites).

## When to use

- Landing, portfolio, product, or marketing page that should feel premium/dynamic
- User wants single-file HTML (no framework/build) with cinematic scroll/cursor/ambient effects

## When not

- Design direction unclear → run SAVO / design-taste-pro / moodboard first
- Full scroll-film journey product → scroll-film-studio
- App chrome / dashboards

## Before code (mandatory)

Lock: moodboard · color system · font stack (jumbo display when message is clear) · section structure · primary CTA. If missing, stop and gather — don’t randomly pick modules.

## Tech stack (CDN)

GSAP + ScrollTrigger (+ optional other CDN libs only when a module needs them). One HTML file. Mobile-first CSS. `prefers-reduced-motion` required.

## The 30 modules (index — pick, don’t dump)

**Scroll:** 01 Text mask reveal · 02 Sticky stack narrative · 03 Layered zoom parallax · 04 Horizontal scroll hijack · 05 Sticky card stack · 06 Scroll SVG draw · 07 Curtain reveal · 08 Split screen scroll · 09 Scroll color shift  

**Cursor / click:** 10 Cursor reactive · 11 Accordion slider · 12 Cursor before-after · 13 Hover image trail · 14 3D flip cards · 15 Magnetic repel grid · 16 Spotlight border cards · 17 Drag-to-pan grid · 18 View transition morph · 19 Particle explosion button  

**Ambient / type / nav:** 20 Odometer counter · 21 3D coverflow · 22 Dynamic island nav · 23 Dock nav · 24 Text scramble · 25 Kinetic marquee · 26 Mesh gradient bg · 27 Circular text path · 28 Glitch · 29 Typewriter · 30 Gradient stroke text  

**Full 30-module code library (pre-normalize):** `/workspace/space-age-inventory/drive-md-raw/cinematic-website-builder.md` — copy snippets from there when implementing a selected module.

## Composition by page type

| Page | Suggested modules |
|------|-------------------|
| Agency / studio | Hero 07+24+10 · Features 02 or 16 · Proof 20+25 · CTA 19 · Footer 27+29 |
| Portfolio | Hero 03+30 · Gallery 04 or 13 · Projects 17/18 · Skills 15+20 |
| Product | Hero 01+26 · Features 05+11 · Specs 14 · CTA 19+22 |
| Editorial / story | Open 07/08 · Narrative 09+06 · Quote 28/24 · Close 01+19 |

**Rule:** 3–6 modules per page max. Signature > clutter. Prefer one scroll hero system + one interaction + one ambient.

## Build order

1. Semantic HTML sections + tokens  
2. Base type/color/spacing (jumbo H1 with clamp when justified)  
3. Wire selected modules (register ScrollTrigger once)  
4. Mobile simplify (kill horizontal hijack / heavy cursor on small screens)  
5. Reduced-motion: static end-states  
6. QA checklist  

## Output standards

- Single HTML delivers offline-capable with CDN  
- No fake logos / lorem in final  
- Images optimized; lazy below fold  
- Contrast AA; tap targets ≥44px  

## Anti-patterns

- Loading all 30 modules  
- Coding before moodboard/tokens  
- Ignoring mobile/reduced-motion  
- Narrating “as you scroll” in copy  
- Framework scaffolding when single-file was requested  

## Done when

- Direction locked; 3–6 modules composed intentionally  
- Desktop + mobile + reduced-motion verified  
- CTA clear above fold; QA checklist passed
