#!/usr/bin/env node
/**
 * Copy Chuma's custom-typography references into references/type-refs/ and build the visual index
 * the type picker shows him (he picks visually):
 *   references/type-refs/<NN>-s<style>-<prefix>.<ext>   copies (originals untouched)
 *   references/type-refs/INDEX.png                      contact sheet, one tile per reference, labelled by style
 *   references/type-refs/INDEX.md                       table: number, style(s), title, file
 *
 *   node scripts/type-refs-index.mjs [--src <attachments dir>] [--labels references/type-refs/labels.yaml]
 * labels.yaml: refs: [{prefix, batch, styles, label, title}] — set `label` after looking at an image.
 * Missing files are listed (exit 0) so the index can be rebuilt once they sync.
 */
import { readdirSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDep, readYaml } from './lib/util.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, '..', 'references', 'type-refs');
const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const L = await readYaml(opt('--labels', join(DIR, 'labels.yaml')));
const src = opt('--src', L.source);
const files = existsSync(src) ? readdirSync(src) : [];
const STYLE = { 1: 'type behind subject', 2: '3D material', 3: 'sci-fi display + alternates', 4: 'textured / video fill', 5: 'mixed pairing / echo', 6: 'curved / ring', 7: 'inflated / balloon', 8: 'glass / water', 9: 'tube / neon script', 10: 'sticker / graffiti / food', 11: 'object-composed', 12: 'jumbo + 3D character', 13: 'food & candy', 14: 'gem & crystal', 15: 'textile & pillow', 16: 'giant object in scene', 17: 'chrome & iridescent', 18: 'glass UI over text', 19: 'jumbo depth layouts', 20: 'white matte tube', 21: 'AI alphabet set / glyph kit', 22: 'element & nature', 23: 'dreamy chrome on clouds', 24: '3D extruded + echo shadow', 25: 'flat texture fill / bevel / neon outline', 26: 'texture library (material ref)' };
const rows = [], missing = [];
L.refs.forEach((r, i) => {
  const f = files.find((x) => x.startsWith(r.prefix) && /\.(png|jpe?g|webp|gif|avif)$/i.test(x));
  const n = String(i + 1).padStart(2, '0');
  const style = String(r.label || '').trim();
  if (!f) { missing.push(r.prefix); rows.push({ n, r, style, file: null }); return; }
  const out = `${n}-s${(style || 'x').replace(/[^\d]+/g, '_')}-${r.prefix}${extname(f).toLowerCase()}`;
  copyFileSync(join(src, f), join(DIR, out));
  rows.push({ n, r, style, file: out });
});
const desc = (s, cands) => s ? s.split(/[ ,]+/).map((k) => `${k} ${STYLE[k] || ''}`.trim()).join(' + ') : `unlabelled (batch candidates: styles ${cands})`;
writeFileSync(join(DIR, 'INDEX.md'), [
  '# Custom-typography references: visual index', '',
  `${rows.length} references (${rows.length - missing.length} on disk). Styles are in ../custom-typography.md. The picker shows INDEX.png and Chuma picks by number.`, '',
  '| # | style | title | file |', '|---|---|---|---|',
  ...rows.map(({ n, r, style, file }) => `| ${n} | ${desc(style, r.styles)} | ${r.title || ''} | ${file ? `[${file}](${file})` : `_missing: ${r.prefix}…_`} |`), '',
  missing.length ? `Missing (not yet synced to the box): ${missing.join(', ')}. Re-run \`node scripts/type-refs-index.mjs\` when they arrive.` : 'All references present.', ''].join('\n'));
const have = rows.filter((x) => x.file);
if (have.length) {
  const pw = await loadDep('playwright');
  if (pw) {
    const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111;color:#eee;font:600 13px system-ui;padding:12px}.g{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}figure{margin:0;background:#222;border-radius:6px;overflow:hidden}img{width:100%;aspect-ratio:1;object-fit:cover;display:block}figcaption{padding:4px 6px}</style><div class="g">${have.map((x) => `<figure><img src="${x.file}"><figcaption>#${x.n} · ${x.style ? 'style ' + x.style : 'batch ' + x.r.batch}</figcaption></figure>`).join('')}</div>`;
    writeFileSync(join(DIR, '.index.html'), html);
    const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
    await p.goto('file://' + join(DIR, '.index.html')); await p.waitForTimeout(800);
    await p.screenshot({ path: join(DIR, 'INDEX.png'), fullPage: true }); await b.close();
  }
}
console.log(JSON.stringify({ total: rows.length, copied: have.length, missing: missing.length }, null, 2));
