#!/usr/bin/env python3
"""Lint the cinematic-website-director skill package.

The previous version checked whether words appeared in SKILL.md, which passes on any
document that mentions "TYPOGRAPHY" once. This validates structure, reference integrity,
craft coverage (actual numbers and code, not just prose), and internal contradictions.

Usage: python3 scripts/audit_skill.py [--verbose]
Exit 0 = pass, 1 = fail.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERBOSE = "--verbose" in sys.argv

REQUIRED = [
    "SKILL.md", "README.md",
    "modules/01-design-intelligence.md", "modules/02-taste-lock.md",
    "modules/03-typography-director.md", "modules/04-scroll-motion-director.md",
    "modules/05-frontend-production-director.md", "modules/06-quality-crucible.md",
    "modules/07-project-state.md",
    "references/TYPE_CRAFT.md", "references/MOTION_CRAFT.md",
    "references/COLOR_AND_SURFACE.md", "references/LAYOUT_AND_SPACE.md",
    "references/CONVERSION_CRAFT.md", "references/PERFORMANCE_BUDGETS.md",
    "references/EFFECT_LIBRARY.md", "references/ECOSYSTEM_HANDOFF.md",
    "references/ANTI_SLOP_AND_QUALITY_GATES.md",
    "templates/DESIGN_DNA.md", "templates/TYPOGRAPHY_SYSTEM.md",
    "templates/MOTION_MAP.md", "templates/BUILD_CONTRACT.md", "templates/QA_LEDGER.md",
    "qa/SKILL_GAUNTLET.md", "qa/BENCHMARK_SUITE.md",
    "scripts/audit_skill.py", "scripts/audit_build.py",
]

errors: list[str] = []
warnings: list[str] = []


def fail(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


# --- 1. required files -------------------------------------------------------
for rel in REQUIRED:
    if not (ROOT / rel).exists():
        fail(f"missing required file: {rel}")

if errors:
    print("\n".join("FAIL " + e for e in errors))
    sys.exit(1)

md_files = sorted(p for p in ROOT.rglob("*.md"))
text = {p: p.read_text(encoding="utf-8") for p in md_files}
skill = text[ROOT / "SKILL.md"]

# --- 2. frontmatter ----------------------------------------------------------
fm = re.match(r"^---\n(.*?)\n---\n", skill, re.S)
if not fm:
    fail("SKILL.md has no YAML frontmatter")
else:
    body = fm.group(1)
    name = re.search(r"^name:\s*(\S+)", body, re.M)
    desc = re.search(r"^description:\s*(.+)", body, re.M)
    if not name:
        fail("frontmatter missing `name`")
    elif not re.fullmatch(r"[a-z0-9-]+", name.group(1)):
        fail(f"skill name must be lowercase-hyphen: {name.group(1)}")
    if not desc:
        fail("frontmatter missing `description`")
    else:
        d = desc.group(1)
        if len(d) < 120:
            fail("description too short to trigger reliably (<120 chars)")
        if not re.search(r"\buse\s+(when|whenever)\b", d, re.I):
            fail("description lacks trigger language ('use when/whenever ...')")
    for legacy in ("display_name", "classification", "maintainer"):
        if re.search(rf"^{legacy}:", body, re.M):
            warn(f"non-standard top-level frontmatter key `{legacy}` — move under metadata:")

# --- 3. reference integrity --------------------------------------------------
# Any modules/... references/... templates/... qa/... scripts/... path mentioned
# anywhere in the package must exist.
path_re = re.compile(r"(?<![\w./-])((?:modules|references|templates|qa|scripts)/[A-Za-z0-9_.-]+\.(?:md|py))")
for p, t in text.items():
    for m in sorted(set(path_re.findall(t))):
        if not (ROOT / m).exists():
            fail(f"{p.relative_to(ROOT)}: broken reference -> {m}")

# --- 4. router completeness --------------------------------------------------
for rel in REQUIRED:
    if rel.startswith(("modules/", "references/")) and rel not in skill:
        fail(f"SKILL.md router does not route to {rel}")

# --- 5. tier routing (economics gate) ----------------------------------------
if not re.search(r"\bT0\b.*\bT1\b.*\bT2\b.*\bT3\b", skill, re.S):
    fail("SKILL.md has no tier router (T0-T3) — cost cannot match project value")
if "Tier Router" not in skill and "TIER ROUTER" not in skill:
    fail("SKILL.md missing an explicit tier router section")

# --- 6. craft coverage: real numbers and code, not prose ---------------------
craft_checks = {
    "references/TYPE_CRAFT.md": [
        (r"clamp\(\s*[\d.]+rem", "no real clamp() type-scale values"),
        (r"1\.(125|2|25|333|414|5|618)", "no modular scale ratios"),
        (r"-0\.0\d+em", "no tracking values"),
        (r"\b\d{2}ch\b", "no measure values in ch"),
        (r"@font-face", "no font-loading code"),
        (r"size-adjust|ascent-override", "no metric-matched fallback guidance"),
    ],
    "references/MOTION_CRAFT.md": [
        (r"cubic-bezier\(\s*[\d.]+", "no cubic-bezier easing values"),
        (r"\b\d{2,4}ms\b", "no duration values"),
        (r"ScrollTrigger", "no ScrollTrigger patterns"),
        (r"prefers-reduced-motion", "no reduced-motion pattern"),
        (r"stagger", "no stagger guidance"),
        (r"```js", "no runnable JS examples"),
    ],
    "references/COLOR_AND_SURFACE.md": [
        (r"\b[\d.]+:1\b", "no contrast ratios"),
        (r"--(bg|surface-1|text-primary)", "no token roles"),
        (r"```css", "no CSS examples"),
    ],
    "references/LAYOUT_AND_SPACE.md": [
        (r"--space-", "no spacing scale tokens"),
        (r"\b\d{2}ch\b", "no measure guidance"),
        (r"```css", "no CSS examples"),
    ],
    "references/PERFORMANCE_BUDGETS.md": [
        (r"LCP", "no LCP budget"), (r"CLS", "no CLS budget"), (r"INP", "no INP budget"),
        (r"\b\d+(?:\.\d+)?(?:KB|MB)\b", "no asset weight budgets"),
    ],
    "references/CONVERSION_CRAFT.md": [
        (r"44", "no touch-target sizing"),
        (r"tel:", "no tap-to-call guidance for local service"),
    ],
    "references/EFFECT_LIBRARY.md": [
        (r"\|\s*30\s*\|", "effect index does not cover all 30 builder modules"),
    ],
}
for rel, checks in craft_checks.items():
    t = text.get(ROOT / rel, "")
    for pattern, msg in checks:
        if not re.search(pattern, t):
            fail(f"{rel}: {msg}")

# --- 7. QA rigor: anchored scoring + deterministic gate ----------------------
gauntlet = text[ROOT / "qa/SKILL_GAUNTLET.md"]
if "Forced fail" not in gauntlet and "forced-fail" not in gauntlet.lower():
    fail("qa/SKILL_GAUNTLET.md has no forced-fail conditions — scores stay unfalsifiable")
if not re.search(r"\|\s*10\s*\|.*\n\|\s*9\s*\|", gauntlet):
    fail("qa/SKILL_GAUNTLET.md has no anchored score descriptors")
if "audit_build.py" not in text[ROOT / "modules/06-quality-crucible.md"]:
    fail("crucible does not invoke the deterministic build gate")

# --- 8. motion map completeness enforcement ---------------------------------
motion = text[ROOT / "modules/04-scroll-motion-director.md"]
for field in ("reduced_motion", "mobile", "fallback", "performance_risk"):
    if field not in motion:
        fail(f"motion map schema missing `{field}`")

# --- 9. accessibility floor must not scale with tier ------------------------
if not re.search(r"[Aa]ccessibility.*(does not|never).*(scale|drop)", skill + text[ROOT / "references/PERFORMANCE_BUDGETS.md"], re.S):
    warn("no explicit statement that accessibility does not degrade with tier")

# --- 10. contradiction sweep ------------------------------------------------
# The non-generic law forbids certain defaults; make sure no reference recommends them.
forbidden_recs = [
    (r"(?i)\buse\s+Inter\b(?!\s*Tight)", "recommends Inter directly"),
    (r"(?i)default\s+to\s+glassmorphism", "recommends glassmorphism as default"),
]
for p, t in text.items():
    if p.name in ("ANTI_SLOP_AND_QUALITY_GATES.md", "SKILL.md", "AUDIT_LOG.md"):
        continue
    for pattern, msg in forbidden_recs:
        if re.search(pattern, t):
            fail(f"{p.relative_to(ROOT)}: contradicts non-generic law — {msg}")

# --- 11. template usability -------------------------------------------------
for rel in [r for r in REQUIRED if r.startswith("templates/")]:
    t = text[ROOT / rel]
    if "- [ ]" not in t and "|" not in t:
        warn(f"{rel}: no checklist or table — template gives no shape to fill")

# --- report -----------------------------------------------------------------
if VERBOSE or warnings:
    for w in warnings:
        print(f"WARN {w}")
if errors:
    for e in errors:
        print(f"FAIL {e}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1)

print(f"PASS — {len(REQUIRED)} required files, {len(md_files)} markdown files, "
      f"0 errors, {len(warnings)} warning(s)")
sys.exit(0)
