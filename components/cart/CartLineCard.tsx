"use client";

import Image from "next/image";
import { Box, Trash2 } from "lucide-react";
import { unsplashUrl, COLORS, MATERIALS, QUALITIES } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { lineTotal, type CartLineItem } from "@/lib/cart";
import { formatDimensionsMm } from "@/lib/productSize";
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
  const colorName = COLORS.find((c) => c.key === item.color)?.name;
  const materialName = MATERIALS.find((m) => m.key === item.material)?.name;
  const qualityName = QUALITIES.find((q) => q.key === item.quality)?.name;

  const dimensions =
    item.widthMm && item.depthMm && item.heightMm
      ? formatDimensionsMm({ width: item.widthMm, depth: item.depthMm, height: item.heightMm })
      : null;

  const meta =
    item.type === "custom"
      ? [materialName, colorName, qualityName].filter(Boolean).join(" · ")
      : [colorName].filter(Boolean).join(" · ");

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
        {item.type === "product" && item.imageId ? (
          <Image
            src={unsplashUrl(item.imageId, 200)}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <Box size={22} strokeWidth={1.5} className="text-text-faint" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">{item.name}</p>
            {item.sizeLabel && dimensions && (
              <p className="mt-0.5 text-xs text-text-dim">
                {item.sizeLabel} · {dimensions}
              </p>
            )}
            {!item.sizeLabel && dimensions && <p className="mt-0.5 text-xs text-text-dim">{dimensions}</p>}
            {meta && <p className="mt-0.5 text-xs text-text-faint">{meta}</p>}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 text-text-faint transition-colors hover:text-danger"
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
