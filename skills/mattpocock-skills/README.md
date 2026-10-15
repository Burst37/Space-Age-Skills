# mattpocock-skills

Matt Pocock's "Skills For Real Engineers" — agent skills for real software engineering, not vibe coding. Imported verbatim from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT licensed).

> My agent skills that I use every day to do real engineering — not vibe coding. Developing real applications is hard. Approaches like GSD, BMAD, and Spec-Kit try to help by owning the process. But while doing so, they take away your control and make bugs in the process hard to resolve. These skills are designed to be small, easy to adapt, and composable. They work with any model.
> — Matt Pocock

## Upstream installation options (for reference)

- Claude Code plugin: `claude plugins install mattpocock-skills` (managed, read-only, auto-updating)
- Editable copy on any agent: `npx skills@latest add mattpocock/skills`

This repo vendors an editable copy directly under `skills/mattpocock-skills/skills/`, following the same pattern as `obsidian-skills` in this library.

## Skills

### Engineering — user-invoked

| Skill | Description |
|---|---|
| [ask-matt](skills/engineering/ask-matt) | Router over the user-invoked skills — asks which one fits your situation |
| [grill-with-docs](skills/engineering/grill-with-docs) | Grilling session that also sharpens the project's domain model, updating `CONTEXT.md`/ADRs inline |
| [triage](skills/engineering/triage) | Moves issues through a state machine of triage roles |
| [improve-codebase-architecture](skills/engineering/improve-codebase-architecture) | Scans for deepening opportunities, presents an HTML report, then grills through the chosen one |
| [setup-matt-pocock-skills](skills/engineering/setup-matt-pocock-skills) | One-time per-repo setup (issue tracker, triage labels, docs layout) |
| [to-spec](skills/engineering/to-spec) | Synthesizes the current conversation into a spec and publishes it |
| [to-tickets](skills/engineering/to-tickets) | Breaks a plan/spec into tracer-bullet tickets with blocking edges |
| [implement](skills/engineering/implement) | Builds a spec/tickets, driving `/tdd` and closing with `/code-review` |
| [wayfinder](skills/engineering/wayfinder) | Plans multi-session work as a shared map of decision tickets |

### Engineering — model-invoked

| Skill | Description |
|---|---|
| [prototype](skills/engineering/prototype) | Throwaway prototype to answer a design question |
| [diagnosing-bugs](skills/engineering/diagnosing-bugs) | Reproduce → minimize → hypothesize → instrument → fix → regression-test loop |
| [research](skills/engineering/research) | Investigates a question against primary sources, writes a cited Markdown file |
| [tdd](skills/engineering/tdd) | Red-green-refactor, one vertical slice at a time |
| [domain-modeling](skills/engineering/domain-modeling) | Sharpens the domain model; updates `CONTEXT.md`/ADRs |
| [codebase-design](skills/engineering/codebase-design) | Discipline/vocabulary for deep modules |
| [code-review](skills/engineering/code-review) | Two-axis review (standards + spec fidelity) via parallel sub-agents |
| [resolving-merge-conflicts](skills/engineering/resolving-merge-conflicts) | Works an in-progress merge/rebase hunk by hunk |
| [wizard](skills/engineering/wizard) | Generates an interactive bash wizard for human-only setup steps |

### Productivity — user-invoked

| Skill | Description |
|---|---|
| [grill-me](skills/productivity/grill-me) | Relentless interview about a plan/design (non-code) |
| [handoff](skills/productivity/handoff) | Compacts a conversation into a handoff doc for another agent |
| [teach](skills/productivity/teach) | Multi-session teaching using the working directory as memory |
| [to-questionnaire](skills/productivity/to-questionnaire) | Turns a decision into an async Markdown questionnaire |
| [wait-what](skills/productivity/wait-what) | Re-pitches a message that didn't land, in plain language |

### Productivity — model-invoked

| Skill | Description |
|---|---|
| [grilling](skills/productivity/grilling) | Reusable interview primitive behind grill-me, grill-with-docs, triage, wayfinder, improve-codebase-architecture |
| [writing-for-agents](skills/productivity/writing-for-agents) | How to write docs meant to be read by agents |

## Setup

Run `setup-matt-pocock-skills` once per project before using the other engineering skills.

## Source

https://github.com/mattpocock/skills — imported at commit `0ab1b63a410a03d3627979a109c8695de27af954`. Only the 25 skills in the upstream plugin manifest (`engineering/` + `productivity/`) are included; `deprecated/`, `in-progress/`, and `misc/` were left out as not part of the stable release.
