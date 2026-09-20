"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { toast } from "@/lib/toastStore";
import { formatDate } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

type Props = {
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  image: string | null;
  createdAt: Date;
};

export default function ProfileHeader({ name, email, emailVerified, phone, image, createdAt }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [phoneValue, setPhoneValue] = useState(phone ?? "");

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile(nameValue, phoneValue);
    setSaving(false);
    if (result.ok) {
      toast("Profile updated", "success");
      setEditing(false);
      router.refresh();
    } else {
      toast(result.error, "error");
    }
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="rounded-xl border border-border bg-surface p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)} required />
          <Input label="Phone" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Save"}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 text-lg font-medium text-text">
          {image ? (
            <Image src={image} alt="" width={56} height={56} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-base font-medium text-text">
            {name}
            {emailVerified && <VerifiedBadge size={15} />}
          </p>
          <p className="text-sm text-text-dim">{email}</p>
          {phone && <p className="text-sm text-text-dim">{phone}</p>}
          <p className="mt-1 text-xs text-text-faint">Member since {formatDate(createdAt)}</p>
        </div>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="flex shrink-0 items-center gap-1.5 text-sm text-text-dim transition-colors hover:text-text"
      >
        <Pencil size={13} />
        Edit
      </button>
    </div>
  );
}
