# Scroll-Film Studio (the website skill from the Kimi K3 video)

**Naming, so there is no confusion:** the video calls this the "Kimi K3 website skill".
The folder inside this zip is called `scroll-film-studio`. They are the same thing.
There is no second download, and nothing here is paywalled. This zip is the full skill.

It builds scroll-film websites: the whole page is one continuous cinematic shot that
scrubs as the visitor scrolls.

---

## Install

### Claude Code (recommended, this is what the video uses)

Unzip, then put the `scroll-film-studio` folder inside your skills folder:

```bash
mkdir -p ~/.claude/skills && cp -R scroll-film-studio ~/.claude/skills/
```

The path must end up exactly like this:

```
~/.claude/skills/scroll-film-studio/SKILL.md
```

Restart Claude Code. Check it loaded by running `/skills`, or just ask
"what skills do you have". If `scroll-film-studio` is not in that list, it is not
installed, and the steps below will not work.

### Claude.ai (web or desktop app)

Settings, then Capabilities, then Skills, then upload this zip there.

Do **not** just drag the zip into a chat window. Claude will read it as a document
and improvise its own answer instead of running the skill. That is the single most
common reason people report "it asked me completely different questions".

---

## Run it

Start with a phrase that triggers the skill:

> build me a scroll-film website

Other phrases that work: "cinematic scroll site", "scrollytelling website",
"one continuous shot website".

**Run it on the strongest model you have, at the highest effort setting.** This is a
long, taste-heavy build. The skill says so itself in its golden rule. On a fast or
cheap model the interview drifts and the output looks generic.

---

## What should happen

If the skill loaded correctly, the very first thing it does is ask you an interview
of about 7 questions, starting with:

1. What are we building, and the one-line vibe?
2. Brand assets, or should I create the world?
3. The journey: where the camera starts and where it ends.

Then it pitches you 2 to 3 named concepts before it builds anything.

**If you did not get that interview, the skill did not load.** Go back to Install
above. It is not a version or a paywall issue.

---

## Two lanes

- **Lane A, pure code.** Free, zero setup, no accounts. GSAP and Lenis motion. This is
  the default and it works for everybody.
- **Lane B, real generated footage.** Needs your own image-to-video account and credits.
  This is the signature look from the video.

Lane A is always available. You are never blocked on having a video engine.

---

## Optional, only for Lane B

The scripts need Node and a system Chrome for the verification step:

```bash
cd ~/.claude/skills/scroll-film-studio/scripts && npm install
```

Skip this entirely if you are on Lane A.

---

## Troubleshooting

| What you see | What it means |
|---|---|
| It asked different questions | The skill did not load. Check the install path. |
| Results look generic | Either it did not load, or you are on a fast/cheap model. |
| "Cannot find module 'puppeteer-core'" | Run the `npm install` above. |
| Nothing happens when I ask | Say "build me a scroll-film website" to trigger it. |
