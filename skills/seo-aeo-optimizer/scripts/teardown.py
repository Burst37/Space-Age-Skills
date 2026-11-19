#!/usr/bin/env python3
"""Competitor teardown: public pages only, robots.txt respected, rate limited.
Usage:
  python3 teardown.py https://a.com https://b.com/ https://c.com --out out/hvac-stl
  python3 teardown.py --file urls.txt --extra 5 --psi --out out/x
Env: PSI_KEY (optional PageSpeed API key; the API also works without one at low quota).
Outputs: <out>.json and <out>.md. Stdlib only (Python 3.8+).
Ethics: analyze structure and patterns. Never copy text, images or branding.
"""
import argparse, json, os, re, sys, time, gzip, urllib.request, urllib.parse, urllib.error
from html.parser import HTMLParser
from urllib.robotparser import RobotFileParser

UA = "TeardownBot/1.0 (+competitor structure audit; public pages only)"
TRUST = ["licensed", "insured", "bonded", "bbb", "guarantee", "warranty", "award", "certified",
         "years in business", "since 19", "since 20", "family owned", "family-owned", "5-star",
         "5 star", "reviews", "nate", "epa", "a+ rating", "accredited", "board certified"]
CTA = ["call now", "call us", "get a quote", "free estimate", "book now", "book online",
       "schedule", "request", "contact us", "get started", "free consultation"]

