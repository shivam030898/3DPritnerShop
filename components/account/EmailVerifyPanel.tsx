"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { resendEmailVerification } from "@/lib/actions/verification";
import { changeEmail } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function EmailVerifyPanel({
  email,
  verified,
  onRefresh,
  onEmailChanged,
}: {
  email: string;
  verified: boolean;
  /** Re-check verification status (e.g. after the user says they clicked the link). */
  onRefresh?: () => void;
  /** The email address itself changed — parent should treat it as unverified going forward. */
  onEmailChanged?: (newEmail: string) => void;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    setSending(true);
    setError(null);
    const result = await resendEmailVerification();
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      if (result.retryAfterSeconds) setCooldown(result.retryAfterSeconds);
      return;
    }
    setSent(true);
    setDevLink(result.devLink ?? null);
    setCooldown(60);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingEmail(true);
    setError(null);
    const result = await changeEmail(newEmail);
    setChangingEmail(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setEditingEmail(false);
    setSent(true);
    setDevLink(result.devVerifyLink ?? null);
    setCooldown(60);
    onEmailChanged?.(newEmail.trim().toLowerCase());
  };

  if (verified) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-text-faint">Email</p>
          <p className="text-text">{email}</p>
        </div>
        <span className="flex items-center gap-1.5 text-success">
          <CheckCircle2 size={14} /> Verified
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-text-faint">Email</p>
          <p className="text-text">{email}</p>
        </div>
        <span className="flex items-center gap-1.5 text-danger">
          <AlertTriangle size={14} /> Not verified
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-border-strong bg-surface-2 p-4 text-sm">
        <p className="font-medium text-text">Verify your email</p>

        {editingEmail ? (
          <form onSubmit={handleChangeEmail} className="mt-3 flex flex-col gap-3">
            <Input
              label="New email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={changingEmail}>
                {changingEmail ? <Loader2 size={14} className="animate-spin" /> : "Save & send link"}
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditingEmail(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="mt-1 text-text-dim">
              {sent ? "We've sent a verification link to " : "Send a verification link to "}
              <span className="text-text">{email}</span>. Check your inbox and click the link.
            </p>
            {devLink && (
              <p className="mt-2 break-all rounded-lg border border-dashed border-border-strong px-3 py-2 text-xs text-text-faint">
                Development mode — no email provider configured.{" "}
                <a href={devLink} className="underline">
                  {devLink}
                </a>
              </p>
            )}
            {error && <p className="mt-2 text-danger">{error}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Button size="sm" variant="secondary" onClick={handleResend} disabled={sending || cooldown > 0}>
                {sending && <Loader2 size={14} className="animate-spin" />}
                {cooldown > 0 ? `Resend in ${cooldown}s` : sent ? "Resend email" : "Send verification email"}
              </Button>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="flex items-center gap-1 text-xs text-text-dim underline underline-offset-2"
                >
                  <RefreshCw size={12} /> I&apos;ve verified — refresh
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingEmail(true);
                  setNewEmail(email);
                  setError(null);
                }}
                className="text-xs text-text-dim underline underline-offset-2"
              >
                Change email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
