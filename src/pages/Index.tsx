import Hero from "@/components/Hero";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import AboutSection from "@/components/AboutSection";
import SocialProof from "@/components/SocialProof";
import { Link } from "react-router-dom";
const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </header>
      <Hero />
      <CaseStudiesSection />
      <AboutSection />
      <SocialProof />
    </div>
  );
};

export default Index;
