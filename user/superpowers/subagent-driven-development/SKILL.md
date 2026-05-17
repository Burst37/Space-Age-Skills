---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session. Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.
source: https://github.com/obra/superpowers
license: MIT
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Why subagents:** Delegate tasks to specialized agents with isolated context. They never inherit your session's context or history — you construct exactly what they need. This preserves your own context for coordination work.

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete.

## When to Use

Use when:
- You have an implementation plan
- Tasks are mostly independent
- You want to stay in the current session

Use `superpowers:executing-plans` instead when tasks are tightly coupled or you want parallel sessions.

## The Process

1. Read plan, extract ALL tasks with full text, note context
2. Create TodoWrite with all tasks
3. For each task:
   a. Dispatch implementer subagent with full task text + context
   b. Answer any questions before they proceed
   c. Implementer implements, tests, commits, self-reviews
   d. Dispatch spec compliance reviewer subagent
   e. If issues → implementer fixes → reviewer re-reviews
   f. Dispatch code quality reviewer subagent
   g. If issues → implementer fixes → reviewer re-reviews
   h. Mark task complete in TodoWrite
4. Dispatch final code reviewer for entire implementation
5. Invoke `superpowers:finishing-a-development-branch`

## Model Selection

| Task Type | Model |
|---|---|
| Isolated functions, 1-2 files, clear spec | Fast/cheap model |
| Multi-file coordination, integration | Standard model |
| Architecture, design, review | Most capable model |

## Handling Implementer Status

| Status | Action |
|---|---|
| DONE | Proceed to spec compliance review |
| DONE_WITH_CONCERNS | Read concerns before proceeding. Address correctness concerns; note observations. |
| NEEDS_CONTEXT | Provide missing context and re-dispatch |
| BLOCKED | Assess blocker: provide context, upgrade model, break task down, or escalate to human |

**Never** ignore a BLOCKED status or retry the same model without changes.

## Red Flags

**Never:**
- Start on main/master branch without explicit user consent
- Skip spec compliance OR code quality review
- Start code quality review before spec compliance is ✅
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel
- Make subagent read plan file (provide full text instead)
- Accept "close enough" on spec compliance
- Move to next task while either review has open issues

## Integration

- **Requires:** `superpowers:using-git-worktrees` (isolated workspace)
- **Requires:** `superpowers:writing-plans` (creates the plan)
- **Subagents use:** `superpowers:test-driven-development`
- **Ends with:** `superpowers:finishing-a-development-branch`
