#!/usr/bin/env python3
"""
Scan master CSV for junk sites (non-fillable, dead, app-only, etc.) and remove them.
Produces a cleaned CSV and a report of what was removed and why.
"""

import asyncio
import csv
import json
import sys
from pathlib import Path
from collections import Counter
from datetime import datetime

import pandas as pd
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

# Import the recognition classifier
try:
    from recognition import scan_page, classify_page
    HAS_RECOGNITION = True
except ImportError:
    print("ERROR: recognition.py not found. Cannot proceed.")
    sys.exit(1)

CSV_INPUT_PATH = Path(__file__).parent / "loyalty-rewards-MASTER.csv"
CLEANED_CSV_PATH = Path(__file__).parent / "loyalty-rewards-MASTER-cleaned.csv"
REMOVED_LOG_PATH = Path(__file__).parent / "removed-sites.json"

NAVIGATION_TIMEOUT_MS = 25_000
HEALTH_TIMEOUT_MS = 15_000


async def classify_url(page, url: str, brand: str) -> tuple[str, str]:
    """
    Fetch a URL and classify it as fillable or junk.
    Returns: (verdict, reason) where verdict is "fillable" or "skip"
    """
    if not url or not url.startswith("http"):
        return "skip", "invalid URL"

    try:
        response = await page.goto(url, wait_until="commit", timeout=NAVIGATION_TIMEOUT_MS)
        http_code = response.status if response else 0
        if http_code >= 400:
            return "skip", f"dead URL (HTTP {http_code})"
    except PlaywrightTimeoutError:
        return "skip", "page load timeout"
    except Exception as exc:
        return "skip", f"navigation error: {str(exc)[:50]}"

    await page.wait_for_timeout(800)

    try:
        scan = await scan_page(page)
        if not any(f["visible"] for f in scan["fields"]):
            await page.wait_for_timeout(1500)
            scan = await scan_page(page)

        verdict, plan = classify_page(scan)
        if verdict == "skip":
            return "skip", f"not fillable ({plan})"
        else:
            return "fillable", "OK"
    except Exception as e:
        return "skip", f"classification error: {str(e)[:50]}"


async def scan_worker(worker_id: int, queue: asyncio.Queue, results: dict, stats: dict, browser):
    """Worker that processes URLs from the queue."""
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        viewport={"width": 1280, "height": 800},
    )
    page = await context.new_page()

    while True:
        try:
            row = queue.get_nowait()
        except asyncio.QueueEmpty:
            break

        url = str(row.get("Direct Sign-Up URL", "")).strip()
        brand = str(row.get("Brand Name", "")).strip()

        verdict, reason = await classify_url(page, url, brand)
        results[url] = {"brand": brand, "verdict": verdict, "reason": reason}
        stats["processed"] += 1

        if stats["processed"] % 50 == 0:
            print(f"  [{worker_id}] {stats['processed']}/{stats['total']} scanned...")

    await context.close()


async def scan_master_csv():
    """Load master CSV, scan all URLs, return results."""
    df = pd.read_csv(CSV_INPUT_PATH, dtype=str).fillna("")
    total = len(df)

    print(f"\n{'='*60}")
    print(f"  SCAN MASTER CSV FOR JUNK SITES")
    print(f"  Total rows: {total}")
    print(f"{'='*60}\n")

    queue = asyncio.Queue()
    for _, row in df.iterrows():
        queue.put_nowait(row.to_dict())

    results = {}
    stats = {"processed": 0, "total": total}

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )

        # 5 workers in parallel
        tasks = [
            asyncio.create_task(scan_worker(i + 1, queue, results, stats, browser))
            for i in range(5)
        ]
        await asyncio.gather(*tasks)
        await browser.close()

    return df, results


def clean_and_report(df, results):
    """Filter out junk sites and produce a report."""
    removed_rows = []
    fillable_rows = []

    verdict_counts = Counter()
    reason_counts = Counter()

    for idx, row in df.iterrows():
        url = str(row.get("Direct Sign-Up URL", "")).strip()

        if url not in results:
            # Didn't scan this URL (queue processing incomplete?) — keep it
            fillable_rows.append(row)
            continue

        result = results[url]
        verdict = result["verdict"]
        reason = result["reason"]

        verdict_counts[verdict] += 1
        reason_counts[reason] += 1

        if verdict == "fillable":
            fillable_rows.append(row)
        else:
            removed_rows.append({
                "brand": row.get("Brand Name", ""),
                "url": url,
                "reason": reason
            })

    # Build cleaned DataFrame
    cleaned_df = pd.DataFrame(fillable_rows).reset_index(drop=True)

    # Report stats
    print(f"\n{'='*60}")
    print(f"  SCAN RESULTS")
    print(f"{'='*60}")
    print(f"  Total scanned       : {len(results)}")
    print(f"  Fillable (kept)     : {verdict_counts.get('fillable', 0)}")
    print(f"  Junk/dead (removed) : {verdict_counts.get('skip', 0)}")
    print(f"{'-'*60}\n  Top removal reasons:")
    for reason, count in reason_counts.most_common(8):
        print(f"    {count:>4}  {reason}")
    print(f"{'-'*60}\n")

    # Save cleaned CSV
    cleaned_df.to_csv(CLEANED_CSV_PATH, index=False)
    print(f"✅ Cleaned CSV saved: {CLEANED_CSV_PATH}")
    print(f"   Rows: {len(cleaned_df)} (was {len(df)})\n")

    # Save removal log as JSON for review
    removal_log = {
        "timestamp": datetime.now().isoformat(),
        "total_scanned": len(results),
        "fillable_kept": verdict_counts.get("fillable", 0),
        "junk_removed": verdict_counts.get("skip", 0),
        "removal_reasons": dict(reason_counts.most_common()),
        "removed_sites": removed_rows[:500]  # First 500 for review
    }
    with open(REMOVED_LOG_PATH, "w") as f:
        json.dump(removal_log, f, indent=2)
    print(f"📋 Removal log saved: {REMOVED_LOG_PATH}\n")

    if removed_rows:
        print(f"First 10 removed sites:")
        for i, row in enumerate(removed_rows[:10], 1):
            print(f"  {i}. {row['brand']:30} — {row['reason']}")
        if len(removed_rows) > 10:
            print(f"  ... and {len(removed_rows) - 10} more\n")


async def main():
    try:
        df, results = await scan_master_csv()
        clean_and_report(df, results)
        print("Done! Review removed-sites.json and use loyalty-rewards-MASTER-cleaned.csv for future runs.\n")
    except KeyboardInterrupt:
        print("\n⏸️  Scan interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
