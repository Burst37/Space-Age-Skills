"""A source card can look well cited and retain no evidence at all (#194).

Reported from a real audit: 68 source cards with local summaries, 0 URL-only
cards, but 32 bounded source groups feeding 24 cards, those cards supporting 8
concept notes and 1 synthesis note - and the structural, wanted-link, typed-edge
and freshness checks all passed. Structural health was green while the evidence
under a slice of the vault was a live URL and an excerpt.

`capture_scope` makes retention machine-readable, and these pin the three things
worth reporting about it. The floor for "retains nothing" is deliberately tiny:
this is not a judgement about how long a source should be, and a captured tweet
must not ring.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "scripts"))

import vault_health as vh  # noqa: E402

FM = "---\ntype: source\ndate: 2026-09-13\ntags: [source]\n{extra}ai-first: true\n---\n\n"


def _source(vault: Path, rel: str, *, scope: str | None, body: str) -> None:
    path = vault / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    extra = f"capture_scope: {scope}\n" if scope else ""
    path.write_text(FM.format(extra=extra) + body, encoding="utf-8")


def _note(vault: Path, rel: str, body: str, ntype: str = "concept") -> None:
    path = vault / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f"---\ntype: {ntype}\ndate: 2026-09-13\ntags: [{ntype}]\nai-first: true\n---\n\n"
        f"## For future agent\nsummary\n\n{body}\n",
        encoding="utf-8",
    )


@pytest.fixture()
def vault(tmp_path):
    v = tmp_path / "vault"
    v.mkdir()
    return v


def _findings(vault: Path):
    return vh.check_source_payload(vh.load_vault(vault), vault)


def test_a_fully_retained_source_is_silent(vault):
    _source(vault, "raw/articles/good.md", scope="full-local", body="the article text " * 40)
    assert _findings(vault) == []


def test_a_short_but_complete_source_does_not_ring(vault):
    """A captured tweet is three lines and complete. The check must not turn
    into an opinion about length."""
    _source(vault, "raw/articles/tweet.md", scope="full-local",
            body="Shipping the thing today. It took four months and one rewrite.")
    assert _findings(vault) == []


def test_a_source_claiming_retention_with_no_body_is_an_error(vault):
    """Self-contradiction inside one file, so no policy is needed to call it."""
    _source(vault, "raw/articles/hollow.md", scope="full-local", body="see url\n")
    issues = _findings(vault)
    assert len(issues) == 1
    assert issues[0]["severity"] == "error"
    assert issues[0]["files"] == ["raw/articles/hollow.md"]
    assert "claims evidence it does not hold" in issues[0]["message"]
    assert "url-only" in issues[0]["message"], "the error does not say what the honest fix is"


def test_a_url_only_source_nothing_depends_on_is_silent(vault):
    """Keeping only a locator is a legitimate choice, and sometimes the only
    lawful one. On its own it is not a finding."""
    _source(vault, "raw/articles/locator.md", scope="url-only", body="See the source URL.")
    assert _findings(vault) == []


def test_active_knowledge_resting_on_a_url_only_source_is_reported(vault):
    _source(vault, "raw/articles/locator.md", scope="url-only", body="See the source URL.")
    _note(vault, "Knowledge/Claim.md", "Per [[locator]] the rate held through Q3.")
    _note(vault, "Knowledge/Synthesis.md", "Building on [[locator]] and other reading.",
          ntype="synthesis")

    issues = _findings(vault)
    assert len(issues) == 1
    assert issues[0]["severity"] == "warning"
    assert issues[0]["files"][0] == "raw/articles/locator.md"
    assert set(issues[0]["files"][1:]) == {"Knowledge/Claim.md", "Knowledge/Synthesis.md"}
    assert "2 note(s) rest on it" in issues[0]["message"]


def test_one_raw_source_citing_another_is_not_active_knowledge(vault):
    """Raw captures cross-reference each other (a superseded capture links its
    replacement). That is bookkeeping, not a claim built on missing evidence."""
    _source(vault, "raw/articles/locator.md", scope="url-only", body="See the source URL.")
    _source(vault, "raw/articles/newer.md", scope="full-local",
            body="Supersedes [[locator]].\n" + "the article text " * 40)
    assert _findings(vault) == []


def test_sources_with_no_capture_scope_are_one_info_line_not_a_wall(vault):
    """A research vault holds thousands of pre-existing sources. One finding per
    note would bury the two that matter."""
    for i in range(40):
        _source(vault, f"raw/articles/legacy{i}.md", scope=None, body="the article text " * 40)
    issues = _findings(vault)
    assert len(issues) == 1, "an unscoped source produced a finding per note"
    assert issues[0]["severity"] == "info"
    assert "40 source note(s)" in issues[0]["message"]
    assert len(issues[0]["files"]) == 40, "the finding does not carry the full list for a fixer"


def test_strict_local_raises_severity_without_inventing_findings(vault):
    _source(vault, "raw/articles/locator.md", scope="url-only", body="See the source URL.")
    _source(vault, "raw/articles/legacy.md", scope=None, body="the article text " * 40)
    _note(vault, "Knowledge/Claim.md", "Per [[locator]] the rate held.")

    before = _findings(vault)
    assert sorted(i["severity"] for i in before) == ["info", "warning"]

    (vault / ".vault-config.json").write_text(
        json.dumps({"exclude-dirs": ["Archive"], "source_policy": "strict-local"}), encoding="utf-8"
    )
    after = _findings(vault)
    assert len(after) == len(before), "strict mode invented a finding instead of raising one"
    assert sorted(i["severity"] for i in after) == ["error", "warning"]


@pytest.mark.parametrize(("config", "expected"), [
    (None, "default"),
    ("{not json", "default"),
    ("[]", "default"),
    ('{"exclude-dirs": ["x"]}', "default"),
    ('{"source_policy": "default"}', "default"),
    ('{"source_policy": true}', "default"),
    ('{"source_policy": "yolo"}', "default"),
    ('{"source_policy": " STRICT-LOCAL "}', "strict-local"),
    ('{"source_policy": "strict-local"}', "strict-local"),
])
def test_the_policy_is_never_inferred(vault, config, expected):
    """Same contract as rewrite_policy (#250): only an explicit value opts in."""
    if config is not None:
        (vault / ".vault-config.json").write_text(config, encoding="utf-8")
    assert vh.load_source_policy(vault) == expected


def test_the_check_is_wired_into_the_health_run(vault):
    _source(vault, "raw/articles/hollow.md", scope="full-local", body="see url\n")
    result = vh.run_health_check(vault)
    assert "Source payload" in result["counts"], (
        "check_source_payload exists but run_health_check never calls it"
    )
    assert result["counts"]["Source payload"] == 1


def test_the_schema_documents_the_field_and_the_copyright_boundary():
    """The durability fix a reader reaches for first is copying the whole page,
    and technical access is not permission. The spec has to say so where the
    field is defined, not only in an issue thread."""
    spec = (REPO_ROOT / "references" / "ai-first-rules.md").read_text(encoding="utf-8")
    at = spec.index("### `type: source`")
    section = spec[at:spec.index("## Documented exceptions", at)]
    assert "capture_scope" in section
    for value in ("full-local", "bounded-local", "url-only"):
        assert f"`{value}`" in section, f"the schema does not define {value}"
    lowered = section.lower()
    assert "permission" in lowered and "copyrighted" in lowered, (
        "the schema does not warn against solving durability by copying the whole work"
    )
    assert "strict-local" in section, "the schema does not name the opt-in policy"
