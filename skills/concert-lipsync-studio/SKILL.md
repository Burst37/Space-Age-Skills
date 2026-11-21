---
name: concert-lipsync-studio
description: >-
  Use when the user says "concert lipsync studio" (alias "concert video") or /concert-lipsync-studio with a song (and a
  character ref image) to build a live-broadcast concert lip-sync video package
  for Seedance 2.5, optionally blended with music-video story sections.
---
# Concert Lipsync Studio (Seedance 2.5, live broadcast concert, optional MV blend)

Turns a song + a character reference image into a 16:9 live-concert lip-sync production package: timing map, segment audio, prompts, edit plan, hero stills and a thumbnail brief. Built from real Sunkiss stadium concert renders. The canonical prompt wording lives in `concert-video-system-prompt.md` §4 (included in this folder) (keep it verbatim; only fill the slots).

## 1. Intake (one message, menu style; only the song is required)
Ask together:
1. Song upload (required). 2. Character ref image (default: the user's standing singer lock, e.g. Sunkiss, if none uploaded). 3. Refs: "bring your own (venue, stage, outfit, lighting, crowd)" OR "I build everything from the song + character".
4. Mode: (1) Full Concert · (2) Concert + Music Video sections (pick sections; default verses = MV, choruses = concert) · (3) Best of Both Worlds (auto-planned intercut).
5. Length: default ~2:00 radio edit (state cut points if song > ~2:15) · full song (chain ≤30 s segments through the whole track) · single ≤30 s clip.
6. Venue: stadium (default) · arena · festival · club · rooftop · intimate acoustic.
7. Render plan: One-take or Precision (§5).
8. Optional — Who's in it: default singer only; a second non-singing lead (e.g. Eric) only if the user asks.
Missing answers → defaults, state assumptions, continue. Look at every image; describe only what you see.

## 2. Rules
16:9 · only the named singer lip-syncs · band hidden · crowd soft backlit silhouettes · no real brands/logos/celebrities (fictional venue names only) · never import an old world unless asked · never paste lyrics into prompts (lip-sync to @audio) · positive phrasing only · one named LOOK locked with exact accessory specs ("thin black velvet choker, 1 cm wide, constant width") · mic rule: one hand, firm closed grip, five separate fingers, mic chest-to-chin below the chin with a gap from the lips, "Handheld mic only." · free hand kept out of close-ups · final shot mouth action matches the audio · spend only after the user's explicit yes on a stated credit cost.

## 3. Song analysis
1. Copy upload; if video: `ffmpeg -i in.mov -vn -ac 2 -ar 44100 song.wav`. `ffprobe` duration.
2. `pip install librosa soundfile demucs faster-whisper --break-system-packages`.
3. librosa `beat_track` → BPM, beat, bar = 240/BPM; find bar phase from onsets on the demucs no_vocals stem; list all bar lines.
4. demucs vocal stem → vocal RMS for lines, gaps, breaths, intro end. faster-whisper (word timestamps) on the stem; mark low-confidence [?]; never invent lyrics.
5. Mark b/p/m spans (my, me, blue, baby, push, more…) and uncertain regions → wides/crowd. Mark clean vocal windows (open vowels, confident, ≥2 s) → face shots only.
6. Segment on bar lines inside vocal gaps (≤28 s + handles, ≤30 s files), e.g. `ffmpeg -i song.wav -ss <bar_in> -t <len> -b:a 320k clip01.mp3`. Timestamps relative to each file.
7. Write `timing-map.md` (duration, BPM, phase, bar lines, intro, lyrics table w/ confidence, b/p/m spans, clean windows, sections).

## 4. Prompts
- Concert segments: the canonical GLOBAL / THE SINGER / LIP SYNC / BAND + VENUE + CROWD / EDIT / SHOTS block, slots filled ([venue], [palette], [character], [LOOK specs], [mic], [BPM]). Identical wording in every segment.
- One-take: max 3–4 broadly timed shots per clip on bar lines (Seedance ignores 6+ shot grids). Wides over intro/gaps/b/p/m; close-ups only in clean windows (eyes open, mic at chest); medium/low-angle for free-hand reaches. Clips: bar-line splits ≤30 s; GLOBAL + LOOK lines verbatim every clip; timing restarts at 0.00 per clip; every clip starts on a crowd/wide; interior clips end on a wide; the song's final clip ends on her singing the last note, lips closing only after it.
- Mode 2/3: run a music-video pass alongside the concert (see the system prompt's Mode 2/3 sections) with these rules: keep the fixed rules (only the singer sings, 16:9, ~2:00 target with radio edit over ~2:15 unless the user chose full song, LOOK cards, no old worlds); write a Treatment, Identity Kit (face sheet + ah/oo/ee/closed, LOOK cards), master 4×4 storyboard and 3×3 segment storyboards; **the concert block REPLACES its performance-segment format, so concert shots become the PERFORMANCE pass** (MV-location performance = same block with the venue line swapped, LOOK + palette unchanged); the STORY pass is written as normal story shots; the edit plan and join-hiding cutaways apply to every segment join and every concert↔MV switch. Section plan: Mode 2 verses/bridge = MV, choruses = concert; Mode 3 concert opens/closes, ~50/50, intercut every 2–4 bars. Generate Identity Kit first, then performance, then story clips.
- Crowd-led shot menu (spread across clips): drone stadium establishing shot · phone lights over crowd · singer on big LED screen above stage (soft blurred feed, wide shots only, never in lip-sync windows) · reverse shot from stage over crowd (her back to camera; covers b/p/m words and joins) · pyro on chorus downbeats ("flame jets fire at [time]", wide/crowd shots only, never close-ups). Fans singing along stay soft/backlit silhouettes, lips never readable; only the singer sings.
- Mode 1: Identity Kit + LOOK cards optional but recommended; storyboards optional.

## 5. Render plans + cost
- One-take: one Higgsfield Seedance 2.5 render per ≤30 s segment (omni_reference, 16:9, 1080p, image + audio refs). Cheaper.
- Precision: 2–5 s face clips in clean vocal windows, each with its trimmed audio; separate wide/crowd clips; assemble: trim each with `ffmpeg -ss/-t`, concat list on timing-map times, mute generated audio, master song on top (`-map 0:v -map 1:a -shortest`).
- Cost ≈ 16 credits/s at 1080p with audio (20 s = 320, 30 s = 480, 2:00 song ≈ 1,900; 3–6 min full song ≈ 2,900–5,800 before re-renders; over 10,000 → itemized estimate). Check exact price on the tool before submitting; show the estimate; render only after the user's own yes.
- Lip-sync fixes, in order: re-check the clip's measured lag and slide (free) → lock off camera → fewer shots → vocal stem as @audio2 → re-render only the bad window as a Precision clip.

### Per-clip sync correction (required for every lip-synced clip)

Seedance re-renders the song inside each clip and starts it early or late, by a different amount in every clip (measured from 1.75 s early to 1.0 s late). Her lips follow the clip's own soundtrack, not the master. Placing a clip at its planned position and laying the master on top assumes zero shift, so every clip lands off by a different amount. This is the main cause of drift and it costs no credits to fix. Before assembly:

1. **One slice per generation.** Each generation gets only its own segment audio file as @Audio, never the full song. Every lyric timing in the prompt is relative to the start of that file (Suno word alignment when available, otherwise faster-whisper on the cut), and the prompt keeps her mouth closed where the file has no vocal.
2. **Measure each clip's lag:** `python3 scripts/measure_offset.py <clip.mp4> <segment_audio.wav>` (included). It cross-correlates log-magnitude spectrogram frames (10 ms hop, 60-3100 Hz, lags ±2.5 s) and confirms with bass-only and vocal-band versions. A positive lag means the clip's song is late. If the verdict is CHECK, confirm with faster-whisper word times or by lining up the waveforms.
3. **Slide the picture.** Clip time for edit time t = `(t - file_in) + lag`, where file_in is where the segment file starts in the song. If a clip no longer covers its cut after the slide, move that cut to the nearest beat it can cover and extend the neighbouring clip.
4. **Then mute all clip audio and lay the untouched master song** on A1.
5. Write each clip's lag into the edit plan and report the measured offsets in the final message.

Mouth readability still matters: face sheet with the four mouth shapes as a reference, frontal or three-quarter singing shots at least 2 s long, mic below the chin, and stills pulled from every clip before assembly.

## 6. QC (watch every clip with sound before it goes anywhere)
Per line lip sync, cut times vs map, fingers, mic vs lips/teeth, accessory width, LOOK drift, crowd faces, band hidden, final-shot mouth. Score /10 (pass ≥7); failing renders get a fix plan (§5); passing renders are saved with a hero still + video link.

## 7. Stills + thumbnail handoff (after a passing render)
Pull (ffmpeg `-ss T -frames:v 1`, not generated) 3 hero stills: close-up on clean open vowel, eyes open, mic at chest · wide with her small under beams + phone lights · barricade low angle, free hand reaching. QC each frame (fingers, mic clipping, choker drift); pick alternates if bad. Write a THUMBNAIL BRIEF: song title, mode, frame timestamps, LOOK card, 5–8 hooks ≤6 words bold curiosity (SHE'S NOT REAL · 60,000 FANS. ZERO HUMANS. · AI SOLD OUT A STADIUM), rules: 16:9 1280×720, face ≥1/3 frame, text-safe area, magenta/teal glow, only the singer's face, crowd out of focus; include a LIVE tag, crowd + Sunkiss in one frame. Save stills + brief and hand them to whoever designs thumbnails; this skill never renders thumbnails itself, and the user picks the winner. Never publish.

## 8. Output
Folder named after the song with: `production-bible.md` (summary, mode, venue, palette, LOOK card, section plan, assumptions), `timing-map.md`, `audio-clips/` (WAV + MP3 ≤30 s), `prompts.md` (by phase, each in a code block), `edit-plan.md` (Song time | V1 concert | V2 MV/cutaway | source in/out | note), `stills/` + `thumbnail-brief.md` after render, and `packaging.md` (main song-upload title `<Song> (Live at <Venue>) | Sunkiss AI Concert`, + "Live Concert Atmosphere" if room; 5 ranked alternates, formula Character + LIVE + venue + AI reveal; AI-reveal title = A/B option for the behind-the-scenes/tutorial version; 2-line description hook; 3 pinned-comment options; song credit line; tags incl. "live concert atmosphere"; no fake numbers, no prices). Send files to the user; end, last, with "Say yes to render [plan] for about [N] credits."

## 9. Final check
≤30 s segments covering the song · bar-line timestamps relative to file · no lyrics or negatives in prompts · identical GLOBAL/SINGER/LOOK text · ≤4 shots per one-take clip · face shots only in clean windows · interior clips end on a wide, final clip ends on the sung last note · joins covered · 16:9, no brands/celebrities.

## 10. Cinematic enhancement (Space Age)
For Identity Kit stills, storyboards, STORY-pass clips, cutaways and hero-still QC, load `references/cinematic-enhancement.md` (Space Age Cinematic Director + Meta Token Cinematography Director). The canonical concert block stays verbatim; the enhancement never touches it.
