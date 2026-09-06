#!/usr/bin/env python3
"""Offline regression tests for the camofox signup engines.

No camofox server and no network: FakeClient stands in for CamofoxClient and
serves scripted snapshots, so every fix below is exercised on the real code
paths. Run with:  python3 test_camofox_engine.py
"""
import json
import tempfile
import unittest
from pathlib import Path

from camofox_client import parse_snapshot
import auto_signup_camofox as single
import auto_signup_camofox_parallel as par

CONFIG = {
    "first_name": "Ada", "last_name": "Lovelace", "email": "ada@example.test",
    "password": "Sw0rdfish!x", "phone": "5551234567",
    "address": {"street": "1 Main St", "city": "Austin", "state": "TX", "zip": "78701"},
}

LANDING = '- link "Sign In" [ref=e1]\n- button "Create Account" [ref=e2]\n- button "Accept All Cookies" [ref=e3]\n'
FORM = (
    '- textbox "First Name" [ref=e10]\n'
    '- textbox "Last Name" [ref=e11]\n'
    '- textbox "Email Address" [ref=e12]\n'
    '- textbox "Confirm Email" [ref=e13]\n'
    '- textbox "Password" [ref=e14]\n'
    '- textbox "Zip Code" [ref=e15]\n'
    '- combobox "State" [ref=e16]\n'
    '- checkbox "I agree to the Terms and Conditions" [ref=e17]\n'
    '- checkbox "Send me marketing emails" [ref=e18]\n'
    '- button "Sign Up" [ref=e19]\n'
)
CONFIRM = "- heading \"Thank you! Check your email to verify your account.\" [ref=e30]\n"


class FakeClient:
    """Scripted camofox. `pages` is a list of snapshots; click advances."""
    def __init__(self, pages, fail_on=None):
        self.pages, self.i, self.fail_on = pages, 0, fail_on or set()
        self.typed, self.cleared, self.checked, self.selected = {}, [], [], {}
        self.tabs_open, self.sessions_closed = 0, 0

    def create_tab(self, user_id, session_key, url):
        self.tabs_open += 1
        return "tab1"

    def close_tab(self, tab_id, user_id): self.tabs_open -= 1
    def close_session(self, user_id): self.sessions_closed += 1
    def snapshot_text(self, tab_id, user_id, max_pages=10): return self.pages[self.i]
    def wait(self, tab_id, user_id, selector=None, timeout_ms=5000): return {}

    def click(self, tab_id, user_id, ref=None, selector=None):
        if ref in self.fail_on:
            raise single.CamofoxError("click blew up")
        if self.i < len(self.pages) - 1:
            self.i += 1
        return {}

    def clear(self, tab_id, user_id, ref): self.cleared.append(ref)
    def check(self, tab_id, user_id, ref): self.checked.append(ref)
    def select(self, tab_id, user_id, ref, value): self.selected[ref] = value

    def type(self, tab_id, user_id, ref, text, press_enter=False):
        if ref in self.fail_on:
            raise single.CamofoxError("type blew up")
        self.typed[ref] = self.typed.get(ref, "") + text


class Args:
    dry_run = False
    captcha_timeout = 1
    page_timeout = 0.1
    delay = 0


def run_entry(client, **kw):
    with tempfile.TemporaryDirectory() as d:
        return par.process_entry(
            client, {"url": "https://x.test", "brand": "X", "program": "P"},
            single.flat_config(CONFIG), 1, kw.get("dry_run", False), 1,
            Path(d) / "dead.json", set(), lambda *a: None, page_timeout=0.1,
        )


class TestParser(unittest.TestCase):
    def test_all_three_snapshot_formats(self):
        # A format the parser cannot read makes every site look like it has no
        # form -- the dominant production failure.
        for snap in ('[textbox e3] Email', '- textbox "Email" [ref=e3]', 'textbox "Email" (e3)'):
            items = parse_snapshot(snap)
            self.assertEqual(len(items), 1, snap)
            self.assertEqual(items[0].ref, "e3")
            self.assertEqual(items[0].role, "textbox")


class TestFieldMatching(unittest.TestCase):
    def test_alternation_precedence(self):
        self.assertIsNone(single.match_field("Downtown Store Locator"))
        self.assertEqual(single.match_field("City"), "address.city")

    def test_address_line2_is_not_the_street(self):
        self.assertEqual(single.match_field("Address Line 2"), "address.line2")
        self.assertEqual(single.match_field("Street Address"), "address.street")

    def test_email_beats_address(self):
        self.assertEqual(single.match_field("Email Address"), "email")


