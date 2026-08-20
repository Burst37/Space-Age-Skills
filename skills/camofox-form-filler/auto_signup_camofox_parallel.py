#!/usr/bin/env python3
"""Parallel, camofox-backed signup runner matching LoyaltyBot_V3's
`auto-signup-parallel-FIXED.py` contract (config/progress/results files,
CLI flags, smart queue, dead-URL retirement) so it can be dropped in as an
alternate "engine" behind `loyaltybot_server.py`'s `do_launch()`.

Why a separate engine instead of patching auto-signup-parallel-FIXED.py
-------------------------------------------------------------------------
auto-signup-parallel-FIXED.py drives Chromium via Playwright and ships ~250
lines of hand-written STEALTH_JS to patch navigator.webdriver, WebGL,
plugins, etc. Camoufox patches the same signals (and more) at the C++ level,
so this script throws all of that away and drives camofox-browser's REST API
instead -- accessibility-snapshot refs instead of CSS selectors, no STEALTH_JS
injection needed.

CapSolver note
--------------
camofox-browser's REST API does not expose a generic JS-eval/page-script
endpoint, so CapSolver token *injection* (auto-solving reCAPTCHA/hCaptcha/
Turnstile) is not implemented here. In practice Camoufox's fingerprint
spoofing means far fewer CAPTCHA challenges are served in the first place;
any that do appear fall back to the same noVNC manual-solve flow as
camofox_client/auto_signup_camofox.py (`ENABLE_VNC=1` on the camofox server).

Outputs match auto-signup-parallel-FIXED.py so the existing dashboard.html
and loyaltybot_server.py status/results endpoints work unmodified:
  - results CSV columns: url,brand,program,status,worker,error,timestamp
  - progress.json: {running, start_time, stats{total,processed,success,
    failed,captcha,skipped}, current_workers[], log[], eta_seconds}
  - dead-urls.json: {"urls": [...]} -- shared 3-strike retirement list

Usage
-----
    python auto_signup_camofox_parallel.py \\
        --config config_tyjuan01.json \\
        --csv loyalty-rewards-MASTER.csv \\
        --progress progress_tyjuan01.json \\
        --results signup-results_tyjuan01.csv \\
        --workers 5 --delay 1.5

    python auto_signup_camofox_parallel.py --dry-run --limit 5
    python auto_signup_camofox_parallel.py --retry --workers 3
"""

from __future__ import annotations

import argparse
import csv
import json
import queue
import re
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

from camofox_client import CamofoxClient, CamofoxError, parse_snapshot
from auto_signup_camofox import (
    CAPTCHA_PATTERNS,
    INTERACTIVE_ROLES,
    SUBMIT_PATTERNS,
    flat_config,
    get_value,
    load_config,
    load_dead_urls,
    load_programs,
    match_field,
    is_feasible,
    retire_repeated_failures,
    save_dead_urls,
    slugify,
    sort_by_priority,
)

DEFAULT_WORKERS = 5
DEFAULT_DELAY_SECONDS = 1.5
RESULTS_FIELDNAMES = ["url", "brand", "program", "status", "worker", "error", "timestamp"]

NO_FORM_MAX_STRIKES = 2
RETRYABLE_STATUSES = {"failed", "timeout", "navigation_error", "captcha_failed", "captcha_skipped"}

# Min interactive fields that count as "a form is on this page". Below this we
# hunt for a Sign Up / Create Account link to navigate to the real form --
# mirrors auto-signup-parallel-FIXED.py's `initial_fields < 2` modal/link hunt,
# which is the difference between "no form fields found" and a success on the
# many retail sites that hide signup behind a person-icon or "Sign In" modal.
MIN_FORM_FIELDS = 2
MAX_NAV_HOPS = 2  # how many signup-link clicks to chase before giving up

