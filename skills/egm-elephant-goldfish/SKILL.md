---
name: egm-elephant-goldfish
license: Apache-2.0
description: >-
  Use this when a plan, brief, spec, skill or proposal needs a fresh-eyes review before work starts: Google's
  Elephant-Goldfish Model (vendored @e4747323). The elephant (main agent) holds context and drafts; goldfish
  reviewers start with no conversation and read only the doc + sources; Chuma decides. Website hand-off docs use the
  CWB v3.4 goldfish reviews (space-age/goldfish-review.md); other docs use upstream egm-review-loop + egm-resolve.
source: "github.com/google/elephant-goldfish-model@e4747323 (Apache-2.0) + Space Age adapter"
---
# EGM — Elephant-Goldfish Model (Space Age entry point)

Read `space-age/ANALYSIS.md` for what this is and its limits.

| You have | Use |
|---|---|
| A website brief, design-spec or built preview (cinematic-website-builder) | CWB v3.4 goldfish reviews: `space-age/goldfish-review.md` (GR1/GR2/GR3, lenses in `goldfish-lenses.yaml`, script `scripts/goldfish.mjs` in the CWB skill) |
| Any other written plan (skill, SOP, proposal, README) | `skills/egm-review-loop/SKILL.md` with reviewers from `agents/` (e.g. `comprehension`, `zoom_out`, `style`) and a standard from `resources/document_standards/`, then `skills/egm-resolve/SKILL.md` |
| A software feature from scratch | `egm-brainstorm` → `egm-draft` → `egm-review` |
| Docs vs a code repo | `egm-drift-report` |

Rules that always apply:
1. A goldfish gets **only** the doc, rule files and sources. Never paste the conversation, a parent summary, notes or memory into its task.
   In Grok Bot: one executor per reviewer whose task is "Read <packet>/PROMPT.md and follow it."
2. No subagent tool → it is a self-check, not a goldfish review. Say so.
3. Every blocker/should cites evidence. The elephant may contest with evidence. Missing facts are asked, never invented.
4. Cap rounds (2 for website docs; upstream allows 5). A failed reviewer is "not run", never "zero findings".
5. Reviews are read-only and send nothing. Chuma approves changes.
