# Ultimate Cinematography Meta Token Database — v3.0 (September 2026)

**Lineage:** v1 (UltimateMetaTokenDatabase.pdf + UltimateMidjourneyCharacterConsistency_WithMetaTokens.pdf) → v2.0 (March 2026, "Expanded Edition") → **v3.0 (2026-09-29)**, which adds the 2026 releases (NAB, Cannes, Cine Gear, IBC), house-package tokens, tiering, corrections, and the token-to-prose translation layer.

### Markers
| Marker | Meaning |
|---|---|
| ★ | **Flagship / A-list.** The default for hero work. The engine picks from ★ first. |
| ◆ | **Pro.** Production-grade; use for a specific texture, a B/C-unit, or a practical constraint. |
| ○ | **Indie / budget.** *Only* when the brief deliberately wants that lower-budget texture ("indie flare", "creator look"). Never in a luxury or commercial hero frame. |
| [v2] | Added in the March 2026 v2.0 update |
| [v3] | Added in this September 2026 update |
| [dev] | Announced / in development, not shipping. It's fine as a *look* token, but never promise it as capture gear. |
| [fix] | A correction to v2.0 |

### How to use
1. Pick **one token per relevant category** from the ★ tier (House Package first; see SKILL.md Gate 3).
2. Assemble with the **Master Formula v3** (SKILL.md Gate 4).
3. **Token-receptive** models (Midjourney, FLUX.2, Seedream, SD-family) take raw tokens. **Narrative-first** models (all five house video models — Seedance 2.5/2.0, MiniMax H3, Grok Imagine 1.5, Gemini Omni Flash — plus Nano Banana and GPT Image) need the **§12 translation** into prose.

---

## 0. House Package (default on every project)

| Unit | Camera token | Raw meta token | Lens families | Matched grade token |
|---|---|---|---|---|
| **A-cam** | ★ Blackmagic URSA Cine 17K 65 | `BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0` | ★ ZEISS Panoptes 65 · ★ Panavision Sphero 65 / Ultra Panavision 70 · ★ Hawk65 · ★ ARRI Prime 65 S | `ACES_2.0_ODT` + shared stock emulation |
| **B-cam** | ★ ARRI ALEXA LF | `ARRI_ALEXA_LF.ARRIRAW.LogC3` [fix] | ★ ARRI Signature Prime · ★ ARRI Ensō Prime · ★ ZEISS Supreme Prime · ★ ZEISS Horizon Anamorphic · ★ Cooke S8/i FF | same |

Example matched pair (A wide + B close):
- A: `BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0 ZEISS_Panoptes65_40mm_T2.2 ACES_2.0_ODT Kodak_Vision3_250D_5207_emulation`
- B: `ARRI_ALEXA_LF.ARRIRAW.LogC3 ZEISS_Supreme_Prime_85mm_T1.5 ACES_2.0_ODT Kodak_Vision3_250D_5207_emulation`

---

## 1. Cinema Camera Systems

### ARRI
| Token | Tier | Format / notes |
|---|---|---|
| ALEXA 265 | ★ [v2] | Compact 65mm sensor, 15 stops, improved low-light (Dec 2024) |
| ALEXA 65 | ★ | 65mm, Open Gate 6.5K, 14+ stops |
| ALEXA LF | ★ | Large format, Open Gate 4.5K, ARRIRAW, LogC3 — **House B-cam** |
| ALEXA Mini LF | ★ | Compact LF, identical sensor to the LF |
| ALEXA 35 Xtreme | ★ [v3] | ALEXA 35 sensor, high-speed up to 660fps, REVEAL color |
| ALEXA 35 | ★ | Super 35, REVEAL Color Science, 17 stops |
| ALEXA 35 Live Xtreme | ◆ [v3] | Jul 2026, live broadcast with up to 8× HFR over SDI (sports/concert slow-mo look) |
| ALEXA Classic | ◆ | The original ALEXA look, 14 stops |
| AMIRA | ◆ | Documentary/ENG body with the ALEXA sensor |

### RED Digital Cinema (Nikon-owned)
| Token | Tier | Format / notes |
|---|---|---|
| RED V-RAPTOR XL [X] | ★ | 8K VV, global shutter, DSMC3 studio build |
| RED V-RAPTOR [X] | ★ | 8K VV, global shutter, 17+ stops; Z-mount version pairs with the new Nikkor Z Cinema VV lenses |
| RED V-RAPTOR | ◆ | 8K VV, rolling shutter |
| RED KOMODO-X | ◆ | 6K S35, global shutter |
| RED KOMODO 6K | ◆ | Compact 6K S35 |
| RED RANGER / DSMC3 | ◆ | Studio configuration |
| MONSTRO 8K VV | ◆ | Legacy FF 8K flagship |
| DSMC2 HELIUM 8K S35 / EPIC-W HELIUM | ◆ | Legacy 8K detail |
| DSMC2 DRAGON 6K S35 | ◆ | Legacy sharp texture |
| DSMC2 GEMINI 5K S35 | ◆ | Low-light specialist |
| SCARLET-W DRAGON 5K | ○ | Entry RED |
| RED ONE MX | ○ | The original RED look (2010s texture) |

### Sony CineAlta / Cinema Line
| Token | Tier | Format / notes |
|---|---|---|
| VENICE 2 (8.6K) | ★ | FF 8.6K, dual base ISO 800/3200, the night-exterior king |
| VENICE 2 + RIALTO 65 | ★ [v3][dev] | 65mm sensor block, 9.6K 3:2 open gate, ~2.2× FF area, targeting H1 2027 |
| VENICE (6K) | ◆ | Original 6K FF |
| CineAlta BURANO | ★ | Compact 8.6K, built-in ND, IBIS |
| FX5 | ◆ [v3] | Jul 2026: 16.6MP fully-stacked FF, 5K open gate, internal 16-bit X-OCN, base ISO 800/4000/12800, 4K120 / FHD240 |
| FX9 | ◆ | FF 6K |
| FX2 | ◆ [v2] | FF 33MP, dual base ISO 800/4000, S-Log3 |
| FX6 | ◆ | Compact FF 4K |
| FX3 | ○ | Compact cinema body (indie standard; Sundance workhorse) |
| FX30 | ○ | S35 4K entry |
| A7S III | ○ | Low-light hybrid |

