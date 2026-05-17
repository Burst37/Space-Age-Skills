---
name: browserbase-scraper
display_name: "SPACE AGE — Browserbase Cloud Scraper"
version: "1.0"
last_updated: "2026-05"
source: "browserbase.com — Browser API + Stagehand SDK + Fetch API + Search API"
description: >
  Cloud browser scraper for Space Age AI Solutions lead generation pipeline.
  Replaces local Playwright with Browserbase-hosted sessions: stealth mode,
  residential proxies geo-matched to target city, CAPTCHA solving, verified
  fingerprints, and Stagehand natural-language selectors that self-heal on
  UI changes. Scrapes Google Maps (primary) with Yelp + Yellow Pages fallback.
  Outputs qualified leads CSV ready for lead-to-brief ingestion. Supports
  parallel sessions for 80+ leads/day throughput. Live session key pre-loaded.
  TRIGGER on: any request to scrape Google Maps, find local business leads,
  run the lead generation scraper, or source qualified businesses by category
  and city.
---

# Browserbase Cloud Scraper
**Maintained by:** Space Age AI Solutions | **Version:** 1.0 | **Platform:** Browserbase

---

## ROLE

You are the **lead generation scraper** for Space Age AI Solutions.

You run cloud browser sessions on Browserbase — no local browser, no IP bans, no
CAPTCHA failures. You scrape Google Maps for local businesses by category and city,
enrich each result, apply quality scoring, deduplicate, and output a qualified leads
CSV that feeds directly into the `lead-to-brief` skill.

Every session uses stealth fingerprints, residential proxies geo-matched to the
target city, and Stagehand natural-language selectors that self-heal when Google
changes its UI. You run parallel sessions for scale. You never scrape from localhost.

---

## WHEN TO USE THIS SKILL

- Pipeline Step 0 — generate the qualified leads CSV that starts everything
- Any request to find local businesses by category + city
- Replacing or debugging the local Playwright scraper
- Running batch scrapes across multiple cities simultaneously
- Enriching an existing leads list with website, phone, rating, review count
- Validating that a scraped lead meets the quality threshold before handing to lead-to-brief

---

## ENVIRONMENT SETUP

```bash
# Install dependencies
npm install browserbase playwright @browserbasehq/stagehand

# Or with Bun (faster)
bun add browserbase playwright @browserbasehq/stagehand

# Python alternative
pip install browserbase playwright
```

### Required Environment Variables

```bash
# Browserbase credentials — set in Claude Code / VPS environment
export BROWSERBASE_API_KEY="bb_live_8jAsnudKvYpjVctGAiijaVENlek"
export BROWSERBASE_PROJECT_ID=""   # inferred from API key if left blank

# Optional — override per-session
export BB_REGION="us-west-2"       # us-west-2 | us-east-1 | eu-central-1 | ap-southeast-1
export BB_TIMEOUT="1800"           # seconds (30 min default for Maps scraping)
```

---

## PLATFORM OVERVIEW

| Layer | What It Does | Cost Model |
|---|---|---|
| **Browser API** | Creates + controls cloud Chromium sessions | Per session-minute |
| **Stagehand SDK** | NL selectors (`act`, `extract`, `observe`) | Tokens (LLM calls) |
| **Fetch API** | Retrieve page content as clean markdown via proxy | Per request |
| **Search API** | Token-efficient web search for enrichment | Per query |
| **Model Gateway** | 100+ LLM providers via single endpoint | Per token |
| **Session Debugger** | Live view, video recording, CDP event timeline | Included |

---

## AUTHENTICATION — LIVE SESSION KEY

The live session key `bb_live_8jAsnudKvYpjVctGAiijaVENlek` is pre-authorized.
Use it directly — no OAuth flow needed.

```javascript
// Node.js — Browserbase SDK
import Browserbase from 'browserbase';
const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });
```

```python
# Python — Browserbase SDK
from browserbase import Browserbase
bb = Browserbase(api_key=os.environ["BROWSERBASE_API_KEY"])
```

