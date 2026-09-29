# Worked Examples — Linted Golden Prompts

Every prompt below passes `scripts/lint_prompt.py` with 0 FAIL / 0 WARN on its target platform. Use them as the output-shape reference. **Don't reuse them verbatim**: the subjects are placeholders.

---

## Example 1 — One concept, two compilers (still)

**Brief:** a luxury fragrance hero still, "NOCTURNE". Visual thesis: *a jewel surfacing from darkness.* House A-cam (product = fidelity), Fincher · Greig Fraser anchor, luxury-product kit (`genre-recipes.md` #1).

### 1a · Nano Banana Pro (narrative, tokens translated to prose)
`lint: PASS [nano-banana-pro]`
```
A low-angle medium close-up photograph of a single 100ml fragrance bottle, faceted smoked-glass body with a brushed-gold collar and a matte black cap, the word "NOCTURNE" etched in thin serif capitals centered on the front, resting on a slab of wet black basalt with a thin film of water beading around its base. A single drop is sliding down the right shoulder of the glass. The frame is shot on a Blackmagic URSA Cine 17K 65 in Blackmagic RAW at maximum quality, its 65mm sensor giving pore-level detail in the stone and a softly falling background, through a ZEISS Panoptes 65 90mm at T2.8 with focus locked on the etched lettering and the back edge of the cap already softening. Light: an Aputure LS 600c Pro through a 1x6 stripbox raking from behind at 160 degrees camera left, tracing a razor-thin gold edge down the glass; a Mole-Richardson Tweenie with a 40-degree grid as a kicker skimming the lettering from camera right at 30 degrees; black floppies on both sides as negative fill, so everything outside the bottle falls to black at roughly 8:1. A faint haze drifts from a hazer behind the set, catching the backlight in a soft vertical glow. Fincher-grade precision with Greig Fraser chiaroscuro. Graded through an ACES 2.0 pipeline with deep blacks and warm-neutral highlights, a gentle halation bloom around the specular points. It reads like a camera-original frame pulled from an A001_09291432_C001.braw clip: an untouched commercial hero frame, tabletop studio setup, true glass refraction and no retouching. Aspect ratio 4:5.
```

### 1b · Midjourney V8 (token-receptive, raw tokens)
`lint: PASS [midjourney-v8]`
```
faceted smoked-glass fragrance bottle with brushed-gold collar and matte black cap, "NOCTURNE" etched in thin serif capitals, resting on wet black basalt, water beads around the base, one droplet sliding down the right shoulder, faint haze glowing behind, low angle medium close-up, BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0, ZEISS_Panoptes65_90mm_T2.8, focus on the lettering, Aputure LS 600c Pro stripbox rim light from behind at 160 degrees, Mole Tweenie gridded kicker camera right, black negative fill flags, 8:1 low-key, edge_lighting_separation, negative_fill_flag, David Fincher precision framing, Greig Fraser chiaroscuro, luxury commercial, ACES_2.0_ODT, halation bloom, commercial_hero_frame, tabletop_studio_setup, A001_09291432_C001.braw, deep blacks, warm-neutral highlights, true glass refraction, specular glints, basalt texture macro detail, clean studio isolation, no retouching, hyper-real product still, premium fragrance campaign, dark moody atmosphere, precise symmetry with the bottle on the right third, generous negative space left for copy, crisp micro-contrast, fine sensor noise, cold blue-black shadow palette, museum-grade product lighting --ar 4:5 --style raw --s 75
```

**Same DP decisions, two syntaxes.** Nano Banana gets full sentences with the tokens translated (`A001_09291432_C001.braw` becomes "a camera-original frame pulled from…"). Midjourney gets raw tokens front-loaded after the subject, plus params.

---

## Example 2 — 30s music video sequence · Seedance 2.5 (House A/B per shot)

**Brief:** rooftop performance for the artist KAI. Visual thesis: *a city that crowned him.* Music-video kit (#3). A-cam carries the wides (Shots 1 and 3) and B-cam the closes (Shots 2 and 4): a real two-camera day.

`lint: PASS [seedance-2.5]`
```
Format: 30s, 16:9, 24fps, cinematic multi-shot, photoreal, no on-screen text, no background music except the provided track.
References: @Image1 = KAI face, locs and skin — fully preserve identity. @Image2 = KAI wardrobe — preserve the cropped black leather bomber, silver chain, white tank, and cargo cut exactly. @Image3 = rooftop location plate — preserve the water tower and skyline layout. @Audio1 = the song; lip-sync to the quoted lyric.
Subject lock: KAI, 6'1", lean athletic build, deep brown eyes, shoulder-length black locs tied halfway up, sharp jaw, thin mustache, calm focused expression, cropped black leather bomber over a white ribbed tank, heavy silver Cuban chain, black cargo pants, white leather sneakers.
Look: Wong Kar-wai neon romance with Autumn Durald Arkapaw's warm skin rendering, graded like Kodak Vision3 500T through ACES 2.0 with soft halation around every practical.
0–6s — Shot 1 [EWS · ESTABLISH]: KAI stands at the rooftop edge, back to camera, the city glittering below. Camera: A-cam Blackmagic URSA Cine 17K 65 with a ZEISS Panoptes 65 25mm at T4 on a DJI Inspire 3 drone, a slow descending crane-down from 20m to 4m that settles at his shoulder height. Light: magenta and cyan neon signs on the water tower as motivated practicals camera left, sodium streetlight glow at 2000K far below, 30% haze from a hazer catching the neon. Hard cut.
6–14s — Shot 2 [MCU · INTIMACY]: KAI turns to camera and sings "I was born under these lights" as a slow breath fogs in the cold air. Camera: B-cam ARRI ALEXA LF with a Canon K35 55mm at T1.5, a slow dolly in from medium to close-up over 8s, stopping on his eyes. Light: an Aputure NOVA II 2x1 through a 4x4 grid cloth camera left at 45 degrees as the key, an Astera Titan tube rim from behind at 150 degrees in cyan, negative fill camera right, 4:1. Hard cut.
14–22s — Shot 3 [WS · ACTION]: KAI walks left to right along the ledge, chain swinging with each step, jacket hem lifting in the wind. Camera: A-cam, Steadicam track right at walking pace at 3m, foreground vents wiping past. Light: the same neon practicals, and a Robe MegaPointe beam sweeping through the haze from the far building at 12s. Hard cut.
22–30s — Shot 4 [CU · PAYOFF]: rain begins; drops bead on the leather; KAI looks up and smiles. Camera: B-cam, locked-off at eye level, rain towers backlit at 150 degrees so each drop reads. Light: key unchanged camera left.
Audio: @Audio1 throughout; rooftop wind; distant sirens; rain hiss building from 22s.
Continuity: identical wardrobe, locs, and chain across shots; key always camera left; screen direction left to right; a24_indie_film_still texture.
```

Director's notes:
- Shot sizes jump EWS → MCU → WS → CU: at least 2 rungs per cut, so there are no jump cuts.
- One move per shot, each with an endpoint (crane settles at shoulder; dolly stops on the eyes; Steadicam holds 3m; the final shot is locked-off).
- Light is motivated throughout (neon, sodium, MegaPointe beam, rain backlight), and the key stays camera left for continuity.

---

## Example 3 — Dialogue beat · Veo 3.1 JSON (House B-cam: skin and emotion)

**Brief:** diner confrontation. Visual thesis: *the last warm place before the decision.* Prestige-drama kit (#7), with a CCT split (cool window vs. warm pendant).

`lint: PASS [veo-3.1]`
```json
{
  "shot": {"size": "MCU", "angle": "eye level, 1.5m, three-quarter front", "duration_s": 8, "aspect": "16:9"},
  "subject": "MAYA, 5'6\", slender build, hazel eyes, tight natural coils pinned up with loose strands at the temples, freckles across the nose, small gold hoop earrings, a faded olive work jacket over a cream knit sweater, flour dust on one cuff, exhausted but warm expression",
  "action": "MAYA sits at a diner booth, both hands around a chipped white mug. She looks down, exhales, then lifts her eyes to the man across from her (off-screen right) and speaks. On the last word she sets the mug down gently and holds his gaze.",
  "environment": "a late-night roadside diner, rain streaking the window beside her, a red neon OPEN sign glowing backward through the glass, steam curling from the coffee",
  "camera": "Captured on an ARRI ALEXA LF in ARRIRAW with a Cooke S8/i FF 75mm at T2, focus on her near eye, the window behind melting into warm bokeh; a very slow dolly push-in on a Chapman PeeWee from MCU to CU over 8 seconds, stopping on her eyes",
  "lighting": "a SkyPanel S60 through 216 diffusion outside the window, camera left at 60 degrees, faking cool 5600K street light; a warm 2700K practical pendant above the booth as a soft top light; the red neon as a motivated rim from behind at 150 degrees; black negative fill camera right for a 4:1 ratio",
  "style": "Barry Jenkins-style intimacy seen through James Laxton's warm skin rendering, graded like Kodak Vision3 250D through ACES 2.0, fine organic grain, soft halation on the neon, the stillness of a Criterion Collection frame",
  "audio": {"dialogue": "MAYA, quiet and steady: \"I'm not asking you to stay. I'm asking you to decide.\" (no subtitles)", "sfx": "at 7s the mug touches the table with a soft ceramic knock", "ambience": "rain on glass, a distant fridge hum, faint kitchen clatter"},
  "constraints": "photoreal, no on-screen text, no music"
}
```

---

## Example 4 — Image-to-video · MiniMax H3 (start frame = Example 1a)

The start frame already carries the look, so **the words go to motion, physics, light change, and audio**. There are no bracket commands, and every reference gets a preservation level.

`lint: PASS [minimax-h3 --i2v]`
```
References: Image 1 = start frame of the NOCTURNE bottle on wet basalt — fully_preserved: bottle geometry, etched "NOCTURNE" lettering, gold collar, cap, stone texture, framing. Ignore nothing; this is the exact first frame.
Retention: the bottle never deforms, the lettering stays legible and fixed, the gold collar keeps its brushed finish, and the stone surface stays wet.
Timeline (8s):
[0.0–3.0s] The droplet on the bottle's right shoulder slides slowly down the facets, bending the gold rim light as it travels, and merges with the water film at the base; a small ring ripples outward across the basalt.
[3.0–6.0s] The haze behind the set drifts right to left, thickening slightly, so the rim-light glow blooms and breathes. The backlight intensifies smoothly by half a stop, and the gold edge on the glass brightens from thin line to glowing seam.
[6.0–8.0s] A second drop falls from above frame onto the stone just left of the bottle, throwing a crown of micro-droplets that catch the kicker light, then settles.
Camera: A-cam Blackmagic URSA Cine 17K 65 with the ZEISS Panoptes 65 90mm, a very slow motion-control push-in on an MRMC Bolt X, 12cm over the full 8 seconds, ending with the lettering at the center of frame; focus stays locked on the etching throughout.
Light behavior: the Aputure LS 600c Pro stripbox rim from behind at 160 degrees rises half a stop at 3s; the gridded Mole Tweenie kicker holds steady camera right; black negative fill stays, so nothing outside the bottle lifts from black.
Physics: water behaves at true viscosity with surface tension — the droplet elongates before merging, the crown splash reads at a Phantom-style 1000fps slow motion, and ripples decay naturally.
Style carries from the frame: Fincher precision, Greig Fraser chiaroscuro, ACES 2.0 grade with halation on the speculars, commercial hero frame, tabletop studio setup.
Audio: [0.5s] a faint wet slide; [3.0s] a low sub swell begins; [6.2s] a crisp single water tap on stone with a short glassy ring; room tone is near-silent studio air.
Constraints: photoreal, no on-screen text beyond the etched lettering, no music, no camera shake.
```

---

## Director's Package wrapper (how any of the above is delivered)

```yaml
project: "NOCTURNE — launch film"
target: { model: "minimax-h3", mode: "I2V", aspect: "4:5", duration_s: 8, resolution: "2K" }
logline: "A single drop traces a bottle that surfaces from darkness."
visual_thesis: "A jewel surfacing from darkness."
look_anchor: { director: "David Fincher", dp: "Greig Fraser", stock_grade: "ACES 2.0, deep blacks, halation", light_philosophy: "rim-only sculpting, 8:1" }
references: [ { slot: "Image 1", role: "start frame — fully_preserved" } ]
shots:
  - id: S01
    job: PRODUCT-HERO
    duration_s: 8
    dp_sheet:
      camera: "A-cam · Blackmagic URSA Cine 17K 65 · BRAW Q0"
      lens: "ZEISS Panoptes 65 90mm @ T2.8 — focus locked on the etching"
      angle_height: "low angle, 25cm above the stone"
      movement: "MRMC Bolt X motion-control push-in, 12cm over 8s, ends with the lettering centered"
      frame_rate: "24fps; the splash rendered as a 1000fps look"
      lighting: { key: "none (rim-only)", back: "Aputure LS 600c Pro + 1x6 stripbox, 160° behind camera left, +½ stop at 3s", kicker: "Mole Tweenie with a 40° grid, camera right 30°", fill: "black negative fill", ratio: "8:1", cct: "3200K warm-gold rim" }
      atmosphere: "hazer behind the set, drifting right to left"
      grade: "ACES 2.0, halation on the speculars"
      audio: "wet slide, sub swell, single water tap"
    rationale: "Rim-only light reveals the glass without flattening it; the slow motion-control push reads as reverence, not movement."
    prompt: "<Example 4 text>"
    lint: "PASS"
```
