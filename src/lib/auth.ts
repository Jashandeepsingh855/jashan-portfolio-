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

export async function signInAdmin(email: string, password: string) {
  const resolvedEmail = email.trim();
  if (!resolvedEmail || !password) {
    return {
      ok: false as const,
      error: "Email and password are required.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: resolvedEmail,
    password,
  });

  if (error || !data.user) {
    return {
      ok: false as const,
      error: error?.message || "Invalid login credentials",
    };
  }

  if (!isAuthorizedAdmin(data.user)) {
    await supabase.auth.signOut();
    return {
      ok: false as const,
      error: "This account does not have administrator privileges.",
    };
  }

  return {
    ok: true as const,
    email: data.user.email || resolvedEmail,
  };
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export async function updateAdminPassword(newPassword: string) {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return { ok: false as const, error: "Unauthorized" };
  }

  if (newPassword.length < 6) {
    return {
      ok: false as const,
      error: "Password must be at least 6 characters.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
