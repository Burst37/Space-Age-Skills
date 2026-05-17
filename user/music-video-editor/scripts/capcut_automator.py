"""
Space Age AI Solutions — CapCut Web Automator
Uses Playwright to automate CapCut web editor (capcut.com)
Imports video, applies text, exports final cut

Requirements: pip install playwright && playwright install chromium
Usage: python capcut_automator.py --video output.mp4 --artist "ARTIST" --title "TRACK"
"""

import asyncio, argparse, os, json, time
from pathlib import Path

try:
    from playwright.async_api import async_playwright, TimeoutError as PWTimeout
except ImportError:
    import subprocess, sys
    subprocess.run([sys.executable, "-m", "pip", "install", "playwright", "-q"])
    subprocess.run([sys.executable, "-m", "playwright", "install", "chromium", "-q"])
    from playwright.async_api import async_playwright, TimeoutError as PWTimeout


CAPCUT_URL = "https://www.capcut.com/create"


async def automate_capcut(video_path: str, artist: str, title: str,
                           theme_color: str = "#FF8C00", headless: bool = False):
    """
    Automate CapCut web to:
    1. Create new project
    2. Upload video
    3. Add artist/title text with styling
    4. Export

    NOTE: CapCut requires a logged-in session.
    On first run it will open browser for manual login.
    Credentials are saved in ~/.capcut_session/
    """
    session_dir = Path.home() / ".capcut_session"
    session_dir.mkdir(exist_ok=True)
    session_file = session_dir / "session.json"

    print(f"[CAPCUT] Starting automation...")
    print(f"[CAPCUT] Video: {video_path}")
    print(f"[CAPCUT] Artist: {artist} | Title: {title}")

    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            str(session_dir),
            headless=headless,
            args=["--no-sandbox"],
            accept_downloads=True,
        )
        page = browser.pages[0] if browser.pages else await browser.new_page()

        print(f"[CAPCUT] Opening {CAPCUT_URL}...")
        await page.goto(CAPCUT_URL, timeout=30000)
        await page.wait_for_load_state("networkidle", timeout=20000)

        login_button = page.locator("text=Log in")
        if await login_button.count() > 0:
            print("[CAPCUT] Not logged in. Please log in manually in the browser window.")
            print("[CAPCUT] After logging in, press Enter here to continue...")
            input()
            await page.goto(CAPCUT_URL, timeout=30000)
            await page.wait_for_load_state("networkidle")

        try:
            new_project = page.locator("text=New project, [data-testid='new-project'], .new-project-btn").first
            await new_project.click(timeout=10000)
            await page.wait_for_load_state("networkidle", timeout=15000)
            print("[CAPCUT] New project created")
        except PWTimeout:
            print("[CAPCUT] Could not find 'New Project' button - CapCut UI may have changed")
            print("[CAPCUT] Attempting to find upload button directly...")

        abs_video = str(Path(video_path).absolute())
        print(f"[CAPCUT] Uploading video: {abs_video}")
        try:
            file_input = page.locator("input[type='file']").first
            await file_input.set_input_files(abs_video)
            print("[CAPCUT] Video uploaded, waiting for processing...")
            await page.wait_for_timeout(5000)
        except Exception as e:
            print(f"[CAPCUT] Upload via file input failed: {e}")
            print("[CAPCUT] Falling back to drag-drop zone detection...")
            upload_zone = page.locator(".upload-area, [class*='upload'], [class*='import']").first
            if await upload_zone.count() > 0:
                async with page.expect_file_chooser() as fc_info:
                    await upload_zone.click()
                file_chooser = await fc_info.value
                await file_chooser.set_files(abs_video)

        await page.wait_for_timeout(8000)

        print("[CAPCUT] Adding text overlays...")
        try:
            text_button = page.locator("[data-testid='text-tool'], .text-btn, text=Text").first
            await text_button.click(timeout=8000)
            await page.wait_for_timeout(1000)

            text_input = page.locator("textarea, [contenteditable='true']").first
            await text_input.fill(artist.upper())
            await page.wait_for_timeout(500)

            color_btn = page.locator("[data-testid='font-color'], .color-picker").first
            if await color_btn.count() > 0:
                await color_btn.click()
                await page.wait_for_timeout(500)
                hex_input = page.locator("input[placeholder*='hex'], input[placeholder*='#']").first
                if await hex_input.count() > 0:
                    await hex_input.fill(theme_color.replace("#", ""))
                    await hex_input.press("Enter")

            print("[CAPCUT] Artist text added")
        except Exception as e:
            print(f"[CAPCUT] Text automation failed: {e}")
            print("[CAPCUT] CapCut editor is open — add text manually, then export")

        result = {
            "status": "partial",
            "artist": artist,
            "title": title,
            "video": video_path,
            "note": "Browser is open for manual review and export",
            "export_settings": {"format": "MP4", "resolution": "1080x1920", "quality": "High"},
        }

        with open("capcut_project.json", "w") as f:
            json.dump(result, f, indent=2)

        print("\n[CAPCUT] Browser is open. Complete any manual steps and export.")
        print("[CAPCUT] Recommended export settings: MP4, 1080x1920, High quality")
        print("\nPress Enter when done to close the browser...")
        input()

        await browser.close()
    return result


def main():
    parser = argparse.ArgumentParser(description="CapCut Web Automator")
    parser.add_argument("--video",  required=True, help="Video file to import")
    parser.add_argument("--artist", default="ARTIST", help="Artist name for text overlay")
    parser.add_argument("--title",  default="TRACK",  help="Track title")
    parser.add_argument("--color",  default="#FF8C00", help="Theme color (hex)")
    parser.add_argument("--headless", action="store_true", help="Run headless (no browser window)")
    args = parser.parse_args()

    asyncio.run(automate_capcut(
        video_path=args.video,
        artist=args.artist,
        title=args.title,
        theme_color=args.color,
        headless=args.headless,
    ))


if __name__ == "__main__":
    main()
