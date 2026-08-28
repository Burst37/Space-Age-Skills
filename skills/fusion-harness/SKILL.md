---
name: fusion-harness
description: >
  Multi-model/multi-agent orchestration patterns for Claude Code, reconstructed from disler's
  "fusion-harness" Pi-agent extension concept ("fuse 2-5 frontier models instead of racing
  them — AND, not OR") and reimplemented on Claude Code's own primitives (the Agent tool's
  per-call `model` override, `isolation: "worktree"`, and TaskCreate/TaskUpdate) rather than
  Pi's YAML model-stack + TUI. Five reconstructed modes: Opinion (parallel independent read-only
  answers, no merge), Fusion (parallel read-only research fanned in, one sole-writer synthesis
  pass), Debate (N-round position exchange, no judge), Collaborate (independent plans merged
  into a dependency DAG, executed with a single-writer discipline), and Auto-Validate (gate-first
  — write the failing acceptance check before building). Use this skill whenever the ask is to
  "fuse models instead of picking one," get "N independent opinions," "have two approaches
  debate," "collaborate across multiple agents on one plan," or "validate gate-first before
  building." Trigger on: "fusion harness", "fuse the models", "don't race models fuse them",
  "get opinions from multiple models", "N-way debate", "collaborate mode", "single-writer
  invariant", "gate-first validation", "AND not OR".
---

# Fusion Harness — Multi-Agent Orchestration (Reconstructed for Claude Code)

## What this is

This skill is a **reconstruction**, not a port. [`disler/fusion-harness`](https://github.com/disler/fusion-harness) (MIT) is a TypeScript extension for the **Pi coding agent** that fuses 2–5 frontier models (Claude, GPT, Gemini, DeepSeek, Kimi, etc. — genuinely cross-provider) behind five slash commands, a YAML model-stack config, a live TUI model bar, per-slot persistent sessions, and an atomic file-lease process that enforces "only one agent writes to the working directory at a time."

None of that substrate exists in Claude Code: there's no Pi host, no YAML stack file, no TUI footer, and no cross-process file lease. What Claude Code *does* have is the **Agent tool** — which can spawn subagents with a per-call `model` override (`sonnet`, `opus`, `haiku`, `fable`), run them in parallel or sequentially, background or foreground, and optionally in an isolated git worktree — plus `TaskCreate`/`TaskUpdate` for a visible task board. This skill maps fusion-harness's five orchestration *patterns* onto those primitives. See `references/reconstruction-notes.md` for the full mechanism-by-mechanism mapping and an honest list of what is **not** reproduced.

**Core idea carried over unchanged:** model rankings flip constantly; betting a whole workflow on one model means re-betting it every month. Running several models/passes against the same problem and either comparing or fusing the results is a hedge against that — *AND, not OR*.

## The five reconstructed modes

### 1. Opinion — independent answers, no merge
Spawn multiple `Agent` calls **in a single message** (true parallelism), each given the identical prompt, each told explicitly to answer read-only (no edits, just investigate/answer). Vary the `model` param across calls (e.g. one `opus`, one `sonnet`, one `haiku`) so the "opinions" come from genuinely different capability tiers rather than the same model asked twice. Present all answers side by side with no synthesis — the user judges. Use for: "what would you do differently," sanity-checking a decision, surfacing disagreement early.

### 2. Fusion — parallel research, one sole writer
Same fan-out as Opinion, but every spawned agent is a **read-only researcher** (explicitly instructed not to edit files) producing a written recommendation. Once all return, **you** (the orchestrating session) are the single FUSION agent: read every recommendation, merge them into one plan, and be the only one who touches the working tree. State explicitly in your merge which parts came from which line of reasoning. This reproduces the original's "single-writer invariant" without needing a lease file — because in Claude Code there is only ever one active top-level thread doing the writing; the discipline is: **spawned research agents never get `isolation: worktree` write access to the real tree, only the orchestrator commits.**

### 3. Debate — N rounds, no judge
Round 1: spawn N agents independently, each producing a falsifiable position on the same question, no visibility into each other. Round 2+: for each surviving agent, include the other agents' full prior-round positions verbatim in its next prompt ("Agent A said: ... Agent B said: ..."), and explicitly allow it to hold, switch, or synthesize — but require it to name what evidence moved it if it changes position. Run 2–3 rounds by default. Do **not** add a judging/merge step — the closing positions are the deliverable, and the user (not an agent) decides. This is the one mode where accepting no automatic conclusion is the point.

### 4. Collaborate — independent plans → merged DAG → dependency-ordered execution
1. Spawn N agents in parallel, each independently proposing a plan (read-only, no edits) for the same goal.
2. You (or one designated "architect" agent) merge the N proposals into a single task list with explicit dependencies — a DAG, not a flat list. Two tasks with no dependency between them can run in parallel; a task with an unmet dependency waits.
3. Execute: for independent tasks, spawn parallel `Agent` calls, each in its own `isolation: "worktree"` so they can write without colliding; for dependent tasks, run them sequentially in the main tree once their prerequisite lands. Track progress with `TaskCreate`/`TaskUpdate` as a visible board (queued/in-progress/blocked/done), mirroring the original's live task board.
4. Close with a final integration pass in the main tree merging worktree branches and reconciling anything the parallel tasks didn't anticipate.

The single-writer invariant here means: **never let two agents hold write access to the same tree at the same time.** Worktree isolation is what makes "parallel AND safe" possible without a file-lease daemon.

### 5. Auto-Validate — gate-first
Before any implementation: write the acceptance check (a failing test, a lint rule, a schema validator — whatever "passing" concretely means) and confirm it fails for the right reason (red, not broken). Only then build, iterating until the gate passes. Cap retries (the original defaults to 5); after repeated failures, switch a following pass to read-only triage — diagnose *why* it keeps failing — rather than trying a 6th blind fix. If the gate itself turns out to be wrong, fix the gate once, explicitly, rather than silently loosening it to make code pass.

## Command-to-primitive quick reference

| Original `/fh-*` command | Reconstructed as |
|---|---|
| `/fh-opinion <prompt>` | N parallel `Agent` calls, one message, read-only instruction, varied `model` |
| `/fh-fusion "<prompt>" "<instruction>"` | N parallel read-only `Agent` research calls → one orchestrator-authored merge, sole writer |
| `/fh-debate --rounds N <prompt>` | Sequential rounds of parallel `Agent` calls, each round's prompt includes prior round's labeled positions |
| `/fh-collaborate <prompt>` | Parallel plan proposals → merged dependency DAG → parallel `isolation:worktree` execution for independent tasks, sequential for dependent ones → final integration pass |
| `/fh-auto-validate <prompt>` | Write failing gate → confirm red → build to green, capped retries, triage-only pass on repeated failure |
| `/fh-only [slot]` | Just address one specific `Agent` call directly instead of fanning out |
| `/fh-model` | Choosing which `model` value to pass per `Agent` call |

## When NOT to use this

Skip the fan-out for anything a single pass answers confidently and cheaply — Opinion/Debate/Collaborate all cost multiple agent invocations. Reach for a single `Agent` call (or none) when the task is small, well-scoped, or already has an obvious correct answer.

## Further reading

`references/reconstruction-notes.md` — full mechanism mapping, sourcing, license, and what was deliberately left out of this reconstruction (cross-provider models, YAML stack config, TUI model bar, TPS telemetry, atomic cross-process writer lease, persistent per-slot sessions).
