---
name: sa-obsidian-vault-ops
description: Space Age session memory via Google Drive. Replaces Obsidian vault for cross-session context. Read today's note at session start, write completed work at session end. Use any time you need to remember what was done in a previous session or log what's happening now.
---

## Overview

The Obsidian vault lives on Mr. Black's Windows machine — not on the VPS. Google Drive is the memory layer. All session context lives in the SESSION_MEMORY folder in the Skills Drive folder.

## Key IDs

- Skills Drive Folder: `1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9`
- SESSION_MEMORY Folder: `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU`

## Session Start — Read Context

At the start of every session, read the most recent memory note:

1. Search for today's note: `title = '2026-06-21.md' and parentId = '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU'`
2. If found, read it with `mcp__Google_Drive__read_file_content`
3. If not found, search for the most recent file in SESSION_MEMORY and read that

This tells you: what was completed last session, what's pending, and key context so you don't ask Mr. Black to repeat himself.

## Session End — Write Context

Before ending any session, create or update today's memory note:

1. Title: `YYYY-MM-DD.md` (today's date)
2. Parent: `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU`
3. Use `mcp__Google_Drive__create_file` with `disableConversionToGoogleType: true`, `contentMimeType: text/plain`

## Note Format

```markdown
# Session Memory — YYYY-MM-DD

## What was completed today
- bullet list of what was actually finished

## Pending / Next Session
- what still needs to be done

## Key Context
- any infra changes, new IDs, new credentials that exist

## Credentials that exist (values not stored here)
- list credential names only, never values
```

## Rules

- NEVER store credential values in Drive notes
- Always read before writing — don't overwrite, append to existing note if one exists today
- Date format: YYYY-MM-DD always
