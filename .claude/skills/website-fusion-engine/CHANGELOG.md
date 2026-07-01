# Changelog

## 5.0.0.1 — Post-release verification pass

Ran everything for real instead of trusting that it read plausibly: syntax-checked
every shipped script and every JS/CSS block in the recipes, then exercised
`tools/fusion.mjs` end-to-end (fresh `init` → `validate` fails on `UNDECIDED` →
plant a real credential and confirm `scan` catches it and clears after removal →
`gate` blocks with missing artifacts, authorizes once they exist, re-blocks the
instant one is deleted). All of that was already correct. Found and fixed three
real defects in `tools/forensics.mjs` by actually running it against a live
Chromium instance, not by reading the code:

- **`doctor` lied about Playwright.** It checked `npx playwright --version`
  (which npx can satisfy from a global cache) instead of the module import
  `forensics.mjs` actually needs. A machine could show "available" and then
  fail on first real use. Fixed: `doctor` now checks the exact `import('playwright')`
  path.
- **Chromium/browser-binary mismatch crashed with a raw stack trace** instead of
  failing cleanly. Fixed: launch failures now fall back to an explicit
  `PLAYWRIGHT_CHROMIUM_PATH` override with a clear message, instead of an
  unhandled exception.
- **The serious one:** when navigation actually failed, the tool wrote
  Chromium's own network-error interstitial to `page.html`, reported technology
  detection against that error page, and printed a green "✓ forensics captured"
  — a fabricated-looking success on zero real evidence. Fixed: a failed or
  non-OK navigation now hard-fails (`exit 1`) with an explicit "no evidence
  captured" message and never writes a success artifact.
- Chromium does not inherit `HTTPS_PROXY`/`https_proxy` from the environment the
  way Node's own `fetch` does — added explicit proxy passthrough on launch — and
  hardened `page.content()` against a real race condition against a trailing
  same-page redirect (reproduced and fixed, not theoretical).

Live capture against a real external URL was blocked in this specific sandboxed
session by proxy/TLS-interception behavior in Chromium's own network stack that a
raw CONNECT tunnel and curl through the same proxy did not hit — root cause not
fully isolated, and likely specific to this container rather than a normal
developer machine. Recorded here rather than hidden: **run `tools/forensics.mjs`
against a real target on your own machine before trusting the browser-capture
path in production**, same as the skill's own "evidence over claims" rule
demands of everything else.

## 5.0.0 — Rebuild (senior-dev pass)

Rebuilt from `space_age_website_fusion_skill_v3.1.0` (the 13-platform zip) and the v4.0.0 master.

### Fixed (broken in v3.x)
- **Tools now ship and run.** v3 told the agent to run `tools/fusion-cli.mjs` and `tools/secret-scan.mjs` — neither existed. Replaced with one real `tools/fusion.mjs` (`doctor/init/validate/scan/gate`) + `tools/forensics.mjs` (Playwright). All tested.
- **References now exist.** v3 pointed at 19 `references/*.md` files that weren't in the package. Shipped 6 phase docs + 4 code recipes.
- **Real evals.** v3 shipped a 0-byte `good.md`. Now scored good/bad traces + a filled example manifest.
- **Hygiene.** Dropped the leaked build path and the fabricated `scanned_files: 99` artifact. Single version, single name.

### Added (missing in v3 and v4)
- **Web craft.** Copy-paste recipes: Lenis smooth scroll, GSAP ScrollTrigger pin/scrub + reveal, clip-path fullscreen menu, route transitions (View Transitions / Framer / overlay). v3/v4 had schemas but zero implementation.
- **Tiers** (`quick/standard/flagship`): gates and required artifacts scale to the job instead of one-size-fits-maximum.
- **Gate as forcing function**: `fusion.mjs gate` writes `implementation-gate.json` and exits non-zero until tier artifacts exist. No code before exit 0.
- **Framework/lib detection** baked into forensics (Next/Nuxt/Astro/Webflow/WP, GSAP/Lenis/Locomotive/Framer/Three/Swiper/Barba).
- **Token extraction** from live computed styles → DESIGN.md.

### Changed
- SKILL.md cut from a 1,200-line manual to a ~180-line decision spine; everything else loads on demand (progressive disclosure).
- 32 "modules" / 86-question questionnaire moved out of the always-loaded body into `references/onboarding.md`.
- Adapters are generated thin (`adapters/build-adapters.mjs`) — pointer back to SKILL.md, never a workflow copy.
- Degrades gracefully when Superpowers/Firecrawl/ImageMagick absent instead of assuming them.

### Kept (good ideas from v3/v4)
Evidence-over-claims · keep/adapt/replace/drop · source routing/remix matrix · motion-is-structural · build modes · safe-SEO rules · truthful completion template.
