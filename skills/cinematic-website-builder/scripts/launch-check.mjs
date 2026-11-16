#!/usr/bin/env node
/**
 * CWB launch gate — run against the LIVE production URL right after DNS/deploy (and against the
 * preview to see what will change). Zero dependencies (Node 18+ fetch).
 *
 *   node scripts/launch-check.mjs https://example.com [--domain example.com] [--pages /,/services/x]
 *        [--preview] [--out launch-report.md]
 *
 * FAIL (exit 1):
 *   - robots.txt "Disallow: /" for * (or Googlebot / OAI-SearchBot / PerplexityBot / ClaudeBot)
 *   - <meta name="robots|googlebot" content="noindex"> or X-Robots-Tag: noindex on any checked page
 *   - canonical on another host (old domain, *.vercel.app, *.pages.dev, *.workers.dev, localhost)
 *   - sitemap.xml missing / unreachable / <loc>s on another host; robots.txt not naming the sitemap
 *   - llms.txt present but linking another host
 *   - no favicon (link rel=icon resolving 200, or /favicon.ico)
 *   - page not 200 / HTTPS not enforced (http:// does not redirect)
 * WARN: no llms.txt, no apple-touch-icon, no theme-color, missing og:image, AI crawlers blocked.
 * --preview: preview hosts are EXPECTED to be noindex — reports what flips at launch instead of failing.
 */
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const VALUE = new Set(['--domain', '--pages', '--out']);
const target = args.find((a, i) => !a.startsWith('--') && !VALUE.has(args[i - 1]));
if (!target) { console.error('usage: launch-check.mjs <https://live-domain> [--domain host] [--pages /,/x] [--preview] [--out file]'); process.exit(2); }
const base = new URL(target);
const expected = (opt('--domain', base.hostname)).replace(/^www\./, '');
const preview = args.includes('--preview');
const pages = opt('--pages', '/').split(',').map((s) => s.trim()).filter(Boolean);
const fails = [], warns = [], info = [];
const bad = (m) => (preview ? info.push('at launch: ' + m) : fails.push(m));
const sameHost = (u) => { try { return new URL(u, base).hostname.replace(/^www\./, '') === expected; } catch { return false; } };
async function get(path, init = {}) {
  const url = new URL(path, base).href;
  try { const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (CWB launch-check)' }, ...init }); return { r, url, text: init.method === 'HEAD' ? '' : await r.text() }; }
  catch (e) { return { r: null, url, text: '', err: String(e.message || e) }; }
}
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i')); return m ? m[1] : null; };
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0]);

