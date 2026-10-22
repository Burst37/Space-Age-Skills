# Decision Engine — How a DP Chooses

Every section maps **intent → choice → prompt wording**. Read the intent column first and never pick gear because it sounds expensive. Pick it because it produces the pixel the story needs.

---

## 1. Camera body — choose by texture intent

**Default = House Package** (see SKILL.md Gate 3): A-cam **Blackmagic URSA Cine 17K 65** for wides, hero, product, and detail; B-cam **ARRI ALEXA LF** for faces, skin, and emotional coverage, both on one matched grade. Use the matrix below **only** to justify an override. Every override must name the texture the House Package can't deliver.

The body sets how the model renders skin, highlights, noise, and color density. Break the package only with a stated reason, such as a flashback on 16mm or UGC inserts on iPhone.

| Texture intent | Body (prompt name) | Sensor / format | What it pushes the model toward |
|---|---|---|---|
| **House A-cam** — maximum fidelity, 65mm scale | **Blackmagic URSA Cine 17K 65** | 65mm RGBW, 17K, BRAW Q0 | Pore-level detail, 65mm depth falloff even on wides, vast tonal range |
| **House B-cam** — skin, emotion, faces | **ARRI ALEXA LF** | LF, ARRIRAW | The ARRI skin standard, gentle highlight roll-off, filmic midtones |
| Prestige drama, perfect skin, soft highlight roll-off | **ARRI ALEXA 35 Xtreme** / **ALEXA 35** | Super 35, 17 stops, REVEAL color, up to 660fps (Xtreme) | Gentle roll-off, true skin, filmic midtones; the Xtreme adds ARRI-quality high-speed |
| Epic scale, landscape, "event film" | **ARRI ALEXA 265** / **ALEXA 65** · (Sony **VENICE 2 + RIALTO 65** 9.6K 65mm — in development, H1 2027) | 65mm | Shallow DoF even when wide, huge tonal depth, a "big screen" feel |
| Large-format portrait / fashion | **ARRI ALEXA Mini LF** | Full-frame LF | Intimate LF falloff, creamy separation |
| Crisp commercial, action, high-detail product | **RED V-RAPTOR [X] 8K VV** / **V-RAPTOR XL [X]** | VV, global shutter | Micro-contrast, clean fast motion without skew, punchy color |
| Night exteriors, low light, rich skin in darkness | **Sony VENICE 2 (8.6K)** | FF, dual ISO 800/3200 | Clean shadows, dense blacks, warm skin in low light |
| Run-and-gun cinematic, documentary luxury | **Sony BURANO** / **FX5** (2026: stacked 5K FF, internal 16-bit X-OCN, triple base ISO 800/4000/12800) | FF, built-in ND | Modern clean look, natural color, mobile energy |
| Maximum resolution, VFX plates, hyper-detail | **Blackmagic URSA Cine 17K 65** / **URSA Cine 12K** / **PYXIS 12K** | 65mm / FF RGBW | Pore-level detail, texture-rich surfaces |
| Canon warmth, flattering skin, doc-drama | **Canon EOS C400** / **C700 FF** / **EOS C50** | FF | Warm pleasing skin, soft color separation |
| Liquid, splash, hair whip, product slow-mo | **Phantom VEO 4K PL** / **Phantom Flex4K** | S35, up to 1000fps+ | Frozen droplets, ultra-smooth motion, time dilation |
| Integrated gimbal intimacy, dancer following | **DJI Ronin 4D 8K (Zenmuse X9)** | FF | Floating stabilized movement, close-proximity tracking |
| Grit, nostalgia, indie texture, flashback | **ARRIFLEX 416** 16mm film | Super 16 | Visible grain, halation, softer resolution, organic color |
| Classic 35mm feature | **Panavision Millennium XL2** 35mm film / **ARRICAM LT** | 35mm 4-perf | Film grain, halation, true film color response |
| Prestige large-format film, raw period texture | **VistaVision 8-perf 35mm** (Wilcam W-11 / Beaumont VistaVision) on Kodak Vision3 500T 5219 | 8-perf horizontal 35mm | *One Battle After Another* (Best Picture, 2026 ASC winner): huge negative, fine grain, a "raw" analog richness |
| Monumental, awe, full-height frame | **IMAX 15-perf 65mm film on Kodak AHU** (remjet-free stock, *Dune: Part Three*) / **IMAX-certified ALEXA 265** | 65mm/15-perf | Gigantic resolution, 1.43:1 height, absolute clarity |
| Medium-format still / editorial | **Phase One IQ4 150MP** / **Hasselblad X2D 100C** / **Fujifilm GFX ETERNA 55** | MF | Tonal smoothness, dimensional falloff, print-grade detail |
| UGC / creator authenticity | **iPhone 18 Pro Max, ProRes RAW + Apple Log 2** / `IMG_2985.HEIC` | Phone | Computational HDR, wide-lens distortion, real-world believability |
| Leica stills polish | **Leica M11 / SL3** `L1000XXX.DNG` | FF | Micro-contrast, creamy bokeh, classic rendering |

