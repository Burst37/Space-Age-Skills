---
name: design-review-pro
description: Use when asked to review UI code for design quality, accessibility, or "Web Interface Guidelines" compliance, or before shipping any new frontend page/component — checks visual/interaction polish AND accessibility/performance together rather than just style.
---

# Design Review Pro

## Overview

Forked from [multica-ai/multica](https://github.com/multica-ai/multica)'s `.agents/skills/web-design-guidelines` skill (originally vercel's web-interface-guidelines reviewer), which fetches a remote rules doc and checks files against it. The original only checks interface/interaction guidelines — it has no accessibility or performance gate, so a visually "compliant" component can still fail WCAG or ship unoptimized assets. This version adds that gate and a final verify pass.

## When to Use

- "Review my UI" / "check accessibility" / "audit this component"
- Before marking any new page/component as done
- NOT for backend-only or non-UI code changes

## Core Pattern

Original: fetch guidelines → read files → check against rules → report `file:line`.

10x addition — two extra passes after the original review:

1. **Accessibility/performance pre-flight** (new): WCAG AA contrast, `prefers-reduced-motion` respected for animations, full keyboard navigation (focus visible, tab order, no keyboard traps), semantic HTML (landmarks, heading order, labeled form controls), image weight (no unoptimized multi-MB images), font loading strategy (no FOIT for critical text), transparency/blur fallbacks for older browsers.
2. **Verify loop** (new): after fixes, re-check the specific items that failed — don't just report and stop.

## Quick Reference

| Pass | Checks | Source |
|---|---|---|
| 1. Interface guidelines | Original vercel-labs rules (spacing, states, feedback, forms) | `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` |
| 2. Accessibility/perf | Contrast, reduced-motion, keyboard nav, semantics, image/font weight | new |
| 3. Verify | Re-check items flagged in pass 1-2 after fixes applied | new |

## Implementation

```
1. WebFetch guidelines from vercel-labs URL
2. Read target files
3. Pass 1: apply fetched guidelines, output file:line findings
4. Pass 2 (a11y/perf gate):
   - grep for color values used as text-on-background; estimate contrast ratio
   - check animations/transitions for `prefers-reduced-motion` media query
   - check interactive elements have visible :focus styles and are reachable via Tab
   - check <img>/<svg> have alt text; headings are sequential (h1->h2->h3, no skips)
   - check image file sizes / next/image usage; check font-display strategy
5. If fixes requested: apply fixes for High findings from both passes
6. Pass 3 (verify): re-check each fixed item individually, report pass/fail per item
```

## Common Mistakes

- **Stopping after pass 1** — a component can pass interface guidelines (spacing, states) while failing contrast or keyboard nav entirely.
- **Reporting findings without re-verifying fixes** — "I fixed the contrast issue" without recomputing the ratio is an unverified claim.
- **Treating reduced-motion as optional polish** — it's an accessibility requirement for users with vestibular disorders, not a nice-to-have.
- **Only checking the changed file** — heading hierarchy and landmark structure are page-level; check the component in context of its parent.
