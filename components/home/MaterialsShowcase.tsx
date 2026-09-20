import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MATERIALS } from "@/lib/constants";

export default function MaterialsShowcase() {
  return (
    <section className="border-y border-border bg-surface px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="text-display text-2xl text-text md:text-3xl">Print in real materials.</h2>
          <Link
            href="/materials"
            className="hidden items-center gap-1 text-sm text-text-dim hover:text-text sm:flex"
          >
            All materials <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {MATERIALS.map((m) => (
            <div key={m.key} className="rounded-xl border border-border bg-bg p-4">
              <p className="text-sm font-medium text-text">{m.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-faint">{m.bestFor}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
