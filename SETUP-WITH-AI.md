# SETUP-WITH-AI — Agent Setup Playbook

**You are an AI coding agent (Claude Code, Codex, Cursor, Gemini, etc.). The user has handed you this folder and asked you to set up the Agent OS for them. They are likely NOT technical. Follow this playbook top to bottom.**

## Rules for you, the agent
1. **Do the work for them.** Run the commands yourself. Don't make them open a terminal unless a step truly needs them (like clicking "allow" on a microphone prompt).
2. **Explain in plain English** what you're about to do, in one short sentence, before each major step.
3. **Stop and ask** whenever you need: a password, a paid action, a free-account signup, or a key. Never invent or guess a key.
4. **Required vs optional.** Only Step 1 + Step 2 are required to get a working dashboard. Steps 3–7 are optional powers — ask the user which ones they want before doing them.
5. **Verify each step worked** before moving on. If something fails, fix it or tell the user clearly what's needed.
6. **Never** enter the user's passwords, payment details, or API keys into any website yourself — paste keys into local config files only, and ask the user to do any website logins.

---

## Step 0 — Check the basics
Check the user has **Node.js 20 or newer**: run `node -v`.
- If missing or older, tell them: "You need Node.js. The easiest way: download it from https://nodejs.org (pick the LTS button) and run the installer." Wait for them to confirm, then re-check.

## Step 1 — The dashboard (REQUIRED)
1. `cd source`
2. `npm install`  (this takes a few minutes — tell them it's normal)
3. `PORT=3737 npm run build`
4. Start it: `PORT=3737 npm start`
5. Tell the user: **"Your dashboard is live at http://localhost:3737 — open that in Chrome."**
6. Confirm it loads before continuing.

> Full detail + Windows notes: `install/1-CORE-DASHBOARD.md`

## Step 1.5 — Connect the Obsidian vault (RECOMMENDED — powers the Memory Galaxy + Jarvis memory)
Many features (Memory Galaxy, Journal, Notebook, Jarvis's "what do you remember") read the user's Obsidian vault. If it's not connected, those are empty. **Do this for the user — don't make them edit any files.**

1. **Find the vault yourself first.** Check the auto-detected spots and the common real-world ones:
   - `~/Documents/Obsidian Vault`, `~/Obsidian Vault`, `~/Obsidian` (these auto-detect — if one exists, you're done, skip to step 4).
   - Also look in iCloud (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/`), `~/Documents`, `~/Dropbox`, and `~/Desktop` for a folder containing a `.obsidian` directory (that marks a vault).
2. **If you still can't find it, ask** the user: "Where's your Obsidian vault folder? (Or say 'I don't have one' and I'll help you make one.)" If they don't have Obsidian, point them to `install/11-MEMORY-OBSIDIAN.md` (free, 3 min) or offer to skip and come back later.
3. **Point the dashboard at it WITHOUT clobbering their other settings.** Merge `vaultRoot` into `~/.agentic-os/config.json` — read the existing file, add/replace just that one key, write it back:
   ```bash
   python3 - <<'PY'
   import json, pathlib
   VAULT = "/FULL/PATH/TO/THE/VAULT"   # ← set to the path you found/confirmed
   cfg = pathlib.Path.home()/".agentic-os"/"config.json"
   cfg.parent.mkdir(exist_ok=True)
   data = json.loads(cfg.read_text()) if cfg.exists() else {}
   data["vaultRoot"] = VAULT
   cfg.write_text(json.dumps(data, indent=2))
   print("Done. vaultRoot =", VAULT)
   PY
   ```
   (If the path was already an auto-detected spot, you can skip this — it'll just work.)
4. **Restart the dashboard** so it picks up the vault.
5. **Verify:** tell the user to open the **Memory** tab — their notes should appear as a galaxy. If it's empty, double-check the path you wrote and that the folder really is their vault.

> Full detail (incl. the "just ask the AI" path you're fulfilling right now): `install/11-MEMORY-OBSIDIAN.md`

## Step 2 — Voice building (RECOMMENDED — free, no keys)
This is the "say build me a game and it appears" feature. It runs a small AI **on the user's own machine**, so it's free and private.
1. Tell the user to install **Ollama** (a free app): https://ollama.com — or install it for them if you can (`brew install ollama` on Mac).
2. Pull a model: `ollama pull gemma2` (or `qwen2.5-coder:14b` if they have 16GB+ RAM — better at code).
3. Create `~/.fcc/.env` with the line: `MODEL="ollama/gemma2"` (match the model you pulled).
4. Verify: `ollama list` shows the model.
5. Tell them: "Open the **Free Claude Code** tab → **Agent Factory**, and type 'build me a starfield'. It builds on your machine."

> Full detail: `install/2-VOICE-BUILDING.md`

## Step 3 — Jarvis the talking voice (OPTIONAL — needs a free key)
Ask the user: *"Do you want the voice that talks back to you (Jarvis)? It needs a free ElevenLabs account."* If yes:
1. Send them to https://elevenlabs.io → sign up free → Profile → copy their **API key**. (They do this; you don't log in for them.)
2. Put the key in their Hermes profile env (see Step 4) OR in the dashboard env as `ELEVENLABS_API_KEY`.
3. The voice *input* (talking to it) works in Chrome/Safari with no key.

> Full detail: `install/3-JARVIS-VOICE.md`

## Step 4 — Hermes the agent (OPTIONAL)
Ask: *"Do you want Hermes — an agent that does multi-step jobs with real tools?"* If yes:
1. Install it (it has its own installer — `install/4-HERMES.md` has the current command).
2. It needs **one** AI key (OpenRouter is easiest + cheapest). Ask the user to make a free OpenRouter account at https://openrouter.ai and paste the key where the doc says.

> Full detail: `install/4-HERMES.md`

## Step 5 — Free Claude Code proxy (OPTIONAL)
Routes coding to free models. Only needed if they want the full Free Claude Code chat (Step 2's voice-build already works without it).

> Full detail: `install/5-FREE-CLAUDE-CODE.md`

## Step 6 — Paperclip (OPTIONAL — the AI company)
Ask: *"Do you want Paperclip — run a whole team of AI agents like a company, with an org chart?"* If yes:
1. `npx paperclipai onboard --yes` (it sets up its own database automatically).
2. It runs at http://localhost:3100 and shows up inside the dashboard's **Paperclip** tab.

> Full detail: `install/6-PAPERCLIP.md`

## Step 7 — The agent tabs (OPTIONAL)
Each tab (Claude, Codex, Gemini, OpenClaw, Antigravity) lights up when its CLI is installed. Ask which the user already uses and install only those.

> Full detail: `install/7-AGENT-CLIS.md`

## Step 8 — Phone agent (OPTIONAL — advanced, only if asked)
**Do not set this up unless the user explicitly says they want a real phone number to call their agent.** It's the most involved piece (a paid phone number, a tunnel, two services). If they do want it, follow `install/9-PHONE-AGENT.md` and ask them for their ElevenLabs + phone-number details. Otherwise, skip it entirely.

---

## When you're done
Give the user a short, friendly summary:
- ✅ what's working (dashboard + whichever pieces they chose)
- 🔑 any keys they still need to add later
- 🔗 the link: **http://localhost:3737**
- 💡 one thing to try first (e.g. "Open Free Claude Code and say 'build me a galaxy'").

If anything broke, point them to `install/8-TROUBLESHOOTING.md` and offer to fix it.
