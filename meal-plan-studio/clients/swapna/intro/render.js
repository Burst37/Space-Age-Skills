const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const dir = __dirname, out = path.join(dir, 'frames'); fs.mkdirSync(out, { recursive: true });
  const FPS = 30, DUR = 9.5, only = process.argv[2];
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 4 / 3 });
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(dir, 'intro_data.html'));
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = r))));
  await page.evaluate(() => document.fonts.ready);
  if (only) { await page.evaluate(t => render(t), parseFloat(only)); await page.screenshot({ path: path.join(dir, 'still_' + only + '.png') }); await browser.close(); return; }
  const N = Math.round(FPS * DUR);
  for (let i = 0; i < N; i++) {
    await page.evaluate(t => render(t), i / FPS);
    await page.screenshot({ path: path.join(out, 'f' + String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 96 });
  }
  await browser.close(); console.log('done', N);
})();
