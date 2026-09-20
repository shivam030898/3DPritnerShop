"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore, type ToastTone } from "@/lib/toastStore";

const ICONS: Record<ToastTone, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
};

const TONE_CLASSES: Record<ToastTone, string> = {
  default: "text-text",
  success: "text-success",
  error: "text-danger",
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 shadow-card"
            >
              <Icon size={16} className={TONE_CLASSES[t.tone]} />
              <span className="text-sm text-text">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="ml-1 text-text-faint transition-colors hover:text-text"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
