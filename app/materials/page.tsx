import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MATERIALS, PRODUCTS, productImage } from "@/lib/constants";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "PLA, PETG, ABS, TPU and Resin — choose the right material for your print, with real cost and finish trade-offs.",
};

function representativeProduct(materialKey: string) {
  return PRODUCTS.find((p) => p.material === materialKey) ?? PRODUCTS[0];
}

export default function MaterialsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Choose how it feels.</h1>
      <p className="mt-2 max-w-xl text-text-dim">
        Every print is made to order in one of five materials. Pick based on
        what the object needs to do.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {MATERIALS.map((m, i) => {
          const product = representativeProduct(m.key);
          const reversed = i % 2 === 1;
          return (
            <div
              key={m.key}
              className="grid grid-cols-1 items-center gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0 sm:grid-cols-[220px_1fr] sm:gap-10"
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-xl bg-surface-2 ${
                  reversed ? "sm:order-2" : ""
                }`}
              >
                <Image
                  src={productImage(product.imageId)}
                  alt={`${m.name} print example — ${product.name}`}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-display text-xl text-text">{m.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-dim">{m.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <span className="text-text-faint">
                    Best for <span className="text-text">{m.bestFor}</span>
                  </span>
                  <span className="text-text-faint">
                    Finish <span className="text-text">{m.finish}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex justify-center">
        <Button as="link" href="/upload" size="lg">
          Upload your design
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
