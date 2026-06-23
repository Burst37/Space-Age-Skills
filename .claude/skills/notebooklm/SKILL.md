---
name: notebooklm
description: Complete API for Google NotebookLM - full programmatic access including features not
  in the web UI. Create notebooks, add sources, generate all artifact types, download in multiple
  formats. Activates on explicit /notebooklm or intent like "create a podcast about X", "install
  notebooklm", "add notebooklm to cowork", "generate a quiz", "turn this into audio"
---
<!-- notebooklm-py v0.3.4 -->

# NotebookLM Automation

Complete programmatic access to Google NotebookLM. Create notebooks, add sources (URLs,
YouTube, PDFs, audio, video), chat with content, generate all artifact types, download results.

Two setup paths:
1. Local Claude Code — Install notebooklm-py CLI, authenticate via Playwright
2. Cowork — MCP server + Cloudflare Tunnel for public HTTPS endpoint

---

## Step 0: Local Setup

Pre-flight: Python 3.10+ required.
```bash
python3 --version
brew install python@3.12  # macOS if needed
sudo apt install python3.12 python3.12-venv  # Linux if needed
```

Install:
```bash
PYTHON=$(command -v python3.12 2>/dev/null || command -v python3.11 2>/dev/null || command -v python3.10 2>/dev/null || command -v python3)
$PYTHON -m venv ~/.notebooklm-venv
source ~/.notebooklm-venv/bin/activate
pip install "notebooklm-py[browser]"
playwright install chromium
mkdir -p ~/bin
ln -sf ~/.notebooklm-venv/bin/notebooklm ~/bin/notebooklm
export PATH="$HOME/bin:$PATH"
notebooklm --help
```

Authenticate (IMPORTANT: standard `notebooklm login` fails in Claude Code bash — use this script):
```bash
cat > /tmp/nlm_login.py << 'PYEOF'
import json, os, time
from pathlib import Path
from playwright.sync_api import sync_playwright

STORAGE_PATH = Path.home() / ".notebooklm" / "storage_state.json"
PROFILE_PATH = Path.home() / ".notebooklm" / "browser_profile"
SIGNAL_FILE = Path("/tmp/nlm_save_signal")

SIGNAL_FILE.unlink(missing_ok=True)
STORAGE_PATH.parent.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_PATH),
        headless=False,
        args=["--disable-blink-features=AutomationControlled"],
    )
    page = browser.pages[0] if browser.pages else browser.new_page()
    page.goto("https://notebooklm.google.com/")
    print("Browser open. Waiting for save signal...")
    while not SIGNAL_FILE.exists():
        time.sleep(1)
    storage = browser.storage_state()
    with open(STORAGE_PATH, "w") as f:
        json.dump(storage, f)
    browser.close()
PYEOF

source ~/.notebooklm-venv/bin/activate
python3 /tmp/nlm_login.py > /tmp/nlm_login_output.txt 2>&1 &
echo "Login started. Browser opening..."
```

Tell user to sign in and navigate to notebooklm.google.com, then:
```bash
touch /tmp/nlm_save_signal
sleep 8
notebooklm auth check
notebooklm list
```

---

## Adding NotebookLM to Cowork (MCP Server + Cloudflare Tunnel)

Architecture:
  Claude Code / Cowork → MCP Protocol (SSE) → Cloudflare Tunnel (HTTPS) →
  Your Mac:8484 → FastMCP Server → NotebookLM CLI → Google NotebookLM

Step 1: Build MCP Server
```bash
mkdir -p ~/notebooklm-mcp && cd ~/notebooklm-mcp
/opt/homebrew/bin/python3.12 -m venv .venv
source .venv/bin/activate
pip install "mcp[cli]" uvicorn
```

~/notebooklm-mcp/server.py:
```python
import sys, subprocess
from mcp.server.fastmcp import FastMCP

NOTEBOOKLM = "/Users/YOUR_USERNAME/bin/notebooklm"
mcp = FastMCP("notebooklm", host="0.0.0.0", port=8484)

def run_cli(*args, timeout=120):
    result = subprocess.run([NOTEBOOKLM, *args], capture_output=True, text=True, timeout=timeout)
    return result.stdout.strip() or "(no output)"

@mcp.tool()
def notebooklm_list() -> str:
    """List all NotebookLM notebooks."""
    return run_cli("list")

@mcp.tool()
def notebooklm_use(notebook_id: str) -> str:
    """Set the active notebook context."""
    return run_cli("use", notebook_id)

@mcp.tool()
def notebooklm_ask(question: str) -> str:
    """Ask the current notebook a question (RAG query)."""
    return run_cli("ask", question, timeout=120)

@mcp.tool()
def notebooklm_source_add(url_or_path: str) -> str:
    """Add a URL, YouTube link, or local file as a source."""
    return run_cli("source", "add", url_or_path, timeout=180)

@mcp.tool()
def notebooklm_generate_audio(instructions: str = "") -> str:
    """Generate a podcast-style audio overview."""
    args = ["generate", "audio"]
    if instructions:
        args.append(instructions)
    return run_cli(*args, timeout=600)

if __name__ == "__main__":
    if "--sse" in sys.argv:
        import uvicorn
        app = mcp.sse_app()
        uvicorn.run(app, host="0.0.0.0", port=8484)
    else:
        mcp.run(transport="stdio")
```

