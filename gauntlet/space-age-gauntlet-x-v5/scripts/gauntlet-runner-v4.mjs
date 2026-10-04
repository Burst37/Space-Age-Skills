import fs from "node:fs/promises";
import path from "node:path";
import { callProvider,providerAvailable } from "../lib/providers/index.mjs";
import { extractJson } from "../lib/providers/base.mjs";
import { snapshot,writeFiles } from "../runner/fs-tools.mjs";
import { runChecks } from "../runner/checks.mjs";
import { BUILDER_SYSTEM,builderPrompt,CRITIC_SYSTEM,criticPrompt,JUDGE_SYSTEM,judgePrompt } from "../runner/prompts.mjs";
import { createRun,saveRound,saveState } from "../runner/state.mjs";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ensureCheckpoint,commitRound } from "../lib/git/git-tools.mjs";
import { newLedger,recordCall,estimateCost } from "../lib/cost/ledger.mjs";
import { visualEvidenceSummary,referenceAwareJudgePrompt } from "../lib/visual/diff.mjs";
import { scoutBenchmarks } from "../lib/benchmark/scout.mjs";

const resumeMode=process.argv.includes("--resume");
const configArg=process.argv.find(x=>x.endsWith(".json"))||"gauntlet.project.json";
const config=JSON.parse(await fs.readFile(configArg,"utf8"));
await fs.mkdir(config.workspace,{recursive:true});

function choose(primary,fallbacks=[]){
  if(providerAvailable(primary)) return primary;
  for(const p of fallbacks) if(providerAvailable(p)) return p;
  throw new Error(`No provider available for ${primary}`);
}
const providerPool=["openai","gemini","xai","openrouter","generic"];
const builderProvider=choose(config.provider?.builder||"openai",providerPool);
const criticProvider=choose(config.provider?.critic||"gemini",providerPool);
const judgeProvider=choose(config.provider?.judge||"xai",providerPool);

let run;
if(resumeMode && config.resumeStatePath){
  const state=JSON.parse(await fs.readFile(config.resumeStatePath,"utf8"));
  run={dir:path.dirname(config.resumeStatePath),state};
}else run=await createRun(config);
let {dir:runDir,state}=run;
state.costLedger=state.costLedger||newLedger();
state.visualLedger=state.visualLedger||{};
state.events=state.events||[];

if(config.git?.enabled!==false && !resumeMode){
  state.git=await ensureCheckpoint(config.workspace,"pre-gauntlet checkpoint");
  await saveState(runDir,state);
}

if(config.liveBenchmarkScout && !state.benchmarkManifest){
  try{
    const b=await scoutBenchmarks({goal:config.goal,taskType:config.taskType,provider:config.benchmarkProvider||judgeProvider,model:config.benchmarkModel||"",knownReferences:config.references||""});
    state.benchmarkManifest=b.manifest;
    recordCall(state.costLedger,{provider:b.provider,model:config.benchmarkModel||"",role:"benchmark",usage:b.usage,estimatedUsd:estimateCost({provider:b.provider,model:config.benchmarkModel,usage:b.usage}),round:0});
    await saveState(runDir,state);
  }catch(e){state.events.push({type:"benchmark_error",error:e.message});}
}

async function inspectWeb(round){
  if(!config.web?.enabled) return null;
  const browser=await chromium.launch({headless:true});
  const results=[];
  for(const vp of config.web.viewports||[]){
    const page=await browser.newPage({viewport:{width:vp.width,height:vp.height}});
    const consoleErrors=[];page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text())});
    const res=await page.goto(config.web.url,{waitUntil:"networkidle",timeout:45000}).catch(()=>null);
    const shot=path.join(runDir,`round-${String(round).padStart(2,"0")}-${vp.name}.png`);
    await page.screenshot({path:shot,fullPage:true}).catch(()=>{});
    let axe=null;
    try{axe=await new AxeBuilder({page}).analyze()}catch{}
    results.push({
      viewport:vp,status:res?.status()||0,title:await page.title().catch(()=>""),consoleErrors,
      screenshot:shot,
      accessibility:axe?{violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}))}:null
    });
    await page.close();
  }
  await browser.close();
  return results;
}

async function callLogged(provider,args,role,round){
  const r=await callProvider(provider,args);
  recordCall(state.costLedger,{provider,model:args.model||"",role,round,usage:r.usage,estimatedUsd:estimateCost({provider,model:args.model,usage:r.usage})});
  return r;
}

const startRound=resumeMode?(state.round||0)+1:1;
let critiqueText="",previousChecks=[],plateauCount=0,lastScore=state.scores?.length?state.scores.at(-1):null;
state.scores=state.scores||[];

