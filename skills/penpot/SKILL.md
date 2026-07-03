---
name: penpot
description: Self-hosted Penpot design tool as a Figma replacement. Use when setting up or troubleshooting the Penpot self-hosted stack on the Space Age VPS.
source: https://github.com/penpot/penpot
---

## Overview

Penpot is an open-source design/prototyping tool (Figma replacement). Verified from the repo's real `docker/images/docker-compose.yaml` — the default file is a localhost dev/eval config, not internet-ready as-is (it says so directly in its own comments).

## Deploy (VPS-tailored)

```bash
git clone https://github.com/penpot/penpot.git
cd penpot/docker/images
```

The stock file sets these — **all three must change before exposing to the internet**:

```yaml
x-flags: &penpot-flags
  # Remove disable-email-verification and disable-secure-session-cookies
  # for a real internet-facing deploy — they're dev-only conveniences.
  PENPOT_FLAGS: enable-smtp enable-prepl-server enable-registration

x-uri: &penpot-public-uri
  PENPOT_PUBLIC_URI: https://design.yourdomain.com

x-secret-key: &penpot-secret-key
  PENPOT_SECRET_KEY: <generate below>
```

Generate a real secret key (the repo's own suggested method):

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

```bash
docker compose up -d
```

Front with Caddy (the compose file has a commented-out Traefik service — Caddy is simpler if that's already your reverse proxy elsewhere in the stack):

```
design.yourdomain.com {
    reverse_proxy localhost:9001
}
```

## Enhancement: enable SMTP for invites/password reset

Penpot needs `enable-smtp` in `PENPOT_FLAGS` plus `PENPOT_SMTP_*` env vars to send invitation and password-reset emails — without it, team invites silently don't arrive. Point it at Stalwart (see the `stalwart` skill) if self-hosting mail too:

```yaml
PENPOT_SMTP_DEFAULT_FROM: penpot@yourdomain.com
PENPOT_SMTP_DEFAULT_REPLY_TO: penpot@yourdomain.com
PENPOT_SMTP_HOST: mail.yourdomain.com
PENPOT_SMTP_PORT: 587
PENPOT_SMTP_USERNAME: penpot@yourdomain.com
PENPOT_SMTP_PASSWORD: <app password>
PENPOT_SMTP_TLS: true
```

## Gotchas (from source inspection)

- `PENPOT_HTTP_SERVER_MAX_BODY_SIZE` defaults to ~367MB — fine for most files, but if a designer hits upload errors on huge boards, this is the knob.
- The default compose disables secure session cookies and email verification for local eval — leaving those disabled on a public deploy is a real security gap (see the file's own `WARNING` comment), not just a style choice.
- Uses its own Postgres 15 volume (`penpot_postgres_v15`) — don't share it with another app's Postgres instance.
