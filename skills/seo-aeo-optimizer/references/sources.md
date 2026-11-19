# Sources and notes
Compiled 2026-11-10 (America/Chicago). Tags: [official] [study] [practitioner] [vendor-blog]. Some sources are single-vendor; the skill text marks confidence.

## 1. The video
"The 7-Step Website System Agencies Don't Want You To Know ($934k in 90 Days)", Todd Anderson (Cascade Web Solutions / SEO for the Trades), https://youtu.be/_SI9DsKzkxc, 2079 s (~34.7 min). Transcript obtained (youtube-transcript-api, 46.9k chars) + description. Results are the creator's own claim (fence client, DFW, $934,685 in 90 days, 140 jobs, $6,676 avg ticket); not independently verified.
Top 8 concepts:
1. Competitor research first: money keyword (service + "near me"), grid scan (Local Dominator/Local Falcon), audit the page each top-3 GBP links to (keywords, review velocity, footer links, anchors, page count), then "be chameleonic".
2. Upside-down tree structure: homepage on top; 1 GBP -> homepage; many GBPs -> own city pages; city-service URLs; every page within 2-3 clicks.
3. Homepage is the strongest page: keywords in H1/H2s, every page links up, local/press/charity links point to it.
4. Service pages (authority, not city-specific) vs service-location pages (1 service + 1 city; GBP links here); sub-service city pages after 6-12 per metro.
5. Location page formula: service + city in title, sticky Call Now nav, hero form, service/city through H2s, reviews, FAQs, past jobs.
6. Neighborhood pages with real CRM/technician proof, chosen by range not search volume, no zip codes; freshness.
7. Roll out in batches of 5-10, submit to GSC, confirm indexing, wait 2-4 weeks, measure, repeat.
8. New GBP in each target market + keyword density matching competitors + schema "doubling" keywords + 30-50 location pages per metro.
Outdated or risky (replaced in SKILL.md section 10): 50-80 keywords/page quota and schema keyword doubling (keyword stuffing); footer link blocks; GBP "in each target market" (one per real staffed location; virtual offices ineligible; overlapping service areas risk suspension); keywords in business name; 30-50 location pages per metro (doorway/scaled-content risk); FAQ schema as keyword count (FAQ rich result removed May 2026); links only to homepage (oversimplified); no AEO, no JS-rendering/crawler guidance, no review/GBP-category/services ranking factors.

## 2. Google and platform docs [official]
- AI features guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Search updates (FAQ rich result removal): https://developers.google.com/search/updates
- GBP guidelines: https://support.google.com/business/answer/3038177
- Core Web Vitals: https://web.dev/articles/vitals
- Bing Webmaster Tools AI Performance: https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/ ; https://www2.bing.com/webmasters/help/ai-performance-9f8e7d6c ; https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/
- OpenAI crawlers (OAI-SearchBot, GPTBot, ChatGPT-User): https://platform.openai.com/docs/bots
- Perplexity crawlers (PerplexityBot, Perplexity-User): https://docs.perplexity.ai/guides/bots
- Anthropic crawlers (ClaudeBot, Claude-SearchBot, Claude-User): https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler ; https://searchengineland.com/anthropic-claude-bots-470171
- xAI search tools (Grok web + X search): https://docs.x.ai/docs/guides/tools/search-tools
- Cloudflare Markdown for Agents: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
- Google UCP (agentic checkout in AI Mode/Gemini, limited US pilot): https://support.google.com/merchants/answer/16837055 ; https://developers.google.com/merchant/ucp/guides/merchant-center/integration
- WebMCP (Chrome Labs, experimental): https://googlechromelabs.github.io/webmcp-tools/demos/explainer/

