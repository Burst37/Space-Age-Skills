#!/usr/bin/env node
/**
 * Behavioral browser forensics — the deterministic evidence layer.
 *
 *   node tools/forensics.mjs <url> <out-dir> [--motion] [--viewports 1440,768,390]
 *
 * Produces, under <out-dir>/:
 *   page.html                full rendered DOM
 *   technologies.json        framework/library/3rd-party detection (evidence-tagged)
 *   css-forensics.json       computed design tokens scraped from the live page
 *   network-resources.json   every request (fonts, scripts, media, xhr)
 *   runtime-errors.json      console errors + failed requests
 *   motion-map.json          (with --motion) scroll-sampled transform/opacity timeline
 *   screenshots/<vw>.png     full-page screenshot per viewport
 *
 * Everything written here is `observed` evidence. Anything you cannot observe
 * (e.g. easing curve, scrub ratio) you record elsewhere as `inferred`.
 *
 * Requires Playwright. If unavailable, doctor() in fusion.mjs reports it missing
 * and you route around it (user screen-recording or source code instead).
 */
import fs from 'node:fs';
import path from 'node:path';

const [url, outDir] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const motion = process.argv.includes('--motion');
const vpArg = (() => { const i = process.argv.indexOf('--viewports'); return i !== -1 ? process.argv[i + 1] : '1440,768,390'; })();
const viewports = vpArg.split(',').map((w) => ({ width: +w, height: w >= 1024 ? 900 : w >= 700 ? 1024 : 844 }));

if (!url || !outDir) { console.error('usage: forensics.mjs <url> <out-dir> [--motion] [--viewports 1440,768,390]'); process.exit(2); }

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Playwright not installed. Mark `interactive browser` capability MISSING and use a screen recording or source code as the motion-evidence source instead.'); process.exit(1); }

fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });
const write = (name, data) => fs.writeFileSync(path.join(outDir, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');

// If the installed `playwright` package's expected browser revision doesn't match
// what's actually on disk (common when browsers were pre-provisioned separately
// from npm install), fall back to an explicit executable path via
// PLAYWRIGHT_CHROMIUM_PATH instead of crashing with an unhandled launch error.
// Chromium does not inherit HTTPS_PROXY/https_proxy from the environment the way
// Node's own fetch/undici does — it must be told explicitly, or outbound requests
// fail closed in any sandboxed/proxied environment (ERR_CONNECTION_CLOSED etc.)
// even though `node -e "fetch(...)"` would succeed.
const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
const launchOpts = proxyServer ? { proxy: { server: proxyServer } } : {};

let browser;
try {
  browser = await chromium.launch(launchOpts);
} catch (e) {
  const fallback = process.env.PLAYWRIGHT_CHROMIUM_PATH;
  if (fallback && fs.existsSync(fallback)) {
    browser = await chromium.launch({ ...launchOpts, executablePath: fallback });
  } else {
    console.error(`Chromium launch failed: ${e.message.split('\n')[0]}`);
    console.error('Mark `interactive browser` capability MISSING, or set PLAYWRIGHT_CHROMIUM_PATH to a working Chromium binary, then retry.');
    process.exit(1);
  }
}
const ctx = await browser.newContext({ viewport: viewports[0] });
const page = await ctx.newPage();

const network = [];
const errors = [];
page.on('requestfinished', async (r) => {
  const resp = await r.response();
  network.push({ url: r.url(), method: r.method(), type: r.resourceType(), status: resp ? resp.status() : null });
});
page.on('requestfailed', (r) => errors.push({ kind: 'requestfailed', url: r.url(), error: r.failure()?.errorText }));
page.on('console', (m) => { if (m.type() === 'error') errors.push({ kind: 'console', text: m.text() }); });
page.on('pageerror', (e) => errors.push({ kind: 'pageerror', text: String(e) }));

const nav = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => { errors.push({ kind: 'navigation', text: String(e) }); return null; });

// Fail loudly instead of writing a Chromium error-interstitial to page.html and
// reporting success. A failed/absent response (or non-2xx/3xx status) means there
// is no real evidence to capture — this must not exit 0 or print a checkmark.
if (!nav || !nav.ok()) {
  await browser.close();
  write('runtime-errors.json', { source: url, evidence: 'observed', count: errors.length, errors });
  console.error(`✗ navigation failed for ${url} (status: ${nav ? nav.status() : 'no response'}) — no evidence captured.`);
  console.error('Mark this source `blocked` for static/behavioral capture. Do not treat runtime-errors.json as a successful run.');
  process.exit(1);
}
await page.waitForTimeout(300); // let any trailing same-page navigation/redirect settle before reading state

// --- rendered DOM (page.content() can race a late navigation; retry once)
async function contentSafe() {
  try { return await page.content(); }
  catch (e) {
    errors.push({ kind: 'content-race', text: String(e) });
    await page.waitForTimeout(500);
    return page.content();
  }
}
write('page.html', await contentSafe());

// --- technology detection (observed evidence only)
const tech = await page.evaluate(() => {
  const has = (sel) => !!document.querySelector(sel);
  const scripts = [...document.scripts].map((s) => s.src).filter(Boolean);
  const find = (re) => scripts.filter((s) => re.test(s));
  return {
    framework: {
      next: has('#__next') || has('script#__NEXT_DATA__'),
      nuxt: has('#__nuxt'),
      react: !!(window.React || document.querySelector('[data-reactroot]')) || find(/react/i).length > 0,
      vue: !!window.__VUE__ || find(/vue/i).length > 0,
      svelte: find(/svelte/i).length > 0,
      astro: has('astro-island'),
      webflow: has('html.w-mod-js') || find(/webflow/i).length > 0,
      wordpress: find(/wp-content|wp-includes/i).length > 0,
    },
    motionLibs: {
      gsap: !!window.gsap || find(/gsap|TweenMax|ScrollTrigger/i).length > 0,
      scrollTrigger: !!(window.ScrollTrigger || window.gsap?.ScrollTrigger),
      lenis: !!window.Lenis || find(/lenis|studio-freight/i).length > 0,
      locomotive: find(/locomotive/i).length > 0,
      framerMotion: find(/framer-motion|motion/i).length > 0,
      three: !!window.THREE || find(/three(\.min)?\.js/i).length > 0,
      swiper: !!window.Swiper || find(/swiper/i).length > 0,
      barba: !!window.barba || find(/barba/i).length > 0,
    },
    fonts: [...new Set([...document.fonts].map((f) => f.family))],
    scriptSrcs: scripts,
  };
});
write('technologies.json', { source: url, evidence: 'observed', captured_at: new Date().toISOString(), ...tech });

// --- computed design tokens (observed)
const css = await page.evaluate(() => {
  const sample = (sels) => sels.map((s) => document.querySelector(s)).filter(Boolean);
  const cs = (el) => getComputedStyle(el);
  const body = cs(document.body);
  const colors = new Set(), bgs = new Set(), sizes = new Set(), families = new Set(), weights = new Set(), radii = new Set();
  for (const el of document.querySelectorAll('body *')) {
    const s = cs(el);
    if (s.color) colors.add(s.color);
    if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs.add(s.backgroundColor);
    sizes.add(s.fontSize); families.add(s.fontFamily); weights.add(s.fontWeight);
    if (s.borderRadius && s.borderRadius !== '0px') radii.add(s.borderRadius);
  }
  const headings = sample(['h1', 'h2', 'h3']).map((el) => ({ tag: el.tagName, size: cs(el).fontSize, weight: cs(el).fontWeight, lineHeight: cs(el).lineHeight, letterSpacing: cs(el).letterSpacing }));
  return {
    base: { fontFamily: body.fontFamily, fontSize: body.fontSize, lineHeight: body.lineHeight, color: body.color, background: body.backgroundColor },
    colors: [...colors].slice(0, 40), backgrounds: [...bgs].slice(0, 40),
    fontSizes: [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b)),
    fontFamilies: [...families], fontWeights: [...weights].sort(), radii: [...radii], headings,
  };
});
write('css-forensics.json', { source: url, evidence: 'observed', ...css });

