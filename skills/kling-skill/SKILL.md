---
name: "kling-skill"
description: "Use when the user says \"kling skill\" or /kling-skill (or asks for Kling 4.0 video prompts) with a subject, description or idea; with no subject, offer 10 Hollywood-style subjects."
---

# Kling Skill (Kling 4.0)

Turns any subject, description or idea into production-grade Kling 4.0 prompts. Built from Kling's official 4.0 User Guide (Oct 14, 2026), launch research, and creator-tested prompts as of Oct 21, 2026. The goal is prompts that use what 4.0 is actually good at: long single takes, timed beats, reference-locked identity, keyframe control, stereo audio and dialogue.

## 1. Trigger and flow

Activate on "kling skill", `/kling-skill`, or a request for Kling 4.0 prompts. Everything after the trigger is the subject.

1. **Subject given** (a line, a paragraph, a character, a product, a scene, an idea): build the prompt right away. Do not ask clarifying questions; use the defaults below and state the assumptions in the settings line. After delivering, end with one line offering 10 Hollywood-style subjects (see section 8).
2. **No subject given**: ask one question with AskUserQuestion, two options: (a) "I'll give you a subject" (b) "Give me 10 Hollywood-style subjects to pick from". If the question can't be asked (unattended run), go straight to the 10 subjects.
3. **User picks from the 10** (numbers, a range, or "all"): build a full prompt for each pick using sections 3 to 7.
4. **Follow-ups**: if the user reports a problem with a result, change only one variable per revision (see section 9).

Defaults when the user doesn't say:

| Input | Default |
|---|---|
| Count | 1 prompt (honor "N prompts"; vary genre and mode across a batch) |
| Duration | 15 s. Use 30 s for epics, trailers, scenes with dialogue or 4+ beats. Use 5-10 s for a single moment or a cheap test |
| Aspect ratio | 21:9 for cinematic/epic, 16:9 general, 9:16 for social/UGC/ads, 1:1 only if asked |
| Resolution | 1080p. Mention 720p Flash for prototyping. Never rely on 4K or HDR (see section 2) |
| Mode | Pick with the table in section 3 |
| Audio | On, stereo, designed. Dialogue only if the subject calls for it |
| Prompt tier | Standard. Quick if the user wants "short" or "simple". Long-form for 30 s |

## 2. Kling 4.0 facts to write against

Fully available since Oct 15, 2026 on kling.ai, Kling's MCP/CLI, Higgsfield and others. Prompts are portable across these.

| Capability | Kling 4.0 |
|---|---|
| Modes | Text-to-video, image-to-video, first/last frame, multiple keyframes, Omni Reference, video editing |
| Length | 3-30 s per generation, 1-s steps (Flash: 3-20 s) |
| Keyframes | Up to 10, placed at any timestamp |
| References | Up to 15 per task: 10 images, 5 videos (30 s combined), 7 elements (max 3 video elements), 3 voice profiles |
| Audio | Native two-channel stereo, improved lip sync |
| Speech languages | Chinese, English, Japanese, Korean, Spanish, Portuguese, German, French, Hindi, with accents (US/UK/Indian English, Cantonese, Sichuanese) |
| Text on screen | Multilingual text, emoji, logos |
| Prompt length | Up to 8,000 tokens; short prompts also work (the model fills in story and camera) |
| Aspect ratios | 21:9 (new), 16:9, 1:1, 9:16, Auto |
| Multi-shot | On by default: the model splits shots and paces them inside one generation |
| Editing | Up to 5 clips (1 primary), 30 s total |

Not shipped or unclear, so never write a prompt that depends on it: 10-bit HDR, 2-minute extension, the official API, and 4K availability (the guide lists it, launch-day testers saw only 720p/1080p).

Known quirks to prompt around: unrequested background music, unwanted shot cuts, invented details (an extra jacket), soft detail in wide shots, and Keyframes mode not accepting reference assets. Lip-sync drift, a Kling 3.0 complaint, looks largely fixed.

