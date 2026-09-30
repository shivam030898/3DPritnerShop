"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function submitPrintablesRequest(input: { link: string; email: string; note?: string }) {
  const link = input.link.trim();
  const email = input.email.trim();
  const note = input.note?.trim() || null;

  if (!email.includes("@")) return { ok: false as const, error: "Enter a valid email." };

  try {
    new URL(link);
  } catch {
    return { ok: false as const, error: "Enter a valid link." };
  }

  const session = await auth();

  await db.printablesRequest.create({
    data: { link, email, note, userId: session?.user?.id ?? null },
  });

  return { ok: true as const };
}
