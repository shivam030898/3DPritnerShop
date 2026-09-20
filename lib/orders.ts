export const ORDER_STAGES = [
  {
    key: "placed",
    label: "Order placed",
    offsetHours: 0,
    description: "We've received your order and confirmed payment.",
  },
  {
    key: "review",
    label: "Design review",
    offsetHours: 0.1,
    description: "Your file passed our automated print-readiness check.",
  },
  {
    key: "queued",
    label: "Queued",
    offsetHours: 1,
    description: "Your order is in the production queue.",
  },
  {
    key: "printing",
    label: "Printing",
    offsetHours: 3,
    description: "Your model is currently being printed.",
  },
  {
    key: "quality",
    label: "Quality check",
    offsetHours: 26,
    description: "A technician is inspecting the finished print.",
  },
  {
    key: "packed",
    label: "Packed",
    offsetHours: 34,
    description: "Your order is boxed and ready for pickup.",
  },
  {
    key: "shipped",
    label: "Shipped",
    offsetHours: 48,
    description: "Your package has left our facility.",
  },
  {
    key: "out_for_delivery",
    label: "Out for delivery",
    offsetHours: 90,
    description: "Your package is on a vehicle headed your way.",
  },
  {
    key: "delivered",
    label: "Delivered",
    offsetHours: 96,
    description: "Your package has been delivered.",
  },
] as const;

export type OrderStageKey = (typeof ORDER_STAGES)[number]["key"];

export function generateOrderId() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `ORD-${n}`;
}

export function generateTrackingNumber() {
  const n = Math.floor(100000 + Math.random() * 899999);
  return `TRK-${n}`;
}

type HasCreatedAt = { createdAt: Date | string };

export function getOrderStageIndex(order: HasCreatedAt, now: Date = new Date()): number {
  const elapsedHours =
    (now.getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
  let index = 0;
  for (let i = 0; i < ORDER_STAGES.length; i++) {
    if (elapsedHours >= ORDER_STAGES[i].offsetHours) index = i;
  }
  return index;
}

export function getEstimatedDelivery(order: HasCreatedAt): Date {
  const deliveredOffset = ORDER_STAGES[ORDER_STAGES.length - 1].offsetHours;
  return new Date(
    new Date(order.createdAt).getTime() + deliveredOffset * 60 * 60 * 1000
  );
}
