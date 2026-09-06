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

from camofox_client import CamofoxClient, CamofoxError
from auto_signup_camofox import (
    count_form_fields,
    fill_form,
    find_submit_ref,
    flat_config,
    load_config,
    load_dead_urls,
    load_programs,
    is_feasible,
    retire_repeated_failures,
    save_dead_urls,
    slugify,
    snapshot_has_captcha,
    snapshot_items,
    sort_by_priority,
    verify_submission,
    wait_for_form,
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

# Links/buttons that lead from a landing page TO the signup form, in priority
# order. These used to be one alternation containing both "create account" and
# "sign in", and the hop loop took the first MATCHING ITEM IN DOCUMENT ORDER --
# so a header "Sign In" link almost always beat the "Create Account" button
# further down the page and the run landed on a login form it could never
# complete. Now registration links are tried first and login links only as a
# fallback (many sites put registration behind the login modal).
PRIMARY_SIGNUP_LINK_PATTERNS = re.compile(
    r"create\s+(an\s+)?(account|profile)|sign\s*up|register|join(\s+(now|free|today))?|"
    r"become\s+a\s+member|enroll|new\s+customer|new\s+user|"
    r"don'?t\s+have\s+an\s+account|not\s+a\s+member",
    re.IGNORECASE,
)
FALLBACK_SIGNUP_LINK_PATTERNS = re.compile(
    r"sign\s*in|log\s*in|get\s+started|my\s+account|rewards",
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
            "time": datetime.now(timezone.utc).strftime("%H:%M:%S"),
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
            "start_time": datetime.fromtimestamp(start_time, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ") if start_time else None,
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
    with _dead_urls_lock:
        _no_form_strikes[url] = _no_form_strikes.get(url, 0) + 1
        strikes = _no_form_strikes[url]
    if strikes >= NO_FORM_MAX_STRIKES:
        mark_url_dead(dead_urls_path, dead_urls, url)
        log(f"  [W{worker}] no-form {NO_FORM_MAX_STRIKES}-strike retirement: {brand} -> {url}")


def dismiss_cookie_banner(client: CamofoxClient, tab_id: str, user_id: str, log) -> None:
    """Click the first consent/accept control so it stops covering the form."""
    for item in snapshot_items(client, tab_id, user_id):
        if item.role in ("button", "link") and CONSENT_PATTERNS.search(item.label):
            try:
                client.click(tab_id, user_id, ref=item.ref)
                client.wait(tab_id, user_id, timeout_ms=800)
                log(f"  dismissed consent banner: '{item.label}'")
            except CamofoxError:
                pass
            return


def navigate_to_form(client: CamofoxClient, tab_id: str, user_id: str, worker: int, log) -> list:
    """If the landing page has too few form fields, click through to the real
    signup form. Returns the snapshot items of the best page reached.

    The old guard read `A and not B or C`, which Python groups as
    `(A and not B) or C` -- the `or` branch re-admitted exactly the submit-like
    controls the `not B` was there to exclude, so the hop could click a
    "Sign Up" submit button on a half-filled form. The selection is now
    explicit and ordered.
    """
    items = snapshot_items(client, tab_id, user_id)
    if count_form_fields(items) >= MIN_FORM_FIELDS:
        return items

    tried: set[str] = set()
    best = items
    for _ in range(MAX_NAV_HOPS):
        target = None
        for patterns in (PRIMARY_SIGNUP_LINK_PATTERNS, FALLBACK_SIGNUP_LINK_PATTERNS):
            for item in items:
                if item.role not in ("button", "link") or item.ref in tried:
                    continue
                if patterns.search(item.label):
                    target = item
                    break
            if target:
                break
        if not target:
            break

        tried.add(target.ref)
        log(f"  [W{worker}] hop -> clicking '{target.label}' ({target.ref}) to reach form")
        try:
            client.click(tab_id, user_id, ref=target.ref)
        except CamofoxError:
            continue
        # Give the destination (often a modal rendered client-side) time to
        # draw its fields instead of snapshotting a still-empty page.
        items = wait_for_form(client, tab_id, user_id, 8.0, MIN_FORM_FIELDS)
        if count_form_fields(items) >= MIN_FORM_FIELDS:
            return items
        if count_form_fields(items) > count_form_fields(best):
            best = items
    return best


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
                   captcha_timeout: int, dead_urls_path: Path, dead_urls: set[str], log,
                   page_timeout: float = 20.0) -> tuple[str, str]:
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
            return "navigation_error", str(e)[:200]

        # Wait for the page to actually render a form rather than snapshotting
        # a blank document after a fixed 3s sleep.
        wait_for_form(client, tab_id, user_id, page_timeout)

        # Clear consent banners, then chase a Sign Up / Create Account link if
        # the landing page has too few fields to be the actual signup form.
        dismiss_cookie_banner(client, tab_id, user_id, log)
        items = navigate_to_form(client, tab_id, user_id, worker, log)

        filled_refs: set[str] = set()
        filled = fill_form(client, tab_id, user_id, flat_cfg, log, filled_refs, items)
        log(f"  [W{worker}] filled {filled} field(s) -- {brand}")

        if filled == 0:
            # A CAPTCHA wall renders no form. Reporting that as "no form
            # fields found" retired live sites as permanently dead.
            if snapshot_has_captcha(client, tab_id, user_id):
                return "captcha_skipped", "blocked by captcha before form"
            check_no_form_strike(dead_urls_path, dead_urls, url, brand, worker, log)
            return "failed", "no form fields found"

        if snapshot_has_captcha(client, tab_id, user_id):
            if wait_out_captcha(client, tab_id, user_id, captcha_timeout, worker, log):
                filled += fill_form(client, tab_id, user_id, flat_cfg, log, filled_refs)
            else:
                return "captcha_skipped", "captcha not solved"

        if dry_run:
            return "dry_run", ""

        submit_ref = find_submit_ref(client, tab_id, user_id)
        if not submit_ref:
            return "failed", "submit button not found"

        client.click(tab_id, user_id, ref=submit_ref)
        try:
            client.wait(tab_id, user_id, timeout_ms=5000)
        except CamofoxError:
            pass

        return verify_submission(client, tab_id, user_id)
    except CamofoxError as e:
        return "timeout", str(e)[:200]
    except Exception as e:
        # Anything unexpected is this site's problem, not the run's.
        return "failed", f"{type(e).__name__}: {e}"[:200]
    finally:
        if tab_id:
            try:
                client.close_tab(tab_id, user_id)
            except Exception:
                pass
        # Drop the per-brand browser session too. Keeping one session alive per
        # brand across 500+ sites exhausts the camofox server's memory and
        # every later site then fails to open a tab at all.
        try:
            client.close_session(user_id)
        except Exception:
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
        url = row.get("url", "")

        with _progress_lock:
            _current_workers[worker_id] = {"brand": brand, "status": "running"}

        # An exception escaping process_entry used to kill this thread outright:
        # the row it had already popped was lost with no result row written, and
        # the run finished with fewer workers than it started with -- silently
        # capping throughput and the success count.
        try:
            status, error = process_entry(
                client, row, flat_cfg, worker_id, args.dry_run, args.captcha_timeout,
                dead_urls_path, dead_urls, log, args.page_timeout,
            )
        except Exception as e:
            status, error = "failed", f"worker error: {type(e).__name__}: {e}"[:200]
            log(f"[W{worker_id}] unexpected error on {url}: {e}")

        try:
            append_result(results_path, url, brand, program, status, worker_id, error)
            append_progress_log(worker_id, brand, program, status, error)
        except Exception as e:
            log(f"[W{worker_id}] WARN could not record result for {url}: {e}")

        with _progress_lock:
            stats["processed"] += 1
            if status in ("success", "dry_run"):
                stats["success"] += 1
            elif status == "captcha_skipped":
                # Checked BEFORE the generic captcha test: `"captcha" in status`
                # matched captcha_skipped first, so the "skipped" counter on the
                # dashboard was permanently stuck at zero.
                stats["skipped"] += 1
            elif "captcha" in status:
                stats["captcha"] += 1
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
    parser.add_argument("--page-timeout", type=float, default=20.0,
                        help="Seconds to wait for a form to render before giving up on a site")
    parser.add_argument("--captcha-timeout", type=int, default=120, help="Seconds to wait for manual CAPTCHA solve")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY_SECONDS, help="Seconds each worker waits between sites")
    parser.add_argument("--include-infeasible", action="store_true", help="Also process rows where Auto_Signup_Feasible != Yes")
    parser.add_argument("--camofox-url", default=None, help="camofox-browser base URL (default: $CAMOFOX_URL or http://localhost:9377)")
    args = parser.parse_args(argv)
    return run(args)


if __name__ == "__main__":
    sys.exit(main())
