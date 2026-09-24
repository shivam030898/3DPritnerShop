"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, productImage } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Button from "@/components/ui/Button";

const PRODUCT = PRODUCTS.find((p) => p.slug === "kunai")!;

export default function FeaturedPiece() {
  const sectionRef = useRef<HTMLElement>(null);

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
        <div className="fp-reveal relative aspect-[4/5] overflow-hidden bg-surface-2 lg:order-2">
          <Image
            src={productImage(PRODUCT.imageId)}
            alt={PRODUCT.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="lg:order-1">
          <p className="fp-reveal text-mono-label text-xs text-text-faint">Featured piece</p>
          <h2 className="fp-reveal text-display mt-4 text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] text-text">
            {PRODUCT.name}
          </h2>
          <p className="fp-reveal mt-4 max-w-md text-text-dim">{PRODUCT.story}</p>
          <p className="fp-reveal text-display mt-6 text-2xl text-text">{formatINR(PRODUCT.price)}</p>
          <div className="fp-reveal mt-7">
            <Button as="link" href={`/designs/${PRODUCT.slug}`} size="lg">
              View piece
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