**Consistency rule:** the body token goes in every shot's prompt within a project. Changing it mid-sequence changes skin and grade across the edit, and audiences read that as a continuity error.

---

## 2. Lens — choose by psychology of focal length

Focal length decides **the audience's relationship to the subject**. It is the most important emotional choice in the frame.

| Focal (FF equiv.) | Psychology | Use for | Avoid for |
|---|---|---|---|
| **8–14mm** ultra-wide / fisheye | Distortion, disorientation, absurdity (Lanthimos) | Skate/sport POV, surreal comedy, music-video energy | Beauty close-ups (it distorts the face) |
| **18–24mm** wide | Space dominates the person; isolation or immersion | Establishing, walk-and-talks inside environments, Lubezki-style immersive handheld | Flattering portraits |
| **28–35mm** | Participatory: "we are in the room" | Documentary, handheld drama, ensemble, street | Product hero (too much perspective) |
| **40–50mm** | Honest, human-eye neutrality | Dialogue, naturalism, Ozu-like observation | Moments that need heightened emotion |
| **65–85mm** | Intimacy, attraction, flattering compression | Portraits, love scenes, beauty, emotional close-ups | Establishing (context is lost) |
| **100–135mm** | Voyeurism, observation, isolation | Stalker/paparazzi POV, sports, product detail with falloff | Handheld (it amplifies shake) |
| **200–600mm** tele | Compression, stacked planes, heat shimmer | Crowds stacked, sun-behind silhouettes, running at camera, wildlife | Intimacy (it reads as distant) |
| **Macro 60–100mm / Laowa 24mm Probe** | Microscopic wonder | Food, cosmetics, watch movements, insects, liquid | Anything needing context |

### Spherical vs. anamorphic

| Choose anamorphic when | Choose spherical when |
|---|---|
| The aspect is 2.39:1 scope, the scale is epic, and romance or sci-fi needs flare | Product precision, text legibility, packaging, e-commerce |
| You want oval bokeh, horizontal streak flares, and the feel of edge falloff | Vertical 9:16 social (anamorphic squeeze fights portrait framing) |
| Night city with practicals (the flare reads as "movie") | Macro, clinical beauty, medical, tech UI |

Anamorphic flavors: **Panavision Ultra Vista** (classic blue streak, distortion), **Cooke Anamorphic/i FF SF** (warm, special flare), **ARRI Signature Anamorphic** (clean, controlled), **Atlas Orion** (strong blue/amber flare, budget "indie epic"), **Atlas Mercury 1.5x** (modern, subtle), **Hawk V-Lite** (vintage character).

Spherical flavors: **ARRI Signature Prime** (clean modern LF), **Zeiss Supreme Prime** (sharp with smooth falloff), **ZEISS Aatma** (modern with vintage soul), **Cooke S8/i / S7/i** ("Cooke Look" warmth), **Leitz Thalia / Summilux-C** (gentle, luxurious), **Canon K35** (vintage 70s bloom), **Sigma Aizu T1.3** (sharp modern), **Nikkor Z 58mm f/0.95 Noct** (extreme bokeh).

### Aperture / depth of field

| Stop | Result | Story use |
|---|---|---|
| **T1.3–T2** | Razor plane, background melts | Isolation, intimacy, dream, subjective state |
| **T2.8–T4** | Face sharp, environment soft but readable | Default drama, commercial talent |
| **T5.6–T8** | Subject + near environment sharp | Two-shots, product with context |
| **T11–T22** / deep focus | Everything sharp (Welles, Cuarón) | Deep staging, architecture, ensemble blocking |

Always state **what is sharp and where the focus falls off**, e.g. "focus on the near eye, far ear already soft, background neon dissolved into oval bokeh."