### Canon Cinema EOS
| Token | Tier | Format / notes |
|---|---|---|
| Canon EOS C700 FF | ★ | FF cinema flagship |
| Canon EOS C400 | ◆ [v3] | 6K FF triple-base-ISO, the modern doc-drama workhorse |
| Canon EOS C50 | ◆ [v2] | 7K FF 32MP, open gate 3:2, anamorphic desqueeze |
| Canon EOS C80 | ◆ [v3] | 6K FF compact triple-ISO |

### Panasonic
| Token | Tier | Format / notes |
|---|---|---|
| VARICAM PURE | ◆ | Uncompressed RAW output |
| VARICAM LT | ◆ | S35 cinema |
| LUMIX S1H / BS1H | ○ | FF 6K |
| AU-EVA1 | ○ | S35 5.7K |
| LUMIX GH6 | ○ | MFT 5.7K |

### Blackmagic Design
| Token | Tier | Format / notes |
|---|---|---|
| URSA Cine 17K 65 | ★ [v2] | 65mm RGBW 17K, the highest-fidelity digital reference — **House A-cam** |
| URSA Cine 12K LF | ★ | FF 12K RGBW, 16 stops |
| URSA Cine 12K LF 100G | ◆ [v3] | NAB 2026, live SMPTE 2110 output up to 440fps |
| URSA Cine Immersive (100G) | ◆ [v3] | Dual 8K×8K RGBW for Apple Immersive Video, 16 stops |
| PYXIS 12K | ◆ [v2] | Box FF 12K RGBW |
| URSA Mini Pro 12K | ◆ | S35 12K |
| URSA Mini Pro 4.6K G2 | ○ | Workhorse 4.6K |
| Pocket Cinema Camera 6K Pro / G2 | ○ | Compact S35 6K |

### Motion-picture film cameras [v3]
| Token | Tier | Notes |
|---|---|---|
| IMAX 15-perf 65mm film camera (IMAX MSM 9802 / new-gen IMAX film cameras) | ★ | 1.43:1, the largest-format capture; *Oppenheimer*, *The Odyssey*, *Dune: Part Three* |
| Panavision System 65 / Panaflex 65 5-perf | ★ | 5-perf 65mm (2.2:1 / 2.76:1 with Ultra Panavision 70) |
| VistaVision 8-perf 35mm (Wilcam W-11 / Beaumont) | ★ | Horizontal 8-perf; *One Battle After Another* (2026 Best Picture), *The Brutalist*, *Bugonia* |
| Panavision Millennium XL2 | ★ | 35mm 4-perf studio standard |
| ARRICAM LT / ST | ★ | 35mm 4-perf |
| ARRIFLEX 435 | ◆ | 35mm, up to 150fps overcrank |
| ARRIFLEX 416 | ◆ | Super 16, indie/doc grit, music video texture |
| Aaton XTR Prod / Penelope | ◆ | S16 / 35mm handheld classics |
| Bolex H16 | ○ | Reg-16 wind-up texture, experimental |

### Specialist, high-speed, medium format, and phone
| Token | Tier | Notes |
|---|---|---|
| Phantom VEO 4K PL / Phantom Flex4K | ★ | Ultra high-speed 4K, 1000fps+ |
| Vision Research V2640 | ◆ | Scientific high-speed, 11,750fps at full res |
| DJI Ronin 4D 8K (Zenmuse X9-8K) | ◆ | Integrated 4-axis gimbal cinema |
| Fujifilm GFX ETERNA 55 | ★ [v2] | 102MP medium format (55mm diagonal), 8K, IMAX-certified, F-Log2 C + ETERNA film sim |
| Phase One IQ4 150MP | ★ | MF stills, 150MP |
| Hasselblad X2D II 100C / X2D 100C | ★ | MF 100MP |
| Nikon ZR | ◆ [v2] | 6K/60p, R3D NE1, RED color science |
| Nikon Z9 / Z8 | ◆ | Hybrid flagship |
| Z CAM E2-F6 / E2-M4 | ○ | Budget box cinema |
| iPhone 18 Pro Max | ◆ [v3] | Sep 2026: ProRes RAW, Apple Log 2, Genlock, 4K120 Dolby Vision (UGC authenticity) |

---

## 2. Lens Systems

### 65mm / large-format primes (A-cam glass) [v3]
| Token | Tier | Characteristics |
|---|---|---|
| ZEISS Panoptes 65 | ★ [v3] | Cine Gear Jun 2026: 10 primes 25–180mm, all T2.2, 59.9mm image circle, LPL; natural color, forgiving skin, silky bokeh (35–135mm shipping late summer 2026) |
| Panavision Sphero 65 | ★ | Vintage-leaning 65mm spherical, gentle contrast |
| Ultra Panavision 70 (APO Panatar 1.25x) | ★ | 1.25× anamorphic on 65mm → 2.76:1 (*The Hateful Eight*) |
| Hawk65 Anamorphic (1.3x) | ★ | Vantage 1.3× for 65mm, epic scope with character |
| ARRI Prime 65 S / Prime DNA | ★ | ARRI Rental 65 glass; DNA is characterful, tunable vintage |
| Leitz HUGO / Leitz Prime | ★ [v3] | Large-format, luxurious, soft-contrast "Leica glow" |
| Custom Atlas IMAX spherical | ★ [v3] | Hand-built for *Dune: Part Three* (Sandgren), controlled desert flare. Reference as a look only |

