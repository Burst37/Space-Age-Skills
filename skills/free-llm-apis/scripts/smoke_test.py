#!/usr/bin/env python3
"""One-shot chat completion against a free provider (OpenAI-style /chat/completions). Stdlib only.

  python3 -I scripts/smoke_test.py --provider "OVHcloud AI Endpoints" --model <id>      # keyless
  GROQ_API_KEY=… python3 -I scripts/smoke_test.py --provider Groq --model openai/gpt-oss-20b
  python3 -I scripts/smoke_test.py --provider Groq --dry-run                            # print request, send nothing

The key is read ONLY from the provider's env var (see references/providers.md). It is never accepted as a
CLI argument (would leak into shell history / process lists) and never printed.
Exit codes: 0 ok · 2 usage/unknown provider · 3 missing key · 4 HTTP/network error · 5 malformed response.
"""
import argparse
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from common import ENV_VARS, KEYLESS, find, load, openai_base  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--provider", required=True, help="provider name from the catalog (substring ok)")
    ap.add_argument("--model", help="model id (default: first model in the catalog for that provider)")
    ap.add_argument("--prompt", default="Say hello in one short sentence.")
    ap.add_argument("--max-tokens", type=int, default=512, help="reasoning models spend tokens thinking; keep this generous")
    ap.add_argument("--timeout", type=int, default=30)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    hits = find(load(), a.provider)
    if len(hits) != 1:
        print(f"provider must match exactly one entry; got {[h['name'] for h in hits] or 'none'}", file=sys.stderr)
        return 2
    p = hits[0]
    var = ENV_VARS.get(p["name"])
    key = os.environ.get(var or "", "")
    if not key and p["name"] not in KEYLESS and not a.dry_run:
        print(f"missing key: export {var}=… (free key: {p['url']})", file=sys.stderr)
        return 3

    model = a.model or p["models"][0]["id"]
    url = openai_base(p) + "/chat/completions"
    body = {"model": model, "messages": [{"role": "user", "content": a.prompt}], "max_tokens": a.max_tokens}
    headers = {"Content-Type": "application/json", "User-Agent": "space-age-free-llm-apis/1"}
    if key:
        headers["Authorization"] = f"Bearer {key}"

    if a.dry_run:
        print(f"POST {url}\nmodel={model}\nauth={'Bearer ***' if key else ('none (keyless tier)' if p['name'] in KEYLESS else f'MISSING — export {var}')}")
        return 0

    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=a.timeout) as r:
            payload = json.load(r)
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} from {p['name']}: {e.read()[:300].decode('utf-8', 'replace')}", file=sys.stderr)
        return 4
    except Exception as e:  # network, DNS, TLS, timeout
        print(f"request failed: {type(e).__name__}: {e}", file=sys.stderr)
        return 4
    try:
        choice = payload["choices"][0]
        msg = choice["message"]
    except (KeyError, IndexError, TypeError):
        print(f"unexpected response shape: {str(payload)[:300]}", file=sys.stderr)
        return 5
    text = (msg.get("content") or "").strip()
    if text:
        print(text)
        return 0
    if msg.get("reasoning") or msg.get("reasoning_content"):
        print(f"empty content (finish_reason={choice.get('finish_reason')}): the model is a reasoning model and spent "
              f"max_tokens={a.max_tokens} thinking. Raise --max-tokens or pick a non-reasoning model.", file=sys.stderr)
        return 5
    print(f"empty content, finish_reason={choice.get('finish_reason')}", file=sys.stderr)
    return 5


if __name__ == "__main__":
    sys.exit(main())
