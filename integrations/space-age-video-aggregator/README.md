# Space Age Video Aggregator — Pearl Glass / Cinematic Director v4.1 integrated

Open `index.html` in a modern browser. The complete unmodified `SPACE-AGE-CINEMATIC-DIRECTOR-v4.1-CONSOLIDATED.md` is included as a separate file AND embedded in the HTML for offline use.

## What works
- Search the complete cinematography library by technique, camera, lens, director or token.
- Dynamic module selection based on selected technique and reference mode.
- Camera-aware, physics-aware, continuity-aware multi-shot and continuous-take prompt compiler.
- Model-specific output hints; Kling prompt capped at 2500 characters.
- Queue, copy, export, asset-name references, mobile layout.

## Limitations
- No provider API credentials or actual video generation.
- Local deterministic compilation is not an LLM; it cannot semantically reason over the entire 48 KB library. The library is preserved for a future server-side LLM retrieval pipeline.
- Uploaded images are not analyzed or sent to any model.
- Model names are configurable targets, not verified API endpoints.
