import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { deleteInquiry, updateInquiry, type InquiryStatus } from "@/lib/data";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await req.json()) as { status?: InquiryStatus };
    if (!body.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const inquiry = await updateInquiry(id, body.status);
    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("PATCH /api/inquiries/[id] error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteInquiry(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/inquiries/[id] error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
