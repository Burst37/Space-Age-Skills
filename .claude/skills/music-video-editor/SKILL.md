---
name: music-video-editor
version: "3.0"
description: Full-stack music video creation skill. Three production paths: Autonomous (Higgsfield + CapCut headless), Canva-assisted, and CapCut manual. Handles shot planning, prompt generation, and assembly timeline.
allowed-tools: Bash, Read, Write
---

# MUSIC VIDEO EDITOR v3.0
## Space Age AI Solutions — Full-Stack Music Video Production

## When to load this skill

- User needs a music video created or conceptualized
- Artist provides a song/track and wants visuals
- Shot planning or storyboarding for a music video
- Video prompt generation for music video content

---

## THREE PRODUCTION PATHS

### PATH A — AUTONOMOUS (Higgsfield MCP + CapCut headless)

For: Fully automated production when no manual editing needed

1. **Song Analysis**: Extract BPM, energy curve, sections (intro/verse/chorus/bridge/outro)
2. **Shot List Generation**: Map shots to song sections (use `cinematic-video-architect`)
3. **Higgsfield Generation**: Generate each shot via Higgsfield MCP
4. **Assembly**: Use CapCut headless API to assemble to timeline
5. **Export**: Final render with captions if needed

### PATH B — CANVA-ASSISTED

For: Videos needing graphic overlays, text animations, or template-based editing

1. Song analysis + shot list (same as Path A)
2. Generate raw footage via Higgsfield
3. Import to Canva via Canva MCP
4. Apply brand templates, text animations, transitions
5. Export final video

### PATH C — CAPCUT MANUAL

For: Artist wants hands-on edit with AI-generated footage

1. Song analysis + shot list
2. Generate footage via Higgsfield
3. Deliver shot package + CapCut project file with:
   - Pre-cut clips at beat points
   - Shot sequence recommendation
   - Color grade reference
4. Artist completes edit manually

---

## SONG ANALYSIS TEMPLATE

```yaml
song_analysis:
  title: ""
  artist: ""
  bpm: 0
  key: ""
  energy_curve: "low-high | consistent | drop-based | build"
  sections:
    intro: "0:00-0:XX"
    verse1: "0:XX-1:XX"
    chorus1: "1:XX-1:XX"
    verse2: "1:XX-2:XX"
    chorus2: "2:XX-2:XX"
    bridge: "2:XX-2:XX"
    outro: "2:XX-3:XX"
  visual_direction: ""
  color_palette: ""
  mood: ""
```

---

## SHOT LIST STRUCTURE

Map to song energy:
- **High energy** (chorus, drops): fast cuts, dynamic camera, wide-to-close
- **Low energy** (verses, intros): slower motion, holding shots, atmospheric
- **Transitions**: match beat drops to visual cuts

Minimum shots by duration:
- 3-minute video: 20-30 shots
- 4-minute video: 30-40 shots
- Each shot: 3-8 seconds average

---

## VISUAL STYLE OPTIONS

```
NARRATIVE — Story-driven, character arc, location-based
CONCEPT — Abstract, symbolic, metaphor-driven
PERFORMANCE — Artist-centered, stage or environment
LIFESTYLE — Aspirational, day-in-life, luxury
HYBRID — Mix narrative + performance (most common)
```

---

## DELIVERY PACKAGE

1. Song analysis YAML
2. Shot list (numbered, with timestamps and prompts)
3. Generated video files (via Higgsfield)
4. Assembly timeline (CapCut project or Canva project)
5. Color grade reference image
