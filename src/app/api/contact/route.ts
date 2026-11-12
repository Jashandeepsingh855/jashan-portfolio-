import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { createInquiry, listInquiries } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = await listInquiries();
    return NextResponse.json({ inquiries }, {
      headers: { "Cache-Control": "private, no-store, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      projectType?: string;
      budget?: string;
      timeline?: string;
      message?: string;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const projectType =
      typeof body.projectType === "string" ? body.projectType.trim() : undefined;
    const budget =
      typeof body.budget === "string" ? body.budget.trim() : undefined;
    const timeline =
      typeof body.timeline === "string" ? body.timeline.trim() : undefined;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and project message are required." },
        { status: 400 }
      );
    }

    if (
      name.length > 120 ||
      email.length > 254 ||
      message.length > 5000 ||
      (projectType && projectType.length > 100) ||
      (budget && budget.length > 100) ||
      (timeline && timeline.length > 100)
    ) {
      return NextResponse.json(
        { error: "Submitted fields exceed maximum allowed length." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry({
      name,
      email,
      projectType,
      budget,
      timeline,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Transmission received. I will respond within 24 hours.",
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to submit inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
