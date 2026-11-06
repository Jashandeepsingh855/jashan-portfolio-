import { NextResponse } from "next/server";
import { getContent, saveContent, Inquiry } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, budget, timeline, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const content = getContent();
    const newInquiry: Inquiry = {
      id: "inq_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: String(name).trim(),
      email: String(email).trim(),
      projectType: String(projectType || "General Inquiry").trim(),
      budget: String(budget || "Not Specified").trim(),
      timeline: String(timeline || "Flexible").trim(),
      message: String(message).trim(),
      date: new Date().toISOString(),
      status: "unread",
    };

    content.inquiries = [newInquiry, ...(content.inquiries || [])];
    saveContent(content);

    return NextResponse.json({
      success: true,
      message: "Your message has been delivered to Jashandeep's desk. Expect a response within 12-24 hours.",
      inquiryId: newInquiry.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
