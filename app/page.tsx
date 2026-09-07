import Hero from "@/components/sections/Hero";
import AboutBento from "@/components/sections/AboutBento";
import Programs from "@/components/sections/Programs";
import StickyScroll from "@/components/sections/StickyScroll";
import FeaturedTransformations from "@/components/sections/FeaturedTransformations";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutBento />
      <Programs />
      <StickyScroll />
      <FeaturedTransformations />
      <TestimonialMarquee />
    </>
  );
}
