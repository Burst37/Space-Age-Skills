# Level 2: Higgsfield film and images

Higgsfield is the co-star. Level 1 gives the page something to touch; Level 2 gives it something to feel.
Everything here was measured on real builds in October 2026.

## The price card (check `higgsfield generate cost` before quoting; prices move)

| Job | Model and flags | Credits |
|---|---|---|
| Keyframe or still | `nano_banana_2`, any aspect, with reference images | 2 |
| Film clip, 5 s, 1080p | `seedance_2_0 --mode std --resolution 1080p --generate_audio false` | 60 |
| Same at 720p (loops, cards) | `--resolution 720p` | about 30 |
| A typical site | 3 keyframes + 2 clips + 3 stills + remakes | about 140 |

Write every credit to `ledger.tsv` (the tools do it). The balance is shared with other work, so count from the
ledger, not from the balance.

## 1. Choose the one move

A scroll film is one continuous camera move. Pick it before you write a prompt.

| Move | Example that worked | Why it works on a site |
|---|---|---|
| Push in | A desk on a misty ridge, then the laptop, then into the screen, which shows a website | The film literally lands inside "a website", so the page feels like the destination |
| Pull back | A robot's mirror visor, then its shoulders holding a plant, then the whole sunlit room | Starts intimate, ends with the product in a real life |
| Push to a detail | A laptop on a dark desk, then the keyboard, then a finger pressing the glowing logo key | The brand mark becomes the hero moment |
| Morph through time | A cave hand painting, a typewriter, a keyboard, a voice, the logo | Tells "why now" in 15 seconds |

Never a slideshow. If two beats could swap places and nobody would notice, it is a stack of scenes, not a shot.

## 2. Keyframes as a chain

```bash
G=~/.claude/skills/living-site/tools/gen_image.sh
ST="cinematic photograph, <light>, <palette>, photoreal, 16:9, no text, no logos, no watermark"
zsh $G kf/k1.png 16:9 "<the opening frame>. $ST" refs/<product-or-reference>.jpg
zsh $G kf/k2.png 16:9 "Same <thing>, same light, same straight-on camera direction as the reference, but the camera has <moved closer / pulled back>: <what fills the frame now>. $ST" kf/k1.png
zsh $G kf/k3.png 16:9 "Same <thing> as the reference, the camera has <moved again>: <the final frame>. $ST" kf/k2.png
```

The chain law:
- Keyframe N+1 is made **with keyframe N as its reference**. Add the product reference too when a character or
  logo must stay identical (a capture of the 3D model, a logo key).
- **Same camera direction, same light, same place. One change per step:** distance, or framing, or a single action.
- Say "Same ..., same light, same straight-on camera direction as the reference" in every step after the first.
- Make a contact sheet and look at it. Remake any frame that turns the camera, changes the room, or adds a second
  glowing key when you asked for one. It costs 2 credits. A clip that cuts costs 60.
- If a frame ignores the prompt (it repeats the reference instead of doing the action), rewrite it with the action
  first and the setting last.
- Safety filter tip: a harmless prompt that gets refused usually has an upright cylinder word in it (pillar, tube,
  rod, post). Say "low wide drum", "disc stack", or "rounded block" instead.

## 3. Clips that cannot cut

`film_chain.sh` runs this for you:
- **Seedance 2.0, not 2.5.** 2.0 honours a start and end frame as pins. 2.5 treats them as loose references
  and redraws the start, which breaks the chain.
- **Clip N starts on clip N-1's exact last frame** (pixels pulled with ffmpeg, never the keyframe) and ends on
  keyframe N+1. Both ends pinned. Strictly in order.
- **Audio off.** It defaults on.
- Every prompt opens with "One continuous single shot, no cuts." then names ONE camera move ("steady dolly push in",
  "smooth steady dolly out") and says the light stays the same.
- **Every clip is scanned for hidden cuts** (adjacent-frame SSIM; a frame far below the median is a cut).
  A cut clip is never used. The fix that works: remake the end keyframe **from the previous clip's last frame**
  with the same angle ("Exactly the same frame, same camera angle ... the camera has pushed in only a little closer,
  and <the one action>"), delete the clip, rerun. Do not buy a bridge clip. Do not hide it with a dissolve.
- Join, drop the duplicate first frame of every clip after the first, write 1920-wide JPEGs at q3, then the
  continuity gate must PASS.

## 4. Show it so it feels expensive

- Scrub a canvas, never a `<video>`: `MotionEngine.Scrub({ blend: true, lerp: 0.09, dpr: 2, cover: true, ... })`.
  `blend` lays the next frame over the current one by the playhead's fraction, so slow scrolls glide instead of
  stepping. `lerp: 0.09` gives the playhead a soft weight.
- Frame the film (rounded, shadowed) and put the captions beside it (`recipes/split-film.html`). Text over footage
  reads cheap and fights the picture.
- Captions rise in word by word: eyebrow, a heading of 3 to 6 words, one short line. Three beats.
- **Hand over to Level 1.** End the film on the thing the next section shows live. The laptop's screen shows a glass
  orb, the canvas zooms into it and fades, and the live 3D is waiting underneath. The visitor feels one world.
- Hero films (full bleed, scroll-zoom at the end) work when the opening frame is a beautiful still that can carry the
  headline, like Mercury's misty mountain.

## 5. Stills and living stills

- Make every still with a film keyframe as a reference so materials, light and the character match.
- Product cards: one subject, one action, a plain background from the same palette.
- **Living stills**: a Seedance clip with start image = end image, a calm motion that can come home
  ("locked-off camera, dappled leaf shadows drift across the wall and back, tiny bubbles rise"). Then
  `tools/living_loop.sh in.mp4 out-web.mp4` plays it forward and back, so the loop has no seam at all, and
  re-encodes it small for the web. Play with `<video muted playsinline loop autoplay poster="still.jpg">`.
- Seedance outputs 16:9 even from a portrait still. Crop it in the card with `object-fit: cover`.

## 6. Mistakes that cost real credits
- Asking for "a beautiful website" on a screen: say "made of soft light bars, no readable text". Generated text is mush.
- Two keyframes from different angles: it cuts. Always.
- A film with captions that type themselves on top: rejected as "AI sloppy". Captions sit beside the film.
- Replacing a film the client already loved. Add Level 2 around it instead.
