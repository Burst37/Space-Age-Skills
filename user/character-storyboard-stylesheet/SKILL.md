---
name: character-storyboard-stylesheet
description: >
  Consistent-character multi-shot storyboard architect optimized for Seedance 2.0. Use IMMEDIATELY
  when users want to plan, structure, or generate a multi-shot action or cinematic sequence with a
  recurring character. TRIGGER PHRASES: "create a storyboard", "make a shot breakdown",
  "generate a storyboard stylesheet", "build a fight scene storyboard", "plan a cinematic sequence",
  "create a character action sequence", "make a tactical sequence", "storyboard this scene",
  "plan shots for my video", "create a shot list", "generate a scene breakdown",
  "make an anime action storyboard", "create a consistent character sequence",
  "design a multi-shot video plan", "build a seedance storyboard", "plan a 15-second sequence",
  "create shot prompts for my character", "make a storyboard sheet",
  "generate scene-by-scene prompts", "plan a tactical action sequence",
  "create a video storyboard with prompts". Outputs a complete storyboard stylesheet table with
  per-shot Visual/Action, Camera Movement, Motion & Physics, and Seedance 2.0 Prompt columns,
  plus optimization notes, recommended settings, audio suggestions, and editing guidance.
version: 1.0
updated: 2026-05-18
---

# CHARACTER STORYBOARD STYLESHEET SKILL
## Seedance 2.0 — Consistent Character Multi-Shot Architect

This skill transforms a simple scene idea or character concept into a complete, production-ready storyboard stylesheet — the same format as a professional anime tactical action breakdown, ready to feed into Seedance 2.0 shot by shot.

---

## USAGE WORKFLOW

### Step 1: Intake
Collect from the user (ask if not provided):
- **Character description** — appearance, outfit, style (or @image1 reference)
- **Scene concept** — what happens: fight, chase, reveal, emotional, etc.
- **Genre / Aesthetic** — Anime, Live Action Cinematic, Cyberpunk, Western, etc.
- **Duration** — default 15 seconds; user may specify 6s / 10s / 15s / 30s
- **Setting / Environment** — location, time of day, weather, atmosphere
- **Target platform** — default Seedance 2.0; note if another platform needed

### Step 2: Shot Architecture
Divide the total duration into 4-6 shots based on narrative beats:
- Opening / Establishing beat
- Rising tension or approach
- Impact / Confrontation
- Escalation or Flow
- Resolution / Aftermath

### Step 3: Per-Shot Fill
For every shot, populate all five columns:
1. Shot number, name & time range
2. Visual / Action description
3. Camera Movement
4. Motion & Physics
5. Seedance 2.0 Prompt

### Step 4: Optimization Footer
Generate the four footer sections:
- Seedance 2.0 Optimization Notes (Camera / Motion / Physics / Environment)
- Recommended Seedance 2.0 Settings
- Audio Suggestions
- Editing Suggestions

### Step 5: Output
Deliver the complete storyboard in Markdown table format, ready to copy into a production doc or paste directly into Seedance.

---

## SECTION 1: GENRE PRESETS

Apply the matching preset as a baseline; user can override any field.

### 1.1 Anime Tactical Action (Default)
```
Style markers: Grounded anime realism, fluid choreography, cinematic pacing
Physics: Cloth simulation, reactive hair, water/dust interaction
Camera: Rotational tracking, orbiting, backward tracking, speed ramps
Lighting: Natural daylight OR moody industrial, atmospheric haze
Environment: Urban, industrial dockyard, rooftop, warehouse, rain-wet streets
Seedance flags: ultra fluid movement, immersive cinematic pacing, environmental depth
```

### 1.2 Live Action Cinematic Thriller
```
Style markers: Photorealistic, gritty, high-contrast shadows
Physics: Real-weight body mechanics, practical FX (dust, sparks, debris)
Camera: Steadicam, handheld hybrid, Dutch angle, extreme close-ups
Lighting: Harsh practical sources, rim light separation, volumetric haze
Environment: Parking structure, alley, office interior, rain-soaked exterior
Seedance flags: cinematic realism, grounded body momentum, natural skin texture
```