**Rack focus** = transfer of attention. Name the start and end planes: "rack focus from the ring in foreground to her face at 3 meters."

---

## 3. Angle and height — the power relationship

| Angle / height | Reads as | Prompt wording |
|---|---|---|
| **Eye level** | Equality, empathy | "camera at eye level, 1.6m" |
| **Shoulder height** (standard) | Neutral cinematic | "camera at shoulder height" |
| **Low angle** (below eye, looking up) | Power, dominance, heroism | "low angle from hip height, looking up at her jawline" |
| **Worm's-eye / ground level** | Monumental, threatening, sneaker culture | "lens on the asphalt, looking up" |
| **High angle** | Vulnerability, smallness, surveillance | "high angle from 3m, looking down" |
| **Overhead / top-down / God's eye** | Fate, pattern, design, food flat-lay | "directly overhead, 90° down" |
| **Dutch / canted** | Instability, madness, tension | "15° dutch tilt to the right" |
| **OTS (over-the-shoulder)** | Conversation, POV anchoring | "over his left shoulder, his ear and jaw soft in the foreground" |
| **POV** | Subjective, immersive | "first-person POV, hands visible at the bottom of frame" |
| **Profile / 90°** | Observation, graphic silhouette | "clean profile, nose to the right third" |
| **3/4 front** | Default flattering portrait | "three-quarter front, key on the far side of the face (short lighting)" |

Height is a **number**. Write "camera 40cm off the ground", never just "low".

---

## 4. Movement — only when motivated

**A camera moves for one of four reasons:** it follows action, reveals information, shifts emotion, or creates rhythm. Without one of them, lock off.

| Move | Emotional function | Required wording (with endpoint) |
|---|---|---|
| **Locked-off / static** | Observation, control, deadpan (Fincher, Anderson) | "locked-off on sticks, no camera movement" |
| **Slow push-in (dolly in)** | Realization, intensifying emotion | "slow dolly in from medium to close-up over 5s, stopping on her eyes" |
| **Pull-out (dolly out)** | Isolation, reveal of context, ending | "slow dolly out from close-up to wide, revealing the empty stadium" |
| **Lateral track / truck** | Journey, parallel with subject | "track right alongside her at walking pace, keeping her centered, foreground pillars wiping past" |
| **Arc / orbit** | Hero moment, tension, 3D product reveal | "180° arc around him counterclockwise at 1.5m radius, ending on his profile" |
| **Crane / jib up** | Resolution, scale, transcendence | "crane up from eye level to 8m, revealing the crowd" |
| **Crane down** | Arrival, descending into the scene | "crane down from rooftop height to street level, settling on the doorway" |
| **Pan** | Survey, connecting two subjects | "slow pan left from the window to the door" |
| **Whip pan** | Energy, transition, comic beat | "whip pan right with motion blur, landing sharply on the dog" |
| **Tilt up/down** | Scale, reveal of height or detail | "tilt up from the sneakers to the face" |
| **Handheld** | Urgency, documentary truth, anxiety (Safdie) | "handheld shoulder-rig, subtle breathing sway, reframing on reactions" |
| **Steadicam follow / lead** | Immersion, following through space | "Steadicam leading her backward down the corridor at 1.2m distance" |
| **Gimbal float (low mode)** | Dreamlike glide, dance | "low-mode gimbal glide at knee height" |
| **FPV drone dive / proximity** | Adrenaline, impossible path | "FPV drone dives off the cliff edge and threads between the two spires, pulling up at the waterline" |
| **Drone reveal / top-down / orbit** | Geography, scale | "drone rises from behind the ridge revealing the valley" |
| **Technocrane sweep** | Operatic fluid scale | "Technocrane 30 sweeps from low over the table up to the chandelier" |
| **Dolly zoom (Vertigo)** | Dread, sudden realization | "dolly zoom: camera dollies back while zooming in, background stretching behind his fixed face" |
| **Crash zoom / snap zoom** | Comedy, Tarantino/70s punch | "crash zoom into his eyes" |
| **Snorricam / body-mount** | Disorientation, intoxication | "Snorricam rig on his chest, face locked center, world swinging behind" |
| **Motion-control repeat** | Product precision, VFX | "robotic MRMC Bolt arm, precise linear move 30cm over 3s" |
| **Speed ramp** | Impact moment | "real-time, ramps to 120fps slow motion at impact, ramps back" |