```bash
# Direct API — cURL
curl -X POST https://api.browserbase.com/v1/sessions \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## SESSION CONFIGURATION — SCRAPER STANDARD

Use this configuration for all Google Maps scraping sessions:

```javascript
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID,
  browserSettings: {
    viewport: { width: 1440, height: 900 },
    solveCaptchas: true,          // auto-solve reCAPTCHA / hCaptcha
    blockAds: true,               // reduce page weight
    stealth: true,                // rotate fingerprint, spoof WebGL/Canvas
    operatingSystem: 'WINDOWS',   // blend in with Maps traffic
  },
  proxies: [{
    type: 'browserbase',          // managed residential proxy
    geolocation: {
      country: 'US',
      state: TARGET_STATE,        // e.g. 'Texas' — match to target city
      city: TARGET_CITY,          // e.g. 'Dallas' — geo-match is critical
    },
  }],
  region: 'us-west-2',
  timeout: 1800,                  // 30 min — enough for 50-result Maps pagination
  keepAlive: true,                // survive disconnections; reuse across scrapes
  userMetadata: {
    category: BUSINESS_CATEGORY,  // 'plumber', 'hvac', 'electrician'
    city: TARGET_CITY,
    run_id: RUN_ID,               // ISO timestamp batch ID
    pipeline: 'space-age-lead-gen',
  },
});

console.log('Session ID:', session.id);
console.log('Debug URL:', `https://browserbase.com/sessions/${session.id}`);
console.log('Connect URL:', session.connectUrl);
```

---

## PLAYWRIGHT CONNECTION

```javascript
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP(session.connectUrl);
const context = browser.contexts()[0];  // always use default context
const page = context.pages()[0];

// CRITICAL: connect within 5 minutes of session creation
// keepAlive: true prevents timeout on disconnection
```

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(session.connect_url)
    context = browser.contexts[0]
    page = context.pages[0]
```

---

## STAGEHAND — NATURAL LANGUAGE SELECTORS

Stagehand wraps Playwright with AI-powered selectors that self-heal when Google
changes the Maps UI. Use it for any element that breaks on CSS selector updates.

```javascript
import { Stagehand } from '@browserbasehq/stagehand';

const stagehand = new Stagehand({
  env: 'BROWSERBASE',
  apiKey: process.env.BROWSERBASE_API_KEY,
  projectId: process.env.BROWSERBASE_PROJECT_ID,
  modelName: 'claude-sonnet-4-6',   // Claude for NL extraction
  verbose: 1,
});

await stagehand.init();
const page = stagehand.page;
```

### Stagehand Core Methods

| Method | Use Case | Example |
|---|---|---|
| `page.act()` | Click, scroll, type — NL action | `await page.act('click the first search result')` |
| `page.extract()` | Pull structured data from page | `await page.extract({ instruction: 'list all business names and phone numbers', schema: z.object({...}) })` |
| `page.observe()` | Find elements without acting | `await page.observe('the load more results button')` |

```javascript
// Extract all business listings from current Maps view
const listings = await page.extract({
  instruction: 'extract all visible business listings with their name, address, phone number, rating, review count, and website URL',
  schema: z.object({
    businesses: z.array(z.object({
      name: z.string(),
      address: z.string(),
      phone: z.string().optional(),
      rating: z.number().optional(),
      review_count: z.number().optional(),
      website: z.string().optional(),
      category: z.string().optional(),
    }))
  })
});
```

---

## PRIMARY SCRAPER — GOOGLE MAPS

### Full Scraper Script (Node.js)

