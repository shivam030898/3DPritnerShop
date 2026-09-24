"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/lib/constants";
import { productImage } from "@/lib/constants";
import { getProductSizeOptions } from "@/lib/productSize";
import { formatINR } from "@/lib/utils";
import SaveButton from "@/components/designs/SaveButton";

/**
 * Dark-themed product tile for the homepage marquee — deliberately styled
 * with fixed dark-palette hex values (matching FORMA's own dark-mode
 * tokens) rather than the theme-aware `--color-*` vars, so this band reads
 * the same premium dark showcase regardless of the site's light/dark
 * toggle, mirroring how the FinalCta band already does this.
 */
export default function MarqueeProductCard({
  product,
  saved = false,
  priority = false,
  onDragClick,
}: {
  product: Product;
  saved?: boolean;
  priority?: boolean;
  onDragClick: (e: React.MouseEvent) => void;
}) {
  const size = getProductSizeOptions(product).find((o) => o.key === "medium")!;
  const longestMm = Math.max(size.dimensionsMm.width, size.dimensionsMm.depth, size.dimensionsMm.height);

  return (
    <Link
      href={`/designs/${product.slug}`}
      onClickCapture={onDragClick}
      draggable={false}
      className="group block select-none rounded-xl border border-white/10 bg-[#131315] p-2.5 transition-colors hover:border-white/20"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#1a1a1d]">
        <Image
          src={productImage(product.imageId)}
          alt={product.name}
          fill
          draggable={false}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 62vw, (max-width: 1024px) 34vw, 21vw"
          className="pointer-events-none object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute right-2 top-2">
          <SaveButton slug={product.slug} initialSaved={saved} />
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="truncate text-sm font-medium text-white">{product.name}</p>
        <p className="shrink-0 text-sm text-white">{formatINR(size.price.unitCost)}</p>
      </div>
      <p className="mt-0.5 text-xs text-white/50">
        {product.material.toUpperCase()} · {Math.round(longestMm)}mm
      </p>
      <div className="mt-1.5 flex items-center gap-1 text-xs text-white/50">
        <Star size={11} className="fill-current text-white/70" />
        {product.rating} ({product.reviewCount})
      </div>
    </Link>
  );
}
