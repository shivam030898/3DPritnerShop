import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-text-dim",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
};

export default function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
