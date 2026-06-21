---
name: sa-hero-genome
description: Space Age Website Factory OS — SA Hero Genome
---

# SA Hero Genome

## Purpose

Hero section library for the Website Factory.

Every website must use a full-screen animated hero with jumbo typography.

---

## Hero Types

```yaml
Hero_Types:
  H-001_basic_jumbo:
    use_for: all sites
    traits:
      - huge headline
      - clear CTA
      - full-screen layout

  H-002_video_hero:
    use_for:
      - music
      - nightlife
      - restaurant
      - fashion
      - ecommerce
    traits:
      - optimized video
      - poster fallback
      - copy shield

  H-003_dashboard_hero:
    use_for:
      - SaaS
      - AI agency
    traits:
      - product UI preview
      - scroll-synced dashboard
      - bento proof cards

  H-004_accordion_video_hero:
    use_for:
      - agency
      - portfolio
      - ecommerce
      - music
    traits:
      - multi-panel video
      - active/inactive states
      - mobile fallback

  H-005_3D_video_slider:
    use_for:
      - ecommerce
      - portfolio
      - fashion
      - music
    traits:
      - CSS perspective
      - video panels
      - GSAP scroll control

  H-006_emergency_status_hero:
    use_for:
      - evacuation
      - emergency
    traits:
      - jumbo high contrast
      - status cards
      - phone/map CTA
      - minimal motion
```
