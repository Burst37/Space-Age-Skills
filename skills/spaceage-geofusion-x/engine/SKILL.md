---
name: spaceage-geofusion-x
version: 0.6.0
description: >
  Geographic + web + social business intelligence engine. Use when the user wants Google Maps businesses
  collected for an area (any category), websites audited (technical SEO, local SEO, AI-search readiness,
  Lighthouse, 100-point website quality), "no website" listings verified, social presence matched,
  prospects ranked by opportunity, or a tabbed Google Sheet / CSV / XLSX report — e.g. "scrape landscapers
  in Mesquite TX and find weak websites", "audit these local competitors", "which plumbers have no site".
  General purpose: local research, competitor analysis, lead lists, reviews, enrichment. One-line scrape of any
  source into a sheet: `geofusion scrape <maps|web|instagram|reddit|facebook|x|linkedin|youtube> "<what>" ["<where>"] --sheet`.
  Runs real collectors (GoSom Maps, Playwright, Lighthouse, Agent Reach, merged web-scraping skills: defuddle,
  scrapling, firecrawl, browserbase, camofox stealth browser, scrapegraph-ai); TypeSafe Jev routes intent;
  reports every platform's true status.
platforms: [Claude_Code, Codex, Cursor, Gemini_CLI, Antigravity, any agent with a shell]
requires: [python>=3.10]
optional: [go>=1.24 or docker (GoSom), node>=20 (Lighthouse, mcporter), playwright chromium, agent-reach]
---

# SpaceAge GeoFusion X

Executable engine in `engine/` (Python package `geofusion`). This file tells an agent how to drive it.
State of each feature is in the tables below — read them before promising anything to the user.

## Install (once)

```bash
cd skills/spaceage-geofusion-x/engine && ./install.sh      # pinned: GoSom d0b51bc, lighthouse 12.8.2, playwright 1.56.0
export GEOFUSION_GOSOM_BIN=~/.geofusion/tools/gmaps-scraper GEOFUSION_LIGHTHOUSE=~/.geofusion/tools/node_modules/.bin/lighthouse
python -m unittest discover -s tests                       # 50 tests, offline
```

Optional env (names only, never paste values into chat): `TYPESAFE_API_KEY` (Jev judgments), `EXA_API_KEY`
(search beyond free tier), `FIRECRAWL_API_KEY`, `GOOGLE_OAUTH_ACCESS_TOKEN` (Sheets scope), `CHROME_PATH`.

## Quick scrape (one source, one sheet)

```bash
python -m geofusion scrape maps "landscaping" "Mesquite TX" --sheet          # geocode -> bbox -> GoSom tiles
python -m geofusion scrape web "landscapers" "Mesquite TX"                    # search (Exa / Firecrawl / Browserbase)
python -m geofusion scrape web "https://example.com/pricing" "pricing table"  # one page; <where> = extraction hint
python -m geofusion scrape reddit "best lawn service recommendations" "Dallas" --authorized
python -m geofusion scrape youtube "sod installation" "Texas" -n 10
```

Flags: `-n` row cap (20), `--sheet [TITLE]` (native Google Sheet with Sheets token, always XLSX+CSV in `<workdir>/report`),
`--authorized` (login-backed sources: you confirm it is your own session, low-volume research), `--max-cost USD`
(billable collectors stay off at the default 0), `--full` (print all rows instead of the compact summary).

Output: one compact JSON line — `status` (done | blocked | empty), `intent` + `intent_by` (code | jev | default),
`route` (collector used), `rows`, `errors` (why something was blocked), `top` 5 trimmed rows, `workdir`.
All rows are in `<workdir>/rows.jsonl`, raw collector output in `<workdir>/raw/`, decisions in `judgments.jsonl`.
Read those files only when the summary is not enough.

