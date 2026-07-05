#!/usr/bin/env python3
"""
Use Claude to catch context-aware transcription errors in words.json.

Whisper makes phonetically-similar substitutions ("filled"/"failed",
"skill"/"scale", "routine"/"routing", "Claude"/"Cloud", etc.) that the
deterministic substitution layer in transcribe.py can't catch — those
require context to disambiguate. This script sends the full transcript
text to Claude with a prompt that knows the speaker's domain (BuildLoop,
Luuk Alleman, AI agents, Claude Code, automation, content creation) and
applies high-confidence corrections back into words.json.

Each correction must be a single-token substitution (replaces one
words.json entry with one new word) so timestamps stay correct.
Multi-word fixes are rejected — those need re-transcription.

Usage:
  polish_transcript.py <words.json>

Idempotent: corrections that already match are no-ops. Logs every fix
applied for audit. Does nothing if ANTHROPIC_API_KEY isn't set.

The Cloud→Claude pass in transcribe.py runs FIRST (deterministic, free).
This polish layer is AFTER, so it sees the already-cleaned transcript
and only flags the harder context-dependent errors.
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

# Plug into the BuildLoop Claude wrapper if available; fall back to direct
# anthropic SDK call otherwise so this script also runs outside BuildLoop.
sys.path.insert(0, os.path.expanduser("~/Projects/BuildLoop/automation"))
try:
    from core.claude import ClaudeClient  # type: ignore
    HAVE_CLAUDE_WRAPPER = True
except Exception:
    HAVE_CLAUDE_WRAPPER = False


SYSTEM_PROMPT = """You are a transcript-correction QA pass for a builder/AI \
YouTube channel. The speaker is Luuk Alleman, a Dutch software builder making \
short videos about Claude Code, Anthropic's API, AI agents, automation, \
no-code tools (Lovable, n8n, Zapier), startup operations, and content \
creation. He talks naturally, fast, with mild Dutch accent.

You receive a Whisper transcript that has already had cloud→claude substituted. \
Your job: find OTHER likely mishearings using context. Common patterns on this \
channel:
- 'failed' misheard as 'filled' / 'feel' / 'felt'
- 'skill' misheard as 'scale' / 'school'
- 'routine' misheard as 'routing'
- 'agent' misheard as 'engine' / 'agents'
- 'prompt' misheard as 'prom'
- 'commit' misheard as 'comet'
- 'shipped' misheard as 'shaped' / 'shipped'
- 'Niden' / 'eight n' meaning 'n8n' (the workflow tool)

Return ONLY a JSON array of corrections, each with:
- word_index: integer index in the words array (0-based)
- wrong: the current word value at that index (verbatim)
- right: the corrected word value (single token; preserve trailing punctuation)
- confidence: "high" — REQUIRED literal value; only include this entry at all if you are >90% confident
- reason: one short sentence explaining the context cue. Must NOT contain words \
like 'unsure', 'uncertain', 'skipping', 'might', 'could be', 'however', 'maybe', \
'possibly', 'or' — those mean you're not confident enough to fix it.

If you're not >90% confident on a candidate, DO NOT include it. Return [] if \
nothing meets the bar. NO commentary outside the JSON array."""


def load_words(path: Path) -> list[dict]:
    return json.loads(path.read_text())


def build_user_prompt(words: list[dict]) -> str:
    """Send a numbered token list so Claude can return word_index precisely."""
    lines = []
    for i, w in enumerate(words):
        lines.append(f"{i}: {w['word']}")
    return ("Find context-aware mishearings in this transcript. "
            "Return a JSON array of high-confidence corrections.\n\n"
            "Numbered tokens:\n" + "\n".join(lines))


