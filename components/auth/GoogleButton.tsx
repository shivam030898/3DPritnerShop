"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C33.6 5.1 29 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C33.6 5.1 29 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.1 0 9.6-2 12.9-5.2l-6.2-5.1C28.9 36.1 26.6 37 24 37c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 40.6 16.3 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.7l6.2 5.1C40.9 36 44 30.5 44 24c0-1.4-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export default function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn("google", { callbackUrl });
      }}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border-strong bg-surface text-sm font-medium text-text transition-colors hover:bg-surface-2 disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
      {loading ? "Signing you in…" : "Continue with Google"}
    </button>
  );
}
