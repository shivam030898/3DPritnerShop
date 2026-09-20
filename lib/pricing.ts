import { MATERIALS, QUALITIES, type MaterialKey, type QualityKey } from "./constants";
import { clamp } from "./utils";

/**
 * Configurable pricing knobs — deliberately one plain object (not scattered
 * magic numbers) so these can later move to an admin-editable settings
 * table without touching any pricing logic or frontend code. Per-material
 * rates live on MATERIALS in lib/constants.ts.
 */
export const PRICING_CONFIG = {
  /** Volumetric print speed used to estimate production time. */
  printRateCm3PerHour: 11,
  /** Modest supplementary cost for machine time, on top of the per-gram material rate. */
  machineCostPerHour: 15,
  /** Flat packaging/QA/setup fee per line item. */
  handlingFee: 29,
  /** Floor under which no single print is sold, regardless of how small. */
  minimumOrderValue: 249,
  /** Multiplier applied over raw cost (material + machine + handling). 1.0 = no added margin beyond the per-gram rate. */
  marginMultiplier: 1.0,
  /** Flat shipping charged once per order. */
  shippingFlat: 99,
};

export type PriceBreakdown = {
  weightG: number;
  productionHours: number;
  estProductionDays: number;
  materialCost: number;
  machineCost: number;
  handlingFee: number;
  unitCost: number;
  printCost: number;
  shipping: number;
  total: number;
  materialLabel: string;
  quantity: number;
};

/**
 * Estimates a per-unit print price from volume, material and quality.
 * This is a transparent stand-in for a real slicer quote (see
 * lib/productSize.ts for how scaled-geometry volume feeds in) — swap the
 * body for an actual Bambu Studio/slicer estimation call later without
 * changing this function's signature or its callers.
 */
export function calculatePrintPrice({
  volumeCm3,
  materialKey,
  qualityKey,
  quantity,
}: {
  volumeCm3: number;
  materialKey: MaterialKey;
  qualityKey: QualityKey;
  quantity: number;
}): PriceBreakdown {
  const material = MATERIALS.find((m) => m.key === materialKey) ?? MATERIALS[0];
  const quality = QUALITIES.find((q) => q.key === qualityKey) ?? QUALITIES[0];

  const safeVolume = Math.max(volumeCm3, 0.5);
  const weightG = Math.round(safeVolume * material.densityGCm3 * 10) / 10;
  const productionHours = Math.max(
    (safeVolume / PRICING_CONFIG.printRateCm3PerHour) * quality.timeMultiplier,
    0.5
  );

  const materialCost = weightG * material.costPerGram * quality.costMultiplier;
  const machineCost = productionHours * PRICING_CONFIG.machineCostPerHour;
  const rawCost = (materialCost + machineCost + PRICING_CONFIG.handlingFee) * PRICING_CONFIG.marginMultiplier;
  const unitCost = Math.max(Math.round(rawCost), PRICING_CONFIG.minimumOrderValue);

  const printCost = unitCost * quantity;
  const estProductionDays = clamp(
    Math.ceil((productionHours * Math.max(quantity * 0.6, 1)) / 6) + 1,
    2,
    12
  );
  const total = printCost + PRICING_CONFIG.shippingFlat;

  return {
    weightG,
    productionHours: Math.round(productionHours * 10) / 10,
    estProductionDays,
    materialCost: Math.round(materialCost),
    machineCost: Math.round(machineCost),
    handlingFee: PRICING_CONFIG.handlingFee,
    unitCost,
    printCost,
    shipping: PRICING_CONFIG.shippingFlat,
    total,
    materialLabel: material.name,
    quantity,
  };
}