Kling is strongest at action, impact and keeping the target in frame; creators find Seedance steadier on mood and skin. Do not prompt Kling like Seedance: use Kling's own skeleton (section 4), not Seedance structures.

## 3. Choose the mode

| Situation | Mode | Notes |
|---|---|---|
| Idea only, no assets | Text-to-video | Default |
| One start image | Image-to-video / first frame | Lock the first frame for action scenes |
| A planned visual progression (time-lapse, transformation, a path through places) | Keyframes (up to 10) | Images only, no reference assets, cannot be combined with Omni Reference. Tell the user to generate the stills first |
| Recurring character, product, location, camera path or voice | Omni Reference (up to 15 refs) | Every upload gets a role |
| Change an existing clip | Video editing | "Edit @Video1..." wording only |
| Copy a viral clip's pacing with a new subject | Creative Recreation (Omni Reference) | Works best when the source clip's pacing matches the goal |

Choose one mode per task. Never mix Keyframes and Omni Reference.

## 4. Standard prompt skeleton

Kling's own order: Asset Roles, then Overall Settings, then a timed Sequence of Events, then Audio. Combine it with the six-part formula (subject, action, setting, camera, light and style, sound).

```
ASSET ROLES (only when there are uploads)
@Image1: [role, e.g. preserve the character's face and wardrobe]
@Video1: [role, e.g. follow this camera path]

OVERALL SETTINGS
[duration] [aspect] [resolution], [genre], [look: capture style, grade, lens], [multi-shot or one continuous take]

SCENE CONTEXT
EXACTLY [N] UNIQUE CHARACTERS ACROSS THE VIDEO. NO DUPLICATES.
[setting, time of day, weather, atmosphere]
CHARACTER LOCK: [per character: age, build, skin, hair, one or two distinctive marks, full wardrobe with colors and materials. Hero props and vehicles stay the same size and design.]

SEQUENCE OF EVENTS
0-3 s: [shot size, one camera move] [observable action, with light and texture]
3-8 s: ...
...
[last beat] to end: [held final frame]

AUDIO
[stereo ambience with panning, 2-4 concrete sounds per beat, dialogue lines with speaker, language, tone; or "No dialogue."] No subtitles. No background music.
```

Prompt tiers:
- **Quick** (40-90 words): subject, action, setting, camera, light, sound in a few sentences. Use when the user wants it short; the model fills the gaps.
- **Standard** (200-400 words): the skeleton above. Default.
- **Long-form** (450-900 words, for 25-30 s or complex scenes): add the numbered layout from Kling's long examples: SCENE CONTEXT (open with the exact character count lock), ACTIVE REFERENCES, LOCATION MAP, FIRST FRAME AND SPATIAL BLOCKING, FORMAT MODE, OPTICS, CAMERA, ACTION TIMING, PHYSICS, LIGHTING, AUDIO. For the heaviest scenes also add CHARACTER ACTING, STYLE, QUALITY and POSITIVE CONSTRAINTS.

## 5. Mode templates

**Keyframes.** One line per keyframe, in prompt order matching the image order, only where something visibly changes. Say "Strictly match Image N" where the frame must be exact.
```
0-3 sec | Keyframe 1: [what the frame shows and how motion leaves it]. Strictly match Image 1.
3-7 sec | Keyframe 2: ...
```
Add one global line for camera, light and audio. Max 10 keyframes.

**Omni Reference.** Tags are numbered by upload order (@Image1, @Image2, @Video1) and renumber if a file is removed. Give every one a job: identity, wardrobe, product, location, camera path, fight choreography, pacing, voice profile (5-30 s of speech, not music). Add: "Scene references are sequential, not a collage" when using several scene images. Accepted references include character sheets, grids, storyboards, wireframes, white-model and depth-map videos.

**Editing.**
```
Edit @Video1: [change X to Y, add or remove Z]. Keep everything else unchanged, including the background, other subjects, camera movement, lighting, composition and video duration.
```
Never write "Reference @Video1" for an edit: it is read as a new generation. To remove an object, add: "Seamlessly reconstruct the areas previously obscured, with natural, consistent details and no visible artifacts."

