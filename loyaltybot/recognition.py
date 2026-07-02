"""
new_engine.py — universal, label-aware field recognition + junk-page classifier.

Two problems the old FIELD_SELECTORS brain could not solve:

  1. It only matched name/id/placeholder/aria/autocomplete. Forms whose ONLY
     signal is the <label> text (opaque ids like q_0001, f7) were invisible to
     it, so the bot "sat there and did nothing." This engine resolves the label
     for every field (for=, wrapping <label>, aria-labelledby) and classifies on
     the union of ALL signals.

  2. It could not tell a real web signup from a "bullshit form" — an auto-club
     page, a phone-only / app-only enroll page, a page with no fillable inputs.
     Those were counted as failures. classify_page() cleanly SKIPS them so they
     never count against the fillable-only success rate.

Recognition is done in one DOM walk (page.evaluate) that pierces open shadow
roots and tags each candidate with data-lb-id=N. Python then classifies each
descriptor, and the actual fill is done through Playwright locators keyed on
data-lb-id (which pierce shadow DOM) so real input/change events still fire.
"""

import logging
logger = logging.getLogger("recognition")
logger.addHandler(logging.NullHandler())

FILL_TIMEOUT_MS = 4000

# Logical keys that represent a genuine web-signup field. Presence of these is
# what makes a page "fillable"; a page with none of them is a bullshit form.
REAL_SIGNUP_KEYS = {
    "email", "email_confirm", "password", "password_confirm",
    "first_name", "last_name", "full_name", "phone", "username",
    "zip", "address", "city", "state",
}

# ---------------------------------------------------------------------------
# DOM walk: collect every candidate field with its resolved label + all signals
# ---------------------------------------------------------------------------
_SCAN_JS = r"""
() => {
  const out = [];
  let idc = 0;

  function labelFor(el, root) {
    let txt = "";
    // 1. <label for=id>
    if (el.id) {
      try {
        const l = root.querySelector('label[for="' + CSS.escape(el.id) + '"]');
        if (l) txt += " " + l.textContent;
      } catch (e) {}
    }
    // 2. wrapping <label>
    let p = el.parentElement;
    for (let i = 0; i < 4 && p; i++, p = p.parentElement) {
      if (p.tagName === "LABEL") { txt += " " + p.textContent; break; }
    }
    // 3. aria-labelledby
    const lb = el.getAttribute("aria-labelledby");
    if (lb) {
      lb.split(/\s+/).forEach(id => {
        const t = (root.getElementById ? root.getElementById(id) : document.getElementById(id));
        if (t) txt += " " + t.textContent;
      });
    }
    // 4. preceding sibling text / label-ish node
    const prev = el.previousElementSibling;
    if (prev && /^(LABEL|SPAN|DIV|P)$/.test(prev.tagName) && prev.textContent.length < 60) {
      txt += " " + prev.textContent;
    }
    return txt.replace(/\s+/g, " ").trim();
  }

  function visible(el) {
    if (el.disabled) return false;
    const st = (el.ownerDocument.defaultView || window).getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || parseFloat(st.opacity) === 0)
      return false;
    const r = el.getClientRects();
    return r.length > 0 && el.offsetParent !== null || st.position === "fixed";
  }

  function walk(root) {
    const els = root.querySelectorAll("input, select, textarea");
    els.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const type = (el.getAttribute("type") || "text").toLowerCase();
      if (tag === "input" && ["hidden", "submit", "button", "reset", "image", "file"].includes(type))
        return;
      const id = "lb" + (idc++);
      el.setAttribute("data-lb-id", id);
      let options = [];
      if (tag === "select") {
        options = Array.from(el.options).map(o => ({ value: o.value, text: o.textContent.trim() }));
      }
      out.push({
        lb_id: id,
        tag, type,
        name: el.getAttribute("name") || "",
        el_id: el.id || "",
        placeholder: el.getAttribute("placeholder") || "",
        aria: el.getAttribute("aria-label") || "",
        autocomplete: el.getAttribute("autocomplete") || "",
        required: el.required || el.getAttribute("aria-required") === "true",
        label: labelFor(el, root),
        visible: visible(el),
        options,
      });
      if (el.shadowRoot) walk(el.shadowRoot);
    });
    // also descend into any shadow hosts that had no field of their own
    root.querySelectorAll("*").forEach(node => {
      if (node.shadowRoot && !node.matches("input,select,textarea")) walk(node.shadowRoot);
    });
  }

  walk(document);
  const body = (document.body ? document.body.innerText : "") || "";
  return { fields: out, text: body.slice(0, 4000).toLowerCase() };
}
"""


