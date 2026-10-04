import { callProvider } from "../providers/index.mjs";
import { extractJson } from "../providers/base.mjs";

export async function scoutBenchmarks({goal,taskType,provider="openai",model,knownReferences=""}){
  const system=`You are a Benchmark Scout. Build a benchmark manifest, not a design clone.
Return strict JSON:
{"benchmarks":[{"dimension":"...","reference":"...","reason":"...","measurableTarget":"...","evidenceMethod":"..."}],"risks":["..."]}
Use multiple references when appropriate. Distinguish objective standards from taste.`;
  const prompt=`MISSION
${goal}

TASK TYPE
${taskType}

KNOWN REFERENCES
${knownReferences||"(none)"}

Create a triangulated benchmark manifest.`;
  const r=await callProvider(provider,{model,system,prompt});
  return {manifest:extractJson(r.text),usage:r.usage,provider};
}
