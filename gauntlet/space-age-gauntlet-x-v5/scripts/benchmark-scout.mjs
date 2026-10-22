import fs from "node:fs/promises";
import { scoutBenchmarks } from "../lib/benchmark/scout.mjs";
const cfg=JSON.parse(await fs.readFile(process.argv[2]||"gauntlet.project.json","utf8"));
const out=await scoutBenchmarks({
  goal:cfg.goal,taskType:cfg.taskType,
  provider:cfg.benchmarkProvider||cfg.provider?.judge||"openai",
  model:cfg.benchmarkModel||"",
  knownReferences:cfg.references||""
});
await fs.writeFile("benchmark-manifest.json",JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
