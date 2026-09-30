"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "./GoogleButton";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const isCheckout = searchParams.get("checkout") === "1";

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="text-display text-2xl text-text">
        {isCheckout ? "Create an account to complete your order." : "Create your account."}
      </h1>
      <p className="mt-2 text-sm text-text-dim">
        {isCheckout
          ? "Your cart is saved — it'll be waiting for you right after this."
          : "Save designs, track orders, and check out faster."}
      </p>

      <div className="mt-8">
        <GoogleButton callbackUrl={callbackUrl} />
      </div>

      <p className="mt-6 text-center text-sm text-text-faint">
        Already have an account?{" "}
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}${isCheckout ? "&checkout=1" : ""}`}
          className="font-medium text-text underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
