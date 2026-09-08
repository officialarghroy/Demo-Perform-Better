import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary page background.
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Secondary "card" surface — sits a step lighter than the page
        // background to separate panels/cards in the dark luxury UI.
        card: "#171717",
        brand: {
          // Original bright accent from the first pass of the design.
          // Still used by earlier sections (Home, Pricing, etc.) —
          // brand-gold is the new accent for the luxury pivot.
          yellow: "#FFD700",
          gold: "#D4AF37",
        },
      },
      borderColor: {
        // Subtle hairline for glass/translucent panels over the dark
        // background. Usage: `border border-glass`.
        glass: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 30s) linear infinite",
      },
    },
  },
  // `hover:` utilities only apply on devices that actually support
  // hover (per a `@media (hover: hover)` check) — without this, tapping
  // a mobile phone can "stick" an element in its `:hover` state until
  // the user taps elsewhere, since touchscreens fire `:hover` on tap
  // with no corresponding mouse-leave to clear it.
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
export default config;
