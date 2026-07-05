#!/usr/bin/env python3
"""
Transcribe a video to word-level timestamps via WhisperX.
Output: <video>.workdir/words.json -> [{"word", "start", "end"}, ...]

IMPORTANT: this script MUST run inside the skill's dedicated .venv at
`~/.claude/skills/video-edit/.venv/` because WhisperX has heavy
dependencies (faster-whisper, pyannote, etc.) that we don't want in
the system Python. The shebang at the top points to `/usr/bin/env
python3`; if a caller invokes the system python directly, we
auto-relaunch under the venv interpreter so the import doesn't fail
with `ModuleNotFoundError: No module named 'whisperx'`.
"""
import json
import os
import sys
import subprocess
from pathlib import Path

# Self-relaunch under the venv interpreter if WhisperX isn't available
# in the current Python. Idempotent — once we're under .venv this is a no-op.
_VENV_DIR = Path.home() / ".claude/skills/video-edit/.venv"
_VENV_PY = _VENV_DIR / "bin/python3"
# Re-launch under the skill's venv. The venv python is a symlink to the
# real pyenv python — they share the SAME inode, so comparing executables
# via `Path.resolve()` returns equal even when we're running outside the
# venv. The reliable signal is `sys.prefix`: under the venv it points to
# `_VENV_DIR`, otherwise to the pyenv root. That's what gates whether the
# venv's site-packages (with whisperx, faster-whisper, etc.) are on the
# import path. Cost of false-negative (failing to relaunch): ImportError.
# Cost of false-positive (relaunching when already in venv): infinite loop.
# So we err on the side of False (only relaunch when we KNOW we're outside).
if _VENV_PY.exists() and Path(sys.prefix).resolve() != _VENV_DIR.resolve():
    os.execv(str(_VENV_PY), [str(_VENV_PY), __file__, *sys.argv[1:]])


def workdir_for(video_path: Path) -> Path:
    """Workdir lives under ~/.cache/video-edit/<hash>/ so macOS TCC on Downloads/Documents
    can never lock our intermediates after a reboot."""
    import hashlib
    digest = hashlib.sha1(str(video_path.resolve()).encode()).hexdigest()[:12]
    base = Path.home() / ".cache" / "video-edit" / f"{video_path.stem[:40]}_{digest}"
    base.mkdir(parents=True, exist_ok=True)
    return base


