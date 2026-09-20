"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/constants";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CartButton from "@/components/cart/CartButton";
import AvatarMenu from "./AvatarMenu";
import { cn } from "@/lib/utils";

function isNavLinkActive(pathname: string, href: string) {
  const hrefPath = href.split("#")[0] || "/";
  if (hrefPath === "/") return pathname === "/";
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
        <nav className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="text-display text-lg text-text">
            {BRAND.name}
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-block py-1 text-sm transition-colors duration-200",
                      active ? "text-text" : "text-text-dim hover:text-text"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-text transition-opacity duration-200",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <CartButton />
            {status === "authenticated" ? (
              <AvatarMenu />
            ) : (
              <Link
                href="/login"
                className="text-sm text-text-dim transition-colors hover:text-text"
              >
                Sign in
              </Link>
            )}
            <Button as="link" href="/upload" size="sm">
              Upload Design
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <CartButton />
            <button
              onClick={() => setOpen(true)}
              className="p-2 text-text"
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <span className="text-display text-lg text-text">{BRAND.name}</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-text">
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-5 py-6">
              {NAV_LINKS.map((link) => {
                const active = isNavLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between border-b border-border py-4 text-lg transition-colors duration-200",
                      active ? "text-text" : "text-text-dim"
                    )}
                  >
                    {link.label}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </Link>
                );
              })}
              <Link
                href={status === "authenticated" ? "/account" : "/login"}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-lg text-text"
              >
                {status === "authenticated" ? "My account" : "Sign in"}
              </Link>
              <div className="mt-6">
                <Button as="link" href="/upload" className="w-full">
                  Upload Design
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
