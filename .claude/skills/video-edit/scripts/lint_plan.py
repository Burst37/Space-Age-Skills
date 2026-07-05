#!/usr/bin/env python3
"""
Lint a broll_plan.json before render.

Enforces the rules from SKILL.md:
- every entry has start_sec, end_sec, kind
- every entry has a non-empty `reason`
- static/icon/video entries have an existing image_path on disk
- list entries have a non-empty items array
- icon entries default-anchor to "center" (warn if explicitly cornered)
- no two beats overlap in time

Exit codes:
  0  PASS
  1  FAIL — at least one error
  2  usage error
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

# Motion-library device names (the `viz` catalog) — loaded so a viz beat that
# names an unknown device fails lint instead of rendering a silent blank.
def _load_motion_viz_names() -> set[str]:
    try:
        cat = Path(__file__).resolve().parent.parent / "motion" / "catalog.json"
        data = json.loads(cat.read_text())
        return set((data.get("vizzes") or {}).keys())
    except Exception:
        return set()

_MOTION_VIZ_NAMES = _load_motion_viz_names()

VALID_KINDS = {
    # Legacy
    "static", "video", "icon", "list",
    # Template library
    "title_card", "vertical_timeline", "horizontal_timeline", "callout", "stat_punch",
    "quote_pull", "vs_split", "keyword_chips", "progress_steps",
    "chapter_bar", "ai_image_on_grid",
    "metric_reveal", "notification_toast",
    "chat_message", "stat_grid", "flow_diagram", "bulleted_list", "comparison_grid",
    "bar_chart", "network_diagram", "annotated_screenshot",
    "cinematic_title", "ticker_feed", "split_reveal",
    "lower_third", "corner_stat", "side_panel",
    "word_pop", "hook_title", "subscribe", "image_card", "headline_card",
    "bar_overlay", "bullet_burst", "portrait_burst",
    "tool_logo_burst", "agent_avatar_burst", "org_diagram", "claude_code_terminal",
    "broll_picker", "password_type",
    "inline_chart", "ratio_dots", "dashboard_card",
    "kinetic_statement", "concept_build", "network_spread", "command_deck",
    "calendar_months", "layer_stack",
    # ⭐ Cinematic motion library — the new content-driven viz layer.
    "viz",
}
# Kinds that need an image_path on disk
IMAGE_KINDS = {"static", "icon", "video", "ai_image_on_grid", "image_card"}


def probe_aspect(path: Path) -> tuple[int, int] | None:
    """Return (w, h) of the first video stream, or None if path isn't a video."""
    try:
        out = subprocess.check_output([
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height",
            "-of", "csv=p=0", str(path),
        ], stderr=subprocess.DEVNULL).decode().strip()
        w_s, h_s = out.split(",")[:2]
        return int(w_s), int(h_s)
    except Exception:
        return None


def aspect_label(w: int, h: int) -> str:
    if h > w * 1.4:
        return "portrait (9:16)"
    if w > h * 1.4:
        return "landscape (16:9)"
    return "square-ish"


def aspect_compatible(src_w: int, src_h: int, asset_w: int, asset_h: int) -> bool:
    """Asset is 'compatible' if its aspect ratio is within 15% of source's."""
    if asset_h == 0 or src_h == 0:
        return True
    src_ratio = src_w / src_h
    asset_ratio = asset_w / asset_h
    return abs(src_ratio - asset_ratio) / src_ratio <= 0.15