def fetch(url, timeout=20, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip",
                                               "Accept": "text/html,application/xml,*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
        if r.headers.get("Content-Encoding") == "gzip" or data[:2] == b"\x1f\x8b":
            data = gzip.decompress(data)
        return r.status, dict(r.headers), data if binary else data.decode(r.headers.get_content_charset() or "utf-8", "replace")

class P(HTMLParser):
    def __init__(s, base):
        super().__init__(convert_charrefs=True)
        s.base = base; s.title = ""; s.meta = {}; s.h = {"h1": [], "h2": [], "h3": []}
        s.links = []; s.ldjson = []; s.text = []; s.cur = None; s.skip = 0
        s.in_title = False; s.in_ld = False; s.ld = ""; s.canon = None; s.forms = 0; s.imgs = 0; s.imgs_noalt = 0; s.buf = ""
    def handle_starttag(s, t, a):
        a = dict(a)
        if t == "title": s.in_title = True
        elif t == "meta":
            k = (a.get("name") or a.get("property") or "").lower()
            if k: s.meta[k] = a.get("content", "")
        elif t == "link" and (a.get("rel") or "").lower() == "canonical": s.canon = a.get("href")
        elif t == "script":
            if (a.get("type") or "").lower() == "application/ld+json": s.in_ld = True; s.ld = ""
            else: s.skip += 1
        elif t in ("style", "noscript", "svg"): s.skip += 1
        elif t in s.h: s.cur = t; s.buf = ""
        elif t == "a" and a.get("href"): s.links.append((urllib.parse.urljoin(s.base, a["href"]), ""))
        elif t == "form": s.forms += 1
        elif t == "img":
            s.imgs += 1
            if not (a.get("alt") or "").strip(): s.imgs_noalt += 1
    def handle_endtag(s, t):
        if t == "title": s.in_title = False
        elif t == "script":
            if s.in_ld: s.in_ld = False; s.ldjson.append(s.ld)
            elif s.skip: s.skip -= 1
        elif t in ("style", "noscript", "svg") and s.skip: s.skip -= 1
        elif s.cur and t == s.cur:
            s.h[t].append(re.sub(r"\s+", " ", s.buf).strip()); s.cur = None
    def handle_data(s, d):
        if s.in_title: s.title += d
        if s.in_ld: s.ld += d; return
        if s.skip: return
        if s.cur: s.buf += d
        s.text.append(d)

def schema_types(blobs):
    types, faq_q = [], 0
    def walk(o):
        nonlocal faq_q
        if isinstance(o, dict):
            t = o.get("@type")
            if t: types.extend(t if isinstance(t, list) else [t])
            if t == "Question": faq_q += 1
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    bad = 0
    for b in blobs:
        try: walk(json.loads(b))
        except Exception: bad += 1
    return sorted(set(types)), faq_q, bad

def analyze(url, html):
    p = P(url); p.feed(html)
    text = re.sub(r"\s+", " ", " ".join(p.text)).strip()
    low = text.lower()
    host = urllib.parse.urlparse(url).netloc.replace("www.", "")
    internal, external = set(), set()
    for h, _ in p.links:
        pu = urllib.parse.urlparse(h)
        if pu.scheme not in ("http", "https"): continue
        h = h.split("#")[0]
        (internal if pu.netloc.replace("www.", "") == host else external).add(h)
    types, faq_q, bad = schema_types(p.ldjson)
    heads = " ".join(sum(p.h.values(), [])).lower()
    return {
        "url": url, "title": p.title.strip(), "title_len": len(p.title.strip()),
        "meta_description": p.meta.get("description", ""), "canonical": p.canon,
        "robots_meta": p.meta.get("robots"), "h1": p.h["h1"], "h2": p.h["h2"][:25], "h3": p.h["h3"][:25],
        "word_count": len(text.split()), "schema_types": types, "faq_schema_questions": faq_q,
        "jsonld_blocks": len(p.ldjson), "jsonld_parse_errors": bad,
        "internal_links": len(internal), "external_links": len(external),
        "internal_sample": sorted(internal)[:60],
        "tel_links": len([h for h, _ in p.links if h.startswith("tel:")]),
        "forms": p.forms, "images": p.imgs, "images_missing_alt": p.imgs_noalt,
        "faq_in_headings": bool(re.search(r"faq|frequently asked|questions", heads)),
        "trust_hits": sorted({k for k in TRUST if k in low}),
        "cta_hits": sorted({k for k in CTA if k in low}),
        "og_image": bool(p.meta.get("og:image")),
        "date_modified": next((m for m in re.findall(r'"dateModified"\s*:\s*"([^"]+)"', " ".join(p.ldjson))), None),
    }

def sitemap_info(base, rp, delay):
    out = {"found": False, "url_count": 0, "silos": {}, "lastmod_newest": None, "lastmod_30d": 0, "sample": []}
    root = f"{urllib.parse.urlparse(base).scheme}://{urllib.parse.urlparse(base).netloc}"
    cands = []
    try:
        for line in rp_text(root).splitlines():
            if line.lower().startswith("sitemap:"): cands.append(line.split(":", 1)[1].strip())
    except Exception: pass
    cands += [root + "/sitemap.xml", root + "/sitemap_index.xml", root + "/wp-sitemap.xml"]
    seen, urls, lastmods, queue = set(), [], [], list(dict.fromkeys(cands))
    while queue and len(seen) < 12:
        sm = queue.pop(0)
        if sm in seen or not rp.can_fetch(UA, sm): continue
        seen.add(sm); time.sleep(delay)
        try: _, _, body = fetch(sm)
        except Exception: continue
        if "<urlset" in body or "<sitemapindex" in body: out["found"] = True
        if "<sitemapindex" in body:
            queue += re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body)
        else:
            for blk in re.findall(r"<url>(.*?)</url>", body, re.S):
                m = re.search(r"<loc>\s*([^<\s]+)\s*</loc>", blk)
                if m: urls.append(m.group(1))
                lm = re.search(r"<lastmod>\s*([^<\s]+)\s*</lastmod>", blk)
                if lm: lastmods.append(lm.group(1)[:10])
    out["url_count"] = len(urls)
    for u in urls:
        seg = [s for s in urllib.parse.urlparse(u).path.split("/") if s]
        k = "/" + seg[0] if len(seg) > 1 else "(top-level)"
        out["silos"][k] = out["silos"].get(k, 0) + 1
    out["silos"] = dict(sorted(out["silos"].items(), key=lambda x: -x[1])[:15])
    if lastmods:
        out["lastmod_newest"] = max(lastmods)
        cutoff = time.strftime("%Y-%m-%d", time.gmtime(time.time() - 30 * 86400))
        out["lastmod_30d"] = sum(1 for d in lastmods if d >= cutoff)
    out["sample"] = urls[:200]
    return out

_rt = {}
def rp_text(root):
    if root not in _rt:
        try: _rt[root] = fetch(root + "/robots.txt")[2]
        except Exception: _rt[root] = ""
    return _rt[root]

