import { Button } from "@/components/ui/button";
import bleeLogoTagline from "@/assets/blee-logo-tagline.png";

const AboutSection = () => {
  const handleEmailCTA = () => {
    const subject = "Strategic Transformation Discussion";
    const body = "I'm interested in learning more about BLEE's approach to organizational transformation.";
    window.location.href = `mailto:hello@blee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <img 
          src={bleeLogoTagline} 
          alt="BLEE - beyond hackathons" 
          className="w-48 h-auto mx-auto mb-12"
        />
        
        <h2 className="text-4xl font-bold mb-8">Change from within the system</h2>
        
        <div className="space-y-6 text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          <p>
            We are not consultants. We are not facilitators. We embed inside organizations 
            to activate clarity, ownership, and momentum that drives aligned action.
          </p>
          
          <p>
            Our strategic approach transforms internal complexity into executable direction. 
            Through focused engagement, we help teams move from paralysis to progress, 
            typically within 24–48 hours.
          </p>
          
          <p>
            <strong className="text-foreground">Kickoff hackathons for hypergrowth companies</strong> represent 
            our signature intervention—intensive sessions that break through organizational 
            bottlenecks and create immediate momentum toward strategic objectives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-primary">Clarity</h3>
            <p className="text-muted-foreground">
              Structured communication that cuts through complexity and drives aligned understanding.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-primary">Engagement</h3>
            <p className="text-muted-foreground">
              Activating people within the system to own solutions and drive change forward.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-primary">Momentum</h3>
            <p className="text-muted-foreground">
              Creating urgency and direction that leads to immediate execution and results.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleEmailCTA}
          size="lg"
          className="text-lg px-8 py-4"
        >
          Let's talk
        </Button>
      </div>
    </section>
  );
};

export default AboutSection;