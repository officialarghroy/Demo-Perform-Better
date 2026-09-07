import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BeforeAfterSlider, FadeIn } from "@/components/ui";
import { TRANSFORMATION_STORIES } from "@/lib/transformation-stories";

// A short teaser of real transformation cards on the home page itself
// (not just a link to /transformations) — same shared data/photos as
// the full gallery, so the two never drift apart.
const FEATURED = TRANSFORMATION_STORIES.slice(0, 3);

export default function FeaturedTransformations() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-32">
      <FadeIn className="text-center">
        <h2 className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Real <span className="text-brand-gold">Transformations</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-400">
          Drag each slider to see the transformation. Every member trained
          with our coaches to get there.
        </p>
      </FadeIn>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {FEATURED.map((story, index) => (
          <FadeIn key={story.name} delay={index * 0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <BeforeAfterSlider
                beforeSrc={story.beforeSrc}
                afterSrc={story.afterSrc}
                beforeAlt="Training session — placeholder photo"
                afterAlt="Training session — placeholder photo"
                aspectClassName="aspect-[4/5]"
              />
              <div className="mt-4">
                <h3 className="font-bold">{story.name}</h3>
                <p className="mt-1 font-semibold text-brand-gold">
                  {story.weightLost}kg lost
                  {story.duration ? ` in ${story.duration}` : ""}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Trained with {story.trainers.join(", ")}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3} className="mt-10 text-center">
        <Link
          href="/transformations"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold underline-offset-4 hover:underline"
        >
          See All Transformations
          <ArrowRight className="h-4 w-4" />
        </Link>
      </FadeIn>
    </section>
  );
}
