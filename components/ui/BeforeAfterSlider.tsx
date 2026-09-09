"use client";

import { useState } from "react";
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
 * A draggable before/after image comparison, driven by a native
 * `<input type="range">` rather than custom pointer-event math or a
 * Framer Motion `drag` gesture. The range input is stretched to cover
 * the whole frame and made invisible (`opacity-0`), but stays the
 * topmost, only interactive element (`z-30`) — every other layer below
 * is `pointer-events-none` and purely visual. Dragging is then just
 * "drag a slider", which the browser/OS already renders natively at a
 * perfect 60fps and already gets touch handling right, instead of
 * reimplementing that in JS (which is what was actually causing the
 * lag/jitter on mobile: React state updates racing raw
 * `pointermove`/`touchmove` events, competing with the browser's own
 * touch-to-scroll gesture detection on the same element).
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
  const [position, setPosition] = useState(
    Math.min(100, Math.max(0, initialPosition))
  );

  return (
    <div
      className={`relative w-full ${aspectClassName} select-none overflow-hidden rounded-2xl border border-white/10 ${className}`}
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

      {/* Handle — purely visual now; the invisible range input above it
          is what's actually draggable, so this never receives pointer
          events of its own (hence no hover/tap animation on it
          anymore — it couldn't have fired anyway with the input on
          top). */}
      <div
        className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow text-black shadow-lg"
        style={{ left: `${position}%` }}
      >
        <ChevronsLeftRight className="h-5 w-5" />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-foreground">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-medium text-foreground">
        {afterLabel}
      </span>

      {/* Invisible native range input — the only interactive layer.
          `touch-pan-y` (rather than `touch-none`) deliberately leaves
          vertical page scrolling alone; only this element's own
          horizontal drag gesture is claimed, so a vertical swipe that
          starts on the slider still scrolls the page instead of being
          swallowed. */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0 touch-pan-y"
      />
    </div>
  );
}
