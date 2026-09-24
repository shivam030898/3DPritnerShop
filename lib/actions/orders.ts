"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateOrderId, generateTrackingNumber } from "@/lib/orders";

const CARRIERS = ["Xpressbees", "Delhivery", "Shiprocket"];
const SHIPPING_FLAT = 99;

export type CheckoutDetails = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pin: string;
  addressId?: string;
  paymentMethod: string;
};

export type PlaceOrderResult =
  | { ok: true; orderNumbers: string[]; total: number }
  | { ok: false; error: string };

/**
 * Places an order for every line item currently in the signed-in user's
 * cart. Cart contents are read from the database (never trusted from the
 * client) so prices can't be tampered with in transit. Each cart line
 * becomes its own Order row — the existing Order model is per-item — and
 * the cart is cleared once all orders are created.
 */
export async function placeCartOrder(details: CheckoutDetails): Promise<PlaceOrderResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to place an order." };
  }
  const userId = session.user.id;

  // Never trust a frontend "verified" flag — re-check against the database
  // directly, so a request that bypasses the UI entirely still can't place
  // an order for an unverified account.
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });
  if (!user) {
    return { ok: false, error: "You must be signed in to place an order." };
  }
  if (!user.emailVerified) {
    return { ok: false, error: "Email verification required." };
  }

  const cartRows = await db.cartItem.findMany({ where: { userId } });
  if (cartRows.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const createdAt = new Date();
  const addressSnapshot = JSON.stringify({
    name: details.name,
    line1: details.line1,
    city: details.city,
    state: details.state,
    pin: details.pin,
  });

  try {
    const orderNumbers: string[] = [];
    let total = 0;

    await db.$transaction(async (tx) => {
      for (const row of cartRows) {
        const subtotal = row.unitPrice * row.quantity;
        const orderTotal = subtotal + SHIPPING_FLAT;

        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderId(),
            userId,
            productSlug: row.slug ?? undefined,
            itemName: row.name,
            itemType: "product",
            quantity: row.quantity,
            unitPrice: row.unitPrice,
            subtotal,
            shipping: SHIPPING_FLAT,
            total: orderTotal,
            paymentMethod: details.paymentMethod,
            paymentStatus: "PAID",
            status: "PENDING",
            addressId: details.addressId,
            addressSnapshot,
            trackingNumber: generateTrackingNumber(),
            carrier: CARRIERS[Math.floor(Math.random() * CARRIERS.length)],
            createdAt,
            statusHistory: {
              create: { status: "PENDING" },
            },
          },
        });

        await tx.notification.create({
          data: {
            userId,
            type: "order_placed",
            message: `Your order ${order.orderNumber} has been placed.`,
          },
        });

        orderNumbers.push(order.orderNumber);
        total += orderTotal;
      }

      await tx.cartItem.deleteMany({ where: { userId } });
    });

    return { ok: true, orderNumbers, total };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Something went wrong placing your order." };
  }
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: { statusHistory: { orderBy: { createdAt: "asc" } } },
  });
}
