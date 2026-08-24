# Module 03 — Typography Director

> Decision process. For scales, tracking tables, curated pairings and loading code, load
> `references/TYPE_CRAFT.md` — this module tells you *what to decide*, that file tells you
> *what the numbers are*.

## Mission
Make typography a primary brand and composition system, not a styling afterthought.

## Required decisions
1. Typography archetype (from the taxonomy in TYPE_CRAFT)
2. Display family
3. Body family
4. Utility/label family — only if it earns its weight
5. Weight map (which weights exist, and what each one *means*)
6. Fluid type scale with real `clamp()` values
7. Line-height map by size band
8. Tracking map by size band
9. Measure / max-width in `ch`
10. Case rules (where uppercase is allowed and why)
11. Numeral behavior — tabular vs proportional, lining vs oldstyle
12. Font loading strategy
13. Metric-matched fallback stack
14. Licensing and source availability
15. Mobile recomposition rules

## Family-count discipline
- **2 families** is the default and covers most premium work.
- **1 family** (a good variable face used across weights and optical sizes) is a strong,
  confident choice — not a cheap one.
- **3 families** requires a written reason. The third is almost always a mono or a label face.
- **4+** is a defect. Log it as `medium` and fix it.

## Pairing rubric
Score 0–10, all ten. A pairing that wins on distinctiveness and loses on body readability
loses outright.

brand fit · contrast without conflict · headline performance · body readability ·
available weights · variable-font support · web performance · licensing practicality ·
mobile behavior · distinctiveness.

**Contrast without conflict** is the one people get wrong: two faces should differ on
*one* strong axis (serif vs sans, or geometric vs humanist, or high vs low contrast) and
agree elsewhere. Two faces that differ on every axis fight; two that differ on none look
like a mistake.

## Substitution law
Do not require proprietary fonts a project cannot legally license or host. Preserve the
**typographic class** with a suitable alternative and say what was substituted and why.
TYPE_CRAFT carries a commercial → open substitution table.

## Artifact shape
```yaml
display:
  family:
  weight:
  size: clamp(2.5rem, 1.2rem + 5vw, 6rem)
  line_height: 0.95
  tracking: -0.03em
  max_width_ch: 18
  wrap_strategy: balance
body:
  family:
  weight: 400
  size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
  line_height: 1.6
  tracking: 0
  max_width_ch: 68
label:
```

## Typography QA — reject on any of these
- A popular default face chosen with no written rationale
- More than three families without justification
- Sustained body copy above ~75ch or below ~45ch
- Cramped leading on body (< 1.45) or loose leading on display (> 1.15)
- Aggressive negative tracking on text below 24px
- Fake hierarchy built only from size — no weight, color, or spacing differentiation
- Identical type treatment in every section
- Text clipping or overlapping at any breakpoint between 320px and 1920px
- Fallback stack that shifts layout on swap (no metric matching)
- Orphans or two-word widows in the hero headline
- Uppercase body copy anywhere
