"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export interface StatCounterProps {
  /** The final value to count up to, e.g. 47. */
  value: number;
  /** Text shown before the number, e.g. "-". */
  prefix?: string;
  /** Text shown after the number, e.g. "kg". */
  suffix?: string;
  /** Decimal places to display. Defaults to 0. */
  decimals?: number;
  /** Animation duration in seconds. Defaults to 1.5. */
  duration?: number;
  className?: string;
}

/**
 * Animates a number counting up from 0 to `value` once it scrolls into
 * view. Handy for stats like weight lost, e.g. "-47kg".
 */
export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.5,
  className = "",
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
