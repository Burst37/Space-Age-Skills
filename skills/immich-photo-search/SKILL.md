---
name: immich-photo-search
description: Use when the user asks Claude to find, organize, tag, or report on photos/videos in their self-hosted Immich library — e.g. "find photos of X from last summer", "how many photos do I have from Tokyo", "create an album of Y", "find duplicates".
---

# Immich Photo Search

## Overview

[immich-app/immich](https://github.com/immich-app/immich) is a self-hosted Google-Photos alternative with a full OpenAPI spec (`open-api/`) and a CLI (`packages/cli`) covering smart (CLIP) search, metadata search, albums, and people/face recognition. This skill lets Claude query a personal photo library as a structured data source rather than treating it as opaque storage.

## When to Use

- "Find photos/videos of [subject/place/object]" → smart search (CLIP embeddings)
- "Photos from [date range / location]" → metadata search
- "Make an album called X with these photos"
- "Find duplicates" / "find photos with no album"
- NOT for editing/uploading photos — confirm with the user before any write operation (album creation, tagging, deletion).

## Core Pattern

Immich separates **smart search** (semantic, CLIP-based — "a dog on a beach") from **metadata search** (exact filters — date range, camera, location, favorite, archived). Combine both: narrow with metadata filters first, then smart-search within that set when the query is descriptive.

## Quick Reference

| Task | API |
|---|---|
| Smart (semantic) search | `POST /api/search/smart` `{query, ...filters}` |
| Metadata search | `POST /api/search/metadata` `{takenAfter, takenBefore, city, ...}` |
| List albums | `GET /api/albums` |
| Create album | `POST /api/albums` `{albumName, assetIds}` |
| Get asset detail | `GET /api/assets/{id}` |
| Find duplicates | `GET /api/duplicates` |
| People/faces | `GET /api/people` |

CLI equivalents exist via `immich` (packages/cli) for bulk operations: `immich upload`, `immich login`.

## Implementation

```bash
# Auth: all calls need x-api-key header (from Immich Account Settings > API Keys)
export IMMICH_URL=http://localhost:2283
export IMMICH_KEY=<api-key>

# 1. Semantic search
curl -s -X POST "$IMMICH_URL/api/search/smart" \
  -H "x-api-key: $IMMICH_KEY" -H "Content-Type: application/json" \
  -d '{"query":"birthday cake","size":50}'

# 2. Narrow by date + location, then describe
curl -s -X POST "$IMMICH_URL/api/search/metadata" \
  -H "x-api-key: $IMMICH_KEY" -H "Content-Type: application/json" \
  -d '{"takenAfter":"2025-06-01","takenBefore":"2025-09-01","city":"Tokyo"}'

# 3. Create album from result asset IDs (confirm with user first)
curl -s -X POST "$IMMICH_URL/api/albums" \
  -H "x-api-key: $IMMICH_KEY" -H "Content-Type: application/json" \
  -d '{"albumName":"Tokyo Trip","assetIds":["<id1>","<id2>"]}'
```

## Common Mistakes

- **Smart search on a huge unfiltered library** — combine with metadata filters (date/location) first for relevance and speed.
- **Creating albums/tags without confirming** — these are visible, persistent changes to the user's library; always confirm before write calls.
- **Forgetting pagination** — search endpoints return paged results; check `nextPage`/`total` before assuming you've seen everything.
- **Using the mobile/web UI's terms** ("favorites", "shared albums") without checking the corresponding API field names — they differ slightly (`isFavorite`, `albumUsers`, etc.).
