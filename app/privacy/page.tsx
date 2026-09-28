import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use and protect your information.",
};

const SECTIONS = [
  {
    title: "Information we collect",
    body: "When you create an account, place an order or upload a model, we collect details like your name, email, shipping address and the files you submit for printing. We also collect basic usage data to keep the site running smoothly.",
  },
  {
    title: "How we use it",
    body: "We use your information to process orders, provide customer support, prevent fraud and improve the service. We never sell your personal information to third parties.",
  },
  {
    title: "Uploaded models",
    body: "Files you upload are used solely to produce your order and are retained only as long as needed for production, quality review and support. You can request deletion at any time.",
  },
  {
    title: "Sharing",
    body: "We share information with the vendors that help us operate — payment processors, shipping carriers and hosting providers — under agreements that limit their use of your data to providing those services.",
  },
  {
    title: "Your choices",
    body: `You can access, update or delete your account information from your account settings, or contact us for help with anything this policy doesn't cover.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <h1 className="text-display text-2xl text-text md:text-3xl">Privacy Policy</h1>
      <p className="mt-2 max-w-xl text-text-dim">
        Last updated {BRAND.year}. This describes how {BRAND.name} collects, uses and protects your information.
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
