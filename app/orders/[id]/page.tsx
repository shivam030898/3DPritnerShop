import Link from "next/link";
import Image from "next/image";
import { Truck, Box } from "lucide-react";
import { getOrderByNumber } from "@/lib/actions/orders";
import { getOrderStageIndex, getEstimatedDelivery, ORDER_STAGES } from "@/lib/orders";
import { formatDate, formatINR } from "@/lib/utils";
import { PRODUCTS, unsplashUrl, COLORS, MATERIALS } from "@/lib/constants";
import { formatDimensionsMm } from "@/lib/productSize";
import OrderTimeline from "@/components/orders/OrderTimeline";
import Badge from "@/components/ui/Badge";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByNumber(id.toUpperCase());

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-display text-2xl text-text">Order not found</h1>
        <p className="mt-2 text-text-dim">We couldn&apos;t find an order with that ID.</p>
        <Link href="/track" className="mt-6 inline-block text-sm font-medium text-text underline">
          Try another order
        </Link>
      </div>
    );
  }

  const stageIndex = getOrderStageIndex(order);
  const stage = ORDER_STAGES[stageIndex];
  const delivered = stageIndex === ORDER_STAGES.length - 1;
  const shipped = stageIndex >= ORDER_STAGES.findIndex((s) => s.key === "shipped");
  const address = JSON.parse(order.addressSnapshot) as {
    name: string;
    line1: string;
    city: string;
    state: string;
    pin: string;
  };
  const product = order.productSlug ? PRODUCTS.find((p) => p.slug === order.productSlug) : null;
  const colorName = COLORS.find((c) => c.key === order.color)?.name;
  const materialName = MATERIALS.find((m) => m.key === order.material)?.name;
  const dimensions =
    order.widthMm && order.depthMm && order.heightMm
      ? formatDimensionsMm({ width: order.widthMm, depth: order.depthMm, height: order.heightMm })
      : null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
            {product ? (
              <Image src={unsplashUrl(product.imageId, 200)} alt="" width={56} height={56} className="h-full w-full object-cover" />
            ) : (
              <Box size={20} className="text-text-faint" />
            )}
          </div>
          <div>
            <p className="text-sm text-text-faint">{order.orderNumber}</p>
            <h1 className="text-display mt-0.5 text-xl text-text md:text-2xl">{order.itemName}</h1>
          </div>
        </div>
        <Badge tone={delivered ? "success" : "accent"}>{stage.label}</Badge>
      </div>

      <p className="mt-3 text-sm text-text-dim">{stage.description}</p>

      <div className="mt-10 overflow-x-auto rounded-xl border border-border bg-surface p-6">
        <OrderTimeline order={order} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-text-faint">Estimated delivery</p>
          <p className="mt-1 text-lg text-text">{formatDate(getEstimatedDelivery(order))}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-text-faint">Order total</p>
          <p className="mt-1 text-lg text-text">{formatINR(order.total)}</p>
        </div>
      </div>

      {shipped && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-text-dim" />
            <div>
              <p className="text-sm text-text">{order.carrier}</p>
              <p className="text-xs text-text-faint">{order.trackingNumber}</p>
            </div>
          </div>
          <span className="text-sm font-medium text-text-faint">Tracking number</span>
        </div>
      )}

      {(dimensions || materialName || colorName) && (
        <div className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface p-5 text-sm sm:grid-cols-3">
          {dimensions && (
            <div>
              <p className="text-xs text-text-faint">
                {order.sizeLabel ? `Size — ${order.sizeLabel}` : "Size"}
              </p>
              <p className="mt-1 text-text">{dimensions}</p>
            </div>
          )}
          {materialName && (
            <div>
              <p className="text-xs text-text-faint">Material</p>
              <p className="mt-1 text-text">{materialName}</p>
            </div>
          )}
          {colorName && (
            <div>
              <p className="text-xs text-text-faint">Color</p>
              <p className="mt-1 text-text">{colorName}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <p className="text-sm font-medium text-text">Delivery address</p>
        <p className="mt-2 text-sm text-text-dim">
          {address.name}
          <br />
          {address.line1}
          <br />
          {address.city}, {address.state} {address.pin}
        </p>
      </div>
    </div>
  );
}
