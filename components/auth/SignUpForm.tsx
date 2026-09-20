"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { signUpWithPassword } from "@/lib/actions/auth";
import { toast } from "@/lib/toastStore";
import GoogleButton from "./GoogleButton";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const isCheckout = searchParams.get("checkout") === "1";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signUpWithPassword(name, email, password);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (!signInResult || signInResult.error) {
      setError("Account created — please sign in.");
      router.push("/login");
      return;
    }

    toast(
      result.devVerifyLink
        ? `Verify your email (dev mode): ${result.devVerifyLink}`
        : "Check your email to verify your account.",
      "success"
    );
    router.push(callbackUrl);
    router.refresh();
  };

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

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-faint">OR</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
          minLength={8}
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Create account"}
        </Button>
      </form>

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
