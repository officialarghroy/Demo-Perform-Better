// Shared transformation-story data — used by both the home page's
// featured teaser (components/sections/FeaturedTransformations.tsx)
// and the full gallery (app/transformations/page.tsx), so the two stay
// in sync instead of drifting apart.
//
// Photos are generic gym-photography pairs standing in for real
// transformation photos — NOT actual photos of the members named
// below. Each pair is the same activity/equipment shown at two effort
// levels (a clear, intentional "moment"), rather than two random
// shots — but still deliberately action/equipment photography, not
// body-comparison shots, so it can't be mistaken for real
// "before/after" evidence of a specific person. Swap in real,
// consented member photos before this page goes live.

export interface TransformationStory {
  name: string;
  weightLost: number;
  duration?: string;
  trainers: string[];
  aspect: string;
  beforeSrc: string;
  afterSrc: string;
}

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

const RAW_STORIES: Omit<TransformationStory, "beforeSrc" | "afterSrc">[] = [
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

export const TRANSFORMATION_STORIES: TransformationStory[] = RAW_STORIES.map((story, index) => {
  const photos = PHOTO_PAIRS[index % PHOTO_PAIRS.length];
  return { ...story, beforeSrc: photos.before, afterSrc: photos.after };
});
