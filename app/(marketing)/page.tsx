import FeaturesSection from "@/components/sections/feature-section";
import HeroLanding from "@/components/sections/hero-landing";
import PartnersSection from "@/components/sections/partner-section";
import PreviewLanding from "@/components/sections/preview-landing";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <FeaturesSection />
      <PartnersSection />
      {/* <PreviewLanding /> */}
    </>
  );
}
