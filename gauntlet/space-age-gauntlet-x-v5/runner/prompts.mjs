import { assemblePrompt, j } from "./token-budget.mjs";

// V5 prompt assembly. Stable text FIRST and byte-identical every round, so provider prefix
// caches can hit; volatile state (round number, snapshot delta, checks) goes last.
// V4 opened every prompt with `config.prompt` then `ROUND ${round}`, which invalidated the
// cache for the entire payload underneath it.

export const BUILDER_SYSTEM=`You are a builder inside an autonomous software gauntlet. You may modify only the supplied workspace. Return STRICT JSON and nothing else:
{"summary":"...","files":[{"path":"relative/path","content":"FULL replacement file content"}],"notes":["..."]}
Use full file contents, not diffs. Return ONLY files you actually changed. Never write .env, .git, node_modules or paths outside the workspace.
Files listed as "unchanged" in the workspace manifest still exist — do not recreate or blank them.`;

const BUILDER_SYSTEM_HINT=`You will be given the workspace, the latest automated check results and the latest critique. Changed files are shown in full; unchanged files are listed by path only.`;

export function builderPrompt({config,round,snapshot,critique,checks}){
  return assemblePrompt({
    stable:[config.prompt,BUILDER_SYSTEM_HINT],
    volatile:[
      `ROUND ${round}`,
      `CURRENT WORKSPACE\n${snapshot||"(empty workspace)"}`,
      `LATEST CHECK RESULTS\n${j(checks||[])}`,
      `LATEST CRITIQUE\n${critique||"(first round)"}`,
      `Make the highest-leverage changes that directly reduce the largest remaining gap. Return strict JSON in the required schema.`,
    ],
  });
}

export const CRITIC_SYSTEM=`You are a fresh-context independent critic. You did not build the artifact. Return STRICT JSON only:
{"score":0-100,"hardFailure":true|false,"largestGap":"...","evidence":["..."],"passed":["..."],"regressions":["..."],"recommendation":"..."}
Do not reward persuasive prose. Judge evidence, source, check results and rendered inspection if provided.`;

export function criticPrompt({config,round,snapshot,checks,webInspection,previousLedger,visualVerdict}){
  return assemblePrompt({
    stable:[config.prompt],
    volatile:[
      `INDEPENDENT REVIEW — ROUND ${round}`,
      `ARTIFACT SNAPSHOT\n${snapshot}`,
      `AUTOMATED CHECKS\n${j(checks)}`,
      `RENDER INSPECTION\n${webInspection?j(webInspection):"(not enabled)"}`,
      visualVerdict?`VISUAL JUDGE VERDICT (scored against real rendered evidence)\n${j(visualVerdict)}`:null,
      `PREVIOUS PASS LEDGER\n${j(previousLedger||{})}`,
      `Score the actual artifact. Flag regressions. Identify ONE largest meaningful gap. Return strict JSON only.`,
    ],
  });
}

export const JUDGE_SYSTEM=`You are the final evidence judge in a gauntlet. Return STRICT JSON only:
{"score":0-100,"ship":true|false,"hardFailure":true|false,"reason":"...","acceptedPasses":["..."],"rejectedPasses":["..."]}
A builder or critic cannot certify itself. Hard failures override averages.`;

// V5: the judge receives the critic's report and a compact check summary. The visual
// evidence is NOT re-sent here — it was already scored by the visual judge and folded into
// the critique. V4 pasted the same referenceJudge JSON into both prompts.
export function judgePrompt({config,critique,checks,scoreHistory}){
  const checkSummary=(checks||[]).map(c=>c.ok?`${c.cmd||c.command}: pass`:`${c.cmd||c.command}: FAIL(${c.code}) ${(c.errors||[]).slice(0,3).join(" | ")}`);
  return assemblePrompt({
    stable:[config.prompt],
    volatile:[
      `CRITIC REPORT\n${j(critique)}`,
      `CHECK SUMMARY\n${checkSummary.join("\n")||"(none)"}`,
      `SCORE HISTORY\n${j(scoreHistory)}`,
      `Decide whether this round genuinely passes the gate ${config.hardGate}/100 and whether shipping is justified. Return strict JSON only.`,
    ],
  });
}
