#!/usr/bin/env node
/**
 * CWB verify v3.3 — evidence-based QA gate for single-file AND multi-page builds, local or live.
 *
 *   node scripts/verify.mjs <page.html|URL> [more pages…] [options]
 *
 * Targets: local files (served from --root, default = the first file's folder) or http(s) URLs
 * (live preview / production). Several targets = a multi-page build; the first is the primary.
 *
 * Options
 *   --out qa/                 report folder (default: <first file dir>/qa or ./qa for URLs)
 *   --root DIR                static server root for local multi-page builds (dist/, out/)
 *   --budget-kb 900           FIRST-LOAD desktop transfer budget (tier budget, see playbook §10)
 *   --logo-kb 100             max transfer of the header logo image
 *   --money "/services/,/x"   path fragments of money pages that also get aeo-check (home always does)
 *   --letters FILE            handoff/type/ai-letters.yaml — every <img data-ai-word> must be pass/confirmed by letter-check.mjs
 *   --type FILE               handoff/type/type-pick.yaml — only declared families/weights may load; headings must render in them
 *   --motion-plan FILE        handoff/motion-plan.yaml — fail if a planned library/module/effect is absent
 *   --sections DIR            handoff/sections/*.png — screenshot-diff each section vs the approved PNG
 *   --diff-threshold 0.12     max mismatch ratio per section (pixelmatch, per-pixel threshold 0.1)
 *   --max-playing N           block if more than N videos play at once (default: 1 when the motion plan
 *                             uses video-per-section, else recorded only)
 *   --all-passes              run every pass on every page (default: full set on the primary page,
 *                             desktop + mobile + wide on the others)
 *   --skip-offline --skip-aeo --skip-axe --skip-wide   (gallery / fixtures only)
 *   --aeo-url URL --aeo-skill PATH
 *
 * Passes: desktop 1440×900 · tablet 768×1024 touch · mobile 390×844 touch · reduced (RM) ·
 *         offline (CDNs blocked → fail-open) · wide-1920 · wide-2560.
 *
 * Blocking: JS errors · failed/4xx/5xx requests · horizontal overflow · text stuck invisible after a
 * scroll-through (collapsed accordions, inert, closed dialogs, Radix data-state=closed excluded) ·
 * modules that threw · runtime not booted (ONLY when the page uses the CWB kernel) · fail-open broken ·
 * missing title/description/lang/H1, >1 H1, invalid JSON-LD, img without alt, presigned URLs,
 * {{placeholders}} · favicon / apple-touch-icon / theme-color missing · axe serious|critical ·
 * text wider than 2400px on wide screens · first-load transfer over budget · logo over cap ·
 * motion plan not honoured · section diff over threshold · SEO/AEO hard gates on home + money pages.
 */
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { dirname, resolve, join, extname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { loadDep, readYaml } from './lib/util.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const VALUE_FLAGS = new Set(['--letters', '--type', '--out', '--budget-kb', '--aeo-url', '--aeo-skill', '--root', '--money', '--motion-plan', '--sections', '--diff-threshold', '--logo-kb', '--max-playing']);
const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const has = (f) => args.includes(f);
const targets = args.filter((a, i) => !a.startsWith('--') && !VALUE_FLAGS.has(args[i - 1]));
if (!targets.length) { console.error('usage: verify.mjs <page.html|URL> [more…] [--out qa/] [--root dir] [--budget-kb 900] [--money a,b] [--motion-plan f] [--sections dir] [--skip-offline] [--skip-aeo] [--skip-axe] [--skip-wide]'); process.exit(2); }
const isUrl = (t) => /^https?:\/\//i.test(t);
const firstLocal = targets.find((t) => !isUrl(t));
const outDir = resolve(opt('--out', firstLocal ? join(dirname(firstLocal), 'qa') : 'qa'));
const budgetKb = Number(opt('--budget-kb', 900));
const logoKb = Number(opt('--logo-kb', 100));
const diffThreshold = Number(opt('--diff-threshold', 0.12));
const skipOffline = has('--skip-offline'), skipAeo = has('--skip-aeo'), skipAxe = has('--skip-axe'), skipWide = has('--skip-wide');
const allPasses = has('--all-passes');
const moneyFrags = String(opt('--money', '/services/,/service-,/practice-areas/,/treatments/')).split(',').map((s) => s.trim()).filter(Boolean);
const aeoUrlOverride = opt('--aeo-url', null), aeoSkillFlag = opt('--aeo-skill', null);
mkdirSync(outDir, { recursive: true });

/* ---------- motion plan ---------- */
const planPath = opt('--motion-plan', null);
const plan = planPath ? await readYaml(planPath) : null;
const planSections = (plan && Array.isArray(plan.sections)) ? plan.sections : [];
const planLibs = (plan && plan.libraries) || {};
const videoPerSection = !!(plan && (plan.style === 'video-per-section' || planSections.some((s) => s && (s.video === true || /video-per-section|video-chapters/.test(String(s.module || s.effect || ''))))));
const maxPlaying = has('--max-playing') ? Number(opt('--max-playing')) : (videoPerSection ? 1 : null);

/* ---------- type pick ---------- */
const typePath = opt('--type', null);
const typePick = typePath ? await readYaml(typePath) : null;
const typeDecl = typePick ? {
  families: (typePick.declared_families || []).map((f) => String(f).toLowerCase()),
  weights: Object.fromEntries(Object.entries(typePick.declared_weights || {}).map(([k, v]) => [String(k).toLowerCase(), (Array.isArray(v) ? v : String(v).split(/[ ,]+/)).map(String)]))
} : null;

const lettersPath = opt('--letters', null);
const letters = lettersPath ? ((await readYaml(lettersPath)).letters || []) : null;

/* ---------- deps ---------- */
const pw = await loadDep('playwright');
if (!pw || !pw.chromium) { console.error('verify: Playwright not found. npm i -D playwright && npx playwright install chromium (or set CWB_NODE_MODULES)'); process.exit(2); }
const { chromium } = pw;
let axeSource = null;
if (!skipAxe) {
  for (const root of [process.env.CWB_NODE_MODULES, join(process.cwd(), 'node_modules')].filter(Boolean)) {
    const p = join(root, 'axe-core', 'axe.min.js'); if (existsSync(p)) { axeSource = readFileSync(p, 'utf8'); break; }
  }
  if (!axeSource) { const axe = await loadDep('axe-core'); if (axe && axe.source) axeSource = axe.source; }
}
const PNG = (await loadDep('pngjs'))?.PNG || null;
let pixelmatch = await loadDep('pixelmatch');
if (pixelmatch && typeof pixelmatch !== 'function') pixelmatch = pixelmatch.default || null;

function findAeoCheck() {
  const envDir = process.env.SEO_AEO_SKILL || process.env.CWB_SEO_AEO;
  return [aeoSkillFlag && join(aeoSkillFlag, 'scripts', 'aeo-check.py'), envDir && join(envDir, 'scripts', 'aeo-check.py'),
    join(HERE, '..', '..', 'seo-aeo-optimizer', 'scripts', 'aeo-check.py'), '/home/box/agent-data/workflows/seo-aeo-optimizer/scripts/aeo-check.py']
    .filter(Boolean).find((p) => existsSync(p)) || null;
}
const ENTITY = /^(Organization|LocalBusiness|WebSite|Person|Plumber|Dentist|Attorney|HVACBusiness|Electrician|RoofingContractor|MedicalBusiness|DaySpa|LegalService|Store|HomeAndConstructionBusiness)$/;
const RETRIEVAL_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'Googlebot', 'Bingbot'];
function aeoHardFails(data) {
  const fails = [];
  if (!data) return ['aeo-check produced no JSON'];
  if ((data.js_visibility || {}).empty_shell_warning) fails.push('content missing from raw HTML');
  const types = (data.schema && data.schema.types) || [];
  if (!types.some((t) => ENTITY.test(t) || /Business$/.test(t))) fails.push('no Organization/LocalBusiness JSON-LD');
  if (!((data.answer_structure && data.answer_structure.h1) || []).length) fails.push('no H1 in raw HTML');
  const rules = (data.robots && data.robots.rules) || {};
  for (const b of RETRIEVAL_BOTS) if (String(rules[b] || '').startsWith('BLOCKED')) fails.push(`${b} blocked in robots.txt`);
  return fails;
}
/* Built-in fallback (v3.5) so the gate runs on any harness: the same four blocking checks from the raw
   HTML + robots.txt, in aeo-check's JSON shape. shortcut: no /60 score or answer-capsule grading; install
   seo-aeo-optimizer (SEO_AEO_SKILL) for the full audit on client builds. */