### 1.3 Cyberpunk Noir
```
Style markers: Neon-lit rain, holographic overlays, neon_practical_accent
Physics: Reactive neon reflections on wet surfaces, steam, particle debris
Camera: Low-angle push-in, drone orbit, glitch cut transitions
Lighting: Cyan/magenta neon split, volumetric shaft haze, silhouette rimlight
Environment: Neon alley, megacity market, server room, rain at night
Seedance flags: neon realism, stylized anime action, immersive cyberpunk atmosphere
```

### 1.4 Historical / Period Action
```
Style markers: Desaturated warm tones, aged grain, classical composition
Physics: Practical cloth + armor, dust clouds, period-accurate weapon momentum
Camera: Long lens compression, crane reveal, slow-motion at impact
Lighting: Golden hour backlight, candlelight interiors, overcast battle light
Environment: Castle courtyard, battlefield, tavern, forest path
Seedance flags: cinematic period realism, classical choreography, atmospheric depth
```

### 1.5 Supernatural / Fantasy
```
Style markers: Otherworldly particle FX, ethereal glows, impossible physics
Physics: Gravity defiance, energy ripple, elemental reactions (fire/water/wind)
Camera: Impossible camera path, wide fisheye to tight telephoto switch, aerial sweep
Lighting: Bioluminescent ambience, magical rim glow, color-shifted atmosphere
Environment: Ancient ruin, floating island, storm-lit cliffside, spirit realm
Seedance flags: fluid anime magic realism, dynamic elemental physics, cinematic fantasy pacing
```

---

## SECTION 2: SHOT ARCHITECTURE TEMPLATES

### 2.1 Standard 5-Shot / 15-Second (Default)

| Shot | Name | Time | Narrative Beat |
|------|------|------|----------------|
| 1 | Establish / Approach | 0s–3s | World + character introduction |
| 2 | Inciting Action | 3s–6s | First confrontation or trigger |
| 3 | Impact / Peak | 6s–9s | Core action climax |
| 4 | Flow / Escalation | 9s–13s | Extended action or consequence |
| 5 | Aftermath / Close | 13s–15s | Resolution, mood landing |

### 2.2 Compact 4-Shot / 10-Second

| Shot | Name | Time | Narrative Beat |
|------|------|------|----------------|
| 1 | Hook | 0s–2s | Immediate grab, character reveal |
| 2 | Action | 2s–5s | Primary motion sequence |
| 3 | Peak | 5s–8s | Impact or climax |
| 4 | End Frame | 8s–10s | Settling shot, held composition |

### 2.3 Extended 6-Shot / 30-Second

| Shot | Name | Time | Narrative Beat |
|------|------|------|----------------|
| 1 | Establish | 0s–5s | World and mood |
| 2 | Character Intro | 5s–10s | Subject revealed in motion |
| 3 | Rising Action | 10s–15s | Tension builds |
| 4 | Confrontation | 15s–20s | Peak conflict |
| 5 | Resolution Initiation | 20s–25s | Turning point |
| 6 | Aftermath | 25s–30s | Final emotional beat |

---

## SECTION 3: PER-SHOT COLUMN REFERENCE

### Column A: Visual / Action
Describe what the viewer sees — subject position, action, environment interaction, secondary characters.
- Keep to 2-4 bullet points per shot
- Lead with the hero action verb
- Include environmental reactions (puddles ripple, debris scatters, steam rises)
- Note any secondary characters and their position relative to hero

### Column B: Camera Movement
Specify the exact camera grammar for this shot.

| Movement | When to Use |
|----------|-------------|
| Long continuous backward tracking | Opening approach, builds dread/anticipation |
| Camera arcs around protagonist | Dodge/evade moment, dynamic energy |
| Tight orbiting camera around impact | Strike or collision, adds weight |
| Continuous over-the-shoulder tracking | Flow sequence, locks viewer to hero POV |
| Slow crane upward | Aftermath, epic scale reveal |
| Handheld shake / push-in | Intense confrontation, urgency |
| Speed ramp into collision | Impact emphasis — slow → fast → slow |
| Fast lateral tracking | Chase or dash, horizontal energy |
| Dutch angle static | Tension, psychological unease |
| Drone pull-back reveal | Environment scale, spatial context |

### Column C: Motion & Physics
List the physical behaviors that must be simulated for realism.

**Body Mechanics:**
- Slow confident walk / tactical stride
- Recoil animation (gunshot, impact)
- Jacket / coat rotates with momentum
- Hair responds to wind and movement speed
- Balance shift during dodge or impact

