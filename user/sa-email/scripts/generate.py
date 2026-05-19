#!/usr/bin/env python3
"""
SA-EMAIL: Email generation script.
Runs the full pipeline: brand load → copy generation → HTML build → QC → export.

Usage:
    python3 generate.py --intent CAMPAIGN --segment lapsed --brand-url https://example.com
    python3 generate.py --intent DRIP_SEQUENCE --count 5 --segment new-subscribers
    python3 generate.py --intent AUDIT --input path/to/email.html
"""

import argparse
import json
import os
import sys
import re
from datetime import datetime
from pathlib import Path


SPAM_WORDS = [
    "free", "guaranteed", "no risk", "act now", "limited time",
    "winner", "you have been selected", "urgent", "click here",
    "make money", "work from home", "extra income", "this is not spam",
    "congratulations", "dear friend", "increase your", "order now",
    "special promotion", "while supplies last",
]

WEAK_CTA_WORDS = ["click here", "click", "here", "learn more", "read more"]


def load_brand_tokens(brand_path: str | None, brand_url: str | None) -> dict:
    """Load BTP from DESIGN.md, local file, or return generic fallback."""
    if brand_path and Path(brand_path).exists():
        content = Path(brand_path).read_text()
        return parse_btp(content)
    for candidate in ["./DESIGN.md", "~/DESIGN.md", "./brand.md"]:
        p = Path(candidate).expanduser()
        if p.exists():
            return parse_btp(p.read_text())
    # Generic fallback
    return {
        "brand_name": "[BRAND]",
        "tone_primary": "professional",
        "tone_secondary": "warm",
        "voice_examples": ["We're here to help.", "Let's make it happen."],
        "forbidden_words": [],
        "cta_style": "imperative",
        "greeting_style": "Hi {first_name}",
        "sign_off": "The Team",
        "_warning": "No brand tokens loaded — using generic fallback. Run brand-extractor first.",
    }


def parse_btp(content: str) -> dict:
    """Extract key brand tokens from a BTP or DESIGN.md."""
    tokens = {}
    tone_match = re.search(r"Tone[:\s]+([^\n]+)", content, re.IGNORECASE)
    if tone_match:
        tones = [t.strip() for t in tone_match.group(1).split(",")]
        tokens["tone_primary"] = tones[0] if tones else "professional"
        tokens["tone_secondary"] = tones[1] if len(tones) > 1 else "warm"
    name_match = re.search(r"(?:Brand|Name)[:\s]+([^\n]+)", content, re.IGNORECASE)
    tokens["brand_name"] = name_match.group(1).strip() if name_match else "[BRAND]"
    tokens["greeting_style"] = "Hi {first_name}"
    tokens["sign_off"] = f"The {tokens['brand_name']} Team"
    tokens["cta_style"] = "imperative"
    tokens["voice_examples"] = []
    tokens["forbidden_words"] = []
    return tokens


def get_segment_profile(segment: str) -> dict:
    profiles = {
        "high_value_active": {
            "label": "High-Value Active",
            "posture": "VIP treatment, loyalty reward, early access language",
            "urgency": "low",
            "personalization_depth": "high",
        },
        "engaged_non_buyer": {
            "label": "Engaged Non-Buyer",
            "posture": "Social proof, objection handling, soft CTA",
            "urgency": "low",
            "personalization_depth": "medium",
        },
        "new_subscriber": {
            "label": "New Subscriber",
            "posture": "Welcome warmth, brand story, low-pressure CTA",
            "urgency": "none",
            "personalization_depth": "low",
        },
        "lapsed_customer": {
            "label": "Lapsed Customer (90+ days)",
            "posture": "Warm nostalgia, not desperate. No discount in email 1.",
            "urgency": "medium",
            "personalization_depth": "high",
        },
        "cold_lead": {
            "label": "Cold Lead",
            "posture": "Pattern interrupt, value-first, curiosity hook",
            "urgency": "low",
            "personalization_depth": "low",
        },
        "general": {
            "label": "General Audience",
            "posture": "Balanced tone, clear value prop, single CTA",
            "urgency": "medium",
            "personalization_depth": "medium",
        },
    }
    key = segment.lower().replace("-", "_").replace(" ", "_")
    return profiles.get(key, profiles["general"])


