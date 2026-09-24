"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { PRODUCTS } from "@/lib/constants";
import { getSavedSlugs } from "@/lib/actions/savedProducts";
import ProductCard from "@/components/designs/ProductCard";
import { gsap } from "@/lib/gsap";

export default function DesignsPage() {
  return (
    <Suspense fallback={null}>
      <DesignsContent />
    </Suspense>
  );
}

function DesignsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { status } = useSession();
  const [saved, setSaved] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      getSavedSlugs().then(setSaved);
    }
  }, [status]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [query]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".product-card", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <div className="max-w-xl">
        <p className="text-mono-label text-xs text-text-faint">The Collection</p>
        <h1 className="text-display mt-3 text-3xl text-text md:text-4xl">{PRODUCTS.length} pieces.</h1>
        <p className="mt-3 text-text-dim">
          Each one designed, printed and finished individually. No configurator, no variants — what you see is what arrives.
        </p>
      </div>

      {query && (
        <p className="mt-8 text-sm text-text-dim">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length > 0 ? (
        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:mt-14 lg:grid-cols-4 lg:gap-x-6"
        >
          {filtered.map((product) => (
            <div key={product.slug} className="product-card">
              <ProductCard product={product} saved={saved.includes(product.slug)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-text">No pieces match your search.</p>
          <p className="mt-1 text-sm text-text-dim">Try a different keyword.</p>
        </div>
      )}
    </div>
  );
}
