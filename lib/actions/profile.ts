"use server";

import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { ORDER_STAGES, getOrderStageIndex } from "@/lib/orders";
import { normalizePhone } from "@/lib/phone";

export async function getProfileStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    select: { createdAt: true },
  });
  const designs = await db.design.count({ where: { userId: session.user.id } });

  const deliveredIndex = ORDER_STAGES.length - 1;
  let inProduction = 0;
  let delivered = 0;
  for (const order of orders) {
    const stage = getOrderStageIndex(order);
    if (stage === deliveredIndex) delivered++;
    else inProduction++;
  }

  return { orders: orders.length, designs, inProduction, delivered };
}

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(name: string, phone: string): Promise<UpdateProfileResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };
  if (!name.trim()) return { ok: false, error: "Name is required." };

  let normalizedPhone: string | null = null;
  if (phone.trim()) {
    const result = normalizePhone(phone);
    if (!result.ok) return { ok: false, error: result.error };
    normalizedPhone = result.value;
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: name.trim(), phone: normalizedPhone },
  });
  return { ok: true };
}

export type AccountStatus = {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  emailVerified: boolean;
  /** Phone missing — the post-login setup gate stays up until one is on file. */
  needsSetup: boolean;
};

/**
 * Always reads fresh from the database (not the JWT session), so it stays
 * correct even though the session itself doesn't carry phone/verification
 * fields and isn't refreshed automatically after verification completes.
 */
export async function getAccountStatus(): Promise<AccountStatus | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true, image: true, emailVerified: true },
    });
    if (!user) return null;

    return {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone,
      image: user.image,
      emailVerified: !!user.emailVerified,
      needsSetup: !user.phone,
    };
  } catch (err) {
    console.error("[account-status] failed to load account for user", session.user.id, err);
    return null;
  }
}

export type CompleteAccountSetupResult =
  | { ok: true; name: string; phone: string }
  | { ok: false; error: string };

/** Like updateProfile, but phone is mandatory — the post-login account-setup gate. */
export async function completeAccountSetup(
  name: string,
  phone: string
): Promise<CompleteAccountSetupResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };
  const trimmedName = name.trim();
  if (!trimmedName) return { ok: false, error: "Full name is required." };

  const phoneResult = normalizePhone(phone);
  if (!phoneResult.ok) return { ok: false, error: phoneResult.error };

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { name: trimmedName, phone: phoneResult.value },
    });
    return { ok: true, name: trimmedName, phone: phoneResult.value };
  } catch (err) {
    console.error("[account-setup] failed to save profile for user", session.user.id, err);
    return { ok: false, error: "We couldn't save your details. Please try again." };
  }
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in." };

  await db.user.delete({ where: { id: session.user.id } });
  await signOut({ redirectTo: "/" });
  return { ok: true as const };
}
