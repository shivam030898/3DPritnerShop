import { Lock, ShieldCheck, Truck, Layers, Palette, Wrench } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Quality checked",
    description: "Every print passes a manual check before it ships.",
  },
  {
    icon: Lock,
    title: "Secure checkout",
    description: "Encrypted payments, every order.",
  },
  {
    icon: Truck,
    title: "Tracked delivery",
    description: "Live status from the print bed to your doorstep.",
  },
  {
    icon: Layers,
    title: "Made to order",
    description: "Printed for you, not pulled off a shelf.",
  },
  {
    icon: Palette,
    title: "Multiple materials",
    description: "PLA, PETG, ABS, TPU and resin.",
  },
  {
    icon: Wrench,
    title: "Custom printing",
    description: "Upload your own file and configure every detail.",
  },
];

export default function TrustSection() {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {POINTS.map((p) => (
          <div key={p.title} className="flex flex-col items-start">
            <p.icon size={20} className="text-text" strokeWidth={1.5} />
            <p className="mt-4 text-sm text-text">{p.title}</p>
            <p className="mt-1 text-xs text-text-dim">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
