import { ShieldCheck, Receipt, Clock } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Studio-grade quality",
    description: "Every print passes a manual quality check before it ships.",
  },
  {
    icon: Receipt,
    title: "Transparent pricing",
    description: "No hidden fees. See exactly what you're paying for, upfront.",
  },
  {
    icon: Clock,
    title: "Tracked delivery",
    description: "Live status from the print bed to your doorstep.",
  },
];

export default function TrustSection() {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="flex flex-col items-start">
            <p.icon size={20} className="text-text" strokeWidth={1.5} />
            <p className="mt-4 text-base text-text">{p.title}</p>
            <p className="mt-1 text-sm text-text-dim">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
