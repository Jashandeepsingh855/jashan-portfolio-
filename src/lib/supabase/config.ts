export const FALLBACK_SUPABASE_URL = "https://vlkofzfbfbropigptpee.supabase.co";
export const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_O0oopBvf5qKx-XTz7bFgdQ_Z8Jdbad_";
export const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsa29memZiZmJyb3BpZ3B0cGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5MzQ4NDYsImV4cCI6MjEwOTUxMDg0Nn0.ZpUghgizEpn215DTSYKz3X8v8-cvHVR7AAkNSE0Bvdk";

export const DEFAULT_ADMIN_EMAIL = "admin@jashandeepsingh.film";
export const MEDIA_BUCKET = "portfolio-media";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || FALLBACK_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    FALLBACK_SUPABASE_PUBLISHABLE_KEY ||
    FALLBACK_SUPABASE_ANON_KEY;

  return { url, anonKey };
}
