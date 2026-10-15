# Module 06 — Quality Crucible

## Mission
Adversarially test the completed build and repair it — without endless self-polish.

## Fresh-context rule
Best: separate agents/contexts judge independently, with no access to builder rationale
until after scoring. Fallback: explicit isolated reviewer passes, limitation recorded in
the ledger. A builder grading its own work is not a review.

## Judge panel by tier
| Judge | T0 | T1 | T2 | T3 |
|---|---|---|---|---|
| UI/UX Director | ✓ | ✓ | ✓ | ✓ |
| Conversion Strategist | ✓ | ✓ | ✓ | ✓ |
| Accessibility Reviewer | ✓ | ✓ | ✓ | ✓ |
| Creative Director | | ✓ | ✓ | ✓ |
| Frontend Engineer | | ✓ | ✓ | ✓ |
| Typography Director | | | ✓ | ✓ |
| Motion Director | | | ✓ | ✓ |
| Performance Engineer | | | ✓ | ✓ (veto) |

### What each judge owns
- **Creative Director** — brand fit, distinctiveness, emotional impact, art direction coherence.
- **UI/UX Director** — hierarchy, IA, spacing, navigation, interaction clarity, responsive behavior.
- **Typography Director** — family choice, hierarchy, line breaks, measure, tracking, leading, loading behavior.
- **Motion Director** — intent, timing, easing, choreography, scroll stability, restraint, reduced motion.
- **Conversion Strategist** — CTA hierarchy, trust, proof, friction, path to the commercial goal.
- **Frontend Engineer** — architecture, maintainability, runtime correctness, cross-browser behavior.
- **Performance Engineer** — media weight, JS/GPU cost, layout shift, real-device feel. Holds **veto at T3**.
- **Accessibility Reviewer** — contrast, keyboard, semantics, motion sensitivity, touch.

## Critique schema
```yaml
judge:
score:               # anchored to qa/SKILL_GAUNTLET.md §Rubric — never freehand
veto: true|false
strengths: []
issues:
  - severity: critical|high|medium|low
    evidence:        # what you saw, where. "feels off" is not evidence
    fix:             # specific and implementable
regression_risk:
```

**Evidence discipline:** every issue names a selector, a section, a breakpoint, or a
measured value. An issue without evidence is an opinion and gets dropped.

## Deterministic gate
Judges are necessary but not sufficient. Run `scripts/audit_build.py <path>` and attach
its output to the ledger. A build failing the script does not ship on judge opinion.

## Repair law
- Fix highest severity / largest quality delta first
- Prefer surgical changes; preserve already-passing systems
- Re-run only affected judges, plus one integration regression pass
- Full redesign only when the **direction** is the failure, not the execution

## Stop conditions
Stop when tier thresholds are met, or when further changes produce no measurable gain.
Record unresolved trade-offs in the ledger rather than looping. Two consecutive rounds
with no score movement means stop and report — polish loops are how deadlines die.
