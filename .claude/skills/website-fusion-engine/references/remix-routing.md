# Remix routing + section contracts

## Remix matrix (`docs/design/remix-matrix.json`)

Route every global system + every section to ONE approved source. No silent blends.

```json
{
  "globals": {
    "layout": "site-a", "navigation": "site-a", "menu": "site-b",
    "motion": "site-b", "typography": "new-brand", "palette": "new-brand",
    "forms": "generated", "cms": "generated"
  },
  "sections": [
    { "id": "hero", "structure": "site-a", "motion": "site-b", "content": "user", "assets": "library" },
    { "id": "work-gallery", "structure": "site-c", "motion": "site-c", "content": "user", "assets": "library" }
  ]
}
```

Sources: `site-a|b|c · uploaded · user-brand · user-content · generated · retained-code`. Precedence: explicit user instruction → section route → global route → approved DESIGN.md → verified evidence → inference → generated fallback.

## Section contract (one file per section → `docs/design/section-specs/<id>.md`)

Each section = independently testable unit:

- **purpose** + conversion role
- **source evidence** (paths into `docs/research/sources/`)
- **content source** + **asset source** (filenames from asset-ledger)
- **structure**: desktop / tablet / mobile layout
- **motion**: motion-map ids that apply
- **states**: hover / focus / active / loading / empty / error
- **dependencies**: libs, data, integrations
- **acceptance tests**: what must pass to call it done

## Builder contracts

One focused builder per section/feature. Explicit file ownership. No two builders write the same file. Use git worktrees when available. Test-first.

## Asset ledger (`docs/design/asset-ledger.json`)

Per asset: `filename · source · license/authorization · dims · format · subject · intended slot · crop/focal · accepted|rejected`. Search user library before generating. Never ship temp remote URLs to prod.
