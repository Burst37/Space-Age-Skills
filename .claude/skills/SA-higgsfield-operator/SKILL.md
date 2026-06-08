---
name: SA-higgsfield-operator
display_name: "SPACE AGE — Higgsfield AI Operator"
version: "3.0"
last_updated: "2026-05"
source: "upgraded from higgsfield-ai/skills via @higgsfield/cli v0.1.35 + MCP surface"
description: >
  Master Higgsfield AI operator skill for Space Age AI Solutions. Covers the full
  Higgsfield surface: 18 image models + 17 video models, CLI command grammar, MCP
  tool routing, Soul ID training, Marketing Studio, Virality Predictor, DTC Ads Engine,
  product photoshoots, and brand kit management. Integrates Space Age cinematic prompt
  standards (150-200 word minimum, YAML output, equipment tokens, ultra-detail enforcement).
  PRIMARY platform for all AI image and video generation. Subscription credits — zero
  marginal cost per generation. Route ALL image/video work here before any other platform.
  TRIGGER on: any model name (Seedance, Kling, Veo, NanoBanana, Soul, etc.), any request
  to generate an image, generate a video, run virality predictor, train a Soul ID, build
  a marketing studio asset, create a DTC ad, upload media, or check credits/balance.
user-invocable: true
allowed-tools: Bash, mcp__Higgsfield__generate_image, mcp__Higgsfield__generate_video, mcp__Higgsfield__job_display, mcp__Higgsfield__show_generations, mcp__Higgsfield__media_upload, mcp__Higgsfield__show_characters, mcp__Higgsfield__show_marketing_studio, mcp__Higgsfield__virality_predictor, mcp__Higgsfield__balance, mcp__Higgsfield__models_explore
---

See full skill definition at: user/SA-higgsfield-operator/SpaceAge_HiggsField_Operator_SKILL.md

## QUICK REFERENCE

**DEFAULT IMAGE MODEL:** GPT Image 2 (`gpt_image_2`) — all text-in-image, hero, product, commercial
**PORTRAIT/CHARACTER:** Nano Banana Pro (`nano_banana_2`) — zero text in frame only
**PRIMARY VIDEO:** Seedance 2.0 (`seedance_2_0`) — music video, rhythm, editorial
**NARRATIVE VIDEO:** Kling v3.0 (`kling3_0`) — story, multi-shot, cinematic
**LIPSYNC ONLY:** Veo 3.1 (`veo3_1`) — dialogue sync
**VIRALITY CHECK:** `brain_activity` — run before deploying any ad

## MCP TOOLS
- Generate image: `mcp__Higgsfield__generate_image`
- Generate video: `mcp__Higgsfield__generate_video`
- Check balance: `mcp__Higgsfield__balance`
- Virality predictor: `mcp__Higgsfield__virality_predictor`
- Browse history: `mcp__Higgsfield__show_generations`

## CLI ONE-LINERS
```bash
higgsfield account                                          # check credits
higgsfield generate create nano_banana_2 --prompt "..." --aspect_ratio 16:9 --resolution 4k --wait
higgsfield generate create seedance_2_0 --prompt "..." --aspect_ratio 16:9 --genre drama --duration 5 --wait
higgsfield generate create kling3_0 --prompt "..." --duration 5 --mode pro --sound on --wait
higgsfield generate create brain_activity --video ./ad.mp4 --wait
```

## NEVER
- Route text-in-image to nano_banana_2 — gpt_image_2 only
- Generate prompts under 150 words
- Use generic camera references — use exact model names (ARRI, ZEISS, Blackmagic)
- Output prompts as plain text — always YAML
