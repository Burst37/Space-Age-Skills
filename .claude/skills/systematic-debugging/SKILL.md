---
name: systematic-debugging
description: Four-phase debugging approach: establish facts, identify pattern, form hypothesis, implement fix. Use when facing a bug that isn't immediately obvious.
---

# Systematic Debugging

## When to use this skill

Load this skill when:
- A bug isn't immediately obvious
- You've tried one fix and it didn't work
- The user says "figure out why this is broken"
- You need to debug without guessing

## The four phases

### Phase 1: Establish facts (root cause)

Before forming any hypothesis:
- Reproduce the bug reliably
- Identify what behavior you observe vs. what you expect
- Gather data: error messages, logs, stack traces
- Narrow down: when does it happen? When does it NOT happen?

**Do not skip this phase.** Jumping to solutions without facts leads to fixing the wrong thing.

### Phase 2: Identify the pattern

Look for patterns in the facts:
- Does it happen consistently or intermittently?
- Is it environment-specific (dev vs prod, OS, browser)?
- Does it correlate with specific inputs or states?
- When did it start? What changed recently?

### Phase 3: Form a hypothesis

Based on facts and pattern, form a specific, testable hypothesis:
- "I believe the bug is caused by X because Y"
- The hypothesis should predict specific behavior you can verify
- If you have multiple hypotheses, rank them by likelihood

### Phase 4: Implement and verify

1. Implement the fix for your top hypothesis
2. Verify it actually fixes the reproduction case
3. Verify it doesn't break other cases
4. Run the full test suite
5. If the fix didn't work, return to Phase 2 with new information

## What to avoid

- Don't skip to Phase 4 without completing Phases 1-3
- Don't change multiple things at once — you won't know what fixed it
- Don't declare fixed without reproducing the fix
- Don't add workarounds without understanding root cause

## Debugging tools

Use these systematically:
- Add targeted logging at the suspected location
- Use the debugger to inspect state at failure point
- Write a minimal reproduction case
- Check git blame — when did this code last change?
