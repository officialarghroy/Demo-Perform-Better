"use client";

import { useState } from "react";
import { Check, Gift } from "lucide-react";
import { PricingToggle, type PricingToggleValue } from "@/components/ui";
import { useModal } from "@/context/ModalContext";

interface PricingTier {
  label: string;
  price: number;
  featured?: boolean;
}

const PRICING: Record<PricingToggleValue, PricingTier[]> = {
  left: [
    { label: "1 Month", price: 15.4 },
    { label: "3 Months", price: 30.8, featured: true },
  ],
  right: [
    { label: "1 Month", price: 27.5 },
    { label: "3 Months", price: 73, featured: true },
  ],
};

const FEATURES: Record<PricingToggleValue, string[]> = {
  left: [
    "Full gym floor access",
    "Locker & shower facilities",
    "Free fitness assessment",
  ],
  right: [
    "Full gym floor access",
    "Unlimited F50 Group Classes",
    "Locker & shower facilities",
    "Free fitness assessment",
  ],
};

export default function PricingPage() {
  const [plan, setPlan] = useState<PricingToggleValue>("left");
  const { open: openBookingModal } = useModal();

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple, <span className="text-brand-gold">Transparent</span> Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/60">
          Choose the plan that fits your goals. All prices in Bahraini Dinar (BD).
        </p>
      </div>

      <div className="mb-12 flex justify-center">
        <PricingToggle
          leftLabel="Gym Only"
          rightLabel="Gym + F50"
          value={plan}
          onChange={setPlan}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {PRICING[plan].map((tier) => (
          <div
            key={tier.label}
            className={`relative rounded-2xl border p-8 ${
              tier.featured
                ? "border-brand-gold bg-brand-gold/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-black">
                Best Value
              </span>
            )}
            <h2 className="text-lg font-semibold text-foreground/80">
              {tier.label}
            </h2>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">
                BD {tier.price.toFixed(1)}
              </span>
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {FEATURES[plan].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground/70">
                  <Check className="h-4 w-4 shrink-0 text-brand-gold" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={openBookingModal}
              className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90 ${
                tier.featured
                  ? "bg-brand-gold text-black"
                  : "border border-white/20 text-foreground"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* Promo banner */}
      <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 text-center sm:flex-row sm:text-left">
        <Gift className="h-10 w-10 shrink-0 text-brand-gold" />
        <p className="font-semibold text-foreground">
          Refer a friend for 3 months F50 Group classes, get 1 month FREE!
        </p>
      </div>
    </div>
  );
}
