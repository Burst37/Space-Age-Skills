// V5 — scroll-path capture. Static screenshots cannot evidence motion; a judge asked to
// score motionFidelity from a PNG is guessing. This records the actual scroll journey and
// reduces it to a bounded set of keyframes the judge can see.
import fs from "node:fs/promises";
import path from "node:path";
import { extractVideoFrames, toDataUrl } from "../reference/media.mjs";

/**
 * Drive a scripted scroll down the page while Playwright records video.
 * @returns {videoPath|null, frames:[abs paths], steps:[{y,ts}]}
 */
export async function captureScrollPath(browser, { url, viewport, outDir, steps = 8, settleMs = 450, fps = 2, maxFrames = 12 }) {
  await fs.mkdir(outDir, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    recordVideo: { dir: outDir, size: { width: viewport.width, height: viewport.height } },
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });

  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  const height = await page.evaluate(() => document.body.scrollHeight).catch(() => viewport.height);
  const journey = [];
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((height - viewport.height) * (i / steps));
    await page.evaluate((to) => window.scrollTo({ top: to, behavior: "smooth" }), y).catch(() => {});
    await page.waitForTimeout(settleMs);
    journey.push({ step: i, y });
  }
  await page.waitForTimeout(settleMs);

  const status = res?.status() || 0;
  const title = await page.title().catch(() => "");
  await page.close();
  await ctx.close(); // video is only flushed on context close

  let videoPath = null;
  for (const f of await fs.readdir(outDir).catch(() => [])) {
    if (f.endsWith(".webm")) { videoPath = path.join(outDir, f); break; }
  }

  let frames = [];
  if (videoPath) {
    frames = await extractVideoFrames(videoPath, path.join(outDir, "frames"), { fps, maxFrames })
      .catch(() => []); // ffmpeg absent -> fall back to stills, never fail the round
  }
  return { videoPath, frames, journey, status, title, consoleErrors, height };
}

/** Bounded conversion of frame paths into inline data URLs the model can actually see. */
export async function framesToDataUrls(frames, { max = 8 } = {}) {
  const pick = evenSample(frames, max);
  const out = [];
  for (const f of pick) out.push(await toDataUrl(f, "image/jpeg").catch(() => null));
  return out.filter(Boolean);
}

/** Keep first, last and an even spread between — the arc matters more than the density. */
export function evenSample(arr, n) {
  if (!Array.isArray(arr) || arr.length <= n) return arr || [];
  const step = (arr.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)]);
}
