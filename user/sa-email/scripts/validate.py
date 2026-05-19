#!/usr/bin/env python3
"""
SA-EMAIL: Standalone email QC validator.
Audit an existing HTML email and return a scored QC report.

Usage:
    python3 validate.py path/to/email.html
    python3 validate.py path/to/email.html --json
"""

import argparse
import json
import re
import sys
from pathlib import Path


SPAM_WORDS = [
    "free", "guaranteed", "no risk", "act now", "limited time offer",
    "winner", "you have been selected", "urgent", "click here",
    "make money", "work from home", "extra income", "this is not spam",
    "congratulations", "dear friend", "order now",
    "special promotion", "while supplies last",
]

WEAK_CTA = ["click here", "click", "learn more", "read more", "more info"]

CAN_SPAM_REQUIRED = ["unsubscribe", "opt-out", "opt out"]


def extract_text(html: str) -> str:
    return re.sub(r"<[^>]+>", " ", html).lower()


def check_subject(html: str) -> tuple[str | None, int]:
    match = re.search(r"<title[^>]*>([^<]+)</title>", html, re.IGNORECASE)
    return (match.group(1).strip() if match else None, 0)


def audit_html(html: str, subject_override: str | None = None) -> dict:
    score = 0
    passed = []
    failed = []
    warnings = []
    text = extract_text(html)

    # Table layout
    if re.search(r"<table", html, re.IGNORECASE):
        score += 15
        passed.append("Table-based layout detected")
    else:
        failed.append("No <table> layout — email clients require table-based HTML")

    # Width constraint
    if re.search(r'width=["\']?600', html) or "max-width: 600" in html or "max-width:600" in html:
        score += 5
        passed.append("Width constrained to 600px")
    else:
        warnings.append("No 600px width constraint found")

    # Inline CSS (no external stylesheets)
    if "<link rel" in html.lower() and "stylesheet" in html.lower():
        failed.append("External stylesheet detected — inline all CSS for email clients")
    else:
        score += 5
        passed.append("No external stylesheets (inline CSS preferred)")

    # Images: alt attributes
    img_tags = re.findall(r"<img[^>]+>", html, re.IGNORECASE)
    imgs_missing_alt = [t for t in img_tags if "alt=" not in t.lower()]
    if imgs_missing_alt:
        warnings.append(f"{len(imgs_missing_alt)} image(s) missing alt attribute")
    elif img_tags:
        score += 5
        passed.append(f"All {len(img_tags)} images have alt attributes")

    # JavaScript
    if re.search(r"<script", html, re.IGNORECASE):
        failed.append("CRITICAL: JavaScript detected — must be removed")
    else:
        score += 10
        passed.append("No JavaScript")

    # Unsubscribe link (CAN-SPAM)
    if any(w in text for w in CAN_SPAM_REQUIRED):
        score += 15
        passed.append("Unsubscribe mechanism present (CAN-SPAM)")
    else:
        failed.append("CRITICAL: No unsubscribe link — CAN-SPAM violation")

    # Physical address (CAN-SPAM)
    address_patterns = [r"\d+.{1,50}street|ave|blvd|road|drive|ln|suite", r"[A-Z]{2}\s+\d{5}"]
    has_address = any(re.search(p, text, re.IGNORECASE) for p in address_patterns)
    if has_address or "physical address" in text or "[physical" in html.lower():
        score += 10
        passed.append("Physical address present (CAN-SPAM)")
    else:
        failed.append("CRITICAL: No physical mailing address — CAN-SPAM violation")

    # CTA buttons
    buttons = re.findall(r"<a[^>]+href[^>]+>[^<]+</a>", html, re.IGNORECASE)
    if buttons:
        score += 5
        passed.append(f"{len(buttons)} link(s)/CTA(s) found")
        weak_ctas = [b for b in buttons if any(w in b.lower() for w in WEAK_CTA)]
        if weak_ctas:
            warnings.append(f"Weak CTA text detected in {len(weak_ctas)} link(s): use action-specific verbs")
    else:
        warnings.append("No CTA links found")

    # Personalization tokens
    if re.search(r"\{\{?\s*first_name|\{first_name", html):
        score += 10
        passed.append("Personalization token found")
    else:
        warnings.append("No personalization token (first_name) — consider adding")

    # Spam words
    spam_hits = [w for w in SPAM_WORDS if w in text]
    if spam_hits:
        warnings.append(f"Potential spam trigger words: {', '.join(spam_hits[:5])}")
    else:
        score += 10
        passed.append("No common spam trigger words detected")

    # Responsive media query
    if "@media" in html and ("max-width" in html or "min-width" in html):
        score += 5
        passed.append("Responsive media query present")
    else:
        warnings.append("No responsive media query — mobile experience may suffer")

    # Plain text version check (not applicable for single file, just note)
    warnings.append("Reminder: Always send with a plain-text fallback version")

    # Subject from <title>
    title, _ = check_subject(html)
    if subject_override:
        title = subject_override
    if title:
        if 30 <= len(title) <= 60:
            score += 10
            passed.append(f"Subject/title length OK: {len(title)} chars")
        else:
            warnings.append(f"Subject/title length {len(title)} chars — target 30–60")
    else:
        warnings.append("No <title> tag found — add subject line as title")

    score = min(score, 100)

    return {
        "score": score,
        "passed": passed,
        "failed": failed,
        "warnings": warnings,
        "grade": "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 65 else "F",
    }


def print_report(result: dict, filename: str):
    print(f"\n{'='*55}")
    print(f"SA-EMAIL QC REPORT — {filename}")
    print(f"Score: {result['score']}/100  |  Grade: {result['grade']}")
    print(f"{'='*55}")
    if result["passed"]:
        print("\nPASSED:")
        for item in result["passed"]:
            print(f"  ✅ {item}")
    if result["failed"]:
        print("\nFAILED (must fix before sending):")
        for item in result["failed"]:
            print(f"  ❌ {item}")
    if result["warnings"]:
        print("\nWARNINGS:")
        for item in result["warnings"]:
            print(f"  ⚠️  {item}")
    print()
    if result["score"] >= 80:
        print("VERDICT: PASS — Ready for review. Fix warnings if time permits.")
    else:
        print(f"VERDICT: FAIL — Score {result['score']}/100. Fix all FAILED items before sending.")
    print()


def main():
    parser = argparse.ArgumentParser(description="SA-EMAIL QC Validator")
    parser.add_argument("html_file", help="Path to HTML email file")
    parser.add_argument("--subject", default=None, help="Override subject line for scoring")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of human report")
    args = parser.parse_args()

    html_path = Path(args.html_file)
    if not html_path.exists():
        print(f"Error: File not found: {args.html_file}", file=sys.stderr)
        sys.exit(1)

    html = html_path.read_text(encoding="utf-8")
    result = audit_html(html, subject_override=args.subject)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print_report(result, html_path.name)

    sys.exit(0 if result["score"] >= 80 else 1)


if __name__ == "__main__":
    main()
