create table if not exists gauntlet_runs(
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  status text not null,
  config jsonb not null,
  state jsonb not null
);
alter table gauntlet_runs enable row level security;
-- Add authenticated RLS policies before enabling remote writes.
