import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS, BRAND } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 py-14 pb-24 md:px-8 md:pb-14">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="flex items-center gap-2 text-display text-lg text-text">
              <Image src="/images/logo-v3.png" alt="" width={24} height={24} className="h-6 w-6" />
              {BRAND.name}
            </span>
            <p className="mt-2 max-w-[22ch] text-sm text-text-dim">
              Upload a design. We print, finish and deliver it.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-sm font-medium text-text">{group}</p>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-dim transition-colors hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {BRAND.year} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-5">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-text">
                {s.label}
              </a>
            ))}
            <Link href="/support" className="hover:text-text">Privacy</Link>
            <Link href="/support" className="hover:text-text">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
