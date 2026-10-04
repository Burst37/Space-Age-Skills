# QA LEDGER — <project>

> Tier: T_ · Round: _ · Ref thresholds: `SKILL.md §6`

## Defects
| ID | Area | Severity | Evidence (selector / breakpoint / measured value) | Required Fix | Status | Regression Risk |
|---|---|---|---|---|---|---|
| Q-001 | | critical/high/medium/low | | | open | |

<!-- "Feels off" is not evidence. Name a selector, a breakpoint, or a number. -->

## Judge Scores
| Judge | Score | Veto | Round 1 | Round 2 | Round 3 |
|---|---|---|---|---|---|
| Creative Director | | | | | |
| UI/UX Director | | | | | |
| Typography Director | | | | | |
| Motion Director | | | | | |
| Conversion Strategist | | | | | |
| Frontend Engineer | | | | | |
| Performance Engineer | | | | | |
| Accessibility Reviewer | | | | | |

## Deterministic Gate
```
scripts/audit_build.py output:
```
- Status: PASS | FAIL

## Deviations from Locked Artifacts
| Artifact | Locked value | Shipped value | Reason | Approved by |
|---|---|---|---|---|

## Measured Performance
| Metric | Budget | Measured | Method |
|---|---|---|---|
| LCP | | | Lighthouse mobile, median of 3 |
| INP | | | |
| CLS | | | |
| Lighthouse Perf | | | |
| Lighthouse A11y | | | |

## Unresolved Trade-offs
<!-- Record rather than loop. Two rounds with no score movement = stop and report. -->
-

## Exit Gate
- [ ] No critical defects
- [ ] No unresolved high defects
- [ ] All tier thresholds met (`SKILL.md §6`)
- [ ] `audit_build.py` PASS
- [ ] No hard disqualifier present (`references/ANTI_SLOP_AND_QUALITY_GATES.md §3`)
- [ ] Reduced-motion path verified in browser
- [ ] Keyboard path through primary conversion verified
- [ ] Responsive verified at all contract breakpoints
- [ ] Every visible type/space/motion choice can be justified without "looks cool"
