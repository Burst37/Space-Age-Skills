# Genre Recipes — Complete Kits

Each kit is a starting look anchor. Every kit runs on the **House Package** (A = URSA Cine 17K 65, B = ALEXA LF, matched grade) unless marked **Override**. Swap any single element with a stated reason.

Format: **Anchor** (director · DP) → **A-cam glass / B-cam glass** → **Light** → **Grade** → **Meta tokens** → **Audio** → **Pitfalls**.

---

### 1. Luxury product / fragrance / watch
- **Anchor:** Fincher precision · Greig Fraser chiaroscuro
- **Glass:** A: ZEISS Panoptes 65 90mm + Master Macro 100 / Innovision Probe · B: Signature Prime 125mm
- **Rig:** MRMC Bolt X motion-control, slow linear 30cm moves; turntable at 1 rev per 20s
- **Light:** Aputure LS 600c Pro through 1×6 stripboxes raking from 160° to trace the edges; Mole Tweenie kicker for the logo; black acrylic floor; Matthews black flags everywhere else; 8:1
- **Grade:** ACES 2.0, deep blacks, neutral-warm highlights, `halation_bloom_print` light
- **Meta:** `commercial_hero_frame` `tabletop_studio_setup` `focus_stacking_composite` `BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0` `A001_09291432_C001.braw`
- **Audio:** near-silence, glass clink, fabric whisper, one deep sub-bass swell
- **Pitfalls:** warped labels and logos. Lock the label text in quotes and use the product ref as `fully_preserved`. Anamorphic distorts packaging, so stay spherical.

### 2. Fashion film / editorial
- **Anchor:** Wong Kar-wai romance or Lanthimos wide-angle absurdism · Autumn Durald Arkapaw skin
- **Glass:** A: Panoptes 65 45mm (full-look wides) · B: ZEISS Horizon Anamorphic 75mm (close, oval bokeh)
- **Rig:** low-mode gimbal float at hip height; slow 90° arcs
- **Light:** book light (SkyPanel X23 → 12×12 Ultrabounce → full grid) camera left 45°; Astera Titan tubes as in-frame practicals; Black Pro-Mist 1/8 for bloom; 3:1
- **Grade:** Kodak Vision3 250D emulation, lifted blacks, pastel-desaturated option
- **Meta:** `Vanity Fair Hollywood Portrait` `Dazed Editorial` `from_Vogue_stills_archive` `ARRI_ALEXA_LF.ARRIRAW.LogC3` `print_contact_proof`
- **Audio:** fabric movement, heels on concrete, room reverb
- **Pitfalls:** fabric morphing. Describe the weave, weight, and drape physics, and keep the wardrobe ref at `fully_preserved`.

### 3. Music video (performance + narrative)
- **Anchor:** Hype Williams-scale / Wong Kar-wai / Safdie energy (pick one) · Arkapaw music-video energy
- **Glass:** A: Ultra Panavision 70 or Hawk65 for scope wides · B: Canon K35 (vintage bloom) for close performance
- **Rig:** Steadicam 360 orbit around the artist; FPV proximity for B-roll; Snorricam for the chaos beat
- **Light:** Robe MegaPointe beams through 30% haze from the truss behind; strobes on snare hits; a warm follow-spot key at 20°; magenta/amber palette
- **Grade:** Kodak Vision3 500T, crushed blacks, saturated color, `bold_moody_grade`
- **Meta:** `neon_practical_accent` `volumetric_shafts_haze` `C004_C009_1201BG.R3D` `a24_indie_film_still` `anamorphic_2.39:1_scope`
- **Audio:** the track (provided as `@Audio` ref) and lip-sync on the chorus lines, quoted
- **Pitfalls:** lip-sync drift on long takes. Keep singing shots ≤8s on Veo, or use a Seedance `@Audio` ref with the exact quoted lyric.

