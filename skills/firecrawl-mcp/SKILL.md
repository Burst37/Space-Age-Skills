---
name: firecrawl-mcp
display_name: SPACE AGE — Firecrawl MCP
version: 1.0.0
last_updated: 2026-05
description: >
  Connects Claude to the live web via Firecrawl — scrape any URL, search the web with
  full page content, map site structure, batch scrape, extract structured data, and run
  autonomous research agents. Replaces WebFetch for all webpage extraction tasks.
  Trigger on: any URL + "scrape/grab/fetch/pull", "search the web", "map this site",
  "extract from", "research", or any task needing live web data.
trigger_phrases:
  - scrape
  - fetch this page
  - search the web
  - map the site
  - extract from url
  - research online
  - crawl
  - web search
  - firecrawl
---

# FIRECRAWL MCP SKILL
## Space Age AI Solutions — Live Web Access Layer

Firecrawl gives Claude direct access to the live web. Handles JS-rendered SPAs,
authenticated pages, structured extraction, and autonomous multi-source research.

---

## INSTALLATION

```bash
# Install CLI + 29 skills
npx -y firecrawl-cli@latest init --all --browser

# Authenticate (run locally, not in container)
firecrawl login

# Set up MCP server
firecrawl setup mcp

# Or add manually to claude_desktop_config.json / .mcp.json:
```

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_API_KEY"
      }
    }
  }
}
```

---

## MCP TOOLS

| Tool | What It Does | When to Use |
|------|-------------|-------------|
| `firecrawl_scrape` | Extract clean markdown from one URL | Any single webpage |
| `firecrawl_batch_scrape` | Scrape multiple known URLs at once | Product pages, docs |
| `firecrawl_search` | Web search + extract full page content | Research, news, lookups |
| `firecrawl_map` | Discover all URLs on a domain | Find where content lives |
| `firecrawl_crawl` | Async multi-page crawl | Full site extraction |
| `firecrawl_extract` | LLM-powered structured extraction | Schema-defined data pull |
| `firecrawl_agent` | Autonomous multi-source research | Complex research tasks |
| `firecrawl_check_batch_status` | Poll batch job progress | After batch_scrape |
| `firecrawl_check_crawl_status` | Poll crawl job progress | After crawl |
| `firecrawl_agent_status` | Poll agent research results | After agent call |

---

## ROUTING RULES (vs other tools)

| Situation | Use |
|-----------|-----|
| Single URL content needed | `firecrawl_scrape` (not WebFetch) |
| Multiple URLs known | `firecrawl_batch_scrape` |
| Need to find a page on a site | `firecrawl_map` first, then scrape |
| Research topic / news | `firecrawl_search` |
| Extract structured data (prices, contacts) | `firecrawl_extract` with schema |
| Deep multi-source research | `firecrawl_agent` |
| JS-rendered SPA | `firecrawl_scrape` (handles it) |
| PDF / local file | `firecrawl_parse` skill instead |

**Always prefer firecrawl_scrape over WebFetch for webpage content.**

---

## USAGE PATTERNS

### Scrape a page
```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com/pricing",
    "formats": ["markdown"]
  }
}
```

### Search with full content
```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "DeepSeek V4 pricing 2026",
    "limit": 5,
    "scrapeOptions": { "formats": ["markdown"] }
  }
}
```

### Extract structured data
```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/team"],
    "prompt": "Extract all team members with name, title, email",
    "schema": {
      "type": "object",
      "properties": {
        "team": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "title": { "type": "string" },
              "email": { "type": "string" }
            }
          }
        }
      }
    }
  }
}
```

### Map a site
```json
{
  "name": "firecrawl_map",
  "arguments": {
    "url": "https://docs.example.com",
    "search": "authentication"
  }
}
```

### Autonomous research agent
```json
{
  "name": "firecrawl_agent",
  "arguments": {
    "prompt": "Research the top 5 HVAC companies in Mesquite TX — find their phone numbers, websites, and Google ratings"
  }
}
```

---

## SA PIPELINE INTEGRATION

### Lead Gen (with browserbase-scraper)
```
browserbase-scraper → Google Maps CSV
firecrawl_scrape   → Enrich each lead's website (brand tokens)
firecrawl_extract  → Pull phone, hours, services from their site
lead-to-brief      → Build enriched brief with web data
```

### Brand Extractor Enhancement
```
brand-extractor uses firecrawl_scrape instead of WebFetch
→ Handles JS-rendered sites (Shopify, Webflow, etc.)
→ Returns clean markdown for token extraction
```

### Competitor Intelligence
```
firecrawl_search   → Find competitor pricing pages
firecrawl_extract  → Extract structured pricing tiers
firecrawl_agent    → Ongoing monitoring task
```

---

## CREDIT MONITORING

Set env vars to get warnings before credits run out:
```bash
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=1000
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=100
```

---

## NEVER DO
- Never use WebFetch when a URL is the target — use firecrawl_scrape
- Never scrape `do_not_call` flagged leads' sites without consent
- Never run firecrawl_agent for tasks firecrawl_search can handle (costs more credits)
- Never hardcode FIRECRAWL_API_KEY — always use env var
- Never call firecrawl_crawl synchronously and wait — it's async, poll with check_crawl_status

---

## CLI COMMANDS

```bash
firecrawl scrape https://example.com          # Quick scrape
firecrawl search "query here"                 # Web search
firecrawl interact "click login, fill form"   # Browser interaction
firecrawl login                               # Re-authenticate
firecrawl setup mcp                           # Add to MCP config
firecrawl --help                              # All commands
```

---

## SKILL CONNECTIONS
- **browserbase-scraper** — Firecrawl handles enrichment; Browserbase handles Google Maps (geo-matched proxy)
- **brand-extractor** — use firecrawl_scrape for all client website analysis
- **lead-to-brief** — enrich leads with firecrawl_extract before building brief
- **outreach-copywriter** — firecrawl_scrape prospect site for personalization hooks
- **sa-orchestrator TIER 3** — Firecrawl MCP registered here
