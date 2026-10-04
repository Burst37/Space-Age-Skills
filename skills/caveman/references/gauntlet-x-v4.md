# Caveman × Space Age Gauntlet X V4 — wiring

Audit target: `space-age-gauntlet-x-v4` (runner/, lib/, scripts/gauntlet-runner-v4.mjs).
Findings and the exact edits. Line references are to V4.0.0.

## Findings

| # | Site | Problem | Rule |
|---|---|---|---|
| 1 | `runner/fs-tools.mjs:snapshot()` | Rebuilds the whole workspace body every call, and is called **twice per round** (`before`, `after`). No memory of what the model already saw. | 1 |
| 2 | `scripts/gauntlet-runner-v4.mjs` builder loop | `before` snapshot re-sent to **every** parallel candidate — N× the same 32k tokens. | 1 |
| 3 | `runner/prompts.mjs` (all 3) | `JSON.stringify(checks, null, 2)` in builder, critic **and** judge prompts. | 2, 4 |
| 4 | `runner/checks.mjs:runCheck()` | Keeps `stdout.slice(-20000)` + `stderr.slice(-20000)` **even when the check passed**. | 3 |
| 5 | runner v4, critic + judge calls | `referenceJudge` JSON appended to both prompts verbatim. | 4 |
| 6 | `runner/prompts.mjs` | Every prompt opens with `config.prompt` then immediately `ROUND ${round}` — the volatile token sits above the entire payload, so no provider prefix cache can ever hit. | 5 |
| 7 | runner v4 `inspectWeb()` | Full axe violation list + screenshot **paths** + unbounded `consoleErrors` shipped to the model. | 6 |
| 8 | `lib/cost/ledger.mjs:estimateCost()` | Price registry is all zeros → run always prints `cost≈$0`. No token totals recorded. | 8 |
| 9 | runner v4 plateau branch | `critiqueText = JSON.stringify({critique, referenceJudge})` — the full evidence blob is carried into the next round's builder prompt. | 4 |
| 10 | providers | No output-token ceiling on any call; builder returns full file contents unbounded. | 7 |

## Edits

**`runner/fs-tools.mjs`** — return files, not a blob; let the caller diff.

```js
import { createSnapshotCache, deltaSnapshot } from "./token-budget.mjs";

export async function collectFiles(workspace, { maxFiles = 80 } = {}) { /* walk, return [{path,content}] */ }
```

**`scripts/gauntlet-runner-v4.mjs`**

```js
const snapCache = createSnapshotCache();
const files  = await collectFiles(config.workspace);
const before = deltaSnapshot(files, snapCache, { full: round === 1 });
// ...builder loop reuses `before` — now ~7k tok instead of ~32k, N times over
```

Compress before prompting:

```js
const checks = compressChecks(await runChecks(config.checks || [], config.workspace));
const webInspection = compressWebInspection(await inspectWeb(round).catch(e => ({ error: e.message })));
```

Stop the double-send — the judge gets the verdict, not the evidence:

```js
const j = await callLogged(judgeProvider, {
  model: config.model?.judge || undefined, system: JUDGE_SYSTEM,
  prompt: judgePrompt({ config, critique, checks, scoreHistory: state.scores })
  // referenceJudge already summarized inside `critique` — do not append it again
}, "judge", round);
```

Cap the plateau carry-over:

```js
critiqueText = `PLATEAU. Change strategy/root cause/decomposition. Do not repeat prior tactics. `
  + j({ largestGap: critique.largestGap, regressions: critique.regressions });
```

**`runner/prompts.mjs`** — stable prefix first, `j()` instead of pretty-print.

```js
export function builderPrompt({ config, round, snapshot, critique, checks }) {
  return assemblePrompt({
    stable:   [config.prompt, BUILDER_CONTRACT],                 // byte-identical every round
    volatile: [`ROUND ${round}`, `WORKSPACE\n${snapshot || "(empty)"}`,
               `CHECKS\n${j(checks || [])}`, `CRITIQUE\n${critique || "(first round)"}`,
               "Make the highest-leverage change against the largest gap. Strict JSON only."],
  });
}
```

**`runner/checks.mjs`** — stop hoarding output on success.

```js
child.on("close", code => {
  const ok = code === 0;
  resolve({ command, ok, code,
    stdout: ok ? "" : stdout.slice(-4000),
    stderr: ok ? "" : stderr.slice(-4000) });
});
```

**`lib/cost/ledger.mjs`** — re-export the real table.

```js
export { estimateCost, PRICE_TABLE } from "../../runner/token-budget.mjs";
```

and record tokens alongside dollars in `recordCall` so `state.costLedger` shows burn per role.

**Guardrail** — before each `callLogged`:

```js
assertBudget(bp, { maxTokens: config.tokenBudget?.builder ?? 60000, label: "builder" });
```

## Config additions

```json
"tokenBudget": { "builder": 60000, "critic": 45000, "judge": 15000 },
"snapshot":    { "maxFiles": 80, "maxChars": 140000, "deltaAfterRound": 1 },
"pricing":     { "openai:default": { "in": 1.25, "out": 10 } }
```

## Expected result

~1.48M → ~380k tokens for a 6-round × 3-candidate run on a 130k-char workspace,
before prefix-cache discounts. Nothing the builder, critic or judge can actually
*act on* is removed — only bytes none of them read.
