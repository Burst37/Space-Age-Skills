---
name: rea-sa
description: >-
  Evidence-backed reverse engineering of software the user owns or is
  authorized to examine, through the REA MCP server or CLI (rea-agents):
  native binaries, Electron/JS bundles and ASARs, APKs, .NET, firmware, WASM,
  browser/Electron runtime, recorded captures. Use when the user says "how does
  this app/binary do X", "decompile", "inspect this APK/ASAR/exe", "compare
  versions", "what changed in this build", or wants a feature explained from
  the shipped artifact. Not for source repos (use normal tools), DRM/licence
  bypass, cheats, or copying protected code.
license: MIT (REA by morluto; see LICENSE, DISCLAIMER.md)
source: https://github.com/morluto/rea (v6.5.0, skill v42, commit 0c7b6d834)
version: 1.0.0-sa
---
# REA SA: reverse engineer with evidence

Claim depends on a shipped artifact, decompilation, runtime evidence, or behaviour not in available source -> REA. Complete source repo -> normal repo tools; no REA readiness/provider commands.

## 0. Authorization gate (before any tool call)
- Target = user's own software, or explicitly authorized: security research, malware/incident analysis, CTF, education, interoperability, preservation, debugging/auditing. Unclear -> ask once.
- **Refuse:** DRM / licence-check / anti-cheat circumvention, game cheats, tampering with online services, auth/bot-protection bypass on systems not authorized, copying proprietary code or assets, evading AI-provider policies, reselling AI access.
- Authorization to inspect != authorization to execute, intercept, or touch devices/services. Runtime work = declared target + lifecycle only.
- "my app" with no name/path -> ask which. Never pick an example app. Fixture/report paths do not select a target.
- Proprietary engines (IDA, Hopper, JEB) must be legally obtained by the user. No cracked tools or keys.

## 1. Connect only when needed
REA tools present -> go straight to the target. No diagnostics before every task. Use the server's real tool list + schemas (repo main can describe tools an older npm release lacks).
Tools absent / call blocked / provider missing -> load `references/connect-and-cli.md`, then `references/connection-and-recovery.md`. Doctor = read-only; setup = `--dry-run --json` plan shown to user, **approval before any config write or Hopper install**. Setup never installs Node, npm, Homebrew, Java, Ghidra, IDA, JADX, Kuna, Binwalk, Unblob.
No MCP, JS target: `npx -y rea-agents@latest analyze-javascript-application /abs/path --json`.

## 2. Route the target (first tool)
| target | first tool |
|---|---|
| ASAR / extracted JS or Electron tree | `analyze_javascript_application` (bundled JS needing source recovery: `recover_javascript_sources`) |
| ZIP/APK/IPA/MSIX/AppX/DMG member inventory | `open_binary`, then `inspect_artifact` |
| Android code, classes, methods, refs | `inspect_android_package` |
| managed PE / CLI assembly | `inspect_managed_artifact` |
| firmware image | `inspect_firmware_regions`; `extract_firmware` only if asked, new abs output dir |
| user's open browser page / scripted actions | `list_browser_targets` / `capture_browser_scenario` |
| user's open Electron runtime | `list_electron_targets` (`inspect_electron_fuses` before an electron-main Inspector attempt) |
| HAR / SAZ / mitmproxy / qlog recording | `inspect_web_network_capture` |
| PCAP fields / frames / summaries | `inspect_packet_fields` -> `inspect_packet_capture`; `inspect_pcap_capture` |
| logic/signal recording | `inspect_signal_decoders` -> `decode_signal_recording` |
| WASM / EVM bytecode | `inspect_wasm_artifact` / `inspect_evm_interface` |
| Go / Rust build metadata | `inspect_go_binary` / `inspect_rust_binary` |
| SQLite snapshot | `inspect_sqlite_database` |
| Linux ELF layout / ELF core | `inspect_binary_layout` / `inspect_recorded_crash` |
| PE resources, icons | `inspect_pe_resources` |
| native exe / lib / analysis DB (incl. NativeAOT, IDA `provider_id: "ida"`, Kuna `provider_id: "kuna"`) | `open_binary`, then focused tools (`binary_overview` if available) |

Exact contracts, prerequisites, env vars, paging: `references/target-routing.md` (load the row you need). Tool unadvertised -> never call it; `binary_session` with `{}` -> `result.tool_availability`.

## 3. Work summary-first
- Default result first; read its inline Evidence. Big/unknown JS or ELF -> `"detail": "summary"`, then `inspect_analysis_view` on `parent_evidence_id`.
- Never repeat an identical or rejected call without a changed input or fixed blocker.
- `resource_constraint` (transport) or a client-truncated result -> page via `inspect_analysis_view` / `get_evidence_bundle` (`detail: "summary"` + filters) / `export_evidence_bundle`. Never parse a truncated preview as JSON.
- Full rules: `references/summary-first.md`. Paging, comparison, verification: `references/evidence-workflows.md`.

## 4. Investigate (multi-feature requests)
1. Question checklist + evidence each answer needs -> `templates/finding-ledger.md`.
2. Reuse session, artifact identity, saved DB, bookmarks, prior Evidence; no duplicate sessions.
3. Smallest overview first; follow each question entry -> data/state -> result. Expand only on a concrete gap.
4. Read packaged resources/config with format-aware parsers; never infer from filenames or strings alone.
5. Runtime only when static evidence cannot answer and the runtime is authorized and available.
6. Independent questions + parallel workers available -> split scopes, share Evidence IDs.
7. Ledger row per conclusion: Evidence IDs, evidence type, confidence, search boundary, unknowns.

Domain guides (load one): native/managed/archives `references/native-and-artifacts.md` · JS/Electron `references/javascript-applications.md` · Android `references/android-applications.md` · browser/Electron runtime `references/runtime-observation.md`.

## 5. Report
- Every claim tagged **observed / inferred / unknown**, with Evidence IDs. Static analysis never "observed execution". Keep limitations + partial coverage.
- Revisit the checklist: each question answered / partial / unresolved. Bounded searches stay bounded; never call an investigation complete with open questions.
- Status line: `✅ rea — <n>/<m> answered — <next>` or `❌ rea — <blocker> — <fix>`.
- `close_binary` when a native session is done.

## 6. Building a similar feature (clean-room handoff)
User wants it in their product -> write a **behaviour spec** from the ledger (inputs, states, outputs, edge cases, observed vs inferred), then build fresh with normal coding tools.
- Never paste decompiled/recovered code, assets, strings or copy into the product. Recovered source and source-like output grant no rights.
- Separate observed behaviour from your own design choices in the spec.
- Rebuilding a whole competitor product -> hand the spec to `replica-skill-sa` (rows `feature,area,priority,original,clone,notes`); its clean-room and rebrand gates apply.
