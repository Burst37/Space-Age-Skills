---
name: obsidian-releases
description: Obsidian community plugin and theme manifests. Use to look up plugin IDs, authors, descriptions, and download counts. Reference when recommending or installing plugins for a vault.
source: https://github.com/obsidianmd/obsidian-releases
---

## Overview

Official Obsidian community plugin and CSS theme registry. Contains JSON manifests for every published plugin and theme.

## Files

- `community-plugins.json` — all plugins: id, name, author, description, repo
- `community-css-themes.json` — all themes: name, author, repo, modes
- `community-plugin-stats.json` — download counts per plugin

## Common Lookups

```bash
# Find plugin by keyword
cat community-plugins.json | python3 -c "
import json,sys
plugins = json.load(sys.stdin)
for p in plugins:
    if 'obsidian' in p['description'].lower():
        print(p['id'], '-', p['name'])
" | head -20

# Top downloaded plugins
cat community-plugin-stats.json | python3 -c "
import json,sys
stats = json.load(sys.stdin)
sorted_p = sorted(stats.items(), key=lambda x: x[1].get('downloads',0), reverse=True)
for id, s in sorted_p[:20]:
    print(s.get('downloads'), id)
"
```

## Attribution

obsidianmd/obsidian-releases — Obsidian official
