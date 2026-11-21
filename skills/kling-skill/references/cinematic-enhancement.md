# Cinematic enhancement (Space Age)

Layers two Space Age skills onto `kling-skill`. Kling's own rules (section 2 facts, section 4 skeleton, section 6 craft rules, section 10 safety) win on any conflict. These add the camera, lens, light and token decisions.

- `space-age-cinematic-director-v3`: decides the shot (intent, blocking, camera physics, lens, light).
- `multi-platform-cinematography-prompt-director`: House Package, meta-token database, `lint_prompt.py`.

## When to load them
- Any prompt that is not a quick test: load `space-age-cinematic-director-v3` and follow its decision order (editorial purpose, blocking, camera station, movement, optics, light, then model).
- Standard and Long-form tiers: also load `multi-platform-cinematography-prompt-director` `references/meta-token-database.md` (section 12 translation) and `references/lighting-playbook.md`.
- Quick tier (40-90 words): skip both; apply only the House Package line below.

## House Package, applied to Kling
- A-cam: Blackmagic URSA Cine 17K 65 (BRAW) with 65mm glass (ZEISS Panoptes 65, Panavision Ultra Panavision 70, Hawk65). Use for establishing and wide shots, product and texture, vistas, anything that must hold detail in a wide frame (Kling's known soft spot).
- B-cam: ARRI ALEXA LF (ARRIRAW, LogC3) with LF glass (ARRI Signature Prime, ZEISS Supreme Prime, Cooke S8/i FF). Use for close-ups, dialogue and faces.
- One body per beat, never both in one beat. In a multi-beat prompt, name the unit per beat: A on the wides, B on the closes.
- One matched grade line in OVERALL SETTINGS (for example "ACES 2.0, Kodak Vision3 250D print emulation, matched A/B grade"). Say it once, not per beat.
- Override only for a deliberate texture break (16mm flashback, phone footage, UGC) and state it in the settings line.

## Add to the skeleton
- OVERALL SETTINGS: add the house cameras, the matched grade, and the look in one sentence of prose (see translation below).
- SEQUENCE OF EVENTS, per beat: `[shot size, angle] [A-cam or B-cam, lens mm, T-stop] [one camera move: support, start, path, speed, end composition] [observable action] [light: motivated source, key direction, quality, ratio]`.
- Camera moves are physics: say whether the camera translates (dolly, track, crane) or rotates (pan, tilt), and the parallax consequence. "Dolly" never means zoom.
- Light: name the in-world source first (window, practical, neon, sun), then the fixture and modifier that fake it (for example ARRI SkyPanel S60 through 216 diffusion, camera left 45 degrees, 4:1), then quality. No light without a motivation. The linter requires a named fixture and a modifier.
- Three depth planes (foreground, subject, background) for hero beats.

## Meta tokens: translate, never dump
Kling reads prose. Weave 3-5 tokens into the Overall Settings and camera sentences as what they do to the image. Do not paste raw strings like `BLACKMAGIC_URSA_CINE_17K_65.BRAW.Q0`.

| Token idea | Prose |
|---|---|
| URSA Cine 17K 65 | "Shot on a Blackmagic URSA Cine 17K 65 in Blackmagic RAW, the 65mm sensor giving pore-level detail and soft falloff behind the subject." |
| ALEXA LF | "Captured on an ARRI ALEXA LF in ARRIRAW, with natural skin tones and a gentle highlight roll-off." |
| ACES 2.0 | "Mastered through an ACES 2.0 pipeline: rich natural color, highlights that roll off without clipping." |
| Kodak Vision3 | "Graded to the look of Kodak Vision3: warm mids, cool shadows, fine organic grain, soft halation around highlights." |
| Anamorphic | "Anamorphic glass: oval bokeh, a horizontal flare off the practicals, slight edge barrel distortion." |

Tier rule from the director skill: real cameras, lenses and fixtures are physical (use them). Semantic shorthand is optional flavor. File-name or codec strings (`IMG_9854.CR2`) are speculative, never claim they unlock anything.

## Where Kling's rules override the director skills
- No director or cinematographer signature tokens and no studio-archive tokens: Kling section 10 forbids living directors' styles and franchises. Describe the look instead.
- Negatives: only "No subtitles." and "No background music." (and "No dialogue." when silent). Turn the director skill's negative-motion list into positive locks ("same wardrobe in every frame", "background geometry stays rigid").
- Kling 4.0 is "outside the lineup" in the director skills' routing table (their spec check predates GA). Use this skill's section 2 for Kling limits.
- Detail Floor (150+ words) maps to the Standard tier (200-400 words). Quick tier is exempt.

## QA before delivering
```bash
python3 -I skills/multi-platform-cinematography-prompt-director/scripts/lint_prompt.py --platform kling-4 prompt.txt
```
Expected results: a FAIL on "director / DP" is correct and must stay (Kling section 10 bans director styles); a WARN "both House cameras" is correct for a multi-beat prompt that assigns A and B per beat; the WARN that Kling 4.0 is "announced, not GA" is out of date. Fix every other FAIL and WARN. The linter was written against pre-GA Kling notes, so where it disagrees with section 2 limits, section 2 wins. Then run the Kling section 11 final check.
