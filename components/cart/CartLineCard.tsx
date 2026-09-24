"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { productImage } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { lineTotal, type CartLineItem } from "@/lib/cart";
import QuantityStepper from "@/components/ui/QuantityStepper";

export default function CartLineCard({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartLineItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
        <Image
          src={productImage(item.imageId)}
          alt=""
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-medium text-text">{item.name}</p>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 cursor-pointer text-text-faint transition-colors hover:text-danger"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <QuantityStepper value={item.quantity} onChange={onQuantityChange} />
          <div className="text-right">
            <p className="text-sm font-medium text-text">{formatINR(lineTotal(item))}</p>
            <p className="text-xs text-text-faint">{formatINR(item.unitPrice)} each</p>
          </div>
        </div>
      </div>
    </div>
  );
}
