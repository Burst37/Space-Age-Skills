---
name: post-production-orchestrator
version: 1.0
description: Post-production pipeline orchestrator for music videos, ads, and EPKs. Manages Blender, DaVinci Resolve, CapCut, Photoshop, Splice, and Higgsfield in a coordinated production workflow.
allowed-tools: Bash, Read, Write
---

# POST-PRODUCTION ORCHESTRATOR v1.0
## Space Age AI Solutions — Post-Production Pipeline

## When to load this skill

- Music video or ad is in post-production phase
- Need to coordinate multiple creative tools
- Color grading, sound design, VFX, or final edit needed
- After `music-video-editor` has generated raw footage

---

## TOOL ROUTING MAP

```yaml
BLENDER:
  use_for: "3D elements, motion graphics, VFX, title sequences"
  trigger: "3D animation, particle effects, logo animation, abstract visuals"

DAVINCI_RESOLVE:
  use_for: "Color grading, professional edit, audio mix, final export"
  trigger: "Color grade, final edit, professional output, broadcast spec"

CAPCUT:
  use_for: "Quick social edits, TikTok/Reels cuts, trend templates, captions"
  trigger: "Social media cut, quick edit, trending format, auto-captions"

PHOTOSHOP:
  use_for: "Thumbnail creation, key art, promotional stills, frame retouching"
  trigger: "Thumbnail, key art, album cover, promotional image, retouch"

SPLICE:
  use_for: "Sound design, music editing, sample layering, mix"
  trigger: "Sound design, audio edit, beat adjustment, sound effects"

HIGGSFIELD_MCP:
  use_for: "AI shot generation, reshoots, fill shots, VFX backgrounds"
  trigger: "Generate new shot, add visual, AI footage, background plate"
```

---

## POST-PRODUCTION PHASES

### Phase 1: Assembly Cut
1. Organize all footage from `music-video-editor` shot list
2. Sync to audio track
3. Rough cut assembly (no grading, no effects)
4. Review against song structure

### Phase 2: Picture Lock
1. Fine cut — tighten timing to beats
2. Remove unused shots
3. Add transition decisions
4. Review and approve (no further editorial changes after this)

### Phase 3: Color Grade (DaVinci Resolve)
1. Apply base LUT for overall look
2. Correct scene-by-scene exposure
3. Apply stylized grade (VL-01 cinematic palette)
4. Export for review

### Phase 4: Sound Design (Splice)
1. Add SFX layer (impacts, whooshes, atmospheres)
2. Mix with music track
3. Master for platform spec

### Phase 5: VFX + Motion Graphics (Blender)
1. Add 3D elements, particles, title sequences
2. Composite with footage in DaVinci

### Phase 6: Final Export
```yaml
MUSIC_VIDEO_EXPORT:
  master: "ProRes 4444, 1920x1080, 24fps"
  youtube: "H.264, 1920x1080, 24fps, 50Mbps"
  instagram_reel: "H.264, 1080x1920, 30fps, 15Mbps"
  tiktok: "H.264, 1080x1920, 30fps, 10Mbps"
```

---

## THUMBNAIL PRODUCTION (Photoshop)

```
YouTube Thumbnail Spec:
  Size: 1280 x 720
  Safe zone: Keep key elements in center 800x600
  Text: Max 4 words, large + bold
  Face: If using person, close-up expression
  Contrast: High contrast for thumbnail visibility
  Brand: Include channel logo/branding
```

---

## DELIVERY CHECKLIST

```
MUSIC VIDEO DELIVERY:
  [ ] Master ProRes file
  [ ] YouTube upload file
  [ ] Social media cuts (Reels, TikTok)
  [ ] Thumbnail (1280x720)
  [ ] Key art / album cover
  [ ] Behind the scenes clip
  [ ] Lyric video (optional)
```
