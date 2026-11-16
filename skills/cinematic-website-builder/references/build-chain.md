# Build chain: numbered prompts (adapted from Fadel's workflow)

Run them in order. **Commit after each prompt** (`git commit -m "P3 hero"`), then **clear context**. Each prompt
reads only the hand-off folder and the files it names. A prompt that needs a missing decision stops and asks;
it never invents one.

| # | Prompt | Reads | Done when |
|---|---|---|---|
| P0 | **Setup**: scaffold (single file from `templates/starter.html`, or Astro/Next.js per `multi-page.md`), copy the runtime, add favicon set, theme-color, robots/sitemap/llms stubs | brief.md, design-spec §5 | page loads, verify static checks pass |
| P1 | **Tokens**: colours (roles only, purge unused starter tokens), type block from `type-tokens.css`, spacing, radius | design-spec §2–5 | no hard-coded values left |
| P2 | **Chrome**: header/nav, footer (NAP, licence line), skip link, mobile menu, pause control if video-per-section | wireframe chrome, page-text | keyboard + 44px targets |
| P3…Pn | **One prompt per section**, in wireframe order: markup from wireframe + page-text, motion from motion-plan (exact module + variant), media from the asset manifest | wireframe, page-text, motion-plan | section matches `handoff/sections/<id>.png` (verify --sections) |
| P+1 | **Pages**: every remaining sitemap URL from templates (service template, no-design pages) | wireframe pages | every URL renders |
| P+2 | **Responsive + wide**: 320, 390, 744, 1200, 1440, 1920, 2560; nothing past 2400; jumbo fits | design-spec §5 | verify mobile/narrow/wide passes clean |
| P+3 | **Accessibility**: axe serious/critical = 0, reduced-motion parallel design, focus order, alt text | — | verify axe clean |
| P+4 | **SEO/AEO**: titles, descriptions, canonical, JSON-LD, question H2s + capsules, llms.txt, sitemap | design-spec §8 | aeo-check hard gates pass |
| P+5 | **QA loop**: `verify.mjs` with all flags → fix → re-run; then the visual loop (`qa-gate.md`) | — | REPORT.md PASS |

Prompt shape (each one):
```
Context: read handoff/design-spec.md §… and handoff/page-text.md "## /services/{slug}". Do not read other files.
Task: build section `capsule` of the service template exactly as wireframe.yaml describes.
Motion: motion-plan.yaml → capsule: scroll-reveal (data-nreveal="gentle"). Nothing else moves.
Constraints: tokens only; real text from page-text.md; one H1 per page; 44px targets.
Check: node scripts/verify.mjs … --sections handoff/sections   → commit "P7 capsule" → clear context.
```
Diff review after each commit: read the diff, not the whole file. If the diff touches files outside the prompt's
scope, revert and re-run the prompt.
