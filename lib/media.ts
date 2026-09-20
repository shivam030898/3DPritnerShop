import fs from "node:fs";
import path from "node:path";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];

/**
 * Locates the hero video by scanning /public/media rather than hardcoding a
 * filename — whatever video file is dropped in there (any name/extension)
 * is picked up automatically. Server-only (uses `fs`); call from a Server
 * Component and pass the result down as a prop.
 */
export function findHeroVideo(): string | null {
  const dir = path.join(process.cwd(), "public", "media");
  try {
    const file = fs
      .readdirSync(dir)
      .find((name) => VIDEO_EXTENSIONS.includes(path.extname(name).toLowerCase()));
    return file ? `/media/${file}` : null;
  } catch {
    return null;
  }
}