// --- motion sampling
if (motion) {
  const targetsExpr = `[...document.querySelectorAll('section, [data-scroll], .reveal, h1, h2, img, video, [class*="anim"]')].slice(0, 30)`;
  const samples = [];
  const steps = 12;
  const scrollH = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((scrollH * i) / steps);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(220);
    const frame = await page.evaluate((expr) => {
      // eslint-disable-next-line no-eval
      const els = eval(expr);
      return els.map((el, idx) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return { idx, tag: el.tagName, cls: el.className?.toString().slice(0, 40), opacity: s.opacity, transform: s.transform, clipPath: s.clipPath, top: Math.round(r.top) };
      });
    }, targetsExpr);
    samples.push({ scrollY: y, elements: frame });
  }
  // collapse to per-element timelines where opacity/transform actually changed
  const timelines = {};
  for (const f of samples) for (const e of f.elements) {
    const key = `${e.tag}.${e.cls}#${e.idx}`;
    (timelines[key] ||= []).push({ scrollY: f.scrollY, opacity: e.opacity, transform: e.transform, clipPath: e.clipPath });
  }
  const animated = Object.fromEntries(Object.entries(timelines).filter(([, t]) => {
    const u = new Set(t.map((x) => x.opacity + '|' + x.transform + '|' + x.clipPath));
    return u.size > 1;
  }));
  write('motion-map.json', { source: url, evidence: 'observed', note: 'Scroll-sampled. Easing/scrub ratios are NOT observable here — record those as inferred in references/motion.md schema.', scrollHeight: scrollH, animatedElements: animated });
}

// --- screenshots per viewport
for (const vp of viewports) {
  await page.setViewportSize(vp);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'screenshots', `${vp.width}.png`), fullPage: true });
}

write('network-resources.json', { source: url, evidence: 'observed', count: network.length, resources: network });
write('runtime-errors.json', { source: url, evidence: 'observed', count: errors.length, errors });

await browser.close();
console.log(`✓ forensics captured for ${url} → ${outDir}/ (${network.length} requests, ${errors.length} errors${motion ? ', motion sampled' : ''})`);
