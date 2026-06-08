---
name: finishing-a-development-branch
description: Guide for completing development work — deciding whether to merge, create a PR, or discard. Use when a feature branch is done.
---

# Finishing a Development Branch

## When to use this skill

Load this skill when:
- Feature implementation is complete
- The user asks to "finish", "wrap up", "ship", or "merge" the current work
- You need to prepare a branch for review or merge

## Decision tree

### Is the work ready to merge?

Before declaring done, check:
- [ ] All tests pass
- [ ] No unresolved TODO comments from this session
- [ ] Code has been reviewed (or self-reviewed)
- [ ] Documentation updated if needed
- [ ] No debugging artifacts left (console.logs, debug flags, etc.)

### What's the destination?

**Direct merge to main** (small teams, no PR required):
1. Ensure branch is up to date with main
2. Run final test suite
3. Merge and delete branch

**Pull request** (code review required):
1. Push branch to remote
2. Create PR with clear title and description
3. Link related issues
4. Request reviewers

**Discard** (experimental work, wrong approach):
1. Confirm with user before discarding
2. Note any learnings worth preserving
3. Delete branch

## PR description template

```markdown
## What
[1-3 sentences describing what was built]

## Why
[The problem being solved or feature being added]

## How
[Key implementation decisions]

## Testing
[How to verify this works]

## Screenshots (if UI changes)
```

## What to avoid

- Don't merge without running tests
- Don't create a PR for unfinished work without marking it as draft
- Don't skip the cleanup step (debugging artifacts)
