# Attribution

These 20 skills (`hyperframes`, `hyperframes-core`, `hyperframes-cli`, `hyperframes-registry`, `hyperframes-keyframes`, `hyperframes-animation`, `hyperframes-media`, `hyperframes-creative`, `general-video`, `motion-graphics`, `slideshow`, `music-to-video`, `embedded-captions`, `talking-head-recut`, `faceless-explainer`, `product-launch-video`, `website-to-video`, `pr-to-video`, `remotion-to-hyperframes`, `media-use`) are copied unmodified (aside from the removal noted below) from:

https://github.com/heygen-com/hyperframes (`skills/` directory)

Licensed under Apache License 2.0 — full text in `LICENSE` in this folder.

## Changes made

Removed two unused example video assets from `hyperframes-animation/examples/assets/` (`hyperframes-showcase-hypecard.mp4`, `background-tech-data-flow.mp4`, ~36MB combined) — not referenced by any skill logic or example HTML, pure demo bloat unrelated to the skills' function.

## Keeping in sync

HyperFrames ships new skills over time. Re-sync with:
```bash
git clone --depth 1 https://github.com/heygen-com/hyperframes.git
cp -r hyperframes/skills/* Space-Age-Skills/skills/
```
