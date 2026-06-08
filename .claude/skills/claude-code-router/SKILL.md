---
name: claude-code-router
version: 1.1.0
description: Routes Claude Code requests to the optimal AI model based on task type, cost, and capability. Manages multi-model orchestration for the Space Age AI Solutions production pipeline.
---

# CLAUDE CODE ROUTER v1.1.0
## Space Age AI Solutions — AI Model Routing Engine

## When to load this skill

- Deciding which AI model to use for a coding or reasoning task
- Optimizing cost vs. capability for production workloads
- Setting up multi-model parallel execution
- User asks "which model should handle this?"

---

## ROUTING TABLE

```yaml
ROUTING_RULES:
  
  # ORCHESTRATION (always Claude Code / Sonnet)
  orchestration:
    tasks: ["plan execution", "route tasks", "review output", "manage pipeline"]
    model: "claude-sonnet-4-5 (Claude Code)"
    why: "Best reasoning, context management, MCP tool access"
  
  # PRIMARY CODING (DeepSeek V4)
  primary_coding:
    tasks: ["write site code", "implement features", "build components"]
    model: "deepseek/deepseek-v4 (via opencode)"
    why: "95% Claude Opus quality at 1% of cost"
    ide: "VS Code on DigitalOcean VPS"
  
  # LARGE CONTEXT (Gemini)
  large_context:
    tasks: ["analyze entire codebase", "review 100K+ tokens", "full repo audit"]
    model: "google/gemini-2.5-pro (via gemini-cli)"
    why: "1M token context window"
  
  # OPENAI STACK (Codex)
  openai_stack:
    tasks: ["client on OpenAI stack", "overflow capacity"]
    model: "openai/codex (via opencode)"
    why: "OpenAI ecosystem compatibility"
  
  # OVERFLOW (MiniMax)
  overflow:
    tasks: ["high-volume day overflow"]
    model: "minimax/minimax-2.7 (via opencode)"
    why: "Additional parallel capacity"
```

---

## DECISION ALGORITHM

```
STEP 1: Is this an orchestration task?
  YES → Claude Code (Sonnet)
  NO  → STEP 2

STEP 2: Does it require >100K tokens of context?
  YES → Gemini CLI (gemini-2.5-pro)
  NO  → STEP 3

STEP 3: Is it a standard code generation task?
  YES → DeepSeek V4 via opencode (default)
  OVERFLOW or OPENAI STACK → Codex via opencode
  HIGH VOLUME → MiniMax via opencode
```

---

## PARALLEL EXECUTION

For maximum throughput, run multiple models simultaneously:

```bash
# Three agents building different components
opencode --model deepseek/deepseek-v4 -p "[hero section brief]" &
opencode --model openai/codex -p "[nav + footer brief]" &
gemini -p "[review full codebase for issues]" &
wait
# Claude Code integrates all outputs
```

---

## COST OPTIMIZATION

```yaml
COST_COMPARISON:
  claude_opus:    "$$$$$  — reserve for complex reasoning only"
  claude_sonnet:  "$$$$   — orchestration and review"
  gemini_pro:     "$$$    — large context, research"
  deepseek_v4:    "$      — primary coder (99% cheaper than Opus)"
  codex:          "$      — overflow coder"
  minimax_2_7:    "$      — high-volume overflow"
```

---

## WHAT TO AVOID

- Don't use Claude Code for bulk code generation (cost)
- Don't use Gemini for short-context tasks (overkill)
- Don't run more parallel sessions than VPS can handle
