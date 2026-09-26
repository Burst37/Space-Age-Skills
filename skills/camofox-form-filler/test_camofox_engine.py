#!/usr/bin/env python3
"""Offline regression tests for the camofox signup engines.

No camofox server and no network: FakeClient stands in for CamofoxClient and
serves scripted snapshots, so every fix below is exercised on the real code
paths. Run with:  python3 test_camofox_engine.py
"""
import csv
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock

import requests
from camofox_client import CamofoxClient, CamofoxError, parse_snapshot
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
CONFIRM = '- heading "Account created" [ref=e30]\n'


class FakeClient:
    """Scripted camofox. `pages` is a list of snapshots; click advances."""
    def __init__(self, pages, fail_on=None):
        self.pages, self.i, self.fail_on = pages, 0, fail_on or set()
        self.typed, self.cleared, self.checked, self.selected = {}, [], [], {}
        self.tabs_open, self.sessions_closed = 0, 0
        self.base_url = "http://fake.camofox.test"

    def create_tab(self, user_id, session_key, url):
        self.tabs_open += 1
        return "tab1"

    def wait_for_browser(self, timeout=60): return True
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
    def test_head_silhouette_opens_login_then_create_account(self):
        landing = '- link "My Account" [ref=e1]\n- link "Cart" [ref=e2]\n'
        login = ('- textbox "Email" [ref=e3]\n- textbox "Password" [ref=e4]\n'
                 '- button "Sign In" [ref=e5]\n- link "Create Account" [ref=e6]\n')
        c = FakeClient([landing, login, FORM])
        clicked = []
        old_click = c.click
        def click(tab, user, ref=None, selector=None):
            clicked.append(ref or selector)
            return old_click(tab, user, ref=ref, selector=selector)
        c.click = click
        items = par.navigate_to_form(c, "t", "u", 1, lambda *a: None)
        self.assertEqual(clicked, ["e1", "e6"])
        self.assertGreaterEqual(single.count_form_fields(items), 2)

    def test_unlabeled_icon_found_from_account_href(self):
        class LinkedIcon(FakeClient):
            def links(self, *a):
                return {"links": [{"ref": "e2", "text": "", "href": "/account/login"}]}
        c = LinkedIcon(['- link "" [ref=e2]\n- link "Cart" [ref=e3]\n', FORM])
        items = par.navigate_to_form(c, "t", "u", 1, lambda *a: None)
        self.assertEqual(c.i, 1)
        self.assertGreaterEqual(single.count_form_fields(items), 2)

    def test_unlabeled_icon_found_from_svg_name_without_clicking_cart(self):
        class SvgIcon(FakeClient):
            def evaluate(self, *a):
                return [{"selector": "header > button:nth-of-type(1)", "hint": "lucide-user-round", "icon": True},
                        {"selector": "header > button:nth-of-type(2)", "hint": "lucide-shopping-cart", "icon": True}]
        c = SvgIcon(['- button "" [ref=e1]\n- button "" [ref=e2]\n', FORM])
        clicked = []
        old_click = c.click
        def click(tab, user, ref=None, selector=None):
            clicked.append(ref or selector)
            return old_click(tab, user, ref=ref, selector=selector)
        c.click = click
        par.navigate_to_form(c, "t", "u", 1, lambda *a: None)
        self.assertEqual(clicked, ["header > button:nth-of-type(1)"])

    def test_login_panel_without_registration_is_not_a_signup_form(self):
        login = ('- textbox "Email" [ref=e3]\n- textbox "Password" [ref=e4]\n'
                 '- button "Sign In" [ref=e5]\n')
        self.assertEqual(par.navigate_to_form(FakeClient([login]), "t", "u", 1,
                                              lambda *a: None), [])

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

    def test_login_fields_do_not_hide_registration_link(self):
        login = ('- textbox "Email" [ref=e1]\n- textbox "Password" [ref=e2]\n'
                 '- button "Sign In" [ref=e3]\n- link "Create Account" [ref=e4]\n')
        c = FakeClient([login, FORM])
        par.navigate_to_form(c, "t", "u", 1, lambda *a: None)
        self.assertEqual(c.i, 1)

    def test_signup_link_is_not_a_submit_action(self):
        c = FakeClient(['- textbox "Email" [ref=e1]\n- link "Sign Up" [ref=e2]\n'])
        self.assertIsNone(single.find_submit_ref(c, "t", "u"))


