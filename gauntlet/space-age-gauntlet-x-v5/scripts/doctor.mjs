// Preflight: what is configured, what is missing, and what that costs you.
// Keys live in .env once — every npm script loads it with --env-file-if-exists.
import fs from "node:fs/promises";

const has = (k) => Boolean(process.env[k]);
const envExists = await fs.access(".env").then(() => true).catch(() => false);

const PROVIDERS = [
  { key: "GEMINI_API_KEY", name: "Gemini (direct)", unlocks: "gemini seat + the ONLY native video path", direct: true },
  { key: "OPENAI_API_KEY", name: "OpenAI (direct)", unlocks: "sol seat", direct: true },
  { key: "ANTHROPIC_API_KEY", name: "Anthropic (direct)", unlocks: "opus seat", direct: true },
  { key: "MOONSHOT_API_KEY", name: "Moonshot (direct)", unlocks: "kimi seat", direct: true },
  { key: "DEEPSEEK_API_KEY", name: "DeepSeek (direct)", unlocks: "deepseek seat (cheapest)", direct: true },
  { key: "XAI_API_KEY", name: "xAI (direct)", unlocks: "grok seat", direct: true },
  { key: "OPENROUTER_API_KEY", name: "OpenRouter (broker)", unlocks: "backstop for any direct API that is down" },
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
const directLive = PROVIDERS.filter((p) => p.direct && has(p.key)).length;
say(directLive >= 4, "all-direct panel reaches quorum", `${directLive}/6 direct lab keys set — presets/judge-panel-direct.json needs 4 live seats`);
say(directLive >= 2 || has("OPENROUTER_API_KEY"), "panel survives one provider outage", "a single transport means one outage blinds the panel");

let ffmpeg = false;
try {
  const { spawnSync } = await import("node:child_process");
  ffmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;
} catch {}
say(ffmpeg, "ffmpeg keyframe sampling", "install ffmpeg, or motion evidence falls back to stills");

console.log(`\n${live}/${PROVIDERS.length} providers configured (${directLive}/6 direct labs).`);

const missingDirect = PROVIDERS.filter((p) => p.direct && !has(p.key));
if (directLive >= 6) {
  console.log("\n→ Full all-direct panel available: presets/judge-panel-direct.json");
} else if (directLive >= 4) {
  console.log("\n→ presets/judge-panel-direct.json will reach quorum with the seats you have.");
  console.log(`  Still missing: ${missingDirect.map((p) => p.key).join(", ")}`);
} else if (has("OPENROUTER_API_KEY")) {
  console.log("\n→ Not enough direct keys for the all-direct panel yet.");
  console.log(`  presets/judge-panel-openrouter-only.json runs today; add ${missingDirect.slice(0, 3).map((p) => p.key).join(", ")} to move off the broker.`);
} else {
  console.log("\n→ No usable panel yet. Add direct lab keys (see presets/judge-panel-direct.json)");
  console.log("  or OPENROUTER_API_KEY as a single-key stopgap.");
}
if (!has("GEMINI_API_KEY")) console.log("  GEMINI_API_KEY is the one that matters most: it is the only native video path.");
console.log("Next: npm run verify:panel");
