"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Package, Box, Heart, Settings, LogOut } from "lucide-react";
import { useAccountStore } from "@/lib/accountStore";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

const ITEMS = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/designs", label: "My Designs", icon: Box },
  { href: "/account/saved", label: "Saved", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AvatarMenu() {
  const { data: session } = useSession();
  const emailVerified = useAccountStore((s) => s.emailVerified);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!session?.user) return null;

  const initials = (session.user.name ?? session.user.email ?? "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2 text-xs font-medium text-text"
      >
        {session.user.image ? (
          <Image src={session.user.image} alt="" width={36} height={36} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-card"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="flex items-center gap-1.5 truncate text-sm font-medium text-text">
                <span className="truncate">{session.user.name}</span>
                {emailVerified && <VerifiedBadge />}
              </p>
              <p className="truncate text-xs text-text-faint">{session.user.email}</p>
            </div>
            <div className="py-1.5">
              {ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-text transition-colors hover:bg-surface-2"
                >
                  <item.icon size={15} className="text-text-faint" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border py-1.5">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-sm text-danger transition-colors hover:bg-surface-2"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
