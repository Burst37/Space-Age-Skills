---
name: media-gen-pipeline
description: Use when the user wants AI-generated images or video produced via a multi-model pipeline (prompt -> generate -> edit -> stitch) — e.g. "generate a product video from these images", "make a short clip with lip sync", "create variations of this image then combine into a video" — and a MuAPI-compatible generation backend is configured.
---

# Media Generation Pipeline (prompt -> generate -> edit -> stitch)

## Overview

[Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) is an Electron desktop app exposing 200+ image/video models (via MuAPI) across four studios: Image, Video, Lip Sync, Cinema. Its companion [SamurAIGPT/Generative-Media-Skills](https://github.com/SamurAIGPT/Generative-Media-Skills) lets coding agents drive these models end-to-end from the terminal. Neither defines a structured *pipeline* — each model call is independent, so multi-step jobs (generate base image -> edit -> animate -> add lip sync -> stitch into final cut) are run ad hoc with no tracking of intermediate assets or cost. This skill adds that structure: an explicit asset manifest tracking every generation step, plus a cost/time estimate gate before kicking off expensive video jobs.

## When to Use

- "Generate [N] images of X, then turn the best one into a video"
- "Lip-sync this audio to this image/video"
- "Stitch these clips into a final cut" (Cinema studio)
- NOT for single one-off image generation with no follow-on steps — for that, just call the model directly
- NOT for editing real user photos in ways that imply consent issues (e.g. lip-syncing a real person's likeness without the user confirming they have rights to that footage)

## Core Pattern

Every multi-step job gets an **asset manifest** (a simple JSON/markdown list) before any generation starts:

| Step | Studio | Model | Input asset(s) | Output asset | Est. cost/time |
|---|---|---|---|---|---|
| 1 | Image | (model name) | prompt | `assets/base_v1.png` | ... |
| 2 | Image (edit) | (model name) | `base_v1.png` | `assets/edited_v1.png` | ... |
| 3 | Video | (model name) | `edited_v1.png` | `assets/clip_v1.mp4` | ... |
| 4 | Lip Sync | (model name) | `clip_v1.mp4` + audio | `assets/lipsync_v1.mp4` | ... |
| 5 | Cinema | stitch | all clips | `assets/final.mp4` | — |

Before step 3+ (video/lip-sync, the expensive steps), present the manifest's cost/time estimate to the user and confirm before proceeding — generation jobs are not free or instant and a bad upstream image wastes a downstream video credit.

## Quick Reference

| Need | Studio | Notes |
|---|---|---|
| Generate image from text | Image | iterate on prompt before moving downstream |
| Edit/variation of existing image | Image (edit mode) | use as gate before video generation |
| Image-to-video / text-to-video | Video | most expensive step — confirm manifest first |
| Sync audio to face/video | Lip Sync | requires source video or image + audio asset |
| Combine multiple clips | Cinema | final assembly step |

## Implementation

```
1. Parse the user's request into a sequence of studio calls; write the asset manifest
   (table above) BEFORE generating anything.
2. Run cheap/iterative steps first (Image generation/edit) and let the user pick
   the best output before spending credits on Video/Lip Sync/Cinema steps.
3. Before any Video, Lip Sync, or Cinema (stitch) call: show the manifest with
   est. cost/time and get explicit go-ahead.
4. Execute remaining steps in manifest order, writing each output asset path back
   into the manifest so later steps reference concrete files, not "the last output."
5. Final step: confirm the delivered file matches what step 1's manifest promised
   (right duration, right aspect ratio, audio present if lip-synced).
```

## Common Mistakes

- **Jumping straight to video generation** on an unreviewed base image — base image quality issues compound (and cost more) downstream.
- **Losing track of intermediate assets** — without the manifest, "use the image from before" becomes ambiguous after 3+ generation steps.
- **Skipping the cost/time confirmation** for video/lip-sync jobs — these are the slow, credit-consuming steps; users should approve the full plan, not be surprised mid-pipeline.
- **Lip-syncing real people's likenesses without confirming consent/rights** — flag this explicitly if the source video/image appears to depict a real identifiable person who isn't the user.

## Attribution

Forked from [Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) (and its companion [SamurAIGPT/Generative-Media-Skills](https://github.com/SamurAIGPT/Generative-Media-Skills)). Original provides the model catalog and per-studio API access; this skill adds the asset-manifest tracking and pre-spend confirmation gate, neither of which exist in the source repos.
