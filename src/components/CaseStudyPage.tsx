import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Building, TrendingUp, Users, Target } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

interface CaseStudyPageProps {
  caseStudyId: string;
}

const CaseStudyPage = ({ caseStudyId }: CaseStudyPageProps) => {
  const { caseStudies } = useContent();
  const [email, setEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const caseStudy = caseStudies.find(cs => cs.id === caseStudyId);

  console.log('CaseStudyPage - caseStudyId:', caseStudyId);
  console.log('CaseStudyPage - caseStudies:', caseStudies);
  console.log('CaseStudyPage - found caseStudy:', caseStudy);
  console.log('CaseStudyPage - caseStudy.content:', caseStudy?.content);

  useEffect(() => {
    const unlockedEmail = localStorage.getItem("unlockedEmail");
    if (unlockedEmail) {
      setIsUnlocked(true);
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem("unlockedEmail", email);
    setIsUnlocked(true);
    setIsSubmitting(false);
  };

  if (!caseStudy) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <p className="text-muted-foreground">This case study could not be found.</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Unlock Full Case Study</span>
                </div>
                <CardTitle className="text-2xl mb-4">
                  Get the complete {caseStudy.company} story
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your email to access the full case study with detailed implementation insights and measurable results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Unlocking..." : "Unlock Case Study"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg"></div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-primary">{caseStudy.company}</span>
                  <span className="text-xs text-muted-foreground">{caseStudy.industry}</span>
                </div>
                <CardTitle className="text-xl mb-2">
                  {caseStudy.title}
                </CardTitle>
                <CardDescription>
                  {caseStudy.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!caseStudy.content) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Case Study Content Not Available</h1>
          <p className="text-muted-foreground">The detailed content for this case study has not been uploaded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium text-primary">{caseStudy.company}</span>
            <span className="text-sm text-muted-foreground">{caseStudy.industry}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{caseStudy.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {caseStudy.summary}
          </p>
          <div className="flex justify-center flex-wrap gap-2 mt-6">
            {caseStudy.tags.map((tag) => (
              <Badge key={tag} variant="secondary">#{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Client Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Client Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Industry</h4>
              <p className="text-muted-foreground">{caseStudy.industry}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company Size</h4>
              <p className="text-muted-foreground">{caseStudy.content.companySize || "Not specified"}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Project Timeline</h4>
              <p className="text-muted-foreground">{caseStudy.content.timeline || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Background */}
        <Card>
          <CardHeader>
            <CardTitle>Background</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {caseStudy.content.background}
            </p>
          </CardContent>
        </Card>

        {/* Challenge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              The Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              {caseStudy.content.challenge.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Our Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseStudy.content.process.map((phase, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">{phase.phase}</h4>
                  <p className="text-muted-foreground">{phase.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudy.content.results.map((result, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{result.metric}</div>
                  <div className="font-medium mb-1">{result.value}</div>
                  <div className="text-sm text-muted-foreground">{result.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to transform your organization?</h3>
          <Button 
            size="lg"
            onClick={() => window.location.href = "mailto:hello@blee.com?subject=Let's discuss transformation"}
          >
            Let's talk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPage;