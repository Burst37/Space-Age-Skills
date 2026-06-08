---
name: browserbase-fetch
description: Browserbase Fetch API for no-browser URL retrieval. Use when you need to fetch URLs with proper headers, cookies, and JavaScript rendering but don't need full browser interaction.
allowed-tools: Bash
---

# BROWSERBASE FETCH
## Space Age AI Solutions — Headless URL Fetching

## When to load this skill

- Need to fetch URLs that block curl/wget
- Require JavaScript-rendered HTML
- Need proper browser headers without interaction
- Faster than full browser launch

---

## FETCH API BASICS

```bash
# Simple fetch
curl -X POST https://api.browserbase.com/v1/fetch \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# With custom headers
curl -X POST https://api.browserbase.com/v1/fetch \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "headers": {"Accept-Language": "en-US"},
    "waitFor": "networkidle"
  }'
```

---

## USE CASES

- Brand extraction (fetch brand's website for analysis)
- Lead qualification (fetch business sites without full browser)
- Competitor research (fetch competitor pages)
- SEO analysis (get rendered HTML for schema extraction)

---

## WHEN TO USE FETCH vs BROWSER

| Use Fetch | Use Browser |
|-----------|-------------|
| Read-only page scraping | Need to click/interact |
| JavaScript-rendered content | Login required |
| Bulk URL processing | Multi-step workflow |
| Simple data extraction | Screenshot needed |
