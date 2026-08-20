---
name: deep-research-pro
description: Use when answering "what is X", "research X", "compare X and Y", or before any content-generation task (reports, articles, presentations) that requires current, multi-source information — and a single search would be insufficient or unverifiable.
---

# Deep Research Pro

## Overview

Forked from [bytedance/deer-flow](https://github.com/bytedance/deer-flow)'s `deep-research` skill (4-phase: broad exploration → deep dive → diversity/validation → synthesis check). The original stops at "did I search from 3-5 angles?" — it has no mechanism to catch a confidently-stated but unsupported claim before it ships. This version adds a claim-verification ledger and a parallel-dispatch step for the deep-dive phase.

## When to Use

- Any "what is/explain/compare/research X" question.
- Before writing a report, article, or slide deck that cites facts, numbers, or trends.
- When the user's question spans multiple sub-topics that could be researched independently.
- NOT for simple lookups with one obvious authoritative source (e.g. "what's the syntax for X command" — just fetch the docs).

## Core Pattern

Original 4 phases (broad → deep dive → diversity → synthesis check) stay, with two additions:

**Addition 1 — Parallel deep-dive.** Once Phase 1 identifies N dimensions (e.g. "diagnostic AI", "regulatory landscape", "market trends"), dispatch one subagent per dimension in a single batch instead of researching sequentially. Each subagent returns sources + 2-3 sentence summary.

**Addition 2 — Claim ledger.** Before writing the final output, build a table of every non-obvious factual claim you intend to make, its source, and a confidence flag. Anything "unverified" gets either a second source or a hedge ("reportedly", "as of [date]") in the final text — never stated as flat fact.

## Quick Reference

| Phase | Original deer-flow | Addition |
|---|---|---|
| 1. Broad exploration | 2-3 broad searches, identify dimensions | — |
| 2. Deep dive | sequential targeted searches | dispatch subagents in parallel, one per dimension |
| 3. Diversity/validation | facts/examples/opinions/trends/comparisons/criticisms table | — |
| 4. Synthesis check | "searched from 3-5 angles?" checklist | + claim ledger (claim / source / confidence) |
| 5. Write | — | hedge or drop any "unverified" claim |

## Implementation

```
Claim Ledger (before writing):
| Claim                                  | Source           | Confidence |
|-----------------------------------------|-------------------|------------|
| "X market grew 40% in 2025"             | [report URL]      | verified (2 sources) |
| "Most practitioners now prefer Y"       | [single blog post]| unverified -> hedge |
| "Z was deprecated in version 3"         | [official changelog] | verified |
```

## Common Mistakes

- **Single-pass search then write** — the #1 failure mode the original skill targets; don't skip Phase 2/3 even under time pressure.
- **Sequential subagent dispatch** — wastes wall-clock time when dimensions are independent; batch them.
- **Stating blog-post claims as fact** — the claim ledger exists specifically to catch this before it reaches the user.
- **Treating "I read 5 search snippets" as research** — fetch full pages for anything you'll cite specifics from (numbers, quotes, dates).
