import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client authenticated with the service-role key.
 * It bypasses Row Level Security, so it must never be imported into a
 * Client Component or otherwise reach the browser bundle — only use it
 * from Route Handlers (app/api/**\/route.ts) and Server Components.
 *
 * The client is created lazily (on first use, not on import) so that
 * simply importing this module — e.g. during `next build`'s route
 * collection — doesn't crash a build where env vars aren't set yet.
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase service-role environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}
