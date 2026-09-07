"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui";
import { useModal } from "@/context/ModalContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Transformations", href: "/transformations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "#contact" },
];

/**
 * Overlay navbar for the luxury design pivot: absolutely positioned and
 * transparent so it sits directly on top of each page's hero, rather
 * than reserving its own layout space or gaining a solid background on
 * scroll. Pages with a shallow hero should keep enough top padding to
 * clear it.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { open: openBookingModal } = useModal();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto grid max-w-7xl grid-cols-2 items-center px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-self-start">
          <Image src="/logo.png" alt="" width={40} height={40} className="h-9 w-9" priority />
          <span className="text-lg font-bold tracking-wide text-foreground">
            PERFORM <span className="text-brand-gold">BETTER</span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden justify-self-center md:flex md:items-center md:gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden justify-self-end md:block">
          <MagneticButton
            strength={0.3}
            onClick={openBookingModal}
            className="!bg-white !text-black !text-xs !tracking-[0.15em] hover:!shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            BOOK YOUR INTRO SESSION
          </MagneticButton>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="justify-self-end text-foreground md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu — needs a solid backdrop since the header itself is transparent */}
      {isOpen && (
        <div className="border-b border-glass bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:bg-white/5 hover:text-brand-gold"
              >
                {link.label}
              </Link>
            ))}
            <MagneticButton
              strength={0.3}
              onClick={() => {
                setIsOpen(false);
                openBookingModal();
              }}
              className="mt-2 !w-full !bg-white !text-black !text-xs !tracking-[0.15em]"
            >
              BOOK YOUR INTRO SESSION
            </MagneticButton>
          </div>
        </div>
      )}
    </header>
  );
}
