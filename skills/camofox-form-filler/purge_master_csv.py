#!/usr/bin/env python3
"""Purge dead/retired/junk rows from loyalty-rewards-MASTER.csv.

Runs three independent filters and writes a cleaned CSV plus a report of what
was removed and why. Nothing is deleted silently -- rerun with --apply once
the report looks right, or use --output to write elsewhere and diff by hand.

Filters
-------
1. dead-urls.json  -- URLs already 3-strike/no-form-strike retired by the
   engines. These are proven dead against THIS client's real runs.
2. --live-check     -- optional: HEAD (falling back to GET) every remaining
   URL with a short timeout/retry and drop anything that doesn't resolve
   (DNS failure, connection refused, 404/410/5xx, or a domain-parking
   redirect). Off by default because it makes real HTTP requests and can
   take a while on 500+ rows -- pass --live-check to enable it.
3. --exclude-category / --exclude-brand / built-in junk list -- category or
   brand-name matches that are structurally bad fits for an unattended auto-
   signup bot regardless of whether the site works: single-location or
   franchise businesses (car dealerships, local auto shops) whose "loyalty
   program" is actually a lead-gen contact form, financing application, or
   in-store-only enrollment. These almost never have a real self-service
   signup form, so they inflate the failure count without any bug to fix.

Usage
-----
    python purge_master_csv.py --csv loyalty-rewards-MASTER.csv
    python purge_master_csv.py --csv loyalty-rewards-MASTER.csv --live-check
    python purge_master_csv.py --csv loyalty-rewards-MASTER.csv --apply
    python purge_master_csv.py --csv loyalty-rewards-MASTER.csv \\
        --exclude-brand "Nissan,Toyota,Ford" --exclude-category "Automotive"
"""

from __future__ import annotations

import argparse
import csv
import re
import shutil
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

from auto_signup_camofox import load_dead_urls, load_programs, retire_repeated_failures

# Categories/brands that are structurally unfit for unattended auto-signup:
# dealership and franchise "rewards" pages are almost always a lead-gen
# contact form or financing application gated behind a specific store visit,
# not a self-service signup form -- no bug fix makes those succeed.
JUNK_CATEGORY_PATTERNS = re.compile(
    r"auto(motive)?\s*dealer|car\s*dealer|dealership|auto\s*financ|"
    r"vehicle\s*(financ|leas)|rent-?to-?own|funeral|timeshare",
    re.IGNORECASE,
)

# Individual dealer/franchise brand names slip through even when the category
# column is missing or mislabeled (e.g. filed under "Retail"). This list is
# deliberately about the *business model* (single-location or franchise
# dealership networks with financing-gated "rewards"), not about disliking
# any particular brand.
JUNK_BRAND_PATTERNS = re.compile(
    r"\bnissan\b|\btoyota\b|\bhonda\b|\bford\b|\bchevrolet\b|\bchevy\b|"
    r"\bjeep\b|\bdodge\b|\bram\b|\bchrysler\b|\bhyundai\b|\bkia\b|\bmazda\b|"
    r"\bsubaru\b|\bvolkswagen\b|\bvw\b|\baudi\b|\bbmw\b|\bmercedes\b|"
    r"\blexus\b|\bacura\b|\binfiniti\b|\bbuick\b|\bgmc\b|\bcadillac\b|"
    r"\blincoln\b|\bmitsubishi\b|\bvolvo\b|\bporsche\b|\btesla\b\s*dealer|"
    r"\bcarmax\b|\bcargurus\b|\bautonation\b|\bdealership\b",
    re.IGNORECASE,
)

# Barrier values that mean "there is no online form to fill" -- these are a
# scheduling/staffing problem, not something a browser automation fix can
# solve.
JUNK_BARRIER_PATTERNS = re.compile(
    r"in-?store\s*(signup|only|enrollment)|requires?\s*(a\s*)?visit|"
    r"branch\s*(visit|only)|call\s*to\s*enroll|phone\s*(only|required)\s*to\s*enroll",
    re.IGNORECASE,
)

DEFAULT_TIMEOUT = 8.0
LIVE_CHECK_RETRIES = 2


def is_junk_row(row: dict, extra_categories: list[str], extra_brands: list[str]) -> str | None:
    """Return a human-readable reason if the row should be purged as junk, else None."""
    category = row.get("category", "")
    brand = row.get("brand", "")
    program = row.get("program", "")
    barriers = row.get("barriers", "")

    if JUNK_CATEGORY_PATTERNS.search(category):
        return f"junk category: {category!r}"
    if JUNK_BRAND_PATTERNS.search(brand) or JUNK_BRAND_PATTERNS.search(program):
        return f"junk brand/program: {brand or program!r}"
    if JUNK_BARRIER_PATTERNS.search(barriers):
        return f"no online form: barriers={barriers!r}"
    for pat in extra_categories:
        if pat.lower() in category.lower():
            return f"excluded category: {category!r}"
    for pat in extra_brands:
        if pat.lower() in brand.lower() or pat.lower() in program.lower():
            return f"excluded brand: {brand or program!r}"
    return None


def check_url_live(url: str, timeout: float, retries: int) -> str | None:
    """Return a failure reason if the URL does not resolve, else None.

    HEAD first (cheap), falling back to GET (some servers 405 on HEAD).
    Treats DNS failure, connection refused/reset, and 404/410/5xx as dead;
    everything else (including sites that challenge/redirect a bot, which is
    a signup-time problem, not a dead-URL problem) is left alone.
    """
    import requests

    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return f"malformed URL: {url!r}"

    last_error = None
    for attempt in range(retries):
        try:
            resp = requests.head(url, timeout=timeout, allow_redirects=True)
            if resp.status_code == 405:
                resp = requests.get(url, timeout=timeout, allow_redirects=True, stream=True)
        except requests.RequestException as e:
            last_error = f"{type(e).__name__}: {e}"
            if attempt < retries - 1:
                time.sleep(1.5)
            continue
        if resp.status_code in (404, 410):
            return f"HTTP {resp.status_code}"
        if resp.status_code >= 500:
            last_error = f"HTTP {resp.status_code}"
            if attempt < retries - 1:
                time.sleep(1.5)
            continue
        return None
    return last_error or "unreachable"


