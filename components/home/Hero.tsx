"use client";

import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PRODUCTS, getProductPrice, productImage } from "@/lib/constants";
import { formatINR, cn } from "@/lib/utils";
import Button, { ButtonArrow } from "@/components/ui/Button";
import Link from "next/link";

// The orbit's visuals are genuine WebGL 3D spheres (real geometry + physical
// material + lighting, not a flat image in a circle) — that needs a browser
// canvas, so this chunk only ever loads client-side.
const OrbitSpheres = dynamic(() => import("./OrbitSpheres"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;
const PRICED_PRODUCTS = PRODUCTS.map(getProductPrice).filter((p): p is number => p !== null);
const FROM_PRICE = PRICED_PRODUCTS.length > 0 ? Math.min(...PRICED_PRODUCTS) : null;

type Layer = "front" | "middle" | "back";

type OrbitSpec = {
  slug: string;
  layer: Layer;
  /** Degrees clockwise from 12 o'clock, at each tier the bubble is visible
   *  in. The orbit ring itself keeps spinning on top of this — this is
   *  just this bubble's fixed seat on the ring. Tiers re-balance the
   *  angles of the visible subset so it always reads as one even circle
   *  (2 bubbles → 180° apart, 4 → 90° apart, 6 → 60° apart) instead of a
   *  leftover arc from the desktop layout. */
  angle: { base: number; sm?: number; lg?: number };
};

// front = always visible (mobile+), middle = sm and up, back = lg and up —
// this is the "reduce bubble count on small screens" lever from the design
// brief. Top (0°) and bottom (180°) stay anchored across every tier so the
// composition doesn't visibly reshuffle at the breakpoint edges.
const ORBIT: OrbitSpec[] = [
  { slug: "kunai", layer: "front", angle: { base: 0 } },
  { slug: "hexapod-mug-stand", layer: "front", angle: { base: 180 } },
  { slug: "tentacle", layer: "middle", angle: { base: 90, lg: 60 } },
  { slug: "shuriken-four-point", layer: "middle", angle: { base: 270, lg: 300 } },
  { slug: "celtic-coaster", layer: "back", angle: { base: 240 } },
  { slug: "corset-vase", layer: "back", angle: { base: 120 } },
];

// Every bubble is the same size at every tier — depth now reads through the
// marble spheres' own lighting/shadow (see OrbitSpheres), not per-layer CSS
// shadow strength — and this is what the measured orbit-radius safety
// margins (see globals.css) are tuned against.
const BUBBLE_SIZE = "w-16";

const LAYER_VISIBILITY: Record<Layer, string> = {
  front: "block",
  middle: "hidden sm:block",
  back: "hidden lg:block",
};

export default function Hero() {
  // Mutable, not state: the 3D layer reads these refs itself inside its own
  // render loop (see OrbitSpheres' useFrame) rather than through React, so
  // updating them here must never trigger a re-render.
  const bubbleEls = useRef<Record<string, HTMLAnchorElement | null>>({});
  const getBubbleEl = useCallback((slug: string) => bubbleEls.current[slug] ?? null, []);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const sphereItems = useMemo(
    () =>
      ORBIT.map((spec) => ({
        slug: spec.slug,
        imageUrl: productImage(PRODUCTS.find((p) => p.slug === spec.slug)!.imageId),
      })),
    []
  );

  return (
    <section className="relative -mt-16 flex min-h-screen min-h-svh min-h-dvh items-center overflow-hidden px-5 py-14 md:px-8 lg:py-0">
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

      <div className="relative z-10 mx-auto flex w-full min-h-[520px] max-w-[1400px] items-center justify-center py-8 lg:min-h-[92vh] lg:py-12">
        {/* The marble spheres render into this sibling canvas, NOT as a
            child of .hero-orbit below — .hero-orbit is the element that
            physically spins (see globals.css), and nesting the canvas
            inside it would spin the canvas's own DOM box along with it,
            corrupting the very rect this canvas reads every frame to place
            each sphere. Both stay anchored to this same centered box, so
            their coordinate spaces still line up perfectly. */}
        <OrbitSpheres items={sphereItems} getEl={getBubbleEl} hoveredSlug={hoveredSlug} />

        {/* Orbit ring — centered on this same box, so its center always
            matches the center of the text column below. Past a wide-and-tall
            enough viewport (see .hero-orbit in globals.css) the ring spins
            continuously; each item counter-spins by the same amount so the
            bubble stays upright while only its position travels around the
            circle. Below that it holds a static circular arrangement. */}
        <div className="hero-orbit pointer-events-none absolute inset-0 z-20">
          {ORBIT.map((spec) => (
            <OrbitBubble
              key={spec.slug}
              spec={spec}
              registerEl={(el) => {
                bubbleEls.current[spec.slug] = el;
              }}
              onHoverChange={(hovered) => setHoveredSlug(hovered ? spec.slug : null)}
            />
          ))}
        </div>

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
            className="relative z-40 mt-7"
          >
            <Button as="link" href="/designs" size="lg">
              View the collection
              <ButtonArrow>
                <ArrowRight size={14} />
              </ButtonArrow>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-white/70"
          >
            {FROM_PRICE !== null && (
              <>
                <span>From {formatINR(FROM_PRICE)}</span>
                <span>·</span>
              </>
            )}
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

function OrbitBubble({
  spec,
  registerEl,
  onHoverChange,
}: {
  spec: OrbitSpec;
  registerEl: (el: HTMLAnchorElement | null) => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const product = PRODUCTS.find((p) => p.slug === spec.slug)!;
  const bubblePrice = getProductPrice(product);
  const visibility = LAYER_VISIBILITY[spec.layer];

  const angleVars = {
    "--angle-base": `${spec.angle.base}deg`,
    "--angle-sm": `${spec.angle.sm ?? spec.angle.base}deg`,
    "--angle-lg": `${spec.angle.lg ?? spec.angle.sm ?? spec.angle.base}deg`,
  } as CSSProperties;

  // No entrance animation here anymore — OrbitSpheres animates the marble
  // itself in from off-canvas-left along a curved path (see FRESH_ENTRANCE
  // there). This element only ever needs to sit at its final orbit seat: it's
  // an invisible hit target (for click/hover/focus/keyboard), not a visual,
  // so it never needs to visually travel anywhere itself.
  return (
    <div className={cn("hero-orbit-item pointer-events-none", visibility)} style={angleVars}>
      <div className="hero-orbit-upright">
        {/* Invisible hit target — sized and positioned exactly where the
            marble sphere is drawn, so the sphere stays clickable, focusable
            and announces as a link, while the actual visual comes from the
            shared WebGL canvas underneath. */}
        <Link
          ref={registerEl}
          href={`/designs/${product.slug}`}
          aria-label={`${product.name}${bubblePrice !== null ? ` · ${formatINR(bubblePrice)}` : ""}`}
          className={cn(
            "hero-orbit-bubble group relative block aspect-square cursor-pointer rounded-full pointer-events-auto",
            BUBBLE_SIZE
          )}
          onPointerEnter={() => onHoverChange(true)}
          onPointerLeave={() => onHoverChange(false)}
          onFocus={() => onHoverChange(true)}
          onBlur={() => onHoverChange(false)}
        >
          <div className="pointer-events-none absolute inset-x-0 -bottom-6 flex flex-col items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <p className="max-w-[120px] truncate rounded-full bg-text px-2.5 py-1 text-[10px] font-medium text-bg shadow-card">
              {product.name}
              {bubblePrice !== null && ` · ${formatINR(bubblePrice)}`}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
