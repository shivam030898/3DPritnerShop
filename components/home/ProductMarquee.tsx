"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/constants";
import MarqueeProductCard from "./MarqueeProductCard";

const CARD_WIDTH_CLASS = "w-[62vw] shrink-0 sm:w-[34vw] lg:w-[21vw] xl:w-[18vw]";

export default function ProductMarquee({
  products,
  speed = 34,
  direction = 1,
}: {
  products: Product[];
  /** px per second */
  speed?: number;
  /** 1 = right-to-left (default), -1 = left-to-right */
  direction?: 1 | -1;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const x = useMotionValue(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setSequenceWidth(trackRef.current.scrollWidth / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products]);

  useAnimationFrame((_, delta) => {
    if (reducedMotion || pausedRef.current || draggingRef.current || sequenceWidth === 0) return;
    let next = x.get() - (direction * speed * delta) / 1000;
    if (direction === 1) {
      if (next <= -sequenceWidth) next += sequenceWidth;
    } else if (next >= 0) {
      next -= sequenceWidth;
    }
    x.set(next);
  });

  // Prevents a drag-swipe from also firing the card's Link navigation.
  const guardClick = (e: React.MouseEvent) => {
    if (dragDistanceRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragDistanceRef.current = 0;
  };

  if (reducedMotion) {
    return (
      <div className="flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden">
        {products.map((product, i) => (
          <div key={product.slug} className={CARD_WIDTH_CLASS}>
            <MarqueeProductCard product={product} priority={i < 3} onDragClick={() => {}} />
          </div>
        ))}
      </div>
    );
  }

  const doubled = [...products, ...products];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        drag="x"
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => {
          draggingRef.current = true;
          dragDistanceRef.current = 0;
        }}
        onDrag={(_, info) => {
          dragDistanceRef.current += Math.abs(info.delta.x);
        }}
        onDragEnd={() => {
          draggingRef.current = false;
        }}
        className="flex w-max cursor-grab gap-4 px-5 active:cursor-grabbing md:px-8"
      >
        {doubled.map((product, i) => (
          <div key={`${product.slug}-${i}`} className={CARD_WIDTH_CLASS}>
            <MarqueeProductCard
              product={product}
              priority={i < 3}
              onDragClick={guardClick}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
