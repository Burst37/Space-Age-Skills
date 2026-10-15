# Shot Grammar — The Director's Vocabulary

Organized in the 13-category taxonomy used by professional technique libraries (cf. melies.co/cinematic-techniques, which catalogs 424 techniques). For the live visual reference and failure-mode check on any technique here, see `melies-integration.md`. The definitions and prompt phrasings here are this skill's own. Every entry gives **what it does** and **the exact phrase that makes a model render it**.

---

## 1. Framing and shot size
| Size | Frame | Prompt phrase |
|---|---|---|
| Extreme wide (EWS) | Subject tiny in the landscape | "extreme wide shot, figure small in the lower third, vast [environment]" |
| Wide (WS) | Full body + environment | "wide shot, full figure with 2m of environment around" |
| Full shot (FS) | Head to toe, fills height | "full shot, head to toe, feet in frame" |
| Medium wide / cowboy (MWS) | Mid-thigh up | "cowboy shot, framed from mid-thigh" |
| Medium (MS) | Waist up | "medium shot, waist up" |
| Medium close-up (MCU) | Chest up | "medium close-up, chest up" |
| Close-up (CU) | Face fills frame | "close-up, face filling the frame, slight headroom" |
| Choker / tight CU | Chin to forehead crop | "tight close-up, chin to mid-forehead" |
| Extreme close-up (ECU) | One feature | "extreme close-up on her left eye, iris texture visible" |
| Insert | Object detail | "insert shot of the ring on the table" |
| Two-shot / three-shot | Relationship | "two-shot, both in profile facing each other" |
| OTS | Conversation anchor | "over-the-shoulder, his shoulder soft in the left foreground" |
| POV | Subjective | "POV through his eyes, hands entering the bottom of frame" |
| Establishing | Geography | "establishing shot of the harbor at dawn" |

## 2. Camera angles
Eye level · shoulder · hip · knee · ground/worm's-eye · low angle · high angle · overhead/bird's-eye/top-down · dutch/canted · profile · 3/4 front · 3/4 back · rear/back shot · reverse angle · aerial oblique. **Always write the height in meters and the tilt direction.** Psychology is in `decision-engine.md §3`.

## 3. Camera movement (core set; the psychology is in `decision-engine.md §4`)
**Linear:** dolly in/out · push-in · pull-back · truck/track left/right · pedestal up/down · crane/jib up/down · boom · tracking lead/follow/side · parallel track · counter-track (camera moves opposite the subject).
**Rotational:** pan · tilt · whip pan · swish pan · roll (barrel roll) · dutch roll · arc/orbit (partial/180/360) · spiral crane.
**Lens-based:** zoom in/out · crash/snap zoom · slow creep zoom · dolly zoom (vertigo/contra-zoom) · rack focus · focus pull · split diopter.
**Operated:** handheld · shoulder rig · Steadicam · gimbal float · low-mode gimbal · Easyrig float · Snorricam · body-cam · helmet-cam · car-mount/hostess tray · Russian Arm · cable cam · Spidercam · motion-control (MRMC Bolt) repeat · robotic high-speed whip.
**Aerial:** drone rise/reveal · top-down drift · orbit · FPV dive · FPV proximity threading · helicopter sweep · parallax reveal · hyperlapse.
**Signature:** oner/long take · walk-and-talk lead · reveal from behind foreground object · pass-through (window, keyhole, crowd) · "Kubrick" center-line push · "Spielberg oner" (blocking changes the shot size inside one take) · Wes Anderson whip-pan between planimetric frames · Scorsese Copacabana Steadicam · Fincher invisible motion-control push.

**AI rule:** one primary move per shot, with speed + distance/degrees + endpoint.

## 4. Composition
Rule of thirds · center/symmetry · planimetric (flat, facing the camera wall) · golden ratio/spiral · leading lines · vanishing point · frame within frame · negative space · deep staging (FG/MG/BG) · short-side vs. long-side (lead room) · headroom control · diagonal tension · triangle blocking · foreground occlusion (dirty frame) · reflections/mirrors · silhouette against bright BG · layered depth with a soft foreground element · split-screen composition.

## 5. Lenses and optics
Ultra-wide · wide · normal · portrait tele · super-tele · macro · probe · fisheye · anamorphic (oval bokeh, streak flare, edge falloff) · spherical · tilt-shift (miniature / selective plane) · split diopter (two planes sharp) · swirl bokeh (Petzval) · vintage uncoated (veiling flare, low contrast) · diffusion filter (Black Pro-Mist bloom) · polarizer (kills reflections, deepens sky) · ND (motion blur in daylight) · lens breathing (deliberate) · chromatic aberration · vignetting.

