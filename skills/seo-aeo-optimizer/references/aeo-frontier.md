# AEO / GEO frontier (equal pillar with SEO)
Updated 2026-11-10 (America/Chicago). Evidence tags: [official] vendor docs, [study] dated data (note n and who ran it), [practitioner] named expert opinion, [unverified] anecdote or single-vendor claim. Retest quarterly: engines change monthly.

Core model (arXiv 2610.15033 [study]): an engine rewrites the prompt into sub-queries (query fan-out), retrieves pages by semantic match, cites only what it retrieved, AND names brands it already "knows" from model memory. So two jobs: (1) be retrievable and quotable for the sub-queries, (2) be a known entity across the web. Google's own line [official]: optimizing for AI features is SEO; no special markup or llms.txt needed (developers.google.com/search/docs/fundamentals/ai-optimization-guide). Aleyda Solis: the label doesn't matter, the work does [practitioner].

## 1. How each engine picks sources
| Engine | What it uses | What to do | Confidence |
|---|---|---|---|
| Google AI Overviews / AI Mode | Google index + ranking, fan-out; page must be indexed and snippet-eligible. 52% of AIO sources also rank top-10 (Surfer, 405k searches [study]). Local: AIO cites the business site ~71%, AI Mode cites GBP/Maps ~80% (Steady Demand [study], single vendor) | Classic SEO + GBP. Check Search Console Generative AI report. Don't `nosnippet` pages you want cited | High (official) |
| ChatGPT Search | OpenAI crawls with OAI-SearchBot; may use partner search providers (OpenAI doesn't say which per query). Rewrites prompts into ~4 sub-queries (Ahrefs 15M queries [study]). ChatGPT-User fetches pages when a user asks | Allow OAI-SearchBot. Bing indexing helps but OpenAI does not document it as required: do both | Medium |
| Perplexity | Own index via PerplexityBot (search only, not training). Perplexity-User fetches on request and generally ignores robots.txt | Allow PerplexityBot; allow its published IPs in WAF | Medium-high (official docs) |
| Gemini | Grounding with Google Search, so Googlebot index. Local citations ~60% business sites; same query shares only ~40% sources run to run (SEL/Steady Demand [study]) | Same as Google SEO. Test runs several times | Medium |
| Grok (xAI) | Web search + X search tools. Cited most: community/marketplace sources (Reddit, Facebook, Amazon, YouTube) in small studies [study, small]; X posts matter for news/sentiment, cited 0 times on buying/fact-check questions in one small study | Real presence on Reddit/YouTube/X by real staff. Keep X profile + brand posts consistent. Treat as lower priority for local services | Low-medium |
| Claude | Claude-SearchBot indexes for search, Claude-User fetches on request, ClaudeBot trains. All honor robots.txt [official] | Allow SearchBot + User; training is a business choice | Medium-high (official) |
| Microsoft Copilot / Bing | Bing index; Bing Webmaster Tools "AI Performance" shows Copilot/Bing citations, grounding queries, page citations (sampled, indexed pages only) [official, Feb 2026+] | Verify site in Bing Webmaster Tools, submit sitemap, use IndexNow, claim Bing Places | High (official) |
| Apple / Siri | Applebot (renders JS), Applebot-Extended = training control | Apple Business Connect listing | Medium |

Do not assume one engine's result transfers: Semrush AI Visibility Index shows ChatGPT and AI Mode use different source ecosystems and some categories cite independent "referees" instead of brands themselves (Aleyda Solis summaries, 2026) [practitioner/study].

### Crawlers: retrieval vs training
| Purpose | Bots | Default stance for a local-service client |
|---|---|---|
| Search/retrieval (shows you in answers) | OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, Bingbot, Applebot | ALLOW |
| User-initiated fetch (a person asked about your page) | ChatGPT-User, Perplexity-User, Claude-User | ALLOW (OpenAI/Perplexity say robots.txt may not apply to these) |
| Training | GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent, Bytespider | Business decision: ask Chuma. Blocking trains-only bots does not remove you from search answers. Google-Extended is a training control only; it does not affect Search/AIO |
```
# robots.txt: allow retrieval, decide training separately
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
# Training bots (uncomment to opt out; ASK CHUMA)
# User-agent: GPTBot
# Disallow: /
# User-agent: ClaudeBot
# Disallow: /
# User-agent: Google-Extended
# Disallow: /
Sitemap: https://{{domain}}/sitemap.xml
```
Also: a CDN/WAF can block these bots even when robots.txt allows them (Cloudflare "block AI bots" toggles, bot-fight mode). Allow the vendors' published IP ranges. robots.txt changes take ~24 h to be honored. Run `scripts/aeo-check.py --ua-test` on a site you own to see if AI user agents get a 403.
Sources: platform.openai.com/docs/bots, docs.perplexity.ai/guides/bots, support.claude.com/en/articles/8896518.

## 2. Retrieval-friendly content (what to write)
Evidence is mostly vendor studies; use it as direction, not law. Direct Google guidance says no special "chunking" or structure tricks are required.
- Answer first, by position: 38% of AIO citations come from a page's first 100 words (Surfer, 100k placements, Jun 2026 [study]); 44% of ChatGPT citations from the first 30% of a page (Kevin Indig, 1.2M responses [study via secondary]). Put the answer in sentence 1-2 under each heading.
- Answer capsule: question-shaped H2/H3 + 40-60 word direct answer. MaxAEO (3,200 passages, B2B-heavy [study, vendor]) found the quoted sentence itself has a median 28 words and 64% of quotes are the first or second sentence of a section. Write a tight capsule and make the key sentence stand alone.
- Quotable units get pulled most: stat lines, "X is..." definitions, list items, table rows (MaxAEO [study]). Semrush: clarity/summary +33%, E-E-A-T signals +31%, Q&A format +25%, section structure +23%; promotional tone -26% [study, correlational].
- Comparison tables (price ranges, service vs service, repair vs replace), step lists, "cost in [city]" ranges with the year.
- Cite sources for stats; name the person (author box with credential, license no.), show "Updated {{date}}" and actually update.
- One idea per section, plain words, no throat-clearing, no keyword stuffing. Visible text must match schema.
- Pages must be indexable, fast, text in the HTML (section 5).
Template per service page: H1 -> 2-sentence definition with city + license -> price range table -> "How much does X cost in {{city}}?" capsule -> "Repair or replace?" capsule -> process steps -> proof (jobs, crew, reviews) -> FAQ from real calls -> NAP + hours + service area -> updated date + author.

## 3. Entity and knowledge-graph layer
Brand mentions correlate most with AI Overview mentions (0.664, Ahrefs 75k brands [study]); model memory names brands (arXiv 2610.15033). So build a consistent, widely-corroborated entity.
- Homepage Organization/LocalBusiness JSON-LD with `@id`, `sameAs` (GBP, Facebook, LinkedIn, Yelp, BBB, YouTube, Apple/Bing listings, industry directory, Wikidata if eligible), `founder`, `foundingDate`, `areaServed`, license in `hasCredential`/description. Template in SKILL.md section 5.
- NAP, categories, service names, founding year and description identical on: site, GBP, Bing Places, Apple Business Connect, Yelp, BBB, Facebook, LinkedIn, Crunchbase (e-commerce/SaaS), industry directories. First sentence everywhere: "{{Brand}} is a {{category}} in {{city}} serving {{area}}." (Whitespark).
- Wikidata/Wikipedia: only if the business meets notability with independent sources. Never create self-promotional entries.
- People: Person pages for dentists, attorneys, providers (credential, licence/bar no., `sameAs` to state board/LinkedIn).
- Brand-name co-occurrence: the brand should appear next to the category and city in third-party text (listicles, news, directories). Track with Google `"brand" -site:yourdomain.com` and Bing.
- Fix wrong facts at the source (GBP, directories) then re-prompt; AI repeats stale facts.

## 4. Off-site citation seeding (ethical only)
Targets: whichever domains the engines already cite for your niche (ask each engine, read the citations; that is your list). Typical: Reddit, YouTube, Yelp, industry directories, review sites, "best {{service}} in {{city}}" listicles, local news, chamber/association pages, podcasts, Quora.
- Reddit/Quora: real staff, disclosed affiliation, genuinely useful answers; no sockpuppets, no seeded "reviews". Reddit and YouTube are among the most-cited AI sources but send far less referral traffic than they are cited (Aleyda/Similarweb, Jul 2026 [practitioner]).
- YouTube: crew explainers, job walk-throughs with transcripts and descriptions that carry NAP + service.
- Listicles: pitch editors with real differentiators and data; don't pay for placement unless the page discloses it as sponsored (paid links = guardrail breach).
- Local press: op-eds, events, sponsorships, data stories ("average AC repair cost in {{city}} 2026" from your own jobs).
- Reviews: ask every customer, specific language, reply to all. No gating, no purchase, no fakes. AI engines filter on rating (SOCi: ChatGPT-recommended locations average 4.3 stars [study]).
- Not allowed: astroturfing, fake reviews, PBNs, parasite pages, bought mentions, mass AI-generated "listicles" about yourself on throwaway domains. Google says seeking inauthentic mentions is not helpful.
Disagreement: whether mentions can be influenced at all vs only earned; stay on the earned side.

## 5. Technical AEO
- Server-rendered HTML is required. Vercel/MERJ (Dec 2024, ~1B crawler requests [study]): GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot did not execute JavaScript; Googlebot (so Gemini grounding), Bingbot, Applebot did. Not re-verified in 2026, and Copilot/Grok are unmeasured: treat as the safe assumption.
  - Chuma's GSAP/cinematic builds: all copy (H1, capsules, FAQ, prices, NAP, schema) must be in the initial HTML via SSG/SSR/ISR (Next.js, Astro). GSAP animates what is already in the DOM; never inject content with client-side JS. Never gate text behind scroll triggers that remove it from HTML; no canvas-only/video-only text. Test: `scripts/aeo-check.py <url>` raw vs rendered word ratio should be >= 0.9. `curl -s URL | grep "your headline"` is the 5-second test.
- llms.txt / llms-full.txt: NOT proven. Google says it ignores them; Ahrefs measured 97% of llms.txt files never requested by AI crawlers (137k domains, May 2026 [study]); readers are mostly coding agents. 15-minute optional extra, never a promise. Template in SKILL.md section 6.
- Markdown-able pages: clean semantic HTML (one H1, ordered H2/H3, real `<table>`, `<ul>`, `<details>` for FAQ), no content in iframes/images. Cloudflare "Markdown for Agents" (returns Markdown when a client sends `Accept: text/markdown`) is a cheap optional add if the site is on Cloudflare [official]; effect on citations unproven.
- IndexNow + Bing Webmaster Tools: submit on publish/update. Helps Bing/Copilot freshness; OpenAI does not document IndexNow as a ChatGPT control.
- Speed: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1. Ahrefs found no extra citation lift from speed within sites; keep it for UX and Google ranking. Cinematic builds: lazy-load media, preload hero, ship a static text fallback.
- Freshness: real `dateModified` in schema and visible "Updated" text; sitemap `lastmod` honest.
- Canonicals, indexable (no accidental noindex/blocked JS/CSS), one URL per answer.

## 6. Prompt-space research
Goal: list what customers ask AI and make sure a page answers each.
1. Seed: 5 jobs-to-be-done per service. Sources: call recordings/CSR notes, GBP Q&A, reviews, People Also Ask, AlsoAsked, Reddit threads, Search Console queries, competitor FAQs, "ask the engine for related questions".
2. Expand to fan-out: for each seed prompt, run it in ChatGPT/Perplexity/AI Mode and note the sub-queries shown ("searching for..."), plus the cited sources.
3. Classify: informational (cost, how long, DIY vs pro), commercial ("best {{service}} {{city}}", "{{brand}} vs {{competitor}}"), emergency/transactional ("{{service}} near me open now"), brand ("is {{brand}} legit", "{{brand}} reviews").
4. Map each prompt to ONE page (or GBP/directory/listicle if that is what is cited). Missing page = backlog item. Do not create a page per phrasing variant (scaled-content spam).
5. Output: `prompt-map.csv` = prompt, intent, engine tested, current winner(s), cited sources, target page, status.
Semrush (Aug 2026) reports content built around real buyer situations ("category entry points") was cited weekly for 4+ months [study, vendor, single experiment].

## 7. Measurement (weekly)
Fixed prompt set: 20-30 prompts from the prompt map (balanced: 8 commercial, 8 informational, 4 emergency, 4 brand). Never change wording; add new prompts as a separate set.
Engines: ChatGPT (search on), Perplexity, Google AI Overviews + AI Mode, Gemini, Grok, Copilot (+ Claude if time).
Protocol: logged-out or fresh session, location set to the client's city, 3 runs per prompt per engine (answers drift; ~40% source overlap run to run), same day each week. Vendors differ: Profound runs each prompt once daily via the consumer interface and pools many prompts; do not trust single runs.
Log per run: date, engine, prompt, brand mentioned (Y/N), position in list, client domain cited (Y/N), other domains cited, sentiment (+/0/-), wrong facts.
Metrics:
- Mention rate = runs naming client / total runs (per engine and overall).
- Citation rate = runs citing client domain / total runs.
- Share of voice = client mentions / all tracked-brand mentions across runs (Profound-style: mentions over responses naming at least one tracked brand). Track client + top 3 competitors.
- Avg position (when ranked list), net sentiment, wrong-fact count.
Trend, don't react to one week. Judge by calls and bookings.
GA4: Admin > custom channel group "AI assistants", source matches regex `chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|grok\.com|you\.com|poe\.com`. Expect undercount (apps strip referrers; AI Overviews clicks arrive as google/organic). Also add "How did you hear about us?" with "ChatGPT/AI" on forms and call scripts.
Free tools: Google Search Console (Generative AI report), Bing Webmaster Tools AI Performance (Copilot/Bing citations, grounding queries), GA4, GBP Performance, spreadsheet log, manual runs, `scripts/aeo-check.py`.
Paid (ASK CHUMA FIRST, never subscribe): Profound, Semrush AI Visibility Toolkit, Ahrefs Brand Radar, Peec AI, Otterly, Similarweb AI. Verify current pricing and methodology disclosure before proposing (most disclose little).

## 8. Agent readiness (AI agents that book or buy)
Status: early. Google AI Mode agentic restaurant booking is global (Apr-May 2026, via Semrush summary), and Google's Universal Commerce Protocol (UCP) enables direct checkout in AI Mode/Gemini for eligible Merchant Center merchants (limited US pilot [official]). Local-service booking by general agents is still thin; build the data layer now, it costs little.
1. Structured facts on the page and in JSON-LD: hours, `areaServed`, services with `Offer`/`priceSpecification` ranges, license, phone, booking URL. `potentialAction` ReserveAction/ScheduleAction pointing at the real booking URL where eligible. Keep it visible and accurate.
2. Booking flow agents can complete: real HTML forms with labels, no CAPTCHA-only gating on the first step, stable confirmation page, email/SMS confirmation, availability shown in text.
3. Google surfaces: Business Profile booking links, Reserve with Google/partner booking where available, Merchant Center + UCP for e-commerce (pilot, apply only with Chuma's approval).
4. Optional: expose an MCP server for the client's own agent (tools: `check_availability`, `create_booking`, `reschedule`, `cancel`, `get_quote`, `get_service_area`) or WebMCP tool registration on the booking page (Chrome Labs, experimental). Connect to Chuma's AI appointment agents: same availability API serves the phone agent, the web chat and any external agent. Keep auth, rate limits, and a human-confirmation step for payments.
5. Do not promise ChatGPT/Gemini will book through it: the vendor-blog claims about agent cards and MCP discovery for local businesses are mostly [unverified].

## 9. Per-vertical AEO plays
| Vertical | Prompts to own | Pages/assets | Third-party sources to seed | Caution |
|---|---|---|---|---|
| HVAC | "AC not cooling, who to call {{city}}", "AC repair cost {{city}}", "repair or replace AC" | Cost tables, emergency capsule, brand/model pages, maintenance plans | Yelp, Angi/HomeAdvisor, BBB, manufacturer dealer locators, local news (heat waves) | No fake 24/7; license #; prices as ranges |
| Plumbing | "burst pipe emergency {{city}}", "water heater replacement cost", "drain cleaning cost" | Flat-rate menu, camera-inspection proof, emergency flow | Yelp, Angi, BBB, supplier "find a pro" pages | Emergency intent: phone-first, open-now hours |
| Landscaping | "best landscaper {{city}}", "lawn care cost per month", "when to aerate in {{city}}" | Seasonal calendars, before/after by neighborhood, price per sqft ranges | Houzz, Nextdoor, Instagram/YouTube, local garden clubs | Image rights; seasonality |
| Med spa | "Botox cost {{city}}", "laser hair removal how many sessions", "med spa near me" | Per-treatment pages with provider, medical director, risks | Google reviews, RealSelf, Yelp, local magazines | YMYL: medical review byline, no outcome promises, consent for photos, state rules, FTC. Cite clinical sources |
| Dental | "emergency dentist {{city}}", "Invisalign cost", "dentist accepts {{insurance}}" | Dentist Person pages, insurance list, procedure capsules | Healthgrades, Zocdoc, Yelp, ADA find-a-dentist | YMYL: dentist-reviewed content, no PHI in forms/analytics (HIPAA), no cure claims |
| Law | "car accident lawyer {{city}} what to do", "how much does a DUI lawyer cost", "{{firm}} reviews" | Attorney Person pages with bar #, practice-area capsules, process steps | Avvo, Justia, FindLaw, state bar, local press | YMYL: attorney-reviewed, disclaimers, results not guaranteed, state bar advertising rules; LSA disclosures |
| Home healthcare | "home care cost {{city}}", "Medicare home health requirements", "how to choose a home health agency" | Service pages, intake process, license/Medicare cert, caregiver credentials, separate recruiting pages | State agency directory, Medicare Care Compare, caring.com, local Area Agency on Aging | YMYL + HIPAA; clinical review; no testimonials without consent |
| E-commerce | "best {{product}} for {{use}}", "{{product}} vs {{product}}", "{{brand}} return policy" | Buying guides, comparison tables, spec pages, real reviews, Product/Offer/MerchantReturnPolicy schema, accurate feed | Reddit, YouTube reviews, independent review sites, Merchant Center, Amazon where relevant | Feed accuracy; AI shopping/UCP pilots; listicle citations shift fast (Seer: ChatGPT listicle citations -30% m/m Dec-Jan 2026 [study]) |
YMYL rule: every medical/legal page needs a named qualified reviewer, review date, primary-source citations, and no promises. AI engines and Google are stricter here.

## 10. AEO audit scorecard (0-100)
Automated by `scripts/aeo-check.py` (60) + manual (40). Score each page type; report homepage + 1 service page.
| Area | Pts | How scored |
|---|---|---|
| Crawler access: 5 retrieval bots allowed (OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, Bingbot), no WAF block | 15 | auto (+ `--ua-test`) |
| Content in raw HTML (raw/rendered >= 0.9 = full; JS-shell = 0) | 15 | auto |
| Entity schema: Org/LocalBusiness 4, sameAs>=3: 3, page schema valid (Service/Article/Product/Breadcrumb) 3 | 10 | auto |
| Answer blocks: question headings, 25-80 word answers, list/table, stat facts | 12 | auto |
| Freshness + authorship: visible date 4, author/credential 4 | 8 | auto |
| Entity consistency off-site: NAP/category/description identical on GBP, Bing, Apple, Yelp, BBB, LinkedIn, directories | 8 | manual |
| Third-party presence: in 2+ "best of" lists / local press / industry directories AI already cites | 7 | manual (from teardown) |
| Prompt coverage: prompt map built, >=80% of commercial prompts have a page | 10 | manual |
| First-hand proof + sourced stats (jobs, crew, prices, credentials) | 8 | manual |
| Measurement live: weekly prompt log + GA4 AI channel + Bing/GSC reports | 4 | manual |
| Agent readiness: structured prices/hours/booking, booking flow works without JS tricks | 3 | manual |
Bands: 0-39 invisible, 40-59 patchy, 60-79 competitive, 80+ lead. A score is for prioritizing work, not a promise of citations. Report the score with the date and the prompt-test result side by side; they can disagree.

## 11. AEO pass in the Competitor Teardown
For each of the top 3 competitors (and any aggregator that dominates AI answers):
1. Run `python3 scripts/teardown.py A B C --aeo --out out/x` (adds robots/JS/answer/schema/sameAs rows). Optional `--ua-test` only on client sites.
2. Run the fixed prompt set (section 7). For each prompt record who is mentioned/cited, which URL, which engine.
3. Why is it cited? Fill: page type (listicle, service, directory profile, Reddit thread, YouTube), answer capsule present, stat/table present, date/author, entity strength (reviews, sameAs, directory presence), third-party mentions found via `"brand" -site:domain`.
4. Output "AI citation map": prompt -> cited domains -> why -> our move (own page, directory fix, listicle pitch, review push, video). Competitors cited because of a third-party listicle are beaten by getting into that listicle, not by a better page.
5. Borrow-and-beat still applies: copy structure and patterns only, never text.
