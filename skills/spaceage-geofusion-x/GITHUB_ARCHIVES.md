# GeoFusion X source archives

The primary handoff files are in this directory:
- `SKILL.md` — universal agent skill.
- `START_HERE_MASTER_HANDOFF.md` — engineering requirements and known implementation gaps.
- `COPY_PASTE_BUILD_PROMPT.md` — ready-to-use coding agent instructions.
- `README_FIRST.md` — orientation.
- `GeoFusion_X_FIXED_HANDOFF_LITE.zip` — immediately downloadable lite package.

## Full-source package

The 23 MB full-source ZIP exceeded the GitHub connector's single-upload transport limit. Its **actual binary bytes** are checked in as 12 sequential parts under `full-source-parts/`. These are not Base64 text files. Reassemble in a shell:

```bash
cd skills/spaceage-geofusion-x
cat full-source-parts/part-*.bin > GeoFusion_X_FIXED_HANDOFF_FULL_SOURCE.zip
sha256sum GeoFusion_X_FIXED_HANDOFF_FULL_SOURCE.zip
```

Expected SHA-256: `10bd2bcea4cc7138b1ad9bf31e55fd75d4fb808d9a290619a1bdfe78c842c1ff`.

Alternatively, download the intact full ZIP from [Space Age Skills / GeoFusion-X on Google Drive](https://drive.google.com/drive/folders/14UWTl0ohBXf9IjPwluq7RXnK0m9738r1).

The earlier `GeoFusion_X_COMPLETE_ENGINEERING_HANDOFF_2026-10-18.zip` is an older, awkward nested-archive format. It remains in Drive for historical reference, but the fixed full-source ZIP is the recommended version.

## Important

This is a **handoff of an incomplete implementation**, not a complete working omni-source scraper. Read the master handoff and run the engine tests before modifying code.
