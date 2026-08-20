import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. The anon key is used exclusively behind our own
 * API routes — it is never prefixed NEXT_PUBLIC and never reaches the browser.
 * RLS policies (see migration owner_dashboard_schema) allow insert/select for
 * the anon role on the three dashboard tables.
 */
export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}
