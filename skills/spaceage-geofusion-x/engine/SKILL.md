---
name: spaceage-geofusion-x
version: 0.5.0
description: >
  Geographic + web + social business intelligence engine. Use when the user wants Google Maps businesses
  collected for an area (any category), websites audited (technical SEO, local SEO, AI-search readiness,
  Lighthouse, 100-point website quality), "no website" listings verified, social presence matched,
  prospects ranked by opportunity, or a tabbed Google Sheet / CSV / XLSX report — e.g. "scrape landscapers
  in Mesquite TX and find weak websites", "audit these local competitors", "which plumbers have no site".
  General purpose: local research, competitor analysis, lead lists, reviews, enrichment. Runs real
  collectors (GoSom Maps, Playwright, Lighthouse, Agent Reach); reports every platform's true status.
platforms: [Claude_Code, Codex, Cursor, Gemini_CLI, Antigravity, any agent with a shell]
requires: [python>=3.10]
optional: [go>=1.24 or docker (GoSom), node>=20 (Lighthouse, mcporter), playwright chromium, agent-reach]
---

# SpaceAge GeoFusion X

Executable engine in `engine/` (Python package `geofusion`). This file tells an agent how to drive it.
State of every feature is in `engine/STATUS.md` — read it before promising anything to the user.

## Install (once)

```bash
cd skills/spaceage-geofusion-x/engine && ./install.sh      # pinned: GoSom d0b51bc, lighthouse 12.8.2, playwright 1.56.0
export GEOFUSION_GOSOM_BIN=~/.geofusion/tools/gmaps-scraper GEOFUSION_LIGHTHOUSE=~/.geofusion/tools/node_modules/.bin/lighthouse
python -m unittest discover -s tests                       # 36 tests, offline
```

Optional env (names only, never paste values into chat): `TYPESAFE_API_KEY` (Jev judgments), `EXA_API_KEY`
(search beyond free tier), `FIRECRAWL_API_KEY`, `GOOGLE_OAUTH_ACCESS_TOKEN` (Sheets scope), `CHROME_PATH`.

## Workflow

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
- Jev (`router.Judge`, only with `TYPESAFE_API_KEY`): one bounded choice over gathered fields (category relevance).
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
