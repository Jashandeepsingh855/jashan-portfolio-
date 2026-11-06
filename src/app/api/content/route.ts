import { NextResponse } from "next/server";
import { getContent, saveContent, getPublicContent, SiteContent } from "@/lib/data";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (isAdmin) {
      const full = getContent();
      // Remove raw password hash from response for security
      const safe = { ...full };
      if (safe.admin) {
        safe.admin = { ...safe.admin, password: "" };
      }
      return NextResponse.json({ ...safe, isAdmin: true });
    }
    const pub = getPublicContent();
    return NextResponse.json({ ...pub, isAdmin: false });
  } catch (error) {
    console.error("API GET /content error:", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const current = getContent();
    const body: Partial<SiteContent> = await request.json();

    // Preserve inquiries and admin settings unless specifically updated
    const updated: SiteContent = {
      ...current,
      ...body,
      siteSettings: body.siteSettings ? { ...current.siteSettings, ...body.siteSettings } : current.siteSettings,
      hero: body.hero ? { ...current.hero, ...body.hero } : current.hero,
      about: body.about ? { ...current.about, ...body.about } : current.about,
      process: body.process ? { ...current.process, ...body.process } : current.process,
      categories: body.categories || current.categories,
      projects: body.projects || current.projects,
      services: body.services || current.services,
      testimonials: body.testimonials || current.testimonials,
      inquiries: body.inquiries !== undefined ? body.inquiries : current.inquiries,
      admin: current.admin,
    };

    saveContent(updated);
    return NextResponse.json({ success: true, message: "Content updated successfully" });
  } catch (error) {
    console.error("API POST /content error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
