---
name: code-review-pro
description: Use when the user asks to review code, review a pull request, review staged/unstaged changes, review a commit, or compare branches for code quality issues, and the `ocr` CLI (open-code-review) is available — produces line-level review comments with a verified severity-scoring pass before reporting.
---

# Code Review Pro (open-code-review + verification)

## Overview

Forked from [alibaba/open-code-review](https://github.com/alibaba/open-code-review)'s `ocr` skill, which runs an LLM-backed reviewer over git diffs and reports High/Medium/Low findings. The original's priority classification is done in a single pass by the underlying LLM call with no second opinion — High/Medium/Low labels can be miscalibrated (real bugs marked Medium, style nits marked High). This version adds a re-scoring pass and a "did the fix actually fix it" verification loop.

## When to Use

- "Review my changes / this PR / commit X / branch vs main"
- Before committing significant changes, when `ocr` is installed and an LLM is configured
- NOT a substitute for tests — pairs with, doesn't replace, running the test suite

## Core Pattern

Original 4-step flow (prereq check → run `ocr review --audience agent` → classify by priority → fix) stays. Two additions:

1. **Re-scoring pass**: for every "High" finding, ask "what concretely breaks if this ships, and how would I demonstrate it?" If you can't articulate a concrete failure (a test that would fail, an input that crashes, a security exploit path), downgrade to Medium.
2. **Fix verification**: after applying fixes, re-run `ocr review` (or at minimum re-read the diff) on just the touched files to confirm the original finding no longer fires and no new High issues were introduced by the fix itself.

## Quick Reference

| Step | Command | Notes |
|---|---|---|
| Prereq check | `which ocr && ocr llm test` | Stop and ask user to configure LLM if this fails |
| Review | `ocr review --audience agent -b "<context>"` | Always pass `--background` |
| Re-score High findings | manual: "what concretely breaks?" | Downgrade unsupported High → Medium |
| Apply fixes | edit files (High + re-scored items) | Only with user permission unless "review and fix" requested |
| Verify | `ocr review --audience agent` on touched files | Confirm original findings resolved, no new High issues |

## Implementation

```bash
which ocr || npm install -g @alibaba-group/open-code-review
ocr llm test || { echo "Configure LLM first (OCR_LLM_URL/TOKEN/MODEL)"; exit 1; }

# Review with business context
ocr review --audience agent --background "<what this change does and why>"

# For each High finding: write one sentence — "this breaks because <concrete scenario>"
# If you can't, relabel as Medium.

# After fixes, re-review just the changed files
ocr review --audience agent --from HEAD~1 --to HEAD
```

Report format (unchanged from original):
```markdown
## Code Review Results
**Files reviewed**: N
**Issues found**: X high / Y medium (after re-scoring)

### High Priority
- **`path:line`** — description (concrete failure: ...)
  > Recommendation: ...
```

## Common Mistakes

- **Trusting the LLM's first-pass severity verbatim** — it conflates "stylistically odd" with "will break in production"; the re-scoring question filters this.
- **Fixing without re-running review** — a fix for one issue can introduce another (e.g. null-check added but now an unused variable, or the fix changes a function signature breaking a caller).
- **Running `ocr review` without `--background`** — review quality drops sharply without business context; always describe what the change is for.
- **Skipping `ocr llm test`** — a misconfigured LLM fails loudly mid-review, wasting the diff-gathering work already done.