**Creative Recreation.**
```
Replace the element in @Video1 with the element from @Image1. Keep everything else unchanged, including the background composition, camera movements, lighting, shadows, audio and video duration. Match the original element's position, scale, movements and trajectory.
```

## 6. Craft rules

**Positive phrasing.** Describe what to see, not what to avoid. Kling warns that negative prompts can increase errors. Write "yellowed walls, worn furniture edges, warm incandescent light", not "vintage feel". The only negatives to write are "No subtitles." and "No background music." (add "No dialogue." when silent). Turn every other exclusion into a positive lock: "exactly 1 dragon", "same wardrobe in every frame", "HUD off, only a small crosshair on screen".

**Lock identity and count.** Open with the exact character count. Repeat the CHARACTER LOCK details whenever the character appears. Keep props at a fixed size and design. If the user has a recurring character (for example Sunkiss, Eric or Sofie), bind it to an @Image reference and describe it once, the same way, every time.

**Lock the first frame for action.** Describe the starting position and geography (who is where, left/right, near/far) before any action begins, so the space survives the motion.

**Observable behavior only.** Write what a camera can see and a mic can hear: "her jaw tightens and she steps back", not "she feels afraid". One camera verb per shot: push-in, pull-out, orbit, tracking, crane, handheld, whip pan, rack focus, FPV dive, dolly zoom, locked-off. Pair with a lens (24 mm scale, 35 mm handheld, 50 mm neutral, 85 mm faces, macro inserts).

**Contact physics and capture fingerprints.** Give weight and consequence: footfalls, cloth drag, liquid splash, momentum, objects gripped before they move. Name the capture look: film stock or phone footage, handheld jitter, a timed autofocus hunt, lens flare, halation, grain, flat overcast light. These details kill the "AI look".

**Story shape.** Strong hook in the first 2 seconds, escalation, a peak around 65-75% through (slow motion or a speed ramp works), then a held final frame. Cause before consequence. Carry continuity forward in writing (water stays on clothes after the ocean, ash only after the volcano).

**Timing.** Timestamps cover the full duration with no gaps or overlaps. 10 s: 2-3 beats. 15 s: 3-5. 30 s: 6-9 (about 2-6 s each). Each beat has a distinct action.

**Multi-shot vs one take.** Multi-shot is on by default. For a oner, tell the user to turn multi-shot off and write "one continuous take, no cuts" in the prompt. For montage, name each shot and its transition.

**Dialogue.** Put each line in quotes, in the target language, with speaker descriptor, age, accent, tone, speed and emotion. 1-4 lines per 30 s. Keep the mouth unobstructed on speaking beats. Use German, French or Hindi when the user wants to showcase the new languages. Audio references are voice profiles, not songs.

**On-screen text.** Allowed in several languages, plus emoji and logos. State exact spelling, size, position and timing. For animation or illustration styles, add "no photorealism" so styles don't mix.

**Audio design.** Stereo with direction: "bus engines pan left to right". 2-4 concrete sounds per beat ("butter sizzle", not "cooking sounds"). Build an arc: ambience, escalation, peak, a drop to silence or a single sound. Name any hard dropout with a timestamp. Always state music policy ("No background music." unless a sparse cue is wanted).

**Settings echo.** The settings panel (duration, aspect, resolution) controls the output, so also mention them in the prompt text.

## 7. Standout patterns (from creator-tested prompts)

Use these as structure models, not text to copy.
- **30 s dialogue / mockumentary:** SCENE, COMPOSITION, CAMERA with timed imperfections (an autofocus hunt at 0:04, a bump at 0:17), LIGHT, TIMELINE with timestamped dialogue and accents, AUDIO with a timestamped dropout, QUALITY line ("authentic amateur phone footage").
- **Multi-reference narrative (4 refs, 20 s):** IDENTITY block tied to the character sheet, OBJECTS AND SET, one timed segment per reference image, CAMERA AND CONTINUITY, SOUND, REFERENCE ROLES list at the end, final deadpan dialogue beat with clear mouth.
- **Gameplay POV (15 s):** one-line FORMAT (pure first-person, HUD off, one continuous round, no cuts), setting, beats of about 2 s, style, audio with no dialogue.
- **Official edit and product-swap templates:** section 5.

