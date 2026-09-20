"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({ videoSrc }: { videoSrc: string | null }) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-14 pt-14 md:px-8 md:pb-20 md:pt-16 lg:grid lg:min-h-[85vh] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16 lg:py-0 xl:gap-20">
      <div className="max-w-md">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-mono-label text-xs text-text-faint"
        >
          On-demand 3D printing
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          className="text-display mt-5 text-[clamp(2.5rem,3.6vw,3.75rem)] leading-[1.04] text-text"
        >
          Your design.
          <br />
          Made real.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          className="mt-5 max-w-[30ch] text-lg text-text-dim"
        >
          Upload a 3D model and we&apos;ll print, finish and deliver it to your door.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-6"
        >
          <Button as="link" href="/upload" size="lg">
            Upload your design
          </Button>
          <Link
            href="/designs"
            className="flex items-center gap-1.5 text-sm text-text-dim transition-colors hover:text-text"
          >
            Explore designs
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
          className="text-mono-label mt-14 text-[11px] text-text-faint"
        >
          Digital file → physical object
        </motion.p>
      </div>

      {videoSrc && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-12 h-[clamp(320px,55vh,460px)] w-full overflow-hidden rounded-lg border border-border lg:mt-0 lg:h-[clamp(420px,62vh,640px)]"
        >
          <video
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            aria-label="Live footage of a 3D printer producing a model"
          />
        </motion.div>
      )}
    </section>
  );
}
