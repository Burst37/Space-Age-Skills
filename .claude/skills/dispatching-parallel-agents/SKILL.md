---
name: dispatching-parallel-agents
description: Dispatch multiple independent subagents in parallel to complete tasks faster. Use when tasks can be split into independent workstreams.
---

# Dispatching Parallel Agents

## When to use this skill

Use parallel subagents when:
- The task has multiple independent components (e.g., implement 3 separate features)
- Different parts of the codebase need changes that don't interact
- Research and implementation can happen simultaneously
- You need to explore multiple approaches and pick the best one

## How to dispatch parallel agents

### 1. Decompose the task

Break the work into truly independent subtasks. A subtask is independent if:
- It doesn't depend on the output of another subtask
- It operates on different files or different parts of the system
- It can be reviewed and merged separately

### 2. Define clear boundaries

For each subtask, specify:
- **Scope**: exactly what files/components it touches
- **Input**: what context or data it needs
- **Output**: what it should produce (files, functions, tests, etc.)
- **Done criteria**: how to know when it's complete

### 3. Dispatch agents

Launch all agents simultaneously. Each agent should:
- Get a focused, self-contained prompt
- Have access to only the context it needs
- Know how to signal completion

### 4. Collect and integrate results

After all agents complete:
- Review each output independently
- Check for conflicts at integration points
- Merge or apply the changes
- Run the full test suite

## What to avoid

- Don't dispatch agents on tasks with hidden dependencies
- Don't let agents modify the same files without a merge strategy
- Don't skip the integration step — parallel work always needs reconciliation

## Example decomposition

Task: "Add user authentication"

| Agent | Scope | Output |
|-------|-------|--------|
| Agent 1 | Database schema | Migration file |
| Agent 2 | Auth API endpoints | Route handlers + tests |
| Agent 3 | Frontend login UI | React components |
| Agent 4 | Documentation | README updates |