## 6. Lighting
See `lighting-playbook.md` for the full set: patterns (Rembrandt, loop, butterfly, clamshell, split, broad, short), rim/kicker, top light, under light, book light, motivated single source, practicals, silhouette, high-key, low-key, chiaroscuro, CCT split, golden hour, blue hour, moonlight, neon, firelight, strobe, lightning, headlight sweep, IBL/LED-volume interactive light.

## 7. Color and film look
Film stock emulations (Vision3 500T/250D/200T/50D, Double-X, Ektachrome, AHU) · print emulation (2383/2393) · bleach bypass · cross-process · teal-orange · monochrome · day-for-night · two-strip/three-strip Technicolor · desaturated naturalism · pastel · neon saturation · sepia/tobacco · halation · gate weave · grain size (8/16/35/65mm) · HDR specular · printer-light warmth.

## 8. Time and motion
Real time · slow motion (60/120/240/1000fps look) · speed ramp · time-lapse · hyperlapse · reverse motion · freeze frame · bullet time (frozen subject, camera moves) · step-printing/stutter · undercrank (fast, jerky) · overcrank (dreamy) · time slice · motion blur trails (long shutter) · strobe freeze (narrow shutter).

## 9. In-camera and optical effects
Lens flare · anamorphic streak · light leak · prism/filter FX (Fractal filters, crystal prism in front of the lens) · shooting through glass/rain/fabric · practical smoke · mirror tricks · forced perspective · rear projection look · Schüfftan-style reflection · split diopter · Dutch roll · in-camera focus breathing · zoom-burst · long exposure light trails · kaleidoscope · infrared · thermal · night-vision green · VHS/CRT scan lines · datamosh (as a deliberate effect).

## 10. Editing and transitions (for multi-shot prompts)
Hard cut · match cut (shape/motion/color) · jump cut · smash cut · J-cut / L-cut (audio leads/trails) · cross-cut · cutaway · insert · whip-pan transition · object wipe (the foreground passes and reveals the next scene) · pass-through (the camera flies through an object into the next space) · zoom-through · dissolve · fade to black · iris · morph transition (use sparingly; it's an AI tell) · beat cut (cut on the downbeat) · montage.

Multi-shot rule: end each shot with `Hard cut.` or name the transition explicitly and **where the key element sits in both frames**.

## 11. Atmosphere and weather
Haze · fog (ground/volumetric) · rain (backlit) · drizzle on glass · snow · dust motes · sandstorm · heat shimmer · steam · smoke · embers/sparks · pollen · confetti · wind-driven fabric · puddle reflections · wet-down streets · lightning · overcast softbox sky · golden dust in sunbeams. **Always name the source** (hazer, rain tower, steam vent, wind machine).

## 12. Genre looks
Noir · neo-noir · cyberpunk · solarpunk · western/neo-western · Southern Gothic · folk horror · analog horror · giallo · wuxia · space opera · desert epic · war (desaturated, 45° shutter) · period drama · rom-com (high key, warm) · heist (cool, precise) · sports epic · luxury commercial · fashion film · music video · documentary/verité · mockumentary · found footage · A24 naturalism · Criterion art-house · Bollywood saturation · Nollywood new wave · K-drama glow · anime-live-action hybrid. Full kits are in `genre-recipes.md`.

## 13. Viral / social looks (2025–26 short-form grammar)
| Look | Recipe phrase |
|---|---|
| Speed-ramp transition | "real speed, ramps into 120fps slow motion as she spins, snaps back on the beat" |
| Outfit match-cut | "same framing and pose across cuts, wardrobe changes on each beat, hard cuts on the downbeat" |
| FPV reveal | "FPV drone rips through the doorway and banks around the performer" |
| 360 orbit freeze | "time freezes, camera orbits 360° around the frozen subject, time resumes" |
| Zoom-out to space | "continuous pull-back from the face to the rooftop, city, coastline, orbit" |
| Object pass-through | "the camera pushes into the coffee cup and emerges in the next scene" |
| Phone-POV realism | "handheld iPhone 18 Pro vertical selfie POV, slight wobble, natural HDR" |
| Fisheye skate | "8mm fisheye at knee height following the skater, extreme distortion" |
| Dolly-zoom face | "dolly zoom on the face, background stretches as he realizes" |
| Snorricam party | "Snorricam on her chest, face locked center, party swinging behind" |
| Macro ASMR product | "Laowa probe macro gliding over the textured surface, crisp tactile sound" |
| Vertical center-stack | "9:16, subject centered in the middle 60%, head at the top third" |
| Reverse reveal | "action plays in reverse: the shattered glass reassembles" |
| Bullet time | "subject frozen mid-air, camera arcs 180° around" |
| Loop shot | "last frame matches the first frame for a seamless loop" |