# Cookie/consent banners block interaction; dismiss before scanning for a form.
CONSENT_PATTERNS = re.compile(
    r"accept\s+all|accept\s+cookies|allow\s+all|i\s+accept|i\s+agree|\bagree\b|"
    r"got\s+it|allow\s+cookies",
    re.IGNORECASE,
)

# Links/buttons that lead from a landing page TO the signup form.
SIGNUP_LINK_PATTERNS = re.compile(
    r"create\s+(an\s+)?account|sign\s*up|register|join(\s+(now|free))?|"
    r"become\s+a\s+member|enroll|get\s+started|create\s+profile|new\s+customer|"
    r"new\s+user|don'?t\s+have\s+an\s+account|not\s+a\s+member|sign\s*in|log\s*in",
    re.IGNORECASE,
)

_progress_lock = threading.Lock()
_results_lock = threading.Lock()
_dead_urls_lock = threading.Lock()
_progress_log: list[dict] = []
_current_workers: dict[int, dict] = {}
_no_form_strikes: dict[str, int] = {}


def append_progress_log(worker: int, brand: str, program: str, status: str, message: str = "") -> None:
    global _progress_log
    with _progress_lock:
        _progress_log.append({
            "time": datetime.utcnow().strftime("%H:%M:%S"),
            "worker": worker,
            "brand": brand,
            "program": program,
            "status": status,
            "message": message,
        })
        if len(_progress_log) > 50:
            _progress_log = _progress_log[-50:]


