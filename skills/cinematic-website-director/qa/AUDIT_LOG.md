# Audit Log

## 2026-08-24 — V7.0 → V7.1 package audit

**Reviewed:** the Codex-consolidated V7 package (SKILL.md + 7 modules + 1 reference +
5 templates + 3 qa files + 1 script, 1,211 lines).

### What V7.0 got right and kept
Governance hierarchy · artifact contract · phase loop · fresh-context design loop ·
multi-judge crucible · model-agnostic framing · non-generic design law · degradation
rules · benchmark suite concept · project-state module.

### Defects found and fixed

| # | Severity | Defect | Fix in 7.1 |
|---|---|---|---|
| 1 | **critical** | **Zero craft.** 1,211 lines of process with no type scale, easing value, contrast ratio, spacing number, or line of code. A model could follow every step and still produce generic work — the exact failure the skill exists to prevent. | Added 8 craft references (~1,140 lines) with real numbers: `TYPE_CRAFT`, `MOTION_CRAFT`, `COLOR_AND_SURFACE`, `LAYOUT_AND_SPACE`, `CONVERSION_CRAFT`, `PERFORMANCE_BUDGETS`, `EFFECT_LIBRARY`, `ECOSYSTEM_HANDOFF`. |
| 2 | **critical** | **Unfalsifiable QA.** Score gates ("≥9.5") with no rubric. Self-scoring against an unanchored scale returns ~9.4 every time. | Anchored 1–10 rubric with observable descriptors + forced-fail conditions per category + mandatory evidence per score. |
| 3 | **high** | **No cost governor.** One pipeline for every project. Running 3 directions + 8 judges on a $500 lead-gen site is economically incoherent with the Space Age pipeline. | Tier router (T0–T3) driving direction count, artifact set, judge panel, thresholds, and budgets. Conversion/responsive/a11y thresholds deliberately do **not** drop with tier. |
| 4 | **high** | **`audit_skill.py` was a substring check.** `"TYPOGRAPHY" in master` passes on a file mentioning the word once. Zero validation value. | Rewritten as a real linter: reference-integrity, frontmatter, numeric-coverage, code-pattern, tier-table, and contradiction checks. |
| 5 | **high** | **No deterministic build gate.** Quality rested entirely on LLM opinion. | Added `scripts/audit_build.py` — mechanical anti-slop, contrast, a11y, motion and font checks on produced HTML/CSS. |
| 6 | **high** | **Discarded the working code.** Superseded `cinematic-website-builder` and its 30 tested effect modules with prose. | `EFFECT_LIBRARY.md` indexes all 30 with motion score, cost, archetype fit and mobile default, and routes to the builder for implementation. |
| 7 | **medium** | **No ecosystem wiring.** Named lineage but had no handoff contract with `lead-to-brief`, `brand-extractor`, `ui-ux-designer`, `local-business-seo`, etc. | `ECOSYSTEM_HANDOFF.md` with inbound/outbound tables and a `locked_decisions` packet shape. |
| 8 | **medium** | **Conversion was a score category with no craft.** | `CONVERSION_CRAFT.md`: CTA hierarchy, ranked proof architecture, form friction, above-fold contract, industry trust signals. |
| 9 | **medium** | **Description would not fire the skill.** An 8-line abstract classification blurb with no trigger language. | Rewritten in user-trigger terms ("build, design, redesign a website / landing page / hero…"). |
| 10 | **medium** | Non-standard top-level frontmatter keys (`display_name`, `version`, `maintainer`, `classification`). | Moved under `metadata:`, matching repo convention. |
| 11 | **low** | Folder name carried a `SpaceAge_` prefix and CamelCase, against CLAUDE.md rule #5. | Renamed `cinematic-website-director`, lowercase-hyphen. |
| 12 | **low** | Templates were empty headings with no guidance on what a good answer looks like. | Every template now carries inline constraints, contrast targets, and its own exit checklist. |

### Verification
- `scripts/audit_skill.py` — exits 0
- `scripts/audit_build.py` — self-tested against a deliberately slop-laden fixture and a clean fixture
- All internal cross-references resolve

### Not yet verified
Live benchmark runs (`BENCHMARK_SUITE.md`) against a target runtime. No written skill can
prove visual output quality without executing representative builds. This package proves
internal consistency, executability, economic routing, and deterministic gating — not that
a given run wins an award. Run the 15 briefs and record results here before claiming more.

---

## 2026-08-24 — Benchmark run (V7.1)

Full 15-brief suite executed. Results: `BENCHMARK_RUN_2026-08-24.md`.

**Passed** all 10 cross-run failure signals and all 8 per-brief criteria. 15/15 briefs
routed to the correct tier with no ±1 deviations. Max repeated hero archetype 13.3%
(threshold 30%); max repeated font pairing 6.7% (threshold 25%); zero glassmorphism, zero
three-card-grid-as-primary, zero "stack vertically" mobile strategies.

**Executability proof:** brief 1 (HVAC, T0) built end-to-end and gated —
`audit_build.py --tier T0` PASS, 0 blockers, 0 warnings, body contrast 15.36:1 (AAA).
Source: `benchmark-artifacts/01-hvac/`.

**Findings**

| ID | Severity | Finding | Action |
|---|---|---|---|
| F-1 | low | `EFFECT_LIBRARY` archetype lists omitted medical/wellness, real estate, nonprofit, B2B industrial — 4 of the 15 brief types had no shortcut row | Fixed: 4 rows added |
| F-2 | low | "Choose 1–3 signature moments" read as a floor; a careless run would invent a signature at motion ≤1 | Fixed: module 04 now states the correct count at motion 0–1 is zero |
| F-3 | info | Dark-ground distribution 27% vs a 30% line — nearest near-miss | Recorded; measure again next run |
| F-4 | structural | Run was executed by the package's own author — proves divergence and executability, **not quality** | Unfixable in-session. Mitigated: `FRESH_CONTEXT_JUDGE.md` added for cross-model evaluation |

**Standing limitation.** No quality verdict exists yet. `FRESH_CONTEXT_JUDGE.md` carries
three packets (skill / build / divergence spot-check) to run in Codex, Gemini, DeepSeek or
a memoryless Claude session. Until at least Packet A and Packet B have been run and logged
here, the honest claim is "diverges and executes," not "best in class."
