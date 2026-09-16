"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/dashboard", label: "Dashboard" },
];

export function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change so it never lingers open after navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const authAction =
    status === "authenticated" && session ? (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="font-mono-label w-full border-2 border-line px-4 py-2.5 text-xs text-ink-muted hover:border-accent hover:text-accent sm:w-auto"
      >
        Sign out
      </button>
    ) : (
      <Link
        href="/login"
        className="font-mono-label block w-full border-2 border-accent px-4 py-2.5 text-center text-xs text-accent hover:bg-accent hover:text-accent-ink sm:w-auto sm:text-left"
      >
        Sign in
      </Link>
    );

  return (
    <header className="border-b-2 border-line">
      <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="font-display text-lg tracking-tight">
          BOOKSHELF
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono-label text-xs transition-none",
                  active ? "text-accent underline underline-offset-4" : "text-ink-muted hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {authAction}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="font-mono-label border-2 border-line px-4 py-2 text-xs text-ink-muted hover:border-accent hover:text-accent md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t-2 border-line px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-mono-label text-sm transition-none",
                    active ? "text-accent underline underline-offset-4" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {authAction}
          </div>
        </nav>
      )}
    </header>
  );
}