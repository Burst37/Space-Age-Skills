---
name: using-git-worktrees
description: >
  Use when starting implementation work. Creates an isolated workspace via git
  worktrees. Detect existing isolation before creating anything new.
---

# USING GIT WORKTREES

Source: https://github.com/obra/superpowers

## Core Workflow

**Step 0: Detect Existing Isolation First**

Check: `GIT_DIR != GIT_COMMON`

If already isolated — use native tools. Never create nested worktrees.

**Step 1a: Prefer Native Worktree Tools**

If platform provides native worktree support, use it. It handles directory placement and cleanup automatically.

**Step 1b: Manual Fallback**

```bash
git worktree add .worktrees/<branch-name> -b <branch-name>
```

Only when no native tool exists. Verify location is git-ignored before proceeding.

**Step 2: Setup**

Auto-detect project type and run appropriate dependency installation.

**Step 3: Verify Clean Baseline**

Run full test suite BEFORE starting work. Must be clean before proceeding.

## Critical Safeguards

- Never skip Step 0 — nested worktrees cause hard-to-debug failures
- Never use git commands when native tools are available
- Always verify directory is git-ignored for project-local worktrees
- Never proceed without a clean test baseline

## Core Principle

"Never fight the harness."
