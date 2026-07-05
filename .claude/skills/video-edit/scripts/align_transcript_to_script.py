#!/usr/bin/env python3
"""
align_transcript_to_script.py — use the canonical script to fix BRAND /
BUSINESS NAMES in the transcript, and nothing else.

The policy (set by the channel owner, May 2026)
------------------------------------------------
"The script is sort of followed by the transcript. I make different
 sentences, skip some, etc — but most of the time the script is leading.
 It contains the core message and the correct business names. Only use it
 to know for a fact what the script is really about."

So the spoken AUDIO is the truth about WHAT WAS SAID — an ad-libbed "ten"
stays "ten" even if the script wrote "eleven". The SCRIPT is the truth
about one thing only: the spelling of proper nouns / brand names Whisper
cannot know ("Hermes Agent", "Bolt", "OpenClaw", "Lovable", "v0").

  in:  <workdir>/words.json   — Whisper output [{word,start,end}, ...]
       <workdir>/script.txt   — canonical script (raw DB `script` field)
  out: <workdir>/words.json   — same transcript, misheard brand names
                                 swapped to their canonical spelling
       prints corrections + a REVIEW list of brand disagreements it was
       not confident enough to auto-fix (the agent reconciles those by
       hand, with the script in front of it).

What counts as a brand name
----------------------------
A script token is brand-like if it: contains a digit (v0, GPT-4); has
internal uppercase (OpenClaw); is ALL-CAPS len>1 (API); or is capitalized
AND not sentence-initial (Hermes, Bolt). Sentence-initial caps ("Three
made…") are NOT brands.

How it stays safe
-----------------
The two token streams are diffed (difflib). Corrections happen only inside
`replace` spans (a local disagreement), and only:
  • per-token, when the spans are equal-length — swap the brand tokens.
  • wholesale, when a short span is ENTIRELY brand tokens but garbled into
    a different token count ("Open Claw" 2 → "OpenClaw" 1).
  • edge-peel, when a brand sits at a list boundary confirmed by a matching
    (`equal`) run right next to it — pair the edge tokens 1:1.
Anything else containing a brand the script disagrees with is not touched —
it is printed under REVIEW for the agent to reconcile. Numbers, ordinary
words, whole re-phrasings and skipped script lines are always left alone.
"""
import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

MAX_FIX_SPAN = 4   # equal-length replace spans up to this are auto-swapped
MAX_PEEL = 3       # at most this many brand tokens peeled off each edge


def clean_script(raw: str) -> str:
    """Strip markdown/metadata from a DB `script` field → spoken VO text."""
    out: list[str] = []
    for line in raw.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if re.match(r"^\*\*[^*]+\*\*", s):   # **Format:** … metadata lines
            continue
        out.append(s)
    text = " ".join(out)
    text = re.sub(r"\[[^\]]*\]", " ", text)              # [stage directions]
    text = text.replace('"', " ").replace("“", " ").replace("”", " ")
    return re.sub(r"\s+", " ", text).strip()


_NORM_RE = re.compile(r"[^a-z0-9']")


def norm(tok: str) -> str:
    return _NORM_RE.sub("", tok.lower())


# The pronoun "I" and its contractions are capitalized everywhere — never
# a brand. Without this guard "I'm", "I'll" trip the mid-sentence-cap rule.
_NOT_BRAND = {"i", "i'm", "i'll", "i've", "i'd", "a"}

# Number words are FACTUAL even when lowercase — if the script says "eight"
# and Whisper heard "aid", we want the script's "eight" to win regardless
# of sentence position (scene-2 May 23 2026: caption "AID DIDN'T" instead
# of "EIGHT DIDN'T"). Numbers are facts the speaker IS saying; mishearings
# of them aren't ad-libs.
_NUMBER_WORDS = {
    "zero","one","two","three","four","five","six","seven","eight","nine","ten",
    "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen",
    "eighteen","nineteen","twenty","thirty","forty","fifty","sixty","seventy",
    "eighty","ninety","hundred","thousand","million","billion","trillion",
    "dozen","half","quarter","third","fourths","first","second","fifth",
    "tenth","once","twice",
}


