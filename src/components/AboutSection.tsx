import { Button } from "@/components/ui/button";
import bleeLogoTagline from "@/assets/blee-logo-tagline.png";
import { useContent } from "@/contexts/ContentContext";
const AboutSection = () => {
  const {
    aboutContent
  } = useContent();
  const handleEmailCTA = () => {
    const subject = "Strategic Transformation Discussion";
    const body = "I'm interested in learning more about BLEE's approach to organizational transformation.";
    window.location.href = `mailto:tomer@bleehackathons.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return <section 
      className="py-20 bg-background relative"
      style={{
        backgroundImage: `url('/lovable-uploads/e1757da9-604a-414d-8251-255529943135.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/90"></div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <img src="/lovable-uploads/b3ee8b18-3ea9-48fa-a1db-fb95bb3c136a.png" alt="BLEE - beyond hackathons" className="w-48 h-auto mx-auto mb-12" />
        
        <h2 className="text-4xl font-title font-bold mb-8">{aboutContent.heading}</h2>
        
        <div className="space-y-6 text-xl font-body text-muted-foreground mb-12 max-w-3xl mx-auto">
          <p>
            {aboutContent.description}
          </p>
          
          <p>
            {aboutContent.secondaryDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center bg-slate-50 rounded-2xl px-[14px] mx-0 my-0 py-[20px]">
            <h3 className="text-xl font-title mb-4 text-primary font-extrabold">{aboutContent.clarityTitle}</h3>
            <p className="font-body text-muted-foreground text-lg">
              {aboutContent.clarityDescription}
            </p>
          </div>
          <div className="text-center my-0 px-[15px] py-[20px] rounded-2xl bg-slate-50">
            <h3 className="text-xl font-title mb-4 text-primary font-extrabold">{aboutContent.engagementTitle}</h3>
            <p className="font-body text-muted-foreground text-lg">
              {aboutContent.engagementDescription}
            </p>
          </div>
          <div className="text-center px-[14px] py-[20px] rounded-2xl bg-slate-50">
            <h3 className="text-xl font-title mb-4 text-primary font-extrabold">{aboutContent.momentumTitle}</h3>
            <p className="font-body text-muted-foreground text-lg">
              {aboutContent.momentumDescription}
            </p>
          </div>
        </div>

        <Button 
          onClick={handleEmailCTA} 
          variant="outline" 
          size="lg" 
          className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 text-xl px-8 py-4"
        >
          {aboutContent.buttonText}
        </Button>
      </div>
    </section>;
};
export default AboutSection;