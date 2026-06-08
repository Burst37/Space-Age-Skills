---
name: ai-content-creator
version: "2.0"
description: Master AI content creator skill for Space Age AI Solutions. Generates multi-platform content with cinematography meta tokens, brand voice injection, and platform-native formatting. Auto-triggers on any content creation request.
argument-hint: "[platform] [content-type] [topic] [brand-url-or-btp]"
allowed-tools: Bash, Read, Write, Edit
---

# AI CONTENT CREATOR v2.0
## Space Age AI Solutions — Master Content Production Engine

### AUTO-TRIGGER RULE

This skill fires automatically when any of these appear:
- "write a post", "create content", "make a caption", "script a video"
- "Instagram", "TikTok", "Twitter/X", "LinkedIn", "YouTube"
- "reel", "story", "carousel", "thread", "newsletter"
- Any request to generate, rewrite, or repurpose content

**Do NOT wait for `/ai-content-creator`.** Detect intent → classify → produce.

---

## PLATFORM ENGINE

### Instagram
- **Reels Script**: Hook (0-3s) → Value delivery (3-45s) → CTA (45-60s)
- **Caption**: Hook line → Story/value → CTA → 3-5 hashtags (niche, not broad)
- **Carousel**: Slide 1 = hook, Slides 2-9 = value, Last slide = CTA
- **Story sequence**: 3-7 frames, each max 7 words on screen

### TikTok
- Hook in first 0.5 seconds (pattern interrupt)
- POV / trend / transformation / educational formats
- CTA at 80% mark, not the end
- Caption: 1 sentence + 1-3 hashtags

### Twitter/X
- Single tweet: ≤280 chars, end on tension or insight
- Thread: Hook tweet → value tweets (numbered) → CTA tweet
- No periods at end of thread tweets (engagement signal)

### LinkedIn
- Hook line (no emoji, personal story or contrarian take)
- Line breaks every 1-2 sentences
- Insight/lesson in middle
- Soft CTA at end
- No hashtags in body, 3 max in comments

### YouTube
- Title: Pattern interrupt + keyword + value promise (≤60 chars)
- Description: First 2 lines = hook (shows before fold), timestamps, links
- Script structure: Hook → Credibility → Promise → Content → CTA

---

## CINEMATOGRAPHY META TOKENS

For video scripts, inject visual direction using these tokens:

```
[SHOT: ECU] — Extreme close-up (eyes, hands, product detail)
[SHOT: MCU] — Medium close-up (face + shoulders)
[SHOT: MS] — Medium shot (waist up)
[SHOT: WS] — Wide shot (full environment)
[MOVE: PUSH] — Camera moves toward subject
[MOVE: PULL] — Camera moves away
[MOVE: ORBIT] — 360° orbit around subject
[LIGHT: GOLDEN] — Golden hour / warm natural light
[LIGHT: NEON] — Colored neon / RGB accent lighting
[LIGHT: PRACTICAL] — Light source visible in frame
[PACE: SLOW] — Cinematic slow motion
[PACE: CUT] — Fast cuts (energy/hype)
[TONE: CINEMATIC] — Film grain, letterbox, color grade
[TONE: RAW] — Unfiltered, authentic, handheld
```

Example:
```
[SHOT: ECU] [LIGHT: GOLDEN] Product in hands, condensation visible
[MOVE: PULL] Reveal the full scene as music drops
[PACE: CUT] Quick cuts through lifestyle shots
```

---

## BRAND VOICE INJECTION

Before generating any content, load brand context:
1. Check if BTP (Brand Token Package) is in session from `brand-extractor`
2. If URL provided, run brand-extractor Phase 1 inline
3. If no brand context, use neutral professional voice and flag it

Brand voice tokens to inject:
```
tone: [luxury / bold / warm / technical / playful / authoritative]
voice_examples: [sample phrases that sound like the brand]
forbidden: [words/phrases that break brand voice]
cta_style: [imperative / inviting / urgent / soft]
```

---

## CONTENT FORMATS

### Short-Form Video Script
```
PLATFORM: [Instagram Reels / TikTok / YouTube Shorts]
DURATION: [15s / 30s / 60s]
HOOK (0-3s): [Pattern interrupt line]
VISUAL: [Shot direction]
BODY: [Core message with shot notes]
CTA: [Specific action]
```

### Caption
```
PLATFORM: [Instagram / TikTok / LinkedIn]
HOOK: [First line — stops the scroll]
BODY: [Value / story / insight]
CTA: [What to do next]
HASHTAGS: [3-5 niche tags]
```

### Carousel (Instagram/LinkedIn)
```
SLIDE 1 — HOOK: [Bold claim or question]
SLIDE 2-N — VALUE: [One insight per slide]
SLIDE LAST — CTA: [Save this / Follow / DM us]
```

---

## OUTPUT FORMAT

Deliver:
1. **Primary content** (formatted for platform)
2. **Alt version** (different angle/hook)
3. **Visual direction** (for Higgsfield/Seedance generation downstream)
4. **Caption variations** (A/B test hooks)

If generating for multiple platforms in one request, deliver all formats in sequence.
