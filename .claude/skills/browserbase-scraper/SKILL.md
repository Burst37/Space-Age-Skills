---
name: browserbase-scraper
version: 1.0
description: Cloud browser scraper for Space Age lead generation. Orchestrates Browserbase for high-volume business prospect data collection, site qualification, and data extraction at scale.
allowed-tools: Bash, Read, Write
---

# BROWSERBASE SCRAPER v1.0
## Space Age AI Solutions — Lead Gen Scraping Engine

## When to load this skill

- Running lead qualification at scale (Phase 0.5 of production pipeline)
- Bulk website analysis for prospect bucketing
- Extracting business data from multiple sites concurrently

---

## SCRAPING PIPELINE

```python
# Pseudocode for lead qualification scraper
import asyncio
from browserbase import Browserbase

async def qualify_lead(business_url):
    bb = Browserbase(api_key=os.environ["BROWSERBASE_API_KEY"])
    session = await bb.sessions.create()
    
    page = await session.page()
    await page.goto(business_url)
    
    # Check qualification criteria
    result = {
        "url": business_url,
        "has_chat_widget": await check_chat_widget(page),
        "has_schema": await check_schema_org(page),
        "has_meta_description": await check_meta(page),
        "is_mobile_responsive": await check_responsive(page),
        "has_video_hero": await check_video_hero(page),
        "load_time_ms": await measure_load_time(page)
    }
    
    # Bucket determination
    result["bucket"] = determine_bucket(result)
    
    await session.close()
    return result

# Run in parallel
async def qualify_batch(urls):
    tasks = [qualify_lead(url) for url in urls]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

---

## QUALIFICATION CHECKS

```python
async def check_chat_widget(page):
    selectors = [
        "[data-id*='chat']", "#intercom-frame",
        "[class*='drift']", "[class*='crisp']",
        "[class*='livechat']", "iframe[src*='chat']"
    ]
    for sel in selectors:
        if await page.query_selector(sel):
            return True
    return False

async def check_schema_org(page):
    schema = await page.query_selector('script[type="application/ld+json"]')
    return schema is not None

async def check_meta(page):
    meta = await page.query_selector('meta[name="description"]')
    if meta:
        content = await meta.get_attribute("content")
        return bool(content and len(content) > 50)
    return False
```

---

## OUTPUT FORMAT

```json
{
  "url": "https://business.com",
  "bucket": "A",
  "flags": ["no_ai_agent", "no_schema"],
  "load_time_ms": 2340,
  "screenshot_url": "https://storage.../screenshot.png",
  "qualified_at": "2026-05-01T12:00:00Z"
}
```

---

## WHAT TO AVOID

- Don't scrape at rates that trigger rate limiting (max 5 concurrent by default)
- Don't store raw HTML — extract and discard
- Don't run against sites with explicit scraping prohibition without review
