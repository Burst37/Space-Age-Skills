#!/usr/bin/env python3
"""QA gate for multi-platform-cinematography-prompt-director prompts.

Checks the Detail Floor (SKILL.md) plus per-platform hard limits.
Usage:
  python3 lint_prompt.py --platform seedance-2.5 prompt.txt
  cat prompt.txt | python3 lint_prompt.py --platform midjourney-v8 -
Exit code 1 if any FAIL.
"""
import argparse
import re
import sys

# --- vocab -----------------------------------------------------------------

CAMERAS = [
    r"URSA Cine", r"ALEXA", r"AMIRA", r"V-?RAPTOR", r"KOMODO", r"MONSTRO", r"RED ONE", r"DSMC",
    r"VENICE", r"BURANO", r"RIALTO", r"\bFX[235679]0?\b", r"A7S", r"EOS C\d+", r"C700", r"VARICAM",
    r"LUMIX", r"PYXIS", r"Pocket Cinema", r"Phantom", r"V2640", r"Ronin 4D", r"GFX", r"Phase One",
    r"Hasselblad", r"Nikon Z[R89]", r"iPhone", r"IMAX", r"VistaVision", r"Millennium", r"ARRICAM",
    r"ARRIFLEX", r"Panaflex", r"Aaton", r"Bolex", r"Inspire 3", r"Mavic", r"Avata", r"Leica M11", r"Leica SL",
]
HOUSE_A = r"URSA Cine 17K|URSA_CINE_17K"
HOUSE_B = r"ALEXA LF|ALEXA_LF"
LENS_FOCAL = r"\b\d{1,3}(?:-\d{2,4})?\s?mm\b"
LENS_STOP = r"\bT\s?\d(?:\.\d)?\b|\bf/\d|_T\d"
FIXTURES = [
    r"SkyPanel", r"Orbiter", r"M18", r"M40", r"M90", r"HMI", r"Aputure", r"STORM", r"NOVA", r"Nova P",
    r"LS \d+", r"Nanlux", r"NANLUX", r"Matrix \d", r"Creamsource", r"Vortex", r"Kino Flo", r"Mimik",
    r"LiteMat", r"DMG", r"Astera", r"Titan", r"Quasar", r"INFINIBAR", r"Mole", r"Tweenie", r"Fresnel",
    r"Dedolight", r"Godox", r"Nanlite", r"Profoto", r"Broncolor", r"MegaPointe", r"Sharpy", r"Chimera",
    r"Condor", r"practical",
]
MODIFIERS = [
    r"diffusion", r"\b216\b", r"\b250\b", r"grid cloth", r"Ultrabounce", r"silk", r"frost", r"octabox",
    r"softbox", r"stripbox", r"bounce", r"negative fill", r"flag", r"floppy", r"egg-?crate", r"CTO", r"CTB",
    r"Pro-?Mist", r"book light", r"reflector", r"lightbank", r"Snapbag", r"scrim",
]
PLACEMENT = [
    r"camera (?:left|right)", r"\d{2,3}\s?°", r"overhead", r"backlight", r"\brim\b", r"kicker",
    r"from behind", r"above the lens", r"\d(?:\.\d)?\s?m (?:high|up|off)", r"top light",
]
DIRECTORS = [
    "Wes Anderson", "Nolan", "Villeneuve", "Fincher", "Spike Lee", "Cuar", "Gerwig", "Bong Joon", "Malick",
    "Michael Bay", "Ridley Scott", "Wong Kar", "Safdie", "del Toro", "Coogler", "Ari Aster", "Eggers",
    "Chlo", "Jordan Peele", "Paul Thomas Anderson", "Lanthimos", "Corbet", "Celine Song", "Kubrick",
    "Spielberg", "Scorsese", "Tarantino", "Hype Williams", "Kurosawa", "Ozu", "Lynch", "Barry Jenkins",
    "Park Chan", "Sofia Coppola", "Steve McQueen", "Refn", "Matsoukas", "Dave Meyers", "Spike Jonze",
    "Gondry", "Tarsem", "Zack Snyder", "Mann", "Glazer", "Iñárritu", "Inarritu", "Kosinski", "Gerwig",
]
DPS = [
    "Deakins", "van Hoytema", "Fraser", "Rachel Morrison", "Lubezki", "Khondji", "Laustsen", "Veloso",
    "Arkapaw", "Crawley", "Wegner", "Laxton", "Bauman", "Sandgren", "Robbie Ryan", "Bradford Young",
    "Claudio Miranda", "Storaro", "Doyle", "Willis", "Kaminski", "Prieto", "Chivo", "Sayombhu",
    "Mukdeeprom", "Braier", "Seamus McGarvey", "Janusz", "Bobbitt", "Zambarloukos", "Hurlbut",
]
META = [
    r"\b[A-Z][A-Za-z0-9]*(?:_[A-Za-z0-9.\-:/]+){1,}",          # raw underscore tokens
    r"\b[A-Z]{1,4}\d{3,}[A-Z0-9_]*\.(?:CR2|CR3|NEF|NRW|ARW|RAF|DNG|HEIC|R3D|braw|ari|mxf|MOV|3FR|IIQ)\b",
    r"\bIMG_\w+\.\w+", r"\bDSCF?_\w+\.\w+",
    r"ARRIRAW", r"Blackmagic RAW|\bBRAW\b", r"X-?OCN", r"ProRes", r"LogC\d", r"S-?Log3", r"Log3G10", r"IPP2",
    r"ACES ?2", r"Kodak (?:Vision ?3|AHU|Double-X|Ektachrome|2383)", r"Criterion", r"A24", r"stills archive",
    r"raw file", r"camera-original", r"contact proof", r"Dolby Vision", r"10-bit HDR", r"halation",
]
ATMOSPHERE = [r"haze", r"fog", r"rain", r"dust", r"steam", r"smoke", r"mist", r"snow", r"wind", r"embers",
              r"shimmer", r"drizzle", r"sand"]
