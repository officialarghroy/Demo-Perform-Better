"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Dumbbell, LineChart } from "lucide-react";

const GRAY = "#6B7280";
const WHITE = "#F5F5F5";
const GOLD = "#D4AF37";
const DIM_BG = "rgba(255, 255, 255, 0.03)";
const ACTIVE_BG = "rgba(212, 175, 55, 0.15)";
const DIM_BORDER = "rgba(255, 255, 255, 0.1)";
const ACTIVE_BORDER = "rgba(212, 175, 55, 0.5)";

// Plateau keyframes: dim -> dim -> ACTIVE -> dim -> dim. Holding a flat
// "active" middle (rather than a single-instant peak) makes the effect
// last long enough to actually notice while scrolling normally.
const KEYFRAMES = [0, 0.35, 0.5, 0.65, 1];

const CONTENT = [
  {
    title: "True Fitness Experts",
    description: "12+ years of experience, USA Certified coaching on every floor.",
    icon: Award,
  },
  {
    title: "Beyond Standard Gyms",
    description: "Dedicated F50 group classes and biohacking recovery, not just machines.",
    icon: Dumbbell,
  },
  {
    title: "Built for Transformation",
    description: "Tracked results, real KPIs, and a community that keeps you accountable.",
    icon: LineChart,
  },
];

/**
 * Sticky-scroll reveal: the left column pins in place (desktop only —
 * see the `md:` gating note below) while three timeline blocks scroll
 * past on the right against a continuous `border-l` rule. Each block
 * tracks its own scroll progress across its *entire* time in the
 * viewport (`offset: ["start end", "end start"]`) and holds a bright
 * gray -> white/gold "active" plateau while it's roughly centered,
 * fading back to dim gray as it moves away — a wide, unmissable window
 * rather than a blink-and-you-miss-it instant at dead center.
 */
export default function StickyScroll() {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col px-8 py-32 md:flex-row">
      {/* Left column — sticky on desktop. `w-1/2`/`sticky` are gated
          behind `md:` — applied unconditionally they'd force a stacked
          mobile layout into half-width columns for no benefit, since
          sticky has nothing meaningful to pin against until the columns
          sit side by side. */}
      <div className="w-full md:sticky md:top-1/4 md:h-fit md:w-1/2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
          Real Results
        </span>
        <h2 className="mt-4 text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Why Perform Better?
        </h2>
      </div>

      {/* Right column — timeline list */}
      <div className="mt-16 flex w-full flex-col gap-32 border-l border-white/10 md:mt-0 md:w-1/2">
        {CONTENT.map((item) => (
          <Block key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

interface BlockProps {
  title: string;
  description: string;
  icon: typeof Award;
}

function Block({ title, description, icon: Icon }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // The block's whole transit through the viewport (bottom-in to
    // top-out), not just a narrow window around dead center — this is
    // what makes the "active" window last long enough to see.
    offset: ["start end", "end start"],
  });

  const textColor = useTransform(scrollYProgress, KEYFRAMES, [GRAY, GRAY, WHITE, GRAY, GRAY]);
  const textOpacity = useTransform(scrollYProgress, KEYFRAMES, [0.5, 0.5, 1, 0.5, 0.5]);
  const iconColor = useTransform(scrollYProgress, KEYFRAMES, [GRAY, GRAY, GOLD, GRAY, GRAY]);
  const iconBg = useTransform(scrollYProgress, KEYFRAMES, [DIM_BG, DIM_BG, ACTIVE_BG, DIM_BG, DIM_BG]);
  const iconBorder = useTransform(
    scrollYProgress,
    KEYFRAMES,
    [DIM_BORDER, DIM_BORDER, ACTIVE_BORDER, DIM_BORDER, DIM_BORDER]
  );
  const iconScale = useTransform(scrollYProgress, KEYFRAMES, [0.9, 0.9, 1.15, 0.9, 0.9]);
  const contentX = useTransform(scrollYProgress, KEYFRAMES, [0, 0, 12, 0, 0]);

  return (
    <div ref={ref} className="flex gap-6 pl-8">
      <motion.div
        style={{ color: iconColor, backgroundColor: iconBg, borderColor: iconBorder, scale: iconScale }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
      >
        <Icon className="h-5 w-5" />
      </motion.div>

      <motion.div style={{ x: contentX }}>
        <motion.h3 style={{ color: textColor }} className="text-2xl font-bold sm:text-3xl">
          {title}
        </motion.h3>
        <motion.p
          style={{ color: textColor, opacity: textOpacity }}
          className="mt-3 max-w-md text-base leading-relaxed sm:text-lg"
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
}
