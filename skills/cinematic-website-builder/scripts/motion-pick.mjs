#!/usr/bin/env node
/**
 * CWB motion picker — turn wireframe sections + sector + moodboard + taste into a motion plan.
 *
 *   node scripts/motion-pick.mjs handoff/wireframe.yaml [--sector home-healthcare] [--tier enhanced]
 *        [--moodboard handoff/moodboard.yaml] [--taste taste-profile.yaml] [--mode auto|review]
 *        [--out handoff] [--demo-base ../tests/gallery.dist.html]
 *        [--accept] [--swap "home/services=expanding-video-panels,home/hero=hero-film"]
 *
 * Decides from (a) taste profile (always/liked/disliked, signature style), (b) sector (trust sectors
 * get the gentle profile: no bold-only effects, gentle variants, CSS-first), (c) moodboard reference
 * effects (phrases mapped through the catalog's `says` vocabulary — the animation-vocabulary /
 * site-reverse-engineer output), (d) motion budget per tier with ONE signature moment per page.
 *
 * Writes:  <out>/motion-plan.yaml   (verify.mjs --motion-plan enforces it)
 *          <out>/motion-review.html (one screen: each pick, plain-English name, live demo, alternates)
 * --accept (review mode, after Chuma approves) and --swap record the decision in the taste profile.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readYaml, toYaml } from './lib/util.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const VALUE = new Set(['--sector', '--tier', '--moodboard', '--taste', '--mode', '--out', '--demo-base', '--swap', '--catalog']);
const wfPath = args.find((a, i) => !a.startsWith('--') && !VALUE.has(args[i - 1]));
if (!wfPath) { console.error('usage: motion-pick.mjs <wireframe.yaml> [--sector s] [--tier t] [--moodboard f] [--taste f] [--mode auto|review] [--out dir] [--accept] [--swap a=b]'); process.exit(2); }
const wf = await readYaml(wfPath);
const cat = (await readYaml(opt('--catalog', join(HERE, '..', 'references', 'motion-catalog.yaml')))).effects;
const byId = Object.fromEntries(cat.map((e) => [e.id, e]));
const tastePath = opt('--taste', join(HERE, '..', 'taste-profile.yaml'));
const taste = existsSync(tastePath) ? await readYaml(tastePath) : {};
const tm = taste.motion || {};
const moodPath = opt('--moodboard', null);
const mood = moodPath && existsSync(moodPath) ? await readYaml(moodPath) : { references: [] };
const sector = String(opt('--sector', (wf.site && wf.site.sector) || '')).toLowerCase();
const TRUST = /^(law|legal|saas|medical|dental|home-healthcare|senior-care|healthcare|therapy|pharmacy|telehealth|finance|insurance)$/;
const trust = TRUST.test(sector);
const profile = trust ? 'gentle' : 'bold';
const tier = opt('--tier', trust ? 'enhanced' : 'cinematic');
const BUDGET = { factory: 30, enhanced: 45, cinematic: 70, flagship: 100 }[tier] || 45;
const mode = opt('--mode', 'review');
const outDir = resolve(opt('--out', dirname(wfPath)));
mkdirSync(outDir, { recursive: true });

/* (c) moodboard phrases → catalog ids */
const moodHits = {};
for (const ref of mood.references || []) for (const ph of ref.effects || []) {
  const p = String(ph).toLowerCase();
  const hit = byId[p] ? byId[p] : cat.find((e) => (e.says || []).some((s) => p.includes(s) || s.includes(p)) || e.plain.toLowerCase().includes(p));
  if (hit) (moodHits[hit.id] = moodHits[hit.id] || []).push(ref.url || ref.id || 'moodboard');
}
const allowed = (e) => !(trust && e.profile === 'bold') && !(tm.disliked || []).includes(e.id);
function score(e, why) {
  let s = 10;
  if ((tm.always || []).includes(e.module) || (tm.always || []).includes(e.id)) { s += 40; why.push('taste profile: always'); }
  if (taste.signature_style && (e.id === taste.signature_style || e.module === 'video-chapters' && taste.signature_style === 'video-per-section')) { s += 25; why.push('Chuma\'s signature style'); }
  if ((tm.liked || []).includes(e.id)) { s += 15; why.push('taste profile: liked before'); }
  if (moodHits[e.id]) { s += 20; why.push(`seen on moodboard: ${moodHits[e.id].slice(0, 2).join(', ')}`); }
  if (trust && e.cost <= 3) { s += 6; why.push('quiet + cheap suits a trust sector'); }
  const tt = taste.type || {};
  if (tt.signature === 'jumbo' && /^(depth-parallax|jumbo-line-reveal|jumbo-scrub)$/.test(e.id)) { s += e.id === 'depth-parallax' && !trust ? 22 : 8; why.push('jumbo type is Chuma\'s signature' + (e.id === 'depth-parallax' ? ' (type behind subject = his favourite)' : '')); }
  if (!trust && e.signature) { s += 4; }
  s -= e.cost * (trust ? 1.2 : 0.4);
  return s;
}

