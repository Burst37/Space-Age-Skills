---
name: sa-pattern-genome
description: Space Age Website Factory OS — SA Pattern Genome Library
---

# SA Pattern Genome Library

## Purpose

This is the proprietary pattern library.

Every workflow video, trend, reference site, or design breakdown gets converted into reusable pattern genes.

---

## Pattern Gene Schema

```yaml
Pattern_Gene:
  id: ""
  name: ""
  category:
    - hero
    - navigation
    - ecommerce
    - motion
    - product
    - trust
    - conversion
    - gallery
    - menu
    - footer
  purpose: ""
  best_for:
    - ""
  avoid_for:
    - ""
  required_stack:
    - ""
  implementation_notes:
    - ""
  mobile_behavior: ""
  accessibility_rules:
    - ""
  performance_rules:
    - ""
  failure_conditions:
    - ""
```

---

## Starter Pattern Genes

### H-001 Full-Screen Jumbo Typography Hero

```yaml
id: H-001
name: Full-Screen Jumbo Typography Hero
category: hero
purpose: instant brand authority and premium first impression
best_for:
  - all Space Age sites
implementation:
  - min-height: 100svh
  - clamp typography
  - line-height 0.85 to 1.05
  - animated line reveal
  - CTA above fold
```

### H-002 Accordion Video Hero

```yaml
id: H-002
name: Accordion Video Hero
category: hero
purpose: show multiple offers, services, or case studies in one cinematic hero
best_for:
  - AI agency
  - music artist
  - portfolio
  - ecommerce
  - nightclub
avoid_for:
  - evacuation
  - high-risk medical
implementation:
  - video panels
  - active/inactive states
  - hover/focus/tap support
  - mobile stacked or swiper fallback
```

### H-003 3D Video Scroll Slider Hero

```yaml
id: H-003
name: 3D Video Scroll Slider Hero
category: hero
purpose: turn image slider inspiration into premium video-panel carousel
best_for:
  - ecommerce
  - AI agency
  - portfolio
  - fashion
  - music
implementation:
  - CSS perspective
  - transform-style preserve-3d
  - GSAP ScrollTrigger
  - optimized video panels
  - poster fallback
```

### M-001 GSAP Page Load Reveal

```yaml
id: M-001
name: GSAP Page Load Reveal
category: motion
purpose: premium first impression
implementation:
  - headline line-mask reveal
  - hero visual scale-in
  - CTA fade-up
  - proof bar reveal
```

### M-002 ScrollTrigger Product Theater

```yaml
id: M-002
name: ScrollTrigger Product Theater
category: motion
purpose: make product/service feel alive through scroll-controlled movement
best_for:
  - ecommerce
  - SaaS
  - AI agency
implementation:
  - sticky visual
  - scroll progress mapping
  - product rotation or dashboard change
```

### E-001 Product Trust Stack

```yaml
id: E-001
name: Product Trust Stack
category: ecommerce
purpose: make product believable, desirable, and purchase-ready
implementation:
  - product gallery
  - review proof
  - shipping/returns reassurance
  - sticky buy CTA
```
