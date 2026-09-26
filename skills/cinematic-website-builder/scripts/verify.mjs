#!/usr/bin/env node
/**
 * CWB verify — evidence-based QA for a single-file cinematic build (Stage 4 gate).
 *
 *   node scripts/verify.mjs <site.html> [--out qa/] [--budget-kb 900] [--skip-offline]
 *
 * Runs Chromium (Playwright) across five passes and writes qa/report.json +
 * qa/REPORT.md + screenshots. Exit code 1 if any BLOCKING check fails.
 *
 *   desktop   1440×900  fine pointer
 *   tablet    768×1024  touch
 *   mobile    390×844   touch, isMobile
 *   reduced   1440×900  prefers-reduced-motion: reduce
 *   offline   390×844   all CDN scripts blocked  → proves fail-open (content still visible)
 *
 * Blocking: JS errors, failed/4xx/5xx requests (same-origin + CDNs), horizontal overflow,
 * text stuck invisible after a full scroll-through, modules that threw (.cwb-failed),
 * missing <title>/meta description/lang/h1, invalid JSON-LD, images without alt,
 * presigned/expiring asset URLs.
 * Recorded (non-blocking unless over budget): LCP, CLS, page weight, long tasks.
 */
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, join, extname, basename } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const file = args.find((a, i) => !a.startsWith('--') && !['--out', '--budget-kb'].includes(args[i - 1]));
if (!file) { console.error('usage: verify.mjs <site.html> [--out qa/] [--budget-kb 900]'); process.exit(2); }
const outDir = resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : join(dirname(file), 'qa'));
const budgetKb = Number(args.includes('--budget-kb') ? args[args.indexOf('--budget-kb') + 1] : 900);
const skipOffline = args.includes('--skip-offline');
mkdirSync(outDir, { recursive: true });

async function loadPlaywright() {
  try { return await import('playwright'); } catch {}
  const req = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
  return req('playwright');
}
const { chromium } = await loadPlaywright();

/* ---- static server rooted at the page's directory ---- */
const root = dirname(resolve(file));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = createServer((req, res) => {
  const p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/${basename(file)}`;

/* Playwright appends <-loopback> to bypass lists, which would send the local
   server through the proxy; pass the proxy as a raw Chromium flag instead. */
const proxyArgs = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`, '--proxy-bypass-list=127.0.0.1;localhost'] : [];
/* Behind a TLS-re-terminating proxy, trust ITS CA (not "ignore all errors"):
   CWB_EXTRA_CA=/path/ca.pem pins that CA's SPKI for this browser only. */
if (process.env.CWB_EXTRA_CA) {
  const { createPublicKey, createHash } = await import('node:crypto');
  const der = createPublicKey(readFileSync(process.env.CWB_EXTRA_CA)).export({ type: 'spki', format: 'der' });
  proxyArgs.push('--ignore-certificate-errors-spki-list=' + createHash('sha256').update(der).digest('base64'));
}
const browser = await chromium.launch({ args: proxyArgs });

const PASSES = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, hasTouch: true },
  { name: 'mobile', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
  { name: 'reduced', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
  ...(skipOffline ? [] : [{ name: 'offline', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, blockCdn: true }])
];

const report = { url: file, generated: new Date().toISOString(), passes: [], static: {}, blocking: [] };
const block = (pass, msg) => report.blocking.push(`[${pass}] ${msg}`);

/* ---- static checks on the source ---- */
const html = readFileSync(file, 'utf8');
report.static.bytesKb = +(Buffer.byteLength(html) / 1024).toFixed(1);
const need = { lang: /<html[^>]*\slang="[^"]+"/, title: /<title>[^<{]{8,}<\/title>/, description: /<meta name="description" content="[^"{]{50,}"/, viewport: /name="viewport"/, h1: /<h1[\s>]/ };
for (const [k, re] of Object.entries(need)) if (!re.test(html)) block('static', `missing/placeholder ${k}`);
if ((html.match(/<h1[\s>]/g) || []).length > 1) block('static', 'more than one <h1>');
if (/X-Amz-Signature|X-Goog-Signature|[?&]Expires=\d+|[?&]token=/i.test(html)) block('static', 'presigned/expiring asset URL found — re-host under /assets/');
if (/\{\{[^}]+\}\}/.test(html)) block('static', 'unfilled {{placeholders}} remain');
for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try { JSON.parse(m[1]); } catch (e) { block('static', 'JSON-LD does not parse: ' + e.message); }
}
for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) block('static', 'img without alt: ' + m[0].slice(0, 80));

