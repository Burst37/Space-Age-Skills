---
name: mobbin-operator
description: >
  SA operator skill for mobbin-pp-cli — the terminal-native Mobbin client with offline SQLite
  mirror, FTS5 search, and compound design intelligence commands no official Mobbin tool ships.
  Use IMMEDIATELY for any design research, competitor UI analysis, pattern benchmarking, paywall
  audits, onboarding flow comparisons, or competitive UX intelligence. TRIGGER on: "check Mobbin",
  "find paywall screens", "how does X app handle onboarding", "compare iOS vs web for Y", "what
  patterns does fintech use", "build a design deck", "benchmark this pattern", "what changed in
  this app", "audit flows", "grab reference screens", "cross-platform parity", or any request that
  involves shipped UI patterns from real production apps. This is the SA-standard tool for all
  design intelligence — load it before any Mobbin query, screen download, or competitive analysis
  session.
license: MIT
source: https://github.com/mvanhorn/cli-printing-press
---

# Mobbin Operator — Space Age AI Solutions

**Tool:** `mobbin-pp-cli` — cli-printing-press generated, agent-native
**Data:** 621,500+ shipped UI screens from 1,100+ apps
**Storage:** Local SQLite mirror with FTS5 full-text search
**CDN:** Bytescale (full-res 1920px image downloads)
**Auth:** Session-based (Mobbin Pro account required)

---

## FIRST RUN — SETUP SEQUENCE

```bash
# 1. Health check
mobbin-pp-cli doctor

# 2. Authenticate (opens browser, saves session)
mobbin-pp-cli auth login

# 3. Initial sync (pulls all apps, screens, flows into SQLite)
# Run once — takes ~10-30 min depending on account tier
mobbin-pp-cli sync

# 4. Verify local store is populated
mobbin-pp-cli search --query "paywall" --local --limit 5
```

After initial sync, most read commands hit `--data-source local` (instant, offline). Use
`--data-source live` only when you need real-time data or post-sync updates.

---

## THE 6 POWER COMMANDS (NOT IN OFFICIAL API DOCS)

### 1. `deck` — Design-crit reference pack for any pattern × industry

Searches matching screens, downloads full-res Bytescale CDN images, packages a ZIP with manifest
CSV. One command → presentation-ready asset bundle.

```bash
# Paywall patterns across fintech apps
mobbin-pp-cli deck \
  --screen-patterns paywall \
  --categories fintech \
  --limit 40 \
  --output ./decks/fintech-paywall-deck.zip

# Onboarding flows for e-commerce
mobbin-pp-cli deck \
  --flow-actions onboarding \
  --categories ecommerce \
  --limit 30 \
  --output ./decks/ecommerce-onboarding.zip

# Agent mode (non-interactive, JSON manifest)
mobbin-pp-cli deck \
  --screen-patterns "empty-state" \
  --categories productivity \
  --agent \
  --output ./decks/empty-state-productivity.zip
```

**SA Use Case:** Feed directly into `ui-ux-designer` skill as moodboard reference for any client's
competitor analysis. Extract to `/mnt/user-data/uploads/` and reference in the brand audit stage.

---

### 2. `bench` — Cross-app leaderboard for any pattern

Count, last seen, top apps that ship a given pattern from the local SQLite store. Fast, offline,
zero API calls.

```bash
# Which fintech apps ship the most paywall screens?
mobbin-pp-cli bench --screen-patterns paywall --categories fintech --limit 20

# Subscription flow leaders
mobbin-pp-cli bench --flow-actions subscribing --platform ios --limit 15 --json

# What apps dominate "search" element usage?
mobbin-pp-cli bench --screen-elements "search-bar" --limit 25
```

**Output:** Ranked table — app name, screen count, last captured date.
**SA Use Case:** Competitive positioning reports for clients. "Here's who's winning this pattern
in your space and what their screens look like."

---

### 3. `audit` — Time-windowed flow audit across an industry

