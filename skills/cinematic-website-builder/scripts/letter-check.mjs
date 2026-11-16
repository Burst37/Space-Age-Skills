#!/usr/bin/env node
/**
 * CWB letter check — AI-rendered words must spell the target word before they ship.
 *
 *   node scripts/letter-check.mjs handoff/type/ai-letters.yaml [--sheet handoff/type/letter-review.html]
 *   node scripts/letter-check.mjs --file assets/type/hope.webp --word HOPE
 *   node scripts/letter-check.mjs handoff/type/ai-letters.yaml --confirm hope.webp   (after a visual check)
 *
 * ai-letters.yaml:  letters: [{ file: assets/type/hope.png, word: HOPE }, …]   (paths relative to the yaml)
 * For each render: flatten transparency onto white and onto black, OCR both (tesseract.js), compare the
 * normalised reading with the target word.
 *   status pass       — OCR reads exactly the word (either background)
 *   status FAIL       — OCR confidently reads different letters (≥ 70 conf) → regenerate; the build rejects it
 *   status review     — OCR unsure (3D fur/glass often defeats OCR) → open the review sheet, compare the crop
 *                       letter by letter with the target word, then --confirm <file> (records confirmed: true)
 * verify.mjs --letters <ai-letters.yaml> blocks any <img data-ai-word> whose file is not pass/confirmed,
 * or whose data-ai-word differs from the manifest word.
 * Exit 1 if any entry is FAIL or still review.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { loadDep, readYaml, toYaml } from './lib/util.mjs';

const args = process.argv.slice(2);
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const VALUE = new Set(['--file', '--word', '--sheet', '--confirm']);
const manifestPath = args.find((a, i) => !a.startsWith('--') && !VALUE.has(args[i - 1]));
let entries, baseDir, doc = null;
if (manifestPath) { doc = await readYaml(manifestPath); entries = doc.letters || []; baseDir = dirname(resolve(manifestPath)); }
else if (opt('--file')) { entries = [{ file: opt('--file'), word: opt('--word', '') }]; baseDir = process.cwd(); }
else { console.error('usage: letter-check.mjs <ai-letters.yaml> [--sheet f] [--confirm file] | --file img --word WORD'); process.exit(2); }
const norm = (s) => String(s || '').toUpperCase().normalize('NFKD').replace(/[^A-Z0-9]/g, '');

const confirm = opt('--confirm', null);
if (confirm && doc) {
  const e = entries.find((x) => x.file === confirm || basename(x.file) === confirm);
  if (!e) { console.error('no such entry: ' + confirm); process.exit(2); }
  e.confirmed = true; e.status = 'confirmed'; e.confirmed_at = new Date().toISOString();
  writeFileSync(manifestPath, '# AI lettering manifest — scripts/letter-check.mjs' + toYaml(doc) + '\n');
  console.log(`confirmed ${e.file} = ${e.word}`); process.exit(0);
}

const T = await loadDep('tesseract.js');
const pw = await loadDep('playwright');
if (!T || !pw) { console.error('letter-check: needs tesseract.js and playwright (npm i -D tesseract.js playwright, or CWB_NODE_MODULES)'); process.exit(2); }
const browser = await pw.chromium.launch();
const page = await browser.newPage();
/* flatten onto a background, upscale small renders, return PNG buffer */
async function flatten(file, bg) {
  const data = readFileSync(file).toString('base64');
  const mime = /\.webp$/i.test(file) ? 'image/webp' : /\.jpe?g$/i.test(file) ? 'image/jpeg' : 'image/png';
  await page.setContent(`<body style="margin:0;background:${bg}"><img id="i" src="data:${mime};base64,${data}" style="display:block;max-height:420px;padding:40px;background:${bg}"></body>`);
  await page.waitForFunction(() => document.getElementById('i').complete);
  return page.locator('#i').screenshot();
}
/* traineddata is cached outside the project (first run downloads ~10MB from the tesseract.js CDN, free) */
const worker = await T.createWorker('eng', 1, { cachePath: process.env.CWB_TESSDATA || join(tmpdir(), 'cwb-tesseract') });
await worker.setParameters({ tessedit_pageseg_mode: '7', tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&\' ' });
const sheetRows = [];
for (const e of entries) {
  const file = resolve(baseDir, e.file);
  if (!existsSync(file)) { e.status = 'FAIL'; e.reason = 'file missing'; continue; }
  if (e.confirmed) { e.status = 'confirmed'; sheetRows.push({ e, file }); continue; }
  const want = norm(e.word);
  const reads = [];
  for (const bg of ['#fff', '#000']) {
    const png = await flatten(file, bg);
    const { data } = await worker.recognize(png);
    reads.push({ bg, text: data.text.trim(), conf: Math.round(data.confidence) });
  }
  e.ocr = reads.map((r) => `${r.bg}: "${r.text}" (${r.conf})`);
  if (reads.some((r) => norm(r.text) === want)) e.status = 'pass';
  else if (reads.some((r) => r.conf >= 70 && norm(r.text).length >= Math.max(1, want.length - 1))) { e.status = 'FAIL'; e.reason = `reads "${reads.find((r) => r.conf >= 70).text}", expected "${e.word}"`; }
  else e.status = 'review';
  e.checked_at = new Date().toISOString();
  sheetRows.push({ e, file });
}
await worker.terminate();
const sheet = opt('--sheet', manifestPath ? join(baseDir, 'letter-review.html') : null);
if (sheet) {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  writeFileSync(sheet, `<!doctype html><meta charset="utf-8"><title>Letter review</title><style>body{font:15px system-ui;background:#eee;margin:24px}.r{display:grid;grid-template-columns:1fr 1fr 220px;gap:16px;align-items:center;background:#fff;padding:12px;margin:10px 0;border-radius:8px}.r img{max-height:180px;max-width:100%;background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0/16px 16px}.w{font:800 64px/1 Arial,sans-serif;letter-spacing:.06em}.FAIL{color:#b00020}.review{color:#9a6700}.pass,.confirmed{color:#0a7a2f}</style>
<h1>AI lettering — compare each render with the target word, letter by letter</h1><p>Wrong, missing, doubled or extra letters = regenerate. Unsure OCR = confirm by eye: <code>node scripts/letter-check.mjs ai-letters.yaml --confirm &lt;file&gt;</code></p>
${sheetRows.map(({ e, file }) => `<div class="r"><img src="${esc(relative(dirname(resolve(sheet)), file))}" alt=""><div class="w">${esc(e.word)}</div><div><b class="${esc(e.status)}">${esc(e.status)}</b><br><small>${esc((e.ocr || []).join(' · '))}${e.reason ? '<br>' + esc(e.reason) : ''}</small></div></div>`).join('\n')}`);
}
await browser.close();
if (doc) writeFileSync(manifestPath, '# AI lettering manifest — scripts/letter-check.mjs' + toYaml(doc) + '\n');
const bad = entries.filter((e) => !['pass', 'confirmed'].includes(e.status));
console.log(JSON.stringify(entries.map((e) => ({ file: e.file, word: e.word, status: e.status, ocr: e.ocr, reason: e.reason })), null, 2));
process.exit(bad.length ? 1 : 0);
