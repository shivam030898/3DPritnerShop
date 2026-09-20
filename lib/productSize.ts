import type { Product } from "./constants";
import { calculatePrintPrice, type PriceBreakdown } from "./pricing";
import { fitsBuildVolume, PRINTER_CONFIG, type DimensionsMm } from "./printerConfig";

export type SizeKey = "small" | "medium" | "large";

export type SizePresetDef = {
  key: SizeKey;
  label: string;
  /** Uniform scale applied to every axis of the product's base dimensions — preserves aspect ratio by construction. */
  scale: number;
};

/**
 * Medium == the design's native/authored size. Small and Large scale every
 * axis uniformly around it, so aspect ratio is always preserved — a
 * 100x50x30mm design scaled to Large becomes 130x65x39mm, never a cube.
 */
export const SIZE_PRESETS: SizePresetDef[] = [
  { key: "small", label: "Small", scale: 0.85 },
  { key: "medium", label: "Medium", scale: 1.0 },
  { key: "large", label: "Large", scale: 1.3 },
];

export type SizeOption = {
  key: SizeKey;
  label: string;
  dimensionsMm: DimensionsMm;
  volumeCm3: number;
  price: PriceBreakdown;
  fitsPrinter: boolean;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function scaleDimensions(base: DimensionsMm, scale: number): DimensionsMm {
  return {
    width: round1(base.width * scale),
    depth: round1(base.depth * scale),
    height: round1(base.height * scale),
  };
}

/**
 * Estimated material volume from scaled bounding-box geometry — a stand-in
 * for a real slicer estimate. `fillFactor` accounts for hollow/shell prints
 * using far less filament than their bounding box would suggest; swap this
 * for an actual Bambu Studio/slicer estimation call when one is available,
 * without changing anything downstream (it still just needs a volumeCm3).
 */
export function estimateVolumeCm3(dims: DimensionsMm, fillFactor: number): number {
  const boundingBoxMm3 = dims.width * dims.depth * dims.height;
  return (boundingBoxMm3 * fillFactor) / 1000;
}

/** All selectable sizes for a product, with real scaled dimensions, engine-derived price, and printer-fit. */
export function getProductSizeOptions(product: Product, quantity = 1): SizeOption[] {
  return SIZE_PRESETS.map((preset) => {
    const dimensionsMm = scaleDimensions(product.baseDimensionsMm, preset.scale);
    const volumeCm3 = estimateVolumeCm3(dimensionsMm, product.fillFactor);
    const price = calculatePrintPrice({
      volumeCm3,
      materialKey: product.material,
      qualityKey: "standard",
      quantity,
    });

    return {
      key: preset.key,
      label: preset.label,
      dimensionsMm,
      volumeCm3,
      price,
      fitsPrinter: fitsBuildVolume(dimensionsMm),
    };
  });
}

export function formatDimensionsMm(dims: DimensionsMm) {
  return `${Math.round(dims.width)} × ${Math.round(dims.depth)} × ${Math.round(dims.height)} mm`;
}

export function buildVolumeLabel() {
  return `${PRINTER_CONFIG.buildWidthMm} × ${PRINTER_CONFIG.buildDepthMm} × ${PRINTER_CONFIG.buildHeightMm} mm`;
}
