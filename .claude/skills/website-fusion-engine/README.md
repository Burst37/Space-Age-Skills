# Website Fusion Engine (v5.0.0)

Clone / rebrand / remix / migrate / fuse websites into a new **authorized** site — with real engineering, not screenshot-matching.

Rebuilt from `space_age_website_fusion_skill_v3.x` and the v4 master. What changed and why: see `CHANGELOG.md`.

## What's in the box

```
SKILL.md                  decision spine (~180 lines), tiered, progressive-disclosure
tools/
  fusion.mjs              real CLI: doctor · init · validate · scan · gate   (Node, 0 deps)
  forensics.mjs           Playwright capture: tech detect · tokens · motion · screenshots
references/
  onboarding.md           intake questionnaire (load only at intake)
  forensics.md            evidence layers + framework/lib detection cheats
  motion.md               capture schema + stack choice + reduced-motion rules
  design-system.md        token extraction → DESIGN.md + tailwind tokens
  remix-routing.md        remix matrix + section contracts + asset ledger
  build-and-qa.md         TDD build · QA · safe SEO · completion contract
  recipes/                copy-paste: lenis · scrolltrigger pin · fullscreen menu · route transitions
evals/
  fixtures/good.md|bad.md scored pass/reject traces
  manifest.example.json   filled flagship manifest
adapters/build-adapters.mjs  generate thin per-platform adapters from SKILL.md
```

## Quick start

```bash
node tools/fusion.mjs doctor                          # what's available here
node tools/fusion.mjs init my-project                 # scaffold docs/ + manifest
# fill my-project/docs/intake/project-manifest.json
node tools/fusion.mjs validate my-project/docs/intake/project-manifest.json
node tools/forensics.mjs https://ref.example my-project/docs/research/sources/site-a/ --motion
# write DESIGN.md, remix-matrix.json, section-specs/ ...
node tools/fusion.mjs gate my-project --tier standard   # exit 0 = build authorized (project dir, contains docs/)
# build test-first, then:
node tools/fusion.mjs scan my-project                 # must be 0 findings
```

## The one rule

Build from evidence. Never report a capture/test/deploy as done without the artifact on disk. No artifact → `blocked` or downgrade to `inspired-by` with user approval.

## Tiers

`quick` (1–2 pages) · `standard` (multi-section) · `flagship` (motion-led / multi-source / exact). Tier sets which gates fire and which artifacts the `gate` command requires.