async function builtinAeo(url) {
  const get = async (u) => { try { const r = await fetch(u); return r.ok ? await r.text() : ''; } catch { return ''; } };
  const html = await get(url), robots = await get(new URL('/robots.txt', url).href);
  const text = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const types = [];
  const walk = (n) => { if (Array.isArray(n)) n.forEach(walk); else if (n && typeof n === 'object') { [].concat(n['@type'] || []).forEach((t) => types.push(String(t))); Object.values(n).forEach(walk); } };
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) { try { walk(JSON.parse(m[1])); } catch {} }
  const groups = []; let cur = null, lastUA = false;
  for (const line of robots.split(/\r?\n/)) {
    const m = /^\s*(user-agent|disallow|allow)\s*:\s*([^#]*)/i.exec(line); if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2].trim();
    if (k === 'user-agent') { if (!lastUA) groups.push(cur = { agents: [], dis: [], allow: [] }); cur.agents.push(v.toLowerCase()); lastUA = true; }
    else if (cur) { (k === 'disallow' ? cur.dis : cur.allow).push(v); lastUA = false; }
  }
  const rules = {};
  for (const b of RETRIEVAL_BOTS) {
    const g = groups.find((x) => x.agents.includes(b.toLowerCase())) || groups.find((x) => x.agents.includes('*'));
    if (g && g.dis.includes('/') && !g.allow.includes('/')) rules[b] = 'BLOCKED';
  }
  return { js_visibility: { empty_shell_warning: text.length < 200 }, schema: { types }, answer_structure: { h1: html.match(/<h1[\s>][\s\S]*?<\/h1>/gi) || [] },
    robots: { rules }, flags: ['built-in AEO check (seo-aeo-optimizer not installed): blocking checks only, no score'] };
}
function runAeoCheck(script, target, jsonPath) {
  /* async spawn: spawnSync would block the in-process preview server */
  return new Promise((res) => {
    const env = { ...process.env, NO_PROXY: '127.0.0.1,localhost,::1', no_proxy: '127.0.0.1,localhost,::1' };
    const child = spawn('python3', [script, target, '--json', jsonPath, '--no-render'], { env });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => { stdout += d; }); child.stderr.on('data', (d) => { stderr += d; });
    const timer = setTimeout(() => child.kill('SIGKILL'), 90000);
    child.on('error', (error) => { clearTimeout(timer); res({ status: 1, stdout, stderr, error }); });
    child.on('close', (status) => { clearTimeout(timer); res({ status, stdout, stderr, error: null }); });
  });
}