Step 2: Cloudflare Tunnel
```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create notebooklm-mcp
cloudflared tunnel route dns notebooklm-mcp mcp-notebooklm.yourdomain.com
```

~/.cloudflared/config-notebooklm-mcp.yml:
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: ~/.cloudflared/YOUR_TUNNEL_ID.json
ingress:
  - hostname: mcp-notebooklm.yourdomain.com
    service: http://localhost:8484
  - service: http_status:404
```

Test: curl -s https://mcp-notebooklm.yourdomain.com/sse | head -3

Step 3: Auto-Start (macOS Launch Agents)
Create two plist files in ~/Library/LaunchAgents/ with RunAtLoad: true, KeepAlive: true:
- dev.navaigate.notebooklm-mcp.plist → python server.py --sse
- dev.navaigate.notebooklm-tunnel.plist → cloudflared tunnel run

```bash
launchctl load ~/Library/LaunchAgents/dev.navaigate.notebooklm-mcp.plist
launchctl load ~/Library/LaunchAgents/dev.navaigate.notebooklm-tunnel.plist
```

Step 4: Connect to Cowork
  Cowork → + → Connectors → Add custom connector → https://mcp-notebooklm.yourdomain.com/sse

Step 5: Local Claude Code (stdio)
~/.claude/settings.json:
```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "/Users/YOUR_USERNAME/notebooklm-mcp/.venv/bin/python",
      "args": ["/Users/YOUR_USERNAME/notebooklm-mcp/server.py"]
    }
  }
}
```

---

## Autonomy Rules

Run automatically (no confirmation):
  status, auth check, list, source list, artifact list, language list/get/set
  artifact wait, source wait, research status/wait, use, create, ask (no --save-as-note)
  history, source add

Ask before running:
  delete (destructive), generate * (long-running, may fail)
  download * (writes to filesystem), ask "..." --save-as-note, history --save

---

## Quick Reference

| Task | Command |
|------|---------|
| List notebooks | notebooklm list |
| Create notebook | notebooklm create "Title" |
| Set context | notebooklm use <notebook_id> |
| Add URL source | notebooklm source add "https://..." |
| Add file | notebooklm source add ./file.pdf |
| Add YouTube | notebooklm source add "https://youtube.com/..." |
| Web research (fast) | notebooklm source add-research "query" |
| Web research (deep) | notebooklm source add-research "query" --mode deep --no-wait |
| Chat | notebooklm ask "question" |
| Chat (save as note) | notebooklm ask "question" --save-as-note |
| Generate podcast | notebooklm generate audio "instructions" |
| Generate video | notebooklm generate video "instructions" |
| Generate report | notebooklm generate report --format briefing-doc |
| Generate quiz | notebooklm generate quiz |
| Generate flashcards | notebooklm generate flashcards |
| Generate infographic | notebooklm generate infographic |
| Generate mind map | notebooklm generate mind-map |
| Generate slide deck | notebooklm generate slide-deck |
| Check artifact status | notebooklm artifact list |
| Wait for completion | notebooklm artifact wait <artifact_id> |
| Download audio | notebooklm download audio ./output.mp3 |
| Download video | notebooklm download video ./output.mp4 |
| Download slides PDF | notebooklm download slide-deck ./slides.pdf |
| Download slides PPTX | notebooklm download slide-deck ./slides.pptx --format pptx |
| Download report | notebooklm download report ./report.md |
| Download quiz | notebooklm download quiz quiz.json |
| Download flashcards | notebooklm download flashcards cards.json |

---

## Generation Types

| Type | Download | Notes |
|------|----------|-------|
| Podcast | .mp3 | 10-20 min generation |
| Video | .mp4 | 15-45 min generation |
| Slide Deck | .pdf / .pptx | |
| Infographic | .png | |
| Report | .md | formats: briefing-doc, study-guide, blog-post, custom |
| Mind Map | .json | sync, instant |
| Quiz | .json/.md/.html | difficulty: easy/medium/hard |
| Flashcards | .json/.md/.html | difficulty: easy/medium/hard |

All generate commands support: -s (specific sources), --language, --json, --retry N

---

## Second-Brain Pattern (AI Brain Workflow)

1. Create one permanent notebook: "AI Brain"
2. After every working session, append a summary as a new source
3. Cowork project instruction: "Whenever answering questions about strategy or project history,
   always consult my NotebookLM AI Brain notebook first."
4. Claude checks your second brain before answering — perfect recall of everything ever worked on

Space Age use: Hermes appends session summaries to AI Brain automatically after each pipeline run.

---

## MCP Troubleshooting

| Symptom | Fix |
|---------|-----|
| Auth expired | Re-run login script. MCP server picks up new tokens automatically. |
| Server not responding | lsof -i :8484, check logs, launchctl kickstart -k gui/$(id -u)/dev.navaigate.notebooklm-mcp |
| Tunnel down | cloudflared tunnel info notebooklm-mcp |
| Cowork can't reach server | curl -s https://mcp-notebooklm.yourdomain.com/sse | head -3 |

---

## Known Limitations

- Generation failures possible due to Google rate limits
- Unofficial API — Google can change things without warning
- Cowork access requires your Mac awake and online
- For 24/7 access: deploy the server to a VPS and point the tunnel there
