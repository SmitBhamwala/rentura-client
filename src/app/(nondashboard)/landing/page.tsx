"use client";

import CallToActionSection from "./CallToActionSection";
import DiscoverSection from "./DiscoverSection";
import FeaturesSection from "./FeaturesSection";
import FooterSection from "./FooterSection";
import HeroSection from "./HeroSection";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
}
