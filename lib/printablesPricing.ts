import type { MaterialKey, QualityKey } from "./constants";
import { calculatePrintPrice, type PriceBreakdown } from "./pricing";
import { estimateVolumeCm3 } from "./productSize";
import type { DimensionsMm } from "./printerConfig";

export type PrintablesSizeKey = "small" | "medium" | "large";

/**
 * We have no real geometry for an externally-sourced Printables model, so
 * these generic bounding boxes stand in for it — same role as a product's
 * `baseDimensionsMm` in lib/constants.ts, just not tied to a specific
 * design. Reuses the same `estimateVolumeCm3` + `calculatePrintPrice`
 * pipeline as every other price in the app; this is clearly presented to
 * the customer as an estimate, and an admin can revise it before the order
 * leaves PENDING.
 */
const PRINTABLES_SIZE_PRESETS: { key: PrintablesSizeKey; label: string; dimensionsMm: DimensionsMm }[] = [
  { key: "small", label: "Small", dimensionsMm: { width: 60, depth: 60, height: 60 } },
  { key: "medium", label: "Medium", dimensionsMm: { width: 100, depth: 100, height: 100 } },
  { key: "large", label: "Large", dimensionsMm: { width: 160, depth: 160, height: 160 } },
];

const GENERIC_FILL_FACTOR = 0.2;

export type PrintablesPriceOption = {
  key: PrintablesSizeKey;
  label: string;
  dimensionsMm: DimensionsMm;
  volumeCm3: number;
  price: PriceBreakdown;
};

export function getPrintablesPriceOptions({
  materialKey,
  qualityKey,
  quantity,
}: {
  materialKey: MaterialKey;
  qualityKey: QualityKey;
  quantity: number;
}): PrintablesPriceOption[] {
  return PRINTABLES_SIZE_PRESETS.map((preset) => {
    const volumeCm3 = estimateVolumeCm3(preset.dimensionsMm, GENERIC_FILL_FACTOR);
    const price = calculatePrintPrice({ volumeCm3, materialKey, qualityKey, quantity });
    return { key: preset.key, label: preset.label, dimensionsMm: preset.dimensionsMm, volumeCm3, price };
  });
}

export function getPrintablesPriceOption(
  sizeKey: PrintablesSizeKey,
  args: { materialKey: MaterialKey; qualityKey: QualityKey; quantity: number }
): PrintablesPriceOption {
  const options = getPrintablesPriceOptions(args);
  return options.find((o) => o.key === sizeKey) ?? options[1];
}
