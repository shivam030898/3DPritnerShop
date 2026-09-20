"use client";

import { create } from "zustand";
import type { AccountStatus } from "./actions/profile";

type AccountState = {
  phone: string | null;
  name: string;
  email: string;
  emailVerified: boolean;
  loaded: boolean;
  setAccount: (status: Pick<AccountStatus, "phone" | "name" | "email" | "emailVerified">) => void;
  reset: () => void;
};

/**
 * Mirrors the authenticated user's account/verification status for any
 * component to read reactively (checkout's contact form and email
 * verification gate, order summary, settings) without each one
 * re-fetching it — the single source-of-truth fetch lives in AccountSetupGate.
 */
export const useAccountStore = create<AccountState>((set) => ({
  phone: null,
  name: "",
  email: "",
  emailVerified: false,
  loaded: false,
  setAccount: (status) => set({ ...status, loaded: true }),
  reset: () => set({ phone: null, name: "", email: "", emailVerified: false, loaded: false }),
}));
