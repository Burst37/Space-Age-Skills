"""Structure checks: frontmatter, routing table and every referenced file exist."""

import os
import re
import subprocess
import sys
import unittest

from _load import ROOT


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


class Skill(unittest.TestCase):
    def test_frontmatter(self):
        m = re.match(r"^---\n(.*?)\n---\n", read("SKILL.md"), re.S)
        self.assertIsNotNone(m)
        fm = m.group(1)
        self.assertIn("name: replica-skill-sa\n", fm)
        self.assertRegex(fm, r"description: ")
        self.assertIn("Use when", fm)

    def test_every_path_mentioned_exists(self):
        docs = ["SKILL.md"] + ["references/" + f for f in os.listdir(os.path.join(ROOT, "references"))]
        missing = []
        for d in docs:
            for rel in re.findall(r"`((?:references|templates|scripts)/[\w.\-]+)`", read(d)):
                if not os.path.exists(os.path.join(ROOT, rel)):
                    missing.append("%s -> %s" % (d, rel))
            for tool in re.findall(r"\$S/scripts/([\w]+\.py)", read(d)):
                if not os.path.exists(os.path.join(ROOT, "scripts", tool)):
                    missing.append("%s -> scripts/%s" % (d, tool))
        self.assertEqual(missing, [])

    def test_eleven_stage_references(self):
        refs = sorted(f for f in os.listdir(os.path.join(ROOT, "references")) if f.endswith(".md"))
        self.assertEqual(len(refs), 11)
        for r in refs:
            self.assertIn("references/" + r, read("SKILL.md"), r)

    def test_scripts_run_help(self):
        for f in sorted(os.listdir(os.path.join(ROOT, "scripts"))):
            if f.endswith(".py"):
                out = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", f), "--help"],
                                     capture_output=True, text=True)
                self.assertEqual(out.returncode, 0, f + out.stderr)

    def test_original_license_kept(self):
        self.assertIn("Copyright (c) 2026 Jake Schincariol", read("LICENSE"))


if __name__ == "__main__":
    unittest.main()