def build_subject_prompt(brand: dict, segment: dict, goal: str) -> str:
    return f"""You are a world-class email copywriter for {brand['brand_name']}.

Brand tone: {brand.get('tone_primary', 'professional')}, {brand.get('tone_secondary', 'warm')}
Audience: {segment['label']} — {segment['posture']}
Email goal: {goal}

Write 3 subject line variants:
- Variant A: Curiosity-driven (hint at value without revealing all)
- Variant B: Benefit-driven (specific outcome for the reader)
- Variant C: Urgency/emotion-driven (if urgency is '{segment['urgency']}')

Rules:
- 30–50 characters each (hard max 60)
- No ALL CAPS
- No more than one emoji per line
- Do NOT repeat words across variants
- Forbidden words: {', '.join(brand.get('forbidden_words', []))}

Also write preview text (40–90 chars) for Variant A that extends — never repeats — the subject.

Respond in JSON only:
{{
  "subjects": [
    {{"variant": "A", "text": "", "type": "curiosity"}},
    {{"variant": "B", "text": "", "type": "benefit"}},
    {{"variant": "C", "text": "", "type": "urgency"}}
  ],
  "preview_text": ""
}}"""


def build_copy_prompt(brand: dict, segment: dict, goal: str, subject: str) -> str:
    return f"""You are a world-class email copywriter for {brand['brand_name']}.

Brand tone: {brand.get('tone_primary', 'professional')}, {brand.get('tone_secondary', 'warm')}
Voice examples: {'; '.join(brand.get('voice_examples', []))}
Audience: {segment['label']} — {segment['posture']}
Email goal: {goal}
Subject line: {subject}
Greeting style: {brand.get('greeting_style', 'Hi {{first_name}}')}
Sign-off: {brand.get('sign_off', 'The Team')}
CTA style: {brand.get('cta_style', 'imperative')}

Write email body copy. Rules:
- Open with personalization token in first sentence
- Single primary CTA
- No weak CTA words (click here, learn more, read more)
- No hollow phrases (as a valued customer, just checking in, don't miss out)
- Include a P.S. line (high-read zone)
- Forbidden words: {', '.join(brand.get('forbidden_words', []))}

Respond in JSON only:
{{
  "greeting": "",
  "headline": "",
  "body_opening": "",
  "body_core": "",
  "body_close": "",
  "cta_text": "",
  "sign_off": "",
  "ps_line": ""
}}"""