def _autoload_anthropic_key():
    """If ANTHROPIC_API_KEY isn't set in the environment, try to read it from
    the BuildLoop ads/.env file. Lets render.sh pick up the polish step
    without callers having to source the env explicitly."""
    if os.getenv("ANTHROPIC_API_KEY"):
        return
    for env_path in [
        Path.home() / "Projects/BuildLoop/ads/.env",
        Path.home() / "Projects/BuildLoop/automation/.env",
    ]:
        if not env_path.exists():
            continue
        try:
            for line in env_path.read_text().splitlines():
                if line.startswith("ANTHROPIC_API_KEY="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    os.environ["ANTHROPIC_API_KEY"] = val
                    return
        except Exception:
            pass


def get_corrections(words: list[dict]) -> list[dict]:
    _autoload_anthropic_key()
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("[polish] ANTHROPIC_API_KEY not set — skipping LLM polish step",
              file=sys.stderr)
        return []
    user_prompt = build_user_prompt(words)
    if HAVE_CLAUDE_WRAPPER:
        cc = ClaudeClient(max_tokens=2000)  # type: ignore[name-defined]
        text = cc.complete(system=SYSTEM_PROMPT, user=user_prompt)
    else:
        from anthropic import Anthropic
        ac = Anthropic()
        msg = ac.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = msg.content[0].text  # type: ignore[union-attr]
    # Extract JSON array from response. Use a depth-balanced scan to find the
    # first complete bracketed structure — handles cases where Claude returns
    # the array followed by an explanatory paragraph (which broke the simple
    # greedy regex). Also strips ```json fences if present.
    cleaned = re.sub(r"```(?:json)?\s*", "", text).replace("```", "").strip()
    start = cleaned.find("[")
    if start < 0:
        return []
    depth, end = 0, -1
    in_str, escape = False, False
    for i in range(start, len(cleaned)):
        ch = cleaned[i]
        if escape:
            escape = False
            continue
        if ch == "\\":
            escape = True
            continue
        if ch == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    if end < 0:
        return []
    try:
        return json.loads(cleaned[start:end])
    except Exception as e:
        print(f"[polish] LLM returned invalid JSON: {e}\n  raw: {cleaned[start:end][:200]!r}",
              file=sys.stderr)
        return []


HEDGE_WORDS = (
    "unsure", "uncertain", "skipping", "skip", "might", "could be",
    "however", "maybe", "possibly", "or 'a", "or '", "actually",
)


def apply_corrections(words: list[dict], fixes: list[dict]) -> int:
    """Apply each {word_index, wrong, right, confidence, reason} fix.

    Skips when:
    - confidence is missing or != 'high'
    - reason contains any HEDGE_WORDS (means the LLM was hedging)
    - the word at index doesn't actually match `wrong`
    - `right` would equal `wrong` (no-op)
    """
    applied = 0
    for fix in fixes:
        try:
            idx = int(fix["word_index"])
            wrong = str(fix["wrong"])
            right = str(fix["right"])
            reason = str(fix.get("reason", ""))
            conf = str(fix.get("confidence", "")).lower()
        except (KeyError, TypeError, ValueError):
            print(f"[polish] skipping malformed fix: {fix!r}", file=sys.stderr)
            continue
        if conf != "high":
            print(f"[polish] skipping low-confidence fix at idx {idx}: "
                  f"confidence={conf!r}, reason={reason!r}")
            continue
        reason_lower = reason.lower()
        if any(h in reason_lower for h in HEDGE_WORDS):
            print(f"[polish] skipping hedged fix at idx {idx}: {reason!r}")
            continue
        if idx < 0 or idx >= len(words):
            print(f"[polish] skipping out-of-range index {idx}", file=sys.stderr)
            continue
        actual = words[idx]["word"]
        if actual.lower() != wrong.lower():
            print(f"[polish] skipping mismatch at idx {idx}: actual={actual!r} "
                  f"vs wrong={wrong!r}", file=sys.stderr)
            continue
        if right == actual:
            continue  # no-op
        words[idx]["word"] = right
        applied += 1
        print(f"[polish] idx {idx}: {actual!r} → {right!r}  ({reason})")
    return applied


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: polish_transcript.py <words.json>", file=sys.stderr)
        return 2
    words_path = Path(sys.argv[1]).expanduser().resolve()
    if not words_path.exists():
        print(f"words.json not found: {words_path}", file=sys.stderr)
        return 2
    words = load_words(words_path)
    fixes = get_corrections(words)
    if not fixes:
        print("[polish] no corrections proposed")
        return 0
    applied = apply_corrections(words, fixes)
    if applied:
        words_path.write_text(json.dumps(words, indent=2))
        print(f"[polish] wrote {applied} correction(s) to {words_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
