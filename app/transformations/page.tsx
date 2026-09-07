import { BeforeAfterSlider } from "@/components/ui";

// Generic gym-photography pairs standing in for real transformation
// photos — NOT actual photos of the members named below. Each pair is
// the same activity/equipment shown at two effort levels (a clear,
// intentional "moment"), rather than two random shots — but still
// deliberately action/equipment photography, not body-comparison shots,
// so it can't be mistaken for real "before/after" evidence of a
// specific person. Swap in real, consented member photos before this
// page goes live.
const PHOTO_PAIRS = [
  {
    // Dumbbell training: group warm-up -> focused heavy-dumbbell grip.
    before:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
  },
  {
    // Machine & rack strength: seated cable work -> heavy squat-rack lift.
    before:
      "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=1200&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    // Mobility to strength: mat stretch/warm-up -> leg-press machine effort.
    before:
      "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=1200&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=1200&auto=format&fit=crop",
  },
];

// Sample transformation stories — swap in real member photos and stats.
const STORIES = [
  {
    name: "Dr. Pavithra",
    weightLost: 23,
    trainers: ["Rajan", "Gimson", "Kathri", "Mathan", "Antony"],
    aspect: "aspect-[3/4]",
  },
  {
    name: "Isa Al Rabab",
    weightLost: 43,
    duration: "7 Months",
    trainers: ["Rajan", "Gimson"],
    aspect: "aspect-square",
  },
  {
    name: "Evangeline",
    weightLost: 47,
    duration: "12 Months",
    trainers: ["Mathan", "Antony"],
    aspect: "aspect-[4/5]",
  },
  {
    name: "Rahul Menon",
    weightLost: 18,
    duration: "6 Months",
    trainers: ["Kathri"],
    aspect: "aspect-[3/4]",
  },
  {
    name: "Fatima Yousif",
    weightLost: 31,
    duration: "10 Months",
    trainers: ["Gimson", "Antony"],
    aspect: "aspect-square",
  },
  {
    name: "James Carter",
    weightLost: 15,
    duration: "4 Months",
    trainers: ["Rajan", "Mathan"],
    aspect: "aspect-[4/5]",
  },
];

export default function TransformationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
        {STORIES.map((story, index) => {
          const photos = PHOTO_PAIRS[index % PHOTO_PAIRS.length];
          return (
            <div
              key={story.name}
              className="mb-6 break-inside-avoid rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <BeforeAfterSlider
                beforeSrc={photos.before}
                afterSrc={photos.after}
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
          );
        })}
      </div>
    </div>
  );
}
