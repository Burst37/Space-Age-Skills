#!/usr/bin/env python3
"""Real implementation of the screenshot_preview tool.

Ported from abi/screenshot-to-code's backend/preview_screenshot/playwright_backend.py
and backend/preview_screenshot/base.py (VIEWPORT_SIZES) and backend/agent/tools/
screenshot_preview.py (the desktop+mobile pairing) — same viewport sizes, same
render-settle sequence (networkidle wait, then document.fonts.ready, then a fixed
settle delay), same full-page PNG capture. The original renders an in-memory HTML
string served over a FastAPI WebSocket tool call; this renders a file on disk via a
plain CLI, since a skill has no server to call back into.

Usage:
    python3 screenshot_preview.py <html_file> <out_dir>

Writes <out_dir>/preview_desktop.png and <out_dir>/preview_mobile.png.
Requires the `playwright` Python package (`pip install playwright`) — the Chromium
binary itself does not need a separate `playwright install` in an environment where
PLAYWRIGHT_BROWSERS_PATH already points at a downloaded Chromium.
"""

import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from playwright.async_api import async_playwright

# Verbatim from backend/preview_screenshot/base.py VIEWPORT_SIZES.
VIEWPORT_SIZES = {
    "desktop": (1280, 832),
    "mobile": (342, 684),
}

PAGE_LOAD_TIMEOUT_MS = 15000
RENDER_SETTLE_MS = 250

# Environments that pre-stage Chromium (this one included) often pin a browser
# revision that's older or newer than whatever `pip install playwright` happens
# to expect, so playwright's own revision-matching under PLAYWRIGHT_BROWSERS_PATH
# can miss it ("Executable doesn't exist at .../chrome-headless-shell"). Prefer an
# explicit, stable path to the pre-staged binary when one exists; only fall back to
# playwright's own resolution (unset executable_path) if it doesn't.
_PRESTAGED_CHROMIUM = os.environ.get("PLAYWRIGHT_BROWSERS_PATH", "") and Path(
    os.environ["PLAYWRIGHT_BROWSERS_PATH"]
) / "chromium"


def _executable_path() -> str | None:
    if _PRESTAGED_CHROMIUM and _PRESTAGED_CHROMIUM.exists():
        return str(_PRESTAGED_CHROMIUM)
    return None


async def capture(html: str, device: str, out_path: Path) -> None:
    width, height = VIEWPORT_SIZES[device]
    async with async_playwright() as p:
        # --no-sandbox: Chromium refuses to launch as root (the common case in a
        # container) unless the sandbox is disabled. Same flag as the original.
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox"],
            executable_path=_executable_path(),
        )
        page = await browser.new_page(
            viewport={"width": width, "height": height},
            device_scale_factor=1,
        )
        try:
            try:
                await page.set_content(
                    html, wait_until="networkidle", timeout=PAGE_LOAD_TIMEOUT_MS
                )
            except PlaywrightTimeoutError:
                # Content is already set; capture whatever rendered if the network
                # never settles (e.g. pages that poll).
                pass
            try:
                await page.evaluate("document.fonts.ready")
            except Exception:
                pass
            await page.wait_for_timeout(RENDER_SETTLE_MS)
            png_bytes = await page.screenshot(full_page=True, type="png")
            out_path.write_bytes(png_bytes)
        finally:
            await page.close()
            await browser.close()


async def main() -> int:
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <html_file> <out_dir>", file=sys.stderr)
        return 2

    html_file = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    if not html_file.exists():
        print(f"No such file: {html_file}", file=sys.stderr)
        return 1
    out_dir.mkdir(parents=True, exist_ok=True)

    html = html_file.read_text()
    for device in ("desktop", "mobile"):
        out_path = out_dir / f"preview_{device}.png"
        await capture(html, device, out_path)
        print(f"wrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
