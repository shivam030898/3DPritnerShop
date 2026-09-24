import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import { PRODUCTS, COLORS, MATERIALS, productImage } from "@/lib/constants";

const FILE_PRODUCT = PRODUCTS.find((p) => p.slug === "gravity-dice-tower")!;
const DELIVERED_PRODUCT = PRODUCTS.find((p) => p.slug === "wireless-charge-dock")!;

export default function ProcessSection({ videoSrc }: { videoSrc?: string | null }) {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-display text-2xl text-text md:text-3xl">From file to object.</h2>
        <p className="mt-2 max-w-md text-text-dim">
          Every print follows the same path, whether it&apos;s ours or yours.
        </p>

        <div className="mt-10 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:gap-x-3 md:gap-y-0">
          <ProcessStep label="Digital file" description="A 3D model, uploaded or chosen.">
            <div className="relative h-full w-full">
              <Image
                src={productImage(FILE_PRODUCT.imageId)}
                alt=""
                fill
                sizes="200px"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-accent/10" />
            </div>
          </ProcessStep>

          <Arrow />

          <ProcessStep label="Configure" description="Material, color, size and quantity.">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-2 p-4">
              <div className="flex gap-1.5">
                {COLORS.slice(0, 4).map((c) => (
                  <span
                    key={c.key}
                    className="h-5 w-5 rounded-full border border-border"
                    style={{ background: c.key === "custom" ? undefined : c.hex }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                {MATERIALS.slice(0, 3).map((m) => (
                  <span
                    key={m.key}
                    className="rounded-full border border-border-strong px-2 py-0.5 text-[10px] text-text-dim"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          </ProcessStep>

          <Arrow />

          <ProcessStep label="Print" description="Manufactured and quality checked.">
            {videoSrc ? (
              <video
                className="h-full w-full object-cover"
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden
              />
            ) : (
              <div className="h-full w-full bg-surface-2" />
            )}
          </ProcessStep>

          <Arrow />

          <ProcessStep label="Delivered" description="Packed carefully, shipped to you.">
            <div className="relative h-full w-full">
              <Image
                src={productImage(DELIVERED_PRODUCT.imageId)}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </ProcessStep>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-xl border border-border">
        {children}
      </div>
      <p className="mt-3 text-sm font-medium text-text">{label}</p>
      <p className="mt-0.5 text-xs text-text-dim">{description}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-text-faint">
      <ArrowDown size={16} className="md:hidden" />
      <ArrowRight size={16} className="hidden md:block" />
    </div>
  );
}
