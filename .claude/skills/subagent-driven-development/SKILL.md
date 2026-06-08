---
name: subagent-driven-development
description: Fresh subagent per task + two-stage review cycle. Use for complex multi-step development work.
---

# Subagent-Driven Development

## When to use this skill

Load this skill when:
- The task is complex enough to benefit from fresh context per step
- You want a structured development + review cycle
- The work spans multiple distinct phases

## The workflow

### Stage 1: Planning

1. Use `writing-plans` to create a detailed implementation plan
2. Get user confirmation on the plan
3. Break the plan into discrete implementation tasks

### Stage 2: Implementation (per task)

For each task:
1. Dispatch a fresh subagent with:
   - The specific task scope
   - Relevant context (files, specs, constraints)
   - Clear done criteria
2. Subagent implements and runs tests
3. Subagent reports completion with evidence

### Stage 3: Two-stage review

**Stage 3a — Implementation review:**
- Dispatch reviewer subagent on the fresh diff
- Reviewer checks for bugs, quality, test coverage
- Apply `receiving-code-review` to process feedback

**Stage 3b — Integration review:**
- After all tasks complete, review the full changeset
- Check for interactions between components
- Verify end-to-end behavior

### Stage 4: Completion

1. All tests pass
2. Use `verification-before-completion` to confirm
3. Use `finishing-a-development-branch` to ship

## Why fresh subagents?

- Avoids context contamination between tasks
- Each subagent starts with clear, focused scope
- Easier to parallelize independent tasks
- Review subagents have unbiased perspective

## What to avoid

- Don't skip the review stages
- Don't use one giant subagent for everything
- Don't proceed to integration review until all task reviews pass
