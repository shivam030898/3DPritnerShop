import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import ProductCard from "@/components/designs/ProductCard";

const TRENDING = [...PRODUCTS].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8);

export default function TrendingCarousel() {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-display text-2xl text-text md:text-3xl">
              Or start with something already made.
            </h2>
            <p className="mt-2 text-text-dim">Trending designs, ready to print.</p>
          </div>
          <Link
            href="/designs"
            className="hidden shrink-0 items-center gap-1 text-sm text-text-dim hover:text-text sm:flex"
          >
            Explore all designs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TRENDING.map((product) => (
            <div key={product.slug} className="w-[160px] shrink-0 sm:w-[220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
