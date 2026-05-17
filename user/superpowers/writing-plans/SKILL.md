---
name: writing-plans
description: Use after brainstorming approval — creates comprehensive implementation plans with 2-5 minute tasks, exact file paths, complete code, and TDD steps.
source: https://github.com/obra/superpowers
license: MIT
---

# Writing Plans

Write comprehensive implementation plans assuming the engineer has zero context for the codebase and questionable taste.

## Core Principle

**Target audience:** Skilled developers with minimal domain/toolset knowledge.
**Granularity:** Bite-sized tasks completable in 2-5 minutes.
**Methodology:** DRY, YAGNI, TDD, frequent commits.
**Format:** Save to `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## Requirements — No Exceptions

- No placeholder language: "TBD", "add validation", "similar to Task N" are all failures
- Complete code in every step where code changes occur
- Exact file paths and commands with expected outputs
- Type consistency across all tasks
- Self-review against spec coverage before handoff

## Plan Structure

```markdown
# Plan: <Feature Name>
Date: YYYY-MM-DD
Spec: docs/superpowers/specs/<feature-name>.md

## File Map
<list every file that will be created or modified>

## Tasks

### Task 1: <name>
**Goal:** <one sentence>
**Files:** <exact paths>

1. Write failing test:
```typescript
// exact test code
```
2. Run: `npm test path/to/test.ts` → expect: `FAIL: <exact message>`
3. Implement:
```typescript
// exact implementation code
```
4. Run: `npm test path/to/test.ts` → expect: `PASS`
5. Commit: `git commit -m "<message>"`
```

## Self-Review Checklist

Before presenting the plan:
- [ ] Every task has a failing test step
- [ ] Every task has expected command output
- [ ] No placeholder text anywhere
- [ ] File paths are exact (not "something like src/...")
- [ ] All spec requirements are covered by at least one task
- [ ] Tasks are truly 2-5 minutes each (split if larger)

## Execution Handoff

After plan is approved, offer two approaches:
1. **Subagent-driven** — fresh agent per task via `superpowers:subagent-driven-development`
2. **Inline execution** — execute tasks in current session via `superpowers:executing-plans`
