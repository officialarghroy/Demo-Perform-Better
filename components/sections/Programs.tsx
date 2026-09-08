"use client";

import { Music2, Shield, Swords, Tent, Zap } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { FadeIn, TextReveal } from "@/components/ui";

// The parent card and its icon share the "rest"/"hover" variant names —
// the icon has no `initial`/`whileHover` of its own, so it inherits
// whichever of the two is currently active on the card via Framer
// Motion's variant propagation.
const cardVariants: Variants = {
  rest: { y: 0, backgroundColor: "#0f0f0f" },
  hover: { y: -4, backgroundColor: "#1a1a1a" },
};

const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 15, scale: 1.1 },
};

// Placeholder copy — swap for real class descriptions when available.
const ADULT_CLASSES = [
  {
    title: "F50 Functional Training",
    icon: Zap,
    blurb:
      "High-intensity functional circuits built to torch fat and build real-world strength.",
  },
  {
    title: "Kick Boxing",
    icon: Swords,
    blurb: "Strike, sweat, and build fight-ready conditioning in every session.",
  },
  {
    title: "Bollywood Dance",
    icon: Music2,
    blurb:
      "High-energy dance cardio set to Bollywood beats — burn calories while having fun.",
  },
];

const KIDS_CLASSES = [
  {
    title: "Boot Camp",
    icon: Tent,
    blurb: "Fun, structured conditioning drills that build discipline and fitness early.",
  },
  {
    title: "Kick Boxing",
    icon: Swords,
    blurb: "Confidence-building striking fundamentals in a safe, coached environment.",
  },
  {
    title: "Karate",
    icon: Shield,
    blurb: "Traditional karate technique, discipline, and focus for young athletes.",
  },
];

export default function Programs() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-16 lg:py-32">
      <TextReveal
        as="h2"
        text="Find Your Program"
        highlightWords={["Program"]}
        className="text-center text-4xl font-extrabold uppercase tracking-tight sm:text-5xl"
      />

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <FadeIn delay={0.1}>
          <ProgramGroup title="Adult Classes" classes={ADULT_CLASSES} />
        </FadeIn>
        <FadeIn delay={0.25}>
          <ProgramGroup title="Kids & Youth Classes" classes={KIDS_CLASSES} />
        </FadeIn>
      </div>
    </section>
  );
}

interface ProgramGroupProps {
  title: string;
  classes: { title: string; icon: typeof Zap; blurb: string }[];
}

function ProgramGroup({ title, classes }: ProgramGroupProps) {
  return (
    <div>
      <h3 className="mb-6 text-xl font-bold">{title}</h3>
      <div className="flex flex-col gap-4">
        {classes.map((item) => (
          <motion.div
            key={item.title}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            variants={cardVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-start gap-4 rounded-2xl border border-white/5 p-6 transition-colors hover:border-[#D4AF37]/50"
          >
            <motion.div
              variants={iconVariants}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold"
            >
              <item.icon className="h-5 w-5" />
            </motion.div>
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="mt-1 text-sm text-gray-400">{item.blurb}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
