"use client";

import { create } from "zustand";
import type { ColorKey, MaterialKey, QualityKey } from "./constants";
import type { GeometryStats } from "./geometry";
import type { PrintablesSizeKey } from "./printablesPricing";

export type CurrentUpload = {
  fileName: string;
  fileType: "stl" | "obj" | "3mf";
  fileURL: string;
  stats: GeometryStats;
};

export type CurrentPrintablesModel = {
  url: string;
  modelId: string;
};

/**
 * The model currently being configured before it's added to the cart — a
 * real uploaded file (with parsed geometry) or a pasted Printables link
 * (no geometry, no preview — see lib/printablesPricing.ts for how it's
 * priced instead). app/configure/page.tsx branches on `.type`.
 */
export type ModelInput =
  | ({ type: "upload" } & CurrentUpload)
  | ({ type: "printables" } & CurrentPrintablesModel);

export type CurrentConfig = {
  material: MaterialKey;
  color: ColorKey;
  quality: QualityKey;
  /** Uniform scale applied to an uploaded model's native dimensions — 1 = 100% (as authored). Ignored for Printables items, which use `sizeTier` instead. */
  scale: number;
  /** Size tier for a Printables-sourced item, since there's no real geometry to scale. Ignored for uploads. */
  sizeTier: PrintablesSizeKey;
  quantity: number;
  /** Optional free-text print instructions, carried through to the cart line and order. */
  notes: string;
};

/**
 * Ephemeral, session-only state for the model currently being configured
 * before it's added to the cart (see lib/cartStore.ts + lib/useCart.ts for
 * the actual cart, and lib/actions/* for orders, designs and addresses).
 */
type StoreState = {
  currentModel: ModelInput | null;
  currentConfig: CurrentConfig;

  setCurrentModel: (model: ModelInput | null) => void;
  setCurrentConfig: (config: Partial<CurrentConfig>) => void;
};

export const useStore = create<StoreState>((set) => ({
  currentModel: null,
  currentConfig: {
    material: "pla",
    color: "black",
    quality: "standard",
    scale: 1,
    sizeTier: "medium",
    quantity: 1,
    notes: "",
  },

  setCurrentModel: (model) => set({ currentModel: model }),
  setCurrentConfig: (config) =>
    set((s) => ({ currentConfig: { ...s.currentConfig, ...config } })),
}));
