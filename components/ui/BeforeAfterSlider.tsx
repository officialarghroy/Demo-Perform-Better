"use client";

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";

export interface BeforeAfterSliderProps {
  /** Image shown on the left / revealed side. */
  beforeSrc: string;
  /** Image shown on the right / base side. */
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Starting handle position, 0–100. Defaults to 50. */
  initialPosition?: number;
  /** Tailwind aspect-ratio class for the frame. Defaults to "aspect-[4/3]". */
  aspectClassName?: string;
  className?: string;
}

/**
 * A draggable before/after image comparison. Drag the handle (or click
 * anywhere on the frame) to reveal more of the "before" image.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  aspectClassName = "aspect-[4/3]",
  className = "",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(
    Math.min(100, Math.max(0, initialPosition))
  );
  const [isDragging, setIsDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, percent)));
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    updateFromClientX(event.clientX);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full ${aspectClassName} touch-none select-none overflow-hidden rounded-2xl border border-white/10 ${className}`}
    >
      {/* Base layer: after image, full frame */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* Clipped layer: before image, revealed up to `position`% */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={beforeAlt}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-brand-yellow"
        style={{ left: `${position}%` }}
      />

      {/* Drag handle — `after:inset-[-15px]` pads its touch target out to
          ~70x70px (well past the 44px minimum recommended tap-target
          size) without enlarging the visible 40x40 yellow circle. The
          expanded hit area only matters perceptually: pointer handlers
          live on the outer frame above, so a touch anywhere already
          drags the slider — this just makes the handle itself easier to
          land a thumb on. */}
      <motion.div
        className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-brand-yellow text-black shadow-lg after:absolute after:inset-[-15px] after:content-['']"
        style={{ left: `${position}%` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronsLeftRight className="h-5 w-5" />
      </motion.div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-foreground">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-foreground">
        {afterLabel}
      </span>
    </div>
  );
}
