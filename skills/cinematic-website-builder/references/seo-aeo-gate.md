# SEO + AEO Gate — required on every CWB build

Owner skill: [`seo-aeo-optimizer`](/home/box/agent-data/workflows/seo-aeo-optimizer/SKILL.md)
(also shipped next to this skill in a skills repo as `../seo-aeo-optimizer/`).
**Do not copy that skill into this folder.** Load it. This file is only the gates,
build-time rules and checklists the cinematic pipeline must enforce.

Scripts (run from the owner skill, not from here):

```bash
SEO=~/…/seo-aeo-optimizer          # or /home/box/agent-data/workflows/seo-aeo-optimizer
python3 $SEO/scripts/teardown.py https://a.com https://b.com https://c.com --extra 6 --aeo --out site/seo/teardown
python3 $SEO/scripts/aeo-check.py https://preview-or-local-url/ --json site/qa/aeo.json
# verify.mjs runs aeo-check.py against its local server unless you pass --skip-aeo
```

Full method, schema templates, engine map, measurement and guardrails live in the
owner skill (sections 1–13) and `references/` beside it. Cite that skill when a
claim or JSON-LD pattern is needed.

> v3.3 gate names: P0b/P0c = **G1**, P1 moodboard = **G2**, P2–P4 = **G3–G7** (pickers, wireframes, hand-off, assets, build chain), P5 = **G8** QA, P6 = **G9** launch gate + **G10** ship. See CINEMATIC_WEBSITE_BUILDER.md §1.

## Gate order (do not skip, do not reorder)

```
brief (P0 Direction Intake, confirmed: true)
  → Top-3 Competitor Teardown     (seo-aeo-optimizer §1, teardown.py --aeo)
  → SEO/AEO blueprint             (sitemap + page types, schema plan, answer capsules, entity/NAP)
  → Muse moodboard approval       (existing hard rule — no code before this)
  → code                          (P2–P4, obey §Build-time rules below)
  → SEO/AEO QA                    (aeo-check.py via verify.mjs)
  → ship                          (robots.txt, optional llms.txt, sitemap, IndexNow)
```

No website code, asset generation or assemble step before the first four are done
and the person has approved the moodboard. Existing lead briefs, Brand Token
Packages or Handoff Packages pre-fill the Direction Brief; they do not skip the
teardown or the moodboard.

## 1. Top-3 Competitor Teardown (P0b)

Inputs: sector, city or service area, money keywords from the confirmed brief.
Template: `$SEO/references/competitor-teardown-template.md`.

- Find who ranks #1–#3 in organic, the Map Pack, and AI answers (ChatGPT,
  Perplexity, Google AI Overviews/AI Mode, Gemini, Grok). Method in owner §1.
- Capture public pages only, robots.txt respected, ≥ 2 s between requests.
  Run `teardown.py --aeo` (optional `--psi` if `PSI_KEY` is set).
- Fill the ranking-factors matrix. "Why they rank" = factors shared by 2+ or
  clearly extreme. Reviews-only wins are not a site-structure pattern — say so.
- Borrow structure and patterns only (sitemap, page types, section order, schema
  types, FAQ *topics*, internal-link paths, trust-signal *types*, CTA placement).
- **Never** copy competitor text, images, logos, design or code. Do not paste
  their copy into an LLM to "rephrase".
- Output lands in `handoff/design-spec.md` §8 (SEO/AEO plan), teardown attached under it.

Agent Reach (`references/web-research-agent-reach.md`) may already have skimmed
marketing sites for taste and voice-of-customer. That is not this teardown.

## 2. SEO/AEO blueprint (P0c)

