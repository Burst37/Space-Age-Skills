---
name: compound-loop-pro
description: A single-skill version of the compound-engineering five-step loop (brainstorm → plan → work → review → compound), enriched with surgical-change discipline, atomic-unit guardrail planning, parallel review-by-committee, and a persistent "lessons" vault so no project re-learns what the last one already knew.
metadata:
  origin: Forked and 10x'd from EveryInc/compound-engineering-plugin (37 skills + 51 agents, condensed to one). Adds Karpathy guidelines (think-before-coding, surgical changes, goal-driven execution) at every loop step, and an Obsidian-style linked "lessons vault" for the compound step (replacing a flat changelog with a searchable knowledge graph).
  license: MIT
---

# Compound Loop Pro

The original ships 37 skills and 51 agents around one idea: **the loop**.

```
brainstorm → plan → work → code-review → compound
"What's      "What does    "Build it."   "Review by   "Record the
 worth         this need                  committee."   lesson so the
 exploring?"   to be?"                                   next run
                                                          starts ahead."
```

This is a 10x condensation: one skill that runs the whole loop, with three things
the original loop structure didn't enforce on its own — **surgical-change discipline**,
**goal-driven verification**, and a **linked lessons vault** instead of a flat log.

## Step 1 — Brainstorm (kept, tightened)

Before generating options, state what you actually know vs. assume (Karpathy guidelines
§1, "Think Before Coding"): *"Known: X, Y. Assumed: Z — confirming before I build on it."*
Then generate 3–5 directions, not one. Pick the strongest, name why, and say what you're
**not** pursuing and why — that rejection is itself a lesson worth recording later (§5).

## Step 2 — Plan: Guardrails, Not Choreography (kept — this was the original's best idea)

A plan captures **decisions, scope, atomic units, files touched, test scenarios, risks** —
the WHAT. It does *not* pre-write code, exact signatures, or step-by-step shell sequences —
that's the HOW, and it's the implementer's call when code is in front of them. Plans that
pre-write implementation go stale before you start; plans that capture guardrails stay
useful for months.

Give every atomic unit a **stable ID** (U-1, U-2…) that survives reordering — so blocker
references in commits/PRs/conversation don't rot when the plan gets restructured.

**New addition — confidence check:** after drafting the plan, rate each section's groundedness
1–5. Anything below 3 gets one more research pass before work starts. Don't ship a plan with
a "TBD: figure out caching strategy" sitting in it — that's a planning-time question
disguised as an implementation-time one.

## Step 3 — Work: Surgical by Default (new — borrowed from Karpathy guidelines §2–3)

The original loop says "build it." That's the step most likely to scope-creep. Two hard rules:

- **Simplicity first.** Minimum code that satisfies the plan's atomic unit. No speculative
  flexibility, no "while I'm in here" refactors, no abstractions for single-use code.
- **Surgical changes.** Touch only what the unit requires. Match existing style even if
  you'd do it differently. If your change orphans an import or a helper, remove *that* —
  don't go hunting for unrelated dead code to "clean up."

The test for every changed line: does it trace directly back to a U-ID in the plan?
If not, it doesn't belong in this commit.

## Step 4 — Review by Committee, in Parallel (kept, made concrete)

Spin up multiple independent reviewers — correctness, security, style/consistency, and
"does this actually satisfy the plan's test scenarios" — and run them **in parallel**, not
sequentially, before merge. Disagreement between reviewers is signal, not noise: when two
reviewers flag the same area from different angles, that's the area to scrutinize hardest.

## Step 5 — Compound: A Lessons Vault, Not a Changelog (new — Obsidian-style linked notes)

The original's "compound" step writes down what was learned so the next run starts ahead.
Good idea, weak format — a flat append-only log becomes unsearchable noise within months.
Replace it with a **linked vault**, borrowing Obsidian's model:

- One short note per lesson: `lessons/<slug>.md` — what happened, why, what changed because of it.
- **Link, don't duplicate.** If a new lesson relates to an old one, link to it
  (`[[lessons/connection-pool-exhaustion]]`) instead of re-explaining it. Over time this
  forms a knowledge graph you can traverse, not a wall of text you have to re-read.
- Tag by domain (`#auth`, `#perf`, `#tooling`) so the *next* brainstorm step (§1) can
  search the vault for relevant prior lessons before generating fresh ideas — closing
  the loop back to the start.
- Each note ends with one line: **"Next time, start here:"** — the single highest-value
  thing a future agent should know before repeating this work.

## The Closing Check (new — Karpathy guidelines §4, applied to the whole loop)

Before calling the loop complete, answer in one line each:
1. Did the shipped work satisfy every atomic unit's test scenarios from §2? (yes/no, which failed)
2. Did review (§4) surface anything unresolved? (link it, don't bury it)
3. Is there a lessons-vault note (§5) that the *next* project's brainstorm step would
   actually find useful? If you can't name what it is, you haven't compounded anything yet.

## Attribution

The five-step loop concept, the guardrails-not-choreography planning philosophy, and
review-by-committee are from **EveryInc/compound-engineering-plugin**
(https://github.com/EveryInc/compound-engineering-plugin). This fork condenses the
plugin's 37 skills into one, and adds surgical-change discipline and goal-driven
verification (from Andrej Karpathy's LLM-coding guidelines, via multica-ai/andrej-karpathy-skills)
plus an Obsidian-style linked lessons vault (pattern from kepano/obsidian-skills) replacing
the flat changelog. Redistributed under the original's MIT terms.

## License

MIT
