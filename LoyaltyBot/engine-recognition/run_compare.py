"""
run_compare.py — drive OLD vs NEW recognition engines against all fixtures and
print a per-fixture delta. Headless Chromium via the prebuilt browser.
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import old_engine as OLD
import recognition as NEW  # the module the production bot imports

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

PROFILE = {
    "first_name": "Jordan", "last_name": "Rivera",
    "email": "jordan.rivera@example.com", "email_confirm": "jordan.rivera@example.com",
    "password": "Str0ngP@ssw0rd!", "password_confirm": "Str0ngP@ssw0rd!",
    "phone": "3145550142", "username": "jrivera",
    "zip": "63101", "address": "123 Main St", "city": "St. Louis",
    "state": "Missouri", "full_name": "Jordan Rivera",
    "birthday": "1986-11-12",  # bot's fill_map key for date of birth
}
# old engine field-key -> logical key it fills (old uses "birthday" not dob)
OLD_KEYS = ["first_name", "last_name", "email", "password", "phone",
            "zip", "address", "city", "state", "username", "full_name"]


async def run_old(page):
    """What the OLD engine recognizes+fills, plus its detect gate."""
    detect = await OLD.detect_form_fields(page)
    filled = set()
    seen = set()
    for k in OLD_KEYS:
        if k in PROFILE:
            try:
                if await OLD.fill_field(page, k, PROFILE[k], seen):
                    filled.add(k)
            except Exception:
                pass
    return detect, filled


async def run_new(page):
    scan = await NEW.scan_page(page)
    verdict, payload = NEW.classify_page(scan)
    if verdict == "skip":
        return "skip:" + payload, set()
    filled = await NEW.smart_fill(page, PROFILE, payload)
    return "fillable", filled


async def main():
    manifest = json.load(open(os.path.join(HERE, "fixtures/manifest.json")))
    rows = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME, headless=True)
        for name in sorted(manifest):
            spec = manifest[name]
            expected = set(spec["expected"])
            # derive path relative to this file so the harness is portable
            spec = dict(spec, path=os.path.join(HERE, "fixtures", "forms", name + ".html"))

            # OLD
            ctx = await browser.new_context()
            page = await ctx.new_page()
            await page.goto("file://" + spec["path"])
            await page.wait_for_timeout(150)
            old_detect, old_filled = await run_old(page)
            await ctx.close()

            # NEW
            ctx = await browser.new_context()
            page = await ctx.new_page()
            await page.goto("file://" + spec["path"])
            await page.wait_for_timeout(150)
            new_verdict, new_filled = await run_new(page)
            await ctx.close()

            rows.append((name, expected, old_detect, old_filled, new_verdict, new_filled))
        await browser.close()

    def score(expected, filled, is_junk, verdict=None):
        if is_junk:
            # success = correctly skipped
            return "SKIP-OK" if (verdict and verdict.startswith("skip")) else "MISSED-SKIP"
        return f"{len(expected & filled)}/{len(expected)}"

    print("\n" + "=" * 92)
    print(f"{'fixture':<20} {'expected':>4} | OLD detect fill  result  | NEW verdict          fill  result")
    print("=" * 92)
    old_pass = new_pass = fillable_total = 0
    for name, expected, od, of, nv, nf in rows:
        is_junk = len(expected) == 0
        old_r = score(expected, of, is_junk, "skip" if od == 0 else None)
        new_r = score(expected, nf, is_junk, nv)
        if is_junk:
            old_ok = od == 0            # old only "skips" by finding no fields
            new_ok = nv.startswith("skip")
        else:
            fillable_total += 1
            old_ok = expected <= of and (od >= 2 or len(expected) == 1 and False)
            # old bot won't proceed unless detect>=2, so single-field forms fail it
            old_ok = expected <= of and od >= 2
            new_ok = expected <= nf
        old_pass += old_ok
        new_pass += new_ok
        exp_s = ",".join(sorted(x for x in expected)) or "(junk)"
        print(f"{name:<20} {len(expected):>4} | {od:>6} {str(sorted(of)):<40}")
        print(f"{'  expected: '+exp_s:<20}")
        print(f"{'':<20}      | NEW {nv:<20} {sorted(nf)}  -> {new_r} {'OK' if new_ok else 'x'}")
        print("-" * 92)

    print(f"\nFillable fixtures: {fillable_total}   (junk: {len(rows)-fillable_total})")
    print(f"OLD engine fully-correct fillable forms: {sum(1 for r in rows if len(r[1])>0 and r[1]<=r[3] and r[2]>=2)}/{fillable_total}")
    print(f"NEW engine fully-correct fillable forms: {sum(1 for r in rows if len(r[1])>0 and r[1]<=r[5])}/{fillable_total}")
    print(f"OLD correct junk-skips: {sum(1 for r in rows if len(r[1])==0 and r[2]==0)}/{len(rows)-fillable_total}")
    print(f"NEW correct junk-skips: {sum(1 for r in rows if len(r[1])==0 and r[4].startswith('skip'))}/{len(rows)-fillable_total}")


asyncio.run(main())
