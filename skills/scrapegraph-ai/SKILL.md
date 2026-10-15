---
name: scrapegraph-ai
description: LLM-powered web scraping library — builds scraping pipelines as graphs (SmartScraperGraph, SearchGraph, SpeechGraph, etc.) instead of brittle CSS/XPath selectors. Use for lead enrichment, competitor site extraction, and any scrape where the target markup is unstable or unknown ahead of time.
version: 2.2.2
source: https://github.com/ScrapeGraphAI/Scrapegraph-ai
license: MIT
---

## Overview

ScrapeGraphAI is a Python scraping library built on LangChain that uses LLM + graph logic
instead of hand-written selectors. You describe what data you want in plain language; the
graph pipeline handles fetching, parsing, and structured extraction.

## Install

```bash
pip install scrapegraphai
playwright install   # only needed for JS-heavy / dynamic sites
```

## Core Pattern

```python
from scrapegraphai.graphs import SmartScraperGraph

graph_config = {
    "llm": {
        "api_key": "OPENAI_API_KEY",
        "model": "openai/gpt-4o-mini",
    },
    "verbose": True,
    "headless": True,
}

smart_scraper_graph = SmartScraperGraph(
    prompt="Extract business name, phone, address, and services offered",
    source="https://example-local-business.com",
    config=graph_config,
)

result = smart_scraper_graph.run()
```

## Graph Types (pick by task)

- `SmartScraperGraph` — single-page extraction to structured JSON
- `SearchGraph` — search the web, then extract from top results
- `SpeechGraph` — extraction + text-to-speech output
- `ScriptCreatorGraph` — generates a reusable scraping script instead of running once
- `JSONScraperGraph` / `CSVScraperGraph` / `XMLScraperGraph` — structured local sources

## Where This Fits SA Pipeline

- Lead enrichment: pull owner name, hours, services from a scraped lead's existing site
  before `lead-to-brief` builds the Build Brief
- Competitor intel: extract pricing/feature tables from competitor sites when Bright Data /
  Nimble skills aren't the better fit for a one-off structured pull
- Prefer this over raw BeautifulSoup/Selenium when target markup is inconsistent across
  the batch (common with local-business sites) — the LLM extraction step tolerates that

## Rules

- NEVER modify upstream source — route and call only
- Model routing still applies: point `llm.api_key`/`model` at DeepSeek/OpenRouter per
  standing model-routing rule, not Claude, unless a task explicitly needs Claude-quality
  extraction reasoning
- Respect target sites' robots.txt / ToS — this is an extraction tool, not a scraping-limits
  bypass

## Attribution

MIT License — ScrapeGraphAI
