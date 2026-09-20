"use client";

import type { CartLineItem } from "./cart";

const KEY = "forma-guest-cart";

export function loadGuestCart(): CartLineItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLineItem[]) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items: CartLineItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable — cart simply won't persist, non-fatal.
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
