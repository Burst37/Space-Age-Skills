# Hermes Web UI — Project Breakdown

## What It Is
A self-hosted, browser-based chat interface for the **Hermes Agent** by NousResearch.
It is a thin Python HTTP server + vanilla JavaScript frontend — no Node.js, no build step, no frontend framework.

## Architecture

### Backend (`server.py` + `api/`)
- `server.py` — `ThreadingHTTPServer` wrapping Python's stdlib `http.server`. Routes GET/POST/PUT/PATCH/DELETE to handlers in `api/routes.py`.
- `api/routes.py` — main HTTP routing layer (600 KB, ~15k LOC). Handles sessions, streaming, workspace, models, auth, etc.
- `api/config.py` — all shared constants, env-var configuration, global state (HOST, PORT, TLS, STATE_DIR, etc.).
- `api/models.py` — session/project CRUD with JSON file persistence and in-memory locking.
- `api/streaming.py` — SSE (Server-Sent Events) streaming of agent responses to the browser.
- `api/auth.py` — bcrypt password hashing, session cookies, optional WebAuthn/passkeys.
- `api/profiles.py` — multi-user profile isolation (separate sessions/settings per profile).
- `api/terminal.py` — embedded PTY terminal (browser ↔ shell via WebSocket-style SSE).
- `api/workspace.py` / `api/workspace_git.py` — file browser and Git integration.
- `api/providers.py` — LLM provider abstraction (OpenAI, Anthropic, Ollama, etc.).
- `api/oauth.py` — OAuth2 login flow.
- `api/plugins.py` — dashboard plugin loader.
- `api/gateway_chat.py` / `api/gateway_watcher.py` — proxy to Hermes Agent's native runner.

### Frontend (`static/`)
- **No build step.** Pure vanilla JS modules loaded directly by the browser.
- `static/index.html` — single-page app shell.
- `static/ui.js` — main UI controller (430 KB — handles panels, state, events).
- `static/panels.js` — three-panel layout manager (left sidebar, center chat, right workspace).
- `static/sessions.js` — session list, project grouping, drag/drop.
- `static/messages.js` — message rendering (markdown, KaTeX math, code highlighting).
- `static/commands.js` — slash-command palette.
- `static/terminal.js` — xterm.js-powered embedded terminal.
- `static/style.css` — 350 KB stylesheet; supports dark/light themes + Catppuccin presets.
- `static/i18n.js` — internationalization strings (950 KB — many languages).
- `static/sw.js` — PWA service worker for offline capability.

### MCP Server (`mcp_server.py`)
- Exposes Hermes WebUI as an **MCP (Model Context Protocol)** server.
- Tools: `list_projects`, `create_project`, `rename_project`, `delete_project`, `list_sessions`, `rename_session`, `move_session`.
- Can be connected to the Hermes Agent config so the agent can manage its own sessions programmatically.

### Bootstrap / Launch
- `bootstrap.py` — one-shot launcher: discovers the Hermes Agent venv, installs WebUI deps, spawns `server.py` as a detached child (or via `os.execv` for systemd/launchd compatibility).
- `start.sh` — thin shell wrapper that sources `.env` and calls `bootstrap.py`.

## Key Features
1. **Three-panel layout** — sessions sidebar | chat | workspace file browser
2. **Real-time streaming** — SSE-based streaming of agent responses with token ring indicator
3. **Multi-profile support** — isolated sessions/settings per profile
4. **Embedded terminal** — full PTY terminal in the browser
5. **Workspace file browser** — inline preview, git status
6. **PWA** — installable, works offline
7. **Optional TLS** — env-var cert/key for HTTPS
8. **WebAuthn/passkeys** — hardware key login support
9. **Edge TTS** — optional Microsoft neural voice TTS
10. **MCP server** — agents can manage sessions via MCP tools
11. **KaTeX math rendering** — inline and block LaTeX
12. **i18n** — multi-language support
13. **Docker support** — Dockerfile + compose files included

## Configuration (env vars)
| Var | Default | Purpose |
|-----|---------|--------|
| `HERMES_WEBUI_HOST` | `127.0.0.1` | Bind address |
| `HERMES_WEBUI_PORT` | `8787` | Port |
| `HERMES_WEBUI_PASSWORD` | _(none)_ | Auth password (bcrypt stored) |
| `HERMES_WEBUI_STATE_DIR` | `~/.hermes/webui` | Session/settings storage |
| `HERMES_WEBUI_TLS_CERT/KEY` | _(none)_ | TLS certificate |
| `HERMES_WEBUI_PYTHON` | auto-discover | Override Python interpreter |

## Stack Summary
- **Language**: Python 3.10+ (backend), Vanilla JS ES2020 (frontend)
- **Dependencies**: `pyyaml`, `cryptography` (only 2 pip deps!)
- **Storage**: JSON files in `~/.hermes/webui/`
- **Transport**: HTTP/1.1 keep-alive, SSE for streaming
- **Default port**: 8787
