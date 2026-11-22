---
name: sa-blender-mcp-operator
description: Drive Blender from the agent through MCP for Blender (formerly blender-mcp): set up the addon and server, build/modify scenes with Python, capture and pick in the viewport, search and import assets (Poly Haven, Sketchfab, Hyper3D). Use when the user says Blender MCP, model this in Blender, build a 3D scene, or control Blender.
---

# SA Blender MCP Operator
Socket bridge: Blender addon (`addon.py`) ↔ MCP server (`uvx mcp-for-blender`) ↔ agent.

## Setup
- One command: `curl -LsSf https://www.mcp-for-blender.com/install.sh | sh` (or `uvx mcp-for-blender setup` if uv exists). Picks MCP clients, installs addon.
- Manual: install uv → add MCP server `{"command":"uvx","args":["mcp-for-blender"]}` → Blender Preferences → Add-ons → install `addon.py`, enable, N-panel "BlenderMCP" → Connect.
- Fully quit/reopen the AI app afterwards. Telemetry: use `disable_telemetry` tool if Chuma wants it off.

## Workflow
1. `get_addon_status` → confirm connection.
2. Inspect scene info, then act with small Python steps (`execute_blender_code`); save before big ops.
3. Look: `viewport_capture`, `viewport_pick` to target objects.
4. Assets: `search_assets` / `import_asset` (Poly Haven free; Sketchfab/Hyper3D/Hunyuan generation may need keys or credits → ask).
5. Follow the guides in Appendix B (bpy, scene, materials, rigging, animation, retopology, level design).
- Pairs with sa-blender-tech-art-router (art direction) and sa-unity-mcp-operator (blender-to-unity handoff).

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).

## Appendix B — README (setup, tools, troubleshooting)

### `README.md`
<div align="center">

<img src="assets/logo-banner.svg" alt="MCP for Blender — Connect Blender to any LLM" width="480" />

