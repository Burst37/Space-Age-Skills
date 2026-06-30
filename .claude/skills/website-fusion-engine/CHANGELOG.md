# Changelog

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
