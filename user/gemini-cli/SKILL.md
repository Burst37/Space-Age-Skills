---
name: gemini-cli
description: >
  Operate Google's Gemini CLI as an AI agent in the terminal — Lane A
  orchestration, Google Search grounding, and free-tier Gemini 3 access.
---

# Gemini CLI — Terminal AI Agent Skill
**Purpose:** Run Gemini models directly from the terminal for Lane A pipeline tasks, code generation, web search grounding, and MCP-connected automation  
**Source:** `google-gemini/gemini-cli` (Apache 2.0)  
**Maintained by:** Space Age AI Solutions

---

## WHEN TO USE THIS SKILL

- **Lane A** — Google Stack copy/structure (Gemini Flash 3.1 / Pro)
- Any task that benefits from **Google Search grounding** (real-time data, local business info, SEO research)
- Headless / batch jobs where you need a zero-cost Gemini call via the free tier
- Generating or editing files in a terminal session without a full IDE
- Spinning up a Gemini agent inside a GitHub Action (CI/CD)

---

## INSTALLATION

```bash
# No install — run instantly
npx @google/gemini-cli

# Or install globally
npm install -g @google/gemini-cli

# Homebrew (macOS/Linux)
brew install gemini-cli
```

---

## AUTHENTICATION

Choose one method. For pipeline use, prefer Option 2 (API key).

### Option 1 — Google Sign-In (Free Tier, Interactive)
```bash
gemini
# → choose "Sign in with Google" in the prompt
```
**Free tier:** 60 req/min · 1,000 req/day · Gemini 3 (flash + pro mix)

### Option 2 — API Key (Recommended for Pipeline)
```bash
export GEMINI_API_KEY="YOUR_API_KEY"
# Get key: https://aistudio.google.com/apikey
gemini -p "your prompt here"
```
**Benefits:** model selection, usage-based billing upgrade path, no browser required

### Option 3 — Vertex AI (Enterprise)
For Google Cloud/Workspace accounts — see the [auth guide](https://www.geminicli.com/docs/get-started/authentication).

---

## CORE COMMANDS

```bash
# Interactive session
gemini

# One-shot prompt (headless / pipeline-friendly)
gemini -p "Rewrite this headline for local SEO: Green Valley Plumbing, Mesquite TX"

# Pass a file as context
gemini -p "Summarize this build brief" < build_brief.json

# Use a specific model
gemini --model gemini-2.5-pro -p "..."
gemini --model gemini-2.5-flash -p "..."

# Enable Google Search grounding
gemini -p "What are the top plumbing companies in Mesquite TX?"   # grounding is on by default

# Pipe output directly to a file
gemini -p "Write full HTML for a plumber landing page" > site.html
```

---

## MODELS

| Model | Flag value | Best for |
|---|---|---|
| Gemini 2.5 Pro | `gemini-2.5-pro` | Complex reasoning, long context (1M tokens), premium quality |
| Gemini 2.5 Flash | `gemini-2.5-flash` | Fast, cost-efficient, high-volume copy tasks |
| Auto (default) | _(omit flag)_ | Let CLI route intelligently between flash and pro |

> **Lane A default:** Gemini Flash 3.1 for copy/structure → swap to `gemini-2.5-flash`.

---

## BUILT-IN TOOLS (no MCP needed)

| Tool | What it does |
|---|---|
| Google Search grounding | Real-time web results injected into context |
| File read/write | Read source files, write output files directly |
| Shell execution | Run bash commands from inside the agent loop |
| Web fetch | Fetch a URL and use content as context |

---

## MCP INTEGRATION

Gemini CLI supports MCP servers — connect it to any tool in the SA stack.

```json
// ~/.gemini/settings.json
{
  "mcpServers": {
    "higgsfield": {
      "command": "node",
      "args": ["/path/to/higgsfield-mcp-server/index.js"]
    }
  }
}
```

This mirrors how Claude Code loads MCP servers — the same servers work in both.

---

## PROJECT CONTEXT — GEMINI.md

Gemini CLI reads a `GEMINI.md` file at the project root (like `CLAUDE.md` for Claude Code). Create one to preload pipeline context:

```markdown
# Space Age AI — Project Context

## Stack
- Lane A: Gemini Flash 3.1 for copy, Google Stitch for UI, Seedance for BG video
- Hero images: GPT Image 2 via Higgsfield ($0 marginal)

## Current Task
[Build Brief goes here — injected by Hermes]

## Rules
- Always output single-file HTML unless asked for multi-file
- Inject schema.org JSON-LD before </body>
- Include llms.txt section at end of output
```

---

## PIPELINE INTEGRATION — LANE A

```
Hermes routes Build Brief to Lane A
        ↓
gemini-cli (Gemini Flash 3.1)
  ← Build Brief injected via GEMINI.md or stdin
  ← Google Search grounding pulls live local business data
  → Copy blocks + HTML structure output
        ↓
GPT Image 2 (via Higgsfield) → hero asset URL
        ↓
Google Stitch → UI prototype
        ↓
Vercel deploy
```

### Headless pipeline call (Lane A)
```bash
export GEMINI_API_KEY="$GOOGLE_GEMINI_API_KEY"
gemini --model gemini-2.5-flash -p "
You are the Lane A copy writer for Space Age AI Solutions.
Build Brief:
$(cat build_brief.json)

Output: complete single-file HTML shell with all copy written, schema.org JSON-LD injected, llms.txt block appended as HTML comment.
" > site.html
```

---

## GITHUB ACTIONS INTEGRATION

```yaml
# .github/workflows/gemini-review.yml
- uses: google-github-actions/run-gemini-cli@v1
  with:
    prompt: |
      Review this PR diff for SEO completeness.
      Check for: schema.org, llms.txt, NAP consistency, Core Web Vitals hints.
    files: '*.html'
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

---

## QUALITY RULES

1. **Prefer `gemini-2.5-flash`** for bulk / cost-sensitive Lane A jobs.
2. **Use `gemini-2.5-pro`** only for premium (Lane C overlap) or when 1M token context is required.
3. **Always pipe output** in headless mode — don't rely on interactive scrollback for pipeline data.
4. **Inject GEMINI.md** for any session longer than one prompt so context survives turn boundaries.
5. **Free tier is sufficient** for up to 1,000 Lane A site builds per day — no key needed for dev/testing.
6. **MCP servers** configured in `~/.gemini/settings.json` are shared across projects — configure once on the VPS.
