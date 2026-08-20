import logging, asyncio
logger = logging.getLogger('old'); logger.addHandler(logging.NullHandler())
FILL_TIMEOUT_MS = 4000
FIELD_SELECTORS = {
    "first_name": [
        'input[name*="first" i]', 'input[id*="first" i]',
        'input[placeholder*="first" i]', 'input[aria-label*="first" i]',
        'input[autocomplete="given-name"]', 'input[name="fname"]',
        'input[name="firstName"]', 'input[name="first_name"]',
    ],
    "last_name": [
        'input[name*="last" i]', 'input[id*="last" i]',
        'input[placeholder*="last" i]', 'input[aria-label*="last" i]',
        'input[autocomplete="family-name"]', 'input[name="lname"]',
        'input[name="lastName"]', 'input[name="last_name"]',
    ],
    "full_name": [
        'input[name*="fullname" i]', 'input[id*="fullname" i]',
        'input[placeholder*="full name" i]', 'input[name*="full_name" i]',
        'input[autocomplete="name"]',
        'input[name="name"]:not([type="hidden"])',
    ],
    "email": [
        'input[type="email"]', 'input[name*="email" i]',
        'input[id*="email" i]', 'input[placeholder*="email" i]',
        'input[aria-label*="email" i]', 'input[autocomplete="email"]',
    ],
    "email_confirm": [
        'input[name*="confirm" i][type="email"]', 'input[id*="confirm" i][type="email"]',
        'input[name*="reenter" i]', 'input[placeholder*="confirm" i][type="email"]',
        'input[id*="email2" i]', 'input[id*="emailConfirm" i]',
    ],
    "phone": [
        'input[type="tel"]', 'input[name*="phone" i]',
        'input[id*="phone" i]', 'input[placeholder*="phone" i]',
        'input[aria-label*="phone" i]', 'input[autocomplete="tel"]',
        'input[name*="mobile" i]',
    ],
    "password": [
        'input[type="password"][name*="password" i]',
        'input[type="password"][id*="password" i]',
        'input[type="password"]:not([name*="confirm" i]):not([id*="confirm" i]):not([name*="current" i])',
        'input[type="password"]',
    ],
    "password_confirm": [
        'input[type="password"][name*="confirm" i]',
        'input[type="password"][id*="confirm" i]',
        'input[type="password"][placeholder*="confirm" i]',
    ],
    "zip": [
        'input[name*="zip" i]', 'input[id*="zip" i]',
        'input[name*="postal" i]', 'input[placeholder*="zip" i]',
        'input[autocomplete="postal-code"]',
    ],
    "address": [
        'input[name*="address" i]:not([name*="2" i]):not([name*="email" i]):not([type="email"])',
        'input[id*="address" i]:not([id*="2" i]):not([id*="email" i]):not([type="email"])',
        'input[placeholder*="street" i]',
        'input[placeholder*="address" i]:not([placeholder*="email" i]):not([type="email"])',
        'input[autocomplete="street-address"]',
        'input[name*="street" i]', 'input[id*="street" i]',
        'input[name*="addr1" i]', 'input[name*="address1" i]',
    ],
    "city": [
        'input[name*="city" i]', 'input[id*="city" i]',
        'input[placeholder*="city" i]', 'input[autocomplete="address-level2"]',
    ],
    "state": [
        'select[name*="state" i]', 'select[id*="state" i]',
        'input[name*="state" i]', 'input[id*="state" i]',
        'input[autocomplete="address-level1"]', 'select[autocomplete="address-level1"]',
    ],
    "birthday": [
        'input[name*="birth" i]', 'input[id*="birth" i]',
        'input[name*="dob" i]', 'input[id*="dob" i]',
        'input[placeholder*="birth" i]', 'input[autocomplete="bday"]',
    ],
    "username": [
        'input[name*="username" i]', 'input[id*="username" i]',
        'input[placeholder*="username" i]', 'input[name*="user_name" i]',
    ],
    "ssn": [
        'input[name*="ssn" i]', 'input[id*="ssn" i]',
        'input[name*="social" i]', 'input[id*="social" i]',
        'input[placeholder*="social security" i]', 'input[name*="tax_id" i]',
    ],
    "employer": [
        'input[name*="employer" i]', 'input[id*="employer" i]',
        'input[placeholder*="employer" i]', 'input[name*="company" i]',
        'input[id*="company" i]', 'input[name*="organization" i]',
    ],
    "job_title": [
        'input[name*="job_title" i]', 'input[id*="job_title" i]',
        'input[name*="jobtitle" i]', 'input[id*="jobtitle" i]',
        'input[name*="occupation" i]', 'input[id*="occupation" i]',
        'input[placeholder*="job title" i]', 'input[placeholder*="occupation" i]',
        'input[name*="position" i]:not([name*="lat" i]):not([name*="lon" i])',
    ],
    "income": [
        'input[name*="income" i]', 'input[id*="income" i]',
        'input[placeholder*="income" i]', 'input[name*="salary" i]',
        'input[name*="annual_income" i]', 'input[name*="monthly_income" i]',
    ],
    "college": [
        'input[name*="college" i]', 'input[id*="college" i]',
        'input[name*="university" i]', 'input[name*="school" i]',
        'input[placeholder*="college" i]', 'input[placeholder*="university" i]',
    ],
    "degree": [
        'select[name*="degree" i]', 'select[id*="degree" i]',
        'input[name*="degree" i]', 'input[id*="degree" i]',
        'select[name*="education" i]', 'select[id*="education" i]',
    ],
    "employer_phone": [
        'input[name*="work_phone" i]', 'input[id*="work_phone" i]',
        'input[name*="business_phone" i]', 'input[name*="employer_phone" i]',
        'input[placeholder*="work phone" i]', 'input[placeholder*="business phone" i]',
    ],
}
async def fill_field(page, field_key: str, value: str, filled_elements: set = None) -> bool:
    if filled_elements is None:
        filled_elements = set()
    # Try main page first, then each iframe
    frames = [page] + list(page.frames)
    for frame_idx, frame in enumerate(frames):
        for selector in FIELD_SELECTORS.get(field_key, []):
            try:
                locator = frame.locator(selector).first
                count = await locator.count()
                if count == 0: continue

                enabled = await locator.is_enabled()
                if not enabled:
                    logger.debug(f"    [{field_key}] found but disabled — {selector}")
                    continue

                # Scroll into view BEFORE checking visibility —
                # many sites only make fields visible once they're in the viewport
                try:
                    await locator.scroll_into_view_if_needed(timeout=2000)
                    await page.wait_for_timeout(100)
                except Exception:
                    pass

                elem_id = await locator.evaluate("el => el.name + '|' + el.id + '|' + el.type + '|' + (el.placeholder || '')")
                if elem_id in filled_elements:
                    logger.debug(f"    [{field_key}] already filled: {elem_id}")
                    continue
                tag = await locator.evaluate("el => el.tagName.toLowerCase()")

                if tag == "select":
                    try:
                        await locator.select_option(value=value, timeout=FILL_TIMEOUT_MS)
                    except Exception:
                        try:
                            await locator.select_option(label=value, timeout=FILL_TIMEOUT_MS)
                        except Exception:
                            continue
                else:
                    filled = False

                    # Pass 1 — normal fill
                    try:
                        await locator.click(timeout=FILL_TIMEOUT_MS)
                        await locator.fill("", timeout=FILL_TIMEOUT_MS)
                        await locator.fill(value, timeout=FILL_TIMEOUT_MS)
                        filled = True
                        logger.debug(f"    [{field_key}] ✅ filled (normal) frame={frame_idx}: {selector}")
                    except Exception as e:
                        logger.debug(f"    [{field_key}] normal fill failed ({e}) — trying force: {selector}")

                    # Pass 2 — force=True bypass for CSS-animated / partially visible fields
                    if not filled:
                        try:
                            await locator.fill(value, timeout=FILL_TIMEOUT_MS, force=True)
                            filled = True
                            logger.debug(f"    [{field_key}] ✅ filled (force) frame={frame_idx}: {selector}")
                        except Exception as e:
                            logger.debug(f"    [{field_key}] force fill also failed ({e}): {selector}")

                    if not filled:
                        continue

                    # Fire framework events so React/Vue/Angular detect the change
                    try:
                        await locator.dispatch_event("input")
                        await locator.dispatch_event("change")
                    except Exception:
                        pass

                    # Dismiss autocomplete dropdowns (Google Places, etc.)
                    if field_key in ("address", "city", "zip"):
                        try:
                            await page.keyboard.press("Escape")
                            await page.wait_for_timeout(150)
                        except Exception:
                            pass

                filled_elements.add(elem_id)
                return True
            except Exception as e:
                logger.debug(f"    [{field_key}] exception on {selector}: {e}")
                continue
    logger.debug(f"    [{field_key}] ❌ no selector matched across {len(frames)} frames")
    return False


async def detect_form_fields(page) -> int:
    count = 0
    # Limit to main page + first 2 iframes to avoid slow scanning on
    # iframe-heavy sites (ad networks, chat widgets, etc.)
    frames = ([page] + list(page.frames))[:3]
    for frame in frames:
        for selectors in FIELD_SELECTORS.values():
            for selector in selectors:
                try:
                    if await frame.locator(selector).first.count() > 0:
                        count += 1
                        break
                except Exception:
                    continue
        if count >= 2:
            break  # Found enough in this frame, no need to keep scanning
    return count
