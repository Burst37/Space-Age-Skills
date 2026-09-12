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
    (r"\bpassword\b|\bpasscode\b", "password"),
    (r"confirm.*e-?\s*mail|verify.*e-?\s*mail|re-?enter.*e-?\s*mail", "email"),
    (r"e-?\s*mail", "email"),
    (r"user\s*name|\busername\b|\buser\s*id\b", "username"),
    (r"first\s*name|given\s*name|\bfname\b", "first_name"),
    (r"last\s*name|surname|family\s*name|\blname\b", "last_name"),
    (r"middle\s*(name|initial)", "middle_name"),
    (r"full\s*name|your\s*name|\bname\s*on\b", "full_name"),
    (r"work\s*phone|business\s*phone|employer\s*phone", "employment.employer_phone"),
    (r"phone|mobile|cell", "phone"),
    (r"date\s*of\s*birth|birth\s*date|\bdob\b|birthday", "date_of_birth"),
    (r"\bssn\b|social\s*security|\btax\s*id\b", "ssn"),
    (r"\bzip\b|zip\s*code|postal", "address.zip"),
    # Address line 2 is apartment/suite, NOT the street -- matching it with the
    # street rule (as `address\s*(line\s*1|1)?` did) wrote the street twice and
    # left the real line-1 field either duplicated or, on validation, rejected.
    (r"address\s*(line\s*)?2|\bapt\b|apartment|\bsuite\b|\bunit\b", "address.line2"),
    (r"\bstreet\b|street\s*address|address\s*(line\s*)?1\b|^address$|mailing\s*address",
     "address.street"),
    # Each alternative needs its own boundaries: `\bcity|town\b` parses as
    # (\bcity) OR (town\b), so it matched "Downtown" and mis-filled fields.
    (r"\bcity\b|\btown\b", "address.city"),
    (r"\bstate\b|\bprovince\b|\bregion\b", "address.state"),
    (r"\bcountry\b", "address.country"),
    (r"employer|company\s*name|\borganization\b", "employment.employer"),
    (r"job\s*title|occupation|position", "employment.job_title"),
    (r"\bincome\b|\bsalary\b", "employment.annual_income"),
    (r"college|university|school", "education.college"),
    (r"degree|education\s*level", "education.degree"),
]

SUBMIT_PATTERNS = re.compile(
    r"sign\s*up|create\s*(an\s*)?account|join\s*(now|free)?|register|enroll|continue|submit|"
    r"next\b|create\s*profile",
    re.IGNORECASE,
)

CAPTCHA_PATTERNS = re.compile(
    r"captcha|recaptcha|hcaptcha|turnstile|cloudflare|verify\s+you\s+are\s+human|"
    r"are\s+you\s+a?\s*human|press\s*&?\s*hold|i'?m\s+not\s+a\s+robot|"
    r"checking\s+your\s+browser|unusual\s+traffic|access\s+denied",
    re.IGNORECASE,
)

# Checkboxes a signup form requires before it will submit. Leaving the terms
# box unticked is a silent submit failure on most retail programs.
REQUIRED_CHECKBOX_PATTERNS = re.compile(
    r"terms|conditions|privacy|policy|\bagree\b|\baccept\b|over\s*(13|16|18|21)|"
    r"age\s*of|i\s+am\s+at\s+least|consent|acknowledg",
    re.IGNORECASE,
)

# Checkboxes to leave alone -- ticking these opts the client into marketing or,
# worse, a paid tier.
SKIP_CHECKBOX_PATTERNS = re.compile(
    r"newsletter|marketing|promotional|third[- ]party|partner\s+offers|text\s+me|"
    r"sms|upgrade|premium|paid|subscri",
    re.IGNORECASE,
)

# Post-submit page text that proves the signup did NOT go through. Without
# this check every submit that bounced off validation was recorded as a
# success, which is why the measured rate never matched reality.
SUBMIT_ERROR_PATTERNS = re.compile(
    r"is\s+required|required\s+field|please\s+(enter|select|provide|correct|fill)|"
    r"invalid\s+(email|password|phone|address|zip)|already\s+(exists|registered|in\s+use)|"
    r"try\s+again|something\s+went\s+wrong|error\s+occurred|must\s+be\s+at\s+least|"
    r"passwords?\s+do\s+not\s+match|we\s+couldn'?t",
    re.IGNORECASE,
)

