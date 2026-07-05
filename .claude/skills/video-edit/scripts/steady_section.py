#!/usr/bin/env python3
"""Per-second camera-motion profile of a clip (YDIF via signalstats).
Usage: python3 steady_section.py <clip> [--min-window 3]
Prints motion per second + the steadiest window of the requested length.
Use BEFORE picking any b-roll section: never cut from a relocating camera."""
import subprocess, sys, re, collections
clip = sys.argv[1]
win = float(sys.argv[sys.argv.index("--min-window")+1]) if "--min-window" in sys.argv else 3.0
r = subprocess.run(["ffmpeg","-nostdin","-i",clip,"-vf",
    "select='not(mod(n,6))',scale=160:-2,signalstats,metadata=print:key=lavfi.signalstats.YDIF",
    "-f","null","-"],capture_output=True,text=True)
vals=[]; t=0.0
for line in r.stderr.splitlines():
    m=re.search(r"pts_time:([\d.]+)",line)
    if m: t=float(m.group(1))
    m=re.search(r"YDIF=([\d.]+)",line)
    if m: vals.append((t,float(m.group(1))))
sec=collections.defaultdict(list)
for t,v in vals: sec[int(t)].append(v)
per={s:sum(v)/len(v) for s,v in sec.items()}
for s in sorted(per): print(f"{s:3d}s  motion={per[s]:.2f}" + ("  <-- shaky" if per[s]>2.0 else ""))
best=None
secs=sorted(per)
for i in range(len(secs)-int(win)+1):
    w=secs[i:i+int(win)]
    score=sum(per[s] for s in w)/len(w)
    if best is None or score<best[1]: best=(w[0],score)
if best: print(f"\nSTEADIEST {int(win)}s window: start at {best[0]}s (avg motion {best[1]:.2f})")
