"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/useCart";
import { placeCartOrder } from "@/lib/actions/orders";
import { getUserAddresses } from "@/lib/actions/addresses";
import { getAccountStatus } from "@/lib/actions/profile";
import { useAccountStore } from "@/lib/accountStore";
import type { Address } from "@/lib/generated/prisma";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import CartOrderSummary from "@/components/checkout/CartOrderSummary";
import OrderConfirmed from "@/components/checkout/OrderConfirmed";
import SavedAddressPicker from "@/components/checkout/SavedAddressPicker";
import EmailVerifyPanel from "@/components/account/EmailVerifyPanel";
import StepIndicator from "@/components/configure/StepIndicator";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = ["UPI", "Card", "Net Banking", "Wallet"];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, hydrated, loading: cartSyncing, clearCart } = useCart();
  const account = useAccountStore();
  const setAccount = useAccountStore((s) => s.setAccount);
  const accountPhone = account.phone;

  const refreshAccountStatus = async () => {
    const result = await getAccountStatus();
    if (result) setAccount(result);
  };

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [orderNumbers, setOrderNumbers] = useState<string[] | null>(null);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const [form, setForm] = useState({
    email: "", phone: "", name: "", line1: "", city: "", state: "", pin: "",
  });

  // Auth gate: checking out requires a signed-in user. The cart itself
  // (guest or account) already survives this redirect — no ephemeral state
  // to save and restore. Account-setup completeness (phone number) is a
  // separate, global concern — see components/account/AccountSetupGate.tsx,
  // mounted in the root layout, which blocks with a modal until resolved
  // without ever navigating away from whatever page (including this one).
  useEffect(() => {
    if (!hydrated || status === "loading" || orderNumbers) return;
    if (status !== "authenticated" && items.length > 0) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}&checkout=1`);
    }
  }, [hydrated, status, items.length, orderNumbers, router]);

  // The account phone (once known, e.g. from account setup) is the
  // authoritative contact number — shown unless the shopper edits it here.
  const effectivePhone = form.phone || accountPhone || "";

  // Prefill contact/address once authenticated.
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const user = session.user;
    let cancelled = false;

    getUserAddresses().then((addrs) => {
      if (cancelled) return;
      setAddresses(addrs);

      const def = addrs.find((a) => a.isDefault) ?? addrs[0];
      setForm((f) => ({ ...f, email: user.email ?? f.email, name: def?.name ?? user.name ?? f.name }));
      if (def) {
        setSelectedAddressId(def.id);
        setForm((f) => ({
          ...f,
          name: def.name,
          line1: def.line1,
          city: def.city,
          state: def.state,
          pin: def.pin,
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [status, session]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setForm((f) => ({ ...f, name: addr.name, line1: addr.line1, city: addr.city, state: addr.state, pin: addr.pin }));
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedAddressId(null);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    },
    required: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || items.length === 0) return;
    submittingRef.current = true;
    setPlacing(true);
    setPlaceError(null);

    const result = await placeCartOrder({
      name: form.name,
      email: form.email,
      phone: effectivePhone,
      line1: form.line1,
      city: form.city,
      state: form.state,
      pin: form.pin,
      addressId: selectedAddressId ?? undefined,
      paymentMethod: payment,
    });

    setPlacing(false);

    if (!result.ok) {
      setPlaceError(result.error);
      submittingRef.current = false;
      return;
    }

    setOrderTotal(result.total);
    setOrderNumbers(result.orderNumbers);
    await clearCart();
  };

  const checkingAccount = status === "authenticated" && !account.loaded;

  if (status === "loading" || !hydrated || cartSyncing || checkingAccount) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center gap-2 text-text-dim">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Preparing your cart…</span>
        </div>
      </div>
    );
  }

  if (orderNumbers) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <OrderConfirmed orderNumbers={orderNumbers} email={form.email} total={orderTotal ?? undefined} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-display text-2xl text-text">Nothing to check out</h1>
        <p className="mt-2 text-text-dim">Your cart is empty — browse designs or upload a model.</p>
        <Button as="link" href="/designs" className="mt-6">
          Browse designs
        </Button>
      </div>
    );
  }

  if (status !== "authenticated") {
    // Redirect is in flight (see effect above).
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Loader2 size={20} className="animate-spin text-text-faint" />
      </div>
    );
  }

  // Server-side, placeCartOrder independently re-checks this too — this is
  // only the UI gate.
  if (!account.emailVerified) {
    return (
      <div className="mx-auto max-w-md px-5 py-10 md:py-14">
        <h1 className="text-display text-2xl text-text">Verify your email</h1>
        <p className="mt-2 text-text-dim">Finish verifying your email before placing your order.</p>
        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <EmailVerifyPanel email={account.email} verified={account.emailVerified} onRefresh={refreshAccountStatus} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <StepIndicator current={4} />
      <h1 className="mt-8 text-display text-2xl text-text md:text-3xl">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <section>
            <h2 className="text-sm font-medium text-text">Contact</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Email" type="email" {...field("email")} />
              <Input label="Phone" type="tel" {...field("phone")} value={effectivePhone} />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-text">Delivery</h2>
            </div>
            {addresses.length > 0 && (
              <div className="mt-4">
                <SavedAddressPicker
                  addresses={addresses}
                  selectedId={selectedAddressId}
                  onSelect={handleSelectAddress}
                />
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full name" className="sm:col-span-2" {...field("name")} />
              <Input label="Address" className="sm:col-span-2" {...field("line1")} />
              <Input label="City" {...field("city")} />
              <Input label="State" {...field("state")} />
              <Input label="PIN code" {...field("pin")} />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-text">Payment</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                    payment === method
                      ? "border-text bg-surface-2 text-text"
                      : "border-border-strong text-text-dim hover:border-text-faint"
                  )}
                >
                  {method}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-text-faint">
              This is a demo checkout — no real payment is processed.
            </p>
          </section>

          {placeError && (
            <div className="flex items-start gap-2 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Payment failed</p>
                <p className="mt-0.5">{placeError}</p>
              </div>
            </div>
          )}

          <Button type="submit" size="lg" disabled={placing} className="w-full justify-center">
            {placing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing…
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartOrderSummary items={items} phone={effectivePhone || undefined} />
        </div>
      </div>
    </div>
  );
}
