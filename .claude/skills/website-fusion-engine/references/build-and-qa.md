# Build → QA → delivery

## Build (after `gate` exits 0)

Test-first per section: write failing test → confirm fail → minimum code → pass → refactor. One builder per section contract. Resolve animation-lib conflicts deliberately (don't stack Lenis+Locomotive). Reproduce interaction model, not every detected lib.

If Superpowers skills are installed, use them (`brainstorming`, `writing-plans`, `test-driven-development`, `subagent-driven-development`, `verification-before-completion`). If NOT installed, follow their intent inline — never block on a missing skill.

## QA artifacts (`docs/qa/`)

`build-report · browser-report · visual-diff-report · motion-audit · accessibility-report · performance-report · security-report` → `final-qa-report.md`.

- **build**: compile + lint + unit/e2e pass.
- **browser**: re-run `tools/forensics.mjs` on YOUR build; compare to reference capture.
- **visual diff**: screenshot per viewport, diff vs reference (ImageMagick `compare` if available) to the approved exactness level.
- **motion audit**: each selected motion-map id reproduced; reduced-motion verified; no hydration flash.
- **a11y**: keyboard nav, focus visible, semantic controls, contrast AA, labeled media/forms, no cursor-only function.
- **perf**: responsive images, lazy-load, font strategy, code-split, animation cleanup, mobile memory, Core Web Vitals.
- **security**: `node tools/fusion.mjs scan <project>` → 0 findings (fails closed).

## Safe SEO

ALLOWED: accurate metadata, structured data from verified facts, local SEO from user business data, canonical, sitemap/robots.
FORBIDDEN: fabricated reviews/ratings, fake addresses, false ranking/credential/membership claims, invented awards.

## Prohibited shortcuts

replace requested recreation w/ original concept · infer motion from static markup + call it confirmed · claim browser-tested w/o artifact · ship temp remote asset URLs · code before keep/adapt/replace/drop resolved · copy every detected lib · keep 3rd-party identity when rebrand required · fabricate any business fact · hide failed tests · call inspired-by a clone · deliver plans when impl requested (or vice-versa).

## Completion gate

Claim done only when: build passes · required routes work · selected motion works · desktop/tablet/mobile verified · reduced-motion works · forms/apps function · visual+motion meet approved standard · no blocking a11y · no blocking security · no placeholder/temp-remote asset left.

## Delivery template (verbatim shape)

```text
STATUS: completed | partially completed | blocked
DELIVERED
- ...
VERIFIED
- ...
NOT VERIFIED / UNAVAILABLE
- ...
KNOWN DIFFERENCES FROM REFERENCE
- ...
FILES
- ...
```

No promo language. State failures and skips plainly.
