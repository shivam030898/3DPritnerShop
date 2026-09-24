"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import ProductCard from "@/components/designs/ProductCard";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Collection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".col-heading > *", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
      gsap.from(".product-card", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: ".col-grid", start: "top 85%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="px-5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="col-heading flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-mono-label text-xs text-text-faint">The full set</p>
            <h2 className="text-display mt-3 text-2xl text-text md:text-3xl">The collection.</h2>
          </div>
          <Link
            href="/designs"
            className="flex items-center gap-1.5 text-sm text-text-dim transition-colors hover:text-text"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="col-grid mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:mt-14 lg:grid-cols-4 lg:gap-x-6">
          {PRODUCTS.map((product) => (
            <div key={product.slug} className="product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
