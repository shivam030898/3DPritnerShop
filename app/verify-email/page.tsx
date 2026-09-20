"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmailToken } from "@/lib/actions/verification";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"checking" | "ok" | "error">(() => (token ? "checking" : "error"));
  const [error, setError] = useState<string | null>(() => (token ? null : "Missing verification token."));

  useEffect(() => {
    if (!token) return;
    verifyEmailToken(token).then((result) => {
      if (result.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }, [token]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      {status === "checking" && (
        <>
          <Loader2 size={28} className="animate-spin text-text-faint" />
          <p className="mt-4 text-sm text-text-dim">Verifying your email…</p>
        </>
      )}

      {status === "ok" && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 size={28} />
          </span>
          <h1 className="text-display mt-6 text-2xl text-text">Email verified</h1>
          <p className="mt-2 text-text-dim">You&apos;re all set. Head back to your account to continue.</p>
          <Button as="link" href="/account" className="mt-8">
            Go to account
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
            <XCircle size={28} />
          </span>
          <h1 className="text-display mt-6 text-2xl text-text">Verification failed</h1>
          <p className="mt-2 text-text-dim">{error}</p>
          <Button as="link" href="/account/settings" className="mt-8">
            Go to settings
          </Button>
        </>
      )}
    </div>
  );
}
