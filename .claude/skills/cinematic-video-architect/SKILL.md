---
name: cinematic-video-architect
description: Multi-platform image-to-video prompt architect. Generates structured video prompts for Seedance 2.0, Higgsfield, Kling, and other video AI platforms with cinematography precision.
allowed-tools: Read, Write
---

# CINEMATIC VIDEO ARCHITECT
## Space Age AI Solutions — Multi-Platform Video Prompt Engine

## When to load this skill

- User needs image-to-video or text-to-video prompts
- Generating content for Seedance 2.0, Higgsfield, Kling, Runway, Pika
- Music video shot prompts
- Product video or brand campaign video prompts
- Any cinematic video generation task

---

## PROMPT ARCHITECTURE

Every video prompt uses the SCENE → MOTION → LIGHT → MOOD → TECH structure:

```
SCENE: [What we see — subjects, environment, composition]
MOTION: [Camera movement + subject movement]
LIGHT: [Lighting quality, source, color temperature]
MOOD: [Emotional tone, color grade, atmosphere]
TECH: [Frame rate, aspect ratio, film stock reference]
```

---

## CAMERA MOVEMENT VOCABULARY

```
PUSH IN — camera moves toward subject (intensity, intimacy)
PULL OUT — camera moves away (reveal, isolation)
DOLLY LEFT/RIGHT — lateral tracking shot
ORBIT — 360° rotation around subject
CRANE UP/DOWN — vertical movement
HANDHELD — organic, documentary feel
STEADICAM — smooth but grounded
DRONE ASCENT — aerial rise reveal
SLOW ZOOM — subtle tension build
STATIC — locked off, composed
```

---

## PLATFORM-SPECIFIC FORMATTING

### Seedance 2.0
```json
{
  "prompt": "[scene description], [motion], [lighting], [mood]",
  "negative_prompt": "blur, watermark, text, low quality",
  "duration": 5,
  "aspect_ratio": "16:9",
  "motion_strength": 0.7
}
```

### Higgsfield
Use natural language prompt + motion preset selection:
```
[Subject] in [environment]. [Camera move]. [Lighting]. [Mood/tone].
Motion: [preset name]
Duration: [3/5/8] seconds
```

### Kling
```
[Detailed scene description]. Camera: [movement]. Light: [description]. 
Style: [cinematic reference]. Duration: [5/10]s. AR: [16:9/9:16/1:1]
```

---

## TIMESTAMP BEAT STRUCTURE (for music videos)

For music video shot prompts, map to song structure:

```json
[
  {"timestamp": "0:00-0:03", "shot": "[prompt]", "platform": "higgsfield"},
  {"timestamp": "0:03-0:08", "shot": "[prompt]", "platform": "seedance"},
  {"timestamp": "0:08-0:16", "shot": "[prompt]", "platform": "higgsfield"}
]
```

---

## VISUAL STYLE REFERENCES

Inject these when user needs a visual direction:

```
DENIS VILLENEUVE — vast environments, small humans, amber/teal grade
RIDLEY SCOTT — practical light, smoke, lens flare, gritty realism  
ROGER DEAKINS — natural light mastery, shadow detail, earthy tones
A24 AESTHETIC — desaturated, natural, intimate, film grain
LUXURY CAMPAIGN — high key, clean, model-lit, aspirational
NEON NOIR — deep shadows, colored practical lights, rain reflections
GOLDEN HOUR — warm backlight, lens flare, cinematic warmth
```

---

## DOWNSTREAM

Prompts generated here feed:
- `SA-higgsfield-operator` — executes Higgsfield generation via MCP
- `music-video-editor` — assembles shots into edit timeline
- `post-production-orchestrator` — routes into full post pipeline
