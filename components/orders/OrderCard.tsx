import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Box } from "lucide-react";
import type { Order } from "@/lib/generated/prisma";
import { ORDER_STAGES, getOrderStageIndex, getEstimatedDelivery } from "@/lib/orders";
import { formatDate, formatINR } from "@/lib/utils";
import { PRODUCTS, unsplashUrl } from "@/lib/constants";
import Badge from "@/components/ui/Badge";

export default function OrderCard({ order }: { order: Order }) {
  const stageIndex = getOrderStageIndex(order);
  const stage = ORDER_STAGES[stageIndex];
  const delivered = stageIndex === ORDER_STAGES.length - 1;
  const product = order.productSlug ? PRODUCTS.find((p) => p.slug === order.productSlug) : null;

  return (
    <Link
      href={`/orders/${order.orderNumber}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-text-faint"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
          {product ? (
            <Image src={unsplashUrl(product.imageId, 150)} alt="" width={48} height={48} className="h-full w-full object-cover" />
          ) : (
            <Box size={17} className="text-text-faint" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-faint">{order.orderNumber}</p>
          <p className="mt-1 truncate text-sm font-medium text-text">{order.itemName}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={delivered ? "success" : "accent"}>{stage.label}</Badge>
            {!delivered && (
              <span className="text-xs text-text-faint">
                Est. {formatDate(getEstimatedDelivery(order))}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-medium text-text">{formatINR(order.total)}</span>
        <ArrowRight size={16} className="text-text-faint" />
      </div>
    </Link>
  );
}
