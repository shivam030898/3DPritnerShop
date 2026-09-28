"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, getProductPrice, productMedia } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Button, { ButtonArrow } from "@/components/ui/Button";

const PRODUCT = PRODUCTS.find((p) => p.slug === "shuriken-four-point")!;

export default function FeaturedPiece() {
  const sectionRef = useRef<HTMLElement>(null);
  const price = getProductPrice(PRODUCT);
  const shouldReduceMotion = useReducedMotion();

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
    <section ref={sectionRef} className="border-y border-border bg-surface px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="fp-reveal relative aspect-[4/5] overflow-hidden rounded-2xl bg-white p-12 md:p-16 lg:order-2">
          {/* See ProductCard.tsx: a `fill` image can't be a direct child of
              its own padded parent — position:absolute; inset:0 fills the
              padding box, ignoring that padding entirely. This wrapper is
              percentage-sized instead, so it actually respects it. It also
              doubles as the spin target: a shuriken is symmetric, so a
              continuous slow spin on hover reads as "this throwing star is
              spinning" rather than an arbitrary UI animation.
              Rest and hover need separate transition configs, not one
              shared object — the hover spin's `repeat: Infinity` would
              otherwise also apply to the animation BACK to rest on
              mouse-leave, so it never actually reached 0° and looked stuck
              mid-spin. */}
          <motion.div
            className="relative h-full w-full cursor-pointer"
            variants={
              shouldReduceMotion
                ? undefined
                : {
                    rest: { rotate: 0, transition: { duration: 0.4, ease: "easeOut" } },
                    hover: { rotate: 360, transition: { duration: 0.6, ease: "linear", repeat: Infinity } },
                  }
            }
            initial="rest"
            whileHover={shouldReduceMotion ? undefined : "hover"}
          >
            <Image
              src={productMedia(PRODUCT.imageId)}
              alt={PRODUCT.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </motion.div>
        </div>

        <div className="lg:order-1">
          <p className="fp-reveal text-mono-label text-xs text-text-faint">Featured piece</p>
          <h2 className="fp-reveal text-display mt-4 text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] text-text">
            {PRODUCT.name}
          </h2>
          <p className="fp-reveal mt-4 max-w-md text-text-dim">{PRODUCT.story}</p>
          <p className="fp-reveal text-display mt-6 text-2xl text-text">
            {price !== null ? formatINR(price) : "Price unavailable"}
          </p>
          <div className="fp-reveal mt-7">
            <Button as="link" href={`/designs/${PRODUCT.slug}`} size="lg">
              View piece
              <ButtonArrow>
                <ArrowRight size={14} />
              </ButtonArrow>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
