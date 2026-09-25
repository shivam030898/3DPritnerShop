"use client";

import { use, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { PRODUCTS, getProductPrice, productImage } from "@/lib/constants";
import { useCart } from "@/lib/useCart";
import { formatINR } from "@/lib/utils";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import { gsap } from "@/lib/gsap";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const soldOut = product.availability === "sold-out";
  const price = getProductPrice(product);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".pd-image", { opacity: 0, scale: 1.03, duration: 0.8 })
        .from(".pd-eyebrow", { opacity: 0, y: 10, duration: 0.5 }, "-=0.5")
        .from(".pd-title", { opacity: 0, y: 14, duration: 0.6 }, "-=0.35")
        .from(".pd-detail", { opacity: 0, y: 10, duration: 0.5, stagger: 0.06 }, "-=0.3");
    }, rootRef);
    return () => ctx.revert();
  }, [product.slug]);

  const buildItem = () => ({
    slug: product.slug,
    name: product.name,
    imageId: product.imageId,
    quantity,
    unitPrice: price,
  });

  const handleAddToCart = () => {
    if (soldOut) return;
    addItem(buildItem());
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (soldOut) return;
    addItem(buildItem());
    router.push("/cart");
  };

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="pd-image relative aspect-square overflow-hidden bg-surface-2 sm:aspect-[4/5]">
          <Image
            src={productImage(product.imageId)}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            priority
          />
          {product.availability === "limited" && (
            <p className="text-mono-label absolute left-4 top-4 text-[11px] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
              Limited
            </p>
          )}
        </div>

        <div className="lg:pt-2">
          <p className="pd-eyebrow text-xs text-text-faint">{product.category} · by {product.creator}</p>
          <h1 className="pd-title text-display mt-2 text-3xl leading-[1.05] text-text md:text-4xl">
            {product.name}
          </h1>
          <p className="pd-detail text-display mt-5 text-2xl text-text">{formatINR(price)}</p>

          <p className="pd-detail mt-4 max-w-[46ch] text-sm leading-relaxed text-text-dim">
            {product.description}
          </p>

          <div className="pd-detail mt-8 flex items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button
              size="lg"
              className="flex-1 justify-center"
              disabled={soldOut}
              onClick={handleAddToCart}
            >
              {soldOut ? "Sold out" : added ? "Added ✓" : "Add to cart"}
            </Button>
          </div>
          {!soldOut && (
            <button
              type="button"
              onClick={handleBuyNow}
              className="pd-detail mt-3 block w-full cursor-pointer text-center text-sm text-text-dim underline underline-offset-4 transition-colors hover:text-text"
            >
              Buy now
            </button>
          )}
          {added && (
            <Link
              href="/checkout"
              className="pd-detail mt-3 block text-center text-sm font-medium text-text underline underline-offset-2"
            >
              Go to checkout →
            </Link>
          )}

          <div className="pd-detail mt-10 grid grid-cols-2 gap-y-3 border-t border-border pt-6 text-sm">
            <Spec label="Material" value={product.material} />
            <Spec label="Finish" value={product.finish} />
            <Spec
              label="Dimensions"
              value={`${Math.round(product.dimensionsMm.width)} × ${Math.round(product.dimensionsMm.depth)} × ${Math.round(product.dimensionsMm.height)} mm`}
            />
            <Spec label="Availability" value={soldOut ? "Sold out" : product.availability === "limited" ? "Limited" : "In stock"} />
          </div>

          <p className="pd-detail mt-6 text-sm leading-relaxed text-text-faint">{product.story}</p>

          <div className="pd-detail mt-6 flex items-center gap-2 text-xs text-text-faint">
            <Truck size={14} />
            Ships in 2–4 business days
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-faint">{label}</p>
      <p className="mt-0.5 text-text">{value}</p>
    </div>
  );
}