def render_html_email(brand: dict, copy: dict, subject: dict) -> str:
    """Render production-ready email-safe HTML (table-based, inline CSS)."""
    brand_name = brand.get("brand_name", "[BRAND]")
    primary_color = brand.get("color_primary", "#000000")
    bg_color = brand.get("color_bg", "#ffffff")
    text_color = brand.get("color_text", "#333333")
    font_family = brand.get("font_body", "Arial, Helvetica, sans-serif")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{subject.get('text', brand_name + ' Email')}</title>
  <style type="text/css">
    body, table, td, a {{ -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
    table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
    img {{ -ms-interpolation-mode: bicubic; border: 0; height: auto; outline: none; text-decoration: none; }}
    @media only screen and (max-width: 600px) {{
      .email-container {{ width: 100% !important; }}
      .email-col {{ width: 100% !important; display: block !important; }}
      .hide-mobile {{ display: none !important; }}
      .btn {{ width: 90% !important; text-align: center !important; }}
      .pad-mobile {{ padding: 20px !important; }}
    }}
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: {font_family};">

<!-- Email wrapper -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
  <tr>
    <td align="center" style="padding: 20px 10px;">

      <!-- Email container -->
      <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="600"
             style="background-color: {bg_color}; border-radius: 8px; overflow: hidden;">

        <!-- LAYER 2: HEADER -->
        <tr>
          <td align="center" style="background-color: {primary_color}; padding: 24px 40px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <!-- Replace src with actual logo URL -->
                  <img src="[LOGO_URL]" alt="{brand_name}" width="150" height="auto"
                       style="display: block; max-width: 150px;">
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LAYER 3: HERO -->
        <tr>
          <td style="padding: 40px 40px 20px 40px;">
            <h1 style="margin: 0 0 12px 0; font-family: {font_family}; font-size: 28px;
                       font-weight: 700; line-height: 36px; color: {text_color};
                       letter-spacing: -0.5px;">
              {copy.get('headline', '[HEADLINE]')}
            </h1>
          </td>
        </tr>

        <!-- LAYER 4: BODY -->
        <tr>
          <td style="padding: 0 40px 32px 40px;">
            <p style="margin: 0 0 16px 0; font-family: {font_family}; font-size: 16px;
                      line-height: 26px; color: {text_color};">
              {copy.get('greeting', 'Hi {{{{ first_name|default:\"Friend\" }}}}')},
            </p>
            <p style="margin: 0 0 16px 0; font-family: {font_family}; font-size: 16px;
                      line-height: 26px; color: {text_color};">
              {copy.get('body_opening', '[BODY OPENING]')}
            </p>
            <p style="margin: 0 0 16px 0; font-family: {font_family}; font-size: 16px;
                      line-height: 26px; color: {text_color};">
              {copy.get('body_core', '[BODY CORE]')}
            </p>
            <p style="margin: 0 0 32px 0; font-family: {font_family}; font-size: 16px;
                      line-height: 26px; color: {text_color};">
              {copy.get('body_close', '[BODY CLOSE]')}
            </p>

            <!-- LAYER 5: CTA BUTTON -->
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius: 6px; background-color: {primary_color};">
                  <a href="[CTA_URL]" class="btn"
                     style="display: inline-block; padding: 16px 32px;
                            font-family: {font_family}; font-size: 16px; font-weight: 700;
                            color: #ffffff; text-decoration: none; border-radius: 6px;
                            mso-padding-alt: 0; text-align: center;">
                    {copy.get('cta_text', 'Get Started')}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LAYER 6: SIGN-OFF + PS -->
        <tr>
          <td style="padding: 0 40px 32px 40px; border-top: 1px solid #eeeeee;">
            <p style="margin: 24px 0 8px 0; font-family: {font_family}; font-size: 15px;
                      line-height: 24px; color: {text_color};">
              {copy.get('sign_off', 'Best,')}<br>
              The {brand_name} Team
            </p>
            <p style="margin: 16px 0 0 0; font-family: {font_family}; font-size: 14px;
                      line-height: 22px; color: #666666; font-style: italic;">
              <strong>P.S.</strong> {copy.get('ps_line', '')}
            </p>
          </td>
        </tr>

        <!-- LAYER 7: LEGAL FOOTER -->
        <tr>
          <td style="background-color: #f9f9f9; padding: 24px 40px;
                     border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-family: {font_family}; font-size: 12px;
                      line-height: 18px; color: #999999; text-align: center;">
              You're receiving this because you subscribed to {brand_name} emails.
              <br>
              <a href="[UNSUBSCRIBE_URL]" style="color: #999999; text-decoration: underline;">Unsubscribe</a>
              &nbsp;|&nbsp;
              <a href="[VIEW_BROWSER_URL]" style="color: #999999; text-decoration: underline;">View in browser</a>
              <br><br>
              {brand_name} &mdash; [Physical Address Line 1], [City, State ZIP]
            </p>
          </td>
        </tr>

      </table>
      <!-- End email container -->

    </td>
  </tr>
</table>
<!-- End email wrapper -->

</body>
</html>"""


def render_plain_text(brand: dict, copy: dict, subject: dict) -> str:
    brand_name = brand.get("brand_name", "[BRAND]")
    return f"""Subject: {subject.get('text', '')}

{copy.get('greeting', 'Hi {{first_name}}')},

{copy.get('body_opening', '')}

{copy.get('body_core', '')}

{copy.get('body_close', '')}

{copy.get('cta_text', 'Get Started')} → [CTA_URL]

{copy.get('sign_off', 'Best,')}
The {brand_name} Team

P.S. {copy.get('ps_line', '')}

---
You're receiving this because you subscribed to {brand_name} emails.
Unsubscribe: [UNSUBSCRIBE_URL]
{brand_name} — [Physical Address Line 1], [City, State ZIP]
"""


def qc_validate(html: str, copy: dict, subjects: list) -> dict:
    """Run QC checklist and return score + flags."""
    score = 0
    passed = []
    failed = []
    warnings = []

    # Subject line checks
    if subjects:
        s = subjects[0].get("text", "")
        if 30 <= len(s) <= 60:
            score += 10
            passed.append(f"Subject length: {len(s)} chars")
        else:
            failed.append(f"Subject length {len(s)} chars — target 30–60")

        if s == s.upper() and len(s) > 3:
            failed.append("Subject is ALL CAPS")
        else:
            score += 5
            passed.append("Subject case: OK")

        if len(subjects) >= 3:
            score += 5
            passed.append("3 subject variants provided")
        else:
            failed.append("Need 3 subject line variants")

    # Preview text
    preview = copy.get("preview_text", "")
    if preview and len(preview) >= 40:
        score += 10
        passed.append("Preview text present")
    else:
        failed.append("Preview text missing or too short (target 40–90 chars)")

    # Personalization token
    body = copy.get("body_opening", "") + copy.get("body_core", "")
    if "{first_name}" in body or "{{first_name" in body or "{{ first_name" in body:
        score += 10
        passed.append("Personalization token found in body")
    else:
        warnings.append("No personalization token in body copy — add {{first_name}} or {{{{ first_name }}}}")

    # Single CTA check
    cta_count = html.lower().count("href=\"[cta_url]\"")
    if cta_count == 1:
        score += 10
        passed.append("Single primary CTA")
    elif cta_count > 1:
        warnings.append(f"{cta_count} CTA links found — recommend single primary CTA")
    else:
        failed.append("No CTA URL placeholder found")

    # CTA text quality
    cta_text = copy.get("cta_text", "").lower()
    if any(w in cta_text for w in WEAK_CTA_WORDS):
        failed.append(f"Weak CTA text: '{copy.get('cta_text')}' — make it action-specific")
    else:
        score += 5
        passed.append("CTA text is action-specific")

    # Spam words
    full_copy = " ".join([copy.get(k, "") for k in ["body_opening", "body_core", "body_close"]]).lower()
    spam_hits = [w for w in SPAM_WORDS if w in full_copy]
    if spam_hits:
        warnings.append(f"Potential spam trigger words: {spam_hits}")
    else:
        score += 10
        passed.append("No spam trigger words detected")

    # Technical checks
    if "<table" in html:
        score += 10
        passed.append("Table-based layout confirmed")
    else:
        failed.append("No table-based layout detected — required for email clients")

    if "alt=" in html:
        score += 5
        passed.append("Images have alt attributes")
    else:
        warnings.append("Images missing alt attributes")

    if "[UNSUBSCRIBE_URL]" in html or "unsubscribe" in html.lower():
        score += 10
        passed.append("Unsubscribe link present")
    else:
        failed.append("CRITICAL: No unsubscribe link — CAN-SPAM violation")

    if "Physical Address" in html or "[Physical Address" in html:
        score += 5
        passed.append("Physical address placeholder present")
    else:
        failed.append("CRITICAL: No physical address — CAN-SPAM violation")

    if 'width="600"' in html or "width: 600px" in html or "max-width: 600" in html:
        score += 5
        passed.append("Max width ≤ 600px")
    else:
        warnings.append("Email width not constrained to 600px")

    if "<script" not in html.lower():
        score += 5
        passed.append("No JavaScript present")
    else:
        failed.append("CRITICAL: JavaScript detected — remove immediately")

    return {
        "score": min(score, 100),
        "passed": passed,
        "failed": failed,
        "warnings": warnings,
    }


def print_qc_report(qc: dict, email_name: str):
    print(f"\n{'='*50}")
    print(f"QC REPORT — {email_name}")
    print(f"Score: {qc['score']}/100")
    print(f"{'='*50}")
    if qc["passed"]:
        print("\nPASSED:")
        for item in qc["passed"]:
            print(f"  ✅ {item}")
    if qc["failed"]:
        print("\nFAILED:")
        for item in qc["failed"]:
            print(f"  ❌ {item}")
    if qc["warnings"]:
        print("\nWARNINGS:")
        for item in qc["warnings"]:
            print(f"  ⚠️  {item}")
    if qc["score"] >= 80:
        print("\nSA RECOMMENDATION: Ready for review. Fill [PLACEHOLDER] values before sending.")
    else:
        print(f"\nSA RECOMMENDATION: Score {qc['score']}/100 — fix FAILED items before sending.")
    print()


def main():
    parser = argparse.ArgumentParser(description="SA-EMAIL generator")
    parser.add_argument("--intent", default="CAMPAIGN",
                        choices=["CAMPAIGN", "DRIP_SEQUENCE", "RE_ENGAGEMENT",
                                 "PROMOTIONAL", "TRANSACTIONAL", "AUDIT"])
    parser.add_argument("--segment", default="general")
    parser.add_argument("--brand-url", default=None)
    parser.add_argument("--brand-path", default=None)
    parser.add_argument("--goal", default="Drive email engagement and conversions")
    parser.add_argument("--out-dir", default="./email-output")
    parser.add_argument("--input", default=None, help="Existing HTML to audit")
    parser.add_argument("--count", type=int, default=1, help="Emails in sequence")
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    brand = load_brand_tokens(args.brand_path, args.brand_url)
    if "_warning" in brand:
        print(f"\n⚠️  {brand['_warning']}\n")

    segment = get_segment_profile(args.segment)
    date_str = datetime.now().strftime("%Y%m%d")
    campaign_name = f"{args.intent.lower()}_{args.segment}_{date_str}"

    # Stub copy for script-only mode (Claude fills this in context)
    copy = {
        "greeting": brand.get("greeting_style", "Hi {first_name}"),
        "headline": f"[HEADLINE — {segment['label']}]",
        "body_opening": f"[OPENING — {segment['posture']}]",
        "body_core": "[CORE VALUE / OFFER / STORY]",
        "body_close": "[CLOSE — lead into CTA]",
        "cta_text": "[CTA_TEXT]",
        "sign_off": "Warmly,",
        "ps_line": "[P.S. — bonus value or urgency reinforcement]",
        "preview_text": "[Preview text — extends subject, 40-90 chars]",
    }

    subjects = [
        {"variant": "A", "text": "[Subject A — curiosity]", "type": "curiosity"},
        {"variant": "B", "text": "[Subject B — benefit]", "type": "benefit"},
        {"variant": "C", "text": "[Subject C — urgency/emotion]", "type": "urgency"},
    ]

    html = render_html_email(brand, copy, subjects[0])
    plain = render_plain_text(brand, copy, subjects[0])
    qc = qc_validate(html, copy, subjects)

    # Write HTML
    html_path = out_dir / f"{campaign_name}.html"
    html_path.write_text(html)

    # Write plain text
    txt_path = out_dir / f"{campaign_name}.txt"
    txt_path.write_text(plain)

    # Write campaign JSON
    campaign_json = {
        "campaign_name": campaign_name,
        "intent_mode": args.intent,
        "segment": args.segment,
        "segment_profile": segment,
        "brand": brand.get("brand_name"),
        "goal": args.goal,
        "subject_lines": subjects,
        "preview_text": copy.get("preview_text"),
        "headline": copy.get("headline"),
        "cta_text": copy.get("cta_text"),
        "cta_url": "[CTA_URL]",
        "personalization_fields": ["{first_name}"],
        "qc_score": qc["score"],
        "qc_flags": qc["failed"] + qc["warnings"],
        "platform": "klaviyo",
        "created": datetime.now().isoformat(),
    }
    json_path = out_dir / f"{campaign_name}.json"
    json_path.write_text(json.dumps(campaign_json, indent=2))

    print_qc_report(qc, campaign_name)
    print(f"Output files:")
    print(f"  HTML:  {html_path}")
    print(f"  Text:  {txt_path}")
    print(f"  JSON:  {json_path}")
    print()
    print("Next step: Fill [PLACEHOLDER] values in HTML before uploading to Klaviyo.")
    print("Klaviyo variable syntax: {{ first_name|default:'Friend' }}")


if __name__ == "__main__":
    main()