/* expand wireframe pages (templates + each) */
function expandPages(w) {
  const out = [];
  for (const p of w.pages || []) {
    if (p.use && p.each) {
      const t = (w.templates || {})[p.use] || {};
      for (const v of p.each) {
        const sub = (s) => typeof s === 'string' ? s.replace(/\{(\w+)\}/g, (_, k) => k === 'lower' ? String(v.name || '').toLowerCase() : (v[k] ?? `{${k}}`)) : s;
        out.push({ path: sub(p.path), slug: v.slug, sections: (t.sections || []).map((s) => Object.fromEntries(Object.entries(s).map(([k, x]) => [k, Array.isArray(x) ? x.map(sub) : sub(x)]))) });
      }
    } else out.push(p);
  }
  return out;
}
const pages = expandPages(wf);
const swaps = Object.fromEntries(String(opt('--swap', '')).split(',').filter(Boolean).map((x) => x.split('=').map((s) => s.trim())));

const plan = { generated: new Date().toISOString(), mode, sector, profile, tier, budget: BUDGET, style: null, libraries: {}, min_scrolltriggers: 0, smooth_scroll: null, sections: [], pages: [] };
const review = [];
for (const pg of pages) {
  let spent = 0, signature = null, styleCharged = false;
  const rows = [];
  for (const sec of pg.sections || []) {
    const kind = sec.kind || 'text';
    const key = `${pg.slug || pg.path}/${sec.id}`;
    const filmy = sec.media === 'film';
    /* film effects only where the wireframe plans film; sections without video use stills */
    let cands = cat.filter((e) => allowed(e) && (e.fits || []).includes(kind) && e.id !== 'soft-lenis' && (filmy || !['video-per-section', 'hero-film'].includes(e.id)));
    if (filmy && allowed(byId['video-per-section'])) cands.push(byId['video-per-section']);
    if (kind === 'hero' && filmy) cands.push(byId['hero-film']);
    cands = [...new Set(cands)];
    const scored = cands.map((e) => { const why = []; return { e, s: score(e, why) + (filmy && /video|film/.test(e.id) ? 12 : 0), why: filmy && /video|film/.test(e.id) ? [...why, 'section is planned with film'] : why }; }).sort((a, b) => b.s - a.s);
    let pick = scored[0] || null;
    if (swaps[key] && byId[swaps[key]]) { const e = byId[swaps[key]]; pick = { e, s: 999, why: ['swapped in by Chuma (review)'] }; }
    /* video-per-section is a page-level STYLE: one module on <main>, cost once, never "uses up" the signature */
    const isStyle = (x) => x && x.e.module === 'video-chapters';
    /* one signature per page; budget */
    if (pick && !isStyle(pick) && pick.e.signature && signature && !swaps[key]) pick = scored.find((x) => !x.e.signature || isStyle(x)) || null;
    const costOf = (x) => (isStyle(x) && styleCharged ? 0 : x.e.cost);
    if (pick && spent + costOf(pick) > BUDGET * 0.95) pick = scored.find((x) => spent + costOf(x) <= BUDGET * 0.95 && !x.e.signature) || null;
    if (!pick) continue;
    if (pick.e.signature && !isStyle(pick) && !signature) signature = key;
    spent += costOf(pick);
    if (isStyle(pick)) styleCharged = true;
    const e = pick.e;
    const variant = profile === 'gentle' ? (e.gentle || 'gentle') : (e.bold || 'default');
    const row = { id: sec.id, page: pg.path, kind, effect: e.id, plain: e.plain, technical: e.technical, technique: e.technique, module: e.module, variant: profile, variant_notes: variant, cost: e.cost, signature: signature === key, why: pick.why, alternates: scored.slice(1, 3).map((x) => x.e.id) };
    if (e.module === 'expand-panels') row.markup = `data-cwb="expand-panels" data-variant="${profile}"`;
    if (e.module === 'css-view-reveal') row.markup = profile === 'gentle' ? 'data-nreveal="gentle"' : 'data-nreveal';
    if (e.module === 'css-view-zoom') row.markup = 'data-nzoom';
    rows.push(row);
    /* jumbo signature, non-regulated: the hero gets type-behind-subject depth as its type layer (Chuma's favourite) */
    const dp = byId['depth-parallax'];
    if (/^hero$/.test(kind) && !trust && dp && e.id !== dp.id && (taste.type || {}).signature === 'jumbo' && allowed(dp) && !signature) {
      signature = key; spent += dp.cost;
      rows.push({ id: sec.id, page: pg.path, kind, layer: 'type', effect: dp.id, plain: dp.plain, technical: dp.technical, technique: dp.technique, module: dp.module, variant: profile, variant_notes: dp.bold, cost: dp.cost, signature: true, why: ['custom type style 1 (type behind subject) is the auto-pick default outside regulated sectors'], alternates: ['jumbo-scrub', 'material-loop'] });
    }
    /* hero headlines also get a text effect (layered on the media pick) */
    const head = (taste.type && taste.type.signature === 'jumbo' && byId['jumbo-line-reveal']) || byId['masked-headline-reveal'];
    if (/^hero/.test(kind) && e.id !== head.id && allowed(head) && spent + head.cost <= BUDGET * 0.95) {
      spent += head.cost;
      rows.push({ id: sec.id, page: pg.path, kind, layer: 'headline', effect: head.id, plain: head.plain, technical: head.technical, technique: head.technique, module: head.module, variant: profile, variant_notes: profile === 'gentle' ? head.gentle : head.bold, cost: head.cost, signature: false, why: ['hero headline layer', ...((tm.liked || []).includes(head.id) ? ['taste profile: liked before'] : [])], alternates: ['word-brighten', 'scroll-reveal'] });
      for (const l of head.libs || []) plan.libraries[l] = true;
    }
    for (const l of e.libs || []) plan.libraries[l] = true;
    if (/scrolltrigger/.test((e.libs || []).join())) plan.min_scrolltriggers += 1;
  }
  /* (a) taste always + page-level effects */
  plan.pages.push({ path: pg.path, motion_cost: spent, signature });
  plan.sections.push(...rows);
  review.push({ page: pg.path, rows, spent, signature });
}
if (plan.sections.some((s) => s.module === 'video-chapters')) plan.style = 'video-per-section';
const smooth = allowed(byId['soft-lenis']) && (tm.smooth_scroll || moodHits['soft-lenis']);
if (smooth) { plan.smooth_scroll = trust ? 'soft' : (tm.smooth_scroll === 'soft' ? 'soft' : 'standard'); plan.libraries.lenis = true; plan.libraries.gsap = true; }
if (plan.libraries.splittext || plan.libraries.scrolltrigger) plan.libraries.gsap = true;
plan.min_scrolltriggers = Math.min(plan.min_scrolltriggers, 3);
plan.notes = [
  trust ? 'Subtle-cinematic profile: CSS-first, GSAP only for the signature moment, gentle variants, one autoplay loop at a time.' : 'Bold profile: one signature moment per page, everything around it stays quiet.',
  `Smooth scroll: ${plan.smooth_scroll ? `<html data-cwb-smooth="${plan.smooth_scroll}"> (desktop fine pointer only)` : 'native'}.`,
  'verify.mjs --motion-plan fails the build if a library, module or CSS timeline named here is not running.'
];
plan.approved = mode === 'auto' || args.includes('--accept');
writeFileSync(join(outDir, 'motion-plan.yaml'), '# CWB motion plan — generated by scripts/motion-pick.mjs; enforced by verify.mjs --motion-plan' + toYaml(plan) + '\n');

