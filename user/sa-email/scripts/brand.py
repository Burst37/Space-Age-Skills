#!/usr/bin/env python3
"""
SA-EMAIL: Brand voice loader.
Loads brand tokens from DESIGN.md, BTP files, or inline text.
Outputs a normalized EMAIL_BRAND_TOKENS block.

Usage:
    python3 brand.py --source ./DESIGN.md
    python3 brand.py --source https://example.com  # fetches + extracts
    python3 brand.py --interactive                 # prompts for brand info
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    import urllib.request
    import urllib.error
    HAS_URLLIB = True
except ImportError:
    HAS_URLLIB = False


DEFAULT_TOKENS = {
    "brand_name": "[BRAND]",
    "tone_primary": "professional",
    "tone_secondary": "warm",
    "voice_examples": [
        "We're here to help you succeed.",
        "Let's make it happen together.",
    ],
    "forbidden_words": [],
    "cta_style": "imperative",
    "greeting_style": "Hi {first_name}",
    "sign_off": "The [BRAND] Team",
    "color_primary": "#000000",
    "color_bg": "#ffffff",
    "color_text": "#333333",
    "font_body": "Arial, Helvetica, sans-serif",
    "_source": "default",
}

TONE_KEYWORDS = {
    "luxury": ["elevated", "premium", "exclusive", "curated", "bespoke", "sophisticated"],
    "startup": ["bold", "fast", "disruptive", "hustle", "innovative", "move fast"],
    "corporate": ["professional", "enterprise", "trusted", "reliable", "compliant"],
    "warm": ["friendly", "welcome", "together", "community", "care", "support"],
    "technical": ["developer", "API", "integration", "stack", "platform", "engineer"],
    "bold": ["game-changing", "dominant", "fierce", "crushing", "unstoppable"],
}


def fetch_url(url: str) -> str | None:
    if not HAS_URLLIB:
        return None
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 SA-EMAIL-BrandLoader/1.0"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"Warning: Could not fetch {url}: {e}", file=sys.stderr)
        return None


def infer_tone(text: str) -> tuple[str, str]:
    text_lower = text.lower()
    tone_scores = {}
    for tone, keywords in TONE_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            tone_scores[tone] = score
    sorted_tones = sorted(tone_scores, key=tone_scores.get, reverse=True)
    primary = sorted_tones[0] if sorted_tones else "professional"
    secondary = sorted_tones[1] if len(sorted_tones) > 1 else "warm"
    return primary, secondary


def extract_colors_from_html(html: str) -> dict:
    colors = {}
    # CSS custom properties (most reliable)
    for prop, token in [
        ("--color-primary", "color_primary"),
        ("--color-secondary", "color_secondary"),
        ("--color-bg", "color_bg"),
        ("--color-background", "color_bg"),
        ("--color-text", "color_text"),
    ]:
        match = re.search(rf"{re.escape(prop)}\s*:\s*(#[0-9a-fA-F]{{3,6}})", html)
        if match:
            colors[token] = match.group(1)
    # Fallback: grab first hex from background-color
    if "color_bg" not in colors:
        match = re.search(r"background-color:\s*(#[0-9a-fA-F]{3,6})", html)
        if match:
            colors["color_bg"] = match.group(1)
    return colors


def extract_fonts_from_html(html: str) -> dict:
    fonts = {}
    font_match = re.search(
        r"font-family:\s*([^;}{]+)",
        html,
        re.IGNORECASE,
    )
    if font_match:
        fonts["font_body"] = font_match.group(1).strip().rstrip(",")
    return fonts


def parse_design_md(content: str) -> dict:
    tokens = dict(DEFAULT_TOKENS)
    tokens["_source"] = "DESIGN.md"

    name_match = re.search(r"(?:Brand|Name|Client)[:\s]+([^\n]+)", content, re.IGNORECASE)
    if name_match:
        tokens["brand_name"] = name_match.group(1).strip()
        tokens["sign_off"] = f"The {tokens['brand_name']} Team"

    color_map = {
        "primary": "color_primary",
        "secondary": "color_secondary",
        "background": "color_bg",
        "bg": "color_bg",
        "text": "color_text",
    }
    for key, token in color_map.items():
        match = re.search(
            rf"(?:--color-{key}|color-{key}|{key} color)[:\s]+(#[0-9a-fA-F]{{3,6}})",
            content,
            re.IGNORECASE,
        )
        if match:
            tokens[token] = match.group(1)

    tone_match = re.search(r"Tone[:\s]+([^\n]+)", content, re.IGNORECASE)
    if tone_match:
        tones = [t.strip() for t in tone_match.group(1).split(",")]
        tokens["tone_primary"] = tones[0] if tones else "professional"
        tokens["tone_secondary"] = tones[1] if len(tones) > 1 else "warm"

    font_match = re.search(r"(?:body font|--font-body|font-body)[:\s]+([^\n]+)", content, re.IGNORECASE)
    if font_match:
        tokens["font_body"] = font_match.group(1).strip()

    return tokens


def load_from_url(url: str) -> dict:
    html = fetch_url(url)
    if not html:
        return {**DEFAULT_TOKENS, "_source": "default (fetch failed)", "_warning": f"Could not fetch {url}"}

    tokens = dict(DEFAULT_TOKENS)
    tokens["_source"] = url

    # Brand name from title or og:site_name
    title_match = re.search(r"<title[^>]*>([^<|–-]+)", html, re.IGNORECASE)
    og_match = re.search(r'property=["\']og:site_name["\'][^>]+content=["\']([^\'"]+)', html, re.IGNORECASE)
    if og_match:
        tokens["brand_name"] = og_match.group(1).strip()
    elif title_match:
        tokens["brand_name"] = title_match.group(1).strip()
    tokens["sign_off"] = f"The {tokens['brand_name']} Team"

    colors = extract_colors_from_html(html)
    tokens.update(colors)

    fonts = extract_fonts_from_html(html)
    tokens.update(fonts)

    primary, secondary = infer_tone(html)
    tokens["tone_primary"] = primary
    tokens["tone_secondary"] = secondary

    return tokens


def interactive_mode() -> dict:
    tokens = dict(DEFAULT_TOKENS)
    tokens["_source"] = "interactive"
    print("\nSA-EMAIL Brand Voice Setup")
    print("Press Enter to accept defaults shown in [brackets]\n")
    tokens["brand_name"] = input(f"Brand name [{tokens['brand_name']}]: ").strip() or tokens["brand_name"]
    tokens["sign_off"] = f"The {tokens['brand_name']} Team"
    tone = input(f"Primary tone (luxury/startup/corporate/warm/bold/technical) [{tokens['tone_primary']}]: ").strip()
    if tone:
        tokens["tone_primary"] = tone
    tone2 = input(f"Secondary tone [{tokens['tone_secondary']}]: ").strip()
    if tone2:
        tokens["tone_secondary"] = tone2
    example = input("Brand voice example sentence (leave blank to skip): ").strip()
    if example:
        tokens["voice_examples"] = [example]
    greeting = input(f"Email greeting style [{tokens['greeting_style']}]: ").strip()
    if greeting:
        tokens["greeting_style"] = greeting
    primary_color = input(f"Primary color hex [{tokens['color_primary']}]: ").strip()
    if primary_color:
        tokens["color_primary"] = primary_color
    return tokens


def print_tokens(tokens: dict):
    print(f"\nEMAIL BRAND TOKENS")
    print(f"Source: {tokens.get('_source', 'unknown')}")
    print(f"{'─'*40}")
    print(f"brand_name:       {tokens['brand_name']}")
    print(f"tone_primary:     {tokens['tone_primary']}")
    print(f"tone_secondary:   {tokens['tone_secondary']}")
    print(f"greeting_style:   {tokens['greeting_style']}")
    print(f"sign_off:         {tokens['sign_off']}")
    print(f"cta_style:        {tokens['cta_style']}")
    print(f"color_primary:    {tokens['color_primary']}")
    print(f"color_bg:         {tokens['color_bg']}")
    print(f"color_text:       {tokens['color_text']}")
    print(f"font_body:        {tokens['font_body']}")
    if tokens.get("voice_examples"):
        print(f"voice_examples:")
        for ex in tokens["voice_examples"]:
            print(f"  - {ex}")
    if tokens.get("_warning"):
        print(f"\n⚠️  {tokens['_warning']}")
    print()


def main():
    parser = argparse.ArgumentParser(description="SA-EMAIL Brand Loader")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--source", help="Path to DESIGN.md/BTP file or https:// URL")
    group.add_argument("--interactive", action="store_true", help="Interactive prompt mode")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    if args.interactive:
        tokens = interactive_mode()
    elif args.source.startswith("http"):
        tokens = load_from_url(args.source)
    else:
        src = Path(args.source).expanduser()
        if not src.exists():
            print(f"Error: File not found: {args.source}", file=sys.stderr)
            sys.exit(1)
        tokens = parse_design_md(src.read_text())

    if args.json:
        # Remove internal keys
        output = {k: v for k, v in tokens.items() if not k.startswith("_")}
        print(json.dumps(output, indent=2))
    else:
        print_tokens(tokens)


if __name__ == "__main__":
    main()