App, flow name, step count, captured_at — with `--since` for delta reports. Critical for "what
changed last quarter" competitive intelligence.

```bash
# All onboarding flows in fintech, last 90 days
mobbin-pp-cli audit --flow-actions onboarding --categories fintech --since 90d

# Creating-account flows, web platform, last 6 months
mobbin-pp-cli audit --flow-actions creating-account --platform web --since 180d --json

# Delta report: what new subscription flows appeared since Jan 2026?
mobbin-pp-cli audit --flow-actions subscribing --since 2026-01-01 --csv > audit-q1-2026.csv
```

**Output:** app | flow_name | step_count | captured_at
**SA Use Case:** Quarterly competitive reports. Run `--since 90d`, export CSV, feed to analysis.

---

### 4. `drift` — Diff an app's flows + screens between snapshots

Surface what added/removed/screen-count-changed between two local snapshots. Requires two syncs
at different points in time.

```bash
# What changed in Robinhood between last month and now?
mobbin-pp-cli drift --app robinhood --window 30d

# Diff Spotify's flows year-over-year
mobbin-pp-cli drift --app spotify --window 365d --json

# What screens did Cash App add/remove in Q1?
mobbin-pp-cli drift --app cash-app --since 2026-01-01 --until 2026-04-01
```

**Output:** added_flows | removed_flows | added_screens | removed_screens | net_delta
**SA Use Case:** Track when a competitor ships a major UI overhaul. Run monthly drift on key
apps in any client's space.

---

### 5. `grab` — Batch-download screens at 1920px with manifest

Deterministic filenames + `manifest.json` sidecar. Built for downstream tooling — feeds directly
into `cinematic-website-builder` and `ui-ux-designer` pipelines.

```bash
# Grab all paywall screens from top fintech apps
mobbin-pp-cli grab \
  --screen-patterns paywall --categories fintech --limit 50 \
  --resolution 1920 --output ./screens/fintech-paywalls/

# Grab onboarding screens for a specific app
mobbin-pp-cli grab --app coinbase --flow-actions onboarding --output ./screens/coinbase-onboarding/

# Agent mode — grab and emit manifest JSON only
mobbin-pp-cli grab --screen-patterns "pricing-table" --categories saas --agent --output ./screens/saas-pricing/
```

**Output:** `./screens/[slug]/[app]-[screen-id].png` + `manifest.json`
**SA Use Case:** Feed grabbed screens into `deck` for client presentations, or into
`cinematic-website-builder` as design reference during moodboard phase.

---

### 6. `cross` — Fan out pattern query across web AND iOS, one app set

Join results on app slug. Output side-by-side parity manifest showing which apps have the
pattern on web, iOS, both, or neither.

```bash
# Which fintech apps ship paywall on both iOS and web?
mobbin-pp-cli cross --screen-patterns paywall --categories fintech --platforms ios,web

# Onboarding parity for productivity apps
mobbin-pp-cli cross --flow-actions onboarding --categories productivity --platforms ios,web --json

# Full parity report as CSV
mobbin-pp-cli cross --screen-patterns "subscription" --categories health --platforms ios,web --csv > parity-health-subscription.csv
```

**Output:** app_slug | ios_count | web_count | parity_status (both/ios-only/web-only/missing)
**SA Use Case:** "Does this client's competitor have a web paywall yet?" — instant answer.

---

## CORE COMMANDS — DAILY WORKFLOW

```bash
# Full-text search local store (instant, offline)
mobbin-pp-cli search --query "dark mode settings" --local

# Live search with filters
mobbin-pp-cli screens --screen-patterns paywall --screen-elements "pricing-table" --platform ios --limit 20

# Flow search
mobbin-pp-cli flows --flow-actions onboarding --categories fintech --platform ios --limit 10 --json

# Scrape one app — all flows, screens, versions
mobbin-pp-cli app --slug coinbase
mobbin-pp-cli app --slug robinhood --agent

# Taxonomy discovery
mobbin-pp-cli patterns
mobbin-pp-cli flow-actions
mobbin-pp-cli elements
mobbin-pp-cli categories
mobbin-pp-cli filters
```

