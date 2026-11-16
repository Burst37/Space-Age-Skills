#!/usr/bin/env node
/**
 * CWB type picker — score the curated pairing library, render a shortlist as specimen cards,
 * pick (auto) or wait for a choice (review), and write type tokens.
 *
 *   node scripts/type-specimens.mjs handoff/type-inputs.yaml [--out handoff/type] [--top 3]
 *        [--taste taste-profile.yaml] [--spec handoff/design-spec.md] [--mode auto|review]
 *        [--choose <pairing-id>] [--library references/type-pairings.yaml] [--no-render]
 *
 * Writes into --out:
 *   specimens/<id>-1440.png, specimens/<id>-390.png, specimens/<id>.html   one card per shortlisted pairing
 *   type-review.html + type-review.png                                      one screen to approve / swap
 *   type-pick.yaml       shortlist with scores + reasons; `chosen` (auto: top score; review: null until --choose)
 *   type-tokens.css      provider <link> URL, @font-face fallbacks with size-adjust / ascent-override /
 *                        descent-override (measured, no CLS on swap) and the fluid scale tokens
 * With --spec, replaces the block between <!-- cwb:type:start --> and <!-- cwb:type:end --> in design-spec.md.
 * With --choose + --taste, records the pick in the taste profile (type.liked_pairings / liked_families).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDep, readYaml, toYaml } from './lib/util.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const VALUE = new Set(['--out', '--top', '--taste', '--spec', '--mode', '--choose', '--library']);
const inputsPath = args.find((a, i) => !a.startsWith('--') && !VALUE.has(args[i - 1]));
if (!inputsPath) { console.error('usage: type-specimens.mjs <type-inputs.yaml> [--out dir] [--top 3] [--taste f] [--spec design-spec.md] [--mode auto|review] [--choose id]'); process.exit(2); }
const inputs = await readYaml(inputsPath);
const outDir = resolve(opt('--out', join(dirname(inputsPath), 'type')));
const lib = await readYaml(opt('--library', join(HERE, '..', 'references', 'type-pairings.yaml')));
const tastePath = opt('--taste', null);
const taste = tastePath && existsSync(tastePath) ? await readYaml(tastePath) : {};
const mode = opt('--mode', inputs.mode || 'review');
const top = Number(opt('--top', 3));
mkdirSync(join(outDir, 'specimens'), { recursive: true });

const TRUST = /^(law|legal|saas|medical|dental|home-healthcare|senior-care|healthcare|therapy|pharmacy|telehealth|finance|insurance)$/;
const SERIF = new Set(['Newsreader', 'Erode', 'Literata', 'Source Serif 4', 'Libre Caslon Display', 'Gambetta', 'Bodoni Moda', 'Boska', 'Zodiak', 'Sentient', 'Young Serif', 'Cormorant Garamond', 'Gloock', 'Spectral', 'Bespoke Serif', 'Melodrama', 'Georgia', 'Times New Roman']);
const sector = String(inputs.sector || '').toLowerCase();
const trust = TRUST.test(sector);
const dials = inputs.dials || { warmth: 0.5, classic: 0.5, loud: 0.5 };
const banned = new Set((lib.banned || []).map((s) => s.toLowerCase()));
const overused = new Set((lib.overused || []).map((s) => s.toLowerCase()));
const brand = inputs.brand_fonts || {};
const refFonts = (inputs.reference_fonts || []).map((s) => String(s).toLowerCase());
const tt = taste.type || {};
const liked = new Set(tt.liked_pairings || []), disliked = new Set(tt.disliked_pairings || []);
const likedFam = new Set((tt.liked_families || []).map((s) => s.toLowerCase()));

const fams = (p) => [p.display, p.text, p.mono].filter(Boolean).map((x) => x.family);
function score(p) {
  const why = [];
  let s = 0;
  const d = ['warmth', 'classic', 'loud'].map((k) => Math.abs((p.dials[k] ?? 0.5) - (dials[k] ?? 0.5)));
  const fit = 1 - d.reduce((a, b) => a + b, 0) / 3;
  s += fit * 40; why.push(`personality fit ${(fit * 100).toFixed(0)}% (warmth/classic/loud)`);
  if ((p.sectors || []).includes(sector)) { s += 25; why.push(`made for ${sector}`); }
  if (trust && p.variant === 'bold') { s -= 15; why.push('bold pairing in a trust sector (−15)'); }
  if (trust && p.variant === 'gentle') { s += 5; why.push('gentle pairing suits a trust sector'); }
  for (const f of fams(p)) {
    if (refFonts.includes(f.toLowerCase())) { s += 10; why.push(`${f} appears on the moodboard references`); }
    if (likedFam.has(f.toLowerCase())) { s += 6; why.push(`taste profile likes ${f}`); }
    if (overused.has(f.toLowerCase())) { s -= 8; why.push(`${f} is overused (−8)`); }
  }
  if (tt.signature === 'jumbo') {
    if (p.jumbo && p.jumbo.ok) { s += 8; why.push('display face holds up at jumbo size (Chuma\'s signature)'); }
    else if (p.jumbo) { s -= 6; why.push('display face weak at jumbo size (−6)'); }
  }
  if (liked.has(p.id)) { s += 15; why.push('picked before (taste profile)'); }
  if (disliked.has(p.id)) { s -= 30; why.push('rejected before (taste profile)'); }
  const files = [p.display, p.text, p.mono].filter(Boolean).reduce((n, x) => n + (x.weights || []).length, 0) - (p.display.family === p.text.family ? 0 : 0);
  const famCount = new Set(fams(p).filter((f, i) => i < 2)).size;
  if (files > 4 || famCount > 2) { s -= 10; why.push(`loads ${files} files (budget ≤ 4) (−10)`); }
  return { s: +s.toFixed(1), why, files };
}
let pool = (lib.pairings || []).filter((p) => !fams(p).some((f) => banned.has(f.toLowerCase())));
if (brand.display || brand.text) {
  pool.unshift({ id: 'brand-guide', display: { family: brand.display || brand.text, weights: brand.display_weights || [600] }, text: { family: brand.text || brand.display, weights: brand.text_weights || [400, 600] },
    provider: brand.provider || 'self-host', licence: brand.licence || 'client-supplied (check)', variable: !!brand.variable, dials, mood: ['brand guide'], sectors: [sector], variant: trust ? 'gentle' : 'bold', brand: true });
}
const ranked = pool.map((p) => ({ p, ...score(p) })).map((r) => (r.p.brand ? { ...r, s: 999, why: ['brand guide fonts override the library', ...r.why] } : r)).sort((a, b) => b.s - a.s);
const shortlist = ranked.slice(0, top);

/* ---------- provider CSS ---------- */
const slugify = (f) => f.toLowerCase().replace(/\s+/g, '-');
function providerHref(p) {
  const parts = [p.display, p.text, p.mono].filter(Boolean);
  const byFam = new Map();
  for (const x of parts) byFam.set(x.family, [...new Set([...(byFam.get(x.family) || []), ...x.weights])].sort());
  if (p.provider === 'fontshare') return 'https://api.fontshare.com/v2/css?' + [...byFam].map(([f, w]) => `f[]=${slugify(f)}@${w.join(',')}`).join('&') + '&display=swap';
  if (p.provider === 'bunny') return 'https://fonts.bunny.net/css?family=' + [...byFam].map(([f, w]) => `${slugify(f)}:${w.join(',')}`).join('|') + '&display=swap';
  return null;
}

