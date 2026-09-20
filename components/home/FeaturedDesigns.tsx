import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import ProductCard from "@/components/designs/ProductCard";

export default function FeaturedDesigns() {
  const featured = PRODUCTS.slice(0, 8);

  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="text-display text-2xl text-text md:text-3xl">
            Made by the community.
          </h2>
          <Link
            href="/designs"
            className="hidden items-center gap-1 text-sm text-text-dim hover:text-text sm:flex"
          >
            Explore all designs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/designs" className="flex items-center gap-1 text-sm font-medium text-text">
            Explore all designs <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
