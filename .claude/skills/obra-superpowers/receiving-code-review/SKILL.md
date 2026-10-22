---
name: receiving-code-review
description: >
  Use when receiving code review feedback. Evaluate with technical rigor, not
  performative agreement. Verify before implementing. Pushback is permitted.
---

# RECEIVING CODE REVIEW

Source: https://github.com/obra/superpowers

## Core Approach

Verification before implementation. Technical rigor over social comfort.

## Workflow

1. **READ** — Complete feedback without reacting
2. **VERIFY** — Confirm the technical claim is correct
3. **RESPOND** — Technical acknowledgment OR reasoned pushback
4. **IMPLEMENT** — Only after understanding is confirmed

If feedback is unclear: STOP. Do not implement anything until clarification arrives.

## Prohibited Responses

- "You're absolutely right!"
- "Great point!"
- "Thanks for catching that!"
- Any praise-based language

Replace with: restate the technical requirement, or proceed directly to the fix.

## When Pushback Is Correct

Push back when feedback:
- Conflicts with existing functionality
- Lacks full context about the codebase
- Violates YAGNI principles
- Would break something the reviewer didn't see

Support pushback with code evidence or specific clarifying questions.

## Trust Levels

- **Human partner feedback** — trusted, implement after verification
- **External suggestions** — verify against actual codebase usage, architecture alignment, potential breaks

## Implementation Standard

Fix issues individually. Test between each fix. If verification isn't feasible, state the limitation — never proceed blindly.

Actions speak. Just fix it.
