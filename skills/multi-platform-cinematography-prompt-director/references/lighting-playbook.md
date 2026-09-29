# Lighting Playbook

**Order of operations:** in-world source → quality (hard/soft) → direction → ratio → color temperature → fixture + modifier + placement that fakes it → atmosphere that reveals it.

Never write "dramatic lighting." Write the rig.

---

## 1. Contrast ratios (key : fill)

| Ratio | Feel | Use |
|---|---|---|
| **1:1 – 2:1** | Flat, bright, clean | Beauty, e-commerce, comedy, lifestyle |
| **3:1 – 4:1** | Dimensional, natural drama | Default narrative, prestige commercial |
| **8:1** | Moody, sculpted | Thriller, luxury, noir-lite |
| **16:1+** | Chiaroscuro, faces falling into black | Noir, horror, Fincher/Deakins night |

Prompt wording: "4:1 key-to-fill ratio, shadow side of the face falls two stops under."

---

## 2. Color temperature (CCT) map

| Source | Kelvin | Prompt color |
|---|---|---|
| Candle / fire | 1800–1900K | deep amber |
| Sodium-vapor streetlight | ~2000K | orange-sodium, monochrome-ish |
| Tungsten practical / household | 2700–3200K | warm amber |
| Golden hour sun | 3200–4000K | honey gold, low raking |
| Fluorescent office | 4000–4500K + green spike | sickly green-cyan cast |
| Daylight / HMI | 5600K | neutral white |
| Overcast | 6500–7500K | cool soft |
| Blue hour / shade / moonlight fake | 7500–10000K | steel blue |
| Neon | n/a (saturated) | magenta / cyan / red tubes |

**CCT split** is the most cinematic single lighting choice: a warm key against a cool ambient (or the reverse). Write both numbers: "3200K tungsten key against 7000K blue-hour window ambience."

---

## 3. Portrait lighting patterns

| Pattern | Setup | Reads as |
|---|---|---|
| **Rembrandt** | Key 45° side, 45° up; a triangle of light on the shadow cheek | Classic drama, painterly |
| **Loop** | Key 30° side, slightly high; a small nose shadow loop | Flattering default |
| **Butterfly / Paramount** | Key directly above the lens, shadow under the nose | Glamour, beauty, Old Hollywood |
| **Clamshell** | Key above + fill/reflector below, both near the lens axis | Beauty, cosmetics, flawless skin |
| **Split** | Key 90° side; half the face dark | Duality, villain, conflict |
| **Broad** | Key on the side of the face toward the camera | Widens, open, friendly |
| **Short** | Key on the side of the face away from the camera | Slims, sculpted, moody (the cinematic default) |
| **Rim / edge / kicker** | Backlight at 135–160° from the lens | Separation, halo, hero |
| **Top light** | Directly overhead | Interrogation, *Godfather*, eyes in shadow |
| **Under light** | From below | Horror, campfire, unnatural |
| **Book light** | Fixture → bounce → diffusion frame (double soft) | Ultra-soft wrap, prestige close-ups |
| **Single-source / motivated** | One big soft source from the window side, negative fill opposite | Deakins naturalism |
| **Silhouette** | Bright BG, subject unlit | Mystery, graphic, iconic |

---

## 4. Fixture + modifier + placement recipes

Each recipe is prompt-ready. Swap the fixture for similar gear if the brand matters.

### Soft window key (naturalism, Deakins)
> ARRI SkyPanel S360-C through a 12×12 frame of full grid cloth outside the window, camera left 60°, 3m high, 5600K. Black negative fill (floppy flags) camera right, 4:1 ratio, faint 1/4 CTO practical lamp in the background.

### Hard sun through blinds (noir)
> ARRI M18 HMI through venetian blinds, 30° high, camera right, hard-edged slatted shadows across his face and the wall. Haze at 20% to reveal the beams. 16:1 ratio, no fill.

### Beauty clamshell (cosmetics)
> Profoto B10 Plus in a 3ft octabox directly above the lens tilted 45° down, silver reflector below the chin, two stripboxes as symmetrical rim lights at 150°, seamless white cyc, 2:1 ratio.