for(let round=startRound;round<=config.maxRounds;round++){
  state.round=round;
  console.log(`\n=== V4 ROUND ${round}/${config.maxRounds} ===`);
  const before=await snapshot(config.workspace);
  const candidates=Math.max(1,config.parallelCandidates||1);
  const candidateResults=[];

  for(let c=0;c<candidates;c++){
    const bp=builderPrompt({config,round,snapshot:before,critique:critiqueText,checks:previousChecks})+
      `\n\nCANDIDATE ${c+1}/${candidates}\nProduce an independent solution strategy.`;
    const br=await callLogged(builderProvider,{model:config.model?.builder||undefined,system:BUILDER_SYSTEM,prompt:bp},"builder",round);
    const parsed=extractJson(br.text);
    candidateResults.push({index:c,parsed,raw:br});
  }

  let winner=candidateResults[0];
  if(candidateResults.length>1){
    const judgeCandidates=candidateResults.map(x=>({index:x.index,summary:x.parsed.summary,files:(x.parsed.files||[]).map(f=>({path:f.path,chars:String(f.content||"").length}))}));
    const jr=await callLogged(judgeProvider,{
      model:config.model?.judge||undefined,
      system:"You are a blind implementation tournament judge. Return strict JSON: {\"winner\":0,\"reason\":\"...\"}",
      prompt:`MISSION\n${config.goal}\n\nCANDIDATES\n${JSON.stringify(judgeCandidates,null,2)}`
    },"candidate_judge",round);
    const pick=extractJson(jr.text);winner=candidateResults.find(x=>x.index===Number(pick.winner))||winner;
  }

  const written=await writeFiles(config.workspace,winner.parsed.files||[],config.protectedPaths||[]);
  const checks=await runChecks(config.checks||[],config.workspace);
  const webInspection=await inspectWeb(round).catch(e=>({error:e.message}));
  const after=await snapshot(config.workspace);

  let referenceJudge=null;
  if(config.referenceDNA && webInspection){
    const evidence=await visualEvidenceSummary(webInspection,config.referenceDNA);
    const vr=await callLogged(criticProvider,{
      model:config.model?.critic||undefined,
      system:"You are a senior multimodal-inspired web motion/design judge. Judge evidence, not builder claims.",
      prompt:referenceAwareJudgePrompt(evidence)
    },"reference_judge",round);
    try{referenceJudge=extractJson(vr.text)}catch{referenceJudge={raw:vr.text}}
  }

  const cr=await callLogged(criticProvider,{
    model:config.model?.critic||undefined,system:CRITIC_SYSTEM,
    prompt:criticPrompt({config,round,snapshot:after,checks,webInspection,previousLedger:state.ledger})
      +`\n\nREFERENCE-AWARE JUDGE\n${JSON.stringify(referenceJudge,null,2)}`
  },"critic",round);
  const critique=extractJson(cr.text);

  const j=await callLogged(judgeProvider,{
    model:config.model?.judge||undefined,system:JUDGE_SYSTEM,
    prompt:judgePrompt({config,critique,checks,scoreHistory:state.scores})
      +`\n\nREFERENCE SCORES\n${JSON.stringify(referenceJudge,null,2)}`
  },"judge",round);
  const judge=extractJson(j.text);
  const score=Number(judge.score??critique.score??0);

  for(const p of judge.acceptedPasses||critique.passed||[]) state.ledger[p]={round,score};
  for(const p of judge.rejectedPasses||critique.regressions||[]) delete state.ledger[p];
  state.scores.push(score);
  state.visualLedger[round]=referenceJudge;

  if(lastScore!==null && Math.abs(score-lastScore)<(config.plateauDelta??1)) plateauCount++; else plateauCount=0;
  lastScore=score;

  const roundData={round,written,checks,webInspection,referenceJudge,critique,judge,score,costLedger:state.costLedger,ledger:state.ledger};
  await saveRound(runDir,round,roundData);
  if(state.git?.enabled) await commitRound(config.workspace,round,score);
  await saveState(runDir,state);

  const checksPass=checks.every(x=>x.ok);
  const refPass=!referenceJudge || (
    Number(referenceJudge.techniqueFidelity||0)>=Number(config.referenceGate||85) &&
    Number(referenceJudge.originality||0)>=Number(config.originalityGate||85)
  );

  console.log(`score=${score} checks=${checksPass} refPass=${refPass} cost≈$${state.costLedger.totalEstimatedUsd}`);

  if(judge.ship && !judge.hardFailure && checksPass && refPass && score>=config.hardGate){
    state.status="shipped";state.finishedAt=new Date().toISOString();await saveState(runDir,state);
    console.log("V4 GAUNTLET PASSED — SHIP.");
    process.exit(0);
  }

  if(plateauCount>=(config.plateauRounds??2)){
    critiqueText=`PLATEAU DETECTED. Change strategy, root cause, model role, decomposition, or implementation approach. Do not repeat prior tactics. ${JSON.stringify(critique)}`;
    plateauCount=0;
  }else critiqueText=JSON.stringify({critique,referenceJudge});
  previousChecks=checks;
}

state.status="max_rounds";state.finishedAt=new Date().toISOString();await saveState(runDir,state);
console.log("V4 stopped at max rounds.");
process.exit(2);
