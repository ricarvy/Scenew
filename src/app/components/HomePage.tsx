import { useEffect } from "react";
import { useLocation } from "react-router";
import { HeroSection } from "./HeroSection";
import { HowItWorks } from "./HowItWorks";
import { ShowcaseGallery } from "./ShowcaseGallery";
import { FeaturesSection } from "./FeaturesSection";
import { GradientDivider } from "./WarmGlow";



export function HomePage() {
  const location = useLocation();

  // Handle hash-based scroll when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <main>

      <HeroSection />

      <GradientDivider />

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <GradientDivider flip />

      <div id="showcase">
        <ShowcaseGallery />
      </div>

      <GradientDivider />

      <div id="features">
        <FeaturesSection />
      </div>

      <GradientDivider flip />
    </main>
  );
}