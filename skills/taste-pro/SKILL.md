---
name: design-taste-pro
description: Anti-slop frontend design skill with brief inference, three-dial calibration, design-system mapping, an accessibility/performance pre-flight, and a verify-against-the-read closing loop. Use for landing pages, portfolios, and redesigns where the output must not look AI-generated.
metadata:
  origin: Forked and 10x'd from Leonxlnx/taste-skill. Adds a confidence-checked "Design Read" step (pattern borrowed from EveryInc compound-engineering's ce-plan auto-strengthening), an accessibility/performance pre-flight checklist (missing from the original), and a closing verify-loop (pattern borrowed from Karpathy guidelines #4).
  license: MIT
---

# Design Taste Pro

> Landing pages, portfolios, redesigns. Not dashboards, not data tables, not multi-step product UI.
> Every rule is **contextual** — read the brief first, pull only what fits.

This is a 10x rework of `taste-skill`. The original nailed brief-reading, the three dials,
and design-system mapping (all kept below, condensed). What it was missing: a way to
**check your own design read before committing**, an **accessibility/performance gate**
(a frontend can have great taste and still fail real users), and a **closing loop** that
verifies the shipped output actually matches the read you declared at the start.

## 0. Brief Inference → Design Read (kept, with one addition)

Read these signals first: page kind, vibe words, reference signals (URLs/screenshots/named
products), audience, existing brand assets, quiet constraints (accessibility-first,
public-sector, regulated, kids' products — these OVERRIDE aesthetic preference).

State a one-line **Design Read**:
> "Reading this as: `<page kind>` for `<audience>`, with a `<vibe>` language, leaning toward `<system/aesthetic>`."

### 0.X Confidence Check (new)

Before generating anything, rate your own Design Read 1–5 on confidence. If it's a 3 or
below, that's not a green light to guess harder — it's a signal to ask **one** clarifying
question (never a multi-question dump), exactly as the original recommended. The new part:
**say which part is uncertain**, e.g. *"Confident on page kind and audience (5/5); unsure
whether 'clean' means Linear-minimal or Apple-premium (2/5) — which one?"* This makes the
ask sharper and the eventual self-check (§5) meaningful — you can verify against a
Design Read you actually trusted, not one you guessed at.

Anti-Default Discipline still applies: no AI-purple gradients, no centered-hero-over-dark-mesh,
no three equal feature cards, no Inter + slate-900 unless the read genuinely calls for it.

## 1. The Three Dials (kept)

`DESIGN_VARIANCE` (1 symmetry → 10 chaos), `MOTION_INTENSITY` (1 static → 10 cinematic),
`VISUAL_DENSITY` (1 airy → 10 cockpit). Baseline `8/6/4`; use the original's signal-to-dial
and use-case-preset tables to adjust from the Design Read. Never invent alias variable names.

## 2. Brief → Design System Map (kept, condensed)

Use **official packages** when the brief names a real ecosystem (Fluent for Microsoft/enterprise,
Material 3 for Google-ish, Carbon for IBM-style B2B, Polaris for Shopify, Primer for
GitHub-flavored, GOV.UK/USWDS for public-sector, shadcn/ui or Tailwind v4 for indie SaaS).
**Never** hand-roll CSS for a system that has an official package, and never mix two systems
in one tree. For pure aesthetics with no official package (glassmorphism, bento, brutalism,
editorial, dark-tech, kinetic type) — build with native CSS/Tailwind and **say so explicitly**
in code comments: "approximation, not an official spec" (the original called this out for
Apple Liquid Glass specifically; apply the same honesty everywhere).

## 3. Default Architecture (kept, condensed)

React/Next.js with Server Components by default; Tailwind v4; Motion (`motion/react`,
not `framer-motion`) for animation, isolated in `'use client'` leaves; `useMotionValue`/
`useTransform` instead of `useState` for continuous values (mouse position, scroll, physics);
Phosphor/Hugeicons/Radix/Tabler icons, never hand-rolled SVGs, never mixed families;
`next/font` or self-hosted fonts, never a `<link>` to Google Fonts in production.

## 4. Accessibility & Performance Pre-Flight (new — the original had none)

A beautifully "tasteful" page that fails these is still a failure. Run this gate
**before** declaring the work done, not as an afterthought:

| Check | Pass bar |
|-------|----------|
| Color contrast | WCAG AA minimum (4.5:1 body text, 3:1 large text/UI) — check your palette against the dial-driven design, not just the default |
| Motion respect | `prefers-reduced-motion` honored — especially critical at `MOTION_INTENSITY` ≥ 6 |
| Keyboard nav | Every interactive element reachable and visibly focused via Tab |
| Semantic structure | Headings in order, landmarks present, no div-soup where a `<button>`/`<nav>`/`<section>` belongs |
| Image weight | Hero/above-fold images sized and lazy-loaded appropriately; no multi-MB heroes |
| Font loading | No layout shift from late-loading webfonts (`font-display: swap` or `next/font`) |
| Transparency fallback | `backdrop-filter`/glassmorphism has a solid-fill fallback for `prefers-reduced-transparency` |

If a "quiet constraint" from §0 flagged accessibility-first or public-sector, this section
is not optional polish — it's the actual brief, and it overrides aesthetic ambition.

## 5. Closing Verify-Loop (new — borrowed from Karpathy guidelines #4 "Goal-Driven Execution")

Don't just ship and hope it reads as intended. Close the loop against your own Design Read:

```
1. Declared Design Read: "<the one-liner from §0>"
2. Built output           → verify: does a fresh look at the rendered page match that read?
3. Dial check             → verify: does the actual variance/motion/density land near the
                              declared 8/6/4 (or adjusted) values — not drifted toward defaults?
4. A11y/perf gate (§4)    → verify: every row passes or has a documented, justified exception
5. Report mismatches      → "Declared 'Linear-minimal'; shipped output leans denser/louder
                              than that — tightened spacing and cut one animation to realign."
```

Reporting mismatches and *what you did about them* is the difference between "I made
something" and "I made the thing I said I'd make."

## Attribution

Brief inference, the three-dial system, design-system mapping, and architecture defaults
are from **Leonxlnx/taste-skill** (https://github.com/Leonxlnx/taste-skill). This fork adds
the confidence-checked Design Read, the accessibility/performance pre-flight, and the
closing verify-loop. Redistributed under the original's MIT terms.

## License

MIT