**Environmental Reactions:**
- Water ripples from footsteps
- Water droplets scatter on impact
- Dust and debris shake loose
- Steam drifts naturally
- Puddles continue rippling
- Shell casings bounce on wet ground

**Material Physics:**
- Container dents on impact
- Metal vibration at collision
- Cloth simulation — coat, jacket, fabric
- Coat settles naturally after motion

### Column D: Seedance 2.0 Prompt
Write a complete, quotation-delimited prompt string for direct input into Seedance 2.0.

**Prompt Formula:**
```
"[Style descriptor], [setting detail], [character description + action],
[camera movement], [physics/motion detail], [atmospheric detail],
[realism flags], [pacing descriptor]"
```

**Required Prompt Elements:**
- Style anchor: `Anime cinematic realism` / `Fluid anime combat scene` / etc.
- Environment anchor: setting + time + weather
- Character action: specific verb + physical description of motion
- Camera: named movement from Column B
- Physics flag: 1-2 specific physics behaviors
- Realism closer: `grounded anime realism` / `immersive cinematic pacing` / `environmental depth`

---

## SECTION 4: PROMPT BANK — READY-TO-USE SHOT PROMPTS

### Opening / Approach Shots
```
"Anime cinematic realism, daylight [setting] after rain, lone [character description] walking
toward camera through [environment], [surface detail], cinematic backward tracking shot,
natural sunlight reflections, smooth camera stabilization, realistic coat physics,
atmospheric haze, grounded anime realism, ultra fluid movement, environmental depth,
immersive cinematic pacing"
```

```
"[Style] establishing shot, [character] emerges from shadow into [light source],
steadicam slow push-in, cloth simulation active, atmospheric dust particles,
cinematic naturalism, grounded body mechanics, environmental depth"
```

### Combat Initiation / Dodge Shots
```
"Fluid anime combat scene in [setting], attacker swings [weapon] from side,
protagonist performs smooth tactical dodge and redirection, cinematic rotational camera movement,
grounded martial arts choreography, realistic body momentum, water droplets scattering,
reactive cloth simulation, fluid anime action realism, cinematic pacing, immersive environmental motion"
```

```
"[Style] action scene, [character] executes [specific move] in response to [threat],
camera arcs 180 degrees tracking the evasion, hair and coat react to speed change,
ground surface reacts on plant foot, fluid body mechanics, cinematic slow push-in at peak"
```

### Impact / Strike Shots
```
"Anime close quarters combat, tactical takedown against [surface/object], orbiting cinematic camera,
realistic impact physics, [material] vibration, water splash effects, cinematic slow motion,
dust & debris shake loose, hair & coat react to inertia, fluid anime choreography,
natural daylight, detailed environmental reactions, immersive action realism"
```

```
"[Style] impact moment, [character] drives [opponent/object] into [surface],
tight orbit camera around collision point, speed ramp slow-motion at contact,
physical debris scatter, material deformation on impact, grounded weight and force,
immersive action realism, cinematic choreography"
```

### Flow / Gun-Fu / Extended Combat
```
"Stylized anime tactical gun-fu action, seamless transition between martial arts and pistol combat,
cinematic over-the-shoulder tracking shot, dynamic lateral camera movement, realistic recoil animation,
shell casings bouncing on wet ground, fluid body mechanics, grounded combat realism,
sunlight reflecting on puddles, immersive cinematic anime action, smooth choreography flow"
```

```
"[Style] extended combat sequence, [character] flows between [move type] and [move type],
continuous tracking camera with lateral drift, rapid defensive reactions from [opponent(s)],
environmental interaction throughout, realistic physics stack, fluid pacing, no dead frames"
```

### Aftermath / Resolution Shots
```
"Anime cinematic ending shot, tactical assassin standing alone in [environment] after combat,
[lighting condition] reflections on [surface], slow crane camera movement, atmospheric [weather element],
coat drifts naturally, steam/breath visible, subtle breathing animation, dramatic cinematic composition,
grounded anime realism, immersive environmental detail, emotional ending frame"
```

```
"[Style] resolution shot, [character] stands [posture] as [environment reacts — dust settles /
rain continues / crowd disperses], camera pulls back slowly on crane or steadicam,
ambient environmental audio, subtle cloth settle, held dramatic composition, cinematic naturalism"
```

