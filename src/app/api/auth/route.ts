import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSession,
  signInAdmin,
  signOutAdmin,
  updateAdminPassword,
} from "@/lib/auth";
import { DEFAULT_ADMIN_EMAIL } from "@/lib/supabase/config";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    authenticated: session.isAdmin,
    email: session.isAdmin ? session.email : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, newPassword } = body as {
      action?: string;
      email?: string;
      password?: string;
      newPassword?: string;
    };

    if (action === "login") {
      if (!password || typeof password !== "string") {
        return NextResponse.json(
          { error: "Password is required" },
          { status: 400 }
        );
      }

      const result = await signInAdmin(email || DEFAULT_ADMIN_EMAIL, password);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        authenticated: true,
        email: result.email,
      });
    }

    if (action === "logout") {
      await signOutAdmin();
      return NextResponse.json({ success: true, authenticated: false });
    }

    if (action === "change_password") {
      if (!newPassword || typeof newPassword !== "string") {
        return NextResponse.json(
          { error: "New password is required" },
          { status: 400 }
        );
      }

      const result = await updateAdminPassword(newPassword);
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error },
          { status: result.error === "Unauthorized" ? 401 : 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Administrator password updated successfully.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Authentication service failed" },
      { status: 500 }
    );
  }
}
