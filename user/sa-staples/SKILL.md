---
name: sa-staples
description: >
  The three non-negotiables present on every Space Age AI Solutions client website without
  exception. Reference this skill before finalizing any site brief. TRIGGER whenever building
  or reviewing a site brief to confirm all three staples are included.
version: 1.0
updated: 2026-05-18
---

# SA STAPLES
## Three Non-Negotiables — Every Client Site, No Exceptions

These three elements are on every site regardless of business type, budget, or complexity.
They are not optional. They are not swapped out. They define the Space Age AI Solutions product.

---

## STAPLE 1 — FULL-SCREEN VIDEO HERO

Every site opens with a cinematic full-screen video hero. No static image heroes. Ever.

### Video Mode Selection

**Does this business have a visible before/after transformation?**

```
YES → TRANSFORMATION MODE (first frame + last frame)
  Business types:
    Landscaping       overgrown yard → perfect lawn
    HVAC              broken unit → cool comfortable home
    Dental            problem smile → perfect smile
    Home renovation   beat up room → stunning remodel
    Cleaning          dirty space → spotless result
    Pest control      infestation → clean home
    Auto detailing    dirty car → showroom finish
    Any trade where the RESULT is the product

  Execution:
    Frame 1: NanoBanana Pro generates the BEFORE image
    Frame 2: NanoBanana Pro generates the AFTER image
    Same angle · Same lighting direction · Same time of day
    Feed both into Seedance / Kling / Veo as first + last frame
    AI animates the transformation between them
    Duration: 8–12 seconds
    Pacing: M3 Action — dynamic, satisfying, fast-forward feel
```

```
NO → ATMOSPHERE MODE (single cinematic prompt, up to 10 seconds)
  Business types:
    Restaurant        cinematic food, atmosphere, plating
    Law office        confident attorney, modern office, authority
    Spa / wellness    calm, steam, candles, serenity
    Retail            product beauty shots, editorial
    Personal brand    person in their element, lifestyle
    Real estate       golden hour property walk
    Medical / dental  (non-transformation — trust and calm)
    Any business where the FEELING is the product

  Execution:
    Single NanoBanana prompt → reference image
    Route through cinema-worldbuilder for video prompt
    cinema mode matched to business personality
    Duration: up to 10 seconds
    Pacing: M1 Narrative or M5 Atmospheric
```

### Hero Overlay (both modes)
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
                — whichever fits the brand best
  Label:        "Talk to [Name]" below the bubble
  Size:         small — reads clearly at 60–80px diameter

CHARACTER GENERATION:
  Tool: NanoBanana Pro
  Style: Pixar CGI — friendly, colorful, reads at small size
  Background: transparent PNG, circular crop ready
  One prompt per client — generate once, done

CHARACTER EXAMPLES BY BUSINESS TYPE:
  Landscaper      → Pixar guy pushing lawnmower / riding mower
  HVAC            → cartoon tech in uniform with wrench
  Dentist         → friendly cartoon dentist with mirror tool
  Law office      → illustrated attorney in suit
  Restaurant      → cartoon chef, arms crossed, proud
  Spa             → calm illustrated practitioner
  Real estate     → smiling agent with sold sign
  Personal brand  → stylized version of the actual person

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
  → All services offered
  → Service area / zip codes
  → Pricing range or "free estimate" policy
  → Business hours
  → Booking link or direct scheduling
  → Top 5 FAQs for that business type
  → Tone: friendly, local, knowledgeable

WHAT IT DOES:
  → Answers questions in real time via voice
  → Books appointments directly
  → Qualifies leads ("What's your address? We service that area.")
  → Handles after-hours ("We're closed but I can schedule you for tomorrow")
  → Never says "I don't know" — routes to contact form if truly stuck

HERMES AGENT CONFIGURES:
  → Embeds Gemini agent on the page
  → Builds the knowledge base from client intake
  → Connects to booking system
  → Sets the voice tone and persona
  → Tests all FAQ responses before launch
```

---

## BRIEF CHECKLIST

Before any site goes to the coding agent, confirm:

```
STAPLES CHECKLIST:
  ✓ Video hero mode selected    [transformation / atmosphere]
  ✓ NanoBanana prompts written  [1 or 2 frames depending on mode]
  ✓ Video platform selected     [Seedance / Kling / Veo / Sora]
  ✓ Character widget prompt written  [Pixar/CGI + business type]
  ✓ Character name confirmed    ["Talk to [Name]"]
  ✓ Gemini agent knowledge base drafted  [services / area / FAQs]
  ✓ Hermes Agent assigned for post-build integration

  If any of these are unchecked → do not proceed to coding agent.
```

---

## NANOBANANA PROMPT TEMPLATES

### Transformation Mode — Before Frame
```
[Neglected/broken/problem state] [location/setting],
[specific visual problems listed], [time of day] light,
wide establishing shot, same angle as after frame,
cinematic realism, ARRI Alexa Mini LF, Cooke 50mm anamorphic,
Phase_One_IQ4_150MP.IIQ, HDR10+, commercial_hero_frame --ar 16:9 --q 4
```

### Transformation Mode — After Frame
```
Same [location/setting] perfectly [transformed state],
[specific visual improvements listed], [same time of day] light,
same angle same lighting direction as before frame,
cinematic realism, ARRI Alexa Mini LF, Cooke 50mm anamorphic,
Phase_One_IQ4_150MP.IIQ, HDR10+, commercial_hero_frame --ar 16:9 --q 4
```

### Atmosphere Mode — Single Frame
```
[Subject/environment] [mood descriptor], [location],
[specific atmospheric details], [time of day] light,
[camera angle — wide / close / establishing],
cinematic realism, ARRI Alexa Mini LF, [lens],
Phase_One_IQ4_150MP.IIQ, HDR10+, [aesthetic reference] --ar 16:9 --q 4
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
