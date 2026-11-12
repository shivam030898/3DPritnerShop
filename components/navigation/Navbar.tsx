"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CartButton from "@/components/cart/CartButton";
import FormaLogo from "@/components/brand/FormaLogo";
import AvatarMenu from "./AvatarMenu";
import { cn } from "@/lib/utils";

function isNavLinkActive(pathname: string, href: string) {
  // An in-page anchor (e.g. "/#about") never represents its own route, so it
  // should never show as the active nav item.
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Position-based, not activity-based: transparent only exactly at the top
  // of the page, solid black for any scrollY > 0 — stays black even once
  // scrolling has stopped, and only clears once the user scrolls back to 0.
  const [scrolled, setScrolled] = useState(false);
  // Homepage only: true once the page has scrolled past the hero footage.
  // Until then the bar floats over dark video, so it borrows the dark
  // theme's tokens (see `overHero` below) whatever the site theme is.
  const [pastHero, setPastHero] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      // 64 = this bar's own height: flip the moment the next section's top
      // edge reaches the bar, not when it reaches the top of the window.
      setPastHero(hero ? window.scrollY >= hero.offsetHeight - 64 : true);
    };
    handleScroll(); // pages can load already scrolled (e.g. back/forward nav)
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  const overHero = pathname === "/" && !pastHero;

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/designs?q=${encodeURIComponent(q)}` : "/designs");
  };

  return (
    <>
      <header
        data-site-header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ease-out",
          // `dark` here re-scopes the theme tokens for this subtree only, so
          // every `text-text` / `bg-surface` inside reads light-on-dark over
          // the footage without a second set of colour classes.
          overHero
            ? "dark bg-transparent"
            : scrolled
              ? "bg-bg/75 shadow-[0_1px_0_var(--color-border)] backdrop-blur-xl backdrop-saturate-150"
              : "bg-transparent"
        )}
      >
        <nav className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
          <Link href="/" data-nav-item className="shrink-0">
            <FormaLogo />
          </Link>

          {/* Centred by its wrapper, so the list itself stays free of
              transforms for the homepage intro to animate. */}
          <div className="pointer-events-none absolute inset-x-0 hidden justify-center lg:flex">
          <ul data-nav-item className="pointer-events-auto flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative inline-block whitespace-nowrap py-1 text-sm transition-colors duration-300",
                      active ? "text-text" : "text-text-dim hover:text-text"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-px bg-text transition-transform duration-500 ease-[var(--ease-standard)] motion-reduce:transition-none",
                        active
                          ? "origin-left scale-x-100"
                          : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          </div>

          <div data-nav-item className="relative hidden items-center gap-1.5 lg:flex">
            <AnimatePresence initial={false} mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-open"
                  onSubmit={submitSearch}
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-center"
                >
                  <Search size={15} className="pointer-events-none absolute left-3 text-text-faint" />
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setSearchOpen(false)}
                    onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                    placeholder="Search designs…"
                    aria-label="Search designs"
                    className="h-9 w-full rounded-full border border-border-strong bg-surface pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-text"
                  />
                </motion.form>
              ) : (
                <motion.button
                  key="search-closed"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-dim transition-colors hover:bg-surface-2 hover:text-text"
                >
                  <Search size={18} strokeWidth={1.75} />
                </motion.button>
              )}
            </AnimatePresence>
            <ThemeToggle />
            <CartButton />
            {status === "authenticated" ? (
              <AvatarMenu />
            ) : (
              <Link
                href="/login"
                className="px-2 text-sm text-text-dim transition-colors hover:text-text"
              >
                Sign in
              </Link>
            )}
          </div>

          <div data-nav-item className="flex items-center gap-0.5 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/designs");
              }}
              aria-label="Search"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-dim transition-colors hover:bg-surface-2 hover:text-text"
            >
              <Search size={19} strokeWidth={1.75} />
            </button>
            <CartButton />
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer p-2 text-text"
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
              <FormaLogo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="cursor-pointer text-text">
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                submitSearch(e);
                setOpen(false);
              }}
              className="relative border-b border-border px-5 py-4"
            >
              <Search size={16} className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search designs…"
                aria-label="Search designs"
                className="h-11 w-full rounded-lg border border-border-strong bg-surface pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-text"
              />
            </form>

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
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-text-dim">Appearance</span>
                <ThemeToggle />
              </div>
              <div className="mt-4">
                <Button as="link" href="/designs" className="w-full">
                  View the collection
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