/* ---------- static server (local targets) ---------- */
const root = resolve(opt('--root', firstLocal ? dirname(firstLocal) : '.'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };
let server = null, base = null;
if (firstLocal) {
  server = createServer((req, res) => {
    let p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p) && existsSync(p + '.html')) p += '.html';
    if (!p.startsWith(root) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    const buf = readFileSync(p), type = TYPES[extname(p)] || 'application/octet-stream';
    const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
    if (range && /^video\//.test(type)) {
      const start = range[1] ? Number(range[1]) : 0, end = range[2] ? Number(range[2]) : buf.length - 1;
      res.writeHead(206, { 'content-type': type, 'content-range': `bytes ${start}-${end}/${buf.length}`, 'accept-ranges': 'bytes', 'content-length': end - start + 1 });
      return res.end(buf.subarray(start, end + 1));
    }
    res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes' });
    res.end(buf);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
}
const pages = targets.map((t, i) => {
  if (isUrl(t)) return { target: t, url: t, path: new URL(t).pathname, html: null, primary: i === 0 };
  const abs = resolve(t);
  const rel = relative(root, abs).split(sep).join('/');
  if (rel.startsWith('..')) { console.error(`verify: ${t} is outside --root ${root}`); process.exit(2); }
  return { target: t, url: `${base}/${rel}`, path: '/' + rel.replace(/(^|\/)index\.html$/, '$1'), html: readFileSync(abs, 'utf8'), primary: i === 0 };
});
const slug = (p) => (p.path.replace(/\.html$/, '').replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '_') || 'home');

const proxyArgs = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`, '--proxy-bypass-list=127.0.0.1;localhost'] : [];
if (process.env.CWB_EXTRA_CA) {
  const { createPublicKey, createHash } = await import('node:crypto');
  const der = createPublicKey(readFileSync(process.env.CWB_EXTRA_CA)).export({ type: 'spki', format: 'der' });
  proxyArgs.push('--ignore-certificate-errors-spki-list=' + createHash('sha256').update(der).digest('base64'));
}
const browser = await chromium.launch({ args: [...proxyArgs, '--autoplay-policy=no-user-gesture-required'] });

const ALL = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, motion: true },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, hasTouch: true },
  { name: 'mobile', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
  { name: 'reduced', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
  { name: 'offline', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, blockCdn: true },
  { name: 'wide-1920', viewport: { width: 1920, height: 1080 }, wide: true },
  { name: 'wide-2560', viewport: { width: 2560, height: 1440 }, wide: true },
  /* only for pages with jumbo / custom-type moments: the 320px floor */
  { name: 'narrow-320', viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true, narrow: true }
];
const passesFor = (pg) => ALL.filter((p) => {
  if (p.blockCdn && skipOffline) return false;
  if (p.wide && skipWide) return false;
  if (p.narrow) return !!pg.hasJumbo;
  if (pg.primary || allPasses) return true;
  if (pg.hasJumbo && p.name === 'wide-2560') return true;
  return ['desktop', 'mobile', 'wide-1920'].includes(p.name);
});

const report = { generated: new Date().toISOString(), targets, pages: [], aeo: [], motion: null, diff: [], blocking: [], warnings: [] };
const block = (where, msg) => report.blocking.push(`[${where}] ${msg}`);
const warn = (where, msg) => report.warnings.push(`[${where}] ${msg}`);

/* ---------- static checks ---------- */
async function getHtml(pg) {
  if (pg.html != null) return pg.html;
  try { const r = await fetch(pg.url, { redirect: 'follow' }); pg.headers = Object.fromEntries(r.headers); pg.html = await r.text(); } catch (e) { pg.html = ''; block(slug(pg), 'could not fetch HTML: ' + e.message); }
  return pg.html;
}
function staticChecks(pg, html) {
  const w = 'static:' + slug(pg);
  const need = { lang: /<html[^>]*\slang="[^"]+"/, title: /<title[^>]*>[^<{]{8,}<\/title>/, description: /<meta[^>]+name="description"[^>]+content="[^"{]{50,}"|<meta[^>]+content="[^"{]{50,}"[^>]+name="description"/, viewport: /name="viewport"/, h1: /<h1[\s>]/ };
  for (const [k, re] of Object.entries(need)) if (!re.test(html)) block(w, `missing/placeholder ${k}`);
  const markup = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  if ((markup.match(/<h1[\s>]/g) || []).length > 1) block(w, 'more than one <h1>');
  if (/X-Amz-Signature|X-Goog-Signature|[?&]Expires=\d+|[?&]token=/i.test(html)) block(w, 'presigned/expiring asset URL found — re-host under /assets/');
  if (/\{\{[^}]+\}\}/.test(html)) block(w, 'unfilled {{placeholders}} remain');
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch (e) { block(w, 'JSON-LD does not parse: ' + e.message); } }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) block(w, 'img without alt: ' + m[0].slice(0, 80));
  if (!/<meta[^>]+name="theme-color"/.test(html)) block(w, 'no <meta name="theme-color">');
  if (!/<link[^>]+rel="apple-touch-icon"/.test(html)) block(w, 'no <link rel="apple-touch-icon">');
  /* AI-rendered words: must be spell-checked (letter-check.mjs) before they ship */
  for (const m of html.matchAll(/<img\b[^>]*\bdata-ai-word="([^"]*)"[^>]*>/g)) {
    const src = (m[0].match(/\bsrc="([^"]+)"/) || [])[1] || '';
    if (!letters) { block(w, `AI lettering ${src} ("${m[1]}") not spell-checked — run letter-check.mjs and pass --letters handoff/type/ai-letters.yaml`); continue; }
    const e = letters.find((x) => src.endsWith(String(x.file).replace(/^(\.\.?\/)+/, '')) || basename(String(x.file)) === basename(src));
    if (!e) block(w, `AI lettering ${src} missing from ${lettersPath}`);
    else if (!['pass', 'confirmed'].includes(e.status)) block(w, `AI lettering ${src} is "${e.status || 'unchecked'}" in letter-check — regenerate or confirm`);
    else if (String(e.word).toUpperCase().replace(/[^A-Z0-9]/g, '') !== m[1].toUpperCase().replace(/[^A-Z0-9]/g, '')) block(w, `AI lettering ${src}: data-ai-word "${m[1]}" ≠ checked word "${e.word}"`);
  }
  pg.hasJumbo = /class="[^"]*\bt-jumbo\b|\sdata-jumbo\b|\sdata-ctype=/.test(html);
  /* authored CSS (not the inlined runtime): hard-coded px padding outside tokens */
  const authored = [...html.matchAll(/<style(?![^>]*data-cwb-runtime)[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const pxPads = [...authored.matchAll(/([^{}]+)\{[^}]*?\b(padding(?:-block|-inline|-top|-bottom|-left|-right)?)\s*:\s*([^;}]*\b(?:[2-9]\d|\d{3,})px[^;}]*)/g)].map((m) => `${m[1].trim().slice(-40)} { ${m[2]}: ${m[3].trim()} }`);
  if (pxPads.length) warn(w, `${pxPads.length} hard-coded px padding(s) ≥20px outside the spacing tokens (use --space-* / --section-y / --gutter): ${pxPads.slice(0, 3).join(' · ')}`);
  pg.declaredIcon = (html.match(/<link[^>]+rel="(?:shortcut )?icon"[^>]*href="([^"]+)"|<link[^>]+href="([^"]+)"[^>]*rel="(?:shortcut )?icon"/) || []).slice(1).find(Boolean) || null;
}

/* ---------- AEO ---------- */
const isMoney = (pg) => pg.primary || /^\/?(index\.html)?$/.test(pg.path) || moneyFrags.some((f) => pg.path.includes(f));
async function aeoFor(pg) {
  const entry = { page: pg.path, url: aeoUrlOverride && pg.primary ? aeoUrlOverride : pg.url, score: null, hard_fails: [], flags: [] };
  const script = findAeoCheck();
  if (!script) { /* owner skill not installed on this harness: built-in blocking checks, no score */
    const data = await builtinAeo(entry.url);
    entry.flags = data.flags; entry.hard_fails = aeoHardFails(data);
  } else {
    const jsonPath = join(outDir, `aeo-${slug(pg)}.json`);
    const ran = await runAeoCheck(script, entry.url, jsonPath);
    let data = null; if (existsSync(jsonPath)) { try { data = JSON.parse(readFileSync(jsonPath, 'utf8')); } catch {} }
    entry.score = data ? data.automated_score_of_60 : null;
    entry.flags = (data && data.flags) || [];
    entry.hard_fails = aeoHardFails(data);
    if (ran.error) entry.hard_fails.push('aeo-check failed to start: ' + ran.error.message);
    else if (ran.status && !data) entry.hard_fails.push('aeo-check exited ' + ran.status);
    const ans = data && data.answer_structure;
    if (ans && /\/services?\//.test(pg.path) && Number(ans.question_headings || ans.question_h2 || 0) === 0) entry.flags.push('money page has no question-shaped H2/H3');
  }
  for (const f of entry.hard_fails) block('aeo:' + pg.path, f);
  report.aeo.push(entry);
}

/* ---------- in-page probes ---------- */
const INIT = () => {
  window.__cwbQA = { lcp: 0, cls: 0, loadCls: 0, scrolled: false, shifters: [], longTasks: 0, maxPlaying: 0, everPlayed: 0 };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__cwbQA.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) {
    if (e.hadRecentInput) continue; const q = window.__cwbQA; q.cls += e.value;
    if (!q.scrolled) { q.loadCls += e.value; for (const s of e.sources || []) if (s.node && q.shifters.length < 6) q.shifters.push((s.node.tagName || '#text') + '.' + ((s.node.className && s.node.className.baseVal === undefined && s.node.className) || '') + ' ' + e.value.toFixed(3)); }
  } }).observe({ type: 'layout-shift', buffered: true });
  try { new PerformanceObserver((l) => { window.__cwbQA.longTasks += l.getEntries().length; }).observe({ type: 'longtask', buffered: true }); } catch {}
  const played = new Set();
  document.addEventListener('playing', (e) => { played.add(e.target); window.__cwbQA.everPlayed = played.size; }, true);
};
const countPlaying = () => [...document.querySelectorAll('video')].filter((v) => !v.paused && !v.ended && v.readyState > 2).length;
const bytesNow = () => performance.getEntriesByType('resource').reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.encodedBodySize || 0);

const PROBE = () => {
  const vw = document.documentElement.clientWidth;
  const overflow = document.documentElement.scrollWidth - vw;
  const wide = [];
  if (overflow > 1) for (const el of document.querySelectorAll('body *')) {
    const b = el.getBoundingClientRect(); if (b.right > vw + 1 && b.width > 0 && getComputedStyle(el).position !== 'fixed') wide.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
    if (wide.length > 5) break;
  }
  /* Collapsed / intentionally hidden branches are not "stuck invisible". */
  const HIDDEN = '[aria-hidden="true"], dialog:not([open]), details:not([open]) > :not(summary), .sr-only, .visually-hidden, [inert], template, .gate, .flip__back, .accg__body, .island__menu-inner, .tw__ghosts, .dock__tip, [hidden], [data-state="closed"], [role="tabpanel"]:not(.is-active)[aria-hidden], .expand__caption:not(.is-on)';
  const collapsedRegions = new Set();
  for (const b of document.querySelectorAll('[aria-expanded="false"][aria-controls]')) for (const id of b.getAttribute('aria-controls').split(/\s+/)) { const r = document.getElementById(id); if (r) collapsedRegions.add(r); }
  const clipped = (el) => { for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n); if ((cs.overflow === 'hidden' || cs.overflow === 'clip') && n.getBoundingClientRect().height < 2) return true; } return false; };
  const invisible = [];
  for (const el of document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main button')) {
    if (!el.textContent.trim() || el.closest(HIDDEN)) continue;
    if ([...collapsedRegions].some((r) => r.contains(el))) continue;
    const b = el.getBoundingClientRect(); if (!b.width || !b.height || clipped(el)) continue;
    let n = el, op = 1, vis = true;
    while (n && n.nodeType === 1) { const cs = getComputedStyle(n); op *= parseFloat(cs.opacity); if (cs.visibility === 'hidden') vis = false; n = n.parentElement; }
    if (op < 0.1 || !vis) invisible.push(el.tagName.toLowerCase() + ': ' + el.textContent.trim().slice(0, 40));
  }
  let widestText = 0, widestTag = '';
  /* measure the rendered TEXT extent, not the box (a centred full-bleed caption box is fine) */
  for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main li')) { const rg = document.createRange(); rg.selectNodeContents(el); const w = rg.getBoundingClientRect().width; if (w > widestText) { widestText = Math.round(w); widestTag = el.tagName.toLowerCase() + ': ' + el.textContent.trim().slice(0, 30); } }
  const usesKernel = !!document.querySelector('[data-cwb]') || !!window.CWB;
  return {
    overflow, wide, invisible: invisible.slice(0, 15), invisibleCount: invisible.length,
    failedModules: [...document.querySelectorAll('.cwb-failed')].map((e) => e.getAttribute('data-cwb')),
    usesKernel, booted: document.documentElement.classList.contains('cwb-booted'), jsClass: document.documentElement.classList.contains('cwb-js'),
    cursorHidden: getComputedStyle(document.body).cursor === 'none',
    lcpMs: Math.round(window.__cwbQA.lcp), cls: +window.__cwbQA.loadCls.toFixed(3), scrollCls: +window.__cwbQA.cls.toFixed(3), shifters: window.__cwbQA.shifters, longTasks: window.__cwbQA.longTasks,
    widestText, widestTag, everPlayed: window.__cwbQA.everPlayed
  };
};

/* Spacing, tap targets, jumbo / custom-type moments, type + body contrast. */
const DESIGN_PROBE = ({ wantType, decl }) => {
  const vw = document.documentElement.clientWidth;
  const HID = '[aria-hidden="true"], [hidden], [inert], .sr-only, .visually-hidden, dialog:not([open]), details:not([open]) > :not(summary)';
  const visible = (el) => { const b = el.getBoundingClientRect(); if (!b.width || !b.height) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const textRect = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
  const label = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24) + '"';
  /* jumbo + custom type: real text in the DOM, no overflow */
  const JUMBO = '.t-jumbo, [data-jumbo], [data-ctype]';
  const jumbo = [];
  for (const el of document.querySelectorAll(JUMBO)) {
    const realText = [...el.querySelectorAll('*'), el].some((n) => !n.closest('[aria-hidden="true"]') && [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()));
    /* measure only the readable text (aria-hidden rings / echo rows are decoration) */
    let tr = { left: 0, right: 0, width: 0 };
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t = tw.nextNode(); t; t = tw.nextNode()) {
      if (!t.textContent.trim() || (t.parentElement && t.parentElement.closest('[aria-hidden="true"]'))) continue;
      const rg = document.createRange(); rg.selectNodeContents(t); const b = rg.getBoundingClientRect(); if (!b.width) continue;
      tr = tr.width ? { left: Math.min(tr.left, b.left), right: Math.max(tr.right, b.right), width: 1 } : { left: b.left, right: b.right, width: 1 };
    }
    const over = el.closest(HID) || !tr.width ? 0 : Math.round(Math.max(0, tr.right - vw, -tr.left));
    jumbo.push({ el: label(el), realText, ariaOnly: !realText && !!(el.getAttribute('aria-label') || el.querySelector('img[alt]:not([alt=""])')), over, scrollOver: Math.max(0, el.scrollWidth - el.clientWidth - 1) * (getComputedStyle(el).overflowX === 'visible' ? 1 : 0) });
  }
  /* cramped side padding: visible text closer than 16px to either viewport edge */
  const cramped = [];
  const scroller = (el) => { for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n); if (/(auto|scroll)/.test(cs.overflowX) || cs.position === 'fixed' || /marquee|ticker|hpan|carousel|track/.test(n.className || '')) return true; } return false; };
  for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main li, main a, main button, footer p, header a')) {
    if (!el.textContent.trim() || el.closest(HID) || el.closest(JUMBO) || !visible(el) || scroller(el)) continue;
    const r = textRect(el); if (!r.width || r.right < 0 || r.left > vw) continue;
    /* block boxes: measure the box (glyph side-bearings may overhang it by a pixel); inline: the text */
    const bx = el.getBoundingClientRect();
    const gap = Math.min(Math.max(r.left, bx.left), vw - Math.min(r.right, bx.right));
    if (gap < 15.5 && gap > -1) cramped.push(`${label(el)} ${Math.round(gap)}px`);
    if (cramped.length > 5) break;
  }
  /* tap targets */
  const small = [];
  for (const el of document.querySelectorAll('main .btn, header .btn, main a[class*="cta"], header a[class*="cta"], main button, header button, [role="button"], .vchap__toggle')) {
    if (el.closest(HID) || !visible(el)) continue;
    const b = el.getBoundingClientRect(); if (b.height < 43.5 || b.width < 43.5) small.push(`${label(el)} ${Math.round(b.width)}×${Math.round(b.height)}`);
  }
  /* section padding rhythm */
  const pads = [];
  for (const sec of document.querySelectorAll('main > section, main > [data-section], main > div > section')) {
    const cs = getComputedStyle(sec); const t = parseFloat(cs.paddingTop), bt = parseFloat(cs.paddingBottom);
    if (t + bt > 0 && sec.offsetHeight < innerHeight * 3) pads.push({ id: sec.id || sec.className, t: Math.round(t / 4) * 4, b: Math.round(bt / 4) * 4 });
  }
  const distinct = [...new Set(pads.map((p) => p.t))];
  /* type + contrast */
  let type = null;
  if (wantType) {
    const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => ({ family: f.family.replace(/["']/g, '').trim(), weight: String(f.weight) }));
    const SYSTEM = /^(arial|helvetica|helvetica neue|times|times new roman|georgia|verdana|tahoma|segoe ui|roboto|system-ui|-apple-system|ui-sans-serif|ui-serif|sans-serif|serif)$/i;
    const heads = [];
    for (const h of document.querySelectorAll('main h1, main h2, main h3')) {
      if (h.closest(HID) || !visible(h)) continue;
      const cs = getComputedStyle(h); const first = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      const rendered = SYSTEM.test(first) ? false : document.fonts.check(`${cs.fontWeight} 32px "${first}"`);
      heads.push({ el: label(h), first, weight: cs.fontWeight, system: SYSTEM.test(first), rendered });
      if (heads.length > 30) break;
    }
    const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
    const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const lowContrast = [];
    for (const p of document.querySelectorAll('main p')) {
      if (!p.textContent.trim() || p.closest(HID) || !visible(p)) continue;
      let bg = [255, 255, 255], layers = [], skip = false;
      for (let n = p; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none' || n.tagName === 'VIDEO') { skip = true; break; } const c = rgba(cs.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 0.99) break; } }
      if (skip || p.closest('[data-vchapter], .hero, [class*="overlay"], [class*="scrim"]')) continue;
      for (const c of layers.reverse()) bg = bg.map((v, i) => v * (1 - c[3]) + c[i] * c[3]);
      const cs = getComputedStyle(p); const fc = rgba(cs.color); const fg = bg.map((v, i) => v * (1 - fc[3]) + fc[i] * fc[3]);
      const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
      if (ratio < (large ? 3 : 4.5)) lowContrast.push(`${label(p)} ${ratio.toFixed(2)}:1`);
      if (lowContrast.length > 5) break;
    }
    type = { loaded, heads, lowContrast };
  }
  return { vw, jumbo, cramped, small, pads, distinctPads: distinct, type };
};
function checkDesign(where, pg, pass, d) {
  for (const j of d.jumbo) {
    if (!j.realText) (j.ariaOnly ? warn : block)(where, `custom-type/jumbo moment has no real HTML text${j.ariaOnly ? ' (only aria-label/alt — prefer visually-hidden text)' : ''}: ${j.el}`);
    if (j.over > 1) block(where, `jumbo/custom type overflows the viewport by ${j.over}px at ${d.vw}px: ${j.el} (fit with cqi units / jumbo-fit)`);
  }
  if ((pass.isMobile || pass.narrow) && d.cramped.length) block(where, `cramped side padding (<16px) at ${d.vw}px: ${d.cramped.slice(0, 3).join(' | ')}`);
  if (pass.isMobile && !pass.blockCdn && d.small.length) block(where, `tap target(s) under 44×44px: ${d.small.slice(0, 4).join(' | ')}`);
  if (pass.name === 'desktop' && d.distinctPads.length > 3) warn(where, `section padding not on the rhythm: ${d.distinctPads.length} distinct top paddings (${d.distinctPads.join(', ')}px) — use --section-y-{gentle,standard,cinematic}`);
  if (d.type) {
    const T = d.type;
    const declared = typeDecl ? typeDecl.families : null;
    for (const f of T.loaded) {
      const fam = f.family.toLowerCase();
      if (declared && !declared.includes(fam)) block(where, `undeclared font family loaded: ${f.family} ${f.weight} (type-pick declares ${typeDecl.families.join(', ')})`);
      else if (declared && typeDecl.weights[fam] && !/\s/.test(f.weight) && !typeDecl.weights[fam].includes(f.weight)) block(where, `undeclared weight loaded: ${f.family} ${f.weight} (declared ${typeDecl.weights[fam].join('/')})`);
    }
    if (typeDecl && T.loaded.length > 4) warn(where, `${T.loaded.length} font files loaded (design-spec budget ≤ 4)`);
    for (const h of T.heads) {
      if (declared && !declared.includes(h.first.toLowerCase())) block(where, `heading not in a declared family: ${h.el} → ${h.first}`);
      else if (h.system) (declared ? block : warn)(where, `heading renders in a system font: ${h.el} → ${h.first}`);
      else if (!h.rendered) block(where, `heading family ${h.first} ${h.weight} not loaded — rendering in fallback: ${h.el}`);
    }
    for (const c of T.lowContrast) block(where, `body text contrast below WCAG AA: ${c}`);
  }
}

/* What motion is actually running (read in the desktop pass, motion allowed, fine pointer). */
const MOTION_PROBE = () => {
  const g = window.gsap || null;
  let ST = window.ScrollTrigger || null;
  try { if (!ST && g && g.core && g.core.globals) ST = g.core.globals().ScrollTrigger || null; } catch {}
  const live = {};
  for (const el of document.querySelectorAll('[data-cwb-live]')) for (const n of el.getAttribute('data-cwb-live').split(/\s+/)) if (n) live[n] = (live[n] || 0) + 1;
  const declared = {};
  for (const el of document.querySelectorAll('[data-cwb]')) for (const n of el.getAttribute('data-cwb').split(/\s+/)) if (n) declared[n] = (declared[n] || 0) + 1;
  let cssScroll = 0;
  const scan = (rules) => { for (const r of rules) { try { if (r.cssRules) scan(r.cssRules); const t = r.style && (r.style.animationTimeline || r.style.getPropertyValue('animation-timeline')); if (t && /view\(|scroll\(|--/.test(t)) cssScroll++; } catch {} } };
  for (const s of document.styleSheets) { try { scan(s.cssRules); } catch {} }
  return {
    gsap: !!(g || window.gsapVersions), gsapVersion: (g && g.version) || (window.gsapVersions && window.gsapVersions[0]) || null,
    scrollTrigger: !!ST, scrollTriggers: ST && ST.getAll ? ST.getAll().length : 0,
    splitText: !!(window.SplitText || document.querySelector('[aria-label] .line, .split-line, [data-split]')),
    lenis: !!((window.CWB && window.CWB.lenis) || window.lenis || document.documentElement.classList.contains('lenis')),
    live, declared, cssScroll,
    viewTransitions: !!document.startViewTransition
  };
};

async function runAxe(page) {
  if (!axeSource) return null;
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, target: (v.nodes[0] && v.nodes[0].target.join(' ')) || '' }));
  });
}

async function sectionDiff(page, pg) {
  const dir = opt('--sections', null);
  if (!dir || !existsSync(dir)) return;
  if (!PNG || !pixelmatch) { block('diff', 'pngjs + pixelmatch are required for --sections (npm i -D pngjs pixelmatch)'); return; }
  const prefix = slug(pg) + '--';
  const files = readdirSync(dir).filter((f) => f.endsWith('.png') && (f.startsWith(prefix) || (pg.primary && !f.includes('--'))));
  mkdirSync(join(outDir, 'diff'), { recursive: true });
  for (const f of files) {
    const id = f.replace(prefix, '').replace(/\.png$/, '');
    const loc = page.locator(`#${id}, [data-section="${id}"]`).first();
    const entry = { page: pg.path, section: id, approved: f, mismatch: null, size: null, pass: false };
    if (!(await loc.count())) { entry.note = 'section not found in build (#id or [data-section])'; report.diff.push(entry); block('diff:' + pg.path, `section "${id}" from ${f} not found`); continue; }
    const buf = await loc.screenshot({ animations: 'disabled' });
    const a = PNG.sync.read(readFileSync(join(dir, f))), b = PNG.sync.read(buf);
    const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
    const crop = (img) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
    const A = crop(a), B = crop(b), D = new PNG({ width: w, height: h });
    const n = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.1, includeAA: false });
    const sizePenalty = 1 - (w * h) / Math.max(a.width * a.height, b.width * b.height);
    entry.mismatch = +((n / (w * h)) * (1 - sizePenalty) + sizePenalty).toFixed(4);
    entry.size = `${a.width}×${a.height} vs ${b.width}×${b.height}`;
    entry.diffPng = `diff/${slug(pg)}--${id}.png`;
    writeFileSync(join(outDir, entry.diffPng), PNG.sync.write(D));
    entry.pass = entry.mismatch <= diffThreshold;
    if (!entry.pass) block('diff:' + pg.path, `section "${id}" differs ${(entry.mismatch * 100).toFixed(1)}% > ${(diffThreshold * 100).toFixed(0)}% (${entry.diffPng})`);
    report.diff.push(entry);
  }
}

