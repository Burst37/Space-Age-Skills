---
name: claude-code-review-plugin
description: Anthropic's official automated PR code-review plugin — launches 4 parallel specialized agents (CLAUDE.md compliance, correctness, security, etc.) with confidence-based scoring to filter false positives before posting review comments. Use for automated pull-request review distinct from the Space Age `code-review-pro` skill (that one is a from-scratch supercharge of a different upstream; this is the vendored Anthropic original).
version: 1.0.0
source: https://github.com/anthropics/claude-code/tree/main/plugins/code-review
---

## Overview

Vendored copy of Anthropic's `code-review` plugin (`.claude-plugin/plugin.json`
+ `/code-review` command). On invocation it:

1. Checks if review is needed (skips closed/draft/trivial/already-reviewed PRs)
2. Gathers relevant `CLAUDE.md` guideline files from the repo
3. Summarizes the PR's changes
4. Launches 4 parallel agents to independently audit the diff from
   different angles (2x CLAUDE.md compliance + others), then
   confidence-scores findings to cut false positives before posting

## When to reach for it

- Want the stock Anthropic review behavior rather than the Space Age
  `code-review-pro` supercharge — e.g. to compare output, or when a repo
  explicitly wants the unmodified official plugin installed.

## License

Vendored as-is from `anthropics/claude-code`; see that repo's LICENSE.