## 3. Studies and data
- arXiv 2610.15033, What Drives AI Citations (fan-out retrieval vs model memory): https://arxiv.org/abs/2610.15033 ; geoSurge summary https://geosurge.ai/posts/model-memory-predicts-which-brands-get-searched
- Ahrefs, ChatGPT query fan-out (15M queries): https://ahrefs.com/blog/query-fan-out-chatgpt/
- Ahrefs, llms.txt study (97% unread, 137k domains): https://ahrefs.com/blog/llmstxt-study/
- Ahrefs, schema and AI citations (1,885 pages): https://ahrefs.com/blog/schema-ai-citations/
- Ahrefs brand mentions vs backlinks (via SEL): https://searchengineland.com/why-backlinks-alone-wont-save-big-brands-in-ai-search-500637
- Ahrefs most-cited domains in Grok (Jun 2026): https://ahrefs.com/blog/most-cited-domains-grok/
- Vercel + MERJ, AI crawlers and JavaScript (Dec 2024; not re-verified 2026): https://vercel.com/blog/the-rise-of-the-ai-crawler
- Surfer, 38% of AIO citations in first 100 words (100k placements, Jun 2026): https://surfer.ai/blog/ai-citations-first-100-words/ ; AIO study 405k searches: https://surfer.ai/blog/ai-overviews-study/
- Semrush, content optimization for AI search (correlational): https://www.semrush.com/blog/content-optimization-ai-search-study/ ; AI Visibility data: https://www.semrush.com/kb/1607-semrush-ai-visibility-data
- MaxAEO, 3,200 cited passages (vendor, B2B-heavy): https://maxaeo.ai/blog/what-content-ai-quotes-most/
- Format-intent summary citing Ahrefs, Seer (5.47M queries, AIO triggers 95.4% of comparison queries; ChatGPT listicle citations -30% m/m Dec-Jan) and Kevin Indig (1.2M ChatGPT responses; 44.2% from first 30% of page; 40-60 word capsules 72.4%) , secondary source: https://ibrahimfurkanozcelik.com/writing/format-intent-grid-ai-citations
- Profound, once-a-day sampling methodology: https://www.tryprofound.com/blog/is-once-a-day-enough ; methodology transparency review https://machinerelations.ai/research/ai-visibility-methodology-transparency-benchmark-2026
- SOCi / Search Engine Land, AI local visibility 2026: https://searchengineland.com/ai-local-visibility-report-2026-468085
- Steady Demand, AIO vs AI Mode local citations: https://www.steadydemand.com/ai-overviews-and-ai-mode-both-cite-local-businesses-in-almost-opposite-ways-ai-optimization-is-different-for-each/
- Search Engine Land, Gemini local citations: https://searchengineland.com/business-websites-gemini-citations-local-ai-search-study-485506
- Yext, 6.8M AI citations: https://www.yext.com/research/articles/ai-citations-user-locations-query-context/
- Whitespark local ranking factors 2026: https://whitespark.ca/local-search-ranking-factors/ ; AI Mode for local guide: https://whitespark.ca/guides/whitesparks-guide-to-googles-ai-mode-for-local-businesses/
- Grok citation studies: https://www.sorank.com/data/grok-citation-study ; https://cuescout.com/blog/what-grok-actually-cites ; https://www.sorank.com/data/social-media-ai-citation-study
- Agent-readiness guides (low confidence): https://surfingdog.ai/guides/ai-assistant-bookings/ ; https://eyetoad.com/blog/agent-cards-mcp-llms-txt-for-local-business/ ; https://kovmere.com/resources/how-to-structure-a-website-so-ai-agents-can-complete-bookings

## 4. X posts (public x tools; X search has no engagement filter, so posts were found via from: queries on known practitioners)
- Cyrus Shepard https://x.com/CyrusShepard/status/2054249189253726515 ; https://x.com/CyrusShepard/status/2054625722107674870
- Joy Hawkins https://x.com/JoyanneHawkins/status/2052796547063042174 ; https://x.com/JoyanneHawkins/status/2069497107141050790 ; https://x.com/JoyanneHawkins/status/2116206906414899629
- Koray Tugberk Gubur https://x.com/KorayGubur/status/2072056709095604612
- Aleyda Solis https://x.com/aleyda/status/2061195755734618549 ; "what it's called doesn't matter" https://x.com/aleyda/status/2056063884914733528 ; Semrush AI Visibility Index (ChatGPT vs AI Mode sources) https://x.com/aleyda/status/2055275163176820820 ; brands vs referees https://x.com/aleyda/status/2082418441508520417 ; Reddit/YouTube cited vs referral traffic https://x.com/aleyda/status/2079284820253790436 ; AI tracking mistakes https://x.com/aleyda/status/2044819835490632131
- Glenn Gabe https://x.com/glenngabe/status/2053883924980326821
- Lily Ray https://x.com/lilyraynyc/status/2040171708556984593 ; https://x.com/lilyraynyc/status/2117726051019506170
- Semrush (Google AI guide summary, May 15 2026) https://x.com/semrush/status/2087503115939348736 ; AI Mode agentic restaurant booking https://x.com/semrush/status/2054910877095059543 ; CEP experiment https://x.com/semrush/status/2093377343121186878
- Reddit r/localseo: https://www.reddit.com/r/localseo/comments/1v9uop2/aeogeo_is_just_good_localseo/

## 5. Known gaps / honesty notes
- PageSpeed Insights path in scripts/teardown.py was not verified (keyless quota returned HTTP 429); set PSI_KEY.
- JS-rendering evidence for AI crawlers is from Dec 2024; Copilot and Grok crawlers unmeasured.
- Seer, BrightEdge and Profound primary reports were only seen via secondary summaries or methodology posts; check originals before quoting to clients.
- Most citation studies are vendor-run and correlational; retest on the client's own prompt set.
