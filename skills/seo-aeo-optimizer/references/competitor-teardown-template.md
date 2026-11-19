# Competitor Teardown + Blueprint (SEO + AEO) — {{client}} / {{sector}} / {{city}}
Date: {{YYYY-MM-DD, America/Chicago}} | Prepared for: Chuma | Status: DRAFT until approved. NO website code until this + moodboard are approved.

## A. Inputs
Sector: | City/service area: | Client site: | Client GBP: | Money keywords (3-5): | Locations (real, staffed): | Method for SERP/map checks (location tool, grid tool, manual): | Paid tool needed? (ask Chuma): 

## B. Who ranks (organic #1-3 and Map Pack #1-3 per keyword)
| Keyword | Organic 1 | Organic 2 | Organic 3 | Pack 1 | Pack 2 | Pack 3 | Aggregators/franchises (note only) |
|---|---|---|---|---|---|---|---|
Top 3 recurring competitors: C1 ___ C2 ___ C3 ___ (rank both pack + organic preferred)

## C. Ranking-factors matrix (values, not opinions)
Capture: `python3 scripts/teardown.py C1 C2 C3 --extra 6 --psi --aeo --out out/{{slug}}` (robots-aware, 2 s delay). By hand where marked H.
| Factor | C1 | C2 | C3 | Client now | Common to all 3? |
|---|---|---|---|---|---|
| **SEO: site** | | | | | |
| URL structure / sitemap URLs / silos | | | | | |
| Page types and counts (service / svc-location / neighborhood / blog) | | | | | |
| Title pattern, H1, H2s | | | | | |
| Words on money page | | | | | |
| Keyword/entity coverage (service, city, neighborhoods) | | | | | |
| Internal links (nav, footer block, breadcrumbs) | | | | | |
| Schema types + validity | | | | | |
| FAQs (topics) | | | | | |
| Trust signals (license #, awards, guarantees, years) | | | | | |
| CTA/phone/booking placement | | | | | |
| CWV: PSI score, LCP/INP/CLS | | | | | |
| Freshness (sitemap lastmod, dateModified, new pages/30d) | | | | | |
| **SEO: GBP (H)** | | | | | |
| Primary + secondary categories | | | | | |
| Rating, review count, velocity (newest-sorted), owner replies | | | | | |
| Services list, photos (count/recency), posts, Q&A | | | | | |
| Landing page (home vs city page) | | | | | |
| **SEO: off-site (H)** | | | | | |
| Citations (Google, Bing, Apple, Yelp, BBB, directories) | | | | | |
| Backlink/mention types (free tools only) | | | | | |
| **AEO: access + structure** | | | | | |
| Retrieval bots allowed (OAI-SearchBot, PerplexityBot, Claude-SearchBot, Bingbot, Googlebot) | | | | | |
| Content in raw HTML (raw/rendered words) | | | | | |
| Question headings + 25-80 word answer blocks | | | | | |
| Tables / lists / stats with sources | | | | | |
| Visible date + named author/credentials | | | | | |
| Org/LocalBusiness schema + sameAs count | | | | | |
| AEO automated score /60 | | | | | |
| **AEO: citations (H, fixed prompt set x engines x 3 runs)** | | | | | |
| Mention rate (ChatGPT / Perplexity / AIO / AI Mode / Gemini / Grok / Copilot) | | | | | |
| Citation rate + which URL types are cited | | | | | |
| Third-party sources that name them (listicles, Reddit, YouTube, directories, press) | | | | | |
| Sentiment / wrong facts | | | | | |
Rule: a factor is a "pattern" only if 2+ competitors share it or one is extreme. Review velocity carrying a weak site is NOT a site pattern.

## D. AI citation map
| Prompt | Engine | Cited domain/URL | Why cited (page type, answer block, stats, date/author, entity strength, third-party list) | Our move |
|---|---|---|---|---|

## E. Why they rank / why they're cited (3-6 bullets, evidence only)

## F. Borrow-and-beat blueprint
BORROW (structure and patterns only): sitemap tree | page types and counts | section order per page type | schema map | FAQ topics | internal-link paths | trust-signal types | CTA placement.
BEAT (gaps): missing schema, thin proof, slow CWV, JS-only content, no answer blocks, weak entity/sameAs, no third-party presence, stale content, GBP/site mismatch. Add first-hand proof they lack: job photos, crew names, tech Q&A, price ranges, license numbers, sourced stats.
Blueprint outputs:
1. Sitemap tree (homepage -> service pages -> service-location pages (1 per real location) -> sub-service/neighborhood pages with real jobs)
2. Page list: URL | target prompt/keyword | intent | answer capsule topic | schema | proof assets needed
3. Section order per page type (service, service-location, neighborhood, blog/answer page)
4. Schema map (Org once; LocalBusiness; Service; Breadcrumb; Article; FAQ only visible)
5. AEO plan: prompt map, entity consistency fixes, citation seeding targets (domains the engines cite), review plan
6. Technical: SSR/SSG requirement for the build (all copy + JSON-LD in initial HTML), robots.txt snippet, Bing WMT + IndexNow, CWV budget
7. GBP changes
8. Rollout 30/60/90 (batches of 5-10 pages, index check, wait 2-4 weeks)
9. Measurement: SEO KPIs + weekly fixed-prompt AEO log, GA4 AI channel
10. Paid items needing approval: ___ (tools, ads)

## G. Legal / ethics note (keep in every blueprint)
We analyze public pages for structure, facts and patterns. We do not copy competitor text, images, logos, design or code, and we do not paste their copy into an LLM to rephrase. Wholesale copying is copyright infringement (DMCA takedowns, hosting suspension, lawsuits) and is treated by Google as scraped/duplicate/low-value content. No impersonation, no use of their trademarks in our copy, no fake reviews, no negative-SEO. Crawling respected robots.txt and crawl-delay at <= 1 request / 2 s.

## H. Hand-off (order is mandatory)
Teardown (this doc) -> SEO/AEO blueprint approved -> Muse moodboard approval (`design-reference-moodboard`; competitor visuals for layout analysis only; no liquid-glass/3D goo type on law, SaaS, medical, home healthcare) -> code (Wizard + Poindexter + `cinematic-website-builder`, server-rendered).