function checkMotion(pg, m, r) {
  const where = 'motion:' + pg.path;
  const out = { page: pg.path, observed: m, missing: [] };
  const need = (cond, msg) => { if (!cond) { out.missing.push(msg); block(where, msg); } };
  const L = Object.fromEntries(Object.entries(planLibs).map(([k, v]) => [k.toLowerCase(), v]));
  if (L.gsap) need(m.gsap, 'plan requires GSAP but it is not loaded');
  if (L.scrolltrigger) need(m.scrollTrigger, 'plan requires ScrollTrigger but it is not registered');
  if (L.splittext) need(m.splitText, 'plan requires SplitText but no split text was found');
  if (L.lenis) need(m.lenis, 'plan requires Lenis but no Lenis instance is running (desktop, fine pointer, motion on)');
  const minST = Number(plan.min_scrolltriggers || 0);
  if (minST) need(m.scrollTriggers >= minST, `plan expects ≥ ${minST} ScrollTrigger instances, found ${m.scrollTriggers}`);
  const pagePlan = planSections.filter((s) => s && (!s.page || s.page === pg.path || (pg.primary && s.page === '/')));
  for (const s of pagePlan) {
    const label = `${s.id || '?'} → ${s.effect || s.module || s.technique}`;
    if (s.module && s.module !== 'none' && !/^css[:-]/.test(s.module)) {
      if (m.declared && Object.keys(m.declared).length) need((m.live[s.module] || 0) > 0, `${label}: module "${s.module}" not booted (no data-cwb-live)`);
      else if (s.selector) need(s.__selectorFound, `${label}: selector ${s.selector} not found`);
      else need(false, `${label}: module "${s.module}" planned but the page has no data-cwb markup`);
    }
    if (/^css[:-]/.test(String(s.module || '')) || /view\(\)|scroll\(\)|animation-timeline/.test(String(s.technique || ''))) need(m.cssScroll > 0, `${label}: planned CSS scroll/view timeline not found in any stylesheet`);
    if (s.selector && s.__selectorFound === false) need(false, `${label}: selector ${s.selector} not found`);
  }
  if (videoPerSection) need(r.everPlayed >= 1, 'video-per-section planned but no section video ever played during the scroll-through');
  report.motion = report.motion || [];
  report.motion.push(out);
}

