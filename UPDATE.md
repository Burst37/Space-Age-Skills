# Updating Your Agent OS — the easy way

There are new features almost daily. Good news: **updating is now one double-click.** Your settings, keys, notes, and history are *never* touched — only the app code changes.

> ✨ **New in this version:** **Hermes profiles** are now explained (the Chat tab hints how to find/create them, and they're always *your own* — `install/4-HERMES.md`), **Jarvis briefings** (ask Jarvis in the Hermes tab for a daily/weekly rundown of your tasks + wins from your vault), the **Claude tab now remembers your conversation** (it used to forget between messages), and **connecting Obsidian is now just "ask your AI"** — no files to edit (`install/11-MEMORY-OBSIDIAN.md`). Earlier: GLM 5.2 & Fusion model tabs, the day-by-day `CHANGELOG.md`, Kimi Code, the NotebookLM per-user fix, Music/Video/Game studios, and the one-click updater (this file).

---

## ⚡ The 30-second update (do this)

1. **Download** the newest `agent-os-pack` zip from the AI Profit Boardroom (Skool). Leave it in your **Downloads** — *don't unzip it.*
2. Open your **existing** Agent OS folder (the one you've been using).
3. **Double-click `Update Agent OS.command`.**

That's it. It finds the new download, backs up your old version, swaps in the new code, re-installs, rebuilds, and reopens your dashboard. ~3–5 minutes, hands-off.

> 🍎 **First time on a Mac:** if it says "unidentified developer," **right-click → Open → Open**. Once only.

**What it protects automatically** (these live outside the app and are never overwritten):
- `~/.agentic-os/config.json` — your settings
- `~/.hermes/` — your profiles, sessions, and keys
- `~/.fcc/.env` — your voice-build model
- Your **Obsidian vault** — your notes

It also keeps a dated backup of your old version next to the app, so you can always roll back. Delete it once you're happy.

---

## 🟢 Even easier: ask the AI to do it

Open **Claude Code** inside your Agent OS folder and say:

> *"Update my existing Agent OS to the newest pack in my Downloads, in place. Back up the old app first, and do NOT touch my config, my Hermes profiles, my `.fcc`, or my Obsidian vault."*

It runs the same steps for you.

---

## 🔵 The manual way (only if you want to)

If you'd rather do it by hand:

```bash
APP=~/"Agentic OS/agentic-os"                       # adjust if yours is elsewhere
cp -r "$APP" "$APP.bak-$(date +%Y%m%d_%H%M%S)"      # 1. back up
rsync -a --delete --exclude node_modules --exclude .next --exclude .git --exclude '.env' \
  ./source/ "$APP/"                                  # 2. copy new code, keep settings
cd "$APP" && npm install && npm run build && npm start   # 3. rebuild + run
```
> Customised files in `src/` yourself? Don't blind-copy — ask Claude to show a diff first, then keep your changes.

---

## ❓ "Can it just update itself with a button?"

Almost. Today it's a double-click instead of a button because the download is gated behind your Boardroom login (that's what keeps it members-only). The updater removes every other step — no terminal, no `npm install` by hand, no copying files.

If a public "always-latest" link is ever provided, the updater already has a one-line slot for it (`AUTO_URL` at the top of the file) — set it once and updates become fully automatic.

## ✅ Done check
- [ ] Downloaded the new zip to Downloads (left it zipped)
- [ ] Double-clicked `Update Agent OS.command` in your existing folder
- [ ] Dashboard reopened on http://localhost:3737 with your data intact
- [ ] (Optional) deleted the `_backup_…` folder once everything looked good

> New features that need a key or model (ElevenLabs voice, Ollama for voice-build, an OpenAI key for Thumbnail Studio) are in the `install/` folder — add them the same way as a fresh install.
