import { BeforeAfterSlider } from "@/components/ui";
import { TRANSFORMATION_STORIES } from "@/lib/transformation-stories";

export default function TransformationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Real Members. <span className="text-brand-gold">Real Results.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
          Drag each slider to see the transformation. Every member below trained
          with our coaches to get there.
        </p>
      </div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {TRANSFORMATION_STORIES.map((story) => (
          <div
            key={story.name}
            className="mb-6 break-inside-avoid rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <BeforeAfterSlider
              beforeSrc={story.beforeSrc}
              afterSrc={story.afterSrc}
              beforeAlt="Training session — placeholder photo"
              afterAlt="Training session — placeholder photo"
              aspectClassName={story.aspect}
            />
            <div className="mt-4">
              <h3 className="font-bold">{story.name}</h3>
              <p className="mt-1 font-semibold text-brand-gold">
                {story.weightLost}kg lost
                {story.duration ? ` in ${story.duration}` : ""}
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                Trained with {story.trainers.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