/* ---------- run ---------- */
for (const pg of pages) {
  const html = await getHtml(pg);
  staticChecks(pg, html);
  const pr = { page: pg.path, url: pg.url, passes: [], axe: [] };
  for (const pass of passesFor(pg)) {
    const ctx = await browser.newContext({ viewport: pass.viewport, hasTouch: !!pass.hasTouch, isMobile: !!pass.isMobile, deviceScaleFactor: pass.deviceScaleFactor || 1, reducedMotion: pass.reducedMotion || 'no-preference' });
    const page = await ctx.newPage();
    const where = `${pass.name}:${pg.path}`;
    const r = { name: pass.name, errors: [], failedRequests: [], screenshots: [] };
    page.on('pageerror', (e) => r.errors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !(pass.blockCdn && /ERR_FAILED|net::|GSAP not loaded/.test(m.text()))) r.errors.push('console: ' + m.text()); });
    page.on('requestfailed', (q) => { const t = q.failure()?.errorText || ''; if (!pass.blockCdn && !/ERR_ABORTED/.test(t)) r.failedRequests.push(`${t} ${q.url()}`); });
    page.on('response', (s) => { if (s.status() >= 400) r.failedRequests.push(`${s.status()} ${s.url()}`); });
    if (pass.blockCdn) await page.route(/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/, (route) => route.abort());
    await page.addInitScript(INIT);
    await page.goto(pg.url, { waitUntil: 'load' });
    await page.waitForFunction(() => !document.querySelector('.gate') || !document.documentElement.classList.contains('cwb-js'), null, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(pass.blockCdn ? 3400 : 1400);
    const tag = slug(pg) === 'home' && pg.primary ? '' : slug(pg) + '-';
    const shot = async (t) => { const p = join(outDir, `${pass.name}-${tag}${t}.png`); await page.screenshot({ path: p }); r.screenshots.push(basename(p)); };
    await shot('00-top');
    r.firstLoadKb = Math.round((await page.evaluate(bytesNow)) / 1024);
    if (pass.name === 'desktop') {
      r.logo = await page.evaluate(() => {
        const img = document.querySelector('header img, [class*="logo"] img, img[class*="logo"], img[alt*="logo" i]');
        if (!img) return null;
        const e = performance.getEntriesByName(img.currentSrc || img.src)[0];
        return { src: (img.currentSrc || img.src).slice(-80), kb: e ? Math.round((e.transferSize || e.encodedBodySize || 0) / 1024) : null };
      });
    }
    await page.evaluate(() => { window.__cwbQA.scrolled = true; });
    let playingPeak = await page.evaluate(countPlaying), maxStepKb = 0;
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const stepPx = Math.round(pass.viewport.height * 0.6);
    const marks = [0.25, 0.5, 0.75, 1];
    for (let y = 0, mi = 0; y <= H + stepPx; y += stepPx) {
      const before = await page.evaluate(bytesNow);
      await page.evaluate((v) => window.scrollTo(0, v), Math.min(y, H));
      await page.waitForTimeout(pass.motion ? 220 : 90);
      playingPeak = Math.max(playingPeak, await page.evaluate(countPlaying));
      maxStepKb = Math.max(maxStepKb, Math.round(((await page.evaluate(bytesNow)) - before) / 1024));
      const liveH = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      while (mi < marks.length && Math.min(y, liveH) >= marks[mi] * liveH - 1) { await page.waitForTimeout(500); playingPeak = Math.max(playingPeak, await page.evaluate(countPlaying)); await shot(String(marks[mi] * 100).padStart(3, '0')); mi++; }
      if (y >= liveH) break;
    }
    await page.waitForTimeout(600);
    Object.assign(r, await page.evaluate(PROBE));
    r.maxPlaying = playingPeak; r.maxStepKb = maxStepKb;
    r.scrolledKb = Math.round((await page.evaluate(bytesNow)) / 1024);

    const settled = pass.reducedMotion || (pass.name === 'desktop' && !passesFor(pg).some((p) => p.reducedMotion));
    const d = await page.evaluate(DESIGN_PROBE, { wantType: settled, decl: null });
    checkDesign(where, pg, pass, d);
    r.design = { jumboOver: Math.max(0, ...d.jumbo.map((j) => j.over)), cramped: d.cramped.length, smallTargets: d.small.length };
    if (r.errors.length) block(where, `${r.errors.length} JS error(s): ${r.errors[0]}`);
    if (r.failedRequests.length) block(where, `${r.failedRequests.length} failed request(s): ${r.failedRequests[0]}`);
    if (r.overflow > 1) block(where, `horizontal overflow ${r.overflow}px (${r.wide.join(', ')})`);
    if (r.invisibleCount) block(where, `${r.invisibleCount} text element(s) stuck invisible: ${r.invisible.slice(0, 3).join(' | ')}`);
    if (r.failedModules.length) block(where, `module(s) threw: ${r.failedModules.join(', ')}`);
    if (r.usesKernel) {
      if (pass.blockCdn && r.jsClass) block(where, 'fail-open broken: cwb-js still set with CDN blocked');
      if (!pass.blockCdn && !r.booted) block(where, 'CWB runtime never booted (page uses data-cwb)');
    }
    if ((pass.hasTouch || pass.reducedMotion) && r.cursorHidden) block(where, 'native cursor hidden on touch/reduced-motion');
    if (r.cls > 0.1) block(where, `load CLS ${r.cls} > 0.1 (${r.shifters.join(', ')})`);
    if (pass.wide && r.widestText > 2400) block(where, `text block ${r.widestText}px wide > 2400px max page width (${r.widestTag})`);
    if (pass.reducedMotion && r.maxPlaying > 0) block(where, `${r.maxPlaying} video(s) autoplaying under reduced motion`);
    if (r.maxPlaying > maxPlayingLimit()) block(where, `${r.maxPlaying} videos playing at once (limit ${maxPlayingLimit()}: one video at a time)`);
    else if (r.maxPlaying > 1) warn(where, `${r.maxPlaying} videos played at once`);
    if (pass.name === 'desktop') {
      if (r.firstLoadKb > budgetKb) block(where, `first-load transfer ${r.firstLoadKb}KB > budget ${budgetKb}KB`);
      if (r.logo && r.logo.kb != null && r.logo.kb > logoKb) block(where, `logo ${r.logo.src} is ${r.logo.kb}KB > ${logoKb}KB cap (ship SVG or compressed WebP)`);
      /* favicon: declared href or /favicon.ico must answer 200 */
      const iconUrl = new URL(pg.declaredIcon || '/favicon.ico', pg.url).href;
      const ok = await page.evaluate(async (u) => { try { const res = await fetch(u, { cache: 'no-store' }); return res.ok; } catch { return false; } }, iconUrl);
      if (!ok) block('static:' + slug(pg), `favicon missing (${iconUrl})`);
      if (!skipAxe && !passesFor(pg).some((p) => p.reducedMotion)) await axePass(page, pg, pr);
      if (plan) {
        for (const s of planSections) if (s && s.selector) s.__selectorFound = (await page.locator(s.selector).count()) > 0;
        const m = await page.evaluate(MOTION_PROBE);
        checkMotion(pg, m, r);
      }
    }
    if (pass.reducedMotion && !skipAxe) await axePass(page, pg, pr);
    if (pass.reducedMotion && opt('--sections', null)) await sectionDiff(page, pg);
    pr.passes.push(r);
    await ctx.close();
  }
  report.pages.push(pr);
  if (!skipAeo && isMoney(pg)) await aeoFor(pg);
}
/* axe runs on the complete, settled state: the reduced-motion pass (Fadel P5/P13 run with RM on),
   or desktop after the scroll-through for pages without an RM pass. */