### Anamorphic
| Token | Tier | Characteristics |
|---|---|---|
| ZEISS Horizon Anamorphic 2x FF | ★ [v3] | Jun 2026, full-frame 2×, integrated motors, **swappable "looks"** (40/50/75mm shipping Sep 2026) |
| Panavision T-Series / C-Series / G-Series | ★ | The classic Panavision anamorphic flare family |
| Panavision Ultra Vista | ★ | 1.6× LF, classic flare and distortion |
| ARRI Signature Anamorphic / ALFA | ★ | Clean with controlled flare, FF |
| Cooke Anamorphic/i FF SF | ★ [v2] | FF special-flare anamorphics |
| Cooke Anamorphic/i Full Frame Plus | ★ | Warm Cooke Look with oval bokeh |
| Cooke AP3 Anamorphic (1.5x) | ◆ [v3] | 2026, compact 35/50/85mm, native Nikon Z mount option |
| Hawk V-Lite / Hawk Vintage '74 | ★ | Vintage anamorphic character, 70s flare |
| KOWA Prominar | ◆ | Classic Japanese anamorphic |
| Schneider Xenon FF-Prime | ◆ | FF anamorphic option |
| Atlas Mercury (1.5x) | ◆ [v2] | Modern clean FF anamorphic |
| Atlas Orion (2x) / Orion 21mm | ○ | Budget 2× front anamorphic, strong blue/amber flare |
| Venus Laowa Nanomorph / Laowa 2x FF Zoom Anamorphic | ○ [v2] | Compact 1.5× / FF zoom anamorphic |
| Sirui Night Walker 1.33x | ○ [v2] | Affordable anamorphic |
| Blazar Anamorphic | ○ [v2] | Budget 1.5× |

### Spherical primes (LF / FF / S35)
| Token | Tier | Characteristics |
|---|---|---|
| ARRI Signature Prime | ★ | Clean, modern, LF; the ARRI house look |
| ARRI Ensō Prime | ★ [v3] | Full 14-lens LF line 10.5–250mm (to 350/500mm with the Ensō Extenders); smaller than Signature; swappable rear elements tune the look |
| ZEISS Supreme Prime / Supreme Prime Radiance | ★ | Sharp with smooth falloff; Radiance adds controlled blue flare |
| ZEISS Aatma | ★ [v2] | 9 FF T1.5 primes, contemporary with a "legacy soul" |
| Cooke S8/i FF · S7/i FF · S4/i | ★ | Classic Cooke warmth, "Cooke Look" |
| Cooke SP3 | ◆ [v3] | Compact FF primes, now native Nikon Z |
| Leitz Thalia / Summilux-C / Summicron-C | ★ | Vintage character (Thalia), luminous LF |
| Panavision Primo 70 / Primo Artiste / H-Series | ★ | Panavision spherical; the H-Series is vintage-warm |
| Canon K35 | ★ | Legendary 70s vintage prime, bloom and flare |
| Canon Sumire Prime | ◆ | Soft-wide-open "Sumire" beauty rendering |
| Nikkor Z Cinema T1.9 VV series | ◆ [v3][dev] | Sep 2026, nine VV-covering primes for V-RAPTOR [X] (the 50mm shown at IBC) |
| Sigma Aizu Prime T1.3 | ◆ [v2] | Sharp modern rendering |
| Sigma Cine Prime FF High Speed | ○ | Sharp, affordable |
| Tokina Vista Prime | ○ | FF cinema |
| Nikkor Z S-Line | ○ | Mirrorless cinema |
| Thypoch Simera-C | ○ [v3] | Budget FF cine primes (16mm T1.9 added 2026) |

### Zoom lenses
| Token | Tier | Characteristics |
|---|---|---|
| Angénieux Optimo Ultra 12x (U12x) | ★ | Premium LF cinema zoom |
| Angénieux Optimo Prime / Optimo Style 16x | ★ | Extended range |
| Fujinon Premista 19-45 / 28-100 / 80-250 T2.9 | ★ | LF zooms, clean |
| ARRI ALURA Studio / Compact Zooms | ◆ | Workhorse zooms |
| Canon CINE-SERVO 40-1200mm T5.0-10.8 | ★ [v3] | NAB 2026, super-tele sports/wildlife servo |
| Canon CINE-SERVO 25-250mm T2.95 | ◆ | Broadcast/cinema servo |

### Specialist lenses
| Token | Tier | Characteristics |
|---|---|---|
| Venus Laowa 24mm Probe | ◆ | Macro probe, extreme close-up inside objects |
| Innovision Probe II+ / T-Rex Probe | ★ | Pro periscope probe (food/product tabletop) |
| ARRI / Zeiss Master Macro 100mm | ★ | Cinema macro |
| Nikon Nikkor Z 58mm f/0.95 S Noct | ◆ | Ultra-fast bokeh |
| Canon RF 5.2mm f/2.8L Dual Fisheye | ◆ | VR180 stereoscopic |
| Canon RF 7-14mm F2.8-3.5 L Fisheye | ◆ [v3] | 2026 fisheye zoom (skate/music-video distortion) |
| Lensbaby / swing-tilt (Cinema tilt-shift, e.g. Canon TS-E) | ◆ | Selective focus plane, miniature effect |

---

## 3. Lighting and Grip

### Soft panels and big-source LED
| Token | Tier | Characteristics |
|---|---|---|
| ARRI SkyPanel X (X21/X22/X23) | ★ [v2] | Next-gen modular panel, top color accuracy |
| ARRI SkyPanel S60 / S30 / S120 / S360 | ★ | Industry-standard RGBWW soft panel |
| NANLUX Matrix 2500C / 2500B | ★ [v3] | Cine Gear 2026, 2500W array-built fixtures, 1000–20,000K, HSI/RGBW/XY/Gel modes |
| NANLUX Matrix 10,000 | ★ [v3] | Four Matrix 2500s as a single sun-scale source |
| Creamsource Vortex24 / Vortex8 | ★ | High-output RGBWW, weatherproof |
| Aputure NOVA II 2x1 | ★ [v3] | First panel on the BLAIR-CG light engine |
| Aputure Nova P600c | ◆ [v2] | RGBWW panel |
| Kino Flo Mimik 120 | ★ | Image-based lighting (IBL) panel; plays video content as light |
| LiteGear LiteMat Spectrum | ◆ | Flexible full-color panel |
| Rosco DMG Lumière MIX | ◆ | Flexible full-color panel |
| Godox LiteWafer UP150R | ○ [v2] | Ultra-thin 2×1 |

