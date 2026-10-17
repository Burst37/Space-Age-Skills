---
name: replica-skill-sa
description: >-
  Clean-room app cloning pipeline in 11 stages (recon, architect, design,
  build, backend, test, diff, entrepreneur, brand, launch, deploy) with 6
  stdlib Python gate tools. Use when the user says "clone this app", "build my
  own version of X", "reverse engineer X's features", "what do X's users hate",
  "parity check", "rebrand the clone", "ship the clone", pastes an app or store
  URL to rebuild, or names any /replica-* stage. Not for copying code, assets,
  copy or private APIs.
license: MIT (original by Jake Schincariol, see LICENSE)
source: https://github.com/Jakeschincariol/replica-skill (v1.0, commit 77c9436)
version: 1.1.1-sa
---
# Replica SA: clone any app's features, clean-room

Rebuild what an app **does**, never what it **owns**. One stage at a time. Each stage reads and writes `replica/` in the user's project.

`S` = this skill folder (e.g. `~/.claude/skills/replica-skill-sa`). Tools: `python3 $S/scripts/<tool>.py`. Python 3.8+, no installs, no network.

## Hard rules (every stage, never compressed away)
- **Clean room.** Never copy source code, HTML/CSS/JS, SVGs, images, logos, copy or private APIs. No reading/saving JS bundles, decompiling, or logging network calls to copy endpoints. Public API docs OK.
- **Allowed sources only.** Public pages + the user's own account, driven by the user, at human speed. No scraping, crawlers, bulk downloads, paywall/login bypass, other people's accounts, or passwords. Account terms forbid building a competitor -> say so, use public sources only.
- **Never fabricate.** No invented reviews, quotes, counts, ratings, testimonials, users or check results. Unrun check = `to run`, never "available".
- **User owns accounts + money.** Agent never signs up, buys domains, enters cards, types passwords or pastes live keys. Agent writes `.env.example`, DNS records, commands; user does the account step.
- **Rebrand before launch.** Deploy blocked until `sweep.py` exits 0. Original's name never in app name, listing, keywords or ads.
- **Nothing goes live without the user's explicit go.**
- Not legal advice. Trademark/terms questions -> lawyer before money is on the line.

## Route: load only the matching stage file
Order: recon -> architect -> design -> build -> backend -> test -> diff -> entrepreneur -> brand -> launch -> deploy. Any stage runs alone if its `replica/` inputs exist; missing -> run the earlier stage, never plan from memory.

| stage | user says | load |
|---|---|---|
| recon | "clone X", "map out X", app/store URL | `references/01-recon.md` |
| architect | "plan stack / schema / API" | `references/02-architect.md` |
| design | "design system", "tokens" | `references/03-design.md` |
| build | "build the clone", "build S07" | `references/04-build.md` |
| backend | "auth", "Stripe", "database", "emails" | `references/05-backend.md` |
| test | "test it", "find bugs", "e2e" | `references/06-test.md` |
| diff | "how close", "parity", "what's missing" | `references/07-diff.md` |
| entrepreneur | "what do users hate", "make it sellable" | `references/08-entrepreneur.md` |
| brand | "name it", "rebrand", "leftovers" | `references/09-brand.md` |
| launch | "landing page", "pricing", "store listing" | `references/10-launch.md` |
| deploy | "ship it", "connect my domain" | `references/11-deploy.md` |

Output templates: `templates/`. Gate tools: `scripts/` (exit 0 pass, 1 fail, 2 bad input); each stage file gives its exact command.

## Every stage ends with
1. Run that stage's gate; paste real output (not a summary of it).
2. Status line: `✅ <stage> — <key number> — next: <stage>` or `❌ <stage> — <failed gate> — <fix>`.
3. Five lines max: what was made, counts, what is missing, risks, next stage.

Writing code (build, backend, test): smallest change that fully works, reuse before new code, one test per risky branch; never cut validation, security, a11y or data-loss handling. Honest numbers: 62% parity is 62%.
