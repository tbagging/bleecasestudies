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
  return <section 
      className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground relative"
      style={{
        backgroundImage: `url('/lovable-uploads/44cf9821-f49f-4fb3-852a-063bd79faf1e.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-primary/70"></div>
      <div className="text-center max-w-4xl mx-auto px-6 relative z-10">
        <img 
          src="/lovable-uploads/e05b80ef-55e5-45e6-85b7-ec1d92c3c898.png" 
          alt="BLEE Logo" 
          className="w-48 h-auto mx-auto mb-8"
        />
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