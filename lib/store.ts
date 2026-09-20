"use client";

import { create } from "zustand";
import type { ColorKey, MaterialKey, QualityKey } from "./constants";
import type { GeometryStats } from "./geometry";

export type CurrentUpload = {
  fileName: string;
  fileType: "stl" | "obj" | "3mf";
  fileURL: string;
  stats: GeometryStats;
};

export type CurrentConfig = {
  material: MaterialKey;
  color: ColorKey;
  quality: QualityKey;
  quantity: number;
};

/**
 * Ephemeral, session-only state for the model currently being configured
 * before it's added to the cart (see lib/cartStore.ts + lib/useCart.ts for
 * the actual cart, and lib/actions/* for orders, designs and addresses).
 */
type StoreState = {
  currentUpload: CurrentUpload | null;
  currentConfig: CurrentConfig;

  setCurrentUpload: (upload: CurrentUpload | null) => void;
  setCurrentConfig: (config: Partial<CurrentConfig>) => void;
};

export const useStore = create<StoreState>((set) => ({
  currentUpload: null,
  currentConfig: { material: "pla", color: "black", quality: "standard", quantity: 1 },

  setCurrentUpload: (upload) => set({ currentUpload: upload }),
  setCurrentConfig: (config) =>
    set((s) => ({ currentConfig: { ...s.currentConfig, ...config } })),
}));
