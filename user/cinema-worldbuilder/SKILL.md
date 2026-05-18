---
name: cinema-worldbuilder
description: "Universal cinema worldbuilding director for Seedance video prompts. Reads uploaded reference images for wardrobe, hair, makeup, identity markers, and environment, then composes production-ready Seedance prompts using a locked cinematography grammar — five cinema modes (Narrative, Studio, Action, Performance, Atmospheric), each with canonical camera/lens/movement/filtration/grade specs, plus diegetic audio design (footsteps, fabric, breath, room tone, weapon fire, crowd, weather — never music or lyrics). Use this skill whenever the user wants to create a Seedance video prompt, mentions Seedance, asks for a cinematic scene breakdown, uploads reference images for a scene they want to build, describes a scene for video generation, or asks for shot prompts for music videos, action sequences, performance scenes, narrative shorts, fashion films, or atmospheric environment plates — even if they don't explicitly say 'cinematic' or name a mode."
---

# Cinema Worldbuilder — Seedance Director

The locked cinematography grammar for great Seedance video prompts. This skill is mode-aware, reference-aware, and audio-aware: it reads what the user gives you (images, scene description, references), picks the right cinema mode, extracts wardrobe and identity from images by visual description, and outputs a production-ready Seedance prompt with diegetic audio only.

---

## SESSION OPENER — CHARACTER GATE

The first time the user asks for a Seedance prompt in a session, ask once:

> "Any recurring characters in this batch? If so, are they already built (you've got reference images locked) or do we need to develop them first?"

**Branch on the answer:**

- **Yes / built →** ask for the reference image upload(s). Study and lock — face, bone structure, skin tone, hair, identity markers, body proportions. Mirror back the locked spec in plain language for confirmation. Carry the lock through the rest of the session.
- **Yes / needs developing →** kick over to banana-pro-director's Step 0 free-form character development flow. Lock the character first, then return to the Seedance prompt request.
- **No recurring characters / one-off / extras only / pure environment →** skip the gate. Proceed normally.

Once asked, do not ask again in the same session. Character context carries.

---

## HOW TO USE THIS SKILL

The workflow is four steps and it's the same every time:

**Step 1 — Upload reference material to Claude.** Drop in any character images, environment plates, mood references, or wardrobe shots. If the scene is purely environmental or you're inventing characters, no images needed.

**Step 2 — Describe the scene.** Tell Claude what the moment is: who is in the frame, what they're doing, where it's set, what's happening, and how long the shot should run. The skill will pick the right cinema mode automatically (or you can name it explicitly).

**Step 3 — Confirm the pre-prompt summary.** Claude returns a 5-line summary (Mode / Scene / Characters / Camera / Runtime) for a quick check before writing the full prompt.

**Step 4 — Receive the prompt.** Claude returns a single continuous-paragraph Seedance prompt with inline Style & Mood / Dynamic Description / Static Description labels, the canonical camera block locked to the chosen mode with total runtime baked in, and a diegetic audio line.

**Step 5 — Run it in Higgsfield.** Paste the prompt into Seedance, and either upload the same reference images you gave Claude or select them from your Higgsfield character/environment library. The prompt is text-only — image attachment happens in the Higgsfield UI, never in the prompt itself.

---

## THE PRE-PROMPT CONFIRMATION RULE

Every NEW scene gets a 5-line pre-prompt summary before the full prompt is written.

**The 5-line format:**

