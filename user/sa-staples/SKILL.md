---
name: sa-staples
description: >
  The three non-negotiables present on every Space Age AI Solutions client website without
  exception. Reference this skill before finalizing any site brief. TRIGGER whenever building
  or reviewing a site brief to confirm all three staples are included.
version: 1.2
updated: 2026-05-19
---

# SA STAPLES
## Three Non-Negotiables — Every Client Site, No Exceptions

These three elements are on every site regardless of business type, budget, or complexity.
They are not optional. They are not swapped out. They define the Space Age AI Solutions product.

---

## VIDEO PLATFORM RULE

```
CURRENT DEFAULT:  Seedance 2.0
  Use for ALL three video modes — transformation, montage, atmosphere
  Seedance 2.0 is the house platform until further notice

PENDING:          Veo 4
  Reassess default platform when Veo 4 releases
  Until then — Seedance 2.0 on everything

FALLBACK ONLY (do not default to these):
  Kling 3.0       only if Seedance 2.0 cannot handle the specific shot
  Veo 3.1         only if Seedance 2.0 cannot handle the specific shot
  Sora 2          only if Seedance 2.0 cannot handle the specific shot
  Always note the reason in the brief if routing away from Seedance 2.0
```

---

## STAPLE 1 — FULL-SCREEN VIDEO HERO

Every site opens with a cinematic full-screen video hero. No static image heroes. Ever.

### Video Mode Decision Tree

```
STEP 1: Does this business have a visible before/after transformation?
  YES → MODE A: TRANSFORMATION

STEP 2: Does this business sell multiple products across different categories?
  YES → MODE B: MONTAGE

STEP 3: Does this business sell a feeling, atmosphere, or authority?
  YES → MODE C: ATMOSPHERE
```

---

### MODE A — TRANSFORMATION (first frame + last frame)

```
WHEN:
  Landscaping       overgrown yard → perfect lawn
  HVAC              broken unit → cool comfortable home
  Dental            problem smile → perfect smile
  Home renovation   beat up room → stunning remodel
  Cleaning          dirty space → spotless result
  Pest control      infestation → clean home
  Auto detailing    dirty car → showroom finish
  Any trade where the RESULT is the product

EXECUTION:
  Frame 1: NanoBanana Pro generates the BEFORE image
  Frame 2: NanoBanana Pro generates the AFTER image
  Same angle · Same lighting direction · Same time of day
  Feed both into Seedance 2.0 as first + last frame reference
  Duration: 8–12 seconds
  Cinema mode: M3 Action — dynamic, satisfying, fast-forward feel
```

---

### MODE B — MONTAGE (multi-scene, single continuous video)

```
WHEN:
  Ecommerce / dropshipping    multiple products, multiple use cases
  Retail with varied inventory
  Any site where the product LINE is the story

EXAMPLE — Video game accessories store:
  Scene 1 (0–3s):   Kid on couch, PS5 controller, intense gaming face
  Scene 2 (3–6s):   Same kid, remote control car racing on driveway
  Scene 3 (6–9s):   Drone launching, aerial pull-back shot
  Scene 4 (9–11s):  Scooter riding fast and smooth
  Scene 5 (11–15s): Back to couch — accessories laid out, money shot

EXECUTION:
  Platform: Seedance 2.0
  Each scene: 2–3 seconds
  Total duration: 10–15 seconds
  Cuts: hard cuts between scenes — fast, energetic
  Color grade: unified across all scenes
  Character rule: ONE consistent character ties all scenes together
    → Viewer follows the person, not just the products
    → Products are what the character is using — never floating objects
  Cinema mode: M3 Action — fast, dynamic, high energy
  NanoBanana: generate one reference frame per scene
    → Feed as style references into Seedance 2.0 scene-by-scene
```

---

### MODE C — ATMOSPHERE (single cinematic prompt, up to 10 seconds)

```
WHEN:
  Restaurant        cinematic food, atmosphere, plating
  Law office        confident attorney, modern office, authority
  Spa / wellness    calm, steam, candles, serenity
  Retail (single)   product beauty shots, editorial
  Personal brand    person in their element, lifestyle
  Real estate       golden hour property walk
  Any business where the FEELING is the product

EXECUTION:
  Platform: Seedance 2.0
  Single NanoBanana prompt → reference image
  Route through cinema-worldbuilder for video prompt
  Cinema mode matched to business personality
  Duration: up to 10 seconds
  Pacing: M1 Narrative or M5 Atmospheric
```

---

### Hero Overlay (all modes)
```
  Video: autoplay, muted, looped, full viewport
  Overlay: subtle gradient for text readability
  Headline: jumbo — value proposition in 5–8 words
  CTA button: magnetic hover — primary action
  Position: centered or lower-third depending on aesthetic
```

---

## STAPLE 2 — CUSTOM CHARACTER WIDGET

Every site has a branded AI character widget — not a generic chat bubble.

