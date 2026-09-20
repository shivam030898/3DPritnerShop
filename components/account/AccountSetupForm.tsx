"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";
import { completeAccountSetup } from "@/lib/actions/profile";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AccountSetupForm({
  defaultName,
  email,
  emailVerified,
  image,
  onComplete,
}: {
  defaultName: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  onComplete: (name: string, phone: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const result = await completeAccountSetup(name, phone);
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onComplete(result.name, result.phone);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        {image && (
          <Image src={image} alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
        )}
        <div>
          <h1 className="text-display text-xl text-text">Complete your account</h1>
          <p className="text-sm text-text-dim">You&apos;re almost ready to start ordering.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <div>
          <Input label="Email" value={email} disabled readOnly className="cursor-not-allowed opacity-60" />
          {emailVerified && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-text-faint">
              <CheckCircle2 size={12} className="text-success" /> Verified
            </p>
          )}
        </div>
        <div>
          <Input
            label="Phone number"
            type="tel"
            inputMode="tel"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="mt-1.5 text-xs text-text-faint">
            We&apos;ll use your phone number for order confirmations, delivery updates, and other
            important order-related notifications.
          </p>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={saving} className="mt-2 w-full justify-center">
          {saving ? <Loader2 size={16} className="animate-spin" /> : "Continue"}
        </Button>
      </form>
    </div>
  );
}
