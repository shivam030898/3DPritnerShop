"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PRODUCTS, productImage } from "@/lib/constants";
import { formatINR, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;
const FROM_PRICE = Math.min(...PRODUCTS.map((p) => p.price));

type Layer = "back" | "middle" | "front";

type ModelSpec = {
  slug: string;
  layer: Layer;
  position: string;
  size: string;
  rotate: number;
  floatDuration: number;
  floatDelay: number;
};

// Layer controls visibility per breakpoint (front: always, middle: sm+, back: lg+),
// parallax reach, opacity and drop-shadow strength — see LAYER_STYLE below.
const MODELS: ModelSpec[] = [
  {
    slug: "kunai",
    layer: "front",
    position: "left-[2%] top-[16%] sm:left-[5%]",
    size: "w-32 sm:w-40 lg:w-52",
    rotate: -6,
    floatDuration: 5.6,
    floatDelay: 0,
  },
  {
    slug: "shuriken-three-point",
    layer: "front",
    position: "right-[2%] bottom-[6%] sm:right-[5%]",
    size: "w-32 sm:w-40 lg:w-52",
    rotate: 5,
    floatDuration: 6.4,
    floatDelay: 0.6,
  },
  {
    slug: "tentacle",
    layer: "middle",
    position: "right-[6%] top-[14%] sm:right-[10%]",
    size: "w-24 sm:w-28 lg:w-36",
    rotate: 4,
    floatDuration: 5.0,
    floatDelay: 0.3,
  },
  {
    slug: "pen-holder-figure",
    layer: "middle",
    position: "left-[6%] bottom-[3%] sm:left-[11%]",
    size: "w-24 sm:w-28 lg:w-36",
    rotate: -4,
    floatDuration: 6.0,
    floatDelay: 0.9,
  },
  {
    slug: "shuriken-four-point",
    layer: "middle",
    position: "left-[0%] top-1/2 -translate-y-1/2 sm:left-[1%]",
    size: "w-20 sm:w-24 lg:w-32",
    rotate: -3,
    floatDuration: 5.3,
    floatDelay: 1.2,
  },
  {
    slug: "celtic-coaster",
    layer: "back",
    position: "right-[0%] top-1/2 -translate-y-1/2 sm:right-[2%]",
    size: "w-16 lg:w-24",
    rotate: 3,
    floatDuration: 4.7,
    floatDelay: 0.4,
  },
  {
    slug: "corset-vase",
    layer: "back",
    position: "left-[22%] top-[16%]",
    size: "w-14 lg:w-20",
    rotate: -2,
    floatDuration: 5.9,
    floatDelay: 0.8,
  },
];

const LAYER_STYLE: Record<
  Layer,
  { visibility: string; opacity: string; shadow: string; z: string; parallax: number }
> = {
  back: {
    visibility: "hidden lg:block",
    opacity: "opacity-50",
    shadow: "drop-shadow-[0_14px_18px_rgba(0,0,0,0.12)]",
    z: "z-0",
    parallax: 3,
  },
  middle: {
    visibility: "hidden sm:block",
    opacity: "opacity-90",
    shadow: "drop-shadow-[0_18px_22px_rgba(0,0,0,0.14)]",
    z: "z-10",
    parallax: 5,
  },
  front: {
    visibility: "block",
    opacity: "opacity-100",
    shadow: "drop-shadow-[0_24px_28px_rgba(0,0,0,0.18)]",
    z: "z-20",
    parallax: 9,
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 90, damping: 20, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 90, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mvY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <section className="relative -mt-16 min-h-screen min-h-svh min-h-dvh overflow-hidden px-5 py-14 md:px-8 lg:py-0">
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/media/HeroPage.MOV" type="video/mp4" />
      </video>

      {/* Base tint: keeps the video visible while lifting overall contrast. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-black/32 md:bg-black/25" />

      {/* Localized spotlight, centered on the text column — smooth radial falloff so the
          floating product circles at the edges stay bright and the video reads clearly. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 66% at 50% 56%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0.14) 70%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 58% 54% at 50% 50%, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.24) 45%, rgba(0,0,0,0.08) 72%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 42% 38% at 50% 48%, var(--color-accent-soft), transparent 72%)",
        }}
      />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 mx-auto flex min-h-[520px] max-w-[1400px] items-center justify-center py-8 lg:min-h-[92vh] lg:py-12"
      >
        {MODELS.map((m, i) => (
          <HeroModel key={m.slug} spec={m} index={i} springX={springX} springY={springY} />
        ))}

        <div className="relative z-30 mx-auto flex w-full max-w-[420px] flex-col items-center px-2 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
            className="text-mono-label text-xs text-[#E8D8B8] [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]"
          >
            The Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.78, ease: EASE }}
            className="text-display mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]"
          >
            Objects worth
            <br />
            collecting.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.86, ease: EASE }}
            className="mt-3 max-w-[32ch] text-sm text-white/80 [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]"
          >
            {PRODUCTS.length} pieces, professionally designed, printed and finished — a small collection, not a catalog.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95, ease: EASE }}
            className="mt-7"
          >
            <Button as="link" href="/designs" size="lg">
              View the collection
              <ArrowRight size={14} />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-white/70"
          >
            <span>From {formatINR(FROM_PRICE)}</span>
            <span>·</span>
            <span>2–4 day delivery</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} />
              Secure checkout
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroModel({
  spec,
  index,
  springX,
  springY,
}: {
  spec: ModelSpec;
  index: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const product = PRODUCTS.find((p) => p.slug === spec.slug)!;
  const style = LAYER_STYLE[spec.layer];
  const reach = style.parallax;
  const x = useTransform(springX, [-1, 1], [-reach, reach]);
  const y = useTransform(springY, [-1, 1], [-reach, reach]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
      style={{ x, y }}
      className={cn("absolute", spec.position, spec.size, style.visibility, style.z)}
    >
      {/* Floating loop — isolated from the parallax transform above so both can run independently. */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: spec.floatDuration,
          delay: spec.floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{ rotate: spec.rotate }}
          className={cn("group relative cursor-pointer", style.opacity, style.shadow)}
        >
          <Link href={`/designs/${product.slug}`} className="block">
            {/* Only this circle scales on hover — the wrapper above (rotation,
                drop-shadow, group-hover trigger for the caption) stays put, so
                nothing around the image jumps or shifts. */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="aspect-square overflow-hidden rounded-full bg-surface-2"
            >
              <Image
                src={productImage(product.imageId)}
                alt={product.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-[filter] duration-200 ease-out group-hover:brightness-105"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-x-0 -bottom-6 flex flex-col items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="max-w-full truncate rounded-full bg-text px-2.5 py-1 text-[10px] font-medium text-bg shadow-card">
                {product.name} · {formatINR(product.price)}
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
