// Shared by shots.js and capture.js: loads puppeteer-core from this folder and finds a system Chrome.
const fs = require('node:fs');
let puppeteer;
try { puppeteer = require('puppeteer-core'); }
catch { console.error(`puppeteer-core is not installed. Run once:\n  cd "${__dirname}" && npm install`); process.exit(2); }
function chromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const c = {
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
    linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'],
    win32: ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'],
  }[process.platform] || [];
  const f = c.find(p => fs.existsSync(p));
  if (!f) { console.error('No Chrome/Chromium found. Install Chrome or set CHROME_PATH.'); process.exit(2); }
  return f;
}
module.exports = { puppeteer, chromePath };
