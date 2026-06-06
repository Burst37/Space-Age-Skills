---
name: finishing-a-development-branch
description: Use after all tasks complete — verifies tests, detects environment, presents merge/PR/keep/discard options, handles cleanup.
source: https://github.com/obra/superpowers
license: MIT
---

# Finishing a Development Branch

Verify tests → Detect environment → Present options → Execute choice → Clean up.

## Step 1 — Verify Tests Pass

**Before presenting any options, run the test suite:**

```bash
npm test  # or cargo test / pytest / go test ./...
```

**If tests fail:** Stop immediately. Report failures. Do not proceed to options.

## Step 2 — Detect Environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

- **Normal repo** (`GIT_DIR == GIT_COMMON`): Show 4 standard options
- **Named-branch worktree** (`GIT_DIR != GIT_COMMON`): Show 4 options with provenance-based cleanup
- **Detached HEAD**: Show 3 reduced options (exclude merge)

## Step 3 — Present Options

```
1. Merge back to base branch locally
2. Push and create a Pull Request
3. Keep the branch as-is
4. Discard this work
```

(Omit option 1 for detached HEAD.)

## Step 4 — Execute Choice

**Option 1 — Merge:**
- Merge to base branch
- Run tests again on merged result
- If tests pass: clean up worktree and delete branch
- If tests fail: report, ask how to proceed

**Option 2 — Push + PR:**
- Push branch to remote
- Create PR (use gh CLI or GitHub MCP)
- **Do NOT clean up worktree** — developer needs it for iteration

**Option 3 — Keep:**
- Preserve worktree and branch exactly as-is
- No cleanup

**Option 4 — Discard:**
- Require explicit "discard" confirmation before any deletion
- Delete branch and remove worktree (if you created it)

## Cleanup Rules

- Only clean up worktrees for Options 1 and 4
- Only remove worktrees YOU created (`.worktrees/` or similar)
- Never remove externally managed workspaces
- Always run `git worktree prune` after removal
- Execute cleanup from the main repository root
