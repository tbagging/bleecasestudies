import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cleanTitle = (title: string) => {
  return title.replace(/\bcase study\b/gi, '').trim();
};

const CaseStudy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has already unlocked content
  useEffect(() => {
    const unlocked = localStorage.getItem('blee_unlocked') === 'true';
    if (unlocked) {
      setIsUnlocked(true);
    }
  }, []);

  // Sample case study data
  const caseStudyData = {
    "1": {
      title: "Revenue Growth Through Strategic Alignment",
      company: "TechCorp",
      industry: "Technology",
      summary: "Transformed internal processes to achieve 40% revenue increase within 6 months through strategic clarity and team alignment.",
      tags: ["revenue-growth", "alignment", "process-optimization"],
      clientSnapshot: "Mid-size technology company with 200+ employees experiencing rapid growth but struggling with internal coordination.",
      background: "TechCorp had grown from 50 to 200 employees in 18 months but lacked the organizational structure to support continued scaling.",
      challenge: "Departments were working in silos, leading to duplicated efforts, missed opportunities, and declining team morale despite strong market demand.",
      process: "BLEE embedded with the leadership team for a 48-hour strategic alignment session, mapping current state, identifying bottlenecks, and creating actionable frameworks for cross-department collaboration.",
      keyMetrics: [
        "40% increase in revenue within 6 months",
        "60% reduction in project delivery time",
        "85% improvement in employee satisfaction scores",
        "3x increase in cross-team collaboration initiatives"
      ]
    }
  };

  const caseStudy = caseStudyData[id as keyof typeof caseStudyData];

  if (!caseStudy) {
    return <Navigate to="/404" replace />;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('blee_unlocked', 'true');
    setIsUnlocked(true);
    setIsSubmitting(false);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to case studies
          </Button>

          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Unlock Full Case Study</CardTitle>
              <p className="text-muted-foreground">
                Enter your email to access the complete case study details
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Unlocking..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Unlock Case Study
                    </>
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4">
                One-time unlock gives you access to all case studies
              </p>
            </CardContent>
          </Card>

          {/* Preview content */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-primary">{caseStudy.company} • {caseStudy.industry}</span>
              <h1 className="text-4xl font-bold mt-2 mb-4">{cleanTitle(caseStudy.title)}</h1>
              <p className="text-xl text-muted-foreground">{caseStudy.summary}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {caseStudy.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
              <div className="blur-sm">
                <h3 className="text-xl font-semibold mb-4">Client Snapshot</h3>
                <p className="text-muted-foreground mb-6">{caseStudy.clientSnapshot}</p>
                <h3 className="text-xl font-semibold mb-4">Background</h3>
                <p className="text-muted-foreground">{caseStudy.background}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to case studies
        </Button>

        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary">{caseStudy.company} • {caseStudy.industry}</span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{cleanTitle(caseStudy.title)}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{caseStudy.summary}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {caseStudy.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Client Snapshot</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.clientSnapshot}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Background</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.background}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">The Challenge</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.challenge}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">The Process</h2>
            <p className="text-muted-foreground leading-relaxed">{caseStudy.process}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudy.keyMetrics.map((metric, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-6 text-center">
                    <p className="text-lg font-medium">{metric}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="text-center mt-16 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-4">Ready to create similar results?</h3>
          <Button 
            onClick={() => {
              const subject = "Case Study Discussion";
              const body = `I'm interested in discussing how BLEE can help our organization achieve results similar to the ${caseStudy.company} case study.`;
              window.location.href = `mailto:hello@blee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            size="lg"
            className="text-lg px-8 py-4"
          >
            Let's talk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;