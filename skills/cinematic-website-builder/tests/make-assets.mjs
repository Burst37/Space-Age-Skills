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

/* v3.3: tiny labelled placeholder loops for expand-panels + video-chapters.
   Needs ffmpeg; the committed files under assets/video/ are used when it is absent. */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const vdir = join(dir, 'video');
mkdirSync(vdir, { recursive: true });
const clips = [['a', 'orange'], ['b', 'teal'], ['c', 'purple'], ['d', 'olive'], ['e', 'navy']];
let ff = true; try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch { ff = false; }
for (const [name, color] of clips) {
  const mp4 = join(vdir, `clip-${name}.mp4`), jpg = join(vdir, `clip-${name}.jpg`);
  if (!ff) { if (!existsSync(mp4)) console.warn('ffmpeg missing and', mp4, 'absent'); continue; }
  const src = `color=c=${color}:s=480x640:d=2,drawbox=x='mod(t*200,480)':y=0:w=60:h=640:color=white@0.35:t=fill`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', src, '-vf', `drawtext=text='CLIP ${name.toUpperCase()}':fontcolor=white:fontsize=48:x=40:y=560`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '34', '-movflags', '+faststart', '-an', mp4]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-frames:v', '1', '-q:v', '6', jpg]);
}
console.log('video placeholders in', vdir);

/* v3.5: fixtures the export could not carry as binaries, regenerated here so tests/run-all.sh is self-contained. */
writeFileSync(join(dir, 'subject-cutout.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700"><ellipse cx="300" cy="230" rx="110" ry="130" fill="hsl(25 45% 62%)"/><path d="M80 700c0-190 100-290 220-290s220 100 220 290z" fill="hsl(200 30% 28%)"/></svg>`);
writeFileSync(join(dir, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#111"/><circle cx="16" cy="16" r="7" fill="#fff"/></svg>`);
const { loadDep } = await import('../scripts/lib/util.mjs');
const pw = await loadDep('playwright');
if (!pw) console.warn('playwright missing: letter-check fixtures not written');
else {
  const browser = await pw.chromium.launch(), page = await browser.newPage({ viewport: { width: 900, height: 320 } });
  for (const word of ['HOPE', 'HOPF']) {
    await page.setContent(`<body style="margin:0;display:grid;place-items:center;height:100vh;background:#fff;font:700 200px/1 Arial,Helvetica,sans-serif;letter-spacing:.06em">${word}`);
    await page.screenshot({ path: join(dirname(dir), 'fixtures', `letters-${word.toLowerCase()}.png`) });
  }
  await browser.close();
  console.log('letter-check fixtures written');
}
