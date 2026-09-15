---
name: stop-wasting-tokens
version: 1.0.0
description: Audit and reduce agent token waste while preserving useful reasoning, code, constraints, and deliverable quality. Adapted from the uploaded stop-wasting-tokens prompt for portable Codex use.
---
# Stop Wasting Tokens — Codex Skill

## Goal
Reduce context and output waste without degrading the actual work.

## Audit
Check for oversized standing instructions, repeated background, unnecessary examples, stale context, verbose status narration, giant file reads, duplicate rules, overpowered models for routine work, and unnecessary tool definitions.

## Operating rules
- Answer directly; avoid restating the request.
- Load only files/references needed for the current step.
- Use targeted search/ranges before full-file reads.
- Summarize tool results into decisions rather than transcripts.
- Preserve code, commands, paths, IDs, URLs, dates, metrics, constraints, and citations.
- Use compact agent-to-agent handoffs.
- Split unrelated tasks into fresh contexts when practical.
- Use subagents/workstreams for large independent file investigations.
- Do not compress user-facing deliverables when clarity/style is the product.

## Output
Rank the biggest token wastes first and recommend the smallest changes with the highest savings.
