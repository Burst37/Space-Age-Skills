"""Regression tests for the Space Age fixes (see IMPROVEMENTS.md)."""

import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stdout, redirect_stderr

from _load import load

sweep = load("sweep")
parity = load("parity")
listing = load("listing")
reviews = load("reviews")


def quiet(fn, *a):
    with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()) as err:
        code = fn(*a)
    return code, err.getvalue()


class Fixes(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.d = self.tmp.name

    def tearDown(self):
        self.tmp.cleanup()

    def put(self, name, text):
        p = os.path.join(self.d, name)
        with open(p, "w", encoding="utf-8") as fh:
            fh.write(text)
        return p

    def test_sweep_config_string_is_not_split_into_letters(self):
        os.makedirs(os.path.join(self.d, "src"))
        self.put("src/a.ts", "export const x = 'hello world'\n")
        cfg = self.put("brand.json", json.dumps({"avoid": "Calendly"}))
        code, _ = quiet(sweep.main, [os.path.join(self.d, "src"), "--config", cfg])
        self.assertEqual(code, 0)  # old code split into C,a,l,... and hit 'hello'

    def test_sweep_warns_on_short_names(self):
        os.makedirs(os.path.join(self.d, "src"))
        self.put("src/a.ts", "checkbox\n")
        code, err = quiet(sweep.main, [os.path.join(self.d, "src"), "--avoid", "Box"])
        self.assertEqual(code, 1)
        self.assertIn("short", err)

    def test_parity_gate_blocks_missing_must(self):
        m = self.put("f.csv", "feature,area,priority,original,clone,notes\n"
                              "a,x,must,yes,no,\n" + "".join(
                                  "c%d,x,could,yes,yes,\n" % i for i in range(40)))
        self.assertEqual(quiet(parity.main, [m])[0], 0)
        self.assertEqual(quiet(parity.main, [m, "--gate"])[0], 1)

    def test_parity_gate_passes_when_musts_done(self):
        m = self.put("f.csv", "feature,area,priority,original,clone,notes\n"
                              "a,x,must,yes,yes,\nb,x,could,yes,no,\n")
        self.assertEqual(quiet(parity.main, [m, "--gate"])[0], 0)

    def test_listing_merges_cli_config_and_file_avoid(self):
        lst = {"avoid": ["Acme Corp"],
               "app_store": {"name": "Slotwise", "description": "Better than Acme Corp."}}
        p = self.put("l.json", json.dumps(lst))
        brand = self.put("brand.json", json.dumps({"avoid": "Calendly"}))
        # old code: --avoid replaced the file's list, so Acme Corp went unchecked
        self.assertEqual(quiet(listing.main, [p, "--avoid", "Other"])[0], 1)
        lst["app_store"]["description"] = "Try it, Calendly users."
        p = self.put("l.json", json.dumps(lst))
        self.assertEqual(quiet(listing.main, [p, "--config", brand])[0], 1)

    def test_listing_string_avoid_not_split(self):
        issues = listing.lint({"avoid": "Calendly",
                               "google_play": {"title": "A b c", "full_description": "a"}})
        self.assertFalse([i for i in issues if "mentions" in i["message"]])

    def test_reviews_bad_today_is_an_error(self):
        p = self.put("r.csv", "source,url,date,rating,text\n"
                              "g2,https://x.test/1,2026-01-01,1,too expensive\n")
        code, err = quiet(reviews.main, [p, "--today", "10/16/2026"])
        self.assertEqual(code, 2)
        self.assertIn("YYYY-MM-DD", err)


if __name__ == "__main__":
    unittest.main()
