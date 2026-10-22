#!/usr/bin/env python3
"""LoyaltyBot signup runner backed by camofox-browser (anti-detection Firefox).

Drop-in companion to `auto-signup-playwright.py` that keeps the same
`config.json` and `loyalty-rewards-MASTER.csv` inputs and the same
`signup-results-*.csv` output shape, but drives the signup flow through
camofox-browser's REST API instead of local Playwright/Chromium.

Why this exists
----------------
Playwright + Chromium is fingerprinted at the C++ level (navigator.*, WebGL,
canvas, AudioContext, etc.) by most loyalty-program signup pages, especially
behind Cloudflare. Camoufox patches those leaks at the browser-engine level,
which is most of why the success rate on auto_signup_feasible sites was low.

This script:
  1. Reads the same client `config.json` LoyaltyBot already uses.
  2. Reads the same `loyalty-rewards-MASTER.csv` program list.
  3. For each feasible row, opens a tab via camofox, reads the accessibility
     snapshot, fuzzy-matches form fields by label, types the client's info
     using element refs (not brittle CSS selectors), and submits.
  4. Detects CAPTCHA/challenge pages by snapshot text. If `ENABLE_VNC=1` is
     set on the camofox server, prints a noVNC URL so a human can solve it
     visually (same "manual pause" UX as the Playwright version); otherwise
     marks the row `captcha_skipped`.
  5. Writes `signup-results-camofox.csv` with the same columns as before
     (url, brand, program, status, timestamp) so the dashboard keeps working.

Prereqs
-------
    pip install requests
    git clone https://github.com/jo-inc/camofox-browser && cd camofox-browser
    npm install && npm start   # -> http://localhost:9377

Usage
-----
    python auto_signup_camofox.py --limit 20
    python auto_signup_camofox.py --dry-run --limit 5
    python auto_signup_camofox.py --start-index 50 --delay 5
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from camofox_client import CamofoxClient, CamofoxError, parse_snapshot

# Ordered: more specific patterns first so "confirm password" doesn't match
# "password" generically before its own rule gets a chance, and "confirm
# email" doesn't match "email" before its own rule gets a chance.
# Field keys mirror the flattened config schema produced by flat_config(),
# including the employment/education/SSN fields used by LoyaltyBot_V3's
# richer client profiles (loan/credit/job-board style signup forms).
FIELD_PATTERNS: list[tuple[str, str]] = [
    (r"confirm.*password|verify.*password|re-?type.*password|repeat.*password", "password"),
    (r"\bpassword\b", "password"),
    (r"confirm.*e-?\s*mail|verify.*e-?\s*mail|re-?enter.*e-?\s*mail", "email"),
    (r"e-?\s*mail", "email"),
    (r"user\s*name|\busername\b", "username"),
    (r"first\s*name|given\s*name|\bfname\b", "first_name"),
    (r"last\s*name|surname|family\s*name|\blname\b", "last_name"),
    (r"full\s*name|your\s*name", "full_name"),
    (r"work\s*phone|business\s*phone|employer\s*phone", "employment.employer_phone"),
    (r"phone|mobile|cell", "phone"),
    (r"date\s*of\s*birth|birth\s*date|\bdob\b|birthday", "date_of_birth"),
    (r"\bssn\b|social\s*security|tax\s*id", "ssn"),
    (r"zip|postal", "address.zip"),
    (r"street|address\s*(line\s*1|1)?\b", "address.street"),
    (r"\bcity|town\b", "address.city"),
    (r"\bstate|province\b", "address.state"),
    (r"employer|company\s*name|organization", "employment.employer"),
    (r"job\s*title|occupation|position", "employment.job_title"),
    (r"income|salary", "employment.annual_income"),
    (r"college|university|school", "education.college"),
    (r"degree|education\s*level", "education.degree"),
]

SUBMIT_PATTERNS = re.compile(
    r"sign\s*up|create\s*account|join\s*(now|free)?|register|enroll|continue|submit",
    re.IGNORECASE,
)

CAPTCHA_PATTERNS = re.compile(
    r"captcha|recaptcha|hcaptcha|cloudflare|verify\s+you\s+are\s+human|"
    r"are\s+you\s+a?\s*human|press\s*&?\s*hold|i'?m\s+not\s+a\s+robot|"
    r"checking\s+your\s+browser",
    re.IGNORECASE,
)

INTERACTIVE_ROLES = {"textbox", "combobox", "searchbox"}


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "site"


def load_config(path: Path) -> dict:
    with open(path) as f:
        return json.load(f)


def flat_config(config: dict) -> dict:
    """Flatten config.json into the dotted keys used by FIELD_PATTERNS.

    LoyaltyBot_V3 configs nest `address`, `employment`, and `education` but
    also duplicate those fields at the top level for legacy scripts -- the
    top-level (non-dict) values win, and the nested dicts fill in anything
    missing under `<section>.<field>` dotted keys.
    """
    flat = {k: v for k, v in config.items() if not isinstance(v, dict)}
    for section in ("address", "employment", "education"):
        for k, v in config.get(section, {}).items():
            flat.setdefault(f"{section}.{k}", v)
            flat.setdefault(k, v)
    if "full_name" not in flat and flat.get("first_name") and flat.get("last_name"):
        flat["full_name"] = f"{flat['first_name']} {flat['last_name']}"
    return flat


def load_programs(csv_path: Path) -> list[dict]:
    """Read loyalty-rewards-MASTER.csv with flexible/legacy column names."""

    def norm(key: str) -> str:
        return re.sub(r"[\s_]+", "_", key.strip().lower())

    column_map = {
        "category": "category",
        "brand_name": "brand",
        "brand": "brand",
        "program_name": "program",
        "program": "program",
        "direct_sign-up_url": "url",
        "signup_url": "url",
        "url": "url",
        "auto_signup_feasible": "feasible",
        "feasible": "feasible",
        "barriers": "barriers",
    }

    rows = []
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for raw_row in reader:
            row = {}
            for key, value in raw_row.items():
                mapped = column_map.get(norm(key))
                if mapped:
                    row[mapped] = (value or "").strip()
            rows.append(row)
    return rows


def is_feasible(row: dict) -> bool:
    return row.get("feasible", "").strip().lower() in ("yes", "y", "true", "1")


# ── SMART QUEUE — barrier-based priority (mirrors auto-signup-parallel-FIXED.py) ──
BARRIER_PRIORITY = {
    "none noted": 0,
    "": 0,
    "payment required": 90,
    "ssn required; soft pull only": 80,
    "ssn required; soft pull": 80,
    "ssn and income info required": 85,
    "financing application required": 90,
    "in-store signup only": 99,
    "income verification required": 85,
    "rent-to-own application required": 90,
}


def get_priority(barriers: str) -> int:
    b = (barriers or "").strip().lower()
    if b in BARRIER_PRIORITY:
        return BARRIER_PRIORITY[b]
    if "captcha" in b:
        return 70
    if "ssn" in b:
        return 80
    if "payment" in b or "pay" in b:
        return 90
    if "in-store" in b or "in store" in b:
        return 99
    return 10


def sort_by_priority(rows: list[dict]) -> list[dict]:
    """Easy (no-barrier) sites first, CAPTCHA/SSN/payment/in-store sites last."""
    return sorted(rows, key=lambda r: get_priority(r.get("barriers", "")))


# ── DEAD-URL / NO-FORM STRIKE TRACKING ──────────────────────────────────────
# Same 3-strike (overall) / 2-strike (no-form-in-session) retirement rules as
# auto-signup-parallel-FIXED.py, so a camofox run and a Playwright run share
# the same dead-urls.json and don't keep re-trying permanently broken sites.
MAX_STRIKES = 3
NO_FORM_MAX_STRIKES = 2


def load_dead_urls(path: Path) -> set[str]:
    if path.exists():
        try:
            return set(json.loads(path.read_text(encoding="utf-8")).get("urls", []))
        except Exception:
            return set()
    return set()


def save_dead_urls(path: Path, dead_urls: set[str]) -> None:
    path.write_text(json.dumps({"urls": sorted(dead_urls)}, indent=2), encoding="utf-8")


def retire_repeated_failures(results_path: Path, dead_urls: set[str]) -> set[str]:
    """Scan a results CSV and add URLs with >= MAX_STRIKES failures and 0
    successes to `dead_urls`. Returns the (possibly expanded) set."""
    if not results_path.exists():
        return dead_urls
    from collections import defaultdict

    url_stats = defaultdict(lambda: {"failures": 0, "successes": 0})
    with open(results_path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            url = (row.get("url") or "").strip()
            status = (row.get("status") or "").strip()
            if not url:
                continue
            if status == "success":
                url_stats[url]["successes"] += 1
            elif status in ("failed", "timeout", "navigation_error", "captcha_failed", "captcha_skipped"):
                url_stats[url]["failures"] += 1

    for url, stats in url_stats.items():
        if stats["failures"] >= MAX_STRIKES and stats["successes"] == 0:
            dead_urls.add(url)
    return dead_urls


def match_field(label: str) -> str | None:
    for pattern, field in FIELD_PATTERNS:
        if re.search(pattern, label, re.IGNORECASE):
            return field
    return None


def get_value(flat_cfg: dict, field: str) -> str | None:
    value = flat_cfg.get(field)
    if value:
        return value
    if field == "employment.annual_income":
        return flat_cfg.get("employment.monthly_income") or flat_cfg.get("monthly_income")
    return None


def fill_form(client: CamofoxClient, tab_id: str, user_id: str, flat_cfg: dict, log) -> int:
    """Fuzzy-match snapshot fields to config values and type them in.

    Returns the number of fields filled.
    """
    snap = client.snapshot(tab_id, user_id)
    items = parse_snapshot(snap.get("snapshot", ""))

    filled = 0
    used_password_slot = False
    for item in items:
        if item.role not in INTERACTIVE_ROLES:
            continue
        field = match_field(item.label)
        if not field:
            continue

        if field == "password":
            value = flat_cfg.get("password")
            # Both "password" and "confirm password" rules map here -- fill
            # both occurrences with the same value.
            used_password_slot = True
        else:
            value = get_value(flat_cfg, field)

        if not value:
            continue

        try:
            client.type(tab_id, user_id, item.ref, str(value))
            filled += 1
            log(f"  filled {item.role} '{item.label}' ({item.ref}) <- {field}")
        except CamofoxError as e:
            log(f"  WARN could not type into {item.ref}: {e}")

    _ = used_password_slot
    return filled


def find_submit_ref(client: CamofoxClient, tab_id: str, user_id: str) -> str | None:
    snap = client.snapshot(tab_id, user_id)
    items = parse_snapshot(snap.get("snapshot", ""))
    for item in items:
        if item.role in ("button", "link") and SUBMIT_PATTERNS.search(item.label):
            return item.ref
    return None


def snapshot_has_captcha(client: CamofoxClient, tab_id: str, user_id: str) -> bool:
    snap = client.snapshot(tab_id, user_id)
    return bool(CAPTCHA_PATTERNS.search(snap.get("snapshot", "")))


def wait_out_captcha(client: CamofoxClient, tab_id: str, user_id: str, timeout_s: int, log) -> bool:
    """If VNC is enabled on the server, give the human a chance to solve it.

    Returns True if the captcha pattern disappeared before the timeout.
    """
    vnc_port = 6080
    log(
        f"  CAPTCHA detected. If ENABLE_VNC=1 on the camofox server, open "
        f"http://<camofox-host>:{vnc_port} to solve it manually "
        f"(timeout {timeout_s}s)."
    )
    deadline = time.monotonic() + timeout_s
    while time.monotonic() < deadline:
        time.sleep(3)
        if not snapshot_has_captcha(client, tab_id, user_id):
            log("  CAPTCHA cleared.")
            return True
    return False


def write_result_row(out_path: Path, row: dict) -> None:
    fieldnames = ["url", "brand", "program", "status", "timestamp"]
    file_exists = out_path.exists()
    with open(out_path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)


def run(args: argparse.Namespace) -> int:
    config = load_config(Path(args.config))
    flat_cfg = flat_config(config)
    programs = load_programs(Path(args.csv))

    feasible = [r for r in programs if r.get("url") and (args.include_infeasible or is_feasible(r))]
    start = args.start_index
    end = start + args.limit if args.limit else None
    batch = feasible[start:end]

    client = CamofoxClient(base_url=args.camofox_url)
    client.wait_for_browser()

    out_path = Path(args.output)
    print(f"Running {len(batch)} signups via camofox at {client.base_url}")

    for i, row in enumerate(batch, start=start):
        brand = row.get("brand", "")
        program = row.get("program", "")
        url = row["url"]
        user_id = f"loyaltybot-{slugify(brand or program or url)}"
        session_key = "signup"

        print(f"[{i}] {brand} -- {program} -- {url}")

        status = "failed"
        try:
            tab_id = client.create_tab(user_id, session_key, url)
            client.wait(tab_id, user_id, timeout_ms=3000)

            filled = fill_form(client, tab_id, user_id, flat_cfg, log=print)
            print(f"  filled {filled} field(s)")

            if snapshot_has_captcha(client, tab_id, user_id):
                if wait_out_captcha(client, tab_id, user_id, args.captcha_timeout, log=print):
                    filled += fill_form(client, tab_id, user_id, flat_cfg, log=print)
                else:
                    status = "captcha_skipped"

            if status != "captcha_skipped":
                if args.dry_run:
                    status = "dry_run"
                elif filled == 0:
                    status = "failed"
                else:
                    submit_ref = find_submit_ref(client, tab_id, user_id)
                    if submit_ref:
                        client.click(tab_id, user_id, ref=submit_ref)
                        client.wait(tab_id, user_id, timeout_ms=3000)
                        status = "success" if not snapshot_has_captcha(client, tab_id, user_id) else "captcha_skipped"
                    else:
                        status = "failed"

            client.close_tab(tab_id, user_id)
        except CamofoxError as e:
            print(f"  ERROR: {e}")
            status = "failed"

        write_result_row(
            out_path,
            {
                "url": url,
                "brand": brand,
                "program": program,
                "status": status,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

        if args.delay and i < (start + len(batch) - 1):
            time.sleep(args.delay)

    print(f"Done. Results written to {out_path}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--config", default="config.json", help="Path to client config.json")
    parser.add_argument("--csv", default="loyalty-rewards-MASTER.csv", help="Path to program master CSV")
    parser.add_argument("--output", default="signup-results-camofox.csv", help="Path to results CSV")
    parser.add_argument("--limit", type=int, default=0, help="Max number of sites to process (0 = all)")
    parser.add_argument("--start-index", type=int, default=0, help="Start from this row in the CSV")
    parser.add_argument("--dry-run", action="store_true", help="Fill forms but don't submit")
    parser.add_argument("--captcha-timeout", type=int, default=120, help="Seconds to wait for manual CAPTCHA solve")
    parser.add_argument("--delay", type=int, default=3, help="Seconds to wait between sites")
    parser.add_argument(
        "--include-infeasible",
        action="store_true",
        help="Also process rows where Auto_Signup_Feasible != Yes",
    )
    parser.add_argument(
        "--camofox-url",
        default=None,
        help="camofox-browser base URL (default: $CAMOFOX_URL or http://localhost:9377)",
    )
    args = parser.parse_args(argv)
    return run(args)


if __name__ == "__main__":
    sys.exit(main())
