"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="about-reveal text-mono-label text-xs text-text-faint">How this started</p>
        <h2 className="about-reveal text-display mt-3 text-2xl leading-[1.15] text-text md:text-3xl">
          It started with one printer and too many tabs open.
        </h2>
        <p className="about-reveal mt-6 text-sm leading-relaxed text-text-dim md:text-base">
          FORMA began on a single Bambu A1, printing designs from small studios and
          independent designers scattered across the internet — the kind of files that are
          easy to find and easy to forget about. Printing them one at a time, weighing each
          finished piece, and keeping the ones worth keeping is what turned into this
          collection.
        </p>
        <p className="about-reveal mt-5 text-sm leading-relaxed text-text-dim md:text-base">
          There's no factory behind it and nothing made in bulk. Every price on this site
          comes from an actual finished print on that same printer — if a piece hasn't been
          printed and weighed yet, it's listed as unavailable instead of guessed at. The
          collection stays small on purpose.
        </p>
        <p className="about-reveal mt-8 text-mono-label text-[10px] text-text-faint">
          One printer. One piece at a time.
        </p>
      </div>
    </section>
  );
}
