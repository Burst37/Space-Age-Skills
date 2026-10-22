# 02 Architect: stack, schema, API, build order
Reads `recon.md`, `features.csv`. No recon -> stop, run 01. Writes `replica/architecture.md` (template `templates/architecture.md`), `replica/schema.sql` or first migration.

## 1. Stack
User's known stack wins. Else boring, managed, cheap at zero users:

| layer | default | swap |
|---|---|---|
| web | Next.js App Router + TS | Remix, SvelteKit, Rails |
| styling | Tailwind + stage-3 tokens | CSS modules |
| mobile | Expo | SwiftUI, Kotlin |
| db | Postgres (Supabase/Neon) | Turso, PlanetScale |
| ORM | Drizzle / Prisma | raw SQL |
| auth | Supabase Auth / Auth.js | Clerk |
| payments | Stripe Checkout + Billing | Lemon Squeezy, Paddle |
| email | Resend / Postmark | SES |
| jobs | Vercel Cron / Inngest / Trigger.dev | Fly worker |
| files | Supabase Storage / R2 | S3 |
| host | Vercel | Netlify, Fly, Render |

One line of why per choice. One database. No microservices. Clone needs the original's features, not its architecture.

## 2. Schema (every table)
- `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at`
- owner column (`user_id`/`org_id`) on user-owned rows
- FKs with a decided `on delete`; index every FK + every filter/sort column
- enums/check constraints for status; `timestamptz` in UTC; money = integer cents + currency
- access rules: RLS (Supabase) or one authz check per query in the data layer. Write which.
- hard constraints in the DB, not the UI (double booking -> exclusion constraint / unique index)
```sql
create table bookings (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references event_types(id) on delete cascade,
  host_id uuid not null references users(id) on delete cascade,
  start_at timestamptz not null, end_at timestamptz not null,
  guest_email text not null, guest_timezone text not null,
  status text not null default 'confirmed'
    check (status in ('confirmed','cancelled','rescheduled')),
  created_at timestamptz not null default now(),
  constraint no_zero_length check (end_at > start_at)
);
create index on bookings (host_id, start_at);
```

## 3. API
Per flow: `method path | does | who can call | input | output | flow`. Plus webhooks in/out and jobs with schedule. Official public APIs + user's keys only; never the original's private endpoints.

## 4. Parts that bite (one line each that applies)
time zones/DST, idempotency (webhooks arrive twice), races, rate limits, file size, search, realtime, offline, email deliverability, multi-tenancy, GDPR deletion.

## 5. Build order
1. vertical slice: core loop end to end, ugly (sign up -> do the thing -> see result)
2. must-haves by area -> 3. should, could -> 4. stage-8 fixes. Each milestone lists S-IDs, tables, routes.

## Done when
- [ ] every must-have maps to screens + tables + routes
- [ ] schema applies cleanly on an empty DB (run it, paste result)
- [ ] next: `03-design`
