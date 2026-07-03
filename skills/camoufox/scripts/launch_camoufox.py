#!/usr/bin/env python3
"""
launch_camoufox.py — standalone Camoufox launcher + bot-detection smoke test.

Confirms the anti-detect Firefox actually launches on this machine and reports
how "human" it looks, before you rely on it in a larger job.

Usage:
    python launch_camoufox.py --url https://bot.sannysoft.com --headless
    python launch_camoufox.py --url https://example.com --headless --screenshot out.png
    python launch_camoufox.py --url https://site.com --proxy http://user:pass@host:port

Exit code 0 on a clean launch + navigation, 1 on failure.
"""
import argparse
import asyncio
import sys


async def run(url: str, headless: bool, screenshot: str | None,
              proxy: str | None, spoof_os: tuple[str, ...]) -> int:
    try:
        from camoufox.async_api import AsyncCamoufox
    except ImportError:
        print("ERROR: camoufox is not installed.\n"
              "  pip install camoufox[geoip] && python -m camoufox fetch",
              file=sys.stderr)
        return 1

    opts = dict(headless=headless, humanize=True, os=spoof_os,
                locale="en-US", geoip=True)
    if proxy:
        opts["proxy"] = {"server": proxy}

    try:
        async with AsyncCamoufox(**opts) as browser:
            page = await browser.new_page()
            await page.goto(url, wait_until="load", timeout=45_000)
            title = await page.title()

            # Fingerprint readouts a detector would check.
            probe = await page.evaluate(
                "() => ({"
                "  webdriver: navigator.webdriver,"
                "  ua: navigator.userAgent,"
                "  platform: navigator.platform,"
                "  languages: navigator.languages,"
                "  hardwareConcurrency: navigator.hardwareConcurrency,"
                "  plugins: navigator.plugins.length"
                "})"
            )

            print(f"\n✓ Launched Camoufox and loaded: {url}")
            print(f"  page title           : {title!r}")
            print(f"  navigator.webdriver  : {probe['webdriver']}  "
                  f"({'GOOD (undefined/false)' if not probe['webdriver'] else 'BAD (detected!)'})")
            print(f"  userAgent            : {probe['ua']}")
            print(f"  platform             : {probe['platform']}")
            print(f"  languages            : {probe['languages']}")
            print(f"  hardwareConcurrency  : {probe['hardwareConcurrency']}")
            print(f"  plugins              : {probe['plugins']}")

            # sannysoft prints a table of pass/fail rows; count the reds.
            if "sannysoft" in url:
                fails = await page.evaluate(
                    "() => document.querySelectorAll('.failed, .warn').length"
                )
                print(f"  sannysoft failed rows: {fails}  "
                      f"({'looks clean' if fails == 0 else 'some checks flagged'})")

            if screenshot:
                await page.screenshot(path=screenshot, full_page=True)
                print(f"  screenshot saved     : {screenshot}")

        return 0
    except Exception as e:
        print(f"ERROR: Camoufox run failed: {e}", file=sys.stderr)
        return 1


def main() -> None:
    ap = argparse.ArgumentParser(description="Camoufox launcher + bot-detection smoke test")
    ap.add_argument("--url", default="https://bot.sannysoft.com",
                    help="URL to load (default: sannysoft bot-detection page)")
    ap.add_argument("--headless", action="store_true", help="run without a display (use on a VPS)")
    ap.add_argument("--screenshot", default=None, help="save a full-page screenshot to this path")
    ap.add_argument("--proxy", default=None, help="proxy server, e.g. http://user:pass@host:port")
    ap.add_argument("--os", default="windows,macos",
                    help="comma list of platforms to spoof, randomized per launch")
    args = ap.parse_args()
    spoof_os = tuple(s.strip() for s in args.os.split(",") if s.strip())
    rc = asyncio.run(run(args.url, args.headless, args.screenshot, args.proxy, spoof_os))
    sys.exit(rc)


if __name__ == "__main__":
    main()
