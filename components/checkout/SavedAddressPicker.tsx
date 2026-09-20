"use client";

import { Check } from "lucide-react";
import type { Address } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";

export default function SavedAddressPicker({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {addresses.map((addr) => {
        const active = addr.id === selectedId;
        return (
          <button
            key={addr.id}
            type="button"
            onClick={() => onSelect(addr)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs transition-colors",
              active ? "border-text bg-surface-2 text-text" : "border-border-strong text-text-dim hover:border-text-faint"
            )}
          >
            {active && <Check size={12} />}
            {addr.label}
          </button>
        );
      })}
    </div>
  );
}