**AI rules**
- One primary move per shot. A secondary *subtle* drift is allowed, e.g. "slow push-in with slight handheld breath".
- Always give speed (very slow / slow / moderate / fast) plus distance or degrees plus endpoint.
- Separate what the **camera** does from what the **subject** does, in separate sentences.
- Orbit >180° and compound moves (orbit + crane + zoom) are the #1 artifact source. Split them into two shots.

---

## 5. Coverage and editing grammar

- **Shot-size ladder**: EWS → WS → FS → MWS (cowboy) → MS → MCU → CU → ECU → insert/macro.
- **Cut rule**: between consecutive shots, change the size by 2+ rungs **or** the angle by ≥30°. Anything less reads as a jump cut. Break this only deliberately (for a jump-cut style).
- **180° line**: pick the axis between subjects and keep the camera on one side. For motion, keep screen direction constant (L→R = progress/going forward; R→L = return/opposition).
- **Eyeline match**: a subject looking camera-left is cut to what sits camera-right.
- **Match cut**: match shape, motion, or color across a cut. Write both frames to share the key element's position.
- **Size ↔ emotion**: wide = context/isolation, medium = behavior, close = emotion, extreme close = obsession/detail.
- **Coverage order for a dialogue scene**: establishing → two-shot → OTS A → OTS B → CU A → CU B → inserts → reaction.
- **Music video**: build the performance pass, narrative pass, and B-roll texture separately; cut on beat. Give each shot one visual "hook".
- **Commercial (30s)**: open with a hook inside 1.5s, then problem/desire → product hero (full-screen, lit perfectly) → payoff/lifestyle → end card with packshot.

---

## 6. Frame rate and shutter

| Rate | Look | Use |
|---|---|---|
| **24fps / 180°** | Cinema standard motion blur | Default narrative |
| **24fps / 45–90°** | Staccato, crisp, war-film strobing (*Saving Private Ryan*) | Action, chaos, rain drops frozen |
| **24fps / 270–360°** | Smeary, dreamy blur (Wong Kar-wai step-print feel) | Drunk, dream, neon romance |
| **48–60fps** | 2–2.5× slow motion when conformed to 24 | Hair flip, walking in slow-mo |
| **120fps** | 5× slow, silky | Dance, sport, fabric, product pour |
| **240–1000fps (Phantom)** | Extreme time dilation | Splash, shatter, liquid crown, powder burst |
| **Timelapse / hyperlapse** | Time compression | City transitions, cloud flow |
| **Step-printing / undercrank** | Frenetic, stuttered | Fight, chaos, memory |

AI video models output at native fps. **Describe the slow-motion effect** ("slow motion, droplets hang in the air, 1000fps Phantom look") rather than expect a real frame-rate change.

---

## 7. Composition

- **Rule of thirds**: eyes on the upper third line, and the subject on the third opposite their look direction (lead room).
- **Centered symmetry**: Anderson/Kubrick authority, deadpan, ritual.
- **Negative space**: isolation, luxury (products breathe).
- **Leading lines / vanishing point**: guide the eye to the subject.
- **Frame within frame**: doorways, mirrors, windows. This conveys entrapment or voyeurism.
- **Deep staging**: FG/MG/BG action planes, each doing something. This is the most "cinematic" single choice for AI prompts, so state all three planes.
- **Short-side vs. long-side framing**: framing to the short side (subject looking toward the near edge) = claustrophobia and unease.
- **Headroom**: tight headroom (crop the forehead) = intensity; generous = calm.
- **Aspect ratio as meaning**: 2.39:1 epic/romance/scale; 1.85:1 drama; 1.43:1 IMAX monument; 4:3/1.33 period, intimacy, and A24; 9:16 social first (stack the subject vertically, and keep key action in the center 60%).

---

## 8. The DP decision script (run per shot)

```
1. What is the shot's job?                         → the size + angle start there
2. What should the audience feel?                  → focal length + height
3. What changes during the shot?                   → movement (or lock off) + endpoint
4. Where is the light in the world coming from?    → motivated key → fixture recipe
5. How should the contrast feel?                   → ratio (2:1 → 16:1)
6. What's the color of the moment?                 → CCT split + grade
7. What's in the air?                              → atmosphere (source-bound)
8. What is in FG / MG / BG?                        → depth planes
9. What's heard?                                   → audio layers
10. What must never drift?                         → locks
```

If two shots answer #1–#3 identically, merge them or change one. Redundant coverage wastes generations.