/* review screen */
const demoBase = opt('--demo-base', relative(outDir, join(HERE, '..', 'tests', 'gallery.dist.html')));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const seen = new Set();
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Motion picks</title><style>
body{margin:0;font:15px/1.45 system-ui,sans-serif;background:#101114;color:#eee}header{padding:16px 24px;border-bottom:1px solid #2a2c33}
h1{font-size:20px;margin:0}main{padding:16px 24px;display:grid;gap:22px}h2{font-size:16px;margin:0 0 8px;color:#aab}
.row{display:grid;grid-template-columns:260px 1fr 360px;gap:16px;align-items:start;background:#17181d;border-radius:10px;padding:12px}
.row b{display:block;font-size:16px}.tech{color:#9aa;font-size:13px}.sig{color:#f3b35b;font-weight:700}
iframe{width:360px;height:220px;border:0;border-radius:8px;background:#000}ul{margin:4px 0 0 18px;padding:0;color:#bbb;font-size:13px}</style></head><body>
<header><h1>Motion picks — ${esc(wf.site && wf.site.name)} · ${esc(sector)} · ${profile} profile · ${mode} mode</h1>
<p>Each row: the section, what you'll see (plain words), and a live demo. Approve, or reply "swap &lt;page/section&gt; to &lt;effect&gt;" (alternates listed). Smooth scroll: ${esc(plan.smooth_scroll || 'native')}.</p></header><main>
${review.filter((r) => r.rows.length).slice(0, 6).map((r) => `<section><h2>${esc(r.page)} · motion cost ${r.spent}/${BUDGET}${r.signature ? ' · signature: ' + esc(r.signature) : ''}</h2>
${r.rows.map((x) => { const demo = !seen.has(x.effect); seen.add(x.effect); return `<div class="row"><div><b>${esc(x.id)}</b><span class="tech">${esc(x.kind)}</span>${x.signature ? '<div class="sig">★ signature moment</div>' : ''}</div>
<div><b>${esc(x.plain)}</b><div class="tech">${esc(x.technical)} — ${esc(x.technique)}</div><ul>${x.why.map((w) => `<li>${esc(w)}</li>`).join('')}<li>alternates: ${x.alternates.map(esc).join(', ') || '—'}</li></ul></div>
<div>${demo ? `<iframe loading="lazy" title="demo ${esc(x.effect)}" src="${esc(demoBase)}?focus=${esc(x.module)}"></iframe>` : '<span class="tech">(demo shown above)</span>'}</div></div>`; }).join('\n')}</section>`).join('\n')}
${review.filter((r) => r.rows.length).length > 6 ? `<p>${review.length - 6} more pages follow the same pattern (see motion-plan.yaml).</p>` : ''}
</main></body></html>`;
writeFileSync(join(outDir, 'motion-review.html'), html);

/* feedback into the taste profile */
if ((args.includes('--accept') || Object.keys(swaps).length) && existsSync(tastePath)) {
  const t = taste; t.motion = t.motion || {};
  const picked = [...new Set(plan.sections.map((s) => s.effect))];
  t.motion.liked = [...new Set([...(t.motion.liked || []), ...picked])];
  const swappedOut = Object.keys(swaps).map((k) => { const [pgSlug] = k.split('/'); return null; }).filter(Boolean);
  t.motion.disliked = [...new Set([...(t.motion.disliked || []), ...swappedOut])];
  writeFileSync(tastePath, '# CWB taste profile — updated by motion/type pickers' + toYaml(t) + '\n');
}
console.log(JSON.stringify({ out: join(outDir, 'motion-plan.yaml'), review: join(outDir, 'motion-review.html'), profile, tier, budget: BUDGET, style: plan.style, smooth: plan.smooth_scroll, libraries: plan.libraries,
  picks: plan.sections.slice(0, 12).map((s) => `${s.page} ${s.id}: ${s.effect}${s.signature ? ' ★' : ''}`), total_sections: plan.sections.length }, null, 2));