MOVEMENT = [r"dolly", r"push", r"pull", r"track", r"truck", r"crane", r"jib", r"pan\b", r"tilt", r"orbit",
            r"\barc\b", r"handheld", r"Steadicam", r"gimbal", r"drone", r"FPV", r"locked", r"static", r"zoom",
            r"rack focus", r"Russian Arm", r"Bolt", r"Technocrane", r"Snorricam", r"pedestal", r"whip"]
IP_RISK = [r"disney \.com", r"dcstudios \.com", r"sonypictures \.com", r"the avengers", r"harley quinn"]

# --- platform table ----------------------------------------------------------

P = {
    # House video lineup
    "seedance-2.5":   dict(kind="video", max_s=30, img=30, total=50, mode="narrative", status="HOUSE"),
    "seedance-2.0":   dict(kind="video", max_s=15, img=9, total=12, mode="narrative", status="HOUSE"),
    "minimax-h3":     dict(kind="video", max_s=15, total=12, mode="narrative", status="HOUSE", no_brackets=True),
    "grok-imagine-1.5": dict(kind="video", max_s=15, mode="narrative", status="HOUSE", front_load=30, needs_audio=True,
                             words=(30, 60), motion_only=True),
    "gemini-omni-flash": dict(kind="video", max_s=10, img=3, mode="narrative", status="HOUSE"),
    # Stills
    "nano-banana-pro": dict(kind="image", mode="narrative", status="HOUSE"),
    "nano-banana-2":  dict(kind="image", mode="narrative", status="HOUSE"),
    "gpt-image-2.5":  dict(kind="image", mode="narrative", status="HOUSE"),
    "midjourney-v8":  dict(kind="image", mode="tokens", status="HOUSE", needs_ar=True),
    "flux-2":         dict(kind="image", mode="tokens", status="HOUSE", positive=True),
    "seedream-5":     dict(kind="image", mode="narrative", status="HOUSE"),
    # Outside the house video lineup (explicit request only)
    "veo-3.1":        dict(kind="video", max_s=8, img=3, mode="narrative", status="OUTSIDE"),
    "kling-4":        dict(kind="video", max_s=30, total=15, mode="narrative", status="ANNOUNCED"),
    "kling-3":        dict(kind="video", max_s=15, shots=6, mode="narrative", status="OUTSIDE"),
    "runway-gen-4.5": dict(kind="video", mode="narrative", status="OUTSIDE", positive=True),
    "luma-ray3":      dict(kind="video", mode="narrative", status="OUTSIDE"),
    "wan-3":          dict(kind="video", mode="tokens", status="OUTSIDE"),
    "happy-horse-1":  dict(kind="video", img=9, mode="narrative", status="OUTSIDE", max_chars=2500),
    "hailuo-02":      dict(kind="video", max_s=10, mode="narrative", status="OUTSIDE", brackets_max=3),
    "sora-2":         dict(kind="video", mode="narrative", status="SUNSET"),
}


