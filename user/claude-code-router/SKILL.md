---
name: claude-code-router
display_name: SPACE AGE — Claude Code Router
version: 1.0.0
last_updated: 2026-05
source: https://github.com/musistudio/claude-code-router
description: >
  Intercepts all Claude Code requests and routes them to the right AI model based on
  task type. Enables zero-cost code tasks (DeepSeek), long context (Gemini 2.5 Pro),
  reasoning (DeepSeek Reasoner), and swarm agents. Maps directly to SA-ORCHESTRATOR
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

This skill installs and configures `claude-code-router` (ccr) — the interceptor
that routes every Claude Code request to the optimal model based on task type.
Aligns directly with SA-ORCHESTRATOR TIER 5.

---

## WHAT IT DOES

Every request Claude Code makes passes through ccr before hitting any API.
ccr reads the request type and routes to the configured model:

| Task Type | SA Route | Why |
|-----------|----------|-----|
| Code gen / general | DeepSeek V3 | Near-zero cost, strong coder |
| Reasoning / Plan Mode | DeepSeek Reasoner | Chain-of-thought, complex logic |
| Long context (>60k tokens) | Gemini 2.5 Pro | 1M context window |
| Web search | Gemini 2.5 Flash | Native search grounding |
| Background / light tasks | DeepSeek V3 (fast) | Speed + cost |
| Swarm agents (site builds) | Tag per agent (see below) | Parallel multi-model execution |

---

## INSTALLATION

```bash
# 1. Install Claude Code (if not already installed)
npm install -g @anthropic-ai/claude-code

# 2. Install the router
npm install -g @musistudio/claude-code-router

# 3. Create config directory
mkdir -p ~/.claude-code-router
```

---

## SA-OPTIMIZED CONFIG

Write this to `~/.claude-code-router/config.json`:

```json
{
  "LOG": false,
  "API_TIMEOUT_MS": 600000,
  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "$DEEPSEEK_API_KEY",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
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
        "anthropic/claude-opus-4-7",
        "mistralai/codestral-mamba",
        "qwen/qwen3-coder"
      ],
      "transformer": {
        "use": ["openrouter"]
      }
    }
  ],
  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "deepseek,deepseek-chat",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "gemini,gemini-2.5-pro",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

Set your API keys as environment variables (never hardcode):
```bash
export DEEPSEEK_API_KEY="sk-..."
export GEMINI_API_KEY="AIza..."
export OPENROUTER_API_KEY="sk-or-..."
```

Or add them to `~/.zshrc` / `~/.bashrc` for persistence.

---

## STARTING THE ROUTER

```bash
# Start Claude Code with routing active
ccr code

# Or: start the router service separately, then run claude normally
ccr start
claude

# Restart after config changes
ccr restart

# Stop the router
ccr stop

# Open web UI for visual config editing
ccr ui
```

---

## DYNAMIC MODEL SWITCHING (IN-SESSION)

Switch models mid-session without restarting:

```
/model deepseek,deepseek-reasoner
/model gemini,gemini-2.5-pro
/model openrouter,anthropic/claude-opus-4-7
/model deepseek,deepseek-chat
```

---

## SWARM AGENT ROUTING

When SA-ORCHESTRATOR spins up parallel site-build agents, tag each subagent
to route to the correct model:

```
<CCR-SUBAGENT-MODEL>deepseek,deepseek-chat</CCR-SUBAGENT-MODEL>
# → Agent 1: primary code gen

<CCR-SUBAGENT-MODEL>gemini,gemini-2.5-flash</CCR-SUBAGENT-MODEL>
# → Agent 2: fast HTML/CSS iteration

<CCR-SUBAGENT-MODEL>openrouter,anthropic/claude-sonnet-4-6</CCR-SUBAGENT-MODEL>
# → Agent 3: quality review
```

This enables true multi-model swarm execution — each agent gets the cheapest
model that can handle its specific task.

---

## TRANSFORMER REFERENCE

| Transformer | Use For |
|-------------|--------|
| `deepseek` | All DeepSeek providers (also works for volcengine mirror) |
| `gemini` | Google Gemini (direct API) |
| `openrouter` | OpenRouter (unified API for 200+ models) |
| `tooluse` | Tool call optimization for DeepSeek chat |
| `reasoning` | Strips/handles `reasoning_content` fields |
| `maxtoken` | Cap max_tokens: `["maxtoken", {"max_tokens": 65536}]` |
| `enhancetool` | Error-tolerant tool calls (use with Qwen models) |
| `cleancache` | Remove cache_control fields for non-Anthropic providers |
| `groq` | Groq API adaptation |
| `vertex-gemini` | Gemini via Google Vertex AI (enterprise auth) |

---

## COST IMPACT

With SA routing config active:

| Request Type | Without Router | With Router | Savings |
|-------------|----------------|-------------|---------|
| Code gen (default) | Claude Sonnet ~$3/M | DeepSeek ~$0.27/M | ~91% |
| Long context | Claude Sonnet (limited) | Gemini 2.5 Pro (1M ctx) | Unblocked |
| Reasoning | Claude (3s think) | DeepSeek Reasoner | ~70% |
| Background | Claude Sonnet | DeepSeek chat | ~91% |

Orchestration, planning, and prompt tasks stay on Claude (no routing).

---

## PRESET MANAGEMENT

```bash
# Save current SA config as a preset
ccr preset export space-age-v1 --description "SA TIER 5 routing"

# List all saved presets
ccr preset list

# Switch to a preset
ccr preset install /path/to/space-age-v1

# View preset details
ccr preset info space-age-v1
```

---

## SA-ORCHESTRATOR TIER 5 ALIGNMENT

This router implements SA-ORCHESTRATOR TIER 5 at the infrastructure level:

```
SA-ORCHESTRATOR TIER 5 directive        → ccr Router rule
─────────────────────────────────────────────────────────
Code gen → DeepSeek V4 Pro              → default: deepseek,deepseek-chat
Fast iteration → DeepSeek V4 Flash      → background: deepseek,deepseek-chat
Reasoning → Claude (stay here)         → think: deepseek,deepseek-reasoner
Site builds swarm → Gemini/Minimax     → per-agent CCR-SUBAGENT-MODEL tags
Long context → Gemini 2.5 Pro          → longContext: gemini,gemini-2.5-pro
Orchestration → Claude (stay here)     → (no rule — ccr passes through)
```

---

## TROUBLESHOOTING

```bash
# Enable debug logging
# Set "LOG": true, "LOG_LEVEL": "debug" in config.json
ccr restart

# Test routing is active
ccr model  # should show current model assignment

# Force a specific model for one session
ccr code --model deepseek,deepseek-reasoner
```

---

## NEVER DO
- Never put API keys directly in config.json — use `$ENV_VAR` syntax
- Never route orchestration/planning tasks away from Claude
- Never use deepseek-reasoner for background tasks (slow + expensive)
- Never set longContextThreshold below 40000 (false positives on normal tasks)
- Never run `ccr code` without confirming `ccr start` is not already running

---

## SKILL CONNECTIONS
- **SA-ORCHESTRATOR TIER 5** — this skill IS the TIER 5 implementation
- **browserbase-scraper** — scraper runs as a background task → routes to deepseek-chat
- **cinematic-website-builder swarms** — each build agent gets its own CCR-SUBAGENT-MODEL tag
- **lead-to-brief + outreach-copywriter** — run on default (deepseek-chat), free
