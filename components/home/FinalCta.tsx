"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, productMedia } from "@/lib/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Button from "@/components/ui/Button";

/**
 * A small still-life of real pieces from the catalog, not a single
 * full-bleed product photo — the point is to read as "a collection," not
 * "a close-up of one random object." Each entry's `imageId` must have a
 * background-removed cutout (see `productMedia`/`THUMB_IMAGE_IDS` in
 * lib/constants.ts) so it sits directly on the section's theme surface
 * with no baked-in backdrop of its own.
 *
 * Position/width are percentages of the cluster container (itself the
 * right ~55% of the section), so the composition scales together rather
 * than each piece drifting independently at different viewport widths.
 */
const PIECES = [
  {
    slug: "corset-vase",
    imageId: "corset-vase",
    intrinsicW: 777,
    intrinsicH: 1111,
    style: { top: "4%", right: "6%", width: "32%" },
    rotate: -2,
  },
  {
    slug: "hexapod-mug-stand",
    imageId: "hexapod-mug-stand",
    intrinsicW: 1590,
    intrinsicH: 1219,
    style: { top: "52%", right: "32%", width: "36%" },
    rotate: 3,
  },
  {
    slug: "twist-vase",
    imageId: "twist-vase",
    intrinsicW: 916,
    intrinsicH: 1543,
    style: { top: "6%", right: "40%", width: "15%" },
    rotate: 2,
  },
  {
    slug: "kunai",
    imageId: "cyber-samurai",
    intrinsicW: 521,
    intrinsicH: 1213,
    style: { top: "56%", right: "2%", width: "13%" },
    rotate: -4,
  },
] as const;

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-piece", {
        opacity: 0,
        y: 18,
        scale: 0.94,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      gsap.from(".cta-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-surface px-5 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
        <div className="max-w-md">
          <p className="cta-reveal text-mono-label text-xs text-text-faint">The FORMA collection</p>
          <h2 className="cta-reveal text-display mt-4 text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.05] text-text">
            Objects worth keeping around.
          </h2>
          <p className="cta-reveal mt-5 text-sm leading-relaxed text-text-dim md:text-base">
            A small collection of digitally designed objects, printed one piece at a time. Some are
            useful. Some are strange. All of them are made to be seen.
          </p>
          <div className="cta-reveal mt-8">
            <Button as="link" href="/designs" size="lg">
              Explore the collection
              <ArrowRight size={14} />
            </Button>
          </div>
          <p className="cta-reveal mt-10 text-mono-label text-[10px] text-text-faint">
            {PRODUCTS.length} objects · made to order
          </p>
        </div>

        <div className="relative order-first h-[280px] sm:h-[360px] lg:order-none lg:h-[440px]">
          {PIECES.map((piece) => (
            <div
              key={piece.slug}
              className="cta-piece absolute drop-shadow-[0_24px_32px_rgba(20,20,20,0.18)]"
              style={{ ...piece.style, rotate: `${piece.rotate}deg` }}
            >
              <Image
                src={productMedia(piece.imageId)}
                alt=""
                width={piece.intrinsicW}
                height={piece.intrinsicH}
                sizes="(max-width: 1024px) 40vw, 24vw"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
