import Link from "next/link";
import { Dumbbell, AtSign, Globe, MessageCircle } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "#" },
  { label: "Membership", href: "#" },
  { label: "Trainers", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          {/* Placeholder logo */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-brand-yellow" />
              <span className="text-lg font-bold tracking-wide text-foreground">
                PERFORM <span className="text-brand-yellow">BETTER</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-foreground/60">
              Perform Better Fitness Center — placeholder tagline goes here.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground/70 transition-colors hover:text-brand-yellow"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social placeholders (generic icons — lucide-react dropped
              brand/logo icons; swap in real brand icons when wiring up
              actual social links) */}
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Instagram" className="text-foreground/70 transition-colors hover:text-brand-yellow">
              <Globe className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Facebook" className="text-foreground/70 transition-colors hover:text-brand-yellow">
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Email" className="text-foreground/70 transition-colors hover:text-brand-yellow">
              <AtSign className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} Perform Better Fitness Center. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
