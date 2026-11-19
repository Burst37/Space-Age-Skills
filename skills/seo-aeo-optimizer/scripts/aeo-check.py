#!/usr/bin/env python3
"""AEO readiness check for ONE public URL (stdlib; optional headless Chrome for the JS test).
Usage:  python3 aeo-check.py https://example.com/page [--json out.json] [--no-render] [--ua-test]
Checks: robots.txt rules for AI retrieval + training bots, llms.txt/llms-full.txt, JSON-LD (entity types, sameAs),
        raw-HTML vs rendered-text ratio (is content visible without JS?), answer blocks (question H2/H3 + 25-80 word answers),
        FAQ/lists/tables, stats, freshness + author signals. Prints an automated sub-score out of 60
        (the other 40 points of the 100-pt AEO scorecard are manual, see references/aeo-frontier.md).
Public pages only. --ua-test sends requests with AI-bot user agents: use on sites you own/manage only.
"""
import argparse, gzip, json, re, shutil, subprocess, sys, time, urllib.parse, urllib.request, urllib.error
from html.parser import HTMLParser
from urllib.robotparser import RobotFileParser

UA = "AEOCheck/1.0 (+readiness audit; public pages only)"
RETRIEVAL = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User",
             "Googlebot", "Bingbot", "Applebot"]
TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent", "Bytespider"]
QSTART = re.compile(r"^(who|what|when|where|why|how|which|can|could|do|does|did|is|are|should|will|am|why|how much|how long|how many)\b", re.I)

