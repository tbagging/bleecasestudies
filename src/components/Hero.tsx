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
    window.location.href = `mailto:tomer@bleehackathons.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return <section 
      className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground relative"
      style={{
        backgroundImage: `url('/lovable-uploads/3d8692c9-9d9f-4271-925a-8759a0a0daf2.png')`,
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
        <h1 className="text-4xl md:text-6xl font-title font-bold mb-8 leading-tight max-w-2xl mx-auto">
          {heroContent.title}
        </h1>
        <p className="text-xl md:text-2xl font-body mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
          {heroContent.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            onClick={handleEmailCTA} 
            variant="outline" 
            size="lg" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-primary transition-colors duration-300 text-lg px-8 py-4"
          >
            Start Your Transformation
          </Button>
          
        </div>
      </div>
    </section>;
};
export default Hero;