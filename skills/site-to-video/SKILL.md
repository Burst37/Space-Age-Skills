---
name: site-to-video
description: Use when the user provides a website URL and wants a video made from it — e.g. "capture this site and make a 20s product launch video", "turn this website into a social ad", "make a product tour from this link". Even a bare URL with "make a video" is enough to trigger this skill.
---

# Site to Video (capture -> brand -> storyboard -> build -> verify)

## Overview

[heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)'s `website-to-hyperframes` skill is a 7-step pipeline (capture, brand identity, strategy/messaging, storyboard+script, VO/captions, build compositions, validate+deliver) with per-step gates and an explicit warning against skipping verification gates in "autonomous mode." The pipeline is thorough but its Step 6 "honest disclosure" section (what wasn't verified) is easy to skip under time pressure since it's just a checklist item among many. This version promotes that disclosure into a **mandatory final artifact** — a short DELIVERY_NOTES.md that must exist and be non-empty before the video is considered done, separate from the validation checklist itself.

## When to Use

- User pastes a URL and asks for any kind of video (product tour, social ad, launch teaser, brand reel)
- "Capture this site and make a [duration] [type] video"
- NOT for videos with no source website (pure script-to-video) — this skill is specifically for site-derived videos
- NOT for rendering to MP4 unless the user explicitly asks — default deliverable is the localhost Studio project URL

## Core Pattern

Original 7 steps unchanged: (0) Capture & understand brand, (1) DESIGN.md brand cheat sheet, (2) Strategy/messaging alignment, (3) Storyboard+Script (user-approval gate), (4) VO/timing/captions, (5) Build compositions (lint+snapshot per beat), (6) Validate & deliver.

**10x addition — DELIVERY_NOTES.md (mandatory artifact)**: at Step 6, write a separate file (not buried in chat) with three sections:
- **Verified**: what was checked (lint pass, validate pass, snapshots reviewed, WCAG warnings addressed)
- **Not verified**: anything skipped — e.g. "audio playback not tested", "portrait crop not previewed at actual device size"
- **Known limitations**: e.g. stock asset substitutions, placeholder text, assumptions made about brand voice

The video is not "done" until this file exists with content in all three sections — an empty "Not verified" section should prompt re-checking, not be left blank by default.

## Quick Reference

| Step | Gate | Artifact |
|---|---|---|
| 0. Capture | Strategy-first site summary | captured assets |
| 1. Brand identity | Colors/fonts/do's-don'ts present | DESIGN.md |
| 2. Strategy | Message + arc + audience locked | — |
| 3. Storyboard+Script 💬 | User approves plan | STORYBOARD.md, SCRIPT.md |
| 4. VO/captions 💬 | Audio+transcript or manual timings | narration.wav, transcript.json |
| 5. Build | Per-beat lint+snapshot+read | compositions/beat-N.html |
| 6. Validate & deliver | lint+validate pass, **DELIVERY_NOTES.md written** | Studio project URL, DELIVERY_NOTES.md |

## Implementation

```
1. Run steps 0-5 per the original website-to-hyperframes workflow (capture, DESIGN.md,
   strategy alignment, storyboard+script with user approval, VO/captions, build).
2. At step 6: run `npx hyperframes lint` and `npx hyperframes validate`, take snapshots
   scaled to video length, review each.
3. Write DELIVERY_NOTES.md with Verified / Not verified / Known limitations sections.
   Be specific — "audio not previewed at final mix volume" not "some things untested."
4. If "Not verified" contains anything that's actually cheap to verify now (e.g. you
   have audio playback available), do it before finalizing rather than just disclosing it.
5. Deliver: localhost Studio project URL + DELIVERY_NOTES.md content surfaced in the
   final response (not just written to disk).
6. Only render to MP4 if explicitly requested.
```

## Common Mistakes

- **Treating the Step 6 "honest disclosure" as a chat-only afterthought** — without a persisted artifact it gets compressed to "looks good!" under time pressure.
- **Skipping verification gates in "autonomous mode"** — auto mode covers user-preference decisions (TTS provider, captions on/off), not quality gates (asset audit, per-beat read, DoD checklist).
- **Rendering to MP4 unprompted** — default deliverable is the Studio project URL.
- **Leaving "Not verified" empty** — if literally everything was verified, say so explicitly with what was checked; an empty section usually means it wasn't considered, not that nothing was missed.

## Attribution

Forked from [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)'s `website-to-hyperframes` skill (7-step capture-to-video pipeline with per-step gates). Original kept in full; this version adds the mandatory DELIVERY_NOTES.md artifact to make the existing "honest disclosure" requirement durable and checkable rather than chat-ephemeral.
