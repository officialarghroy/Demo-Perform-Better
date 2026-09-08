"use client";

import { useState } from "react";
import { Baby, Flame, User, Zap } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { MagneticButton } from "@/components/ui";
import { useModal } from "@/context/ModalContext";

// Looping cinematic background video (public/hero-video.mp4), muted so
// autoplay is allowed by every browser. Compressed to 720p/~6MB with
// `+faststart` so it starts playing quickly instead of competing with
// page hydration for bandwidth on slower connections. The still photo
// is both the `poster` (shown before the video has a frame ready) and
// the fallback background if the video ever fails to load — see
// `videoFailed` below.
const BACKGROUND_VIDEO = "/hero-video.mp4";
const BACKGROUND_POSTER =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop";

const CARDS = [
  {
    title: "100 Days Challenge",
    subtext: "Weight Loss & Fitness",
    icon: Flame,
  },
  {
    title: "F50 Functional",
    subtext: "High-intensity group training",
    icon: Zap,
  },
  {
    title: "1-to-1 PT",
    subtext: "With money-back guarantee",
    icon: User,
  },
  {
    title: "Kids & Youth",
    subtext: "Karate, Dance & Bootcamp",
    icon: Baby,
  },
];

// A slightly custom "expo out" curve — snappier off the start and a
// softer landing than the generic `easeOut`, used throughout so the
// whole hero reads as one motion language.
const EASE = [0.16, 1, 0.3, 1] as const;

// Two lines, staggered — simple opacity+y fades (the same proven
// pattern as components/ui/FadeIn), not a per-word overflow-hidden
// mask. The masked version looked sharper but had a real failure mode:
// each word's *content* was only made visible by JS-computed transform
// styles, so on a slow/unlucky load (e.g. hydration delayed by a heavy
// hero video competing for bandwidth) the headline could sit invisible
// for longer than expected, reading as "text not loading". This
// version keeps the staggered reveal but fewer moving parts, less
// dependent on precise mask/font-metric timing.
const headingContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Fades in right as the headline lands (line 2 finishes ≈1.05s in — see
// headingContainer above) — a third beat between the text and the cards.
const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 1.0 } },
};

// Starts once the CTA button has appeared, so the sequence reads as
// text -> button -> cards rather than racing any of the above.
const cardsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 1.3 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * High-end hero: full-viewport looping background video (dimmed via
 * `brightness-50` for a cinematic feel, falling back to a plain poster
 * image if the video ever fails to load — see `videoFailed`) under a
 * heavy 3-stop dark gradient, a staggered two-line headline reveal, a
 * "BOOK YOUR INTRO SESSION" CTA that opens the global BookingModal
 * (ModalContext) once the headline lands, and a row of 4 feature cards.
 *
 * Layout differs by breakpoint rather than using one `h-screen` +
 * absolute-cards structure everywhere:
 * - Below `lg`, the section is `min-h-[100dvh]` (not a strict `h-`), a
 *   flex column with `justify-between` and real `pt-32`/`pb-16`
 *   padding, and the card row is a normal, in-flow block (`mt-12`) —
 *   this is what actually fixes the mobile collision: a *strict*
 *   `h-[100dvh]` combined with absolutely-positioned cards has no way
 *   to grow if the centered text block is taller than the viewport (a
 *   massive `text-[11vw]` headline plus 4 cards on a short phone
 *   screen), so the cards would overlap the text instead of the page
 *   just getting taller. `min-h` lets the section grow to fit; letting
 *   the cards flow in-document instead of floating at a fixed
 *   `-bottom-16` means they simply push whatever comes after them
 *   down, same as any other content.
 * - At `lg` and up there's finally enough vertical room for the
 *   original design: `h-[100dvh]` (strict), centered text, and the
 *   card row pinned `absolute -bottom-16` past the section's own
 *   bottom edge so it overlaps into whatever section follows (see
 *   AboutBento's `pt-*`, which reserves clearance for exactly that
 *   overlap — mobile no longer has an overlap to clear, hence
 *   AboutBento's own `py-20 lg:py-32` split).
 *
 * The card row is a fixed 2x2 grid below `lg`, widening to a single
 * `grid-cols-4` row at `lg` — icon/text sizing on each card steps down
 * slightly below `lg` so the tighter 2x2 layout doesn't feel cramped.
 */
export default function Hero() {
  const { open: openBookingModal } = useModal();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between pt-32 pb-16 lg:h-[100dvh] lg:justify-center lg:pb-0">
      {/* Background: video, or a plain poster image if it ever errors. */}
      {videoFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BACKGROUND_POSTER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-50"
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={BACKGROUND_POSTER}
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover brightness-50"
        >
          <source src={BACKGROUND_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Heavy dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]"
      />

      {/* Center text */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <span className="block text-xs uppercase tracking-widest text-gray-400">
          Developed with experts, inspired by athletes...
        </span>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={headingContainer}
          className="mt-6 text-[11vw] font-extrabold uppercase leading-[0.9] tracking-tight md:text-8xl lg:text-9xl"
        >
          <motion.span variants={lineVariants} className="block">
            Train Smart.
          </motion.span>
          <motion.span variants={lineVariants} className="block">
            <span className="text-[#D4AF37]">Transform</span> Better.
          </motion.span>
        </motion.h1>

        <motion.div initial="hidden" animate="visible" variants={ctaVariants} className="mt-8">
          <MagneticButton
            strength={0.3}
            onClick={openBookingModal}
            className="!bg-white !text-black !text-xs !tracking-[0.15em] hover:!shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            BOOK YOUR INTRO SESSION
          </MagneticButton>
        </motion.div>
      </div>

      {/* Overlapping feature cards */}
      <div className="relative z-10 mt-12 w-full px-4 sm:px-8 lg:absolute lg:-bottom-16 lg:mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardsContainer}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-2xl border border-white/5 bg-[#111111] p-3 backdrop-blur-md transition-all duration-300 hover:border-brand-gold/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] sm:p-4 lg:p-6"
            >
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold lg:h-10 lg:w-10">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground lg:text-base">{card.title}</h3>
              <p className="mt-1 text-sm text-foreground/60">{card.subtext}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
