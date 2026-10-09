"""Shared helpers for the free-llm-apis scripts (stdlib only)."""
import json
import os
import pathlib

DATA = pathlib.Path(__file__).resolve().parent.parent / "data" / "data.json"

# Space Age convention: the env var that holds each provider's key. Values are NEVER stored in
# this repo, in chat, or in SESSION_MEMORY (log the variable NAME only).
ENV_VARS = {
    "Aion Labs": "AIONLABS_API_KEY",
    "Cohere": "COHERE_API_KEY",
    "Google Gemini": "GEMINI_API_KEY",
    "Mistral AI": "MISTRAL_API_KEY",
    "Z AI (Zhipu AI)": "ZAI_API_KEY",
    "Cloudflare Workers AI": "CLOUDFLARE_API_TOKEN",   # also needs CLOUDFLARE_ACCOUNT_ID
    "Groq": "GROQ_API_KEY",
    "Hugging Face": "HF_TOKEN",
    "Kilo Code": "KILO_API_KEY",                       # optional: free models need no key
    "LLM7.io": "LLM7_API_KEY",                         # optional: anonymous tier works
    "ModelScope": "MODELSCOPE_API_KEY",
    "NVIDIA NIM": "NVIDIA_API_KEY",
    "Ollama Cloud": "OLLAMA_API_KEY",
    "OpenRouter": "OPENROUTER_API_KEY",
    "OVHcloud AI Endpoints": "OVH_AI_ENDPOINTS_ACCESS_TOKEN",  # optional: anonymous tier works
    "SiliconFlow": "SILICONFLOW_API_KEY",
}

# Providers that work with no key at all (anonymous / keyless free tier), per data.json descriptions.
KEYLESS = {"Kilo Code", "LLM7.io", "OVHcloud AI Endpoints"}

# Base URLs for the OpenAI-compatible chat endpoint where it differs from data.json `baseUrl`.
# Source: upstream setup guides + data.json footnotes. Provider docs win if they disagree.
OPENAI_BASE_OVERRIDES = {
    "Google Gemini": "https://generativelanguage.googleapis.com/v1beta/openai",
    "Cohere": "https://api.cohere.com/v2",  # per upstream guide; Cohere's own compat path may differ — check docs
    "Ollama Cloud": "https://ollama.com/v1",  # footnote 3
    "Kilo Code": "https://api.kilo.ai/api/gateway",
}


def load():
    with open(DATA, encoding="utf-8") as fh:
        return json.load(fh)


def openai_base(provider, account_id=None):
    name = provider["name"]
    base = OPENAI_BASE_OVERRIDES.get(name, provider["baseUrl"])
    if name == "Cloudflare Workers AI":
        acct = account_id or os.environ.get("CLOUDFLARE_ACCOUNT_ID", "{account_id}")
        base = f"https://api.cloudflare.com/client/v4/accounts/{acct}/ai/v1"
    return base.rstrip("/")


def find(data, name):
    n = name.lower()
    hits = [p for p in data["providers"] if n == p["name"].lower()] or \
           [p for p in data["providers"] if n in p["name"].lower()]
    return hits
