"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { PRODUCTS, COLORS, productImage } from "@/lib/constants";
import { getProductSizeOptions } from "@/lib/productSize";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { toast } from "@/lib/toastStore";
import Button from "@/components/ui/Button";

const PRODUCT = PRODUCTS.find((p) => p.slug === "modular-desk-organizer")!;

export default function FeaturedProduct() {
  const { addItem } = useCart();
  const size = getProductSizeOptions(PRODUCT).find((o) => o.key === "medium")!;

  const handleAddToCart = () => {
    addItem({
      type: "product",
      slug: PRODUCT.slug,
      name: PRODUCT.name,
      imageId: PRODUCT.imageId,
      color: PRODUCT.colors[0],
      sizeLabel: size.label,
      widthMm: size.dimensionsMm.width,
      depthMm: size.dimensionsMm.depth,
      heightMm: size.dimensionsMm.height,
      unitPrice: size.price.unitCost,
      quantity: 1,
    });
    toast(`Added ${PRODUCT.name} to cart`, "success");
  };

  return (
    <section className="border-y border-border bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Link
          href={`/designs/${PRODUCT.slug}`}
          className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2 lg:aspect-auto"
        >
          <Image
            src={productImage(PRODUCT.imageId)}
            alt={PRODUCT.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        <div className="flex flex-col justify-center">
          <p className="text-mono-label text-xs text-accent">Product of the week</p>
          <h2 className="text-display mt-3 text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.05] text-text">
            {PRODUCT.name}
          </h2>

          <div className="mt-5 flex items-center gap-3 text-sm text-text-dim">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-current text-text" />
              {PRODUCT.rating} ({PRODUCT.reviewCount})
            </span>
            <span>·</span>
            <span>by {PRODUCT.creator}</span>
          </div>

          <p className="text-display mt-3 text-2xl text-text">{formatINR(size.price.unitCost)}</p>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-dim">
            {PRODUCT.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <div>
              <p className="text-text-faint">Material</p>
              <p className="mt-1 text-text">{PRODUCT.material.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-text-faint">Available colors</p>
              <div className="mt-1.5 flex gap-2">
                {PRODUCT.colors.map((key) => {
                  const c = COLORS.find((col) => col.key === key)!;
                  return (
                    <span
                      key={key}
                      title={c.name}
                      className="h-6 w-6 rounded-full border border-border"
                      style={{ background: c.hex }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="link" href={`/designs/${PRODUCT.slug}`} size="lg" variant="secondary">
              Customize
            </Button>
            <Button size="lg" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
