"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Check, Star, Truck } from "lucide-react";
import { PRODUCTS, COLORS, productImage, type ColorKey } from "@/lib/constants";
import { useCart } from "@/lib/useCart";
import { getProductSizeOptions, formatDimensionsMm, type SizeKey } from "@/lib/productSize";
import { formatINR, cn } from "@/lib/utils";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SizeSelector from "@/components/designs/SizeSelector";
import Button from "@/components/ui/Button";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const router = useRouter();
  const { addItem } = useCart();
  const [color, setColor] = useState<ColorKey>(product.colors[0]);
  const [sizeKey, setSizeKey] = useState<SizeKey>("medium");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const sizeOptions = getProductSizeOptions(product);
  const selectedSize = sizeOptions.find((o) => o.key === sizeKey) ?? sizeOptions[1];

  const buildItem = () => ({
    type: "product" as const,
    slug: product.slug,
    name: product.name,
    imageId: product.imageId,
    color,
    sizeLabel: selectedSize.label,
    widthMm: selectedSize.dimensionsMm.width,
    depthMm: selectedSize.dimensionsMm.depth,
    heightMm: selectedSize.dimensionsMm.height,
    quantity,
    unitPrice: selectedSize.price.unitCost,
  });

  const handleAddToCart = () => {
    if (!selectedSize.fitsPrinter) return;
    addItem(buildItem());
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize.fitsPrinter) return;
    addItem(buildItem());
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-2">
          <Image
            src={productImage(product.imageId)}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <p className="text-xs text-text-faint">by {product.creator}</p>
          <h1 className="text-display mt-1 text-2xl text-text md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-text-dim">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-current text-text" />
              {product.rating} ({product.reviewCount})
            </span>
            <span>·</span>
            <span>{product.material.toUpperCase()}</span>
          </div>
          <p className="text-display mt-4 text-2xl text-text">{formatINR(selectedSize.price.unitCost)}</p>
          <p className="mt-1 text-sm text-text-faint">{formatDimensionsMm(selectedSize.dimensionsMm)}</p>

          <p className="mt-5 text-sm leading-relaxed text-text-dim">{product.description}</p>

          <div className="mt-6">
            <SizeSelector options={sizeOptions} selectedKey={sizeKey} onSelect={(key) => setSizeKey(key as SizeKey)} />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-text">Color</p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((key) => {
                const c = COLORS.find((col) => col.key === key)!;
                const active = color === key;
                return (
                  <button
                    key={key}
                    onClick={() => setColor(key)}
                    aria-label={c.name}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform",
                      active ? "border-text scale-105" : "border-transparent hover:scale-105"
                    )}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
                      style={{ background: c.hex }}
                    >
                      {active && (
                        <Check size={13} className={c.key === "white" ? "text-text" : "text-white"} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-text">Quantity</p>
            <div className="mt-3">
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 justify-center"
              disabled={!selectedSize.fitsPrinter}
              onClick={handleAddToCart}
            >
              {added ? "Added ✓" : "Add to cart"}
            </Button>
            <Button
              size="lg"
              className="flex-1 justify-center"
              disabled={!selectedSize.fitsPrinter}
              onClick={handleBuyNow}
            >
              Buy now
            </Button>
          </div>
          {added && (
            <Link href="/checkout" className="mt-3 block text-center text-sm font-medium text-text underline underline-offset-2">
              Go to checkout →
            </Link>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
            <Spec label="Print time" value={`~${selectedSize.price.productionHours}h`} />
            <Spec label="Est. weight" value={`~${selectedSize.price.weightG}g`} />
            <Spec label="Dimensions" value={formatDimensionsMm(selectedSize.dimensionsMm)} />
            <Spec label="Material" value={product.material.toUpperCase()} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-text-faint">
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
    <div className="flex justify-between">
      <span className="text-text-dim">{label}</span>
      <span className="text-text">{value}</span>
    </div>
  );
}
