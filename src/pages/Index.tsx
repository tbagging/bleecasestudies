import bleeLogoMain from "@/assets/blee-logo-main.png";
import bleeLogoTagline from "@/assets/blee-logo-tagline.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground">
        <div className="text-center max-w-4xl mx-auto px-6">
          <img 
            src={bleeLogoMain} 
            alt="BLEE" 
            className="w-64 h-auto mx-auto mb-8"
          />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Strategic transformation from within
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            We generate clarity, direction and ownership — within 24–48 hours
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <img 
            src={bleeLogoTagline} 
            alt="BLEE - beyond hackathons" 
            className="w-48 h-auto mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold mb-6">Change from within the system</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are not consultants. We are not facilitators. We embed inside organizations 
            to activate clarity, ownership, and momentum that drives aligned action.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
