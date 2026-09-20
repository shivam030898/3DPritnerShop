import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { resolveStoredFilePath } from "@/lib/storage";

const CONTENT_TYPES: Record<string, string> = {
  stl: "model/stl",
  obj: "text/plain",
  "3mf": "application/octet-stream",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (segments.length !== 2) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [subdir, filename] = segments;

  try {
    const filePath = resolveStoredFilePath(subdir, filename);
    const buffer = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