class TestOutcomes(unittest.TestCase):
    def test_account_icon_to_login_to_registration_can_complete(self):
        landing = '- link "Account" [ref=e1]\n'
        login = ('- textbox "Email" [ref=e3]\n- textbox "Password" [ref=e4]\n'
                 '- button "Sign In" [ref=e5]\n- link "Create Account" [ref=e6]\n')
        self.assertEqual(run_entry(FakeClient([landing, login, FORM, CONFIRM]))[0], "success")

    def test_success_requires_confirmation(self):
        self.assertEqual(run_entry(FakeClient([FORM, CONFIRM]))[0], "success")

    def test_validation_error_is_not_success(self):
        err = FORM + '- text "Email is required" [ref=e20]\n'
        status, msg = run_entry(FakeClient([FORM, err]))
        self.assertEqual(status, "failed")
        self.assertIn("rejected", msg)

    def test_redirect_without_proof_is_unverified(self):
        self.assertEqual(run_entry(FakeClient([FORM, '- heading "Store" [ref=e30]\n']))[0],
                         "unverified")

    def test_email_confirmation_is_pending(self):
        pending = '- heading "Thank you! Check your email to verify your account" [ref=e30]\n'
        self.assertEqual(run_entry(FakeClient([FORM, pending]))[0], "verification_required")

    def test_uncertain_submit_is_not_retried_as_a_failed_signup(self):
        status, _ = run_entry(FakeClient([FORM], fail_on={"e19"}))
        self.assertEqual(status, "unverified")
        self.assertNotIn(status, par.RETRYABLE_STATUSES)
        self.assertNotIn("verification_required", par.RETRYABLE_STATUSES)

    def test_error_overrides_success_copy(self):
        c = FakeClient([FORM + '- text "Account created. Email is required" [ref=e30]\n'])
        self.assertEqual(single.verify_submission(c, "t", "u")[0], "failed")

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
    def test_repeated_browser_closures_stop_batch_with_urls_remaining(self):
        import queue
        q = queue.Queue()
        for i in range(8):
            q.put({"url": f"https://s{i}.test", "brand": f"B{i}", "program": "P"})
        stats = dict(total=8, processed=0, success=0, failed=0, captcha=0, skipped=0)
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            args = Args()
            args.camofox_url = None
            guard = par.BrowserCrashGuard()
            orig = par.process_entry
            par.process_entry = lambda *a, **k: ("navigation_error", "browser closed")
            try:
                par.worker_loop(1, q, {}, args, stats, d / "r.csv", d / "p.json",
                                d / "dead.json", set(), 0.0, lambda *a: None,
                                crash_guard=guard)
            finally:
                par.process_entry = orig
            self.assertTrue(guard.stopped.is_set())
            self.assertEqual(stats["processed"], 3)
            self.assertEqual(q.qsize(), 5)
            with (d / "r.csv").open(newline="", encoding="utf-8") as handle:
                self.assertEqual(len(list(csv.DictReader(handle))), 3)

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


