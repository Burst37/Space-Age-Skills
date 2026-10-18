---
name: spaceage-geofusion-x-master-handoff
version: 1.0.0
handoff_date: 2026-10-18
owner_project: Space Age AI Solutions
handoff_type: implementation-first engineering takeover
priority: P0 complete integration, authenticated social channels, routing, ranking, deliverable verification
---

# SPACE AGE — GEOFUSION X: MASTER ENGINEERING HANDOFF

## READ FIRST — NON-NEGOTIABLE DEFINITION OF DONE

Build **one functioning, unified, general-purpose geographic/web/social intelligence platform**, called **SpaceAge GeoFusion X**. It must combine the strongest useful capabilities of the listed upstream Google Maps, web, and social collectors into an integrated product with **a single onboarding experience, typed capabilities, executable adapters, an evidence-aware decision router, durable jobs, canonical records, comparative ranking, and Google Sheets exports**. It is **NOT** enough to bundle unchanged upstream repos, write a `SKILL.md`, provide thin wrappers, or create an architecture diagram. Reuse external libraries as modular dependencies where sensible; carefully adapt reusable algorithms where licensing allows. Deliver executable source, reproducible installation, automated and live permitted integration tests, a skill file, and a truthful capability report.

The user has repeatedly asked to *build*, *test*, and *finish* rather than explain. Keep completing work through tests and deliverables. Never announce a feature as operational without running an appropriate test. Do not rewrite unrelated approved work or invent evidence to fill gaps.

## 1. Why this handoff exists

Prior ChatGPT sessions produced several ZIPs and Markdown specifications labeled GeoFusion X. Those artifacts **do not meet the above definition**. The most recent Python engine is a functioning **data foundation and onboarding CLI**, not a complete scraper. Separate website research carried out through a connected Firecrawl service was mistakenly described too broadly as a GeoFusion demonstration. The Mesquite landscaping spreadsheet includes real researched businesses, but its full technical SEO/mobile/AI metrics were NOT benchmarked. Preserve good work; fix false completion claims.

### Actual implementation baseline — verify by reading code

- SQLite data model, basic observations, normalization, conservative deduplication, import/export JSON/JSONL/CSV.
- CLI and multi-select onboarding; expanded *selection catalog* (~71 platforms). **Catalog ≠ operational connectors.**
- Website social-link discovery through static HTML parsing.
- Optional Scrapling `Fetcher.get()` single-page path; no full adaptive/spider/batch integration.
- Optional Firecrawl SDK single-page `scrape` path; no full map/crawl/agent orchestration.
- GoSom Docker CLI invocation wrapper; live installation, high-volume extraction and command compatibility unverified in previous runtime.
- Agent Reach `doctor` health diagnostic only; authenticated profile/post/comment extraction **not wired**.
- Omkar Maps archive is documentation/screenshots rather than an integrated second executable collector.
- No production JEV router, queue/checkpoints, social entity graph, automatic SEO/AI scoring, true Lighthouse/Core Web Vitals, credential isolation, platform policy engine, or scheduled deltas.
- The `.md` universal skill is primarily instructions. It is not equivalent to implementation.
- Latest local baseline: `SpaceAge_GeoFusion_X_Engine_v0.4_PlatformCatalog.zip`. Inspect/test it, do not assume it works across all platforms or clone names from prose.

## 2. User objectives

