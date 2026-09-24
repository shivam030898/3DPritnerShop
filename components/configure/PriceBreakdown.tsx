import { formatINR } from "@/lib/utils";
import type { PriceBreakdown as PriceBreakdownType } from "@/lib/pricing";

export default function PriceBreakdown({
  price,
  estimate = false,
}: {
  price: PriceBreakdownType;
  /** True for a Printables-sourced item — we're pricing off a generic size tier, not real geometry. */
  estimate?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="space-y-2.5 text-sm">
        <Row label={`Print (${price.quantity}×)`} value={formatINR(price.printCost)} />
        <Row label="Material" value={price.materialLabel} />
        <Row label="Est. weight" value={`${price.weightG}g`} />
        <Row label="Est. production" value={`${price.estProductionDays} business days`} />
        <Row label="Shipping" value={formatINR(price.shipping)} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-text">Total</span>
        <span className="text-display text-2xl text-text">{formatINR(price.total)}</span>
      </div>
      {estimate && (
        <p className="mt-3 text-xs text-text-faint">
          Estimated from a typical model of this size — we&apos;ll fine-tune the price after reviewing the linked model.
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-dim">{label}</span>
      <span className="text-text">{value}</span>
    </div>
  );
}
