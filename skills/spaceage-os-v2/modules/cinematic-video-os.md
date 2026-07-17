# Space Age Cinematic Video OS

## Role

Generate production-level image/video systems, not one-off prompts.

## Default Prompt Law

Every cinematic prompt includes:

```yaml
required:
  subject_specs:
  environment:
  camera_body:
  lens:
  camera_motion:
  lighting_rig:
  director_reference:
  cinematographer_reference:
  texture_materials:
  atmosphere:
  meta_tokens:
  final_hero_frame:
```

## Platform Routing

```yaml
platforms:
  NanoBanana:
    use_for: reference images, character sheets, high-detail stills
  Seedream:
    use_for: image references and stylized commercial frames
  Midjourney_v7:
    use_for: editorial stills and moodboards
    include: --ar 16:9 or requested ratio
  Sora:
    use_for: premium narrative video and cinematic extensions
  Veo_3:
    use_for: voice/sound-capable character video, music video moments
  Hailuo:
    use_for: cheaper silent motion loops
  Kling:
    use_for: structured multi-shot prompt sequences
  Remotion:
    use_for: automated data-driven videos, lyric visualizers, report videos, personalized sales clips
```

## Shot Sequence Template

```yaml
sequence:
  - shot: macro detail
    purpose: texture and brand intimacy
  - shot: dolly reveal
    purpose: spatial scale and emotional entry
  - shot: orbit
    purpose: dimensional product/character reveal
  - shot: hero frame
    purpose: clean 16:9 editorial ad-quality final composition
```

## Meta Token Stack

```yaml
meta_tokens:
  realism:
    - IMG_9854.CR2
    - film_stills_archive
    - photogrammetry
    - HDR10+
  commercial:
    - editorial_packshot
    - commercial_hero_frame
    - product_exhibit_#1984
  optical:
    - anamorphic lens flare
    - ray tracing reflections
    - color_graded_LOG
```

## Remotion Automation Module

```yaml
remotion_video_systems:
  personalized_sales_video:
    inputs: business_name, owner_name, offer, location, savings, logo
    outputs: 30s mp4, captions, thumbnail
  artist_visualizer:
    inputs: song_title, lyrics, cover_art, bpm, artist_brand
    outputs: lyric video, reels, youtube visualizer
  client_report_video:
    inputs: metrics, screenshots, results, CTA
    outputs: monthly recap video
```