### Spec
```
WIDGET APPEARANCE:
  Position:     bottom-right corner (standard)
  Shape:        circular bubble
  Content:      static image — NO animation required
  Style:        Pixar/CGI quality OR illustrated OR photorealistic
  Label:        "Talk to [Name]" below the bubble
  Size:         small — reads clearly at 60–80px diameter

CHARACTER GENERATION:
  Tool: NanoBanana Pro
  Style: Pixar CGI — friendly, colorful, reads at small size
  Background: transparent PNG, circular crop ready
  One prompt per client — generate once, done

CHARACTER BY BUSINESS TYPE:
  Landscaper        Pixar guy pushing lawnmower / riding mower
  HVAC              cartoon tech in uniform with wrench
  Dentist           friendly cartoon dentist with mirror tool
  Law office        illustrated attorney in suit
  Restaurant        cartoon chef, arms crossed, proud
  Spa               calm illustrated practitioner
  Real estate       smiling agent with sold sign
  Ecommerce/gaming  character matching the store vibe
  Personal brand    stylized version of the actual person

INTERACTION:
  Visitor clicks bubble or "Talk to [Name]" label
  → Gemini 3.1 Flash TTS activates (Staple 3)
```

---

## STAPLE 3 — GEMINI 3.1 FLASH TTS VOICE AGENT

Every site has a live voice AI agent behind the character widget.

### Spec
```
MODEL: Google Gemini 3.1 Flash TTS
CAPABILITY: Multimodal — sees the page in real time
ACTIVATION: Click on character widget

WHAT IT KNOWS (configured per client by Hermes Agent):
  → Business name, owner name
  → All services or products offered
  → Service area / shipping info (ecommerce)
  → Pricing range or free estimate policy
  → Business hours
  → Booking link or cart / checkout flow
  → Top 5 FAQs for that business type
  → Tone: friendly, knowledgeable, on-brand

WHAT IT DOES:
  → Answers questions in real time via voice
  → Books appointments OR guides to checkout
  → Qualifies leads
  → Handles after-hours coverage 24/7
  → Never says "I don't know" — routes to contact if stuck

HERMES AGENT CONFIGURES POST-BUILD:
  → Embeds Gemini agent on the page
  → Builds knowledge base from client intake
  → Connects to booking or ecommerce system
  → Sets voice tone and persona
  → Tests all FAQ responses before launch
```

---

## BRIEF CHECKLIST

Before any site goes to the coding agent, confirm:

```
STAPLES CHECKLIST:
  ✓ Video mode selected         [transformation / montage / atmosphere]
  ✓ Platform confirmed          [Seedance 2.0 — default]
  ✓ NanoBanana prompts written  [1, 2, or per-scene depending on mode]
  ✓ Character widget prompt written  [Pixar/CGI + business type]
  ✓ Character name confirmed    ["Talk to [Name]"]
  ✓ Gemini agent knowledge base drafted
  ✓ Hermes Agent assigned for post-build integration

  If any unchecked → do not proceed to coding agent.
```

---

## NANOBANANA PROMPT TEMPLATES

### Mode A — Before Frame (transformation)
```
[Neglected/broken/problem state] [location/setting],
[specific visual problems], [time of day] light,
wide establishing shot, same angle as after frame,
cinematic realism, ARRI Alexa Mini LF, Cooke 50mm anamorphic,
Phase_One_IQ4_150MP.IIQ, HDR10+, commercial_hero_frame --ar 16:9 --q 4
```

### Mode A — After Frame (transformation)
```
Same [location/setting] perfectly [transformed state],
[specific visual improvements], [same time of day] light,
same angle same lighting direction as before frame,
cinematic realism, ARRI Alexa Mini LF, Cooke 50mm anamorphic,
Phase_One_IQ4_150MP.IIQ, HDR10+, commercial_hero_frame --ar 16:9 --q 4
```

### Mode B — Scene Reference Frame (montage, one per scene)
```
[Character description] [action in this scene],
[environment/setting], [energy level],
[time of day / lighting], cinematic action shot,
ARRI Alexa Mini LF, Cooke 50mm anamorphic,
Phase_One_IQ4_150MP.IIQ, HDR10+, Nike campaign aesthetic,
commercial_hero_frame --ar 16:9 --q 4
```

### Mode C — Single Frame (atmosphere)
```
[Subject/environment] [mood descriptor], [location],
[specific atmospheric details], [time of day] light,
[camera angle], cinematic realism, ARRI Alexa Mini LF,
Phase_One_IQ4_150MP.IIQ, HDR10+,
[aesthetic reference] --ar 16:9 --q 4
```

### Character Widget
```
Pixar CGI style friendly cartoon [character description],
[business-appropriate prop or action],
slight smile, warm friendly eyes, clean colorful Pixar
Incredibles quality render, soft studio lighting,
pure white background, full figure visible,
optimized for small circular crop, transparent background ready,
ultra detailed --ar 1:1 --q 4
```
