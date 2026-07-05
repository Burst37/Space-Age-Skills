#!/usr/bin/env python3
"""
Post-render check on the enhanced video.

Output should match input in duration + audio (we only added visual layers).
"""
import subprocess
import sys
from pathlib import Path

DURATION_TOLERANCE = 0.2  # seconds


def probe_duration(path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ]).decode().strip()
    return float(out)


def audio_md5(path: Path) -> str:
    """Hash the decoded audio stream — should match between input and output if untouched."""
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(path),
         "-vn", "-c:a", "pcm_s16le", "-ar", "16000", "-ac", "1",
         "-f", "md5", "-"],
        capture_output=True, check=True,
    )
    out = proc.stdout.decode().strip()
    # ffmpeg prints "MD5=<hex>"
    for line in out.splitlines():
        if line.startswith("MD5="):
            return line[4:]
    return out


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: verify.py <video_path>", file=sys.stderr)
        return 2
    src = Path(sys.argv[1]).expanduser().resolve()
    out = src.with_name(f"{src.stem}.enhanced.mp4")

    if not out.exists():
        print(f"output not found: {out}", file=sys.stderr)
        return 1

    src_dur = probe_duration(src)
    out_dur = probe_duration(out)

    print(f"== verify {out.name} ==")
    print(f"input duration  : {src_dur:.3f}s")
    print(f"output duration : {out_dur:.3f}s")
    duration_ok = abs(out_dur - src_dur) <= DURATION_TOLERANCE

    print("\nchecking audio is untouched (MD5 of decoded PCM):")
    src_md5 = audio_md5(src)
    out_md5 = audio_md5(out)
    print(f"input audio  md5: {src_md5}")
    print(f"output audio md5: {out_md5}")
    audio_ok = src_md5 == out_md5

    print()
    print(f"duration check : {'PASS' if duration_ok else 'FAIL'}")
    print(f"audio check    : {'PASS' if audio_ok else 'FAIL — audio was modified!'}")
    if duration_ok and audio_ok:
        print("OVERALL: PASS")
        return 0
    print("OVERALL: FAIL")
    return 1


if __name__ == "__main__":
    sys.exit(main())
