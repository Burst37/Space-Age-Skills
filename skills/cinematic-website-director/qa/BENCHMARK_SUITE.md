# Benchmark Suite — Live Regression Testing

Run the skill against these briefs in the target runtime. For each, it must produce:
design intelligence → `DESIGN_DNA` → `TYPOGRAPHY_SYSTEM` → `MOTION_MAP` →
`BUILD_CONTRACT` → QA strategy, at the correct tier.

## Briefs

| # | Brief | Expected tier | Expected motion | Watch for |
|---|---|---|---|---|
| 1 | Local HVAC, emergency callouts | T0 | 0–1 | tel: link, license above fold, no cinematic spend |
| 2 | Luxury fashion house, lookbook-led | T2–T3 | 2–3 | editorial type, image discipline, no card grid |
| 3 | Nightclub, event calendar | T2 | 3 | video weight, ticket path, dark-mode contrast |
| 4 | Restaurant, reservations | T1 | 1–2 | menu and booking path beat atmosphere |
| 5 | Law firm, high-net-worth | T1–T2 | 0–1 | authority, restraint, AAA contrast |
| 6 | Medical / wellness clinic | T1 | 1 | accessibility ceiling on motion, calm palette |
| 7 | AI SaaS | T2 | 2 | must NOT produce the generic AI template |
| 8 | Developer tool | T1–T2 | 1–2 | dense but legible, mono usage, real code samples |
| 9 | Automotive configurator | T3 | 3–4 | 3D justified, perf veto active |
| 10 | Real estate brokerage | T1–T2 | 1–2 | inquiry path, image-led without stock |
| 11 | Nonprofit | T1 | 1 | story + credibility + donation above fold |
| 12 | Artist portfolio | T2–T3 | 3 | expressive composition, asymmetry |
| 13 | Streetwear ecommerce | T2 | 2–3 | brand-heavy commerce, not a card grid |
| 14 | B2B industrial | T1 | 1 | proof and spec clarity |
| 15 | Experimental flagship | T3 | 4 | graceful fallback, a11y still ≥95 |

## Cross-run failure signals

Run all fifteen, then compare outputs. Any of these means the skill is on autopilot:

- Same hero archetype in **> 30%** of outputs
- Same font pairing in **> 25%**
- Same primary color family in **> 30%**
- Motion score 3–4 assigned to a low-value SMB with no written reason
- Glassmorphism appearing without a brand justification
- Three-card feature grid as the primary solution more than twice
- Mobile strategy described only as "stack vertically"
- Identical section rhythm sequence in any two outputs
- Any T0 brief routed through the full eight-judge pipeline
- Any output where the "signature moment" cannot be stated in one sentence

## Per-brief pass criteria

1. Tier matches the expected column (±1 with written reasoning)
2. Motion score within expected range
3. All tier-required artifacts present and fully populated — no blank schema fields
4. Typography names actual families with license status and real `clamp()` values
5. Motion map has zero blank mobile or reduced-motion cells
6. At least one project-specific anti-pattern named (not just the global list)
7. Conversion path stated as a literal click sequence
8. `audit_skill.py` still exits 0 after any skill edits made during the run

## Recording

Log each run in `qa/AUDIT_LOG.md`: date, runtime, brief numbers, failure signals hit,
fixes applied. A benchmark run that finds nothing was probably not run adversarially.
