---
name: dyad-app-scaffold
description: Use when scaffolding a new full-stack web app from a natural-language description, especially when the user wants Supabase/Neon backend wiring, auth, or a guided "add feature" flow (authentication, email verification, password reset) added to an existing app — adapt these prompt patterns regardless of which AI coding tool is driving.
---

# Dyad App Scaffold Patterns

## Overview

[dyad-sh/dyad](https://github.com/dyad-sh/dyad) is a local AI app builder (Lovable/v0/Bolt-style) whose prompt library (`src/prompts/`) encodes battle-tested patterns for turning vague app requests into working scaffolds — a `system_prompt.ts`, a `plan_mode_prompt.ts` for thinking before generating, framework-aware guides (`add-authentication.md`, `add-email-verification.md`, `add-password-reset.md`), and a `security_review_prompt.ts`. This skill ports those patterns to any agent generating app code.

## When to Use

- "Build me an app that does X" (greenfield scaffold)
- "Add authentication / email verification / password reset to this app"
- User wants Supabase or Neon wired up as the backend
- Before generating a large amount of new app code — run plan mode first
- NOT for small bug fixes or single-file edits — this is for net-new feature/app generation

## Core Pattern

Dyad's flow: **plan mode → guide selection by framework → generate → security review**.

1. **Plan mode** (`plan_mode_prompt.ts`): before writing code, output a short plan — what files will be created/changed, what packages added, what env vars needed. Don't generate code in this step.
2. **Framework-filtered guides** (`filter_guide_by_framework.ts`): auth/email/password-reset guides are framework-specific (Next.js vs Vite vs Remix). Pick the guide matching the project's actual framework — detect from `package.json`, don't assume.
3. **Generate**, following the selected guide's exact file layout and env var names.
4. **Security review** (`security_review_prompt.ts`): after generating auth-adjacent code, run a pass specifically checking for exposed secrets, missing server-side checks, and client-trusted authorization.

## Quick Reference

| Step | Source file | Purpose |
|---|---|---|
| Plan | `plan_mode_prompt.ts` | Force a plan before code for non-trivial requests |
| Framework detection | `filter_guide_by_framework.ts` | Route to the right guide variant |
| Auth | `guides/add-authentication.md` | Standard auth scaffold |
| Email verification | `guides/add-email-verification.md` | Adds verification flow on top of auth |
| Password reset | `guides/add-password-reset.md` | Adds reset flow on top of auth |
| Backend wiring | `supabase_prompt.ts` / `neon_prompt.ts` | DB-specific connection/schema patterns |
| Post-gen check | `security_review_prompt.ts` | Catch exposed secrets / auth bypass |

## Implementation

```
1. Detect framework: read package.json (next/vite/remix/etc)
2. If request is "add X to existing app": pick guide for X filtered by detected framework
3. If request is "build app that does X": plan mode first
   - List planned files, deps, env vars — get user confirmation if env vars need secrets
4. Generate code following guide's file layout exactly (don't improvise auth flow shape)
5. Run security review pass:
   - grep for hardcoded API keys / service-role keys in client code
   - verify auth checks exist server-side, not just hidden UI
   - verify password-reset tokens are single-use + expiring
```

## Common Mistakes

- **Generating auth code without picking a framework-specific guide** — generic auth scaffolds miss framework conventions (middleware vs route handlers vs loaders).
- **Skipping plan mode on large requests** — leads to half-finished scaffolds when context runs out mid-generation.
- **Putting service-role/secret keys in client-bundled code** — the security review step exists specifically to catch this.
- **Reset/verification tokens that don't expire or are reusable** — a recurring finding `security_review_prompt.ts` checks for.
