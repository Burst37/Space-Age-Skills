#!/usr/bin/env python3
"""Deterministic anti-slop / accessibility / performance gate for a produced build.

Judges are necessary but not sufficient — an LLM reviewing its own output will miss the
mechanical failures every time. This checks what can be checked without opinion.

Usage:
    python3 scripts/audit_build.py <file.html | directory> [--tier T0|T1|T2|T3] [--json]

Exit 0 = pass (no blockers), 1 = fail. Warnings never fail the run on their own.
Static analysis only: it reads HTML/CSS/JS text. It cannot measure LCP or render the page
— pair it with the verification protocol in references/PERFORMANCE_BUDGETS.md.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

MAX_FONT_FILES = 4
MAX_FAMILIES = 3
GENERIC_DISPLAY_FONTS = {"inter", "poppins", "montserrat", "roboto", "open sans", "lato", "nunito"}

# WCAG relative luminance
def _lin(c: float) -> float:
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb: tuple[int, int, int]) -> float:
    r, g, b = (_lin(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def parse_hex(h: str) -> tuple[int, int, int] | None:
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) not in (6, 8):
        return None
    try:
        return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    except ValueError:
        return None


class Report:
    def __init__(self) -> None:
        self.blockers: list[str] = []
        self.warnings: list[str] = []
        self.notes: list[str] = []

    def block(self, m: str) -> None:
        self.blockers.append(m)

    def warn(self, m: str) -> None:
        self.warnings.append(m)

    def note(self, m: str) -> None:
        self.notes.append(m)


def audit(text: str, name: str, rep: Report, tier: str) -> None:
    low = text.lower()
    has_html = "<html" in low or "<body" in low

    # ---------- accessibility blockers ----------
    if has_html:
        imgs = re.findall(r"<img\b[^>]*>", text, re.I)
        no_alt = [i for i in imgs if not re.search(r"\balt\s*=", i, re.I)]
        if no_alt:
            rep.block(f"{name}: {len(no_alt)} <img> without alt attribute")
        no_dims = [i for i in imgs
                   if not re.search(r"\b(width|height)\s*=", i, re.I)
                   and "aspect-ratio" not in i.lower()]
        if no_dims:
            rep.warn(f"{name}: {len(no_dims)} <img> without width/height — CLS risk")

        lazy_first = re.search(r"<img\b[^>]*loading\s*=\s*[\"']lazy", text[:text.find("</header>") + 1] or text[:3000], re.I)
        if lazy_first:
            rep.warn(f"{name}: an above-fold image uses loading=lazy — LCP regression")

        inputs = re.findall(r"<input\b[^>]*>", text, re.I)
        real_inputs = [i for i in inputs
                       if not re.search(r"type\s*=\s*[\"'](hidden|submit|button|reset)", i, re.I)]
        ids = {m.group(1) for i in real_inputs for m in [re.search(r"\bid\s*=\s*[\"']([^\"']+)", i)] if m}
        labelled = set(re.findall(r"<label\b[^>]*\bfor\s*=\s*[\"']([^\"']+)", text, re.I))
        aria = sum(1 for i in real_inputs if re.search(r"aria-label(ledby)?\s*=", i, re.I))
        unlabelled = len(real_inputs) - len(ids & labelled) - aria
        if unlabelled > 0:
            rep.block(f"{name}: {unlabelled} form input(s) with no associated <label> or aria-label")

        if re.search(r"<html\b(?![^>]*\blang\s*=)", text, re.I):
            rep.block(f"{name}: <html> missing lang attribute")
        if not re.search(r"<meta\b[^>]*name\s*=\s*[\"']viewport", text, re.I):
            rep.block(f"{name}: missing viewport meta — mobile layout will not work")
        if not re.search(r"<h1\b", text, re.I):
            rep.warn(f"{name}: no <h1>")
        elif len(re.findall(r"<h1\b", text, re.I)) > 1:
            rep.warn(f"{name}: multiple <h1> elements")
        if not re.search(r"<(main|nav|header|footer)\b", text, re.I):
            rep.warn(f"{name}: no semantic landmarks (main/nav/header/footer)")

    # ---------- focus visibility ----------
    for m in re.finditer(r"([^{}]*)\{([^{}]*outline\s*:\s*(?:none|0)[^{}]*)\}", text, re.I):
        sel, block = m.group(1), m.group(2)
        if "focus" in sel.lower() or ":focus" in sel.lower():
            if not re.search(r"box-shadow|outline-offset|border", block, re.I):
                rep.block(f"{name}: focus style removes outline with no visible replacement ({sel.strip()[:60]})")

    # ---------- motion ----------
    js_animation = bool(re.search(r"\bgsap\b|ScrollTrigger|animate\(|framer-motion|\bmotion\.", text, re.I))
    css_animation = bool(re.search(r"@keyframes|transition\s*:", text, re.I))
    if (js_animation or css_animation) and "prefers-reduced-motion" not in low:
        rep.block(f"{name}: animation present with no prefers-reduced-motion handling")

    # scrub without linear easing
    for m in re.finditer(r"scrollTrigger\s*:\s*\{[^{}]*scrub[^{}]*\}", text, re.I):
        window = text[max(0, m.start() - 400):m.end() + 200]
        if not re.search(r"ease\s*:\s*[\"']none[\"']", window):
            rep.warn(f"{name}: scrubbed ScrollTrigger without ease:'none' — will lag the scroll")

    # animating layout properties
    layout_props = re.findall(
        r"(?:gsap\.(?:to|from|fromTo)\([^)]*?\b(width|height|top|left|margin\w*|padding\w*)\s*:)",
        text, re.I)
    if layout_props:
        rep.warn(f"{name}: animating layout properties ({', '.join(sorted(set(p.lower() for p in layout_props)))}) — use transforms")

    if re.search(r"@keyframes[^{]*\{[^@]*\b(width|height|top|left)\s*:", text, re.I):
        rep.warn(f"{name}: CSS keyframes animate layout properties — use transform")

    # content hidden by default in CSS (breaks JS-off and reduced-motion)
    hidden_default = re.findall(r"([^{}@]*)\{[^{}]*opacity\s*:\s*0\s*[;}]", text)
    risky = [s.strip() for s in hidden_default
             if s.strip() and not re.search(r":hover|:focus|:active|::?before|::?after|\.is-|\[data-|@|%", s)]
    if risky:
        rep.warn(f"{name}: {len(risky)} rule(s) set opacity:0 in CSS — content may be invisible "
                 f"if JS fails or motion is reduced (author the static state visible)")

    # ---------- typography ----------
    font_files = set(re.findall(r"[\w./-]+\.(?:woff2?|otf|ttf)", text, re.I))
    if len(font_files) > MAX_FONT_FILES:
        rep.block(f"{name}: {len(font_files)} font files (max {MAX_FONT_FILES})")
    families = set()
    for fam in re.findall(r"font-family\s*:\s*([^;}]+)", text, re.I):
        first = fam.split(",")[0].strip().strip("'\"")
        if first and not first.startswith("var(") and first.lower() not in (
                "inherit", "initial", "unset", "sans-serif", "serif", "monospace", "system-ui"):
            families.add(first.lower())
    if len(families) > MAX_FAMILIES:
        rep.warn(f"{name}: {len(families)} font families ({', '.join(sorted(families))}) — max {MAX_FAMILIES}")

    gf = re.search(r"fonts\.googleapis\.com/css2\?([^\"'>]+)", text)
    google_fams = set()
    if gf:
        google_fams = {f.split(":")[0].replace("+", " ").lower()
                       for f in re.findall(r"family=([^&]+)", gf.group(1))}
    generic_hits = (families | google_fams) & GENERIC_DISPLAY_FONTS
    if generic_hits:
        rep.warn(f"{name}: default-tier font(s) in use ({', '.join(sorted(generic_hits))}) — "
                 f"requires a written brand rationale (SKILL.md §7)")

    if re.search(r"font-face", low) and "font-display" not in low:
        rep.warn(f"{name}: @font-face without font-display")

    # ---------- color / contrast ----------
    body_bg = None
    body_fg = None
    m = re.search(r"body\s*\{([^}]*)\}", text, re.I | re.S)
    if m:
        blk = m.group(1)
        b = re.search(r"background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,8})", blk)
        f = re.search(r"(?<!-)\bcolor\s*:\s*(#[0-9a-fA-F]{3,8})", blk)
        body_bg = parse_hex(b.group(1)) if b else None
        body_fg = parse_hex(f.group(1)) if f else None
    if body_bg and body_fg:
        ratio = contrast(body_bg, body_fg)
        if ratio < 4.5:
            rep.block(f"{name}: body text contrast {ratio:.2f}:1 — below 4.5:1 WCAG AA")
        elif ratio < 7:
            rep.note(f"{name}: body contrast {ratio:.2f}:1 (AA pass, AAA target is 7:1)")
        else:
            rep.note(f"{name}: body contrast {ratio:.2f}:1 (AAA)")
    if re.search(r"#(fff|ffffff)\b[^;]*", text, re.I) and re.search(r"background[^;]*#(000|000000)\b", text, re.I):
        rep.warn(f"{name}: pure #fff on pure #000 — use near-black/near-white")

    # ---------- generic AI tells ----------
    if re.search(r"linear-gradient\([^)]*(?:135deg|to right)[^)]*(?:#(?:8b5cf6|a855f7|7c3aed|6366f1)|purple|violet)[^)]*(?:#(?:3b82f6|2563eb|0ea5e9)|blue)", text, re.I):
        rep.warn(f"{name}: purple→blue gradient detected — the canonical AI tell (SKILL.md §7)")
    blur_count = len(re.findall(r"backdrop-filter\s*:\s*blur", text, re.I))
    if blur_count > 3:
        rep.warn(f"{name}: backdrop-filter blur on {blur_count} rules — glassmorphism-as-default risk, and expensive on mid-range Android")

    radii = set()
    for r in re.findall(r"border-radius\s*:\s*([\d.]+)px", text, re.I):
        v = float(r)
        if v > 0:
            radii.add(v)
    if len(radii) > 4:
        rep.warn(f"{name}: {len(radii)} distinct border-radius values — pick one radius family")

    # ---------- performance ----------
    scripts = re.findall(r"<script\b[^>]*\bsrc\s*=\s*[\"']([^\"']+)", text, re.I)
    third_party = [s for s in scripts if re.match(r"https?://", s)]
    limits = {"T0": 1, "T1": 2, "T2": 3, "T3": 3}
    if len(third_party) > limits.get(tier, 3):
        rep.warn(f"{name}: {len(third_party)} external scripts (tier {tier} budget: {limits.get(tier,3)})")
    blocking = [s for s in re.findall(r"<script\b((?![^>]*\b(?:async|defer|type\s*=\s*[\"']module)).)*?\bsrc=[^>]*>", text, re.I)]
    if blocking:
        rep.warn(f"{name}: {len(blocking)} render-blocking script tag(s) — add defer/async")

    for v in re.findall(r"<video\b[^>]*>", text, re.I):
        if not re.search(r"\bposter\s*=", v, re.I):
            rep.warn(f"{name}: <video> without poster — the poster is usually the LCP element")
        if re.search(r"\bautoplay\b", v, re.I) and not re.search(r"\bmuted\b", v, re.I):
            rep.block(f"{name}: autoplay <video> without muted — will not play and may violate policy")
        if re.search(r"\bautoplay\b", v, re.I) and not re.search(r"\bplaysinline\b", v, re.I):
            rep.warn(f"{name}: autoplay <video> without playsinline — breaks on iOS")

    # ---------- mobile / touch ----------
    if re.search(r"user-scalable\s*=\s*no|maximum-scale\s*=\s*1", text, re.I):
        rep.block(f"{name}: viewport disables zoom — accessibility violation")
    if has_html and re.search(r"tel:", text, re.I) is None and re.search(r"\b(plumb|hvac|roofing|electric|dentist|clinic|law firm|attorney|towing|locksmith)\b", text, re.I):
        rep.warn(f"{name}: local-service content with no tel: link (CONVERSION_CRAFT §1)")


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    tier = "T2"
    for a in sys.argv[1:]:
        if a.startswith("--tier"):
            tier = a.split("=", 1)[1] if "=" in a else "T2"
    if "--tier" in sys.argv:
        i = sys.argv.index("--tier")
        if i + 1 < len(sys.argv):
            tier = sys.argv[i + 1]
    args = [a for a in args if a not in ("T0", "T1", "T2", "T3")]
    as_json = "--json" in sys.argv

    if not args:
        print(__doc__)
        return 1

    target = Path(args[0])
    if not target.exists():
        print(f"FAIL path not found: {target}")
        return 1

    files: list[Path] = []
    if target.is_file():
        files = [target]
    else:
        for ext in ("*.html", "*.htm", "*.css", "*.js", "*.jsx", "*.tsx"):
            files.extend(p for p in target.rglob(ext)
                         if "node_modules" not in p.parts and not p.name.endswith(".min.js"))

    if not files:
        print(f"FAIL no HTML/CSS/JS files found under {target}")
        return 1

    rep = Report()
    for f in files:
        try:
            audit(f.read_text(encoding="utf-8", errors="ignore"), f.name, rep, tier)
        except Exception as e:  # never let the gate crash the pipeline
            rep.warn(f"{f.name}: could not audit ({e})")

    if as_json:
        print(json.dumps({"tier": tier, "files": len(files), "blockers": rep.blockers,
                          "warnings": rep.warnings, "notes": rep.notes,
                          "status": "FAIL" if rep.blockers else "PASS"}, indent=2))
        return 1 if rep.blockers else 0

    print(f"audit_build — tier {tier}, {len(files)} file(s)\n")
    for n in rep.notes:
        print(f"  note  {n}")
    for w in rep.warnings:
        print(f"  WARN  {w}")
    for b in rep.blockers:
        print(f"  BLOCK {b}")
    print()
    if rep.blockers:
        print(f"FAIL — {len(rep.blockers)} blocker(s), {len(rep.warnings)} warning(s)")
        print("Blockers are hard disqualifiers (ANTI_SLOP_AND_QUALITY_GATES §3). Do not ship.")
        return 1
    print(f"PASS — 0 blockers, {len(rep.warnings)} warning(s)")
    if rep.warnings:
        print("Warnings are not automatic failures, but each needs a written decision.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
