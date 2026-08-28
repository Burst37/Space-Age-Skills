# Reconstruction notes — fusion-harness

## Source

- Repository: [`disler/fusion-harness`](https://github.com/disler/fusion-harness), by IndyDevDan.
- License: MIT.
- Analyzed: Aug 28, 2026, via a local clone of the public repo (README, `extensions/fusion-harness/` module tree, `prompts/`, `specs/` — file listing only, not full source review of every `.ts` file).
- Tagline: "Fuse 2–5 frontier models instead of racing them. AND, not OR."

This skill is an **independent reimplementation of the orchestration concepts**, written from scratch for Claude Code. No TypeScript source, prompt templates, YAML configs, or README text from the original repo were copied into this skill or into the Space-Age-Skills repo. Nothing from the original codebase is vendored here — that was a deliberate choice (see conversation instruction: "not copy, reconstruct").

## What fusion-harness (original) actually is

A Pi coding-agent extension providing:
- A YAML "model stack" (2–5 slots, one `architect: true`, one non-architect `primary: true`) that can span genuinely different providers — Anthropic, Google, OpenAI, Fireworks, OpenRouter — in one run.
- Five slash commands: `/fh-opinion`, `/fh-fusion`, `/fh-debate`, `/fh-collaborate`, `/fh-auto-validate`, plus utility commands (`/fh-only`, `/fh-model`, `/fh-system-prompt`, `/fh-reset`, `/fh`).
- A live TUI: a per-slot color-coded model bar (`belowEditor` widget) showing live speed/cost/context per slot, a responsive 1–5 column AgentGrid, and live task-board panels during collaboration.
- Clean-room child processes (`pi --mode json -p`) per model, killed with SIGTERM→SIGKILL process-tree escalation on interrupt.
- Persistent per-slot sessions that live for the app run (architect/secondary builders keep one session each; Main forks the host session).
- An atomic CWD-scoped writer-lease file that prevents two separate harness *processes* from mutating the same checkout concurrently, on top of tool-allowlist enforcement (`read,grep,find,ls` for read-only slots) and per-child process-group isolation.
- Fusion-context synchronization: after the sole-writer FUSION agent finishes, every other slot receives the full fused result and must reply with an exact `ACK FUSION <run-id>` string, hashed and logged, so every model's context is provably back in sync.
- Gate-first auto-validation: the VALIDATOR slot writes a `uv`-run acceptance gate to disk *before* any building, proves it starts red, then Main builds against it (capped retries, read-only triage brief from the third failure, one-shot gate-repair if the gate itself is broken).

## Mechanism-by-mechanism mapping to Claude Code

| Original mechanism | Claude Code reconstruction |
|---|---|
| YAML model-stack, 2–5 cross-provider slots | `Agent` tool calls with the `model` param set per call (`opus`/`sonnet`/`haiku`/`fable`) — Anthropic-only, no cross-vendor fan-out available |
| `/fh-opinion` fan-out, read-only tool allowlist | Multiple `Agent` invocations in one message (true parallelism), each prompted explicitly to stay read-only |
| `/fh-fusion` sole-writer FUSION agent + ACK sync | Orchestrator (this session) reads all parallel research results and is the only writer; no cryptographic ACK protocol — informal, stated in the merge |
| `/fh-debate` N-round rebuttal with labeled prior opinions | Sequential rounds of parallel `Agent` calls; each round's prompt manually includes prior rounds' labeled positions |
| `/fh-collaborate` architect-merged delegation DAG + dependency-ordered execution | Orchestrator merges N independent plans into a dependency list; independent tasks run via parallel `Agent` calls with `isolation: "worktree"`; dependent tasks run sequentially in the main tree; `TaskCreate`/`TaskUpdate` stands in for the live task board |
| Atomic cross-process writer-lease file | Not reproduced — Claude Code has one active orchstrating thread per session, so the "lease" is just orchestrator discipline: never grant two simultaneous agents write access to the same tree |
| Live TUI model bar, AgentGrid, TPS telemetry | Not reproduced — no TUI layer in Claude Code; this skill is prompting/workflow guidance only, not a rendered UI |
| `/fh-auto-validate` gate-first loop, capped retries, triage brief | Same *procedure* (write failing gate → confirm red → build to green → triage after N failures) run as ordinary Claude Code turns; no separate VALIDATOR process |
| Persistent per-slot sessions for the app run | Not reproduced — each `Agent` call is a fresh subagent invocation; no persistent cross-call session per "slot" |

## Deliberately not reproduced

- **Cross-provider model fan-out.** The original's real advantage is genuinely different model *families* (Claude vs. GPT vs. Gemini vs. DeepSeek vs. Kimi) disagreeing. Claude Code's `Agent` tool only varies Anthropic model tiers (opus/sonnet/haiku/fable) — a strictly smaller diversity of "opinions." Documented as a real limitation, not glossed over.
- **The TUI**: model bar, AgentGrid, task-board panels, TPS-per-slot readouts. Claude Code has no equivalent rendering surface for this skill to draw on.
- **The atomic writer-lease file** and per-child process-group kill-tree escalation — Claude Code doesn't expose raw child-process control to a skill.
- **YAML model-stack config file and `--fh-config` validation** — there's no analogous stack file in Claude Code; model choice is just the `model` argument on each `Agent` call.
- **The exact-hash ACK protocol** for fusion context sync — reconstructed only as "explicitly state the merge," not as a verifiable hashed handshake.

## Why reconstruct rather than vendor

The user explicitly asked for a reconstruction, not a copy, of this repository. Practically, vendoring the original TypeScript would also be dead code in this repo: Space-Age-Skills holds Claude Code skills (markdown + YAML frontmatter consumed directly by Claude Code), not a Pi-agent extension host — the original `.ts` files would not run here. Reconstructing the *orchestration patterns* as skill guidance is the version of this idea that's actually usable in this environment.
