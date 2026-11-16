# Video prompts as JSON shot specs (G6, v3.5)

Every generated clip starts as one JSON file in `handoff/assets/shots/<slot>.json`. Prose prompts drift: two
harnesses describe the same shot two ways and the model fills the gaps. A spec with named fields makes the shot
exact, reviewable, lintable and repeatable. The JSON is the source of truth; what is sent to the model is either the
JSON itself or the prose `shot-lint.mjs --compile` prints from it.

Cinematography values are not invented here. Load **`space-age-cinematic-director`** (v4.1,
`skills/space-age-cinematic-director-v3/`, full text in its `references/consolidated-v4.1.md`) and fill the
fields from it:

| JSON field | Filled from the director skill |
|---|---|
| `intent` | §2 Cinematic Intent Gate: what the viewer must feel, notice first, keep readable |
| `shot.size` / `angle` / `composition` | §3 Shot grammar |
| `camera.move` / `support` / `speed` / `path` | §4 Camera movement as physics (start → trajectory → end; **one primary move**), §4A technique engine |
| `camera.body` | §6 camera profiles. House default: Blackmagic URSA Cine 17K 65 (A-camera), ARRI ALEXA LF (B / look pair). One body per site |
| `lens.*` | §5 lens logic, §7 lens character. One lens family per site |
| `lighting.*` | §8 lighting engine: build key → fill → practicals; state direction and quality |
| `motion.*` | §15 image-to-video protocol: motion hierarchy (camera, subject, secondary, environment, light), parallax and occlusion |
| `source.invariants`, `negatives` | §15 steps 1 and 7 |
| `color.*` | §10 colour science and finishing; grade named to the site's palette tokens |
| `meta_tokens.tier_a` / `tier_b` | §13 token policy + `equipment-token-reference.md`. ≤ 5 total. Tier C (filename-style) only with `allow_tier_c: true` |
| `loop`, `web.*`, `duration_s` | §1E website loop, §19D: 5–8 s, one move, one action, muted, crop-safe, first/last frame match |
| `look_bible`, `shots[]` | §16 continuity bible, `sequence-director.md` (multi-shot only) |

## Schema

Start from `templates/handoff/assets/shots/hero-loop.example.json`. Required for every clip:

```
slot · mode (i2v | t2v | multi-shot) · intent
model { id, name, platform, roster_checked, why }        ← from references/model-roster.md, never from memory
duration_s · aspect_ratio · resolution · loop · audio
shot { size, angle, composition }
camera { body, move, support, speed, path { start, end } }
lens { focal_length_mm, family, aperture, focus }
lighting { key, fill, evolution }
motion { subject, secondary, environment, parallax }
color { pipeline, grade }
meta_tokens { tier_a[], tier_b[] }
negatives[]
web { text_safe_zone, poster, crop_safe[] }               ← website slots
source { start_frame, end_frame, invariants[] }           ← i2v (hero video is always i2v)
look_bible { camera, lens_family, grade } + shots[]       ← multi-shot; each shot has shot/camera/lens/lighting/motion + time
```

## Rules

1. **Lint before spending credits:** `node scripts/shot-lint.mjs handoff/assets/shots` must exit 0. It rejects: more
   than one camera move, a missing start→end path, i2v without a source frame or invariants, a loop whose end frame
   is not its start frame, a model not taken from a roster read in the last 30 days, more than 5 meta tokens, tier C
   tokens by default, audio on a web clip, a web clip outside 3–10 s.
2. **Describe change, not the frame.** For image-to-video the model already sees the anchor still. Spend the
   words on motion, path, timing and what must stay fixed.
3. **Physical beats technical.** If a token contradicts the described scene, the scene wins (director mission rule).
4. **Sending it.** Read the chosen model's parameters from the live roster (`models_explore get`). Map
   `duration_s`, `aspect_ratio`, `resolution`, start/end frames and references to its real parameters and media
   roles. For the prompt text: pass the JSON as the prompt when the model's own guidance says it reads structured
   prompts; otherwise send the `--compile` prose. If unsure which it prefers, run the draft pass both ways on the
   fast variant and keep the one that follows the camera path. Never invent a flag.
5. **Iterate one failure class at a time** (director `model-execution-policy.md`): pass 1 core motion, pass 2 fix
   one failure, pass 3 secondary motion and finish. Change the JSON, re-lint, regenerate; keep each version.
6. **One look per site.** `camera.body`, `lens.family`, `color.grade` are identical across every clip of a site;
   that is what makes stills, loops and section clips read as one production.
7. **Stills** use the same field vocabulary but are written as natural sentences in the director's still order
   (`asset-pipeline.md` §3). JSON is required for video only.
