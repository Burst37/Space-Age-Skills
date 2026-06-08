---
name: using-git-worktrees
description: Set up isolated workspaces via git worktrees or native tools. Use when working on multiple branches simultaneously or needing isolation.
---

# Using Git Worktrees

## When to use this skill

Load this skill when:
- You need to work on multiple branches simultaneously
- You want to test a change without stashing current work
- Running parallel agents on different features
- Comparing behavior between branches

## How git worktrees work

A git worktree is a separate working directory linked to the same repository. Each worktree can be on a different branch, but they share the same `.git` directory and object store.

## Basic commands

```bash
# Create a new worktree for an existing branch
git worktree add ../feature-branch feature-branch

# Create a new worktree with a new branch
git worktree add -b new-feature ../new-feature main

# List all worktrees
git worktree list

# Remove a worktree (after work is done)
git worktree remove ../feature-branch

# Prune stale worktree references
git worktree prune
```

## Workflow for parallel development

1. **Main worktree**: your primary working directory (current branch)
2. **Feature worktrees**: separate directories per feature branch

```bash
# Setup
git worktree add -b feature-a ../worktree-a main
git worktree add -b feature-b ../worktree-b main

# Work in each independently
cd ../worktree-a && [implement feature A]
cd ../worktree-b && [implement feature B]

# Cleanup
git worktree remove ../worktree-a
git worktree remove ../worktree-b
```

## What to avoid

- Don't check out the same branch in two worktrees simultaneously
- Don't forget to clean up worktrees after use
- Don't run operations that modify `.git` config from multiple worktrees simultaneously
