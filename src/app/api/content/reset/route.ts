import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { resetToDefault } from "@/lib/data";

export async function POST() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restored = resetToDefault();
    return NextResponse.json({ success: true, message: "Restored to default Stitch design", data: restored });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Failed to reset data" }, { status: 500 });
  }
}
