import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MATERIALS, PRODUCTS, productImage } from "@/lib/constants";

function representativeProduct(materialKey: string) {
  return PRODUCTS.find((p) => p.material === materialKey) ?? PRODUCTS[0];
}

export default function MaterialsShowcase() {
  return (
    <section className="border-y border-border bg-surface px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-display text-2xl text-text md:text-3xl">Print it your way.</h2>
            <p className="mt-2 max-w-md text-text-dim">
              Every print is made to order in a material matched to what the object needs to do.
            </p>
          </div>
          <Link
            href="/materials"
            className="hidden items-center gap-1 text-sm text-text-dim hover:text-text sm:flex"
          >
            All materials <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {MATERIALS.map((m) => {
            const product = representativeProduct(m.key);
            return (
              <div
                key={m.key}
                className="group overflow-hidden rounded-xl border border-border bg-bg"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={productImage(product.imageId)}
                    alt={`${m.name} print example`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-medium text-text">{m.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-faint">{m.bestFor}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/materials" className="flex items-center gap-1 text-sm font-medium text-text">
            All materials <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
