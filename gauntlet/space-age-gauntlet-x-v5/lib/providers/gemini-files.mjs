// Shared Gemini Files API upload. Used by both the reference lab and the V5 runner so
// video handling exists in exactly one place.
import fs from "node:fs/promises";
import path from "node:path";

export async function uploadGeminiFile(filePath, mimeType, apiKey = process.env.GEMINI_API_KEY) {
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");
  const bytes = await fs.readFile(filePath);
  const init = await fetch("https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=resumable", {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(bytes.length),
      "X-Goog-Upload-Header-Content-Type": mimeType,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { display_name: path.basename(filePath) } }),
  });
  if (!init.ok) throw new Error(`Gemini upload init ${init.status}: ${(await init.text()).slice(0, 800)}`);
  const uploadUrl = init.headers.get("x-goog-upload-url");
  if (!uploadUrl) throw new Error("Gemini upload URL missing");
  const up = await fetch(uploadUrl, {
    method: "POST",
    headers: { "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize", "Content-Length": String(bytes.length) },
    body: bytes,
  });
  const txt = await up.text();
  if (!up.ok) throw new Error(`Gemini upload ${up.status}: ${txt.slice(0, 800)}`);
  return JSON.parse(txt).file;
}

/** Files land in PROCESSING; generateContent rejects them until ACTIVE. */
export async function waitForActive(file, apiKey = process.env.GEMINI_API_KEY, { tries = 60, delayMs = 2000 } = {}) {
  let f = file;
  for (let i = 0; i < tries && f?.state === "PROCESSING"; i++) {
    await new Promise((r) => setTimeout(r, delayMs));
    const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/${f.name}`, { headers: { "x-goog-api-key": apiKey } });
    if (!g.ok) throw new Error(`Gemini file poll ${g.status}`);
    f = await g.json();
  }
  if (f?.state && f.state !== "ACTIVE") throw new Error(`Gemini video state: ${f.state}`);
  return f;
}
