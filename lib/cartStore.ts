"use client";

import { create } from "zustand";
import type { CartLineItem } from "./cart";

export type CartMode = "guest" | "account";

type CartState = {
  items: CartLineItem[];
  mode: CartMode;
  /** True once the cart has been loaded/merged for the current session. */
  hydrated: boolean;
  /** True while a server round-trip (fetch, merge, mutate) is in flight. */
  loading: boolean;

  setItems: (items: CartLineItem[]) => void;
  setMode: (mode: CartMode) => void;
  setHydrated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  mode: "guest",
  hydrated: false,
  loading: false,

  setItems: (items) => set({ items }),
  setMode: (mode) => set({ mode }),
  setHydrated: (hydrated) => set({ hydrated }),
  setLoading: (loading) => set({ loading }),
}));
