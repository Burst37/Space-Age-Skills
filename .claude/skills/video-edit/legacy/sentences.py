#!/usr/bin/env python3
"""
Split words.json into sentence units and auto-dedup consecutive take repetitions.

A "sentence" is a contiguous run of words ending in . ! ? OR followed by a >1.5s pause.
A "take cluster" is two or more adjacent sentences that are textually similar (the speaker
re-saying the same line). We keep only the LAST sentence in each cluster (last take = best take).

Reads:  <workdir>/words.json
Writes: <workdir>/sentences.json
"""
import json
import sys
import re
from difflib import SequenceMatcher
from pathlib import Path

# Reuse workdir resolution from cutplan
sys.path.insert(0, str(Path(__file__).parent))
import cutplan  # type: ignore[import-not-found]  # noqa: E402

SENTENCE_PUNCT = re.compile(r"[.!?][\"')\]]*$")
LONG_PAUSE_GAP = 1.0  # split sentences on internal gaps > this (treat as take boundary)
SIMILARITY_THRESHOLD = 0.62  # >= this text similarity = same take cluster (last wins)
MAX_TAKE_GAP = 25.0  # seconds — look-ahead window to find a duplicate take
MIN_SENTENCE_WORDS = 3  # discard <3-word "sentences" from output (transcription noise)


def normalize(text: str) -> str:
    return re.sub(r"[^\w\s]", "", text.lower()).strip()


def similar(a: str, b: str) -> float:
    a_n, b_n = normalize(a), normalize(b)
    if not a_n or not b_n:
        return 0.0
    # Treat one being a prefix of the other as a take repetition (incomplete take vs full take)
    if a_n in b_n or b_n in a_n:
        return 1.0
    return SequenceMatcher(None, a_n, b_n).ratio()


def split_into_sentences(words: list[dict]) -> list[dict]:
    """Group words into sentences by punctuation + long pauses."""
    sentences: list[dict] = []
    cur: list[int] = []
    for i, w in enumerate(words):
        cur.append(i)
        is_last = i == len(words) - 1
        ends_punct = bool(SENTENCE_PUNCT.search(w["word"]))
        gap_to_next = (words[i + 1]["start"] - w["end"]) if not is_last else 999
        if ends_punct or gap_to_next > LONG_PAUSE_GAP or is_last:
            text = " ".join(words[j]["word"] for j in cur)
            sentences.append({
                "start_idx": cur[0],
                "end_idx": cur[-1],
                "text": text,
                "start_sec": round(words[cur[0]]["start"], 4),
                "end_sec": round(words[cur[-1]]["end"], 4),
            })
            cur = []
    return sentences


def dedupe_takes(sentences: list[dict]) -> list[dict]:
    """
    For each sentence, look ahead within MAX_TAKE_GAP seconds for any later sentence
    that's textually similar. If found, drop this one (the later one is the better take).
    This catches non-adjacent take repetitions where the speaker said an unrelated
    fragment in between.
    """
    n = len(sentences)
    drop = [False] * n

    for i in range(n):
        if drop[i]:
            continue
        for j in range(i + 1, n):
            time_gap = sentences[j]["start_sec"] - sentences[i]["end_sec"]
            if time_gap > MAX_TAKE_GAP:
                break
            if similar(sentences[i]["text"], sentences[j]["text"]) >= SIMILARITY_THRESHOLD:
                drop[i] = True
                # Also mark any earlier instance that was kept
                for k in range(i):
                    if not drop[k] and similar(sentences[k]["text"], sentences[j]["text"]) >= SIMILARITY_THRESHOLD:
                        drop[k] = True
                break

    out: list[dict] = []
    for i, s in enumerate(sentences):
        if drop[i]:
            continue
        word_count = s["end_idx"] - s["start_idx"] + 1
        if word_count < MIN_SENTENCE_WORDS:
            continue
        out.append({**s, "cluster_size": 1})
    return out


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: sentences.py <video_path>", file=sys.stderr)
        return 2
    video_path = Path(sys.argv[1]).expanduser().resolve()
    wd = cutplan.workdir_for(video_path)
    words_json = wd / "words.json"
    if not words_json.exists():
        print(f"missing {words_json} — run transcribe.py first", file=sys.stderr)
        return 1

    words = json.loads(words_json.read_text())
    raw = split_into_sentences(words)
    deduped = dedupe_takes(raw)

    out = {
        "raw_count": len(raw),
        "deduped_count": len(deduped),
        "sentences": deduped,
    }
    out_path = wd / "sentences.json"
    out_path.write_text(json.dumps(out, indent=2))
    print(f"raw sentences:    {len(raw)}")
    print(f"after dedup:      {len(deduped)}  ({len(raw) - len(deduped)} take repeats removed)")
    print(f"wrote -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
