#!/usr/bin/env python3
"""Check 'SHOT n (a-bs)' lines: 4 shots, contiguous from 0, each <=13s, total ~50s."""
import re, sys

shots = [(int(n), float(a), float(b)) for n, a, b in re.findall(r"SHOT\s*(\d+)\s*\((\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*s\)", open(sys.argv[1]).read())]
errs, prev = [], 0.0
if len(shots) != 4: errs.append(f"expected 4 shots, found {len(shots)}")
for n, a, b in shots:
    if a != prev: errs.append(f"SHOT {n}: starts {a}, previous ended {prev}")
    if b - a > 13: errs.append(f"SHOT {n}: {b - a}s exceeds 13s")
    prev = b
if shots and not 48 <= prev <= 52: errs.append(f"total {prev}s, expected ~50")
print("OK" if not errs else "\n".join(errs)); sys.exit(bool(errs))
