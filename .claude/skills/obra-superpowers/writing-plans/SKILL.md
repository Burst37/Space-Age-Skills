---
name: writing-plans
description: >
  Use when turning an approved design spec into a step-by-step implementation plan.
  Each task must be 2-5 minutes, include exact code, file paths, and commands.
---

# WRITING PLANS

Source: https://github.com/obra/superpowers

## Core Purpose

Generate comprehensive, actionable plans that guide implementation — assuming skilled engineers who need specifics, not hand-holding.

## Key Principles

**Task Design:** Each step is 2–5 minutes — discrete actions: write test → verify failure → implement → verify pass → commit.

**No Vagueness:** Every step includes actual code, exact file paths, specific commands with expected outputs. Placeholder language ("TBD", "add validation", "similar to Task N") is a plan failure.

**File Structure First:** Before tasks, map which files get created/modified and why. Locks in decomposition decisions.

**DRY, YAGNI, TDD:** No setup bloat. No speculative code. Tests drive implementation.

## Plan Format

Save to: `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

Include:
- Header: goal, architecture, tech stack, global constraints
- File structure map
- Numbered tasks with interfaces (what they consume/produce)
- Step-by-step instructions with code blocks and test commands

## Self-Review After Writing

- Every requirement from spec is mapped to a task
- Zero placeholder language remains
- Types are consistent across all tasks
- No task exceeds 5 minutes of work

## Execution Options

After saving, offer two paths:
- **Subagent-Driven** — fresh subagent per task, staged review (higher quality)
- **Inline Execution** — batch with checkpoints (faster)