def is_brandlike(tok: str, sentence_initial: bool) -> bool:
    core = tok.strip(".,!?;:\"'()")
    if not core or len(core) < 2:
        return False
    if core.lower() in _NOT_BRAND:
        return False
    if core.lower() in _NUMBER_WORDS:                  # eight, twelve, hundred…
        return True
    if any(c.isdigit() for c in core):                 # v0, GPT-4
        return True
    if core.isupper() and len(core) > 1:               # API, SDK
        return True
    if any(c.isupper() for c in core[1:]):             # CamelCase: OpenClaw
        return True
    if core[0].isupper() and not sentence_initial:     # mid-sentence Proper
        return True
    return False


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: align_transcript_to_script.py <words.json> <script.txt>",
              file=sys.stderr)
        return 2

    words_path, script_path = Path(sys.argv[1]), Path(sys.argv[2])
    if not words_path.exists():
        print(f"[skip] no words.json at {words_path}", file=sys.stderr)
        return 0
    if not script_path.exists():
        print("[skip] no script.txt — nothing to align against", file=sys.stderr)
        return 0

    data = json.loads(words_path.read_text())
    words = data["words"] if isinstance(data, dict) and "words" in data else data
    if not words:
        print("[skip] words.json empty", file=sys.stderr)
        return 0
    key = "word" if "word" in words[0] else "text"

    script = clean_script(script_path.read_text())
    raw_toks = [t for t in script.split() if norm(t)]
    if not raw_toks:
        print("[skip] script.txt empty after cleaning", file=sys.stderr)
        return 0

    # Tag every script token brand / not-brand (sentence-initial caps excluded).
    s_toks: list[str] = []
    s_brand: list[bool] = []
    sentence_initial = True
    for t in raw_toks:
        s_toks.append(t)
        s_brand.append(is_brandlike(t, sentence_initial))
        # Only . ! ? end a sentence. A COLON does NOT — "...canceling: Hermes"
        # introduces a list, and the capitalized word after it is a real
        # proper noun, not just an orthographic sentence start.
        sentence_initial = t.rstrip().endswith((".", "!", "?"))

    w_norm = [norm(w[key]) for w in words]
    s_norm = [norm(t) for t in s_toks]

    out: list[dict] = []
    fixes: list[str] = []
    review: list[str] = []
    equal_tokens = 0

    def swap(w_obj: dict, new_text: str) -> dict:
        d = dict(w_obj)
        d[key] = new_text
        return d

    ops = SequenceMatcher(a=w_norm, b=s_norm, autojunk=False).get_opcodes()
    for idx, (op, i1, i2, j1, j2) in enumerate(ops):
        if op == "equal":
            out.extend(words[i1:i2])
            equal_tokens += i2 - i1
            continue
        if op == "delete":            # transcript word not in script — ad-lib
            out.extend(words[i1:i2])
            continue
        if op == "insert":            # script word the speaker skipped — drop
            continue

        # op == "replace": a local disagreement.
        span_w, span_s = i2 - i1, j2 - j1
        if not any(s_brand[j1:j2]):
            out.extend(words[i1:i2])          # no brand to salvage — keep audio
            continue

        # (a) equal-length short span → per-token brand swap.
        if span_w == span_s and span_w <= MAX_FIX_SPAN:
            for k in range(span_w):
                w_obj = words[i1 + k]
                if s_brand[j1 + k] and w_norm[i1 + k] != s_norm[j1 + k]:
                    out.append(swap(w_obj, s_toks[j1 + k]))
                    fixes.append(f"  '{w_obj[key]}' -> '{s_toks[j1 + k]}'")
                else:
                    out.append(w_obj)
            continue

        # (b) short span, ALL script tokens brand, garbled token count
        #     ("Open Claw" 2 -> "OpenClaw" 1) → adopt the script span,
        #     spreading the audio time-range across it.
        if (span_w != span_s and span_w <= 6 and span_s <= 6
                and all(s_brand[j1:j2])):
            t0 = float(words[i1]["start"])
            t1 = float(words[i2 - 1]["end"])
            if t1 <= t0:
                t1 = t0 + 0.001
            step = (t1 - t0) / span_s
            for k in range(span_s):
                out.append({key: s_toks[j1 + k],
                            "start": round(t0 + k * step, 3),
                            "end": round(t0 + (k + 1) * step, 3)})
            fixes.append(f"  '{' '.join(words[i][key] for i in range(i1, i2))}'"
                         f" -> '{' '.join(s_toks[j1:j2])}'")
            continue

        # (c) edge-peel: a brand at a list boundary confirmed by a matching
        #     run right next to it. Pair edge tokens 1:1.
        prev_equal = idx > 0 and ops[idx - 1][0] == "equal"
        next_equal = idx + 1 < len(ops) and ops[idx + 1][0] == "equal"
        cap = min(span_w, span_s)
        left = 0
        if prev_equal:
            while left < min(cap, MAX_PEEL) and s_brand[j1 + left]:
                left += 1
        right = 0
        if next_equal:
            while right < min(cap - left, MAX_PEEL) and s_brand[j2 - 1 - right]:
                right += 1

        for k in range(left):
            w_obj = words[i1 + k]
            if w_norm[i1 + k] != s_norm[j1 + k]:
                out.append(swap(w_obj, s_toks[j1 + k]))
                fixes.append(f"  '{w_obj[key]}' -> '{s_toks[j1 + k]}'")
            else:
                out.append(w_obj)
        out.extend(words[i1 + left:i2 - right])      # middle kept as audio
        for m in range(right - 1, -1, -1):
            w_obj = words[i2 - 1 - m]
            if w_norm[i2 - 1 - m] != s_norm[j2 - 1 - m]:
                out.append(swap(w_obj, s_toks[j2 - 1 - m]))
                fixes.append(f"  '{w_obj[key]}' -> '{s_toks[j2 - 1 - m]}'")
            else:
                out.append(w_obj)

        # anything branded still left unreconciled in the middle → REVIEW.
        mid_brands = [s_toks[j1 + left + x] for x in range(span_s - left - right)
                      if s_brand[j1 + left + x]]
        if mid_brands:
            heard = ' '.join(words[i][key] for i in range(i1 + left, i2 - right))
            review.append(f"  transcript: \"{heard}\"\n"
                           f"  script   : \"{' '.join(s_toks[j1 + left:j2 - right])}\""
                           f"   (brand terms: {', '.join(mid_brands)})")

    out_data = {"words": out} if isinstance(data, dict) and "words" in data else out
    words_path.write_text(json.dumps(out_data, indent=2))

    coverage = 100.0 * equal_tokens / max(1, len(words))
    if fixes:
        print(f"==> Script-matched: {len(fixes)} brand correction(s) applied "
              f"from the canonical script:")
        for f in fixes:
            print(f)
    else:
        print("==> Script-matched: no brand corrections needed.")
    if review:
        print(f"\n[REVIEW] {len(review)} region(s) where the script's brand "
              f"names disagree with the transcript but auto-fix was not "
              f"confident. Reconcile these in words.json by hand:")
        for r in review:
            print(r)
    if coverage < 25:
        print(f"\n[warn] only ~{coverage:.0f}% of the transcript matches "
              f"script.txt — is this the RIGHT script for this video?",
              file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
