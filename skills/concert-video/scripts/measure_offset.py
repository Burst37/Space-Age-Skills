#!/usr/bin/env python3
"""Measure how far Seedance shifted the song inside a generated clip.

Usage: python3 measure_offset.py CLIP.mp4 SEGMENT_AUDIO.wav [--max 2.5]
Prints lag in seconds: positive = the clip's audio is LATE versus the segment file
(clip time = edit-relative time + lag). Edit math: clip_time(t) = (t - file_in) + lag.
Method: log-magnitude spectrogram frames (10 ms hop), full band 60-3100 Hz plus
bass-only (60-250) and vocal-band (300-3100) checks, cross-correlated over +/- max s.
"""
import sys, subprocess, json, argparse
import numpy as np

SR = 16000
HOP = 160   # 10 ms
WIN = 1024

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def spec(x, lo, hi):
    n = 1 + max(0, (len(x) - WIN) // HOP)
    idx = np.arange(WIN)[None, :] + HOP * np.arange(n)[:, None]
    frames = x[idx] * np.hanning(WIN)[None, :]
    mag = np.abs(np.fft.rfft(frames, axis=1))
    f = np.fft.rfftfreq(WIN, 1 / SR)
    band = mag[:, (f >= lo) & (f <= hi)]
    s = np.log1p(band * 100)
    s -= s.mean(axis=1, keepdims=True)
    s /= (np.linalg.norm(s, axis=1, keepdims=True) + 1e-9)
    return s

def xcorr(a, b, maxlag):
    best, scores = None, []
    for lag in range(-maxlag, maxlag + 1):
        if lag >= 0:
            A, B = a[lag:], b[:len(a) - lag]
        else:
            A, B = a[:lag], b[-lag:]
        m = min(len(A), len(B))
        if m < 100:
            scores.append(-1); continue
        scores.append(float((A[:m] * B[:m]).sum(axis=1).mean()))
    scores = np.array(scores)
    i = int(scores.argmax())
    srt = np.sort(scores)
    conf = float((srt[-1] - np.median(scores)) / (np.std(scores) + 1e-9))
    return (i - maxlag) * HOP / SR, float(scores[i]), conf

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip"); ap.add_argument("segment"); ap.add_argument("--max", type=float, default=2.5)
    a = ap.parse_args()
    c, s = load(a.clip), load(a.segment)
    maxlag = int(a.max * SR / HOP)
    out = {}
    for name, lo, hi in [("full", 60, 3100), ("bass", 60, 250), ("vocal", 300, 3100)]:
        lag, score, conf = xcorr(spec(c, lo, hi), spec(s, lo, hi), maxlag)
        out[name] = {"lag_s": round(lag, 3), "score": round(score, 3), "peak_z": round(conf, 1)}
    lags = [v["lag_s"] for v in out.values()]
    agree = max(lags) - min(lags) <= 0.05
    out["lag_s"] = out["full"]["lag_s"]
    out["bands_agree"] = agree
    out["verdict"] = "OK" if agree and out["full"]["peak_z"] >= 4 else "CHECK (weak or disagreeing peak: verify with faster-whisper word times or by waveform)"
    print(json.dumps(out, indent=1))

if __name__ == "__main__":
    main()
