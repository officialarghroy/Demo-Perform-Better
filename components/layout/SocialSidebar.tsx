import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";

const SOCIAL_LINKS = [
  // TODO: Facebook/Instagram/YouTube need real handles — ask the client.
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "YouTube", href: "#", Icon: FaYoutube },
  // Real click-to-chat link using the number already in the Footer.
  { label: "WhatsApp", href: "https://wa.me/97339268852", Icon: FaWhatsapp },
];

/**
 * A slim vertical rail of social icons, fixed to the right-middle of the
 * viewport. Sits above page content (z-40) but below the navbar/mobile
 * menu (z-50).
 */
export default function SocialSidebar() {
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 sm:right-6 sm:flex">
      {SOCIAL_LINKS.map(({ label, href, Icon }) => {
        const isExternal = href.startsWith("http");
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-glass bg-card/60 text-foreground/70 backdrop-blur-sm transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
          >
            <Icon className="h-4 w-4" />
          </Link>
        );
      })}
      <span className="mt-1 h-10 w-px bg-white/10" aria-hidden="true" />
    </div>
  );
}
