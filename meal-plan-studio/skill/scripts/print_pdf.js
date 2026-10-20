// node print_pdf.js in.html out.pdf  (needs the playwright npm package; set NODE_PATH if installed globally)
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(process.argv[2]));
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = r))));
  await p.pdf({ path: process.argv[3], format: 'Letter', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await b.close();
})();