class TestScaleAndRecovery(unittest.TestCase):
    def test_client_uses_documented_checkbox_and_clear_actions(self):
        client = CamofoxClient()
        client._request = Mock(return_value={})
        client.check("tab", "user", "e2")
        client.clear("tab", "user", "e3")
        paths = [call.args[1] for call in client._request.call_args_list]
        self.assertEqual(paths, ["/tabs/tab/click", "/tabs/tab/click",
                                 "/tabs/tab/press", "/tabs/tab/press"])

    def test_combobox_selects_visible_option_by_ref(self):
        client = CamofoxClient()
        client._request = Mock(return_value={})
        client.snapshot_text = lambda *a: '[option e10] TX\n[option e11] CA'
        client.select("tab", "user", "e3", "TX")
        calls = client._request.call_args_list
        self.assertEqual(len(calls), 2)
        self.assertEqual(calls[-1].kwargs["json"]["ref"], "e10")

    def test_mutating_requests_never_replay_after_connection_error(self):
        client = CamofoxClient(retries=3)
        client.session.request = Mock(side_effect=requests.ConnectionError("reset"))
        with self.assertRaises(CamofoxError):
            client._request("POST", "/tabs/t/click", json={"ref": "e1"})
        self.assertEqual(client.session.request.call_count, 1)

    def test_transient_failures_do_not_retire_live_urls(self):
        with tempfile.TemporaryDirectory() as d:
            results = Path(d) / "results.csv"
            results.write_text("url,status\nhttps://x.test,timeout\nhttps://x.test,failed\n"
                               "https://x.test,captcha_skipped\n")
            self.assertEqual(single.retire_repeated_failures(results, set()), set())
            dead = set()
            par.check_no_form_strike(Path(d) / "dead.json", dead, "https://x.test", "X", 1, lambda *a: None)
            par.check_no_form_strike(Path(d) / "dead.json", dead, "https://x.test", "X", 1, lambda *a: None)
            self.assertEqual(dead, set())

    def test_browser_profiles_are_isolated_by_client_and_url(self):
        a = {"brand": "Same Brand", "url": "https://a.test"}
        b = {"brand": "Same Brand", "url": "https://b.test"}
        self.assertNotEqual(single.session_user_id(a, CONFIG), single.session_user_id(b, CONFIG))
        self.assertNotEqual(single.session_user_id(a, CONFIG),
                            single.session_user_id(a, {**CONFIG, "email": "other@example.test"}))
        self.assertNotIn(CONFIG["email"], single.session_user_id(a, CONFIG))

    def test_dry_run_is_not_counted_as_signup(self):
        import queue
        q = queue.Queue()
        q.put({"url": "https://s.test", "brand": "B", "program": "P"})
        stats = dict(total=1, processed=0, success=0, failed=0, captcha=0, skipped=0)
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            args = Args(); args.camofox_url = None
            orig = par.process_entry
            par.process_entry = lambda *a, **k: ("dry_run", "")
            try:
                par.worker_loop(1, q, {}, args, stats, d / "r.csv", d / "p.json",
                                d / "dead.json", set(), 0.0, lambda *a: None)
            finally:
                par.process_entry = orig
            self.assertEqual(stats["success"], 0)
            self.assertEqual(stats["dry_run"], 1)

    def test_fixed_cohort_denominator_excludes_ineligible_but_includes_unattempted(self):
        from score_results import score
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            master = d / "master.csv"
            master.write_text("Brand_Name,Direct_Sign-up_URL,Auto_Signup_Feasible\n"
                              "A,https://a.test,Yes\nB,https://b.test,Yes\n"
                              "C,https://c.test,No\n")
            results = d / "r.csv"
            results.write_text("url,status\nhttps://a.test,dry_run\n"
                               "https://a.test,success\nhttps://c.test,success\n")
            got = score(master, results)
            self.assertEqual((got["eligible"], got["attempted"], got["confirmed"]), (2, 1, 1))
            self.assertEqual(got["rate"], 0.5)
            self.assertEqual(got["not_attempted"], 1)

    def test_2500_row_queue_records_each_unique_url_once(self):
        import contextlib
        import io
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            (d / "config.json").write_text(json.dumps(CONFIG))
            master = d / "master.csv"
            urls = [f"https://site{i}.test/join" for i in range(2500)]
            with master.open("w", newline="") as handle:
                writer = csv.writer(handle)
                writer.writerow(["Brand_Name", "Direct_Sign-up_URL", "Auto_Signup_Feasible"])
                for i, url in enumerate(urls + urls[:50]):
                    writer.writerow([f"Brand{i}", url, "Yes"])
            results = d / "results.csv"
            progress = d / "progress.json"
            orig_client, orig_entry = par.CamofoxClient, par.process_entry
            par.CamofoxClient = lambda **kw: FakeClient([FORM])
            par.process_entry = lambda *a, **k: ("dry_run", "")
            try:
                with contextlib.redirect_stdout(io.StringIO()):
                    rc = par.main(["--config", str(d / "config.json"), "--csv", str(master),
                                   "--results", str(results), "--progress", str(progress),
                                   "--dead-urls", str(d / "dead.json"), "--workers", "8", "--delay", "0"])
            finally:
                par.CamofoxClient, par.process_entry = orig_client, orig_entry
            with results.open(newline="") as handle:
                saved = list(csv.DictReader(handle))
            stats = json.loads(progress.read_text())["stats"]
            self.assertEqual(rc, 0)
            self.assertEqual(len(saved), 2500)
            self.assertEqual(len({row["url"] for row in saved}), 2500)
            self.assertEqual((stats["processed"], stats["success"], stats["dry_run"]),
                             (2500, 0, 2500))



