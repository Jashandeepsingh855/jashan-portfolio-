import { NextResponse } from "next/server";
import { verifyAdminSession, setAdminSession, clearAdminSession } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/data";

export async function GET() {
  const isAuth = await verifyAdminSession();
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: Request) {
  try {
    const { action, password, newPassword } = await request.json();

    if (action === "login") {
      const success = await setAdminSession(password);
      if (success) {
        return NextResponse.json({ success: true, message: "Logged in successfully" });
      }
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }

    if (action === "logout") {
      await clearAdminSession();
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    if (action === "change_password") {
      const isAuth = await verifyAdminSession();
      if (!isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json({ error: "Password must be at least 4 characters" }, { status: 400 });
      }

      const content = getContent();
      content.admin = {
        ...content.admin,
        password: newPassword,
      };
      saveContent(content);
      await setAdminSession(newPassword);

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
