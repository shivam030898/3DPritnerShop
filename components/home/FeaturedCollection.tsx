import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, productImage } from "@/lib/constants";

const COLLECTION_KEYS = ["desk", "collectibles", "anime", "gaming", "home"] as const;
const COLLECTIONS = COLLECTION_KEYS.map((key) => CATEGORIES.find((c) => c.key === key)!);

export default function FeaturedCollection() {
  return (
    <section className="border-y border-border bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-display text-2xl text-text md:text-3xl">Built for your space.</h2>
        <p className="mt-2 max-w-md text-text-dim">
          A print for every room, desk and shelf — browse by where it&apos;s going.
        </p>
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.key}
            href={`/designs?category=${c.key}`}
            className="group relative h-[340px] w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-2 sm:h-[420px] sm:w-[300px]"
          >
            <Image
              src={productImage(c.imageId)}
              alt={c.label}
              fill
              sizes="300px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <p className="text-display text-lg text-white">{c.label}</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
