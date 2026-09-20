"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/constants";
import { unsplashUrl } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { getProductSizeOptions } from "@/lib/productSize";
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
  // The grid teaser always quotes the Medium (native) size — the full
  // picker lives on the product page, per the "choose size" requirement.
  const mediumSize = getProductSizeOptions(product).find((o) => o.key === "medium")!;
  const longestMm = Math.max(
    mediumSize.dimensionsMm.width,
    mediumSize.dimensionsMm.depth,
    mediumSize.dimensionsMm.height
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      type: "product",
      slug: product.slug,
      name: product.name,
      imageId: product.imageId,
      color: product.colors[0],
      sizeLabel: mediumSize.label,
      widthMm: mediumSize.dimensionsMm.width,
      depthMm: mediumSize.dimensionsMm.depth,
      heightMm: mediumSize.dimensionsMm.height,
      unitPrice: mediumSize.price.unitCost,
      quantity: 1,
    });
    toast(`Added ${product.name} to cart`, "success");
  };

  return (
    <Link href={`/designs/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-2 shadow-card">
        <Image
          src={unsplashUrl(product.imageId)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute right-2.5 top-2.5">
          <SaveButton slug={product.slug} initialSaved={saved} />
        </div>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute inset-x-2.5 bottom-2.5 flex translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-text/90 py-2 text-xs font-medium text-bg opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingCart size={13} />
          Add to cart
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text">{product.name}</p>
          <p className="mt-0.5 text-xs text-text-faint">
            {product.material.toUpperCase()} · {Math.round(longestMm)}mm
          </p>
        </div>
        <p className="shrink-0 text-sm text-text">{formatINR(mediumSize.price.unitCost)}</p>
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs text-text-faint">
        <Star size={11} className="fill-current" />
        {product.rating} ({product.reviewCount})
      </div>
    </Link>
  );
}
