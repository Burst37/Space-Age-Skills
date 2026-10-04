# Color & Surface — Contrast, Palettes, Materials

## 1. Contrast targets

| Element | WCAG 2.2 minimum | Ship target |
|---|---|---|
| Body text | 4.5:1 (AA) | **7:1** — AAA, and it just looks better |
| Large text (≥24px, or ≥18.66px bold) | 3:1 | 4.5:1 |
| UI components, focus rings, input borders | 3:1 | 3.5:1 |
| Icons carrying meaning | 3:1 | 4.5:1 |
| Disabled state | exempt | keep ≥ 2.5:1 anyway — users still need to read it |
| Placeholder text | 4.5:1 | never use placeholder as label |

Regulated industries (medical, legal, financial, public sector): AAA on body text is not
optional. Set it as a hard gate in the build contract.

**On low-contrast "aesthetic" grey text:** `#999` on `#fff` is 2.8:1 and fails. It is the
single most common accessibility defect in premium-looking sites. If the design needs
quiet secondary text, use `#6b7280`-class values (≈5.7:1), not `#aaa`.

## 2. Palette construction

Build **roles**, not a list of pretty colors.

```css
:root {
  /* Ground */
  --bg:            /* page base */
  --surface-1:     /* raised: cards, panels */
  --surface-2:     /* raised further: popovers, modals */
  --surface-inset: /* recessed: wells, code blocks */

  /* Line */
  --border-subtle: /* dividers — barely visible is correct */
  --border-strong: /* input borders, focus-adjacent */

  /* Ink */
  --text-primary:   /* 7:1+ on --bg */
  --text-secondary: /* 4.5:1+ */
  --text-tertiary:  /* 3:1+, non-essential only */
  --text-inverse:

  /* Action */
  --brand:          /* identity, not necessarily the CTA */
  --cta:            /* the single highest-attention color on the page */
  --cta-hover:
  --accent:         /* used sparingly — under 10% of surface area */

  /* Status */
  --success: --warning: --danger: --info:
}
```

**Rules**
- The CTA color must be the **most saturated thing on the page**. If the accent competes,
  the accent loses.
- One accent. Two accents means neither is an accent.
- 60/30/10: dominant surface / secondary surface / accent+CTA. Accent above ~10% of
  surface area stops functioning as an accent.
- Never use pure `#000` on a light-mode site — `#0a0a0b`–`#18181b` reads richer and
  reduces halation. Never pure `#fff` text on pure `#000`.
- Semantic colors are not brand colors. Red means danger even if the brand is red.

## 3. Dark mode surface ladder

Dark UI does not invert. It uses **elevation by lightness**, and shadows barely work.

```css
:root[data-theme="dark"] {
  --bg:            #0a0a0b;
  --surface-1:     #121214;   /* +2-4% lightness per level */
  --surface-2:     #1a1a1d;
  --surface-3:     #232327;
  --border-subtle: #26262b;
  --border-strong: #3a3a42;
  --text-primary:  #f4f4f5;   /* not #fff — reduces glare */
  --text-secondary:#a1a1aa;
  --text-tertiary: #71717a;
}
```

- Elevation is communicated by a **lighter surface**, not a bigger shadow.
- Saturated colors vibrate on dark backgrounds. Desaturate brand colors 10–20% and
  lighten them for dark mode — a color that passes contrast on white usually fails on black.
- Large areas of pure saturated color on dark = eye strain. Reserve for CTA only.
- Test both themes. A site that only works in one is half-built.

## 4. Material and surface language

Pick **one** dominant material and hold it. Mixing three is the "AI slop" signature.

| Material | Reads as | Watch out |
|---|---|---|
| Flat / matte | editorial, confident, fast | needs strong type and spacing to not look empty |
| Soft elevation (subtle shadow) | approachable, product-like | shadow soup — cap at 3 shadow levels |
| Glass / blur | modern, layered | expensive; needs busy content behind or it's pointless |
| Bordered / wireframe | technical, precise | contrast on borders is an a11y requirement |
| Gradient mesh / aurora | energetic, brand-led | the #1 generic AI tell — needs real brand justification |
| Textured / grain | tactile, crafted | keep noise under 4% opacity or it reads as compression |

**Shadow ladder** (light mode). Warm-tint shadows on warm palettes; never pure black.
```css
--shadow-sm: 0 1px 2px rgb(16 16 20 / 0.06);
--shadow-md: 0 2px 4px rgb(16 16 20 / 0.05), 0 4px 12px rgb(16 16 20 / 0.06);
--shadow-lg: 0 4px 8px rgb(16 16 20 / 0.05), 0 12px 32px rgb(16 16 20 / 0.10);
```
Two-layer shadows (tight + diffuse) read as real light. Single large blurs read as fake.

## 5. Radius language

One family. Mixing radii is instantly visible and instantly cheap-looking.

| Family | Values | Reads as |
|---|---|---|
| Sharp | `0` | editorial, brutal, fashion, technical |
| Subtle | `2–4px` | precise, engineered, premium |
| Standard | `6–10px` | friendly default, product |
| Soft | `12–20px` | approachable, consumer, app-like |
| Pill | `999px` on controls only | playful, modern consumer |

**Nesting rule:** inner radius = outer radius − padding. A 16px card with 16px padding
holding a 16px-radius image looks wrong; the image wants `0`. Get this right and the work
immediately looks more considered.

## 6. Gradient discipline

Gradients are not banned; *thoughtless* gradients are.

- Two stops of adjacent hues, low chroma travel → sophisticated.
- Purple→blue at 135deg → the default AI tell. Requires a brand reason in writing.
- Interpolate in `oklch` to avoid the muddy grey midpoint:
  `linear-gradient(in oklch, var(--a), var(--b))`.
- Gradient text: only on display sizes, never body, always with a solid fallback color.
- A gradient over a photo needs a *reason* (legibility) — that reason is usually satisfied
  better by a solid scrim at 40–60% opacity.

## 7. Color QA checklist
- [ ] Body text ≥ 7:1 (≥ 4.5:1 absolute floor)
- [ ] Every interactive border and focus ring ≥ 3:1
- [ ] CTA is the most saturated element on the page
- [ ] One accent, under ~10% surface area
- [ ] No pure `#000` / `#fff` pairings
- [ ] Dark mode uses lightness elevation, desaturated brand colors
- [ ] One radius family, nesting math correct
- [ ] One dominant material
- [ ] Color is never the *only* carrier of meaning (add icon, text, or shape)
- [ ] Checked against deuteranopia and protanopia simulation
