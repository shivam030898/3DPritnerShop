import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the service.",
};

const SECTIONS = [
  {
    title: "Using the service",
    body: `By creating an account or placing an order with ${BRAND.name}, you agree to these terms. You must be able to form a binding contract to use the service.`,
  },
  {
    title: "Orders and pricing",
    body: "Prices are calculated from the geometry, material and quantity you select at checkout and are shown before you pay. We reserve the right to cancel and refund orders we're unable to fulfill.",
  },
  {
    title: "Your uploads",
    body: "You're responsible for the files you upload. You confirm you have the right to reproduce and print any model you submit, and agree not to upload content that infringes on others' intellectual property rights.",
  },
  {
    title: "Shipping and returns",
    body: "Estimated production and delivery times are shown at checkout and in your order tracking. If an order arrives damaged or doesn't match your specification, contact support within 7 days for a reprint or refund.",
  },
  {
    title: "Limitation of liability",
    body: `${BRAND.name} is provided on an as-is basis. To the extent permitted by law, our liability for any claim relating to the service is limited to the amount you paid for the order in question.`,
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Terms of Service</h1>
      <p className="mt-2 max-w-xl text-text-dim">
        Last updated {BRAND.year}. Please read these terms carefully before using {BRAND.name}.
      </p>

      <div className="mt-10 space-y-8 border-t border-border pt-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <p className="text-sm font-medium text-text">{s.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-dim">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
