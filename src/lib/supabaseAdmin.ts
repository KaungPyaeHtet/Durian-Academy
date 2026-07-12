import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Admin client using the service-role key. SERVER-ONLY — the `server-only`
 * import guarantees this never gets bundled into client code. Bypasses RLS,
 * so it is only ever used from protected server actions in the admin area.
 */
export function getAdminSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
