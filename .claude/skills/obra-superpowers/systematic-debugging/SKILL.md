---
name: systematic-debugging
description: >
  Use when diagnosing any bug or unexpected behavior. No fixes without root cause
  investigation first. Replaces guesswork with evidence-based problem solving.
---

# SYSTEMATIC DEBUGGING

Source: https://github.com/obra/superpowers

## Core Rule

NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

Symptom-focused repairs generate secondary issues and wasted effort.

## The Four-Phase Structure

**Phase 1: Root Cause Investigation**
- Analyze error carefully
- Reproduce consistently
- Examine recent changes
- Trace data flow
- For multi-component systems: add diagnostic instrumentation at each boundary layer

**Phase 2: Pattern Analysis**
- Locate comparable working implementations
- Study reference examples thoroughly
- Document all differences between functional and broken code

**Phase 3: Hypothesis and Testing**
- Formulate specific theories about causation
- Test with minimal changes — one variable at a time

**Phase 4: Implementation**
- Create test cases BEFORE fixes
- Implement single changes
- If three or more fix attempts have failed: stop and question the architecture

## Red Flag Thoughts — Stop Immediately

- "Quick fix for now, investigate later"
- "Just try changing X and see"
- "One more fix attempt" (after 2+ failures)
- "I think it's probably..."
- "This should fix it"

## Evidence

Systematic debugging (15-30 min) vs random-fix approach (2-3 hours of repeated failures). The methodology is not optional.
