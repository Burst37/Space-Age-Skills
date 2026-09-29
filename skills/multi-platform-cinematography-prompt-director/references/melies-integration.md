# Melies Integration — Live Technique Reference

[Melies](https://melies.co/cinematic-techniques) is a visual library of 400+ cinematic techniques in 13 categories. Each technique page carries film stills, a narrative-function note, a side-by-side against similar techniques, a failure-mode list, and an AI prompt.

**Role in this skill:** Melies does two jobs. (1) It **widens the palette**: the Technique Scout surfaces rarely used moves and effects (dolly zoom in/out, crane-over-the-head, lazy Susan, through-object transitions) as a Bold option on key shots. (2) It is the **live second opinion**: it checks, shows, and troubleshoots each chosen technique. The decision engine still makes the call.

**Rules**
- Fetch **one technique page at a time, at runtime** (the `defuddle` skill, or WebFetch). Cap it at ~1 page per shot, plus the look board.
- **Never bulk-scrape, and never paste Melies text or prompts into deliverables or into this skill.** Read, then write in our own words (copyright and ToS).
- If a fetch fails or a slug 404s, fall back to `shot-grammar.md` and `decision-engine.md`. Never block the job on Melies.

---

## URL map

Page pattern: `https://melies.co/cinematic-techniques/<category>/<technique-slug>`. The slug is the technique name in kebab-case (`dolly-zoom`, `slow-zoom-in`, `three-point-lighting`, `teal-orange`).

| DP Sheet field | Melies category slug | Example pages |
|---|---|---|
| movement | `camera-movement` | `dolly-zoom`, `slow-zoom-in`, `dolly-in` |
| shot size | `framing` | `extreme-close-up`, `establishing-shot` |
| angle + height | `camera-angles` | `eye-level`, `high-angle` |
| lighting pattern | `lighting` | `three-point-lighting`, `key-light` |
| composition | `composition` | `rule-of-thirds`, `golden-ratio` |
| lens / focal length | `lenses` | `ultra-wide-14mm`, `50mm-normal` |
| grade / stock / palette | `color` | `teal-orange`, `bleach-bypass` |
| frame rate / speed | `time-and-motion` | `slow-motion`, `fast-motion` |
| flare, bokeh, in-camera FX | `effects` | `lens-flare`, `bokeh` |
| transitions / cuts | `editing` | `match-cut`, `dissolve` |
| weather / air | `atmosphere` | `rain`, `fog` |
| genre look | `genre-looks` | `film-noir`, `neo-noir` |
| social trend look | `viral-looks` | `agamemnon`, `ink-riot` (names rotate; always list live) |

**Slug miss:** fetch the category index (`/cinematic-techniques/<category>`) and pick the closest match by name.

---

## Hook 0 — Technique Scout: expanding the palette (Gate 2)

Melies' biggest value is **range**. A default DP vocabulary is push-in, orbit, crane, and handheld. Melies catalogs 86 camera moves plus 57 in-camera effects and 21 time-and-motion techniques, many of them rarely used in AI prompting. Those are exactly the choices that make a frame feel directed rather than generated.

**Rule:** for every shot whose job is **REVEAL, TENSION, ACTION, PRODUCT-HERO, TRANSITION, or PAYOFF**, present two options:

```
S03 · REVEAL
  Standard — Crane up, eye level → 8m, revealing the crowd
  Bold     — Crane Over The Head: the camera rises over the artist's head and tilts down into the crowd beyond
             https://melies.co/cinematic-techniques/camera-movement/crane-over-the-head
```

The user picks (or says "go bold" / "go standard" for the whole piece). The chosen Bold pick then runs through the Hook 2 technique check before it is compiled.

### Rare-technique palette by shot job

Slugs are live under `https://melies.co/cinematic-techniques/<category>/<slug>`. The one-liners are this skill's own guidance.

**REVEAL**
| Technique | Slug (category) | Reach for it when |
|---|---|---|
| Crane Over | `crane-over` (camera-movement) | An obstacle hides the world; the camera rises over it |
| Through Object In | `through-object-in` (camera-movement) | Entering a new space through a window, keyhole, or crowd gap |
| Aerial Pullback | `aerial-pullback` (camera-movement) | Ending on isolation or scale; a person becomes a speck |
| Super Dolly Out | `super-dolly-out` (camera-movement) | A long, relentless pull that keeps revealing more context |
| Parallax | `parallax` (camera-movement) | Depth layers slide against each other to unveil the subject |
| Earth Zoom | `earth-zoom` (camera-movement) | Face → city → planet (or the reverse) in one continuous move |

**TENSION / DREAD / REALIZATION**
| Technique | Slug | Reach for it when |
|---|---|---|
| Dolly Zoom In / Dolly Zoom Out | `dolly-zoom-in`, `dolly-zoom-out` (camera-movement) | The world warps around a fixed face. **The direction matters**: when the camera moves toward the subject while zooming out, the background *stretches away* (vertigo, a sinking realization); when it moves back while zooming in, the background *crowds in* (dread closing in). Check the Melies page for how its naming maps to the direction before compiling. |
| YoYo Zoom | `yoyo-zoom` (camera-movement) | Repeated in-out zoom pulses (panic, intoxication, beat-synced unease) |
| Dutch Roll | `dutch-roll` (camera-movement) | The horizon rotates during the shot; the world tips off its axis |
| SnorriCam | `snorricam` (camera-movement) | Body-locked face, world swinging (disorientation, drugs, panic) |
| Head Tracking | `head-tracking` (camera-movement) | The camera glued to a head in motion (subjective pursuit) |
| Locked-On | `locked-on` (camera-movement) | The subject stays pinned in frame while everything else moves |

**ACTION / ENERGY**
| Technique | Slug | Reach for it when |
|---|---|---|
| Crash Zoom In / Out | `crash-zoom-in`, `crash-zoom-out` (camera-movement) | Punch-accent on a reaction or impact; 70s kung-fu / Tarantino energy |
| Whip Tilt | `whip-tilt` (camera-movement) | A vertical whip (drop, jump, a look up) |
| Rapid Zoom In / Out | `rapid-zoom-in`, `rapid-zoom-out` (camera-movement) | Faster than a slow zoom, smoother than a crash |
| Car Grip / Road Rush / Car Chasing | `car-grip`, `road-rush`, `car-chasing` (camera-movement) | Vehicle rigs: hard-mounted intimacy, low-speed-blur rush, pursuit |
| Falling | `falling` (camera-movement) | The camera drops with, or as, the subject |
| FPV Drone | `fpv-drone` (camera-movement) | An impossible flight path through a space |

**PRODUCT-HERO**
| Technique | Slug | Reach for it when |
|---|---|---|
| Lazy Susan | `lazy-susan` (camera-movement) | A turntable product spin with the camera locked (the classic packshot) |
| Bolt Cam / Robo Arm | `bolt-cam`, `robo-arm` (camera-movement) | High-speed motion-control whips and precise repeatable moves |
| 3D Rotation | `3d-rotation` (camera-movement) | The camera orbits on multiple axes around a floating product |
| Super Dolly In | `super-dolly-in` (camera-movement) | A long push from context all the way to macro label detail |
| Conveyor | `conveyor` (camera-movement) | Products gliding past a fixed camera (a line or assembly feel) |
| Focal Shift / Cinemagraph | `focal-shift`, `cinemagraph` (effects) | A focus transfer to the product; one living element in a still frame |

**INTIMACY**
| Technique | Slug | Reach for it when |
|---|---|---|
| Eyes In / Mouth In | `eyes-in`, `mouth-in` (camera-movement) | A push into the eyes or mouth (thought, confession, singing) |
| Double Dolly | `double-dolly` (camera-movement) | Subject and camera on dollies together (Spike Lee floating walk) |
| Low Shutter | `low-shutter` (time-and-motion) | Smeared, dreamy motion in a close moment (Wong Kar-wai) |

**TRANSITION**
| Technique | Slug | Reach for it when |
|---|---|---|
| Flying Cam Transition | `flying-cam-transition` (camera-movement) | Fly continuously from scene A to scene B |
| Through Object Out | `through-object-out` (camera-movement) | Exit a scene through an object into the next |
| Match Morph / Object Portal | `match-morph`, `object-portal` (effects) | Shape-matched morph, or an object that opens into the next world |
| Ratio Switch | `ratio-switch` (effects) | The aspect ratio changes on the emotional turn (e.g., 4:3 → 2.39:1) |

**PAYOFF / SCALE**
| Technique | Slug | Reach for it when |
|---|---|---|
| Crane Over The Head | `crane-over-the-head` (camera-movement) | Rise over the hero, tilt down into what they face |
| Hero Cam | `hero-cam` (camera-movement) | Low, rising, slow push on the triumphant subject |
| 360-Degree Orbit | `orbit-360` (camera-movement) | A full circle at the peak moment (split into two 180° generations for AI stability) |
| Bullet Time / Frozen in Motion | `bullet-time`, `frozen-in-motion` (time-and-motion) | Time stops at the apex while the camera keeps moving |

**STYLIZED / SURREAL** (use sparingly, and test on a draft tier first: AI models render these less consistently)
`slit-scan` · `double-exposure` · `echo-print` · `wigglegram` · `zoetrope` · `diorama` · `scale-shift` · `levitation` · `kaleidoscope` · `datamosh` (effects) · `step-printing` · `stutter` · `moonwalk` · `boomerang` · `infinite-loop` (time-and-motion)

**SOCIAL / VIRAL** — list `viral-looks` live every time (e.g., at time of writing: Agamemnon, Ink Riot, Fallen Angel, 2000s Paparazzi, Orbital Presence, Broken Mirror). The names rotate.

### Feasibility gate for Bold picks
- **One Bold pick per shot.** Never stack two rare techniques in one generation.
- Compound optical moves (dolly zoom, yoyo zoom, 3D rotation) are the hardest for video models. Prefer **Seedance 2.5 or Veo 3.1**, keep the shot to ≤6s, and state the start state, the end state, and what stays fixed ("his face stays the same size in frame the whole time").
- If a Bold pick fails twice in generation, fall back to the Standard pick and note it in `generation_notes`.

---

## Hook 1 — Look board (Gate 1, before any generation)

After writing the logline, visual thesis, and look anchor, give the user **2–4 Melies links** that show the look:

```
Look board — approve before we spend credits:
- Genre:     https://melies.co/cinematic-techniques/genre-looks/neo-noir
- Palette:   https://melies.co/cinematic-techniques/color/teal-orange
- Signature: https://melies.co/cinematic-techniques/camera-movement/dolly-zoom
```

The film stills align taste in seconds, which is far cheaper than a wrong generation. Skip this when the user already supplied visual references or said "just go".

## Hook 2 — Technique check (Gate 3, per shot)

For each shot's **primary technique** (the one move, the key lighting setup, or the defining lens), fetch its page and read four sections:

| Melies section | What we do with it |
|---|---|
| **Narrative Function** | Check it against the shot's `job`. If the function contradicts the job (e.g., a dolly zoom = dread, on a shot whose job is INTIMACY), change the technique and record why in `rationale`. |
| **Compared with Similar Shots** | Pick the precise sibling. Dolly in (the camera travels, perspective shifts) vs. slow zoom in (the lens changes, perspective flat) vs. dolly zoom (both, opposed). Name the chosen one exactly in the prompt. |
| **What Usually Goes Wrong** | Convert **every listed failure** into a prompt lock, a physics sentence, or a negative line (where the platform supports negatives). This is the highest-value section. |
| **Prompt It** | **Calibration only.** Compare it to our compiled prompt, and adopt any concrete physical cue we're missing (speed, distance, endpoint, what stays fixed) in our own words. Never paste it. |

## Hook 3 — Viral looks (social deliverables)

For 9:16 / TikTok / Reels briefs, list `/cinematic-techniques/viral-looks` live and shortlist 2–3 current named looks that fit the brand. Trend names turn over faster than this skill is updated, so never hardcode them.

## Output field

Add the reference to each shot in the Director's Package:

```yaml
    melies_ref: "https://melies.co/cinematic-techniques/camera-movement/dolly-in"
    melies_fixes: [ "keep the subject's size constant while the background changes — stated", "stop point named — stated" ]
```

`melies_fixes` lists the failure modes from "What Usually Goes Wrong" that were folded into the prompt (paraphrased).

---

## Melies as a generator (optional)

Melies also offers its own generator (each technique page has a "create this effect" CTA). It is **not** in this skill's routing table: the user's production defaults stay Seedance 2.5 / Veo 3.1 / MiniMax H3. Use Melies generation only if the user asks for it, and compile with the target model's protocol from `platform-protocols.md` if Melies exposes which model it runs.
