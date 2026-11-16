#!/usr/bin/env node
/**
 * CWB greybox — wireframe.yaml → one greyscale HTML page per sitemap URL + screenshots.
 *
 *   node scripts/greybox.mjs handoff/wireframe.yaml [--out handoff/greybox] [--sitemap sitemap.xml]
 *        [--strict] [--no-shots]
 *
 * Every page: shared chrome (skip link, header, footer), REAL headings (one H1), grey boxes for
 * media (labelled FILM / STILL), text bars where copy is still missing. No photos, no colour, no motion.
 * Shots: <slug>-1440.png and <slug>-390.png (full page) + contact-sheet.png, plus sections.md
 * (the one-screen section list Chuma approves) and index.json (pages, lint).
 *
 * Lint (printed, in index.json; --strict makes them fatal):
 *   - sitemap URL with no wireframe page (no-design page)    - page with no sections / no H1
 *   - service page without a question H2 + 40–60 word capsule slot
 *   - more than one film section in the first two sections of a page (one autoplay loop at a time)
 * Exit 1 on fatal lint; this is the WIREFRAME hard stop — no copy, assets or code before approval.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { loadDep, readYaml } from './lib/util.mjs';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const VALUE = new Set(['--out', '--sitemap']);
const wfPath = args.find((a, i) => !a.startsWith('--') && !VALUE.has(args[i - 1]));
if (!wfPath) { console.error('usage: greybox.mjs <wireframe.yaml> [--out dir] [--sitemap sitemap.xml] [--strict] [--no-shots]'); process.exit(2); }
const wf = await readYaml(wfPath);
const outDir = resolve(opt('--out', join(dirname(wfPath), 'greybox')));
mkdirSync(outDir, { recursive: true });
const site = wf.site || {}, chrome = wf.chrome || {};
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---- expand templates ---- */
const pages = [];
for (const p of wf.pages || []) {
  if (p.use && p.each) {
    const t = (wf.templates || {})[p.use];
    if (!t) { console.error(`greybox: template "${p.use}" not found`); process.exit(2); }
    for (const v of p.each) {
      const sub = (x) => typeof x === 'string' ? x.replace(/\{(\w+)\}/g, (_, k) => k === 'lower' ? String(v.name || '').toLowerCase() : (v[k] ?? `{${k}}`)) : Array.isArray(x) ? x.map(sub) : x;
      pages.push({ path: sub(p.path), slug: `${p.use}-${v.slug}`, title: sub(t.title || v.name), page_type: t.page_type || p.use, template: p.use,
        sections: (t.sections || []).map((s) => Object.fromEntries(Object.entries(s).map(([k, x]) => [k, sub(x)]))) });
    }
  } else pages.push({ ...p, slug: p.slug || (p.path === '/' ? 'home' : p.path.replace(/^\/|\/$/g, '').replace(/\//g, '-')) });
}

/* ---- render ---- */
const bar = (w = 100) => `<span class="bar" style="width:${w}%"></span>`;
const media = (m, label) => m && m !== 'none' ? `<div class="media media--${esc(m)}"><span>${esc(String(m).toUpperCase())}${label ? ' · ' + esc(label) : ''}</span></div>` : '';
const items = (it, cls = 'card') => {
  const list = Array.isArray(it) ? it : Array.from({ length: Number(it) || 0 }, (_, i) => `Item ${i + 1}`);
  return list.map((x, i) => `<div class="${cls}"><h3>${esc(x)}</h3>${bar(80)}${bar(55)}</div>`).join('');
};
function heading(sec, level) {
  const t = sec.h1 || sec.h2 || sec.heading;
  const tag = sec.h1 ? 'h1' : level;
  return t ? `<${tag}>${esc(t)}</${tag}>` : `<${tag} class="placeholder">${esc(sec.id)} heading</${tag}>`;
}
function section(sec, i) {
  const k = sec.kind || 'text';
  const eyebrow = sec.eyebrow ? `<p class="eyebrow">${esc(sec.eyebrow)}</p>` : '';
  const lede = sec.lede ? `<p class="lede">${esc(sec.lede)}</p>` : '';
  const cta = sec.cta ? `<a class="btn" href="#">${esc(sec.cta)}</a>` : '';
  const note = sec.notes ? `<p class="note">${esc(sec.notes)}</p>` : '';
  const words = sec.words ? `<p class="note">Answer capsule: ${esc(sec.words)} words, first 1–2 sentences answer the question.</p>` : '';
  const H = heading(sec, 'h2');
  const tag = `<span class="kind">${String(i + 1).padStart(2, '0')} · ${esc(sec.id)} · ${esc(k)}${sec.layout ? ' · ' + esc(sec.layout) : ''}</span>`;
  let body;
  switch (k) {
    case 'hero': body = `<div class="hero">${media(sec.media || 'still', sec.jumbo ? 'subject cut-out over the jumbo word' : 'full viewport')}${sec.jumbo ? `<p class="jumbo" style="--jc:${String(sec.jumbo).length}">${esc(sec.jumbo)}</p>` : ''}<div class="hero__copy">${eyebrow}${H}${lede}${cta}</div></div>`; break;
    case 'hero-compact': body = `<div class="split split--compact"><div>${eyebrow}${H}${lede}${cta}</div>${media(sec.media)}</div>`; break;
    case 'split-30-70': body = `<div class="split split--3070"><div>${eyebrow}${bar(70)}${bar(50)}</div><div>${H}${lede}${media(sec.media || 'still')}${bar(90)}${bar(80)}</div></div>`; break;
    case 'split-50-50': body = `<div class="split">${media(sec.media || 'still')}<div>${eyebrow}${H}${lede}${bar(90)}${bar(85)}${bar(60)}${cta}</div></div>`; break;
    case 'stacked-chapters': body = `${H}${lede}${(Array.isArray(sec.items) ? sec.items : Array.from({ length: Number(sec.items) || 3 }, (_, n) => `Chapter ${n + 1}`)).map((x, n) => `<div class="chapter">${media(sec.media || 'still', 'chapter ' + (n + 1))}<div class="chapter__copy"><p class="eyebrow">${String(n + 1).padStart(2, '0')}</p><h3>${esc(x)}</h3>${bar(70)}${bar(45)}<span class="btn btn--ghost">Explore</span></div></div>`).join('')}`; break;
    case 'grid': case 'list': body = `${H}${lede}<div class="grid">${items(sec.items || 3)}</div>`; break;
    case 'gallery': body = `${H}${lede}<div class="gallery">${Array.from({ length: Number(sec.items) || 4 }, () => media('still')).join('')}</div>`; break;
    case 'steps': body = `${H}<ol class="steps">${(Array.isArray(sec.items) ? sec.items : ['Step 1', 'Step 2', 'Step 3']).map((x) => `<li><h3>${esc(x)}</h3>${bar(80)}</li>`).join('')}</ol>${cta}`; break;
    case 'faq': body = `${H}<div class="faq">${(Array.isArray(sec.items) ? sec.items : Array.from({ length: Number(sec.items) || 4 }, (_, n) => `Question ${n + 1}?`)).map((q) => `<details open><summary><h3>${esc(q)}</h3></summary>${bar(95)}${bar(90)}${bar(60)}</details>`).join('')}</div>`; break;
    case 'capsule': body = `<div class="capsule">${H}${bar(98)}${bar(96)}${bar(70)}</div>`; break;
    case 'breadcrumbs': body = `<nav class="crumbs" aria-label="Breadcrumb">${esc(sec.text || 'Home / Page')}</nav>`; break;
    case 'nap': body = `<div class="split">${'<div>' + H + '<p class="lede">Phone · Email · Address · Hours · After-hours</p>' + cta + '</div>'}${media('map-or-directions')}</div>`; break;
    case 'form': body = `${H}<div class="form">${bar(100)}${bar(100)}${bar(100)}<span class="btn">Send</span></div>`; break;
    case 'cta': body = `<div class="cta">${H}${lede}${cta}</div>`; break;
    default: body = `<div class="text">${eyebrow}${H}${lede}${bar(92)}${bar(88)}${bar(64)}</div>`;
  }
  return `<section class="sec sec--${esc(k)}" id="${esc(sec.id)}" data-section="${esc(sec.id)}">${tag}${body}${words}${note}</section>`;
}
/* spacing is approved HERE: the greybox uses the same fluid space / section / container / jumbo tokens as the build */
const baseCss = readFileSync(join(HERE, '..', 'runtime', 'cwb-base.css'), 'utf8');
const TOKENS = [...baseCss.matchAll(/^\s*(--(?:space-[\w-]+|section-y[\w-]*|gutter|max-content|max-page|measure|stack|t-jumbo[\w-]*|track-jumbo|lh-jumbo)):\s*([^;]+);/gm)].map((m) => `${m[1]}:${m[2]}`).join(';');
const TRUSTY = /^(law|legal|saas|medical|dental|home-healthcare|senior-care|healthcare|therapy|finance|insurance)$/.test(String(site.sector || '').toLowerCase());
const rhythm = site.section_y || (TRUSTY ? 'gentle' : 'standard');
const css = `
:root{${TOKENS};--section-y:var(--section-y-${rhythm})}
:root{--g0:#fafafa;--g1:#eeeeee;--g2:#d6d6d6;--g3:#bdbdbd;--g4:#8a8a8a;--g5:#3d3d3d;--g6:#1f1f1f;--max:var(--max-content);
--f-d:${site.type && site.type.display ? site.type.display : 'Georgia, serif'};--f-b:${site.type && site.type.body ? site.type.body : 'Arial, sans-serif'}}
*{box-sizing:border-box}body{margin:0;background:var(--g0);color:var(--g6);font:16px/1.55 var(--f-b);filter:grayscale(1)}
.skip{position:absolute;left:8px;top:-40px;background:var(--g6);color:#fff;padding:8px}.skip:focus{top:8px}
header,footer,.sec{padding-inline:max(var(--gutter),calc((100vw - min(100vw,var(--max-content)))/2))}
header{display:flex;gap:24px;align-items:center;justify-content:space-between;padding-block:18px;border-bottom:1px solid var(--g2);background:#fff;position:sticky;top:0;z-index:5}
header .logo{font:700 18px var(--f-d)}header nav{display:flex;gap:18px;flex-wrap:wrap;font-size:14px}header .chip{border:1px solid var(--g4);border-radius:99px;padding:6px 14px;font-size:14px}
.sec{position:relative;padding-block:var(--section-y);border-bottom:1px dashed var(--g2)}.sec>*+*{margin-top:var(--stack)}
.jumbo{font-family:var(--f-d);font-size:min(var(--t-jumbo),calc(94vw / (var(--jc) * 0.6)));line-height:var(--lh-jumbo);letter-spacing:var(--track-jumbo);white-space:nowrap;margin:0;color:var(--g4)}
.kind{position:absolute;top:10px;left:var(--gutter);font:600 11px/1 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--g4)}
h1,h2,h3{font-family:var(--f-d);font-weight:400;letter-spacing:-.02em;margin:.2em 0 .4em;text-wrap:balance}
h1{font-size:clamp(40px,7vw,104px);line-height:1.03;max-width:14ch}h2{font-size:clamp(30px,4.4vw,64px);line-height:1.08;max-width:20ch}h3{font-size:clamp(20px,1.8vw,28px)}
.placeholder{color:var(--g4);font-style:italic}.eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--g5)}.lede{max-width:60ch;color:var(--g5)}
.note{font:12px/1.4 ui-monospace,monospace;color:var(--g4);border-left:3px solid var(--g3);padding-left:10px;max-width:70ch}
.bar{display:block;height:12px;background:var(--g2);border-radius:3px;margin:10px 0}
.btn{display:inline-block;margin-top:14px;padding:12px 22px;border-radius:99px;background:var(--g5);color:#fff;text-decoration:none;font-weight:600}.btn--ghost{background:none;border:1px solid var(--g4);color:var(--g5)}
.media{display:grid;place-items:center;background:var(--g3);color:var(--g6);min-width:0;aspect-ratio:16/10;border-radius:6px;font:600 12px/1 ui-monospace,monospace;letter-spacing:.08em}
.media--film{background:repeating-linear-gradient(135deg,var(--g3) 0 14px,var(--g2) 14px 28px)}
.hero{position:relative;min-height:min(92vh,1000px);display:grid;align-items:end}.hero .media{position:absolute;inset:0;aspect-ratio:auto;border-radius:0}
.hero .jumbo{position:relative;align-self:center;justify-self:center}.hero__copy{position:relative;background:#ffffffd9;padding:24px;max-width:900px;margin-bottom:48px}
.split{display:grid;gap:var(--space-l-2xl);grid-template-columns:1fr 1fr;align-items:center}.split--3070{grid-template-columns:30% 1fr;align-items:start}
.chapter{display:grid;grid-template-columns:1.4fr 1fr;gap:32px;align-items:center;margin-top:40px}.chapter .media{min-width:0}
.grid,.gallery{display:grid;gap:var(--space-s-l);grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))}.card{border:1px solid var(--g2);background:#fff;padding:18px;border-radius:6px}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;padding:0;list-style:none}
.faq details{border-top:1px solid var(--g2);padding:12px 0}.faq summary{list-style:none}.faq summary h3{display:inline}
.capsule{border:2px dashed var(--g4);padding:24px;border-radius:8px;max-width:80ch}.crumbs{font-size:14px;color:var(--g5)}
.cta{text-align:center}.cta h2{margin-inline:auto}
footer{padding-block:48px;background:var(--g1);font-size:14px}footer p{margin:4px 0}
@media (max-width:743.98px){header nav{display:none}.split,.split--3070,.chapter{grid-template-columns:1fr}.hero{min-height:760px}}
`;
const header = () => `${chrome.skip_link === false ? '' : '<a class="skip" href="#main">Skip to content</a>'}
<header><span class="logo">${esc((chrome.header && chrome.header.logo) || site.name || 'Logo')}</span><nav aria-label="Primary">${((chrome.header && chrome.header.nav) || ['Page', 'Page', 'Page']).map((n) => `<a href="#">${esc(n)}</a>`).join('')}</nav>${chrome.header && chrome.header.cta ? `<span class="chip">${esc(chrome.header.cta)}</span>` : ''}</header>`;
const footer = () => `<footer>${((chrome.footer && chrome.footer.lines) || [site.name || 'Business name', 'Address · Phone · Hours']).map((l) => `<p>${esc(l)}</p>`).join('')}<p>${((chrome.footer && chrome.footer.links) || ['Privacy']).map((l) => `<a href="#">${esc(l)}</a>`).join(' · ')}</p>${(chrome.extras || []).map((x) => `<p class="note">${esc(x)}</p>`).join('')}</footer>`;

const lint = [];
const ok = [];
for (const p of pages) {
  const secs = p.sections || [];
  if (!secs.length) lint.push({ page: p.path, fatal: true, msg: 'page has no sections (no-design page with no wireframe)' });
  const h1s = secs.filter((s) => s.h1).length;
  if (h1s !== 1) lint.push({ page: p.path, fatal: true, msg: `page has ${h1s} H1s (needs exactly one)` });
  if (/service$/.test(p.page_type || '') || p.template === 'service') {
    const hasCapsule = secs.some((s) => (s.kind === 'capsule' || s.kind === 'faq') && /\?\s*$/.test(String(s.h2 || '') + (Array.isArray(s.items) ? s.items.join(' ') : '')) && s.words);
    if (!hasCapsule) lint.push({ page: p.path, fatal: true, msg: 'service page lacks a question H2 + 40–60 word answer-capsule slot' });
  }
  const films = secs.slice(0, 2).filter((s) => s.media === 'film').length;
  if (films > 1) lint.push({ page: p.path, fatal: false, msg: `${films} film sections in the first two sections — plan ONE autoplay loop at first load, the rest lazy (video-per-section)` });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title || p.path)} — greybox</title><style>${css}</style></head><body>
${header()}<main id="main">${secs.map(section).join('\n')}</main>${footer()}</body></html>`;
  writeFileSync(join(outDir, `${p.slug}.html`), html);
  ok.push(p);
}
/* every sitemap URL must have a wireframe page */
const smPath = opt('--sitemap', null);
if (smPath && existsSync(smPath)) {
  const locs = [...readFileSync(smPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
  const have = new Set(pages.map((p) => p.path.replace(/\/$/, '') || '/'));
  for (const l of locs) if (!have.has(l)) lint.push({ page: l, fatal: true, msg: 'sitemap URL has no wireframe page (no-design page) — derive it from design-spec patterns' });
}

/* sections.md — the one-screen approval list */
const md = [`# Wireframe approval — ${site.name || ''}`, '', `${pages.length} pages. Approve the section order and layout, or mark moves ("swap gallery and team"). No copy, assets or code until approved.`, ''];
const seenT = new Set();
for (const p of pages) {
  if (p.template) { if (seenT.has(p.template)) continue; seenT.add(p.template); md.push(`## ${p.template} template × ${pages.filter((x) => x.template === p.template).length} (e.g. ${p.path})`); }
  else md.push(`## ${p.title || p.path} \`${p.path}\``);
  md.push((p.sections || []).map((s, i) => `${i + 1}. **${s.id}** (${s.kind || 'text'}${s.media && s.media !== 'none' ? ', ' + s.media : ''}) — ${s.h1 || s.h2 || s.heading || ''}`).join('\n'), '');
}
if (lint.length) md.push('## Lint', ...lint.map((l) => `- ${l.fatal ? '**FAIL**' : 'warn'} ${l.page}: ${l.msg}`), '');
writeFileSync(join(outDir, 'sections.md'), md.join('\n'));

/* screenshots */
const shots = [];
if (!args.includes('--no-shots')) {
  const pw = await loadDep('playwright');
  if (!pw) { console.error('greybox: Playwright not found (set CWB_NODE_MODULES) — or --no-shots'); process.exit(2); }
  const browser = await pw.chromium.launch();
  for (const p of ok) {
    for (const w of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
      await page.goto('file://' + join(outDir, `${p.slug}.html`));
      const file = `${p.slug}-${w}.png`;
      await page.screenshot({ path: join(outDir, file), fullPage: true });
      shots.push(file);
      await page.close();
    }
  }
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#222;color:#eee;font:13px system-ui;padding:16px}.g{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}figure{margin:0;background:#333;padding:8px;border-radius:6px}figure div{display:grid;grid-template-columns:3fr 1fr;gap:6px;align-items:start;max-height:520px;overflow:hidden}img{width:100%;display:block}</style></head><body><h1 style="font-size:16px">${esc(site.name || '')} — greybox contact sheet (${ok.length} pages)</h1><div class="g">${ok.map((p) => `<figure><div><img src="${p.slug}-1440.png"><img src="${p.slug}-390.png"></div><figcaption>${esc(p.path)}</figcaption></figure>`).join('')}</div></body></html>`;
  writeFileSync(join(outDir, 'contact-sheet.html'), sheet);
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } });
  await page.goto('file://' + join(outDir, 'contact-sheet.html'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, 'contact-sheet.png'), fullPage: true });
  await browser.close();
}
writeFileSync(join(outDir, 'index.json'), JSON.stringify({ wireframe: wfPath, pages: ok.map((p) => ({ path: p.path, slug: p.slug, sections: (p.sections || []).length })), shots, lint }, null, 2));
const fatal = lint.filter((l) => l.fatal);
console.log(JSON.stringify({ out: outDir, pages: ok.length, screenshots: shots.length, lint: lint.map((l) => `${l.fatal ? 'FAIL' : 'warn'} ${l.page}: ${l.msg}`) }, null, 2));
process.exit(fatal.length && (args.includes('--strict') || fatal.some((l) => /no wireframe page|no sections|H1s/.test(l.msg))) ? 1 : 0);
