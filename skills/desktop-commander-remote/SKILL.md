---
name: desktop-commander-remote
description: Launcher for Remote Desktop Commander on the user's Windows machine — gives a cloud Claude session terminal/filesystem access to that PC (Obsidian vault, local tools). Use when a task needs files that live only on the Windows machine.
---

# desktop-commander-remote

`DesktopCommander-Remote.cmd` runs on the **user's Windows PC**, not here. It downloads and executes the public launcher from `wonderwhy-er/DesktopCommanderMCP` (`scripts/remote/remote-windows.ps1`) in a child PowerShell, checks Node.js (asks once before installing), and starts Remote Desktop Commander.

## Use
1. User double-clicks the `.cmd` on Windows and leaves the window open.
2. In the session: `list_computer_folders` → `request_computer_folder`. The user approves the attach.
3. Never request without the user saying the launcher is running; do not poll.

## Why
CLAUDE.md anti-forgetting #8: the Obsidian vault lives on the Windows machine, not the VPS. This is the bridge for `sa-obsidian-vault-ops` when Drive memory is not enough.

## Safety
- Script pipes a remote file into `iex` and is **unpinned** (`main` branch). Review upstream before first run; pin to a commit for stable use.
- Grants shell + filesystem on that PC while running. Stop it (close the window) when done.
