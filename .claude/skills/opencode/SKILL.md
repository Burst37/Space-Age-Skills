---
name: opencode
version: 1.0.0
description: Multi-provider coding agent with 75+ AI providers. Use opencode as an alternative coding environment that supports DeepSeek, Gemini, Codex, and other models alongside Claude.
allowed-tools: Bash
---

# OPENCODE v1.0.0
## Space Age AI Solutions — Multi-Provider Coding Agent

## When to load this skill

- Need to use DeepSeek, Gemini, or other models for coding tasks
- Running coding tasks in parallel with Claude Code
- User specifies a different AI model for a coding task
- Claude Code Router directs work to opencode

---

## OPENCODE BASICS

```bash
# Install
npm install -g opencode-ai

# Interactive session (default model)
opencode

# Specify provider and model
opencode --model anthropic/claude-sonnet-4-5
opencode --model deepseek/deepseek-v4
opencode --model openai/codex
opencode --model google/gemini-2.5-pro

# One-shot prompt
opencode -p "Refactor this function" < file.js

# With file context
opencode --context src/ -p "Review this codebase"
```

---

## PROVIDER ROUTING (Space Age)

```yaml
ROUTING_RULES:
  standard_builds: "deepseek/deepseek-v4"
  openai_stack: "openai/codex"
  overflow: "minimax/minimax-2.7"
  analysis: "google/gemini-2.5-pro"
  orchestration: "anthropic/claude-sonnet-4-5" (Claude Code)
```

---

## PARALLEL EXECUTION

```bash
# Run DeepSeek and Codex in parallel on different files
opencode --model deepseek/deepseek-v4 -p "Build hero section" < brief.md &
opencode --model openai/codex -p "Build navigation" < brief.md &
wait
```

---

## INTEGRATION WITH PRODUCTION PIPELINE

In Phase 5 (Development Handoff):
- Claude Code writes the development brief
- Opens opencode sessions for DeepSeek V4 (primary), Codex, MiniMax
- Each session handles one component/page
- Results collected and assembled by Claude Code orchestrator

---

## WHAT TO AVOID

- Don't use opencode for orchestration tasks (use Claude Code)
- Don't run more concurrent sessions than VPS resources allow
- Don't skip the development brief before starting an opencode session