---

## SECTION 5: OPTIMIZATION FOOTER TEMPLATE

Always append this section below the storyboard table.

### 5.1 Seedance 2.0 Optimization Notes

**CAMERA**
- Continuous shots — avoid jump cuts within a single generation
- Smooth tracking — no sudden unmotivated camera movement
- Orbit & crane — use for impact and resolution shots
- Stable with slight drift — reinforces naturalism

**MOTION**
- Fluid choreography — every move flows into the next
- Grounded movement — weight and momentum always present
- Realistic momentum — no floaty or over-snappy animations
- Cinematic pacing — speed ramps at key impact moments

**PHYSICS**
- Cloth simulation — coat, jacket, fabric respond to motion
- Water splash — rain-soaked surfaces react to contact
- Collision realism — objects dent, shatter, or yield on contact
- Debris interaction — dust, shells, particles follow real trajectories

**ENVIRONMENT**
- Rich industrial / urban detail — background is alive, not static
- Reactive elements — puddles, steam, particles respond to action
- Atmospheric depth — haze, light shafts, weather layering
- Natural lighting — sun angle consistent across shots

### 5.2 Recommended Seedance 2.0 Settings

| Setting | Value |
|---------|-------|
| Duration | [X]s (match total storyboard length) |
| FPS | 24 |
| Physics Simulation | High |
| Motion Smoothness | High |
| Cinematic Intensity | High |
| Camera Stability | Medium-High |
| Prompt Guidance | Strong |
| Aspect Ratio | 16:9 (cinematic) / 9:16 (vertical social) |

### 5.3 Audio Suggestions

| Category | Description |
|----------|-------------|
| Heavy bass impacts | Hit punctuation at each strike moment |
| Metallic hit sounds | Metal-on-metal or weapon contact |
| Shell casing audio | Bouncing casings on wet ground |
| Wind ambience | Underlying environmental texture |
| Industrial ambience | Background machinery, hum, distant activity |
| Breath / exertion | Character breathing during intense moments |
| Rain layer | Consistent wet environment audio bed |

### 5.4 Editing Suggestions

| Principle | Application |
|-----------|-------------|
| Smooth transitions | Cut on motion — never on static frame |
| Motion blur emphasis | Increase blur at peak speed moments |
| Slow motion at impacts | Speed ramp: normal → 40% → normal |
| Maintain spatial continuity | Eyeline and geography consistent shot to shot |
| Avoid over-fast cuts | Minimum 2.5s per shot for readability |
| Color grade consistency | Match grade across all shots in post |
| Sound design sync | Audio hit = frame of visual impact |

---

## SECTION 6: FULL OUTPUT TEMPLATE

When the user provides scene details, output the complete storyboard in this format:

```markdown
# [DURATION]-SECOND [GENRE] STORYBOARD — SEEDANCE 2.0 OPTIMIZED
**[TIME OF DAY] | [SETTING] | [SCENE TYPE]**

| SHOT | TIME | VISUAL / ACTION | CAMERA MOVEMENT | MOTION & PHYSICS | SEEDANCE 2.0 PROMPT |
|------|------|-----------------|-----------------|------------------|---------------------|
| **1** <br> "[SHOT NAME]" | [Xs]–[Xs] | • [Action bullet 1] <br> • [Action bullet 2] <br> • [Action bullet 3] | [Camera movement description] | • [Physics 1] <br> • [Physics 2] <br> • [Physics 3] | "[Full Seedance prompt string]" |
| **2** <br> "[SHOT NAME]" | [Xs]–[Xs] | • [Action bullet 1] <br> • [Action bullet 2] <br> • [Action bullet 3] | [Camera movement description] | • [Physics 1] <br> • [Physics 2] <br> • [Physics 3] | "[Full Seedance prompt string]" |
| **3** <br> "[SHOT NAME]" | [Xs]–[Xs] | • [Action bullet 1] <br> • [Action bullet 2] <br> • [Action bullet 3] | [Camera movement description] | • [Physics 1] <br> • [Physics 2] <br> • [Physics 3] | "[Full Seedance prompt string]" |
| **4** <br> "[SHOT NAME]" | [Xs]–[Xs] | • [Action bullet 1] <br> • [Action bullet 2] <br> • [Action bullet 3] | [Camera movement description] | • [Physics 1] <br> • [Physics 2] <br> • [Physics 3] | "[Full Seedance prompt string]" |
| **5** <br> "[SHOT NAME]" | [Xs]–[Xs] | • [Action bullet 1] <br> • [Action bullet 2] <br> • [Action bullet 3] | [Camera movement description] | • [Physics 1] <br> • [Physics 2] <br> • [Physics 3] | "[Full Seedance prompt string]" |

---

## SEEDANCE 2.0 OPTIMIZATION NOTES
[Camera / Motion / Physics / Environment bullets from Section 5.1]

## RECOMMENDED SEEDANCE 2.0 SETTINGS
[Settings table from Section 5.2]

## AUDIO SUGGESTIONS
[Audio table from Section 5.3]

## EDITING SUGGESTIONS
[Editing table from Section 5.4]
```