| Source | Collector chain (cheapest live first) | Needs |
|---|---|---|
| maps | Nominatim geocode -> GoSom fast mode, tiled | GoSom binary or Docker; `<where>` required |
| web (query) | Exa via mcporter -> Firecrawl -> Browserbase Search | mcporter; keys for the paid ones + `--max-cost` |
| web (URL) | defuddle -> static -> scrapling -> Playwright -> camofox -> Firecrawl -> Browserbase Fetch -> scrapegraph-ai | each probed; paid ones need key + `--max-cost` |
| instagram, facebook | `opencli <p> search` (instagram posts: `opencli instagram user`) | Agent Reach + user's own browser session, `--authorized` |
| reddit | `opencli reddit search` <-> `rdt search` (doctor's backend first); communities derived from posts | same |
| x | `twitter search --json` <-> `opencli twitter search` | same |
| linkedin | `mcporter call linkedin.search_people / get_company_profile / search_jobs` | same |
| youtube | yt-dlp search (Agent Reach backend); channels derived from videos | yt-dlp |

Routing for `scrape` (code first, Jev only where code cannot decide):

- Code: the source (always the user's), URL vs query, keyword intent baseline (exactly one signal -> decided),
  health/auth/budget gates via `router.route()`, geocoding, parsing.
- Jev `intent` (Choice over the source's record kinds, floor 0.75): only when the baseline sees zero or several signals.
  No key -> the source's default kind, logged as `default (none)`.
- Jev `source_fit` (Noul, floor 0.5 on 2·|p−0.5|): advisory hint in the summary when p < 0.5; never switches the source.
- Measure Jev against the baseline: `python -m geofusion jev-compare examples/intent-cases.jsonl` (agreement,
  rescued cases, escalation rate, accuracy vs `expected`, median latency). Needs `TYPESAFE_API_KEY`.

## Token discipline (caveman + ponytail, always on)

- **Caveman Mode B** (`skills/caveman/references/pipeline-token-budget.md`): the engine prints compact JSON (no
  pretty-print), text cut to 500 chars per row on disk and 90 in the summary, success is one line; raw evidence goes
  to disk once and is read only on demand. Do not paste `rows.jsonl` or raw files into chat — quote counts and the `top` rows.
- **Caveman Mode A** when reporting: status (done / blocked / empty), counts, sheet link, what was not measured and why.
- **Ponytail** (`skills/ponytail`) when changing the engine: smallest complete change; reuse `web`, `maps`, `social`,
  `router` before new code; no new dependency for a few lines; keep validation (`web.safe_url` SSRF guard), auth gates
  and truthful statuses; one small test per new behaviour; mark limits with `# shortcut: <limit>, <when to upgrade>`.

## Workflow (full audit job)

1. **Onboard** — `python -m geofusion onboard` (multi-select objectives, 71-platform catalog + `custom:<name>`,
   access methods, limits). Ask only what the user has not said. Never collect passwords/cookies/tokens in chat.
2. **Readiness** — `python -m geofusion readiness youtube,instagram,facebook,x,reddit,linkedin,tiktok,...`
   Tell the user the status per platform (`supported | requires_auth | policy_blocked | configuration_missing |
   broken | not_implemented`). Catalog selection is not support.
3. **Job config** (JSON, no secrets):
   ```json
   {"queries": ["landscaping company", "lawn care service", "landscaper"], "bbox": [32.69, -96.68, 32.86, -96.50],
    "rows": 3, "cols": 3, "city": "Mesquite", "state": "TX", "category": "landscaping",
    "max_records": 200, "max_minutes": 75, "social_platforms": ["youtube", "instagram", "facebook"], "authorized_social": false}
   ```
   `bbox` is minLat,minLon,maxLat,maxLon. Grow rows/cols for bigger areas (fast mode caps ~20 results per query per tile).
4. **Run** — `python -m geofusion run job.json --workdir runs/<name> --job <id>`. Re-running the same `--job` resumes:
   done tiles and businesses are skipped, failed ones retried. `--no-lighthouse` for a quick pass.
5. **Report** — `python -m geofusion report --workdir runs/<name> --job <id> --out report/ [--google-sheet "Title"]`
   writes one CSV per tab, `all_tabs.jsonl`, and `geofusion_report.xlsx` (first tab = Ranked Leads). With a Sheets
   token it creates a native Google Sheet and reads every tab back (`verification.all_ok`). Without a token, upload the
   XLSX through a Drive connector with conversion to Google Sheets, read it back, and run `export.verify()` on the read-back.
6. **Tell the user** the counts, the tabs that are populated, what was not measured and why. Never claim more.

## What each stage really does

| Stage | Implementation | Notes |
|---|---|---|
| Maps | GoSom binary, `-fast-mode` per tile, all queries per tile; raw output kept + sha256 | GoSom place-page mode returned empty records in testing → fast mode |
| Dedupe | provider `data_id`; branches with different IDs stay separate | |
| Area / category | address contains `City, ST`; regex rules, ambiguous → Jev (if key) else needs review | out-of-area rows go to Failed - Needs Review |
| No-website check | domain guesses (DNS + Maps phone on page) + Agent Reach Exa search | `website_exists` / `verified_no_owned_domain_found` (only directories carry the phone) / `uncertain` |
| Site audit | static fetch → Playwright when JS shell; homepage + ≤3 priority pages; robots/sitemap/llms.txt | public hosts only (SSRF guard) |
| Lighthouse | real CLI, mobile + desktop | failure → `not_measured` with reason |
| Social | Agent Reach doctor; YouTube reads via yt-dlp; profiles linked from the official site | login-backed platforms stay `requires_auth` |
| Scores | `geofusion-score-1.0`; each criterion has score, max, evidence, method, verified_at, confidence, not_measured_reason | visual design always `not measured` (needs visual review) |

Scores: **Website Quality /100** (visual 20, mobile 15, SEO 15, trust 15, conversion 15, speed 10, automation 10 —
total only when all measured, else `partial X/Y`), **Technical SEO /100**, **Local SEO /100**, **AI Search Readiness /100**,
**Social Presence**, **Opportunity /100** (high = needs work, not good performance), contactability, fit, outreach priority.
No website on Maps → quality `N/A`, never 0.

## Routing rules (from build-partner/references/jev-routing.md)

- Code: thresholds, regex/domain rules, auth gates, budgets, math, dates. `router.route()` filters capabilities by
  platform, operation, live health, authorization and budget before anything else.
- Jev (`router.Judge`, only with `TYPESAFE_API_KEY`): bounded Choice/Noul over gathered fields (category relevance, scrape intent, source fit).
  Confidence floor 0.75, 4 s timeout → bypass, every judgment logged to `judgments.jsonl`. Never authorizes actions.
- Frontier model (you): escalated judgments, conflicting evidence, visual review, writing for humans.
- Missing or prohibited connector: report it. Do not substitute another source silently.

## Hard rules

- No MFA/CAPTCHA/paywall/access-control bypass. A browser login is not permission to bulk-scrape.
- Agent Reach login channels are configured by the user locally (`agent-reach` docs); never read browser cookies yourself.
- Do not overwrite a user's existing sheet; create a new one and link the old one as prior work.
- Low volume, research use for Maps. Respect robots.txt; search engines are used only via APIs/MCP (Exa), not SERP scraping.

## Harness notes

Claude Code / Codex / Gemini CLI / Cursor / Antigravity: run the CLI through the shell tool; the engine is plain Python.
Jev cannot replace a closed harness's internal reasoning — it sits inside the engine as an explicit `judge()` call.
Long runs: start in the background and poll the job DB (`checkpoints` table) instead of tailing huge logs.
