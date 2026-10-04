# Design system synthesis

Turn `css-forensics.json` + brand answers → approved `DESIGN.md` + tokens. User approves before any code.

## Outputs

- `docs/design/DESIGN.md` — human-readable system + rationale.
- `docs/design/design-tokens.json` — machine tokens.
- Tailwind/CSS var export (match target stack).

## Token set (extract, then snap to scale)

- **Color**: brand primary/secondary (from brand answers, NOT reference if rebranding) + neutral ramp + semantic (bg/fg/border/success/error). Cluster reference colors; drop near-duplicates.
- **Type**: family (brand fonts override reference), modular scale (e.g. 1.2–1.333), weights, line-height per role, letter-spacing on display. Read real h1/h2/h3 from forensics for proportion.
- **Space**: 4px or 8px base, consistent ramp.
- **Radii / shadows / borders**.
- **Motion tokens**: durations (fast 150 / base 300 / slow 600), easings (standard, emphasized), stagger step.
- **Breakpoints**: match target (e.g. 390 / 768 / 1024 / 1440).

## Rules

- Rebrand/remix: identity tokens (color, type, logo) come from the NEW brand, not the reference. Reference supplies proportion/structure only.
- One canonical token source. Components read tokens, never hardcode hex.
- Contrast: every fg/bg pair ≥ WCAG AA (4.5:1 text, 3:1 large/UI).
- Forbidden colors from onboarding → assert none appear.

## Example token shape

```json
{
  "color": { "brand": { "500": "#0a84ff" }, "neutral": { "0":"#fff","900":"#0a0a0a" }, "bg":"#fff","fg":"#0a0a0a" },
  "font": { "display": "Rajdhani, sans-serif", "body": "Inter, sans-serif" },
  "fontSize": { "xs":"0.8rem","base":"1rem","xl":"1.5rem","display":"clamp(2.5rem,6vw,5rem)" },
  "space": { "1":"4px","2":"8px","4":"16px","8":"32px" },
  "radius": { "sm":"6px","lg":"16px" },
  "motion": { "fast":"150ms","base":"300ms","slow":"600ms","ease":"cubic-bezier(.22,1,.36,1)" }
}
```
