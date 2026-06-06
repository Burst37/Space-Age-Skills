---
name: sa-design-md
version: 1.0.0
updated: 2026-05-15
description: >
  Design system intelligence skill for Space Age AI Solutions. Converts brand intelligence
  — from briefs, moodboards, URLs, or verbal descriptions — into a production-grade
  DESIGN.md file using the VL-01 Dark Glassmorphism standard as the default token system.
  Feeds all downstream build agents: cinematic-website-builder, shopify-cinematic-builder,
  and the 5-agent swarm. Triggers on "DESIGN.md", "design tokens", "brand tokens",
  "Tailwind theme", "DTCG", or any request to formalize brand or design system output.
---

# SA-DESIGN-MD — Design System Intelligence Skill
**Version:** 1.0.0 | **Prefix:** SA- | **Source:** google-labs-code/design.md + Space Age AI Solutions Production Standards

---

## TRIGGER CONDITIONS

Load this skill IMMEDIATELY when any of the following occur:

- User says "create a DESIGN.md", "generate a design file", "build a design system"
- User provides a brand name, color palette, or visual direction and wants a structured output
- User references `design.md`, `design tokens`, `DTCG`, `Tailwind theme`, `token export`
- User wants to validate, lint, or diff a DESIGN.md file
- Any cinematic-website-builder or shopify-cinematic-builder session requires a token handoff
- User wants to export to Tailwind v3/v4, CSS custom properties, or DTCG `tokens.json`
- User says "build my design system", "define my brand tokens", "extract brand to DESIGN.md"
- Any UI/UX Designer session produces a Handoff Package that needs machine-readable token encoding
- User references brand-extractor output and wants it formalized
- Space Age VL-01 Dark Glassmorphism standard needs encoding into a portable DESIGN.md

---

## WHAT THIS SKILL DOES

SA-DESIGN-MD converts brand intelligence — from briefs, moodboards, URLs, or verbal descriptions — into a production-grade `DESIGN.md` file. This file is the **single source of truth** consumed by every downstream build agent in the Space Age pipeline.

### Pipeline Position

```
brand-extractor / ui-ux-designer
         ↓
   SA-DESIGN-MD  ←── YOU ARE HERE
         ↓
cinematic-website-builder / shopify-cinematic-builder
         ↓
  5-Agent Swarm (DeepSeek / Gemini / Minimax / Codex / Gemma)
```

Every site built at scale in the lead gen pipeline MUST have a DESIGN.md. Agents that receive a DESIGN.md produce higher-quality, more consistent output and require zero style correction passes.

---

## THE FORMAT — COMPLETE SPECIFICATION

### File Structure

A DESIGN.md file has exactly two layers:

1. **YAML front matter** — Machine-readable design tokens between `---` fences
2. **Markdown body** — Human-readable design rationale in `##` sections

```markdown
---
version: alpha
name: Brand Name
description: Optional one-liner
colors:
  primary: "#RRGGBB"
  ...
typography:
  ...
rounded:
  ...
spacing:
  ...
components:
  ...
---

## Overview
## Colors
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components
## Do's and Don'ts
```

### Token Types

| Type | Format | Example |
|------|--------|----------|
| Color | `#` + hex (sRGB) | `"#1A1C1E"` |
| Dimension | number + unit | `48px`, `-0.02em`, `1.5rem` |
| Token Reference | `{path.to.token}` | `{colors.primary}` |
| Typography | object | see schema below |
| Unitless Number | bare number | `1.6` (lineHeight multiplier) |

### Full YAML Schema

```yaml
version: alpha
name: <string>
description: <string>

colors:
  <token-name>: <Color>

typography:
  <token-name>:
    fontFamily: <string>
    fontSize: <Dimension>
    fontWeight: <number>
    lineHeight: <Dimension|number>
    letterSpacing: <Dimension>
    fontFeature: <string>
    fontVariation: <string>

rounded:
  <scale>: <Dimension>

spacing:
  <scale>: <Dimension|number>

components:
  <component-name>:
    backgroundColor: <Color|TokenRef>
    textColor: <Color|TokenRef>
    typography: <TokenRef>
    rounded: <Dimension|TokenRef>
    padding: <Dimension>
    size: <Dimension>
    height: <Dimension>
    width: <Dimension>
  <component-name>-hover:
    backgroundColor: <Color|TokenRef>
```

### Section Order (enforced by linter)

| # | Section | Aliases |
|---|---------|----------|
| 1 | Overview | Brand & Style |
| 2 | Colors | |
| 3 | Typography | |
| 4 | Layout | Layout & Spacing |
| 5 | Elevation & Depth | Elevation |
| 6 | Shapes | |
| 7 | Components | |
| 8 | Do's and Don'ts | |