From the teardown, write the borrow-and-beat blueprint (owner §1 step 4 and
sections 2–8). Required fields, filled into `handoff/design-spec.md` §8
(the build chain's P15 prompt and verify read it from there):

- Sitemap tree and page types (home, service, service-location, about, contact).
  Money pages first. Only location/neighborhood pages with real local proof.
  Batches of 5–10, never 30–50 doorway pages.
- Schema plan: LocalBusiness (or the specific subtype) + Service on service
  pages; BreadcrumbList on inner pages; FAQPage only if the FAQs are visible.
  Markup must match visible text. Templates: owner skill §6.
- Answer capsules: question-shaped H2/H3 and a 40–60 word answer in the first
  1–2 sentences under each, on every service page.
- Entity / NAP: identical name, address, phone, hours, categories on the site,
  GBP and the JSON-LD `@id` / `sameAs` set.
- robots.txt allow list, optional llms.txt, XML sitemap, IndexNow on deploy.
- 30/60/90 rollout and the AI citation map (who AI engines already name, and
  the ethical mention plan). Off-site work is not a reason to delay the build.

*Exit: blueprint written into the brief; person has seen the page list.*

## 3. Muse moodboard approval (P1, hard stop)

Load Muse + `design-reference-moodboard` / `ui-ux-designer`. Competitor visuals
may inform layout rhythm only — never reproduce a competitor’s design.

**Industry ban (no exceptions, including Flagship / Premium / `sa-figma-framer-spline`):**
no liquid-glass and no 3D goo typography on **law, SaaS, medical or
home-healthcare** sites.

*Exit: `moodboard_approved: true` on the Direction Brief. No P2–P4 work before that.*

## 4. Build-time rules for cinematic / GSAP sites

These are production law, equal to §6 of the playbook:

1. **Server-rendered initial HTML.** All copy, headings, NAP, prices, FAQs and
   JSON-LD are in the first HTML response (the assembled single file is fine).
   Animations enhance content; they never hide it from crawlers.
2. **No text that exists only in canvas or WebGL.** `frame-scrub` and any
   WebGL/Three scene keep a poster image plus the real caption/heading in HTML.
   Reduced-motion already falls back to that poster — crawlers get the same text.
3. **Reduced-motion fallback** is a parallel design (playbook §6.3). Fail-open
   still applies: JS off or CDN down, the page is complete and readable.
4. **Core Web Vitals** (field, 75th percentile, mobile): LCP < 2.5 s, INP < 200 ms,
   CLS < 0.1. Lazy-load heavy images and video (`loading="lazy"`, no lazy on LCP).
   Every `<video>` has a `poster`. Reserve width/height (or aspect-ratio) to
   protect CLS. Defer non-critical scripts. Test mid-range Android.
5. **Question-shaped H2s** with a 40–60 word answer capsule on service pages.
6. **LocalBusiness + Service** JSON-LD in the initial HTML; NAP matches GBP.
7. **`robots.txt`** allows retrieval AI bots: `OAI-SearchBot`, `ChatGPT-User`,
   `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`,
   `Googlebot`, `Bingbot`. Training bots (`GPTBot`, `ClaudeBot`,
   `Google-Extended`, `CCBot`, …) are the client’s call — blocking them does
   not remove the site from AI search. Use `templates/robots.txt`. Also confirm
   the CDN/WAF is not silently blocking those UAs.
8. **Optional `llms.txt`** at the site root (`templates/llms.txt`). Unproven for
   AI search (Google ignores it); include only if cheap. Never a substitute for
   real HTML content.
9. **XML sitemap** of indexable 200s with accurate `lastmod`, submitted in
   Google Search Console and Bing Webmaster Tools. **IndexNow** on deploy
   (Bing / IndexNow-compatible engines).
10. Copy still goes through `stop-slop-pro`. No keyword stuffing, no footer
    link spam, no invented proof.

## 5. SEO/AEO QA (P5, blocking)

`scripts/verify.mjs` runs `$SEO/scripts/aeo-check.py` against the local preview
URL (or a passed `--aeo-url`). It **fails the build** (exit 1) when any of
these is true:

| Gate | Fail when |
|---|---|
| Content in raw HTML | `empty_shell_warning` — copy missing from the initial HTML |
| Schema | no JSON-LD, or no Organization / LocalBusiness / vertical subtype |
| H1 | no `<h1>` in the raw HTML |
| AI bots | a retrieval bot is `Disallow`ed in `robots.txt` |

Other aeo-check flags (no question headings, thin `sameAs`, no `llms.txt`, no
author/date) are **recorded** in `qa/aeo.json` and listed in `qa/REPORT.md`.
They do not fail the build by themselves; fix them before calling a public
site "AEO-ready".

```bash
node scripts/verify.mjs site/index.html --out site/qa --budget-kb 900
# Runtime gallery only (not a client site):
node scripts/verify.mjs tests/gallery.dist.html --out tests/qa --skip-aeo
# Preview already running:
node scripts/verify.mjs site/index.html --aeo-url https://preview.example.com/
```

If `seo-aeo-optimizer` cannot be found, verify exits 1 unless `--skip-aeo` was
passed. Set `SEO_AEO_SKILL` to the skill directory to point at it.

After a passing verify, still do the visual loop, rubric and manual checks in
`references/qa-gate.md` (Rich Results Test, NAP = GBP, mid-range CWV).

## 6. Ship checklist

- [ ] `templates/robots.txt` copied to the site root (retrieval bots allowed)
- [ ] Optional `templates/llms.txt` filled with real URLs and copied to `/llms.txt`
- [ ] XML sitemap of indexable URLs submitted to GSC + Bing Webmaster Tools
- [ ] IndexNow pinged on deploy
- [ ] `aeo-check.py` re-run against the **live** URL; hard gates still pass
- [ ] CDN/WAF not blocking retrieval bots

## Never

- Start P2–P4, generate assets, or assemble before teardown + blueprint + moodboard approval
- Copy competitor expression (text, images, design, code)
- Hide copy behind JS, canvas, WebGL or a curtain over the LCP element
- Use liquid-glass or 3D goo type on law, SaaS, medical or home-healthcare sites
- Open a Google Business Profile in a city with no real staffed location
- Stuff keywords, footer links, FAQ schema, or one-page-per-query-variant
- Promise an AI citation or a ranking
