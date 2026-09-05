"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type PricingToggleValue = "left" | "right";

export interface PricingToggleProps {
  /** Label for the left option. Defaults to "Gym Membership". */
  leftLabel?: string;
  /** Label for the right option. Defaults to "Gym + F50 Classes". */
  rightLabel?: string;
  /** Controlled selected value. Omit to let the component manage its own state. */
  value?: PricingToggleValue;
  /** Initial value when uncontrolled. Defaults to "left". */
  defaultValue?: PricingToggleValue;
  onChange?: (value: PricingToggleValue) => void;
  className?: string;
}

/**
 * A sleek, animated pill toggle between two pricing tiers. Works
 * controlled (pass `value` + `onChange`) or uncontrolled (`defaultValue`).
 */
export default function PricingToggle({
  leftLabel = "Gym Membership",
  rightLabel = "Gym + F50 Classes",
  value,
  defaultValue = "left",
  onChange,
  className = "",
}: PricingToggleProps) {
  const [internalValue, setInternalValue] =
    useState<PricingToggleValue>(defaultValue);
  const selected = value ?? internalValue;

  function select(next: PricingToggleValue) {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  }

  return (
    <div
      role="tablist"
      aria-label="Pricing plan"
      className={`relative inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 ${className}`}
    >
      <motion.div
        className="absolute inset-y-1 rounded-full bg-brand-yellow"
        animate={{ left: selected === "left" ? "0.25rem" : "50%" }}
        style={{ width: "calc(50% - 0.25rem)" }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      />

      <button
        type="button"
        role="tab"
        aria-selected={selected === "left"}
        onClick={() => select("left")}
        className={`relative z-10 min-w-[9rem] rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
          selected === "left" ? "text-black" : "text-foreground/70 hover:text-foreground"
        }`}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={selected === "right"}
        onClick={() => select("right")}
        className={`relative z-10 min-w-[9rem] rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
          selected === "right" ? "text-black" : "text-foreground/70 hover:text-foreground"
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
}
