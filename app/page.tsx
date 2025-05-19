import HeroSection from "@/components/hero-section";
import Features from "@/components/features-1";
import ContentSection from "@/components/content-1";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import ContentSection2 from "@/components/content-2";
import FAQSection from "@/components/faq";
import { PopularCryptos } from "@/components/popular-cryptos";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularCryptos />
      <ContentSection2 />
      <Features />
      <ContentSection />
      <CallToAction />
      <FAQSection />
      <FooterSection />
    </>
  );
}