1. **General purpose**: geographic/local research, cross-platform social intelligence, competitor analysis, reviews, industry studies, business enrichment, trend monitoring, lead generation, and optional website-sale prospecting. **Do NOT hardcode a website-sales-only use case.**
2. **Mandatory gated social capability**: Access information available via properly authorized user sessions or approved APIs, where automation is permitted. Agent Reach is a P0 component, not a health-check footnote. Target X/Twitter, Facebook, Instagram, Reddit, LinkedIn, TikTok, Pinterest, Lemon8, Threads, YouTube, Xiaohongshu, Discord, Telegram and other selected platforms, with truthful per-platform coverage and custom connectors where needed. Agent Reach does **not** automatically support every selected social network; implement or procure separate legitimate adapters as needed.
3. **Strongest Maps capabilities**: geographic query tiling/partitioning, multiple searches, durable pagination/resume, provider IDs, accurate category/location filters, CSV/JSON output, duplicate detection, sensible rate controls, evidence.
4. **Deep website intelligence**: normal HTTP + browser/JS pages, dynamic content, links, social discovery, services, contact/booking features, local SEO, structured data, accessibility, technical SEO, page quality, optional Lighthouse mobile/desktop audits, full-site sampling.
5. **Single multi-select onboarding** (searchable grouped UI desired): objectives, location/area, categories, numerous platforms, fields, crawl depth, access methods, budget, freshness, output destination, lead-rank mode, consent/start. All multi-value questions genuinely permit multiple choices. Platform picker must support custom networks.
6. **Ranking**: Separate *website quality score*, *SEO audit*, *AI-search/AEO/GEO readiness*, and *sales opportunity score*. Do not convert absent data to zero or pretend text scraping equals a speed/visual audit.
7. **Exports**: Actual native Google Sheets with tested populated ranges, plus CSV/JSON/JSONL and optionally XLSX, Postgres, CRM. Individual tabs for `All Businesses`, `No Website Linked`, `Website Status Unverified`, `Weak Sites`, `Website Scores`, `SEO + AI Audit`, `Social Intelligence`, `Sources`, `Failed/Needs Review`, `Run Metadata`. Make the populated tab default; verify cells after writing. Use source URLs and timestamps per record.
8. **Optimize intelligently**: TypeSafe Jev for narrow semantic classifications only, deterministic policies for known rules, frontier model for deep analysis. Cost, quality, authorization, provider availability and fallback should determine tool choices. Compress LLM-visible context where safe, NEVER raw evidence.
9. **Portable skills**: Deliver an excellent `SKILL.md` and relevant executable tools usable by Codex, Claude Code, Cursor, Gemini CLI, Antigravity and other CLI/MCP-capable agents. Avoid harness-specific assumptions; add adapter-specific setup/hook recipes.

## 3. Primary source repositories — supplied ZIPs and Git URLs

| Source | Input file / reference | Best functionality to integrate | Caveats |
|---|---|---|---|
| **GoSom Google Maps** | `google-maps-scraper-main.zip`; https://github.com/gosom/google-maps-scraper | Actual Maps collector, query ingestion, location extraction, bulk discovery, durable runs | Go app; license MIT in uploaded ZIP; validate flags, images and extraction using tests |
| **Omkar Google Maps** | `google-maps-scraper-master.zip`; https://github.com/omkarcloud/google-maps-scraper | Compare field coverage, filters, scheduling and product UX | Uploaded ZIP is predominantly docs/screenshots; may require separate upstream installation; MIT license in uploaded ZIP; don't falsely claim code merger |
| **Scrapling** | https://github.com/D4Vinci/Scrapling | Adaptive selectors, static/JS fetchers, spiders, crawl/export, retry and extraction | BSD-3-Clause per inspected upstream license; use installed dependency or documented interfaces |
| **Agent Reach** | https://github.com/Panniantong/Agent-Reach | Multi-channel router and diagnostics; approved authorized session channels, public video/RSS, supported social commands | MIT per upstream; **not every platform is supported**, some require user login or approved APIs; implement real reads and provenance |
| **Firecrawl** | https://github.com/mendableai/firecrawl | Search, map, crawl, rich structured extraction, website auditing, semantic enrichment | API/credits/rate limits; license/terms must be checked per installed component |
| **Headroom** | https://github.com/headroomlabs-ai/headroom | LLM tool-context/token optimization, context compression | Not a web scraper; no raw data mutation |

**Use versions pinned to a commit or package lockfile after verifying the current upstream state.** Do not assert the repository HEAD from this handoff is fixed/verified. Audit transitive dependencies and licenses. Reuse stable upstream implementations rather than copying needlessly.

## 4. Additional supplied skills and agent architecture assets

**In the attached handoff bundle or prior uploads:**

- `build-partner.zip` — agent-oriented build workflow, routing/evaluation references. In particular **`build-partner/references/jev-routing.md` describes TypeSafe's Jev System One decision model**, narrow semantic choices/probabilities, escalation thresholds, and closed-harness integration seams. Use this actual file; don't conflate with unrelated similarly named JevRouter projects.
- `gauntlet-loop-main (1).zip` — evaluation/improvement loop. Turn into measured collector/UX/ranking regression loops, not endless self-congratulation.
- `replica-skill-main.zip` — forensic site reconstruction, comparison/diff, architecture/design/deploy, useful when producing website makeovers or QA of site builds; not a Maps scraper.
- `SpaceAge_Skills_Upgrade_Pack.zip` — earlier individually named skill wrappers (`SpaceAge-GeoHarvest`, `SpaceAge-GeoEnrich`, `SpaceAge-GeoFusion-Intelligence`, `SpaceAge-ReplicaForge`, `SpaceAge-BuildPilot`, `SpaceAge-GauntletX`) plus some upstream materials. **This pack is not a working integrated engine.** Treat as a reference archive.
- `SpaceAge_GeoFusion_X_Universal_SKILL.md` — current portable instructions/onboarding catalog, partially aspirational.
- `SpaceAge_GeoFusion_X_Engine_v0.1.zip`, `_v0.2_Onboarding.zip`, `_v0.3_Multiselect.zip`, `_v0.4_PlatformCatalog.zip` — successive MVP archives. **Work from v0.4, compare regressions as needed.**
- `SpaceAge_GeoFusion_X_Skill.zip` and `SpaceAge_GeoFusion_X_OmniSource_v2.zip` — earlier concept/specification assets, do not trust as production code.