SUBMIT_SUCCESS_PATTERNS = re.compile(
    r"thank\s*you|welcome\s+(to|aboard)|check\s+your\s+(e-?mail|inbox)|"
    r"verify\s+your\s+e-?mail|confirmation\s+e-?mail|account\s+(created|activated)|"
    r"you'?re\s+(all\s+set|in\b)|successfully\s+(created|registered|enrolled)|"
    r"registration\s+complete",
    re.IGNORECASE,
)

# `spinbutton` is <input type=number> (zip, income, age) and `textarea` is a
# multi-line address field -- both were skipped entirely before.
INTERACTIVE_ROLES = {"textbox", "combobox", "searchbox", "spinbutton", "textarea"}
SELECT_ROLES = {"combobox", "listbox", "menu"}


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


def snapshot_items(client: CamofoxClient, tab_id: str, user_id: str) -> list:
    """Full (paged) snapshot, parsed. Returns [] instead of raising."""
    try:
        return parse_snapshot(client.snapshot_text(tab_id, user_id))
    except CamofoxError:
        return []


def count_form_fields(items: list) -> int:
    return sum(1 for it in items if it.role in INTERACTIVE_ROLES and match_field(it.label))


def wait_for_form(client: CamofoxClient, tab_id: str, user_id: str, timeout_s: float,
                  min_fields: int = 1) -> list:
    """Poll the snapshot until form fields appear, or the timeout expires.

    A single fixed 3s wait after opening the tab was not enough for the many
    signup pages that render their form from JavaScript, so the snapshot was
    taken against an empty document and the site was written off as
    "no form fields found" while it was merely still loading.
    """
    deadline = time.monotonic() + timeout_s
    items = snapshot_items(client, tab_id, user_id)
    while time.monotonic() < deadline:
        if count_form_fields(items) >= min_fields:
            return items
        time.sleep(1.0)
        items = snapshot_items(client, tab_id, user_id)
    return items


def fill_form(client: CamofoxClient, tab_id: str, user_id: str, flat_cfg: dict, log,
              filled_refs: set[str] | None = None, items: list | None = None) -> int:
    """Fill every field/select/required checkbox we can match. Returns the count.

    `filled_refs` carries state across calls so a re-fill (after a CAPTCHA, or
    a second pass) skips fields already populated instead of appending to them.
    """
    if items is None:
        items = snapshot_items(client, tab_id, user_id)
    if filled_refs is None:
        filled_refs = set()

    filled = 0
    for item in items:
        if item.ref in filled_refs:
            continue

        if item.role in ("checkbox", "switch"):
            label = item.label
            if SKIP_CHECKBOX_PATTERNS.search(label) or not REQUIRED_CHECKBOX_PATTERNS.search(label):
                continue
            try:
                client.check(tab_id, user_id, item.ref)
                filled_refs.add(item.ref)
                log(f"  ticked checkbox '{label}' ({item.ref})")
            except CamofoxError as e:
                log(f"  WARN could not tick {item.ref}: {e}")
            continue

        if item.role not in INTERACTIVE_ROLES:
            continue
        field = match_field(item.label)
        if not field:
            continue

        value = flat_cfg.get("password") if field == "password" else get_value(flat_cfg, field)
        if not value:
            continue

        try:
            if item.role in SELECT_ROLES:
                client.select(tab_id, user_id, item.ref, str(value))
            else:
                client.clear(tab_id, user_id, item.ref)
                client.type(tab_id, user_id, item.ref, str(value))
            filled += 1
            filled_refs.add(item.ref)
            log(f"  filled {item.role} '{item.label}' ({item.ref}) <- {field}")
        except CamofoxError as e:
            log(f"  WARN could not fill {item.ref}: {e}")

    return filled


