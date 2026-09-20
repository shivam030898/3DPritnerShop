export type SupportedFileType = "stl" | "obj" | "3mf";

export function detectFileType(fileName: string): SupportedFileType | null {
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext === "stl" || ext === "obj" || ext === "3mf") return ext;
  return null;
}