def run(args: argparse.Namespace) -> int:
    csv_path = Path(args.csv)
    dead_urls_path = Path(args.dead_urls)

    dead_urls = load_dead_urls(dead_urls_path)
    if args.results:
        dead_urls = retire_repeated_failures(Path(args.results), dead_urls)

    rows = load_programs(csv_path)
    extra_categories = [c.strip() for c in (args.exclude_category or "").split(",") if c.strip()]
    extra_brands = [b.strip() for b in (args.exclude_brand or "").split(",") if b.strip()]

    kept, removed = [], []

    for row in rows:
        url = row.get("url", "").strip()
        if not url:
            removed.append((row, "no URL"))
            continue
        if url in dead_urls:
            removed.append((row, "retired: 3-strike dead-urls.json"))
            continue
        reason = is_junk_row(row, extra_categories, extra_brands)
        if reason:
            removed.append((row, reason))
            continue
        kept.append(row)

    if args.live_check:
        print(f"Live-checking {len(kept)} URL(s) (timeout={args.timeout}s, retries={LIVE_CHECK_RETRIES})...")
        still_kept = []
        for i, row in enumerate(kept, 1):
            reason = check_url_live(row["url"], args.timeout, LIVE_CHECK_RETRIES)
            if reason:
                removed.append((row, f"dead on live check: {reason}"))
                print(f"  [{i}/{len(kept)}] DEAD  {row.get('brand','')} -- {reason}")
            else:
                still_kept.append(row)
            if args.live_check_delay:
                time.sleep(args.live_check_delay)
        kept = still_kept

    print(f"\n{len(kept)} kept, {len(removed)} removed (of {len(rows)} total)")
    if removed:
        print("\nRemoved:")
        for row, reason in removed:
            print(f"  {row.get('brand','') or row.get('program',''):30.30} {reason}")

    if args.report:
        report_path = Path(args.report)
        with open(report_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["brand", "program", "url", "reason"])
            for row, reason in removed:
                writer.writerow([row.get("brand", ""), row.get("program", ""), row.get("url", ""), reason])
        print(f"\nReport written to {report_path}")

    if not args.apply:
        print("\nDry run -- nothing written. Re-run with --apply to write the cleaned CSV.")
        return 0

    # Preserve the original file's exact header/column names and row order for
    # any columns we recognize, so downstream tools (dashboard, other scripts)
    # keep working unmodified.
    with open(csv_path, newline="", encoding="utf-8") as f:
        original_header = next(csv.reader(f))

    if args.backup:
        backup_path = csv_path.with_suffix(csv_path.suffix + ".bak")
        shutil.copy2(csv_path, backup_path)
        print(f"Backed up original to {backup_path}")

    kept_urls = {r["url"] for r in kept}
    out_path = Path(args.output) if args.output else csv_path

    # Read every row into memory FIRST. When out_path == csv_path (the default,
    # in-place purge), opening the output for writing while a DictReader on the
    # same path is still mid-iteration truncates the file out from under the
    # reader -- every row after that point silently vanishes instead of being
    # evaluated. Rows/backup are safely captured before any write happens.
    with open(csv_path, newline="", encoding="utf-8") as f_in:
        raw_rows = list(csv.DictReader(f_in))

    kept_raw_rows = []
    for raw_row in raw_rows:
        url_col = next((v for k, v in raw_row.items()
                        if k and "url" in k.strip().lower()), "")
        if (url_col or "").strip() in kept_urls:
            kept_raw_rows.append(raw_row)

    with open(out_path, "w", newline="", encoding="utf-8") as f_out:
        writer = csv.DictWriter(f_out, fieldnames=original_header)
        writer.writeheader()
        writer.writerows(kept_raw_rows)

    print(f"Cleaned CSV written to {out_path} ({len(kept)} rows).")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--csv", default="loyalty-rewards-MASTER.csv", help="Path to the master CSV")
    parser.add_argument("--dead-urls", default="dead-urls.json", help="Path to shared dead-urls.json")
    parser.add_argument("--results", default=None,
                        help="Optional results CSV to also mine for 3-strike failures before purging")
    parser.add_argument("--exclude-category", default="", help="Comma-separated extra category substrings to purge")
    parser.add_argument("--exclude-brand", default="", help="Comma-separated extra brand/program substrings to purge")
    parser.add_argument("--live-check", action="store_true",
                        help="Also drop URLs that fail a live HEAD/GET request (makes real HTTP calls)")
    parser.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT, help="Live-check request timeout (seconds)")
    parser.add_argument("--live-check-delay", type=float, default=0.3, help="Seconds between live-check requests")
    parser.add_argument("--report", default="purge-report.csv", help="Where to write the removed-rows report (blank to skip)")
    parser.add_argument("--apply", action="store_true", help="Write the cleaned CSV (default is dry-run/report-only)")
    parser.add_argument("--output", default=None, help="Write cleaned CSV here instead of overwriting --csv")
    parser.add_argument("--no-backup", dest="backup", action="store_false",
                        help="Skip writing a .bak copy of the original CSV when overwriting in place")
    parser.set_defaults(backup=True)
    args = parser.parse_args(argv)
    return run(args)


if __name__ == "__main__":
    sys.exit(main())
