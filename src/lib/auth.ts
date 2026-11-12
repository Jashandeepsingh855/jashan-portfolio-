import { isAuthorizedAdmin } from "@/lib/admin-identity";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminSession {
  isAdmin: boolean;
  email: string | null;
  userId: string | null;
}

export async function getAdminSession(): Promise<AdminSession> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
      return { isAdmin: false, email: null, userId: null };
    }

    const claims = data.claims as {
      sub?: string;
      email?: string;
      app_metadata?: { role?: string };
    };

    const isAdmin = isAuthorizedAdmin(claims);
    return {
      isAdmin,
      email: isAdmin ? claims.email || null : null,
      userId: isAdmin ? claims.sub || null : null,
    };
  } catch {
    return { isAdmin: false, email: null, userId: null };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const session = await getAdminSession();
  return session.isAdmin;
}