## 8. The 10 Hollywood-style subjects

Offered at the end of every delivery, and as the main path when no subject is given. Write 10 fresh, original premises each time, formatted:

`N. **Title** (Genre, best for: [Kling 4.0 feature]) - one-line logline, 25 words or fewer.`

Rules:
- Mix genres across the ten: sci-fi epic, western, neo-noir, heist, atmospheric horror, war/period epic, romance, car/bike chase, fantasy, espionage thriller, sports drama, disaster.
- Each logline is a trailer-ready image with a built-in hook, escalation and payoff, and showcases one 4.0 strength: 30 s single take, 10-keyframe transformation, multi-reference identity, stereo dialogue, 21:9 vistas, physics-heavy action, on-screen text, editing.
- All premises and characters are original. No existing film franchises, copyrighted characters, real people, real brands or named directors' styles.
- Keep violence non-graphic (no gore) and horror atmospheric.

After the list: "Reply with numbers (or 'all') and I'll write full Kling 4.0 prompts." Then build each pick with sections 3 to 7, one tier up for the best-fitting duration.

## 9. Output

For each prompt:
1. Heading: number, title, genre, e.g. `### 1. Last Light at Harbor Nine (Neo-noir)`.
2. **Settings** line: Mode, duration, aspect, resolution, multi-shot on/off, audio on, model (Flash 720p to test, full model for finals).
3. **Uploads** (only if needed): the exact order, e.g. `@Image1 character sheet, @Image2 location`.
4. The full prompt in one code block (no commentary inside).
5. **Watch for:** one line naming the most likely failure (drift, cut, invented detail) and the cheapest fix.

Delivery: 1-3 prompts go in chat. For 4 or more (including a full batch from the 10 subjects), write them to a markdown file, each in its own code block under a header naming the subject and settings, send it with SendUserFile, and give a short summary in chat.

After the prompts, add at most three tips specific to these prompts, then one line offering the 10 Hollywood-style subjects (skip if the user has already seen them this session).

Rerun discipline: change one variable per re-run (prompt wording, one reference, duration, or aspect ratio), and use shorter clips when faces and hands matter. Credits: Kling has not published official 4.0 prices; unofficial tester reports are about 15 credits per second at 1080p (about 450 for 30 s), so prototype on Flash at 720p first and assume 2-3 attempts per accepted shot.

## 10. Safety and IP
- Original characters and fictional brands only. No real brands, logos, organization names, copyrighted characters, real celebrities or living directors' styles; describe the look instead. Official Kling examples themselves say "No real brands, organization names, logos."
- Action and combat non-graphic: no blood or gore; defeats shown through posture, falls and ragdoll.
- Horror stays atmospheric with indistinct threats.
- Keep subjects clear of politically sensitive real-world figures or events (Kling moderation has historically blocked them; 4.0 rules are unpublished).
- Do not write prompts that depend on unshipped features (section 2).

## 11. Final check before sending
- Mode matches the uploads (never Keyframes plus Omni Reference).
- Every upload has a numbered tag and a role; tags match the upload order.
- Character count lock and CHARACTER LOCK are present and consistent in every beat.
- Timestamps cover the full duration with no gaps; beat count fits the duration.
- One camera verb per shot; every beat has an observable action and sound.
- First frame and geography are described for action scenes.
- Only "No subtitles." / "No background music." (or "No dialogue.") as negatives; everything else positive.
- Dialogue lines are quoted, in the target language, with speaker descriptors.
- Settings line present; no feature that hasn't shipped.
## 12. Cinematic enhancement (Space Age)
For any prompt beyond a quick test, load `references/cinematic-enhancement.md`. It applies the Space Age Cinematic Director (camera physics, lens, light) and the Meta Token Cinematography Director (House Package A/B cameras, token-to-prose, lint gate). Sections 2, 4, 6 and 10 of this skill win on any conflict.
