import Hero from "@/components/Hero";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import SectionTransition from "@/components/SectionTransition";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SectionTransition />
      <AboutSection />
      <CaseStudiesSection />
      <Footer />
    </div>
  );
};

export default Index;
