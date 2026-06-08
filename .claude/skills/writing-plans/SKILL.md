---
name: writing-plans
description: Write a comprehensive implementation plan before touching code. Use for complex tasks that need structured thinking before execution.
---

# Writing Plans

## When to use this skill

Load this skill when:
- The task has multiple components or phases
- Implementation approach is not immediately obvious
- The user asks for a plan before implementation
- You need to sequence work with dependencies

## How to write a good plan

### Structure

A good implementation plan has:

1. **Goal**: What we're building and why (1 paragraph)
2. **Approach**: High-level technical strategy
3. **Phases**: Ordered list of implementation phases
4. **Each phase contains**:
   - What will be built
   - Key decisions
   - Done criteria
   - Dependencies on other phases
5. **Risks**: What could go wrong and mitigations
6. **Out of scope**: What we're explicitly NOT doing

### Depth calibration

- **Simple task** (1-2 hours): brief plan, 1-2 phases
- **Medium task** (half day): 3-5 phases, key decisions documented
- **Complex task** (multi-day): full plan document, all dependencies mapped

## Plan document format (PLAN.md)

```markdown
# [Feature Name] Implementation Plan

## Goal
[What we're building and why]

## Approach
[Technical strategy — 2-5 sentences]

## Phases

### Phase 1: [Name]
- [ ] Task 1
- [ ] Task 2
**Done when**: [specific criteria]

### Phase 2: [Name]
**Depends on**: Phase 1
- [ ] Task 1
**Done when**: [specific criteria]

## Risks
- [Risk]: [Mitigation]

## Out of scope
- [Thing not doing]
```

## After writing the plan

1. Present the plan to the user for feedback
2. Revise based on feedback
3. Get explicit confirmation before starting
4. Use `executing-plans` to implement

## What to avoid

- Don't write plans longer than necessary
- Don't plan implementation details that will be decided during coding
- Don't start implementation without plan approval
- Don't over-plan — bias toward action for small tasks
