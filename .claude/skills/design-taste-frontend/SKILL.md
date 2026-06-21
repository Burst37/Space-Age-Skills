---
name: design-taste-frontend
description: >
  Space Age frontend design taste OS. Controls visual DNA, aesthetic routing, and anti-slop enforcement
  for all web builds. Enforces the VL-01 Dark Glassmorphism system, banned fonts, and the three design
  dials (VARIANCE / MOTION / DENSITY). Load before any UI build, design review, or frontend styling task.
---

# Design Taste Frontend OS

## VL-01 Dark Glassmorphism — Default Visual System

```css
--bg-primary: #050508;
--bg-secondary: #0a0a0f;
--glass-surface: rgba(255,255,255,0.04);
--glass-border: rgba(255,255,255,0.08);
--accent-primary: #6366f1;
--accent-secondary: #8b5cf6;
--text-primary: #f8fafc;
--text-muted: #94a3b8;

font-display: "Orbitron", "Space Grotesk";
font-body: "DM Sans", "Inter";
font-mono: "JetBrains Mono";
```

## Aesthetic Routing Table

| Client Type | Aesthetic Route | Motion Level | Density |
|---|---|---|---|
| AI Agency | Dark Glassmorphism + Holographic | Cinematic | Low |
| Home Healthcare | Editorial Luxury + Soft Trust | Subtle | Medium |
| Nightclub / Event | Neo-Brutalism + Kinetic Type | High | High |
| Restaurant / Bar | Skeuomorphic Warmth + Editorial | Medium | Medium |
| Ecommerce / Fashion | Minimal Luxury + Bento | Medium | Low |
| Music Artist | Dark + Holographic Iridescence | Cinematic | Low |
| Fitness / Gym | Industrial Brutalism + Bold Type | High | High |
| Credit Repair | Trust-First + Conversion Editorial | Low | Medium |
| SaaS | Spatial UI + Glassmorphism | Medium | Low |

## The Three Dials

```
VARIANCE   [1-10] — How much the design breaks from safe defaults
MOTION     [1-10] — Animation intensity and complexity
DENSITY    [1-10] — Information density and visual busyness
```

Default Space Age baseline: VARIANCE=7, MOTION=8, DENSITY=4

## Banned Fonts (never use)

- Inter (overused, generic SaaS)
- Fraunces (editorial cliché)
- Instrument_Serif (AI-generated tell)
- Poppins (startup template default)
- Lato (corporate generic)
- Any Google Font that appears in top 10 most-used list without strong artistic reason

## Approved Font Pairings

| Display | Body | Mono | Use Case |
|---|---|---|---|
| Orbitron | DM Sans | JetBrains Mono | AI / Tech / Agency |
| Editorial New | Söhne | — | Fashion / Luxury |
| Druk Wide | Aktiv Grotesk | — | Music / Event |
| Monument Extended | DM Sans | — | Streetwear / Bold |
| Playfair Display | DM Sans | — | Healthcare / Trust |
| Bebas Neue | Space Grotesk | — | Fitness / Gym |

## Pre-Flight 35-Point Design Checklist

### Typography (7 pts)
- [ ] Hero type is jumbo (clamp-based, min 5vw)
- [ ] No banned fonts used
- [ ] Hierarchy: 3 levels max (display / body / caption)
- [ ] Line-height: display ≤1.1, body 1.5-1.6
- [ ] Letter-spacing: display -0.02em to -0.04em
- [ ] Mobile type does not break to 3 lines for hero
- [ ] No Lorem Ipsum anywhere

### Color (5 pts)
- [ ] BG is not pure white (#ffffff) for premium builds
- [ ] Contrast ratio ≥4.5:1 for all body text
- [ ] Gradient direction consistent within section
- [ ] No more than 3 accent colors
- [ ] Dark mode is primary (not an afterthought)

### Layout (6 pts)
- [ ] Hero is full-screen (100vh minimum)
- [ ] Bento/grid sections have intentional white space
- [ ] No centered body text blocks > 600px wide
- [ ] Section transitions are designed (not just padding)
- [ ] Mobile layout tested (not just scaled down)
- [ ] Grid is 12-column with intentional breakpoints

### Motion (6 pts)
- [ ] Scroll triggers use GSAP ScrollTrigger (not CSS only)
- [ ] Lenis smooth scroll initialized
- [ ] Reduced-motion fallback present
- [ ] No animation without conversion or storytelling purpose
- [ ] Hero entrance animation < 1.2s total
- [ ] No infinite loops that serve no purpose

### Glassmorphism (5 pts)
- [ ] backdrop-filter: blur() has hardware-accelerated fallback
- [ ] Glass surfaces have subtle border (not pure transparent)
- [ ] Glass used for cards/modals/navs — not full page BG
- [ ] Layer depth visible (3+ z-levels)
- [ ] Safari compatibility tested

### Conversion (6 pts)
- [ ] CTA above fold
- [ ] Primary CTA has visual weight (not flat/ghost)
- [ ] Social proof near CTA
- [ ] Hero headline states outcome, not feature
- [ ] Contact/booking path has ≤3 steps
- [ ] Mobile CTA is thumb-reachable

## Handoff Routing

After design taste verification, route to:
- **Figma work** → SpaceAge_Figma_Design_Director_OS_v3
- **Code build** → universal-build-handoff
- **Motion spec** → design-motion-principles
- **Copy** → sa-anti-slop-writer
