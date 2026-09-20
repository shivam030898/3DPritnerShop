"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/designs", label: "My Designs" },
  { href: "/account/saved", label: "Saved" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between border-b border-border">
      <nav className="flex gap-6 overflow-x-auto">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "whitespace-nowrap border-b-2 py-3 text-sm transition-colors",
                active
                  ? "border-text text-text"
                  : "border-transparent text-text-dim hover:text-text"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="hidden shrink-0 text-sm text-text-faint hover:text-text sm:block"
      >
        Log out
      </button>
    </div>
  );
}
