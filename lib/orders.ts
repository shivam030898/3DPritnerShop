import type { OrderStatus } from "@/lib/generated/prisma";

/**
 * The canonical customer-facing progress ladder. CANCELLED is a distinct
 * terminal state, not a rung on this ladder — see getOrderStageIndex.
 */
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_QUEUE",
  "PRINTING",
  "QUALITY_CHECK",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order placed",
  CONFIRMED: "Confirmed",
  IN_QUEUE: "In queue",
  PRINTING: "Printing",
  QUALITY_CHECK: "Quality check",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  PENDING: "We've received your order and confirmed payment.",
  CONFIRMED: "Your order has been reviewed and confirmed for production.",
  IN_QUEUE: "Your order is in the production queue.",
  PRINTING: "Your model is currently being printed.",
  QUALITY_CHECK: "A technician is inspecting the finished print.",
  PACKED: "Your order is boxed and ready for pickup.",
  SHIPPED: "Your package has left our facility.",
  DELIVERED: "Your package has been delivered.",
  CANCELLED: "This order has been cancelled.",
};

export function generateOrderId() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `ORD-${n}`;
}

export function generateTrackingNumber() {
  const n = Math.floor(100000 + Math.random() * 899999);
  return `TRK-${n}`;
}

/** Index into ORDER_STATUS_SEQUENCE, or -1 for a cancelled order (not part of the linear ladder). */
export function getOrderStageIndex(order: { status: OrderStatus }): number {
  if (order.status === "CANCELLED") return -1;
  return ORDER_STATUS_SEQUENCE.indexOf(order.status);
}

type HasCreatedAt = { createdAt: Date | string };

/** A rough, clearly-labeled estimate — we no longer simulate a precise per-stage timeline. */
export function getEstimatedDelivery(order: HasCreatedAt): Date {
  return new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000);
}
