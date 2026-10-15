---
name: finishing-a-development-branch
description: >
  Use when development work is complete and ready to wrap up. Verifies tests,
  detects environment, presents merge/PR/keep/discard options.
---

# FINISHING A DEVELOPMENT BRANCH

Source: https://github.com/obra/superpowers

## Announce

"I'm using the finishing-a-development-branch skill to complete this work."

## Core Workflow

Verify tests → Detect environment → Present options → Execute choice → Clean up

## Step 1: Verify Tests Pass

Run the full test suite. If tests fail: STOP. Do not proceed to any other step.

## Step 2: Detect Environment

Check if in a normal repo or worktree — determines which menu to present.

## Step 3: Present Exactly 4 Options

1. Merge back to base branch locally
2. Push and create a Pull Request
3. Keep the branch as-is
4. Discard this work

(Detached HEAD: show only 3 options — exclude merge)

## Step 4: Execute & Cleanup

- Execute the chosen option
- Clean up worktrees ONLY for Options 1 (merge) and 4 (discard)
- Run cleanup from main repo root — never from inside the worktree being removed

## Critical Rules

- Never proceed with failing tests
- Never merge without post-merge verification
- Never delete work without typed confirmation from user
- Always clean up worktrees you created (found under `.worktrees/` paths)
- Option 2 (PR): do NOT clean up — user needs worktree for PR feedback