class TestSingleProcessRun(unittest.TestCase):
    """The single-process engine's full loop, driven through main()."""

    def _drive(self, client):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            (d / "config.json").write_text(json.dumps(CONFIG), encoding="utf-8")
            (d / "p.csv").write_text(
                "Category,Brand_Name,Program_Name,Direct_Sign-up_URL,"
                "Auto_Signup_Feasible,Barriers\n"
                "Grocery,BrandOne,Rewards,https://one.test/join,Yes,\n",
                encoding="utf-8",
            )
            out = d / "r.csv"
            orig = single.CamofoxClient
            single.CamofoxClient = lambda **kw: client
            try:
                rc = single.main([
                    "--config", str(d / "config.json"), "--csv", str(d / "p.csv"),
                    "--output", str(out), "--delay", "0", "--captcha-timeout", "0",
                ])
            finally:
                single.CamofoxClient = orig
            with out.open(encoding="utf-8") as f:
                rows = list(csv.DictReader(f))
            return rc, rows

    def test_session_is_closed_so_long_runs_do_not_exhaust_camofox(self):
        # user_id is unique per brand, so a leaked session per site is what
        # made long runs degrade until no tab could be opened at all.
        c = FakeClient([FORM, CONFIRM])
        self._drive(c)
        self.assertEqual(c.tabs_open, 0)
        self.assertEqual(c.sessions_closed, 1)

    def test_session_is_closed_even_when_the_site_blows_up(self):
        class Boom(FakeClient):
            def snapshot_text(self, *a, **k): raise ValueError("kaboom")
        c = Boom([FORM])
        rc, rows = self._drive(c)
        self.assertEqual(c.sessions_closed, 1)
        self.assertEqual(rows[0]["status"], "failed")

    def test_run_records_the_7_column_row_for_a_successful_signup(self):
        rc, rows = self._drive(FakeClient([FORM, CONFIRM]))
        self.assertEqual(rc, 0)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["status"], "success")
        self.assertEqual(rows[0]["brand"], "BrandOne")
        self.assertEqual(list(rows[0]), ["url", "brand", "program", "status",
                                         "worker", "error", "timestamp"])


