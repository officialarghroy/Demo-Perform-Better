"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "#" },
  { label: "Membership", href: "#" },
  { label: "Trainers", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Placeholder logo */}
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-brand-yellow" />
          <span className="text-lg font-bold tracking-wide text-foreground">
            PERFORM <span className="text-brand-yellow">BETTER</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-yellow"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#"
            className="rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Join Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-foreground md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-white/10 bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/5 hover:text-brand-yellow"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-full bg-brand-yellow px-5 py-2 text-center text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
