---
name: firecrawl-mcp
version: 1.0.0
description: Live web access via Firecrawl MCP. Provides clean markdown extraction from any URL, site crawling, and web search. Use for research, content extraction, and real-time web data.
---

# FIRECRAWL MCP v1.0.0
## Space Age AI Solutions — Live Web Access

## When to load this skill

- Need to fetch and parse web content
- Research requiring live web data
- Competitor page analysis
- Extracting structured data from websites
- Brand extraction when URL is provided

---

## AVAILABLE OPERATIONS

```
SCRAPE (single URL):
  - Fetch any URL
  - Returns clean markdown + metadata
  - Handles JavaScript-rendered content
  - Respects robots.txt

CRAWL (entire site):
  - Crawl all pages on a domain
  - Respects crawl limits
  - Returns structured content per page
  - Useful for full site analysis

SEARCH:
  - Web search with content extraction
  - Returns top results with full content
  - Combines search + scrape in one call

MAP:
  - Returns all URLs on a domain
  - Useful for site structure analysis
  - No content — just URL discovery
```

---

## COMMON USE CASES

### Brand Extraction
```
Firecrawl scrape [brand URL]
→ Extract: colors, tone, typography, copy style
→ Feed into brand-extractor skill
```

### Competitor Research
```
Firecrawl scrape [competitor URL]
Firecrawl crawl [competitor domain] --limit 20
→ Analyze: services, pricing, messaging, differentiators
```

### Content Research
```
Firecrawl search "[topic]" --limit 10
→ Gather: current information, stats, examples
→ Feed into ai-content-creator
```

---

## INTEGRATION WITH SA PIPELINE

- `brand-extractor`: Primary fetch tool for client site analysis
- `page-upgrade`: Fetch client's current page for audit
- `sa-watch`: Supplement video analysis with article research
- `production-pipeline-orchestrator`: Qualify leads by scraping their sites
