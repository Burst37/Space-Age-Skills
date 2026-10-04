// Verify every panel seat resolves to a real, reachable model BEFORE a run starts.
// A bad slug should cost a second at startup, not a dead seat forty minutes in.
import fs from "node:fs/promises";
import { providerAvailable } from "../lib/providers/index.mjs";
import { normalizeSeats, diversityReport } from "../lib/judge/panel.mjs";

const configArg = process.argv.find((x) => x.endsWith(".json")) || "gauntlet.project.json";
const config = JSON.parse(await fs.readFile(configArg, "utf8"));

async function openRouterCatalog() {
  if (!process.env.OPENROUTER_API_KEY) return null;
  try {
    const r = await fetch("https://openrouter.ai/api/v1/models", { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } });
    if (!r.ok) return null;
    return new Set(((await r.json()).data || []).map((m) => m.id));
  } catch { return null; }
}

const catalog = await openRouterCatalog();
let bad = 0;

for (const [name, seats] of [["judgePanel", normalizeSeats(config.judgePanel, ["openai"])], ["visualPanel", normalizeSeats(config.visualPanel, ["gemini"])]]) {
  console.log(`\n${name}`);
  for (const s of seats) {
    const creds = providerAvailable(s.provider);
    let modelOk = "unchecked";
    if (s.provider === "openrouter" && catalog) modelOk = catalog.has(s.model) ? "ok" : "NOT IN CATALOG";
    const line = `  ${s.id.padEnd(14)} ${s.provider.padEnd(11)} ${(s.model || "(default)").padEnd(34)} creds:${creds ? "ok" : "MISSING"} model:${modelOk}`;
    if (!creds || modelOk === "NOT IN CATALOG") { bad++; console.log(line); } else console.log(line);
  }
  const d = diversityReport(seats);
  console.log(`  families: ${d.families.join(", ")}${d.warnings.length ? "\n  ! " + d.warnings.join("\n  ! ") : ""}`);
}

if (catalog === null) console.log("\n(OpenRouter catalog unavailable — model IDs unverified. Set OPENROUTER_API_KEY to check slugs.)");
console.log(bad ? `\n${bad} seat(s) will not work as configured.` : "\nAll seats look usable.");
process.exit(bad ? 1 : 0);
