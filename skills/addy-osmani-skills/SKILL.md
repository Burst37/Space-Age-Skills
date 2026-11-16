---
name: addy-osmani-skills
description: >-
  Addy Osmani's agent-skills: 25 production engineering workflow skills across
  define, plan, build, verify, review, ship (spec-driven development, TDD,
  incremental implementation, code review, security hardening, performance,
  debugging, CI/CD, shipping, context engineering, doubt-driven development).
  Use when starting or reviewing software work and a lifecycle workflow or
  quality gate applies. Load the matching sub-skill file; start with
  skills/using-agent-skills/SKILL.md if unsure.
source: https://github.com/addyosmani/agent-skills (MIT, (c) 2025 Addy Osmani)
version: 2.0.0
---
# Addy Osmani agent-skills (vendored, full set)

Replaces the earlier stub. Upstream files are verbatim; load only the sub-skill you need.

Lifecycle: `/spec` -> `/plan` -> `/build` -> `/test` -> `/review` -> `/ship` (command definitions in `commands/*.toml`; checklists in `references/`; reviewer personas in `agents/`).

| Sub-skill | Use when (from upstream description) |
|---|---|
| [`api-and-interface-design`](skills/api-and-interface-design/SKILL.md) | Guides stable API and interface design. Use when designing APIs, module boundaries, or any public interface. Use when creating REST or GraphQL endpoints, defining type co |
| [`browser-testing-with-devtools`](skills/browser-testing-with-devtools/SKILL.md) | Tests in real browsers via Chrome DevTools MCP. Use when building or debugging anything that runs in a browser. Use when you need to inspect the DOM, capture console erro |
| [`ci-cd-and-automation`](skills/ci-cd-and-automation/SKILL.md) | Automates CI/CD pipeline setup. Use when setting up or modifying build and deployment pipelines. Use when you need to automate quality gates, configure test runners in CI |
| [`code-review-and-quality`](skills/code-review-and-quality/SKILL.md) | Conducts multi-axis code review. Use before merging any change. Use when reviewing code written by yourself, another agent, or a human. Use when you need to assess code q |
| [`code-simplification`](skills/code-simplification/SKILL.md) | Simplifies code for clarity. Use when refactoring code for clarity without changing behavior. Use when code works but is harder to read, maintain, or extend than it shoul |
| [`constraint-driven-development`](skills/constraint-driven-development/SKILL.md) | Establishes a project's quality bar as a written contract and stops agents quietly lowering it. Interviews the user on which dimensions matter, supplies sane default thre |
| [`context-engineering`](skills/context-engineering/SKILL.md) | Optimizes agent context setup. Use when starting a new session, when agent output quality degrades, when switching between tasks, or when you need to configure rules file |
| [`debugging-and-error-recovery`](skills/debugging-and-error-recovery/SKILL.md) | Guides systematic root-cause debugging. Use when tests fail, builds break, something that worked yesterday broke, behavior doesn't match expectations, or you encounter an |
| [`deprecation-and-migration`](skills/deprecation-and-migration/SKILL.md) | Manages deprecation and migration. Use when removing old systems, APIs, or features. Use when migrating users from one implementation to another. Use when migrating a dat |
| [`documentation-and-adrs`](skills/documentation-and-adrs/SKILL.md) | Records decisions and documentation, and detects when documentation has drifted from the code it describes. Use when you need to document an architecture decision (ADR) o |
| [`doubt-driven-development`](skills/doubt-driven-development/SKILL.md) | Subjects every non-trivial decision to a fresh-context adversarial review before it stands. Use when you want every assumption cross-examined before proceeding, when stre |
| [`frontend-ui-engineering`](skills/frontend-ui-engineering/SKILL.md) | Builds production-quality, accessible, responsive user-facing UIs. Use when building or modifying interfaces and pages, creating components, implementing layouts, meeting |
| [`git-workflow-and-versioning`](skills/git-workflow-and-versioning/SKILL.md) | Structures git workflow practices. Use when making any code change. Use when committing, branching, resolving conflicts, splitting uncommitted work in a messy working tre |
| [`idea-refine`](skills/idea-refine/SKILL.md) | Refines raw ideas into sharp, actionable concepts through structured divergent and convergent thinking. Use when an idea is still vague, when you need to stress-test assu |
| [`incremental-implementation`](skills/incremental-implementation/SKILL.md) | Delivers changes incrementally in thin, verifiable slices. Use when implementing any feature or change that touches more than one file, or when picking up the next task f |
| [`interview-me`](skills/interview-me/SKILL.md) | Extracts what the user actually wants instead of what they think they should want. Achieves this through one-question-at-a-time interview until ~95% confidence about the  |
| [`observability-and-instrumentation`](skills/observability-and-instrumentation/SKILL.md) | Instruments code so production behavior is visible and diagnosable. Use when adding logging, metrics, tracing, or alerting. Use when shipping any feature that runs in pro |
| [`performance-optimization`](skills/performance-optimization/SKILL.md) | Optimizes application performance across frontend, backend, queries, and databases. Use when performance requirements exist, when you suspect performance regressions, whe |
| [`planning-and-task-breakdown`](skills/planning-and-task-breakdown/SKILL.md) | Breaks work into ordered tasks. Use when you have a spec or clear requirements and need to break work into implementable tasks. Use when a task feels too large to start,  |
| [`security-and-hardening`](skills/security-and-hardening/SKILL.md) | Hardens code against vulnerabilities. Use when auditing an input handler for vulnerabilities, when handling user input, authentication, data storage, or external integrat |
| [`shipping-and-launch`](skills/shipping-and-launch/SKILL.md) | Prepares production launches. Use when preparing to deploy to production, or when asking what needs to be in place before shipping. Use when you need a pre-launch checkli |
| [`source-driven-development`](skills/source-driven-development/SKILL.md) | Grounds every implementation decision in official documentation. Use when you want to verify an approach against the official docs before implementing it, or when you wan |
| [`spec-driven-development`](skills/spec-driven-development/SKILL.md) | Creates specs before coding. Use when starting a new project, feature, or significant change and no specification exists yet. Use when drafting a PRD or requirements docu |
| [`test-driven-development`](skills/test-driven-development/SKILL.md) | Drives development with tests using the red-green-refactor loop. Use when implementing any logic, fixing any bug, or changing any behavior. Use when you need to prove tha |
| [`using-agent-skills`](skills/using-agent-skills/SKILL.md) | Discovers and invokes agent skills. Use when starting a session, or when you need to decide which skill or workflow applies to the piece of work at hand. This is the meta |

Overlap: `ponytail`/`karpathy-guidelines` are always on and win on scope; use these for phase gates. Security skill + `security-auditor` agent pair with `sa-cybersecurity-agent`.
