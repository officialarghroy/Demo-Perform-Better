"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

// Sample transformation highlights — replace with real member results.
const RESULTS = [
  "Fatima Yousif: Lost 31kg",
  "Isa Al Rabab: Lost 43kg",
  "Evangeline: Lost 47kg",
  "Dr. Pavithra: Lost 23kg",
];

/**
 * Infinite horizontal marquee, driven by framer-motion (an `animate`
 * loop with `repeat: Infinity`) rather than the CSS-keyframe
 * `components/ui/Marquee`. The content is rendered twice back-to-back
 * and the track translates by exactly -50%, so the loop point is
 * invisible.
 */
export default function TestimonialMarquee() {
  return (
    <section className="overflow-hidden border-y border-white/10 bg-white/[0.03] py-20">
      <h2 className="mb-12 px-4 text-center text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
        <span className="block">Real Members.</span>
        <span className="block text-brand-gold">Real Results.</span>
      </h2>

      <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex w-max gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {[...RESULTS, ...RESULTS].map((result, index) => (
            <div
              key={index}
              className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/5 bg-[#111111] px-8 py-4"
            >
              <Flame className="h-4 w-4 shrink-0 text-brand-gold" />
              <span className="font-semibold">{result}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
