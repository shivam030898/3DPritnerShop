import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, productImage } from "@/lib/constants";
import Button from "@/components/ui/Button";

const BACKDROP = PRODUCTS.find((p) => p.slug === "circuit-visor")!;

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
          Ready to make it real?
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as="link" href="/designs" size="lg">
            Shop designs
            <ArrowRight size={16} />
          </Button>
          <Button
            as="link"
            href="/upload"
            size="lg"
            variant="secondary"
            className="border-white/40 bg-transparent text-white hover:border-white"
          >
            Upload your design
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
