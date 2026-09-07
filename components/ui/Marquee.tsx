import type { CSSProperties, ReactNode } from "react";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Defaults to 30. */
  durationSeconds?: number;
  /** Scroll right-to-left instead of left-to-right. */
  reverse?: boolean;
  /** Pause the scroll while hovered. Defaults to true. */
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * A seamless, infinitely-looping horizontal marquee. Renders `children`
 * twice back-to-back and animates the track by exactly 50%, so the loop
 * point is invisible. Pure CSS — no JS animation loop.
 */
export default function Marquee({
  children,
  durationSeconds = 30,
  reverse = false,
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  return (
    <div
      className={`group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <div
        className={`flex w-max animate-marquee gap-6 ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ "--marquee-duration": `${durationSeconds}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-6">{children}</div>
        <div className="flex shrink-0 items-center gap-6" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