---

## SECTION 7: CHARACTER CONSISTENCY RULES

Apply these rules across all shots in the storyboard to lock character identity:

### 7.1 Appearance Lock
Define once at intake, reference in every shot prompt:
- Hair color, length, style
- Outfit: specific colors, materials, cut
- Distinguishing features: accessories, weapons, marks
- Build and height descriptor (tall/lean, compact/athletic, etc.)

### 7.2 Prompt Consistency Anchor
Every shot prompt must open with the same character anchor phrase:
```
"[Genre style] — [Character descriptor: e.g., 'lone tactical assassin in black long coat and dark hair'],
[setting fragment],
[shot-specific action]..."
```

### 7.3 Reference Tag
If the user provides a reference image, append `@image1` to every shot prompt:
```
"@image1 — Anime cinematic realism, daylight industrial dockyard..."
```

### 7.4 Style Consistency
All shots must share:
- Same base genre style descriptor
- Same lighting time-of-day (unless narrative shift requires change)
- Same physics quality flags: `grounded anime realism` / `cinematic naturalism` / etc.
- Same pacing closer: `immersive cinematic pacing` / `smooth choreography flow` / etc.

---

## SECTION 8: WORKED EXAMPLE — ANIME TACTICAL (REFERENCE)

This is the canonical reference output format, modeled on the Seedance 2.0 optimized storyboard:

| SHOT | TIME | VISUAL / ACTION | CAMERA MOVEMENT | MOTION & PHYSICS | SEEDANCE 2.0 PROMPT |
|------|------|-----------------|-----------------|------------------|---------------------|
| **1** "SILENT WALK" | 0s–3s | • Lone assassin walks toward camera through shipping container yard <br> • Coat and hair respond to wind <br> • Water ripples from footsteps <br> • Enemies visible in background | Long continuous backward tracking shot. Slight low angle. Smooth stabilization | • Slow confident walk <br> • Coat & hair respond to wind <br> • Water ripples from footsteps <br> • Enemies appear in background | "Anime cinematic realism, daylight industrial dockyard after rain, lone tactical assassin walking toward camera through shipping container yard, wet reflective asphalt, puddles rippling under footsteps, cinematic backward tracking shot, natural sunlight reflections, smooth camera stabilization, realistic coat physics, atmospheric haze, grounded anime realism, ultra fluid movement, environmental depth, immersive cinematic pacing" |
| **2** "AMBUSH DODGE" | 3s–6s | • Attacker swings metal pipe from side <br> • Protagonist performs smooth tactical dodge and redirection <br> • Water droplets scatter <br> • Enemy balance shifts naturally | Camera arcs around protagonist during dodge. Smooth rotational tracking. Dynamic close framing | • Pipe swing motion blur <br> • Jacket rotates with momentum <br> • Water droplets scatter <br> • Enemy balance shifts naturally | "Fluid anime combat scene in daylight container yard, attacker swings metal pipe from side, protagonist performs smooth tactical dodge and redirection, cinematic rotational camera movement, grounded martial arts choreography, realistic body momentum, water droplets scattering, reactive cloth simulation, fluid anime action realism, cinematic pacing, immersive environmental motion" |
| **3** "CONTAINER IMPACT" | 6s–9s | • Close quarters combat <br> • Tactical takedown against shipping container wall <br> • Dust & debris shake loose <br> • Hair & coat react to inertia | Tight orbiting camera around impact. Speed ramp into collision. Brief slow motion | • Container dents slightly <br> • Water sprays outward <br> • Dust & debris shake loose <br> • Hair & coat react to inertia | "Anime close quarters combat, tactical takedown against shipping container wall, orbiting cinematic camera, realistic impact physics, metal container vibration, water splash effects, cinematic slow motion at collision, dust & debris shake loose, fluid anime choreography, natural daylight, detailed environmental reactions, immersive action realism" |
| **4** "GUN-FU FLOW" | 9s–13s | • Seamless transition between martial arts and pistol combat <br> • Shell casings bounce on wet ground <br> • Enemies react realistically <br> • Sliding on wet pavement | Continuous over-the-shoulder movement. Fast lateral tracking. Dynamic push-in | • Tactical recoil animation <br> • Shell casings bounce naturally <br> • Enemies react realistically <br> • Sliding on wet pavement | "Stylized anime tactical gun-fu action, seamless transition between martial arts and pistol combat, cinematic over-the-shoulder tracking shot, dynamic lateral camera movement, realistic recoil animation, shell casings bouncing on wet ground, fluid body mechanics, grounded combat realism, sunlight reflecting on puddles, immersive cinematic anime action, smooth choreography flow" |
| **5** "AFTERMATH" | 13s–15s | • Tactical assassin stands alone in industrial dockyard after combat <br> • Puddles continue rippling <br> • Coat settles naturally <br> • Steam drifts | Slow crane upward. Expanding wide cinematic frame. Slow drifting | • Puddles continue rippling <br> • Coat settles naturally <br> • Steam drifts <br> • Subtle breathing animation | "Anime cinematic ending shot, tactical assassin standing alone in industrial dockyard after combat, daylight metallic reflections on wet pavement, slow crane camera movement, atmospheric steam drifting, subtle coat drifting, realistic coat and hair simulation, subtle breathing animation, dramatic cinematic composition, grounded anime realism, immersive environmental detail, emotional ending frame" |

