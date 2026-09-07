"use client";

import {
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export interface MagneticButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  /** How strongly the button tracks the cursor (0–1). Defaults to 0.4. */
  strength?: number;
}

// Shared spring config for both the magnetic pull and the liquid
// highlight's fade in/out — light mass (0.1) keeps it feeling snappy
// and native rather than floaty.
const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

/**
 * A CTA button that subtly tracks the cursor while hovered (spring
 * physics), then eases back to rest on mouse leave. A soft radial
 * "liquid" highlight follows the cursor inside the button on hover,
 * clipped to its own rounded shape. Styled with the brand-yellow
 * accent and bold, dark text.
 */
export default function MagneticButton({
  children,
  strength = 0.4,
  className = "",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  // Cursor position as a percentage of the button's own box, driving the
  // radial-gradient's center via useMotionTemplate — updates without a
  // React re-render on every mouse move. highlightOpacity is a plain
  // motion value driven by explicit .set() calls (not React state fed
  // into useSpring) — the same proven pattern as x/y above, rather than
  // relying on useSpring to react to a plain number recomputed on
  // render, which it doesn't reliably do.
  const highlightX = useMotionValue(50);
  const highlightY = useMotionValue(50);
  const highlightOpacityRaw = useMotionValue(0);
  const highlightOpacity = useSpring(highlightOpacityRaw, SPRING);
  const background = useMotionTemplate`radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255,255,255,0.35), transparent 60%)`;

  function handleMouseMove(event: ReactMouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);

    highlightX.set(((event.clientX - rect.left) / rect.width) * 100);
    highlightY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseEnter() {
    highlightOpacityRaw.set(1);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    highlightOpacityRaw.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-yellow px-6 py-3 text-sm font-bold text-black transition-shadow hover:shadow-[0_0_25px_rgba(255,215,0,0.35)] ${className}`}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        style={{ background, opacity: highlightOpacity }}
        className="pointer-events-none absolute inset-0"
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
