---
name: sa-prospecting-agent
description: >
  Phase 0 lead generation and website audit agent. TRIGGER IMMEDIATELY when the user wants to
  find local business leads, scrape Google Maps for a niche and city, audit prospect websites
  for AI/SEO optimization, or sort leads into Google Sheets categories. TRIGGER PHRASES:
  "find [niche] in [city]", "scrape leads for [niche]", "find dentists in Mesquite",
  "prospect for clients", "find businesses that need a website", "audit these websites",
  "who needs a website in [area]", "generate leads for [industry]", "find top 25 [business type]",
  "scan these sites for AI optimization", "sort leads into Google Sheets", "who doesn't have a website".
  Outputs: raw lead list → website audit results → Google Sheets with 3-bucket categorization →
  qualified lead handoff to production-pipeline-orchestrator.
version: 1.0
updated: 2026-05-18
---

# SA PROSPECTING AGENT
## Phase 0 — Lead Generation, Website Audit & Google Sheets Routing

This skill runs BEFORE the production pipeline. It finds potential clients, audits their current
digital presence, and hands off qualified leads sorted by opportunity tier.

---

## PHASE 0A — GOOGLE MAPS LEAD SCRAPING

### Intake Questions (ask once, execute immediately)

```
PROSPECTING_INTAKE:
  niche:       [What type of business? e.g. "dentist", "HVAC", "restaurant", "law firm"]
  location:    [City + state or zip. e.g. "Mesquite TX", "Dallas 75201"]
  count:       [How many leads? Default: 25]
  sort_by:     ["rating" | "review_count" | "distance" — default: rating]
  min_rating:  [Minimum Google rating to include — default: 3.5]
```

### Scraping Execution

Use **firecrawl-mcp** or **browserbase-scraper** to pull from Google Maps search:

```
SCRAPE_TARGET:
  query: "top [count] [niche] in [location]"
  source: "Google Maps"
  extract_per_lead:
    - business_name
    - address
    - phone_number
    - google_rating
    - review_count
    - website_url        # null if no website listed
    - google_maps_url
    - business_category
    - hours_listed       # boolean — signals how complete their listing is
```

### Raw Lead List Output

```yaml
RAW_LEADS:
  scrape_date: "[ISO date]"
  niche: "[niche]"
  location: "[city, state]"
  total_found: [N]
  leads:
    - id: 1
      name: "[Business Name]"
      address: "[Full address]"
      phone: "[Phone]"
      rating: [4.2]
      reviews: [187]
      website: "[URL or null]"
      maps_url: "[Google Maps link]"
```

---

## PHASE 0B — WEBSITE AUDIT

Run for every lead that has a `website` value. Skip if `website: null` (auto → Bucket 1).

### Audit Execution

Use **browserbase-fetch** or **firecrawl-mcp** to scan each website. Check:

```
AUDIT_CHECKLIST:
  presence:
    - has_website: true/false

  seo_signals:
    - has_meta_title: boolean
    - has_meta_description: boolean
    - has_og_tags: boolean
    - has_structured_data_schema: boolean   # JSON-LD for LocalBusiness
    - has_sitemap: boolean
    - page_load_estimate: "fast" | "medium" | "slow"   # based on asset count
    - mobile_viewport_tag: boolean
    - h1_present: boolean

  ai_signals:
    - has_chat_widget: boolean              # look for Intercom, Drift, Tidio, ManyChat, etc.
    - has_ai_agent_script: boolean          # look for known AI chatbot JS patterns
    - has_booking_automation: boolean       # Calendly, Acuity, Square embed
    - has_review_automation: boolean        # Birdeye, Podium, Reputation.com widgets

  design_signals:
    - appears_modern: boolean               # heuristic: flexbox/grid, no table layouts
    - has_video_hero: boolean
    - mobile_responsive: boolean            # viewport meta + media queries present
    - has_clear_cta: boolean

  overall_score:                            # computed 0-100
    formula: |
      seo_score = (meta_title + meta_desc + og_tags + schema + sitemap + h1) / 6 * 40
      ai_score  = (chat_widget + ai_agent + booking + review) / 4 * 40
      design_score = (modern + video_hero + responsive + cta) / 4 * 20
      total = seo_score + ai_score + design_score
```

### Audit Score Interpretation

| Score | Label | Bucket |
|-------|-------|--------|
| 0 (no site) | No Digital Presence | Bucket 1 — Priority Build |
| 1–40 | Weak — Missing everything | Bucket 1 — Priority Build |
| 41–65 | Needs Work — Basic site, no AI/SEO | Bucket 2 — Upgrade Candidate |
| 66–85 | Decent — Has some optimization | Bucket 2 — Upgrade Candidate |
| 86–100 | Strong — Already optimized | Bucket 3 — Low Priority |

---

## PHASE 0C — GOOGLE SHEETS CATEGORIZATION

### Sheet Structure

Create or update a Google Sheet with these tabs:

**Tab 1: All Leads (master)**

