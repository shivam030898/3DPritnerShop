"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { changePassword } from "@/lib/actions/auth";
import { toast } from "@/lib/toastStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await changePassword(current, next);
    setLoading(false);
    if (result.ok) {
      toast("Password updated", "success");
      setCurrent("");
      setNext("");
    } else {
      toast(result.error, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {hasPassword && (
        <Input
          label="Current password"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      )}
      <Input
        label="New password"
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        minLength={8}
        required
      />
      <Button type="submit" size="sm" disabled={loading} className="self-start">
        {loading ? <Loader2 size={14} className="animate-spin" /> : "Update password"}
      </Button>
    </form>
  );
}