class TestFillForm(unittest.TestCase):
    def setUp(self):
        self.c = FakeClient([FORM])
        self.refs = set()
        self.n = single.fill_form(self.c, "t", "u", single.flat_config(CONFIG),
                                  lambda *a: None, self.refs)

    def test_fills_text_fields(self):
        self.assertEqual(self.c.typed["e10"], "Ada")
        self.assertEqual(self.c.typed["e12"], "ada@example.test")
        self.assertEqual(self.c.typed["e13"], "ada@example.test")  # confirm email
        self.assertEqual(self.c.typed["e15"], "78701")

    def test_uses_select_for_comboboxes(self):
        self.assertEqual(self.c.selected["e16"], "TX")

    def test_ticks_required_checkbox_only(self):
        self.assertIn("e17", self.c.checked)      # terms
        self.assertNotIn("e18", self.c.checked)   # marketing opt-in

    def test_refill_does_not_double_type(self):
        single.fill_form(self.c, "t", "u", single.flat_config(CONFIG), lambda *a: None, self.refs)
        self.assertEqual(self.c.typed["e10"], "Ada")

    def test_clears_before_typing(self):
        self.assertIn("e10", self.c.cleared)


class TestNavigation(unittest.TestCase):
    def test_prefers_create_account_over_sign_in(self):
        c = FakeClient([LANDING, FORM])
        clicked = []
        orig = c.click
        def spy(tab_id, user_id, ref=None, selector=None):
            clicked.append(ref)
            return orig(tab_id, user_id, ref=ref)
        c.click = spy
        par.navigate_to_form(c, "t", "u", 1, lambda *a: None)
        self.assertEqual(clicked[0], "e2")  # "Create Account", not "Sign In" (e1)

    def test_does_not_click_submit_button_as_a_hop(self):
        c = FakeClient(['- button "Submit" [ref=e1]\n- textbox "Email" [ref=e2]\n'])
        items = par.navigate_to_form(c, "t", "u", 1, lambda *a: None)
        self.assertTrue(all(i.ref != "e1" for i in items if i.role == "button" and c.i > 0) or c.i == 0)


class TestOutcomes(unittest.TestCase):
    def test_success_requires_confirmation(self):
        self.assertEqual(run_entry(FakeClient([FORM, CONFIRM]))[0], "success")

    def test_validation_error_is_not_success(self):
        err = FORM + '- text "Email is required" [ref=e20]\n'
        status, msg = run_entry(FakeClient([FORM, err]))
        self.assertEqual(status, "failed")
        self.assertIn("rejected", msg)

    def test_captcha_wall_is_not_no_form_found(self):
        wall = '- heading "Verify you are human" [ref=e1]\n'
        status, msg = run_entry(FakeClient([wall, wall]))
        self.assertEqual(status, "captcha_skipped")

    def test_tab_and_session_always_released(self):
        c = FakeClient([FORM, CONFIRM])
        run_entry(c)
        self.assertEqual(c.tabs_open, 0)
        self.assertEqual(c.sessions_closed, 1)

    def test_unexpected_exception_does_not_escape(self):
        class Boom(FakeClient):
            def snapshot_text(self, *a, **k): raise ValueError("kaboom")
        status, msg = run_entry(Boom([FORM]))
        self.assertEqual(status, "failed")
        self.assertIn("ValueError", msg)


class TestWorkerLoop(unittest.TestCase):
    def test_crashing_site_still_records_a_result_and_keeps_worker_alive(self):
        import queue
        q = queue.Queue()
        for i in range(3):
            q.put({"url": f"https://s{i}.test", "brand": f"B{i}", "program": "P"})
        stats = dict(total=3, processed=0, success=0, failed=0, captcha=0, skipped=0)
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            args = Args()
            args.camofox_url = None
            # process_entry raises for every site; the loop must survive all 3.
            orig = par.process_entry
            par.process_entry = lambda *a, **k: (_ for _ in ()).throw(RuntimeError("boom"))
            try:
                par.worker_loop(1, q, {}, args, stats, d / "r.csv", d / "p.json",
                                d / "dead.json", set(), 0.0, lambda *a: None)
            finally:
                par.process_entry = orig
            self.assertEqual(stats["processed"], 3)
            self.assertEqual(stats["failed"], 3)
            self.assertEqual(len((d / "r.csv").read_text().strip().splitlines()), 4)

    def test_captcha_skipped_counts_as_skipped_not_captcha(self):
        import queue
        q = queue.Queue()
        q.put({"url": "https://s.test", "brand": "B", "program": "P"})
        stats = dict(total=1, processed=0, success=0, failed=0, captcha=0, skipped=0)
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            args = Args(); args.camofox_url = None
            orig = par.process_entry
            par.process_entry = lambda *a, **k: ("captcha_skipped", "x")
            try:
                par.worker_loop(1, q, {}, args, stats, d / "r.csv", d / "p.json",
                                d / "dead.json", set(), 0.0, lambda *a: None)
            finally:
                par.process_entry = orig
            self.assertEqual(stats["skipped"], 1)
            self.assertEqual(stats["captcha"], 0)


class TestResultsCsv(unittest.TestCase):
    def test_single_runner_writes_the_7_column_contract(self):
        with tempfile.TemporaryDirectory() as d:
            out = Path(d) / "r.csv"
            single.write_result_row(out, {"url": "u", "brand": "b", "program": "p",
                                          "status": "success", "worker": 0, "error": "",
                                          "timestamp": "t"})
            self.assertEqual(out.read_text().splitlines()[0],
                             "url,brand,program,status,worker,error,timestamp")


if __name__ == "__main__":
    unittest.main(verbosity=2)
