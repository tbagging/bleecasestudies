import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import SocialProof from "@/components/SocialProof";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ClientLogos />
      <CaseStudiesSection />
      <AboutSection />
      <SocialProof />
    </div>
  );
};

export default Index;