---

## CLI REFERENCE

```bash
npm install @google/design.md
npx @google/design.md lint DESIGN.md
npx @google/design.md diff DESIGN.md DESIGN-v2.md
npx @google/design.md export --format json-tailwind DESIGN.md > tailwind.theme.json
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
npx @google/design.md spec
npx @google/design.md spec --rules
npx @google/design.md spec --rules-only --format json
```

### Export Format Reference

| Flag | Output | Use Case |
|------|--------|----------|
| `json-tailwind` | JSON `theme.extend` object | Tailwind v3 config |
| `css-tailwind` | CSS `@theme { }` block | Tailwind v4 |
| `tailwind` | alias for `json-tailwind` | — |
| `dtcg` | W3C DTCG `tokens.json` | Figma, Style Dictionary |

### Linting Rules

| Rule | Severity | Checks |
|------|----------|---------|
| `broken-ref` | error | `{token.path}` resolves to a defined token |
| `missing-primary` | warning | `primary` color exists |
| `contrast-ratio` | warning | WCAG AA (4.5:1) on component pairs |
| `orphaned-tokens` | warning | Color tokens referenced by ≥1 component |
| `missing-typography` | warning | Typography tokens exist when colors do |
| `missing-sections` | info | Optional spacing/rounded present |
| `token-summary` | info | Count of tokens per section |
| `section-order` | warning | Canonical section ordering |

---

## SPACE AGE PRODUCTION STANDARDS

### VL-01 Dark Glassmorphism (Default System)

When building for Space Age AI Solutions or any Space Age sub-brand, always generate DESIGN.md using the VL-01 standard as the base. Override tokens per-project.

```yaml
---
version: alpha
name: Space Age VL-01 Dark Glass
description: Space Age AI Solutions default cinematic glassmorphism system

colors:
  surface-base: "#050508"
  surface-dim: "#08080C"
  surface-container: "#0D0D14"
  surface-elevated: "#12121C"
  surface-glass: "rgba(255,255,255,0.06)"
  surface-glass-hover: "rgba(255,255,255,0.10)"
  surface-glass-active: "rgba(255,255,255,0.14)"
  border-subtle: "rgba(255,255,255,0.08)"
  border-default: "rgba(255,255,255,0.12)"
  specular-highlight: "rgba(255,255,255,0.12)"
  primary: "#2979FF"
  primary-glow: "rgba(41,121,255,0.30)"
  on-primary: "#FFFFFF"
  text-primary: "#FFFFFF"
  text-secondary: "#A0A0B0"
  text-tertiary: "#606070"
  text-disabled: "#404050"
  success: "#00E676"
  warning: "#FFD600"
  error: "#FF1744"
  info: "#00B0FF"

typography:
  display:
    fontFamily: Orbitron
    fontSize: 4rem
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: -0.03em
  h1:
    fontFamily: Orbitron
    fontSize: 2.5rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Orbitron
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  h3:
    fontFamily: Orbitron
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: DM Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: DM Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: DM Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em
  data:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.4
  mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 10px
  lg: 14px
  xl: 20px
  2xl: 28px
  full: 9999px

spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 96px
  section: 120px

components:
  card-glass:
    backgroundColor: "rgba(255,255,255,0.06)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-glass-elevated:
    backgroundColor: "rgba(255,255,255,0.10)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    height: 48px
    padding: 0 24px
  button-primary-hover:
    backgroundColor: "#3D8BFF"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.08)"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    height: 48px
    padding: 0 24px
  button-ghost-hover:
    backgroundColor: "rgba(255,255,255,0.14)"
  nav-item:
    backgroundColor: transparent
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  nav-item-active:
    backgroundColor: "rgba(41,121,255,0.15)"
    textColor: "{colors.primary}"
  input:
    backgroundColor: "rgba(255,255,255,0.06)"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 12px 16px
  input-focus:
    backgroundColor: "rgba(255,255,255,0.10)"
  led-active:
    backgroundColor: "{colors.primary}"
    width: 8px
    height: 8px
    rounded: "{rounded.full}"
  led-inactive:
    backgroundColor: "{colors.text-disabled}"
    width: 8px
    height: 8px
    rounded: "{rounded.full}"
---
```

