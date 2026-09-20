"use client";

import { Check, AlertTriangle } from "lucide-react";
import type { SizeOption } from "@/lib/productSize";
import { formatDimensionsMm, buildVolumeLabel } from "@/lib/productSize";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function SizeSelector({
  options,
  selectedKey,
  onSelect,
}: {
  options: SizeOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-text">Choose size</legend>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {options.map((option) => {
          const active = option.key === selectedKey;
          const disabled = !option.fitsPrinter;

          return (
            <button
              key={option.key}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onSelect(option.key)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border px-4 py-3.5 text-left transition-colors",
                disabled
                  ? "cursor-not-allowed border-border-strong opacity-50"
                  : active
                    ? "border-text bg-surface-2"
                    : "border-border-strong hover:border-text-faint"
              )}
            >
              <span className="flex w-full items-center justify-between text-sm font-medium text-text">
                {option.label}
                {active && !disabled && <Check size={14} />}
              </span>
              <span className="text-xs text-text-faint">{formatDimensionsMm(option.dimensionsMm)}</span>
              {disabled ? (
                <span className="mt-1 flex items-start gap-1 text-xs text-danger">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  Exceeds {buildVolumeLabel()} printer build volume — can&apos;t be printed as one piece.
                </span>
              ) : (
                <span className="mt-1 text-sm text-text">{formatINR(option.price.unitCost)}</span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
