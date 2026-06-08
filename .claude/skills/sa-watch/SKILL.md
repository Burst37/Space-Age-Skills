---
name: sa-watch
version: "2.0"
description: Universal video intelligence engine. Analyzes any video (YouTube URL, uploaded file, or reference link) for style, technique, content patterns, and production quality. Used upstream of ai-content-creator, music-video-editor, and cinematic-video-architect.
allowed-tools: WebFetch, Bash, Read
---

# SA-WATCH v2.0
## Space Age AI Solutions — Universal Video Intelligence Engine

## When to load this skill

- User provides a YouTube URL for analysis
- "Watch this video and tell me..."
- Analyzing competitor content before creating competing content
- Extracting visual style for `cinematic-video-architect` prompts
- Research phase before any video production task

---

## ANALYSIS FRAMEWORK

### Layer 1: Production Analysis

```yaml
PRODUCTION:
  camera_work:
    - Shot types used (ECU, MCU, WS, etc.)
    - Camera movement patterns
    - Stabilization (handheld vs gimbal vs locked)
  
  lighting:
    - Key light position and quality
    - Color temperature
    - Practical lights visible
    - Time of day / location
    
  editing:
    - Average shot length
    - Cut style (hard cuts, dissolves, match cuts)
    - Pacing relative to audio
    - Transition techniques
    
  color_grade:
    - Overall palette
    - Shadows (crushed, lifted, colored)
    - Highlights (blown, contained, styled)
    - Luts/presets in use (estimate)
```

### Layer 2: Content Analysis

```yaml
CONTENT:
  hook:
    - First 3 seconds technique
    - Pattern interrupt used
    - Curiosity gap or value promise
    
  structure:
    - Content flow (hook → body → CTA)
    - Story arc if present
    - Pacing of information delivery
    
  engagement_signals:
    - Comment trigger techniques
    - Share-worthy moments
    - Save-worthy content markers
    
  platform_optimization:
    - Aspect ratio usage
    - Caption strategy
    - Sound/music choice
```

### Layer 3: Brand/Style DNA

```yaml
BRAND_DNA:
  visual_identity:
    - Color palette extraction
    - Typography style
    - Motion language
    - Aesthetic references
    
  voice_and_tone:
    - Speaking pace and style
    - Copy language (formal/casual/bold)
    - Personality markers
    
  competitive_position:
    - Who they're competing with
    - What makes this distinct
    - Weaknesses/opportunities
```

---

## OUTPUT FORMAT

Deliver analysis as:

1. **Quick Take** (3 bullets — most important observations)
2. **Full Analysis** (all three layers above)
3. **Replication Guide** (how to produce similar content)
4. **Improvement Opportunities** (what could be better)

---

## DOWNSTREAM HANDOFF

After analysis, feed insights into:
- `cinematic-video-architect` → use visual DNA for prompt generation
- `ai-content-creator` → use content patterns for competing content
- `music-video-editor` → use editing style for music video production
- `brand-extractor` → use brand DNA for competitor profile
