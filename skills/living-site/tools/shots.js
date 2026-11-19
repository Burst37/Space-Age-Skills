#!/usr/bin/env node
// shots.js <url> <outdir> <w>x<h> <shot> [<shot> ...]
//   shot = name=<y>            absolute scrollY
//        | name=#id:<frac>     inside element #id: scrollY = top + frac*(height - innerHeight)
// Scrolls there in small real steps (so lerped scrubs and observers settle like a visitor), then shoots.
// Prints console errors, whether window.__ready fired, and MotionEngine.jank() (p95/max frame time).
// Add ?motion=on|off|xray to the url to shoot each mode of the motion switch.
const path = require('path');
const { puppeteer, chromePath } = require('./_browser.js');
const [, , url, outdir, size, ...shots] = process.argv;
if (!url || !outdir || !size) { console.error('usage: node shots.js <url> <outdir> <w>x<h> name=<y>|name=#id:<frac> ...'); process.exit(1); }
const [W, H] = size.split('x').map(Number);
(async () => {
  require('fs').mkdirSync(outdir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chromePath(), headless: 'new', args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errs.push('reqfail: ' + r.url()));
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForFunction('window.__ready === true', { timeout: 30000 }).catch(() => errs.push('__ready never true'));
  await new Promise(r => setTimeout(r, 1500));
  for (const s of shots) {
    const [name, spec] = s.split('=');
    const y = await page.evaluate(sp => {
      if (sp.startsWith('#')) { const [sel, f] = sp.split(':'); const el = document.querySelector(sel); const r = el.getBoundingClientRect(); const top = r.top + scrollY; return Math.round(top + (+f || 0) * Math.max(0, r.height - innerHeight)); }
      return +sp;
    }, spec);
    // scroll in steps so lerped scrubs + observers settle like a real visitor
    await page.evaluate(async ty => { const y0 = scrollY, n = 24; for (let i = 1; i <= n; i++) { scrollTo(0, y0 + (ty - y0) * i / n); await new Promise(r => requestAnimationFrame(r)); } }, y);
    await new Promise(r => setTimeout(r, 1800));
    await page.screenshot({ path: path.join(outdir, name + '.jpg'), type: 'jpeg', quality: 70 });
    console.log('shot', name, 'y=' + y);
  }
  const jank = await page.evaluate(() => window.MotionEngine ? window.MotionEngine.jank() : null);
  console.log('jank', JSON.stringify(jank));
  console.log(errs.length ? 'ERRORS:\n' + [...new Set(errs)].join('\n') : 'no console errors');
  await browser.close();
})();
