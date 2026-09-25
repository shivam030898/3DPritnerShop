"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PRODUCTS, getProductPrice, productImage } from "@/lib/constants";
import { formatINR, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;
const FROM_PRICE = Math.min(...PRODUCTS.map(getProductPrice));

// Bubbles rise in staggered, one after another — this is the per-bubble
// delay step, and stays inside the 0.12–0.25s range that reads as an
// intentional cascade rather than a synchronized pop or a sluggish crawl.
const ENTRANCE_STAGGER = 0.16;

/** True once we know the visitor's OS-level reduced-motion preference —
 *  starts false (matches SSR) and updates after mount, so the continuous
 *  idle drift never runs for anyone who has asked for less motion. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

// Every floating circle is exactly this size at a given breakpoint — one
// shared value, not a per-item one, so the set reads as a single consistent
// system rather than a mix of small/medium/large bubbles.
const CIRCLE_SIZE = "w-24 sm:w-32 lg:w-40";

type Layer = "back" | "middle" | "front";

type ModelSpec = {
  slug: string;
  layer: Layer;
  position: string;
  rotate: number;
  /** One full idle drift cycle, in seconds — kept well outside the entrance
   *  animation's duration so the two never visually overlap in speed. */
  floatDuration: number;
  /** Extra phase offset added after this bubble's entrance finishes, so
   *  idle drift starts at a slightly different moment for every bubble. */
  floatDelay: number;
  /** Idle drift amplitude, in px/deg — tiny, physical-object-sized motion.
   *  Signs vary per bubble so neighbors drift in different directions. */
  floatX: number;
  floatY: number;
  floatRotate: number;
};

// Layer controls visibility per breakpoint (front: always, middle: sm+, back: lg+),
// parallax reach and drop-shadow strength — see LAYER_STYLE below. Size and
// opacity are intentionally NOT layer-dependent anymore — every circle is
// the same size, fully opaque, so depth reads only through shadow/parallax.
const MODELS: ModelSpec[] = [
  {
    slug: "kunai",
    layer: "front",
    position: "left-[2%] top-[16%] sm:left-[5%]",
    rotate: -6,
    floatDuration: 6.2,
    floatDelay: 0,
    floatX: 10,
    floatY: -12,
    floatRotate: 3,
  },
  {
    slug: "shuriken-three-point",
    layer: "front",
    position: "right-[2%] bottom-[6%] sm:right-[5%]",
    rotate: 5,
    floatDuration: 7.4,
    floatDelay: 0.6,
    floatX: -13,
    floatY: 9,
    floatRotate: -2.5,
  },
  {
    slug: "tentacle",
    layer: "middle",
    position: "right-[6%] top-[14%] sm:right-[10%]",
    rotate: 4,
    floatDuration: 5.4,
    floatDelay: 0.3,
    floatX: 8,
    floatY: 11,
    floatRotate: 2,
  },
  {
    slug: "pen-holder-figure",
    layer: "middle",
    position: "left-[6%] bottom-[3%] sm:left-[11%]",
    rotate: -4,
    floatDuration: 8.1,
    floatDelay: 0.9,
    floatX: -11,
    floatY: -14,
    floatRotate: -3.5,
  },
  {
    slug: "shuriken-four-point",
    layer: "middle",
    position: "left-[0%] top-1/2 -translate-y-1/2 sm:left-[1%]",
    rotate: -3,
    floatDuration: 5.8,
    floatDelay: 1.2,
    floatX: 14,
    floatY: 8,
    floatRotate: 2.8,
  },
  {
    slug: "celtic-coaster",
    layer: "back",
    position: "right-[0%] top-1/2 -translate-y-1/2 sm:right-[2%]",
    rotate: 3,
    floatDuration: 6.7,
    floatDelay: 0.4,
    floatX: -9,
    floatY: 13,
    floatRotate: -3,
  },
  {
    slug: "corset-vase",
    layer: "back",
    position: "left-[22%] top-[16%]",
    rotate: -2,
    floatDuration: 8.6,
    floatDelay: 0.8,
    floatX: 12,
    floatY: -10,
    floatRotate: 3.4,
  },
];

const LAYER_STYLE: Record<
  Layer,
  { visibility: string; shadow: string; z: string; parallax: number }
> = {
  back: {
    visibility: "hidden lg:block",
    shadow: "drop-shadow-[0_14px_18px_rgba(0,0,0,0.12)]",
    z: "z-0",
    parallax: 3,
  },
  middle: {
    visibility: "hidden sm:block",
    shadow: "drop-shadow-[0_18px_22px_rgba(0,0,0,0.14)]",
    z: "z-10",
    parallax: 5,
  },
  front: {
    visibility: "block",
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
            "radial-gradient(ellipse 42% 38% at 50% 48%, var(--hero-glow), transparent 72%)",
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
            The Objects
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.78, ease: EASE }}
            className="text-display mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]"
          >
            Objects made
            <br />
            to be collected.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.86, ease: EASE }}
            className="mt-3 max-w-[32ch] text-sm text-white/80 [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]"
          >
            A curated series of sculptural pieces, designed, printed, and finished with intention.
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
  const reduceMotion = usePrefersReducedMotion();

  // Entrance: this bubble's resting position (spec.position) is the anchor —
  // it rises into place from below, like a bubble floating up from
  // underwater, then hands off to the idle drift loop below.
  const entranceDuration = 1.3 + (index % 3) * 0.2; // 1.2–1.8s
  const entranceDelay = index * ENTRANCE_STAGGER;
  const entranceStartY = 120 + (index % 3) * 25; // 100–180px below rest
  const entranceStartScale = index % 2 === 0 ? 0.86 : 0.89; // 0.85–0.9

  // Idle drift only starts once this bubble has fully settled, so the two
  // animations never run at the same time.
  const idleStartDelay = entranceDelay + entranceDuration + spec.floatDelay;

  return (
    <motion.div
      style={{ x, y }}
      className={cn("absolute", spec.position, CIRCLE_SIZE, style.visibility, style.z)}
    >
      {/* Entrance — rises from below into this bubble's anchor position, then never moves again. */}
      <motion.div
        initial={{ opacity: 0, y: entranceStartY, scale: entranceStartScale }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: entranceDuration, delay: entranceDelay, ease: EASE }}
      >
        {/* Idle drift — tiny, slow, out-of-phase per bubble; disabled for prefers-reduced-motion. */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, spec.floatX, 0, -spec.floatX * 0.6, 0],
                  y: [0, spec.floatY, 0, -spec.floatY * 0.6, 0],
                  rotate: [0, spec.floatRotate, 0, -spec.floatRotate * 0.6, 0],
                }
          }
          transition={{
            duration: spec.floatDuration,
            delay: idleStartDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            style={{ rotate: spec.rotate }}
            className={cn("group relative cursor-pointer", style.shadow)}
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
                  {product.name} · {formatINR(getProductPrice(product))}
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
