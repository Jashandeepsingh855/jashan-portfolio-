import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { createProject, listProjects, type Project } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to list projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<Project>;
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 }
      );
    }

    const project = await createProject(body);
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
