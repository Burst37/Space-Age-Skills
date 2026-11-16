---
name: animation-studio-director
description: >-
  Run an AI animated-series studio from one folder: Claude as director, Picsart
  MCP (or any video/image/audio MCP such as Higgsfield) as the studio floor.
  Direct on paper and stills first, lock, then render. Covers the series bible
  (with an "engine"), character passports, shot cards, HTML animatic, frame
  review by a fresh read-only reviewer, 480p draft then 1080p final, sound and
  stitch, a 16-frame consistency check, and a breakdown-reel format for
  marketing the work. Use when the user wants an AI animated series, shorts,
  character-consistent video, a "studio" pipeline, episode production, or a
  motion-designer breakdown reel. Not for single one-off clips (use
  cinema-director-v3 / seedance-2-5-prompting) or story canon only
  (story-bible-builder).
source: "Movez (@0xMovez), 'How to build a $1M AI animation studio with Fable 5.2 + Picsart', Nov 12 — course notes distilled into an operational skill"
version: 1.0.0
---
# Animation Studio Director

A video model has no memory. **The studio folder is the memory.** Invert the usual order: direct everything on paper and in stills, lock it, and only then let a video model touch it.

## Hard rules (never relax)
1. **Quote before spend.** Every paid generation is priced first; wait for the user's yes. Stop at the daily budget in `bible.md`.
2. **Two human gates only:** before money is spent, before anything is published.
3. **Drafts before finals.** 480p drafts only; a 1080p final needs an approved draft.
4. **No passport, no render.** Nothing reaches a final without a character passport, a reviewed frame and an approved draft.
5. **Never rename or regenerate a reference image.** Fix the *motion prompt* instead.
6. **Log every attempt** in `log.md`: model, prompt version, cost, verdict. An unlogged good shot can't be remade.
7. **One retry per shot, one changed line.** After 3 failed attempts: stop, report "simplify the shot".
8. Never copy another creator's character, look or story, only the *format*.

## Workflow (13 steps → 8 phases)
| Phase | Do | Detail |
|---|---|---|
| 0 Setup | Connect Picsart MCP, check balance, quote one cheap image, generate nothing | `references/setup.md` |
| 1 Crew | Write the 7 subagents into `.claude/agents/` | `references/agents.md` |
| 2 Folder | Create the studio tree, seed `bible.md`/`log.md`/passport template | `templates/` |
| 3 Bible | Interview one question at a time; fields incl. **engine**; need 5 episode ideas or the engine is too weak | `references/prompts.md` §bible |
| 4 Passport | Exhaustive descriptor + hero + turnaround + crop; lock | `references/prompts.md` §passport |
| 5 Shots | Script → shot cards (one action each) → **free HTML animatic** | `references/prompts.md` §shots |
| 6 Frames → Motion | Starting frame per shot → fresh-session reviewer PASS/FAIL → 480p draft → approve → 1080p | `references/prompts.md` §frames, §motion |
| 7 Sound/Stitch/QA | Music bed + SFX, ffmpeg stitch, 16-frame check against passports | `references/prompts.md` §sound |
| 8 Launch | Premise from working formats; completion rate vs own average; breakdown reel | `references/launch.md` |

## Studio tree
```
studio/
  bible.md    series: world, engine, tone, rules, budget, the two folder laws
  cast/       one passport per character (text + reference images)
  episodes/   one folder per episode: script, shot cards (shots.md), prompts
  frames/     approved still frames only
  renders/    raw video attempts; nobody else looks here
  selects/    accepted takes only; the editor sees nothing else
  log.md      every generation: model, prompt version, cost, verdict
```
Two folder laws (write at top of `bible.md`): **(1)** only the editor touches `selects/`; **(2)** only approved stills enter `frames/`, and reference images are never renamed or regenerated.

## Why it works (keep when adapting)
- **Engine** = the thing that goes wrong every episode and can never be solved. It is what makes the series recurring.
- **Passport** text is pasted *verbatim* into every prompt the character appears in. A variant (flour-covered, hurt) is its own passport/tag, never described inline.
- **Fixed imperfection + signature item + tell** make drift easy to spot (straight antenna = failed shot).
- **Reviewer judges the frame, not intentions**: fresh session, read-only, marks anything unjudgeable from a still as UNCHECKED.
- **Shot rules:** 4-10 s, hook in first 3 s readable muted, no text in frame, no crowds/mirrors/hands handling small objects, last shot holds its final pose.

## Overlap routing
Prompt grammar for the video model → `cinema-director-v3`, `seedance-2-5-prompting`. Canon document as installable skill → `story-bible-builder`. Character plates → `character-builder`. Higgsfield as the floor instead of Picsart → `higgsfield-video-studio`. Claims marked **VERIFY** in the source (e.g. Seedance 2.5 Draft Mode 480p→1080p, model counts/prices) must be confirmed against the live MCP before relying on them.

## Money claims
The "$1M" in the source title is the budget this pipeline *replaces*, not income. The pipeline gives a studio that costs credits instead of salaries. Revenue streams (Picsart Earn, clients, TikTok Creator rewards, YouTube, brand placements) are unproven; present them as options, in the order listed, never as promised earnings.

End coding/setup replies with one line: what was skipped or unchecked.
