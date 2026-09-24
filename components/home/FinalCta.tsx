import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, productImage } from "@/lib/constants";
import Button from "@/components/ui/Button";

const BACKDROP = PRODUCTS.find((p) => p.slug === "tentacle")!;

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:py-32">
      <Image
        src={productImage(BACKDROP.imageId)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="text-display max-w-lg text-[clamp(2rem,4.5vw,3.25rem)] text-white">
          Own one of {PRODUCTS.length}.
        </h2>
        <p className="mt-4 max-w-md text-white/75">
          Each piece is made to order — no configurator, no fine print, just the object as shown.
        </p>
        <div className="mt-8">
          <Button as="link" href="/designs" size="lg">
            View the collection
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