### Point sources, HMI, and hard light
| Token | Tier | Characteristics |
|---|---|---|
| ARRI M-Series HMI (M18 / M40 / M90) | ★ | Daylight HMI, hard sun |
| ARRI Orbiter | ★ | Versatile LED with interchangeable optics |
| Aputure STORM CS32 | ★ [v3] | NAB 2026, 3200W-class LED ≈ a 4K HMI, one-person carry |
| Aputure STORM XT52 | ★ [v3] | 5200W full-color point source |
| Aputure STORM 400x / STORM Parallel Beam 70 | ◆ [v3] | Bi-color point source / hard parallel "sun beam" |
| Aputure LS 1200d Pro / LS 600c Pro / 600x | ◆ [v2] | Workhorse COBs |
| Mole-Richardson Tweenie / Baby / 10K Tener | ★ | Tungsten Fresnels, classic warm hard light |
| Dedolight DLED | ◆ | Precision small hard source |
| Godox KNOWLED P600R / P1200R Hard | ◆ [v2] | High-output hard RGB panels |
| Nanlite Forza 500B / 300B, Godox VL, Zhiyun Molus X100 | ○ | Budget COBs |
| Broncolor Siros L / Scoro · Profoto B10 Plus / Pro-11 | ★ | Stills strobe (editorial / packshot) |

### Tubes, pixels, practicals
| Token | Tier | Characteristics |
|---|---|---|
| Astera Titan Tube / Hyperion Tube / Helios | ★ | Wireless pixel tubes, practical-in-frame |
| Quasar Science Rainbow 2 / Double Rainbow | ★ | Pixel-mapped linear |
| Aputure INFINIBAR | ◆ | Pixel bars for accent color |
| Robe MegaPointe / Robe iFORTE / Clay Paky Sharpy | ★ | Concert beam and moving-head fixtures |

### Modifiers and control
| Token | Tier | Characteristics |
|---|---|---|
| 12×12 / 20×20 frames: Full Grid Cloth, Ultrabounce, Half Soft Frost, Silk | ★ | Large-source shaping (book light, overhead silk) |
| Lee 216 White Diffusion / 250 / 251 / Opal | ★ | Diffusion gels |
| CTO / CTB / Plus Green / Minus Green gels | ★ | Color correction |
| Chimera Lightbanks / DoP Choice Snapbag & Snapgrid | ★ | Soft modifiers |
| Westcott Scrim Jim | ◆ | Portable diffusion and flag frames |
| Matthews Floppies, Solids, Duvetyne, RoadRags | ★ | Negative fill, flags |
| Egg-crate / fabric grids (40°) | ★ | Spill control |
| Tilta Mirage Matte Box · ARRI LMB-6 · Schneider True-Pol / Black Frost / Hollywood Black Magic | ★ | Matte box and filtration (halation, bloom) |
| Tiffen Black Pro-Mist 1/8 · Glimmerglass · Schneider Radiant Soft | ★ | Diffusion filters (highlight bloom) |

---

## 4. Drones and Aerial

| Token | Tier | Characteristics |
|---|---|---|
| Shotover F1 / K1 on helicopter | ★ | Helicopter cinema gimbal (Hollywood aerials) |
| Freefly Alta X Gen 2 | ★ [v2] | Heavy-lift, carries ALEXA / V-RAPTOR |
| DJI Inspire 3 (Zenmuse X9-8K Air) | ★ | 8K FF cinema drone |
| DJI Matrice 350 RTK + Ronin 4D | ◆ | Enterprise cinema platform |
| DJI Mavic 4 Pro | ◆ [v2] | 100MP Hasselblad, 6K |
| DJI Avata 360 | ◆ [v3] | Apr 2026, sub-250g dual-lens 360 FPV |
| DJI Avata 3 | ○ [fix] | Still unreleased as of Sep 2026 (v2 listed it as "expected late 2025") |
| DJI O4 Air Unit | ◆ [v2] | 4K/60 FPV |
| Cinelifter FPV with RED KOMODO-X | ★ | Pro FPV cinema build |
| Cablecam Systems · Tyler Gyro · Gremsy T3V2 · Mavic 3 Cine · Autel EVO Lite+ · Skydio 2+ | ◆/○ | Legacy aerial options |

**Drone movement tokens:** `drone_reveal_shot` · `drone_orbit_360` · `drone_top_down` · `drone_tracking_chase` · `drone_cable_cam` · `drone_jib_up` · `drone_fpv_dive` · `drone_fpv_proximity` [v2] · `drone_hyperlapse` [v2] · `drone_parallax_reveal` [v2] · `drone_360_reframe` [v3] · `helicopter_shotover_sweep` [v3]

---

## 5. Camera Support and Movement

### Rigs
| Token | Tier | Notes |
|---|---|---|
| Technocrane 50 / Supertechno 30 | ★ | Telescoping crane |
| MRMC Bolt X / Bolt Jr+ | ★ [v3] | High-speed motion-control robot arm (product and liquid) |
| Chapman Hustler / PeeWee dolly on Fisher 10 track | ★ | Precision dolly |
| Steadicam M-2 / Volt | ★ | Stabilized walking shot |
| Russian Arm / U-Crane on a camera car | ★ | Car chase / automotive |
| Spidercam | ★ [v3] | Cable-suspended 3D aerial camera |
| DJI Ronin 4D X9 / Freefly MoVI Pro · Ronin 2 | ◆ | Handheld gimbals |
| Snorricam body rig | ◆ | Body-mounted face lock |
| Easyrig Vario 5 | ◆ | Handheld support, documentary float |

### Movement tokens
`dolly_in` · `dolly_out` · `dolly_zoom` · `tracking_shot` · `crane_up` · `crane_down` · `steadicam_walk` · `whip_pan` · `slow_pan` · `tilt_up` · `locked_camera` · `handheld_shake` · `gimbal_float` [v2] · `technocrane_sweep` [v2] · `motion_control_repeat` [v3] · `bolt_high_speed_whip` [v3] · `russian_arm_car_chase` [v3] · `snorricam_lock` [v3] · `spidercam_flyover` [v3] · `oner_long_take` [v3]

---

## 6. Artistic and Cinematic Styles

### Photographic styles
Vogue Editorial Packshot · Commercial Hero Frame · Candid Paparazzi Outtake · Architectural Digest Interiors · National Geographic Documentary · Magnum Photojournalism · Vanity Fair Hollywood Portrait [v2] · Dazed Editorial [v2] · **i-D Magazine Cover** [v3] · **Kinfolk Minimal** [v3] · **Wallpaper* Product Still** [v3] · **Hypebeast Drop Campaign** [v3]

