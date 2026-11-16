# Goldfish review (v3.4) — fresh eyes on the hand-off docs

Adapted from Google's **Elephant-Goldfish Model** (EGM, Apache-2.0, `github.com/google/elephant-goldfish-model` @ `e4747323`,
"Not an officially supported Google product"). The full upstream plugin lives in Space-Age-Skills as
`skills/egm-elephant-goldfish/`. This file is the website version: same roles, website lenses, lean caps.

## Why
The agent that wrote a doc (the **elephant**) remembers everything that was said, so it reads what it *meant*, not what
the page *says*. A **goldfish** gets only the doc, the rules and the sources, with no conversation, so it finds the
missing facts, contradictions and rule breaks the elephant can't see. Chuma still makes every call.

On the Astonishing Touch example (see `examples/astonishing/EVAL.md`) the 3.3 doc gates (greybox lint, picker runs,
"no TODOs") raised 1 warning. The goldfish pass raised 20 findings: 14 confirmed against the live site, the docs or the skill's own
code (all 3 blockers among them), 1 partly right, 3 wrong, 2 judgment calls. 13 of the confirmed ones were not in the doc's own
conflict log, the earlier forensic audit, or the 3.3 gate output, including a "licensed health care agency" claim on the live site.

## Roles
| Role | Holds | Does |
|---|---|---|
| Elephant | the conversation, intake, decisions | writes the docs, packs the review, decides fix / contest / ask / accept-risk, edits the doc |
| Goldfish (one per lens) | only its packet: target doc(s), CWB rule files, sources (live URL, client files) | reads cold, reports findings with evidence, never edits |
| Chuma | the goals | answers the `ask` items **inside the approval he already gives** (moodboard, greybox, launch). No new approval stop. |

## Where it runs (three checkpoints, folded into existing gates)
| Review | After → before | Targets | Lenses (Enhanced+) | Factory / demo mode |
|---|---|---|---|---|
| **GR1** | G1 blueprint → G2 moodboard | `brief.md` (with the SEO/AEO blueprint) | naive-client, search-and-answers, trust-and-tone, zoom-out | search-and-answers, trust-and-tone |
| **GR2** | G5 design-spec + page-text → G6 assets | `design-spec.md`, `page-text.md`, `motion-plan.yaml`, `wireframe.yaml` | brand-and-type, accessibility, motion-and-performance, conversion | brand-and-type, accessibility |
| **GR3** | G8 QA pass → G9 launch | `design-spec.md`, `page-text.md` vs the built preview | drift | skipped (verify only) |

Lenses, their checks and their rule files: `references/goldfish-lenses.yaml` (adapted from EGM's comprehension, zoom-out,
design-critic, structural, style personas and the drift report).

## How to run one review
```bash
node $SKILL/scripts/goldfish.mjs pack GR1 --handoff handoff --source https://preview-url/ [--source client-files/] [--tier factory]
# → handoff/reviews/GR1-packets/<lens>/PROMPT.md + target/ + rules/ + sources/
```
1. **Launch one fresh subagent per packet**, in parallel. The task text is only: `Read <packet>/PROMPT.md and follow it.`
   Do not paste the conversation, the parent summary, notes or memory into it. In Grok Bot: one executor per packet with that
   one line; tell it not to use RecallMemory or transcript tools (the prompt also says so).
2. Merge the reports into `handoff/reviews/GR<n>-<doc>.md` (status table + one findings table, IDs renumbered `GR1-1…`). A lens that
   failed twice is `not run`, never "zero findings".
3. **Elephant resolves** each blocker/should in the Decision column: `fix` (edit the doc), `contest: <evidence the reviewer could
   read>`, `ask` (missing client fact or a taste call — goes to Chuma), `accept-risk: <reason>`. Nits: fix if trivial, else ignore.
4. `node $SKILL/scripts/goldfish.mjs lint handoff/reviews/GR1-brief.md --resolved` → exit 0. Set `review_gr1: done` in the brief.
5. **Round 2 only if a blocker was fixed** — re-pack just the lenses that raised it. **Max 2 rounds.** Anything still open goes to
   Chuma as one list with the next approval. Never loop to "zero findings": fresh reviewers always find something new.
6. Ask items are shown to Chuma together with the approval screen that follows (GR1 → moodboard, GR2 → one message before assets are generated, sent only if there are asks,
   GR3 → launch). One message, not one question per item.

## If no fresh subagents are available
A review in the same context is **not** a goldfish review. Run the lens checklists yourself as a **cold read** (re-open the files,
ignore the conversation), label the report `mode: self-check (not goldfish)` and tell Chuma. Never claim a goldfish pass you did not run.

## Rules
- Goldfish never edit, deploy, message, or see memory. `pack` refuses transcript/notes/memory-like files (`--allow-notes` overrides, don't).
- Evidence or it's a nit: every blocker/should cites a rule file + wording, a source, a URL + what it shows, or a computed number.
- Missing facts are **asked**, never invented (licence numbers, service area, reviews, years).
- The review does not replace `verify.mjs`, axe, `launch-check.mjs` or Chuma's eye. It runs earlier and catches doc-level problems
  those tools only find after code exists, or never (claims, missing facts, contradictions between docs and rules).
- Cost: GR1 4 subagents, GR2 4, GR3 1 (Factory: 2 / 2 / 0). Each reads ~5–15 files. Skip a gate only with a written reason in the brief
  (`review_gr2: skipped — <reason>`).
