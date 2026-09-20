import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedDesigns from "@/components/home/FeaturedDesigns";
import MaterialsShowcase from "@/components/home/MaterialsShowcase";
import TrustSection from "@/components/home/TrustSection";
import FinalCta from "@/components/home/FinalCta";
import { findHeroVideo } from "@/lib/media";

export default function Home() {
  const heroVideoSrc = findHeroVideo();

  return (
    <>
      <Hero videoSrc={heroVideoSrc} />
      <HowItWorks />
      <FeaturedDesigns />
      <MaterialsShowcase />
      <TrustSection />
      <FinalCta />
    </>
  );
}
