import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { deleteProject, updateProject, type Project } from "@/lib/data";

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
    const body = (await req.json()) as Partial<Project>;
    const project = await updateProject(id, body);

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update project";
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
    await deleteProject(id);

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
