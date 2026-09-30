"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS, getProductPrice, productMedia } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PRODUCT = PRODUCTS.find((p) => p.slug === "shuriken-four-point")!;

export default function FeaturedPiece() {
  const sectionRef = useRef<HTMLElement>(null);
  const price = getProductPrice(PRODUCT);
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fp-reveal", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-border bg-surface-2 px-5 py-24 md:py-32"
    >
      <div className="fp-reveal relative mx-auto max-w-xl text-center">
        <p className="text-mono-label text-xs text-text-faint">Featured piece</p>
      </div>

      {/* The shuriken, dead center, inside two counter-rotating reticle
          rings — a "target lock" frame felt like the obvious motif for a
          throwing star. Rings spin independently of the shuriken's own
          hover-spin below. */}
      <div
        className="fp-reveal relative mx-auto mt-10 flex h-[280px] w-[280px] items-center justify-center md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="absolute inset-0 rounded-full border border-dashed border-text/15"
          style={
            shouldReduceMotion
              ? undefined
              : { animation: "hero-orbit-spin 40s linear infinite" }
          }
        />
        <div
          className="absolute inset-6 rounded-full border border-text/10 md:inset-10"
          style={
            shouldReduceMotion
              ? undefined
              : { animation: "hero-orbit-counter-spin 28s linear infinite" }
          }
        />

        <motion.div
          className="relative h-[58%] w-[58%] cursor-pointer"
          variants={
            shouldReduceMotion
              ? undefined
              : {
                  rest: { rotate: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
                  hover: {
                    rotate: 360,
                    scale: 1.06,
                    transition: { rotate: { duration: 0.6, ease: "linear", repeat: Infinity }, scale: { duration: 0.3, ease: "easeOut" } },
                  },
                }
          }
          initial="rest"
          animate={hovered ? "hover" : "rest"}
        >
          <Image
            src={productMedia(PRODUCT.imageId)}
            alt={PRODUCT.name}
            fill
            sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 420px"
            className="object-contain drop-shadow-[0_0_36px_rgba(0,0,0,0.65)]"
          />
        </motion.div>
      </div>

      <div className="fp-reveal relative mx-auto mt-10 max-w-lg text-center">
        <h2 className="text-display text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] text-text">
          {PRODUCT.name}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-text-dim">{PRODUCT.story}</p>
        <p className="text-display mt-6 text-2xl text-text">
          {price !== null ? formatINR(price) : "Price unavailable"}
        </p>

        <div className="mt-8 flex justify-center">
          <MagneticButton href={`/designs/${PRODUCT.slug}`}>View piece</MagneticButton>
        </div>
      </div>
    </section>
  );
}

/**
 * A bespoke CTA for this section only (not the shared <Button/>) — pulls
 * toward the cursor within its own bounds and glows on hover, on top of a
 * light-sweep across the pill. Scoped here rather than added to the shared
 * Button component so every other CTA site-wide keeps its current, calmer
 * hover language.
 */
function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: relX * 0.25, y: relY * 0.35 });
  };
  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.div
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.3 }}
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full bg-text px-7 text-sm font-semibold text-bg shadow-[0_0_0_0_rgba(16,57,252,0)] transition-shadow duration-300 hover:shadow-[0_0_40px_4px_var(--color-accent-line)]"
      >
        <span className="relative z-10">{children}</span>
        <ArrowUpRight
          size={16}
          className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
        />
        {/* Light sweep — mix-blend-difference so the same white streak reads
            as a bright glint on the button's dark-mode-light / light-mode-dark
            fill either way, instead of needing two separate sweep colors. */}
        <span className="absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-white/40 mix-blend-difference transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
      </Link>
    </motion.div>
  );
}
