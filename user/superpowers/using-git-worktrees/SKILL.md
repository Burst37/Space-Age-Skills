---
name: using-git-worktrees
description: Use before implementation — ensures work happens in an isolated git workspace. Detect existing isolation first, then use native tools, then fall back to git.
source: https://github.com/obra/superpowers
license: MIT
---

# Using Git Worktrees

Ensure work happens in an isolated workspace.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0 — Detect Existing Isolation

**Before creating anything, check if you are already in an isolated workspace.**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard:** Also verify you are not in a submodule:
```bash
git rev-parse --show-superproject-working-tree 2>/dev/null
```

- **If `GIT_DIR != GIT_COMMON` (and not a submodule):** Already in a linked worktree. Skip to Step 3.
- **If `GIT_DIR == GIT_COMMON`:** Normal repo checkout — proceed to Step 1.

## Step 1 — Create Isolated Workspace

### 1a. Native Worktree Tools (preferred)

Check for a tool named `EnterWorktree`, `WorktreeCreate`, `/worktree`, or `--worktree`. If found, use it and skip to Step 3.

### 1b. Git Worktree Fallback (only if 1a doesn't apply)

**Directory priority:**
1. User's declared preference in instructions
2. Existing `.worktrees/` at project root (verify ignored)
3. Existing `worktrees/` at project root (verify ignored)
4. Existing `~/.config/superpowers/worktrees/<project>/`
5. Default to `.worktrees/` at project root

**Safety verification (project-local only):**
```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```
If NOT ignored: Add to `.gitignore`, commit, then proceed.

**Create:**
```bash
project=$(basename "$(git rev-parse --show-toplevel)")
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Sandbox fallback:** If `git worktree add` fails with a permission error, work in the current directory instead.

## Step 3 — Project Setup

```bash
if [ -f package.json ]; then npm install; fi
if [ -f Cargo.toml ]; then cargo build; fi
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi
if [ -f go.mod ]; then go mod download; fi
```

## Step 4 — Verify Clean Baseline

```bash
npm test  # or cargo test / pytest / go test ./...
```

**If tests fail:** Report failures, ask whether to proceed or investigate.
**If tests pass:** Report ready.

**Report:**
```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Red Flags

**Never:**
- Create a worktree when Step 0 detects existing isolation
- Use `git worktree add` when a native tool exists
- Create without verifying the directory is gitignored (project-local)
- Skip baseline test verification
- Proceed with failing tests without asking
