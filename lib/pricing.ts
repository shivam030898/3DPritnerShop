/**
 * The single source of truth for turning a product's physical spec (weight +
 * material) into a selling price. Every product card, product page, cart
 * line and order in the app derives its price by calling
 * `calculateProductPrice` (or `getProductPrice` in lib/constants.ts) against
 * live catalog data — there is no other place a price is allowed to be
 * hardcoded. Change a rate below and every price in the app updates.
 */

export type MaterialType = "PLA" | "PETG" | "Exotic";

export const MATERIAL_RATES: Record<MaterialType, number> = {
  PLA: 1,
  PETG: 1.5,
  Exotic: 2,
};

export const SHIPPING_COST = 100;
export const MARKETING_COST = 100;
export const PROFIT_MULTIPLIER = 2;

/**
 * materialCost = weightInGrams × materialRate
 * baseCost = materialCost + SHIPPING_COST + MARKETING_COST
 * priceBeforeRounding = baseCost × PROFIT_MULTIPLIER
 * finalPrice = priceBeforeRounding rounded to the nearest ₹100
 *
 * Returns null when the weight isn't verified yet — a product with no
 * confirmed print weight gets no price, never a guessed one.
 */
export function calculateProductPrice(
  weightInGrams: number | null,
  materialType: MaterialType
): number | null {
  if (weightInGrams === null) return null;
  const materialCost = weightInGrams * MATERIAL_RATES[materialType];
  const baseCost = materialCost + SHIPPING_COST + MARKETING_COST;
  const priceBeforeRounding = baseCost * PROFIT_MULTIPLIER;
  return Math.round(priceBeforeRounding / 100) * 100;
}
