# Astonishing Touch preview — audit for CWB v3.3.0

URL: https://astonishing-touch-healthcare-lx888d8ej.vercel.app/
Audited: 15 Nov 2026, ~12:00 a.m. America/Chicago
Public (not Vercel-protected). Skill files were not changed.

## Stack fingerprint

- Next.js App Router (Turbopack, prerender), React, Tailwind v4, Radix accordion, Lucide
- Host: Vercel preview. `x-robots-tag: noindex`, meta `noindex, nofollow`
- Fonts: Georgia (display), Arial (body/eyebrows), Satoshi 700/900 from Fontshare (selected UI only)
- Motion: no GSAP, no Lenis, no Framer, no WebGL. CSS view/scroll timelines + custom `data-reveal` / scene transitions + muted looping `<video>`
- 15 URLs: `/`, `/services`, nine `/services/{slug}`, `/about`, `/care-questions`, `/contact`, `/privacy`

## Scores

| Check | Result |
|---|---|
| AEO home | **30/60** (crawler 0, raw HTML 15, schema 7, answers 4, freshness 4) |
| AEO `/services/respite-care` | **30/60** (answers 8/12) |
| AEO `/about` | **26/60** (answers 0) |
| Lighthouse mobile | Perf **94**, A11y **100**, BP **96**, SEO **69** |
| LCP / CLS / TBT (LH mobile lab) | **1.4 s** / **0** / **260 ms** |
| Transfer | LH mobile **2,830 KiB**; CWB verify desktop **9,804 KB** (all chapter videos) |
| axe-core (wcag2a/aa, 2.1/2.2 aa) | **0 violations** on 9 pages. Incomplete: color-contrast over photos; video-caption on muted decorative loops |
| CWB `verify.mjs` (live URL) | **FAIL** — see mapping. 0 JS errors, 0 overflow, CLS 0, desktop LCP 864 ms |
| 1920 / 2560 | No horizontal overflow. Content capped by padding (~1440–1540px). |

AEO crawler score is 0 because this is a preview (`robots.txt` = `Disallow: /`). That is correct for a preview and **fatal** if it ships to production. Production `www.astonishingtouchhealthcare.org` is still the **old Wix site**.

## What’s good (promote into the skill)

- Multi-page local-business IA with a reusable service template, breadcrumbs, and a dedicated Care Questions hub.
- Subtle cinematic motion without GSAP: CSS-first + pause/play + a real reduced-motion parallel (“Play motion,” opacity forced on).
- Taste: navy `#102c46` + teal `#007f88`, Georgia display, asymmetric 30/70 intro, full-bleed chapters, no liquid-glass type, no 3D goo. Frosted pills only on chrome.
- Content in raw HTML (AEO ratio 1.0). One H1 per page. Skip link, landmarks, alt text, focus rings. Lab a11y is excellent.
- Honest home-care compliance: nonmedical scope, “inquiry is not an appointment,” medication = reminders only, generated scenes labeled illustrative, Ask Brittany disclosed as AI not the founder. Strong `llms.txt`.
- Real copy, no lorem, no invented ratings. NAP (including after-hours) in the footer and in `LocalBusiness` JSON-LD — and `LocalBusiness` is the right type here, not `MedicalBusiness`.
- Wide-screen padding cap already solves Fadel’s 2400px concern.
- Mobile hero keeps the CTA in the first viewport.

## Top issues (severity)

1. **Critical (if this `robots.txt` / `noindex` is what production would get) — crawlers blocked.** Preview `Disallow: /` + meta noindex + `x-robots-tag: noindex`. Retrieval bots fail the CWB AEO hard gate. Canonical, sitemap and `llms.txt` already point at the production domain, which still serves Wix.
2. **High — homepage media weight.** 11 video sources; logo PNG is 509 KB. Verify desktop transfer 9.8 MB (Factory budget 900 KB, Enhanced 1.5 MB, Cinematic 3 MB). TBT 260 ms vs. a 200 ms INP budget.
3. **High — service pages miss the AEO capsule rule.** Template H2 “What support can look like” is weakly question-shaped; first answers are ~18–26 words, not 40–60. Care Questions already does this correctly.
4. **High — custom `data-reveal` fail-open risk.** Verify found 81 text nodes stuck at opacity 0 after a desktop/tablet/mobile/offline scroll-through; reduced-motion had 0. In-view screenshots look fine, but hidden pre-states are a real defect if IO/scroll never commits.
5. **Medium — schema gaps.** No `sameAs`, no `geo` / `areaServed`. Logo `@id` URLs use the Wix domain. Entity score 7/10.
6. **Medium — Privacy breaks the design system** (no header, footer, or skip link). Classic no-design-pages miss.
7. **Medium — missing favicon / apple-touch-icon / theme-color.** LH console error is the `/favicon.ico` 404 (BP 96).
8. **Medium — design-system drift and copy QA.** Satoshi loaded bold-only while body is Arial; leftover shadcn dark/purple tokens in the CSS; About copy has grammar issues (“as it seen,” “a locally owned and operated”); one unverified “over 10 years” claim.

## Issue → skill change

