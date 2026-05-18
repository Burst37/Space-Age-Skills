---
name: opencode
display_name: SPACE AGE — OpenCode AI Agent
version: 1.0.0
last_updated: 2026-05
source: https://github.com/anomalyco/opencode
description: >
  Open-source AI coding agent with 75+ provider support (Anthropic, DeepSeek,
  Gemini, OpenAI, and more). Terminal TUI, desktop app, or IDE extension.
  Multi-provider routing, MCP server integration, Plan/Build modes, and project
  context via opencode.json. Trigger on: "opencode", "set up opencode",
  "open source agent", "use deepseek in terminal", or any multi-provider
  coding agent task.
trigger_phrases:
  - opencode
  - set up opencode
  - open source coding agent
  - use deepseek in terminal
  - multi-provider agent
  - opencode.json
---

# OPENCODE SKILL
## Space Age AI Solutions — Multi-Provider Coding Agent

OpenCode is the open-source AI coding agent — runs in the terminal, desktop, or
IDE, and connects to 75+ LLM providers. Use it when you need a coding agent
that's not tied to Anthropic billing, or when you want to route coding tasks to
DeepSeek, Gemini, or other providers at lower cost.

---

## WHEN TO USE THIS SKILL

- **Multi-provider coding sessions** — route to DeepSeek V4 (cheap), Gemini 2.5 Pro (long context), or Claude depending on task
- **Air-gapped / local-model projects** — Ollama, LM Studio, or any OpenAI-compatible endpoint
- **Team/org environments** — shared `opencode.json` config with org-level `.well-known/opencode` remote defaults
- **SA pipeline tasks** that don't need Claude Code specifically (e.g. running code-gen on a VPS with DeepSeek)
- **Pairing with SA-ORCHESTRATOR** — run opencode as a sub-agent in Lane B (DeepSeek) or Lane A (Gemini)

---

## INSTALLATION

```bash
# npm (recommended)
npm install -g opencode-ai

# bun / pnpm / yarn
bun add -g opencode-ai
pnpm add -g opencode-ai

# Homebrew (macOS/Linux)
brew install opencode

# Arch Linux
pacman -S opencode
# or AUR: yay -S opencode-bin

# Windows (Scoop)
scoop install opencode

# Docker
docker run -it --rm -v $(pwd):/workspace opencode/opencode

# Run without installing
npx opencode-ai
```

---

## QUICK START

```bash
# Start in current project
opencode

# Initialize project context (reads codebase, writes opencode.json summary)
/init

# Connect a provider (interactive)
/connect

# List and select a model
/models
```

---

## CONFIGURATION

Config files merge in this precedence order (later = higher priority):

| Source | Path |
|--------|------|
| Org remote defaults | `.well-known/opencode` |
| Global user config | `~/.config/opencode/opencode.json` |
| Custom path | `$OPENCODE_CONFIG` env var |
| Project config | `./opencode.json` |

### Schema validation (add to top of config)
```json
{
  "$schema": "https://opencode.ai/config.json"
}
```

---

## SA-OPTIMIZED CONFIG

Write to `~/.config/opencode/opencode.json` for global SA defaults:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-6",
  "small_model": "deepseek/deepseek-chat",
  "default_agent": "build",
  "snapshot": true,
  "provider": {
    "anthropic": {
      "apiKey": "{env:ANTHROPIC_API_KEY}"
    },
    "deepseek": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.deepseek.com/v1"
      },
      "apiKey": "{env:DEEPSEEK_API_KEY}",
      "models": {
        "deepseek-chat": { "name": "DeepSeek V4 Pro" },
        "deepseek-reasoner": { "name": "DeepSeek V4 Reasoner" }
      }
    },
    "gemini": {
      "npm": "@ai-sdk/google",
      "options": {},
      "apiKey": "{env:GEMINI_API_KEY}",
      "models": {
        "gemini-2.5-flash": { "name": "Gemini 2.5 Flash" },
        "gemini-2.5-pro": { "name": "Gemini 2.5 Pro" }
      }
    }
  },
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"],
      "enabled": true
    }
  }
}
```

Set env vars:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export DEEPSEEK_API_KEY="sk-..."
export GEMINI_API_KEY="AIza..."
```

---

## MODEL ROUTING — SA ALIGNMENT