def find_submit_ref(client: CamofoxClient, tab_id: str, user_id: str,
                    items: list | None = None) -> str | None:
    if items is None:
        items = snapshot_items(client, tab_id, user_id)
    for item in items:
        if item.role in ("button", "link") and SUBMIT_PATTERNS.search(item.label):
            return item.ref
    return None


def verify_submission(client: CamofoxClient, tab_id: str, user_id: str) -> tuple[str, str]:
    """Classify the page after a submit click: (status, error).

    Previously any post-submit page without a CAPTCHA counted as a success,
    including pages still showing "Email is required".
    """
    try:
        text = client.snapshot_text(tab_id, user_id)
    except CamofoxError as e:
        # The click navigated somewhere we cannot read; treat as unverified
        # rather than inventing a success.
        return "failed", f"could not verify submission: {e}"

    if CAPTCHA_PATTERNS.search(text):
        return "captcha_skipped", "captcha after submit"
    if SUBMIT_SUCCESS_PATTERNS.search(text):
        return "success", ""
    error_match = SUBMIT_ERROR_PATTERNS.search(text)
    if error_match:
        return "failed", f"form rejected: {error_match.group(0)[:80]}"
    # No confirmation and no error: the form is gone from the page, which is
    # the usual shape of a successful redirect.
    if count_form_fields(parse_snapshot(text)) == 0:
        return "success", ""
    return "failed", "form still present after submit"


def snapshot_has_captcha(client: CamofoxClient, tab_id: str, user_id: str) -> bool:
    try:
        return bool(CAPTCHA_PATTERNS.search(client.snapshot_text(tab_id, user_id)))
    except CamofoxError:
        return False


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


# Same 7 columns as the parallel engine and auto-signup-parallel-FIXED.py.
# The 5-column shape this used to write made results from a single-process run
# unreadable to the dashboard and to retire_repeated_failures().
RESULTS_FIELDNAMES = ["url", "brand", "program", "status", "worker", "error", "timestamp"]


def write_result_row(out_path: Path, row: dict) -> None:
    fieldnames = RESULTS_FIELDNAMES
    file_exists = out_path.exists() and out_path.stat().st_size > 0
    with open(out_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
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
        error = ""
        tab_id = None
        try:
            tab_id = client.create_tab(user_id, session_key, url)
            items = wait_for_form(client, tab_id, user_id, args.page_timeout)

            filled_refs: set[str] = set()
            filled = fill_form(client, tab_id, user_id, flat_cfg, print, filled_refs, items)
            print(f"  filled {filled} field(s)")

            if snapshot_has_captcha(client, tab_id, user_id):
                if wait_out_captcha(client, tab_id, user_id, args.captcha_timeout, log=print):
                    filled += fill_form(client, tab_id, user_id, flat_cfg, print, filled_refs)
                else:
                    status, error = "captcha_skipped", "captcha not solved"

            if status != "captcha_skipped":
                if filled == 0:
                    status, error = "failed", "no form fields found"
                elif args.dry_run:
                    status = "dry_run"
                else:
                    submit_ref = find_submit_ref(client, tab_id, user_id)
                    if submit_ref:
                        client.click(tab_id, user_id, ref=submit_ref)
                        try:
                            client.wait(tab_id, user_id, timeout_ms=5000)
                        except CamofoxError:
                            pass
                        status, error = verify_submission(client, tab_id, user_id)
                    else:
                        status, error = "failed", "submit button not found"
        except CamofoxError as e:
            print(f"  ERROR: {e}")
            status, error = "failed", str(e)[:200]
        except Exception as e:  # never let one bad site abort the whole run
            print(f"  UNEXPECTED ERROR: {type(e).__name__}: {e}")
            status, error = "failed", f"{type(e).__name__}: {e}"[:200]
        finally:
            # Always release the tab. Leaked tabs pile up inside camofox and
            # starve later sites of browser resources.
            if tab_id:
                try:
                    client.close_tab(tab_id, user_id)
                except Exception:
                    pass

        write_result_row(
            out_path,
            {
                "url": url,
                "brand": brand,
                "program": program,
                "status": status,
                "worker": 0,
                "error": error,
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
    parser.add_argument("--page-timeout", type=float, default=20.0,
                        help="Seconds to wait for a form to render before giving up")
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
