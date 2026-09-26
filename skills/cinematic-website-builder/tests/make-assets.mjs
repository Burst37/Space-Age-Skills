#!/usr/bin/env node
/* Generates deterministic SVG stand-in media for the module gallery test:
   8 "photos" and a 48-frame sequence for frame-scrub. No network, no binaries. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'assets');
mkdirSync(join(dir, 'seq'), { recursive: true });
const hues = [25, 45, 200, 260, 320, 150, 10, 90];

hues.forEach((h, i) => writeFileSync(join(dir, `photo-${i + 1}.svg`),
`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 70% 55%)"/><stop offset="1" stop-color="hsl(${(h + 60) % 360} 60% 18%)"/></linearGradient></defs>
<rect width="1200" height="900" fill="url(#g)"/><circle cx="${300 + i * 80}" cy="450" r="220" fill="hsl(${h} 90% 80% / .35)"/>
<text x="60" y="840" font-family="sans-serif" font-size="64" font-weight="700" fill="#fff">Frame ${i + 1}</text></svg>`));

for (let f = 1; f <= 48; f++) {
  const t = (f - 1) / 47;
  writeFileSync(join(dir, 'seq', `f_${String(f).padStart(3, '0')}.svg`),
`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<rect width="1280" height="720" fill="hsl(${220 + t * 60} 40% ${8 + t * 10}%)"/>
<circle cx="${160 + t * 960}" cy="${360 - Math.sin(t * Math.PI) * 180}" r="${60 + t * 90}" fill="hsl(${30 + t * 20} 90% 60%)"/>
<text x="40" y="680" font-family="monospace" font-size="28" fill="#fff">frame ${f}/48</text></svg>`);
}
console.log('assets written to', dir);