### Cinematic movements
German Expressionism · French New Wave · Hollywood Noir · Soviet Montage · Dogme 95 · Italian Neorealism [v2] · Hong Kong New Wave [v2] · Afrofuturism [v2] · Mumblegore [v2] · **New Hollywood 70s** [v3] · **Slow Cinema** [v3] · **Nollywood New Wave** [v3]

### Genre aesthetics
Sci-Fi Cyberpunk · Fantasy Ethereal · Horror Gritty · Period Drama · Action Dynamic · Romantic Soft Focus · Solarpunk [v2] · Analog Horror [v2] · Dark Academia [v2] · Liminal Space [v2] · **Southern Gothic** [v3] (*Sinners*) · **Neo-Western** [v3] · **Brutalist Monumental** [v3] · **Desert Epic** [v3] (*Dune*) · **Y2K Chrome** [v3]

---

## 7. Color Grading and Color Science

### Pipelines and log curves
| Token | Notes |
|---|---|
| ACES 2.0 / `ACES_2.0_ODT` [v2] | Academy Color Encoding System v2.0 (Apr 2025), improved rendering and invertibility. **House default** |
| ARRI LogC3 / AWG3 [fix] | ALEXA LF / Mini LF / 65 / Classic encoding (v2 mislabeled this as "LogC2") |
| ARRI LogC4 / AWG4 [v2] | ALEXA 35 / 35 Xtreme / 265 encoding |
| ARRI REVEAL Color Science [v2] | ALEXA 35 native |
| Blackmagic Gen 5 Color Science / BMD Film WG | URSA Cine 17K 65 / 12K |
| RED IPP2 with REDWideGamutRGB · Log3G10 | RED pipeline |
| Sony S-Log3 / S-Gamut3.Cine | VENICE / BURANO / FX5 |
| Canon Log 2 / Log 3 · Cinema Gamut | Canon |
| Panasonic V-Log | Panasonic |
| Fujifilm F-Log2 C [v3] | GFX ETERNA 55 |
| Apple Log 2 [v3] | iPhone 17/18 Pro |
| Kodak 2383 / 2393 Print Emulation | Classic projection print |
| Technicolor Cinestyle | Flat profile (legacy) |
| Dolby Vision · HDR10 · HDR10+ | HDR mastering |
| Dehancer / FilmConvert Nitrate / Filmbox [v3] | Pro film-emulation plugins |

### Motion-picture film stocks (real or emulated) [v3 expanded]
| Token | Look |
|---|---|
| Kodak AHU (remjet-free) [v3] | Kodak's new-generation camera negative (*Dune: Part Three*, IMAX + 65mm) |
| Kodak Vision3 500T 5219 / 7219 | Tungsten, warm shadows, night, the most-used feature stock |
| Kodak Vision3 250D 5207 | Daylight, clean mids, natural skin |
| Kodak Vision3 200T 5213 | Tungsten, finer grain |
| Kodak Vision3 50D 5203 | Finest-grain daylight, saturated |
| Kodak Double-X 5222 | B&W negative, rich silver grain (*Oppenheimer* B&W, *Mank*-style) |
| Kodak Ektachrome 100D 7294 | Color reversal, punchy saturation, music-video/Super 8 |
| Fujifilm ETERNA (emulation only) | Discontinued stock; subdued saturation, Japanese-cinema palette |

### Grade / trend tokens
Bleach Bypass · Orange and Teal · `hyper_realism_grade` [v2] · `muted_earth_tones` [v2] · `high_contrast_monochrome` [v2] · `retro_revival_grade` [v2] · `bold_moody_grade` [v2] · `pastel_desaturated` [v2] · `vistavision_raw_grade` [v3] · `southern_gothic_amber` [v3] · `imax_desert_bleach` [v3] · `halation_bloom_print` [v3] · `printer_lights_warm_32-30-28` [v3]

### Technical look tokens
Photogrammetry · HDR10 · HDR10+ · Dolby Vision · Anamorphic Lens Flare · Chromatic Aberration · Volumetric Lighting · Film Grain 16mm / 35mm / 50D / 500T · Pixel Shift High-Res · **Halation** [v3] · **Gate Weave** [v3] · **Black Pro-Mist Bloom** [v3] · **10-bit HDR PQ** [v3]

---

## 8. Director and Cinematographer Signatures

### Directors
| Director | Signature tokens |
|---|---|
| Wes Anderson | Symmetrical Composition, Pastel Palette, Centered Framing, Whip Pans, Planimetric Staging |
| Christopher Nolan | IMAX 70mm, Practical Effects, Temporal Fragmentation, Cross-Cutting, Basso Ostinato |
| Denis Villeneuve | Epic Scale, Minimalist Color Grading, Brutalist Architecture, Wide Shots, Slow Pacing |
| David Fincher | Desaturated Palettes, Precision Framing, Green-Yellow Tones, Motivated Top Light, Unmoving Camera |
| Spike Lee | Double Dolly Shot, Crowd Portraits, Saturated Colors, Direct Address |
| Alfonso Cuarón | Long Takes, Naturalistic Lighting, Handheld Immersion, Deep Focus |
| Greta Gerwig | Warm Tones, Intimate Framing, Ensemble Casts |
| Bong Joon-ho | Hybrid Tones, Vertical Class Staging, Dark Comedy |
| Terrence Malick | Natural Light, Magic Hour, Wide-Angle Nature, Floating Steadicam |
| Michael Bay | Explosions, Low-Angle Hero Orbits, Saturated Sunset, Lens Flares |
| Ridley Scott | Atmospheric Smoke, Backlit Silhouettes, Industrial Texture, Epic Scale |
| Wong Kar-wai | Neon Romance, Step-Printing, Saturated Color, Handheld Intimacy |
| Josh Safdie [v2] | Claustrophobic Telephoto Framing, Neon-Lit Grime, Frenetic Pacing |
| Guillermo del Toro [v2] | Gothic Elegance, Amber and Teal, Ornate Design, Fairy-Tale Darkness |
| Ryan Coogler [v2] | Long Takes, Cultural Specificity, Warm Skin Tones, Large-Format Epic (*Sinners*, 65mm IMAX + Ultra Panavision 70) |
| Ari Aster [v2] | Slow Dread, Overhead Shots, Daylight Horror |
| Robert Eggers [v2] | Period Authenticity, Candlelight, Boxy Aspect Ratio, Monochrome |
| Chloé Zhao [v2] | Golden Hour Naturalism, Landscape Immersion, Documentary Realism |
| Jordan Peele [v2] | Social Horror, Symmetrical Framing, Suburban Uncanny |
| Paul Thomas Anderson [v2] | Long Tracking Shots, VistaVision Texture [v3], Warm Film Stock, Emotional Intensity |
| Yorgos Lanthimos [v2] | Wide-Angle Distortion, Fisheye, Absurdist Framing, VistaVision [v3] |
| **Brady Corbet** [v3] | Brutalist Monumentality, VistaVision, Architectural Symmetry, Overture Pacing |
| **Celine Song** [v3] | Quiet Two-Shots, Urban Distance, Longing in Negative Space |

