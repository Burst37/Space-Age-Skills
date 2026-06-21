---
name: sa-qa-production
description: Space Age Website Factory OS — QA Production Readiness System
---

# QA Production Readiness System

## Purpose

No website leaves the factory until it passes QA.

---

## Required QA Gates

```yaml
QA_Gates:
  visual_signature:
    - jumbo typography present
    - full-screen animated hero present
    - scroll triggers present
    - parallax/depth present

  website_type_fit:
    - effects match industry
    - banned effects avoided
    - emotional target correct

  conversion:
    - CTA clear
    - offer clear
    - proof visible
    - no motion hiding action

  mobile:
    - hero readable
    - menus usable
    - videos optimized
    - parallax reduced if needed

  accessibility:
    - reduced motion
    - keyboard support
    - focus states
    - contrast

  performance:
    - compressed media
    - lazy loading
    - no giant video blocking LCP
    - transform/opacity animation preferred

  anti_slop:
    - not generic
    - no fake metrics
    - no weak AI-gradient template
    - no random animations
```

---

## Production Ready Definition

A site is production-ready only when:

- it works on mobile
- forms work
- links work
- CTAs are clear
- animations do not break usability
- performance is acceptable
- SEO basics exist
- Open Graph exists
- favicon exists
- 404 or fallback route exists where needed
