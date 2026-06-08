---
name: test-driven-development
description: RED-GREEN-REFACTOR TDD discipline. Use when building new functionality to ensure correctness and maintainability.
---

# Test-Driven Development

## When to use this skill

Load this skill when:
- Building new functionality
- The user says "use TDD", "write tests first", or "red-green-refactor"
- The behavior to implement can be specified as testable criteria

## The RED-GREEN-REFACTOR cycle

### RED: Write a failing test

1. Write a test that describes the desired behavior
2. Run it — confirm it **fails** (if it passes, the test is wrong or the feature already exists)
3. The failing test is your specification

Good tests are:
- **Specific**: test one behavior
- **Readable**: the test name describes what it verifies
- **Independent**: doesn't rely on other tests or external state
- **Fast**: runs in milliseconds

### GREEN: Make it pass (minimally)

1. Write the **minimum** code to make the test pass
2. Don't over-engineer — just make it green
3. Run the test — confirm it **passes**
4. Run the full suite — confirm nothing broke

### REFACTOR: Clean up

1. Now that behavior is verified, improve the code:
   - Remove duplication
   - Improve naming
   - Extract functions or modules
   - Improve performance
2. Run tests after every refactor step
3. Tests must remain green throughout

## What to avoid

- Don't write implementation before the test
- Don't write more code than needed to pass the current test
- Don't refactor while red
- Don't skip the refactor step — it's how you prevent technical debt
- Don't test implementation details — test behavior

## TDD for different situations

**Bug fixes**: Write a failing test that reproduces the bug, then fix it.

**API design**: Write the test as you'd want to use the API, then implement to match.

**Refactoring existing code**: Write tests for current behavior first, then refactor.
