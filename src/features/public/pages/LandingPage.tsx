import { AudienceCtas } from "../components/landing/AudienceCtas";
import { FeaturedWorkshopRanking } from "../components/landing/FeaturedWorkshopRanking";
import { HeroPlateSearch } from "../components/landing/HeroPlateSearch";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { LandingNav } from "../components/landing/LandingNav";

import "./LandingPage.css";

export function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <main>
        <HeroPlateSearch />
        <HowItWorksSection />
        <FeaturedWorkshopRanking />
        <AudienceCtas />
      </main>
      <LandingFooter />
    </div>
  );
}
