import Hero from "@/components/Hero";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <AboutSection />
      <CaseStudiesSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
