// Device QA for the web experience. Usage: node qa.mjs <index.html> <outdir>
// Chromium only (Safari/Firefox are covered by feature fallbacks, not by this run).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const file = path.resolve(process.argv[2]), out = path.resolve(process.argv[3] || 'qa'); fs.mkdirSync(out, { recursive: true });
const profiles = [
  ['iphone', { ...devices['iPhone 14'] }, {}],
  ['ipad', { ...devices['iPad (gen 7)'] }, {}],
  ['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, {}],
  ['desktop-rm', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' }, {}],
  ['iphone-rm', { ...devices['iPhone 14'], reducedMotion: 'reduce' }, {}],
];
const report = []; const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--allow-file-access-from-files'] });
const sections = ['top', 'watch', 'numbers', 'week', 'clock', 'meals', 'days', 'shop', 'swap', 'rules', 'track'];
for (const [name, opts] of profiles.map(p => [p[0], p[1]])) {
  const ctx = await browser.newContext(opts); const page = await ctx.newPage(); const errs = [], fails = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push('pageerror: ' + e.message)); page.on('requestfailed', r => fails.push(r.url().slice(-60)));
  await page.goto('file://' + file, { waitUntil: 'load' }); await page.waitForTimeout(1800);
  const r = { profile: name, errs, fails: fails.filter(f => !/\.mp4/.test(f)) };
  const vp = page.viewportSize();
  r.glOK = await page.evaluate(() => !document.documentElement.classList.contains('no-gl') && !!document.getElementById('gl'));
  r.overflowX = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  r.heroCTA = await page.evaluate(() => { const b = document.querySelector('.hero .ctas a').getBoundingClientRect(); return { bottom: Math.round(b.bottom), vh: innerHeight, visible: b.bottom <= innerHeight }; });
  r.fontsOK = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 20px D') && document.fonts.check('400 16px B'); });
  // scroll through every section, screenshot, collect hidden reveal count
  const shots = [];
  for (const id of sections) { await page.evaluate(i => { const e = document.getElementById(i); e && e.scrollIntoView({ block: 'start', behavior: 'instant' }); }, id); await page.waitForTimeout(1900); const f = path.join(out, `${name}-${id}.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 70 }); shots.push(f); }
  r.hiddenReveals = await page.evaluate(() => [...document.querySelectorAll('[data-r]')].filter(e => parseFloat(getComputedStyle(e).opacity) < .05).length);
  r.smallTargets = await page.evaluate(() => [...document.querySelectorAll('button,a.btn,a.l,input,.chip,.tile,.dc')].filter(e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && (b.height < 40 || b.width < 40) && !e.closest('[hidden]') && !(e.type === 'checkbox'); }).map(e => (e.className || e.tagName) + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).slice(0, 12));
  r.imgsBroken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src).length);
  // functional
  const fx = {};
  await page.evaluate(() => document.getElementById('days').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(500);
  await page.click('.tile:nth-child(3)'); await page.waitForTimeout(700); fx.sheetOpen = await page.evaluate(() => document.getElementById('sheet').open); fx.sheetTitle = await page.evaluate(() => document.querySelector('#sheet h3')?.textContent);
  await page.screenshot({ path: path.join(out, `${name}-sheet.jpg`), type: 'jpeg', quality: 70 }); fx.meals = await page.evaluate(() => document.querySelectorAll('#sheet .meal').length);
  await page.click('#sheet [aria-label="Next day"]'); await page.waitForTimeout(300); fx.nextTitle = await page.evaluate(() => document.querySelector('#sheet h3')?.textContent);
  await page.keyboard.press('Escape'); await page.waitForTimeout(300); fx.sheetClosed = await page.evaluate(() => !document.getElementById('sheet').open);
  await page.evaluate(() => document.getElementById('meals').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(800);
  fx.active0 = await page.evaluate(() => document.getElementById('dpos').textContent); await page.click('#dnext'); await page.waitForTimeout(2400); fx.active1 = await page.evaluate(() => document.getElementById('dpos').textContent);
  fx.refract = await page.evaluate(() => document.querySelectorAll('.dc.refract').length);
  await page.screenshot({ path: path.join(out, `${name}-carousel2.jpg`), type: 'jpeg', quality: 70 });
  await page.click('#dfilters [data-k=KETO]'); await page.waitForTimeout(500); fx.ketoDishes = await page.evaluate(() => document.querySelectorAll('.dc').length);
  await page.click('#dfilters [data-k=ALL]');
  await page.evaluate(() => document.getElementById('clock').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(400); await page.click('#seg [data-k=KETO]'); await page.waitForTimeout(1000); fx.clockMid = await page.evaluate(() => document.getElementById('cmid').textContent + ' ' + document.getElementById('cmid2').textContent);
  await page.screenshot({ path: path.join(out, `${name}-clock-keto.jpg`), type: 'jpeg', quality: 70 });
  await page.evaluate(() => document.getElementById('shop').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(300); await page.click('.lst label:nth-of-type(1)'); fx.shopCount = await page.evaluate(() => document.getElementById('shopcount').textContent);
  await page.evaluate(() => document.getElementById('swap').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(300); await page.click('#fgrid .food:nth-child(2)'); fx.swapShown = await page.evaluate(() => document.getElementById('swapbox').classList.contains('on') && document.querySelectorAll('#swapbox .opt').length);
  await page.evaluate(() => document.getElementById('track').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(300); await page.fill('#wval', '143.4'); await page.click('#wform button[type=submit]'); await page.waitForTimeout(300); fx.tracker = await page.evaluate(() => document.getElementById('readout').textContent);
  await page.screenshot({ path: path.join(out, `${name}-track2.jpg`), type: 'jpeg', quality: 70 });
  r.fx = fx; report.push(r); await ctx.close();
}
// JS-off fail-open check
{ const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }); const page = await ctx.newPage(); await page.goto('file://' + file); await page.waitForTimeout(500); const t = await page.evaluate(() => document.body.innerText.length); report.push({ profile: 'js-off', textChars: t }); await page.screenshot({ path: path.join(out, 'js-off.jpg'), type: 'jpeg', quality: 60 }); await ctx.close(); }
await browser.close(); fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1)); console.log(JSON.stringify(report, null, 1));
