import SiteHeader from "@/components/landing/site-header";
import HeroCarousel from "@/components/landing/hero-carousel";
import EthosSection from "@/components/landing/ethos-section";
import DealsSection from "@/components/landing/deals-section";
import NewLaunchesSection from "@/components/landing/new-launches-section";
import StatsSection from "@/components/landing/stats-section";
import FaqSection from "@/components/landing/faq-section";
import NewsletterSection from "@/components/landing/newsletter-section";
import SiteFooter from "@/components/landing/site-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCarousel />
        <EthosSection />
        <DealsSection />
        <NewLaunchesSection />
        <StatsSection />
        <FaqSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  );
}
