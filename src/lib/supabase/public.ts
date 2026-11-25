import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";

/**
 * Client tanpa cookies untuk query data publik (SELECT only via RLS anon).
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
