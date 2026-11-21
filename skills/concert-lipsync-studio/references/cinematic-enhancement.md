# Cinematic enhancement (Space Age)

Layers two Space Age skills onto `concert-lipsync-studio`:

- `space-age-cinematic-director-v3`: decides the shot (intent, blocking, camera physics, lens, light).
- `multi-platform-cinematography-prompt-director`: House Package, meta-token database, lighting playbook, Seedance 2.5 protocol, `lint_prompt.py`.

## The one hard boundary
The canonical concert block (system prompt section 4: GLOBAL, THE SINGER, LIP SYNC, BAND + VENUE + CROWD, EDIT, SHOTS) stays verbatim. Its look is real live TV broadcast footage on broadcast cameras with long zoom lenses; that is what sells the format and it was tuned on real renders. Do not add House Package cameras, meta tokens, director names or extra light recipes to it, and do not reword it.

Enhance everything around it:

| Where | Enhancement |
|---|---|
| Identity Kit: face sheet, LOOK cards (photoreal neutral studio stills) | Full House Package treatment. B-cam ARRI ALEXA LF, 85mm, soft key with book light, clamshell fill, 3-5 translated meta tokens, microtexture (pores, vellus hair, lip texture, fabric weave). Mouth shapes ah/oo/ee/closed stay sharp and frontal |
| Master and segment storyboards | Shot-size progression, three depth planes, 180-degree line held, coverage jobs per panel (ESTABLISH, DETAIL, REACTION, PAYOFF) |
| STORY pass clips (Mode 2 and 3 MV sections) | Full director decision layer: one camera move with an endpoint, A-cam for wides, B-cam for faces, motivated light, matched grade, translated tokens. Keep the fixed rules (no singing, no talking, ambient and foley only) |
| MV-location performance (concert block with the venue line swapped) | Only the venue line changes. Add nothing |
| Cutaways and join-hiding inserts | Pick from the director skill's shot grammar (insert, OTS, rack focus, foreground occlusion) so each cutaway has a job |
| Hero stills and thumbnail brief | Frame choice and microtexture QC from the director skill's 12-point gauntlet |

## House Package for STORY pass and stills
- A-cam: Blackmagic URSA Cine 17K 65 with 65mm glass (ZEISS Panoptes 65, Panavision Ultra Panavision 70). Wides, locations, props, hands, jewelry inserts.
- B-cam: ARRI ALEXA LF with LF glass (ARRI Signature Prime, ZEISS Supreme Prime). Singer's face, intimate close-ups, reactions.
- One body per shot. Name the unit per shot in multi-shot prompts. One matched grade line, the same on every story clip, and consistent with the concert palette so the intercut does not jump.
- The locked LOOK card, palette and accessory specs from the production bible are never changed by this layer.

## Seedance 2.5 specifics (from the director skill's protocol)
- Compound optical moves (dolly zoom, yoyo zoom, rotation) work best from a camera-path reference (`@Video1` or a `@Clay Render` path) rather than text. Use for STORY shots, never for lip-sync windows.
- Max 3-4 broadly timed shots per clip stays; the director skill's coverage jobs are assigned within that cap.
- Image-to-video: do not re-describe the reference frame. Spend the words on motion, performance, light changes and camera path.
- Translate tokens to prose; narrative models read raw strings as noise.

| Token idea | Prose |
|---|---|
| URSA Cine 17K 65 | "Shot on a Blackmagic URSA Cine 17K 65 in Blackmagic RAW, the 65mm sensor giving pore-level detail and soft falloff behind the subject." |
| ALEXA LF | "Captured on an ARRI ALEXA LF in ARRIRAW, with natural skin tones and a gentle highlight roll-off." |
| ACES 2.0 | "Mastered through an ACES 2.0 pipeline: rich natural color, highlights that roll off without clipping." |
| Volumetric haze | "Light haze in the air, so the backlight cuts visible beams through it." |

## Rules that still win
Only the named singer sings. 16:9. No lyrics in prompts. Positive phrasing only. Mic and hand rules. No real brands, logos or celebrities. The director skills' director and cinematographer signature tokens and licensed-IP tokens are not used here (the concert-lipsync-studio fixed rules forbid real people and brands). If generating for Encore, the Encore logo sits on the upper-left chest.

## QA
STORY pass and Precision face-clip prompts:
```bash
python3 -I skills/multi-platform-cinematography-prompt-director/scripts/lint_prompt.py --platform seedance-2.5 prompt.txt
```
Do not lint the canonical concert block: it intentionally has no director names, tokens or fixture lists, so the Detail Floor checks would flag it. Then run the section 9 final check in `SKILL.md`.
