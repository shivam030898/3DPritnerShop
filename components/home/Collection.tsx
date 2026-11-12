"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { PRODUCTS, getProductPrice, productMedia, type Product } from "@/lib/constants";
import { getSavedSlugs } from "@/lib/actions/savedProducts";
import { formatINR, cn } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { toast } from "@/lib/toastStore";
import SaveButton from "@/components/designs/SaveButton";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The section the hero hands off to. It is a "sheet": rounded top corners,
 * stacked above the sticky hero, so scrolling slides it up over the footage
 * rather than cutting from one block to the next.
 *
 * It lists the whole catalog straight from PRODUCTS (same source as
 * /designs), in an editorial grid — the first piece takes a 2×2 lead slot on
 * large screens and a full-width slot on small ones. Save and quick-add work
 * exactly as they do on the /designs cards.
 */
export default function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { status } = useSession();
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      getSavedSlugs().then(setSaved);
    }
  }, [status]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        })
        .fromTo(q(".col-rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0)
        .fromTo(q(".col-fade"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.15)
        .fromTo(q(".col-line"), { yPercent: 112 }, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.2);

      // Cards arrive row by row as they scroll in, not all at once.
      const cards = q(".col-card");
      gsap.set(cards, { y: 44, opacity: 0 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            overwrite: true,
            clearProps: "transform",
          }),
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative z-10 rounded-t-[28px] bg-bg px-5 pb-24 pt-14 md:rounded-t-[40px] md:px-8 md:pb-32 md:pt-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-text-faint md:text-[11px]">
          <p className="col-fade">The collection</p>
          <p className="col-fade tabular-nums">
            {String(PRODUCTS.length).padStart(2, "0")} objects
          </p>
        </div>
        <div className="col-rule mt-4 h-px origin-left bg-border-strong" />

        <div className="mt-10 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2
            aria-label="Not just a model. A physical object."
            className="col-heading text-display uppercase lg:col-span-8"
          >
            <span aria-hidden className="-my-[0.08em] block overflow-hidden py-[0.08em]">
              <span className="col-line block text-text-faint will-change-transform">
                Not just a model.
              </span>
            </span>
            <span aria-hidden className="-my-[0.08em] block overflow-hidden py-[0.08em]">
              <span className="col-line block text-text will-change-transform">
                A physical object<span className="text-accent">.</span>
              </span>
            </span>
          </h2>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="col-fade max-w-[40ch] leading-relaxed text-text-dim">
              Each one designed, printed and finished individually. No configurator, no variants —
              what you see is what arrives.
            </p>
            <Link
              href="/designs"
              className="col-fade group mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-text"
            >
              <span className="relative py-1">
                View all pieces
                <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-text transition-transform duration-500 ease-[var(--ease-standard)] group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
              </span>
              <ArrowRight
                size={14}
                aria-hidden
              />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-20 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
          {PRODUCTS.map((product, index) => (
            <ShowcaseCard
              key={product.slug}
              product={product}
              index={index}
              lead={index === 0}
              saved={saved.includes(product.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const EASE = "ease-[var(--ease-standard)] motion-reduce:transition-none";
// Controls stay visible on touch (no hover to reveal them) and tuck away
// until hover/focus wherever a real pointer exists.
const REVEAL =
  "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100";

function ShowcaseCard({
  product,
  index,
  lead,
  saved,
}: {
  product: Product;
  index: number;
  lead: boolean;
  saved: boolean;
}) {
  const { addItem } = useCart();
  const price = getProductPrice(product);
  const soldOut = product.availability === "sold-out";
  const canAdd = !soldOut && price !== null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAdd || price === null) return;
    addItem({
      slug: product.slug,
      name: product.name,
      imageId: product.imageId,
      unitPrice: price,
      quantity: 1,
    });
    toast(`Added ${product.name} to cart`, "success");
  };

  return (
    <Link
      href={`/designs/${product.slug}`}
      className={cn(
        "col-card group relative flex flex-col outline-none",
        lead && "col-span-2 lg:row-span-2"
      )}
    >
      <div
        className={cn(
          "showcase-surface relative overflow-hidden rounded-[20px] md:rounded-[24px]",
          lead ? "aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1" : "aspect-[4/5]"
        )}
      >
        <div className={cn("absolute", lead ? "inset-[9%]" : "inset-[13%]")}>
          <Image
            src={productMedia(product.imageId)}
            alt={product.name}
            fill
            sizes={
              lead
                ? "(max-width: 1024px) 100vw, 50vw"
                : "(max-width: 1024px) 50vw, 25vw"
            }
            className={`object-contain transition-transform duration-[900ms] group-hover:scale-[1.06] group-focus-visible:scale-[1.06] motion-reduce:group-hover:scale-100 ${EASE}`}
          />
        </div>

        <p className="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[0.18em] tabular-nums text-black/45 md:left-5 md:top-5">
          {String(index + 1).padStart(2, "0")}
          {product.availability === "limited" && <span className="ml-2 text-black/70">Limited</span>}
        </p>

        <div className={`absolute right-3 top-3 transition-opacity duration-300 md:right-4 md:top-4 ${REVEAL} ${EASE}`}>
          <SaveButton slug={product.slug} initialSaved={saved} />
        </div>

        {/* "View" tag fades in on hover — pointer devices only. */}
        <span
          aria-hidden
          className={`absolute bottom-3 left-3 hidden h-8 items-center gap-1.5 rounded-full bg-[#0a0a0b] pl-3.5 pr-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:bottom-4 md:left-4 [@media(hover:hover)]:inline-flex ${EASE}`}
        >
          View
          <ArrowUpRight size={12} />
        </span>

        {canAdd && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`absolute bottom-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-text shadow-card outline-none backdrop-blur transition-opacity duration-300 hover:bg-surface focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-text/25 md:bottom-4 md:right-4 ${REVEAL} ${EASE}`}
          >
            <Plus size={14} />
          </button>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/60 backdrop-blur-[1px]">
            <p className="text-mono-label text-[11px] text-text">Sold out</p>
          </div>
        )}
      </div>

      {/* Phones: half-width cards have no room for name + price on one row or
          for a clipped sentence, so they stack name over price and leave
          the description to the lead card. */}
      <div
        className={cn(
          "mt-4 flex gap-x-4 gap-y-1",
          lead ? "items-start justify-between" : "flex-col sm:flex-row sm:items-start sm:justify-between"
        )}
      >
        <div className="min-w-0">
          <p className={cn("text-display truncate text-text", lead ? "text-lg md:text-2xl" : "text-[15px] md:text-base")}>
            {product.name}
          </p>
          <p
            className={cn(
              "mt-1.5 text-[13px] leading-relaxed text-text-dim",
              lead ? "line-clamp-2 max-w-[52ch] md:text-sm" : "hidden sm:line-clamp-2"
            )}
          >
            {product.description}
          </p>
        </div>
        <p
          className={cn(
            "shrink-0 tabular-nums",
            lead ? "text-base text-text md:text-lg" : "text-sm text-text-dim sm:text-text"
          )}
        >
          {price !== null ? formatINR(price) : "—"}
        </p>
      </div>
    </Link>
  );
}
