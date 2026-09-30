import { ExternalLink, Mail } from "lucide-react";

const PRINTABLES_URL = "https://www.printables.com/";
const SUPPORT_EMAIL = "support@forma.example.com";
const MAILTO_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Custom print request"
)}&body=${encodeURIComponent("Here's the Printables link I'd like printed:\n\n")}`;

export default function CustomPrintCTA() {
  return (
    <section className="border-t border-border px-5 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-mono-label text-xs text-text-faint">Don&apos;t see what you want?</p>
        <h2 className="text-display mt-4 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] text-text">
          Pick a design from Printables, we&apos;ll print it for you.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-text-dim">
          Browse thousands of ready-to-print models on Printables, then send us the link — we&apos;ll
          quote it and get it printed.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={PRINTABLES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-text px-6 text-sm font-medium text-bg transition-colors hover:bg-text/85"
          >
            Browse Printables
            <ExternalLink size={15} />
          </a>
          <a
            href={MAILTO_HREF}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border-strong px-6 text-sm font-medium text-text transition-colors hover:border-text"
          >
            <Mail size={15} />
            Email us the link
          </a>
        </div>
      </div>
    </section>
  );
}
