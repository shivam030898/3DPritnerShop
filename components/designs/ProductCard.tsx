"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/constants";
import { productImage } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { toast } from "@/lib/toastStore";
import SaveButton from "./SaveButton";

export default function ProductCard({
  product,
  saved = false,
}: {
  product: Product;
  saved?: boolean;
}) {
  const { addItem } = useCart();
  const soldOut = product.availability === "sold-out";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem({
      slug: product.slug,
      name: product.name,
      imageId: product.imageId,
      unitPrice: product.price,
      quantity: 1,
    });
    toast(`Added ${product.name} to cart`, "success");
  };

  return (
    <Link href={`/designs/${product.slug}`} className="group flex cursor-pointer flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <Image
          src={productImage(product.imageId)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-[1.03]"
        />

        <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <SaveButton slug={product.slug} initialSaved={saved} />
        </div>

        {product.availability === "limited" && (
          <p className="text-mono-label absolute left-3 top-3 text-[10px] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
            Limited
          </p>
        )}

        {!soldOut && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 cursor-pointer items-center justify-center rounded-full bg-bg/90 text-text opacity-0 shadow-card backdrop-blur transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:bg-bg"
          >
            <Plus size={15} />
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
        <p className="shrink-0 text-sm text-text-dim">{formatINR(product.price)}</p>
      </div>
    </Link>
  );
}
