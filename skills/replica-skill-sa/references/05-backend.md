# 05 Backend: auth, data, payments, email, integrations
Reads `architecture.md`. Writes migrations, server code, `.env.example` (names only, no values), `replica/backend.md` (checklist below).

## Rules
- Official public APIs + **user's own keys** only. Never the original's private endpoints, OAuth client, or a proxy through it.
- User creates every account/key (Stripe, Supabase, Resend, Google Cloud) and fills `.env.local`. Agent never signs up or types passwords, cards, live keys.
- Test mode first (Stripe test keys/cards) until stage 11.

## Auth
Email sign-up + verification, reset, magic link if original has it; OAuth with user's own dev apps. http-only secure cookies; sign out everywhere. Roles/teams if recon has them, behind one `can(user, action, record)` function. Account deletion that really deletes (Apple requires it).

## Database
Migrations checked in, run by script. Access rules on every table (RLS or authz in every query); **test: second user gets nothing back.** Seed with fake people only. Host backups enabled (check).

## Payments (Stripe)
Checkout for plans, Customer Portal for changes/cancel; no custom card forms. Webhooks: verify signature, store event id, idempotent handlers (Stripe retries). Handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Subscription status lives in your DB, set by webhooks; never trust the client. One-click cancel (hard cancel = top complaint, often illegal).

## Email + jobs
Transactional via Resend/Postmark from own domain, templates written fresh. Time-based work (reminders, digests, sync, cleanup) as jobs with retries + dead-letter log. Store UTC, show user's zone.

## Integrations
Per integration: official API, fewest OAuth scopes, provider review process, rate limits. Google sensitive scopes (Calendar) need OAuth verification, takes weeks: start early, note in `backend.md`.

## Security checklist (`backend.md`)
- [ ] secrets in env only; `.env*` gitignored; none in client bundles
- [ ] server-side input validation (zod or similar) on every route
- [ ] authz on every read/write, tested with a second user
- [ ] rate limits: auth, sign-up, anything sending email/SMS
- [ ] webhook signatures verified
- [ ] uploads: size + type limits, separate domain/bucket
- [ ] no user data in URLs or logs
- [ ] `npm audit` clean or triaged
- [ ] privacy policy lists every processor

Output: working auth/DB/payments (test mode)/email/integrations, `.env.example`, ticked `backend.md`, `features.csv` updated. Next: `06-test`.
