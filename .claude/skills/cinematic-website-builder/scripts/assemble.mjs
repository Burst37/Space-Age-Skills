#!/usr/bin/env node
/**
 * CWB assemble — turn an authored page into ONE self-contained production HTML file.
 *
 *   node scripts/assemble.mjs <page.html> [-o dist/index.html] [--all] [--with a,b]
 *
 * The page is authored from templates/starter.html. It keeps two markers:
 *   <!-- @cwb:css -->   (inside <head>)     → base tokens + only the CSS blocks used
 *   <!-- @cwb:js -->    (end of <body>)     → CDN tags for only the GSAP plugins used
 *                                            + runtime + only the JS blocks used
 * Modules are detected from data-cwb="…" values, [data-reveal], [data-nreveal],
 * .scroll-progress, and --with (e.g. --with page-transition). --all ships everything
 * (used by the test gallery). Output has zero build-step requirements.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RT = join(HERE, '..', 'runtime');
const GSAP = '3.15.0';
const LENIS = '1.3.26';
const CDN = (f) => `https://cdnjs.cloudflare.com/ajax/libs/gsap/${GSAP}/${f}.min.js`;

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('-') && args[args.indexOf(a) - 1] !== '-o' && args[args.indexOf(a) - 1] !== '--with');
if (!input) { console.error('usage: assemble.mjs <page.html> [-o out.html] [--all] [--with a,b]'); process.exit(2); }
const out = args.includes('-o') ? args[args.indexOf('-o') + 1] : input.replace(/\.html$/, '.dist.html');
const all = args.includes('--all');
const extra = args.includes('--with') ? args[args.indexOf('--with') + 1].split(',') : [];

function blocks(src, re) {
  const map = new Map();
  for (const m of src.matchAll(re)) map.set(m[1], { head: m[2] || '', body: m[0] });
  return map;
}
const jsSrc = readFileSync(join(RT, 'cwb-modules.js'), 'utf8');
const cssSrc = readFileSync(join(RT, 'cwb-modules.css'), 'utf8');
const JS = blocks(jsSrc, /\/\* @module ([\w-]+) \|([^*]*)\*\/[\s\S]*?\/\* @end \1 \*\//g);
const CSS = blocks(cssSrc, /\/\* @module ([\w-]+) \*\/[\s\S]*?\/\* @end \1 \*\//g);

let page = readFileSync(input, 'utf8');
if (!page.includes('<!-- @cwb:css -->') || !page.includes('<!-- @cwb:js -->')) {
  console.error('assemble: page is missing <!-- @cwb:css --> or <!-- @cwb:js --> markers'); process.exit(2);
}

const used = new Set(extra);
if (all) { JS.forEach((_, k) => used.add(k)); CSS.forEach((_, k) => used.add(k)); }
for (const m of page.matchAll(/data-cwb="([^"]+)"/g)) m[1].split(/\s+/).forEach((n) => used.add(n));
if (/data-reveal[\s>=]/.test(page)) used.add('reveal');
if (/data-nreveal|class="[^"]*scroll-progress/.test(page)) used.add('native-reveal');

const unknown = [...used].filter((n) => !JS.has(n) && !CSS.has(n));
if (unknown.length) { console.error('assemble: unknown module(s): ' + unknown.join(', ')); process.exit(1); }

const plugins = new Set(['ScrollTrigger']);
let cost = 0;
for (const n of used) {
  const head = JS.get(n)?.head || '';
  const p = head.match(/plugins:\s*([^|]*)/);
  if (p) p[1].trim().split(/\s+/).filter((x) => x && x !== '—').forEach((x) => plugins.add(x));
  const c = head.match(/cost:\s*(\d+)/);
  if (c) cost += Number(c[1]);
}
const order = ['ScrollTrigger', 'SplitText', 'ScrambleTextPlugin', 'DrawSVGPlugin', 'Flip', 'Observer', 'Draggable', 'InertiaPlugin', 'CustomEase'];
const pluginTags = order.filter((p) => plugins.has(p)).map((p) => `<script src="${CDN(p)}" defer></script>`);
const smooth = /<html[^>]*data-cwb-smooth/.test(page);

const css = [readFileSync(join(RT, 'cwb-base.css'), 'utf8'), ...[...used].filter((n) => CSS.has(n)).map((n) => CSS.get(n).body)].join('\n');
const js = [
  readFileSync(join(RT, 'cwb-runtime.js'), 'utf8'),
  ...[...JS.keys()].filter((n) => used.has(n)).map((n) => JS.get(n).body)
].join('\n');

/* defer on CDN tags keeps parsing unblocked; the inline kernel boots on
   DOMContentLoaded, which fires only after all deferred scripts have run. */
const jsOut = [
  `<script src="${CDN('gsap')}" defer></script>`,
  ...pluginTags,
  smooth ? `<script src="https://cdn.jsdelivr.net/npm/lenis@${LENIS}/dist/lenis.min.js" defer></script>` : '',
  `<script>\n${js}\n</script>`
].filter(Boolean).join('\n');

/* Function replacers: a string replacement would expand `$'` / `$&` inside the JS (e.g. api.$('…')). */
page = page.replace('<!-- @cwb:css -->', () => `<style>\n${css}\n</style>`).replace('<!-- @cwb:js -->', () => jsOut);
mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(out, page);
const kb = (Buffer.byteLength(page) / 1024).toFixed(1);
console.log(JSON.stringify({ out, modules: [...used].sort(), plugins: [...plugins], motionCost: cost, smooth, kb: Number(kb) }, null, 2));
