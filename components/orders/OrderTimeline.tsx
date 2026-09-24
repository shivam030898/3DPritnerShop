import { Check, X } from "lucide-react";
import type { OrderStatus } from "@/lib/generated/prisma";
import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_LABELS, getOrderStageIndex } from "@/lib/orders";
import { formatDateTime, cn } from "@/lib/utils";

type StatusHistoryEntry = { status: OrderStatus; createdAt: Date | string };

export default function OrderTimeline({
  order,
  history = [],
}: {
  order: { status: OrderStatus };
  /** Actual OrderStatusHistory rows, if available — used to show when each stage was actually reached. */
  history?: StatusHistoryEntry[];
}) {
  if (order.status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
        <X size={16} className="shrink-0" />
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = getOrderStageIndex(order);
  const reachedAt = (status: OrderStatus) => history.find((h) => h.status === status)?.createdAt;

  return (
    <div>
      {/* Desktop: horizontal */}
      <ol className="hidden md:flex md:items-start">
        {ORDER_STATUS_SEQUENCE.map((status, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const at = reachedAt(status);

          return (
            <li key={status} className="flex flex-1 flex-col items-start">
              <div className="flex w-full items-center">
                <StageDot done={done} current={current} />
                {i < ORDER_STATUS_SEQUENCE.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1",
                      done || current ? "bg-text" : "bg-border-strong"
                    )}
                  />
                )}
              </div>
              <p className={cn("mt-3 text-xs font-medium", done || current ? "text-text" : "text-text-faint")}>
                {ORDER_STATUS_LABELS[status]}
              </p>
              {(done || current) && at && (
                <p className="mt-0.5 text-[11px] text-text-faint">{formatDateTime(at)}</p>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="flex flex-col md:hidden">
        {ORDER_STATUS_SEQUENCE.map((status, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const isLast = i === ORDER_STATUS_SEQUENCE.length - 1;
          const at = reachedAt(status);

          return (
            <li key={status} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StageDot done={done} current={current} />
                {!isLast && (
                  <span className={cn("w-px flex-1", done ? "bg-text" : "bg-border-strong")} style={{ minHeight: 28 }} />
                )}
              </div>
              <div className="pb-6">
                <p className={cn("text-sm font-medium", done || current ? "text-text" : "text-text-faint")}>
                  {ORDER_STATUS_LABELS[status]}
                </p>
                {(done || current) && at && (
                  <p className="mt-0.5 text-xs text-text-faint">{formatDateTime(at)}</p>
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