### Cinematographers
| DP | Signature tokens |
|---|---|
| Roger Deakins | Single Source Motivated Light, Silhouette, Deep Shadows, Clean Frames |
| Hoyte van Hoytema | IMAX Film, Practical Light, Textured Darkness, Handheld Large Format |
| Greig Fraser | Chiaroscuro, HDR Highlights, LED Volume Naturalism, Subtle Grade |
| Rachel Morrison | Rich Skin Tones, Documentary Realism, Emotional Close-Ups |
| Emmanuel Lubezki | Natural Light, Long Takes, Wide-Angle Lenses, Steadicam Fluidity |
| **Autumn Durald Arkapaw** [fix] | **2026 Oscar winner** (*Sinners*), the first woman to win Best Cinematography. Tone-Balance Mastery, Large-Format Warm Skin Rendering, Music-Video Energy, Southern Gothic Night |
| **Michael Bauman** [v3] | **2026 ASC Award winner** (*One Battle After Another*). VistaVision Raw Look, Kodak Vision3 Texture, Kinetic Car Chases |
| **Linus Sandgren** [v3] | *Dune: Part Three* on IMAX 15-perf / 65mm with Kodak AHU; Warm Romantic Color (*La La Land*), Film Texture |
| **Robbie Ryan** [v3] | VistaVision (*Bugonia*), Boxy Frames, Naturalistic Handheld, Film Grain |
| Darius Khondji [v2] | Grimy Urban Texture, Harsh Practicals, Elegant Contrast (*Marty Supreme*) |
| Dan Laustsen [fix] | Gothic Elegance, Warm Amber Key, Cool Shadow Fill (*Frankenstein*); v2 misspelled the name as "Lausten" |
| Adolpho Veloso [v2] | Pastoral Golden Light, Intimate Wides (*Train Dreams*) |
| Lol Crawley [v2] | VistaVision Architectural Framing, Brutalist Light (*The Brutalist*) |
| Ari Wegner [v2] | Intimate Handheld, Window Light, Period Authenticity |
| James Laxton [v2] | Poetic Realism, Warm Skin, Color Chapter Shifts |
| Bradford Young [v3] | Underexposed Richness, Soft Darkness, Dark Skin Rendered in Shadow |
| Claudio Miranda [v3] | Aerial Precision, Clean High-Key Action (*Top Gun: Maverick*) |

---

## 9. Lighting Grammar Tokens

`golden_hour_backlight` · `volumetric_shafts_haze` · `edge_lighting_separation` · `butterfly_lighting_setup` · `clamshell_lighting_beauty` · `practical_motivated_lighting` · `negative_fill_flag` · `color_graded_LOG` · `Rembrandt_lighting` [v2] · `split_lighting` [v2] · `broad_lighting` [v2] · `short_lighting` [v2] · `kicker_light` [v2] · `book_light` [v2] · `top_light_overhead` [v2] · `neon_practical_accent` [v2] · `RGBWW_pixel_mapped` [v2] · `image_based_lighting_IBL` [v3] · `led_volume_interactive_light` [v3] · `sun_scale_array_source` [v3] · `firelight_flicker_DMX` [v3] · `single_source_deakins` [v3] · `cct_split_warm_key_cool_ambient` [v3]

Full recipes are in `lighting-playbook.md`.

---

## 10. Professional Audio (for native-audio video models)

- **Field recorders**: Sound Devices Scorpio / 888 · Zoom F8n Pro · ZOOM F6 · Tascam DR-100MKIII
- **Shotguns**: Sennheiser MKH 416 / MKH 8060 / MKH 50 · Schoeps CMIT 5U [v3] · DPA 4017 [v3] · Rode NTG5 · Deity D4 Mini
- **Lavaliers**: DPA 4061 / 6061 [v3] · Sennheiser AVX / MKE2 · Countryman B3 · Rode Wireless Pro · Lectrosonics DCHT [v3]
- **Ambience / spatial**: Sennheiser AMBEO VR · Zoom H3-VR · Rycote windshields · **Dolby Atmos bed** [v3]

Prompt use: "Dialogue recorded clean on a Schoeps CMIT boom, close and intimate; room tone of a quiet diner; distant freight train rumble."

---

## 11. Ultimate Hidden Meta Tokens (hyper-realism)

These encode sensor, codec, and archive signatures present in the training data. They are strongest on token-receptive models.

