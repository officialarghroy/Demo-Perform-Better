"use client";

import {
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

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

/**
 * A CTA button that subtly tracks the cursor while hovered, then springs
 * back to rest on mouse leave. Styled with the brand-yellow accent and
 * bold, dark text.
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
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.2 });

  function handleMouseMove(event: ReactMouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-sm font-bold text-black transition-shadow hover:shadow-[0_0_25px_rgba(255,215,0,0.35)] ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