**Referenced in the user's Space Age Skills ecosystem (retrieve original files before claiming integration):**

- **Cinematic Website Builder** — a Google Drive file titled `cinematic-website-builder-SKILL-INTEGRATED.md` at https://drive.google.com/file/d/1wtTxcDOfhqTyZfGR5rrAnvIBylvu4gC9/view . It is a *website production* skill with 30 cinematic motion modules; it is not automatically a complete ranking engine. There may also be a newer Cinematic Website Builder v3 forensic rebuild and Cinematic Website Director v6.1. **Locate and compare actual versions** in Space Age Skills/GitHub; do not rely on historical naming claims alone.
- **UI/UX Designer** and **Google Stitch** skills — upstream design/handoff stages of the user's website production pipeline. Integrate only into downstream site-creation workflow.
- **Ponytail**, **Caveman** — distinct token-saving skills. Locate exact original files in Space Age Skills and identify real capabilities before implementing.
- **Space Age cinematic director / OpenMontage** — production creativity layer, not scraper core.
- **Space Age video intelligence** / **Karpathy autoresearch** / **skill creator** — optional reusable research and skill-generation support, not core collectors; fetch only if necessary to build/evaluate.

Do not tell the user any of the above were merged when they are only referenced or zipped.

## 5. Target architecture

```
CLI / Web UI / Universal SKILL.md / API
     |
Multi-select onboarding + consent + secrets reference (never collect secrets in questionnaire)
     |
Job spec -> deterministic policy/permissions filter -> Capability Registry
     |
Jev narrow classifier (where semantic ambiguity) -> frontier planner (complex cases)
     |
Execution planner (DAG), budget allocator, idempotent scheduler, checkpoint store
     |
+------------------+--------------------+--------------------+--------------------+
| Geo collectors   | Web collectors     | Social collectors  | Structured sources |
| GoSom/Omkar      | stdlib/Scrapling   | Agent Reach        | Firecrawl/API/etc  |
| Tiles/places     | Crawl/JS/spiders   | Approved sessions  | APIs/exports       |
+------------------+--------------------+--------------------+--------------------+
     |
Raw immutable observations + source URL + timestamp + parser/version + confidence
     |
Canonical entity resolver (location branches, unique IDs, ambiguous match queue)
     |
Website auditing (Lighthouse/SEO/schema), AI-search, reviews/social intelligence
     |
Scores + provenance + uncertainty + analyst notes
     |
Sheets (verified tabs & rows), CSV/JSONL, data warehouse, CRM
     |
Telemetry, regression fixtures, failure analysis, provider/rate dashboards
```

### Router contract

Define machine-readable `Capability` objects: provider, supported platforms, operations, authorization requirements, deployment type, output schema, accepted formats, expected unit cost, latency, rate limits, observed success/completeness, health check, and restrictions. Filter candidates through deterministic security/availability/policy gates *before* any model selection.

`route(job, state) -> {selected_capability, fallback_chain, rationale, estimated_cost, confidence, escalation_required}`.

- **Code**: explicit rules, numeric thresholds, rate/cost limits, exact regex/domain matching, math, authorization, retries, data schemas.
- **Jev (TypeSafe)**: bounded semantic choice/relevance/tier judgments on already gathered state; only if measurable advantage over code. Follow `build-partner/references/jev-routing.md` and its confidence/escalation limits. The harness's own internal reasoning cannot simply be replaced inside closed systems.
- **Frontier model**: multi-step planning, conflicting evidence, semantic cross-platform identity resolution, nontrivial SEO/UX reviews, code changes and human-readable explanations.
- **Fallback**: if connector is missing or prohibited, report the unsupported feature; do not silently use unrelated sources and claim task complete. Prefer approved APIs/exports when platform automation is restricted.

Record router decisions and execution receipts in run logs. Test cost and accuracy against a deterministic-only baseline.

### Authenticated social P0 requirements

