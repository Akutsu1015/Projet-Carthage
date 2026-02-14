import { HeroSection } from "@/components/home/hero-section";
import { StorySection } from "@/components/home/story-section";
import { MissionsSection } from "@/components/home/missions-section";
import { ModulesSection } from "@/components/home/modules-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <MissionsSection />
      <ModulesSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
