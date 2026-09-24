"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/lib/useCart";
import { formatINR } from "@/lib/utils";
import CartLineCard from "@/components/cart/CartLineCard";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/configure/StepIndicator";

export default function CartPage() {
  const router = useRouter();
  const { items, hydrated, loading, subtotal, shipping, total, updateQuantity, removeItem } =
    useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <Loader2 size={20} className="animate-spin text-text-faint" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-text-faint">
          <ShoppingCart size={24} strokeWidth={1.5} />
        </span>
        <h1 className="text-display mt-6 text-2xl text-text">Your cart is empty</h1>
        <p className="mt-2 text-text-dim">Browse designs or upload your own model to get started.</p>
        <Button as="link" href="/designs" className="mt-8">
          Explore designs
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <StepIndicator current={3} />
      <h1 className="mt-8 text-display text-2xl text-text md:text-3xl">Your cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartLineCard
              key={item.configKey}
              item={item}
              onQuantityChange={(quantity) => updateQuantity(item.configKey, quantity)}
              onRemove={() => removeItem(item.configKey)}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-text">Summary</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-dim">Subtotal</span>
                <span className="text-text">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Estimated shipping</span>
                <span className="text-text">{formatINR(shipping)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-text">Estimated total</span>
              <span className="text-display text-xl text-text">{formatINR(total)}</span>
            </div>
            <Button
              onClick={() => router.push("/checkout")}
              disabled={loading}
              size="lg"
              className="mt-5 w-full justify-center"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Proceed to checkout"}
              {!loading && <ArrowRight size={16} />}
            </Button>
            <Link
              href="/designs"
              className="mt-3 block text-center text-sm text-text-dim transition-colors hover:text-text"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
