---
name: fincept-terminal
description: Fincept Terminal — a Bloomberg Terminal alternative. Use when evaluating or deploying Fincept Terminal, and to understand its desktop-app (not server) nature and licensing before self-hosting.
source: https://github.com/Fincept-Corporation/FinceptTerminal
---

## Overview

Fincept Terminal is a C++20/Qt6 desktop financial analytics application (equity research, portfolio, news, node editor) positioned against the $27K/yr Bloomberg Terminal. Verified from the repo's own Dockerfile and README.

**Important, from actually reading the repo — this is not a typical "docker compose up" web service.** It's a native GUI desktop app. The Dockerfile exists to produce a Linux binary inside a container, which still needs a display to render to (X11 forwarding or a VNC layer) — there is no headless/API mode implied by the guide's one-liner.

## Deploy (VPS-tailored — GUI-over-network)

A VPS has no display, so running this "on the VPS" means one of:

**Option A — X11 forwarding from a client machine (simplest, only works if you SSH in with X11 support):**
```bash
docker build -t fincept/terminal:latest .
docker run --rm -it --net=host \
  -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix \
  fincept/terminal:latest
```
This only renders on whatever display `$DISPLAY` points to — realistically your local machine via `ssh -X`, not something remote users can hit over HTTPS.

**Option B — noVNC in a container (actual remote-access self-host):** wrap the same image with a VNC server (e.g. `jlesage`-style base image or `x11vnc` + `noVNC`) so it's reachable over a browser tab. This is real integration work, not a config change — budget it as a small project if you want Fincept genuinely available to a remote team, not just yourself over SSH.

**Realistically for most self-host cases: just run the native installer.** The README points to prebuilt `.exe`/`.dmg`/Linux release artifacts — for a single analyst's desktop, that's simpler than any of the above.

## Gotchas (from source inspection — read before committing to this one)

- **Maintenance notice in the README itself (June 2026):** due to funding constraints, the public repo is moving to monthly updates only; the team's focus has shifted to a paid "private edition" and a new product (**Quantcept**). The open-source repo stays up but isn't the team's priority anymore — factor that into how much you rely on it.
- **AGPL-3.0 with a separate commercial license path** (`docs/COMMERCIAL_LICENSE.md` referenced in the README) — if any commercial redistribution is planned, read that file, not just the AGPL text.
- Build is heavy and platform-specific (pinned Qt 6.8.3, CMake 3.27.7, GCC ≥12.3) — this is not a lightweight image; budget real build time/resources if building from source rather than using a release artifact.