/* robots */
const robots = await get('/robots.txt');
if (!robots.r || !robots.r.ok) warns.push('robots.txt missing (crawlers treat as allow-all; ship one that names the sitemap)');
else {
  const groups = []; let cur = null;
  for (const raw of robots.text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim(); if (!line) continue;
    const [k, ...v] = line.split(':'); const key = k.trim().toLowerCase(), val = v.join(':').trim();
    if (key === 'user-agent') { if (!cur || cur.rules.length) groups.push(cur = { agents: [], rules: [] }); cur.agents.push(val.toLowerCase()); }
    else if (cur && (key === 'disallow' || key === 'allow')) cur.rules.push([key, val]);
  }
  for (const g of groups) {
    const all = g.rules.some(([k, v]) => k === 'disallow' && v === '/') && !g.rules.some(([k, v]) => k === 'allow' && v === '/');
    if (!all) continue;
    const who = g.agents.filter((a) => ['*', 'googlebot', 'bingbot'].includes(a));
    const ai = g.agents.filter((a) => /oai-searchbot|chatgpt-user|perplexitybot|claudebot|claude-searchbot|gptbot|google-extended/.test(a));
    if (who.length) bad(`robots.txt: "Disallow: /" for ${who.join(', ')}`);
    if (ai.length) warns.push(`robots.txt blocks AI crawlers: ${ai.join(', ')} (AEO: allow OAI-SearchBot, PerplexityBot, Claude-SearchBot unless the client opted out)`);
  }
  const sm = [...robots.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (!sm.length) warns.push('robots.txt does not name the sitemap');
  for (const s of sm) if (!sameHost(s)) bad(`robots.txt Sitemap points at another host: ${s}`);
}

/* pages */
let favOk = false, home = null;
for (const p of pages) {
  const { r, url, text, err } = await get(p);
  if (!r) { fails.push(`${p}: fetch failed (${err})`); continue; }
  if (r.status !== 200) fails.push(`${p}: HTTP ${r.status}`);
  if (new URL(r.url).hostname !== base.hostname) bad(`${p}: redirected to another host ${r.url}`);
  if (p === '/' || !home) home = { html: text, url: r.url };
  const xr = r.headers.get('x-robots-tag') || '';
  if (/noindex|none/i.test(xr)) bad(`${p}: X-Robots-Tag "${xr}"`);
  for (const t of tags(text, /<meta\b[^>]*>/gi)) {
    const n = (attr(t, 'name') || '').toLowerCase();
    if ((n === 'robots' || n === 'googlebot') && /noindex|none/i.test(attr(t, 'content') || '')) bad(`${p}: <meta name="${n}" content="${attr(t, 'content')}">`);
  }
  const canon = tags(text, /<link\b[^>]*rel=["']canonical["'][^>]*>/gi).map((t) => attr(t, 'href'));
  if (!canon.length) warns.push(`${p}: no canonical`);
  for (const c of canon) {
    if (!sameHost(c)) bad(`${p}: canonical points at another host: ${c}`);
    else if (/\.(vercel\.app|pages\.dev|workers\.dev|netlify\.app)|localhost/.test(c)) bad(`${p}: canonical points at a preview host: ${c}`);
  }
  if (!/<meta\b[^>]*property=["']og:image["']/i.test(text)) warns.push(`${p}: no og:image`);
  if (p === pages[0]) {
    if (!/<meta\b[^>]*name=["']theme-color["']/i.test(text)) warns.push('no <meta name="theme-color">');
    const ati = tags(text, /<link\b[^>]*rel=["']apple-touch-icon["'][^>]*>/gi);
    if (!ati.length) warns.push('no apple-touch-icon');
    const icons = tags(text, /<link\b[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/gi).map((t) => attr(t, 'href'));
    for (const h of [...icons, '/favicon.ico']) {
      const f = await get(h, { method: 'HEAD' });
      if (f.r && f.r.ok) { favOk = true; info.push(`favicon OK: ${h}`); break; }
    }
  }
}
if (!favOk) fails.push('no favicon resolves (link rel=icon or /favicon.ico)');

/* sitemap */
const sm = await get('/sitemap.xml');
if (!sm.r || !sm.r.ok) fails.push('sitemap.xml missing or not 200');
else {
  const locs = [...sm.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) fails.push('sitemap.xml has no <loc> entries');
  const off = locs.filter((l) => !sameHost(l));
  if (off.length) bad(`sitemap.xml lists ${off.length} URL(s) on another host, e.g. ${off[0]}`);
  info.push(`sitemap: ${locs.length} URLs`);
}
/* llms.txt */
const llms = await get('/llms.txt');
if (!llms.r || !llms.r.ok) warns.push('no /llms.txt (optional AEO helper — see references/launch-gate.md)');
else {
  const links = [...llms.text.matchAll(/\]\((https?:[^)\s]+)\)|(?<![(\w])(https?:\/\/[^\s)>\]]+)/g)].map((m) => m[1] || m[2]);
  const off = links.filter((l) => !sameHost(l));
  if (off.length) bad(`llms.txt links another host: ${off.slice(0, 3).join(', ')}`);
}
/* https */
if (base.protocol === 'https:' && !/^(localhost|127\.)/.test(base.hostname)) {
  const h = await get(`http://${base.host}/`, { redirect: 'manual' });
  if (h.r && !(h.r.status >= 300 && h.r.status < 400 && /^https:/.test(h.r.headers.get('location') || ''))) warns.push(`http:// does not redirect to https (status ${h.r.status})`);
}

const verdict = fails.length ? 'FAIL' : 'PASS';
const report = [`# Launch gate — ${base.href} (${preview ? 'preview' : 'production'})`, '', `**${verdict}** — expected domain: ${expected}`, '',
  '## Blocking', ...(fails.length ? fails.map((x) => `- ${x}`) : ['- None']), '', '## Warnings', ...(warns.length ? warns.map((x) => `- ${x}`) : ['- None']), '',
  '## Notes', ...info.map((x) => `- ${x}`), ''].join('\n');
if (opt('--out')) writeFileSync(opt('--out'), report);
console.log(report);
process.exit(fails.length ? 1 : 0);
