/**
 * A single cart line. Every purchasable item is a piece from the curated
 * catalog (see lib/constants.ts) — there is no custom/uploaded-model cart
 * item type anymore, so a line is just a product, a quantity and the price
 * it was added at.
 */
export type CartLineItem = {
  configKey: string;
  slug: string;
  name: string;
  imageId: string;
  quantity: number;
  unitPrice: number;
};

export type NewCartItem = Omit<CartLineItem, "configKey" | "quantity"> & { quantity?: number };

/** One product = one purchasable configuration, so the slug alone identifies a line. */
export function buildConfigKey(item: Pick<CartLineItem, "slug">): string {
  return `product::${item.slug}`;
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
