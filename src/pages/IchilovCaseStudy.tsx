import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Building, TrendingUp, Users, Target, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IchilovCaseStudy = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Unlock Full Case Study</span>
                  </div>
                  <CardTitle className="text-2xl mb-4">
                    Get the complete Ichilov hackathon story
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter your email to access the full case study with detailed innovation insights and collaboration outcomes.
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
                    <span className="text-sm font-medium text-primary">Ichilov Hospital</span>
                    <span className="text-xs text-muted-foreground">Healthcare</span>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    Ichilov Internal Hackathon
                  </CardTitle>
                  <CardDescription>
                    The hackathon aimed to surface commercial-grade ideas, build in-house entrepreneurial momentum, and forge at least one concrete industry collaboration.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">#innovation</Badge>
                    <Badge variant="secondary">#collaboration</Badge>
                    <Badge variant="secondary">#entrepreneurship</Badge>
                    <Badge variant="secondary">#healthcare</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Building className="h-6 w-6 text-primary" />
              <span className="text-lg font-medium text-primary">Ichilov Hospital</span>
              <span className="text-sm text-muted-foreground">Healthcare</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Ichilov Internal Hackathon</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The hackathon aimed to surface commercial-grade ideas, build in-house entrepreneurial momentum, and forge at least one concrete industry collaboration.
            </p>
            <div className="flex justify-center flex-wrap gap-2 mt-6">
              <Badge variant="secondary">#innovation</Badge>
              <Badge variant="secondary">#collaboration</Badge>
              <Badge variant="secondary">#entrepreneurship</Badge>
              <Badge variant="secondary">#healthcare</Badge>
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
                <p className="text-muted-foreground">Healthcare & Medical</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Organization Size</h4>
                <p className="text-muted-foreground">4,000+ employees</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Event Duration</h4>
                <p className="text-muted-foreground">3-day hackathon</p>
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
                Ichilov Hospital, one of Israel's leading medical centers, recognized the need to foster innovation 
                and entrepreneurial thinking within their organization. They wanted to harness the collective 
                expertise of their medical staff to develop commercial-grade healthcare solutions.
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
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Limited entrepreneurial culture within traditional healthcare setting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Need to translate medical expertise into commercial opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Establishing sustainable industry partnerships</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Our Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Pre-Event: Strategic Planning</h4>
                  <p className="text-muted-foreground">Designed hackathon format focused on commercial viability and industry relevance.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Day 1-3: Innovation Acceleration</h4>
                  <p className="text-muted-foreground">Facilitated intensive ideation, prototyping, and business model development sessions.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Post-Event: Momentum Building</h4>
                  <p className="text-muted-foreground">Established follow-up processes to maintain entrepreneurial energy and develop winning concepts.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Key Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15</div>
                  <div className="text-sm text-muted-foreground">Commercial-Grade Ideas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <div className="text-sm text-muted-foreground">Industry Partnerships</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">120+</div>
                  <div className="text-sm text-muted-foreground">Staff Participants</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to spark innovation in your organization?</h3>
            <Button 
              size="lg"
              onClick={() => window.location.href = "mailto:hello@blee.com?subject=Let's discuss innovation"}
            >
              Let's talk
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IchilovCaseStudy;