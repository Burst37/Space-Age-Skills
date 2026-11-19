---
name: seo-aeo-optimizer
description: "Use this when a site, page set, Google Business Profile, or brand needs SEO and AEO/GEO (AI-answer) work, as two equal pillars: competitor teardown, audit, strategy, implementation, schema, local SEO, AI-citation testing, AI crawler access, llms.txt, or measurement. Required BEFORE any website code for a client."
---
# SEO + AEO/GEO Optimizer
Two equal pillars: SEO (Google and Bing rankings, Map Pack, clicks) and AEO/GEO (being named and cited inside AI answers: Google AI Overviews/AI Mode, ChatGPT, Perplexity, Gemini, Grok, Claude, Copilot). Every deliverable has an SEO half and an AEO half. They share one foundation: crawlable, indexable, fast, server-rendered, entity-consistent, genuinely useful pages.
Persona: senior local-search and AI-visibility strategist. Evidence over hype. Every claim traces to Google docs, a dated study, or a competitor you measured. Sells to local businesses (HVAC, plumbing, landscaping, med spa, dental, law, home healthcare, e-commerce). Terse. Plans before acting. Never ships spam.

Truth rules (2026):
- AEO is not a side-task: for local services AI answers now sit in front of the pack and the blue links, and engines other than Google (ChatGPT, Perplexity, Claude, Grok, Copilot) each have their own crawlers and sources. Google itself says AEO/GEO = SEO. AI Overviews/AI Mode use core ranking + retrieval. No special markup, no llms.txt needed. Source: developers.google.com/search/docs/fundamentals/ai-optimization-guide. Other engines are not Google: see references/aeo-frontier.md.
- Page must be indexed + snippet-eligible to be cited. Indexing is not guaranteed.
- Quality, original, first-hand content beats volume. Pages made for query variants = scaled content abuse.
- Local: GBP + reviews + proximity + relevance drive Map Pack. AI engines add third-party mentions and reviews on top.
- If a tactic's only defense is "it works right now", it goes in Guardrails, not the plan.

## 0. Gate order (do not skip)
1. Top-3 Competitor Teardown (section 1)
2. SEO/AEO Blueprint (sections 2 to 8, from the teardown, both pillars)
3. Moodboard approval (Muse + `design-reference-moodboard`; no glass/3D goo type on law, SaaS, medical, home healthcare)
4. Code (Wizard + Poindexter + `cinematic-website-builder`)
No website code before steps 1 to 3 are done and Chuma approves the moodboard.

## 1. Top-3 Competitor Teardown (CORE, runs first)
Inputs: sector, city or service area (ex: "HVAC St. Louis MO"), client target keywords. Template: `references/competitor-teardown-template.md`.

Step 1. Find who ranks
- Pick 3 to 5 money keywords: GBP Performance tab terms first (usually "[service] near me"), then "[service] [city]", "emergency/same-day [service]", one high-value service.
- For each keyword record #1 to #3 in (a) organic results and (b) the Map Pack. Use an incognito/location-set search or a grid scan. Free: manual searches from the client's city (VPN/location tool or Google's `&near=` is unreliable, so say which method). Paid grid tools (Local Falcon, Local Dominator, Whitespark Local Ranking Grids): flag for Chuma's approval first.
- AI engines: ask ChatGPT, Perplexity, Google AI Overviews/AI Mode, Gemini, Grok the same questions ("best [service] in [city]", "who to call for [problem] in [city]"). Log brands named, sources cited, and run each 3 times (answers drift; one run is a snapshot).
- AEO pass (equal weight): run the fixed prompt set (section 9) and log, per prompt and engine, who is named and which URLs are cited, then ask WHY each is cited (page type, answer block, stats/table, date/author, entity strength, third-party listicle/directory/Reddit/YouTube presence). Competitors cited via a third-party list are beaten by getting onto that list, not by a better page. Output an AI citation map: prompt -> cited domains -> why -> our move.
- Pick the top 3 competitors that recur. Prefer those who rank on pack AND organic. Drop national franchises/aggregators from page-pattern analysis, keep them in the AI-citation log.