/* ---------- scale ---------- */
function scaleFor(p) {
  const loud = p.dials.loud ?? 0.5, serifDisplay = SERIF.has(p.display.family);
  const heroMax = (4.5 + loud * 3.5).toFixed(2), heroMin = (2.4 + loud * 0.6).toFixed(2);
  return {
    '--t-hero': `clamp(${heroMin}rem, 1.2rem + ${(3.5 + loud * 3).toFixed(1)}vw, ${heroMax}rem)`,
    '--t-h2': `clamp(1.9rem, 1.1rem + ${(2 + loud * 1.6).toFixed(1)}vw, ${(3 + loud * 1.4).toFixed(2)}rem)`,
    '--t-h3': 'clamp(1.25rem, 1rem + 0.9vw, 1.6rem)',
    '--t-body': trust ? 'clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)' : 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
    '--t-small': '0.875rem',
    '--track-display': serifDisplay ? '-0.015em' : `${(-0.02 - loud * 0.02).toFixed(3)}em`,
    '--lh-display': serifDisplay ? '1.08' : (loud > 0.7 ? '0.98' : '1.04'),
    '--lh-body': '1.6',
    '--measure': '68ch',
    '--t-jumbo': trust ? 'clamp(3.5rem, 1rem + 10vw, 12rem)' : 'clamp(4rem, 1rem + 14vw, 18rem)',
    '--track-jumbo': serifDisplay ? '-0.03em' : (trust ? '-0.04em' : '-0.05em'),
    '--lh-jumbo': serifDisplay ? '0.95' : '0.9',
    '--jumbo-advance': String((p.jumbo && p.jumbo.advance) || 0.6)
  };
}

