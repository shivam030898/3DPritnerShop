"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/useCart";
import { cn } from "@/lib/utils";

export default function CartButton({ className }: { className?: string }) {
  const { itemCount, hydrated } = useCart();
  const showBadge = hydrated && itemCount > 0;

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-surface-2 hover:text-text",
        className
      )}
    >
      <ShoppingCart size={19} strokeWidth={1.75} />
      {showBadge && (
        <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium leading-none text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
