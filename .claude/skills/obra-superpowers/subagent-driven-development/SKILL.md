---
name: subagent-driven-development
description: >
  Use when executing a written plan with independent tasks. Dispatches one fresh
  subagent per task with quality gates at every step.
---

# SUBAGENT-DRIVEN DEVELOPMENT

Source: https://github.com/obra/superpowers

## Core Principles

**Fresh context per task:** Each subagent receives only what it needs — no inherited session history.

**Quality gates at every step:** implementer → self-review → task reviewer → fix loops → final whole-branch review.

**Continuous execution:** Run without pausing between tasks. Stop only when blocked, genuinely ambiguous, or complete.

## Process Flow

1. **Pre-flight scan** — Check the plan for internal contradictions before Task 1
2. **Per-task dispatch** — Implementer gets task brief + report path + minimal context
3. **Task review** — Verify spec compliance and code quality; loop fixes if needed
4. **Completion** — Mark task done in progress ledger; move to next
5. **Final review** — Whole-branch assessment before merge

## Critical Rules

- Always hand artifacts as files, never pasted text (task briefs, diffs, reports)
- Track progress in `progress.md` — completed tasks must survive context compaction
- Dispatch reviewers with diff files only — use `scripts/review-package BASE HEAD`
- Never skip re-reviews after fixes
- Never accept spec compliance issues as "minor"

## Model Selection

- Cheap models: mechanical tasks
- Standard: integration work
- Most capable: architecture decisions and final review

## When to Use

Choose when you have an implementation plan with mostly independent tasks and need to stay in the current session. For tightly coupled tasks, use executing-plans instead.
