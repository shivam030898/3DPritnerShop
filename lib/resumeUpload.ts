"use client";

import type { CurrentUpload, CurrentConfig } from "./store";

const KEY = "forma-resume-upload";
const TTL_MS = 30 * 60 * 1000;

type ResumePayload = {
  upload: CurrentUpload;
  config: CurrentConfig;
  savedAt: number;
};

export function saveResumeUpload(upload: CurrentUpload, config: CurrentConfig) {
  const payload: ResumePayload = { upload, config, savedAt: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // localStorage unavailable — resume simply won't work, non-fatal.
  }
}

export function loadResumeUpload(): { upload: CurrentUpload; config: CurrentConfig } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumePayload;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return { upload: parsed.upload, config: parsed.config };
  } catch {
    return null;
  }
}

export function clearResumeUpload() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Uploads a blob: object URL to server storage so it survives navigation
 * away from the page (e.g. a full OAuth redirect). No-op if the file is
 * already persisted (an /api/files/... URL).
 */
export async function persistUploadIfNeeded(fileURL: string, fileName: string): Promise<string> {
  if (!fileURL.startsWith("blob:")) return fileURL;

  const blob = await (await fetch(fileURL)).blob();
  const formData = new FormData();
  formData.append("file", blob, fileName);

  const res = await fetch("/api/uploads", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const data = (await res.json()) as { url: string };
  return data.url;
}
