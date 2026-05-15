/**
 * Space Age — Google Maps Lead Scraper
 * Target: Local businesses with weak/no websites
 * Output: output/leads_YYYY-MM-DD.csv (feeds directly into lead-to-brief)
 *
 * Usage:
 *   node scraper.js                          # default niches, Mesquite TX
 *   node scraper.js --city "Garland TX"      # custom city
 *   node scraper.js --niche "roofing"        # single niche
 *   node scraper.js --max 50                 # max leads per niche
 */

const { chromium } = require('playwright');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

// ── Config ──────────────────────────────────────────────────────────────────

const args = parseArgs(process.argv.slice(2));

const CITY     = args.city   || 'Mesquite TX';
const MAX_LEADS = parseInt(args.max || '40');
const HEADLESS  = args.headless !== 'false';

const NICHES = args.niche
  ? [args.niche]
  : [
      'HVAC company',
      'roofing contractor',
      'plumbing company',
      'fence company',
      'tree service',
      'auto detailing',
      'landscaping company',
      'concrete contractor',
    ];

// Minimum quality gates — skip businesses below these thresholds
const MIN_REVIEWS = 5;
const MIN_RATING  = 3.5;

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  const dateStr = new Date().toISOString().split('T')[0];
  const outFile = path.join(__dirname, 'output', `leads_${dateStr}.csv`);

  const csvWriter = createObjectCsvWriter({
    path: outFile,
    header: [
      { id: 'name',         title: 'Business Name' },
      { id: 'niche',        title: 'Niche' },
      { id: 'rating',       title: 'Rating' },
      { id: 'reviews',      title: 'Review Count' },
      { id: 'address',      title: 'Address' },
      { id: 'phone',        title: 'Phone' },
      { id: 'website',      title: 'Website' },
      { id: 'website_flag', title: 'Has Website' },
      { id: 'maps_url',     title: 'Google Maps URL' },
      { id: 'city',         title: 'City' },
      { id: 'scraped_at',   title: 'Scraped At' },
    ],
  });

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
  });

  const allLeads = [];
  let totalScraped = 0;

  for (const niche of NICHES) {
    console.log(`\n── Scraping: ${niche} in ${CITY} ──`);
    const leads = await scrapeNiche(context, niche, CITY, MAX_LEADS);
    allLeads.push(...leads);
    totalScraped += leads.length;
    console.log(`   ✓ ${leads.length} qualified leads`);
    await sleep(2000 + Math.random() * 1500);
  }

  await browser.close();

  if (allLeads.length === 0) {
    console.log('\n⚠  No leads found. Try running with --headless false to debug.');
    process.exit(1);
  }

  // Sort: no-website first (hottest leads), then by review count desc
  allLeads.sort((a, b) => {
    if (a.website_flag !== b.website_flag) return a.website_flag === 'NO' ? -1 : 1;
    return parseInt(b.reviews) - parseInt(a.reviews);
  });

  await csvWriter.writeRecords(allLeads);

  console.log(`\n✅  Done. ${allLeads.length} total leads → ${outFile}`);
  console.log(`   No-website leads: ${allLeads.filter(l => l.website_flag === 'NO').length}`);
  console.log(`   Has-website leads: ${allLeads.filter(l => l.website_flag === 'YES').length}`);
  console.log('\n   Next step: feed CSV into lead-to-brief skill');
})();

// ── Scraper ───────────────────────────────────────────────────────────────────

async function scrapeNiche(context, niche, city, maxLeads) {
  const page = await context.newPage();
  const leads = [];

  try {
    const searchQuery = encodeURIComponent(`${niche} in ${city}`);
    await page.goto(`https://www.google.com/maps/search/${searchQuery}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await sleep(2000);

    // Accept cookies if prompted
    const cookieBtn = page.locator('button:has-text("Accept all"), button:has-text("I agree")');
    if (await cookieBtn.count() > 0) {
      await cookieBtn.first().click();
      await sleep(1000);
    }

    // Scroll the results sidebar to load more listings
    const resultsPanel = page.locator('[role="feed"]').first();
    const scrollRounds = Math.ceil(maxLeads / 7);

    for (let i = 0; i < scrollRounds; i++) {
      await resultsPanel.evaluate(el => el.scrollBy(0, 1200));
      await sleep(1500 + Math.random() * 800);

      // Check for "end of list" signal
      const endText = await page.locator('text=reached the end').count();
      if (endText > 0) break;
    }

    // Collect all listing elements
    const listings = await page.locator('[role="feed"] > div').all();
    console.log(`   Found ${listings.length} raw listings`);

    for (const listing of listings) {
      if (leads.length >= maxLeads) break;

      try {
        const lead = await extractListing(listing, niche, city);
        if (!lead) continue;

        // Quality gate
        if (parseFloat(lead.rating) < MIN_RATING) continue;
        if (parseInt(lead.reviews) < MIN_REVIEWS) continue;

        // Dedup by name+phone
        const isDup = leads.some(
          l => l.name === lead.name || (l.phone && l.phone === lead.phone)
        );
        if (isDup) continue;

        leads.push(lead);
      } catch {
        // individual listing parse failure — skip silently
      }
    }
  } catch (err) {
    console.error(`   Error scraping ${niche}: ${err.message}`);
  } finally {
    await page.close();
  }

  return leads;
}

async function extractListing(listing, niche, city) {
  const nameEl = listing.locator('[class*="fontHeadlineSmall"], .qBF1Pd').first();
  const name = await nameEl.textContent().catch(() => null);
  if (!name || name.trim().length < 2) return null;

  const ratingEl = listing.locator('[role="img"][aria-label*="star"]').first();
  const ratingLabel = await ratingEl.getAttribute('aria-label').catch(() => '');
  const ratingMatch = ratingLabel.match(/(\d+\.?\d*)\s*star/i);
  const rating = ratingMatch ? ratingMatch[1] : '0';

  const reviewsEl = listing.locator('text=/\\(\\d+\\)/').first();
  const reviewsText = await reviewsEl.textContent().catch(() => '(0)');
  const reviews = (reviewsText.match(/\d+/) || ['0'])[0];

  const addressEl = listing.locator('[class*="W4Efsd"] > span').nth(1);
  const address = await addressEl.textContent().catch(() => '');

  const phoneEl = listing.locator('text=/\\(\\d{3}\\)\\s*\\d{3}-\\d{4}/').first();
  const phone = await phoneEl.textContent().catch(() => '');

  // Check for website link in listing card
  const websiteLink = listing.locator('a[data-value="Website"]').first();
  const hasWebsite = (await websiteLink.count()) > 0;
  let websiteHref = '';
  if (hasWebsite) {
    websiteHref = await websiteLink.getAttribute('href').catch(() => '');
  }

  // Get maps URL
  const cardLink = listing.locator('a[href*="/maps/place"]').first();
  const mapsUrl = await cardLink.getAttribute('href').catch(() => '');

  return {
    name: name.trim(),
    niche,
    rating,
    reviews,
    address: address.trim(),
    phone: phone.trim(),
    website: websiteHref || '',
    website_flag: hasWebsite ? 'YES' : 'NO',
    maps_url: mapsUrl ? `https://www.google.com${mapsUrl}` : '',
    city,
    scraped_at: new Date().toISOString(),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      result[key] = argv[i + 1] || true;
      i++;
    }
  }
  return result;
}
