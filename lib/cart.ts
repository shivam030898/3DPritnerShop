import type { ColorKey, MaterialKey, QualityKey } from "./constants";

export type CartItemKind = "product" | "custom";

/**
 * A single cart line, shared shape for both the guest (localStorage) cart
 * and the authenticated (database) cart. `configKey` identifies a distinct
 * purchasable variant — adding the same variant again increments quantity
 * instead of creating a duplicate line.
 */
export type CartLineItem = {
  configKey: string;
  type: CartItemKind;
  name: string;
  quantity: number;
  unitPrice: number;

  // Marketplace product fields
  slug?: string;
  imageId?: string;

  // Custom/uploaded print fields
  fileName?: string;
  fileUrl?: string;
  fileType?: "stl" | "obj" | "3mf";
  /** JSON.stringify(GeometryStats) — preserved so an Order/Design can be recreated at checkout. */
  statsJson?: string;

  // Custom/Printables-link print fields — set only when the model source is
  // a pasted Printables URL rather than an uploaded file.
  modelSourceType?: "UPLOAD" | "PRINTABLES";
  printablesUrl?: string;

  // Shared configuration
  material?: MaterialKey;
  color?: ColorKey;
  quality?: QualityKey;
  notes?: string;

  // Structured print size — two copies of the same design at different
  // sizes are different purchasable configurations, never merged together.
  sizeLabel?: string;
  widthMm?: number;
  depthMm?: number;
  heightMm?: number;
};

export type NewCartItem = Omit<CartLineItem, "configKey" | "quantity"> & { quantity?: number };

export function buildConfigKey(
  item: Pick<
    CartLineItem,
    "type" | "slug" | "fileUrl" | "modelSourceType" | "printablesUrl" | "material" | "color" | "quality" | "sizeLabel"
  >
): string {
  if (item.type === "product") {
    return ["product", item.slug, item.color, item.sizeLabel].join("::");
  }
  if (item.modelSourceType === "PRINTABLES") {
    return ["custom", "printables", item.printablesUrl, item.material, item.color, item.quality, item.sizeLabel].join(
      "::"
    );
  }
  return ["custom", item.fileUrl, item.material, item.color, item.quality, item.sizeLabel].join("::");
}

export function lineTotal(item: Pick<CartLineItem, "unitPrice" | "quantity">) {
  return item.unitPrice * item.quantity;
}

const SHIPPING_FLAT = 99;

export function cartTotals(items: CartLineItem[]) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  return { subtotal, shipping, total: subtotal + shipping, itemCount };
}

/** Merges two line-item lists, summing quantities for matching configKeys. */
export function mergeCartItems(base: CartLineItem[], incoming: CartLineItem[]): CartLineItem[] {
  const merged = [...base];
  for (const item of incoming) {
    const idx = merged.findIndex((i) => i.configKey === item.configKey);
    if (idx === -1) {
      merged.push(item);
    } else {
      merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + item.quantity };
    }
  }
  return merged;
}
