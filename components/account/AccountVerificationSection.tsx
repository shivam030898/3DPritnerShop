"use client";

import { useState } from "react";
import EmailVerifyPanel from "./EmailVerifyPanel";

export default function AccountVerificationSection({
  email: initialEmail,
  emailVerified: initialEmailVerified,
  phone,
}: {
  email: string;
  emailVerified: boolean;
  phone: string | null;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [emailVerified, setEmailVerified] = useState(initialEmailVerified);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm font-medium text-text">Account verification</p>

      <div className="mt-4">
        <EmailVerifyPanel
          email={email}
          verified={emailVerified}
          // Verification is confirmed server-side by clicking the emailed
          // link — a full reload re-derives status from the database
          // rather than trusting any client-held flag.
          onRefresh={() => window.location.reload()}
          onEmailChanged={(next) => {
            setEmail(next);
            setEmailVerified(false);
          }}
        />
      </div>

      {phone && (
        <div className="mt-4 border-t border-border pt-4 text-sm">
          <p className="text-text-faint">Mobile</p>
          <p className="text-text">{phone}</p>
        </div>
      )}
    </div>
  );
}
