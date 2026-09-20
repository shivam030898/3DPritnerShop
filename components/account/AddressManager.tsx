"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Address } from "@/lib/generated/prisma";
import { addAddress, removeAddress } from "@/lib/actions/addresses";
import { toast } from "@/lib/toastStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const EMPTY_FORM = { label: "", name: "", line1: "", city: "", state: "", pin: "" };

export default function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await addAddress(form);
      if (result.ok) {
        toast("Address saved", "success");
        setForm(EMPTY_FORM);
        setAdding(false);
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    });
  };

  const handleRemove = (id: string) => {
    setRemovingId(id);
    startTransition(async () => {
      await removeAddress(id);
      router.refresh();
      setRemovingId(null);
    });
  };

  return (
    <>
      <div className="mt-6 flex flex-col gap-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-start justify-between rounded-xl border border-border bg-surface p-5"
          >
            <div>
              <p className="text-sm font-medium text-text">{addr.label}</p>
              <p className="mt-1 text-sm text-text-dim">
                {addr.name} · {addr.line1}, {addr.city}, {addr.state} {addr.pin}
              </p>
            </div>
            <button
              onClick={() => handleRemove(addr.id)}
              disabled={isPending}
              aria-label="Remove address"
              className="text-text-faint transition-colors hover:text-accent"
            >
              {removingId === addr.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <form
          onSubmit={handleAdd}
          className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2"
        >
          <Input label="Label" placeholder="Home / Work / Other" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} required />
          <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Address" className="sm:col-span-2" value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} required />
          <Input label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
          <Input label="State" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} required />
          <Input label="PIN code" value={form.pin} onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))} required />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? <Loader2 size={14} className="animate-spin" /> : "Save address"}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong py-4 text-sm text-text-dim transition-colors hover:border-text hover:text-text"
        >
          <Plus size={15} />
          Add new address
        </button>
      )}
    </>
  );
}
