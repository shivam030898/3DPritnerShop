import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import SupportFAQ from "@/components/support/SupportFAQ";

export const metadata: Metadata = {
  title: "Support",
  description: "Help with orders, uploads, materials, returns and shipping.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Email support",
    description: "Response within one business day.",
    action: "support@forma.example.com",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    description: "Weekdays, 9am – 6pm.",
    action: "Start a conversation",
  },
  {
    icon: ShieldCheck,
    title: "Order issues",
    description: "Damaged, delayed or incorrect orders.",
    action: "File a claim",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">
        We&apos;re here when you need us.
      </h1>
      <p className="mt-2 max-w-xl text-text-dim">
        Help with uploads, materials, orders and delivery.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-surface p-5">
            <c.icon size={18} className="text-text-dim" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-text">{c.title}</p>
            <p className="mt-1 text-xs text-text-faint">{c.description}</p>
            <p className="mt-3 text-sm text-text-dim">{c.action}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <SupportFAQ />
      </div>
    </div>
  );
}