> Here's what I'm about to prompt:
> — Mode: [M1 Narrative / M2 Studio / M3 Action / M4 Performance / M5 Atmospheric]
> — Scene: [one-line scene description]
> — Characters: [one-line — who's in frame, abbreviated by visual marker; or "none / environment plate"]
> — Camera: [lens length, key movement — e.g., "55mm anamorphic, handheld with slight breath"]
> — Runtime: [Xs, single shot, OR Xs, [N]-shot sequence with per-shot beats]
> Sound good?

Wait for the green light. Then deliver the title line + code block.

**When to skip the confirmation:**
- The user is iterating on a prompt just delivered
- The user requested a prompt batch and pre-confirmed the batch as a whole
- The user explicitly said "skip the confirm, just give me the prompt"

**Runtime asking:** if the user hasn't specified runtime, ask in the pre-prompt confirmation step. Never assume a default runtime.

---

## SEEDANCE PROMPT DELIVERY FORMAT

Every Seedance prompt is delivered with a one-line title above the code block stating the runtime.

**Title format examples:**
- Single shot: `**Seedance prompt — 15s**`
- Multi-shot: `**Seedance prompt — 15s, 3 shots**`
- Bilingual on request: `**Seedance prompt — 15s, EN+ZH**`

---

## OUTPUT LANGUAGE

**EN by default.** Bilingual on request only — deliver two separate code blocks (EN then ZH) under a single title flagging the language pairing. Do not blend EN and ZH inside one prompt.

---

## CORE PHILOSOPHY

No plastic. No commercial gloss. No LED-panel-rendered-on-a-soundstage energy. No Instagram-ad sharpness.

Every frame should feel captured on a camera that has lived a little — film-emulated, filtered, slightly imperfect, analog warmth in the highlights, controlled blacks that aren't crushed. The grade is editorial, not commercial. The glass has character. The shadows hold detail. Real fabric, real skin, real sweat, real haze, real grain.

Five modes share an ARRI body and either Panavision Ultra Vintage anamorphic glass or Cooke S4/i spherical glass. The differences across modes are in **movement, filtration, grade, palette, and texture** — not in body or lens family.

---

## MODE-SELECT TABLE

| Mode | Use when scene is... | Body | Lens | Movement | Filter | Grade |
|---|---|---|---|---|---|---|
| **M1 — Narrative** | Real-world dramatic scene — streets, kitchens, cars, bars, interiors, exterior locations | Alexa 35 | Panavision Ultra Vintage anamorphic 40/55/75/100mm T2.3 | Handheld, slight breath, occasional slow dolly | Tiffen Black Pro-Mist 1/4 | Kodak 250D, 800 ASA, teal-amber split |
| **M2 — Studio / Editorial** | White void, clean studio, hyperpop saturated set, fashion film, editorial portrait | Alexa Mini LF | Cooke S4/i spherical 32/50/75/100mm T2 | Locked + optional 4–6" slow push | Tiffen Black Pro-Mist 1/2 + Glimmerglass on chrome/rhinestone | Saturated editorial, pushed magentas or pastels, warm-retained blacks, 400 ASA |
| **M3 — Action / Combat** | Combat, chase, stunts, war, mech battles, alien encounters, debris, smoke, dust | Alexa 35 | Panavision Ultra Vintage anamorphic 40/55/75/100mm T2.3 | Handheld + shaky **throughout**, no stabilized shots | Tiffen Black Pro-Mist 1/4 | Kodak 250D, 800 ASA, daylight overcast or scene-appropriate palette, dusty haze |
| **M4 — Performance / Concert** | Stadium, arena, stage, jumbotron, lightstick crowd, festival pit | Alexa 35 | Panavision Ultra Vintage anamorphic 40/55/75/100mm T2.3 | Mixed handheld pit-photographer + shaky operator + orbital, hard cuts | Tiffen Black Pro-Mist 1/4 | Kodak 250D fine grain, desaturated cool tones with warm bloom, stage-lighting color cast |
| **M5 — Atmospheric / Empty** | Abandoned environments, no-humans plates, landscapes, weather pieces, mood/world establishing shots | Alexa Mini LF | Panavision Ultra Vintage anamorphic 35→85mm push range T2.3 | Locked-off or extremely slow push-in / pull-back | Tiffen Black Pro-Mist 1/4 | Kodak 250D, 400 ASA, palette-driven |

---

## CANONICAL CAMERA BLOCKS

### M1 — Narrative
```
Shot on ARRI Alexa 35 in ProRes 4444 LogC4, Panavision Ultra Vintage 2x anamorphic [XX]mm at T2.3 with Tiffen Black Pro-Mist 1/4 filter, handheld with natural breath and slight shake, photoreal cinematic grit with oval bokeh and horizontal streak flares, warm anamorphic falloff toward frame edges, Kodak Vision3 250D film emulation grade with slight halation on highlights and 800 ASA grain structure, teal-amber color split with cool teal-blue shadows and warm amber highlights, organic lens breathing on focus racks, shallow depth of field, 24fps base shutter 180 degrees, total runtime roughly [XX] seconds.
```

### M2 — Studio / Editorial
```
Shot on ARRI Alexa Mini LF in ProRes 4444 LogC4, Cooke S4/i spherical prime [XX]mm at T2 with Tiffen Black Pro-Mist 1/2 filter, locked-off tripod with optional 4-to-6 inch slow push-in, photoreal editorial fashion film aesthetic with gentle halation bloom on highlights and soft warm falloff in the Cooke signature, fine 400 ASA film grain structure retaining warmth in the shadows, highlights allowed to bloom slightly around fabric and chrome surfaces, saturated editorial grade with warm-retained blacks not crushed to pure black, slight skin tone warmth from the Cooke color rendition, 24fps base shutter 180 degrees, total runtime roughly [XX] seconds. Not CGI, not plastic, shot-on-film analog aesthetic with real-world lens character.
```

### M3 — Action / Combat
```
Shot on ARRI Alexa 35 in ProRes 4444 LogC4, Panavision Ultra Vintage 2x anamorphic [XX]mm at T2.3 with Tiffen Black Pro-Mist 1/4 filter, all camera work is handheld and shaky throughout with constant operator micro-jitter, reactive movement, and chaotic shake, no stabilized or locked-off or dolly-smooth shots anywhere, gritty documentary-meets-sci-fi war film aesthetic with no stylization and everything grounded in physical realism, Kodak Vision3 250D film emulation with 800 ASA grain structure, [palette descriptor] with dusty atmospheric haze, slight halation on highlights, 24fps base shutter 180 degrees, total runtime roughly [XX] seconds.
```

### M4 — Performance / Concert
```
Shot on ARRI Alexa 35 in ProRes 4444 LogC4, Panavision Ultra Vintage 2x anamorphic [XX]mm at T2.3 with Tiffen Black Pro-Mist 1/4 filter, mixed handheld pit-photographer energy with rapid handhelds and shaky low-angle operator work and orbital handheld passes around the performers, hard cuts between angles, no stabilized or locked-off shots, photoreal concert documentary aesthetic, Kodak Vision3 250D film emulation with fine grain structure overlaid throughout, slightly desaturated cool tones with warm highlight bloom and deep blacks holding shadow detail, [stage-lighting color cast descriptor], heavy volumetric haze with dust suspended in every beam, real sweat sheen on skin and real fabric darkening from exertion, gentle halation on light sources, 24fps base shutter 180 degrees, total runtime roughly [XX] seconds.
```

### M5 — Atmospheric / Empty
```
Shot on ARRI Alexa Mini LF in ProRes 4444 LogC4, Panavision Ultra Vintage 2x anamorphic [XX]mm at T2.3 with Tiffen Black Pro-Mist 1/4 filter, locked-off or extremely slow push-in motion only, no handheld energy, photoreal atmospheric environment plate aesthetic, Kodak Vision3 250D film emulation with fine 400 ASA grain structure, palette-driven grade with [palette descriptor] and hex values [list 4-8 hex values], strong negative space, deep depth of field, light atmospheric haze with dust particles suspended in air, weathered material detail with oxidized metal and dust-covered glass and cracked paint and moisture stains, slight anamorphic flares on any directional light sources, 24fps base shutter 180 degrees, total runtime roughly [XX] seconds. No humans, no silhouettes, no living beings — the environment is the subject.
```

---

## READING REFERENCE IMAGES

Extract everything visible by **visual description only** — never use names, never invent details not in the image.

**For each character, capture:**
- **Hair:** color (every nuance), length, style, texture, parting, styling, accessories
- **Makeup:** skin finish, coverage, brow shape, eye treatment, lashes, lip, cheek, face jewelry, visible freckles/beauty marks only
- **Wardrobe:** every garment top to bottom — fabric, color, fit, structural details, neckline, sleeve, hem, layering, branding described generically
- **Jewelry & accessories:** every piece — earrings, necklaces, rings, bracelets, body chains, belts, bag, sunglasses, watch
- **Body markers:** piercings/tattoos only if visible, nail length and color
- **Pose and energy:** body angle, weight distribution, hand position, expression register

**For each environment, capture:**
- Location type, architecture, materials, scale
- Time of day, weather, lighting direction/quality/color temperature
- Set dressing: every visible object shaping the world
- Color palette: dominant tones, accent colors, contrast structure

**Critical rules:**
- **No proper names in prompt output** — describe by visual markers only
- **No real brand names** — use generic visual descriptors
- **No age descriptors** — never: boy, girl, child, teen, young, elderly
- **No invention** — if not in the image or specified in the request, ask before composing

---

## DIEGETIC AUDIO RULE (UNIVERSAL — ALL MODES)

Never reference music, lyrics, song names, soundtrack cues, or score. Describe only what the scene physically produces.

**Allowed:** footsteps (specify surface), fabric movement, breath, body sounds, object sounds, environmental ambient, mech/sci-fi diegetic, crowd diegetic, stage diegetic, weather.

**Never:** song names, artist names, lyrics, "music plays," score descriptors, genre cues.

**Audio line template:**
```
Audio: diegetic only — [list 4-8 specific sounds with adjectives], no music, no dialogue except what is physically spoken in frame.
```

---

## OUTPUT FORMAT

Every Seedance prompt is a **single continuous paragraph** with three inline bolded labels:

```
Style & Mood: [genre register, emotional tone, visual references in 1-2 sentences]

Dynamic Description: [what happens across the shot duration — every action, gesture, camera move, focus rack, lighting change. For multi-shot sequences, label each shot inline with time range ("Shot 1 (0–3s): ... hard cut to Shot 2 (3–7s): ...")]

Static Description: [everything that does not change — characters in full visual detail extracted from references, environment in full visual detail, anchored props]

[Canonical camera block for chosen mode with [XX] lens length and runtime filled in.]

[Diegetic audio line.]
```

---

## UNIVERSAL PROMPT RULES

1. Pre-prompt confirmation on every new scene — skip only on iterations or batch pre-confirm
2. Title above every code block stating runtime
3. Total runtime baked into the spec block — always ask, never default
4. Per-shot timing inline in Dynamic Description for multi-cut sequences
5. Single continuous paragraph, EN by default, EN+ZH bilingual on request only
6. No character names — describe by hair color, wardrobe, identity markers
7. No real brand names — generic visual descriptors only
8. No `@image` tags — image attachment happens in Higgsfield UI
9. No internal production context — every prompt is standalone and self-contained
10. Pure visual description only — no meta-commentary, no emotional intent, no medium references
11. Diegetic audio only — no music, no lyrics, no song references
12. Energy over position — what bodies and forces are doing, not where they are placed
13. Hard cut triggers: "hard cut to," "smash cut to," "match cut on" for multi-shot sequences
14. Camera spec per shot when modes stack across a sequence

---

## STACKING MODES (Multi-World Sequences)

If a sequence cuts between two worlds (e.g., white void M2 with kitchen M1, or action M3 with performance M4), write each shot's camera block separately according to its mode. Don't blend specs into one averaged grade. The cut between modes is the visual punch — collapsing them kills the contrast.

For multi-shot sequences in the same mode, compose one continuous prompt with hard-cut triggers in the Dynamic Description and a single shared camera block at the end.

---

## LENS LENGTH GUIDE

- **32 / 35 / 40mm:** Wide establishing, full-body, group framing, environmental context
- **50 / 55mm:** Medium portrait, two-shot, waist-up, dialogue framing
- **75mm:** Tight editorial portrait, single-character isolation, performance close-up
- **85 / 100mm:** Extreme close-up — eyes, lips, jewelry, fabric texture, surface detail

Default to 55mm (M1/M3/M4) or 50mm (M2) for medium framing. M5 typically uses 35→55mm.

---

## OPTIONAL HANDOFF — BANANA PRO DIRECTOR

If the user mentions a Banana Pro plate for the environment or wants camera grammar to match an existing plate, ask which cinema mode the plate used and lock the matching camera grammar in the Seedance prompt. The two skills share the same five-mode framework — when paired, the still and the video share visual DNA.

Otherwise, do not bring this up. Cinema-worldbuilder operates standalone unless the user invokes the pairing.