| Issue | Current v3.2.0 should have caught? | Proposed v3.3.0 / extra change |
|---|---|---|
| Preview `Disallow: /` vs. production indexability; canonical to a live Wix domain | Partly: live `aeo-check` flags blocked bots, but there is no preview-vs-production rule or domain-cutover checklist | Add a **ship/cutover gate**: previews may noindex; production must allow retrieval bots; canonical/sitemap/`llms.txt` may not point at an old site; re-run AEO on the real domain after DNS |
| Single-file verify on a 15-page Next app (“runtime never booted,” offline pass less meaningful) | Verify assumed a CWB kernel + one HTML file, so it false-fails and never walks inner pages | **Multi-page + live-URL verify**; drop “runtime booted” as a blocker unless the page uses the CWB runtime; axe + 1920/2560 already proposed |
| Service pages thin / weak question H2s | Rule exists (law 16) but is only loosely enforced on the home URL | **Wireframe + `page-text.md` gate**: every service page reserves a question H2 + 40–60 word capsule; `aeo-check` runs on the money pages, not just home |
| 9.8 MB of chapter videos | Budget check *would* fail if verify were the gate — it did (9804 KB > 900 KB) — but the skill still assumes Factory single-file 900 KB | CSS-first **subtle-cinematic profile**; media budget: one autoplay loop, in-view loading, poster dimensions, logo weight cap; wireframe should flag film count |
| Opacity-0 reveals | Yes — verify’s invisible-text check fired | Keep it; exclude collapsed accordion content; require fail-open in custom (non-catalog) motion |
| Privacy un-chromed | No page-inventory QA | Fadel **no-design-pages** rule + grey-box for every URL in the sitemap |
| Missing `sameAs` / geo | AEO flags `sameAs`; geo not a hard gate | Blueprint checklist: `sameAs`, `geo`, `areaServed`; allow `LocalBusiness` for nonmedical home care (do not force `MedicalBusiness`) |
| Favicon 404 | No | Add favicon / app-icon / theme-color to verify |
| Leftover shadcn tokens, Satoshi-bold-only, grammar | No systematic design-spec or copy gate | **`design-spec.md` is the only token source** (purge unused themes); webfont use must include needed weights or be removed; `page-text.md` + stop-slop/grammar pass before code |
| axe not in verify | Not in v3.2 | Proposed axe + wide pass — **confirmed useful**; 0 violations here, incomplete contrast-on-photos is expected |
| Screenshot-diff vs approved designs | Not in v3.2 | Would not have caught SEO, but would lock the resource-page chrome and service template |
| Numbered prompt chain + commits | N/A (hand / vibe-coded) | Needed if the skill is to automate a site of this size without drift |

### Additional changes this build suggests (beyond the pitch)

1. **Don’t make Astro the only multi-page path.** This site shipped as Next.js on Vercel. Support Next.js App Router *or* Astro.
2. **Add a CSS-first / subtle-cinematic profile** for law, medical, and home-healthcare: no GSAP unless a signature moment needs it. This build proves the look.
3. **Home-care / regulated-local module:** compliance sentences, AI-receptionist disclosure, illustrative-media captions, `llms.txt` cautions — promote as a template.
4. **Preview vs. production robots/canonical/cutover** (see issue 1).
5. **Verify must run on every money page** and accept a live URL.
6. **Media-budget rules** for multi-scene film pages; logo/image weight caps.
7. **Grey-box + brief + design-spec as automatable stages** — worked examples in this folder.

## Automated stages (Brief, Design System, Wireframe)

See also `brief.md`, `design-spec.md`, `wireframe.md`.

| Stage | Inputs | Agent / tool | Output | Approval |
|---|---|---|---|---|
| **Brief** | Direction Intake (2 rounds), GBP/NAP, existing site URL, uploads | CWB P0; highlight only “the website will…” lines; `seo-aeo-optimizer` teardown + blueprint | `handoff/brief.md` (facts, commitments, bans, sitemap, schema, conflicts) | Client confirms the brief before moodboard |
| **Design system** | Approved brief, logo/photos, Muse moodboard | Muse + taste-pro + brand-extractor; industry ban check; ~8 colors, type, spacing, radius, grid, motion tokens | `handoff/design-spec.md` + token CSS; purge any default theme | Moodboard + tokens approved (existing hard stop) |
| **Wireframe** | Approved brief sitemap + design-spec spacing/type | `scripts/greybox.mjs` from `wireframe.yaml` → greyscale HTML (boxes, real headings, no photos/motion) + Playwright shots at 1440 and 390 | `handoff/wireframe.md`, `handoff/greybox/*.html` + `*.png` | **Hard stop:** section order and layout approved, then `page-text.md`, assets, hi-fi PNGs, numbered build |

## Best screenshots

- `/workspace/site-reverse/astonishing-build/qa/desktop-00-top.png` — desktop hero
- `/workspace/site-reverse/astonishing-build/qa/desktop-025.png` — service chapter (the cinematic look)
- `/workspace/site-reverse/astonishing-build/qa/mobile-00-top.png` — mobile hero, CTA in the first viewport

Also useful: `wide-1920-top.png`, `service-respite-1440-top.png`, `about-1440-top.png`, `qa/reduced-00-top.png` (control reads “Play motion”).

## Artifact index

`fingerprint.json`, `lh-mobile.json`, `aeo-home.json`, `aeo-respite.json`, `aeo-about.json`, `pages-summary.json`, `extra.json` (axe, wide, motion), `qa/REPORT.md` + `qa/report.json`, screenshots under `qa/` and the folder root, plus `brief.md`, `design-spec.md`, `wireframe.md`.
