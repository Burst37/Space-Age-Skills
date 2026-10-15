# TYPOGRAPHY SYSTEM — <project>

> Version: 1.0 · Derived from DESIGN_DNA typography class · Ref: `references/TYPE_CRAFT.md`

## Families
| Role | Family | Weights used | Source | License | Fallback |
|---|---|---|---|---|---|
| Display | | | | | |
| Body | | | | | |
| Utility | | | | | |

- Substitution made?          <!-- commercial face replaced with open equivalent? name it -->
- Total font files:           <!-- ≤4 -->
- Scale ratio:

## Scale
| Token | clamp() | Line height | Tracking | Weight | Measure (ch) |
|---|---|---|---|---|---|
| display-xl | | | | | |
| display | | | | | |
| h1 | | | | | |
| h2 | | | | | |
| h3 | | | | | |
| body-lg | | | | | |
| body | | | 0 | | 66 |
| small | | | | | |
| label | | | | | |

## Hierarchy differentiators
<!-- must be ≥3: size, weight, color, case, tracking, family, spacing, rule, position -->
-

## Responsive Rules
- Desktop:
- Tablet:
- Mobile:
- Hero wrapping:              <!-- text-wrap, forced breaks, nbsp strategy -->
- Orphan/widow strategy:

## Loading
- Preloaded faces:            <!-- max 2 -->
- Subset ranges:
- `font-display`:
- Fallback metric overrides:  <!-- size-adjust / ascent-override / descent-override -->
- Verified no shift on swap:  [ ]

## QA
- [ ] Every size traces to the scale ratio
- [ ] Leading/tracking per TYPE_CRAFT size bands
- [ ] Body measure 60–75ch at all breakpoints
- [ ] No hero orphan at 375 / 768 / 1440
- [ ] Fallback metric-matched, tested with fonts blocked
- [ ] ≤3 families, ≤4 files
- [ ] Hierarchy uses ≥3 differentiators
- [ ] No negative tracking under 24px
- [ ] Tabular numerals where numbers align
- [ ] No clipping or overflow at 320px
