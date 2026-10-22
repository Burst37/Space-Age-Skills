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
import time
from dataclasses import dataclass
from typing import Optional

import requests


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
    ):
        self.base_url = (base_url or os.environ.get("CAMOFOX_URL") or "http://localhost:9377").rstrip("/")
        self.access_key = access_key or os.environ.get("CAMOFOX_ACCESS_KEY")
        self.timeout = timeout
        self.session = requests.Session()

    def _headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.access_key:
            headers["Authorization"] = f"Bearer {self.access_key}"
        return headers

    def _request(self, method: str, path: str, **kwargs) -> dict:
        resp = self.session.request(
            method,
            f"{self.base_url}{path}",
            headers=self._headers(),
            timeout=self.timeout,
            **kwargs,
        )
        if resp.status_code >= 400:
            raise CamofoxError(f"{method} {path} -> {resp.status_code}: {resp.text[:500]}")
        if resp.content:
            return resp.json()
        return {}

    # -- Tabs --------------------------------------------------------------

    def create_tab(self, user_id: str, session_key: str, url: str, trace: bool = False) -> str:
        body = {"userId": user_id, "sessionKey": session_key, "url": url}
        if trace:
            body["trace"] = True
        data = self._request("POST", "/tabs", json=body)
        return data["tabId"]

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
    """Parse a camofox accessibility snapshot into (ref, role, label) tuples.

    Snapshot lines look like: "[textbox e3] First Name" or "[button e7] Sign Up"
    """
    import re

    items: list[SnapshotItem] = []
    pattern = re.compile(r"\[(?P<role>\w+)\s+(?P<ref>e\d+)\]\s*(?P<label>.*)")
    for line in snapshot_text.splitlines():
        m = pattern.search(line.strip())
        if m:
            items.append(SnapshotItem(ref=m.group("ref"), role=m.group("role"), label=m.group("label").strip()))
    return items