### 4. Sports / athletic hero (Nike-grade)
- **Anchor:** Michael Bay low-angle orbit (restrained) · Claudio Miranda clean high-key action
- **Glass:** A: Panoptes 65 25mm at ground level for monumental angles · B: Angénieux Optimo Ultra 12x at the long end for compressed sweat close-ups
- **Override option:** ALEXA 35 Xtreme at 660fps for the impact moment
- **Rig:** Russian Arm on a camera car / cable cam; ground-level slider
- **Light:** twin Creamsource Vortex24 hard crossed rims at 135°; Godox KNOWLED P600R hard key front-left; sweat speculars; dark arena BG; 8:1
- **Grade:** high contrast, teal-orange restrained, `hyper_realism_grade`
- **Meta:** `nike_campaign_hero_still` `commercial_hero_frame` `ARRI_ALEXA_35_XTREME.ARRIRAW.LogC4.660fps` `speed_ramp`
- **Audio:** breath, shoe squeak, crowd roar muffled then released
- **Pitfalls:** anatomy under fast motion. Use one athlete per shot and one move per shot.

### 5. Automotive
- **Anchor:** Ridley Scott atmosphere · Claudio Miranda
- **Glass:** A: Panoptes 65 35mm (full car, minimal distortion) · B: Signature Prime 150mm (panel detail, compression)
- **Rig:** Russian Arm on a Mercedes ML camera car; drone chase; MRMC Bolt for studio "light painting" passes
- **Light:** exteriors at magic hour with a 20×20 overhead silk for the reflection gradient; studio: 12m softbox overhead "car light", Nanlux Matrix 10,000 as the sun
- **Grade:** ACES 2.0, deep blue-hour skies, clean chrome
- **Meta:** `commercial_hero_frame` `volumetric_shafts_haze` `drone_tracking_chase` `SONY_VENICE_2_8K.XOCN-ST.S-Log3` (override for night)
- **Pitfalls:** wheel rotation and reflections. Write "wheels rotating forward with motion blur matching 60km/h" and "reflections of the environment slide across the bodywork".

### 6. Food and beverage
- **Anchor:** Chef's Table macro reverence
- **Glass:** A: Innovision Probe II+ / Laowa Probe 24mm · Master Macro 100mm
- **Override:** Phantom Flex4K at 1000fps for pours and splashes
- **Rig:** MRMC Bolt high-speed whip; overhead top-down on a Technocrane arm
- **Light:** backlight at 170° through the liquid (Aputure STORM 400x + frost) for glow; 4×4 bounce front; steam backlit
- **Grade:** warm, appetizing, saturated but natural
- **Meta:** `PHANTOM_FLEX4K.Cine.1000fps` `tabletop_studio_setup` `focus_stacking_composite`
- **Audio:** sizzle, pour glug, crunch, ice crack
- **Pitfalls:** liquid physics. Specify viscosity ("thick honey ribbon folding on itself") and droplet size.

### 7. Prestige drama / intimate character
- **Anchor:** Deakins single-source · Gerwig/Coogler warmth
- **Glass:** A: Panoptes 65 40mm · B: Cooke S8/i FF 75mm (Cooke Look warmth)
- **Rig:** slow dolly push on Chapman PeeWee; locked-off for dialogue
- **Light:** SkyPanel S360-C through 12×12 full grid outside the window, camera left; negative fill camera right; a warm practical lamp at 2700K; 4:1
- **Grade:** Kodak Vision3 250D, natural skin, ACES 2.0
- **Meta:** `single_source_deakins` `criterion_collection_frame` `ARRI_ALEXA_LF.ARRIRAW.LogC3` `A001C003_260929_R1AB.ari`
- **Audio:** room tone, clock tick, rain on the window, quiet dialogue on a Schoeps boom

