"use client";

import { useCartSync } from "@/lib/useCart";

export default function CartProvider() {
  useCartSync();
  return null;
}