def _sig(d):
    """All textual signals for a descriptor, lower-cased and space-joined."""
    return " ".join([
        d.get("name", ""), d.get("el_id", ""), d.get("placeholder", ""),
        d.get("aria", ""), d.get("autocomplete", ""), d.get("label", ""),
    ]).lower()


def classify_field(d):
    """Map one field descriptor to a logical key, or None. Order = priority."""
    s = _sig(d)
    tag, typ, ac = d["tag"], d["type"], d.get("autocomplete", "").lower()
    ph = d.get("placeholder", "").lower()

    def has(*subs):
        return any(x in s for x in subs)

    # --- passwords (by input type — most reliable) ---
    if typ == "password":
        if has("confirm", "re-enter", "reenter", "retype", "repeat", "verify", "again"):
            return "password_confirm"
        if has("current", "old password"):
            return None  # login page, not signup
        return "password"

    # --- email (type, autocomplete, then @-shaped placeholder, then words) ---
    if typ == "email" or ac == "email":
        if has("confirm", "re-enter", "reenter", "verify", "again") or "email2" in s:
            return "email_confirm"
        return "email"
    if "@" in ph:  # placeholder like you@example.com even when name=usr_login
        return "email"

    # --- phone ---
    if typ == "tel" or ac in ("tel", "tel-national") or has("phone", "mobile", "cell", "telephone"):
        if has("work", "business", "employer"):
            return "employer_phone"
        return "phone"

    # --- names ---
    if ac == "given-name" or has("first name", "firstname", "fname", "given name", "given-name", "givenname"):
        return "first_name"
    if ac == "family-name" or has("last name", "lastname", "lname", "surname", "family name", "family-name", "familyname"):
        return "last_name"

    # --- email by keyword (after names, so "email" doesn't shadow nothing) ---
    if has("e-mail", "email"):
        if has("confirm", "reenter", "re-enter"):
            return "email_confirm"
        return "email"

    # --- postal / geo ---
    if ac == "postal-code" or has("zip", "postal", "post code", "postcode"):
        return "zip"
    if ac == "address-level1" or (tag == "select" and has("state", "province")) or has(" state", "state ", "province"):
        return "state"
    if ac == "address-level2" or has("city", "town", "suburb"):
        return "city"
    if ac == "street-address" or has("address", "street", "addr"):
        return "address"

    # --- account / misc ---
    if has("username", "user name", "userid", "user id", "login", "screen name", "handle"):
        return "username"
    if ac == "name" or has("full name", "your name", "name on"):
        return "full_name"
    if has("date of birth", "birth", "dob", "bday", "birthday"):
        return "birthday"
    if has("ssn", "social security"):
        return "ssn"
    return None


def classify_dob(fields):
    """Detect a split month/day/year DOB across selects/inputs. Returns dict of
    lb_id -> component ('month'|'day'|'year') or {}."""
    parts = {}
    for d in fields:
        if not d["visible"]:
            continue
        s = _sig(d)
        if "birth" not in s and "dob" not in s and "bday" not in s:
            # accept bare month/day/year selects too if near each other
            pass
        if any(x in s for x in ("month", "bmonth", "mm")) and ("birth" in s or "bmonth" in s or "dob" in s):
            parts[d["lb_id"]] = "month"
        elif any(x in s for x in ("day", "bday", "dd")) and ("birth" in s or "bday" in s or "dob" in s):
            parts[d["lb_id"]] = "day"
        elif any(x in s for x in ("year", "byear", "yyyy")) and ("birth" in s or "byear" in s or "dob" in s):
            parts[d["lb_id"]] = "year"
    return parts


def classify_consent(fields):
    """Consent checkboxes that MUST be ticked to submit (terms, age) — but never
    marketing/newsletter opt-ins. Returns list of lb_ids to check."""
    ids = []
    for d in fields:
        if d["type"] != "checkbox" or not d["visible"]:
            continue
        s = _sig(d)
        if any(x in s for x in ("newsletter", "marketing", "promo", "offers", "subscribe", "send me")):
            continue
        if any(x in s for x in ("terms", "agree", "consent", "privacy", "18 or older",
                                "over 18", "age", "conditions", "accept", "acknowledge")):
            ids.append(d["lb_id"])
    return ids


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
async def scan(page):
    """Return {'fields': [...descriptors...], 'text': body_text_lower}."""
    return await page.evaluate(_SCAN_JS)