### 8. Horror / Southern Gothic
- **Anchor:** Ari Aster daylight dread / Coogler Southern Gothic · Arkapaw night / Eggers candlelight
- **Glass:** A: Ultra Panavision 70 (the *Sinners* lineage) · B: Canon K35 (vintage bloom)
- **Rig:** locked-off overheads; ultra-slow push-ins; a sudden handheld break for the scare
- **Light:** firelight at 1900K (Quasar Rainbow on DMX flicker), moonlight SkyPanel X at 7500K from a condor, 16:1, faces half in black
- **Grade:** `southern_gothic_amber`, crushed blacks, heavy 500T grain
- **Meta:** `firelight_flicker_DMX` `top_light_overhead` `VISTAVISION_8perf.KODAK_5219.scan` `film_stills_archive`
- **Audio:** cicadas, distant blues guitar, floorboard creak, sudden silence
- **Pitfalls:** gore can trigger filters. Imply it with shadow, sound, and reaction.

### 9. Sci-fi / desert epic
- **Anchor:** Villeneuve scale · Greig Fraser / Linus Sandgren
- **Override:** IMAX 15-perf on Kodak AHU look (`IMAX_15perf_65mm.KODAK_AHU.scan`) for monument frames
- **Glass:** A: Panoptes 65 25mm · B: Signature Prime 280mm for heat-shimmer compression
- **Light:** hard single sun, bleached highlights, sand-reflected fill, silhouettes; haze from blowing sand
- **Grade:** `imax_desert_bleach`, desaturated, monochrome-leaning
- **Meta:** `imax_1.43:1_ratio` `Brutalist Monumental` `Desert Epic` `negative_space_isolation`
- **Audio:** low wind, thrum of machinery, a massive sub-bass horn

### 10. Cyberpunk / neon noir
- **Anchor:** Wong Kar-wai · Blade Runner 2049 lineage (use `film_stills_archive`, not the studio token)
- **Glass:** A: Panoptes 65 35mm · B: Panavision Ultra Vista 50mm (blue streak flares)
- **Light:** magenta/cyan neon practicals, Astera tubes augmenting, rain towers backlit, wet asphalt, sodium BG at 2000K, 30% haze
- **Grade:** teal-magenta split, deep blacks, halation
- **Meta:** `neon_practical_accent` `volumetric_shafts_haze` `SONY_VENICE_2_8K.XOCN-ST.S-Log3` (override: night specialist) `anamorphic_2.39:1_scope`
- **Audio:** rain hiss, synth hum, distant sirens, a PA voice in another language

### 11. Documentary / verité luxury
- **Anchor:** Malick naturalism · Lubezki natural light
- **Override:** ALEXA Mini LF + Easyrig for mobility; Sony BURANO for run-and-gun
- **Glass:** Cooke S8/i 32mm / 50mm
- **Light:** available light only, bounce boards, one LiteMat Spectrum as a hidden fill
- **Grade:** `hyper_realism_grade`, natural
- **Meta:** `cinema_verite_style` `National Geographic Documentary` `handheld_shake`

### 12. UGC / creator ad
- **Override (deliberate):** iPhone 18 Pro Max, ProRes RAW + Apple Log 2, 24mm main camera, vertical 9:16
- **Rig:** handheld selfie, slight wobble, a real-room mess
- **Light:** window daylight + a ring-light catchlight, real practicals
- **Grade:** phone-natural, slight HDR computational look
- **Meta:** `IPHONE18PRO.ProResRAW.AppleLog2` `IMG_2985.HEIC` `vertical_9x16_center_stack`
- **Audio:** direct-to-phone mic, room echo, casual delivery
- **Pitfalls:** "too cinematic" kills UGC trust. Drop the anamorphic, haze, and grade tokens entirely.

### 13. Record Exec / artist visual (Space Age)
- Run the **Music video** kit above, plus the artist identity lock from `ai-content-creator` / `record-exec-in-a-box` when loaded.
- Encore merch: the logo always sits upper-left chest; lock it as a `fully_preserved` reference.
