# Skill Gauntlet — Evaluating the Package Itself

> This file evaluates the **skill**, not a website. For evaluating a build, use
> `modules/06-quality-crucible.md` + `scripts/audit_build.py`.

## Why the previous version of this file did not work

It demanded "architecture ≥ 9.5" with no rubric. An LLM asked to score its own artifact
against an unanchored 10-point scale returns 9.2–9.6 essentially every time, regardless of
quality. **Unanchored scores are theater.** Every score below is anchored to observable
conditions, and every category carries a forced-fail condition that overrides the score.

## Rubric — anchored scale

Use these anchors for **all** scoring in this skill, including the Phase C design loop and
the Crucible.

| Score | Anchor |
|---|---|
| 10 | Best-in-class. Nothing to add; a specialist would learn from it. |
| 9 | Ships as-is. A specialist would sign it. One optional refinement at most. |
| 8 | Ships after named minor fixes. No structural problem. |
| 7 | Competent but unremarkable. Would not lose a client; would not win an award. |
| 6 | Works, with a real weakness a competitor would beat. |
| 5 | Generic. Indistinguishable from a template. |
| 3 | Actively harms the goal. |
| 1 | Broken or unusable. |

**A score is invalid without evidence.** Every score cites a specific line, section, value,
or observation. "Feels strong — 9.4" is not a score.

Do not use decimals finer than 0.5. Precision you cannot justify is false precision.

## Reviewers

### A — Skill Architect
Module boundaries · precedence hierarchy · no circular dependencies · artifact contracts ·
context efficiency · every referenced path exists.
**Forced fail:** any broken internal reference, or two files giving conflicting instructions.

### B — UI/UX Director
Are the rules sufficient to prevent generic layout autopilot?
**Forced fail:** no concrete spacing, grid, or hierarchy numbers anywhere in the package.

### C — Typography Director
Explicit selection logic, scale, responsive behavior, loading, QA.
**Forced fail:** no actual scale ratios, `clamp()` values, or leading/tracking numbers.

### D — Motion Director
Opportunity selection, scroll grammar, easing, mobile behavior, reduced motion.
**Forced fail:** no cubic-bezier values or duration ranges; or reduced-motion mentioned
without a working pattern.

### E — Senior Frontend Engineer
Can these instructions become executable HTML/CSS/JS/React/GSAP work?
**Forced fail:** a builder could follow the whole package and still not know what to type.

### F — Model Portability Engineer
Assumptions tied to a single vendor's tooling.
**Forced fail:** a required step that only works in one runtime with no adapter.

### G — Economics Reviewer
Does pipeline cost match project value?
**Forced fail:** a $500 lead-gen site is routed through the full multi-direction,
eight-judge pipeline.

### H — Adversarial Operator
Run all ten stress prompts. Each must produce a materially different plan.

1. Premium law firm, no flashy visuals
2. Avant-garde fashion, aggressive typography
3. $500 plumber site that must still look professional
4. Luxury nightlife with full-screen video
5. SaaS that must not look like generic AI SaaS
6. Site combining two reference interaction languages
7. Mobile-first service business on weak devices
8. Existing brand with strict fonts and colors
9. Flagship WebGL with a hard performance limit
10. No usable imagery — typography must carry the design

**Forced fail:** any two prompts produce substantially the same hero, type class, and
motion score.

## Required package scores

| Category | Min | Forced-fail condition |
|---|---|---|
| Architecture | 9.0 | broken reference or internal contradiction |
| UI/UX intelligence | 9.0 | no concrete layout numbers |
| Typography intelligence | 9.0 | no scale/leading/tracking values |
| Motion intelligence | 9.0 | no easing or duration values |
| Frontend executability | 9.0 | no runnable code patterns |
| Portability | 9.0 | vendor lock with no adapter |
| Context efficiency | 8.5 | router loads everything regardless of task |
| Economics fit | 9.0 | no tier routing |
| Failure handling | 9.0 | degradation rules absent or vague |
| QA rigor | 9.5 | scoring unanchored, or no deterministic gate |
| Anti-generic protection | 9.5 | forbidden list with no positive craft alternative |

**Also required:** zero critical contradictions · zero broken references ·
`scripts/audit_skill.py` exits 0.

## Honest limitation

No written skill can prove visual output quality. This package can prove it is
*internally consistent, executable, economically routed and deterministically gated*.
Proving it produces award-winning work requires running `BENCHMARK_SUITE.md` against a
live runtime and judging the actual output. Claims of untested perfection are exactly the
overconfidence this skill exists to prevent.
