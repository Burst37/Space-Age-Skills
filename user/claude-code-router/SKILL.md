---
name: claude-code-router
display_name: SPACE AGE — Claude Code Router
version: 1.1.0
last_updated: 2026-05
source: https://github.com/musistudio/claude-code-router
description: >
  Intercepts all Claude Code requests and routes them to the right AI model based on
  task type. Enables zero-cost code tasks (DeepSeek V4), long context (Gemini 2.5 Pro),
  reasoning (DeepSeek V4 Reasoner), and swarm agents. Maps directly to SA-ORCHESTRATOR
  TIER 5. Trigger on: "set up the router", "route to DeepSeek", "use Gemini for this",
  "ccr", "model routing", "multi-model", or any TIER 5 routing configuration task.
trigger_phrases:
  - set up the router
  - route to deepseek
  - use gemini for this
  - ccr
  - model routing
  - multi-model claude
  - claude code router
  - tier 5
---

# CLAUDE CODE ROUTER SKILL
## Space Age AI Solutions — TIER 5 Model Routing Layer

Routes every Claude Code request to the optimal model based on task type.
Aligns directly with SA-ORCHESTRATOR TIER 5.

---

## ROUTING TABLE

| Task Type | SA Route | Cost vs Claude Sonnet |
|-----------|----------|-----------------------|
| Code gen / general | DeepSeek V4 Pro | ~91% cheaper |
| Background / light | DeepSeek V4 Pro | ~91% cheaper |
| Reasoning / Plan Mode | DeepSeek V4 Reasoner | ~70% cheaper |
| Long context (>60k tokens) | Gemini 2.5 Pro | Unblocked (1M ctx) |
| Web search | Gemini 2.5 Flash | Native grounding |
| Orchestration / planning | Claude (pass-through) | Stays here |

---

## INSTALLATION

```bash
npm install -g @anthropic-ai/claude-code
npm install -g @musistudio/claude-code-router
mkdir -p ~/.claude-code-router
```

---

## SA-OPTIMIZED CONFIG (DeepSeek V4)

Write to `~/.claude-code-router/config.json`:

```json
{
  "LOG": false,
  "API_TIMEOUT_MS": 600000,
  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "$DEEPSEEK_API_KEY",
      "models": ["deepseek-v4-pro", "deepseek-v4-flash"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-v4-pro": {
          "use": ["tooluse"]
        }
      }
    },
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "$GEMINI_API_KEY",
      "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
      "transformer": {
        "use": ["gemini"]
      }
    },
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "$OPENROUTER_API_KEY",
      "models": [
        "anthropic/claude-sonnet-4-6",
        "anthropic/claude-opus-4-7"
      ],
      "transformer": {
        "use": ["openrouter"]
      }
    }
  ],
  "Router": {
    "default": "deepseek,deepseek-v4-pro",
    "background": "deepseek,deepseek-v4-flash",
    "think": "deepseek,deepseek-v4-pro",
    "longContext": "gemini,gemini-2.5-pro",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

Set env vars (never hardcode keys):
```bash
export DEEPSEEK_API_KEY="sk-..."
export GEMINI_API_KEY="AIza..."
export OPENROUTER_API_KEY="sk-or-..."
```

---

## USAGE

```bash
ccr code          # Start Claude Code with routing active
ccr start         # Start router service only
ccr restart       # Apply config changes
ccr stop          # Stop the router
ccr ui            # Web UI for config editing
```

**Dynamic model switching mid-session:**
```
/model deepseek,deepseek-v4-pro
/model deepseek,deepseek-v4-flash
/model gemini,gemini-2.5-pro
/model openrouter,anthropic/claude-opus-4-7
```

---

## SWARM AGENT ROUTING

Tag each subagent to route to the correct model in parallel builds:

```
<CCR-SUBAGENT-MODEL>deepseek,deepseek-v4-pro</CCR-SUBAGENT-MODEL>
# Agent 1: primary code gen

<CCR-SUBAGENT-MODEL>gemini,gemini-2.5-flash</CCR-SUBAGENT-MODEL>
# Agent 2: fast HTML/CSS iteration

<CCR-SUBAGENT-MODEL>deepseek,deepseek-v4-flash</CCR-SUBAGENT-MODEL>
# Agent 3: background tasks
```

---

## TRANSFORMER REFERENCE

| Transformer | Use For |
|-------------|--------|
| `deepseek` | All DeepSeek providers |
| `gemini` | Google Gemini (direct API) |
| `openrouter` | OpenRouter unified API |
| `tooluse` | Tool call optimization |
| `reasoning` | Strips reasoning_content fields |
| `maxtoken` | Cap max_tokens: `["maxtoken", {"max_tokens": 65536}]` |
| `enhancetool` | Error-tolerant tool calls (Qwen models) |
| `cleancache` | Remove cache_control for non-Anthropic providers |

---

## PRESET MANAGEMENT

```bash
ccr preset export space-age-v1 --description "SA TIER 5 DeepSeek V4"
ccr preset list
ccr preset install /path/to/space-age-v1
```

---

## SA-ORCHESTRATOR TIER 5 ALIGNMENT

```
SA TIER 5 directive                    → ccr Router rule
─────────────────────────────────────────────────────────
Code gen → DeepSeek V4 Pro            → default: deepseek,deepseek-v4-pro
Fast iteration → DeepSeek V4 Flash    → background: deepseek,deepseek-v4-flash
Reasoning → DeepSeek V4 Pro           → think: deepseek,deepseek-v4-pro
Long context → Gemini 2.5 Pro         → longContext: gemini,gemini-2.5-pro
Web search → Gemini 2.5 Flash         → webSearch: gemini,gemini-2.5-flash
Orchestration → Claude                → (no rule — passes through)
```

---

## NEVER DO
- Never hardcode API keys in config.json — use `$ENV_VAR` syntax
- Never route orchestration/planning tasks away from Claude
- Never use deepseek-v4-pro for background tasks when v4-flash handles it
- Never set longContextThreshold below 40000
- Never run `ccr code` while `ccr start` is already running

---

## SKILL CONNECTIONS
- **SA-ORCHESTRATOR TIER 5** — this skill IS the TIER 5 implementation
- **firecrawl-mcp** — web scraping/search routes as background tasks → deepseek-v4-flash
- **browserbase-scraper** — scraper background tasks → deepseek-v4-flash
- **cinematic-website-builder swarms** — each agent gets CCR-SUBAGENT-MODEL tag
