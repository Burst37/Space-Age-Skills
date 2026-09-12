"""Minimal Python client for the camofox-browser REST API.

camofox-browser (https://github.com/jo-inc/camofox-browser) wraps Camoufox
(a Firefox fork with C++-level fingerprint spoofing) in a small REST API:
create a tab, get an accessibility snapshot with stable element refs (e1, e2, ...),
then click/type using those refs. No Selenium/Playwright + Chromium fingerprint
to leak.

This client only talks to that REST API -- it does not embed any
Camoufox/browser logic itself. Run the server separately:

    git clone https://github.com/jo-inc/camofox-browser
    cd camofox-browser && npm install && npm start   # -> http://localhost:9377
"""

from __future__ import annotations

import os
import random
import re
import time
from dataclasses import dataclass

import requests

# Transport-level retry. Every failure mode below is transient in practice
# (camofox restarting a browser, a page still loading, a socket reset), and
# before this the exception escaped as a raw requests error, killed the worker
# thread, and the row was silently dropped from the results CSV.
RETRY_STATUS = {408, 425, 429, 500, 502, 503, 504}
DEFAULT_RETRIES = 3


class CamofoxError(RuntimeError):
    pass


@dataclass
class SnapshotItem:
    ref: str
    role: str
    label: str


class CamofoxClient:
    def __init__(
        self,
        base_url: str | None = None,
        access_key: str | None = None,
        timeout: float = 30.0,
        retries: int = DEFAULT_RETRIES,
    ):
        self.base_url = (base_url or os.environ.get("CAMOFOX_URL") or "http://localhost:9377").rstrip("/")
        self.access_key = access_key or os.environ.get("CAMOFOX_ACCESS_KEY")
        self.timeout = timeout
        self.retries = max(1, retries)
        self.session = requests.Session()

    def _headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.access_key:
            headers["Authorization"] = f"Bearer {self.access_key}"
        return headers

    def _request(self, method: str, path: str, **kwargs) -> dict:
        """Issue one API call, retrying transient transport/5xx failures.

        Always raises CamofoxError (never a bare requests exception) so callers
        have a single exception type to catch -- a raw ConnectionError escaping
        here used to kill the worker thread that raised it.
        """
        last_error = "unknown error"
        for attempt in range(self.retries):
            try:
                resp = self.session.request(
                    method,
                    f"{self.base_url}{path}",
                    headers=self._headers(),
                    timeout=self.timeout,
                    **kwargs,
                )
            except requests.RequestException as exc:
                last_error = f"{type(exc).__name__}: {exc}"
            else:
                if resp.status_code in RETRY_STATUS:
                    last_error = f"{method} {path} -> {resp.status_code}: {resp.text[:300]}"
                elif resp.status_code >= 400:
                    raise CamofoxError(f"{method} {path} -> {resp.status_code}: {resp.text[:500]}")
                elif not resp.content:
                    return {}
                else:
                    try:
                        return resp.json()
                    except ValueError:
                        # Non-JSON 2xx body: return it rather than blowing up.
                        return {"raw": resp.text}
            if attempt < self.retries - 1:
                time.sleep((2 ** attempt) + random.uniform(0, 0.4))
        raise CamofoxError(f"{method} {path} failed after {self.retries} attempts: {last_error}")

    # -- Tabs --------------------------------------------------------------

    def create_tab(self, user_id: str, session_key: str, url: str, trace: bool = False) -> str:
        body = {"userId": user_id, "sessionKey": session_key, "url": url}
        if trace:
            body["trace"] = True
        data = self._request("POST", "/tabs", json=body)
        tab_id = data.get("tabId") or data.get("id") or data.get("tab_id")
        if not tab_id:
            raise CamofoxError(f"POST /tabs returned no tab id: {str(data)[:300]}")
        return str(tab_id)

    def close_tab(self, tab_id: str, user_id: str) -> None:
        self._request("DELETE", f"/tabs/{tab_id}", params={"userId": user_id})

    def close_session(self, user_id: str) -> None:
        self._request("DELETE", f"/sessions/{user_id}")

    # -- Snapshot / content --------------------------------------------------

    def snapshot(self, tab_id: str, user_id: str, offset: int = 0, include_screenshot: bool = False) -> dict:
        params = {"userId": user_id, "offset": offset}
        if include_screenshot:
            params["includeScreenshot"] = "true"
        return self._request("GET", f"/tabs/{tab_id}/snapshot", params=params)

    def snapshot_text(self, tab_id: str, user_id: str, max_pages: int = 10) -> str:
        """Return the FULL accessibility snapshot, following pagination.

        The API returns the snapshot in offset-addressed chunks. Reading only
        the first chunk (what the callers used to do) silently hides every
        field below the fold, which shows up downstream as the single most
        common failure in production: "no form fields found" on pages that do
        have a form.
        """
        parts: list[str] = []
        offset = 0
        for _ in range(max_pages):
            data = self.snapshot(tab_id, user_id, offset=offset)
            chunk = data.get("snapshot") or data.get("text") or ""
            if chunk:
                parts.append(chunk)
            next_offset = data.get("nextOffset")
            has_more = data.get("hasMore")
            if not chunk or not has_more or next_offset in (None, offset):
                break
            offset = int(next_offset)
        return "\n".join(parts)

    def links(self, tab_id: str, user_id: str, limit: int = 100) -> dict:
        return self._request("GET", f"/tabs/{tab_id}/links", params={"userId": user_id, "limit": limit})

    # -- Interaction ---------------------------------------------------------

    def click(self, tab_id: str, user_id: str, ref: str | None = None, selector: str | None = None) -> dict:
        body = {"userId": user_id}
        if ref:
            body["ref"] = ref
        if selector:
            body["selector"] = selector
        return self._request("POST", f"/tabs/{tab_id}/click", json=body)

    def type(self, tab_id: str, user_id: str, ref: str, text: str, press_enter: bool = False) -> dict:
        body = {"userId": user_id, "ref": ref, "text": text}
        if press_enter:
            body["pressEnter"] = True
        return self._request("POST", f"/tabs/{tab_id}/type", json=body)

    def clear(self, tab_id: str, user_id: str, ref: str) -> dict:
        """Empty a field before typing into it.

        Without this, a re-fill (e.g. after a CAPTCHA is solved, or after a
        validation error) appends to what is already there and produces values
        like "JohnJohn" that the form then rejects.
        """
        return self._request("POST", f"/tabs/{tab_id}/type", json={
            "userId": user_id, "ref": ref, "text": "", "clear": True,
        })

    def check(self, tab_id: str, user_id: str, ref: str) -> dict:
        """Tick a checkbox (terms of service, age confirmation, opt-in).

        Falls back to a plain click if the server has no /check endpoint --
        most signup forms refuse to submit with the ToS box unticked, so this
        is not optional.
        """
        try:
            return self._request("POST", f"/tabs/{tab_id}/check", json={"userId": user_id, "ref": ref})
        except CamofoxError:
            return self.click(tab_id, user_id, ref=ref)

    def select(self, tab_id: str, user_id: str, ref: str, value: str) -> dict:
        """Choose an option in a <select> / combobox, falling back to typing."""
        try:
            return self._request("POST", f"/tabs/{tab_id}/select", json={
                "userId": user_id, "ref": ref, "value": value,
            })
        except CamofoxError:
            return self.type(tab_id, user_id, ref, value)

    def press(self, tab_id: str, user_id: str, key: str) -> dict:
        return self._request("POST", f"/tabs/{tab_id}/press", json={"userId": user_id, "key": key})

    def navigate(
        self,
        tab_id: str,
        user_id: str,
        url: str | None = None,
        macro: str | None = None,
        query: str | None = None,
    ) -> dict:
        body = {"userId": user_id}
        if url:
            body["url"] = url
        if macro:
            body["macro"] = macro
        if query:
            body["query"] = query
        return self._request("POST", f"/tabs/{tab_id}/navigate", json=body)

    def wait(self, tab_id: str, user_id: str, selector: str | None = None, timeout_ms: int = 5000) -> dict:
        body = {"userId": user_id, "timeout": timeout_ms}
        if selector:
            body["selector"] = selector
        return self._request("POST", f"/tabs/{tab_id}/wait", json=body)

    def screenshot_bytes(self, tab_id: str, user_id: str) -> bytes:
        resp = self.session.get(
            f"{self.base_url}/tabs/{tab_id}/screenshot",
            params={"userId": user_id},
            headers=self._headers(),
            timeout=self.timeout,
        )
        resp.raise_for_status()
        return resp.content

    # -- Cookies / sessions ---------------------------------------------------

    def import_cookies(self, user_id: str, cookies: list[dict]) -> dict:
        if not self.access_key:
            raise CamofoxError("CAMOFOX_API_KEY/access_key required for cookie import")
        return self._request("POST", f"/sessions/{user_id}/cookies", json={"cookies": cookies})

    def storage_state(self, user_id: str) -> dict:
        return self._request("GET", f"/sessions/{user_id}/storage_state")

    # -- Helpers ---------------------------------------------------------------

    def wait_for_browser(self, retries: int = 10, delay: float = 1.0) -> None:
        for _ in range(retries):
            try:
                self._request("GET", "/health")
                return
            except Exception:
                time.sleep(delay)
        raise CamofoxError(f"camofox-browser not reachable at {self.base_url}")


