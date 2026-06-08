---
name: requesting-code-review
description: Dispatch a code reviewer subagent after completing a task. Use when implementation is done and review is needed before merging.
---

# Requesting Code Review

## When to use this skill

Load this skill when:
- Implementation is complete and you want a second pass
- The user asks for a code review of recent changes
- You want to catch issues before presenting to the user

## How to request a code review

### 1. Prepare the review request

Before dispatching a reviewer, prepare:
- **Diff summary**: what changed and why
- **Focus areas**: which parts most need scrutiny
- **Context**: what the code is supposed to do
- **Tests**: confirm tests pass before review

### 2. Dispatch the reviewer subagent

The reviewer should:
- Read the full diff
- Check for bugs, security issues, and logical errors
- Evaluate code quality and maintainability
- Verify tests cover the changes
- Look for unintended side effects

### 3. Process the review output

After review:
- Apply `receiving-code-review` skill to process feedback
- Address all must-fix issues
- Consider should-fix items
- Document reasoning for any feedback not acted on

### 4. Final check

After addressing review:
- Confirm all tests still pass
- Do a final read-through of the diff
- Proceed to `finishing-a-development-branch`

## What to avoid

- Don't request review of incomplete or broken code
- Don't skip review on complex changes
- Don't treat review as a formality — act on the feedback
