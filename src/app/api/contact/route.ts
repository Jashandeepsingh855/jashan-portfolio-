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
    return NextResponse.json({ inquiries });
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

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and project message are required." },
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
      projectType: body.projectType,
      budget: body.budget,
      timeline: body.timeline,
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
