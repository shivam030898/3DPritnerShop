"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "./cartStore";
import { loadGuestCart, saveGuestCart, clearGuestCart } from "./guestCart";
import { buildConfigKey, cartTotals, type CartLineItem, type NewCartItem } from "./cart";
import {
  addToCartAction,
  updateCartItemAction,
  removeCartItemAction,
  clearCartAction,
  getCartAction,
  mergeGuestCartAction,
  type CartResult,
} from "./actions/cart";
import { toast } from "./toastStore";

/**
 * Mount exactly once (see components/providers/CartProvider.tsx). Watches
 * auth status and:
 *  - on sign-in, merges any local guest cart into the account cart, then
 *    clears the guest copy so it isn't merged again;
 *  - on sign-out, switches back to the local guest cart without touching
 *    the (preserved) account cart in the database.
 */
export function useCartSync() {
  const { status } = useSession();
  const setItems = useCartStore((s) => s.setItems);
  const setMode = useCartStore((s) => s.setMode);
  const setHydrated = useCartStore((s) => s.setHydrated);
  const setLoading = useCartStore((s) => s.setLoading);
  const handledStatus = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (handledStatus.current === status) return;
    handledStatus.current = status;

    let cancelled = false;

    (async () => {
      if (status === "authenticated") {
        setLoading(true);
        try {
          const guestItems = loadGuestCart();
          if (guestItems.length > 0) {
            const result = await mergeGuestCartAction(guestItems);
            if (result.ok) {
              // The server has now durably absorbed these items into the
              // account cart — clear the local copy unconditionally (not
              // gated on `cancelled`) so a later remount never re-submits
              // the same snapshot and double-counts quantities.
              clearGuestCart();
              if (!cancelled) {
                setItems(result.items);
                toast("Your cart was synced to your account", "success");
              }
            } else if (!cancelled) {
              // Leave the guest cart in localStorage untouched — nothing
              // was merged, so it's safe to retry on the next load.
              toast(result.error, "error");
              setItems(await fallbackToServerCart());
            }
          } else {
            setItems(await fallbackToServerCart());
          }
          if (!cancelled) setMode("account");
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        setItems(loadGuestCart());
        setMode("guest");
      }
      if (!cancelled) setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [status, setItems, setMode, setHydrated, setLoading]);
}

async function fallbackToServerCart() {
  const result = await getCartAction();
  return result.ok ? result.items : [];
}

function applyResult(result: CartResult, setItems: (items: CartLineItem[]) => void) {
  if (result.ok) {
    setItems(result.items);
  } else {
    toast(result.error, "error");
  }
}

/** Read/mutate the cart from any component. Safe to call from many places. */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const mode = useCartStore((s) => s.mode);
  const hydrated = useCartStore((s) => s.hydrated);
  const loading = useCartStore((s) => s.loading);
  const setItems = useCartStore((s) => s.setItems);
  const setLoading = useCartStore((s) => s.setLoading);

  const addItem = useCallback(
    async (input: NewCartItem) => {
      const configKey = buildConfigKey(input);
      const quantity = input.quantity ?? 1;

      if (mode === "account") {
        setLoading(true);
        try {
          applyResult(await addToCartAction({ ...input, quantity }), setItems);
        } finally {
          setLoading(false);
        }
      } else {
        const current = useCartStore.getState().items;
        const idx = current.findIndex((i) => i.configKey === configKey);
        const next =
          idx === -1
            ? [...current, { ...input, configKey, quantity }]
            : current.map((i) =>
                i.configKey === configKey ? { ...i, quantity: i.quantity + quantity } : i
              );
        setItems(next);
        saveGuestCart(next);
      }
    },
    [mode, setItems, setLoading]
  );

  const removeItem = useCallback(
    async (configKey: string) => {
      if (mode === "account") {
        setLoading(true);
        try {
          applyResult(await removeCartItemAction(configKey), setItems);
        } finally {
          setLoading(false);
        }
      } else {
        const next = useCartStore.getState().items.filter((i) => i.configKey !== configKey);
        setItems(next);
        saveGuestCart(next);
      }
    },
    [mode, setItems, setLoading]
  );

  const updateQuantity = useCallback(
    async (configKey: string, quantity: number) => {
      if (quantity < 1) {
        await removeItem(configKey);
        return;
      }
      if (mode === "account") {
        setLoading(true);
        try {
          applyResult(await updateCartItemAction(configKey, quantity), setItems);
        } finally {
          setLoading(false);
        }
      } else {
        const next = useCartStore
          .getState()
          .items.map((i) => (i.configKey === configKey ? { ...i, quantity } : i));
        setItems(next);
        saveGuestCart(next);
      }
    },
    [mode, removeItem, setItems, setLoading]
  );

  const clearCart = useCallback(async () => {
    if (mode === "account") {
      await clearCartAction();
    } else {
      clearGuestCart();
    }
    setItems([]);
  }, [mode, setItems]);

  const totals = cartTotals(items);

  return {
    items,
    mode,
    hydrated,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    ...totals,
  };
}
