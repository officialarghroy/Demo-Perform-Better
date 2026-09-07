"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface FadeInProps {
  children: ReactNode;
  /**
   * Delay before the animation starts, in seconds. Defaults to 0 — pass
   * increasing values (e.g. 0, 0.1, 0.2) across a group of siblings to
   * stagger their entrance.
   */
  delay?: number;
  className?: string;
  /** Passed through to the root element — handy as a scroll-anchor target. */
  id?: string;
}

/**
 * Scroll-triggered entrance wrapper: fades and slides its children up
 * into place the first time they scroll into view, then stays put
 * (`viewport: { once: true }` — it doesn't replay on scroll back up).
 * Wrap any block — a heading, a card, a whole grid — to give it the
 * same subtle reveal.
 */
export default function FadeIn({ children, delay = 0, className = "", id }: FadeInProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
