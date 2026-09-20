"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getAccountStatus } from "@/lib/actions/profile";
import { useAccountStore } from "@/lib/accountStore";
import AccountSetupForm from "./AccountSetupForm";

type Pending = { name: string; email: string; emailVerified: boolean; image: string | null };

/**
 * Mounted once in the root layout. Fires right after ANY sign-in
 * (whichever page triggered it — navbar, checkout, wherever) and blocks
 * interaction with a modal until a missing phone number is provided. Never
 * hidden inside /account/settings, and never shown again once the phone is
 * on file. The page underneath is untouched (no navigation, no cart
 * mutation), so the cart survives behind it.
 */
export default function AccountSetupGate() {
  const { status } = useSession();
  const setAccount = useAccountStore((s) => s.setAccount);
  const resetAccount = useAccountStore((s) => s.reset);
  const [pending, setPending] = useState<Pending | null>(null);
  const checkedFor = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      checkedFor.current = null;
      resetAccount();
      return;
    }

    if (checkedFor.current === "authenticated") return;
    checkedFor.current = "authenticated";

    getAccountStatus().then((result) => {
      if (!result) return;
      setAccount(result);
      if (result.needsSetup) {
        setPending({
          name: result.name,
          email: result.email,
          emailVerified: result.emailVerified,
          image: result.image,
        });
      }
    });
  }, [status, setAccount, resetAccount]);

  // Deriving visibility from `status` too (rather than nulling `pending` in
  // an effect on sign-out) means the modal disappears the instant auth
  // status changes, with no extra render in between.
  if (!pending || status !== "authenticated") return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <AccountSetupForm
          defaultName={pending.name}
          email={pending.email}
          emailVerified={pending.emailVerified}
          image={pending.image}
          onComplete={(name, phone) => {
            const current = useAccountStore.getState();
            setAccount({ ...current, name, phone });
            setPending(null);
          }}
        />
      </div>
    </div>
  );
}
