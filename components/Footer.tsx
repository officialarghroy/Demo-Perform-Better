import Image from "next/image";
import Link from "next/link";
import { AtSign, Clock, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FadeIn } from "@/components/ui";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/performbetter.bh", Icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/people/Perform-Better-Gym/61564134984346/", Icon: FaFacebookF },
  { label: "TikTok", href: "https://www.tiktok.com/@perform.better.fi", Icon: FaTiktok },
  { label: "YouTube", href: "https://www.youtube.com/@performbetterfitnesscenter1427", Icon: FaYoutube },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Transformations", href: "/transformations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "#contact" },
];

const PHONE_NUMBERS = ["39268852", "39253446"];

export default function Footer() {
  return (
    <footer id="contact">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid gap-8 border-t border-white/10 py-16 md:grid-cols-4">
          {/* Col 1: brand */}
          <FadeIn className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={40} height={40} className="h-9 w-9" />
              <span className="text-lg font-bold tracking-wide text-foreground">
                PERFORM <span className="text-brand-gold">BETTER</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-400">
              Developed with Experts, Inspired by Athletes...
            </p>
            <div className="mt-2 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-brand-gold"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
              <Link href="mailto:performbetter.bh@gmail.com" aria-label="Email" className="text-gray-400 transition-colors hover:text-brand-gold">
                <AtSign className="h-5 w-5" />
              </Link>
            </div>
          </FadeIn>

          {/* Col 2: quick links */}
          <FadeIn delay={0.1}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-400 transition-colors hover:text-brand-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </FadeIn>

          {/* Col 3: operating hours */}
          <FadeIn delay={0.2}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Operating Hours
            </h3>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <div className="flex flex-col gap-1">
                <span>Sat–Thu: 5 AM - 1 AM</span>
                <span>Fri: 4 PM - 11 PM</span>
              </div>
            </div>
          </FadeIn>

          {/* Col 4: contact */}
          <FadeIn delay={0.3}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Contact
            </h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>Shop no 309, Golden sand building no 281, Hoora</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <div className="flex flex-col">
                  {PHONE_NUMBERS.map((number) => (
                    <a
                      key={number}
                      href={`tel:+973${number}`}
                      className="transition-colors hover:text-brand-gold"
                    >
                      {number}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Perform Better Fitness Center. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
