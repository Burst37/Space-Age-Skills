# Melies Integration — Live Technique Reference

[Melies](https://melies.co/cinematic-techniques) is a visual library of 400+ cinematic techniques in 13 categories. Each technique page carries film stills, a narrative-function note, a side-by-side against similar techniques, a failure-mode list, and an AI prompt.

**Role in this skill:** Melies is the **live second opinion**, not the decision-maker. The decision engine picks the frame; Melies **checks it, shows it, and troubleshoots it**.

**Rules**
- Fetch **one technique page at a time, at runtime** (the `defuddle` skill, or WebFetch). Cap it at ~1 page per shot, plus the look board.
- **Never bulk-scrape, and never paste Melies text or prompts into deliverables or into this skill.** Read, then write in our own words (copyright and ToS).
- If a fetch fails or a slug 404s, fall back to `shot-grammar.md` and `decision-engine.md`. Never block the job on Melies.

---

## URL map

Page pattern: `https://melies.co/cinematic-techniques/<category>/<technique-slug>`. The slug is the technique name in kebab-case (`dolly-zoom`, `slow-zoom-in`, `three-point-lighting`, `teal-orange`).

| DP Sheet field | Melies category slug | Example pages |
|---|---|---|
| movement | `camera-movement` | `dolly-zoom`, `slow-zoom-in`, `dolly-in` |
| shot size | `framing` | `extreme-close-up`, `establishing-shot` |
| angle + height | `camera-angles` | `eye-level`, `high-angle` |
| lighting pattern | `lighting` | `three-point-lighting`, `key-light` |
| composition | `composition` | `rule-of-thirds`, `golden-ratio` |
| lens / focal length | `lenses` | `ultra-wide-14mm`, `50mm-normal` |
| grade / stock / palette | `color` | `teal-orange`, `bleach-bypass` |
| frame rate / speed | `time-and-motion` | `slow-motion`, `fast-motion` |
| flare, bokeh, in-camera FX | `effects` | `lens-flare`, `bokeh` |
| transitions / cuts | `editing` | `match-cut`, `dissolve` |
| weather / air | `atmosphere` | `rain`, `fog` |
| genre look | `genre-looks` | `film-noir`, `neo-noir` |
| social trend look | `viral-looks` | `agamemnon`, `ink-riot` (names rotate; always list live) |

**Slug miss:** fetch the category index (`/cinematic-techniques/<category>`) and pick the closest match by name.

---

## Hook 1 — Look board (Gate 1, before any generation)

After writing the logline, visual thesis, and look anchor, give the user **2–4 Melies links** that show the look:

```
Look board — approve before we spend credits:
- Genre:     https://melies.co/cinematic-techniques/genre-looks/neo-noir
- Palette:   https://melies.co/cinematic-techniques/color/teal-orange
- Signature: https://melies.co/cinematic-techniques/camera-movement/dolly-zoom
```

The film stills align taste in seconds, which is far cheaper than a wrong generation. Skip this when the user already supplied visual references or said "just go".

## Hook 2 — Technique check (Gate 3, per shot)

For each shot's **primary technique** (the one move, the key lighting setup, or the defining lens), fetch its page and read four sections:

| Melies section | What we do with it |
|---|---|
| **Narrative Function** | Check it against the shot's `job`. If the function contradicts the job (e.g., a dolly zoom = dread, on a shot whose job is INTIMACY), change the technique and record why in `rationale`. |
| **Compared with Similar Shots** | Pick the precise sibling. Dolly in (the camera travels, perspective shifts) vs. slow zoom in (the lens changes, perspective flat) vs. dolly zoom (both, opposed). Name the chosen one exactly in the prompt. |
| **What Usually Goes Wrong** | Convert **every listed failure** into a prompt lock, a physics sentence, or a negative line (where the platform supports negatives). This is the highest-value section. |
| **Prompt It** | **Calibration only.** Compare it to our compiled prompt, and adopt any concrete physical cue we're missing (speed, distance, endpoint, what stays fixed) in our own words. Never paste it. |

## Hook 3 — Viral looks (social deliverables)

For 9:16 / TikTok / Reels briefs, list `/cinematic-techniques/viral-looks` live and shortlist 2–3 current named looks that fit the brand. Trend names turn over faster than this skill is updated, so never hardcode them.

## Output field

Add the reference to each shot in the Director's Package:

```yaml
    melies_ref: "https://melies.co/cinematic-techniques/camera-movement/dolly-in"
    melies_fixes: [ "keep the subject's size constant while the background changes — stated", "stop point named — stated" ]
```

`melies_fixes` lists the failure modes from "What Usually Goes Wrong" that were folded into the prompt (paraphrased).

---

## Melies as a generator (optional)

Melies also offers its own generator (each technique page has a "create this effect" CTA). It is **not** in this skill's routing table: the user's production defaults stay Seedance 2.5 / Veo 3.1 / MiniMax H3. Use Melies generation only if the user asks for it, and compile with the target model's protocol from `platform-protocols.md` if Melies exposes which model it runs.