/* ---------- render ---------- */
const copy = Object.assign({ jumbo: null, headline: 'Care that feels like home.', h2: 'What does respite care include?', body: 'Respite care gives family caregivers a planned break while a trained caregiver keeps the routines your loved one already knows: meals, companionship, reminders and a calm afternoon at home.', button: 'Talk with our office', eyebrow: inputs.client || 'Specimen' }, inputs.copy || {});
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const jumboWord = String(copy.jumbo || copy.headline.split(/\s+/).sort((a, b) => b.length - a.length)[0]).replace(/[^\p{L}\p{N}'-]/gu, '');
function cardHtml(r) {
  const p = r.p, sc = scaleFor(p), href = providerHref(p);
  const vars = Object.entries(sc).map(([k, v]) => `${k}:${v}`).join(';');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${href ? `<link rel="stylesheet" href="${href}">` : ''}
<title>${esc(p.id)} specimen</title><style>
:root{${vars};--ink:#16181d;--muted:#4b5563;--bg:#f6f4ef;--line:#d9d6ce}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:"${p.text.family}",${SERIF.has(p.text.family) ? 'Georgia,serif' : 'Arial,sans-serif'};font-size:var(--t-body);line-height:var(--lh-body)}
main{padding:clamp(24px,5vw,72px);max-width:1440px;margin:auto}
.meta{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;font:500 .8rem/1.3 ui-monospace,monospace;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:clamp(24px,5vw,64px)}
.eyebrow{font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:var(--t-small);color:var(--muted);margin:0 0 1rem}
h1,h2{font-family:"${p.display.family}",${SERIF.has(p.display.family) ? 'Georgia,serif' : 'Arial,sans-serif'};font-weight:${p.display.weights[0]};letter-spacing:var(--track-display);line-height:var(--lh-display);text-wrap:balance;margin:0}
h1{font-size:var(--t-hero);max-width:14ch}.jbox{container-type:inline-size;margin:0 0 clamp(24px,4vw,56px)}.jumbo{font-family:"${p.display.family}",${SERIF.has(p.display.family) ? 'Georgia,serif' : 'Arial,sans-serif'};font-weight:${p.display.weights.at(-1)};letter-spacing:var(--track-jumbo);line-height:var(--lh-jumbo);white-space:nowrap;margin:0;font-size:min(var(--t-jumbo),calc(96cqi / (var(--jchars) * var(--jumbo-advance))))}h2{font-size:var(--t-h2);max-width:22ch;margin-top:clamp(40px,6vw,96px)}
p.body{max-width:var(--measure);margin:1.25rem 0 2rem;color:#2b2f36}
.btn{display:inline-flex;align-items:center;min-height:48px;padding:.75rem 1.4rem;border-radius:999px;background:var(--ink);color:#fff;font-weight:${p.text.weights.at(-1)};text-decoration:none}
.mono{font-family:"${p.mono ? p.mono.family : p.text.family}",ui-monospace,monospace;font-size:.9rem;color:var(--muted);margin-top:2rem}
</style></head><body><main>
<div class="meta"><span><b>${esc(p.id)}</b></span><span>Display: ${esc(p.display.family)} ${p.display.weights.join('/')}</span><span>Text: ${esc(p.text.family)} ${p.text.weights.join('/')}</span>${p.mono ? `<span>Mono: ${esc(p.mono.family)}</span>` : ''}<span>${esc(p.provider)} · ${esc(p.licence)}</span><span>score ${r.s}</span></div>
<div class="jbox"><p class="jumbo" style="--jchars:${jumboWord.length}">${esc(jumboWord)}</p></div>
<p class="eyebrow">${esc(copy.eyebrow)}</p>
<h1>${esc(copy.headline)}</h1>
<h2>${esc(copy.h2)}</h2>
<p class="body">${esc(copy.body)}</p>
<a class="btn" href="#">${esc(copy.button)}</a>
${p.mono ? '<p class="mono">(314) 479-5673 · Mon–Fri 9:00–5:00</p>' : ''}
</main></body></html>`;
}

const METRICS = async ({ fam, weight, fallback }) => {
  await document.fonts.load(`${weight} 100px "${fam}"`);
  const c = document.createElement('canvas').getContext('2d');
  const sample = 'The quick brown fox jumps over the lazy dog 0123456789';
  const m = (f) => { c.font = f; const t = c.measureText(sample); return { w: t.width, a: t.fontBoundingBoxAscent, d: t.fontBoundingBoxDescent }; };
  const web = m(`${weight} 100px "${fam}"`), fb = m(`${weight} 100px ${fallback}`);
  const sizeAdjust = web.w / fb.w;
  return { loaded: document.fonts.check(`${weight} 100px "${fam}"`), sizeAdjust: +(sizeAdjust * 100).toFixed(2), ascent: +((web.a / 100 / sizeAdjust) * 100).toFixed(2), descent: +((web.d / 100 / sizeAdjust) * 100).toFixed(2) };
};

const render = !args.includes('--no-render');
const metrics = {};
/* --no-render reuses the metrics measured by the previous rendered run */
if (!render && existsSync(join(outDir, 'type-pick.yaml'))) {
  try { for (const s of (await readYaml(join(outDir, 'type-pick.yaml'))).shortlist || []) if (s.metrics) metrics[s.id] = s.metrics; } catch {}
}
if (render) {
  const pw = await loadDep('playwright');
  if (!pw) { console.error('type-specimens: Playwright not found (set CWB_NODE_MODULES) — or pass --no-render'); process.exit(2); }
  const proxyArgs = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [];
  const browser = await pw.chromium.launch({ args: proxyArgs });
  for (const r of shortlist) {
    const file = join(outDir, 'specimens', `${r.p.id}.html`);
    writeFileSync(file, cardHtml(r));
    for (const [w, h] of [[1440, 1000], [390, 900]]) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
      await page.goto('file://' + file, { waitUntil: 'networkidle' }).catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      if (w === 1440) {
        metrics[r.p.id] = {};
        for (const role of ['display', 'text']) {
          const x = r.p[role];
          metrics[r.p.id][role] = await page.evaluate(METRICS, { fam: x.family, weight: role === 'display' ? x.weights[0] : x.weights[0], fallback: SERIF.has(x.family) ? '"Times New Roman", serif' : 'Arial, sans-serif' });
          if (!metrics[r.p.id][role].loaded) console.warn(`warn: ${x.family} did not load from ${r.p.provider} — check network/provider`);
        }
      }
      await page.screenshot({ path: join(outDir, 'specimens', `${r.p.id}-${w}.png`), fullPage: true });
      await page.close();
    }
  }
  const review = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Type review — ${esc(inputs.client || '')}</title><style>
body{margin:0;font:14px/1.45 system-ui,sans-serif;background:#111;color:#eee}h1{font-size:18px;margin:16px 20px}
.grid{display:grid;grid-template-columns:repeat(${shortlist.length},1fr);gap:16px;padding:0 20px 20px}
figure{margin:0;background:#1b1b1f;border-radius:10px;padding:10px}figure img{width:100%;display:block;border-radius:6px}
.row{display:grid;grid-template-columns:3fr 1fr;gap:8px;align-items:start}figcaption{margin-top:8px}ol{margin:4px 0 0 18px;padding:0;color:#bbb}</style></head><body>
<h1>Type picker — ${esc(inputs.client || '')} · ${esc(sector)} · mode: ${esc(mode)} · approve one or say "swap"</h1><div class="grid">
${shortlist.map((r, i) => `<figure><div class="row"><img src="specimens/${r.p.id}-1440.png" alt="${esc(r.p.id)} desktop"><img src="specimens/${r.p.id}-390.png" alt="${esc(r.p.id)} mobile"></div>
<figcaption><b>${i + 1}. ${esc(r.p.display.family)} + ${esc(r.p.text.family)}</b> (${esc(r.p.id)}, score ${r.s})<ol>${r.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ol></figcaption></figure>`).join('\n')}
</div></body></html>`;
  writeFileSync(join(outDir, 'type-review.html'), review);
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } });
  await page.goto('file://' + join(outDir, 'type-review.html'));
  await page.screenshot({ path: join(outDir, 'type-review.png'), fullPage: true });
  await browser.close();
}

/* ---------- choose + tokens ---------- */
let chosenId = opt('--choose', null) || (mode === 'auto' ? shortlist[0]?.p.id : null);
const chosen = chosenId ? (ranked.find((r) => r.p.id === chosenId) || null) : null;
if (chosenId && !chosen) { console.error(`type-specimens: unknown pairing "${chosenId}"`); process.exit(2); }

function tokensCss(r) {
  const p = r.p, sc = scaleFor(p), m = metrics[p.id] || {};
  const fb = (role) => {
    const x = p[role], mm = m[role], local = SERIF.has(x.family) ? 'Times New Roman' : 'Arial';
    if (!mm) return `/* ${x.family}: run without --no-render to measure size-adjust / ascent-override */`;
    return `@font-face { font-family: "${x.family} Fallback"; src: local("${local}"); size-adjust: ${mm.sizeAdjust}%; ascent-override: ${mm.ascent}%; descent-override: ${mm.descent}%; line-gap-override: 0%; }`;
  };
  return `/* CWB type tokens — ${p.id} (${p.provider}, ${p.licence}). Generated by scripts/type-specimens.mjs.
   Load ONE provider stylesheet (or self-host the same files as WOFF2 on Premium):
   <link rel="preconnect" href="${p.provider === 'fontshare' ? 'https://api.fontshare.com' : 'https://fonts.bunny.net'}" crossorigin>
   <link rel="stylesheet" href="${providerHref(p) || 'self-hosted'}">  */
${fb('display')}
${fb('text')}
:root {
  --f-display: "${p.display.family}", "${p.display.family} Fallback", ${SERIF.has(p.display.family) ? 'Georgia, serif' : 'Arial, sans-serif'};
  --f-body: "${p.text.family}", "${p.text.family} Fallback", ${SERIF.has(p.text.family) ? 'Georgia, serif' : 'Arial, sans-serif'};
  --f-mono: ${p.mono ? `"${p.mono.family}", ` : ''}ui-monospace, SFMono-Regular, Menlo, monospace;
  --w-display: ${p.display.weights[0]};
  --w-body: ${p.text.weights[0]};
  --w-strong: ${p.text.weights.at(-1)};
${Object.entries(sc).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}
`;
}
/* ---------- custom-type style (references/custom-typography.md) ---------- */
const CTYPES = [
  ['behind-subject', 1, 'all'], ['mixed', 5, 'all'], ['material', 2, 'beauty kids events sport'], ['alt-display', 3, 'tech gaming music events'],
  ['fill', 4, 'fashion music streetwear agency'], ['ring', 6, 'studio agency events creative'], ['inflated', 7, 'kids events beauty party'],
  ['glass', 8, 'spa beverage tech skincare'], ['tube-script', 9, 'music nightlife streetwear cafe'], ['sticker', 10, 'streetwear youth beverage'],
  ['object-composed', 11, 'lash salon gifts events beauty'], ['jumbo-character', 12, 'gaming tech youth events'], ['food', 13, 'bakery ice-cream candy cafe kids restaurant'],
  ['gem', 14, 'jewelry luxury events'], ['textile', 15, 'bedding home-goods spa salon'], ['giant-object', 16, 'any-hero-video'], ['chrome-iridescent', 17, 'music nightlife fashion'],
  ['glass-ui', 18, 'tech product creative'], ['depth-layouts', 19, 'e-commerce product creator retail'], ['tube-matte', 20, 'interiors architecture cafe'],
  ['glyph-kit', 21, 'beauty kids events creator'], ['element', 22, 'landscaping garden eco pools plumbing construction space travel'], ['dreamy-chrome', 23, 'music events fashion'],
  ['extruded', 24, 'youth events retail'], ['flat-fill', 25, 'music nightlife gaming pools']
];
const REG_OK = new Set(tt.regulated_custom_type || ['behind-subject', 'mixed']);
const refStyles = (inputs.custom_type_refs || []).map(String);
const customType = CTYPES.filter(([id]) => !trust || REG_OK.has(id)).map(([id, n, sectors]) => {
  let sc = 0; const why = [];
  if (id === (tt.custom_type_default || 'behind-subject')) { sc += trust ? 20 : 40; why.push('Chuma\'s favourite (style 1)'); }
  if (sectors === 'all' || sectors.split(' ').includes(sector)) { sc += 20; why.push(sectors === 'all' ? 'fits every sector' : `fits ${sector}`); }
  if (refStyles.includes(id) || refStyles.includes(String(n))) { sc += 25; why.push('on the moodboard / picked from type-refs INDEX'); }
  if ((tt.custom_type_liked || []).includes(id)) { sc += 8; why.push('liked before'); }
  if (trust) why.push('calm form only: serif/sans jumbo, gentle parallax, no distortion');
  return { id, style: n, score: sc, why };
}).sort((a, b) => b.score - a.score).slice(0, 3);

const pick = {
  client: inputs.client || null, sector, trust_sector: trust, mode, dials,
  generated: new Date().toISOString(),
  chosen: chosen ? { id: chosen.p.id, display: chosen.p.display, text: chosen.p.text, mono: chosen.p.mono || null, provider: chosen.p.provider, licence: chosen.p.licence, stylesheet: providerHref(chosen.p), why: chosen.why, picked_by: opt('--choose', null) ? 'chuma (review)' : 'auto (top score)' } : null,
  declared_families: chosen ? [...new Set(fams(chosen.p))] : [],
  declared_weights: chosen ? Object.fromEntries([chosen.p.display, chosen.p.text, chosen.p.mono].filter(Boolean).reduce((m, x) => m.set(x.family, [...new Set([...(m.get(x.family) || []), ...x.weights])]), new Map())) : {},
  custom_type: customType,
  jumbo_word: jumboWord,
  shortlist: shortlist.map((r) => ({ id: r.p.id, display: `${r.p.display.family} ${r.p.display.weights.join('/')}`, text: `${r.p.text.family} ${r.p.text.weights.join('/')}`, score: r.s, why: r.why, files: r.files, metrics: metrics[r.p.id] || null }))
};
writeFileSync(join(outDir, 'type-pick.yaml'), '# CWB type pick — verify.mjs --type reads declared_families / declared_weights' + toYaml(pick) + '\n');
if (chosen) {
  const css = tokensCss(chosen);
  writeFileSync(join(outDir, 'type-tokens.css'), css);
  const specPath = opt('--spec', null);
  if (specPath && existsSync(specPath)) {
    const spec = readFileSync(specPath, 'utf8');
    const block = `<!-- cwb:type:start -->\n**Pairing:** ${chosen.p.display.family} (display ${chosen.p.display.weights.join('/')}) + ${chosen.p.text.family} (text ${chosen.p.text.weights.join('/')})${chosen.p.mono ? ` + ${chosen.p.mono.family} (mono)` : ''} · ${chosen.p.provider} · ${chosen.p.licence} · picked by ${pick.chosen.picked_by}\n\nWhy: ${chosen.why.join('; ')}.\n\n\`\`\`css\n${css}\`\`\`\n<!-- cwb:type:end -->`;
    const next = /<!-- cwb:type:start -->[\s\S]*?<!-- cwb:type:end -->/.test(spec) ? spec.replace(/<!-- cwb:type:start -->[\s\S]*?<!-- cwb:type:end -->/, block) : spec + '\n\n## Type (type picker)\n\n' + block + '\n';
    writeFileSync(specPath, next);
  }
  if (tastePath && opt('--choose', null)) {
    const t = taste; t.type = t.type || {};
    t.type.liked_pairings = [...new Set([...(t.type.liked_pairings || []), chosen.p.id])];
    t.type.liked_families = [...new Set([...(t.type.liked_families || []), ...fams(chosen.p)])];
    const rejected = shortlist.filter((r) => r.p.id !== chosen.p.id).map((r) => r.p.id);
    t.type.passed_over = [...new Set([...(t.type.passed_over || []), ...rejected])].slice(-30);
    writeFileSync(tastePath, '# CWB taste profile — updated by motion/type pickers' + toYaml(t) + '\n');
  }
}
console.log(JSON.stringify({ custom_type: customType.map((c) => `${c.style} ${c.id} (${c.score})`), out: outDir, mode, shortlist: pick.shortlist.map((s) => `${s.id} (${s.score})`), chosen: pick.chosen && pick.chosen.id }, null, 2));
