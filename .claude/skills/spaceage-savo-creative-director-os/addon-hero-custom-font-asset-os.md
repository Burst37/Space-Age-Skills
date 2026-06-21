# SAVO Add-on Registration — Hero Custom Font Asset OS

## Add-on

```yaml
SAVO_Addon:
  name: spaceage-hero-custom-font-asset-os
  fires_after:
    - Brand DNA Engine
    - Attention Engine
    - Material Intelligence Engine
  fires_before:
    - Figma/Stitch Blueprint
    - Universal Build Handoff
  trigger_conditions:
    - custom hero typography would improve first impression
    - brand launch needs memorable wordmark
    - AI/fashion/music/nightlife/product site needs premium display asset
    - video tutorial/reference shows generated typography workflow
  must_not_fire_when:
    - trust-first industry would be harmed by expressive lettering
    - performance/accessibility constraints prohibit image-based hero assets
```

## Decision Question

Should this business use normal type, a visual hero-word asset, vector wordmark, true custom font, or 3D scene typography?

## Output Required

```yaml
Hero_Type_Strategy:
  route:
  material:
  motion_tolerance:
  conversion_protection:
  accessibility_backup:
```