# bot-facing alias
scan_page = scan


def _old_sig(d):
    """Reproduce the old fill_field element signature so fallback passes in the
    bot skip elements we already filled: name|id|type|placeholder."""
    return f"{d.get('name','')}|{d.get('el_id','')}|{d.get('type','')}|{d.get('placeholder','')}"


def _parse_dob(raw):
    """Return (year, month_int, day_int) from 'YYYY-MM-DD' or 'MM/DD/YYYY' or
    'MM-DD-YYYY'. Returns None on failure."""
    if not raw:
        return None
    raw = str(raw).strip()
    import re
    m = re.match(r"^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$", raw)
    if m:
        return m.group(1), int(m.group(2)), int(m.group(3))
    m = re.match(r"^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$", raw)
    if m:
        return m.group(3), int(m.group(1)), int(m.group(2))
    return None


def classify_page(scan_result):
    """Decide whether a page is a real fillable signup or a bullshit form.

    Returns ("fillable", plan) or ("skip", reason).
    """
    fields = scan_result["fields"]
    text = scan_result.get("text", "")
    visible = [d for d in fields if d["visible"]]

    keyed = {}
    for d in visible:
        k = classify_field(d)
        if k:
            keyed.setdefault(k, []).append(d)

    real = {k: v for k, v in keyed.items() if k in REAL_SIGNUP_KEYS}
    has_email = "email" in real
    text_fields = [d for d in visible if d["tag"] in ("input", "textarea")
                   and d["type"] in ("text", "email", "tel", "password", "number", "")]

    if not text_fields and not any(d["tag"] == "select" for d in visible):
        # nothing to type into at all
        if any(p in text for p in ("call ", "enroll by phone", "phone to enroll", "1-800", "1-888", "1-877")):
            return "skip", "phone-only-enrollment"
        if any(p in text for p in ("download the app", "app store", "google play", "get the app")):
            return "skip", "app-only-enrollment"
        return "skip", "no-fillable-form"

    # There are inputs, but are they a signup? Require an email OR >=2 real fields.
    if not has_email and len(real) < 2:
        return "skip", "not-a-signup-form"

    plan = {
        "fields": keyed,
        "dob": classify_dob(visible),
        "consent": classify_consent(visible),
    }
    return "fillable", plan


async def fill_page(page, profile, plan):
    """Fill everything in the plan. Returns the set of logical keys filled."""
    filled = set()

    async def set_text(lb_id, value):
        loc = page.locator(f'[data-lb-id="{lb_id}"]')
        try:
            await loc.scroll_into_view_if_needed(timeout=1500)
        except Exception:
            pass
        try:
            await loc.fill(value, timeout=FILL_TIMEOUT_MS)
        except Exception:
            try:
                await loc.fill(value, timeout=FILL_TIMEOUT_MS, force=True)
            except Exception:
                return False
        try:
            await loc.dispatch_event("input")
            await loc.dispatch_event("change")
        except Exception:
            pass
        return True

    async def set_select(lb_id, value):
        loc = page.locator(f'[data-lb-id="{lb_id}"]')
        for how in ("label", "value"):
            try:
                if how == "label":
                    await loc.select_option(label=value, timeout=FILL_TIMEOUT_MS)
                else:
                    await loc.select_option(value=value, timeout=FILL_TIMEOUT_MS)
                return True
            except Exception:
                continue
        # fuzzy: pick the option whose text contains value (case-insensitive)
        try:
            opts = await loc.evaluate(
                "el => Array.from(el.options).map(o => [o.value, o.textContent.trim()])")
            for v, t in opts:
                if value.lower() in t.lower() and t.strip():
                    await loc.select_option(value=v, timeout=FILL_TIMEOUT_MS)
                    return True
        except Exception:
            pass
        return False

    # ordinary keyed fields
    for key, descs in plan["fields"].items():
        if key not in profile:
            continue
        val = profile[key]
        for d in descs:
            if d["lb_id"] in plan["dob"]:
                continue
            ok = await (set_select(d["lb_id"], val) if d["tag"] == "select"
                        else set_text(d["lb_id"], val))
            if ok:
                filled.add(key)
                break

    # split DOB
    if plan["dob"] and "dob" in profile:
        y, m, dd = profile["dob"].split("-")
        months = ["", "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"]
        comp_val = {"month": months[int(m)], "day": str(int(dd)), "year": y}
        got = 0
        for lb_id, comp in plan["dob"].items():
            if await set_select(lb_id, comp_val[comp]):
                got += 1
        if got:
            filled.add("__dob__")

    # consent
    if plan["consent"]:
        checked = 0
        for lb_id in plan["consent"]:
            loc = page.locator(f'[data-lb-id="{lb_id}"]')
            try:
                await loc.check(timeout=FILL_TIMEOUT_MS)
                checked += 1
            except Exception:
                try:
                    await loc.check(timeout=FILL_TIMEOUT_MS, force=True)
                    checked += 1
                except Exception:
                    pass
        if checked:
            filled.add("__consent__")

    return filled


