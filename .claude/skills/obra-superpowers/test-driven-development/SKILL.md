---
name: test-driven-development
description: >
  Use when writing any new feature, bug fix, or behavior change. Write a failing
  test first. No production code without a failing test. No exceptions.
---

# TEST-DRIVEN DEVELOPMENT

Source: https://github.com/obra/superpowers

## Core Principle

"If you didn't watch the test fail, you don't know if it tests the right thing."

## The RED-GREEN-REFACTOR Cycle

**RED:** Write one minimal test demonstrating required behavior. Verify it fails correctly.

**GREEN:** Implement the simplest code necessary to pass the test. No extra features.

**REFACTOR:** Clean up code while keeping tests passing. No new functionality.

## Critical Rules

- No production code without a failing test first
- If you write code beforehand, delete it and restart
- Never keep unverified code as "reference" or adapt it while testing
- Always watch each test fail before implementation

## Rationalizations to Reject

- "Tests written after code pass immediately" — this proves nothing about their validity
- "Manual testing is equivalent" — it's unsystematic and unrepeatable
- "This code is so simple it doesn't need tests" — simplicity doesn't predict correctness
- "I'll add tests after, I know this works" — sunk cost fallacy

## When TDD Applies

- New features ✅
- Bug fixes ✅
- Refactoring ✅
- Behavior changes ✅

Exceptions (require explicit human approval):
- Throwaway prototypes
- Generated/scaffolded code
- Configuration files