def psi(url, key, strategy="mobile"):
    q = {"url": url, "strategy": strategy, "category": "performance"}
    if key: q["key"] = key
    api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + urllib.parse.urlencode(q)
    body = None
    for attempt in range(2):
        try: _, _, body = fetch(api, timeout=90); break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt == 0: time.sleep(10); continue
            return {"error": f"HTTP {e.code} (shared keyless quota exhausted; set PSI_KEY, free from Google Cloud, or run pagespeed.web.dev by hand)"}
        except Exception as e: return {"error": str(e)[:120]}
    j = json.loads(body); lh = j.get("lighthouseResult", {}); a = lh.get("audits", {})
    f = j.get("loadingExperience", {}).get("metrics", {})
    g = lambda k: (f.get(k) or {}).get("percentile")
    return {"strategy": strategy,
            "perf_score": round((lh.get("categories", {}).get("performance", {}).get("score") or 0) * 100),
            "lab_lcp_s": round((a.get("largest-contentful-paint", {}).get("numericValue") or 0) / 1000, 2),
            "lab_cls": round(a.get("cumulative-layout-shift", {}).get("numericValue") or 0, 3),
            "lab_tbt_ms": round(a.get("total-blocking-time", {}).get("numericValue") or 0),
            "field_lcp_ms": g("LARGEST_CONTENTFUL_PAINT_MS"), "field_inp_ms": g("INTERACTION_TO_NEXT_PAINT"),
            "field_cls_x100": g("CUMULATIVE_LAYOUT_SHIFT_SCORE"),
            "field_overall": j.get("loadingExperience", {}).get("overall_category")}

