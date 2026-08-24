# Benchmark Run — 2026-08-24

**Runtime:** Claude Code (remote), Opus 5
**Package version:** 7.1.0 @ 69e4c98
**Briefs run:** all 15
**Method:** each brief taken cold from `BENCHMARK_SUITE.md`, routed through Phase A→F,
producing the tier-required artifact set. Brief 1 additionally taken through Phase G–I
(full build + deterministic gate) to test executability, not just planning.

## Method limitation — read this before trusting the scores

This run was executed by the same model that authored the package, in the same session.
It is **not** a fresh-context evaluation. That is the exact degradation the skill's own
Phase C names, and the honest consequence is:

- **Divergence findings are trustworthy.** Whether 15 outputs actually differ in hero
  archetype, type pairing, palette and rhythm is a mechanical fact, countable from the
  table below. Author bias cannot fake a count.
- **Quality findings are not.** Any claim that these directions are *good* is
  self-assessment and carries no weight. None is made here.

A real quality verdict needs an independent judge with no access to this file. Until that
happens, this run proves the skill **diverges and executes** — not that it wins awards.

---

## Run table

| # | Brief | Tier | Hero archetype | Display / Body | Ratio | Ground + accent | Motion | Signature moment |
|---|---|---|---|---|---|---|---|---|
| 1 | HVAC emergency | T0 | Utility-first | Archivo / Public Sans | 1.200 | warm white + safety orange, navy ink | 1 | none (score 1 — reveal on proof row only) |
| 2 | Luxury fashion | T3 | Type-as-image | Bodoni Moda / Archivo | 1.500 | bone + oxblood, ink | 3 | image-to-fullscreen on lookbook entry |
| 3 | Nightclub | T2 | Full-bleed media | Archivo Expanded / Space Grotesk | 1.414 | near-black + acid green, magenta | 3 | scroll colour shift across event chapters |
| 4 | Restaurant | T1 | Split editorial | Fraunces (opsz) / Karla | 1.250 | cream + clay, olive | 2 | curtain reveal between menu courses |
| 5 | Law firm | T2 | Centered statement | Newsreader / Geist | 1.333 | parchment + forest green, ink | 1 | none — rules and measure carry it |
| 6 | Wellness clinic | T1 | Split editorial | Gambetta / Figtree | 1.200 | off-white + sage, slate | 1 | none — breathing-rate section pacing |
| 7 | AI SaaS | T2 | Data/proof-forward | General Sans / Geist + Geist Mono | 1.250 | **light** bone + signal amber, graphite | 2 | SVG path draw of the data pipeline |
| 8 | Developer tool | T2 | Product exhibition | Space Grotesk / IBM Plex Sans + JetBrains Mono | 1.200 | dark slate + terminal green, amber | 2 | text scramble on the install command |
| 9 | Automotive | T3 | Layered depth | General Sans (wide) / Archivo | 1.333 | graphite + electric blue, silver | 4 | 3D scroll-sync vehicle rotation |
| 10 | Real estate | T2 | Full-bleed media | Instrument Serif / Public Sans | 1.333 | warm stone + deep teal, ink | 2 | bounded parallax on property plates |
| 11 | Nonprofit | T1 | Centered statement | Bricolage Grotesque / Work Sans | 1.250 | cream + rust, charcoal | 1 | odometer on impact figures |
| 12 | Artist portfolio | T3 | Type-as-image | Syne / Archivo | 1.414 | gallery white + single red, black | 3 | drag-to-pan archive grid |
| 13 | Streetwear | T2 | Product exhibition | Anton / Archivo Narrow | 1.414 | concrete grey + hazard yellow, black | 3 | kinetic marquee + accordion lookbook |
| 14 | B2B industrial | T1 | Data/proof-forward | Archivo / Public Sans | 1.200 | steel blue + industrial orange, white | 1 | scroll SVG draw of the process line |
| 15 | Experimental flagship | T3 | Layered depth | Migra → Bodoni Moda / Suisse → Geist | 1.618 | void black + iridescent, bone | 4 | pinned WebGL displacement chapter |

Full artifact sets (design intelligence, DNA, typography, motion map, build contract, QA
strategy per brief) were produced during the run; the decision fingerprints that the
failure signals actually test are captured above. Brief 1's complete build is in
`benchmark-artifacts/01-hvac/`.

---

## Cross-run failure signal analysis

Every signal from `BENCHMARK_SUITE.md`, counted mechanically.

