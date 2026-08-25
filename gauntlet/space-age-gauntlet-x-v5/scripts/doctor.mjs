// Preflight: what is configured, what is missing, and what that costs you.
// Keys live in .env once — every npm script loads it with --env-file-if-exists.
import fs from "node:fs/promises";

const has = (k) => Boolean(process.env[k]);
const envExists = await fs.access(".env").then(() => true).catch(() => false);

const PROVIDERS = [
  { key: "OPENROUTER_API_KEY", name: "OpenRouter", unlocks: "codex, kimi, deepseek, opus seats" },
  { key: "GEMINI_API_KEY", name: "Gemini (direct)", unlocks: "gemini seat + NATIVE VIDEO judging" },
  { key: "XAI_API_KEY", name: "xAI (direct)", unlocks: "grok seat" },
  { key: "OPENAI_API_KEY", name: "OpenAI (direct)", unlocks: "optional builder/vision fallback" },
  { key: "GENERIC_API_KEY", name: "Generic OpenAI-compatible", unlocks: "self-hosted / proxy lane" },
];

console.log(envExists ? "✅ .env found — loaded automatically by every npm script" : "❌ no .env — copy .env.example to .env and fill it in ONCE");
console.log("\nproviders");
let live = 0;
for (const p of PROVIDERS) {
  const ok = has(p.key);
  if (ok) live++;
  console.log(`  ${ok ? "✅" : "  "} ${p.key.padEnd(22)} ${p.name.padEnd(26)} ${ok ? "" : "→ " + p.unlocks}`);
}

console.log("\ncapability");
const say = (ok, label, why) => console.log(`  ${ok ? "✅" : "❌"} ${label}${ok ? "" : "  — " + why}`);
say(live > 0, "can run a gauntlet at all", "no provider credentials at all");
say(has("GEMINI_API_KEY"), "native video motion judging", "without it, scroll recordings degrade to keyframes (flagged, still usable)");
say(has("OPENROUTER_API_KEY"), "multi-lab judge panel", "without it the panel collapses toward one family");
say(has("OPENROUTER_API_KEY") && has("GEMINI_API_KEY"), "panel survives one provider outage", "all seats on one transport = one outage blinds the panel");

let ffmpeg = false;
try {
  const { spawnSync } = await import("node:child_process");
  ffmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;
} catch {}
say(ffmpeg, "ffmpeg keyframe sampling", "install ffmpeg, or motion evidence falls back to stills");

console.log(`\n${live}/${PROVIDERS.length} providers configured. Three keys (OpenRouter + Gemini + xAI) cover the whole shipped panel.`);
console.log("Next: npm run verify:panel");
