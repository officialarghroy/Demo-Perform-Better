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
 * higher contrast, slightly desaturated) and scales up a touch on
 * hover. Sizing/placement (col-span, row-span, aspect ratio) is left to
 * the caller via `className`, so this stays reusable across any grid
 * shape.
 */
export default function BentoCard({
  image,
  alt = "",
  title,
  className = "",
  rounded = "rounded-2xl",
  overlayClassName = "bg-gradient-to-t from-black/80 to-transparent",
}: BentoCardProps) {
  return (
    <div className={`group relative aspect-[4/3] overflow-hidden lg:aspect-auto ${rounded} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover brightness-75 contrast-125 grayscale-[20%] transition-transform duration-500 group-hover:scale-105"
      />
      <div aria-hidden="true" className={`absolute inset-0 ${overlayClassName}`} />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-bold text-white">{title}</h3>
      </div>
    </div>
  );
}
