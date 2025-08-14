import Hero from "@/components/Hero";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import SocialProof from "@/components/SocialProof";
import ClientLogos from "@/components/ClientLogos";
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ClientLogos />
      <AboutSection />
      <CaseStudiesSection />
      <SocialProof />
    </div>
  );
};

export default Index;
