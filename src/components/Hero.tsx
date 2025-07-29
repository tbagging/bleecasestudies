import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import bleeLogoMain from "@/assets/blee-logo-main.png";

interface HeroContent {
  title: string;
  subtitle: string;
}

const Hero = () => {
  const [content, setContent] = useState<HeroContent>({
    title: "Strategic transformation from within",
    subtitle: "We generate clarity, direction and ownership — within 24–48 hours"
  });

  const handleEmailCTA = () => {
    const subject = "Strategic Transformation Discussion";
    const body = "I'm interested in learning more about BLEE's strategic transformation approach for our organization.";
    window.location.href = `mailto:hello@blee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground">
      <div className="text-center max-w-4xl mx-auto px-6">
        <img 
          src={bleeLogoMain} 
          alt="BLEE" 
          className="w-64 h-auto mx-auto mb-12"
        />
        <h1 className="text-5xl md:text-7xl font-title font-bold mb-8 leading-tight">
          {content.title}
        </h1>
        <p className="text-xl md:text-2xl font-body mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
          {content.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleEmailCTA}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4"
          >
            Let's talk
          </Button>
          <Button 
            onClick={handleEmailCTA}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
          >
            Request full case studies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;