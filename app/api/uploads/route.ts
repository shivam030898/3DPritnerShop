import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/storage";
import { MAX_UPLOAD_MB } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await saveFile(buffer, file.name, "designs");

  return NextResponse.json({ url });
}
