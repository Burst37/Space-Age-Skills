# Elephant-Goldfish Model (EGM) — plain-English analysis for Space Age

Source: https://github.com/google/elephant-goldfish-model, commit `e4747323aab66157812cd3a71755f6447b2803a2`
(14 Nov 2026), plugin version 0.1.1. Licence: **Apache-2.0** (Copyright 2026 Google LLC). The README states it is
**not an officially supported Google product**. Analyzed 15 Nov 2026 (America/Chicago).

## What it is, in one paragraph
EGM is a plugin for AI coding assistants (Claude Code, Codex, Antigravity, Copilot; Cursor and others experimental) that
splits document work into two kinds of agent. The **elephant** is the agent you have been talking to: it remembers the
project and writes the plan or spec. The **goldfish** are reviewers started fresh, with no chat history. They get only
the document and the source files it points at, so they read what the page actually says, not what everyone meant.
They report gaps with a severity; the elephant fixes or argues back; **you** decide. The idea comes from Dave Rensin's essay
"Elephants, goldfish and the new golden age of software engineering."

## The seven skills
| Skill | What it does |
|---|---|
| `egm-brainstorm` | Talks an idea through with you, sends it to 7 fresh "brainstormer" reviewers, and writes `concepts_brief.md`. |
| `egm-draft` | Turns the brief into `design_draft.md`, one section at a time, pausing for your OK after each. |
| `egm-review` | The main review: 5 stages — zoom-out (is this the simplest thing?), comprehension (can a newcomer paraphrase it?), critic (design + structure + style), zoom-out again, implementation readiness. Interactive or one consolidated report. |
| `egm-review-loop` | The engine: given a doc, a list of reviewers and standards, it runs fresh reviewers in parallel, merges findings, hands them to `egm-resolve`, and repeats. Converged = 2 clean rounds in a row; cap 5 rounds; stops on "churn" (a fix causing the next finding). |
| `egm-resolve` | The elephant's side: sorts each finding into PROPOSE FIX or CONTEST (with evidence), writes `goldfish_review_report.md`, applies only the fixes you approve. |
| `egm-bootstrap` | Writes or refreshes design docs for an existing codebase. |
| `egm-drift-report` | Compares each design doc with the current code and lists only the differences. |

## The reviewers (`agents/`)
Ten persona prompts, all read-only and history-free: **zoom_out** (YAGNI, reuse, no over-engineering), **comprehension**
(paraphrase first; flags undefined terms), **design_critic** (stress-tests assumptions and risks), **structural**
(does the doc follow its template), **style** (cuts fluff, hype and uncalibrated claims), **implementation_readiness**,
**codebase_details** (checks names against real code), **inventive_catalyst** (TRIZ-style alternatives), **synthesizer**
(runs a swarm and de-duplicates), **bootstrap_orchestrator**. Findings use 🔴 Blocker / 🟡 Major / 🟢 Nit with a line range and
a reason. `resources/document_standards/` holds the rubrics (feature spec, zoom-out, implementation readiness, Heilmeier,
re-implementation). `resources/execution_instructions.md` adds strict session rules: one question at a time, no production
code while designing, stop on contradictions.

## What is good about it
- A real fix for a real failure: the agent that wrote a doc is the worst reader of it. Fresh context is a cheap second opinion.
- Findings need a location and a reason; "a reviewer that failed is not run, never zero findings"; convergence and churn rules
  stop endless review loops.
- The human stays in charge: CONTEST is allowed, nothing is applied without approval.

## Limits (honest)
- **Built for software design docs.** Brainstorm/draft/review/bootstrap/drift all assume a codebase. Other documents need you
  to pick reviewers and standards via `egm-review-loop`.
- **Needs a host that can spawn fresh subagents.** Without that EGM stops, by design. Cursor support is marked experimental
  and unverified upstream. Grok Bot can launch executor subagents, but their task text must not include the parent
  conversation, or they are not goldfish.
- **Heavy interaction model.** One question per turn, many checkpoint menus, up to 5 rounds. Too slow as-is for a 25-site
  demo batch; it needs caps.
- **Cost**: each stage launches 1–3 reviewers (×2 if the synthesizer doubles them); a full `egm-review` is 10+ subagent runs.
- **Fresh reviewers always find something.** Without the contest step and a round cap, you get churn and false positives.
- It does not test anything. A review is not QA; verify/axe/launch checks still decide.

## What fits Chuma's web work
- **Yes:** the goldfish idea applied to the hand-off docs (brief + SEO/AEO blueprint, design-spec + page text, built-vs-spec
  drift), with website lenses (clarity, conversion, SEO = AEO, trust and regulated tone, accessibility, motion/perf budget,
  brand/type/spacing, zoom-out) — implemented as CWB v3.4 goldfish reviews (see `goldfish-review.md`).
- **Yes:** `egm-review-loop` + `egm-resolve` as-is for any written plan (skills, SOPs, proposals) when the host can spawn subagents.
- **Maybe:** `egm-drift-report` for code repos (the Next.js builds).
- **No (for now):** the full 5-stage software review on every website; too heavy for local-business demos.

## Attribution
All files outside `space-age/` and `README.md`/`SKILL.md` at this folder's root are unmodified copies from the upstream commit above,
under the Apache License 2.0 (`LICENSE`). Space Age additions are in `space-age/`, `README.md` and `SKILL.md`.
