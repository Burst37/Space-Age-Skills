# higgsfield-video-studio

Full-stack AI video and image creation pipeline powered by Higgsfield. Covers everything from raw generation to post-production: images, videos, 3D, voice, upscaling, background removal, motion control, and virality prediction.

## Trigger

Use this skill when the user wants to:
- Generate images or videos from a text prompt
- Create product shots, social media content, ads, or brand visuals
- Upscale or enhance existing images/videos to 2K/4K
- Remove backgrounds from images
- Apply motion to images (puppeteer, recast, motion transfer)
- Expand/uncrop images (outpaint)
- Convert an image into a 3D GLB mesh
- Change a video's aspect ratio (reframe)
- Create or clone a voice
- Predict video virality / engagement before posting
- Dub videos into another language

## MCP Server

All tools are on the `Higgsfield` MCP server (prefix: `mcp__Higgsfield__`).

## Pre-flight Checklist

Before any generation call:
1. Call `mcp__Higgsfield__list_workspaces` and `mcp__Higgsfield__select_workspace` if no workspace is active.
2. If unsure which model to use, call `mcp__Higgsfield__models_explore` with `action: "recommend"` and the user's goal.
3. If the user wants to upload a local file, call `mcp__Higgsfield__media_upload_widget` — do NOT ask them to attach it in chat.
4. If the user provides a web URL for input media, call `mcp__Higgsfield__media_import_url` first and pass the returned `media_id`.

## Workflow Map

### Image Generation
```
mcp__Higgsfield__generate_image(prompt, model?, aspect_ratio?, ...)
→ poll with mcp__Higgsfield__job_display(job_id)
→ optionally: upscale_image / remove_background / outpaint_image
```

### Video Generation
```
mcp__Higgsfield__generate_video(prompt, model?, input_image_media_id?, ...)
→ poll with mcp__Higgsfield__job_display(job_id)
→ optionally: upscale_video / reframe / voice_change
```

### Image → 3D Mesh
```
mcp__Higgsfield__generate_3d(media_id)
→ poll with mcp__Higgsfield__job_display(job_id)
→ returns GLB file URL
```

### Motion Control (image animation)
```
mcp__Higgsfield__motion_control(media_id, action: "puppeteer"|"recast"|"motion_transfer", ...)
```

### Voice Creation
- Apps UI: call `mcp__Higgsfield__create_voice` immediately — the widget handles recording/upload.
- API path: `mcp__Higgsfield__media_upload` → `mcp__Higgsfield__create_voice_from_confirmed_audio(audio_media_id, name)`

### Virality Prediction
```
mcp__Higgsfield__virality_predictor(media_id)
→ returns engagement score, hook strength, retention risk, audience response
```

### Dubbing
```
mcp__Higgsfield__dubbing(media_id, target_language)
```

## Output Patterns

After any generation job completes, always:
1. Show the output URL/preview to the user.
2. Ask if they want post-processing (upscale, remove background, add voice, etc.).
3. Offer to predict virality if it's social/ad content.

## Space Age Context

- Use for client deliverables: product videos, ad creatives, social content, brand visuals.
- For eBook cover images → generate with Higgsfield → hand off brief to `adobe-creative-suite` for polish.
- For sales bot video hooks → generate short video → run `virality_predictor` → iterate.
- Check `mcp__Higgsfield__show_plans_and_credits` before heavy batch jobs to avoid credit overruns.

## Slash Commands

- `/generate-image [prompt]` — quick image generation with model auto-selection
- `/generate-video [prompt]` — quick video generation
- `/upscale [media_id]` — upscale image or video to 4K
- `/remove-bg [media_id]` — transparent background cutout
- `/predict-virality [media_id]` — engagement score before posting
- `/create-voice` — launch voice creation widget
