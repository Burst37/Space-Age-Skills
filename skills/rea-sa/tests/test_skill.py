"""rea-sa structure + fidelity checks. Standard library only.

    python3 -m unittest discover -s tests -v
"""

import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPSTREAM = os.path.join(ROOT, "tests", "fixtures", "upstream-SKILL.md")
SKILL_BUDGET = 8000  # chars; the always-read body must stay lean


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


def docs():
    return ["SKILL.md"] + ["references/" + f for f in sorted(os.listdir(os.path.join(ROOT, "references")))]


class Skill(unittest.TestCase):
    def test_frontmatter(self):
        m = re.match(r"^---\n(.*?)\n---\n", read("SKILL.md"), re.S)
        self.assertIsNotNone(m)
        self.assertIn("name: rea-sa\n", m.group(1))
        self.assertIn("Use when", m.group(1))
        self.assertIn("Not for", m.group(1))

    def test_skill_md_is_lean(self):
        self.assertLess(len(read("SKILL.md")), SKILL_BUDGET)

    def test_paths_and_relative_links_resolve(self):
        bad = []
        for d in docs():
            text = read(d)
            for rel in re.findall(r"`((?:references|templates)/[\w.\-]+)`", text):
                if not os.path.exists(os.path.join(ROOT, rel)):
                    bad.append("%s -> %s" % (d, rel))
            for link in re.findall(r"\]\(([^)#]+)(?:#[^)]*)?\)", text):
                if link.startswith(("http://", "https://")):
                    continue
                if not os.path.exists(os.path.join(ROOT, os.path.dirname(d), link)):
                    bad.append("%s -> %s" % (d, link))
        self.assertEqual(bad, [])

    def test_no_upstream_identifier_lost(self):
        upstream = read(os.path.relpath(UPSTREAM, ROOT))
        names = set(re.findall(r"`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`", upstream))
        here = "".join(read(d) for d in docs())
        self.assertEqual(sorted(n for n in names if n not in here), [])

    def test_moved_sections_are_verbatim(self):
        up = read(os.path.relpath(UPSTREAM, ROOT)).replace("](references/", "](")
        moved = read("references/connect-and-cli.md") + read("references/target-routing.md") \
            + read("references/summary-first.md")
        for heading in ("## Connect only when needed", "## Route the target first",
                        "## Work summary-first"):
            body = up.split(heading, 1)[1].split("\n## ", 1)[0].strip()
            self.assertIn(body, moved, heading)

    def test_authorization_gate_and_clean_room(self):
        s = read("SKILL.md")
        for must in ("Authorization gate", "Refuse:", "DRM", "Never paste decompiled",
                     "observed / inferred / unknown"):
            self.assertIn(must, s)

    def test_license_and_disclaimer_kept(self):
        self.assertIn("Copyright (c) 2026 morluto", read("LICENSE"))
        self.assertIn("Responsible use", read("DISCLAIMER.md"))


if __name__ == "__main__":
    unittest.main()
