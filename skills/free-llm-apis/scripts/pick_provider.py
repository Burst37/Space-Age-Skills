#!/usr/bin/env python3
"""Filter the bundled free-LLM catalog.

Examples:
  python3 -I scripts/pick_provider.py --keyless
  python3 -I scripts/pick_provider.py --modality vision --min-context 128K
  python3 -I scripts/pick_provider.py --model deepseek --provider-type inference_provider
  python3 -I scripts/pick_provider.py --country FR
"""
import argparse
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import KEYLESS, load  # noqa: E402


def ctx(s):
    m = re.match(r"\s*([\d.,]+)\s*([KkMm]?)", str(s))
    if not m:
        return 0
    n = float(m.group(1).replace(",", ""))
    return int(n * {"": 1, "k": 1_000, "m": 1_000_000}[m.group(2).lower()])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--keyless", action="store_true", help="providers usable with no API key")
    ap.add_argument("--model", help="substring of model id/name (case-insensitive)")
    ap.add_argument("--modality", help="substring of modality: vision, image, audio, reasoning, code, embeddings…")
    ap.add_argument("--min-context", default="0", help="e.g. 128K, 1M")
    ap.add_argument("--country", help="ISO country code of provider HQ, e.g. FR, US")
    ap.add_argument("--provider-type", choices=["provider_api", "inference_provider"])
    ap.add_argument("--limit", type=int, default=40)
    a = ap.parse_args()

    d = load()
    need = ctx(a.min_context)
    rows = []
    for p in d["providers"]:
        if a.keyless and p["name"] not in KEYLESS:
            continue
        if a.country and p["country"].lower() != a.country.lower():
            continue
        if a.provider_type and p["category"] != a.provider_type:
            continue
        for m in p["models"]:
            if a.model and a.model.lower() not in (m["id"] + " " + m["name"]).lower():
                continue
            if a.modality and a.modality.lower() not in m["modality"].lower():
                continue
            if ctx(m["context"]) < need:
                continue
            rows.append((p["name"], m["id"], m["context"], m["modality"], m["rateLimit"]))

    if not rows:
        print("no match")
        return 1
    print(f"catalog {d['lastUpdated']} — {len(rows)} match(es)")
    for r in rows[: a.limit]:
        print(" | ".join(str(x) for x in r))
    if len(rows) > a.limit:
        print(f"… {len(rows) - a.limit} more (raise --limit)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
