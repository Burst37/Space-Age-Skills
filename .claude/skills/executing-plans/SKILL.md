---
name: executing-plans
description: Load and execute an existing implementation plan. Use when a PLAN.md or similar planning document exists and it's time to implement.
---

# Executing Plans

## When to use this skill

Load this skill when:
- A PLAN.md, implementation plan, or spec document exists
- The user says "execute the plan", "implement this", "let's build it"
- You've just finished the `writing-plans` skill and are ready to implement

## How to execute a plan

### 1. Read the plan fully before starting

Before writing any code:
- Read the entire plan document
- Identify all phases/steps
- Flag any ambiguities or risks
- Confirm you have all the context you need

### 2. Execute phase by phase

Work through the plan sequentially:
- Complete one phase fully before moving to the next
- After each phase, verify it works as expected
- Check off completed items

### 3. Review checkpoints

At natural breakpoints (end of each phase):
- Run relevant tests
- Verify the behavior matches the plan
- Report status to the user
- Ask for confirmation before proceeding if there's meaningful risk

### 4. Handle deviations

If you discover the plan needs to change:
- Don't silently deviate — note the deviation
- Explain why the original approach won't work
- Propose the adjusted approach
- Get confirmation before proceeding

### 5. Complete the execution

After all phases:
- Run the full test suite
- Verify all acceptance criteria from the plan
- Use `verification-before-completion` to confirm
- Report what was built

## What to avoid

- Don't skip phases or steps to go faster
- Don't rewrite the plan mid-execution without flagging it
- Don't claim completion without running verification
