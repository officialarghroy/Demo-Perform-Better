"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton, TextReveal } from "@/components/ui";
import { useModal } from "@/context/ModalContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Transformations", href: "/transformations" },
  { label: "Pricing", href: "/pricing" },
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

  // Escape-to-close + body scroll lock while the full-screen mobile menu
  // is open — same pattern as BookingModal.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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

        {/* Mobile menu toggle — relative z-50 keeps it clickable above the
            full-screen overlay below, which sits at z-40. */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative z-50 justify-self-end text-foreground md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#0A0A0A]/95 px-8 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground transition-colors hover:text-brand-gold"
                >
                  <TextReveal
                    as="span"
                    text={link.label}
                    delay={0.1 + index * 0.1}
                    className="block text-4xl font-extrabold uppercase"
                  />
                </Link>
              ))}
            </div>

            <MagneticButton
              strength={0.3}
              onClick={() => {
                setIsOpen(false);
                openBookingModal();
              }}
              className="mt-10 !w-full !bg-white !text-black !text-xs !tracking-[0.15em]"
            >
              BOOK YOUR INTRO SESSION
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
