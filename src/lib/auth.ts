import { cookies } from "next/headers";
import { getContent } from "./data";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "jashan_admin_auth";

export function generateToken(password: string): string {
  const content = getContent();
  const secret = content.admin?.sessionToken || "default_fallback_secret_7728";
  return crypto.createHmac("sha256", secret).update(password).digest("hex");
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  const content = getContent();
  const expectedPassword = content.admin?.password || "admin123";
  const expectedToken = generateToken(expectedPassword);

  return token === expectedToken;
}

export async function setAdminSession(password: string): Promise<boolean> {
  const content = getContent();
  const expectedPassword = content.admin?.password || "admin123";

  if (password === expectedPassword) {
    const token = generateToken(password);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return true;
  }
  return false;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
