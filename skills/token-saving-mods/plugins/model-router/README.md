# model-router

Picks the model each subagent runs on. Before a subagent starts, Haiku reads its task and answers in JSON:

```json
{"tier": "fast", "confidence": 0.86, "effort": 1, "effort_confidence": 0.7, "risky": 0.02}
```

| Tier | Default model | For |
|---|---|---|
| `fast` | `claude-haiku-5-5` | Mechanical and local work: read or summarise a file, run one command, rename a symbol. |
| `balanced` | `claude-sonnet-5-5` | Ordinary engineering: a well-specified change across a few files, tests, a clearly described bug. |
| `deep` | `claude-opus-5-5` | Hard or high-stakes work: design, unknown failures, security, migrations, concurrency. |

The judge call goes through `$.model.complete` with `model: "haiku"`. The mod makes no other network call and needs no API key.

## Credit

This is a copy of `cli-tool/components/mods/productivity/jev-model-router` from [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), MIT license (see `LICENSE`). The original asked TypeSafe's Jev. This copy asks Haiku in place of Jev.

## Changes in this copy (BenAI, 2026-11-02)

- **Haiku is the only judge.** The TypeSafe and Vercel AI Gateway paths are gone: no HTTP calls, no key options, no env reads.
- **The downgrade bar works.** The old fallback (`$.model.classify`) gave a label with no confidence, so a task never moved down from Opus. Haiku now gives a confidence from 0 to 1. A task moves to a cheaper model only when that confidence is at least `minDowngradeConfidence` (0.6). It moves to a dearer model at `minUpgradeConfidence` (0.3) or more.
- **Fail-open.** A judge call that errors, runs past `timeoutMs`, or answers with no readable tier keeps the model as it is. A confidence that is not a number from 0 to 1 counts as none: it can never move a task down.
- **Risk forces the deep tier.** `risky` above 0.7 sends the task to `deep`, whatever the tier said. A task already on the deep tier keeps its exact id (`claude-opus-5-5[1m]` stays as it is).
- **Task text is cut** at 12,000 characters before it goes to the judge, and sits inside `<task>` tags that the judge is told to treat as data.
- **Tiers are full ids.** `claude-haiku-5-5`, `claude-sonnet-5-5`, `claude-opus-5-5`.
- **Main chat model: never changed.** A model change mid-chat throws the whole prompt cache away.
- **Main chat effort: off by default.** `routeMainEffort` is `false`. When on, it leaves effort alone while `~/.claude/mods-logs/.stably-<session id>` holds `"active":true`.
- **The /mods switch.** `"model-router": false` in `~/.claude/mods/switches.json` turns every hook into `next(e)`. Read at session start and every 3 seconds.
- **Savings ledger.** When a picked subagent's run ends (`turn.complete`), one line goes to `~/.claude/mods-logs/savings.jsonl` with `"mod":"model-router"`:
  - `model`: the model it ran on. `replaced`: the model it would have run on. `changed`: true or false.
  - `cost_usd`: `before`, `after` and `saved`, the run's real token counts priced at list price on both models (prices cached 2026-10-06).
  - `before` and `after` are the same token count: a model swap saves dollars, not tokens.
  - `helper`: `{"model":"claude-haiku-5-5","in":…,"out":…}`, the judge call's real token counts.
  - `router`: `"haiku"`.
  - `detail`: a short file in `~/.claude/mods-logs/model-router/` with the decision and the cost math.
  - No ledger line when the judge gave no decision.
- **Plain log.** `~/.claude/mods-logs/model-router.log`: the setup line, the first time each hook fires, every spawn, every judge answer with its confidence, and every ledger line.
- **Command.** `/model-router` shows the judge, the bars, the picks in this chat and the saving.

Known limit: when the Agent call names no model, the "replaced" model is the parent's. An agent type with its own model in its definition is not seen here, so its saving can be overstated.

Known limit: Haiku's confidence is its own estimate. It is not calibrated. A live test shows whether 0.6 separates easy tasks from the rest.

## The pane: Subagent Model Selector

On camera the pane is called "Subagent Model Selector". The folder, the switch key and `/model-router` keep the old name.

- It opens by itself when Claude starts a subagent. If you close it, it stays closed until you ask for it again.
- Reopen it with every card from this chat: type `/model-router pane` (or `/model-router`), or press Open in `/mods`.
- `"model-router:hidden": true` in switches.json (the Shown/Hidden button in `/mods`) stops it opening by itself. The routing goes on.
- One card for each subagent: the task, Haiku's tier and confidence, the model it ran on, the model it would have run on, and one plain sentence on why. Kept models get a card too, for example "Kept Opus: confidence 0.45 under the 0.6 bar."
- When the run ends, the card shows the dollars saved (or the extra cost).
- "Details" opens a card: Haiku's whole answer, the time it took, the rule, the risk score, the list prices, the task and the detail file, with a button to open it.
- Tiles on top: subagents, how many moved, dollars saved.
- The mascot is a pixel Claude dispatcher with a blue cap, a signal paddle and three doors (Haiku, Sonnet, Opus). It waves only while Haiku judges a task.
- The `/mods` switch closes the pane, and the pane says "Turned off".
- The log names each task on its spawn, judge and decision lines, for example `spawn general-purpose "Read README.md and say what": ...`, so parallel spawns can be matched.

## Reading the log

```
ready on the Haiku judge (claude-haiku-5-5, 8000ms limit); routing subagent model
judge (general-purpose): tier fast (0.86) · effort 1.0 → medium (0.70) · risky 0.02 · 1240ms
general-purpose: claude-opus-5-5 -> claude-haiku-5-5: fast (confidence 0.86)
judge (general-purpose): tier fast (0.45) · effort 1.0 → medium (0.50) · risky 0.01 · 1180ms
general-purpose: kept claude-opus-5-5: kept claude-opus-5-5, wanted claude-haiku-5-5 (confidence 0.45)
```

- `judge (...)` is what Haiku answered, before the policy.
- `kept ..., wanted ...` means the bar stopped the move.
- `judge gave no answer (...)`, `judge answer unreadable` or `judge call refused` means the model was kept and no ledger line is written.

## Options

```
fastModel:              string  default claude-haiku-5-5
balancedModel:          string  default claude-sonnet-5-5
deepModel:              string  default claude-opus-5-5
minUpgradeConfidence:   number  default 0.3
minDowngradeConfidence: number  default 0.6
routeSubagentModel:     boolean default true
routeMainEffort:        boolean default false
timeoutMs:              number  default 8000 (Haiku takes about 1.3 s)
logDecisions:           boolean default true
```

## Privacy

The subagent's prompt (cut to 12,000 characters), its description and its agent type go to Haiku through the engine's own model call. Nothing else leaves the machine.

## Tests

```
claude plugin test ~/.claude/mods/model-router
```
