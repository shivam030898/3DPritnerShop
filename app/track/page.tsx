"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function TrackPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderId.trim().toUpperCase();
    if (id) router.push(`/orders/${id}`);
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="text-display text-2xl text-text md:text-3xl">Track your order</h1>
      <p className="mt-2 text-text-dim">Enter your order ID to see its live status.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 text-left">
        <Input
          label="Order ID"
          placeholder="ORD-48291"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <Button type="submit" className="w-full justify-center">
          Track Order
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-6 text-sm text-text-faint">
        Signed in already?{" "}
        <Link href="/account/orders" className="font-medium text-text underline underline-offset-2">
          View all your orders
        </Link>
      </p>
    </div>
  );
}
