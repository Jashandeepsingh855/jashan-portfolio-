export const AUTHORIZED_ADMIN_EMAIL = "sidhujashandeep236@gmail.com";

export interface AdminIdentityLike {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
}

/**
 * Checks whether an authenticated Supabase user or JWT claims object belongs to
 * the configured administrator email or carries the `admin` app_metadata role.
 */
export function isAuthorizedAdmin(
  identity?: AdminIdentityLike | null
): boolean {
  if (!identity) {
    return false;
  }

  const normalizedEmail = identity.email?.trim().toLowerCase();
  if (normalizedEmail === AUTHORIZED_ADMIN_EMAIL) {
    return true;
  }

  return identity.app_metadata?.role === "admin";
}
