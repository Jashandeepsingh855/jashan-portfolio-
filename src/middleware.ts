import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-identity";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabaseConfig();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  // Validates JWT claims and refreshes expiring session cookies.
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims as
    | { email?: string; app_metadata?: { role?: string } }
    | undefined;
  const isAdmin = isAuthorizedAdmin(claims);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginRoute = pathname === "/admin/login";

    if (!isAdmin && !isLoginRoute) {
      const redirectUrl = new URL("/admin/login", request.url);
      const redirectRes = NextResponse.redirect(redirectUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirectRes.cookies.set(cookie.name, cookie.value, cookie);
      });
      redirectRes.headers.set("X-Robots-Tag", "noindex, nofollow");
      redirectRes.headers.set("Cache-Control", "no-store, must-revalidate");
      return redirectRes;
    }

    if (isAdmin && isLoginRoute) {
      const redirectUrl = new URL("/admin", request.url);
      const redirectRes = NextResponse.redirect(redirectUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirectRes.cookies.set(cookie.name, cookie.value, cookie);
      });
      redirectRes.headers.set("X-Robots-Tag", "noindex, nofollow");
      redirectRes.headers.set("Cache-Control", "no-store, must-revalidate");
      return redirectRes;
    }

    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
