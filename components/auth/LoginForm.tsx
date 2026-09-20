"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import GoogleButton from "./GoogleButton";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const isCheckout = searchParams.get("checkout") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

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

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-faint">OR</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
        </Button>
      </form>

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
