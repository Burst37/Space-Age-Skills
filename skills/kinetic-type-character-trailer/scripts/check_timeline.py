#!/usr/bin/env python3
"""Check a prompt's 'CUT NN | a-b s' lines: 13 cuts, contiguous, ends 13.00, within half a frame of the 24fps grid."""
import re, sys

text = open(sys.argv[1]).read()
cuts = [(int(n), float(a), float(b)) for n, a, b in re.findall(r"CUT\s*(\d+)\s*\|\s*([\d.]+)\s*-\s*([\d.]+)\s*s", text)]
errs = []
if len(cuts) != 13: errs.append(f"expected 13 cuts, found {len(cuts)}")
prev = 0.0
for n, a, b in cuts:
    if abs(a - prev) > 1e-6: errs.append(f"CUT {n:02d}: starts {a}, previous ended {prev}")
    if b <= a: errs.append(f"CUT {n:02d}: non-positive length")
    for t in (a, b):
        if abs(t * 24 - round(t * 24)) > 0.5: errs.append(f"CUT {n:02d}: {t}s is more than half a frame off the 24fps grid")
    prev = b
if cuts and abs(prev - 13.0) > 1e-6: errs.append(f"ends at {prev}, expected 13.00")
print("OK" if not errs else "\n".join(errs))
sys.exit(1 if errs else 0)
