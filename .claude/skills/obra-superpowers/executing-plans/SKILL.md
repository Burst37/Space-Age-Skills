---
name: executing-plans
description: >
  Use when implementing a written plan. Work through tasks sequentially, stop on
  blockers, never guess, use finishing-a-development-branch to complete.
---

# EXECUTING PLANS

Source: https://github.com/obra/superpowers

## Process

**Initial Phase:**
1. Announce: "I'm using the executing-plans skill."
2. Load and critically review the plan
3. Raise any concerns with the human partner BEFORE starting

**Execution Phase:**
- Mark each task as `in_progress`
- Follow steps exactly as written
- Run specified verifications after each step
- Mark tasks `completed` only after verification passes

**Completion Phase:**
- Use `finishing-a-development-branch` skill — required, not optional

## Critical Rules

- Stop immediately on blockers, unclear instructions, or repeated verification failures
- Ask for clarification rather than guessing
- Never force through blockers
- Never begin implementation on main/master without explicit user consent
- Use `subagent-driven-development` when subagent support is available — produces higher quality

## Required Companion Skills

- `using-git-worktrees` — isolated workspace
- `writing-plans` — plan creation
- `finishing-a-development-branch` — development completion
