"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQ = [
  {
    q: "What file formats can I upload?",
    a: "STL, OBJ and 3MF files up to 50MB. We recommend STL for the most reliable results.",
  },
  {
    q: "How is the price calculated?",
    a: "We estimate your model's volume and weight from the uploaded geometry, then price it based on material, print quality and quantity. Shipping is a flat ₹99.",
  },
  {
    q: "How long does production take?",
    a: "Most custom prints ship within 2–4 business days, depending on size, material and quality settings.",
  },
  {
    q: "Can I return or replace a print?",
    a: "If your order arrives damaged or doesn't match your specification, contact support within 7 days for a reprint or refund.",
  },
  {
    q: "Do you offer bulk or business pricing?",
    a: "Yes — orders of 10 or more units automatically qualify for volume pricing at checkout.",
  },
];

export default function SupportFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section>
      <p className="text-sm font-medium text-text">Common questions</p>

      <div className="mt-4 border-t border-border">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-sm text-text md:text-base">{item.q}</span>
                <Plus
                  size={16}
                  className={`shrink-0 text-text-dim transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-xl pb-5 text-sm leading-relaxed text-text-dim">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
