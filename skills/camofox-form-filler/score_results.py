#!/usr/bin/env python3
"""Score confirmed signups over the complete, fixed feasible URL cohort."""
import argparse
import csv
from collections import Counter
from pathlib import Path

from auto_signup_camofox import is_feasible, load_programs


def score(master: Path, results: Path) -> dict:
    eligible = {row["url"] for row in load_programs(master)
                if row.get("url") and is_feasible(row)}
    latest: dict[str, str] = {}
    confirmed: set[str] = set()
    with results.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            url = (row.get("url") or "").strip()
            if url not in eligible:
                continue
            status = (row.get("status") or "").strip()
            if status == "success":
                confirmed.add(url)
            latest[url] = status
    counts = Counter(latest.values())
    total = len(eligible)
    return {
        "eligible": total,
        "attempted": len(latest),
        "confirmed": len(confirmed),
        "rate": len(confirmed) / total if total else 0.0,
        "form_filled_dry_run": counts["dry_run"],
        "email_verification_pending": counts["verification_required"],
        "unverified": counts["unverified"],
        "not_attempted": len(eligible - latest.keys()),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", required=True, type=Path, help="Original fixed master CSV")
    parser.add_argument("--results", required=True, type=Path, help="Seven-column results CSV")
    args = parser.parse_args()
    metrics = score(args.csv, args.results)
    for key, value in metrics.items():
        print(f"{key}: {value:.2%}" if key == "rate" else f"{key}: {value}")
    if not metrics["eligible"]:
        raise SystemExit("No feasible URLs found in the master CSV")


if __name__ == "__main__":
    main()
