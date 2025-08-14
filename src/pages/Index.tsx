import Hero from "@/components/Hero";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import SocialProof from "@/components/SocialProof";
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CaseStudiesSection />
      <AboutSection />
      <SocialProof />
    </div>
  );
};

export default Index;
