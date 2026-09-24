"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_LABELS } from "@/lib/orders";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function OrderTrackingTeaser() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderId.trim().toUpperCase();
    if (id) router.push(`/orders/${id}`);
  };

  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-2xl border border-border bg-surface p-8 md:p-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-display text-2xl text-text md:text-3xl">Already ordered?</h2>
          <p className="mt-2 text-text-dim">Track your print, from queue to doorstep.</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Order ID"
                placeholder="ORD-48291"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="justify-center">
              Track order
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>

        <div className="flex flex-col justify-center">
          <ol className="flex flex-col gap-3">
            {ORDER_STATUS_SEQUENCE.map((status, i) => (
              <li key={status} className="flex items-center gap-3 text-sm">
                <CheckCircle2
                  size={16}
                  className={i === 0 ? "text-accent" : "text-text-faint"}
                  strokeWidth={1.75}
                />
                <span className={i === 0 ? "text-text" : "text-text-dim"}>{ORDER_STATUS_LABELS[status]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
