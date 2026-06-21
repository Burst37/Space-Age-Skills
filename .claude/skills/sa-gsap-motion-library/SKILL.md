---
name: sa-gsap-motion-library
description: Space Age Website Factory OS — SA GSAP Motion Library
---

# SA GSAP Motion Library

## Purpose

Production-ready motion library for Space Age websites.

GSAP is not a buzzword. Every use must define dependencies, trigger logic, cleanup, mobile fallback, accessibility fallback, and conversion purpose.

---

## Required GSAP Rules

```yaml
GSAP_Rules:
  install:
    - gsap
  imports:
    - import { gsap } from "gsap"
    - import { ScrollTrigger } from "gsap/ScrollTrigger"
  registration:
    - gsap.registerPlugin(ScrollTrigger)
  react_rules:
    - use client component
    - use refs
    - use gsap.context
    - cleanup with ctx.revert()
  accessibility:
    - prefers-reduced-motion fallback
  performance:
    - animate transform and opacity
    - avoid layout-heavy properties
    - lazy load media
```

---

## Motion Patterns

### G-001 Reveal on Scroll

```yaml
trigger: section
start: top 80%
animation:
  from:
    y: 80
    opacity: 0
  to:
    y: 0
    opacity: 1
```

### G-002 Pinned Scroll Story

```yaml
trigger: process section
pin: true
scrub: true
use_for:
  - AI process
  - SaaS dashboard
  - product explanation
```

### G-003 Parallax Depth

```yaml
layers:
  background: slow
  midground: stable
  foreground: faster
mobile: reduced intensity
```

### G-004 Scroll-Controlled Video Slider

```yaml
use_for:
  - portfolio
  - ecommerce
  - music
  - agency service selector
rules:
  - active video plays
  - inactive videos use poster
  - mobile becomes swiper or stacked cards
```
