from __future__ import annotations

from pathlib import Path
import re
import subprocess


def probe_duration_seconds(video_path: Path) -> float:
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(video_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(result.stdout.strip())


def extract_frames(
    video_path: Path,
    frame_dir: Path,
    resolution: int = 512,
    max_frames: int = 100,
    fps_override: float | None = None,
) -> tuple[list[Path], float]:
    fps = fps_override if fps_override is not None else 1.0

    try:
        duration = probe_duration_seconds(video_path)
        estimated = int(duration * fps)
        if estimated > max_frames:
            fps = max_frames / duration
    except Exception:
        pass

    frame_dir.mkdir(parents=True, exist_ok=True)
    pattern = str(frame_dir / "frame_%05d.jpg")
    cmd = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel", "error",
        "-i", str(video_path),
        "-vf", f"fps={fps},scale={resolution}:-1",
        "-q:v", "2",
        pattern,
    ]
    subprocess.run(cmd, check=True)

    frames = sorted(frame_dir.glob("frame_*.jpg"))
    return frames[:max_frames], fps


def estimate_frame_timestamp(frame_index_1based: int, fps: float) -> float:
    if fps <= 0:
        return 0.0
    return (frame_index_1based - 1) / fps


def frame_index_from_filename(path: Path) -> int | None:
    m = re.search(r"frame_(\d+)\.jpg$", path.name)
    if m:
        return int(m.group(1))
    return None
