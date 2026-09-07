"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface BentoCardProps {
  /** Background image source. */
  image: string;
  alt?: string;
  /** Label rendered bottom-left over the gradient. */
  title: string;
  /** Grid placement (e.g. `lg:col-span-2 lg:row-span-2`) plus any sizing. */
  className?: string;
  /**
   * Corner radius utility. Defaults to `rounded-2xl`. Exposed as a prop
   * (rather than left for the caller to override via `className`)
   * because Tailwind resolves same-property utilities by generation
   * order, not by their order in the class string — appending a
   * conflicting `rounded-*` via `className` would not reliably win.
   */
  rounded?: string;
  /** Overlay gradient utilities. Defaults to `bg-gradient-to-t from-black/80 to-transparent`. */
  overlayClassName?: string;
}

/**
 * A single image tile for a bento-style grid: full-bleed image, rounded
 * corners, and a bottom gradient so a title stays legible over any
 * photo. The image itself carries a moody, premium filter (dimmed,
 * higher contrast, slightly desaturated), drifts with a subtle scroll
 * parallax, and scales up a touch on hover. Sizing/placement (col-span,
 * row-span, aspect ratio) is left to the caller via `className`, so
 * this stays reusable across any grid shape.
 *
 * Parallax and hover-scale live on two different nested elements (the
 * `motion.div` wrapper gets the scroll-linked `y`, the `<img>` inside
 * keeps its own CSS `group-hover:scale-105`) rather than combining both
 * transforms on one node — framer-motion would happily compose them,
 * but keeping them separate avoids any inline-style-vs-CSS-class
 * transform conflict entirely. The wrapper is oversized (130% height,
 * inset -15%) so the ±10% vertical drift never reveals empty space at
 * the top/bottom edge of the card.
 *
 * Note: still a plain `<img>`, not next/image — external Unsplash URLs
 * are used as `image` throughout this project without remote-pattern
 * config; switching this one card to next/image would need that config
 * without changing anything about the parallax/hover effect itself.
 */
export default function BentoCard({
  image,
  alt = "",
  title,
  className = "",
  rounded = "rounded-2xl",
  overlayClassName = "bg-gradient-to-t from-black/80 to-transparent",
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div
      ref={ref}
      className={`group relative aspect-[4/3] overflow-hidden lg:aspect-auto ${rounded} ${className}`}
    >
      <motion.div style={{ y }} className="absolute -top-[15%] inset-x-0 h-[130%] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover brightness-75 contrast-125 grayscale-[20%] transition-transform duration-500 group-hover:scale-105"
        />
      </motion.div>
      <div aria-hidden="true" className={`absolute inset-0 ${overlayClassName}`} />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-bold text-white">{title}</h3>
      </div>
    </div>
  );
}
