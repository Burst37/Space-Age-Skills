# Round-6 feedback audit

Source: user review of the first end-to-end batch (scenes 1–15). Each issue maps to a concrete plan fix AND, where possible, a skill-level rule so the same failure doesn't recur on future videos.

## Per-video defects

### scene 5 @ 27s — visual too abstract
- **Beat:** 24.6–28.0s `broll/3-compound.png` "snowball rolling into a boulder" for "the compound effect here is crazy."
- **Why it's wrong:** elaborate metaphor, takes >0.5s to parse. The compound idea would land harder with a *recognizable concrete object* of growth (a chart climbing, a stack of coins, a thermometer).
- **Skill rule added:** §4j — recognizable concrete subjects, four-word test.
- **Fix-on-next-render:** regenerate as `broll/3-compound.png` with subject "a simple line chart climbing steeply" or "a stack of coins growing taller."

### scene 6 @ 29s — visual overcomplicated
- **Beat:** 28.7–31.2s `broll/4-systems-vs-apps.png` "lone app icon dwarfed by a vast interconnected systems landscape."
- **Why it's wrong:** two competing subjects + an abstract "landscape." Viewer can't decode in time.
- **Skill rule added:** §4j (same).
- **Fix-on-next-render:** swap to a single-subject contrast — e.g. "one phone next to one server rack" or just "a server rack" alone.

### scene 7 @ 20s — list flashes too fast
- **Beat:** 13.0–20.4s list "What Most People Do."
- **Why it's wrong:** last-item dwell <1.5s in the original render. Already corrected by §4g + sync_list_items.py auto-extension; this video just needs a re-render after the latest sync pass.

### scene 8 @ 1.5–4.5s — hook visual mistimed
- **Beat:** 1.5–4.5s `broll/1-chatbot-to-employee.png` visualizing "turn it from a chatbot into an employee."
- **Why it's wrong:** speaker says that exact phrase well after 4.5s. The visual is gone before the line lands. The hook visual was illustrating a *later* punchline.
- **Skill rule added:** §4h — visual timing must align with what the speaker is saying inside the beat's window, not a future payoff.
- **Fix-on-next-render:** either move this beat to overlap the actual "chatbot to employee" line in the transcript, OR replace the hook subject with something the speaker IS saying at 1.5–4.5s.

### scene 10 @ 4s — hook lingers into next part
- **Beat:** 1.2–4.8s `broll/1-slap.png`. Hook overruns the speaker's pivot.
- **Why it's wrong:** the speaker has clearly moved on by ~3.8s; the visual hangs into the next sentence.
- **Skill rule added:** §4i — beats must end before speaker pivots topics.
- **Fix-on-next-render:** shorten `end_sec` to 3.6–3.8s. The rest of the video is rated as good — leave the other beats untouched.

### scene 12 @ 25s — list timing off / not visible enough
- **Beat:** 18.6–25.4s list "Why 'just fix it' snowballs."
- **Why it's wrong:** last-item dwell too short, items front-loaded. Same root cause as scene 7.
- **Skill rule added:** §4g.
- **Fix-on-next-render:** re-run sync_list_items.py (already done globally), then re-render.

### scene 13 @ 26s — visual doesn't visualize
- **Beat:** 23.6–26.3s `broll/4-bottleneck.png` "a literal funnel bottleneck where ideas squeeze through."
- **Why it's wrong:** "literal funnel bottleneck" is too elaborate; the visual reads as a generic abstract instead of the specific idea ("the description is the bottleneck").
- **Skill rule added:** §4j.
- **Fix-on-next-render:** simpler subject — e.g. "an hourglass" (universal bottleneck symbol) or "one narrow doorway with a queue behind it."

## Cross-cutting style issue

The 70+ generated images share the same color palette but vary wildly in texture and rendering style — claymation 3D next to flat illustration next to photographic, frame-by-frame. Reads as stock-asset stew.

**Fix:** §4k — one locked style across an entire video. Five test images generated on the same subject (database server cylinder, 9:16) — A: line illustration, B: 3D matte, C: bold flat geometric, D: dark studio photo, E: risograph two-tone. User picks one; locked style is committed to `knowledge/image_style.md` and used verbatim for every future generation.
