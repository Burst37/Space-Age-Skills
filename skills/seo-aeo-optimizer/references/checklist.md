# SEO + AEO audit checklist (printable)
Client: ______ URL: ______ Date: ______ Auditor: ______  (mark Y / N / n/a; N items go to the issue list)

## 0. Gate
[ ] Top-3 Competitor Teardown done and filed  [ ] SEO/AEO blueprint approved  [ ] Moodboard approved (Muse)  [ ] Only then: code

## PILLAR A: SEO
### Technical
[ ] HTTPS, one canonical host, no redirect chains  [ ] robots.txt allows Googlebot/Bingbot, no CSS/JS blocked  [ ] XML sitemap (indexable 200s, true lastmod) in GSC + Bing WMT
[ ] Critical text/links/schema in server-rendered HTML  [ ] LCP <= 2.5 s  [ ] INP <= 200 ms  [ ] CLS <= 0.1 (mobile, p75)
[ ] Mobile: tap-to-call, sticky CTA, no intrusive interstitials  [ ] One H1/page, logical H2/H3  [ ] Crawlable <a href> links, alt text
[ ] Canonicals correct, no duplicate city pages, thin pages noindexed, no soft 404s  [ ] Privacy + contact pages, NAP
### On-page
[ ] Title: service + city first  [ ] H1 = service + city  [ ] First 2-3 sentences answer who/what/where/how much  [ ] Original first-hand content (crew, jobs, photos, price ranges)
[ ] Every service has its own page  [ ] Every real location has its own page  [ ] Internal links service <-> location <-> neighborhood, within 3 clicks  [ ] CTA + phone in header, trust badges
[ ] E-E-A-T: named people, license numbers, real reviews, about page  [ ] Updated dates honest
### Local
[ ] One GBP per real staffed location, no virtual office  [ ] Name = real-world name  [ ] Primary category correct  [ ] Services section filled  [ ] Real hours  [ ] Recent real photos  [ ] GBP links to right page
[ ] Reviews: velocity steady, replies, no gating/buying  [ ] Core citations consistent (Google, Bing, Apple, Yelp, BBB, Facebook, directories)  [ ] Location pages have real local proof, not city-swap
[ ] Local links earned (chamber, sponsors, press, suppliers)
### Schema
[ ] LocalBusiness subtype + Service + BreadcrumbList + Article valid  [ ] Matches visible text  [ ] No self-serving aggregateRating on LocalBusiness  [ ] Rich Results Test passes

## PILLAR B: AEO/GEO
### Access
[ ] Retrieval bots allowed in robots.txt: OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Googlebot, Bingbot
[ ] Training bots decision recorded (GPTBot, ClaudeBot, Google-Extended, CCBot): ____ (Chuma approved)  [ ] CDN/WAF not blocking AI bots (`aeo-check.py --ua-test`, own site)
[ ] Bing Webmaster Tools verified, sitemap submitted, IndexNow on publish  [ ] Page indexed and snippet-eligible (no nosnippet)
### Rendering
[ ] Raw HTML contains H1, answers, FAQ, prices, NAP, JSON-LD (raw/rendered word ratio >= 0.9)  [ ] GSAP/cinematic content not injected by client JS or removed from HTML  [ ] No text only inside images/canvas/video
### Content
[ ] Question-shaped H2/H3  [ ] 40-60 word answer capsule directly under each  [ ] Stats with sources, definitions, price/comparison tables, step lists  [ ] Visible "Updated" date  [ ] Named author + credential/license
[ ] One page per question cluster (no variant spam)  [ ] YMYL pages: qualified reviewer, review date, primary sources, no promises
### Entity
[ ] Organization/LocalBusiness JSON-LD with @id + sameAs (>=3)  [ ] NAP/category/description/founding year identical on site, GBP, Bing, Apple, Yelp, BBB, LinkedIn, directories  [ ] Person pages for practitioners
[ ] First sentence of listings: "{{Brand}} is a {{category}} in {{city}} serving {{area}}"
### Off-site
[ ] Domains each engine cites for the niche identified  [ ] Present in 2+ "best of" lists / local press / industry directories  [ ] Reddit/Quora/YouTube presence by real staff, disclosed  [ ] Reviews on Google + 1-2 industry sites  [ ] No astroturf, bought mentions, fake reviews
### Prompt space + measurement
[ ] Prompt map built (prompt -> page)  [ ] Fixed 20-30 prompt set  [ ] Weekly log (3 runs x engine): mention, citation, position, sentiment, wrong facts  [ ] Mention rate, citation rate, share of voice charted
[ ] GA4 "AI assistants" channel (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai, grok.com)  [ ] "How did you hear about us" has AI option  [ ] GSC Generative AI + Bing AI Performance reviewed
### Agent readiness
[ ] Hours, areaServed, price ranges, booking URL in JSON-LD  [ ] Booking flow works with plain labeled forms + confirmation page  [ ] Availability API shared with AI appointment agent (optional MCP/WebMCP)
### Optional / unproven
[ ] llms.txt (optional; no proven effect)  [ ] Cloudflare Markdown for Agents (optional)

## Scores
AEO automated (`python3 scripts/aeo-check.py URL`) ___/60 + manual ___/40 = ___/100. Manual: off-site entity consistency /8, third-party presence /7, prompt coverage /10, first-hand proof + sourced stats /8, measurement live /4, agent readiness /3.
SEO issues: High ___ Med ___ Low ___. Paid tools/ads proposed (need Chuma's approval): ______