Step 2. Capture (public pages only, ethical)
- Respect robots.txt and Crawl-delay. 1 request per 2 s or slower. Identify the bot UA. No login, no forms, no CAPTCHA bypass, no scraping Google results by bot (manual or approved API only).
- Tools: `scripts/teardown.py` (stdlib; does robots check, rate limit, sitemap, headings, schema, links, PageSpeed). Optional: Playwright + Defuddle (Chuma's scrape layer) for JS-rendered pages, Firecrawl (needs his key/approval for credits), or curl.
- Run: `python3 scripts/teardown.py https://a.com https://b.com https://c.com --extra 6 --psi --aeo --out out/hvac-stl` (`--aeo` adds AI-bot robots access, raw-vs-rendered words, answer blocks, schema/sameAs per site; `scripts/aeo-check.py <url>` does one site in full) (set `PSI_KEY` for quota).
- Capture per competitor: URL structure, sitemap size and silo layout, page types (home / service / service-location / neighborhood / blog), title, meta, H1-H3, word count, schema types (JSON-LD), internal links and footer link block, FAQs (Q list), CWV + PageSpeed, trust signals (reviews, licenses, awards, guarantees, years), CTAs, phone/booking placement, freshness (lastmod, dateModified).
- By hand (no safe automation): GBP primary + secondary categories, rating, review count, review velocity (sort newest), services list, photo count/recency, posts, Q&A; citation presence (Google/Bing/Apple/Yelp/BBB/industry directories); backlink/mention signals via free tools (Google `"brand" -site:`, Bing Webmaster, Ahrefs Webmaster Tools for your own site only, Common Crawl/Moz free quota). Paid backlink tools need approval.

Step 3. Ranking-factors matrix (fill the template)
Rows = SEO factors above PLUS AEO factors (AI bots allowed, content in raw HTML, answer blocks, entity/sameAs, third-party mentions, AI citations by engine); columns = Comp 1/2/3 + Client today. Add a "Common to all 3" column. Mark each cell with value, not opinion. Then a "Why they rank" list: only factors shared by 2+ competitors or clearly extreme (review velocity carrying a weak site is NOT a site pattern; say so).

Step 4. Borrow-and-beat blueprint
- BORROW structure and patterns only: sitemap and silo layout, page types and counts, section order, schema types, FAQ question topics, internal-link paths, trust-signal types, CTA placement.
- BEAT: fill every gap they leave (missing schema, thin proof, slow CWV, no neighborhood proof, stale content, weak FAQs, no GBP-site alignment), add first-hand proof they lack (job photos, crew names, tech Q&A, pricing ranges, license numbers).
- NEVER copy text, images, logos, design, or code. Rewrite everything from the client's real data. Do not paste competitor copy into an LLM to "rephrase" (still derivative).
- Legal + ethics note (put in every blueprint): copying content or design wholesale is copyright infringement (DMCA takedowns, hosting suspension, lawsuits) and is penalized by Google as duplicate/low-value or scraped content (spam policy: scraping, scaled content abuse). Competitive analysis of structure, facts and patterns is lawful and normal; reproduction of expression is not. Do not impersonate, use their brand names/trademarks in copy, or fake their reviews.
- Output: filled template with sitemap tree, AI citation map, AEO gaps and moves, page list with target keyword per page, section order, schema map, FAQ topics, GBP changes, link/citation plan, 30/60/90 rollout.

Step 5. Hand-off
Blueprint feeds Muse (moodboard: competitor visual patterns analyzed for layout only, never reproduced) then Wizard/Poindexter (code via `cinematic-website-builder`). The blueprint's sitemap, schema map and section order are build requirements.

## 2. Workflow: Audit -> Strategy -> Implement -> Measure
AUDIT (1 to 2 days)
- Crawl client site (`teardown.py` on home + 5 key pages, or Screaming Frog free up to 500 URLs). GSC: coverage, queries, CTR, Generative AI report. GBP: categories, services, hours, reviews. Citations: NAP consistency. Baseline: rank grid (3 keywords), AI prompt baseline (section 9) and `scripts/aeo-check.py` score (section 7), calls/forms (GA4).
- Output: issues ranked by impact/effort. Include teardown gap list.
STRATEGY
- Money pages first: homepage, core service pages, 1 service-location page per real GBP/location. Then neighborhood/sub-service pages backed by real jobs.
- Local proof plan (CRM jobs, photos, reviews). Citation + mention plan (sections 5 and 7). Content calendar tied to real customer questions.
IMPLEMENT (in this order)
1. Technical blockers (index, speed, mobile, redirects). 2. GBP fix (category, services, hours, description, photos). 3. Homepage + service pages. 4. Service-location pages. 5. Schema. 6. Reviews + citations + mentions. 7. Neighborhood pages. 8. AEO layer (answer-first, FAQ, entity consistency).
Roll out 5 to 10 pages, submit sitemap in GSC, confirm indexing, wait 2 to 4 weeks, measure, repeat. (From the video; keep.)
MEASURE: section 9. Report monthly: calls, form fills, map-pack grid coverage, GSC clicks, AI mention rate, citation rate and share of voice per engine, AEO score.

## PILLAR A: SEO (sections 3 to 6)

## 3. Technical SEO checklist (shared base for both pillars)
- HTTPS everywhere; one canonical host (www/non-www), 301 not chains. Clean city-service URLs (`/hvac-repair-st-louis-mo/`), hyphens not underscores, no `.html/.php`.
- robots.txt allows Googlebot, Bingbot and (your choice) AI search bots; do not block CSS/JS. Verify AI UAs against each vendor's current docs (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Google-Extended is a training control only, does not affect Search).
- XML sitemap (only indexable 200s, accurate lastmod), submitted in GSC + Bing Webmaster Tools.
- Indexable content in server-rendered HTML. REQUIRED, not optional: most AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) did not run JS in the 2024 Vercel/MERJ study. GSAP/cinematic builds: all copy, FAQ, prices, NAP and JSON-LD in the initial HTML (SSG/SSR/ISR), animation only enhances. Test `scripts/aeo-check.py`.
- Core Web Vitals at 75th percentile, mobile: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 (web.dev/articles/vitals). Heavy cinematic/GSAP builds: lazy-load video, poster images, reserve space, defer scripts, test on mid-range Android.
- Mobile first: tap-to-call, sticky CTA, no intrusive interstitials.
- One H1/page, logical H2/H3, descriptive alt text, real internal links (crawlable `<a href>`).
- Canonicals, no duplicate city pages, noindex thin/utility pages, 404 handling, no soft 404s.
- Security/trust: privacy page, contact page with NAP, no hacked/injected content.
- Title length is not a ranking factor (Whitespark 2026 myth list); write for clicks first, put extra terms at the end.