### Raw SQL on the local store

```bash
mobbin-pp-cli sql \
  "SELECT app_slug, COUNT(*) as screen_count
   FROM screens
   WHERE patterns LIKE '%paywall%'
   GROUP BY app_slug
   ORDER BY screen_count DESC
   LIMIT 20"
```

---

## AGENT MODE — HERMES / PIPELINE INTEGRATION

Add `--agent` to any command for JSON output (no tables, no color), non-interactive execution
(no prompts), and compact formatting where applicable.

```bash
# Hermes agent workflow: bench → grab → zip for client report
mobbin-pp-cli bench --screen-patterns paywall --categories fintech --agent | jq '.items[0:10]'

# Route output to file
mobbin-pp-cli grab \
  --screen-patterns "empty-state" --agent \
  --deliver file:/workspaces/client-research/empty-state-grab.json \
  --output /workspaces/client-research/screens/
```

**Rate limiting:** Default `--rate-limit 2` (2 req/sec). For batch jobs on VPS: `--rate-limit 1`
to stay safe on Mobbin's sniffed endpoints.

**Delivery routing:** `--deliver file:<path>` writes to disk; `--deliver webhook:<url>` posts to
a direct API endpoint (do NOT route through n8n per SA infra rule — post directly or route through
Hermes).

---

## SA PIPELINE INTEGRATION MAP

| SA Workflow | Mobbin Command | Output → Next Step |
|---|---|---|
| Client competitor analysis | `bench` + `cross` | Report → client deck |
| Moodboard for site build | `grab` → `/mnt/user-data/uploads/` | Images → `ui-ux-designer` Phase 0 |
| Design deck for pitch | `deck` | ZIP → client presentation |
| Quarterly UX report | `audit --since 90d` + `drift` | CSV → analysis |
| Pattern gap analysis | `cross` | Parity manifest → recommendations |
| Pre-build research | `screens` + `flows` + `app` | Intel → `cinematic-website-builder` brief |

---

## COMMON PATTERN + CATEGORY SLUGS

**Patterns (--screen-patterns):** `paywall` | `onboarding` | `empty-state` | `pricing-table` |
`subscription` | `settings` | `profile` | `search` | `checkout` | `login` | `signup` |
`dashboard` | `home` | `feed` | `modal` | `bottom-sheet` | `tab-bar`

**Flow Actions (--flow-actions):** `onboarding` | `creating-account` | `subscribing` |
`upgrading` | `checking-out` | `searching` | `filtering` | `sharing`

**Categories (--categories):** `fintech` | `ecommerce` | `productivity` | `health` | `social` |
`food` | `travel` | `entertainment` | `saas` | `crypto`

**Platforms (--platform):** `ios` | `web` | `android`

---

## CACHE MANAGEMENT

```bash
mobbin-pp-cli cache
mobbin-pp-cli cache prune --older-than 30d
mobbin-pp-cli sync --no-cache
```

## PROFILES — SAVE REUSABLE FLAG SETS

```bash
mobbin-pp-cli profile save fintech-paywall \
  --screen-patterns paywall --categories fintech --platform ios --limit 50

mobbin-pp-cli grab --profile fintech-paywall --output ./screens/
mobbin-pp-cli deck --profile fintech-paywall --output ./decks/fintech-paywall.zip
```

---

## REFERENCES

- CLI source: https://github.com/mvanhorn/cli-printing-press
- Mobbin official MCP: https://mobbin.com/mcp
- `mobbin-pp-cli doctor` — verify auth + connectivity before any session
- `mobbin-pp-cli agent-context` — emit full JSON CLI description for agent routing
- `mobbin-pp-cli which <capability>` — find command for any capability
