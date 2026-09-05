#!/usr/bin/env python3
"""Write a structured ingest-ready report.md.

Deterministic sections are filled here. Narrative sections emit
<!-- pending Claude fill: ... --> markers for Claude to complete.
"""
from __future__ import annotations

import datetime as _dt
import json
import sys
from pathlib import Path


def _pending(hint: str) -> str:
    return f"<!-- pending Claude fill: {hint} -->"


def _fmt_time(seconds: float) -> str:
    total = int(round(seconds))
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    if h:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def _yaml_list(items: list[str]) -> str:
    return "[" + ", ".join(items) + "]" if items else "[]"


def write_report(
    out_path: Path,
    source: str,
    title: str,
    duration_seconds: float,
    intent: str,
    transcript_segments: list[dict],
    transcript_source: str | None,
    all_frames: list[dict],
    hero_frames: list[dict],
    pacing: dict,
    hook: dict,
    sentiment_arc: list[dict] | None = None,
    highlights: list[dict] | None = None,
    chapters: list[dict] | None = None,
    watched_at: _dt.datetime | None = None,
) -> Path:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    watched_at = watched_at or _dt.datetime.now().astimezone()
    hero_names = [Path(f["path"]).name for f in hero_frames]
    lines: list[str] = []

    lines += [
        "---",
        f"source: {source}",
        f"title: {title}",
        f"duration: {_fmt_time(duration_seconds)}",
        f"watched_at: {watched_at.isoformat()}",
        f"intent: {intent or '(none)'}",
        f"hero_frames: {_yaml_list(hero_names)}",
        f"transcript_source: {transcript_source or 'none'}",
        "---", "",
        f"# {title}", "",
    ]

    lines += ["## TL;DR", "",
              _pending(f"3-5 bullets through the lens of: '{intent or 'general summary'}'"), ""]

    lines += ["## Key moments", "",
              _pending("5-10 bullets: `- **[MM:SS] label** — description`. Cite frame filenames."), ""]

    lines += ["## Hook microscope (0-10s)", ""]
    if not hook.get("ran"):
        lines.append(f"_Skipped: {hook.get('skipped_reason', 'n/a')}._")
    else:
        lines.append(f"- Frames: {len(hook.get('frames', []))} at 2 fps")
        words = hook.get("words", [])
        if words:
            lines += [f"- Word-level transcript ({len(words)} words):", "", "```"]
            for w in words:
                lines.append(f"  [{w['start']:6.2f}s] {w['word']}")
            lines.append("```")
        lines += ["", _pending(
            "Frame-by-frame: visual change at each tick + what's being said. "
            "Identify hook pattern: question, contrarian claim, in-medias-res, demo-first, etc."
        )]
    lines.append("")

    lines += ["## Editorial profile", ""]
    if pacing.get("shot_count", 0) > 0:
        lines += [
            f"- Shots: {pacing['shot_count']}",
            f"- Cuts/min: {pacing['cuts_per_minute']}",
            f"- Mean shot length: {pacing['mean_shot_length']}s",
            f"- Median shot length: {pacing['median_shot_length']}s",
        ]
    else:
        lines.append("_No scene-change data — static/screen-recorded source._")
    lines += ["", _pending("One-line style fingerprint from pacing + hero frames."), ""]

    if highlights:
        lines += ["## Auto-Highlights", ""]
        for i, h in enumerate(highlights, 1):
            lines.append(f"### Highlight {i} — {_fmt_time(h['start'])} → {_fmt_time(h['end'])} (score: {h['score']})")
            if h.get("snippet"):
                lines += ["", f"> {h['snippet']}"]
            for f in h.get("frames", [])[:2]:
                lines.append(f"- `{f['path']}` (t={_fmt_time(f['timestamp_seconds'])})")
            lines.append("")

    if sentiment_arc:
        lines += ["## Sentiment Arc", "",
                  "| Time | Score | Mood |",
                  "|------|-------|------|",]
        for b in sentiment_arc:
            bar = "▓" * int(abs(b["score"]) * 8)
            sign = "+" if b["score"] > 0 else ("-" if b["score"] < 0 else " ")
            lines.append(f"| {b['time_label']} | {sign}{abs(b['score']):.2f} {bar} | {b['label']} |")
        lines.append("")

    if chapters:
        lines += ["## Chapters", ""]
        for ch in chapters:
            lines.append(f"### {ch['title']} ({_fmt_time(ch['start'])} → {_fmt_time(ch['end'])})")
            for f in ch.get("frames", [])[:3]:
                lines.append(f"- `{f['path']}` (t={_fmt_time(f['timestamp_seconds'])})")
            lines.append("")

    lines += ["## Quotable moments", "",
              _pending("Top 3-5 lines from transcript. Include [MM:SS]. Standalone-comprehensible."), ""]

    lines += ["## Entities mentioned", "",
              "- People: " + _pending("[[wikilink]]-ready, comma-separated"),
              "- Companies: " + _pending("comma-separated"),
              "- Tools / products: " + _pending("comma-separated"),
              "- Places: " + _pending("comma-separated, or omit"), ""]

    lines += ["## Concepts surfaced", "",
              _pending("concept: one-line gist. Frameworks, mental models, named patterns."), ""]

    lines += ["## Transcript", ""]
    if transcript_segments:
        lines += [f"_Source: {transcript_source or 'unknown'}._", "", "```"]
        for seg in transcript_segments:
            t = _fmt_time(seg.get("start", 0))
            lines.append(f"[{t}] {seg.get('text', '').strip()}")
        lines += ["```", ""]
    else:
        lines += ["_No transcript available._", ""]

    lines += ["## All frames", "",
              f"_Total: {len(all_frames)}. Hero frames flagged with *._", ""]
    hero_paths = {f["path"] for f in hero_frames}
    for f in all_frames:
        marker = "* " if f["path"] in hero_paths else "  "
        lines.append(f"{marker}`{f['path']}` (t={_fmt_time(f['timestamp_seconds'])})")
    lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")
    return out_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: report.py <kwargs.json> [<out.md>]", file=sys.stderr)
        raise SystemExit(2)
    payload = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("report.md")
    write_report(out_path=out, **payload)
    print(str(out.resolve()))
