import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { resetToDefaultContent } from "@/lib/data";

export async function POST() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resetContent = await resetToDefaultContent();
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ success: true, content: resetContent });
  } catch (error) {
    console.error("Failed to reset content:", error);
    return NextResponse.json(
      { error: "Failed to reset portfolio content" },
      { status: 500 }
    );
  }
}