### VL-01 Elevation Stack

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;
--shadow-md: 0 4px 16px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.10) inset;
--shadow-lg: 0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.12) inset;
--blur-sm:  backdrop-filter: blur(8px) saturate(120%);
--blur-md:  backdrop-filter: blur(20px) saturate(150%);
--blur-lg:  backdrop-filter: blur(40px) saturate(180%);
```

### Font CDN (Fontsource — mandatory for all SA builds)

```html
<!-- ALWAYS Fontsource. NEVER Google Fonts or Bunny Fonts. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5/900.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5/latin.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/latin.css">
```

---

## EXECUTION WORKFLOWS

### Workflow A — Generate DESIGN.md from Brand Brief

1. **Intake** — brand name, industry, target audience, mood/tone, any hex codes
2. **Map colors** — assign `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-primary`
3. **Select type scale** — choose font pair from font matrix below
4. **Define spacing** — 8px base grid; document gutter, section, container values
5. **Define components** — minimum: button-primary, card, input, nav-item (+ hover variants)
6. **Write prose sections** — Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's & Don'ts
7. **Validate** — check broken refs, WCAG contrast

### Workflow B — Extract DESIGN.md from URL (with brand-extractor)

1. Load Brand Token Package from brand-extractor
2. Map extracted hex values → DESIGN.md color token names
3. Map extracted fonts → typography tokens (note Fontsource availability)
4. Derive spacing from extracted grid/rhythm
5. Extract component patterns → component tokens with token references
6. Generate prose sections summarizing extracted brand rationale
7. Output DESIGN.md

### Workflow C — Generate DESIGN.md from VL-01 (Lead Gen Pipeline)

1. Start from VL-01 base (copy tokens above)
2. Override `primary` + `primary-glow` with business-category-appropriate accent:
   - Healthcare: `#00BCD4` | Legal: `#7C4DFF` | Construction: `#FF6D00` | Restaurant: `#E91E63` | Fitness: `#76FF03` | Finance: `#2979FF`
3. Override `name` and `description`
4. Keep all VL-01 typography, spacing, and component tokens intact
5. Export to Tailwind via `export --format css-tailwind` for agent consumption

### Workflow D — Token Export Pipeline

```bash
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css
npx @google/design.md export --format json-tailwind DESIGN.md > tailwind.theme.json
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

---

## FONT SELECTION MATRIX

| Brand Personality | Header Font | Body Font | Data/Label Font |
|---|---|---|---|
| Space Age / Futuristic | Orbitron | DM Sans | JetBrains Mono |
| Luxury / Editorial | Playfair Display | Inter | Space Mono |
| Professional / B2B | Plus Jakarta Sans | DM Sans | Roboto Mono |
| Playful / Consumer | Nunito | DM Sans | — |
| Minimal / Swiss | Space Grotesk | Public Sans | IBM Plex Mono |
| Medical / Clinical | Outfit | Source Sans 3 | Courier Prime |
| Legal / Finance | Cormorant Garamond | Libre Baskerville | Roboto Mono |

---

## QUALITY CHECKLIST

```
✅ name field set
✅ primary color defined
✅ minimum 4 typography levels (h1/h2, body-md, body-sm, label)
✅ spacing.unit defined (8px base)
✅ rounded scale has sm, md, lg, full
✅ minimum 4 components with hover variants
✅ all {token.references} resolve to defined tokens
✅ button-primary background/text passes WCAG AA (4.5:1)
✅ prose sections: Overview + Colors + Typography minimum
✅ Fontsource CDN for Space Age builds (never Google Fonts)
✅ surface color is not pure #000000 (use #050508 or similar)
✅ all component textColor values use {colors.token} references not hardcoded hex
```

---

## DOWNSTREAM AGENT PROMPT INJECTION

When handing off DESIGN.md to the 5-agent swarm, prefix the site build prompt with:

```
Read the following DESIGN.md and apply all tokens exactly as specified.
Do not invent colors, fonts, or spacing not present in this file.
Token references ({colors.primary}) must be resolved to their literal values before use in CSS.
All glassmorphism surfaces must use the exact rgba values from surface-glass tokens.
Typography: use Fontsource CDN only — never Google Fonts or Bunny Fonts.

[PASTE FULL DESIGN.md CONTENT HERE]
```

---

## SKILL METADATA

```yaml
skill_id: SA-DESIGN-MD
version: 1.0.0
category: design-systems
dependencies:
  - brand-extractor (optional upstream)
  - ui-ux-designer (optional upstream)
  - cinematic-website-builder (downstream consumer)
  - shopify-cinematic-builder (downstream consumer)
  - 5-agent-swarm (downstream consumer)
outputs:
  - DESIGN.md (primary)
  - tailwind.theme.json (via export)
  - theme.css (via export)
  - tokens.json (via export)
cli_tool: "@google/design.md"
cli_install: "npm install @google/design.md"
source_repo: "https://github.com/google-labs-code/design.md"
space_age_default_system: VL-01 Dark Glassmorphism
font_cdn: Fontsource (cdn.jsdelivr.net/npm/@fontsource/*)
base_background: "#050508"
accent_default: "#2979FF"
```
