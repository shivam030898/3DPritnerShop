"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });
}

export type AddressInput = {
  label: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  pin: string;
};

export async function addAddress(input: AddressInput) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  const count = await db.address.count({ where: { userId: session.user.id } });
  await db.address.create({
    data: { ...input, userId: session.user.id, isDefault: count === 0 },
  });
  return { ok: true as const };
}

export async function removeAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  await db.address.deleteMany({ where: { id, userId: session.user.id } });
  return { ok: true as const };
}