def parse_snapshot(snapshot_text: str) -> list[SnapshotItem]:
    """Parse a camofox accessibility snapshot into SnapshotItem records.

    Snapshot renderers differ between camofox-browser versions, and the old
    parser understood exactly one of them:

        [textbox e3] First Name          <- the only form previously handled
        - textbox "First Name" [ref=e3]  <- Playwright-style aria snapshot
        textbox "Email" (e7)

    A format the parser does not recognise yields zero items, which the engines
    report as "no form fields found" -- indistinguishable from a genuinely
    blocked page. Accept all three, and carry any trailing attribute text
    (placeholder, name, required) into the label so field matching has more to
    work with than a bare accessible name.
    """
    items: list[SnapshotItem] = []
    seen: set[str] = set()

    patterns = [
        # [textbox e3] First Name
        re.compile(r"\[(?P<role>[a-zA-Z]+)\s+(?P<ref>e\d+)\]\s*(?P<label>.*)"),
        # - textbox "First Name" [ref=e3]   /   textbox 'Email' [ref=e7]
        re.compile(
            r"(?P<role>[a-zA-Z]+)\s+[\"'](?P<label>[^\"']*)[\"'][^\n]*?\[ref=(?P<ref>e\d+)\]"
        ),
        # textbox "Email" (e7)
        re.compile(r"(?P<role>[a-zA-Z]+)\s+[\"'](?P<label>[^\"']*)[\"']\s*\((?P<ref>e\d+)\)"),
    ]

    for line in snapshot_text.splitlines():
        line = line.strip()
        if not line:
            continue
        for pattern in patterns:
            m = pattern.search(line)
            if not m:
                continue
            ref = m.group("ref")
            if ref in seen:
                break
            seen.add(ref)
            items.append(
                SnapshotItem(
                    ref=ref,
                    role=m.group("role").strip().lower(),
                    label=_clean_label(m.group("label")),
                )
            )
            break
    return items


def _clean_label(label: str) -> str:
    """Normalise an accessible name plus any attributes trailing it."""
    label = label.strip().strip("-").strip()
    # Keep placeholder/name/aria-label values -- they are often the only clue
    # to what a field is -- but drop pure bookkeeping tokens.
    label = re.sub(r"\[(?:ref=e\d+|cursor=[^\]]*)\]", " ", label)
    return re.sub(r"\s+", " ", label).strip()