*formerly `blender-mcp` — the PyPI package is now [`mcp-for-blender`](https://pypi.org/project/mcp-for-blender/).*
*Existing setups keep working; no config change is required. [Read more](https://github.com/ahujasid/mcp-for-blender/issues/366)*

**Disclaimer:** This is a third-party integration and not made by Blender

Prompt-assisted 3D modeling, scene creation, and manipulation — driven by AI.

[![PyPI Downloads](https://static.pepy.tech/personalized-badge/blender-mcp?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads)](https://pepy.tech/projects/blender-mcp)
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/SNqPn4TcKQ)
[![Website](https://img.shields.io/badge/Website-mcp--for--blender.com-black)](https://mcp-for-blender.com/)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-EA4AAA?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/ahujasid)
[![PyPI Version](https://img.shields.io/pypi/v/mcp-for-blender?color=blue)](https://pypi.org/project/mcp-for-blender/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<a href="https://trendshift.io/repositories/14834?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-14834" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/14834" alt="ahujasid%2Fblender-mcp | Trendshift" width="250" height="55"/></a> <a href="https://trendshift.io/repositories/14834?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-14834" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/14834/daily?language=Python" alt="ahujasid%2Fmcp-for-blender | Trendshift" width="250" height="55"/></a>

<br />

**Supporters**

[CodeRabbit](https://www.coderabbit.ai/)
[Guillermo Rauch](https://github.com/rauchg)

**All supporters:** [Support this project](https://github.com/sponsors/ahujasid)

</div>

---

##### Quickstart

> **Note:** the PyPI package `blender-mcp` is now **`mcp-for-blender`**. Existing setups
> keep working — `uvx blender-mcp` still runs the server and **no config change is
> required**. New installs should use `mcp-for-blender`.
> [What changed and why](https://github.com/ahujasid/mcp-for-blender/issues/366)

**One command** sets up your AI apps and the Blender addon:

**macOS / Linux**

```bash
curl -LsSf https://www.mcp-for-blender.com/install.sh | sh
```

**Windows** (PowerShell)

```powershell
irm https://www.mcp-for-blender.com/install.ps1 | iex
```

From Command Prompt instead: `powershell -c "irm https://www.mcp-for-blender.com/install.ps1 | iex"`

Prefer not to run a script, or Windows Defender blocked it? Install uv with winget, open a new terminal, then run setup:

```powershell
winget install --id=astral-sh.uv -e
uvx mcp-for-blender setup
```

Already have uv? Run `uvx mcp-for-blender setup` instead.

It installs [uv](https://docs.astral.sh/uv/) if needed, finds the MCP clients on your machine (Claude Desktop, Claude Code, Codex, Cursor, VS Code, Devin Desktop/Windsurf, OpenCode, Antigravity), and lets you pick which to set up. Then it installs the Blender addon and enables it. Your existing config is kept: it only adds a `blender` entry and saves a `.bak` of each file it changes.

Then **fully quit and reopen your AI app** (on Windows, quit it from the system tray), open Blender, and ask it to build something. The addon starts its server when Blender opens.


<details>
<summary><b>Manual setup, in case the automatic setup doesn't work</b></summary>

Three steps: install `uv`, point your MCP client at the server, install the Blender addon.

**1. Install uv**

```bash
# macOS
brew install uv

# Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
winget install --id=astral-sh.uv -e
# or, with uv's installer
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

> **Warning:** Do not proceed before installing uv. Use the official installer — *not* `pip install uv`.

**2. Add the MCP server to your client**

<details open>
<summary><b>Claude Desktop</b> — Settings → Developer → Edit Config</summary>

```json
{
    "mcpServers": {
        "blender": {
            "command": "uvx",
            "args": ["mcp-for-blender"]
        }
    }
}
```
</details>

<details>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add blender uvx mcp-for-blender
```
</details>

<details>
<summary><b>Codex</b></summary>

```bash
codex mcp add blender -- uvx mcp-for-blender
```
</details>

<details>
<summary><b>Cursor / VS Code / OpenCode / Antigravity</b></summary>

See [MCP Client Setup](#mcp-client-setup) below for per-client instructions and one-click install buttons.
</details>

**3. Install the Blender addon**

```bash
uvx mcp-for-blender install-addon
```

Then in Blender: **Edit → Preferences → Add-ons** → enable **Interface: MCP for Blender**.

**4. Connect**

The addon starts its server when Blender opens. To check, press `N` in the 3D viewport → open the **MCP for Blender** tab (click **Start MCP Server** if it isn't running). That's it — ask Claude to build something.

</details>

> **Note:** Only run **one** instance of the MCP server (either Cursor or Claude Desktop), not both.

---

##### Table of Contents

- [Quickstart](#quickstart)
- [Features](#features)
- [Premium](#premium)
- [Components](#components)
- [Installation](#installation)
  - [Automatic setup](#automatic-setup)
  - [Prerequisites](#prerequisites)
  - [Make your client find uvx](#make-your-client-find-uvx)
  - [Pin the Python version](#pin-the-python-version)
  - [Install without uv](#install-without-uv)
  - [Run with Docker](#run-with-docker)
  - [Environment Variables](#environment-variables)
- [MCP Client Setup](#mcp-client-setup)
  - [Claude for Desktop](#claude-for-desktop)
  - [Codex](#codex)
  - [Cursor](#cursor)
  - [Visual Studio Code](#visual-studio-code)
  - [OpenCode](#opencode)
  - [Antigravity](#antigravity)
- [Installing the Blender Addon](#installing-the-blender-addon)
- [Upgrading (existing users)](#upgrading-existing-users)
- [Usage](#usage)
  - [Starting the Connection](#starting-the-connection)
  - [Using with Claude](#using-with-claude)
  - [Capabilities](#capabilities)
  - [Example Commands](#example-commands)
- [Persistent API Credentials](#persistent-api-credentials)
- [Troubleshooting](#troubleshooting)
- [Technical Details](#technical-details)
- [Limitations & Security Considerations](#limitations--security-considerations)
- [Telemetry Control](#telemetry-control)
- [Feedback](#feedback)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [Star History](#star-history)

---

##### Features

| | |
|---|---|
| **Two-way communication** | Connect Claude AI to Blender through a socket-based server |
| **Object manipulation** | Create, modify, and delete 3D objects in Blender |
| **Material control** | Apply and modify materials and colors |
| **Visual verification** | Multi-angle, camera, wireframe, X-ray and animation-strip views, plus renders, so the AI checks its own work |
| **Code execution** | The AI writes Blender Python directly |
| **Asset & model generation** | Poly Haven assets, Sketchfab models, Poly Pizza low-poly models, AI-generated 3D models via Meshy, Tripo, Hyper3D Rodin and Hunyuan3D, and whole Gaussian-splat worlds via World Labs |

##### Premium

Generate AI 3D models (Meshy, Hunyuan3D, Tripo, Hyper3D Rodin) and World Labs worlds straight into Blender without bringing your own API keys. [More details](https://www.mcp-for-blender.com/premium?ref=readme)

##### Components

The system consists of two main components:

1. **Blender Addon** (`addon.py`) — a Blender addon that creates a socket server within Blender to receive and execute commands
2. **MCP Server** (`src/blender_mcp/server.py`) — a Python server that implements the Model Context Protocol and connects to the Blender addon

---

##### Installation

###### Automatic setup

The quickest way is the one-line installer. It installs uv, configures your MCP clients, and installs and enables the Blender addon:

```bash
# macOS / Linux
curl -LsSf https://www.mcp-for-blender.com/install.sh | sh
```

```powershell
# Windows (PowerShell)
irm https://www.mcp-for-blender.com/install.ps1 | iex
```

Already have uv? Run `uvx mcp-for-blender setup` instead. On Windows, `winget install --id=astral-sh.uv -e` installs uv without running a script. See [Quickstart](#quickstart) for what it changes. The rest of this section covers manual setup.

###### Prerequisites

- **Blender** 3.0 or newer
- **Python** 3.10 or newer
- **uv** package manager

<details>
<summary><b>Installing uv, per platform</b></summary>

**macOS**
```bash
brew install uv
```

**Windows**
```powershell
winget install --id=astral-sh.uv -e
```

Then open a new terminal so it's on your PATH. Or use uv's installer:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Then add uv to the user path in Windows (you may need to restart Claude Desktop after):

```powershell
$localBin = "$env:USERPROFILE\.local\bin"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$userPath;$localBin", "User")
```

**Linux**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

It lands in `~/.local/bin` — open a new shell so it's on your PATH.

Otherwise, installation instructions are on their website: [Install uv](https://docs.astral.sh/uv/getting-started/installation/)

On every OS, use uv's **official installer above — not `pip install uv`**, which may not create the `uvx` command and can hide uv inside an environment your client can't see.
</details>

> **Warning:** Do not proceed before installing uv.

###### Make your client find uvx

MCP clients started from a GUI (Claude Desktop, Cursor, VS Code from the Dock/Start menu) do **not** inherit your terminal's PATH, so a bare `"command": "uvx"` can fail with **`spawn uvx ENOENT`** even though `uvx` works in your terminal. If that happens:

- Find uvx's full path — `which uvx` (macOS/Linux) or `where uvx` (Windows) — and use it as `"command"`, e.g. `/opt/homebrew/bin/uvx` or `C:\Users\<you>\.local\bin\uvx.exe`.
- On Windows you can instead wrap it: `"command": "cmd", "args": ["/c", "uvx", "mcp-for-blender"]`.
- After any PATH or config change, **fully quit and relaunch** the client (Windows: quit from the system tray, not just the window; macOS: <kbd>Cmd</kbd>+<kbd>Q</kbd>).

###### Pin the Python version

*Avoid conda / pyenv / version conflicts.*

uv chooses which Python runs the server. On machines with conda (auto-activated base), pyenv, or asdf — or with a newer CPython release that some dependencies do not have wheels for yet — uv can grab an interpreter that makes installation fail. Pin Python 3.11 and prefer uv-managed interpreters to avoid using whatever is on your PATH:

```json
{
    "mcpServers": {
        "blender": {
            "command": "uvx",
            "args": ["--python", "3.11", "mcp-for-blender"],
            "env": { "UV_PYTHON_PREFERENCE": "only-managed" }
        }
    }
}
```

`--python 3.11` still satisfies this package's `requires-python >=3.10`, and `UV_PYTHON_PREFERENCE=only-managed` keeps uv from selecting conda, pyenv, asdf, or system Python first. (The repo's `.python-version` is only a hint for contributors and does **not** affect `uvx`.)

If a previous failed attempt keeps replaying after a fix, clear the cache:

```bash
uv cache clean mcp-for-blender blender-mcp && uvx --refresh mcp-for-blender
```

###### Install without uv

On locked-down machines you can skip uvx entirely with [`pipx`](https://pipx.pypa.io), then point your client at the installed command:

```bash
pipx install mcp-for-blender
pipx ensurepath          # then restart your shell / client
```

Use the resulting absolute path as `"command"` (find it with `which mcp-for-blender` / `where mcp-for-blender`) and omit `args`.

###### Run with Docker

You can run the MCP server in a container instead of installing it. Blender itself still runs on your machine — the container only hosts the MCP server, which connects out to the Blender addon.

Build the image from the repo root:

```bash
docker build -t mcp-for-blender .
```

Then point your MCP client at it (the `-i` flag is required — the server talks to the client over stdin/stdout):

```json
{
    "mcpServers": {
        "blender": {
            "command": "docker",
            "args": ["run", "-i", "--rm", "mcp-for-blender"]
        }
    }
}
```

The image defaults to `BLENDER_HOST=host.docker.internal`, which reaches the host's Blender out of the box with Docker Desktop on **macOS and Windows**.

On **Linux**, `host.docker.internal` doesn't exist and the addon only listens on `localhost`, so use host networking instead:

```json
{
    "mcpServers": {
        "blender": {
            "command": "docker",
            "args": ["run", "-i", "--rm", "--network=host", "-e", "BLENDER_HOST=localhost", "mcp-for-blender"]
        }
    }
}
```

To enable [safe mode](#safe-mode) in the container, add `"-e", "BLENDER_MCP_SAFE_MODE=1"` to `args`.

###### Environment Variables

The following environment variables can be used to configure the Blender connection:

| Variable | Default | Description |
|---|---|---|
| `BLENDER_HOST` | `localhost` | Host address for Blender socket server |
| `BLENDER_PORT` | `9876` | Port number for Blender socket server |
| `BLENDER_MCP_SAFE_MODE` | off | Set to `1` to validate scripts before they run in Blender (see below) |
| `BLENDER_MCP_APPS` | auto | Set to `1` to force the inline viewport app on for clients that support MCP Apps without advertising it (the Codex plugin sets this) |
| `BLENDER_MCP_OPENAI_FORMS` | auto | Set to `1` to force the thumbnail asset pickers on (the Codex plugin sets this) |

Example:

```bash
export BLENDER_HOST='host.docker.internal'
export BLENDER_PORT=9876
```

You can also pass the connection as CLI flags, which take precedence over the
environment variables. This is handy for running several Blender instances side
by side, since each MCP client entry can point at a different port with plain
arguments instead of env vars:

```bash
uvx mcp-for-blender --port 9877
```

In an MCP client config that means a second entry differing only in `args`:

```json
{
  "mcpServers": {
    "blender": { "command": "uvx", "args": ["mcp-for-blender"] },
    "blender-b": { "command": "uvx", "args": ["mcp-for-blender", "--port", "9877"] }
  }
}
```

Each instance needs its own port set in the Blender addon panel to match.

> **Note:** the addon's socket server has no authentication or encryption, so
> anyone who can reach that port can run Python inside Blender. Keep it on
> `localhost` unless you are on a trusted network, and prefer an SSH tunnel over
> pointing `--host`/`BLENDER_HOST` at a remote machine directly.

###### Safe mode

By default, the AI can run any Python code in Blender. Set `BLENDER_MCP_SAFE_MODE=1` to check every script before it runs and block risky code — things like reading or writing files directly, running other programs, accessing the network, or installing code that keeps running after the script ends. Normal Blender work (modeling, materials, rendering, saving, import/export) still works. Blocked scripts are sent back to the AI with the reason, so it can try again with a corrected version.

---

##### MCP Client Setup

###### Claude for Desktop

[Watch the setup instruction video](https://www.youtube.com/watch?v=neoK_WMq92g) (assuming you have already installed uv)

Go to **Claude → Settings → Developer → Edit Config → `claude_desktop_config.json`** and include the following:

```json
{
    "mcpServers": {
        "blender": {
            "command": "uvx",
            "args": [
                "mcp-for-blender"
            ]
        }
    }
}
```

<details>
<summary><b>Claude Code</b></summary>

Use the Claude Code CLI to add the MCP for Blender server:

```bash
claude mcp add blender uvx mcp-for-blender
```
</details>

###### Codex

The Codex CLI, desktop app, and IDE extension all share the same config file (`~/.codex/config.toml`), so setting the server up once covers all three.

###### Codex plugin (recommended)

The plugin adds a live viewport inline in the chat (click an object to attach it to your next message), thumbnail pickers for Poly Haven, Sketchfab and Poly Pizza, and `@`-mentions for scene objects, materials and collections. It isn't in the Codex plugin directory yet, so add it from this repo:

```bash
git clone https://github.com/ahujasid/blender-mcp.git
codex plugin marketplace add ./blender-mcp/integrations/codex
```

Then restart Codex, install **MCP for Blender** from the plugins directory, and ask it to use MCP for Blender in chat. Once it's running, the viewport opens in a side panel next to the conversation:

![MCP for Blender plugin in the Codex app, showing the live viewport beside the chat](assets/codex-screenshot.png)

###### Plain MCP server

Register the server with the [Codex CLI](https://github.com/openai/codex):

```bash
codex mcp add blender -- uvx mcp-for-blender
```

Or add it by hand to `~/.codex/config.toml` (or `$CODEX_HOME/config.toml`):

```toml
[mcp_servers.blender]
command = "uvx"
args = ["mcp-for-blender"]
```

Or in the **Codex desktop app**: **Settings → MCP servers → Add server** → name it `blender`, pick **STDIO**, enter `uvx mcp-for-blender` as the command, then **Save** and restart. If the app can't find `uvx`, use its full path instead — see [Make your client find uvx](#make-your-client-find-uvx).

Check it registered with `codex mcp list` — the `blender` server should show as **enabled**. The tools become available the next time you start Codex.

To set [environment variables](#environment-variables) (e.g. a non-default Blender host/port), pass `--env KEY=VALUE` flags to `codex mcp add`, or add them in the config file:

```toml
[mcp_servers.blender]
command = "uvx"
args = ["mcp-for-blender"]
env = { BLENDER_HOST = "localhost", BLENDER_PORT = "9876" }
```

###### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/link/mcp%2Finstall?name=blender&config=eyJjb21tYW5kIjoidXZ4IG1jcC1mb3ItYmxlbmRlciJ9)

**macOS** — go to **Settings → MCP** and paste the following:

- To use as a global server, use the *"add new global MCP server"* button and paste
- To use as a project-specific server, create `.cursor/mcp.json` in the root of the project and paste

```json
{
    "mcpServers": {
        "blender": {
            "command": "uvx",
            "args": [
                "mcp-for-blender"
            ]
        }
    }
}
```

**Windows** — go to **Settings → MCP → Add Server**, add a new server with the following settings:

```json
{
    "mcpServers": {
        "blender": {
            "command": "cmd",
            "args": [
                "/c",
                "uvx",
                "mcp-for-blender"
            ]
        }
    }
}
```

[Cursor setup video](https://www.youtube.com/watch?v=wgWsJshecac)

> **Note:** Only run **one** instance of the MCP server (either on Cursor or Claude Desktop), not both.

###### Visual Studio Code

*Prerequisites*: Make sure you have [Visual Studio Code](https://code.visualstudio.com/) installed before proceeding.

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_mcp--for--blender_server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=ffffff)](https://vscode.dev/redirect/mcp/install?name=blender&config=%7B%22command%22%3A%22uvx%22%2C%22args%22%3A%5B%22mcp-for-blender%22%5D%7D)

###### OpenCode

```json
{
  "mcp": {
    "blender-mcp": {
      "type": "local",
      "command": ["uvx", "mcp-for-blender"],
      "enabled": true,
      "environment": {
        "BLENDER_HOST": "localhost",
        "BLENDER_PORT": "9876"
      }
    }
  }
}
```

###### Antigravity

```json
{
  "mcpServers": {
    "blender-mcp": {
      "command": "uvx",
      "args": ["mcp-for-blender"],
      "env": {
        "BLENDER_HOST": "localhost",
        "BLENDER_PORT": "9876"
      }
    }
  }
}
```

---

##### Installing the Blender Addon

> `uvx mcp-for-blender setup` (see [Quickstart](#quickstart)) does all of this, including enabling the addon. The steps below are for doing it by hand.

**1. Recommended** — from a terminal, run:

```bash
uvx mcp-for-blender install-addon
```

This copies the addon into your Blender addons folder as `blender_mcp.py`. It prints where it wrote to, and keeps a `.bak` of any file it replaces.

> Optional: `uvx mcp-for-blender addon-paths` lists detected Blender addons folders. Override the destination with `BLENDERMCP_ADDONS_DIR=/path/to/scripts/addons`.

**2.** Open Blender

**3.** Go to **Edit → Preferences → Add-ons**

**4.** Enable **Interface: MCP for Blender** (search "MCP for Blender"). If it doesn't appear yet, click **Install…** and select the copied `blender_mcp.py` / `addon.py`, or restart Blender.

**5. Manual alternative** — if the command above can't find your Blender install, or you prefer doing it by hand: download `addon.py` from this repo → in Blender, **Edit → Preferences → Add-ons → Install…** → select the downloaded `addon.py` → enable it.

Then open the **MCP for Blender** tab in Blender's sidebar (press `N` in the 3D viewport) and click **Start MCP Server**. See [Starting the Connection](#starting-the-connection) below.

##### Upgrading (existing users)

> For newcomers, go straight to [Quickstart](#quickstart). For existing users, see below.

**1.** Run:

```bash
uvx mcp-for-blender@latest update
```

This updates the MCP server (refreshing uv's cached copy, or upgrading a `uv tool install`) and every installed copy of the Blender addon, keeping a `.bak` of each file it replaces. It never downgrades an addon that's newer than the release, and leaves alone a copy you've edited locally. Add `--dry-run` to see what it would change first.

> Use `@latest` the first time: releases older than 2.1.7 don't have the `update` command, and uvx may still have one of those cached.

**2.** Restart your MCP client (Claude Desktop, Cursor, ...) so it starts the new server.

**3.** In Blender: restart it, or **Preferences → Add-ons** → disable and re-enable **Interface: MCP for Blender**, then click **Start MCP Server** again.

If a client is still set up with the old `blender-mcp` package name, `update` says so; `uvx mcp-for-blender setup` switches it over.

> **Note:** the MCP server never modifies your Blender addon files on its own. When it starts, it checks whether the installed addon is behind the bundled copy and logs how to update; `update` and `install-addon` are what actually write. Trajectory capture still works on older loaded addons via an `execute_code` fallback.

---

##### Usage

###### Starting the Connection

![MCP for Blender in the sidebar](assets/addon-instructions.png)

1. In Blender, go to the 3D View sidebar (press <kbd>N</kbd> if not visible)
2. Find the **MCP for Blender** tab
3. Turn on the checkboxes you'd like to use (see more under [Capabilities](#capabilities) below)
4. Click **Connect to Claude**
5. Make sure the MCP server is running in your terminal

###### Using with Claude

Once the config file has been set on Claude, and the addon is running on Blender, you will see a hammer icon with tools for MCP for Blender.

![MCP for Blender in the sidebar](assets/hammer-icon.png)

###### Capabilities

The AI writes Blender Python itself for modelling, layout, materials, animation, rigging and retopology. The MCP adds what Python can't do on its own, as nine tools:

| Tool | What it's for |
|---|---|
| `execute_blender_code` | Run Python in your live Blender |
| `look` | See the result from the `viewport`, `camera`, `angles` (auto-framed multi-view sheet, any direction) or `frames` (animation strip), drawn `solid`, `material`, `rendered`, `wireframe` or `xray`; or show a render or image file |
| `get_scene_info` | Compact scene summary, one line per object with the fields you pick (placement, materials, topology, weights, ...); drill in with `root` or `query` |
| `generate_3d` | One call to generate and import a model with Tripo, Hunyuan3D, Hyper3D Rodin or Meshy. Premium generators are preferred automatically |
| `generate_gaussian_world` | Generate a whole explorable environment with World Labs and import it as Gaussian splats (Blender 5.3+) |
| `search_assets` / `import_asset` | [Poly Haven](https://polyhaven.com/) HDRIs, textures and models, [Sketchfab](https://sketchfab.com/) models, [Poly Pizza](https://poly.pizza/) low-poly models |
| `get_addon_status` | Blender version, addon version, and which libraries and generators are switched on |
| `disable_telemetry`, `record_trajectory_feedback` | Data collection controls |

###### Hunyuan3D on Tencent Cloud (Official API mode)

Which Tencent Cloud service the addon must call depends on where your account lives:

| Account | Service the addon calls | Region | Sidebar toggle |
|---|---|---|---|
| Mainland (cloud.tencent.com) | AI3D 3.0 (`ai3d`, version `2025-05-13`) | `ap-guangzhou` | leave **International (Pro) account** off (default) |
| International (tencentcloud.com), *Hunyuan-to-3D (Professional)* | `hunyuan`, version `2023-09-01`, PBR enabled | `ap-singapore` | tick **International (Pro) account** |

International credentials sent to the mainland endpoint fail with `AuthFailure.SignatureFailure` or
`ResourceUnavailable`, so tick the toggle when your SecretId/SecretKey come from tencentcloud.com.
The toggle sits under **Tencent Hunyuan 3D → Official API** in the sidebar.

###### Tripo

[Tripo](https://www.tripo3d.ai/) generates textured 3D models from a text prompt or a reference image.
It runs through [Premium](#premium) with no key, or on your own Tripo API key.
Through Premium, text uses your default quality and an image counts as one high-quality generation.
[Get a Tripo API key](https://developers.tripo3d.ai/en/keys).
Tick **Tripo** under **AI Model Generation** in the sidebar, choose a **Model**, and paste the key.
For a [tripo3d.com](https://www.tripo3d.com/) (China) account, set **Tripo Domain** to `.com` in the add-on preferences.

###### Meshy

[Meshy](https://www.meshy.ai/) generates textured 3D models from a text prompt or a reference image,
sized to real-world height with the origin at the bottom, so models arrive standing on the ground at a plausible size.
It runs through [Premium](#premium) with no key, or on your own Meshy API key.
Through Premium, Meshy uses its latest model and each model counts as one standard generation.
Your own API key needs a paid Meshy plan:
[get a Meshy API key](https://www.meshy.ai/developers/keys?utm_source=mcp-for-blender&utm_medium=integration&utm_campaign=blender-addon).
Tick **Meshy** under **AI Model Generation** in the sidebar, choose a **Model**, and paste the key.
On your own key, ask for a character "in an A-pose" or "in a T-pose" and Meshy generates it in that pose, ready to rig.

###### World Labs

[World Labs](https://www.worldlabs.ai/) Marble generates a whole explorable world from a text prompt,
an image or a 360° panorama. It arrives as Gaussian splats, with a hidden collision mesh for placing
objects and the panorama as the world background, in metres with the ground at z=0.
It needs Blender 5.3 or newer, which imports and renders splats; on older versions the option is greyed out.
It runs through [Premium](#premium) with no key, or on your own World Labs API key.
Through Premium, every world is Marble 1.1 and uses one high-quality generation (Pro and up).
On your own key it uses the sidebar's model: Marble 1.1 Plus (default, larger worlds) or Marble 1.1.
[Get a World Labs API key](https://platform.worldlabs.ai/api-keys); API credits are separate from Marble app credits.
Tick **World Labs** under **Gaussian Worlds** in the sidebar, choose a **Model**, and paste the key.
On your own key, a folder of up to 4 photos of one place, in name order going around it, makes one world.

###### Poly Haven

[Poly Haven](https://polyhaven.com/) publishes around 2,400 HDRIs, textures and models,
all CC0 and free, funded by donations rather than by selling the assets. There is no API
key, no account and no rate limit worth worrying about.

In the 3D View sidebar, tick **Poly Haven**. That is the whole setup.

Worked example:

> *"Light the scene with an overcast afternoon HDRI and put a rusty metal texture on the wall"*

Claude calls `search_assets(source="polyhaven", query="overcast afternoon", asset_type="hdris")`,
which understands the intent rather than matching keywords - "couch" finds sofas, and it
works in any language. `previews=3` attaches thumbnails of the top results before spending
the bandwidth, and `import_asset(source="polyhaven", id="...", asset_type="textures", apply_to=["Wall"])`
downloads a texture and applies it in one call.

Searches can also filter on a category path or on attributes such as weather and time of
day for HDRIs, or surface use and condition for textures; an unknown attribute errors with
the valid ones.

Models are imported from the `.blend`, which is the file the artist authored - the glTF,
FBX and USD versions are generated from it and lose material detail. Textures build a
Principled material from the maps that drive it, and skip the repackings and alternate
conventions that nothing reads. HDRIs are packed into the file, so the lighting survives
being saved and reopened somewhere else, and arrive in a new world rather than overwriting
one you built.

**Licence and attribution:** every Poly Haven asset is CC0. You never have to credit
anyone, for anything, commercial or not. Their
[API terms](https://github.com/Poly-Haven/Public-API/blob/master/ToS.md) do ask that
software built on the live API makes clear where the assets come from, so the search and
import responses name the source and link the asset's page. On import, `polyhaven_id`,
`polyhaven_url`, `polyhaven_authors`, `polyhaven_resolution` and `polyhaven_licence` are
written onto the imported objects, materials, images and world as custom properties, so
whoever opens the `.blend` later can still find the asset and the artist who made it.

###### Poly Pizza

[Poly Pizza](https://poly.pizza/) hosts roughly 10,600 free low-poly models, including the
rescued Google Poly archive. It is the best source for stylised game assets: every model is
a single self-contained `.glb`, and the geometry is far lighter than Sketchfab's.

1. Get a free API key at [poly.pizza/settings/api](https://poly.pizza/settings/api)
2. In the 3D View sidebar, tick **Use assets from Poly Pizza**
3. Paste the key into the **API Key** field that appears (or store it permanently under
   **Edit → Preferences → Add-ons → MCP for Blender**)

Worked example:

> *"Search Poly Pizza for a low-poly chair under a CC0 licence and import one at 1 metre tall"*

Claude calls `search_assets(source="polypizza", query="chair", licence="CC0")`, which returns each
match with its licence and triangle count, then
`import_asset(source="polypizza", id="...", target_size=1.0)`.

You can also filter by category (`"Animals"`, `"Furniture & Decor"`, `"Transport"`,
`"Nature"`, `"Buildings"`, `"People & Characters"`, `"Food & Drink"`, `"Weapons"`,
`"Clutter"`, `"Objects"`, `"Scenes & Levels"`, `"Other"`) or ask for animated models only.

**Attribution:** about 69% of the Poly Pizza catalogue is CC-BY, which *requires* you to
credit the creator wherever the model appears. On import, the ready-formatted credit line
is written onto each imported root object as the custom property `polypizza_attribution`
(alongside `polypizza_id` and `polypizza_licence`), so it is saved into your `.blend` and
survives the session. Filter with `licence="CC0"` if you would rather use models that need
no credit.

###### Example Commands

Here are some examples of what you can ask Claude to do:

| Prompt | Demo |
|---|---|
| *"Create a low poly scene in a dungeon, with a dragon guarding a pot of gold"* | [Watch](https://www.youtube.com/watch?v=DqgKuLYUv00) |
| *"Create a beach vibe using HDRIs, textures, and models like rocks and vegetation from Poly Haven"* | [Watch](https://www.youtube.com/watch?v=I29rn92gkC4) |
| Give a reference image, and create a Blender scene out of it | [Watch](https://www.youtube.com/watch?v=FDRb03XPiRo) |
| *"Get information about the current scene, and make a threejs sketch from it"* | [Watch](https://www.youtube.com/watch?v=jxbNI5L7AH8) |
| *"Generate a 3D model of a garden gnome through Hyper3D"* | |
| *"Generate a wooden rocking chair with Meshy"* | |
| *"Generate a ceramic teapot with Tripo"* | |
| *"Generate a sunlit Mediterranean courtyard as a world, then put a fountain in it"* | |
| *"Fill this room with low-poly furniture from Poly Pizza"* | |
| *"Make this car red and metallic"* | |
| *"Create a sphere and place it above the cube"* | |
| *"Make the lighting like a studio"* | |
| *"Point the camera at the scene, and make it isometric"* | |

---

##### Persistent API Credentials

MCP for Blender supports persistent credentials via Blender Add-on Preferences:

**Edit → Preferences → Add-ons → MCP for Blender**

You can store these values there so they survive Blender restarts:

- Sketchfab API Key
- Poly Pizza API Key
- Hyper3D API Key
- Hunyuan3D SecretId / SecretKey
- Hunyuan3D API URL
- Meshy API Key
- Tripo API Key
- World Labs API Key

For headless setups or CI, credentials can also be injected by environment variables:

| Variable |
|---|
| `BLENDERMCP_SKETCHFAB_API_KEY` |
| `BLENDERMCP_POLYPIZZA_API_KEY` |
| `BLENDERMCP_HYPER3D_API_KEY` |
| `BLENDERMCP_HUNYUAN3D_SECRET_ID` |
| `BLENDERMCP_HUNYUAN3D_SECRET_KEY` |
| `BLENDERMCP_HUNYUAN3D_API_URL` |
| `BLENDERMCP_MESHY_API_KEY` |
| `BLENDERMCP_TRIPO_API_KEY` |
| `BLENDERMCP_WORLDLABS_API_KEY` |

Hyper3D with your own key uses the `Gen-2.5-Medium` tier on both the main-site
and fal.ai paths. The free trial key is available only in main-site mode; fal.ai
requires your own fal.ai API key. The trial key button is hidden in fal.ai mode.

---

##### Troubleshooting

| Problem | Fix |
|---|---|
| **Connection issues** | Make sure the Blender addon server is running, and the MCP server is configured on Claude. **Do not** run the `uvx` command in the terminal. Sometimes the first command won't go through, but after that it starts working. |
| **Timeout errors** | Try simplifying your requests or breaking them into smaller steps. |
| **Blender freezes during a Poly Haven download** | Assets are downloaded on Blender's main thread, so the UI stops responding until the transfer finishes. File size grows roughly fourfold per resolution step, so ask for 1k or 2k unless the asset is held close to camera. |
| **Poly Pizza download fails with a Cloudflare challenge** | `static.poly.pizza` is behind bot protection and blocks datacenter, VPN and cloud IPs. Your API key is fine - the CDN never sees it. Retry from a normal connection, or download the `.glb` by hand and use **File → Import → glTF 2.0**. |
| **Have you tried turning it off and on again?** | If you're still having connection errors, try restarting both Claude and the Blender server. |

##### Technical Details

###### Communication Protocol

The system uses a simple JSON-based protocol over TCP sockets:

- **Commands** are sent as JSON objects with a `type` and optional `params`
- **Responses** are JSON objects with a `status` and `result` or `message`

###### Connecting from another machine

The add-on listens on `localhost` by default. To accept connections from another
trusted PC, Docker, or WSL, open **Edit > Preferences > Add-ons > MCP for Blender**,
set **Bind Address** to the Blender machine's LAN IPv4 address (or `0.0.0.0` for all
interfaces), enable **Allow Remote Connections**, then disconnect and reconnect. On
the client side, set `BLENDER_HOST` to that address and `BLENDER_PORT` to the port
shown in Blender.

**Remote access has no authentication or encryption and lets clients run Python in
Blender.** Use it only on a trusted network behind a firewall, never on the public
internet. An SSH tunnel to the default `localhost` listener is a safer alternative.

##### Limitations & Security Considerations

> **Warning:** The `execute_blender_code` tool allows running arbitrary Python code in Blender, which can be powerful but potentially dangerous. Use with caution in production environments. **ALWAYS save your work before using it.**

- Poly Haven requires downloading models, textures, and HDRI images. If you do not want to use it, please turn it off in the checkbox in Blender.
- Complex operations might need to be broken down into smaller steps.

##### Telemetry Control

Telemetry is **opt-in**. Collection of your content is off by default and stays off until you explicitly turn it on.

**What is collected by default (no opt-in):** a minimal anonymous usage record so I can count active users and see which tools get used — a randomly generated install ID, a session ID, the tool name, whether it succeeded, how long it took, the MCP for Blender and Blender versions, your operating system, and a timestamp.

**Never collected without opting in:** your prompts, generated code, viewport screenshots, scene data, and trajectory steps.

**To opt in** — go to **Edit → Preferences → Add-ons → MCP for Blender** and check the telemetry consent checkbox. Some MCP clients will also offer you a one-time opt-in prompt at the start of a conversation. Opting in adds prompts, generated code, screenshots, and trajectory data to what's collected; see the TnC for details. You can turn it back off in the same place at any time.

**To turn off telemetry entirely**, including the minimal anonymous usage record, set an environment variable:

```bash
DISABLE_TELEMETRY=true uvx mcp-for-blender
```

Or add it to your MCP config:

```json
{
    "mcpServers": {
        "blender": {
            "command": "uvx",
            "args": ["mcp-for-blender"],
            "env": {
                "DISABLE_TELEMETRY": "true"
            }
        }
    }
}
```

Telemetry data is not linked to your name or account. It may be used to improve MCP for Blender, for research, and to train AI models.

Full detail on what is collected, and the license you grant by opting in, is in [TERMS_AND_CONDITIONS.md](TERMS_AND_CONDITIONS.md).

---

##### Feedback

We are actively looking for feedback on MCP for Blender. If you have thoughts, share them [here](https://bit.ly/blender-mcp-form).

If you have more detailed feedback, you can schedule a call with us [here](https://bit.ly/blender-mcp-call) — we will credit you in the project.

###### Join the Community

Give feedback, get inspired, and build on top of the MCP: [**Discord**](https://discord.gg/SNqPn4TcKQ)

##### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##### Disclaimer

This is a third-party integration and not made by Blender. Made by [Siddharth](https://x.com/sidahuj).

---

##### Star History

<a href="https://star-history.com/#ahujasid/blender-mcp&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ahujasid/blender-mcp&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ahujasid/blender-mcp&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ahujasid/blender-mcp&type=Date" width="600" />
  </picture>
</a>

<div align="center">

**If MCP for Blender is useful to you, consider starring the repo**

</div>

## Appendix C — Built-in guides

### `src/blender_mcp/guides/animation.md`
#### Animation

##### Keyframes

Keyframe properties directly; it works in every version and needs no context:

```python
scene = bpy.context.scene
scene.frame_start, scene.frame_end = 1, 120
scene.render.fps = 24

obj.location = (0, 0, 0); obj.keyframe_insert("location", frame=1)
obj.location = (0, 0, 2); obj.keyframe_insert("location", frame=24)
obj.rotation_euler.z = 3.1416; obj.keyframe_insert("rotation_euler", index=2, frame=48)
```

Pose bones: `pb = arm.pose.bones["hand.L"]; pb.rotation_mode = "XYZ"`, then
`pb.keyframe_insert("rotation_euler", frame=f)`. Bone keys use pose-space values, not world space.

##### Reaching fcurves

Blender 4.4 added slotted actions and 5.0 removed `Action.fcurves`. Use:

```python
def fcurves(obj):
    ad = obj.animation_data
    if not ad or not ad.action:
        return []
    if hasattr(ad, "action_slot"):
        from bpy_extras import anim_utils
        cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
        return list(cb.fcurves) if cb else []
    return list(ad.action.fcurves)
```

Then set easing per key: `kp.interpolation = "BEZIER"` with `kp.easing`, or `"LINEAR"` for
mechanical motion, `"CONSTANT"` for stepped/blocking.

##### Making it feel alive

- Timing and spacing matter more than poses. Ease in and out of holds; keep linear for constant
  motion (wheels, conveyors).
- Anticipation before big moves, overshoot and settle after them, follow-through on
  secondary parts (antennae, tails, cloth) offset by 2–4 frames.
- Arcs: limbs and thrown objects travel on curves, not straight lines.
- Loops: make the first and last key identical and add a Cycles modifier
  (`fc.modifiers.new("CYCLES")`), or set the frame range to exclude the duplicate last frame.
- Procedural motion: drivers (`obj.driver_add("rotation_euler", 2).driver.expression = "frame * 0.1"`)
  or noise modifiers on fcurves. Safe mode may block drivers; keyframes always work.

##### Organizing

- Push finished actions to NLA strips (`track = ad.nla_tracks.new(); track.strips.new(name, start, action)`)
  to layer or sequence clips (walk, then wave).
- Name actions `Character_Walk`, `Door_Open`; game engines import them by name.
- Cameras: animate the camera or a parent empty; use a Track To constraint on a target empty for
  smooth follow shots. Keep focal-length changes slow.

##### Checking motion

A single screenshot can't show motion. Use `look(mode="frames")` to see a strip of evenly spaced
frames (or pass `frames=[...]` for specific ones, `view="camera"` to see them through the camera).
Check for popping, interpenetration, feet sliding on the ground, and the loop seam.

### `src/blender_mcp/guides/bpy.md`
#### Writing bpy that works on any Blender

Scripts run in the user's live Blender, whose version, language and add-ons you don't know.
`get_addon_status` reports `blender_version`; check it before using anything version-specific.

##### Look things up instead of guessing

Introspect with RNA before indexing sockets or setting enums:

```python
# Valid values of any enum property
[i.identifier for i in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
# Properties of a type
[p.identifier for p in bpy.types.ShaderNodeTexSky.bl_rna.properties]
# Operator arguments
[(p.identifier, p.type) for p in bpy.ops.mesh.primitive_cube_add.get_rna_type().properties]
# A node's sockets, in the mode you intend to use
tree = bpy.data.node_groups.new("_probe", "ShaderNodeTree")
n = tree.nodes.new("ShaderNodeMix"); n.data_type = "RGBA"
print([(i, s.name, s.type) for i, s in enumerate(n.inputs) if s.enabled])
bpy.data.node_groups.remove(tree)
```

##### Portability rules

- Find nodes by `type`, never by name: names are localized. `next(n for n in nodes if n.type == "BSDF_PRINCIPLED")`.
- Address sockets by name only after checking they exist in this version (Principled BSDF renamed
  many inputs in 4.0: `Emission Color`, `Subsurface Weight`, `Specular IOR Level`, `Coat Weight`,
  `Sheen Weight`, `Transmission Weight`). `sock = node.inputs.get("Emission Color") or node.inputs.get("Emission")`.
- Never hardcode enum identifiers; read them (above). `scene.render.engine` is a dynamic enum that
  RNA under-reports; read the current value, and if you must switch, assign inside
  `try/except TypeError` — the error lists every accepted value. EEVEE is `BLENDER_EEVEE_NEXT` in
  4.2–4.x and `BLENDER_EEVEE` before and after.
- Material colors live on shader node inputs. `material.diffuse_color` only drives the solid
  viewport. In 5.0+ `material.use_nodes` is always on; don't rely on toggling it.
- Animation data changed in 4.4 (slotted actions) and 5.0 removed `Action.fcurves`. Insert keys with
  `obj.keyframe_insert("location", frame=f)` (works everywhere) and reach fcurves through
  `bpy_extras.anim_utils.action_get_channelbag_for_slot(action, obj.animation_data.action_slot)`
  on 4.4+, falling back to `action.fcurves` on older versions.

##### Data API over operators

Prefer `bpy.data` and object properties over `bpy.ops`: they need no context and are faster.
`bpy.data.meshes.new` + `from_pydata`, `bmesh` for editing, `obj.modifiers.new`, `obj.matrix_world`.

When you need an operator:

- Code runs from a timer, not a UI area. Operators that need a viewport need an override:
  ```python
  area = next(a for a in bpy.context.screen.areas if a.type == "VIEW_3D")
  region = next(r for r in area.regions if r.type == "WINDOW")
  with bpy.context.temp_override(area=area, region=region, active_object=obj, selected_objects=[obj]):
      bpy.ops.object.shade_smooth()
  ```
- `mode_set` needs an active, visible, selectable object. Always return to OBJECT mode at the end
  of a step, even on failure (`try/finally`).
- `obj.select_set(True)` and `bpy.context.view_layer.objects.active = obj` before ops that act on
  the selection.

##### Working style

- Small steps. Run a chunk and `print` what you need to know.
- Name everything you create; later steps and the user refer to it by name.
- Keep the scene organized: one collection per logical group (`bpy.data.collections.new`, link
  to `scene.collection`).
- Apply scale (`obj.data.transform(Matrix.Diagonal(...))` or `transform_apply`) before rigging,
  modifiers that depend on it, or export.
- Duplicate with `obj.copy()` (shares mesh data, cheap) for repeated props; `obj.data.copy()` only
  when the copy must differ.
- Units are metres. A door is ~2.1 m tall, a table 0.75 m, a person 1.7 m.

### `src/blender_mcp/guides/level-design.md`
#### Level design

##### Metrics first

Agree on the player's size and movement, then build everything to them. Defaults for a
human-scale third/first-person game (adjust to the user's engine and genre):

| Thing | Size |
|---|---|
| Player capsule | 1.8 m tall, 0.6 m wide |
| Doorway | 1.2–1.5 m wide, 2.4–3 m tall (wider than real life) |
| Corridor | 3–4 m wide |
| Step | 0.2 m rise, 0.3 m run |
| Max climbable ledge | ~1 m (jump) |
| Cover (crouch / full) | 1.0 m / 2.0 m |
| Grid unit | 1 m, modules on 2 m or 4 m |

Place a scale reference (a 1.8 m capsule named `PlayerScale`) and keep it in the scene.

##### Blockout

- Grey-box the whole level with simple geometry before any art: rooms, paths, heights,
  sightlines. One collection per area (`Area_Entrance`, `Area_Arena`...).
- Snap to the grid. Round positions and sizes to the module size in your scripts.
- Design the critical path, then branches, loops and secrets. Landmarks (tall, distinct shapes)
  help navigation; check they're visible from where the player needs them with
  `look(mode="angles", views=["top"])` and eye-height views.
- Top view (`look(mode="angles", views=["top"])`) is the fastest way to review flow and spacing.

##### Modular kits

- Build pieces on the grid: wall 4×3 m, floor 4×4 m, corner, doorway, stairs. Origin at a corner
  or bottom-centre so pieces snap.
- Place with linked duplicates (`obj.copy()` without copying data) or collection instances, so a
  fix to one piece updates every copy and the file stays small.
- Scatter props with slight random rotation and scale; keep gameplay-critical props exact.

##### Engine-ready output

- Apply transforms (scale 1, rotation 0) on every exported mesh.
- Name for the engine's conventions. Unreal: `SM_` meshes and `UCX_<mesh>` convex collision.
  Godot: `-col` / `-colonly` suffixes. Unity: separate low-poly collision meshes.
- Keep collision simple: boxes and convex hulls, not the render mesh.
- Triangle budgets depend on platform; report counts with `get_scene_info(fields=["topology"])`.
- Export with `bpy.ops.export_scene.gltf` (Godot, web, most engines) or `export_scene.fbx`
  (Unity, Unreal). Read each operator's arguments first; they change between versions.
- Lightmap UVs go in a second UV map when the engine bakes lighting.

### `src/blender_mcp/guides/materials.md`
#### Materials and texturing

##### Creating materials

```python
mat = bpy.data.materials.new("Brushed Steel")
mat.use_nodes = True   # no-op in 5.0+, where it's always on
bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
bsdf.inputs["Base Color"].default_value = (0.6, 0.6, 0.62, 1)
bsdf.inputs["Metallic"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.35
obj.data.materials.clear(); obj.data.materials.append(mat)
```

Sockets renamed in 4.0; resolve them defensively (`inputs.get("Emission Color") or inputs.get("Emission")`).

##### Believable values

| Material | Base colour (linear) | Metallic | Roughness |
|---|---|---|---|
| Painted wall | 0.5–0.7 grey | 0 | 0.8–0.9 |
| Wood (varnished) | textured | 0 | 0.3–0.5 |
| Plastic | any | 0 | 0.3–0.6 |
| Polished metal | 0.9 | 1 | 0.05–0.2 |
| Rubber | 0.02–0.05 | 0 | 0.8 |
| Glass | white | 0 | 0; Transmission 1, IOR 1.45 |

Nothing in nature is pure black (0) or pure white (1) as a base colour. Keep it between ~0.02 and 0.9.

##### Textures

- Poly Haven textures come as full PBR sets. `import_asset(source="polyhaven", id=...,
  apply_to=["Floor"])` builds the material and applies it in one call.
- Tiling: the import result gives the texture's real-world size. For 0–1 UVs across a surface,
  Mapping node Scale = surface size in metres / texture size in metres. Prefer large-coverage
  textures (`min_size_m` in search) for walls and floors; small ones repeat visibly.
- Objects need UVs. Primitives have them; scripted meshes need `smart_project` or box-projection
  (`Texture Coordinate > Object` into Mapping, and the Image Texture node's projection `BOX`).
- Image textures for roughness, metallic and normal maps must be Non-Color
  (`img.colorspace_settings.name = "Non-Color"`).

##### Procedural

Noise, Voronoi and Wave textures through a Color Ramp make variation without images: grunge for
roughness, stains, wood rings. Mixing a little noise into roughness makes any flat material look
less CG. Look each node up before indexing its sockets (see `get_guide("bpy")`).

##### Check it

Material colours only show in Material Preview or Rendered shading:
`look(mode="camera", shading="material")` or `shading="rendered"`. Solid shading shows only the
viewport display colour.

### `src/blender_mcp/guides/retopology.md`
#### Retopology and mesh cleanup

Generated and scanned models are dense, triangulated, and often non-manifold. What to do depends
on where the mesh is going:

| Goal | Approach |
|---|---|
| Still render, background prop | Leave it; maybe Decimate |
| Game prop | Decimate or remesh, then bake normals from the original |
| Deforming character | Quad remesh (QuadriFlow), clean loops at joints, then rig |
| 3D print | Voxel remesh for a watertight solid |

Always work on a copy and keep the original as the bake source: `low = src.copy(); low.data = src.data.copy()`.

##### Diagnose

`get_scene_info(fields=["topology"], query=name)` reports quads, tris, ngons, non-manifold edges,
boundary edges, loose vertices and poles; `look(mode="angles", shading="wireframe", target=[name])`
shows the edges.

##### Clean up

```python
import bmesh
bm = bmesh.new(); bm.from_mesh(obj.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0001)
bmesh.ops.dissolve_degenerate(bm, edges=bm.edges, dist=0.0001)
loose = [v for v in bm.verts if not v.link_edges]
bmesh.ops.delete(bm, geom=loose, context="VERTS")
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(obj.data); bm.free()
```

##### Reduce

- **Decimate** keeps the shape and UVs, gives triangles. Fast, fine for static props:
  `m = obj.modifiers.new("Decimate", "DECIMATE"); m.ratio = 0.1`. Planar mode (`decimate_type="DISSOLVE"`)
  is good for hard-surface.
- **Voxel remesh** makes a watertight, even mesh but loses UVs and sharp edges:
  `obj.data.remesh_voxel_size = 0.01; bpy.ops.object.voxel_remesh()` (active object needed).
  Size relative to the object: ~1/200 of its largest dimension is a sane start.
- **QuadriFlow** gives quads for deformation:
  `bpy.ops.object.quadriflow_remesh(target_faces=4000)`. It is slow on dense input and can fail on
  non-manifold meshes — voxel remesh first, then QuadriFlow the result.
- **Shrinkwrap** a low mesh onto the high one (`modifiers.new("Shrinkwrap", "SHRINKWRAP")`,
  `target = high`) to recover the silhouette after remeshing.

Face budgets: hero game character 15–50k tris, prop 500–5k, background 50–500.

##### UVs

```python
# in edit mode with everything selected, via a 3D viewport override
bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.02)
```

For characters mark seams along hidden edges first (`edge.seam = True` in bmesh), then
`bpy.ops.uv.unwrap()`.

##### Bake detail back

Bake normals (and colour) from the original high mesh to the low one's UVs, in Cycles:

1. Create an image (`bpy.data.images.new("Low_Normal", 2048, 2048, is_data=True)`) and an Image
   Texture node using it in the low mesh's material, set as the active node.
2. Select high, make low active; `scene.render.bake.use_selected_to_active = True`,
   `cage_extrusion` ~1–2% of the object size.
3. `bpy.ops.object.bake(type="NORMAL")`; for colour use `type="DIFFUSE"` with only the colour pass.
4. Save the image, wire it into a Normal Map node, and compare with `look(mode="angles")`.

Switching the engine to Cycles for the bake: read the current engine first and restore it after
(see `get_guide("bpy")`).

### `src/blender_mcp/guides/rigging.md`
#### Rigging

##### Before rigging

- The mesh must have applied scale and rotation, sit at the origin on the ground, and face -Y
  (Blender's front). Rigify and auto-weights assume this.
- Merge duplicate vertices (`bmesh.ops.remove_doubles`) and remove loose parts. Generated meshes
  are often many disconnected islands, which makes automatic weights fail.
- Characters rig best in A-pose or T-pose with a bit of bend at elbows and knees.

##### Humanoids: Rigify

```python
import addon_utils
addon_utils.enable("rigify", default_set=True)   # ships with Blender
bpy.ops.object.armature_human_metarig_add()     # needs a 3D viewport override
metarig = bpy.context.active_object
```

1. Scale and move the metarig to fit the mesh (edit bones: `metarig.data.edit_bones["spine"].head`),
   aligning joints with the mesh's joints. Check against the mesh with `look(mode="angles", shading="xray", views=["front","right"])`.
2. Generate: with the metarig active, `bpy.ops.pose.rigify_generate()`. The result is `rig`
   (or `RIG-<name>`).
3. Skin to the generated rig, not the metarig.

##### Simple or non-humanoid rigs

Build bones directly in edit mode:

```python
arm_data = bpy.data.armatures.new("Rig"); rig = bpy.data.objects.new("Rig", arm_data)
bpy.context.scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode="EDIT")
root = arm_data.edit_bones.new("root"); root.head = (0, 0, 0); root.tail = (0, 0.3, 0)
b = arm_data.edit_bones.new("arm"); b.head = (0, 0, 1); b.tail = (0, 0, 2); b.parent = root
bpy.ops.object.mode_set(mode="OBJECT")
```

Mechanical things (doors, wheels, robots) usually don't need skinning: parent rigid parts to bones
(`part.parent = rig; part.parent_type = "BONE"; part.parent_bone = "arm"`), which never deforms badly.

##### Skinning

Automatic weights: select the mesh, make the armature active, then

```python
bpy.ops.object.parent_set(type="ARMATURE_AUTO")   # needs selection + active set
```

If Blender reports "Bone Heat Weighting: failed to find solution for one or more bones":

- Merge by distance and remove interior faces, then retry.
- Or skin a voxel-remeshed copy, then transfer weights to the original with a Data Transfer
  modifier (vertex groups, nearest face interpolated) and apply it.
- Scale the whole thing up 10x, skin, scale back down — heat weighting struggles at tiny scales.

##### Verify

`get_scene_info(fields=["weights"], query="Body")` reports vertices no deform bone moves and deform
bones with no vertex group — both should be zero for a skinned character. Then pose it and look:

```python
pb = rig.pose.bones["upper_arm_fk.L"]; pb.rotation_mode = "XYZ"; pb.rotation_euler.x = 1.2
```

`look(mode="angles", target=["Body"])` and check elbows, shoulders, knees and hips for collapsing
or stretching. Reset the pose afterwards (`for pb in rig.pose.bones: pb.matrix_basis.identity()`).

### `src/blender_mcp/guides/scene.md`
#### Scene design

##### Workflow

1. `get_scene_info` — know what's there and the scene's scale before adding anything.
2. Block out with primitives at real-world size: the layout, the big shapes, the camera.
   `look(mode="camera")` or `look(mode="angles")` to check proportions before spending on assets.
3. Replace blockout pieces with real assets, biggest and most visible first.
4. Light, then set materials, then dress with small props.
5. Judge the image, not your intentions: is anything
   floating, clipping, the wrong size, or hidden from camera?

##### Getting assets

- **Generate** (`generate_3d`) hero objects and anything specific or unusual: "a rusted
  steampunk diving helmet". One object per generation — never a whole scene, the ground, or parts
  to assemble. Generate once and duplicate (`obj.copy()`) for repeats.
- **Poly Haven** (`search_assets(source="polyhaven")`): HDRIs, PBR textures for large surfaces
  (floors, walls, terrain), and generic realistic props. CC0.
- **Sketchfab**: specific real-world things (a named car model, a landmark), and realistic props.
  Check the licence and face count in results.
- **Poly Pizza**: stylised low-poly props, fast and light. Credit CC-BY creators.
- **Script it** only for simple or procedural geometry: walls, floors, shelves, stairs, fences,
  arrays, scattering.

Match the style. Don't mix low-poly Poly Pizza props with photoreal Sketchfab scans in one frame.

##### After every import

Imported and generated models arrive at arbitrary scale, rotation and origin. The import result
gives `world_bounding_box`; use it:

- Scale to real size from the bounding box, not by eye.
- Put it on the ground: `obj.location.z -= min_z` (with the bounding box min z).
- Rotate it to face the right way; generators usually face -Y or +Y. Check with
  `look(mode="angles", target=[name])`.
- Check it doesn't intersect its neighbours.

##### Composition

- Decide the camera early and compose for it; set `scene.camera`, focal length 35–50 mm for
  natural views, 85 mm+ for product shots, 24 mm or wider for interiors.
- Foreground, midground, background. Leave negative space. Rule of thirds for the subject.
- Vary scale and rotation of repeated props slightly; perfect grids read as fake.
- Ground contact sells realism: props sit on surfaces, small things cluster against larger ones.

##### Lighting

- Start with an HDRI from Poly Haven for ambient light and reflections; set its strength
  (0.5–1.5), then add a key light (sun or area) for shape and shadows.
- Three-point for products: key, fill at lower power, rim behind.
- Interiors: area lights in windows (portals in Cycles) plus practicals (lamps with emission).
- Check with `look(mode="camera", shading="rendered")`. Blown-out white or pure black areas mean
  exposure or light power is off; fix light power before touching exposure.

##### Render settings

Read the current engine rather than setting one blindly (see `get_guide("bpy")`). For quick
previews keep samples low; raise them only for the final render.

---
**Source & credit:** [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender) @ `a5a8acf` (cloned 2026-11-22). License: MIT (see TERMS_AND_CONDITIONS.md for the hosted generation/asset services). All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
