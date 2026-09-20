import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Minimal local-disk object storage for dev. The public surface
 * (saveFile / fileUrl shape) is what would change if swapped for real
 * object storage (S3, R2, etc.) later — callers never touch the filesystem
 * directly.
 */

const STORAGE_ROOT = path.join(process.cwd(), "storage");

export async function saveFile(
  buffer: Buffer,
  originalName: string,
  subdir: "designs" | "avatars"
): Promise<{ url: string; storedName: string }> {
  const ext = path.extname(originalName) || "";
  const id = crypto.randomUUID();
  const storedName = `${id}${ext}`;

  const dir = path.join(STORAGE_ROOT, subdir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), buffer);

  return { url: `/api/files/${subdir}/${storedName}`, storedName };
}

export function resolveStoredFilePath(subdir: string, filename: string): string {
  // Guard against path traversal — filenames are always flat UUID-based.
  const safeName = path.basename(filename);
  return path.join(STORAGE_ROOT, subdir, safeName);
}
