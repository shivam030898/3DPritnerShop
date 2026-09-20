"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { CartItem } from "@/lib/generated/prisma";
import { buildConfigKey, mergeCartItems, type CartLineItem, type NewCartItem } from "@/lib/cart";
import type { ColorKey, MaterialKey, QualityKey } from "@/lib/constants";

export type CartResult = { ok: true; items: CartLineItem[] } | { ok: false; error: string };

const GENERIC_ERROR = "We couldn't update your cart. Please try again.";

function toLineItem(row: CartItem): CartLineItem {
  return {
    configKey: row.configKey,
    type: row.type as CartLineItem["type"],
    name: row.name,
    quantity: row.quantity,
    unitPrice: row.unitPrice,
    slug: row.slug ?? undefined,
    imageId: row.imageId ?? undefined,
    fileName: row.fileName ?? undefined,
    fileUrl: row.fileUrl ?? undefined,
    fileType: (row.fileType as CartLineItem["fileType"]) ?? undefined,
    statsJson: row.statsJson ?? undefined,
    material: (row.material as MaterialKey) ?? undefined,
    color: (row.color as ColorKey) ?? undefined,
    quality: (row.quality as QualityKey) ?? undefined,
    sizeLabel: row.sizeLabel ?? undefined,
    widthMm: row.widthMm ?? undefined,
    depthMm: row.depthMm ?? undefined,
    heightMm: row.heightMm ?? undefined,
  };
}

function toCartWriteData(userId: string, configKey: string, item: NewCartItem, quantity: number) {
  return {
    userId,
    configKey,
    type: item.type,
    name: item.name,
    quantity,
    unitPrice: item.unitPrice,
    slug: item.slug,
    imageId: item.imageId,
    fileName: item.fileName,
    fileUrl: item.fileUrl,
    fileType: item.fileType,
    statsJson: item.statsJson,
    material: item.material,
    color: item.color,
    quality: item.quality,
    sizeLabel: item.sizeLabel,
    widthMm: item.widthMm,
    depthMm: item.depthMm,
    heightMm: item.heightMm,
  };
}

async function getCartRows(userId: string) {
  const rows = await db.cartItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return rows.map(toLineItem);
}

/** Logs server-side context (never full item payloads) without exposing it to the client. */
function logCartError(action: string, userId: string | undefined, err: unknown) {
  console.error(`[cart] ${action} failed for user ${userId ?? "unknown"}:`, err);
}

export async function getCartAction(): Promise<CartResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true, items: [] };

  try {
    return { ok: true, items: await getCartRows(session.user.id) };
  } catch (err) {
    logCartError("getCartAction", session.user.id, err);
    return { ok: false, error: "We couldn't load your cart. Please refresh and try again." };
  }
}

export async function addToCartAction(item: NewCartItem): Promise<CartResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true, items: [] };
  const userId = session.user.id;
  const configKey = buildConfigKey(item);
  const quantity = item.quantity ?? 1;

  try {
    // A single atomic upsert (increment on conflict) avoids a race between
    // concurrent add-to-cart calls for the same variant creating duplicates.
    await db.cartItem.upsert({
      where: { userId_configKey: { userId, configKey } },
      create: toCartWriteData(userId, configKey, item, quantity),
      update: { quantity: { increment: quantity } },
    });
    return { ok: true, items: await getCartRows(userId) };
  } catch (err) {
    logCartError("addToCartAction", userId, err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export async function updateCartItemAction(configKey: string, quantity: number): Promise<CartResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true, items: [] };
  const userId = session.user.id;

  try {
    if (quantity < 1) {
      await db.cartItem.deleteMany({ where: { userId, configKey } });
    } else {
      await db.cartItem.updateMany({ where: { userId, configKey }, data: { quantity } });
    }
    return { ok: true, items: await getCartRows(userId) };
  } catch (err) {
    logCartError("updateCartItemAction", userId, err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export async function removeCartItemAction(configKey: string): Promise<CartResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true, items: [] };
  const userId = session.user.id;

  try {
    await db.cartItem.deleteMany({ where: { userId, configKey } });
    return { ok: true, items: await getCartRows(userId) };
  } catch (err) {
    logCartError("removeCartItemAction", userId, err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export async function clearCartAction(): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  try {
    await db.cartItem.deleteMany({ where: { userId: session.user.id } });
    return { ok: true };
  } catch (err) {
    logCartError("clearCartAction", session.user.id, err);
    return { ok: false };
  }
}

/**
 * Merges a guest (localStorage) cart into the signed-in user's persistent
 * cart. Matching configKeys have their quantities summed; new configKeys
 * are inserted as new rows. Never deletes existing account-cart rows.
 *
 * Idempotent by construction: it recomputes the target quantity per
 * configKey from the current DB rows + the guest snapshot and upserts that
 * total (rather than incrementing), all inside one transaction — so a
 * caller can safely retry with the same guest snapshot without double
 * counting, as long as it only clears the guest snapshot after this
 * resolves `ok: true`.
 */
export async function mergeGuestCartAction(guestItems: CartLineItem[]): Promise<CartResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true, items: [] };
  const userId = session.user.id;

  try {
    if (guestItems.length === 0) {
      return { ok: true, items: await getCartRows(userId) };
    }

    const existingRows = await getCartRows(userId);
    const merged = mergeCartItems(existingRows, guestItems);

    await db.$transaction(
      merged.map((item) =>
        db.cartItem.upsert({
          where: { userId_configKey: { userId, configKey: item.configKey } },
          create: toCartWriteData(userId, item.configKey, item, item.quantity),
          update: { quantity: item.quantity },
        })
      )
    );

    return { ok: true, items: await getCartRows(userId) };
  } catch (err) {
    logCartError("mergeGuestCartAction", userId, err);
    return { ok: false, error: "We couldn't sync your cart to your account. Please try again." };
  }
}
