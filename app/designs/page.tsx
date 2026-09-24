"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PRODUCTS, CATEGORIES, type ProductCategory } from "@/lib/constants";
import { getProductSizeOptions } from "@/lib/productSize";
import ProductCard from "@/components/designs/ProductCard";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "newest" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
];

function medianPrice(slug: string) {
  const product = PRODUCTS.find((p) => p.slug === slug)!;
  return getProductSizeOptions(product).find((o) => o.key === "medium")!.price.unitCost;
}

export default function DesignsPage() {
  return (
    <Suspense fallback={null}>
      <DesignsContent />
    </Suspense>
  );
}

function DesignsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category");
  const initialCategory: ProductCategory | "all" =
    categoryParam && CATEGORIES.some((c) => c.key === categoryParam)
      ? (categoryParam as ProductCategory)
      : "all";

  const [active, setActive] = useState<ProductCategory | "all">(initialCategory);
  const [sort, setSort] = useState<SortKey>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    let list = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    switch (sort) {
      case "popular":
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "newest":
        sorted.reverse();
        break;
      case "price-asc":
        sorted.sort((a, b) => medianPrice(a.slug) - medianPrice(b.slug));
        break;
      case "price-desc":
        sorted.sort((a, b) => medianPrice(b.slug) - medianPrice(a.slug));
        break;
    }
    return sorted;
  }, [active, sort, query]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display text-2xl text-text md:text-3xl">Designs marketplace</h1>
          <p className="mt-2 text-text-dim">Ready-made designs from independent creators.</p>
        </div>

        {query && (
          <p className="text-sm text-text-dim">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;{" "}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-1 font-medium text-text underline underline-offset-2"
            >
              Clear
            </button>
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <CategoryChip active={active === "all"} onClick={() => setActive("all")}>
            All
          </CategoryChip>
          {CATEGORIES.map((c) => (
            <CategoryChip key={c.key} active={active === c.key} onClick={() => setActive(c.key)}>
              {c.label}
            </CategoryChip>
          ))}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            onBlur={() => setTimeout(() => setSortOpen(false), 120)}
            className="flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm text-text transition-colors hover:border-text-faint"
          >
            Sort: {SORTS.find((s) => s.key === sort)?.label}
            <ChevronDown size={14} className={cn("transition-transform", sortOpen && "rotate-180")} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onMouseDown={() => {
                    setSort(s.key);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-2",
                    sort === s.key ? "text-text font-medium" : "text-text-dim"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-text">No designs match your search.</p>
          <p className="mt-1 text-sm text-text-dim">Try a different keyword or category.</p>
        </div>
      )}
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
