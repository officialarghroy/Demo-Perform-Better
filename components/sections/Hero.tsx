"use client";

import { Baby, Flame, User, Zap } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { MagneticButton } from "@/components/ui";
import { useModal } from "@/context/ModalContext";

// Looping cinematic background video (public/hero-video.mp4), muted so
// autoplay is allowed by every browser. The still photo now only
// serves as the `poster` frame shown before the video has loaded.
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

// Two lines, each a list of words — "Transform" alone carries the gold
// accent. Kept as data (rather than one string) so each word can be
// animated as its own masked unit.
const LINE_1 = ["Train", "Smart."];
const LINE_2 = [
  { text: "Transform", gold: true },
  { text: "Better." },
];

// A slightly custom "expo out" curve — snappier off the start and a
// softer landing than the generic `easeOut`, used for both the word
// reveal and the card entrance so the whole hero reads as one motion
// language.
const EASE = [0.16, 1, 0.3, 1] as const;

const headingContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const wordVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: EASE } },
};

// Fades in right as the headline lands (words finish ≈1.14s in — see
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

interface AnimatedWordProps {
  children: string;
  className?: string;
}

/** A single word masked by an `overflow-hidden` box, revealed by its
 * inner span sliding up from below the mask. `pb-[0.2em]`/`-mb-[0.2em]`
 * give descenders (g, y) room inside the mask so they don't clip. */
function AnimatedWord({ children, className = "" }: AnimatedWordProps) {
  return (
    <span className="inline-block overflow-hidden pb-[0.2em] pr-[0.2em] -mb-[0.2em]">
      <motion.span variants={wordVariants} className={`inline-block ${className}`}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * High-end hero: full-viewport looping background video (dimmed via
 * `brightness-50` for a cinematic feel) under a heavy 3-stop dark
 * gradient, a staggered word-by-word headline reveal, a
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

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center">
      {/* Looping cinematic background video — brightness-50 keeps it
          deliberately dim/moody, on top of the gradient below. */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={BACKGROUND_POSTER}
        className="absolute inset-0 h-full w-full object-cover brightness-50"
      >
        <source src={BACKGROUND_VIDEO} type="video/mp4" />
      </video>

      {/* Heavy dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]"
      />

      {/* Center text */}
      <div className="relative z-10 px-4 text-center">
        <span className="block text-xs uppercase tracking-widest text-gray-400">
          Future of fitness with Perform Better
        </span>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={headingContainer}
          className="mt-6 text-4xl font-extrabold uppercase leading-tight tracking-tight sm:text-6xl md:text-9xl"
        >
          <span className="block">
            {LINE_1.map((word) => (
              <AnimatedWord key={word}>{word}</AnimatedWord>
            ))}
          </span>
          <span className="block">
            {LINE_2.map((word) => (
              <AnimatedWord key={word.text} className={word.gold ? "text-[#D4AF37]" : undefined}>
                {word.text}
              </AnimatedWord>
            ))}
          </span>
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
