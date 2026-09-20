"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border-strong">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center text-text transition-colors hover:bg-surface-2 disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <span className="w-10 text-center text-sm tabular-nums text-text">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center text-text transition-colors hover:bg-surface-2 disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