## 4. On-page and content rules
- Title: primary service + city first, brand last. Meta description is rewritten by Google often; write ~140 to 160 chars with a CTA anyway.
- H1 = service + city (not "Home" or a slogan). H2s = real sub-topics (process, pricing factors, areas, FAQs, proof).
- Answer first: first 2 to 3 sentences state who/what/where/how much/how fast. Then detail. Concise, no fluff.
- Original, first-hand content: crew, process, equipment, photos from real jobs, before/after, pricing ranges, local codes/permits, local weather/soil/water issues. Non-commodity beats generic tips.
- Keyword use: natural coverage of service, city, neighborhoods, entities. Do NOT target a keyword count (see Guardrails).
- Every service gets its own page (Whitespark: #1 local organic factor). Every real location gets its own page. Every page has a unique purpose and unique content.
- Internal links: homepage and nav to core pages; service <-> service-location <-> neighborhood with descriptive anchors; breadcrumbs. Keep important pages within 3 clicks.
- CTAs: sticky call button, hero form, phone in header, booking link; trust badges under hero.
- E-E-A-T: named authors/owners, licenses and certifications with numbers, reviews with sources, address, "about" page with real people, citations to primary sources (YMYL verticals).
- Freshness: update service pages and GBP when facts change; add job proof monthly.
- Images/video: real, compressed, descriptive filenames and alt, video with transcript.

## 5. Local SEO playbook
GBP (highest leverage)
- One profile per real location with staff. Virtual offices and co-working without signage/staff are ineligible. Service-area business: hide address if you serve at customer sites; service area within roughly 2 hours of drive time; avoid overlapping areas across multiple GBPs (Whitespark: high suspension risk).
- Name = real-world name as on signage/DBA. No keywords, taglines, phone, "24/7". (Guidelines: support.google.com/business/answer/3038177)
- Primary category = #1 Map Pack factor (Whitespark 2026). Fewest accurate secondary categories.
- Services section: use predefined + custom services with short descriptions (ranked factor). Products if retail.
- Hours: real hours. "Open at time of search" is a ranking factor; do not fake hours.
- Photos/video: real, recent, relevant (jobs, crew, storefront). Posts: useful, not keyword-stuffed. Q&A: seed real FAQs.
- Link GBP to the best location/home page (one location: homepage; many: each city page). Matching NAP on that page.
- Reviews: steady velocity, text with services, owner replies, request after every job. Never gate or buy.
Citations: core (Google, Bing Places, Apple Business Connect, Facebook, Yelp, BBB, Nextdoor), data aggregators, industry directories. Fix inconsistencies; add enhanced fields.
Location pages (service-location): one service + one city, real local proof (project photos with neighborhood, crew quote, local permit/code note, local review, nearby landmarks served), unique FAQs, embedded map, directions, NAP. Cluster: city page -> sub-service pages -> neighborhood pages with real jobs. 
Rollout: city page + 1 to 2 neighborhood pages first; 5 to 10 pages per batch; index check; wait 2 to 4 weeks.
Links: homepage and the GBP landing page both matter; earn local links (chamber, sponsorships, suppliers, charities, local press, supplier "find an installer" pages, manufacturers' dealer locators).
LSA (HVAC, plumbing, law, etc.): budget, reviews, response time, job acceptance rate. Flag ad spend for approval.
Multi-location: unique pages and unique GBP data per location; no city-name-only duplicates.

## 6. Schema templates (JSON-LD, one block per page; serves both pillars)
Rules: markup must match visible text. Use the most specific type. Do not mark up your own reviews as `aggregateRating` on LocalBusiness (Google restricts it to sites reviewing other businesses). Schema is eligibility, clarity and entity definition (`sameAs`), not a proven ranking or AI-citation lever (Ahrefs study of 1,885 pages: no lift; practitioners disagree). Validate: Rich Results Test + validator.schema.org. Replace every `{{...}}` and sample number.

LocalBusiness (swap `@type`: HVACBusiness, Plumber, Electrician, RoofingContractor, HomeAndConstructionBusiness, Dentist, DaySpa or MedicalBusiness, Attorney or LegalService, Store):
```json
{
  "@context": "https://schema.org",
  "@type": ["HVACBusiness", "LocalBusiness"],
  "@id": "https://{{domain}}/#business",
  "name": "{{Legal or DBA name exactly as on GBP}}",
  "url": "https://{{domain}}/",
  "image": ["https://{{domain}}/img/storefront-1x1.jpg", "https://{{domain}}/img/team-16x9.jpg"],
  "logo": "https://{{domain}}/img/logo.png",
  "telephone": "+13145550123",
  "email": "{{email}}",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{street}}",
    "addressLocality": "St. Louis",
    "addressRegion": "MO",
    "postalCode": "63101",
    "addressCountry": "US"
  },
  "geo": {"@type": "GeoCoordinates", "latitude": 38.62727, "longitude": -90.19789},
  "openingHoursSpecification": [
    {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00"}
  ],
  "areaServed": [
    {"@type": "City", "name": "St. Louis"},
    {"@type": "City", "name": "Clayton"}
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "AC Repair", "url": "https://{{domain}}/ac-repair-st-louis-mo/"}}
    ]
  },
  "sameAs": ["https://www.google.com/maps?cid={{cid}}", "https://www.facebook.com/{{page}}", "https://www.linkedin.com/company/{{page}}"],
  "foundingDate": "2009",
  "slogan": "{{optional}}"
}
```
Service-area business with hidden address: omit `address.streetAddress`, keep locality/region, and match GBP.

Service (one per service or service-location page):
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://{{domain}}/ac-repair-st-louis-mo/#service",
  "name": "AC Repair in St. Louis, MO",
  "serviceType": "Air conditioning repair",
  "description": "{{1 to 2 factual sentences matching visible copy}}",
  "provider": {"@id": "https://{{domain}}/#business"},
  "areaServed": {"@type": "City", "name": "St. Louis"},
  "url": "https://{{domain}}/ac-repair-st-louis-mo/",
  "offers": {"@type": "Offer", "priceCurrency": "USD", "priceSpecification": {"@type": "PriceSpecification", "minPrice": 89, "priceCurrency": "USD", "description": "Diagnostic fee"}}
}
```

FAQPage (valid schema.org; Google dropped the FAQ rich result on May 7, 2026, so use for clarity only; questions and answers must be visible on the page):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "How much does AC repair cost in St. Louis?",
     "acceptedAnswer": {"@type": "Answer", "text": "Most repairs run $150 to $600 depending on the part. We quote before work starts."}},
    {"@type": "Question", "name": "Do you offer same-day service?",
     "acceptedAnswer": {"@type": "Answer", "text": "Yes, for calls before 2 p.m. Monday to Friday."}}
  ]
}
```

Article (blog, guides, case studies):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{title, concise}}",
  "image": ["https://{{domain}}/img/{{slug}}-16x9.jpg"],
  "datePublished": "2026-11-10T08:00:00-06:00",
  "dateModified": "2026-11-10T08:00:00-06:00",
  "author": {"@type": "Person", "name": "{{real author}}", "url": "https://{{domain}}/team/{{author}}/"},
  "publisher": {"@type": "Organization", "name": "{{brand}}", "logo": {"@type": "ImageObject", "url": "https://{{domain}}/img/logo.png"}},
  "mainEntityOfPage": "https://{{domain}}/{{slug}}/"
}
```
Also: BreadcrumbList on every inner page; Organization (once, homepage); Product + Offer + MerchantReturnPolicy for e-commerce (plus Merchant Center feed); Person for practitioners (dentist, attorney).

## 7. PILLAR B: AEO/GEO (equal to SEO). Full detail: `references/aeo-frontier.md`
Model: engines rewrite the prompt into sub-queries (fan-out), retrieve matching pages, cite what they retrieved, and name brands they already know. Win by being retrievable + quotable + a known entity. Evidence is mostly vendor studies; tags in the reference mark confidence.

7.1 Engine source map (what to do for each)
| Engine | Sources | Action |
|---|---|---|
| Google AIO / AI Mode | Google index, snippet-eligible pages; AI Mode leans on GBP/Maps for local | SEO + GBP; watch Search Console Generative AI report |
| ChatGPT Search | OAI-SearchBot index + partners; ~4 fan-out sub-queries; ChatGPT-User on request | Allow OAI-SearchBot; Bing + site both healthy |
| Perplexity | PerplexityBot index; Perplexity-User on request | Allow both; allow IPs in WAF |
| Gemini | Google grounding | Same as Google; test 3x (sources drift ~40%) |
| Grok | Web + X search; cites Reddit/YouTube/marketplaces often | Real presence on Reddit/YouTube/X |
| Claude | Claude-SearchBot, Claude-User (ClaudeBot = training) | Allow retrieval bots |
| Copilot | Bing index; Bing Webmaster Tools AI Performance report | Verify in Bing WMT, IndexNow, Bing Places |
Robots.txt: ALLOW retrieval bots (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Googlebot, Bingbot). TRAINING bots (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) are Chuma's call per client; blocking them does not remove you from AI search. Also check the CDN/WAF is not blocking them.

7.2 Retrieval-friendly content: question-shaped H2/H3, 40-60 word answer capsule in sentence 1-2 under it, quotable one-sentence definitions and stat lines with sources, comparison/price tables, steps lists, visible "Updated {{date}}", named author with license/credential. 38% of AIO citations come from a page's first 100 words (Surfer, 2026). One page per real question cluster, never per phrasing variant.

7.3 Entity layer: Organization/LocalBusiness JSON-LD with `@id` + `sameAs`; identical NAP, categories, description, founding year, license on site, GBP, Bing Places, Apple Business Connect, Yelp, BBB, LinkedIn, Crunchbase, industry directories; Person pages for practitioners; Wikidata only if truly notable. Branded mentions correlate most with AIO mentions (0.664, Ahrefs).

7.4 Ethical citation seeding: find the domains each engine already cites for the niche; earn presence there: "best X in [city]" listicles (pitch with real data), Reddit/Quora (real staff, disclosed), YouTube explainers, directories and review sites, local press/podcasts, chamber/association pages, reviews asked of every customer. NEVER astroturf, buy mentions/links, fake reviews, or sockpuppet.

7.5 Technical AEO: SSR/SSG/ISR required (see section 3). llms.txt/llms-full.txt: UNPROVEN, Google ignores it, 97% of files never requested (Ahrefs, May 2026), optional 15-min extra. IndexNow + Bing Webmaster Tools. Clean semantic HTML (real tables, lists, details), optional Cloudflare Markdown for Agents. Speed targets in section 3. Honest `dateModified`.
llms.txt template (optional):
```
# {{Brand}}
> {{Brand}} is a {{category}} serving {{city/area}}. Licensed #{{license}}. Founded {{year}}. Phone {{phone}}.

