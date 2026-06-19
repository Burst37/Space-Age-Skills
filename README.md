# 🚀 The Agent OS — Start Here

> 📦 **This pack: version `2026-06-16` (built 16 June 2026).** To check you're on the latest, compare this against the newest pack in the AI Profit Boardroom — or just run `Update Agent OS.command`.
>
> 📅 **See what changed and when → [`CHANGELOG.md`](CHANGELOG.md)** — a day-by-day list of new features and fixes.

Welcome. This is your own **AI command center** — one dashboard that runs Claude, Hermes, a voice assistant, an app builder, an AI company, and more, all from one screen.

It looks big. It isn't hard.

---

## ⚡ Step one for everyone: double-click `Start Agent OS.command`

That's it. It checks you have Node (free — it sends you to the download if not), installs itself the first time (a few minutes, once), then opens your dashboard at **http://localhost:3737**.

> 🍎 **First double-click on a Mac:** if macOS says it's from an unidentified developer, **right-click the file → Open → Open**. You only do that once.

From the second time on, it starts in seconds. Keep the little window open while you use the OS.

**Wondering what's working and what's not?** Double-click **`Check My Setup.command`** any time — a friendly ✅/⚪️ health check that tells you exactly which guide adds each missing piece.

**Already have an older Agent OS and want the newest features?** Don't re-do the whole install. Download the new pack, then double-click **`Update Agent OS.command`** inside your existing folder — it swaps in the new code and keeps all your settings, keys and notes. Full details in **`UPDATE.md`**.

The dashboard alone is already great. The optional powers (voice, agents, the AI company) each need a small one-time setup — pick a way below.

---

## 🟢 The easiest way to add the rest — let an AI set it up for you (no tech skills needed)

You do **not** need to understand any of this. Let an AI agent do it.

1. Install **Claude Code** (a free AI assistant that can run things on your computer): <https://claude.com/claude-code>
2. Open it **inside this folder**.
3. Paste this one sentence:

   > **"Read SETUP-WITH-AI.md and set up the whole Agent OS for me, step by step. Ask me whenever you need a key or a decision."**

That's it. Claude reads the playbook, installs everything, and asks you for anything it needs (like a password or a free account). When it's done, it gives you the link to open your dashboard.

