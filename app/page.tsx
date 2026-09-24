import Hero from "@/components/home/Hero";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import ShopSection from "@/components/home/ShopSection";
import ProcessSection from "@/components/home/ProcessSection";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import MaterialsShowcase from "@/components/home/MaterialsShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import OrderTrackingTeaser from "@/components/home/OrderTrackingTeaser";
import TrustSection from "@/components/home/TrustSection";
import FinalCta from "@/components/home/FinalCta";
import { findHeroVideo } from "@/lib/media";

export default function Home() {
  const heroVideoSrc = findHeroVideo();

  return (
    <>
      <Hero />
      <TrendingCarousel />
      <CategoryDiscovery />
      <ShopSection />
      <ProcessSection videoSrc={heroVideoSrc} />
      <FeaturedCollection />
      <FeaturedProduct />
      <MaterialsShowcase />
      <HowItWorks />
      <OrderTrackingTeaser />
      <TrustSection />
      <FinalCta />
    </>
  );
}
