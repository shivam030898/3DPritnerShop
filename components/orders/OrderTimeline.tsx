import { Check } from "lucide-react";
import { ORDER_STAGES, getOrderStageIndex } from "@/lib/orders";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function OrderTimeline({ order }: { order: { createdAt: Date | string } }) {
  const currentIndex = getOrderStageIndex(order);
  const createdAt = new Date(order.createdAt);

  return (
    <div>
      {/* Desktop: horizontal */}
      <ol className="hidden md:flex md:items-start">
        {ORDER_STAGES.map((stage, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const timestamp = new Date(createdAt.getTime() + stage.offsetHours * 60 * 60 * 1000);

          return (
            <li key={stage.key} className="flex flex-1 flex-col items-start">
              <div className="flex w-full items-center">
                <StageDot done={done} current={current} />
                {i < ORDER_STAGES.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1",
                      done || current ? "bg-text" : "bg-border-strong"
                    )}
                  />
                )}
              </div>
              <p className={cn("mt-3 text-xs font-medium", done || current ? "text-text" : "text-text-faint")}>
                {stage.label}
              </p>
              {(done || current) && (
                <p className="mt-0.5 text-[11px] text-text-faint">{formatDateTime(timestamp)}</p>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="flex flex-col md:hidden">
        {ORDER_STAGES.map((stage, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const timestamp = new Date(createdAt.getTime() + stage.offsetHours * 60 * 60 * 1000);
          const isLast = i === ORDER_STAGES.length - 1;

          return (
            <li key={stage.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StageDot done={done} current={current} />
                {!isLast && (
                  <span className={cn("w-px flex-1", done ? "bg-text" : "bg-border-strong")} style={{ minHeight: 28 }} />
                )}
              </div>
              <div className="pb-6">
                <p className={cn("text-sm font-medium", done || current ? "text-text" : "text-text-faint")}>
                  {stage.label}
                </p>
                {(done || current) && (
                  <>
                    <p className="mt-0.5 text-xs text-text-faint">{formatDateTime(timestamp)}</p>
                    {current && <p className="mt-1 text-xs text-text-dim">{stage.description}</p>}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StageDot({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-text text-white">
        <Check size={12} strokeWidth={3} />
      </span>
    );
  }
  if (current) {
    return (
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-accent/40" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
    );
  }
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-border-strong" />;
}
