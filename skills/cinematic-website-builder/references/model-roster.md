# Model roster — read it live, pick by role, ask when it changed (G6, v3.5)

Image and video models are replaced every few weeks. A model name written into a skill is out of date by the time
the skill is used. So this skill stores **roles**, reads the **live roster** at the start of each build's asset
phase, and records what it picked.

## Protocol (run once per build, before the first generation)

1. **Read the live roster.** Higgsfield MCP (default platform):
   `models_explore { action: "list", type: "image" }` and `{ action: "list", type: "video" }`
   (the video list is large: write it to a file and filter). For one role:
   `models_explore { action: "recommend", query: "<role + inputs, e.g. image-to-video with start and end frame, 21:9, seamless loop>" }`,
   then `{ action: "get", model_id }` for the exact parameters, durations, aspect ratios and media roles.
   Other platforms (OpenArt, a provider's own app): read their current model list the same way, or ask.
2. **Shortlist per role** (`asset-pipeline.md` §3 table) by capability, from the fields the roster returns: media
   roles (`start_image` + `end_image` for a loop, `image_references` for identity), resolution, aspect ratios,
   duration. Within one family take the highest version; skip `lite` / `flash` / `turbo` variants for finals (use
   them for drafts).
3. **Decide.**
   - **Client mode:** if the pick differs from `taste-profile.yaml → models.last_used` for that role, or two
     families both qualify, **ask** (one question, the shortlist as options, your recommendation first). The roster
     shows capability, not quality: a newer model is a candidate, not automatically the winner.
   - **Lead mode:** pick the first shortlisted candidate in `taste-profile.yaml → models.prefer_families` order,
     log why. No question.
   - **No roster reachable** (no generation tool on this harness): ask which model to use, or in lead mode ship
     media tier T0 (posters/gradients) and say so. Never fall back to a remembered model name.
4. **Record** per slot in `assets.yaml` and in each JSON shot spec:
   `model_id`, `model` (display name), `platform`, `roster_checked: YYYY-MM-DD`, `why`. After an approved build,
   write the picks to `taste-profile.yaml → models.last_used`.
5. **Draft cheap, finish once.** Test motion on the family's fast variant or lowest resolution; run the final at
   target resolution only when the draft's motion is right (director v4.1 iteration rule: one failure class per pass).

`scripts/shot-lint.mjs` fails any clip whose `model.roster_checked` is missing or older than 30 days.

## Standing preferences (Chuma's, not the roster's)
- Hero video is image-to-video from an approved anchor still. Never text-to-video.
- Not Grok's video model for site clips.
- Generation runs on subscriptions already held (Higgsfield first). Check credits/unlimited eligibility in the roster
  response (`supports_unlim`) before a batch.

## Snapshot — Higgsfield roster read 2026-11-16 (evidence that names move; do not build from this table)

When this was written the skill's docs still said "ChatGPT Images 2.5" and "MiniMax H3 / Seedance 2.5 / 2.0". The
live roster that day already listed newer entries in most families:

| Role | On the roster that day (ids) |
|---|---|
| Anchor still | `gpt_image_2_6` (and `gpt_image_2_6_flare`), `nano_banana_2_1`, `nano_banana_pro`, `flux_3_image`, `seedream_v5_pro`, `cinematic_studio_2_5`, `minimax_h3_image`, `ideogram_4_5` |
| Graphic / vector | `gpt_image_2_6` (SVG output), `ideogram_vector`, `recraft_v4_1` |
| Hero loop (start + end frame) | `minimax_h3`, `kling4_0`, `seedance_2_5`, `seedance_2_0`, `wan3_0_prime`, `gemini_omni_flash_1_2`, `flux_3_video`, `cinematic_studio_video_4_0`, `veo3_1_lite` |
| Section clip | the hero-loop list, plus `veo3_1` (start frame only) |
| Narrative / multi-shot / extension | `seedance_2_5`, `kling4_0`, `flux_3_video`, `gemini_omni_flash_1_2`, `cinematic_studio_video_4_0` |
| Identity-consistent | `seedance_2_0`, `kling_o3_image_reference`, `wan3_0_prime` |
| Finish | `topaz_video`, `bytedance_video_upscale`, `reframe`, `video_deflicker`, `fps_boost`, `topaz_image`, `outpaint` |

The roster does not say which of these is best for a given shot. That is what the draft pass and, in client mode,
the question are for.