def pattern_pages(urls):
    pats = {"service": r"service|repair|install|replace|cleaning|treatment|removal",
            "location": r"location|service-area|areas?-we-serve|city|-mo\b|-il\b|near-me|neighborhood",
            "blog": r"blog|news|article|guide|resources"}
    return {k: sum(1 for u in urls if re.search(v, u, re.I)) for k, v in pats.items()}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("urls", nargs="*"); ap.add_argument("--file"); ap.add_argument("--out", default="teardown")
    ap.add_argument("--delay", type=float, default=2.0, help="seconds between requests per run")
    ap.add_argument("--extra", type=int, default=0, help="also analyze N sample pages from each sitemap (service/location)")
    ap.add_argument("--psi", action="store_true", help="add PageSpeed Insights (mobile)")
    ap.add_argument("--no-sitemap", action="store_true")
    ap.add_argument("--aeo", action="store_true", help="add AEO pass per site via aeo-check.py (robots AI bots, JS visibility, answer blocks, schema/sameAs)")
    a = ap.parse_args()
    urls = list(a.urls)
    if a.file: urls += [l.strip() for l in open(a.file) if l.strip() and not l.startswith("#")]
    if not urls: ap.error("give at least one URL")
    key = os.environ.get("PSI_KEY"); res = []
    for u in urls:
        if not u.startswith("http"): u = "https://" + u
        root = "{0.scheme}://{0.netloc}".format(urllib.parse.urlparse(u))
        rp = RobotFileParser(); rp.parse(rp_text(root).splitlines())
        r = {"input": u}
        if not rp.can_fetch(UA, u):
            r["skipped"] = "blocked by robots.txt"; res.append(r); print("SKIP", u, "(robots.txt)"); continue
        try:
            time.sleep(a.delay); st, hd, html = fetch(u)
            r.update(analyze(u, html)); r["status"] = st; r["last_modified_header"] = hd.get("Last-Modified")
            r["server"] = hd.get("Server")
        except Exception as e:
            r["error"] = str(e)[:150]; res.append(r); print("ERR", u, r["error"]); continue
        crawl_delay = rp.crawl_delay(UA)
        if crawl_delay: a.delay = max(a.delay, float(crawl_delay))
        if not a.no_sitemap:
            r["sitemap"] = sitemap_info(u, rp, a.delay)
            r["sitemap"]["pattern_counts"] = pattern_pages(r["sitemap"]["sample"])
        if a.extra and r.get("sitemap", {}).get("sample"):
            pick = [x for x in r["sitemap"]["sample"] if re.search(r"service|repair|install|location|area|[a-z]+-[a-z]{2}\b", x, re.I)][: a.extra]
            r["extra_pages"] = []
            for x in pick:
                if not rp.can_fetch(UA, x): continue
                try:
                    time.sleep(a.delay); _, _, h2 = fetch(x); d = analyze(x, h2)
                    for k in ("internal_sample", "h3", "meta_description"): d.pop(k, None)
                    r["extra_pages"].append(d)
                except Exception as e: r["extra_pages"].append({"url": x, "error": str(e)[:100]})
        if a.psi:
            time.sleep(a.delay); r["pagespeed"] = psi(u, key)
        if a.aeo:
            try:
                import importlib.util, io, contextlib
                sp = importlib.util.spec_from_file_location("aeo_check", os.path.join(os.path.dirname(os.path.abspath(__file__)), "aeo-check.py"))
                m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
                sys.argv = ["aeo-check", u]
                with contextlib.redirect_stdout(io.StringIO()): r["aeo"] = m.main()
            except Exception as e: r["aeo"] = {"error": str(e)[:150]}
        res.append(r); print("OK ", u)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    json.dump({"generated": time.strftime("%Y-%m-%d %H:%M"), "results": res}, open(a.out + ".json", "w"), indent=2)
    L = ["# Teardown output (auto)", "", "| Metric | " + " | ".join(urllib.parse.urlparse(r['input']).netloc for r in res) + " |",
         "|---|" + "---|" * len(res)]
    def row(name, fn): L.append(f"| {name} | " + " | ".join(str(fn(r)) if not r.get("skipped") and not r.get("error") else "n/a" for r in res) + " |")
    row("Title", lambda r: r["title"][:70]); row("Title length", lambda r: r["title_len"])
    row("Meta description length", lambda r: len(r["meta_description"]))
    row("H1", lambda r: "; ".join(r["h1"])[:70]); row("H2 count", lambda r: len(r["h2"]))
    row("Words (home)", lambda r: r["word_count"]); row("Schema types", lambda r: ", ".join(r["schema_types"]) or "none")
    row("FAQ (schema Qs / heading)", lambda r: f'{r["faq_schema_questions"]} / {r["faq_in_headings"]}')
    row("Internal / external links", lambda r: f'{r["internal_links"]} / {r["external_links"]}')
    row("tel: links / forms", lambda r: f'{r["tel_links"]} / {r["forms"]}')
    row("Images missing alt", lambda r: f'{r["images_missing_alt"]}/{r["images"]}')
    row("Trust signals", lambda r: ", ".join(r["trust_hits"]) or "none"); row("CTA phrases", lambda r: ", ".join(r["cta_hits"]) or "none")
    row("Sitemap URLs", lambda r: r.get("sitemap", {}).get("url_count", "n/a"))
    row("Sitemap newest lastmod / updated in 30d", lambda r: f'{r.get("sitemap", {}).get("lastmod_newest")} / {r.get("sitemap", {}).get("lastmod_30d")}')
    row("Sitemap silos (top)", lambda r: ", ".join(f"{k}:{v}" for k, v in list(r.get("sitemap", {}).get("silos", {}).items())[:4]))
    row("Page patterns svc/loc/blog", lambda r: "/".join(str(r.get("sitemap", {}).get("pattern_counts", {}).get(k, 0)) for k in ("service", "location", "blog")))
    if a.psi:
        row("PSI mobile score", lambda r: r.get("pagespeed", {}).get("perf_score", r.get("pagespeed", {}).get("error")))
        row("Lab LCP s / CLS / TBT ms", lambda r: f'{r.get("pagespeed", {}).get("lab_lcp_s")} / {r.get("pagespeed", {}).get("lab_cls")} / {r.get("pagespeed", {}).get("lab_tbt_ms")}')
        row("Field LCP ms / INP ms (CrUX)", lambda r: f'{r.get("pagespeed", {}).get("field_lcp_ms")} / {r.get("pagespeed", {}).get("field_inp_ms")}')
    if a.aeo:
        L += ["", "## AEO pass (auto)", "", "| Metric | " + " | ".join(urllib.parse.urlparse(r['input']).netloc for r in res) + " |", "|---|" + "---|" * len(res)]
        row("AEO automated score /60", lambda r: r["aeo"].get("automated_score_of_60", r["aeo"].get("error")))
        row("Retrieval bots blocked", lambda r: ", ".join(b for b, v in r["aeo"]["robots"]["rules"].items() if v.startswith("BLOCKED")) or "none")
        row("Raw vs rendered words", lambda r: f'{r["aeo"]["js_visibility"]["raw_html_words"]} / {r["aeo"]["js_visibility"]["rendered_words"]}')
        row("Question H2/H3 / 25-80w answers", lambda r: f'{r["aeo"]["answer_structure"]["question_headings"]} / {r["aeo"]["answer_structure"]["answers_25_80_words"]}')
        row("Entity schema types", lambda r: ", ".join(r["aeo"]["schema"]["types"]) or "none"); row("sameAs links", lambda r: r["aeo"]["schema"]["sameAs_count"])
        row("llms.txt", lambda r: r["aeo"]["llms_txt"].get("status"))
        L.append("Manual AEO pass: ask each engine the fixed prompt set, log who is cited and why (see references/aeo-frontier.md section 9).")
    L += ["", "Not automated (do by hand, see SKILL.md Step 1/2): GBP category, rating, review count, photos; map-pack ranks; AI-engine citations; backlinks.",
          "Use for structure and patterns only. Never copy text, images, or branding."]
    open(a.out + ".md", "w").write("\n".join(L) + "\n")
    print("wrote", a.out + ".json", a.out + ".md")

if __name__ == "__main__":
    main()