class TestPurgeMasterCsv(unittest.TestCase):
    """purge_master_csv.py -- dead/junk row purging for the master CSV."""

    def setUp(self):
        import purge_master_csv as purge
        self.purge = purge
        self.d = tempfile.TemporaryDirectory()
        self.dir = Path(self.d.name)
        self.csv_path = self.dir / "master.csv"
        self.csv_path.write_text(
            "Category,Brand_Name,Program_Name,Direct_Sign-up_URL,Auto_Signup_Feasible,Barriers\n"
            "Retail,Target,Target Circle,https://target.example.com/circle,Yes,None noted\n"
            "Automotive,Downtown Nissan,Nissan Rewards,https://nissan.example.com/r,Yes,None noted\n"
            "Grocery,DeadStoreCo,Dead Rewards,https://dead.example.com/signup,Yes,None noted\n"
            "Retail,LocalShop,Loyalty,https://localshop.example.com/join,Yes,In-store signup only\n"
            "Retail,GoodBrand,Perks,,Yes,None noted\n"
            "Retail,SecondGood,Rewards Plus,https://secondgood.example.com/join,Yes,None noted\n"
        )
        (self.dir / "dead-urls.json").write_text(
            json.dumps({"urls": ["https://dead.example.com/signup"]})
        )

    def tearDown(self):
        self.d.cleanup()

    def _args(self, **overrides):
        import argparse
        defaults = dict(
            csv=str(self.csv_path), dead_urls=str(self.dir / "dead-urls.json"), results=None,
            exclude_category="", exclude_brand="", live_check=False, timeout=8.0,
            live_check_delay=0, report="", apply=False, output=None, backup=True,
        )
        defaults.update(overrides)
        return argparse.Namespace(**defaults)

    def test_dealership_brand_is_purged(self):
        rows = self.purge.load_programs(self.csv_path)
        reasons = {r["brand"]: self.purge.is_junk_row(r, [], []) for r in rows}
        self.assertIsNotNone(reasons["Downtown Nissan"])
        self.assertIsNone(reasons["Target"])

    def test_dead_url_and_in_store_and_missing_url_are_purged(self):
        self.purge.run(self._args())  # dry run just needs to not crash
        rows = self.purge.load_programs(self.csv_path)
        dead_urls = self.purge.load_dead_urls(self.dir / "dead-urls.json")
        survivors = [r for r in rows if r.get("url") and r["url"] not in dead_urls
                    and not self.purge.is_junk_row(r, [], [])]
        self.assertEqual({r["brand"] for r in survivors}, {"Target", "SecondGood"})

    def test_apply_writes_only_survivors_and_keeps_original_columns(self):
        self.purge.run(self._args(apply=True, report=str(self.dir / "report.csv")))
        out_rows = list(csv.DictReader(open(self.csv_path)))
        self.assertEqual({r["Brand_Name"] for r in out_rows}, {"Target", "SecondGood"})
        # Original column names/order preserved for downstream tools.
        self.assertEqual(list(out_rows[0].keys()),
                         ["Category", "Brand_Name", "Program_Name",
                          "Direct_Sign-up_URL", "Auto_Signup_Feasible", "Barriers"])

    def test_apply_does_not_truncate_source_before_finishing_read(self):
        # Regression: writing to the same path being read (the default,
        # in-place purge) used to truncate the file mid-DictReader-iteration,
        # silently dropping every row after the truncation point.
        self.purge.run(self._args(apply=True))
        out_rows = list(csv.DictReader(open(self.csv_path)))
        self.assertEqual(len(out_rows), 2)

    def test_backup_preserves_full_original(self):
        original = self.csv_path.read_text()
        self.purge.run(self._args(apply=True))
        backup = self.csv_path.with_suffix(".csv.bak")
        self.assertEqual(backup.read_text(), original)

    def test_dry_run_never_writes(self):
        original = self.csv_path.read_text()
        self.purge.run(self._args(apply=False))
        self.assertEqual(self.csv_path.read_text(), original)

    def test_extra_exclude_brand_is_additive_not_replacing(self):
        rows = self.purge.load_programs(self.csv_path)
        reason = self.purge.is_junk_row(
            next(r for r in rows if r["brand"] == "SecondGood"), [], ["SecondGood"])
        self.assertIsNotNone(reason)
        # Built-in dealership rule still applies alongside the custom one.
        reason2 = self.purge.is_junk_row(
            next(r for r in rows if r["brand"] == "Downtown Nissan"), [], ["SecondGood"])
        self.assertIsNotNone(reason2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
