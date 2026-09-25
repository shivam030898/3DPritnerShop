"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, productImage } from "@/lib/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const BACKDROP = PRODUCTS.find((p) => p.slug === "tentacle")!;

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The backdrop settles from a slight overscale — the same "was moving,
      // now at rest" cue as a slow camera pull, not a continuous parallax.
      gsap.from(".cta-image", {
        scale: 1.05,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
      gsap.from(".cta-reveal", {
        opacity: 0,
        y: 26,
        duration: 0.9,
        stagger: 0.14,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] items-end overflow-hidden md:min-h-[80vh]"
    >
      <div className="cta-image absolute inset-0">
        <Image src={productImage(BACKDROP.imageId)} alt="" fill sizes="100vw" className="object-cover" />
      </div>

      {/* Bottom-anchored reading gradient only — the upper half of the piece
          stays essentially untouched so the object itself remains the subject,
          not a darkened backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.62) 28%, rgba(0,0,0,0.18) 56%, transparent 78%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 md:px-12 md:pb-24">
        <div className="max-w-xl">
          <p className="cta-reveal text-mono-label text-xs text-white/60">The Collection</p>
          <h2 className="cta-reveal text-display mt-4 text-[clamp(3rem,5vw,5.5rem)] leading-[0.95] text-white">
            Own one of {PRODUCTS.length}.
          </h2>
          <p className="cta-reveal mt-5 max-w-sm text-sm leading-relaxed text-white/65 md:text-base">
            Each piece is made to order — no configurator, no fine print, just the object as shown.
          </p>
          <div className="cta-reveal mt-9">
            <Link
              href="/designs"
              className="group inline-flex items-center gap-2.5 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/10"
            >
              View the collection
              <ArrowRight size={15} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <p className="cta-reveal mt-14 text-mono-label text-[10px] text-white/40 md:mt-16">
          {PRODUCTS.length} objects · made to order
        </p>
      </div>
    </section>
  );
}