def hits(patterns, text, flags=re.I):
    found = []
    for p in patterns:
        found += re.findall(p, text, flags)
    return found


def any_hit(patterns, text):
    return any(re.search(p, text, re.I) for p in patterns)


def lint(text, platform, min_words, image_to_video):
    cfg = P[platform]
    raw_text, text = text, text.replace("_", " ")
    out = []
    add = lambda lvl, msg: out.append((lvl, msg))

    # status
    st = cfg["status"]
    if st == "SUNSET":
        add("FAIL", f"{platform} is sunset — recompile for seedance-2.5 or gemini-omni-flash")
    elif st == "ANNOUNCED":
        add("WARN", f"{platform} is announced, not GA, and outside the house lineup — specs provisional")
    elif st == "OUTSIDE":
        add("WARN", f"{platform} is outside the house video lineup — use only if the user named it")

    # detail floor
    words = len(re.findall(r"\b[\w'’./-]+\b", raw_text))
    if cfg.get("words"):
        lo, hi = cfg["words"]
        add("PASS" if lo <= words <= hi else "FAIL",
            f"word count {words} ({platform} guidance: {lo}–{hi}; the Detail Floor lives in the start frame)")
    else:
        add("PASS" if words >= min_words else "FAIL", f"word count {words} (floor {min_words})")
    if cfg.get("motion_only"):
        add("PASS", "camera, lens, lighting rig, director/DP, meta tokens: carried by the start frame")

    look = not image_to_video and not cfg.get("motion_only")
    if look:
        add("PASS" if any_hit(CAMERAS, text) else "FAIL", "camera body named")
    a, b = re.search(HOUSE_A, text, re.I), re.search(HOUSE_B, text, re.I)
    multishot = len(set(re.findall(r"Shot\s?(\d+)", text))) >= 2
    if a and b and not multishot:
        add("WARN", "both House cameras in one single-shot prompt — one camera per shot")
    elif not (a or b) and look:
        add("WARN", "House Package not used — state the override reason in the shot rationale")

    if look:
        add("PASS" if re.search(LENS_FOCAL, text) else "FAIL", "lens focal length")
        add("PASS" if re.search(LENS_STOP, text) else "WARN", "lens T-stop / aperture")
    if not cfg.get("motion_only"):
        add("PASS" if any_hit(FIXTURES, text) else "FAIL", "named lighting fixture / motivated source")
        if image_to_video:
            add("PASS", "light modifier (carried by the start frame)")
        else:
            add("PASS" if any_hit(MODIFIERS, text) else "WARN", "light modifier")
        add("PASS" if any_hit(PLACEMENT, text) else "WARN", "light placement / direction")

        d, p = any_hit(DIRECTORS, text), any_hit(DPS, text)
        if d and p:
            add("PASS", "director + DP influence")
        else:
            add("FAIL" if not (d or p) else "WARN", f"director {'✓' if d else '✗'} / DP {'✓' if p else '✗'}")

    meta = {m.strip().lower() for m in hits(META[:4], raw_text, 0) + hits(META[4:], text)}
    n = len(meta)
    if image_to_video or cfg.get("motion_only"):
        add("PASS", f"meta tokens ~{n} (look carried by the start frame)")
    else:
        add("PASS" if n >= 3 else "WARN", f"meta tokens ~{n} (want 3–5)")
    if not cfg.get("motion_only"):
        add("PASS" if any_hit(ATMOSPHERE, text) else "WARN", "atmosphere / environment conditions")

    if cfg["kind"] == "video":
        add("PASS" if any_hit(MOVEMENT, text) else "FAIL", "camera movement (or explicit locked-off)")

    # platform limits
    ends = [float(m[1]) for m in re.findall(r"(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)\s*s(?:ec(?:onds?)?)?\b", text)]
    if ends and cfg.get("max_s"):
        mx = max(ends)
        add("PASS" if mx <= cfg["max_s"] else "FAIL", f"timeline {mx:g}s (max {cfg['max_s']}s)")
    imgs = set(re.findall(r"@Image\s?(\d+)|Image\s(\d+)\s?[:=]|<IMAGE REF (\d+)>", text))
    img_n = len({x for tup in imgs for x in tup if x})
    refs_n = img_n + len(set(re.findall(r"@(?:Video|Audio)\s?\d+", text)))
    if cfg.get("img") and img_n > cfg["img"]:
        add("FAIL", f"{img_n} image refs (max {cfg['img']})")
    if cfg.get("total") and refs_n > cfg["total"]:
        add("FAIL", f"{refs_n} total refs (max {cfg['total']})")
    shots = len(set(re.findall(r"Shot\s?(\d+)", text)))
    if cfg.get("shots") and shots > cfg["shots"]:
        add("FAIL", f"{shots} shots (max {cfg['shots']})")
    brackets = re.findall(r"\[(?:Push|Pull|Pan|Tilt|Truck|Pedestal|Zoom|Shake|Tracking|Static)[^\]]*\]", text, re.I)
    if cfg.get("no_brackets") and brackets:
        add("FAIL", f"bracket camera commands degrade {platform}: {brackets[:3]}")
    if cfg.get("brackets_max") and len(brackets) > cfg["brackets_max"]:
        add("WARN", f"{len(brackets)} bracket commands (≤{cfg['brackets_max']} combined recommended)")
    if cfg.get("positive") and re.search(r"\b(no|not|without|don't|never|avoid)\b", text, re.I):
        add("WARN", f"negations found — {platform} prefers positive phrasing")
    if cfg.get("front_load"):
        first = re.split(r"(?<=[.!?])\s|\n", raw_text.strip(), maxsplit=1)[0]
        fw = len(re.findall(r"\b[\w'’-]+\b", first))
        ok = fw <= cfg["front_load"] and any_hit(MOVEMENT, first.replace("_", " "))
        add("PASS" if ok else "WARN", f"first sentence {fw} words (≤{cfg['front_load']}, must name the camera move)")
    if cfg.get("needs_audio") and not re.search(r"audio|sound|sfx|dialogue|ambience|ambient|music|\"", text, re.I):
        add("WARN", "no audio named — Grok returns silent clips without an audio cue")
    if cfg.get("needs_ar") and "--ar" not in text:
        add("WARN", "no --ar parameter")
    if cfg.get("max_chars") and len(raw_text) > cfg["max_chars"]:
        add("FAIL", f"{len(text)} chars (max {cfg['max_chars']})")
    if cfg["mode"] == "narrative":
        raw = re.findall(r"\b[A-Z][A-Za-z0-9]*_[A-Za-z0-9_.\-]+", raw_text)
        if len(raw) >= 2:
            add("WARN", f"{len(raw)} raw tokens on a narrative model — translate to prose (DB §12): {raw[:3]}")
    if any_hit(IP_RISK, text):
        add("WARN", "IP-risk studio archive token — never in client deliverables")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--platform", required=True, choices=sorted(P))
    ap.add_argument("--min-words", type=int, default=150)
    ap.add_argument("--i2v", action="store_true", help="image-to-video: skip look checks the start frame carries")
    ap.add_argument("file", help="prompt file, or - for stdin")
    a = ap.parse_args()
    text = sys.stdin.read() if a.file == "-" else open(a.file, encoding="utf-8").read()
    res = lint(text, a.platform, a.min_words, a.i2v)
    for lvl, msg in res:
        print(f"{lvl:4}  {msg}")
    fails = sum(l == "FAIL" for l, _ in res)
    warns = sum(l == "WARN" for l, _ in res)
    print(f"\n{'FAIL' if fails else 'PASS'} — {fails} fail, {warns} warn [{a.platform}]")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