---

## SECTION 9: QUICK INTAKE QUESTIONNAIRE

When triggered, ask these questions if not already provided in the user's message:

```
1. CHARACTER — Who is the subject? (Description or paste @image1 reference)
2. SCENE TYPE — What happens? (Fight, chase, infiltration, emotional reveal, etc.)
3. GENRE — Anime / Live Action / Cyberpunk / Fantasy / Historical / Other?
4. DURATION — 10s / 15s / 30s / custom?
5. SETTING — Where? (Location, time of day, weather)
6. REFERENCE STYLE — Any visual reference (image, film, show, game)?
```

If the user answers 3+, proceed immediately. Do not wait for all 6.

---

## SECTION 10: CROSS-SKILL CONNECTIONS

**For generating reference images before video:**
→ Use `seedance-prompt-engineer` to refine individual shot prompts further
→ Use `cinematic-video-architect` for start/end frame transitions between shots

**For character image generation:**
→ Use `ai-content-creator` / image generation tools for @image1 character sheets
→ Use Higgsfield operator for character consistency across shots

**For music video storyboards:**
→ Sync shot timing to BPM — 4 beats per shot at 120 BPM = ~2 seconds per shot
→ Coordinate with `music-video-editor` skill for edit rhythm

**For social media delivery:**
→ Flip aspect ratio to 9:16 in settings
→ Compress to 4-shot / 10-second version for Reels / TikTok
→ Use `social-media-designer` for matching thumbnail and graphic templates

---

## ERROR HANDLING

**User provides no character description:**
→ Proceed with generic placeholder: "tactical figure in dark long coat" — flag to user to replace with @image1

**User wants more than 6 shots:**
→ Split into two storyboard blocks (Part A / Part B) with a scene bridge note between them

**User specifies a non-Seedance platform:**
→ Swap Column D header to match platform name, adapt prompt style per `cinematic-video-architect` platform adapters

**User wants still-image storyboard frames (not video):**
→ Replace Seedance 2.0 Prompt column with image generation prompt (Midjourney / Firefly / SDXL format)
→ Keep all other columns identical

**Vague scene concept:**
→ Offer three genre starter templates: Tactical Action / Emotional Character Moment / Chase Sequence
→ Let user pick, then fill all columns automatically

---

*Version 1.0 — Space Age AI Solutions / Character Storyboard Stylesheet*