Build real `SocialAdapter` capabilities: `diagnostic`, `capabilities`, `profile`, `search`, `posts`, `comments`, `account_metadata`, `rate_limits`, `provenance`. Verify by executing authorized, permitted samples and checking real stable IDs and timestamps. Separate platform-specific implementation and declare `supported`, `requires_auth`, `policy_blocked`, `configuration_missing`, `broken`, `not_implemented` clearly. Never request login passwords/cookies in chat or export session tokens. A browser login alone does NOT grant blanket scraping permission; follow platform terms and controls. No MFA/CAPTCHA/access-control circumvention. Do not collect private personal data beyond stated legitimate needs.

Agent Reach is the channel capability manager; where its current channel list lacks TikTok/Pinterest/Lemon8, implement separate approved connectors or state the gaps explicitly. **Never advertise all 71 platforms as operational merely because they appear in onboarding.**

## 6. Website and lead scoring rules

Historical Space Age 100-point website-viability score (verify exact latest definitions in user's repository before treating as canonical):

| Factor | Max |
|---|---:|
| Visual design | 20 |
| Mobile experience | 15 |
| SEO | 15 |
| Trust/credibility | 15 |
| Conversion effectiveness | 15 |
| Speed | 10 |
| Automation/AI agent capability | 10 |
| **Total** | **100** |

**Additional distinct metrics**: `Technical_SEO_Audit`, `Local_SEO_Readiness`, `AI_Search_Readiness` (AEO/GEO/entity clarity, structured data, crawlable FAQ, content quality), `Social_Presence`, `Prospect_Opportunity`, with formulas/configuration/version. A high opportunity score means need for improvement, **not** good website performance.

For every numeric criterion store: `score`, `max`, `evidence`, `method`, `verified_at`, `confidence`, `not_measured_reason`. If no website linked: use `website_status=no_link_on_maps`, *not* globally `no_website`; mark website quality `N/A` rather than automatically 0. If no Lighthouse/mobile test, mark `not_measured`, not zero or guessed. Separately rank outreach by opportunity, contactability, business fit and evidence.

## 7. First end-to-end production acceptance case: Mesquite TX landscaping

User asked: **Scrape Google Maps landscaping businesses in Mesquite, Texas, identify no-website and weak-site prospects, use Cinematic Website Builder/ranking framework, deliver populated Google Sheets with SEO and AI optimization rankings.**

Existing Google Sheet created by earlier session:
https://docs.google.com/spreadsheets/d/1Dcn3SZ1jyMqEVcSIkH9343j_bsDpnat54-N2SDzjfeg/edit

Currently has 24 candidate rows, ~8 *Maps listings with no website linked*, preliminary SEO/AI opportunity scores and separate `No Website - Maps` (gid 103), `SEO and AI Audit` (gid 104), `Ranked Leads` (gid 101) tabs. Those are partially researched via Firecrawl, not a verified native GeoFusion crawl; some addresses, ratings and websites require cross-checking and the full website score was not measured. **Do not overwrite this source dataset without backup and user approval; treat as initial fixture / prior work.**

Acceptance for real engine:

1. Onboard landscaping category + Mesquite Texas polygon/city + Maps/website/social sources, max results/budget and source permissions.
2. Real Maps collector gathers results with source place ID, phone, address, category, rating/count and linked website; multiple searches/tiling; reproducible logs and coverage disclaimer.
3. Compare Maps-linked website status with separately verified official web domain; preserve `none linked`, `verified no owned domain found`, `website exists`, and `uncertain` states without conflating them.
4. Scrape official sites with static/JS escalation. Run **real** Lighthouse mobile/desktop where feasible plus metadata/schema/accessibility/local SEO checks; record unavailable tests.
5. Match available authorized social profiles/posts without platform misattribution.
6. Calculate versioned scores, evidence, and opportunity ranks; no fabricated Lighthouse/AI scores.
7. Export native Google Sheets and read it back to verify header and >=1 populated row in every claimed populated tab; default first tab must show leads, not blank Sheet1.
8. Export separate **No Website Linked**, **Website Weaknesses**, **SEO and AI Audit** tabs and note verification uncertainty.
9. Produce run report: observed record counts, duplicates, errors, time, cost, provider paths, policy limitations, sites tested and test results.

## 8. Suggested milestone gates (do not stop at architecture)

**M0 audit & baseline**: inspect every supplied artifact and licensing; run existing tests; publish verified feature matrix and gap list; confirm current branches/commits. Preserve working code.

**M1 unified executable collectors**: `GeoCollector`/`WebCollector`/`SocialCollector` interfaces, GoSom live + Scrapling static/dynamic/spider + Firecrawl enrichment plus honest Omkar status, typed errors and provenance. Real integration tests on permitted public fixtures.

**M2 Agent Reach P0**: configure true channel operations for a permitted authenticated sample (and public YouTube, etc.), plus visible per-platform readiness; fail explicitly if platform not available. Implement X, Instagram, Facebook, Reddit, LinkedIn, Xiaohongshu where permissible, then separate TikTok/Pinterest/Lemon8 paths. Do not bypass access controls.

**M3 autonomous execution**: deterministic capability registry, TypeSafe Jev optional classifier, frontier escalation, DAG orchestrator, persistent jobs/resume, circuit-breakers, token/cost budgets, provenance and logs.

**M4 intelligence & ranking**: canonical cross-source entity graph, trustworthy site audit, Lighthouse, technical/local SEO, AI-search readiness, review/social analysis, ranking configuration, verified reporting.

**M5 proof & delivery**: Mesquite acceptance test, native Google Sheet (read-after-write), portable SKILL.md, one-command install, lockfile, Docker Compose where beneficial, tests+fixtures, security/license report, changelog and measured benchmarks. If integration isn't possible, state which requirement blocks release rather than marking it delivered.

**Do not conflate local unit test pass with real social/Maps acceptance.**

## 9. Security, reliability, provenance, costs

- Respect robots/terms and per-provider data restrictions; prefer official/approved APIs and authorized exported data. No evasion of auth, paywalls, CAPTCHA, account permissions or platform controls.
- Secrets via local environment/secret manager; no raw credentials in logs, sheets or model prompts. Credential scope per source and job.
- Raw observations retained immutably with extraction timestamp, URL/provider, retrieval mode, collector version and errors; compress only summaries for LLM context.
- Domain-specific rate limiting/backoff, error taxonomy, checkpoint/retry/idempotency, max-run cost, circuit breaker, cancellation and audit log.
- Entity matching must avoid combining unrelated branches/companies; use provider place IDs, phone, address, coordinates and site domains with human review for low confidence.
- Comply with upstream licenses and preserve notices; reusing code requires source/license documentation. Pin dependency versions. Include threat model and test fake/real permission modes.

## 10. Delivery checklist — require files and measured proof

- [ ] Actual unified source tree, not only a prose plan or renamed copies.
- [ ] `SKILL.md` optimized for skill discovery and all target harnesses; `README.md` quickstart.
- [ ] `pyproject.toml` / lockfiles, typed adapter interfaces, real Maps/Web/Social collectors, tests.
- [ ] Optional `jev_router.py` with baseline/no-Jev switch, confidence threshold and escalation tests; closed harness integration docs.
- [ ] Onboarding (multi-select, grouped catalog, permission/budget confirmation); runnable non-secret saved configuration.
- [ ] Real social extraction capability tests for each supported permitted channel; per-platform matrix.
- [ ] Website and Maps audit tests with evidence-rich ranking scores and `not_measured` states.
- [ ] Google Sheet populated **and read back**, preferably first visible tab leads, links correct.
- [ ] Separate lists of no-Maps-website, uncertain/no verified site, and weak websites.
- [ ] Benchmarks: accuracy, field completeness, duplicate rate, site failures, cost/record and latency, with reproducible test corpus.
- [ ] Explicit limitations, risks, dependencies and remaining gaps. No unsupported production claims.
- [ ] Downloadable ZIP/repository commit if authorized, plus portable handoff and developer instructions.

## 11. Harness guidance

Choose a tool-enabled **coding agent that can execute terminal commands and tests**, install dependencies and use source control. A plain chat-only model cannot implement/deploy and validate the whole integration by writing a skill description. Preferred approach: Codex CLI/Work, Claude Code, Gemini CLI, Antigravity or a comparable agent with repository access and Docker/browser/network permissions. The agent should inspect actual files first and proceed milestone by milestone without waiting for confirmation on routine reversible code changes; ask only before external charges, account access/credentials, irreversible changes and production publication. Do not assume all external APIs or social sessions are already connected.

The user's current ChatGPT session model subtype (Instant/Medium/High or premium variants) cannot be determined from this handoff. **Model branding is less important than verified terminal/tool access.** Use high reasoning effort for architecture, debugging and code reviews, cheap deterministic scripts and narrow Jev classifiers for repetitive decisions.

## 12. Immediate next action for receiving agent

Unpack the supplied v0.4 engine and supporting archives into an isolated working directory, inventory and test actual entry points, inspect Jev routing guidance and upstream licenses. Write/execute the initial integration tests, then start coding **M1 collectors and M2 social features**. Provide a live progress matrix, execute the Mesquite acceptance job, and deliver the final tested package, not another promise.