for (const pass of PASSES) {
  const ctx = await browser.newContext({ viewport: pass.viewport, hasTouch: !!pass.hasTouch, isMobile: !!pass.isMobile,
    deviceScaleFactor: pass.deviceScaleFactor || 1, reducedMotion: pass.reducedMotion || 'no-preference' });
  const page = await ctx.newPage();
  const r = { name: pass.name, errors: [], failedRequests: [], screenshots: [] };
  page.on('pageerror', (e) => r.errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !(pass.blockCdn && /ERR_FAILED|net::|GSAP not loaded/.test(m.text()))) r.errors.push('console: ' + m.text()); });
  page.on('requestfailed', (q) => { if (!pass.blockCdn) r.failedRequests.push(`${q.failure()?.errorText} ${q.url()}`); });
  page.on('response', (s) => { if (s.status() >= 400) r.failedRequests.push(`${s.status()} ${s.url()}`); });
  if (pass.blockCdn) await page.route(/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/, (route) => route.abort());

  await page.addInitScript(() => {
    window.__cwbQA = { lcp: 0, cls: 0, loadCls: 0, scrolled: false, shifters: [], longTasks: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__cwbQA.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      const q = window.__cwbQA; q.cls += e.value;
      if (!q.scrolled) { q.loadCls += e.value; for (const s of e.sources || []) if (s.node && q.shifters.length < 6) q.shifters.push((s.node.tagName || '#text') + '.' + ((s.node.className && s.node.className.baseVal === undefined && s.node.className) || '') + ' ' + e.value.toFixed(3)); }
    } }).observe({ type: 'layout-shift', buffered: true });
    try { new PerformanceObserver((l) => { window.__cwbQA.longTasks += l.getEntries().length; }).observe({ type: 'longtask', buffered: true }); } catch {}
  });

  await page.goto(url, { waitUntil: 'load' });
  /* Let the intro gate finish (if any) and entrance motion settle; offline: let the fail-open watchdog fire. */
  await page.waitForFunction(() => !document.querySelector('.gate') || !document.documentElement.classList.contains('cwb-js'), null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(pass.blockCdn ? 3400 : 1400);
  const shot = async (tag) => { const p = join(outDir, `${pass.name}-${tag}.png`); await page.screenshot({ path: p }); r.screenshots.push(basename(p)); };
  await shot('00-top');
  await page.evaluate(() => { window.__cwbQA.scrolled = true; });

  /* Scroll through in viewport steps so every trigger fires; capture 25/50/75/100%. */
  const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const stepPx = Math.round(pass.viewport.height * 0.6);
  const marks = [0.25, 0.5, 0.75, 1];
  for (let y = 0, mi = 0; y <= H + stepPx; y += stepPx) {
    await page.evaluate((v) => window.scrollTo(0, v), Math.min(y, H));
    await page.waitForTimeout(90);
    const liveH = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    while (mi < marks.length && Math.min(y, liveH) >= marks[mi] * liveH - 1) { await page.waitForTimeout(500); await shot(String(marks[mi] * 100).padStart(3, '0')); mi++; }
    if (y >= liveH) break;
  }
  await page.waitForTimeout(600);

  const probe = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflow = document.documentElement.scrollWidth - vw;
    /* elements that stick out horizontally (culprits for overflow) */
    const wide = [];
    if (overflow > 1) for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect(); if (b.right > vw + 1 && b.width > 0 && getComputedStyle(el).position !== 'fixed') wide.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
      if (wide.length > 5) break;
    }
    /* text that is laid out but invisible after a full scroll-through */
    const invisible = [];
    const isHiddenBranch = (el) => el.closest('[aria-hidden="true"], dialog:not([open]), .sr-only, [inert], template, .gate, .flip__back, .accg__body, .island__menu-inner, .tw__ghosts, .dock__tip, [hidden]');
    for (const el of document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main button')) {
      if (!el.textContent.trim() || isHiddenBranch(el)) continue;
      const b = el.getBoundingClientRect(); if (!b.width || !b.height) continue;
      let n = el, op = 1, vis = true;
      while (n && n.nodeType === 1) { const cs = getComputedStyle(n); op *= parseFloat(cs.opacity); if (cs.visibility === 'hidden') vis = false; n = n.parentElement; }
      if (op < 0.1 || !vis) invisible.push(el.tagName.toLowerCase() + ': ' + el.textContent.trim().slice(0, 40));
    }
    const res = performance.getEntriesByType('resource');
    const bytes = res.reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.encodedBodySize || 0);
    return {
      overflow, wide, invisible: invisible.slice(0, 15), invisibleCount: invisible.length,
      failedModules: [...document.querySelectorAll('.cwb-failed')].map((e) => e.getAttribute('data-cwb')),
      booted: document.documentElement.classList.contains('cwb-booted'),
      jsClass: document.documentElement.classList.contains('cwb-js'),
      instances: window.CWB ? window.CWB.instances.length : 0,
      cursorHidden: getComputedStyle(document.body).cursor === 'none',
      lcpMs: Math.round(window.__cwbQA.lcp), cls: +window.__cwbQA.loadCls.toFixed(3), scrollCls: +window.__cwbQA.cls.toFixed(3), shifters: window.__cwbQA.shifters, longTasks: window.__cwbQA.longTasks,
      transferKb: Math.round(bytes / 1024)
    };
  });
  Object.assign(r, probe);

  if (r.errors.length) block(pass.name, `${r.errors.length} JS error(s): ${r.errors[0]}`);
  if (r.failedRequests.length) block(pass.name, `${r.failedRequests.length} failed request(s): ${r.failedRequests[0]}`);
  if (r.overflow > 1) block(pass.name, `horizontal overflow ${r.overflow}px (${r.wide.join(', ')})`);
  if (r.invisibleCount) block(pass.name, `${r.invisibleCount} text element(s) stuck invisible: ${r.invisible.slice(0, 3).join(' | ')}`);
  if (r.failedModules.length) block(pass.name, `module(s) threw: ${r.failedModules.join(', ')}`);
  if (pass.blockCdn && r.jsClass) block(pass.name, 'fail-open broken: cwb-js still set with CDN blocked');
  if (!pass.blockCdn && !r.booted) block(pass.name, 'runtime never booted');
  if ((pass.hasTouch || pass.reducedMotion) && r.cursorHidden) block(pass.name, 'native cursor hidden on touch/reduced-motion');
  /* Load-phase CLS is the blocking number. Scroll-phase CLS is recorded: pin spacers and
     scripted scrolling inflate it in a headless run, so it is evidence, not a verdict. */
  if (r.cls > 0.1) block(pass.name, `load CLS ${r.cls} > 0.1 (${r.shifters.join(', ')})`);
  report.passes.push(r);
  await ctx.close();
}