> 🧠 **This includes connecting your Obsidian vault** (the Memory Galaxy + Jarvis's memory). You never edit any files — just say *"connect my Obsidian vault to the Agent OS"* and the AI finds it and wires it up. Details: `install/11-MEMORY-OBSIDIAN.md`.

> 💡 This works with any coding agent — Claude Code, Codex, Cursor, Gemini CLI. They all read `SETUP-WITH-AI.md`.

---

## 🟡 The guided way — do it yourself with friendly steps

Open the **`install/`** folder. The files are numbered. Do them in order. Each one is written in plain English with copy-paste steps.

| # | File | What it sets up | Required? |
|---|------|-----------------|-----------|
| 1 | `1-CORE-DASHBOARD.md` | The dashboard itself (the main screen) | ✅ **Required** |
| 11 | `11-MEMORY-OBSIDIAN.md` | Connect Obsidian → the **Memory Galaxy** + give Jarvis a memory | ⭐ Recommended |
| 2 | `2-VOICE-BUILDING.md` | Say "build me a game" → it builds it, free | ⭐ Recommended |
| 3 | `3-JARVIS-VOICE.md` | The talking voice assistant (Jarvis) | ⭐ Recommended |
| 4 | `4-HERMES.md` | The Hermes agent (does tasks for you) | Optional |
| 5 | `5-FREE-CLAUDE-CODE.md` | Free AI coding (no monthly cost) | Optional |
| 6 | `6-PAPERCLIP.md` | Run a whole company of AI agents | Optional |
| 7 | `7-AGENT-CLIS.md` | Plug in Claude, Codex, Gemini, etc. | Optional |
| 10 | `10-THUMBNAIL-STUDIO.md` | Make better YouTube thumbnails with gpt-image-2 | ⭐ Recommended |
| 12 | `12-VIDEO-STUDIO.md` | Render videos + AI avatar talking-heads | Optional |
| 13 | `13-GAME-STUDIO.md` | Describe a game → play it (free) | Optional |
| 14 | `14-MUSIC-STUDIO.md` | Text prompt → a real song (Suno) | Optional |
| 15 | `15-NOTEBOOKLM.md` | Connect Google NotebookLM (the Notebook tab) | Optional |
| 16 | `16-KIMI-CODE.md` | Add Kimi K2.7 as another coding agent | Optional |
| 17 | `17-EXTRA-MODELS.md` | Chat with GLM 5.2 + Fusion (API key) | Optional |
| 18 | `18-GROK-BUILD.md` | xAI's Grok Build coding agent (needs X Premium+) | Optional |
| 8 | `8-TROUBLESHOOTING.md` | If anything goes wrong | 🆘 |
| 9 | `9-PHONE-AGENT.md` | Call your agent on a real phone number | 🔧 Advanced |

> 🔄 **Already have an older Agent OS?** Don't fresh-install — read **`UPDATE.md`** to update in place without losing your settings, sessions, or notes.

**You only need #1 to get going.** Everything else you can add later, one at a time. Nothing breaks if you skip a part — that tab just stays quiet.

---

## 🔵 The fast way — if you're technical

```bash
cd source
npm install
PORT=3737 npm run build && PORT=3737 npm start
```

Open <http://localhost:3737>. Then read the install files for the optional services (Ollama, ElevenLabs, Hermes, Paperclip).

---

## What's actually inside

- **The Dashboard** — the screen that ties it all together.
- **Voice Building (Agent Factory)** — talk, and a real app appears. Runs free, on your own computer.
- **Jarvis (the Oracle Control System)** — a voice you talk to. It wakes on its name, answers out loud, shows you things, and builds things.
- **Hermes** — an agent that does multi-step jobs with real tools.
- **Free Claude Code** — code with AI for $0, using free models.
- **Paperclip** — run a team of AI agents like a company, with an org chart.
- **Thumbnail Studio** — upload a thumbnail + say what to improve → gpt-image-2 makes better versions, all logged to your vault.
- **The agent tabs** — Claude, OpenClaw, Gemini, Antigravity, Codex — plug in the ones you use.

### 🗺️ Every tab, at a glance (so nothing's a mystery)

| Sidebar tab | What it does | Setup needed? |
|---|---|---|
| **Mission Control** | Your home overview of everything | None — `1-CORE-DASHBOARD.md` |
| **Memory** | Your notes as a living **galaxy** | Just ask the AI "connect my Obsidian vault" → `11-MEMORY-OBSIDIAN.md` |
| **Notebook** | Google **NotebookLM** — chat with sources, make audio/video/mind-maps | `15-NOTEBOOKLM.md` (install tool + `nlm login`) |
| **Pipeline** | Drop an idea → it gets built | None (uses the free build engine) |
| **Game Studio** | Describe a game → play it | Free engine → `13-GAME-STUDIO.md` |
| **Video** | HyperFrames render + AI avatars | `12-VIDEO-STUDIO.md` (avatars need a key) |
| **Music** | Text prompt → a real song | Suno key → `14-MUSIC-STUDIO.md` |
| **Thumbnails** | Better YouTube thumbnails | OpenAI key → `10-THUMBNAIL-STUDIO.md` |
| **Kanban** | A task board for your work | None |
| **AI Agent Mastermind** | Group chat with all your agents | None (uses connected agents) |
| **Paperclip** | Run an AI company w/ org chart | `6-PAPERCLIP.md` |
| **Hermes** | The do-things agent + Jarvis voice | `4-HERMES.md` + `3-JARVIS-VOICE.md` |
| **Free Claude Code** | Code with AI for $0 | `5-FREE-CLAUDE-CODE.md` |
| **Claude · OpenClaw · Gemini · Antigravity · Codex** | Each AI tool's own tab | Install the ones you use → `7-AGENT-CLIS.md` |
| **Kimi Code** | Moonshot's Kimi K2.7 coding agent | `16-KIMI-CODE.md` (install CLI + `kimi login`) |
| **GLM 5.2 · Fusion** | Two extra AI models to chat with | API key → `17-EXTRA-MODELS.md` |
| **Grok Build** | xAI's coding agent — build games + apps | X Premium+ → `18-GROK-BUILD.md` |
| **SEO** | Generate + publish SEO content | Advanced — needs Claude Code (`7-AGENT-CLIS.md`) + your own sites |
| **Build Guide** | An in-app how-to guide | None |

> A tab that needs a tool you haven't installed just stays quiet — it never breaks anything. Set up only what you'll use.

### ✨ New in this version
- **New tab: Grok Build** — xAI's `grok-build` coding agent in its own tab (build games + apps, they land in your Workspace). Runs on your **X Premium+** plan → `install/18-GROK-BUILD.md`.
- **Hermes profiles explained** — the Hermes → Chat tab shows a hint when you have no profiles yet, and the guide explains they're *yours* + how to create them (`hermes profile create`) → `install/4-HERMES.md`.
- **Jarvis briefings** — ask Jarvis (in the Hermes tab) for a **daily or weekly briefing** and it reads your Obsidian vault to give you your to-dos, wins, and what you worked on, with a spoken summary → `install/4-HERMES.md`.
- **Claude chat remembers the conversation** — the basic Claude tab now keeps full context across messages (it used to forget between turns). New **New chat** button starts fresh.
- **Much easier Obsidian setup** — just tell your AI *"connect my Obsidian vault"* — no files to edit. The guide leads with the simple way → `install/11-MEMORY-OBSIDIAN.md`.
- **Two new model tabs: GLM 5.2 & Fusion** — chat with Zhipu's GLM-5.2 and OpenRouter's Fusion (a blend of top models), each with one key, no install → `install/17-EXTRA-MODELS.md`.
- **Daily changelog** — a day-by-day list of every new feature and fix → see `CHANGELOG.md`.
- **Kimi Code** — a new agent tab: Moonshot's **Kimi K2.7** coding agent, alongside Claude/Codex/etc. Install the CLI + `kimi login` → see `install/16-KIMI-CODE.md`.
- **NotebookLM connects properly for everyone** — fixed a bug where the Notebook tab pointed at one person's folder (`spawn …ENOENT`); it now finds NotebookLM on *your* Mac automatically. Full setup in `install/15-NOTEBOOKLM.md`.
- **Music Studio + Video Studio** — generate songs (Suno) and videos (HyperFrames + AI avatars), each with its own guide.
- **One-click updater** — double-click `Update Agent OS.command` to move to the newest version, keeping all your settings.
- **Claude model choice** — the Claude tab runs on **Opus 4.8** by default (reliable + lighter on tokens). 💡 **Want maximum power?** Switch to **Claude 5** (`claude-fable-5`) with one line — see the ⭐ section in `install/7-AGENT-CLIS.md`.
- **Thumbnail Studio** — the new gpt-image-2 thumbnail maker (sidebar → Thumbnails). See `install/10-THUMBNAIL-STUDIO.md`.
- **Jarvis upgrades** — now runs on your connected MiniMax plan (not pay-per-token), reads your whole Obsidian vault to answer "what do you remember…" and "what happened yesterday", and runs silent (no blips).
- **Build gallery** — every app you've built with the Agent Factory shows as live previews inside the Hermes-Jarvis tab.
- **Pipeline** — idea → agents plan + build it → it self-checks the result before showing you, with a Gallery of recent builds.
- **Agent Mastermind** — group chat with all your agents now saves to your vault and shows on any device (plus it no longer crashes on imported conversations).
- **Full Hermes guide** — `install/4-HERMES.md` now walks every one of Hermes' ten sections (Jarvis, Studio, Workspace, Goal Mode and all), so nothing in that tab is a mystery.

---

## 🔒 Security, in plain English

Built private by default — nothing extra for you to do:

- **Everything runs on YOUR computer.** Your notes, your builds, your conversations — none of it goes to us or anyone else.
- **The dashboard only answers your own machine.** It's locked to `localhost`, so nobody on your Wi-Fi (café, hotel, office) can open it — only you.
- **Your keys live in files on your Mac**, locked to your user account (the start script quietly checks this every launch). This pack ships with **placeholders only** — never real keys.
- **You enter your own keys and payments, always.** No guide here will ever ask you to give an AI your password or card — if an AI offers to log in for you, say no.
- **Pausing is safe.** Stop the dashboard any time (close the window). Nothing breaks, nothing is lost.

## The one rule

Take it **one piece at a time**. Double-click Start, get the dashboard working, enjoy it. Then add a piece whenever you want a new power. You can't break it by going slow.

Need help? `8-TROUBLESHOOTING.md` covers the common snags — or just paste the error into Claude and ask "how do I fix this?"