async function axePass(page, pg, pr) {
  if (!axeSource) { block('axe', 'axe-core not found (npm i -D axe-core, or set CWB_NODE_MODULES) — or pass --skip-axe for fixtures'); return; }
  const v = await runAxe(page);
  pr.axe = v || [];
  for (const x of pr.axe) if (x.impact === 'serious' || x.impact === 'critical') block('axe:' + pg.path, `${x.impact} ${x.id} ×${x.nodes}: ${x.help} (${x.target})`);
  else warn('axe:' + pg.path, `${x.impact} ${x.id} ×${x.nodes}`);
}
function maxPlayingLimit() { return maxPlaying == null ? Infinity : maxPlaying; }

await browser.close();
if (server) server.close();
report.pass = report.blocking.length === 0;
if (skipAeo) report.aeo_skipped = '--skip-aeo (runtime gallery / non-client fixture only)';
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const md = [`# CWB QA — ${targets.length > 1 ? targets.length + ' pages' : basename(targets[0])}`, '', `Generated ${report.generated} · **${report.pass ? 'PASS' : 'FAIL'}**`, ''];
for (const pr of report.pages) {
  md.push(`## ${pr.page}`, '', '| pass | JS err | failed req | overflow | invisible | LCP ms | load CLS | first-load KB | max step KB | after-scroll KB | videos at once | widest text |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const p of pr.passes) md.push(`| ${p.name} | ${p.errors.length} | ${p.failedRequests.length} | ${p.overflow}px | ${p.invisibleCount} | ${p.lcpMs} | ${p.cls} | ${p.firstLoadKb} | ${p.maxStepKb} | ${p.scrolledKb} | ${p.maxPlaying} | ${p.widestText}px |`);
  md.push('', `axe (wcag2a/aa, 2.1, 2.2 aa): ${skipAxe ? 'skipped' : pr.axe.length ? pr.axe.map((x) => `${x.impact} ${x.id}×${x.nodes}`).join(', ') : '0 violations'}`, '');
}
md.push(report.blocking.length ? '## Blocking\n' + report.blocking.map((b) => `- ${b}`).join('\n') : '## Blocking\nNone.', '');
if (report.warnings.length) md.push('## Warnings', ...report.warnings.map((w) => `- ${w}`), '');
md.push('## Motion plan', plan ? (report.motion || []).map((m) => `- ${m.page}: gsap ${m.observed.gsap ? m.observed.gsapVersion || 'yes' : 'no'} · ScrollTriggers ${m.observed.scrollTriggers} · Lenis ${m.observed.lenis ? 'on' : 'off'} · CSS scroll/view rules ${m.observed.cssScroll} · live modules ${Object.keys(m.observed.live).join(', ') || '—'} · missing: ${m.missing.length ? m.missing.join('; ') : 'none'}`).join('\n') : 'No --motion-plan given.', '');
md.push('## Section diff', report.diff.length ? report.diff.map((d) => `- ${d.page} ${d.section}: ${d.mismatch == null ? d.note : (d.mismatch * 100).toFixed(1) + '% (' + d.size + ')'} ${d.pass ? 'ok' : 'OVER'}`).join('\n') : 'No --sections given.', '');
md.push('## SEO/AEO', skipAeo ? 'Skipped (--skip-aeo).' : report.aeo.map((a) => `- ${a.page}: ${a.score == null ? '—' : a.score + '/60'} · hard fails: ${a.hard_fails.length ? a.hard_fails.join('; ') : 'none'} · flags: ${a.flags.length ? a.flags.join('; ') : 'none'}`).join('\n'), '');
md.push('_Weight: "first-load" is what transfers before any scroll (the budget number); "max step" is the most any single scroll step pulled in (lazy media); "after-scroll" is everything after a full scroll-through and is recorded, not budgeted. LCP/CLS come from a local headless run — they prove regressions, not field performance. Field CWV budgets: LCP < 2.5s, INP < 200ms, CLS < 0.1._');
writeFileSync(join(outDir, 'REPORT.md'), md.join('\n'));
console.log(md.join('\n'));
process.exit(report.pass ? 0 : 1);