def lint(plan_path: Path, source_video: Path | None = None) -> int:
    if not plan_path.exists():
        print(f"plan not found: {plan_path}", file=sys.stderr)
        return 2
    plan = json.loads(plan_path.read_text())
    plan_dir = plan_path.parent
    errors: list[str] = []
    warnings: list[str] = []

    src_dims = probe_aspect(source_video) if source_video else None
    if src_dims:
        print(f"source: {src_dims[0]}x{src_dims[1]} ({aspect_label(*src_dims)})")

    # Partial / overlay kinds compose on a SEPARATE layer from full-frame
    # takeovers (and from each other) — they leave the speaker visible, so they
    # are allowed to overlap anything. Only EXCLUSIVE full-frame takeovers must
    # not overlap. A `video` beat with overlay:true is a floating card, NOT a
    # takeover — also non-exclusive.
    PARTIAL_KINDS = {
        "icon", "chapter_bar", "notification_toast", "lower_third", "corner_stat",
        "side_panel", "word_pop", "hook_title", "subscribe", "image_card",
        "headline_card", "bar_overlay", "portrait_burst", "tool_logo_burst",
        "agent_avatar_burst", "ratio_dots", "inline_chart", "claude_code_terminal",
        "dashboard_card",
    }

    last_end = -1.0
    for i, b in enumerate(plan):
        ctx = f"[beat #{i} @ {b.get('start_sec', '?')}s]"
        kind = b.get("kind", "static")
        if kind not in VALID_KINDS:
            errors.append(f"{ctx} unknown kind: {kind!r}")
            continue
        if "start_sec" not in b or "end_sec" not in b:
            errors.append(f"{ctx} missing start_sec/end_sec")
            continue
        start = float(b["start_sec"])
        end = float(b["end_sec"])
        if end <= start:
            errors.append(f"{ctx} end_sec <= start_sec")
        is_exclusive = (kind not in PARTIAL_KINDS) and not b.get("overlay")
        if is_exclusive:
            if start < last_end - 0.01:
                errors.append(f"{ctx} overlaps previous beat (ends at {last_end:.2f}s)")
            last_end = max(last_end, end)

        reason = (b.get("reason") or "").strip()
        if not reason:
            errors.append(f"{ctx} missing `reason`. Every visual must justify itself in one line.")
        elif len(reason) < 12:
            warnings.append(f"{ctx} `reason` is suspiciously short: {reason!r}")

        if kind in IMAGE_KINDS:
            img = b.get("image_path", "")
            if not img:
                errors.append(f"{ctx} {kind} kind requires image_path")
            else:
                name = os.path.basename(img)
                search = [plan_dir, plan_dir / "broll", plan_dir.parent,
                          plan_dir.parent / "broll", plan_dir.parent / "motion"]
                resolved: Path | None = None
                for d in search:
                    if (d / name).exists():
                        resolved = d / name
                        break
                if resolved is None:
                    errors.append(f"{ctx} image_path not found on disk: {img}")
                elif src_dims and kind == "static":
                    asset_dims = probe_aspect(resolved)
                    if asset_dims and not aspect_compatible(*src_dims, *asset_dims):
                        fit = b.get("fit", "contain")
                        if fit == "cover":
                            errors.append(
                                f"{ctx} fit=cover with mismatched aspect "
                                f"(asset {asset_dims[0]}x{asset_dims[1]} vs source {src_dims[0]}x{src_dims[1]}) — "
                                f"the comp will crop most of the image. Either re-source at the source's aspect "
                                f"or drop fit=cover (default 'contain' will letterbox cleanly)."
                            )
                        else:
                            warnings.append(
                                f"{ctx} aspect mismatch: asset is {asset_dims[0]}x{asset_dims[1]}, "
                                f"source is {src_dims[0]}x{src_dims[1]} — will letterbox. "
                                f"Re-source at source aspect for full-frame fill."
                            )

        if kind == "icon":
            anchor = b.get("anchor", "center")
            if anchor != "center":
                warnings.append(
                    f"{ctx} icon anchored to {anchor!r}; default `center` reads better — "
                    "only deviate if you're intentionally working around the speaker's framing."
                )

        if kind == "list":
            items = b.get("items", [])
            if not items or not isinstance(items, list):
                errors.append(f"{ctx} list kind requires non-empty `items` array")
            elif len(items) > 7:
                warnings.append(f"{ctx} list has {len(items)} items; over 5 starts to feel cluttered")

            # Last-item dwell rule: the last item must remain visible for ≥1.5s
            # before the list disappears. Otherwise the final point flashes and
            # the viewer can't read it.
            if items:
                last = items[-1]
                if isinstance(last, dict) and "appear_sec" in last:
                    last_app = float(last["appear_sec"])
                    dwell = end - last_app
                    if dwell < 1.5:
                        warnings.append(
                            f"{ctx} last item dwells only {dwell:.2f}s before list ends — "
                            "extend `end_sec` so the final row gets ≥1.5s of visibility "
                            "(or re-run scripts/sync_list_items.py)."
                        )

            if end - start > 3.0:
                # Span > 3s and items are plain strings → all items front-load and
                # spoiler the punchline. Run sync_list_items.py or hand-pin them.
                plain_strings = sum(1 for it in items if isinstance(it, str))
                if plain_strings > 1:
                    warnings.append(
                        f"{ctx} list spans {end - start:.1f}s with {plain_strings} plain-string item(s) — "
                        "the comp will auto-stagger them in the first 60% of the window, which spoils later "
                        "points. Use `appear_sec` per item or run scripts/sync_list_items.py."
                    )

        # Per-kind required-field check. Each template needs specific
        # content fields populated or it renders blank/incomplete (e.g. a
        # huge "25" with no caption, an empty callout box, etc).
        REQUIRED = {
            "stat_punch":         ["value", "caption"],
            "callout":            ["callout_prefix", "callout_highlight"],
            "quote_pull":         ["quote_text"],
            "title_card":         ["number", "title"],
            "chapter_bar":        ["chapter_number", "chapter_title"],
            "ai_image_on_grid":   ["image_path"],
            "image_card":         ["image_path"],
            "headline_card":      ["kicker", "headline"],
            "bar_overlay":        ["bars"],
            "bullet_burst":       ["items"],
            "portrait_burst":     ["items"],
            "tool_logo_burst":    ["items"],
            "broll_picker":       ["items"],
            "agent_avatar_burst": ["items"],
            "org_diagram":        ["nodes"],
            "claude_code_terminal": ["lines"],
            "inline_chart":       ["data"],
            "ratio_dots":         ["total", "marked"],
            "dashboard_card":     ["stats"],
            "kinetic_statement":  ["words"],
            "concept_build":      ["elements"],
            "network_spread":     ["center_label", "spokes"],
            "command_deck":       ["tiles"],
            "calendar_months":    ["caption"],
            "layer_stack":        ["layers"],
            "viz":                ["viz", "props"],
            "static":             ["image_path"],
            "video":              ["image_path"],
            "keyword_chips":      ["chips"],
            "progress_steps":     ["progress"],
            "vertical_timeline":  ["steps"],
            "horizontal_timeline": ["steps"],
            "metric_reveal":      ["target", "caption"],
            "notification_toast": ["app_name", "title", "body"],
            "chat_message":       ["messages"],
            "stat_grid":          ["stats"],
            "flow_diagram":       ["nodes"],
            "bulleted_list":      ["bullets"],
            "comparison_grid":    ["columns", "rows"],
            "bar_chart":          ["bars"],
            "network_diagram":    ["network_nodes", "network_edges"],
            "annotated_screenshot": ["image_path", "highlights"],
            "cinematic_title":    ["chapter", "title"],
            "ticker_feed":        ["ticker_items"],
            "split_reveal":       ["before_image", "after_image"],
            "lower_third":        ["callout_highlight"],
            "corner_stat":        ["value"],
            "side_panel":         ["side_items"],
            "word_pop":           ["items"],
            # hook_title checked separately below (flank mode needs different
            # fields than the kicker+title lockup).
            # `list` and `vs_split` checked separately below since they
            # need richer validation (item arrays, label strings, etc).
        }
        for required_field in REQUIRED.get(kind, []):
            val = b.get(required_field)
            empty = (val is None or val == "" or
                     (isinstance(val, list) and len(val) == 0))
            if empty:
                errors.append(
                    f"{ctx} {kind} requires non-empty `{required_field}`. "
                    f"Without it the comp renders incomplete (e.g. a huge "
                    f"number with no caption, or an empty callout box). "
                    f"See SKILL.md §4x for the per-kind required-fields "
                    f"table."
                )

        if kind == "viz":
            # The `viz` name must be a real device in the motion registry, or the
            # comp renders NOTHING (unknown name → null). Validate against the
            # catalog so a typo fails loudly here instead of a silent blank beat.
            name = b.get("viz")
            if name and name not in _MOTION_VIZ_NAMES:
                known = ", ".join(sorted(_MOTION_VIZ_NAMES)[:12])
                errors.append(
                    f"{ctx} viz beat names unknown device `{name}`. It will render "
                    f"blank. Use a device from motion/catalog.json (e.g. {known} …). "
                    f"See SKILL.md §4motion."
                )

        if kind == "hook_title":
            if b.get("align") == "flank":
                for fld in ("left_text", "right_text"):
                    if not b.get(fld):
                        errors.append(
                            f"{ctx} hook_title align=flank requires non-empty "
                            f"`{fld}` (the text block flanking that side of "
                            f"the speaker's face)."
                        )
            else:
                for fld in ("kicker", "title"):
                    if not b.get(fld):
                        errors.append(
                            f"{ctx} hook_title requires non-empty `{fld}` "
                            f"(or use align=flank with left_text/right_text)."
                        )

        # Text overlays must NEVER overlay the speaker's head/face — they sit
        # in the lower third. A `vertical` anchor below 0.58 reaches up into
        # the face zone of a centered talking head. (SKILL.md rule 4al.)
        if kind in {"word_pop", "hook_title"} and b.get("align") != "flank":
            v = b.get("vertical")
            if isinstance(v, (int, float)) and v < 0.58:
                errors.append(
                    f"{ctx} {kind} has vertical={v} — text must NEVER overlay "
                    f"the speaker's head/face. Keep `vertical` ≥ 0.60 "
                    f"(lower third). See SKILL.md rule 4al."
                )

        if kind == "vs_split":
            top_items = b.get("top_items") or []
            bottom_items = b.get("bottom_items") or []
            top_label = (b.get("top_label") or "").strip()
            bottom_label = (b.get("bottom_label") or "").strip()
            if not isinstance(top_items, list) or len(top_items) == 0:
                errors.append(
                    f"{ctx} vs_split has empty/missing `top_items` — the comp "
                    f"renders only labels with no body content. Provide at least "
                    f"1 item per side; ideally 2-3."
                )
            if not isinstance(bottom_items, list) or len(bottom_items) == 0:
                errors.append(
                    f"{ctx} vs_split has empty/missing `bottom_items` — the comp "
                    f"renders only labels with no body content. Provide at least "
                    f"1 item per side; ideally 2-3."
                )
            if not top_label or not bottom_label:
                warnings.append(
                    f"{ctx} vs_split needs both `top_label` and `bottom_label` "
                    f"(short ALL-CAPS tokens like 'OLD WAY' / 'NEW WAY')."
                )

        # Hard ceiling on beat duration — visuals beyond ~5s read as boring
        # for SINGLE-MESSAGE templates. Multi-item reveal templates (timeline,
        # flow, chat, comparison etc.) are EXEMPT — they progressively expose
        # content over their duration, so a 15s beat with 5 items reading at
        # 3s each is correct, not boring.
        # align_to_speech.py also clamps single-message beats to 5s at align
        # time; this lint catches any plan whose hand-authored end_sec is
        # already too long so the author rethinks before render.
        MULTI_ITEM_KINDS = {
            "horizontal_timeline", "vertical_timeline", "progress_steps",
            "chat_message", "flow_diagram", "stat_grid", "comparison_grid",
            "bulleted_list", "list", "keyword_chips",
            "bar_chart", "network_diagram", "ticker_feed",
            "annotated_screenshot",  # multiple highlights reveal sequentially
            "word_pop",  # sequence of phrases, each on screen <2s
            "side_panel",  # progressive bullet reveal via appear_sec
            "bar_overlay",  # bars stagger by appear_sec, span the enumeration
            "bullet_burst",  # accumulating bullets across rapid-fire list
            "vs_split",  # two enumerated sides, reading both takes 8-10s
            "portrait_burst",  # portraits land one-by-one as people are named
            "tool_logo_burst",  # logos land one-by-one as tools are named
            "agent_avatar_burst",  # robot avatars accumulate, can dim
            "org_diagram",  # 12-box diagram with progressive reveal + dim
            "claude_code_terminal",  # multi-line typewriter terminal
            "ratio_dots",  # X-of-Y dot grid with delayed mark_at transition
            "kinetic_statement",  # words reveal one-by-one across the spoken line
            "concept_build",  # elements + connectors build across the explanation
            "network_spread",  # hub + spokes radiate then $ tokens flow, full span
            "command_deck",  # department tiles boot up one-by-one across the line
            "calendar_months",  # N mini-calendars fill lime in sequence, full span
            "layer_stack",  # architecture slabs build bottom→top across the line
        }
        beat_dur = end - start
        # ── READING-TIME RULE (codified May 23 2026) ──────────────────
        # Text-heavy takeovers need ENOUGH time to read but not MORE. Reading
        # speed for big on-screen typography ≈ 12 chars/sec (slower than
        # body text — viewers scan, not read linearly). Compute the chars,
        # derive ideal duration, warn if authored duration is way over (text
        # lingers and feels dead) or way under (text gets cut). Author can
        # always override with a longer end_sec for storytelling — these
        # are WARNINGS, not errors.
        def _chars_for(beat: dict) -> int:
            k = beat.get("kind", "")
            if k == "vs_split":
                top = beat.get("top_items") or []
                bot = beat.get("bottom_items") or []
                t = len(beat.get("top_label", "")) + sum(len(x) for x in top)
                b = len(beat.get("bottom_label", "")) + sum(len(x) for x in bot)
                # parallel columns — viewer reads both sides simultaneously,
                # so effective char count is max(top, bottom).
                return max(t, b)
            if k == "cinematic_title":
                return (len(beat.get("kicker", "")) + len(beat.get("title", ""))
                        + len(beat.get("subtitle", "")))
            if k == "stat_punch":
                return (len(beat.get("pre_label", "")) + len(beat.get("value", ""))
                        + len(beat.get("caption", "")))
            if k == "quote_pull":
                return len(beat.get("quote_text", ""))
            if k == "headline_card":
                return (len(beat.get("kicker", "")) + len(beat.get("headline", ""))
                        + len(beat.get("dek", "")))
            if k == "word_pop":
                # sum every item's text (strip the {} accent markers so they
                # don't inflate the count). word_pop is the most common kind,
                # and a too-short word_pop (scene-17 May 23 2026: "Claude
                # hedges. picks wrong first" got 2.9s for 30 chars) feels
                # rushed exactly the same way as a too-short quote.
                total = 0
                for it in beat.get("items", []) or []:
                    if isinstance(it, dict):
                        total += len(str(it.get("text", "")).replace("{","").replace("}",""))
                return total
            return 0
        READING_CPS = 12.0      # comfortable on-screen reading speed
        READING_DWELL = 1.5     # settle time after reading completes
        READING_FLOOR = 3.5     # min duration regardless of how short the text is
        READING_CEILING_MULT = 1.8  # warn if authored > ideal × this
        text_chars = _chars_for(b)
        if text_chars >= 12:
            ideal = max(READING_FLOOR, text_chars / READING_CPS + READING_DWELL)
            if beat_dur > ideal * READING_CEILING_MULT:
                warnings.append(
                    f"{ctx} {kind} is {beat_dur:.1f}s on screen — for "
                    f"{text_chars} chars of text, ideal is ~{ideal:.1f}s "
                    f"(≈{READING_CPS:.0f} chars/sec read + {READING_DWELL}s dwell). "
                    f"Consider shortening — text past its reading time feels "
                    f"dead. Authoring rule (4bj)."
                )
            elif beat_dur < ideal * 0.7:
                warnings.append(
                    f"{ctx} {kind} is {beat_dur:.1f}s on screen — for "
                    f"{text_chars} chars of text, ideal is ~{ideal:.1f}s. "
                    f"Viewer may not finish reading. Authoring rule (4bj)."
                )
        if kind in MULTI_ITEM_KINDS:
            # Multi-item templates: only flag truly extreme durations (>30s
            # is suspicious — likely a typo). Otherwise trust the author.
            if beat_dur > 30.0:
                warnings.append(
                    f"{ctx} multi-item beat is {beat_dur:.1f}s long — over 30s "
                    f"is rare. Verify items have appear_sec spaced sensibly."
                )
        elif beat_dur > 8.0:
            errors.append(
                f"{ctx} beat is {beat_dur:.1f}s long — hard ceiling is 8s. "
                f"Visuals beyond this read as boring static frames. Shorten "
                f"`end_sec` or split into two beats."
            )
        elif beat_dur > 5.0:
            warnings.append(
                f"{ctx} beat is {beat_dur:.1f}s long — soft ceiling is 5s. "
                f"align_to_speech.py will auto-clamp to 5s at render time. "
                f"For deliberate beats, accept the clamp; otherwise shorten."
            )

        if kind == "static":
            source = b.get("source", "")
            if source not in {"real-screenshot", "stock", "generated", ""}:
                warnings.append(f"{ctx} `source` should be one of real-screenshot|stock|generated, got {source!r}")
            if not source:
                warnings.append(f"{ctx} `source` not set — should be real-screenshot, stock, or generated")

    # Hook visual rule: first TAKEOVER b-roll must start at 1.5–5.0s.
    # Below 1.5s the speaker hasn't had any face-time before a visual covers
    # them — feels jarring and disconnected. Above 5.0s the cold-open feels
    # flat. Sweet spot is 1.5–3.5s.
    #
    # `icon` and `chapter_bar` are EXEMPT — they're partial overlays that
    # leave the speaker in frame, so they can land in the 0–1.5s window as
    # an attention-flash without covering the speaker (e.g. a logo flash on
    # a brand mention).
    NON_TAKEOVER = {
        "icon", "chapter_bar", "notification_toast",
        "lower_third", "corner_stat", "side_panel",
        "word_pop", "hook_title", "subscribe", "image_card", "headline_card",
        "bar_overlay",
    }
    takeover_plan = [b for b in plan if b.get("kind", "static") not in NON_TAKEOVER and not b.get("overlay")]
    if takeover_plan:
        first_start = min(float(b.get("start_sec", 1e9)) for b in takeover_plan)
        if first_start < 1.5:
            errors.append(
                f"first takeover beat starts at {first_start:.2f}s — full-frame "
                f"takeovers must NEVER land before 1.5s. The speaker needs ≥1.5s "
                f"of face-time first so the viewer can lock onto them. Push the "
                f"first takeover to ≥1.5s (ideally 1.5–3.5s)."
            )
        elif first_start > 5.0:
            # A hook_title / word_pop overlay in the first 5s already covers
            # the cold open — only warn if there's NO early visual at all.
            early_overlay = any(
                b.get("kind") in {"hook_title", "word_pop"}
                and float(b.get("start_sec", 1e9)) < 5.0
                for b in plan
            )
            if not early_overlay:
                warnings.append(
                    f"no b-roll in the first 5s (first takeover starts at {first_start:.1f}s) — "
                    "the cold-open is where attention is most fragile. Add a hook visual at 1.5–3.5s."
                )

    # Hook-title rule: every short MUST open with a `hook_title` beat that is
    # visible inside the first ~0.5s. The cold-open scroll-decision window is
    # ~0.5s — the viewer must see composed text immediately, not just a
    # talking head. (SKILL.md rule 4ae.)
    if plan:
        earliest = min(plan, key=lambda b: float(b.get("start_sec", 1e9)))
        earliest_start = float(earliest.get("start_sec", 1e9))
        has_hook = any(b.get("kind") == "hook_title" for b in plan)
        if not has_hook:
            warnings.append(
                "no `hook_title` beat — every short must open with a hook_title "
                "visible in the first ~0.5s (SKILL.md rule 4ae). The cold open is "
                "the scroll-decision window."
            )
        elif earliest.get("kind") == "hook_title" and earliest_start > 0.6:
            warnings.append(
                f"hook_title starts at {earliest_start:.2f}s — it should be visible "
                f"in the first ~0.5s (start_sec 0.0–0.5). Push it to the very top."
            )

    # Density cap: max 4 beats inside any 12-second rolling window.
    # Anything denser feels frantic — the viewer can't process the visuals
    # before the next one lands. This rule was added after a scene with 5
    # beats inside ~13s read as "too busy" — see SKILL.md §4o.
    if len(plan) >= 5:
        DENSITY_WINDOW = 12.0
        DENSITY_MAX = 4
        starts = sorted(float(b["start_sec"]) for b in plan if "start_sec" in b)
        worst_count = 0
        worst_window_start = 0.0
        for i, s in enumerate(starts):
            window_end = s + DENSITY_WINDOW
            count = sum(1 for x in starts[i:] if x < window_end)
            if count > worst_count:
                worst_count = count
                worst_window_start = s
        if worst_count > DENSITY_MAX:
            warnings.append(
                f"density too high: {worst_count} beats inside the {DENSITY_WINDOW:.0f}s window starting at "
                f"{worst_window_start:.1f}s (cap is {DENSITY_MAX}). Drop the lowest-priority beat in that "
                "stretch — feels frantic otherwise."
            )

    print(f"== lint {plan_path} ==")
    print(f"beats: {len(plan)}")
    for w in warnings:
        print(f"  warn: {w}")
    for e in errors:
        print(f"  err : {e}")
    if errors:
        print(f"\nFAIL ({len(errors)} error{'s' if len(errors) != 1 else ''}, {len(warnings)} warning{'s' if len(warnings) != 1 else ''})")
        return 1
    print(f"\nPASS ({len(warnings)} warning{'s' if len(warnings) != 1 else ''})")
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: lint_plan.py <broll_plan.json> [<source_video>]", file=sys.stderr)
        return 2
    plan = Path(sys.argv[1]).expanduser().resolve()
    src = Path(sys.argv[2]).expanduser().resolve() if len(sys.argv) > 2 else None
    return lint(plan, src)


if __name__ == "__main__":
    sys.exit(main())
