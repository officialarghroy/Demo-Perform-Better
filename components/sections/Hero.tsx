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
 * (ModalContext) once the headline lands, and a row of 4 cards pinned
 * `-bottom-16` past the hero's own bottom edge that slide up
 * sequentially once the CTA has appeared.
 *
 * Note: no `overflow-hidden` on the section — the whole point of the
 * overlap is for the bottom portion of the card row to render outside
 * the hero's own box, into the section that follows it in the page.
 * The fixed `-bottom-16` offset means the cards always protrude a
 * constant 64px below the hero regardless of how many rows they wrap
 * into at a given breakpoint — whatever section follows this one should
 * reserve a bit more than that (see AboutBento's `pt-*`) as clearance.
 *
 * The card grid itself is `grid-cols-4` at the `lg` breakpoint and up
 * (the exact spec), with a `grid-cols-2` fallback below it — 4 equal
 * columns with p-6 cards would be illegibly cramped on a phone.
 */
export default function Hero() {
  const { open: openBookingModal } = useModal();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center">
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
      <div className="relative z-10 px-4 text-center">
        <span className="block text-xs uppercase tracking-widest text-gray-400">
          Developed with experts, inspired by athletes...
        </span>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={headingContainer}
          className="mt-6 text-4xl font-extrabold uppercase leading-tight tracking-tight sm:text-6xl md:text-9xl"
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
      <div className="absolute -bottom-16 left-0 right-0 w-full px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardsContainer}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl border border-white/5 bg-[#111111] p-4 backdrop-blur-md transition-all duration-300 hover:border-brand-gold/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] lg:p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground">{card.title}</h3>
              <p className="mt-1 text-sm text-foreground/60">{card.subtext}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
