---
name: mattpocock-skills
description: Matt Pocock's "Skills For Real Engineers" — 25 composable engineering and productivity skills for disciplined AI-assisted software development. Covers grilling/alignment interviews, shared-language domain docs (CONTEXT.md/ADRs), spec-to-ticket-to-implementation pipelines, TDD red-green-refactor, two-axis code review, bug diagnosis loops, codebase architecture surveys, merge-conflict resolution, and conversation handoffs. Use when the user wants to align with the agent before coding, turn a conversation into a spec/tickets, drive TDD, run a rigorous code review, diagnose a hard bug, survey a codebase for architecture debt, resolve a merge conflict, or hand off a session to another agent.
version: 1.0.0
source: https://github.com/mattpocock/skills
license: MIT
---

## Overview

A library of 25 reusable agent skills by Matt Pocock (Total TypeScript / AI Hero), built from real engineering practice rather than "vibe coding." They target four recurring AI-assisted-dev failure modes:

1. **Misalignment** — the agent builds the wrong thing because intent was never pinned down.
2. **Verbosity** — the agent burns tokens because it doesn't share the project's vocabulary.
3. **Broken code** — the agent lacks tight feedback loops (tests, types, browser access).
4. **Architectural rot** — agents accelerate entropy faster than humans can review it.

Skills split into two invocation classes:

- **User-invoked** — reachable only when explicitly typed as a slash command (e.g. `/grill-me`). These orchestrate.
- **Model-invoked** — reachable automatically when the task fits, or explicitly. These hold the reusable discipline (e.g. `/tdd`, `/code-review`).

A user-invoked skill may call a model-invoked one; never the reverse.

## Skills Included

### Engineering — user-invoked
- **ask-matt** — router: asks which skill/flow fits the current situation.
- **grill-with-docs** — alignment interview that also builds/updates the project's domain model (`CONTEXT.md`, ADRs) as it goes.
- **triage** — moves issues through a state-machine of triage roles.
- **improve-codebase-architecture** — scans a codebase for "deepening" opportunities (Ousterhout-style deep-module gaps), presents an HTML report, then grills through the one you pick.
- **setup-matt-pocock-skills** — one-time per-repo setup: issue tracker choice, triage labels, docs location.
- **to-spec** — synthesizes the current conversation into a spec and publishes it to the issue tracker (no interview).
- **to-tickets** — breaks a plan/spec/conversation into tracer-bullet tickets with declared blocking edges.
- **implement** — builds what a spec/tickets describe, driving `/tdd` at agreed seams, closing with `/code-review` before commit.
- **wayfinder** — plans work too large for one session as a shared map of decision tickets on the issue tracker, resolved one at a time.

### Engineering — model-invoked
- **prototype** — throwaway prototype (single HTML file, or several toggleable UI variants) to answer a design question.
- **diagnosing-bugs** — disciplined loop: reproduce red → minimize → hypothesize → instrument → fix → regression-test.
- **research** — investigates a question against primary sources, writes a cited Markdown file; can run as a background agent.
- **tdd** — red-green-refactor, one vertical slice at a time.
- **domain-modeling** — challenges terms against the glossary, stress-tests with edge cases, updates `CONTEXT.md`/ADRs.
- **codebase-design** — shared vocabulary/discipline for deep modules (small interface, large behavior, clean seam).
- **code-review** — two-axis review of the diff since a fixed point (coding standards + Fowler smells; spec fidelity), run as parallel sub-agents so neither pollutes the other.
- **resolving-merge-conflicts** — works an in-progress merge/rebase hunk by hunk, resolved by intent, never `--abort`.
- **wizard** — generates an interactive bash wizard for steps only a human can do (provisioning, credentials, unfamiliar dashboards, migrations).

### Productivity — user-invoked
- **grill-me** — relentless interview about a plan/design until every branch resolves. Non-code version of grill-with-docs.
- **handoff** — compacts the current conversation into a handoff doc for another agent/session.
- **teach** — teaches a concept over multiple sessions using the working directory as stateful memory.
- **to-questionnaire** — turns an undecidable-alone decision into an async Markdown questionnaire for the right person.
- **wait-what** — fired when a message doesn't land; re-pitches it in plain language using the project's `CONTEXT.md` vocabulary.

### Productivity — model-invoked
- **grilling** — the reusable interview primitive behind grill-me, grill-with-docs, triage, wayfinder, and improve-codebase-architecture.
- **writing-for-agents** — how to write docs meant to be read by agents: skills, AGENTS.md/CLAUDE.md, pointer-reached docs.

## Directory Layout

```
mattpocock-skills/
├── SKILL.md          ← this file (router/entry point)
├── LICENSE            ← MIT, Matt Pocock
└── skills/
    ├── engineering/<skill-name>/SKILL.md (+ supporting files)
    └── productivity/<skill-name>/SKILL.md (+ supporting files)
```

Setup: run `setup-matt-pocock-skills` once per project before using the other engineering skills — it asks which issue tracker (GitHub/Linear/local files), which triage labels, and where to save docs.

## Attribution

MIT License — Matt Pocock / mattpocock/skills (https://github.com/mattpocock/skills). Imported verbatim (25 shipped skills: engineering + productivity, matching the repo's official plugin manifest). Excludes the upstream `deprecated/`, `in-progress/`, and `misc/` directories, which are not part of the stable release.
