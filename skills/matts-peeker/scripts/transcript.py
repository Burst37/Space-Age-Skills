from __future__ import annotations

from pathlib import Path
import re
import subprocess

from audio import extract_audio_for_transcription
from common import TranscriptSegment
from deepgram import transcribe_wav_with_deepgram
from downloader import is_url
from superdata import fetch_superdata_transcript


_VTT_TIMING = re.compile(
    r"(\d{2}):(\d{2}):(\d{2})\.(\d+)\s-->\s(\d{2}):(\d{2}):(\d{2})\.(\d+)"
)


def _parse_hhmmss(h: str, m: str, s: str, ms: str) -> float:
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / (10 ** len(ms))


def _parse_vtt(vtt_text: str) -> list[TranscriptSegment]:
    segments: list[TranscriptSegment] = []
    blocks = re.split(r"\n\n+", vtt_text.strip())
    for block in blocks:
        lines = block.strip().splitlines()
        timing_line = None
        timing_idx = -1
        for i, line in enumerate(lines):
            if _VTT_TIMING.search(line):
                timing_line = line
                timing_idx = i
                break
        if timing_line is None:
            continue
        m = _VTT_TIMING.search(timing_line)
        if not m:
            continue
        start = _parse_hhmmss(m.group(1), m.group(2), m.group(3), m.group(4))
        end = _parse_hhmmss(m.group(5), m.group(6), m.group(7), m.group(8))
        text_lines = [l for l in lines[timing_idx + 1:] if l.strip() and not l.startswith("NOTE")]
        text = " ".join(text_lines).strip()
        text = re.sub(r"<[^>]+>", "", text).strip()
        if text:
            segments.append(TranscriptSegment(start, end, text, "captions"))
    return segments


def _download_subtitles(source: str, working_dir: Path) -> list[TranscriptSegment]:
    vtt_path = working_dir / "subs.en.vtt"
    cmd = [
        "yt-dlp",
        "--skip-download",
        "--write-sub",
        "--write-auto-sub",
        "--sub-lang", "en",
        "--sub-format", "vtt",
        "--no-playlist",
        "-o", str(working_dir / "subs"),
        source,
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except subprocess.CalledProcessError:
        return []

    vtt_files = list(working_dir.glob("subs*.vtt"))
    if not vtt_files:
        return []

    vtt_text = vtt_files[0].read_text(encoding="utf-8", errors="replace")
    return _parse_vtt(vtt_text)


def get_transcript(
    source: str,
    working_dir: Path,
    video_file: Path,
) -> list[TranscriptSegment]:
    if is_url(source):
        segs = _download_subtitles(source, working_dir)
        if segs:
            return segs

    wav_path = working_dir / "audio.wav"
    try:
        extract_audio_for_transcription(video_file, wav_path)
        segs = transcribe_wav_with_deepgram(wav_path)
        if segs:
            return segs
    except Exception:
        pass

    segs = fetch_superdata_transcript(source)
    return segs
