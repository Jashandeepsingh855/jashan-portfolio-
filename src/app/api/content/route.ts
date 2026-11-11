import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import {
  getFullAdminContent,
  getPublicContent,
  savePortfolioSettings,
  type PortfolioSettingsPayload,
  type Project,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    const content = isAdmin
      ? await getFullAdminContent()
      : await getPublicContent();

    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<PortfolioSettingsPayload> & {
      projects?: Project[];
    };

    const updated = await savePortfolioSettings(body);
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("Failed to update content:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
