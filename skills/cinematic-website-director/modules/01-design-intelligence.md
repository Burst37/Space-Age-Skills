# Module 01 — Design Intelligence Director

## Mission
Turn a business brief and references into a **defendable** design strategy before any code exists.

## Inputs
Business, audience, conversion goal · brand assets and current site · reference sites,
screenshots, moodboards · stack and performance constraints · motion tolerance ·
commercial tier · content and asset reality.

## Reasoning matrix
Score every candidate decision across all twelve. A decision that scores well on
aesthetics and poorly on trust or conversion is not a decision, it is a preference.

1. Product/business archetype
2. Industry trust profile — `low | medium | high | regulated`
3. Audience sophistication
4. Conversion path length (one-click call → multi-touch enterprise)
5. Layout genome
6. Visual style
7. Palette family
8. Typography class
9. Motion intensity ceiling
10. Content density
11. Hero archetype
12. Proof architecture

## Output schema
```yaml
design_intelligence:
  tier: T0|T1|T2|T3
  experience_archetype:      # e.g. editorial-gallery, product-exhibition, trust-utility
  brand_attributes: []       # 3-5 adjectives, no synonyms
  trust_requirement: low|medium|high|regulated
  conversion_goal:           # single primary action, named
  conversion_path:           # the literal click sequence to that action
  layout_genome:             # grid, alignment bias, asymmetry, rhythm signature
  visual_language:
  density: sparse|balanced|dense
  color_strategy:
  typography_class:          # from TYPE_CRAFT taxonomy
  motion_score: 0-4
  hero_strategy:
  proof_strategy:
  navigation_strategy:
  section_rhythm: []         # ordered list of section intents, not section names
  mobile_strategy:           # what recomposes, not "stacks"
  performance_budget:        # ref PERFORMANCE_BUDGETS by tier
  anti_patterns: []          # what this specific project must avoid
  uncertainty: []            # what you'd ask the client if you could
```

## Hero archetypes
Pick deliberately; do not default to #1.

| Archetype | Reads as | Fits |
|---|---|---|
| Centered statement | confident, editorial | brand-led, single strong claim |
| Split editorial | considered, premium | service businesses with a face or product |
| Full-bleed media | cinematic, visceral | hospitality, fashion, nightlife, automotive |
| Type-as-image | art-directed, bold | agencies, portfolios, fashion, culture |
| Utility-first | trustworthy, fast | local service, medical, legal, emergency |
| Product exhibition | tactile, considered | ecommerce, hardware, DTC |
| Data/proof-forward | credible, technical | B2B, developer tools, fintech |
| Layered depth | immersive | flagship, experimental, entertainment |

## Direction generation law *(T1+)*
Each direction must differ in **composition, typography class, and interaction
philosophy**. Not color. Each needs a stated reason to exist and an honest trade-off.

Write directions as:
> **Direction A — "<name>"**: `<archetype>` hero, `<type class>` typography, `<interaction philosophy>`.
> Wins on `<x>`. Costs `<y>`. Right if the client values `<z>`.

## Reference teardown
Extract **mechanisms, not decoration**: hierarchy · content rhythm · whitespace and
density · type scale ratio · image behavior · transition logic · scroll pacing ·
interaction grammar · navigation behavior · trust and conversion flow · performance
implications.

Never clone brand identity, proprietary assets, copy, or exact page composition.
A teardown that produces "make it look like theirs" has failed. It should produce
"they use a 1.333 scale with 72ch measure and one signature pin — that discipline
transfers, their serif does not."

## Industry anti-patterns
| Industry | Avoid |
|---|---|
| Legal / medical | novelty that erodes trust; motion over 2; playful type |
| Luxury | over-explaining, card grids, cheap glow, gold-on-black shorthand |
| Nightlife / entertainment | sterile SaaS layout, timid color, low contrast |
| Local services | expensive effects that bury the call/book path |
| Fashion | generic ecommerce card grid as the only visual language |
| SaaS / AI | the universal AI landing template (see NON-GENERIC LAW) |
| Restaurants | hero video with no menu path; unreadable script faces |
| Real estate | gallery with no inquiry path; stock interiors as hero |
| Nonprofit | stock smiling photography; donation path below fold |

## Gate
**No code** until this module produces an approved direction, or consumes one already approved.
