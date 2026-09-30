"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const isCheckout = searchParams.get("checkout") === "1";

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <h1 className="text-display text-2xl text-text">
        {isCheckout ? "Sign in to complete your order." : "Welcome back."}
      </h1>
      <p className="mt-2 text-sm text-text-dim">
        {isCheckout
          ? "Your cart is saved — sign in and we'll bring it right along."
          : "Sign in to manage your designs and orders."}
      </p>

      <div className="mt-8">
        <GoogleButton callbackUrl={callbackUrl} />
      </div>

      <p className="mt-6 text-center text-sm text-text-faint">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}${isCheckout ? "&checkout=1" : ""}`}
          className="font-medium text-text underline underline-offset-2"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
