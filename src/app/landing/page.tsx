"use client"

import { ThreeScene, HeroSection, FeaturesSection, StatsSection, PricingSection, CTASection, Footer } from "@/components/landing"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Three.js Background */}
      <div className="fixed inset-0 z-0">
        <ThreeScene />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
