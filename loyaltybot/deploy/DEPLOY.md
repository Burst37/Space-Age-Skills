# LoyaltyBot — VPS deployment

Get the auto-form-filler running headless on the DigitalOcean droplet
(`146.190.78.120`) in a few minutes. Ubuntu/Debian assumed.

---

## 1. Get the code onto the VPS

```bash
ssh root@146.190.78.120
sudo mkdir -p /opt/loyaltybot && cd /opt/loyaltybot
# clone the repo (or rsync just the loyaltybot/ folder), then:
cd /path/to/repo/loyaltybot
```

The runnable bot is the `loyaltybot/` directory: `auto-signup.py`,
`recognition.py`, `old_engine.py`, plus the `deploy/` kit and your master CSV
(`loyalty-rewards-MASTER.csv`).

## 2. One-shot setup

```bash
cd loyaltybot/deploy
bash setup-vps.sh              # Chromium backend
#   …or, to also install the stealth browser:
bash setup-vps.sh --camoufox
```

This installs system libs, creates `loyaltybot/.venv`, installs the Python
requirements, and downloads Chromium (and Camoufox if asked). Re-running is safe.

## 3. Configure

```bash
cd ..                                   # into loyaltybot/
cp deploy/.env.example .env             && $EDITOR .env
cp deploy/config.example.json config.json && $EDITOR config.json
```

- **`.env`** — CapSolver key fallback, browser backend, default workers/headless.
- **`config.json`** — the **client's real PII** (name, email, phone, DOB,
  address, password) and the CapSolver key. This file is **git-ignored and must
  never be committed, logged, or uploaded.** The `.gitignore` already blocks
  `config.json`, `config_*.json`, `*.client.json`, `results*.csv`, `.env`.

The bot reads the CapSolver key from `config.json` (`capsolver_api_key`) first,
falling back to `CAPSOLVER_API_KEY` in the environment.

## 4. Smoke test

```bash
bash deploy/run.sh --headless true --limit 25
```

25 sites, headless. Then read the scoreboard:

```bash
bash deploy/run.sh --report
```

You want `no form fields (recognition)` near zero and the **fillable-only
success rate** climbing. See the main `README.md` for what each bucket means.

## 5. Full runs

```bash
# foreground in a tmux session so it survives your SSH dropping
tmux new -s lb
bash deploy/run.sh --headless true --workers 4
#   Ctrl-b d to detach;  tmux attach -t lb to return

# only re-run the sites that failed last time
bash deploy/run.sh --headless true --retry

# check site reachability without filling
bash deploy/run.sh --health-check --workers 8
```

### Run as a service (optional)

```bash
sudo cp deploy/loyaltybot.service /etc/systemd/system/
sudo $EDITOR /etc/systemd/system/loyaltybot.service   # set User= and paths
sudo systemctl daemon-reload
sudo systemctl start loyaltybot
journalctl -u loyaltybot -f
```

---

## Choosing the browser backend

| | `chromium` (default) | `camoufox` |
|---|---|---|
| Speed | faster | slightly slower (humanized) |
| Stealth | UA rotation + `playwright-stealth` + JS patches | hardened anti-detect Firefox, C++-level fingerprint spoofing |
| When | most sites | sites that block the Chromium run (Cloudflare / PerimeterX / heavy bot walls) |

Enable Camoufox with `LB_BROWSER=camoufox` in `.env` (or `--browser camoufox`).
**Validate it first** with the standalone smoke test in the `camoufox` skill —
that confirms the browser launches and passes a bot-detection probe on the VPS
before you point the whole batch at it. If the `camoufox` package or browser
isn't installed, the bot logs a warning and falls back to Chromium
automatically, so a run never hard-fails on this.

> On a headless VPS Camoufox runs headless directly. If a site behaves
> differently headless, `setup-vps.sh` also installs `xvfb`; you can run under a
> virtual display with `xvfb-run -a bash deploy/run.sh …`.

---

## Sizing workers

Each worker is its own browser process (one crash takes out one worker, not the
run). Rule of thumb: **~1 worker per GB of RAM** for Chromium, a bit more
headroom for Camoufox. On a 4GB droplet, `--workers 4` is a safe start; watch
`htop` and back off if you swap.
