import Image from "next/image";
import { Box } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { productImage, COLORS, MATERIALS } from "@/lib/constants";
import { cartTotals, lineTotal, type CartLineItem } from "@/lib/cart";
import { formatDimensionsMm } from "@/lib/productSize";

export default function CartOrderSummary({ items, phone }: { items: CartLineItem[]; phone?: string }) {
  const { subtotal, shipping, total } = cartTotals(items);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm font-medium text-text">Order summary</p>

      <div className="mt-4 flex flex-col gap-4 border-b border-border pb-4">
        {items.map((item) => {
          const colorName = COLORS.find((c) => c.key === item.color)?.name;
          const materialName = MATERIALS.find((m) => m.key === item.material)?.name;
          const dimensions =
            item.widthMm && item.depthMm && item.heightMm
              ? formatDimensionsMm({ width: item.widthMm, depth: item.depthMm, height: item.heightMm })
              : null;
          const meta = [item.type === "custom" ? materialName : null, colorName, dimensions]
            .filter(Boolean)
            .join(" · ");

          return (
            <div key={item.configKey} className="flex items-start gap-3 text-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
                {item.type === "product" && item.imageId ? (
                  <Image
                    src={productImage(item.imageId)}
                    alt=""
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Box size={16} className="text-text-faint" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-text">{item.name}</p>
                {meta && <p className="mt-0.5 text-xs text-text-faint">{meta}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-text-dim">×{item.quantity}</p>
                <p className="mt-0.5 text-text">{formatINR(lineTotal(item))}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-dim">Subtotal</span>
          <span className="text-text">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-dim">Shipping</span>
          <span className="text-text">{formatINR(shipping)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-text">Total</span>
        <span className="text-display text-xl text-text">{formatINR(total)}</span>
      </div>

      {phone && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-text-dim">Mobile</span>
          <span className="text-text">{phone}</span>
        </div>
      )}
    </div>
  );
}
