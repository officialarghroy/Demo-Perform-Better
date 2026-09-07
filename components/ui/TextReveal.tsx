"use client";

import { motion, type Variants } from "framer-motion";

type HeadingTag = "h1" | "h2" | "h3" | "p" | "span";

const TAG_TO_MOTION = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

export interface TextRevealProps {
  /** Text to reveal — split on spaces into individual words. */
  text: string;
  /** Wrapping element/heading level. Defaults to "span". */
  as?: HeadingTag;
  className?: string;
  /** Delay before the stagger starts, in seconds. */
  delay?: number;
  /**
   * Exact words (case-sensitive, punctuation included) to render with
   * `highlightClassName` instead of the surrounding text's own color —
   * e.g. highlightWords={["Program"]} to gold-accent one word within
   * an otherwise plain heading.
   */
  highlightWords?: string[];
  highlightClassName?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const word: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

/**
 * Cinematic masked text reveal: each word sits inside an
 * `overflow-hidden` mask and slides up from below it, staggered across
 * the whole phrase. Scroll-triggered (`whileInView`, `once: true`) —
 * fine for the below-the-fold section headings this is meant for
 * (AboutBento, Programs), where the page has already hydrated by the
 * time a visitor scrolls this far. This is deliberately NOT used for
 * Hero's headline: that content is above the fold and needs to be
 * visible immediately, and gating an above-the-fold heading's
 * visibility entirely on JS/animation timing has a real failure mode —
 * see the comment in components/sections/Hero.tsx.
 */
export default function TextReveal({
  text,
  as = "span",
  className = "",
  delay = 0,
  highlightWords = [],
  highlightClassName = "text-brand-gold",
}: TextRevealProps) {
  const words = text.split(" ");
  const MotionTag = TAG_TO_MOTION[as];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {words.map((w, index) => (
        <span key={index}>
          <span className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-bottom">
            <motion.span
              variants={word}
              className={`inline-block ${highlightWords.includes(w) ? highlightClassName : ""}`}
            >
              {w}
            </motion.span>
          </span>
          {/* A real space character, not CSS padding — so selecting/
              copying the heading (or a screen reader reading it) gets
              actual word breaks, not "ThisIsOneRunTogetherWord". */}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionTag>
  );
}
