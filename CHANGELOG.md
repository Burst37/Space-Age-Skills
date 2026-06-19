# 📅 Agent OS — What's New, by Day

The newest changes are at the top. Each entry is what changed for **you** — new features ✨, fixes 🔧, and improvements ⚡. Updating is one double-click: see `UPDATE.md`.

---

## 2026-06-16
- 🔧 **Claude chat memory — now rock-solid** — earlier versions could still "forget" between messages on some setups (ask the capital of France → "Paris", then "what's the famous landmark *there*?" → it had no idea where "there" was). The Claude tab now reliably carries the whole conversation, so follow-up questions just work. *(Thanks Mike for flagging it was still happening.)*
- ✨ **New tab: Grok Build** — xAI's `grok-build` coding agent now has its own tab. Ask it to build games or apps and they land in your **Workspace** to play live. It runs on your **X Premium+ (SuperGrok)** plan — no API key, no per-message cost. Setup: `install/18-GROK-BUILD.md`.
- ⚡ **Hermes profiles — explained + easier to find** — in **Hermes → Chat**, if you haven't made any profiles yet you'll now see a short hint (so the profile quick-swap bar isn't a mystery when it's empty). The guide now explains what profiles are, that they're **yours** (you only ever see your own — not anyone else's), and how to create them with `hermes profile create`. See `install/4-HERMES.md`. *(Thanks Gavin for the question.)*

## 2026-06-15
- ✨ **Jarvis can brief you (daily or weekly)** — in the **Hermes → Hermes-Jarvis** tab, ask for a briefing and Jarvis reads your Obsidian vault to give you a real rundown: open to-dos, what you worked on, recent memory captures, your daily "Top 3", and weekly wins — with a spoken summary and headline. Past briefings are saved. Works best with your vault connected (`install/11-MEMORY-OBSIDIAN.md`). See `install/4-HERMES.md`.
- 🔧 **Claude chat now remembers the conversation** — the basic **Claude** tab used to forget everything between messages: ask "what's the capital of France?" → "Paris", then "what's the famous landmark there?" and it had no idea where "there" was. Now it keeps full context across the whole chat. A new **New chat** button starts fresh whenever you want. *(Thanks to the member who reported the "context disconnect".)*
- ⚡ **Much easier Obsidian setup** — connecting your notes (the Memory Galaxy + Jarvis's memory) is now simply *"ask your AI to connect my Obsidian vault"* — no hidden files to edit. The guide leads with the simple way and the AI does the rest. See `install/11-MEMORY-OBSIDIAN.md`. *(Thanks Jason for the feedback.)*

## 2026-06-14
- ✨ **Two new model tabs: GLM 5.2 & Fusion** — chat with Zhipu's GLM-5.2 and OpenRouter's Fusion (a blend of top models). Paste one key each, no install. See `install/17-EXTRA-MODELS.md`.
- ✨ **This day-by-day changelog** is now part of every pack, so you can always see what's new and when.
- 🔧 **Fixed an install that wouldn't build** — a type error (the Kimi agent was missing from one internal list) made `npm run build` fail on some setups, so the dashboard wouldn't start. It now builds cleanly for everyone. *(Thanks to Carter for the report.)*

## 2026-06-13
- ✨ **New tab: Kimi Code** — Moonshot's **Kimi K2.7** coding agent, alongside Claude/Codex. Install the CLI + `kimi login` → see `install/16-KIMI-CODE.md`.
- 🔧 **NotebookLM now connects for everyone** — fixed a bug where the Notebook tab looked for one person's folder (`spawn …ENOENT`). It now finds NotebookLM on *your* Mac automatically. Setup: `install/15-NOTEBOOKLM.md`.
- ⚡ **Claude model choice** — the Claude tab now defaults to **Opus 4.8** (reliable + lighter on your plan's tokens). Want maximum power? Switch to **Claude 5** in one line — see `install/7-AGENT-CLIS.md`.

## 2026-06-12
- ✨ **Memory Galaxy setup guide** — connect your Obsidian vault and your notes become a living galaxy (and Jarvis gains a real memory). New `install/11-MEMORY-OBSIDIAN.md`.
- ✨ **Video, Music & Game Studio guides** — render videos + AI avatars (`12`), make songs with Suno (`14`), and commission playable games (`13`).
- ⚡ **Every pack is now date-stamped** — the README shows the version/date up top so you always know how current you are.

## 2026-06-11
- ✨ **One-click updater** — double-click `Update Agent OS.command` to move to the newest version. It keeps all your settings, keys, and notes. No terminal, no re-install.
- ⚡ **Video tab makes real videos** — describe what you want and Claude 5 authors a full multi-scene video (not just a title card), with your real screenshots dropped in.
- ⚡ **Thumbnail Studio = faithful edits** — it now preserves your design and applies just the change you asked for (like ChatGPT), at full 1920×1080.

## 2026-06-10
- ✨ **Double-click to start** — `Start Agent OS.command` installs everything the first time and opens your dashboard. `Check My Setup.command` is a friendly health check that tells you what's set up and what isn't.
- 🔒 **More private by default** — the dashboard now answers **only your own computer** (nobody on your Wi-Fi can open it), and your key files are auto-locked to your account.
- ✨ **Claude 5 rolled in** + the full Hermes guide (all ten sections of that tab explained).

## 2026-06-09
- ⚡ **Jarvis runs silent** — no more beeps or boot sounds; just the voice when it answers.
- ✨ **Jarvis remembers you** — ask "what do you remember about…" or "what happened yesterday" and it reads your whole Obsidian vault to answer.
- ✨ **Group chat saved to your vault** — the AI Agent Mastermind keeps its history, so it shows on any device and survives a browser clear.
- ⚡ **Pipeline Gallery** — see your recent builds in a click-to-play grid.
- ⚡ **Thumbnail Studio** — lots of quality upgrades: full-res output, parallel versions, faithful prompts, a live timer.

## Earlier
- The foundation: the dashboard, Voice Building (Agent Factory), the Jarvis voice, Hermes, Free Claude Code, Paperclip (your AI company), and plain-English install guides for every part.

---

*Want the very latest? Download the newest pack from the AI Profit Boardroom, then double-click `Update Agent OS.command`.*
