---
name: seedance-prompt-engineer
version: 1.0
description: Expert Seedance 2.0 video prompt engineering. Generates optimized prompts for Seedance 2.0 image-to-video and text-to-video generation via Higgsfield MCP.
allowed-tools: Read, Write
---

# SEEDANCE PROMPT ENGINEER v1.0
## Space Age AI Solutions — Seedance 2.0 Optimization

## When to load this skill

- Generating video prompts specifically for Seedance 2.0
- `cinematic-video-architect` routes to Seedance platform
- Music video shot generation via Seedance
- Social content video via Seedance 2.0

---

## SEEDANCE 2.0 PROMPT STRUCTURE

Seedance 2.0 responds best to this structure:

```
[SUBJECT] [ACTION] in [ENVIRONMENT].
[CAMERA MOVEMENT]. [LIGHTING]. [MOOD/ATMOSPHERE].
[STYLE REFERENCE if needed].
```

**Keep prompts under 200 words.** Seedance performs better with focused prompts vs. exhaustive lists.

---

## MOTION VOCABULARY (Seedance-optimized)

```
STRONG for Seedance:
- "slow push toward" — reliable dolly effect
- "orbiting around" — reliable rotation
- "handheld following" — organic movement
- "static locked-off" — no camera movement
- "rising upward" — crane-style ascent
- "drifting left/right" — lateral slide

AVOID for Seedance:
- Over-specific lens specs (use style references instead)
- Multiple conflicting motions in one prompt
- More than 2 motion descriptors
```

---

## LIGHTING KEYWORDS (Seedance-optimized)

```
BEST PERFORMING:
- "golden hour backlight" — warm cinematic
- "overcast diffused light" — clean even exposure  
- "neon practical lighting" — colored night scene
- "studio three-point lighting" — controlled environment
- "dramatic chiaroscuro" — high contrast shadows
- "blue hour twilight" — dusk/dawn atmosphere
```

---

## STYLE REFERENCES (high impact)

```
DENIS VILLENEUVE — vast, minimal, atmospheric
A24 AESTHETIC — natural, intimate, film grain
NIKE CAMPAIGN — athletic, energetic, high contrast
APPLE KEYNOTE — clean, premium, minimal
MUSIC VIDEO CINEMATIC — stylized, beat-synced
DOCUMENTARY REALISM — handheld, authentic
```

---

## SEEDANCE-SPECIFIC PARAMETERS

```json
{
  "prompt": "[Your optimized prompt]",
  "negative_prompt": "watermark, text, blur, distortion, low quality, static",
  "duration": 5,
  "aspect_ratio": "16:9",
  "seed": -1
}
```

**Duration options:** 3, 5, 8, 10 seconds
**Aspect ratios:** 16:9 (landscape), 9:16 (vertical), 1:1 (square)

---

## PROMPT EXAMPLES

### Music Video Shot
```
Young artist standing on a rooftop at golden hour, 
slow push toward as wind moves through jacket. 
Golden hour backlight creating rim light silhouette. 
Cinematic music video aesthetic, film grain.
```

### Product Hero
```
Luxury sneaker rotating slowly on reflective dark surface. 
Static locked-off shot. Studio three-point lighting with 
specular highlights on material. Clean premium aesthetic.
```

### Social Content (vertical)
```
Confident young woman walking toward camera on city sidewalk, 
handheld following from front. Overcast diffused natural light. 
Lifestyle brand aesthetic, authentic and editorial.
```