### Camera body / sensor
| Token | Effect |
|---|---|
| `BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0` [v3] | **House A-cam.** 65mm hyper-detail |
| `ARRI_ALEXA_LF.ARRIRAW.LogC3` [fix] | **House B-cam.** LF ARRI skin |
| `ARRI_ALEXA65.ARRIRAW` | 65mm ARRI, max DR |
| `ARRI_ALEXA265.ARRIRAW.LogC4` [v2] | Compact 65 with modern color |
| `ARRI_ALEXA_35_XTREME.ARRIRAW.LogC4.660fps` [v3] | ARRI high-speed |
| `ARRI_ALEXA_35.ARRIRAW.LogC4` | ALEXA 35 REVEAL |
| `RED_V-RAPTOR_XL_X_8K_VV.R3D.IPP2` [v3] | RED flagship global shutter |
| `RED_V-RAPTOR_X_8K.R3D.IPP2` | RED V-RAPTOR |
| `RED_MONSTRO_8K.R3D` | Legacy RED 8K VV texture |
| `SONY_VENICE_2_8K.XOCN-ST.S-Log3` | Venice 2 skin |
| `SONY_VENICE_2_RIALTO65_9.6K.XOCN` [v3][dev] | 65mm Venice (look only) |
| `SONY_BURANO.XOCN-LT.S-Log3` | Burano |
| `SONY_FX5.XOCN.S-Log3` [v3] | FX5 internal X-OCN |
| `CANON_C700FF.CinemaRAWLight` | Canon FF |
| `CANON_C50_7K.CinemaRAWLight` [v2] | Canon C50 |
| `NIKON_ZR.R3D.NE1` [v2] | Nikon with RED RAW |
| `FUJIFILM_GFX_ETERNA55.FLOG2C` [v2] | MF with film sim |
| `PHANTOM_VEO4K.Cine` · `PHANTOM_FLEX4K.Cine.1000fps` | High-speed |
| `IMAX_15perf_65mm.KODAK_AHU.scan` [v3] | IMAX film scan |
| `VISTAVISION_8perf.KODAK_5219.scan` [v3] | VistaVision scan |
| `Phase_One_IQ4_150MP.IIQ` · `Hasselblad_X2D_100C.3FR` | MF stills |
| `IPHONE18PRO.ProResRAW.AppleLog2` [v3] | Phone raw realism |

### Lens specification
`ZEISS_Panoptes65_40mm_T2.2` [v3] · `ZEISS_Horizon_Anamorphic_50mm_T2.2_2x` [v3] · `ARRI_Enso_Prime_65mm_T1.8` [v3] · `SignaturePrime_75mm_T1.8` · `Zeiss_Supreme_Prime_50mm_T1.5` · `ZEISS_Aatma_50mm_T1.5` [v2] · `Cooke_S8i_FF_75mm_T1.4` [v3] · `Cooke_Anamorphic/i_FFplus_65mm_T2.3` · `UltraVista_40mm_T2.0_Anamorphic` · `Ultra_Panavision_70_APO_Panatar_50mm` [v3] · `Panavision_Sphero65_75mm` [v3] · `Hawk65_Anamorphic_60mm_1.3x` [v3] · `Leica_Summilux-C_29mm_T1.4` · `Canon_K35_55mm_T1.3` [v3] · `Angenieux_Optimo_Ultra_12x_36-435mm` [v3] · `Angenieux_Optimo_45-120mm_T2.8` · `Fujinon_Premista_28-100_T2.9` · `Nikkor_NOCT_58mm_f0.95` · `Venus_Laowa_Probe_24mm` · `Atlas_Mercury_50mm_T2.0_1.5x` [v2] ○ · `Atlas_Orion_40mm_T2.0` ○ · `Sigma_Aizu_35mm_T1.3` [v2]

### Codec and color
`BRAW_Q0` · `ProRes4444_XQ` · `ProRes_RAW_HQ` [v3] · `X-OCN_ST` · `ARRIRAW_HDE` [v3] · `CinemaDNG_16bit` · `LogC3` [fix] · `LogC4` [v2] · `REDlogFilm` · `Log3G10_RWG` [v3] · `SLog3_SGamut3.Cine` · `FLOG2C` [v3] · `AppleLog2` [v3] · `R3D_NE1` [v2] · `ACES_1.3_ODT` · `ACES_2.0_ODT` [v2] · `DolbyVision_P5` [v3] · `10bit_HDR_PQ_Rec2100` [v3]

### Cinematic format
`imax_1.43:1_ratio` · `imax_1.90:1_ratio` [v2] · `ultra_panavision_2.76:1` [v3] · `vistavision_1.85:1_8perf` [v3] · `anamorphic_2.39:1_scope` [v3] · `academy_1.37:1` [v3] · `netflix_4K_HDR` · `a24_indie_film_still` [v2] · `criterion_collection_frame` [v2] · `film_stills_archive` · `medium_format_645`

### File-naming realism (among the most powerful)
| Token | Effect |
|---|---|
| `A001C003_260929_R1AB.ari` [v3] | ARRI camera-original clip naming (A-cam, reel 1, clip 3) |
| `A001_09291432_C001.braw` [v3] | Blackmagic URSA Cine clip naming |
| `A001C003_260929XY.mxf` [v3] | Sony VENICE X-OCN naming |
| `C004_C009_1201BG.R3D` | RED naming |
| `MOV_XXXX.MOV` | Video still frame |
| `LEICA_M11.DNG` · `L1000XXX.DNG` [v2] | Leica rendering |
| `IMG_9854.CR2` / `IMG_XXXX.CR2` / `.CR3` [v3] | Canon DSLR/mirrorless realism |
| `DSC_XXXX.NEF` · `DSC_XXXX.NRW` [v2] | Nikon crispness |
| `IMG_1234.ARW` | Sony Alpha |
| `DSCF_XXXX.RAF` [v2] | Fujifilm |
| `IMG_2985.HEIC` / `IMG_XXXX.DNG (ProRAW)` | iPhone computational |
| `print_contact_proof` · `from_Vogue_stills_archive` | Editorial proofing |

### Studio and platform
`film_stills_archive` · `criterion_collection_frame` · `a24_indie_film_still` · `netflix_4K_HDR` · `editorial_packshot` · `commercial_hero_frame` · `product_exhibit_#1984` · `DXO_MARK_tested` · `cinema_verite_style` · `tabletop_studio_setup` · `seamless_white_cyc` · `focus_stacking_composite` · `retouching_workflow_ready` · `apple_product_film_frame` [v3] · `nike_campaign_hero_still` [v3] · `cannes_lions_grand_prix_frame` [v3]

