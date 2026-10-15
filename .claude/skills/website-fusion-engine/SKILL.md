---
name: website-fusion-engine
version: 5.0.0
user-invocable: true
argument-hint: "<project-manifest.json | onboarding-answer-sheet.md> [--tier quick|standard|flagship]"
description: Use when cloning, recreating, migrating, rebranding, remixing, or fusing one or more websites from URLs, screenshots, recordings, uploaded assets, Drive libraries, wireframes, brand files, or existing code while preserving selected layout, motion, responsive, SEO, conversion, or application behavior.
---

# Website Fusion Engine

Turn one or more reference websites into a new, **authorized** website — preserving only what the user explicitly chooses to keep, and rebuilding it with real engineering instead of screenshot-matching.

This file is the canonical source. It is a **decision spine**, not a manual: it routes you to the right reference file at the right moment. Load reference files only when the phase needs them (progressive disclosure).

## The one rule

**Build from evidence. Never report a crawl, capture, test, review, or deploy as done unless its artifact exists on disk and the command exited 0.** Confident prose is not a completed tool run. If you cannot get evidence, mark the work `blocked` or drop the mode to `inspired-by` with the user's approval — never paper over a gap with design taste.

## Step 0 — Pick the tier (this scales everything else)

Do not run a flagship process on a landing page. Choose:

| Tier | When | Gates that fire | Required artifacts |
|---|---|---|---|
| `quick` | 1–2 pages, `inspired-by` or simple rebrand, motion optional | Authorization, Completion | manifest, DESIGN.md, final-status |
| `standard` | Multi-section site, real rebrand/migration, some motion | + Capability, Forensic-sufficiency, Design-approval | + forensic-report, remix-matrix, section-specs |
| `flagship` | Motion-led / multi-source / exact recreation | All 7 gates | + motion-map, asset-ledger, visual-diff, motion-audit |

The tier comes from `--tier`, the manifest `project.tier`, or your judgment of the request. State the tier you picked and why, in one line, before proceeding.

## The pipeline

```
onboarding → authorization → capability → capture → forensics →
keep/adapt/replace/drop decisions → DESIGN.md (approved) →
plan → test-first build → review → browser verification → delivery
```

Run it with the shipped CLI. These commands exist in `tools/` — they are real, not placeholders:

```bash
node tools/fusion.mjs doctor --json                 # capability report
node tools/fusion.mjs init <project-dir>            # scaffold docs/ tree + manifest
node tools/fusion.mjs validate <manifest.json>      # manifest is complete + no UNDECIDED critical fields
node tools/fusion.mjs scan <project-dir>            # secret scan (real, fails closed on findings)
node tools/fusion.mjs gate <project-dir> --tier T   # are the artifacts for this tier present? exit 0 = authorized
```

`gate` is the forcing function: **implementation is forbidden until `gate` exits 0** for the chosen tier.

## Build modes (pick one before building)

- **Faithful recreation** — reproduce IA, layout, proportions, motion, pacing. Requires `owned` / `client-approved` / `licensed`.
- **Rebrand** — keep structure + behavior, replace identity/logo/colors/type/copy/media/data.
- **Controlled remix** — route named systems from named sources (A=layout, B=menu+transitions, C=gallery, library=media, new=identity).
- **Inspired-by** — keep principles only, build a distinct implementation. Never call this a clone.
- **Migration** — preserve approved behavior+content, move to a new stack/CMS/host.

## Source routing (never blend silently)

Every section and global system names its source: Site A · Site B · uploaded assets · user brand · user content · generated · retained code. Precedence when they conflict:

```
explicit user instruction → section route → global route →
approved DESIGN.md → verified evidence → documented inference → generated fallback
```

## What each phase needs — load on demand

| Phase | Reference | Tools |
|---|---|---|
| Onboarding / intake | `references/onboarding.md` | `fusion.mjs init` |
| Authorization + capability | `references/onboarding.md` (§Authorization) | `fusion.mjs doctor` |
| Capture + forensics | `references/forensics.md` | `tools/forensics.mjs` (Playwright) |
| Motion reconstruction | `references/motion.md` + `references/recipes/` | `tools/forensics.mjs --motion` |
| Design system / tokens | `references/design-system.md` | — |
| Remix routing + section contracts | `references/remix-routing.md` | — |
| Build → QA → completion | `references/build-and-qa.md` | `fusion.mjs gate`, `fusion.mjs scan` |

Concrete, copy-paste-ready code lives in `references/recipes/` (Lenis smooth-scroll, ScrollTrigger pin/scrub, clip-path fullscreen menu, FLIP route transition). **Use these instead of inventing motion from a screenshot.**

## Motion is structural

When a reference is motion-led, animation is architecture, not decoration. A recreation is incomplete until the selected items among these are mapped *and rebuilt*: page-load choreography, menu open/close, route transitions, scroll-linked transforms, pinned/scrubbed sections, image masks/reveals, hover/focus, custom cursor, kinetic type, media behavior, desktop/tablet/mobile differences, and a `prefers-reduced-motion` fallback. Capture each with the schema in `references/motion.md`; unknown values stay marked `inferred` until the user approves.

## Hard stops

- No implementation before `gate` exits 0 for the tier.
- No retained third-party logos/names/trademarks/copy/private-data in any mode except an authorized faithful recreation that the user told you to keep them in.
- No fabricated reviews, ratings, addresses, awards, credentials, or business facts. Ever. (See `references/build-and-qa.md` §Safe SEO.)
- No temporary remote asset URLs in production delivery.
- No "browser-tested" claim without a screenshot/report artifact.

## Delivery — truthful status only

End with the template in `references/build-and-qa.md` §Completion: STATUS, DELIVERED, VERIFIED, NOT VERIFIED / UNAVAILABLE, KNOWN DIFFERENCES, FILES. No promotional language. State what failed or was skipped plainly.

## Adapters

This is the canonical file. Thin per-platform adapters (Cursor, Codex, Gemini, Windsurf, …) are generated by `node adapters/build-adapters.mjs` and contain only invocation syntax + a pointer back here — never a copy of the workflow.
