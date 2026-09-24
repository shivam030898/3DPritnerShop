import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Upload", "Configure", "Review", "Checkout"];

export default function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "flex items-center gap-1.5 text-xs sm:text-sm",
                active ? "text-text" : done ? "text-text-dim" : "text-text-faint"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  active
                    ? "border-text bg-text text-bg"
                    : done
                      ? "border-text-dim bg-transparent text-text-dim"
                      : "border-border-strong text-text-faint"
                )}
              >
                {done ? <Check size={11} /> : String(step).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>
            {step < STEPS.length && <span className="h-px w-4 bg-border-strong sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}