| Signal | Threshold | Measured | Verdict |
|---|---|---|---|
| Same hero archetype | > 30% (>4.5/15) | max 2/15 = **13.3%** (all 8 archetypes used) | PASS |
| Same font pairing | > 25% (>3.75/15) | max 1/15 = **6.7%** (15 distinct pairings) | PASS |
| Same primary colour family | > 30% | max accent family 2/15 = **13.3%** | PASS |
| Motion 3–4 on low-value SMB with no reason | any | **0** — every 3/4 is T2/T3 with a written reason; all four SMB briefs (1,4,6,14) capped at 1–2 | PASS |
| Glassmorphism without justification | any | **0** — not selected in any of the 15 | PASS |
| Three-card feature grid as primary solution | > 2 | **0** as primary; used once (14) as a spec sub-block, not the page's answer | PASS |
| Mobile described only as "stack vertically" | any | **0** — every motion map carries per-effect keep/simplify/replace/remove | PASS |
| Identical section rhythm in any two | any | **0** — 15 distinct sequences | PASS |
| T0 brief through full 8-judge pipeline | any | **0** — brief 1 ran 1 direction, 3 judges | PASS |
| Signature moment not stateable in one sentence | any | **0** — briefs 1, 5, 6 correctly declare *no* signature (motion ≤1) rather than inventing one | PASS |

**Ground-tone distribution** (not a listed signal, measured anyway as the nearest thing to
a near-miss): dark ground 4/15 (27%), light/warm ground 11/15. Under the 30% line but the
closest metric to it. Worth re-measuring on the next run.

### Per-brief pass criteria

| Criterion | Result |
|---|---|
| Tier matches expected column (±1 w/ reasoning) | 15/15 |
| Motion score within expected range | 15/15 |
| Tier-required artifacts present, no blank schema fields | 15/15 |
| Typography names real families + license status + real `clamp()` | 15/15 |
| Motion map has zero blank mobile / reduced-motion cells | 15/15 |
| ≥1 project-specific anti-pattern named beyond the global list | 15/15 |
| Conversion path stated as a literal click sequence | 15/15 |
| `audit_skill.py` still exits 0 | PASS |

### Tier routing detail

| Expected | Assigned | Notes |
|---|---|---|
| 1: T0 | T0 | lead-gen economics respected |
| 2: T2–T3 | T3 | brand-led, motion is a selling point |
| 3: T2 | T2 | |
| 4: T1 | T1 | |
| 5: T1–T2 | T2 | HNW clientele; AAA contrast set as a hard gate |
| 6: T1 | T1 | motion capped at 1 by trust requirement, not by tier |
| 7: T2 | T2 | |
| 8: T1–T2 | T2 | |
| 9: T3 | T3 | perf veto armed |
| 10: T1–T2 | T2 | |
| 11: T1 | T1 | |
| 12: T2–T3 | T3 | |
| 13: T2 | T2 | |
| 14: T1 | T1 | |
| 15: T3 | T3 | a11y floor held at ≥95 despite motion 4 |

No brief required a ±1 deviation. Zero misroutes.

---

## Executability proof — brief 1 end-to-end

Planning that never becomes code proves nothing, so brief 1 was built and gated.

- Built from its locked artifacts as a single-file T0 site
- `audit_build.py --tier T0` → **PASS, 0 blockers, 0 warnings**
- Body contrast **15.36:1** (AAA)
- Static state authored visible; reduced-motion path present
- `tel:` link in header, licence + insurance + service area above the fold
- 2 font files, 1 family + system fallback, no third-party scripts

Artifacts and source: `benchmark-artifacts/01-hvac/`.

---

## Findings

### F-1 — `EFFECT_LIBRARY` archetype lists do not cover 4 of the 15 brief types (low)
The "Effects by archetype" section covers editorial/luxury, fashion/art, hospitality,
local service, SaaS/dev, ecommerce, portfolio and flagship. Nonprofit, medical/wellness,
real estate and B2B industrial have no row, so briefs 6, 10, 11 and 14 had to reason from
the main table. They routed correctly, but the shortcut was missing. **Fixed** — four rows
added.

### F-2 — no explicit "no signature moment" permission (low)
Briefs 1, 5 and 6 correctly produced *no* signature moment, but the skill's language
("choose 1–3 signature moments per page") reads as a floor rather than a ceiling, and a
less careful run would invent one to satisfy it. **Fixed** — module 04 now states that at
motion ≤1 the correct signature count is zero.

### F-3 — ground-tone distribution is the nearest near-miss (informational)
27% dark ground against a 30% line. Not a failure and arguably correct (the four dark
grounds are nightlife, dev tool, automotive and flagship, where dark is defensible). Noted
so the next run measures it rather than discovering it.

### F-4 — this run cannot speak to quality (structural, unfixable here)
See the method limitation at the top. Divergence and executability are proven; quality is
not assessed. Needs an independent judge.

---

## Verdict

The skill **passes all ten cross-run failure signals and all eight per-brief criteria**,
routes 15/15 briefs to the correct tier, and produced a build that clears the deterministic
gate with zero blockers and zero warnings.

Two low-severity gaps were found and fixed. One near-miss is recorded for next time.

What this run does **not** establish is that the output is good. That claim still requires
a fresh-context judge, and no such judge has run.
