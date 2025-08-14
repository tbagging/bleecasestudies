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
    window.location.href = `mailto:hello@blee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <img src="/lovable-uploads/b3ee8b18-3ea9-48fa-a1db-fb95bb3c136a.png" alt="BLEE - beyond hackathons" className="w-48 h-auto mx-auto mb-12" />
        
        <h2 className="text-4xl font-title font-bold mb-8">{aboutContent.heading}</h2>
        
        <div className="space-y-6 text-lg font-body text-muted-foreground mb-12 max-w-3xl mx-auto">
          <p>
            {aboutContent.description}
          </p>
          
          <p>
            Our strategic approach transforms internal complexity into executable direction. 
            Through focused engagement, we help teams move from paralysis to progress, 
            typically within 24–48 hours.
          </p>
          
          
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center bg-slate-50 rounded-2xl px-[14px] mx-0 my-0 py-[20px]">
            <h3 className="text-xl font-title mb-4 text-primary font-extrabold">Clarity</h3>
            <p className="font-body text-muted-foreground">
              Structured communication that cuts through complexity and drives aligned understanding.
            </p>
          </div>
          <div className="text-center my-0 px-[15px] py-[20px] rounded-2xl bg-slate-50">
            <h3 className="text-xl font-title mb-4 text-primary font-extrabold">Engagement</h3>
            <p className="font-body text-muted-foreground">
              Activating people within the system to own solutions and drive change forward.
            </p>
          </div>
          <div className="text-center px-[14px] py-[20px] rounded-2xl bg-slate-50">
            <h3 className="text-xl font-title mb-4 text-primary font-extrabold">Momentum</h3>
            <p className="font-body text-muted-foreground">
              Creating urgency and direction that leads to immediate execution and results.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleEmailCTA} 
          variant="outline" 
          size="lg" 
          className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 text-lg px-8 py-4"
        >
          Start Your Transformation
        </Button>
      </div>
    </section>;
};
export default AboutSection;