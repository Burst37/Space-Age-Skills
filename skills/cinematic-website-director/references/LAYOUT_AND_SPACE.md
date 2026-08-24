# Layout & Space — Grid, Rhythm, Composition

## 1. Spacing scale

One scale, no arbitrary values. `17px` in a codebase is a bug, not a decision.

```css
:root {
  --space-3xs: 0.25rem;  /*  4px */
  --space-2xs: 0.5rem;   /*  8px */
  --space-xs:  0.75rem;  /* 12px */
  --space-s:   1rem;     /* 16px */
  --space-m:   1.5rem;   /* 24px */
  --space-l:   2rem;     /* 32px */
  --space-xl:  3rem;     /* 48px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */
  --space-4xl: 8rem;     /* 128px */
  --space-5xl: 12rem;    /* 192px */
}
```

Fluid section padding — the single highest-leverage spacing decision on a page:
```css
--section-y: clamp(3rem, 2rem + 6vw, 9rem);
--gutter:    clamp(1rem, 0.5rem + 2.5vw, 3rem);
```

## 2. Proximity law

Space communicates relationship. The gap *above* a heading must be visibly larger than
the gap *below* it — typically **2–3×**. This one rule fixes more broken-feeling layouts
than any other.

```css
h2 { margin-block: var(--space-2xl) var(--space-m); }  /* 64px above, 24px below */
```

Related items: tight. Unrelated groups: generous. If everything is `24px` apart, nothing
is grouped and the page reads as a list.

## 3. Grid

| System | Columns | Use |
|---|---|---|
| 12-col | classic | most sites — divides by 2, 3, 4, 6 |
| 16-col | fine control | editorial, asymmetric, dense |
| 8-col | simple | mobile-first, content sites |
| Modular / broken | freeform within a baseline | fashion, portfolio, art direction |

Container widths:
```css
--width-prose:   min(66ch, 100% - var(--gutter) * 2);
--width-content: min(1200px, 100% - var(--gutter) * 2);
--width-wide:    min(1440px, 100% - var(--gutter) * 2);
--width-full:    100%;
```

**Asymmetry is where art direction lives.** A page where every section is a centered
1200px container reads as a template regardless of how good the type is. Vary: full-bleed
against contained, offset columns, content that starts at column 3 and runs to 11, images
that break the gutter. Do it deliberately, on a system — random offsets read as sloppy,
not as designed.

Modern CSS worth using:
```css
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--gutter); }
.auto-fit { grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); }
.full-bleed { grid-column: 1 / -1; }
/* Container queries — component responds to its container, not the viewport */
.card-wrap { container-type: inline-size; }
@container (min-width: 32rem) { .card { grid-template-columns: 1fr 2fr; } }
```

## 4. Section rhythm

The most reliable tell of a templated site is **identical section rhythm**: heading,
paragraph, three cards, repeat. Vary along these axes down the page:

- **Height** — full viewport, tall, medium, short
- **Density** — sparse, balanced, dense
- **Alignment** — centered, left, split, offset
- **Background** — base, surface, inverted, media
- **Content shape** — text-led, image-led, list, data, quote, full-bleed media

Write the rhythm as a sequence before building:
> `hero (full/sparse/media)` → `proof (short/dense/base)` → `story (tall/sparse/split)` →
> `offer (medium/balanced/inverted)` → `detail (tall/dense/base)` → `cta (short/sparse/inverted)`

**Never two adjacent sections with the same background, density, and alignment.**

## 5. Vertical rhythm and optical alignment

- Establish a baseline unit (usually 4px or 8px). Everything lands on it.
- **Optical, not mathematical.** Centered text in a button needs ~1px less bottom padding
  than top because of descender space. Icons next to text align to the *cap height*, not
  the box. A circle next to a square must be slightly larger to look the same size.
- Punctuation and quote marks hang outside the measure.
- Left-aligned rag: check it. A ragged edge with one very short line reads as a mistake.

## 6. Above the fold

At 1440×900 and at 375×667, the first viewport must deliver:
1. What this is
2. Who it is for / why it matters
3. One obvious next action
4. One credibility signal (for commercial sites)

A hero that delivers only #1 is decoration. A hero that needs a scroll to reach #3 loses
conversions — measurably, on every tier.

Mobile hero: the primary CTA must be reachable without scrolling on a 667px-tall viewport.
Test with the browser chrome visible, not in a clean simulator.

## 7. Layout QA checklist
- [ ] All spacing from the scale; zero arbitrary values
- [ ] Heading space above ≥ 2× space below
- [ ] Section rhythm varies on ≥ 2 axes between adjacent sections
- [ ] No two adjacent sections identical in bg + density + alignment
- [ ] At least one deliberate asymmetric or full-bleed moment (T1+)
- [ ] Prose measure 60–75ch
- [ ] No horizontal overflow at 320px
- [ ] Above-fold contract satisfied at 1440×900 and 375×667
- [ ] Optical alignment checked on buttons, icons, and centered text
- [ ] Tap targets ≥ 44×44px with ≥ 8px between them
