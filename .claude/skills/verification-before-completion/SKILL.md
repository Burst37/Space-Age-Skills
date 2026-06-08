---
name: verification-before-completion
description: Require fresh verification evidence before claiming a task is complete. Never claim done without running verification.
---

# Verification Before Completion

## When to use this skill

Load this skill when:
- You're about to tell the user "it's done"
- You've implemented a fix and want to confirm it works
- You've completed a task and want to provide evidence

## The core rule

**Never claim completion without fresh verification evidence.**

Fresh means: run after the final change, in the current session.

## What counts as verification

### For code changes
- Run the test suite and show passing output
- Run the specific test for the feature/fix
- Start the application and confirm behavior
- Show the actual output or screenshot

### For configuration changes
- Show the file content after change
- Run a command that uses the config and show output

### For refactoring
- Run full test suite (tests prove behavior preserved)
- Show before/after for the key change

## What does NOT count as verification

- "I'm confident this is correct"
- "The logic looks right"
- "I tested it earlier" (before the final change)
- Running tests that don't cover the changed code

## Verification report format

When claiming completion, provide:

```
Verification:
- Ran: [command]
- Output: [relevant output]
- Confirms: [what this proves]
```

## What to avoid

- Don't skip verification when "it's obviously right"
- Don't run verification before making the final change
- Don't claim partial verification as full verification
