import { BentoCard, FadeIn } from "@/components/ui";

// Placeholder stock photography — swap for real Perform Better member/facility photos.
const WEIGHT_LOSS_IMAGE =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop";
const STRENGTH_IMAGE =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop";
const COMBAT_IMAGE =
  "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop";

// This spec's own `py-32` (128px) top padding comfortably clears Hero's
// fixed 64px `-bottom-16` card overlap when this section directly
// follows <Hero /> (see components/sections/Hero.tsx) — no extra
// clearance hack needed here.
export default function AboutBento() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-32">
      {/* Split text layout */}
      <div className="mb-16 flex flex-col gap-16 md:flex-row">
        <FadeIn className="md:w-1/3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            About Us
          </span>
          <h2 className="mt-4 text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            This is <span className="text-[#D4AF37]">Perform Better</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15} className="md:w-2/3">
          <p className="text-lg leading-relaxed text-gray-400">
            Perform Better was developed hand-in-hand with certified strength
            coaches, physiotherapists, and nutrition experts — then shaped by
            the discipline of the athletes who trained here first. Every
            program on our floor blends evidence-based methodology with
            real-world results, built by people who&apos;ve done it
            themselves.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            Whether you&apos;re chasing your first pull-up or your fiftieth
            kilogram lost, you&apos;re following a system designed around
            what actually works.
          </p>
        </FadeIn>
      </div>

      {/* Bento image grid — each tile fades in with an increasing delay
          for a cascading reveal. Grid placement (col-span / flex-1)
          moves onto the FadeIn wrapper, since it's now the actual grid
          item; BentoCard gets `h-full` so it fills that wrapper. */}
      <div className="grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-3">
        <FadeIn className="md:col-span-2">
          <BentoCard
            image={WEIGHT_LOSS_IMAGE}
            title="Weight Loss Journey"
            className="h-full"
            rounded="rounded-3xl"
            overlayClassName="bg-gradient-to-t from-black/90 via-transparent"
          />
        </FadeIn>

        <div className="flex flex-col gap-6">
          <FadeIn delay={0.1} className="flex-1">
            <BentoCard
              image={STRENGTH_IMAGE}
              title="Strength Building"
              className="h-full"
              rounded="rounded-3xl"
              overlayClassName="bg-gradient-to-t from-black/90 via-transparent"
            />
          </FadeIn>
          <FadeIn delay={0.2} className="flex-1">
            <BentoCard
              image={COMBAT_IMAGE}
              title="Combat Conditioning"
              className="h-full"
              rounded="rounded-3xl"
              overlayClassName="bg-gradient-to-t from-black/90 via-transparent"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