### Luxury product (dark, sculpted)
> Aputure LS 600c Pro through a 1×6 stripbox raking from behind at 160° to trace the bottle's edge, Aputure MC Pro kicker for the label, black acrylic surface for reflection, black flags cutting spill, everything else falls to black, 8:1.

### Neon night street (Wong Kar-wai / cyberpunk)
> Practical magenta and cyan neon tubes camera left and right as motivated sources, Astera Titan Tubes augmenting at 2m, wet asphalt reflecting color, Aputure Nova P600c at 10% as a cool fill, practical sodium streetlight at 2000K deep background, haze 30%.

### Golden hour backlight (Malick / Chloé Zhao)
> Real sun 8° above the horizon directly behind the subject for rim and flare. 12×12 Ultrabounce camera front-left lifting the face to 1.5 stops under the rim, lens flare allowed, warm 3500K overall.

### Concert / music performance
> Moving-head beam fixtures (Robe MegaPointe) cutting through heavy haze from the truss behind the artist, strobes on the snare hits, a warm Fresnel follow-spot from the FOH at 20° high, crowd silhouettes in the foreground, deep saturated magenta and amber.

### Interrogation / thriller top light
> Single bare 1K tungsten Fresnel overhead in a green-painted metal shade, eyes in shadow, pool of light on the table, walls fall to black, 3200K, 16:1.

### Firelight / candle (Eggers / period)
> Real candle practicals as the only visible sources, augmented by Quasar Rainbow tubes at 1900K flickering on a DMX flame effect, 30cm off camera, heavy falloff, faces warm, background black.

### Sports hero (Nike)
> Twin Creamsource Vortex24 as hard crossed rim lights from 135° left and right, a Godox KNOWLED P600R hard key from camera front-left 30°, sweat highlights, dark arena background, haze 15%, 8:1.

### Fluorescent liminal (Fincher / liminal space)
> Overhead 4ft fluorescent troffers as practicals, green-cyan 4300K cast, one flickering tube, flat top light, no fill, sterile.

### Moonlight exterior
> Condor-mounted ARRI SkyPanel X23 at 40m through a 20×20 half-grid, 7500K blue, backlight at 150° for rim, practical warm window in the far background for the CCT split, 8:1.

---

## 5. Time-of-day grammar

| Time | Light behavior to write |
|---|---|
| **Pre-dawn** | Cool shadowless ambient, 9000K, a deep blue sky gradient, faint practicals |
| **Golden hour** | Low raking warm sun, long shadows, rim + flare, 3500K |
| **Midday** | Hard top sun, short shadows under the eyes (use a 20×20 silk overhead to fix) |
| **Overcast** | Giant softbox sky, low contrast, saturated greens |
| **Blue hour** | Sky and practicals balanced, a cool/warm split, 10–20 minutes of magic |
| **Night urban** | Mixed practicals: sodium, LED, neon, screens, headlights |
| **Night rural** | Moonlight fake + a single warm practical |

---

## 6. Atmosphere (always source-bound)

| Effect | Write it as |
|---|---|
| **Haze** | "light haze from a hazer, 20% density, backlight beams visible" |
| **Volumetric shafts** | "sun shafts through the high warehouse windows cutting the dust" |
| **Rain** | "rain towers backlit at 150° so each drop reads; puddles reflecting neon" |
| **Steam** | "steam rising from the manhole grate, backlit amber" |
| **Dust** | "dust motes drifting in the window beam" |
| **Smoke** | "cigarette smoke curling into the key light" |
| **Fog** | "low ground fog 50cm deep, drifting left to right" |
| **Snow** | "fine snow falling straight down, no wind" |
| **Heat shimmer** | "heat shimmer rising off the asphalt, 400mm compression" |

**Rule:** particles are only visible when **backlit** or side-lit. If you write haze, write a backlight.

---

## 7. Light movement in video

Motivated light changes are free production value in AI video:
- "Car headlights sweep across her face from right to left at 3s."
- "Neon sign flickers twice, then holds."
- "A cloud passes and the sun key drops two stops, then returns."
- "A lightning strike at 4.2s floods the room blue-white for three frames."
- "The police lights pulse red-blue across the wall at 1Hz."

State the timing and the direction. That's what makes the model render a *change*, not a static look.