def write_progress(progress_path: Path, running: bool, stats: dict, start_time: float | None) -> None:
    eta_seconds = 0
    if running and stats.get("processed", 0) > 0 and start_time:
        elapsed = time.time() - start_time
        remaining = stats["total"] - stats["processed"]
        eta_seconds = int((elapsed / stats["processed"]) * remaining)

    with _progress_lock:
        workers_list = [
            {"id": wid, "brand": w.get("brand", ""), "status": w.get("status", "idle")}
            for wid, w in sorted(_current_workers.items())
        ]
        data = {
            "running": running,
            "start_time": datetime.utcfromtimestamp(start_time).strftime("%Y-%m-%dT%H:%M:%SZ") if start_time else None,
            "stats": {k: stats.get(k, 0) for k in ("total", "processed", "success", "failed", "captcha", "skipped")},
            "current_workers": workers_list,
            "log": list(_progress_log),
            "eta_seconds": eta_seconds,
        }
    try:
        with open(progress_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except OSError as exc:
        print(f"WARN: failed to write {progress_path}: {exc}")


def append_result(results_path: Path, url: str, brand: str, program: str, status: str, worker: int, error: str = "") -> None:
    with _results_lock:
        write_header = not results_path.exists() or results_path.stat().st_size == 0
        with open(results_path, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=RESULTS_FIELDNAMES)
            if write_header:
                writer.writeheader()
            writer.writerow({
                "url": url,
                "brand": brand,
                "program": program,
                "status": status,
                "worker": worker,
                "error": error,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })


def load_processed_urls(results_path: Path) -> set[str]:
    processed = set()
    if results_path.exists():
        with open(results_path, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if (row.get("status") or "").strip() == "success":
                    processed.add((row.get("url") or "").strip())
    return processed


def load_failed_urls(results_path: Path) -> set[str]:
    failed: set[str] = set()
    if not results_path.exists():
        return failed
    with open(results_path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            url = (row.get("url") or "").strip()
            status = (row.get("status") or "").strip()
            if status in RETRYABLE_STATUSES:
                failed.add(url)
            elif status == "success":
                failed.discard(url)
    return failed


def mark_url_dead(dead_urls_path: Path, dead_urls: set[str], url: str) -> None:
    with _dead_urls_lock:
        if url in dead_urls:
            return
        dead_urls.add(url)
        save_dead_urls(dead_urls_path, dead_urls)


def check_no_form_strike(dead_urls_path: Path, dead_urls: set[str], url: str, brand: str, worker: int, log) -> None:
    _no_form_strikes[url] = _no_form_strikes.get(url, 0) + 1
    if _no_form_strikes[url] >= NO_FORM_MAX_STRIKES:
        mark_url_dead(dead_urls_path, dead_urls, url)
        log(f"  [W{worker}] no-form {NO_FORM_MAX_STRIKES}-strike retirement: {brand} -> {url}")


def fill_form(client: CamofoxClient, tab_id: str, user_id: str, flat_cfg: dict, log) -> int:
    snap = client.snapshot(tab_id, user_id)
    items = parse_snapshot(snap.get("snapshot", ""))

    filled = 0
    for item in items:
        if item.role not in INTERACTIVE_ROLES:
            continue
        field = match_field(item.label)
        if not field:
            continue

        value = flat_cfg.get("password") if field == "password" else get_value(flat_cfg, field)
        if not value:
            continue

        try:
            client.type(tab_id, user_id, item.ref, str(value))
            filled += 1
            log(f"  filled {item.role} '{item.label}' ({item.ref}) <- {field}")
        except CamofoxError as e:
            log(f"  WARN could not type into {item.ref}: {e}")

    return filled


def find_submit_ref(client: CamofoxClient, tab_id: str, user_id: str) -> str | None:
    snap = client.snapshot(tab_id, user_id)
    for item in parse_snapshot(snap.get("snapshot", "")):
        if item.role in ("button", "link") and SUBMIT_PATTERNS.search(item.label):
            return item.ref
    return None


def count_form_fields(items: list) -> int:
    return sum(1 for it in items if it.role in INTERACTIVE_ROLES and match_field(it.label))


def dismiss_cookie_banner(client: CamofoxClient, tab_id: str, user_id: str, log) -> None:
    """Click the first consent/accept control so it stops covering the form."""
    try:
        items = parse_snapshot(client.snapshot(tab_id, user_id).get("snapshot", ""))
    except CamofoxError:
        return
    for item in items:
        if item.role in ("button", "link") and CONSENT_PATTERNS.search(item.label):
            try:
                client.click(tab_id, user_id, ref=item.ref)
                client.wait(tab_id, user_id, timeout_ms=800)
                log(f"  dismissed consent banner: '{item.label}'")
            except CamofoxError:
                pass
            return


def navigate_to_form(client: CamofoxClient, tab_id: str, user_id: str, worker: int, log) -> int:
    """If the landing page has too few form fields, click a Sign Up / Create
    Account / Sign In link to reach the real signup form. Returns the field
    count once a form is found (or the best count after MAX_NAV_HOPS)."""
    items = parse_snapshot(client.snapshot(tab_id, user_id).get("snapshot", ""))
    fields = count_form_fields(items)
    if fields >= MIN_FORM_FIELDS:
        return fields

    tried: set[str] = set()
    for _ in range(MAX_NAV_HOPS):
        target = None
        for item in items:
            if item.role not in ("button", "link") or item.ref in tried:
                continue
            # Never click a submit-looking control during navigation -- only
            # links that take us to a registration form.
            if SIGNUP_LINK_PATTERNS.search(item.label) and not SUBMIT_PATTERNS.search(item.label) \
                    or re.search(r"create\s+(an\s+)?account|sign\s*up|register|join", item.label, re.IGNORECASE):
                target = item
                break
        if not target:
            break
        tried.add(target.ref)
        log(f"  [W{worker}] hop -> clicking '{target.label}' ({target.ref}) to reach form")
        try:
            client.click(tab_id, user_id, ref=target.ref)
            client.wait(tab_id, user_id, timeout_ms=2500)
        except CamofoxError:
            pass
        items = parse_snapshot(client.snapshot(tab_id, user_id).get("snapshot", ""))
        fields = count_form_fields(items)
        if fields >= MIN_FORM_FIELDS:
            return fields
    return fields


def snapshot_has_captcha(client: CamofoxClient, tab_id: str, user_id: str) -> bool:
    snap = client.snapshot(tab_id, user_id)
    return bool(CAPTCHA_PATTERNS.search(snap.get("snapshot", "")))


def wait_out_captcha(client: CamofoxClient, tab_id: str, user_id: str, timeout_s: int, worker: int, log) -> bool:
    log(f"  [W{worker}] CAPTCHA detected. If ENABLE_VNC=1 on camofox, open "
        f"http://<camofox-host>:6080 to solve manually (timeout {timeout_s}s).")
    deadline = time.monotonic() + timeout_s
    while time.monotonic() < deadline:
        time.sleep(3)
        if not snapshot_has_captcha(client, tab_id, user_id):
            return True
    return False


def process_entry(client: CamofoxClient, row: dict, flat_cfg: dict, worker: int, dry_run: bool,
                   captcha_timeout: int, dead_urls_path: Path, dead_urls: set[str], log) -> tuple[str, str]:
    brand = row.get("brand", "")
    program = row.get("program", "")
    url = row["url"]
    user_id = f"loyaltybot-{slugify(brand or program or url)}"
    session_key = "signup"

    tab_id = None
    try:
        try:
            tab_id = client.create_tab(user_id, session_key, url)
        except CamofoxError as e:
            return "navigation_error", str(e)

        try:
            client.wait(tab_id, user_id, timeout_ms=3000)
        except CamofoxError:
            pass

        # Clear consent banners, then chase a Sign Up / Create Account link if
        # the landing page has too few fields to be the actual signup form.
        dismiss_cookie_banner(client, tab_id, user_id, log)
        navigate_to_form(client, tab_id, user_id, worker, log)

        filled = fill_form(client, tab_id, user_id, flat_cfg, log)
        log(f"  [W{worker}] filled {filled} field(s) -- {brand}")

        if filled == 0:
            check_no_form_strike(dead_urls_path, dead_urls, url, brand, worker, log)
            return "failed", "no form fields found"

        if snapshot_has_captcha(client, tab_id, user_id):
            if wait_out_captcha(client, tab_id, user_id, captcha_timeout, worker, log):
                filled += fill_form(client, tab_id, user_id, flat_cfg, log)
            else:
                return "captcha_skipped", "captcha not solved"

        if dry_run:
            return "dry_run", ""

        submit_ref = find_submit_ref(client, tab_id, user_id)
        if not submit_ref:
            return "failed", "submit button not found"

        client.click(tab_id, user_id, ref=submit_ref)
        try:
            client.wait(tab_id, user_id, timeout_ms=3000)
        except CamofoxError:
            pass

        if snapshot_has_captcha(client, tab_id, user_id):
            return "captcha_skipped", "captcha after submit"

        return "success", ""
    except CamofoxError as e:
        return "timeout", str(e)
    finally:
        if tab_id:
            try:
                client.close_tab(tab_id, user_id)
            except CamofoxError:
                pass


def worker_loop(worker_id: int, work_queue: "queue.Queue[dict]", flat_cfg: dict, args, stats: dict,
                 results_path: Path, progress_path: Path, dead_urls_path: Path, dead_urls: set[str],
                 start_time: float, log) -> None:
    client = CamofoxClient(base_url=args.camofox_url)

    while True:
        try:
            row = work_queue.get_nowait()
        except queue.Empty:
            return

        brand = row.get("brand", "")
        program = row.get("program", "")
        url = row["url"]

        with _progress_lock:
            _current_workers[worker_id] = {"brand": brand, "status": "running"}

        status, error = process_entry(client, row, flat_cfg, worker_id, args.dry_run,
                                        args.captcha_timeout, dead_urls_path, dead_urls, log)

        append_result(results_path, url, brand, program, status, worker_id, error)
        append_progress_log(worker_id, brand, program, status, error)

        with _progress_lock:
            stats["processed"] += 1
            if status in ("success", "dry_run"):
                stats["success"] += 1
            elif "captcha" in status:
                stats["captcha"] += 1
            elif status == "captcha_skipped":
                stats["skipped"] += 1
            else:
                stats["failed"] += 1
            _current_workers[worker_id] = {"brand": brand, "status": "idle"}

        write_progress(progress_path, True, stats, start_time)
        log(f"[W{worker_id}] {brand} -- {program} -> {status}" + (f" ({error})" if error else ""))

        if args.delay:
            time.sleep(args.delay)


def run(args: argparse.Namespace) -> int:
    config = load_config(Path(args.config))
    flat_cfg = flat_config(config)

    results_path = Path(args.results)
    progress_path = Path(args.progress)
    dead_urls_path = Path(args.dead_urls)

    dead_urls = load_dead_urls(dead_urls_path)
    dead_urls = retire_repeated_failures(results_path, dead_urls)

    programs = load_programs(Path(args.csv))
    rows = [r for r in programs if r.get("url") and (args.include_infeasible or is_feasible(r))]
    rows = sort_by_priority(rows)
    rows = [r for r in rows if r["url"] not in dead_urls]

    if args.retry:
        retryable = load_failed_urls(results_path)
        rows = [r for r in rows if r["url"] in retryable]
    else:
        processed = load_processed_urls(results_path)
        rows = [r for r in rows if r["url"] not in processed]

    start = args.start_index
    end = start + args.limit if args.limit else None
    batch = rows[start:end]

    client = CamofoxClient(base_url=args.camofox_url)
    client.wait_for_browser()

    stats = {"total": len(batch), "processed": 0, "success": 0, "failed": 0, "captcha": 0, "skipped": 0}
    start_time = time.time()

    print(f"Running {len(batch)} signups via camofox at {client.base_url} with {args.workers} worker(s)")
    write_progress(progress_path, True, stats, start_time)

    work_queue: "queue.Queue[dict]" = queue.Queue()
    for row in batch:
        work_queue.put(row)

    threads = []
    for worker_id in range(1, args.workers + 1):
        t = threading.Thread(
            target=worker_loop,
            args=(worker_id, work_queue, flat_cfg, args, stats, results_path, progress_path,
                  dead_urls_path, dead_urls, start_time, print),
            daemon=True,
        )
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    write_progress(progress_path, False, stats, start_time)
    print(f"Done. {stats['success']} success, {stats['failed']} failed, "
          f"{stats['captcha']} captcha, {stats['skipped']} skipped. Results -> {results_path}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--config", default="config.json", help="Path to client config.json")
    parser.add_argument("--csv", default="loyalty-rewards-MASTER.csv", help="Path to program master CSV")
    parser.add_argument("--results", default="signup-results-camofox.csv", help="Path to results CSV")
    parser.add_argument("--progress", default="progress.json", help="Path to progress.json (dashboard polls this)")
    parser.add_argument("--dead-urls", default="dead-urls.json", help="Path to shared dead-urls.json")
    parser.add_argument("--workers", type=int, default=DEFAULT_WORKERS, help="Number of parallel camofox tabs")
    parser.add_argument("--limit", type=int, default=0, help="Max number of sites to process (0 = all)")
    parser.add_argument("--start-index", type=int, default=0, help="Start from this row in the CSV")
    parser.add_argument("--dry-run", action="store_true", help="Fill forms but don't submit")
    parser.add_argument("--retry", action="store_true", help="Only re-run previously failed/timeout/captcha URLs")
    parser.add_argument("--captcha-timeout", type=int, default=120, help="Seconds to wait for manual CAPTCHA solve")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY_SECONDS, help="Seconds each worker waits between sites")
    parser.add_argument("--include-infeasible", action="store_true", help="Also process rows where Auto_Signup_Feasible != Yes")
    parser.add_argument("--camofox-url", default=None, help="camofox-browser base URL (default: $CAMOFOX_URL or http://localhost:9377)")
    args = parser.parse_args(argv)
    return run(args)


if __name__ == "__main__":
    sys.exit(main())
