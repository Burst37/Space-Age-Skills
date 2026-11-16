# Video-per-section: Chuma's signature style

Each section carries its own short film behind the copy. Only the section you're looking at plays.
Runtime: module `video-chapters` (#41) on `<main>` (or a wrapper). Default in `taste-profile.yaml`
(`motion.always: [video-chapters]`); a brief can opt out.

## Rules
1. **One video at a time.** The most-visible chapter (ratio > 0.2) gets its `src` and plays; every other chapter
   is paused with its poster. verify blocks when more than one video plays at once.
2. **Lazy.** `<video muted loop playsinline preload="none" poster="…" data-src="…" width height>`, with no `src` in the
   HTML. First load costs posters only. verify budgets first load + in-view media, not the whole scroll.
3. **Pause offscreen**, and **a visible pause/play control** (`[data-vchap-toggle]`, its text is the name).
   The choice persists for the session.
4. **Reduced motion or Save-Data → stills.** Posters only, no autoplay, and the toggle is hidden.
5. **All text in the HTML**, over a CSS scrim, readable on the poster frame (contrast is checked on the poster).
6. **Every clip is distinct**: a different subject, camera move and pacing per section, planned in the
   storyboard. A page where every panel looks the same feels fake, so plan the set as a sequence.
   Planning: `references/storyboard-to-video.md`, and the six-panel template
   `/workspace/video-templates/6-panel-product-storyboard.md` (identity sheet → storyboard → Seedance hand-off).
7. **Generation**: section-clip role from the live roster (`references/model-roster.md`); each clip is a JSON shot spec (`references/video-json-prompting.md`) that passes `shot-lint.mjs`. Chuma's standing preference: not Grok's video model.
   4–8s seamless loops, 1080p max, H.264 MP4 ≤ 2.5MB plus a WebM, poster ≤ 120KB (`asset-pipeline.md` encodes).
8. **Logo weight cap**: header logo ≤ 100KB (SVG preferred); verify `--logo-kb`.
9. Regulated sectors: slower, calmer loops (people, hands, homes, no fast cuts), and one autoplay in the first viewport.

## Markup
```html
<main data-cwb="video-chapters">
  <section data-vchapter class="section">
    <video class="vchap__media" muted loop playsinline preload="none" poster="/media/s1.jpg" data-src="/media/s1.mp4" width="1920" height="1080" aria-hidden="true"></video>
    <div class="vchap__scrim"></div>
    <div class="wrap"><h2>…</h2><p>…</p></div>
  </section>
  …
</main>
<button class="vchap__toggle" type="button" data-vchap-toggle aria-pressed="false"><span data-vchap-label>Pause motion</span></button>
```
Custom type pairs well with it: a giant-object scene (custom type style 16) or a material-letter loop
(styles 7–15) can be a chapter.
