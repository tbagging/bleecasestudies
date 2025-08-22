import Hero from "@/components/Hero";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <AboutSection />
      <CaseStudiesSection />
      <Footer />
    </div>
  );
};

export default Index;