```javascript
import Browserbase from 'browserbase';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });

async function scrapeGoogleMaps({ category, city, state, maxResults = 80 }) {
  const runId = new Date().toISOString().replace(/[:.]/g, '-');

  // 1. Create session with geo-matched proxy
  const session = await bb.sessions.create({
    browserSettings: {
      viewport: { width: 1440, height: 900 },
      solveCaptchas: true,
      blockAds: true,
      stealth: true,
      operatingSystem: 'WINDOWS',
    },
    proxies: [{
      type: 'browserbase',
      geolocation: { country: 'US', state, city },
    }],
    timeout: 1800,
    keepAlive: true,
    userMetadata: { category, city, state, run_id: runId, pipeline: 'space-age' },
  });

  console.log(`Session: https://browserbase.com/sessions/${session.id}`);

  // 2. Connect Playwright
  const browser = await chromium.connectOverCDP(session.connectUrl);
  const context = browser.contexts()[0];
  const page = context.pages()[0];

  const leads = [];
  let pageNum = 0;

  try {
    // 3. Navigate to Maps search
    const query = encodeURIComponent(`${category} near ${city}, ${state}`);
    await page.goto(`https://www.google.com/maps/search/${query}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForTimeout(2000); // let Maps fully render

    while (leads.length < maxResults) {
      pageNum++;
      console.log(`  Page ${pageNum} — scraped ${leads.length} so far`);

      // 4. Scrape all visible result cards
      const results = await page.$$eval(
        '[data-result-index]',
        (cards) => cards.map((card) => ({
          name:          card.querySelector('[class*="fontHeadlineSmall"]')?.textContent?.trim() ?? '',
          rating:        parseFloat(card.querySelector('[class*="MW4etd"]')?.textContent) || null,
          review_count:  parseInt(card.querySelector('[class*="UY7F9"]')?.textContent?.replace(/[^0-9]/g, '')) || 0,
          address:       card.querySelector('[class*="W4Efsd"]:last-child [class*="W4Efsd"]')?.textContent?.trim() ?? '',
          category_tag:  card.querySelector('[class*="W4Efsd"]:first-child [class*="W4Efsd"]')?.textContent?.trim() ?? '',
          has_website:   !!card.querySelector('[data-value="Website"]'),
          phone:         card.querySelector('[data-item-id^="phone:"]')?.getAttribute('data-item-id')?.replace('phone:', '') ?? '',
        }))
      );

      // 5. Enrich: click each card for website + phone detail
      const enriched = await enrichListings(page, results);
      leads.push(...enriched);

      // 6. Paginate — scroll results panel or click Next
      const scrollPanel = page.locator('[role="feed"]').first();
      const prevCount = leads.length;
      await scrollPanel.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await page.waitForTimeout(2500);

      const newCount = await page.$$eval('[data-result-index]', (c) => c.length);
      if (newCount === prevCount || leads.length >= maxResults) break;
    }
  } finally {
    await browser.close();
  }

  return leads;
}

async function enrichListings(page, listings) {
  const enriched = [];
  for (const listing of listings) {
    try {
      // Click the card to open detail panel
      await page.click(`[aria-label="${listing.name.replace(/"/g, '')}"]`, { timeout: 3000 });
      await page.waitForTimeout(1200);

      // Pull website URL from detail panel
      const website = await page.$eval(
        '[data-item-id^="authority"] [class*="Io6YTe"]',
        (el) => el.textContent?.trim()
      ).catch(() => '');

      // Pull phone from detail panel
      const phone = await page.$eval(
        '[data-item-id^="phone:"] [class*="Io6YTe"]',
        (el) => el.textContent?.trim()
      ).catch(() => listing.phone);

      enriched.push({ ...listing, website, phone });
    } catch {
      enriched.push(listing);
    }
  }
  return enriched;
}
```

---

## QUALITY SCORING — LEAD QUALIFICATION GATE

Every scraped result passes through a quality gate before being written to CSV.
Leads that don't meet the threshold are logged but excluded from output.

```javascript
function scoreLead(lead) {
  let score = 0;

  // Positive signals
  if (lead.phone && lead.phone.length >= 10)  score += 2;  // has phone
  if (lead.website)                           score += 2;  // has website to redesign
  if (lead.rating >= 3.5)                     score += 1;  // decent reputation
  if (lead.rating >= 4.0)                     score += 1;  // strong reputation
  if (lead.review_count >= 10)                score += 1;  // established business
  if (lead.review_count >= 50)                score += 1;  // high-volume
  if (lead.address)                           score += 1;  // has physical address

  // Negative signals (disqualify)
  const isChain = /\b(McDonald|Subway|Walmart|Home Depot|Lowe|Starbucks|7-Eleven|Shell|BP|Exxon)\b/i.test(lead.name);
  if (isChain) return 0;                      // never pitch chains

  const isFranchise = lead.review_count > 500 && lead.rating > 4.5;
  if (isFranchise) score -= 3;               // likely corporate

  return score;
}

