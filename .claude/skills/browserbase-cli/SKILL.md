---
name: browserbase-cli
description: Browserbase CLI (bb) for Functions and Browserbase platform API. Use to deploy serverless browser functions, manage sessions, and access Browserbase cloud infrastructure.
allowed-tools: Bash
---

# BROWSERBASE CLI
## Space Age AI Solutions — Browserbase Platform Access

## When to load this skill

- Deploying browser automation as serverless functions
- Managing Browserbase sessions at scale
- Running parallel browser tasks in cloud
- Production scraping infrastructure (not one-off)

---

## BB CLI BASICS

```bash
# Install
npm install -g @browserbase/cli

# Authenticate
bb login

# Create a new Function
bb functions create my-scraper

# Deploy Function
bb functions deploy my-scraper

# List Functions
bb functions list

# Invoke Function
bb functions invoke my-scraper --input '{"url": "https://example.com"}'

# View logs
bb functions logs my-scraper
```

---

## FUNCTION TEMPLATE

```javascript
// scraper.js
import Browserbase from '@browserbase/sdk';

export default async function handler(input) {
  const bb = new Browserbase();
  const session = await bb.sessions.create();
  
  const { url } = input;
  // ... browser automation logic ...
  
  await session.close();
  return { result: 'data' };
}
```

---

## PRODUCTION PIPELINE USE CASE

For high-volume lead qualification (Phase 0.5):
1. Deploy scraper Function to Browserbase
2. Invoke for each lead URL in parallel
3. Collect results via webhook/polling
4. Update Google Sheet with qualification flags

This scales to hundreds of concurrent scrapes without VPS load.
