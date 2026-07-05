#!/usr/bin/env python3
"""
Build per-video cut plans from sentence picks.

Reads:
  <workdir>/words.json
  <workdir>/sentences.json     (auto-deduped sentence list, see sentences.py)
  <workdir>/selection.json     (Claude's per-video sentence picks)

Writes:
  <workdir>/video<N>/cut_plan.json   (one per video)

Selection format (NEW — sentence-based):
{
  "videos": [
    {
      "id": 1,
      "title": "...",
      "sentence_picks": [0, 1, 2, 5, 7, ...]    // indices into sentences.json
    }
  ]
}

Backward-compat: legacy word-index `picks` are still accepted; they bypass sentence logic.

Each picked sentence becomes ONE keep span [start - HEAD_PAD, end + TAIL_PAD]. Sentences are
NEVER split internally — no filler trim, no silence trim within a sentence. The whole
sentence audio plays as the speaker delivered it. This eliminates the cough/gap artifacts.
"""
import json
import sys
import subprocess
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import cutplan  # type: ignore[import-not-found]  # noqa: E402

# Tight pads — just enough to not clip the first/last phoneme
SENTENCE_HEAD_PAD = 0.05
SENTENCE_TAIL_PAD = 0.10


def workdir_for(video_path: Path) -> Path:
    import hashlib
    digest = hashlib.sha1(str(video_path.resolve()).encode()).hexdigest()[:12]
    return Path.home() / ".cache" / "video-edit" / f"{video_path.stem[:40]}_{digest}"


def probe_duration(video_path: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(video_path),
    ]).decode().strip()
    return float(out)


def build_from_sentence_picks(
    video_path: Path,
    words: list[dict],
    sentences: list[dict],
    sentence_picks: list[int],
    duration: float,
    video_def: dict,
) -> dict:
    """Build a cut plan from sentence indices. Each sentence = one whole keep span."""
    keeps: list[tuple[float, float]] = []
    cuts: list[tuple[float, float]] = []
    cover_points: list[dict] = []

    cumulative = 0.0
    last_pick_src_end = 0.0

    for n, idx in enumerate(sentence_picks):
        if idx < 0 or idx >= len(sentences):
            raise ValueError(f"sentence pick {idx} out of range (have {len(sentences)})")
        s = sentences[idx]
        keep_start = max(0.0, s["start_sec"] - SENTENCE_HEAD_PAD)
        keep_end = min(duration, s["end_sec"] + SENTENCE_TAIL_PAD)
        keeps.append((keep_start, keep_end))
        # Source-time gap between previous pick and this one becomes a cut
        if n > 0:
            cut_start = last_pick_src_end
            cut_end = keep_start
            if cut_end > cut_start:
                cuts.append((cut_start, cut_end))
                cover_points.append({
                    "at_sec": round(cumulative, 4),
                    "source_cut": [round(cut_start, 4), round(cut_end, 4)],
                })
        cumulative += (keep_end - keep_start)
        last_pick_src_end = keep_end

    new_duration = cumulative
    remapped = cutplan.remap_words(words, keeps)

    return {
        "source": str(video_path),
        "video_id": video_def["id"],
        "title": video_def.get("title", f"video{video_def['id']}"),
        "source_duration_sec": round(duration, 4),
        "new_duration_sec": round(new_duration, 4),
        "compression_ratio": round(new_duration / duration, 3) if duration else 0,
        "keeps": [[round(s, 4), round(e, 4)] for s, e in keeps],
        "cuts": [[round(s, 4), round(e, 4)] for s, e in cuts],
        "cover_points": cover_points,
        "remapped_words": [
            {"word": w["word"], "start": round(w["start"], 4), "end": round(w["end"], 4)}
            for w in remapped
        ],
        "sentence_picks": sentence_picks,
        "sentence_texts": [sentences[i]["text"] for i in sentence_picks],
    }


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: selector.py <video_path>", file=sys.stderr)
        return 2
    video_path = Path(sys.argv[1]).expanduser().resolve()
    if not video_path.exists():
        print(f"video not found: {video_path}", file=sys.stderr)
        return 1

    wd = workdir_for(video_path)
    words_json = wd / "words.json"
    sentences_json = wd / "sentences.json"
    selection_json = wd / "selection.json"
    if not words_json.exists():
        print(f"missing {words_json} — run transcribe.py first", file=sys.stderr)
        return 1
    if not sentences_json.exists():
        print(f"missing {sentences_json} — run sentences.py first", file=sys.stderr)
        return 1
    if not selection_json.exists():
        print(f"missing {selection_json} — Claude must write picks", file=sys.stderr)
        return 1

    words = json.loads(words_json.read_text())
    sentences_data = json.loads(sentences_json.read_text())
    sentences = sentences_data["sentences"]
    selection = json.loads(selection_json.read_text())
    duration = probe_duration(video_path)

    for v in selection["videos"]:
        if "sentence_picks" not in v:
            print(f"video{v['id']}: no sentence_picks (legacy mode unsupported in v2)", file=sys.stderr)
            return 1
        plan = build_from_sentence_picks(video_path, words, sentences, v["sentence_picks"], duration, v)
        out_dir = wd / f"video{v['id']}"
        out_dir.mkdir(exist_ok=True)
        (out_dir / "cut_plan.json").write_text(json.dumps(plan, indent=2))
        print(f"video{v['id']}: {plan['title']!r}  "
              f"{plan['new_duration_sec']:.1f}s  "
              f"{len(plan['sentence_picks'])} sentences  "
              f"{len(plan['cover_points'])} cover points")
        # Self-check: print the full assembled transcript so Claude/user can sanity-check
        print(f"  Story:")
        for i, idx in enumerate(v["sentence_picks"]):
            print(f"    {i+1:2d}. {sentences[idx]['text']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
