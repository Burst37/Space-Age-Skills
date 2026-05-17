---
name: systematic-debugging
description: Use when debugging any failure — enforces root cause investigation before attempting fixes. Symptom fixes are failure.
source: https://github.com/obra/superpowers
license: MIT
---

# Systematic Debugging

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Four Phases

### Phase 1 — Root Cause Investigation

- Read error messages thoroughly and completely
- Reproduce the issue consistently before doing anything else
- Examine recent changes (git log, git diff)
- Gather diagnostic evidence across system boundaries
- Trace data flow backward to find where the problem originates

**Do not propose solutions until you can explain exactly why the bug exists.**

### Phase 2 — Pattern Analysis

- Locate working examples of similar functionality
- Study reference implementations completely
- Identify differences between functional and broken code
- Understand all dependencies involved

### Phase 3 — Hypothesis Testing

- Form a specific, falsifiable hypothesis
- Make minimal test changes to verify it
- Verify results against the hypothesis
- If hypothesis is wrong, develop a new one — do not keep patching

### Phase 4 — Implementation

- Write a failing test that reproduces the bug first (TDD)
- Implement a single targeted fix
- Verify fix resolves the issue
- **If 3+ fix attempts have failed:** Stop. The problem likely indicates an architectural issue. Discuss with your human partner before continuing.

## Red Flags

| Anti-Pattern | Why It Fails |
|---|---|
| Proposing solutions without investigation | You'll fix the symptom, not the cause |
| Attempting multiple fixes simultaneously | You won't know what worked |
| Rushing under pressure | Pressure causes more bugs |
| 3+ failed fix attempts without stopping | Architectural problem masquerading as a bug |

## Why This Works

Systematic debugging resolves issues in 15-30 minutes vs. 2-3 hours of random troubleshooting. 95% first-time success rate vs. 40% for unsystematic approaches.
