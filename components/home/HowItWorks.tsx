import { UploadCloud, SlidersHorizontal, Truck } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: UploadCloud,
    title: "Upload",
    description: "Upload your STL, OBJ or 3MF file.",
  },
  {
    n: "02",
    icon: SlidersHorizontal,
    title: "Customize",
    description: "Choose material, color and quantity.",
  },
  {
    n: "03",
    icon: Truck,
    title: "Delivered",
    description: "We print it and ship it to you.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-display text-2xl text-text md:text-3xl">How it works</h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg border border-border">
                <step.icon size={18} className="text-text" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-xs text-text-faint">{step.n}</p>
              <p className="mt-1 text-lg text-text">{step.title}</p>
              <p className="mt-1 text-sm text-text-dim">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
