import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

/**
 * Cookie-backed SSR client for Route Handlers, Server Actions, and Server Components
 * that read or mutate authenticated Supabase sessions.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot mutate cookies directly; middleware refreshes sessions.
        }
      },
    },
  });
}

/**
 * Stateless public read client safe to call outside authenticated cookie contexts.
 */
export function createSupabasePublicClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