await browser.close();
server.close();

const d = report.passes.find((p) => p.name === 'desktop');
if (d && d.transferKb > budgetKb) report.blocking.push(`[desktop] transfer ${d.transferKb}KB > budget ${budgetKb}KB`);
report.pass = report.blocking.length === 0;
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const md = [
  `# CWB QA — ${basename(file)}`, '', `Generated ${report.generated} · **${report.pass ? 'PASS' : 'FAIL'}**`, '',
  '| pass | JS errors | failed req | overflow | invisible | LCP ms | load CLS | scroll CLS | long tasks | KB |', '|---|---|---|---|---|---|---|---|---|---|',
  ...report.passes.map((p) => `| ${p.name} | ${p.errors.length} | ${p.failedRequests.length} | ${p.overflow}px | ${p.invisibleCount} | ${p.lcpMs} | ${p.cls} | ${p.scrollCls} | ${p.longTasks} | ${p.transferKb} |`),
  '', report.blocking.length ? '## Blocking\n' + report.blocking.map((b) => `- ${b}`).join('\n') : '## Blocking\nNone.', '',
  '## Screenshots', ...report.passes.map((p) => `- ${p.name}: ${p.screenshots.join(', ')}`), '',
  '_LCP/CLS here come from a local headless run — they prove regressions, not field performance. Quote real-device numbers for client claims._'
].join('\n');
writeFileSync(join(outDir, 'REPORT.md'), md);
console.log(md);
process.exit(report.pass ? 0 : 1);
