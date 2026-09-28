"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Button, { ButtonArrow } from "@/components/ui/Button";

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
              <ButtonArrow>
                <ArrowRight size={14} />
              </ButtonArrow>
            </Button>
          </div>
          <p className="cta-reveal mt-10 text-mono-label text-[10px] text-text-faint">
            {PRODUCTS.length} objects · made to order
          </p>
        </div>

        <div className="cta-piece order-first h-[280px] overflow-hidden rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:h-[360px] sm:p-10 lg:order-none lg:h-[440px]">
          <div className="relative h-full w-full">
            <Image
              src="/media/a1-mini.webp"
              alt="The Bambu Lab A1 mini printer FORMA prints every piece on"
              fill
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
