"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES, type ProductCategory } from "@/lib/constants";
import ProductCard from "@/components/designs/ProductCard";
import { cn } from "@/lib/utils";

export default function DesignsPage() {
  const [active, setActive] = useState<ProductCategory | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">
        Don&apos;t have a design? Start here.
      </h1>
      <p className="mt-2 text-text-dim">Ready-made designs from independent creators.</p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
        <CategoryChip active={active === "all"} onClick={() => setActive("all")}>
          All
        </CategoryChip>
        {CATEGORIES.map((c) => (
          <CategoryChip key={c.key} active={active === c.key} onClick={() => setActive(c.key)}>
            {c.label}
          </CategoryChip>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
        active
          ? "border-text bg-text text-bg"
          : "border-border-strong text-text-dim hover:border-text-faint"
      )}
    >
      {children}
    </button>
  );
}