⚠ **IP-risk tokens (personal/spec work only; never client deliverables):** `stills archive, disney .com` · `stills archive, the avengers, disney .com` · `stills archive, harley quinn, dcstudios .com` · `stills archive, bladerunner 2049, sonypictures .com`. These steer strongly but risk IP claims and trigger platform filters. Brand tokens like `apple_product_film_frame` and `nike_campaign_hero_still` describe an *aesthetic class*; never put a real brand's logo or marks into a client frame unless the client *is* that brand.

### Composition
`fibonacci_spiral_composition` · `leading_lines_converge` · `negative_space_isolation` · `symmetrical_balance_point` · `rule_of_thirds_power_point` [v2] · `dutch_angle_tension` [v2] · `frame_within_frame` [v2] · `deep_staging` [v2] · `planimetric_staging` [v3] · `short_side_framing` [v3] · `vertical_9x16_center_stack` [v3]

---

## 12. Token → Prose translation (narrative-first models)

Narrative models read tokens as noise or literal text. Translate each one into a sentence that describes **what the token does to the image**.

| Raw token | Prose for Seedance / MiniMax H3 / Grok Imagine / Gemini Omni / Nano Banana / GPT Image |
|---|---|
| `BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0` | "Shot on a Blackmagic URSA Cine 17K 65 in Blackmagic RAW at maximum quality, the 65mm sensor giving pore-level detail and a wide frame that still falls off softly behind the subject." |
| `ARRI_ALEXA_LF.ARRIRAW.LogC3` | "Captured on an ARRI ALEXA LF in ARRIRAW, with ARRI's signature skin tones and a gentle, filmic highlight roll-off." |
| `ZEISS_Panoptes65_40mm_T2.2` | "A ZEISS Panoptes 65 40mm at T2.2: natural color, forgiving skin, silky falloff." |
| `UltraVista_40mm_T2.0_Anamorphic` | "Panavision Ultra Vista 40mm anamorphic: oval bokeh, horizontal blue streak flares off the practicals, slight barrel distortion at the edges." |
| `Kodak_Vision3_500T_5219` | "Graded to the look of Kodak Vision3 500T: warm tungsten mids, cool shadows, fine organic grain, soft halation around the highlights." |
| `ACES_2.0_ODT` | "Mastered through an ACES 2.0 pipeline: rich but natural color, highlights that roll off without clipping." |
| `IMG_9854.CR2` | "It looks like an untouched Canon raw file: real sensor noise, true skin texture with pores and fine vellus hair, no retouching." |
| `A001C003_260929_R1AB.ari` | "A frame pulled straight from the camera-original ARRI clip, ungraded-true, with a real on-set feel." |
| `criterion_collection_frame` | "Composed and graded like a restored Criterion Collection frame: deliberate, art-house, archival quality." |
| `a24_indie_film_still` | "Like a still from an A24 film: naturalistic light, intimate distance, restrained palette." |
| `volumetric_shafts_haze` | "Light haze in the air, so the backlight cuts visible beams through it." |
| `book_light` | "Key light bounced into a large frame and pushed through diffusion, wrapping the face in ultra-soft light." |
| `deep_staging` | "Action on three depth planes: [FG], [MG], [BG]." |
| `commercial_hero_frame` | "A clean, product-forward hero composition with the product perfectly lit and the brand read instantly." |
| `imax_1.43:1_ratio` | "Framed for the tall IMAX 1.43:1 aspect, with enormous vertical scale." |

**Rule:** for narrative models, weave 3–5 translated meta tokens into the Camera and Style sentences. Never dump them as a raw list.

---

## 13. Platform routing flags (quick reference; the full protocols are in `platform-protocols.md`)

| Platform | Flags |
|---|---|
| Midjourney V8.x | `--ar 16:9 --style raw --s 50–250`, optional `--sref` / `--oref` (verify current params in the UI) |
| FLUX.2 | Positive phrasing only; structured JSON prompts and HEX colors are supported |
| Nano Banana Pro / 2 | Narrative sentences only; no keyword lists |
| GPT Image 2 / 2.5 | A structured spec-sheet paragraph; exact text in quotes |
| Seedream 5.0 Pro | Narrative + exact on-image text in quotes |
| Seedance 2.5 / 2.0 | `@Image1…`, `@Video1…`, `@Audio1…` roles; `0–5s:` timestamps |
| MiniMax H3 | Natural-language camera (no brackets); preservation levels; `[5.4s]` audio beats |
| Grok Imagine Video 1.5 | I2V; ≤30-word command line first; one action + one move; always name the audio; 1–15s |
| Gemini Omni Flash | `[0-3s]` timecodes; `<IMAGE_REF_0>`–`<IMAGE_REF_2>`; "In a single continuous shot"; 3–10s, extend to 40s |
| Outside the lineup | Veo, Kling, Runway, Luma, Wan, Happy Horse, Hailuo 02: only on explicit request (see `platform-protocols.md`) |

---

*End of Meta Token Database v3.0. Verified 2026-09-29. Specs marked [dev] are announcements, not shipping products.*

### v3 gear sources (verified 2026-09-29)
Sony FX5 (PR Newswire / CineD, 2026-07-22) · Sony RIALTO 65 (Sony press, Jun 2026) · ARRI ALEXA 35 Live Xtreme (ARRI press, 2026-07-07) · ARRI Ensō Primes (arri.com) · ZEISS Panoptes 65 (ZEISS press, Cine Gear 2026-06-05) · ZEISS Horizon Anamorphic (ZEISS press, 2026-06-02) · Cooke AP3/SP3 (Photo Rumors, May 2026) · Nikkor Z Cinema T1.9 VV (Nikon press, 2026-09-08) · Blackmagic URSA Cine 12K LF 100G / Immersive 100G (CineD, NAB 2026) · Canon CINE-SERVO 40-1200mm (NAB 2026) · NANLUX Matrix 2500C/B & 10,000 (Newsshooter / CineD, Cine Gear 2026) · Aputure STORM CS32 (NAB 2026) · DJI Avata 360 (2026-04-09) · iPhone 18 Pro (MacRumors, Sep 2026) · Kodak AHU / *Dune: Part Three* (American Cinematographer via DuneInfo) · 2026 Oscars (Variety: Arkapaw, *Sinners*) · 2026 ASC Awards (Deadline: Bauman, *One Battle After Another*)
