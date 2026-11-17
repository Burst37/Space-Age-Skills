# Prompt library (paste into the director; replace [brackets])

## §bible — interview
```
you are the showrunner of a new animated short series. interview me one question at a time until you can fill every field below. then write bible.md.
- logline (one sentence)
- world: one location, its light, its colors
- engine: what goes wrong every episode, and why it can never be solved
- tone: style, pacing, dialogue or no dialogue
- palette: dominant, secondary, accent, as a 60:30:10 split
- never: what can't appear (real faces, text on screen, gore)
- 5 episode ideas in one line each
```
If the user can't give 5 episode ideas, say the engine is too weak and fix it before continuing. Example engine: tiny retired robot runs a 3 am bakery; a customer orders something impossible.

## §passport — one face in every shot
```
build the passport for [character] using bible.md.
1. write an exhaustive descriptor: silhouette, proportions, materials, colors with hex codes, one signature item never without, one "tell" (a gesture), and one small fixed imperfection that makes drift easy to spot.
2. write the image prompt for the first hero image, neutral grey background, full body, calm pose.
3. quote the cost on Picsart and wait for my yes.
```
Turnaround (attach hero as identity reference): "Using the attached character as the identity reference, create a horizontal character turnaround sheet: front, left profile, back, right profile and one relaxed three-quarter pose. Same face, proportions, materials and colors. Five full-body views on a light grey background. No labels." Lock the sheet; never regenerate it. Template: `templates/passport.md`.

## §shots — shot cards + animatic
```
write episode [N] from bible.md as a script, then break it into shot cards. For every shot:
- shot id, duration in whole seconds (4-10)
- characters in frame, by passport tag
- what the camera sees: shot size, angle, lens, movement
- the ONE action that happens
- sound: ambience, effects, music on/off
- emotional beat: setup, accident, reaction or twist
rules: hook in first 3 s, readable with sound off · no text in frame, no crowds, no mirrors, no hands picking up small objects · last shot holds its final pose
save to episodes/ep[N]/shots.md
```
Animatic (zero credits): "read episodes/ep[N]/shots.md and bible.md. build an animatic as one HTML file with an inline SVG, 1280x720: one storyboard panel per shot in the bible palette, each with its ONE action animated in CSS (loop); active panel highlighted, others dimmed; a timeline with playhead, shot lengths to scale; under each panel: shot id, duration, action, camera. then record to episodes/ep[N]/animatic.mp4 with playwright and ffmpeg at 30 fps. no Picsart calls."

## §frames — still first, then fresh reviewer
```
for every shot in episodes/ep[N]/shots.md write the starting frame prompt:
- paste the full passport descriptor of every character in frame, verbatim
- the location from bible.md with its light and palette
- the calm starting pose
- end with: "no text, no extra characters, 9:16"
attach the cropped turnaround view as reference. quote total cost for all frames, wait for my yes.
```
Reviewer (new session, read-only): "you are a reviewer. read only, change nothing. this frame is about to cost real credits. 1) frame matches the shot card (position, left/right, colors, counts, clothes)? 2) character matches the passport incl. the fixed imperfection? 3) planned action physically possible from this pose? 4) where will the video model most likely break? 5) anything not judgeable from a still: mark UNCHECKED. end with PASS or FAIL; if FAIL list exactly what to change."

## §motion — 480p draft, 1080p final
Scene lives in the frame; the motion prompt is only motion: image-to-video, one action, one camera move, timed in beats.
```
Image-to-video, 8 seconds, from the attached still.
0-2s: he looks up from the oven, the camera stays still.
2-5s: slow push-in on his face, his eyes widen.
5-8s: he presses both hands to his chest and holds, the lamp flickers once.
Natural room sound, no music, the character does not speak.
```
Draft everything at 480p, approve one, pay for full resolution once (source: Seedance 2.5 Draft Mode, VERIFY).

## §sound — score, stitch, 16-frame check
```
for episode [N]:
1. one music bed matching the bible tone, mixed under the effects; no music under the first 3 seconds.
2. sound effects only where the picture implies one.
3. stitch the selects in shot order with ffmpeg, trim first and last 0.3 s of every clip (generations drift at edges), normalize loudness, export 9:16.
save to selects/ep[N]_final.mp4
```
QA: "pull 16 evenly spaced frames from selects/ep[N]_final.mp4. check each against the passports in cast/: finger counts, melting or duplicated props, a character changing color or shape, background jumps inside one shot. ignore changes at my own cuts. report: frame number, what broke, which shot to regenerate."
