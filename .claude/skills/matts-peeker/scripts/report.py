from __future__ import annotations

from pathlib import Path
from typing import Any
import json

from common import TranscriptSegment, seconds_to_timestamp, write_json
from frames import estimate_frame_timestamp, frame_index_from_filename


def build_report_package(
    out_dir: Path,
    source: str,
    question: str,
    video_path: Path,
    fps: float,
    frames: list[Path],
    transcript_segments: list[TranscriptSegment],
    frame_descriptions: list[str | None],
) -> dict[str, Any]:
    descriptions = list(frame_descriptions)
    while len(descriptions) < len(frames):
        descriptions.append(None)

    frame_rows: list[dict[str, Any]] = []
    for i, fp in enumerate(frames):
        idx = frame_index_from_filename(fp) or (i + 1)
        ts = estimate_frame_timestamp(idx, fps)
        frame_rows.append(
            {
                "frame": idx,
                "timestamp": seconds_to_timestamp(ts),
                "timestamp_seconds": round(ts, 3),
                "file": fp.name,
                "description": descriptions[i],
            }
        )

    seg_rows = [
        {
            "start": seconds_to_timestamp(s.start_seconds),
            "end": seconds_to_timestamp(s.end_seconds),
            "start_seconds": round(s.start_seconds, 3),
            "end_seconds": round(s.end_seconds, 3),
            "text": s.text,
            "source": s.source,
        }
        for s in transcript_segments
    ]

    described_count = sum(1 for d in descriptions if d and not d.startswith("[vision error]"))

    report: dict[str, Any] = {
        "source": source,
        "question": question,
        "video_file": str(video_path),
        "fps": round(fps, 4),
        "frames": frame_rows,
        "transcript": seg_rows,
        "stats": {
            "frame_count": len(frames),
            "frame_descriptions_count": described_count,
            "transcript_segment_count": len(transcript_segments),
        },
    }

    write_json(out_dir / "report.json", report)
    write_json(out_dir / "transcript.json", seg_rows)
    _write_markdown_report(out_dir / "report.md", report)
    _write_agent_context(out_dir / "agent_context.txt", report)

    return report


def _write_markdown_report(path: Path, report: dict[str, Any]) -> None:
    lines = [
        "# Matt's Peeker Report",
        "",
        f"**Source:** {report['source']}",
        f"**Question:** {report['question']}",
        f"**FPS:** {report['fps']}",
        f"**Frames:** {report['stats']['frame_count']}",
        f"**Descriptions:** {report['stats']['frame_descriptions_count']}",
        f"**Transcript segments:** {report['stats']['transcript_segment_count']}",
        "",
        "## Frame Timeline",
        "",
    ]

    frames = report["frames"]
    shown = frames[:40]
    for row in shown:
        desc = row["description"] or "_(no description)_"
        lines.append(f"**{row['timestamp']}** (frame {row['frame']}) — {desc}")
        lines.append("")

    if len(frames) > 40:
        lines.append(f"_... {len(frames) - 40} more frames in report.json_")
        lines.append("")

    if report["transcript"]:
        lines.append("## Transcript")
        lines.append("")
        for seg in report["transcript"]:
            lines.append(f"**{seg['start']} → {seg['end']}** [{seg['source']}]: {seg['text']}")
            lines.append("")
    else:
        lines.append("_No transcript available._")

    path.write_text("\n".join(lines), encoding="utf-8")


def _write_agent_context(path: Path, report: dict[str, Any]) -> None:
    lines = [
        "VIDEO CONTEXT PACKAGE",
        f"source: {report['source']}",
        f"question: {report['question']}",
        f"fps: {report['fps']}",
        "",
        "FRAMES",
    ]

    for row in report["frames"]:
        desc = row["description"] or "(no description)"
        lines.append(f"t={row['timestamp_seconds']} frame={row['frame']} {desc}")

    lines.append("")
    lines.append("TRANSCRIPT")

    for seg in report["transcript"]:
        lines.append(f"t={seg['start_seconds']}-{seg['end_seconds']} [{seg['source']}] {seg['text']}")

    path.write_text("\n".join(lines), encoding="utf-8")
