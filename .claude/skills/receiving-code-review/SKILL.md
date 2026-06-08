---
name: receiving-code-review
description: Technical evaluation of code review feedback. Use when processing feedback from a reviewer and deciding what to act on.
---

# Receiving Code Review

## When to use this skill

Load this skill when:
- You've received code review comments
- The user shares reviewer feedback and asks how to respond
- You need to triage review feedback and create an action plan

## How to process review feedback

### 1. Categorize each comment

For every review comment, classify it as:
- **Must fix**: bugs, security issues, breaking changes, incorrect behavior
- **Should fix**: code quality, maintainability, style inconsistencies
- **Consider**: suggestions, alternative approaches, nice-to-haves
- **Discuss**: disagree or need clarification before acting

### 2. Acknowledge first, act second

For each comment:
- Confirm you understand what the reviewer is pointing out
- If unclear, ask a specific clarifying question
- Don't implement changes you don't understand

### 3. Handle disagreements professionally

If you disagree with feedback:
- State your reasoning clearly and specifically
- Reference existing patterns, docs, or constraints
- Offer to discuss synchronously if it's complex
- Default to reviewer preference on style/opinion questions
- Push back only on factual matters

### 4. Implement and re-request review

After addressing feedback:
- Summarize what was changed and why
- Note any comments that were explicitly not addressed (with reasoning)
- Re-request review

## What to avoid

- Don't implement feedback you don't understand
- Don't silently skip comments
- Don't be defensive — reviewer is trying to help
- Don't over-explain simple changes
