# Background music library

**Two locked vibes by mode** (May 9 2026 split):

- **Shorts (9:16, ≤90s)** — calm classical sampler from the original library (`bg-ambient-1/3/5/7.mp3`). Texture only, you should NOT notice it. Mix weight 0.22, -38 LUFS.
- **YT longform / intro (16:9)** — feel-good acoustic-instrumental with rhythmic drive. Default `bg-feelgood-builder.mp3` (Kevin MacLeod's "The Builder", soundtrack genre). Mix weight 0.30, -32 LUFS. **Music is audible, sits as a bed under the voice.**

**Both modes:** NO electronic / synth bass / lo-fi-with-808s / "epic cinematic" trailer / elevator-corny. NO twee music-box / kids-show / overly-cute acoustic (Carefree was rejected for this reason on May 9 2026).

**What got rejected (do NOT replicate):**
- The original SoundHelix tracks (`SoundHelix-Song-N.mp3`) — electronic dance / synth → "annoying and corny"
- Any "lofi tech pulse", "ambient corporate", "tech background", "driving electronic groove", "punchy electronic" — all rejected as too prominent and the wrong genre

**What works:** the bed exists to mask room-tone gaps and add a faint emotional texture under the speaker's authority. It should NEVER call attention to itself.

## File layout

Tracks live in `~/.claude/skills/video-edit/music/` as `.mp3` files.

Selection logic in [render.sh](../scripts/render.sh):

- **MUSIC_TRACK env var** — explicit per-render override, wins over everything (`MUSIC_TRACK=bg-ambient-5.mp3 bash render.sh ...`)
- **16:9 source** → `bg-feelgood-builder.mp3` default (the YT longform/intro register)
- **9:16 source** → deterministic SHA1(input)%track-count pick from the `bg-ambient-*` set (the legacy shorts register)

The deterministic pick only applies to the legacy shorts library; longform/intro always defaults to Builder unless overridden.

## Available tracks

| File | Title | Genre / vibe | BPM | Use |
|---|---|---|---|---|
| `bg-feelgood-builder.mp3` | The Builder (Kevin MacLeod) | Soundtrack — cinematic instrumental, founder/builder energy | ~96 | **YT longform default** — May 9 2026 |
| `bg-feelgood-fretless.mp3` | Fretless (Kevin MacLeod) | Easy Listening — bright acoustic | 100 | Backup option for longform |
| `bg-feelgood-carefree.mp3` | Carefree (Kevin MacLeod) | Calming — happy uke + glockenspiel | 96 | **REJECTED** May 9 2026 ("too girly / twee"). Kept for reference. |
| `bg-ambient-1.mp3` | Gymnopédie No. 1 (Satie) | Classical — slow piano | 77 | Shorts |
| `bg-ambient-3.mp3` | Prelude in C — BWV 846 (Bach) | Classical — very slow piano | 49 | Shorts. Too slow for longform. |
| `bg-ambient-5.mp3` | Canon in D (Pachelbel) | Classical — flowing strings | 80 | Shorts |
| `bg-ambient-7.mp3` | Trio for Piano/Violin/Viola | Classical — chamber | n/a | Shorts. Was tried for longform — felt slow/somber. |

## Mix levels — TWO REGISTERS

`score.sh` uses one set of constants for both modes; the difference is the chosen track. Constants (locked May 9 2026):

- Music loudness target: **-32 LUFS** (was -38 in the locked-shorts register; bumped May 9 because the longform register needs the music to be perceptible, not subliminal)
- Mix weight: **0.30** (was 0.22 in the original shorts register; bumped to 0.40, dialed back to 0.30 as the user-confirmed sweet spot)
- Sidechain ducking: ~10 dB further during voice activity, recovers in 400 ms
- `atempo` speed: configurable via `MUSIC_SPEED` env var (default 1.0; raise to 1.10–1.30 for slower source tracks)

The 0.30 weight + -32 LUFS sits the music as a clear-but-not-competing bed under the voice. You'll hear it; it won't distract.

**Mode-specific tuning (defaults, override with env vars):**

| | Shorts register | Longform/intro register |
|---|---|---|
| Track | `bg-ambient-N.mp3` (deterministic pick) | `bg-feelgood-builder.mp3` |
| `MUSIC_SPEED` | 1.0 | 1.0 (Builder is already 96 BPM) |
| Effective LUFS / weight | -32 / 0.30 (same constants, source track is calmer so feels softer) | -32 / 0.30 |

If shorts feel too loud at the new constants, override per-render: `MUSIC_VOLUME=0.22` (would need a small score.sh edit to read this — not currently wired; if it becomes an issue, add it).

## Selection criteria (HARD RULES)

**For shorts (calm register):**

1. **Instrumental only.** No vocals.
2. **No drums or percussion** beyond the softest brushed kit.
3. **No bass.**
4. **Acceptable:** solo piano, piano + soft strings, light acoustic guitar, ambient piano w/ mild reverb, classical chamber.
5. **Unacceptable:** synth leads, EDM, lo-fi hip-hop, cinematic trailer pads, anything that says "tech startup explainer".
6. **Slow tempo.** ≤80 BPM.
7. **Loopable.**

**For YT longform/intro (feel-good register):**

1. **Instrumental only.** No vocals.
2. **Light percussion OK** if it's brushed/shaker level — must not compete with voice.
3. **Light bass OK** if it's not sub-heavy.
4. **Acceptable:** acoustic guitar w/ light kit, soundtrack-genre instrumentals, chamber-pop, jazz-piano leaning. Major key.
5. **Unacceptable:**
   - Music-box / glockenspiel / heavy ukulele lead → reads as "twee / kids show / girly" (Carefree was rejected for this)
   - Slow classical (≤70 BPM) → reads as "depressive" / wedding-music
   - Cinematic build-and-release → corny
   - Synth leads / EDM / lo-fi hip-hop → off-vibe
6. **Tempo 90–110 BPM.** Energetic enough to add drive, calm enough not to compete.
7. **Loopable.**

## Recommended sources (in order)

1. **Pixabay Music** (https://pixabay.com/music/) — free for commercial use, no attribution. Search prompts that work: `"calm piano"`, `"ambient piano"`, `"soft strings instrumental"`, `"classical solo piano"`, `"erik satie style"`.
2. **archive.org** — public-domain classical recordings of Satie, Debussy, Chopin, Bach, Schubert.
3. **Free Music Archive** (https://freemusicarchive.org/) — CC0 / Public Domain filter. Chris Zabriskie's calmer pieces work; skip his "Cipher" / "I Am Running Down…" type tracks (those have synth → off-vibe).

## NOT acceptable sources

- **SoundHelix sample tracks** (`SoundHelix-Song-N.mp3`) — electronic dance, rejected May 4 2026.
- Any "lo-fi study beats" library — too informal, dates the content.
- "Corporate / inspirational" stock music with build-and-release structure — corny.
- Uppbeat "Indie Vlog" / Pixabay "ambient corporate" — these terms are a red flag, the result is always the wrong vibe.

## Verification before adding a track

1. **Listen at the actual mix level (-38 LUFS, weight 0.22) under a voiceover.** If you can hear the music as music, it's too loud or too busy.
2. **The cornyness test:** does it sound corny if you describe what it is in plain words? "Solo piano arpeggios" → safe. "Inspirational tech build-up" → reject. "Ambient corporate" → reject.
3. Check it doesn't have a vocal hook hiding in the back third of the track (some "instrumental" tracks include vocals after 90s).
4. Verify the file is ≥30s and ≥200 KB so loops don't start chopping mid-render.

## Audio ducking implementation

Implemented in `scripts/score.sh` via ffmpeg sidechain compression (no Python needed):

```
[1:a]loudnorm=I=-38:TP=-1.5:LRA=7,asplit=2[sc][mix];
[0:a]loudnorm=I=-16:TP=-1.5:LRA=11[voice];
[voice][sc]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400:makeup=1[duckctrl];
[mix][duckctrl]sidechaincompress=...[ducked];
[voice][ducked]amix=inputs=2:duration=first:weights=1 0.22[aout]
```

The first sidechaincompress builds a control signal from the voice; the second uses that signal to duck the music. Two-stage so the music stays smooth when the voice is mid-sentence.

## Rotation policy

`score.sh` picks one track deterministically by SHA1(input filename) % track-count. Same scene always gets the same track (idempotent renders), but 15 scenes spread across N tracks distribute roughly evenly. Manual override: pass the track path as the second argument to `score.sh`.