| SA Lane | OpenCode Model String | Notes |
|---------|-----------------------|-------|
| Lane B default | `deepseek/deepseek-chat` | ~91% cheaper than Sonnet |
| Lane B reasoning | `deepseek/deepseek-reasoner` | Plan mode tasks |
| Lane A | `google/gemini-2.5-flash` | Fast copy + SEO tasks |
| Lane A long-ctx | `google/gemini-2.5-pro` | 1M token context |
| Lane C (premium) | `anthropic/claude-sonnet-4-6` | SA orchestration fallback |
| Lane C (opus) | `anthropic/claude-opus-4-7` | Complex architecture |
| Local / free | `ollama/llama3.3` | Air-gapped or dev |

Switch model mid-session:
```
/models
```
Then type to search (e.g. "deepseek") and select.

---

## AGENTS

OpenCode ships three built-in agents, switchable with **Tab**:

| Agent | Mode | Best for |
|-------|------|----------|
| **Build** | Read + Write | Default — full coding tasks |
| **Plan** | Read-only | Explore & design without changes |
| **General** | Read + Write | Complex searches, multistep research |

### Custom agent in opencode.json
```json
{
  "agent": {
    "sa-copy": {
      "model": "google/gemini-2.5-flash",
      "prompt": "You are the Space Age Lane A copy writer. Output single-file HTML with schema.org JSON-LD and llms.txt block.",
      "tools": { "bash": false }
    }
  }
}
```

---

## MCP SERVER INTEGRATION

OpenCode uses the same MCP servers as Claude Code — configure once, share across tools.

```json
{
  "mcp": {
    "higgsfield": {
      "type": "local",
      "command": ["node", "/path/to/higgsfield-mcp-server/index.js"],
      "enabled": true
    },
    "browserbase": {
      "type": "local",
      "command": ["npx", "-y", "@browserbasehq/mcp"],
      "enabled": true,
      "environment": {
        "BROWSERBASE_API_KEY": "{env:BROWSERBASE_API_KEY}",
        "BROWSERBASE_PROJECT_ID": "{env:BROWSERBASE_PROJECT_ID}"
      }
    },
    "shopify": {
      "type": "remote",
      "url": "https://mcp.shopify.com/mcp",
      "headers": {
        "Authorization": "Bearer {env:SHOPIFY_ACCESS_TOKEN}"
      },
      "enabled": true
    }
  }
}
```

Authenticate an OAuth MCP server:
```bash
opencode mcp auth server-name
```

---

## CORE SLASH COMMANDS

```
/init          — Analyze project and write context to opencode.json
/connect       — Add or update a provider API key
/models        — Browse and switch models
/share         — Generate a shareable conversation link
/undo          — Revert last file change
/redo          — Re-apply reverted change
```

### File references
```
@src/components/Hero.tsx     # Inject file content as context
@package.json                # Any project file
```

---

## PROJECT CONTEXT — opencode.json (project root)

OpenCode reads `opencode.json` at the project root for project-specific config (analogous to `CLAUDE.md` for Claude Code). Use it to pre-load task context:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "deepseek/deepseek-chat",
  "agent": {
    "build": {
      "prompt": "You are the Space Age dev agent for this project. Stack: Next.js 15, Framer Motion, GSAP. Always output TypeScript. Follow karpathy-guidelines."
    }
  },
  "tools": {
    "bash": true,
    "write": true
  }
}
```

---

## GITHUB ACTIONS INTEGRATION

```yaml
# .github/workflows/opencode-review.yml
name: OpenCode Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run OpenCode review
        run: |
          npx opencode-ai run \
            --model deepseek/deepseek-chat \
            --prompt "Review this PR for code quality, security issues, and SA stack compliance." \
            --no-interactive
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
```

---

## NEVER DO

- Never hardcode API keys in `opencode.json` — use `{env:VAR}` syntax
- Never set `default_agent: plan` globally — it disables writes and will silently refuse code changes
- Never run opencode inside another opencode session (nested agents cause context confusion)
- Never skip `/init` on a new project — the agent will lack codebase context

---

## SKILL CONNECTIONS

- **claude-code-router** — overlapping use case: CCR routes Claude Code requests; opencode natively routes across providers without a proxy
- **gemini-cli** — both access Gemini; prefer gemini-cli for one-shot headless Lane A calls, opencode for interactive multi-turn coding sessions
- **sa-orchestrator** — opencode fits SA TIER 5 as a local alternative to Claude Code for DeepSeek/Gemini routing
- **firecrawl-mcp / browserbase-browser** — wire in as MCP servers via `opencode.json` for web-grounded coding tasks
- **shopify-mcp** — use the remote MCP config to give opencode Shopify store access during theme dev
