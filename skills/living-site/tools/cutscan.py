#!/usr/bin/env python3
"""cutscan.py <clip.mp4> [more.mp4 ...]

Finds hidden cuts INSIDE a generated clip. A model asked to travel too far in 5 s often hard-cuts
mid-clip and lands on the end pin, so the junctions look perfect and the middle jumps.
Method: SSIM of every adjacent frame pair (480 px wide). A frame pair below (median - 0.25) is a cut.
Exit code 1 if any file has a cut, so it can gate a pipeline.
"""
import subprocess, sys

def scan(f):
    cmd = ['ffmpeg', '-i', f, '-i', f, '-lavfi',
           '[0]trim=start_frame=1,setpts=PTS-STARTPTS,scale=480:-1[a];[1]scale=480:-1[b];[a][b]ssim=stats_file=-',
           '-f', 'null', '-']
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    v = [(int(l.split('n:')[1].split()[0]), float(l.split('All:')[1].split()[0])) for l in out.splitlines() if 'All:' in l]
    if not v:
        print(f, 'could not measure (not a video?)'); return True
    v.sort(key=lambda x: x[1]); med = sorted(x[1] for x in v)[len(v) // 2]
    flag = [x for x in v if x[1] < med - 0.25]
    print(f, 'frames %d, median %.2f, worst %s' % (len(v) + 1, med, [(n, round(s, 2)) for n, s in v[:2]]),
          ('CUT at frame(s) %s' % [n for n, _ in flag]) if flag else 'ok')
    return bool(flag)

if len(sys.argv) < 2:
    sys.exit('usage: cutscan.py <clip.mp4> [more.mp4 ...]')
bad = [f for f in sys.argv[1:] if scan(f)]
sys.exit(1 if bad else 0)