| # | Business Name | Phone | Address | Rating | Reviews | Website | Audit Score | Bucket | Maps Link |
|---|---|---|---|---|---|---|---|---|---|

**Tab 2: Bucket 1 — Priority Builds** (no site OR score < 41)
- Sorted by: rating DESC, review_count DESC
- These get full production pipeline treatment — new website from scratch

**Tab 3: Bucket 2 — Upgrade Candidates** (score 41–85)
- Sorted by: audit_score ASC (worst first = most opportunity)
- These get page-upgrade or full rebuild depending on severity

**Tab 4: Bucket 3 — Already Optimized** (score 86+)
- Archive only — not actively pursued

### Color Coding

```
SHEET_COLORS:
  bucket_1_row: "#FF6B6B"   # red — hot leads
  bucket_2_row: "#FFD93D"   # yellow — warm leads
  bucket_3_row: "#6BCB77"   # green — low priority
```

### Summary Block (top of Tab 1)

```
PROSPECTING SUMMARY
Run Date: [date]
Niche: [niche] | Location: [city]
Total Scraped: [N]

Bucket 1 (Priority Builds):  [N1] leads  — [N1/N * 100]% of list
Bucket 2 (Upgrade Candidates): [N2] leads — [N2/N * 100]% of list
Bucket 3 (Already Optimized): [N3] leads — [N3/N * 100]% of list

Recommended next step: Begin production pipeline on top [min(N1, 5)] Bucket 1 leads
```

---

## PHASE 0D — HANDOFF TO PRODUCTION PIPELINE

After Google Sheets is written, generate a structured handoff packet:

```yaml
PRODUCTION_HANDOFF:
  handoff_date: "[ISO date]"
  niche: "[niche]"
  location: "[city]"
  priority_queue:             # Bucket 1 leads, sorted by opportunity
    - id: [N]
      name: "[Business Name]"
      phone: "[phone]"
      website: null           # or existing URL for reference/scraping
      rating: [N]
      reviews: [N]
      opportunity: "new_build"  # or "upgrade"
      audit_score: [0-40]
  
  pipeline_instruction: |
    Pass each lead through production-pipeline-orchestrator.
    Dispatch parallel coding agents — one agent per website.
    Agent roster: Codex · Claude Code · Gemini Pro · MiniMax 2.7 ·
                  DeepSeek v4 · Kimi K2 · Hermes Agent
    Maximum parallel deployments: [count of Bucket 1 leads, capped at 7]
```

---

## TOOL ROUTING

```
TOOL_SELECTION:
  google_maps_scraping:
    primary: firecrawl-mcp
    fallback: browserbase-scraper

  website_audit:
    primary: browserbase-fetch
    fallback: firecrawl-mcp

  google_sheets_write:
    primary: google-sheets MCP (if available)
    fallback: generate CSV + paste instructions

  handoff_trigger:
    skill: production-pipeline-orchestrator
    mode: parallel_batch
```

---

## EXECUTION FLOW

```
User: "Find top 25 dentists in Mesquite TX"
  ↓
0A — Scrape Google Maps
    → Extract 25 leads with website URLs (or null)
  ↓
0B — Audit each website (parallel, one fetch per lead)
    → Score each site 0-100
    → Flag: has_website / seo_signals / ai_signals / design_signals
  ↓
0C — Categorize → Google Sheets
    → Tab 1: All 25 leads
    → Tab 2: Bucket 1 (e.g. 14 leads — no site or score < 41)
    → Tab 3: Bucket 2 (e.g. 8 leads — score 41–85)
    → Tab 4: Bucket 3 (e.g. 3 leads — already strong)
  ↓
0D — Handoff packet
    → Priority queue of Bucket 1 leads
    → Trigger production-pipeline-orchestrator in parallel batch mode
    → Dispatch [N] coding agents simultaneously, one per site
```

---

## CROSS-SKILL CONNECTIONS

| Next Skill | When |
|---|---|
| `production-pipeline-orchestrator` | After handoff packet — orchestrates the full build for each lead |
| `brand-extractor` | Run per lead before building — extract visual identity from existing site or competitor |
| `cinematic-website-builder` | Final build stage per lead |
| `page-upgrade` | For Bucket 2 leads — upgrade existing site rather than full rebuild |

---

## SAMPLE OUTPUT

**After scraping "top 25 dentists in Mesquite TX":**

```
PROSPECTING COMPLETE — Mesquite TX Dentists
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total scraped:           25
Bucket 1 (Priority):    11  ← no website or score < 41
Bucket 2 (Upgrade):      9  ← existing site, score 41–85
Bucket 3 (Skip):         5  ← already optimized

Google Sheets: [link]

TOP PRIORITY LEADS (Bucket 1):
1. Sunrise Family Dentistry     ★ 4.8  (312 reviews)  — NO WEBSITE
2. Mesquite Smiles Dental       ★ 4.7  (198 reviews)  — Score: 22/100
3. Premier Dental of Mesquite   ★ 4.6  (156 reviews)  — Score: 31/100
...

Ready to dispatch 7 parallel coding agents.
Confirm to begin production pipeline →
```
