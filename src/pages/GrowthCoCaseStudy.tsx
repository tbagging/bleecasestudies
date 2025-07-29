import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Building, TrendingUp, Users, Target, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GrowthCoCaseStudy = () => {
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
                    Get the complete GrowthCo expansion story
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter your email to access the full case study with detailed market entry strategies and organizational insights.
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
                    <span className="text-sm font-medium text-primary">GrowthCo</span>
                    <span className="text-xs text-muted-foreground">SaaS</span>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    Market Expansion Strategy Implementation
                  </CardTitle>
                  <CardDescription>
                    Enabled rapid market entry into 3 new regions through organizational restructuring and strategic focus.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">#market-expansion</Badge>
                    <Badge variant="secondary">#strategy</Badge>
                    <Badge variant="secondary">#restructuring</Badge>
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
              <span className="text-lg font-medium text-primary">GrowthCo</span>
              <span className="text-sm text-muted-foreground">SaaS</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Market Expansion Strategy Implementation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enabled rapid market entry into 3 new regions through organizational restructuring and strategic focus.
            </p>
            <div className="flex justify-center flex-wrap gap-2 mt-6">
              <Badge variant="secondary">#market-expansion</Badge>
              <Badge variant="secondary">#strategy</Badge>
              <Badge variant="secondary">#restructuring</Badge>
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
                <p className="text-muted-foreground">SaaS & Cloud Solutions</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Company Size</h4>
                <p className="text-muted-foreground">200+ employees</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Expansion Timeline</h4>
                <p className="text-muted-foreground">8 months</p>
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
                GrowthCo had achieved strong success in their home market but struggled to expand internationally. 
                Their existing organizational structure and processes were optimized for a single market, creating 
                barriers to effective multi-regional operations and customer acquisition.
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
                  <span>Organizational structure not designed for multi-regional operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Lack of localized market knowledge and customer insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Resource allocation challenges across multiple time zones</span>
                </li>
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
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Month 1-2: Market Analysis & Strategy Design</h4>
                  <p className="text-muted-foreground">Deep dive into target markets and designed region-specific go-to-market strategies.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Month 3-4: Organizational Restructuring</h4>
                  <p className="text-muted-foreground">Redesigned team structure and processes to support multi-regional operations.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Month 5-8: Implementation & Scale</h4>
                  <p className="text-muted-foreground">Launched in new markets with embedded support and continuous optimization.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Key Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <div className="text-sm text-muted-foreground">New Markets Entered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">120%</div>
                  <div className="text-sm text-muted-foreground">Revenue Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">8</div>
                  <div className="text-sm text-muted-foreground">Months to Market</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to expand your market reach?</h3>
            <Button 
              size="lg"
              onClick={() => window.location.href = "mailto:hello@blee.com?subject=Let's discuss expansion"}
            >
              Let's talk
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthCoCaseStudy;