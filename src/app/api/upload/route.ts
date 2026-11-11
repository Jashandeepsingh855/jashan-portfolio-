import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_BYTES = 50 * 1024 * 1024; // 50MB bucket limit

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder =
      ((formData.get("folder") as string | null) || "uploads").replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      ) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the 50MB storage limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const baseName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const uniqueName = `${Date.now()}-${baseName}`;
    const storagePath = `${folder}/${uniqueName}`;

    const supabase = await createSupabaseServerClient();
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      filename: uniqueName,
      storagePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload media to storage bucket" },
      { status: 500 }
    );
  }
}
