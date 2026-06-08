---
name: framer-web-design
version: 2.0.0
description: Production-grade Framer development reference. Covers Framer's component system, CMS, interactions, code components, and Space Age VL-01 integration for building premium websites in Framer.
allowed-tools: Read, Write, Bash
---

# FRAMER WEB DESIGN v2.0.0
## Space Age AI Solutions — Production Framer Development

## When to load this skill

- Building or modifying a Framer website
- User asks for Framer-specific components or interactions
- Migrating a design from Figma to Framer
- Adding custom code components to Framer

---

## FRAMER ARCHITECTURE

```
Framer Project Structure:
  Pages           — Top-level routes (/about, /services)
  Components      — Reusable UI elements
  CMS Collections — Dynamic content (blog, portfolio)
  Variables       — Global design tokens
  Overrides       — Dynamic props via code
  Code Components — Custom React components
```

---

## VL-01 VARIABLES IN FRAMER

Set up Space Age design tokens as Framer Variables:

```
Colors:
  surface-base:    #050508
  surface-raised:  #08080C
  primary:         #2979FF
  text-primary:    #FFFFFF
  text-secondary:  #A0A0B0
  border-default:  rgba(255,255,255,0.10)

Fonts:
  heading: Orbitron 900  → Connect via Fontsource
  body:    DM Sans       → Connect via Fontsource
  data:    JetBrains Mono → Connect via Fontsource

Radius:
  card: 20px
  button: 10px
  tag: 6px

Spacing:
  base: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  2xl: 96px
```

---

## CODE COMPONENT EXAMPLE

```tsx
// GlassCard.tsx — Custom Framer Component
import { addPropertyControls, ControlType } from "framer"

export function GlassCard({ title, children, glowColor = "#2979FF" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 20,
      backdropFilter: "blur(20px) saturate(150%)",
      padding: 32,
      boxShadow: `0 24px 48px rgba(0,0,0,0.4), 0 0 40px ${glowColor}20`
    }}>
      <h3 style={{ fontFamily: "Orbitron", color: "#FFFFFF" }}>{title}</h3>
      {children}
    </div>
  )
}

addPropertyControls(GlassCard, {
  title: { type: ControlType.String, defaultValue: "Card Title" },
  glowColor: { type: ControlType.Color, defaultValue: "#2979FF" }
})
```

---

## FRAMER INTERACTIONS

### Scroll-Based Reveal
```
Element > Appear Effects:
  Initial: opacity 0, y +40px
  Animate: opacity 1, y 0
  Trigger: In View
  Timing: Spring (300ms, 0.8 bounce)
  Delay: stagger children by 0.1s
```

### Hover Glass Effect
```
Element > Hover:
  background: rgba(255,255,255,0.10)
  box-shadow: 0 0 32px rgba(41,121,255,0.2)
  scale: 1.02
  transition: 240ms ease
```

---

## FRAMER CMS (Dynamic Content)

```
CMS Setup:
  1. Create Collection (e.g., "Portfolio")
  2. Add fields: title, description, image, tags, slug
  3. Design Collection Item template
  4. Create Collection List page
  5. Connect list to collection
  6. Add slug-based routing for detail pages
```

---

## SHADER INTEGRATION

For WebGL shaders in Framer, use `framer-shaders` skill to get React components, then add as Code Components.

---

## WHAT TO AVOID

- Don't use inline styles when Framer Variables exist
- Don't create separate components for small variations — use variants
- Don't skip responsive previews (mobile, tablet, desktop)
- Don't use Google Fonts — use Fontsource or system fonts
