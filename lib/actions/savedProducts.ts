"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getSavedSlugs(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db.savedProduct.findMany({
    where: { userId: session.user.id },
    select: { productSlug: true },
  });
  return rows.map((r) => r.productSlug);
}

export type ToggleSavedResult = { ok: true; saved: boolean } | { ok: false; error: string };

export async function toggleSavedProduct(slug: string): Promise<ToggleSavedResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Sign in to save designs." };
  }

  const existing = await db.savedProduct.findUnique({
    where: { userId_productSlug: { userId: session.user.id, productSlug: slug } },
  });

  if (existing) {
    await db.savedProduct.delete({ where: { id: existing.id } });
    return { ok: true, saved: false };
  }

  await db.savedProduct.create({
    data: { userId: session.user.id, productSlug: slug },
  });
  return { ok: true, saved: true };
}
