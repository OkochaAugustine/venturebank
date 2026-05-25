"use client";

import { HomeHero } from "./HomeHero";
import { TrustStats } from "./TrustStats";
import { HomeExperience } from "./HomeExperience";
import { RatesSection } from "./RatesSection";
import { BankingShowcase } from "@/components/showcase/BankingShowcase";
import { services } from "@/lib/mock/homeData";
import { PromoSection } from "./PromoSection";
import { AboutSection } from "./AboutSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { ContactSection } from "./ContactSection";

export function HomePage() {
  return (
    <main className="home-page">
      <HomeHero />
      <TrustStats />
      <HomeExperience />
      <RatesSection />
      <BankingShowcase
        features={services}
        title="How Can We Help You Today?"
        subtitle="Our Services"
      />
      <PromoSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
