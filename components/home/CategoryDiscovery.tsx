import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, productImage } from "@/lib/constants";

export default function CategoryDiscovery() {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-display text-2xl text-text md:text-3xl">
          Find something worth printing.
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/designs?category=${c.key}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-surface-2"
            >
              <Image
                src={productImage(c.imageId)}
                alt={c.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
              <p className="absolute bottom-3 left-3.5 text-sm font-medium text-white">{c.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