def extract_audio(video_path: Path, audio_path: Path) -> None:
    # Invalidate cache when the source video is newer than the cached audio.
    # Prevents the "stale audio.wav vs replaced source" bug — every previous
    # transcription was working against an old video; all subsequent
    # speech-aligned beats were drifted by however much the new source
    # differed in length.
    if audio_path.exists() and audio_path.stat().st_mtime >= video_path.stat().st_mtime:
        return
    if audio_path.exists():
        print(f"[stale] source newer than audio.wav — re-extracting", flush=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(video_path),
            "-vn", "-ac", "1", "-ar", "16000",
            "-c:a", "pcm_s16le", str(audio_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def transcribe(audio_path: Path, model_size: str = "base") -> list[dict]:
    import whisperx  # type: ignore

    # WhisperX doesn't support MPS yet; CPU + int8 is the safe path on Mac.
    device = "cpu"
    compute_type = "int8"

    model = whisperx.load_model(model_size, device=device, compute_type=compute_type)
    audio = whisperx.load_audio(str(audio_path))
    result = model.transcribe(audio, batch_size=8)
    language = result.get("language", "en")

    align_model, metadata = whisperx.load_align_model(language_code=language, device=device)
    aligned = whisperx.align(
        result["segments"], align_model, metadata, audio, device,
        return_char_alignments=False,
    )

    words: list[dict] = []
    for seg in aligned.get("segments", []):
        for w in seg.get("words", []):
            if "start" in w and "end" in w and w.get("word"):
                words.append({
                    "word": w["word"].strip(),
                    "start": float(w["start"]),
                    "end": float(w["end"]),
                })
    return _apply_corrections(_normalize_brand_terms(words))


# ---------------------------------------------------------------------------
# Phrase-level transcription corrections.
#
# Whisper mishears predictably on this channel. `_normalize_brand_terms`
# handles single-word brand fixes (cloud→claude). This handles CONTEXTUAL
# mishearings — where the wrong word IS a real word and can only be fixed by
# the phrase around it. e.g. "caught their costs" is nonsense ("caught the
# wave" elsewhere is correct) — only the 3-word phrase disambiguates it.
#
# Each entry: (wrong_tokens, right_tokens), SAME length. Matching is
# lower-cased + punctuation-stripped; on a hit, each word's text is rewritten
# (capitalization + trailing punctuation of the original preserved).
#
# Add new mishearings here as they show up — it's the channel's correction
# memory. Transcription is never perfect; this is the deterministic patch.
PHRASE_CORRECTIONS: list[tuple[list[str], list[str]]] = [
    (["caught", "their", "costs"], ["cut", "their", "costs"]),
    # tool / brand names this channel says constantly that Whisper garbles
    (["use", "creativity", "claude"], ["use", "ChatGPT", "Claude"]),
    (["clawed", "and", "lovable"], ["Claude", "and", "Lovable"]),
    # "Hermes Agent" — channel's own tool; Whisper hears "Gemini agent".
    (["gemini", "agent"], ["Hermes", "Agent"]),
    # Number-word mishearings on this channel (Whisper turns sharp /eɪt/
    # syllables into common words). Scene-2 May 23 2026: "other aid didn't"
    # should be "other eight didn't" (referring to 8 cancelled AI tools).
    (["other", "aid"], ["other", "eight"]),
    (["aid", "didn't"], ["eight", "didn't"]),
]

# Single-word brand fixes — same idea as cloud→claude, extended. Each maps a
# bare (lowercased, punctuation-stripped) mishearing to the correct word;
# capitalization + trailing punctuation of the original are preserved.
BRAND_WORDS: dict[str, str] = {
    "cloud": "claude",
    "ozemic": "ozempic",
    "ozampic": "ozempic",
    "ozempick": "ozempic",
    # "Bolt" (the app builder) — Whisper hears "vault".
    "vault": "bolt",
}


def _apply_corrections(words: list[dict]) -> list[dict]:
    def bare(s: str) -> str:
        return s.lower().strip(".,!?;:'\"")

    spoken = [bare(w["word"]) for w in words]
    total = 0
    for wrong, right in PHRASE_CORRECTIONS:
        n = len(wrong)
        for i in range(len(spoken) - n + 1):
            if spoken[i:i + n] == wrong:
                for k in range(n):
                    if wrong[k] == right[k]:
                        continue
                    orig = words[i + k]["word"]
                    # carry leading capital + trailing punctuation across
                    lead_cap = bool(orig) and orig[0].isupper()
                    tail = ""
                    j = len(orig)
                    while j > 0 and orig[j - 1] in ".,!?;:'\"":
                        tail = orig[j - 1] + tail
                        j -= 1
                    new = right[k]
                    if lead_cap:
                        new = new[:1].upper() + new[1:]
                    words[i + k]["word"] = new + tail
                    spoken[i + k] = bare(new)
                    total += 1
    if total:
        print(f"[correct] applied {total} phrase-correction word(s)", flush=True)
    return words


def _normalize_brand_terms(words: list[dict]) -> list[dict]:
    """Whisper consistently mishears 'Claude' as 'Cloud' on this channel.

    Since every video this skill processes is about Claude / Claude Code,
    we substitute deterministically before downstream tools read words.json.
    Keeps speech_anchor matching, list-item keyword matching, and any rendered
    captions consistent with what the speaker actually said.

    Logs the substitution count so a regression is visible in build output.
    """
    fixed = 0
    for w in words:
        original = w["word"]
        bare = original.lower().strip(".,!?;:'\"")
        repl = BRAND_WORDS.get(bare)
        if repl:
            # preserve leading-capital + trailing punctuation
            tail = ""
            j = len(original)
            while j > 0 and original[j - 1] in ".,!?;:'\"":
                tail = original[j - 1] + tail
                j -= 1
            new = repl[:1].upper() + repl[1:] if (original and original[0].isupper()) else repl
            w["word"] = new + tail
            fixed += 1
    if fixed:
        print(f"[brand] substituted {fixed} brand word(s)", flush=True)
    return words


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: transcribe.py <video_path> [model_size]", file=sys.stderr)
        return 2

    video_path = Path(sys.argv[1]).expanduser().resolve()
    if not video_path.exists():
        print(f"video not found: {video_path}", file=sys.stderr)
        return 1

    model_size = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("WHISPER_MODEL", "base")

    wd = workdir_for(video_path)
    wd.mkdir(exist_ok=True)
    words_json = wd / "words.json"

    # Invalidate words.json when source video is newer (re-uploaded).
    if (words_json.exists()
            and words_json.stat().st_mtime >= video_path.stat().st_mtime
            and os.environ.get("FORCE") != "1"):
        print(f"words.json exists and is fresh, skipping: {words_json}")
        return 0
    if words_json.exists():
        print(f"[stale] source newer than words.json — re-transcribing", flush=True)

    audio_path = wd / "audio.wav"
    print(f"[1/2] Extracting audio -> {audio_path}")
    extract_audio(video_path, audio_path)

    print(f"[2/2] Transcribing with WhisperX (model={model_size})")
    words = transcribe(audio_path, model_size)
    words_json.write_text(json.dumps(words, indent=2))
    print(f"Wrote {len(words)} words -> {words_json}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
