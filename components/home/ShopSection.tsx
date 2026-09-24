import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import ProductMarquee from "./ProductMarquee";

export default function ShopSection() {
  return (
    <section id="shop" className="scroll-mt-16 py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 md:px-8">
        <div>
          <p className="text-mono-label text-xs text-accent">Explore the collection</p>
          <h2 className="text-display mt-2 text-2xl text-text md:text-3xl">Made to be printed.</h2>
          <p className="mt-2 max-w-md text-text-dim">
            Discover designs made for your desk, shelf, setup and everyday life.
          </p>
        </div>
        <Link
          href="/designs"
          className="hidden shrink-0 items-center gap-1 text-sm text-text-dim hover:text-text sm:flex"
        >
          View all designs <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-9 bg-[#0a0a0b] py-9 md:py-12">
        <ProductMarquee products={PRODUCTS} />
      </div>

      <div className="mt-6 flex justify-center px-5 sm:hidden">
        <Link href="/designs" className="flex items-center gap-1 text-sm font-medium text-text">
          View all designs <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
