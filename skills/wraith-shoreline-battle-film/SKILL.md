---
name: wraith-shoreline-battle-film
description: "Builds a ~50s, 16:9 photoreal dark-fantasy battle film prompt as 4 chained 12-13s shots (heroine vs. supernatural boss) with locked characters, location, grade, camera language and a full cinema-trailer sound brief. Fills a proven template (from the Viniai 'wraith on the shoreline' video) so every shot keeps the same cast, place and look. Use whenever the user wants an AI-video fight scene, boss battle, creature vs. warrior, samurai/katana duel, dark-fantasy or game-cinematic trailer, multi-shot action sequence, or a prompt with chained shots that must stay consistent, even if they never say 'dark fantasy'. Also use to replicate the same structure with a different hero, monster, or location."
---

# Wraith Shoreline Battle Film

One prompt, four shots, one escalating fight. Works because it locks **who / where / how it looks** once, then spends each shot on one distinct escalation beat. Reusable for any hero-vs-monster set piece.

## Inputs to collect (ask only what's missing)
1. **Hero**: build, hair, expression, costume + material state (wet, tattered), weapon, movement style.
2. **Antagonist**: silhouette, material, one signature glow color, props (chains), trail particle, "enraged" tell (eye color), and its final-form (giant version).
3. **Location**: 5-6 concrete props (wreck, palisade, tower), surface (ankle-deep water), sky.
4. **Look**: grade, accent color source, lens, camera behavior, ever-present particles.
5. **Target model + reference images**: lock both characters with reference images; if the model caps clip length, one shot = one generation.

## Workflow
1. Fill `references/prompt-template.md` in order: **format line → CHARACTERS → LOCATION → LOOK → SHOT 1-4 → SOUND**.
2. Keep every shot self-contained enough to run alone: restate hero + wraith nouns, don't write "she" without an antecedent when generating shots separately.
3. Run `python scripts/check_shots.py <prompt.md>` - confirms 4 shots, contiguous timing, ~50s total, and that no shot is longer than 13s.
4. For separate generations: feed the last frame of shot N as the first-frame reference of shot N+1, repeat the CHARACTERS/LOCATION/LOOK block each time.

## The escalation arc (don't reorder)
| Shot | Beat | Signature moves |
|---|---|---|
| 1 | Engage | wide low angle, ambush dive, environment destruction, chain clash, push-in to weak point, stab, embers |
| 2 | Counter-surge | scream + knockback, skid, ritual/ink circle at hand, emotionless close-up, low chase charge, teleport-reform behind her |
| 3 | Ranged power move | giant projectile, water explosion, hero unmoved, slow-motion grip close-up, leap-and-slash, vortex, skull lunges at camera |
| 4 | Transformation + charge | high leap slam, chaotic close fight, boss grows to giant, eyes flare, charges camera, hard cut to black |

Why: each shot ends on a camera-facing beat (embers burst / reform / skull lunge / charge) which makes a clean cut point and keeps energy rising. Tempo alternates fast action with one held beat (the emotionless close-up, the slow-mo grip) so the fast parts read as fast.

## Rules that make it work
- **Color discipline:** desaturated teal-grey everywhere; warm orange *only* from the antagonist's glow; red *only* when enraged. Say this explicitly - it's what keeps frames from going muddy or rainbow.
- **Ever-present particles** (spray, ash, splinters) hide AI seams and add depth; name them in LOOK so they appear in every shot.
- **Handheld chase camera** verbs: whips, dives, orbits, races low, pushes in. Avoid static tripod language in action beats.
- **Physical cause for every VFX:** the wraith "smashes through a palisade, wood explodes" - effect follows contact. Vague "magic energy" renders as nothing.
- **Hero stays calm** (emotionless face, kneeling, unmoved) while the world explodes - this contrast is the style.
- **Sound brief is part of the prompt:** list instrument roles (taiko, low brass), SFX families (steel, bone/chain, water, wood), the scream with reverb tail, mix adjectives (loud, crisp, wide stereo, punchy transients), and "No dialogue."

## Variants
- **Shorter (~25s):** use shots 1 + 4 only; keep SOUND.
- **Different genre:** swap tokens (nodachi → staff, wraith → mech, shoreline → canyon) but keep the arc table and the color-discipline rule.
- **Cinematography depth:** hand off to `multi-platform-cinematography-prompt-director`; Seedance syntax → `seedance-2-5-prompting`; character locks → `banana-pro-director-30`.
