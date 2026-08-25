import { classifyTask } from "./classifier";
import { BENCHMARKS, criticSet, WORKSTREAMS } from "./catalog";
import { CompileInput, GauntletPlan, ModelRoute, RunnerConfig, TaskType } from "./types";

function defaultRoutes(type:TaskType):ModelRoute[]{
  const routes:ModelRoute[]=[
    {role:"Lead orchestrator",provider:"openai",model:"env/default",fallback:"openrouter",reason:"High-leverage decomposition and stop decisions"},
    {role:"Independent judge",provider:"xai/openrouter",model:"env/default",fallback:"openai",reason:"Prefer a different model family from the builder"}
  ];
  if(type==="Website / UI"){
    routes.push(
      {role:"Builder",provider:"openai/openrouter",model:"coding-capable",fallback:"gemini",reason:"File edits and iteration"},
      {role:"Visual critic",provider:"gemini/openai",model:"vision-capable",fallback:"openrouter",reason:"Judge rendered output"}
    );
  }else{
    routes.push({role:"Builder",provider:"openai/openrouter",model:"strong general",fallback:"gemini",reason:"Primary artifact production"});
  }
  return routes;
}

export function compileGauntlet(input:CompileInput):GauntletPlan{
  const type:TaskType=!input.taskType||input.taskType==="Auto-detect"?classifyTask(input.goal):input.taskType;
  const benchmarks=[
    ...(input.references?.trim()?[{dimension:"User-supplied benchmark",target:input.references.trim(),evidence:"Direct comparison"}]:[]),
    ...BENCHMARKS[type]
  ];
  const critics=criticSet(type,input.mode);
  const workstreams=input.mode==="Quick"?WORKSTREAMS[type].slice(0,5):WORKSTREAMS[type];
  const routes=defaultRoutes(type);
  const complexity=input.mode==="War"?"EXTREME":input.mode==="Quick"?"LEAN":"HIGH";
  const base=Math.floor(100/benchmarks.length);
  const rubric=benchmarks.map((b,i)=>({dimension:b.dimension,weight:i===benchmarks.length-1?100-base*(benchmarks.length-1):base,gate:90}));
  const enabled=new Set(input.enabledSystems);
  const systemLines=[
    enabled.has("benchmarks")&&"Benchmark scout: establish inspectable references/measurements before implementation.",
    enabled.has("specialists")&&"Fresh specialist judges inspect the real artifact; builders never certify themselves.",
    enabled.has("blind")&&"Use anonymized A/B or tournament judging when feasible.",
    enabled.has("regression")&&"Maintain a PASS ledger and rerun passed checks after material changes.",
    enabled.has("plateau")&&"If improvement plateaus, change strategy/model/critic/reference rather than repeating.",
    enabled.has("integration")&&"Use a fresh integration director after major waves.",
    enabled.has("redteam")&&"Final fresh red-team must find reasons not to ship.",
    enabled.has("progress")&&"Track rounds, scores, failures, largest gaps and compute decisions."
  ].filter(Boolean).join("\n");

  const referenceDNA=input.referenceDNA ? `\nMULTIMODAL REFERENCE DNA\n${JSON.stringify(input.referenceDNA,null,2)}\n\nREFERENCE TRANSFORMATION RULE\nUse the extracted principles and motion grammar as inspiration. Re-express them through the target brand, content, typography, imagery and layout. Do not reproduce distinctive reference expression literally.\n` : "";

  const antiSlop=type==="Website / UI"?`
WEBSITE ANTI-SLOP GATE
Penalize unjustified repetitive bento grids, arbitrary glassmorphism, excessive pills, interchangeable gradients, stock icon rows, repetitive rounded cards, fake social proof, weak/default typography, uniform section rhythm, decorative motion and desktop-first layouts. Inspect representative mobile/tablet/desktop widths.
`:"";

  const prompt=`You are the LEAD GAUNTLET ORCHESTRATOR.

MISSION
${input.goal.trim()}

TASK CLASS
${type}

MODE / BUDGET / AUTONOMY
${input.mode} / ${input.budget} / ${input.autonomy}

NON-NEGOTIABLES
${input.constraints?.trim()||"Infer only genuine requirements from the mission."}

DEFINITION OF DONE
${input.deliverable?.trim()||"Finished working artifact plus evidence all critical gates passed."}

BENCHMARK MANIFEST
${benchmarks.map((b,i)=>`${i+1}. ${b.dimension}: ${b.target} | Evidence: ${b.evidence}`).join("\n")}

WORKSTREAM MAP
${workstreams.map((w,i)=>`${i+1}. ${w}`).join("\n")}

CRITIC BENCH
${critics.map((c,i)=>`${i+1}. ${c}`).join("\n")}

QUALITY RUBRIC
${rubric.map(r=>`- ${r.dimension}: ${r.weight}% weight, ${r.gate}/100 gate`).join("\n")}
Hard failures override aggregate score. Never average away broken functionality or violated non-negotiables.

SYSTEMS
${systemLines}

${referenceDNA}
CORE LOOP
BUILD → INSPECT REAL OUTPUT → FRESH CRITIQUE → IDENTIFY LARGEST EVIDENCE-BACKED GAP → TARGETED FIX → RE-INSPECT.
Do not waste rounds on dimensions already clearly above gate.
${antiSlop}
STOP CONDITION
Ship only when hard requirements pass, critical dimensions meet gate or have documented exceptions, no passed capability regressed, the integrated artifact survives fresh red-team review, and further rounds show diminishing returns.

Do not claim victory from prose. The artifact itself must earn the score.`;

  return {taskType:type,complexity,benchmarks,critics,rubric,routes,workstreams,prompt};
}

export function makeRunnerConfig(input:CompileInput,plan:GauntletPlan):RunnerConfig{
  const slug=input.goal.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"gauntlet-project";
  return {
    name:slug,
    goal:input.goal,
    taskType:plan.taskType,
    mode:input.mode,
    workspace:`./workspace/${slug}`,
    maxRounds:input.mode==="War"?10:input.mode==="Quick"?3:6,
    plateauDelta:1.0,
    plateauRounds:2,
    hardGate:90,
    provider:{builder:"openai",critic:"openrouter",judge:"xai"},
    model:{builder:"",critic:"",judge:""},
    checks:plan.taskType==="Website / UI"?["npm test --if-present","npm run build --if-present"]:["npm test --if-present"],
    web:plan.taskType==="Website / UI"?{
      enabled:false,url:"http://127.0.0.1:3000",
      viewports:[
        {name:"mobile",width:390,height:844},
        {name:"tablet",width:768,height:1024},
        {name:"desktop",width:1440,height:1000}
      ],
      scrollFractions:[0,0.2,0.4,0.6,0.8,1]
    }:undefined,
    constraints:(input.constraints||"").split("\n").map(x=>x.trim()).filter(Boolean),
    protectedPaths:[".git",".env",".env.local","node_modules","runs"],
    prompt:plan.prompt,
    referenceDNA:input.referenceDNA||undefined
  };
}
