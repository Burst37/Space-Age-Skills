# Space Age Agent OS

**Mission Control dashboard for Space Age AI Solutions.**  
All agents. One interface. Zero data leaves.

---

## Stack

- **Next.js 16** + React 19 + TypeScript
- **VL-01 Dark Glassmorphism Standard** — `#050508` OLED base, `backdrop-filter: blur(40px)`, LED domes
- **Fonts (Fontsource CDN):** Orbitron (headers) · DM Sans (body) · JetBrains Mono (all data)
- **xterm.js** — SSH terminal to VPS `146.190.78.120`
- **WebSocket SSH bridge** via custom `server.ts`

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your keys and VPS SSH key path

# 3. Run with SSH terminal support (requires custom server)
npx tsx server.ts

# 4. Or run standard (no SSH terminal)
npm run dev
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VPS_HOST` | Yes | `146.190.78.120` |
| `VPS_USER` | Yes | `root` |
| `VPS_KEY_PATH` | Yes | Path to SSH private key (e.g. `~/.ssh/id_rsa`) |
| `OPENROUTER_API_KEY` | Yes | For DeepSeek, Minimax, Gemma routing |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek V4 Pro direct API |
| `GEMINI_API_KEY` | Optional | Gemini API |
| `OPENAI_API_KEY` | Optional | OpenAI / Codex |
| `AGENTIC_OS_VAULT` | Optional | Obsidian vault path |

---

## Routes

| Route | Module |
|---|---|
| `/` | Mission Control (home dashboard) |
| `/claude` | Claude chat |
| `/codex` | Codex chat |
| `/gemini` | Gemini chat |
| `/openclaw` | OpenClaw multi-agent |
| `/terminal` | **SSH terminal → 146.190.78.120** |
| `/pipeline` | Lead gen pipeline monitor |
| `/studio` | Image generation (Higgsfield routing) |
| `/video` | Video generation (Seedance/Kling/Veo) |
| `/kanban` | Project kanban board |
| `/memory` | Obsidian vault memory |
| `/goals` | Goals tracker |
| `/journal` | Daily journal → vault |
| `/guide` | Documentation |

---

## Agent Routing

**CLI agents** (require binaries in PATH):
- `claude` — Claude CLI
- `codex` — Codex CLI  
- `gemini` — Gemini CLI
- `openclaw` — OpenClaw
- `hermes` — Hermes Agent (VPS)

**API agents** (OpenRouter / direct API):
- `deepseek` → DeepSeek V4 Pro (1.6T params, primary coder)
- `minimax` → Minimax 2.7 (long-context)
- `gemma` → Gemma 3 27B (fast/batch)

---

## Image Model Routing

| Model | Cost | Use Case |
|---|---|---|
| Seedream 5 | FREE 2K | Backgrounds, property, street scenes — **DEFAULT** |
| NanoBanana Pro | Credits | Character mascots, Pixar CGI, stylized art |
| ChatGPT Image 2.0 | Credits | Product hero, luxury brand, ultra-detail |

---

## Three-Brain Auto-Router

When you type **"check your work" / "review this" / "sanity check"** in any chat, the system routes to Codex adversarial review. SSH and billing-path code gets forced Codex review before shipping.

---

## Caveman Mode

Type `/caveman` in any chat to activate compressed response mode.  
Drops: articles, filler phrases, transition words.  
Fragments over full sentences. Max 1-2 sentences per concept.

Deactivate: `/normal`

---

## VPS Pipeline Stats

Create `/home/pipeline/stats.json` on your VPS with this shape:

```json
{
  "sitesToday": 12,
  "totalCost": 0.84,
  "lastBuilt": "Verdant Pro Landscaping",
  "agentStatus": {
    "deepseek": true,
    "gemini": true,
    "minimax": false,
    "codex": true,
    "gemma": true
  }
}
```

The Pipeline Monitor polls `/api/pipeline-status` every 15 seconds.

---

## Design System

**VL-01 Dark Glassmorphism Standard** — applied globally via `globals.css`.

Key rules:
- Background: `#050508` — never pure `#000`
- Glass: `backdrop-filter: blur(40px) saturate(180%)`
- Shadows: layered specular system (`--shadow-sm/md/lg`)
- LED domes: physically simulated with radial gradient `::before` + multi-layer glow
- Orange `#FF6B00` = Space Age primary (internal products only)

---

Built by Space Age AI Solutions · Dallas TX
