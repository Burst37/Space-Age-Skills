// V5 — evidence packets. V4 handed the judge a JSON object containing screenshot FILE PATHS
// and asked it to score visualQuality/motionFidelity. It was scoring metadata.
// An evidence packet carries the pixels.
import { toDataUrl } from "../reference/media.mjs";
import { framesToDataUrls, evenSample } from "./capture.mjs";

/**
 * @param inspections output of inspectWeb (per-viewport, with .screenshot and optional .scrollPath)
 * @returns {text, images:[dataUrl], frames:[dataUrl], video:{path,mimeType}|null}
 *   text   — judgeable metadata
 *   images — stills the model can see
 *   frames — ordered scroll keyframes (for providers without native video)
 *   video  — the real recording (for providers that accept video)
 */
export async function buildEvidencePacket(inspections = [], referenceDNA = null, { maxImages = 10 } = {}) {
  const images = [], frames = [], legend = [];
  let video = null;
  const perViewport = Math.max(1, Math.floor(maxImages / Math.max(1, inspections.length)));

  for (const insp of inspections) {
    const vp = insp.viewport?.name || "viewport";

    if (insp.screenshot) {
      const u = await toDataUrl(insp.screenshot, "image/png").catch(() => null);
      if (u) { images.push(u); legend.push(`image ${images.length}: ${vp} — full-page still`); }
    }

    const framePaths = insp.scrollPath?.frames || [];
    if (framePaths.length) {
      const urls = await framesToDataUrls(framePaths, { max: perViewport });
      const ys = evenSample(insp.scrollPath.journey || [], urls.length);
      urls.forEach((u, i) => {
        frames.push(u);
        legend.push(`frame ${frames.length}: ${vp} — scroll ${i + 1}/${urls.length} (y≈${ys[i]?.y ?? "?"})`);
      });
    }

    // First recording wins — one video is evidence, five is a bill.
    if (!video && insp.scrollPath?.videoPath) {
      video = { path: insp.scrollPath.videoPath, mimeType: "video/webm", viewport: vp };
    }
  }

  const meta = inspections.map((i) => ({
    vp: i.viewport?.name,
    status: i.status,
    title: i.title,
    consoleErrors: (i.consoleErrors || []).slice(0, 8),
    a11y: (i.accessibility?.violations || [])
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}:${v.impact}:${v.nodes}`),
    scrollSteps: i.scrollPath?.journey?.length || 0,
    videoCaptured: Boolean(i.scrollPath?.videoPath),
  }));

  return {
    images: images.slice(0, maxImages),
    frames: frames.slice(0, maxImages),
    video,
    text: [
      `IMAGE LEGEND\n${legend.slice(0, maxImages).join("\n") || "(no imagery captured)"}`,
      `RENDER METADATA\n${JSON.stringify(meta)}`,
      referenceDNA ? `REFERENCE DNA\n${JSON.stringify(referenceDNA)}` : "REFERENCE DNA\n(none supplied)",
    ].join("\n\n"),
  };
}

export function visualJudgeSystem() {
  return `You are a senior web design + motion judge. You are shown REAL rendered evidence:
full-page stills and ordered scroll-path keyframes from the candidate build.

Judge the pixels, not the builder's claims. If the evidence does not show something, score it
low and say so in "evidenceGaps" — never assume an unseen feature works.

Return STRICT JSON only:
{"techniqueFidelity":0,"originality":0,"visualQuality":0,"responsiveQuality":0,"motionFidelity":0,
 "largestMismatch":"...","regressions":[],"passes":[],"evidenceGaps":[]}`;
}

export function visualJudgePrompt(packet) {
  return `REFERENCE-AWARE VISUAL JUDGING

Score each dimension 0-100 from the supplied imagery:
- techniqueFidelity: were the reference's reusable mechanics actually transferred
- originality: literal copying LOWERS this score
- visualQuality: hierarchy, type, spacing, surface craft
- responsiveQuality: compare the mobile and desktop evidence
- motionFidelity: judge ONLY from the scroll recording or the ordered scroll frames —
  sequence, pinning, parallax, reveal timing. If only a single still exists for a viewport,
  motionFidelity is unevidenced: score it <=40 and list it in evidenceGaps.

${packet.text}

Return strict JSON only.`;
}
