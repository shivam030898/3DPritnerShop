"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/constants";
import { getProductPrice, productThumb } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { toast } from "@/lib/toastStore";
import SaveButton from "./SaveButton";

/**
 * One hover state, owned by the card (this `<Link>`), everything else
 * derives from it via `group-*` — a single duration/easing pair used
 * everywhere so the card reads as one surface coming forward, not several
 * elements animating independently (that was the previous bug: the card
 * lifted on one transition, the image zoomed 10% on another, and each
 * button faded/slid in on a third and fourth). The card scales up a hair
 * more than the image so the product still feels "inside" the card rather
 * than pasted on top of it.
 */
const HOVER_TRANSITION = "duration-300 ease-[var(--ease-standard)] motion-reduce:transition-none";

export default function ProductCard({
  product,
  saved = false,
}: {
  product: Product;
  saved?: boolean;
}) {
  const { addItem } = useCart();
  const price = getProductPrice(product);
  const soldOut = product.availability === "sold-out";
  const canAdd = !soldOut && price !== null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAdd || price === null) return;
    addItem({
      slug: product.slug,
      name: product.name,
      imageId: product.imageId,
      unitPrice: price,
      quantity: 1,
    });
    toast(`Added ${product.name} to cart`, "success");
  };

  return (
    <Link
      href={`/designs/${product.slug}`}
      className={`group relative flex cursor-pointer flex-col outline-none transition-transform hover:z-10 hover:scale-[1.025] focus-visible:z-10 focus-visible:scale-[1.025] focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100 ${HOVER_TRANSITION}`}
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(20,20,20,0.04)] transition-shadow group-hover:shadow-[0_16px_28px_rgba(20,20,20,0.10)] group-focus-visible:shadow-[0_16px_28px_rgba(20,20,20,0.10)] sm:p-9 ${HOVER_TRANSITION}`}
      >
        {/* A padded parent can't also be the positioning root for a `fill`
            image — `position: absolute; inset: 0` fills the PADDING box,
            not the content box, so it ignores padding on its own direct
            parent entirely. This inner wrapper is percentage-sized (respects
            the padding above via normal box-model math) and padding-free
            itself, so the fill image inside it fills exactly the reduced
            area instead of the full card. */}
        <div className="relative h-full w-full">
          <Image
            src={productThumb(product.imageId)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-contain transition-transform group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:group-hover:scale-100 ${HOVER_TRANSITION}`}
          />
        </div>

        <div
          className={`absolute right-3 top-3 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100 ${HOVER_TRANSITION}`}
        >
          <SaveButton slug={product.slug} initialSaved={saved} />
        </div>

        {product.availability === "limited" && (
          <p className="text-mono-label absolute left-3 top-3 text-[10px] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
            Limited
          </p>
        )}

        {canAdd && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`absolute bottom-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-text opacity-100 shadow-card backdrop-blur outline-none transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100 hover:bg-surface focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-text/25 ${HOVER_TRANSITION}`}
          >
            <Plus size={14} />
          </button>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/60 backdrop-blur-[1px]">
            <p className="text-mono-label text-[11px] text-text">Sold out</p>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-text">{product.name}</p>
          <p className="mt-0.5 text-xs text-text-faint">{product.category}</p>
        </div>
        <p className="shrink-0 text-sm text-text-dim">
          {price !== null ? formatINR(price) : "Price unavailable"}
        </p>
      </div>
    </Link>
  );
}
