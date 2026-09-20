"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { CurrentUpload, CurrentConfig } from "@/lib/store";

export async function getUserDesigns() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.design.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteDesign(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  await db.design.deleteMany({ where: { id, userId: session.user.id } });
  return { ok: true as const };
}

export async function saveDesignDraft(upload: CurrentUpload, config: CurrentConfig) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  await db.design.create({
    data: {
      userId: session.user.id,
      name: upload.fileName,
      fileUrl: upload.fileURL,
      fileType: upload.fileType,
      previewUrl: upload.fileURL,
      volumeCm3: upload.stats.volumeCm3,
      dimensionsCm: JSON.stringify(upload.stats.dimensionsCm),
      material: config.material,
      color: config.color,
      quality: config.quality,
    },
  });
  return { ok: true as const };
}
