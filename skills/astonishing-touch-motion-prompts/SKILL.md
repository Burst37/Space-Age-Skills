---
name: astonishing-touch-motion-prompts
description: Image-to-video prompt set for the Astonishing Touch Adult Day Center site — 12-second hero loop plus 11 service films (social, arts, meals, dementia care, transport, recreation, emotional support, mental stimulation, exercise, therapies, health monitoring), with casting, continuity and review rules. Use when generating or reviewing motion for that client.
---

# astonishing-touch-motion-prompts

Full prompts: `activity-motion-prompts.md` (verbatim from client brief). Read it whole before generating.

## Rules that bite
- Silent 16:9. Service films 8 s / 3 shots; Recreation 10 s / 4 shots; hero 12 s first/last-frame loop.
- Each timestamp = a new camera setup. If the model can't cut, render shots separately and edit at the stamps.
- Key action in the middle 45% (vertical crop); lower quarter clear for web text. Logo on staff anatomical-left chest, no generated words.
- Make identity references first; same faces/wardrobe across every cut. Different featured people per film; follow the casting table.
- Paste the "visual finish" block after every prompt's timestamps.
- Reject: static shot carried by camera, action starts >0.5 s late, idle subjects, prop state jumps, mobile crop loses action.
- Therapies and dementia care: illustrative only; verify the activity with the center; no diagnosis/outcome claims.
- Deliver muted clips + matching poster for reduced-motion.

## Pair with
`higgsfield-video-studio` / `seedance-2-5-prompting` (render), `cinematic-website-builder` (chapter integration; its `references/examples/astonishing/` holds the site brief).
