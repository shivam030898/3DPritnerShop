import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function FinalCta() {
  return (
    <section className="border-t border-border bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2 className="text-display max-w-lg text-[clamp(1.75rem,4vw,2.75rem)] text-text">
          Have a design? Let&apos;s make it real.
        </h2>
        <div className="mt-6">
          <Button as="link" href="/upload" size="lg">
            Upload your design
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
