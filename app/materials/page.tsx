import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MATERIALS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "PLA, PETG, ABS, TPU and Resin — choose the right material for your print, with real cost and finish trade-offs.",
};

export default function MaterialsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Materials</h1>
      <p className="mt-2 max-w-xl text-text-dim">
        Every print is made to order in one of five materials. Pick based on
        what the object needs to do.
      </p>

      <div className="mt-10 flex flex-col divide-y divide-border border-y border-border">
        {MATERIALS.map((m) => (
          <div key={m.key} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[140px_1fr_auto]">
            <p className="text-lg text-text">{m.name}</p>
            <div>
              <p className="text-sm text-text-dim">{m.description}</p>
              <p className="mt-1 text-xs text-text-faint">Best for: {m.bestFor}</p>
            </div>
            <p className="text-sm text-text-faint">{m.finish}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button as="link" href="/upload" size="lg">
          Upload your design
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
