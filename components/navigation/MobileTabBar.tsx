"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Compass, Upload, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { status } = useSession();

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/designs", label: "Explore", icon: Compass },
    { href: "/upload", label: "Upload", icon: Upload, primary: true },
    { href: "/account/orders", label: "Orders", icon: Package },
    {
      href: status === "authenticated" ? "/account" : "/login",
      label: "Account",
      icon: User,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.primary) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 items-center justify-center"
            >
              <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-text text-white shadow-lg">
                <Icon size={20} />
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px]",
              active ? "text-text" : "text-text-faint"
            )}
          >
            <Icon size={19} strokeWidth={active ? 2.25 : 1.75} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