def fetch(url, ua=UA, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": ua, "Accept-Encoding": "gzip", "Accept": "text/html,*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        d = r.read()
        if d[:2] == b"\x1f\x8b": d = gzip.decompress(d)
        return r.status, dict(r.headers), d.decode(r.headers.get_content_charset() or "utf-8", "replace")

class Blocks(HTMLParser):
    """Collect visible text, headings, paragraphs after headings, lists, tables, ld+json, details."""
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.skip = 0; s.text = []; s.ld = []; s.in_ld = False; s.ldbuf = ""; s.cur = None; s.buf = ""
        s.blocks = []  # (tag, text)
        s.lists = 0; s.tables = 0; s.details = 0; s.meta = {}; s.time_tags = []; s.rel_author = False
        s.scripts = 0; s.script_bytes = 0; s.root_empty = False; s.title = ""; s.in_title = False; s.imgs = 0; s.imgs_alt = 0
    def handle_starttag(s, t, a):
        a = dict(a)
        if t == "title": s.in_title = True
        elif t == "meta":
            k = (a.get("name") or a.get("property") or "").lower()
            if k: s.meta[k] = a.get("content", "")
        elif t == "script":
            if (a.get("type") or "").lower() == "application/ld+json": s.in_ld = True; s.ldbuf = ""
            else: s.skip += 1; s.scripts += 1
        elif t in ("style", "noscript", "svg", "template"): s.skip += 1
        elif t in ("h1", "h2", "h3", "p", "li", "td", "th", "summary", "blockquote"): s.cur = t; s.buf = ""
        elif t in ("ul", "ol"): s.lists += 1
        elif t == "table": s.tables += 1
        elif t == "details": s.details += 1
        elif t == "time": s.time_tags.append(a.get("datetime", ""))
        elif t == "a" and "author" in (a.get("rel") or ""): s.rel_author = True
        elif t == "img":
            s.imgs += 1
            if (a.get("alt") or "").strip(): s.imgs_alt += 1
        elif t == "div" and a.get("id") in ("root", "app", "__next", "__nuxt") : s.root_id = a.get("id")
    def handle_endtag(s, t):
        if t == "title": s.in_title = False
        elif t == "script":
            if s.in_ld: s.in_ld = False; s.ld.append(s.ldbuf)
            elif s.skip: s.skip -= 1
        elif t in ("style", "noscript", "svg", "template") and s.skip: s.skip -= 1
        elif s.cur and t == s.cur:
            x = re.sub(r"\s+", " ", s.buf).strip()
            if x: s.blocks.append((t, x))
            s.cur = None
    def handle_data(s, d):
        if s.in_title: s.title += d
        if s.in_ld: s.ldbuf += d; return
        if s.skip: s.script_bytes += len(d); return
        if s.cur: s.buf += d
        s.text.append(d)

def words(txt): return len(re.findall(r"\b[\w'’%$.-]+\b", txt))

def parse(html):
    p = Blocks(); p.feed(html)
    text = re.sub(r"\s+", " ", " ".join(p.text)).strip()
    return p, text

def ld_info(blobs):
    types, same, names = set(), [], set(); bad = 0; faq = 0
    def walk(o):
        nonlocal faq
        if isinstance(o, dict):
            t = o.get("@type")
            if t: [types.add(x) for x in (t if isinstance(t, list) else [t])]
            if t == "Question": faq += 1
            if "sameAs" in o: same.extend(o["sameAs"] if isinstance(o["sameAs"], list) else [o["sameAs"]])
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    for b in blobs:
        try: walk(json.loads(b))
        except Exception: bad += 1
    return sorted(types), same, bad, faq

def robots_report(root):
    out = {"found": False, "rules": {}, "sitemaps": [], "raw_has_ai_section": False}
    txt = ""; out["fetch"] = "ok"
    for attempt in range(3):
        try: _, _, txt = fetch(root + "/robots.txt", timeout=25); break
        except urllib.error.HTTPError as e: out["fetch"] = f"HTTP {e.code}"; break   # 404 = no robots.txt = everything allowed
        except Exception as e: out["fetch"] = "FAILED: " + str(e)[:60]; time.sleep(2)
    if txt: out["found"] = True
    rp = RobotFileParser(); rp.parse(txt.splitlines())
    out["sitemaps"] = [l.split(":", 1)[1].strip() for l in txt.splitlines() if l.lower().startswith("sitemap:")]
    out["raw_has_ai_section"] = bool(re.search(r"gptbot|oai-searchbot|claude|perplexity|google-extended|ccbot", txt, re.I))
    for b in RETRIEVAL + TRAINING:
        out["rules"][b] = ("allowed" if rp.can_fetch(b, root + "/") else "BLOCKED") if txt else ("UNKNOWN (robots fetch failed, re-run)" if out["fetch"].startswith("FAILED") else "no robots.txt (allowed)")
    return out

def head_status(url):
    try:
        s, h, body = fetch(url); return {"status": s, "bytes": len(body), "starts": body[:80].replace("\n", " ")}
    except urllib.error.HTTPError as e: return {"status": e.code}
    except Exception as e: return {"status": "error", "err": str(e)[:60]}

def rendered_text(url, timeout=45):
    chrome = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
    if not chrome: return None, "no headless Chrome found (install Chrome/Playwright for the JS test)"
    try:
        r = subprocess.run([chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=8000",
                            "--dump-dom", url], capture_output=True, text=True, timeout=timeout)
        return r.stdout, None if r.stdout else (r.stderr[-120:] or "empty DOM")
    except Exception as e: return None, str(e)[:100]

def answer_blocks(blocks):
    q = 0; good = 0; ans = []
    for i, (t, x) in enumerate(blocks):
        if t in ("h2", "h3") and (x.rstrip().endswith("?") or QSTART.match(x)):
            q += 1
            for t2, x2 in blocks[i + 1:i + 4]:
                if t2 == "p":
                    n = words(x2); ans.append(n)
                    if 25 <= n <= 80: good += 1
                    break
    return q, good, ans

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("url"); ap.add_argument("--json"); ap.add_argument("--no-render", action="store_true")
    ap.add_argument("--ua-test", action="store_true", help="fetch with AI-bot UAs (own sites only)")
    a = ap.parse_args()
    url = a.url if a.url.startswith("http") else "https://" + a.url
    pu = urllib.parse.urlparse(url); root = f"{pu.scheme}://{pu.netloc}"
    R = {"url": url, "checked": time.strftime("%Y-%m-%d %H:%M")}
    st, hd, html = fetch(url); R["status"] = st
    p, raw_text = parse(html); raw_words = words(raw_text)
    R["robots"] = robots_report(root)
    time.sleep(1); R["llms_txt"] = head_status(root + "/llms.txt")
    time.sleep(1); R["llms_full_txt"] = head_status(root + "/llms-full.txt")
    types, same, bad, faqq = ld_info(p.ld)
    R["schema"] = {"types": types, "sameAs_count": len(same), "jsonld_errors": bad, "faq_questions": faqq}
    # JS visibility
    rendered_words = None; note = None
    if not a.no_render:
        dom, note = rendered_text(url)
        if dom:
            rp, rt = parse(dom); rendered_words = words(rt)
    ratio = round(raw_words / rendered_words, 2) if rendered_words else None
    R["js_visibility"] = {"raw_html_words": raw_words, "rendered_words": rendered_words, "raw_to_rendered": ratio,
                          "script_tags": p.scripts, "note": note,
                          "empty_shell_warning": (ratio is not None and ratio < 0.6) or (rendered_words is None and raw_words < 120) or raw_words < 30}
    q, good, ans = answer_blocks(p.blocks)
    body = " ".join(x for _, x in p.blocks)
    stats = len(re.findall(r"\b\d[\d,.]*\s?(%|percent|years|jobs|reviews|\+|x\b)|\$\s?\d", body))
    first100 = " ".join(raw_text.split()[:100])
    pub = bool(p.time_tags) or bool(re.search(r"(updated|published|last reviewed)[:\s]+\w+", raw_text, re.I)) \
        or bool(re.search(r'"date(Published|Modified)"', " ".join(p.ld)))
    author = p.rel_author or bool(re.search(r"\bby\s+[A-Z][a-z]+\s+[A-Z][a-z]+|\"author\"", raw_text + " ".join(p.ld)))
    R["answer_structure"] = {"h1": [x for t, x in p.blocks if t == "h1"][:2],
                             "h2_h3_count": sum(1 for t, _ in p.blocks if t in ("h2", "h3")),
                             "question_headings": q, "answers_25_80_words": good, "answer_word_counts": ans[:15],
                             "lists": p.lists, "tables": p.tables, "details_accordions": p.details,
                             "stat_like_facts": stats, "has_date_signal": pub, "has_author_signal": author,
                             "meta_description": bool(p.meta.get("description")), "title": p.title.strip()[:90],
                             "first_100_words_sample": first100[:200]}
    if a.ua_test:
        R["ua_test"] = {}
        for ua in ("OAI-SearchBot/1.4", "PerplexityBot/1.0", "ClaudeBot/1.0", "GPTBot/1.4"):
            try:
                time.sleep(1); s, _, b = fetch(url, ua=f"Mozilla/5.0 (compatible; {ua})"); R["ua_test"][ua] = {"status": s, "bytes": len(b)}
            except urllib.error.HTTPError as e: R["ua_test"][ua] = {"status": e.code}
            except Exception as e: R["ua_test"][ua] = {"status": "error"}
    # ---- automated score (60) ----
    S = {}; rules = R["robots"]["rules"]
    ret_ok = [b for b in ("OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Googlebot", "Bingbot") if not rules[b].startswith("BLOCKED")]
    S["crawler_access (0-15)"] = round(15 * len(ret_ok) / 5)
    js = R["js_visibility"]
    S["content_in_raw_html (0-15)"] = 0 if js["empty_shell_warning"] else (15 if (ratio is None and raw_words >= 300) or (ratio and ratio >= 0.9) else 8)
    ents = {"Organization", "LocalBusiness", "Person", "WebSite"} | {t for t in types if t.endswith("Business") or t in ("Plumber", "Dentist", "Attorney", "HVACBusiness", "Electrician", "RoofingContractor", "MedicalBusiness", "DaySpa", "LegalService", "Store")}
    has_ent = any(t in ents for t in types)
    S["entity_schema (0-10)"] = (4 if has_ent else 0) + (3 if len(same) >= 3 else (1 if same else 0)) + (3 if any(t in types for t in ("Service", "Product", "Article", "FAQPage", "BreadcrumbList")) and not bad else 0)
    S["answer_blocks (0-12)"] = min(12, (4 if q >= 3 else (2 if q >= 1 else 0)) + (4 if good >= 3 else (2 if good >= 1 else 0)) + (2 if p.lists or p.tables else 0) + (2 if stats >= 3 else 0))
    S["freshness_authorship (0-8)"] = (4 if pub else 0) + (4 if author else 0)
    R["automated_score_of_60"] = sum(S.values()); R["score_detail"] = S
    fl = []
    if js["empty_shell_warning"]: fl.append("Content missing from raw HTML: AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not run JS. Server-render it.")
    for b in ("OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Bingbot", "Googlebot"):
        if rules[b].startswith("BLOCKED"): fl.append(f"{b} is blocked in robots.txt (retrieval bot): lose AI search visibility.")
    if R["robots"]["fetch"].startswith("FAILED"): fl.append("robots.txt fetch failed: robots results are UNKNOWN, re-run.")
    if not has_ent: fl.append("No Organization/LocalBusiness JSON-LD found.")
    if has_ent and len(same) < 3: fl.append("Add sameAs links (GBP, LinkedIn, Facebook, Yelp, industry directories).")
    if q == 0: fl.append("No question-shaped H2/H3 found.")
    elif good == 0: fl.append("Question headings exist but none is followed by a 25-80 word direct answer paragraph.")
    if not pub: fl.append("No visible published/updated date.")
    if not author: fl.append("No author/credential signal.")
    if R["llms_txt"].get("status") != 200: fl.append("No llms.txt (optional, low priority; no proven AI-search effect).")
    R["flags"] = fl
    if a.json: json.dump(R, open(a.json, "w"), indent=2)
    print(f"AEO check: {url}\n  robots: " + ", ".join(f"{b}={rules[b].split()[0].lower()}" for b in RETRIEVAL[:6]) +
          "\n  training: " + ", ".join(f"{b}={rules[b].split()[0].lower()}" for b in TRAINING[:4]) +
          f"\n  llms.txt={R['llms_txt'].get('status')} llms-full.txt={R['llms_full_txt'].get('status')}"
          f"\n  schema types={types} sameAs={len(same)}"
          f"\n  raw words={raw_words} rendered words={rendered_words} ratio={ratio} {('('+note+')') if note else ''}"
          f"\n  question headings={q} answers(25-80w)={good} lists={p.lists} tables={p.tables} stats={stats} date={pub} author={author}"
          f"\n  AUTOMATED SCORE {R['automated_score_of_60']}/60  {S}")
    for f in fl: print("  FLAG:", f)
    return R

if __name__ == "__main__":
    main()
