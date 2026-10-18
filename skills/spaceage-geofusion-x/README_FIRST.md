# SpaceAge GeoFusion X — FIXED HANDOFF (LITE)

## Start here
1. Read `START_HERE_MASTER_HANDOFF.md`.
2. Copy the contents of `COPY_PASTE_BUILD_PROMPT.md` into your coding agent.
3. Open `engine/` for the **actual previous v0.4 Python code**. The source is unpacked (no nested ZIP).
4. See `references/TypeSafe_Jev_Routing.md` for the correct JEV reference.
5. Obtain actual upstream scraper repositories as described in `sources/UPSTREAM_SOURCES.md`.
6. Treat this as a **development handoff**, not a fully integrated or production-tested scraper.

## Run existing engine tests (Python 3.10+)
```bash
cd engine
python -m unittest discover -s tests -v
```

## Not yet implemented
- Real Agent Reach gated social collection, Maps collectors integration, automatic JEV router, complete SEO/AI benchmarking.
- Source code for the upstream GoSom/Omkar repositories is distributed separately, not embedded in the lite handoff.

This lite bundle is designed for easy download/extraction even on mobile.