const QUALITY_THRESHOLD = 4; // minimum score to include in CSV

function filterLeads(leads) {
  return leads
    .map((lead) => ({ ...lead, quality_score: scoreLead(lead) }))
    .filter((lead) => lead.quality_score >= QUALITY_THRESHOLD)
    .sort((a, b) => b.quality_score - a.quality_score);
}
```

---

## DEDUPLICATION

```javascript
import { createHash } from 'crypto';

function dedupe(leads) {
  const seen = new Set();
  return leads.filter((lead) => {
    // Fingerprint: normalized name + city
    const key = createHash('md5')
      .update(`${lead.name.toLowerCase().replace(/\s+/g, '')}:${lead.address.toLowerCase().slice(0, 20)}`)
      .digest('hex');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

---

## OUTPUT FORMAT — CSV FOR LEAD-TO-BRIEF

The output CSV matches exactly what `lead-to-brief` expects as input.

```javascript
const csvWriter = createObjectCsvWriter({
  path: `leads_${city}_${category}_${Date.now()}.csv`,
  header: [
    { id: 'name',          title: 'business_name' },
    { id: 'category',      title: 'category' },
    { id: 'address',       title: 'address' },
    { id: 'city',          title: 'city' },
    { id: 'state',         title: 'state' },
    { id: 'phone',         title: 'phone' },
    { id: 'website',       title: 'existing_website' },
    { id: 'rating',        title: 'google_rating' },
    { id: 'review_count',  title: 'review_count' },
    { id: 'quality_score', title: 'quality_score' },
    { id: 'session_id',    title: 'bb_session_id' },
    { id: 'scraped_at',    title: 'scraped_at' },
  ],
});

await csvWriter.writeRecords(qualifiedLeads);
console.log(`✓ ${qualifiedLeads.length} qualified leads → ${csvPath}`);
```

### CSV Column Reference

| Column | Source | Used By |
|---|---|---|
| `business_name` | Google Maps listing | lead-to-brief |
| `category` | Input parameter | lead-to-brief, Hermes routing |
| `address` | Maps detail panel | lead-to-brief, NAP |
| `city` / `state` | Input parameter | lead-to-brief, proxy geo |
| `phone` | Maps detail panel | outreach-copywriter, vapi-orchestrator |
| `existing_website` | Maps detail panel | cinematic-website-builder (audit) |
| `google_rating` | Maps card | quality gate, outreach angle |
| `review_count` | Maps card | quality gate, social proof copy |
| `quality_score` | Computed | Hermes lane routing |
| `bb_session_id` | Browserbase session | debugging, replay |
| `scraped_at` | ISO timestamp | dedup, freshness check |

---

## BATCH — PARALLEL SESSIONS

Run multiple city+category combos simultaneously. Each gets its own isolated
Browserbase session with geo-matched proxy.

```javascript
async function batchScrape(jobs) {
  // jobs = [{ category: 'plumber', city: 'Dallas', state: 'TX' }, ...]

  const results = await Promise.allSettled(
    jobs.map((job) =>
      scrapeGoogleMaps({
        category: job.category,
        city: job.city,
        state: job.state,
        maxResults: 80,
      })
    )
  );

  const allLeads = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  return dedupe(filterLeads(allLeads));
}

// Example: 4 parallel scrapes across 2 cities × 2 categories
const JOBS = [
  { category: 'plumber',     city: 'Dallas',  state: 'TX' },
  { category: 'hvac',        city: 'Dallas',  state: 'TX' },
  { category: 'electrician', city: 'Houston', state: 'TX' },
  { category: 'roofing',     city: 'Houston', state: 'TX' },
];

const leads = await batchScrape(JOBS);
console.log(`Total qualified leads: ${leads.length}`);
```

> **Concurrency limit:** Browserbase plan determines max simultaneous sessions.
> Developer plan = up to 3 concurrent. Scale plan = unlimited.

---

## FALLBACK SOURCES

When Google Maps rate-limits or returns < 20 results, fall back in order:

### Fallback 1 — Browserbase Fetch API (Yelp)

```javascript
async function scrapeYelp({ category, city, state }) {
  const url = `https://www.yelp.com/search?find_desc=${encodeURIComponent(category)}&find_loc=${encodeURIComponent(`${city}, ${state}`)}`;

  const response = await fetch('https://api.browserbase.com/v1/fetch', {
    method: 'POST',
    headers: {
      'X-BB-API-Key': process.env.BROWSERBASE_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, format: 'markdown' }),
  });

  const { content } = await response.json();
  // content = clean markdown of Yelp results page
  // parse with LLM via Model Gateway
  return parseYelpMarkdown(content);
}
```

### Fallback 2 — Browserbase Search API

```javascript
async function searchLeads({ category, city, state }) {
  const response = await fetch('https://api.browserbase.com/v1/search', {
    method: 'POST',
    headers: {
      'X-BB-API-Key': process.env.BROWSERBASE_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `${category} ${city} ${state} phone address reviews`,
      num_results: 20,
    }),
  });

  const { results } = await response.json();
  return results.map((r) => ({
    name:    r.title,
    website: r.url,
    snippet: r.snippet,
    // enrich further with individual Fetch calls
  }));
}
```

### Fallback 3 — Yellow Pages (Playwright)

```javascript
async function scrapeYellowPages({ category, city, state }) {
  const session = await bb.sessions.create({
    browserSettings: { solveCaptchas: true, stealth: true },
    proxies: [{ type: 'browserbase', geolocation: { country: 'US', state, city } }],
    timeout: 900,
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const page = browser.contexts()[0].pages()[0];

  const slug = category.replace(/\s+/g, '-').toLowerCase();
  const loc  = `${city}-${state}`.replace(/\s+/g, '-').toLowerCase();
  await page.goto(`https://www.yellowpages.com/search?search_terms=${slug}&geo_location_terms=${loc}`);

  const listings = await page.$$eval('.result [class*="info"]', (cards) =>
    cards.map((c) => ({
      name:    c.querySelector('.business-name span')?.textContent?.trim() ?? '',
      phone:   c.querySelector('.phones')?.textContent?.trim() ?? '',
      address: c.querySelector('.street-address')?.textContent?.trim() ?? '',
      website: c.querySelector('.track-visit-website')?.getAttribute('href') ?? '',
    }))
  );

  await browser.close();
  return listings;
}
```

---

## FALLBACK ORCHESTRATION

```javascript
async function getLeads({ category, city, state, maxResults = 80 }) {
  let leads = [];

  // 1. Try Google Maps (primary)
  try {
    leads = await scrapeGoogleMaps({ category, city, state, maxResults });
    console.log(`Google Maps: ${leads.length} raw results`);
  } catch (err) {
    console.warn('Maps failed:', err.message);
  }

  // 2. If under threshold, supplement with Yelp
  if (leads.length < 20) {
    console.log('Falling back to Yelp...');
    const yelp = await scrapeYelp({ category, city, state });
    leads = dedupe([...leads, ...yelp]);
  }

  // 3. Still thin? Hit Yellow Pages
  if (leads.length < 20) {
    console.log('Falling back to Yellow Pages...');
    const yp = await scrapeYellowPages({ category, city, state });
    leads = dedupe([...leads, ...yp]);
  }

  // 4. Quality gate + sort
  const qualified = filterLeads(leads);
  console.log(`Qualified leads: ${qualified.length} / ${leads.length} raw`);
  return qualified;
}
```

---

## SESSION DEBUGGER

Every session generates a live view and video recording automatically.

```javascript
// After session creation:
console.log(`Live view: https://browserbase.com/sessions/${session.id}`);

// Retrieve recording URL after session ends:
const recording = await fetch(
  `https://api.browserbase.com/v1/sessions/${session.id}/recording`,
  { headers: { 'X-BB-API-Key': process.env.BROWSERBASE_API_KEY } }
).then((r) => r.json());

console.log('Replay:', recording.url);
```

**Session Inspector shows:**
- Real-time browser view (watch the scrape live)
- CDP events timeline — every page load, network request
- Console logs from the page
- Network request/response capture
- Stagehand tab — token usage, NL extraction results
- HAR export for offline network analysis

**When to check the debugger:**
- Scrape returns 0 results (visual confirms if blocked)
- Quality score is unexpectedly low (confirm data extraction)
- CAPTCHA triggered (watch auto-solve in real time)
- Maps UI changed and CSS selectors broke (switch to Stagehand)

---

## PROXY — GEOLOCATION MATCHING

Always match the proxy city to the target city. This is critical:
Google Maps personalizes results by detected location. A Dallas proxy
for a Dallas plumber search returns the correct local pack.

```javascript
// Correct — proxy city matches search city
proxies: [{ type: 'browserbase', geolocation: { country: 'US', state: 'Texas', city: 'Dallas' } }]

// Wrong — datacenter proxy returns national results, not local pack
proxies: false
```

**Supported geolocation:** 201 countries, all US states, major cities.
Fields are case-insensitive: `'texas'` = `'Texas'` = `'TEXAS'`.

**Proxy bandwidth:** 1 MB minimum per session. A full 80-result Maps
scrape with enrichment uses ~15–40 MB.

---

## CAPTCHA HANDLING

Browserbase solves CAPTCHAs automatically. No action needed — just wait.

```javascript
// Listen for CAPTCHA solve events
page.on('console', (msg) => {
  if (msg.text().includes('browserbase-solving-started')) {
    console.log('CAPTCHA detected — auto-solving (up to 30s)...');
  }
  if (msg.text().includes('browserbase-solving-finished')) {
    console.log('CAPTCHA solved — resuming.');
  }
});
```

> Solving takes up to 30 seconds. Build in a `waitForTimeout(35000)` buffer
> after any action that typically triggers CAPTCHA (first Maps search, location
> confirmation dialogs).

---

## STAGEHAND — SELF-HEALING PATTERNS

Use Stagehand selectors for any element that has broken in the past or
is likely to break when Google updates Maps.

```javascript
// Instead of brittle CSS:
await page.click('[class*="fontHeadlineSmall"][role="button"]');

// Use NL — survives UI updates:
await page.act('click the first business listing in the search results');

// Scroll to load more
await page.act('scroll down in the left results panel to load more businesses');

// Handle modal / cookie dialogs
await page.act('if there is a cookie consent or location permission dialog, dismiss it');

// Pagination
await page.act('click the next page of results if a next button is visible');
```

---

## PIPELINE INTEGRATION

```
browserbase-scraper
        ↓ outputs: leads_{city}_{category}.csv
lead-to-brief
        ↓ outputs: build_brief.json per row
cinematic-website-builder + local-business-seo
        ↓
cinematic-prompt-director → SA-higgsfield-operator
        ↓
Hermes → Lane A/B/C/D
        ↓
outreach-copywriter → vapi-orchestrator
        ↓
GitHub → Vercel Deploy
```

### Hermes Lane Signal

The `quality_score` field in the CSV maps directly to Hermes lane routing:

| quality_score | Hermes Decision |
|---|---|
| ≥ 8 | Lane C — premium ($750+ close) |
| 5–7 | Lane B — standard ($300–500) |
| 4 | Lane A — high volume / budget |
| < 4 | Excluded from CSV |

---

## FULL PIPELINE INVOCATION

```bash
# Run full lead gen for a city+category
node scraper.js \
  --category "plumber" \
  --city "Dallas" \
  --state "TX" \
  --max-results 80 \
  --output ./leads/

# Batch — 4 parallel sessions
node scraper.js --batch \
  --jobs '[{"category":"plumber","city":"Dallas","state":"TX"},{"category":"hvac","city":"Houston","state":"TX"}]' \
  --output ./leads/

# Pass output directly to lead-to-brief
node scraper.js --category plumber --city Dallas --state TX | \
  node lead-to-brief.js --stdin
```

---

## CATEGORIES — HIGH-VALUE TARGETS

Ordered by avg deal size and website redesign urgency:

```
Tier 1 — $500–750 close potential
  plumber, hvac, electrician, roofing, garage door repair,
  water damage restoration, foundation repair

Tier 2 — $300–500 close potential
  landscaping, lawn care, pressure washing, painting (interior/exterior),
  pest control, junk removal, handyman, fence installation

Tier 3 — Volume / Lane A
  cleaning service, carpet cleaning, gutter cleaning, window cleaning,
  tree service, pool service, auto detailing, locksmith
```

---

## RETRY & ERROR HANDLING

```javascript
async function scrapeWithRetry(job, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await scrapeGoogleMaps(job);
    } catch (err) {
      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, err.message);
      if (attempt === maxRetries) throw err;
      // Exponential backoff
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      // New session on retry — previous may be blocked
    }
  }
}
```

| Error | Cause | Fix |
|---|---|---|
| `connect ECONNREFUSED` | Session expired before connect | Reconnect within 5 min of creation |
| `0 results returned` | IP blocked / CAPTCHA not solved | Check debugger live view; enable `solveCaptchas: true` |
| `Proxy authentication failed` | Invalid proxy config | Verify plan includes proxies (Developer+) |
| `Session timeout` | Scrape exceeded `timeout` value | Increase timeout or reduce `maxResults` per session |
| `Rate limit 429` | Too many sessions | Add 1–2s delay between session creations |
| `No element found` | Google Maps UI updated | Switch that selector to Stagehand NL |

---

## NEVER DO

```
❌ Never run Playwright locally — always use Browserbase cloud sessions
❌ Never set proxies: false for Google Maps — geo-match is mandatory
❌ Never scrape without solveCaptchas: true — Maps triggers CAPTCHA on fresh IPs
❌ Never use a datacenter proxy for Maps — residential only
❌ Never wait more than 5 minutes to connect after session.create()
❌ Never pitch chain businesses (McDonald's, Walmart) — filter in quality gate
❌ Never output leads with quality_score < 4 — wastes the rest of the pipeline
❌ Never skip deduplication in batch mode — same business appears in Yelp + Maps
❌ Never hardcode BROWSERBASE_API_KEY in source — read from environment
❌ Never run more concurrent sessions than your plan allows — queue instead
```

---

## QUICK REFERENCE — ONE-LINERS

```bash
# Create a session (cURL)
curl -X POST https://api.browserbase.com/v1/sessions \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"browserSettings":{"solveCaptchas":true,"stealth":true},"proxies":[{"type":"browserbase"}],"timeout":1800}'

# List active sessions
curl https://api.browserbase.com/v1/sessions \
  -H "X-BB-API-Key: $BROWSERBASE_API_KEY" | jq '.[] | {id, status, region}'

# Get session debug URL
echo "https://browserbase.com/sessions/$SESSION_ID"

# Quick scrape — plumbers in Dallas
node scraper.js --category plumber --city Dallas --state TX --max-results 40
```
