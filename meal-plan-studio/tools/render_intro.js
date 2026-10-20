// Render the intro poster HTML. Usage: node render_intro.js <intro.html> <outdir> [time]   (time given = one still, else all frames)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const html = path.resolve(process.argv[2]), out = path.resolve(process.argv[3]), only = process.argv[4];
  fs.mkdirSync(out, { recursive: true });
  const FPS = 30, DUR = 9.5;
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file://' + html);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = r))));
  await page.evaluate(() => document.fonts.ready);
  if (only) { await page.evaluate(t => render(t), parseFloat(only)); await page.screenshot({ path: path.join(out, 'still_' + only + '.png') }); await browser.close(); return; }
  const N = Math.round(FPS * DUR);
  for (let i = 0; i < N; i++) {
    await page.evaluate(t => render(t), i / FPS);
    await page.screenshot({ path: path.join(out, 'f' + String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 96 });
  }
  await browser.close(); console.log('done', N);
})();
