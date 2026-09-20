"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function OrderConfirmed({
  orderNumbers,
  email,
  total,
}: {
  orderNumbers: string[];
  email: string;
  total?: number;
}) {
  const [primary, ...rest] = orderNumbers;
  const multiple = rest.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex max-w-md flex-col items-center py-16 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
        <CheckCircle2 size={28} />
      </span>
      <h1 className="text-display mt-6 text-2xl text-text">
        {multiple ? `${orderNumbers.length} orders placed` : "Order confirmed"}
      </h1>
      <p className="mt-2 text-lg text-text-dim">
        {primary}
        {multiple && ` +${rest.length} more`}
      </p>
      <p className="mt-4 text-sm text-text-dim">
        Your {multiple ? "items are" : "model is"} now in production. We&apos;ll email updates
        to {email}.
      </p>
      {total != null && (
        <p className="mt-1 text-sm text-text-faint">Total paid: {formatINR(total)}</p>
      )}

      <Button as="link" href={multiple ? "/account/orders" : `/orders/${primary}`} className="mt-8">
        {multiple ? "View orders" : "Track Order"}
        <ArrowRight size={16} />
      </Button>
    </motion.div>
  );
}
