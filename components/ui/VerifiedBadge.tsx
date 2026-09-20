import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifiedBadge({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <span title="Verified email" aria-label="Verified email" className="inline-flex shrink-0">
      <BadgeCheck size={size} className={cn("text-accent", className)} aria-hidden="true" />
    </span>
  );
}