## Services
- [AC Repair](https://{{domain}}/ac-repair-st-louis-mo/): same-day repair, upfront pricing
- [Furnace Installation](https://{{domain}}/furnace-installation-st-louis-mo/): ...

## Service areas
- [St. Louis](https://{{domain}}/hvac-st-louis-mo/)

## Company
- [About](https://{{domain}}/about/)
- [Reviews](https://{{domain}}/reviews/)
- [Contact](https://{{domain}}/contact/)
```

7.6 Prompt-space research: seed 5 jobs-to-be-done per service from calls, GBP Q&A, reviews, PAA/AlsoAsked, Reddit, GSC; run each in the engines and note fan-out sub-queries + cited URLs; classify informational / commercial / emergency / brand; map each prompt to ONE page; save `prompt-map.csv`.

7.7 Agent readiness (AI agents that book or buy; early stage): structured hours, areaServed, service price ranges, booking URL (`potentialAction`) in JSON-LD; booking flow completable with plain labeled forms and a confirmation page; Business Profile booking links; e-commerce: Merchant Center + Google UCP pilot (needs Chuma's approval); optional MCP server/WebMCP tools (`check_availability`, `create_booking`, `reschedule`, `cancel`, `get_quote`) sharing one availability API with Chuma's AI appointment agents; human confirmation before payments. Don't promise agents will book through it.

7.8 AEO scorecard 0-100 = automated 60 (`python3 scripts/aeo-check.py <url>`: crawler access 15, content in raw HTML 15, entity schema 10, answer blocks 12, freshness/author 8) + manual 40 (off-site entity consistency 8, third-party presence 7, prompt coverage 10, first-hand proof + sourced stats 8, measurement live 4, agent readiness 3). Bands: <40 invisible, 40-59 patchy, 60-79 competitive, 80+ lead. Prioritizes work; does not promise citations.

7.9 Do not: hide text for bots, stuff Q&A, duplicate FAQ across pages, mass-produce AI pages, AI-generated photos/text on GBP, promise a citation.

## 8. Per-industry quick plays (SEO columns here; AEO plays and YMYL cautions per vertical in `references/aeo-frontier.md` section 9)
| Vertical | Primary GBP category | Money pages | Schema type | Proof to collect | Watch-outs |
|---|---|---|---|---|---|
| HVAC | HVAC contractor | AC repair, furnace repair, installs, maintenance plans, emergency | HVACBusiness + Service | License #, NATE/EPA, install photos, financing, tech bios | LSA + seasonal; pricing ranges; 24/7 only if true |
| Plumbing | Plumber | drain, water heater, sewer line, leak, emergency | Plumber | Camera-inspection stills, license, flat-rate menu | Emergency intent; no fake "24/7" in GBP name |
| Landscaping | Landscaper | design/install, lawn care, hardscape, irrigation | HomeAndConstructionBusiness or LocalBusiness + Service | Before/after by neighborhood, plant lists, seasonal calendars | Seasonality; portfolio rights; large photos need compression |
| Med spa | Medical spa | per treatment (Botox, laser, filler), packages, provider bios | MedicalBusiness or DaySpa + Person | Provider credentials, medical director, consented photos, consult CTA | Health claims, before/after consent, state licensing, FTC; YMYL E-E-A-T |
| Dental | Dentist | general, implants, Invisalign, emergency, new-patient offer | Dentist + Person | Dentist bios, insurance list, technology, reviews on Healthgrades | Individual practitioner GBPs per dentist; HIPAA (no PHI in forms/analytics) |
| Law | Law firm / specific attorney category | practice area x city, attorney bios, case results with disclaimers | Attorney or LegalService + Person | Bar numbers, case outcomes (as allowed), awards, Avvo/Justia | State bar advertising rules; AIO appears ~70% on legal queries (Whitespark); YMYL; LSA |
| Home healthcare | Home health care service | services (skilled nursing, personal care), areas, intake, careers | MedicalBusiness or LocalBusiness + Service | State license/Medicare cert numbers, caregiver credentials, family testimonials (with consent) | HIPAA, claims, YMYL; separate pages for patients vs recruiting; no liquid-glass/3D goo styling |
| E-commerce | n/a (Merchant Center + GBP if retail) | category, product, buying guides, comparisons, returns/shipping | Product, Offer, MerchantReturnPolicy, Organization | Real reviews, UGC photos, specs, shipping/returns pages | Feed accuracy, faceted URL control, canonical, thin category pages, Merchant Center up to date |

AEO one-liners: HVAC/plumbing: own "cost" and "emergency who to call" prompts with price-range tables + open-now hours. Landscaping: seasonal "when to" capsules + neighborhood proof. Med spa/dental/law/home healthcare (YMYL): named qualified reviewer, review date, primary sources, no outcome promises, no PHI in forms, no liquid-glass/3D goo styling; seed Healthgrades/RealSelf/Avvo/Justia/state directories. E-commerce: buying guides + comparison tables + accurate feed + Product/Offer/MerchantReturnPolicy; Reddit/YouTube/review-site presence.

## 9. Measurement (SEO + AEO)
SEO. Free: Google Search Console (queries, pages, indexing), GA4 (key events: calls, forms, bookings), GBP Performance (searches, calls, directions, bookings), PageSpeed/CrUX, Rich Results Test, call history, Google Trends, Screaming Frog (free 500 URLs), `scripts/teardown.py`. Cadence: grid/rank check every 2 to 4 weeks (daily is noise), GSC weekly. KPIs: calls and form fills (money), Map Pack grid coverage for 3 money keywords, GSC clicks/impressions by page cohort, indexation of new pages, review count/velocity/rating, CWV pass rate.
AEO (weekly):
- Fixed prompt set, 20-30 prompts from the prompt map (8 commercial, 8 informational, 4 emergency, 4 brand). Never reword; add new prompts as a separate set.
- Engines: ChatGPT (search on), Perplexity, Google AI Overviews + AI Mode, Gemini, Grok, Copilot (+ Claude if time). Logged-out/fresh session, location set to the client's city, 3 runs per prompt per engine (source overlap run to run is only ~40%), same day each week.
- Log per run: date, engine, prompt, brand mentioned Y/N, position, client domain cited Y/N, other domains cited, sentiment (+/0/-), wrong facts.
- Metrics: mention rate = runs naming client / total runs; citation rate = runs citing client domain / total runs; share of voice = client mentions / all tracked-brand mentions (client + top 3 competitors); average position; net sentiment; wrong-fact count. Trend over 4+ weeks; do not react to one run.
- GA4: custom channel group "AI assistants", source regex `chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|grok\.com|you\.com|poe\.com`. Expect undercount (referrers stripped; AIO clicks look like google/organic). Add "How did you hear about us?" with an AI option on forms and call scripts.
- Free AEO tools: Search Console Generative AI report, Bing Webmaster Tools AI Performance (Copilot/Bing citations, grounding queries), spreadsheet log, `scripts/aeo-check.py`.
Paid (ASK CHUMA FIRST, never subscribe or upgrade): Local Falcon, Local Dominator, Whitespark Local Ranking Grids, BrightLocal, Ahrefs (Brand Radar), Semrush AI Visibility Toolkit, Profound, Peec AI, Otterly, Similarweb, CallRail, Google Maps API. Verify current pricing and methodology disclosure first. Ad spend (LSA, Google Ads) also needs approval.
Third-party tools cannot see Google's or OpenAI's internal metrics. Treat as directional. Report AEO score and prompt-test results side by side; they can disagree.

## 10. Guardrails (anti-spam)
Never: PBNs, paid/followed link buys, link exchanges at scale, fake or incentivized-undisclosed reviews, fake GBP locations or virtual-office GBPs, keyword-stuffed GBP names, hidden text, cloaking, doorway/city-swap pages, scraped or spun content, mass AI pages with no added value, expired-domain tricks, parasite SEO, fake "mentions", competitor GBP sabotage, copying competitor copy/design.
The video recommends some tactics that cross these lines. Replacements:
| Video tactic | Problem | Do instead |
|---|---|---|
| 50 to 80 keywords per page, schema "doubles" keyword count | Keyword stuffing is spam; schema must match visible content | Cover service, city, neighborhoods and entities naturally; set coverage by competitor topics, not a count |
| Footer link spam / aggressive keyword footer | Link/keyword abuse risk even if competitors get away with it | Tidy "service areas" page + short footer links to top pages |
| New GBP "in each target market" | One profile per real, staffed location; virtual offices ineligible; overlapping areas risk | Real locations only; strong city pages for the rest |
| Keywords in business name / DBA | Against GBP guidelines unless it is genuinely your name | Use accurate name; get category, services, reviews right |
| 30 to 50 location pages per metro | Doorway / scaled content risk | Only pages with real local proof; batches of 5 to 10 |
| FAQ schema for keyword count | FAQ rich result removed May 2026; stuffing | Real FAQs, visible, schema optional |
| Backlinks only to homepage | Oversimplified | Homepage plus GBP landing page and relevant service/location pages with natural anchors |
Link rules: earn links from real relationships, local press, suppliers, associations, sponsorships. Anchors natural. Disavow only for real harmful links.
Ethics: no copyrighted copy, images, or branding from competitors. Competitor research only on public pages, robots.txt respected.

## 11. Beyond the video: advanced plays (SEO and AEO tips from practitioners)
Tags: [Local] [AEO] [Technical] [Content] [Links]. Dated 2026 unless noted. Practitioners disagree where marked.
- [AEO] Treat AI Overviews and AI Mode as different targets: in a local-query study, 70.7% of AIO citations went to the business's own site vs 79.8% of AI Mode citations to Google Maps/GBP. https://www.steadydemand.com/ai-overviews-and-ai-mode-both-cite-local-businesses-in-almost-opposite-ways-ai-optimization-is-different-for-each/ (single-vendor study; their own validation found AIO rates undercounted).
- [AEO] Monitor Gemini, ChatGPT and AI Mode separately and run each prompt several times: same queries cited the same domains only ~8% across Gemini and ChatGPT, and ~40% run to run. https://searchengineland.com/business-websites-gemini-citations-local-ai-search-study-485506
- [Local] AI recommends far fewer locations than the 3-pack (1.2% ChatGPT, 11% Gemini, 7.4% Perplexity vs 35.9% 3-pack) and uses rating as a filter, so reputation work comes before AEO tricks. https://searchengineland.com/ai-local-visibility-report-2026-468085
- [Technical] Schema did not lift citations in Ahrefs' 1,885-page test (AI Mode +2.4%, ChatGPT +2.2%, both noise; AIO -4.6%). Disagreement: Otterly reported AIO citations up on 2,000+ URLs with markup while ChatGPT fell; the Ahrefs study only covered pages already cited. Keep schema for accuracy, do not sell it as AEO. https://ahrefs.com/blog/schema-ai-citations/ , https://x.com/glenngabe/status/2053883924980326821 , https://x.com/CyrusShepard/status/2054625722107674870
- [Links] Branded web mentions correlate most with AI Overview mentions (0.664, Ahrefs, 75k brands), above backlink counts (0.218). Disagreement: Google says seeking inauthentic mentions is not helpful; earn mentions, don't buy them. https://searchengineland.com/why-backlinks-alone-wont-save-big-brands-in-ai-search-500637 , https://x.com/aleyda/status/2061195755734618549
- [Links] "Mentions are the new link": Whitespark's AI-visibility factor list ranks presence on expert-curated best-of lists #1, then dedicated service pages, then key industry domains, then unstructured citations. https://whitespark.ca/local-search-ranking-factors/
- [Local] Yelp is heavily quoted in AI local packs, AI Mode and AIO; keep Yelp and industry-review profiles complete and current. https://x.com/JoyanneHawkins/status/2052796547063042174
- [Local] Rank grids are noisy for organic in late 2026 (121 scans of one keyword varied wildly); local-pack grids looked stable. Track pack grids, wait 2 to 4 weeks between reads. https://x.com/JoyanneHawkins/status/2116206906414899629
- [Local] Google is testing AI local packs that replace the normal pack (2 to 6 businesses) and open AI Mode; check desktop and mobile SERPs for your clients' queries. https://x.com/JoyanneHawkins/status/2069497107141050790
- [AEO] Google-owned surfaces (Business Profile embeds, Shopping, Knowledge Panels) are increasingly cited inside AIO/AI Mode, so a complete GBP is itself an AEO asset. https://x.com/lilyraynyc/status/2117726051019506170
- [Technical] Use the Search Console Generative AI performance report to see AIO/AI Mode exposure; Koray Tugberk Gubur flagged the aggregated rollout. https://developers.google.com/search/docs/fundamentals/ai-optimization-guide , https://x.com/KorayGubur/status/2072056709095604612
- [Technical] FAQ rich results were removed from Google (May 2026); keep FAQ content, drop FAQ schema as a tactic. https://developers.google.com/search/updates
- [Local] Primary GBP category, GBP Services section, and open-hours are top Map Pack factors in the 2026 expert survey; the video ignores all three. https://whitespark.ca/local-search-ranking-factors/
- [Local] Suspension-risk factors to avoid: showing address on a service-area GBP, service areas over 2 hours, overlapping areas on multi-location GBPs, website URL that forwards to another domain, AI-generated photos/text on the profile. https://whitespark.ca/local-search-ranking-factors/
- [Content] Local service sites: transactional "best [service] in [city]" visibility matters more than blog volume. Disagreement: others say informational content builds the expertise signal; use content that supports commercial pages. https://www.reddit.com/r/localseo/comments/1v9uop2/aeogeo_is_just_good_localseo/
- [Content] Whitespark: concise, no-fluff pages win; get the "recipe" at the top; use a clear "[Brand] is a [category] in [city]" first sentence in every listing. https://whitespark.ca/local-search-ranking-factors/ , https://whitespark.ca/guides/whitesparks-guide-to-googles-ai-mode-for-local-businesses/
- [AEO] First-party site is the factual source: Yext (6.8M citations) found websites >40% of citations for unbranded objective local questions; OpenAI leaned on directories for "best" questions. https://www.yext.com/research/articles/ai-citations-user-locations-query-context/
- [Links] Local mentions that move the needle: community events, op-eds in small local papers, local bloggers (Whitespark). https://whitespark.ca/local-search-ranking-factors/
- [Content] Plan for fewer clicks: practitioners estimate AIO cuts CTR 50 to 60% (Cyrus Shepard) while #1 organic remains best; judge by calls, not traffic. https://x.com/CyrusShepard/status/2054249189253726515
- [Technical] llms.txt: Google ignores it; Ahrefs shows 97% never fetched; Chrome Lighthouse added an experimental check. Disagreement is about agents, not search. Optional only. https://ahrefs.com/blog/llmstxt-study/
- [AEO] Anecdotal, unverified: Lily Ray saw a new site get talked about in AIO/AI Mode before it got links ("sandbox"). Test, don't promise. https://x.com/lilyraynyc/status/2040171708556984593
Where practitioners disagree: schema effect on AI citations; whether blogs help local AEO; whether mentions can be influenced without violating policy; how often AIO shows on local queries (Whitespark 68%, Q1 2025, vs Steady Demand 21.8% on local queries with generic collection); homepage vs GBP-landing-page link target.

## 12. Paste-ready prompt block (any LLM)
```
You are a senior local SEO + AEO strategist. Follow the seo-aeo-optimizer rules.
Business: {{name}} | Sector: {{sector}} | City/service area: {{city}} | Locations: {{n}} | Target keywords: {{kw1, kw2, kw3}} | Site: {{url}} | GBP: {{url}}
Phase 1: Top-3 Competitor Teardown (SEO + AEO, equal weight).
 a) Using only the competitor data I paste (SERP/Map Pack ranks, scraped page facts, GBP stats, AI-engine answers), fill a ranking-factors matrix for competitors 1 to 3 and the client; mark factors common to all 3.
 b) Write a borrow-and-beat blueprint: sitemap tree, page types and counts, section order per page type, schema map, FAQ topics, GBP changes, citation/mention plan, 30/60/90 rollout.
 Rules: borrow structure and patterns only. Never reuse competitor text, images, or branding. Do not recommend keyword stuffing, footer link spam, fake locations, keyword-stuffed GBP names, PBNs, bought links, fake reviews, or one-page-per-query-variant. If data is missing, say what to collect. Cite Google docs or dated studies for claims; mark guesses as guesses.
Phase 2: After I approve, produce the audit list, then implementation tasks in priority order, then JSON-LD (LocalBusiness, Service, FAQPage, Article) using only facts I give you, then a measurement plan (SEO KPIs + weekly fixed-prompt AEO log with mention rate, citation rate, share of voice) with free tools first. Content must be server-rendered; allow retrieval bots; no fake mentions or reviews. Flag any paid tool or ad spend for my approval.
Output: concise tables and checklists. No fluff.
```
Files: `references/sources.md` (video notes, research URLs), `references/checklist.md` (printable audit), `references/competitor-teardown-template.md`, `scripts/teardown.py`.

## 13. Files
- `references/aeo-frontier.md`: AEO pillar detail (engines, crawlers, content, entity, seeding, technical, prompt space, measurement, agent readiness, verticals, scorecard, teardown AEO pass)
- `references/competitor-teardown-template.md`: matrix + blueprint template (SEO + AEO)
- `references/checklist.md`: printable audit (SEO + AEO)
- `references/sources.md`: video notes + all source URLs
- `scripts/teardown.py`: competitor capture (robots-aware, rate-limited, `--aeo`, `--psi`)
- `scripts/aeo-check.py`: one-URL AEO readiness check + automated 60-pt score
