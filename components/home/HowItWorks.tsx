import { Palette, SlidersHorizontal, Printer, Truck } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Palette,
    title: "Choose",
    description: "Pick a design or upload your own.",
  },
  {
    n: "02",
    icon: SlidersHorizontal,
    title: "Customize",
    description: "Material, color, size and quantity.",
  },
  {
    n: "03",
    icon: Printer,
    title: "Print",
    description: "We manufacture your piece.",
  },
  {
    n: "04",
    icon: Truck,
    title: "Deliver",
    description: "Track it all the way to your door.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-y border-border bg-surface px-5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-display text-2xl text-text md:text-3xl">How ordering works</h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg">
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
