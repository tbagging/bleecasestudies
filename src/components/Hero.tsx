import { Button } from "@/components/ui/button";
import bleeLogoMain from "@/assets/blee-logo-main.png";
import { useContent } from "@/contexts/ContentContext";
const Hero = () => {
  const {
    heroContent,
    ctaContent
  } = useContent();
  const handleEmailCTA = () => {
    const subject = "Strategic Transformation Discussion";
    const body = "I'm interested in learning more about BLEE's strategic transformation approach for our organization.";
    window.location.href = `mailto:hello@blee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return <section className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground">
      <div className="text-center max-w-4xl mx-auto px-6">
        <img src="/lovable-uploads/31c0e9ec-b93a-4065-9536-a710b7df5b8d.png" alt="BLEE" className="w-96 h-auto mx-auto mb-12" />
        <h1 className="text-5xl md:text-7xl font-title font-bold mb-8 leading-tight">
          {heroContent.title}
        </h1>
        <p className="text-xl md:text-2xl font-body mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
          {heroContent.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleEmailCTA} size="lg" variant="secondary" className="text-lg px-8 py-4">
            {ctaContent.primary}
          </Button>
          
        </div>
      </div>
    </section>;
};
export default Hero;