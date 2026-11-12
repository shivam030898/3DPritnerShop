"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { deleteAccount } from "@/lib/actions/profile";
import { toast } from "@/lib/toastStore";

export default function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAccount();
    if (!result.ok) {
      setLoading(false);
      toast(result.error, "error");
    }
  };

  return (
    <div className="rounded-xl border border-danger/30 bg-danger-soft p-5">
      <p className="text-sm font-medium text-text">Delete account</p>
      <p className="mt-1 text-sm text-text-dim">
        Permanently deletes your account, orders, designs and addresses. This can&apos;t be undone.
      </p>
      {confirming ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-fill btn-fill--solid btn-fill--danger flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Yes, delete everything"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="btn-fill btn-fill--outline btn-fill--quiet rounded-lg px-[15px] py-[9px] text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="btn-fill btn-fill--outline btn-fill--danger mt-3 rounded-lg px-[15px] py-[9px] text-sm font-medium"
        >
          Delete account
        </button>
      )}
    </div>
  );
}