async def smart_fill(page, fill_map, plan, filled_elements=None):
    """Bot-facing fill: uses the production `fill_map` (keys like email,
    first_name, birthday, zip, state, ...) and records each filled element's
    old-engine signature into `filled_elements` so the bot's later fallback
    passes don't re-fill the same inputs. Returns the set of logical keys filled.
    """
    if filled_elements is None:
        filled_elements = set()
    filled = set()

    async def set_text(d, value):
        loc = page.locator(f'[data-lb-id="{d["lb_id"]}"]')
        try:
            await loc.scroll_into_view_if_needed(timeout=1500)
        except Exception:
            pass
        try:
            await loc.fill(value, timeout=FILL_TIMEOUT_MS)
        except Exception:
            try:
                await loc.fill(value, timeout=FILL_TIMEOUT_MS, force=True)
            except Exception:
                return False
        try:
            await loc.dispatch_event("input")
            await loc.dispatch_event("change")
        except Exception:
            pass
        return True

    async def set_select(d, value):
        loc = page.locator(f'[data-lb-id="{d["lb_id"]}"]')
        for how in ("label", "value"):
            try:
                if how == "label":
                    await loc.select_option(label=value, timeout=FILL_TIMEOUT_MS)
                else:
                    await loc.select_option(value=value, timeout=FILL_TIMEOUT_MS)
                return True
            except Exception:
                continue
        try:
            opts = await loc.evaluate(
                "el => Array.from(el.options).map(o => [o.value, o.textContent.trim()])")
            for v, t in opts:
                if t and value.lower() in t.lower():
                    await loc.select_option(value=v, timeout=FILL_TIMEOUT_MS)
                    return True
        except Exception:
            pass
        return False

    # ordinary keyed fields, in priority order
    for key, descs in plan.get("fields", {}).items():
        val = fill_map.get(key, "")
        if not val:
            continue
        for d in descs:
            if d["lb_id"] in plan.get("dob", {}):
                continue
            sig = _old_sig(d)
            if sig in filled_elements:
                continue
            ok = await (set_select(d, val) if d["tag"] == "select" else set_text(d, val))
            if ok:
                filled.add(key)
                filled_elements.add(sig)
                break

    # split date-of-birth (month/day/year selects)
    dob = _parse_dob(fill_map.get("birthday") or fill_map.get("dob"))
    if plan.get("dob") and dob:
        y, mo, dd = dob
        months = ["", "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"]
        comp_val = {"month": months[mo], "day": str(dd), "year": y}
        # also try zero-padded / numeric month variants for numeric selects
        alt = {"month": [months[mo], str(mo), f"{mo:02d}"],
               "day": [str(dd), f"{dd:02d}"], "year": [y]}
        got = 0
        for lb_id, comp in plan["dob"].items():
            d = {"lb_id": lb_id, "tag": "select"}
            done = False
            for cand in alt[comp]:
                if await set_select(d, cand):
                    done = True
                    break
            if done:
                got += 1
        if got:
            filled.add("__dob__")

    # required consent checkboxes (terms / age) — never marketing opt-ins
    if plan.get("consent"):
        checked = 0
        for lb_id in plan["consent"]:
            loc = page.locator(f'[data-lb-id="{lb_id}"]')
            try:
                await loc.check(timeout=FILL_TIMEOUT_MS)
                checked += 1
            except Exception:
                try:
                    await loc.check(timeout=FILL_TIMEOUT_MS, force=True)
                    checked += 1
                except Exception:
                    pass
        if checked:
            filled.add("__consent__")

    return filled
