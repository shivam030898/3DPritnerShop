/**
 * Build-volume envelope for the printer fleet. Centralized here (instead of
 * hardcoded per component) so a different printer/build plate only requires
 * changing this one config.
 */
export const PRINTER_CONFIG = {
  name: "Bambu Lab",
  buildWidthMm: 256,
  buildDepthMm: 256,
  buildHeightMm: 256,
};

export type DimensionsMm = { width: number; depth: number; height: number };

/** A single-piece print must fit the build plate on every axis, in any orientation. */
export function fitsBuildVolume(dims: DimensionsMm): boolean {
  const sorted = [dims.width, dims.depth, dims.height].sort((a, b) => a - b);
  const plate = [PRINTER_CONFIG.buildWidthMm, PRINTER_CONFIG.buildDepthMm, PRINTER_CONFIG.buildHeightMm].sort(
    (a, b) => a - b
  );
  return sorted[0] <= plate[0] && sorted[1] <= plate[1] && sorted[2] <= plate[2];
}
